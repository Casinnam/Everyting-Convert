const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const corsHeaders = {
  ...jsonHeaders,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const HISTORY_SELECT = [
  'id',
  'tool_id',
  'tool_name',
  'source_filename',
  'output_filename',
  'source_size',
  'output_size',
  'status',
  'error_message',
  'metadata',
  'created_at',
  'completed_at',
].join(',');

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders,
  });
}

function supabaseConfig(env) {
  return {
    url: env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anonKey: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return {};
  }
}

async function getSupabaseUser(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return { error: 'Please log in to use conversion history.', status: 401 };
  }

  const { url, anonKey } = supabaseConfig(env);
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { error: 'Your login session expired. Please log in again.', status: 401 };
  }

  return { user: await response.json() };
}

async function supabaseRest(env, path, options = {}) {
  const { url, serviceKey } = supabaseConfig(env);
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const detail = payload && (payload.message || payload.error) ? payload.message || payload.error : text;
    throw new Error(detail || 'Supabase request failed.');
  }
  return payload;
}

async function getProfile(env, user) {
  const idRows = await supabaseRest(
    env,
    `profiles?id=eq.${encodeURIComponent(user.id)}&select=id,email,plan,role&limit=1`,
  );

  if (idRows && idRows[0]) return idRows[0];

  const email = String(user.email || '').trim();
  if (!email) return null;

  const emailRows = await supabaseRest(
    env,
    `profiles?email=eq.${encodeURIComponent(email)}&select=id,email,plan,role&limit=1`,
  );
  return emailRows && emailRows[0] ? emailRows[0] : null;
}

function canUseHistory(profile) {
  return Boolean(profile && (profile.plan === 'pro' || profile.role === 'admin'));
}

function cleanText(value, fallback = '', maxLength = 255) {
  const text = String(value || '').trim();
  return (text || fallback).slice(0, maxLength);
}

function cleanSize(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number);
}

function cleanMetadata(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value;
}

function cleanStatus(value) {
  return ['started', 'completed', 'failed'].includes(value) ? value : 'completed';
}

function cleanCompletedAt(value, status) {
  if (status === 'started') return null;
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function buildRow(user, body) {
  const status = cleanStatus(body.status);
  const toolId = cleanText(body.tool_id || body.toolId, '', 80);
  const toolName = cleanText(body.tool_name || body.toolName, toolId || 'Conversion');

  if (!toolId) {
    return { error: 'Missing tool_id.', status: 400 };
  }

  return {
    row: {
      user_id: user.id,
      user_email: user.email || null,
      tool_id: toolId,
      tool_name: toolName,
      source_filename: cleanText(body.source_filename || body.sourceFilename, '', 255) || null,
      output_filename: cleanText(body.output_filename || body.outputFilename, '', 255) || null,
      source_size: cleanSize(body.source_size || body.sourceSize),
      output_size: cleanSize(body.output_size || body.outputSize),
      status,
      error_message: cleanText(body.error_message || body.errorMessage, '', 500) || null,
      metadata: cleanMetadata(body.metadata),
      completed_at: cleanCompletedAt(body.completed_at || body.completedAt, status),
    },
  };
}

async function requireHistoryAccess(request, env) {
  const { user, error, status } = await getSupabaseUser(request, env);
  if (error) return { error, status };

  const profile = await getProfile(env, user);
  if (!canUseHistory(profile)) {
    return {
      error: 'Conversion history is available to Pro members only.',
      status: 403,
    };
  }

  return { user, profile };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function onRequestGet(context) {
  try {
    const access = await requireHistoryAccess(context.request, context.env || {});
    if (access.error) return jsonResponse({ error: access.error }, access.status);

    const rows = await supabaseRest(
      context.env || {},
      `conversion_history?user_id=eq.${encodeURIComponent(access.user.id)}&select=${HISTORY_SELECT}&order=created_at.desc&limit=50`,
    );

    return jsonResponse({ history: rows || [] });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Could not load conversion history.' }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const access = await requireHistoryAccess(context.request, context.env || {});
    if (access.error) return jsonResponse({ error: access.error }, access.status);

    const body = await readJson(context.request);
    const { row, error, status } = buildRow(access.user, body);
    if (error) return jsonResponse({ error }, status);

    const rows = await supabaseRest(context.env || {}, 'conversion_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });

    return jsonResponse({ history: rows && rows[0] ? rows[0] : null }, 201);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Could not save conversion history.' }, 500);
  }
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
