// Supabase Edge Function: ai-remove-bg
// Calls the remove.bg background removal API.
// One paid API call per job: we process at full resolution once, store the
// full-res transparent PNG privately, and return a downscaled (400px) preview
// signed URL. The full-res result is only handed out after payment.
//
// Required secrets:
//   REMOVEBG_API_KEY
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

type RemoveBgResult =
  | { ok: true; data: Uint8Array }
  | { ok: false; status: number; detail: string };

// Calls remove.bg once at full resolution. Returns the transparent PNG bytes.
async function removeBg(bytes: Uint8Array, filename: string, type: string): Promise<RemoveBgResult> {
  const apiKey = Deno.env.get('REMOVEBG_API_KEY') ?? '';
  const fd = new FormData();
  fd.append('image_file', new Blob([bytes], { type }), filename || 'image');
  fd.append('size', 'auto');     // full resolution (1 credit / 1 of the 50 free monthly calls)
  fd.append('format', 'png');    // transparent PNG
  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: fd,
  });
  if (!res.ok) {
    const t = await res.text();
    let detail = t;
    try {
      const j = JSON.parse(t) as { errors?: Array<{ title?: string; code?: string }> };
      detail = j.errors?.map(e => e.title ?? e.code).filter(Boolean).join(', ') || t;
    } catch { /* not JSON */ }
    return { ok: false, status: res.status, detail: detail.slice(0, 300) };
  }
  return { ok: true, data: new Uint8Array(await res.arrayBuffer()) };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try { return await handleRequest(req); }
  catch (e) { console.error('[ai-remove-bg]', e); return json({ error: 'Internal server error.' }, 500); }
});

async function handleRequest(req: Request): Promise<Response> {

  if (!Deno.env.get('REMOVEBG_API_KEY')) return json({ error: 'Background removal service not configured.' }, 500);

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

  // ── PREVIEW MODE: call remove.bg, store full result, return low-res signed URL ──
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

  const result = await removeBg(fileBytes, file.name, file.type);

  if (!result.ok) {
    console.error('[ai-remove-bg] remove.bg error:', result.status, result.detail);
    // 402 = our account is out of credits, 403 = bad API key — both are our problem.
    if (result.status === 402 || result.status === 403) {
      return json({ error: 'Background removal service is temporarily unavailable. Please try again later.' }, 503);
    }
    if (result.status === 429) {
      return json({ error: 'Service is busy right now. Please try again in a moment.' }, 503);
    }
    // 400 = couldn't process the image (no clear subject / unsupported).
    return json({ error: 'Could not remove the background. Use a photo with a clear subject (person, product, animal, or car).' }, 422);
  }

  const resultBytes = result.data;

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
}
