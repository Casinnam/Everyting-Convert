const DEFAULT_LIMIT = 10;

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders,
  });
}

function clientIp(request) {
  const cfIp = request.headers.get('CF-Connecting-IP');
  const forwarded = request.headers.get('X-Forwarded-For');
  const realIp = request.headers.get('X-Real-IP');
  return String(cfIp || forwarded || realIp || 'unknown').split(',')[0].trim();
}

async function usageIdentity(request, env) {
  const salt = env.USAGE_IDENTITY_SALT || 'everything-convert-v00';
  const value = `${salt}:${clientIp(request)}`;
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
  return `ip-${hash}`;
}

function supabaseConfig(env) {
  return {
    url: env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    key: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

async function readUsage(env, identity) {
  const { url, key } = supabaseConfig(env);
  if (!key) throw new Error('Usage database is not configured.');

  const response = await fetch(
    `${url}/rest/v1/usage_counters?identity=eq.${encodeURIComponent(identity)}&select=identity,count`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(await response.text() || 'Could not read usage.');
  }

  const rows = await response.json();
  return rows && rows[0] ? Number(rows[0].count) || 0 : 0;
}

async function recordUsage(env, identity, limit) {
  const { url, key } = supabaseConfig(env);
  if (!key) throw new Error('Usage database is not configured.');

  const response = await fetch(`${url}/rest/v1/rpc/record_usage_conversion`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usage_identity: identity,
      usage_limit: limit,
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && (payload.message || payload.error)
      ? payload.message || payload.error
      : 'Could not record usage.';
    throw new Error(message);
  }

  return payload;
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const limit = Number(env.FREE_CONVERSION_LIMIT) || DEFAULT_LIMIT;
  const identity = await usageIdentity(context.request, env);

  try {
    const count = await readUsage(env, identity);
    return jsonResponse({
      identity,
      limit,
      count,
      remaining: Math.max(0, limit - count),
      canConvert: count < limit,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const limit = Number(env.FREE_CONVERSION_LIMIT) || DEFAULT_LIMIT;
  const identity = await usageIdentity(context.request, env);

  try {
    const usage = await recordUsage(env, identity, limit);
    return jsonResponse({
      identity,
      limit,
      count: usage.count,
      remaining: usage.remaining,
      canConvert: usage.allowed,
    }, usage.allowed ? 200 : 429);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
