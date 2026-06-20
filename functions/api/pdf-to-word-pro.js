// High-fidelity PDF -> Word (editable) via Adobe PDF Services API.
// Unlike the free in-browser converter, this produces real editable text with
// the original layout (positioned text frames + images), matching premium
// converters. Costs AI credits (deducted only on success).
//
// Required Cloudflare env vars:
//   PDF_SERVICES_CLIENT_ID, PDF_SERVICES_CLIENT_SECRET   (Adobe credentials)
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY  (already set)
//
// POST body: the raw PDF bytes (Content-Type: application/pdf)
// Query: ?ref=<idempotency ref>&lang=<ocr lang, e.g. en-US>&name=<filename>
// Auth: Authorization: Bearer <supabase user JWT>

const COST = 5; // credits per document — keep in sync with ai-spend-credit COSTS
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB upload cap
const ADOBE = 'https://pdf-services.adobe.io';
const FUNC_BASE = 'https://tuwhuftbjqkgduukvbfv.functions.supabase.co';

const corsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function supabaseEnv(env) {
  return {
    url: env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anon: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
    service: env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

async function getUser(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return { error: 'Please log in to use high-quality conversion.', status: 401, code: 'login_required' };
  const { url, anon } = supabaseEnv(env);
  const res = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
  if (!res.ok) return { error: 'Your login session expired. Please log in again.', status: 401, code: 'login_required' };
  return { user: await res.json(), token };
}

// Current credit balance via the user's own token (RLS-scoped).
async function creditBalance(token, env) {
  const { url, anon } = supabaseEnv(env);
  try {
    const res = await fetch(`${url}/rest/v1/rpc/ai_credit_balance`, {
      method: 'POST',
      headers: { apikey: anon, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data === 'number' ? data : Number(data) || 0;
  } catch (error) {
    return null;
  }
}

// Deduct credits through the existing ai-spend-credit edge function (idempotent on ref).
async function spendCredit(token, ref, env) {
  const res = await fetch(`${FUNC_BASE}/ai-spend-credit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: supabaseEnv(env).anon,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool: 'pdf-to-word-pro', ref }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok, status: res.status, data };
}

// ---- Adobe PDF Services ----
async function adobeToken(env) {
  const res = await fetch(`${ADOBE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.PDF_SERVICES_CLIENT_ID,
      client_secret: env.PDF_SERVICES_CLIENT_SECRET,
    }).toString(),
  });
  if (!res.ok) throw new Error(`adobe token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).access_token;
}

function adobeHeaders(token, env) {
  return { Authorization: `Bearer ${token}`, 'x-api-key': env.PDF_SERVICES_CLIENT_ID };
}

async function adobeUpload(token, pdfBytes, env) {
  const create = await fetch(`${ADOBE}/assets`, {
    method: 'POST',
    headers: { ...adobeHeaders(token, env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ mediaType: 'application/pdf' }),
  });
  if (!create.ok) throw new Error(`adobe assets ${create.status}: ${(await create.text()).slice(0, 200)}`);
  const { uploadUri, assetID } = await create.json();
  const put = await fetch(uploadUri, { method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: pdfBytes });
  if (!put.ok) throw new Error(`adobe upload ${put.status}`);
  return assetID;
}

async function adobeExport(token, assetID, ocrLang, env) {
  const res = await fetch(`${ADOBE}/operation/exportpdf`, {
    method: 'POST',
    headers: { ...adobeHeaders(token, env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetID, targetFormat: 'docx', ocrLang: ocrLang || 'en-US' }),
  });
  if (res.status !== 201 && !res.ok) throw new Error(`adobe export ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const location = res.headers.get('location');
  if (!location) throw new Error('adobe export: no status location');
  return location;
}

async function adobePoll(token, statusUrl, env) {
  const deadline = Date.now() + 50000; // up to ~50s
  while (Date.now() < deadline) {
    const res = await fetch(statusUrl, { headers: adobeHeaders(token, env) });
    if (!res.ok) throw new Error(`adobe status ${res.status}`);
    const data = await res.json();
    const status = (data.status || '').toLowerCase();
    if (status === 'done') {
      const asset = data.asset || data.resource || (data.assets && data.assets[0]) || {};
      const downloadUri = asset.downloadUri || data.downloadUri;
      if (!downloadUri) throw new Error('adobe done but no downloadUri');
      return downloadUri;
    }
    if (status === 'failed') throw new Error(`adobe job failed: ${JSON.stringify(data).slice(0, 200)}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('adobe job timed out');
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const request = context.request;

  if (!env.PDF_SERVICES_CLIENT_ID || !env.PDF_SERVICES_CLIENT_SECRET) {
    return jsonResponse({ error: 'High-quality conversion is not configured yet.', code: 'not_configured' }, 503);
  }

  const { user, token, error, status, code } = await getUser(request, env);
  if (error) return jsonResponse({ error, code }, status || 401);

  const pdf = await request.arrayBuffer();
  if (!pdf || pdf.byteLength === 0) return jsonResponse({ error: 'No PDF received.' }, 400);
  if (pdf.byteLength > MAX_BYTES) return jsonResponse({ error: 'File is too large (max 25 MB).', code: 'too_large' }, 413);
  // Cheap sanity check that this is really a PDF.
  if (String.fromCharCode(...new Uint8Array(pdf.slice(0, 5))) !== '%PDF-') {
    return jsonResponse({ error: 'That file does not look like a PDF.' }, 400);
  }

  const url = new URL(request.url);
  const lang = (url.searchParams.get('lang') || 'en-US').slice(0, 12);
  const ref = (url.searchParams.get('ref') || `pdf2word:${user.id}:${Date.now()}`).replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 160);

  // Pre-check balance so we never pay Adobe for a user who cannot afford it.
  const balance = await creditBalance(token, env);
  if (balance !== null && balance < COST) {
    return jsonResponse({ error: 'Not enough credits.', code: 'insufficient_credits', cost: COST, balance }, 402);
  }

  // Convert via Adobe.
  let docxBytes;
  try {
    const at = await adobeToken(env);
    const assetID = await adobeUpload(at, pdf, env);
    const statusUrl = await adobeExport(at, assetID, lang, env);
    const downloadUri = await adobePoll(at, statusUrl, env);
    const dl = await fetch(downloadUri);
    if (!dl.ok) throw new Error(`adobe download ${dl.status}`);
    docxBytes = await dl.arrayBuffer();
  } catch (err) {
    return jsonResponse({ error: 'Conversion failed. No credits were charged — please try again.', detail: String(err).slice(0, 300) }, 502);
  }

  // Charge only after a successful conversion.
  const spend = await spendCredit(token, ref, env);
  if (!spend.ok) {
    if (spend.status === 402) {
      return jsonResponse({ error: 'Not enough credits.', code: 'insufficient_credits', cost: COST }, 402);
    }
    // Conversion worked but charging failed — still deliver the file rather than
    // lose the user's work; the idempotent ref prevents a later double charge.
  }

  return new Response(docxBytes, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="converted.docx"',
      'X-Credits-Cost': String(COST),
      'X-Credits-Balance': String(spend.ok ? (spend.data.balance ?? '') : ''),
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
