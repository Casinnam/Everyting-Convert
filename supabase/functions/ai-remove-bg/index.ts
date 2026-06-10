// Supabase Edge Function: ai-remove-bg
// Calls idphoto.ai background removal endpoint.
// Free preview: low-res JPEG (500px wide, watermarked via Canvas on client side
//   — actually server just stores full res and returns a low-res signed URL).
// Full result: original-resolution transparent PNG, behind payment.
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

// Get low-res (preview) signed URL via Supabase image transform
async function storagePreviewUrl(bucket: string, path: string): Promise<string> {
  const { url, key } = supa();
  // Supabase Storage image transform: resize to 400px width for preview
  const res = await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: 3600, transform: { width: 400, quality: 60 } }),
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const idphotoKey = Deno.env.get('IDPHOTO_API_KEY');
  const idphotoSecret = Deno.env.get('IDPHOTO_API_SECRET');
  if (!idphotoKey || !idphotoSecret) return json({ error: 'Background removal service not configured.' }, 500);

  let form: FormData;
  try { form = await req.formData(); }
  catch { return json({ error: 'Invalid multipart form data.' }, 400); }

  const mode = String(form.get('mode') ?? 'preview');
  const jobId = String(form.get('job_id') ?? '');

  // ── FULL MODE: verify payment, return HD signed URL ──
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

    const hdUrl = await storageSignedUrl('ai-results', `${jobId}/result.png`, 3600);
    await dbUpdateJob(jobId, { status: 'complete' });

    return json({ hd_url: hdUrl });
  }

  // ── PREVIEW MODE: call idphoto.ai, store result, return low-res signed URL ──
  const file = form.get('file') as File | null;
  if (!file) return json({ error: 'No file provided.' }, 400);

  if (file.size > 10_485_760) {
    return json({ error: 'File too large. Maximum size is 10 MB.' }, 413);
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    return json({ error: 'Unsupported file type. Use JPEG, PNG, or WebP.' }, 400);
  }

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const imageBase64 = `data:${file.type};base64,${toBase64(fileBytes)}`;

  const apiRes = await fetch('https://api-us.idphotoapp.com/v2/removeBackground', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: idphotoKey,
      apiSecret: idphotoSecret,
      imageBase64,
      outputFormat: 'PNG',
    }),
  });

  if (!apiRes.ok) {
    const err = await apiRes.text();
    return json({ error: `Background removal failed: ${err}` }, 502);
  }

  const apiData = await apiRes.json() as { output?: string };
  if (!apiData.output) {
    return json({ error: 'Unexpected response from background removal service.' }, 502);
  }

  const b64 = apiData.output.replace(/^data:image\/\w+;base64,/, '');
  const resultBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

  const newJobId = await dbInsertJob('remove-bg', {
    original_name: file.name,
    original_size: file.size,
    original_type: file.type,
  });

  await storageUpload('ai-results', `${newJobId}/result.png`, resultBytes, 'image/png');

  const previewUrl = await storagePreviewUrl('ai-results', `${newJobId}/result.png`);

  return json({
    job_id: newJobId,
    preview_url: previewUrl,
    needs_payment: true,
  });
});
