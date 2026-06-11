// Supabase Edge Function: ai-id-photo
// Calls idphoto.ai ID/passport photo endpoint.
// NO face retouching/beautification — background, crop, resize only.
//
// Required secrets:
//   IDPHOTO_API_KEY
//   STRIPE_SECRET_KEY
//   SUPABASE_URL  (auto-set)
//   SUPABASE_SERVICE_ROLE_KEY  (auto-set)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function supa() {
  return {
    url: Deno.env.get('SUPABASE_URL') ?? '',
    key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  };
}

async function dbInsertJob(tool: string, previewData: Record<string, unknown>): Promise<string> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
    },
    body: JSON.stringify({ tool, status: 'preview_ready', preview_data: previewData }),
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]?.id) throw new Error('Failed to create job record.');
  return rows[0].id as string;
}

async function dbGetJob(jobId: string): Promise<Record<string, unknown>> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]) throw new Error('Job not found.');
  return rows[0] as Record<string, unknown>;
}

async function dbUpdateJob(jobId: string, patch: Record<string, unknown>): Promise<void> {
  const { url, key } = supa();
  await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}`, {
    method: 'PATCH',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });
}

async function storageUpload(bucket: string, path: string, data: Uint8Array, type: string): Promise<void> {
  const { url, key } = supa();
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': type, 'Cache-Control': '3600', 'x-upsert': 'true',
    },
    body: data,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Storage upload failed: ${err}`);
  }
}

async function storageSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
  const { url, key } = supa();
  const res = await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Storage sign failed: ${JSON.stringify(data)}`);
  const signed = data.signedURL ?? data.signedUrl;
  if (!signed) throw new Error(`No signed URL in response: ${JSON.stringify(data)}`);
  if (signed.startsWith('http')) return signed;
  return `${url}/storage/v1${signed}`;
}

async function storagePreviewUrl(bucket: string, path: string): Promise<string> {
  const { url, key } = supa();
  const res = await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: 3600, transform: { width: 300, quality: 55 } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Storage sign failed: ${JSON.stringify(data)}`);
  const signed = data.signedURL ?? data.signedUrl;
  if (!signed) throw new Error(`No signed URL in response: ${JSON.stringify(data)}`);
  if (signed.startsWith('http')) return signed;
  return `${url}/storage/v1${signed}`;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// specCode values verified via /v2/listIdPhotoSpecCode (2026-06-09)
const PHOTO_SPECS: Record<string, { label: string; preset: string }> = {
  'kr-passport': { label: '한국 여권 / 증명사진 35×45mm', preset: 'southkorea-passport' },
  'kr-visa':     { label: '한국 비자',                    preset: 'southkorea-visa' },
  'us-visa':     { label: '미국 비자 51×51mm',            preset: 'us-visa' },
  'cn-visa':     { label: '중국 비자 33×48mm',            preset: 'china-visa' },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try { return await handleRequest(req); }
  catch (e) { console.error('[ai-id-photo]', e); return json({ error: 'Internal server error.' }, 500); }
});

async function handleRequest(req: Request): Promise<Response> {
  const idphotoKey = Deno.env.get('IDPHOTO_API_KEY');
  const idphotoSecret = Deno.env.get('IDPHOTO_API_SECRET');
  if (!idphotoKey || !idphotoSecret) return json({ error: 'ID photo service not configured.' }, 500);

  let form: FormData;
  try { form = await req.formData(); }
  catch { return json({ error: 'Invalid multipart form data.' }, 400); }

  const mode = String(form.get('mode') ?? 'preview');
  const jobId = String(form.get('job_id') ?? '');

  // ── FULL MODE: verify payment, return signed download URLs ──
  if (mode === 'full') {
    if (!jobId) return json({ error: 'job_id required for full mode.' }, 400);
    const sessionId = String(form.get('session_id') ?? '');

    let job: Record<string, unknown>;
    try { job = await dbGetJob(jobId); }
    catch { return json({ error: 'Job not found.' }, 404); }

    if (job.status !== 'paid' && job.status !== 'complete') {
      if (!sessionId) return json({ error: 'Payment required.' }, 402);

      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      if (!stripeKey) return json({ error: 'Payment verification unavailable.' }, 500);

      const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${stripeKey}` },
      });
      const session = await stripeRes.json();

      if (!stripeRes.ok || session.payment_status !== 'paid') {
        return json({ error: 'Payment not confirmed.' }, 402);
      }
      if (session.metadata?.job_id !== jobId) {
        return json({ error: 'Session does not match this job.' }, 403);
      }

      await dbUpdateJob(jobId, { status: 'paid', stripe_session_id: sessionId });
    }

    const previewData = job.preview_data as Record<string, unknown>;
    const photoUuid = previewData?.photo_uuid as string | undefined;
    if (!photoUuid) return json({ error: 'Photo UUID not found. Please re-upload.' }, 400);

    const hdRes = await fetch('https://api-us.idphotoapp.com/v2/getIdPhotoNoWatermark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: idphotoKey,
        apiSecret: idphotoSecret,
        photoUuid,
        outputFormat: 'IMAGE_BASE64',
      }),
    });

    if (!hdRes.ok) {
      const err = await hdRes.text();
      return json({ error: `HD photo retrieval failed: ${err}` }, 502);
    }

    const hdData = await hdRes.json() as Record<string, unknown>;
    // Field names use capital-P (idPhotoImageBase64); keep fallbacks for safety.
    const hdB64 = (hdData.idPhotoImageBase64 ?? hdData.idPhotoPngImageBase64 ??
      hdData.idphotoImageBase64) as string | undefined;
    const hdUrl = (hdData.idPhotoUrl ?? hdData.idPhotoPngUrl) as string | undefined;
    let photoBytes: Uint8Array;

    if (hdB64) {
      const b64 = hdB64.replace(/^data:image\/\w+;base64,/, '');
      photoBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    } else if (hdUrl) {
      photoBytes = new Uint8Array(await (await fetch(hdUrl)).arrayBuffer());
    } else {
      return json({ error: 'Unexpected response from ID photo service.' }, 502);
    }

    await storageUpload('ai-results', `${jobId}/photo.jpg`, photoBytes, 'image/jpeg');
    const photoUrl = await storageSignedUrl('ai-results', `${jobId}/photo.jpg`, 3600);
    await dbUpdateJob(jobId, { status: 'complete' });

    return json({ photo_url: photoUrl });
  }

  // ── PREVIEW MODE ──
  const file = form.get('file') as File | null;
  if (!file) return json({ error: 'No file provided.' }, 400);

  if (file.size > 10_485_760) {
    return json({ error: 'File too large. Maximum size is 10 MB.' }, 413);
  }

  const specKey = String(form.get('spec') ?? 'kr-passport');
  const spec = PHOTO_SPECS[specKey] ?? PHOTO_SPECS['kr-passport'];
  const bgColor = String(form.get('bg_color') ?? 'white');

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const imageBase64 = `data:${file.type};base64,${toBase64(fileBytes)}`;

  const apiRes = await fetch('https://api-us.idphotoapp.com/v2/makeIdPhotoWatermark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: idphotoKey,
      apiSecret: idphotoSecret,
      imageBase64,
      specCode: spec.preset,
      outputFormat: 'IMAGE_BASE64',
    }),
  });

  if (!apiRes.ok) {
    const errText = await apiRes.text();
    let errJson: Record<string, unknown> = {};
    try { errJson = JSON.parse(errText); } catch { /* ignore */ }
    const code = String(errJson.issueCode ?? errJson.code ?? '');
    if (code.includes('no_face') || code.includes('face_not_found')) {
      return json({ error: 'No face detected. Please use a clear portrait photo.' }, 422);
    }
    if (code.includes('multiple_faces')) {
      return json({ error: 'Multiple faces detected. Please upload a photo with a single person.' }, 422);
    }
    return json({ error: `ID photo processing failed: ${errText}` }, 502);
  }

  const apiData = await apiRes.json() as Record<string, unknown>;
  const photoUuid = apiData.photoUuid as string | undefined;

  // The API returns HTTP 200 even when the photo can't be processed; the reason
  // is in the `issues` array. Map known issue codes to friendly messages.
  const issues = (apiData.issues as string[] | undefined) ?? [];
  const issueStr = issues.join(',');
  if (issueStr.includes('FACE_NOT_FOUND')) {
    return json({ error: 'No face detected. Please upload a clear, front-facing portrait photo.' }, 422);
  }
  if (issueStr.includes('MULTIPLE_FACE') || issueStr.includes('MULTI_FACE')) {
    return json({ error: 'Multiple faces detected. Please upload a photo with a single person.' }, 422);
  }
  if (issueStr.includes('FACE_OCCLUSION') || issueStr.includes('FACE_ANGLE') || issueStr.includes('EYE')) {
    return json({ error: 'Face not clearly visible. Use a front-facing photo with eyes open and face unobstructed.' }, 422);
  }
  if (issues.length > 0) {
    return json({ error: `Photo does not meet ID requirements (${issueStr}). Please try a different photo.` }, 422);
  }

  if (!photoUuid) {
    return json({ error: 'Unexpected response from ID photo service.' }, 502);
  }

  // Watermarked preview image. With outputFormat IMAGE_BASE64 the data is in
  // idPhotoImageBase64; fall back to URL variants if a future response uses them.
  const b64field = (apiData.idPhotoImageBase64 ?? apiData.idPhotoPngImageBase64 ??
    apiData.idphotoImageBase64) as string | undefined;
  const urlField = (apiData.idPhotoUrl ?? apiData.idPhotoPngUrl) as string | undefined;

  let previewBytes: Uint8Array;
  if (b64field) {
    const b64 = b64field.replace(/^data:image\/\w+;base64,/, '');
    previewBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  } else if (urlField) {
    previewBytes = new Uint8Array(await (await fetch(urlField)).arrayBuffer());
  } else {
    return json({ error: 'No image data in response from ID photo service.' }, 502);
  }

  const newJobId = await dbInsertJob('id-photo', {
    spec: specKey,
    spec_label: spec.label,
    bg_color: bgColor,
    original_name: file.name,
    photo_uuid: apiData.photoUuid,
  });

  await storageUpload('ai-results', `${newJobId}/photo.jpg`, previewBytes, 'image/jpeg');

  const previewUrl = await storagePreviewUrl('ai-results', `${newJobId}/photo.jpg`);

  return json({
    job_id: newJobId,
    preview_url: previewUrl,
    spec_label: spec.label,
    needs_payment: true,
  });
}
