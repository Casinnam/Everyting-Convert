// Supabase Edge Function: ai-transcribe
// Accepts an audio/video file, calls OpenAI Whisper, returns a preview
// (first 60 s) free; full transcript + SRT behind payment.
//
// Required secrets (supabase secrets set KEY=value):
//   OPENAI_API_KEY
//   SUPABASE_URL  (auto-set by Supabase)
//   SUPABASE_SERVICE_ROLE_KEY  (auto-set by Supabase)

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
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  return { url, key };
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
  await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': type, 'Cache-Control': '3600', 'x-upsert': 'true',
    },
    body: data,
  });
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

function toSRT(segments: Array<{ start: number; end: number; text: string }>): string {
  function pad(n: number) { return String(n).padStart(2, '0'); }
  function ts(s: number) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60), ms = Math.round((s % 1) * 1000);
    return `${pad(h)}:${pad(m)}:${pad(sec)},${String(ms).padStart(3, '0')}`;
  }
  return segments.map((seg, i) =>
    `${i + 1}\n${ts(seg.start)} --> ${ts(seg.end)}\n${seg.text.trim()}\n`
  ).join('\n');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return json({ error: 'Transcription service not configured.' }, 500);

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

    // Accept 'paid' (set by webhook) OR verify Stripe session directly
    if (job.status !== 'paid' && job.status !== 'complete') {
      if (!sessionId) return json({ error: 'Payment required.' }, 402);

      // Verify via Stripe API
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

    // Return signed URLs for full transcript and SRT
    const [txtUrl, srtUrl] = await Promise.all([
      storageSignedUrl('ai-results', `${jobId}/full.txt`, 3600),
      storageSignedUrl('ai-results', `${jobId}/subtitles.srt`, 3600),
    ]);
    await dbUpdateJob(jobId, { status: 'complete' });

    return json({ txt_url: txtUrl, srt_url: srtUrl });
  }

  // ── PREVIEW MODE: transcribe, store full result, return first 60 s ──
  const file = form.get('file') as File | null;
  if (!file) return json({ error: 'No file provided.' }, 400);

  // File size guard (OpenAI Whisper max: 25 MB)
  if (file.size > 26_214_400) {
    return json({ error: 'File too large. Maximum size is 25 MB.' }, 413);
  }

  // Call OpenAI Whisper with verbose_json for timestamps
  const whisperForm = new FormData();
  whisperForm.append('file', file);
  whisperForm.append('model', 'whisper-1');
  whisperForm.append('response_format', 'verbose_json');
  whisperForm.append('timestamp_granularities[]', 'segment');

  const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openAIKey}` },
    body: whisperForm,
  });

  if (!whisperRes.ok) {
    const err = await whisperRes.text();
    return json({ error: `Transcription failed: ${err}` }, 502);
  }

  const result = await whisperRes.json() as {
    text: string;
    duration?: number;
    segments?: Array<{ start: number; end: number; text: string }>;
  };

  const segments = result.segments ?? [];
  const totalDuration = result.duration ?? 0;
  const PREVIEW_SECS = 60;
  const previewSegments = segments.filter(s => s.start < PREVIEW_SECS);
  const previewText = previewSegments.map(s => s.text).join(' ').trim();
  const needsPayment = totalDuration > PREVIEW_SECS;

  // Store full transcript and SRT in private storage
  const enc = new TextEncoder();
  const newJobId = await dbInsertJob('transcription', {
    preview_text: previewText,
    total_duration: totalDuration,
    segment_count: segments.length,
  });

  await storageUpload('ai-results', `${newJobId}/full.txt`, enc.encode(result.text), 'text/plain');
  await storageUpload('ai-results', `${newJobId}/subtitles.srt`, enc.encode(toSRT(segments)), 'text/plain');

  // If short file (≤ 60 s): free download — return signed URLs immediately
  if (!needsPayment) {
    const [txtUrl, srtUrl] = await Promise.all([
      storageSignedUrl('ai-results', `${newJobId}/full.txt`, 3600),
      storageSignedUrl('ai-results', `${newJobId}/subtitles.srt`, 3600),
    ]);
    await dbUpdateJob(newJobId, { status: 'complete' });
    return json({
      job_id: newJobId,
      preview_text: previewText,
      total_duration: totalDuration,
      needs_payment: false,
      txt_url: txtUrl,
      srt_url: srtUrl,
    });
  }

  return json({
    job_id: newJobId,
    preview_text: previewText,
    total_duration: totalDuration,
    needs_payment: true,
  });
});
