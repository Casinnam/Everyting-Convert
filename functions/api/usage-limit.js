const GUEST_LIMIT = 10;
const FREE_ACCOUNT_LIMIT = 20;

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

function authToken(request) {
  const authHeader = request.headers.get('Authorization') || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
}

function supabaseConfig(env) {
  return {
    url: env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

async function getSupabaseUser(request, env) {
  const token = authToken(request);
  if (!token) return null;

  const { url, anonKey } = supabaseConfig(env);
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

async function getProfile(env, user) {
  const { url, serviceKey } = supabaseConfig(env);
  if (!serviceKey || !user) return null;

  const response = await fetch(
    `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,email,plan,role&limit=1`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );

  if (!response.ok) return null;
  const rows = await response.json();
  return rows && rows[0] ? rows[0] : null;
}

async function usageContext(request, env) {
  const user = await getSupabaseUser(request, env);
  if (user) {
    const profile = await getProfile(env, user);
    if (profile && (profile.plan === 'pro' || profile.role === 'admin')) {
      return {
        accountType: profile.role === 'admin' ? 'admin' : 'pro',
        identity: `user-${user.id}`,
        userId: user.id,
        limit: null,
        unlimited: true,
      };
    }

    return {
      accountType: 'free',
      identity: `user-${user.id}`,
      userId: user.id,
      limit: Number(env.FREE_AUTH_CONVERSION_LIMIT) || FREE_ACCOUNT_LIMIT,
      unlimited: false,
    };
  }

  return {
    accountType: 'guest',
    identity: await usageIdentity(request, env),
    userId: null,
    limit: Number(env.FREE_GUEST_CONVERSION_LIMIT) || Number(env.FREE_CONVERSION_LIMIT) || GUEST_LIMIT,
    unlimited: false,
  };
}

async function readUsage(env, identity) {
  const { url, serviceKey } = supabaseConfig(env);
  if (!serviceKey) throw new Error('Usage database is not configured.');

  const response = await fetch(
    `${url}/rest/v1/usage_counters?identity=eq.${encodeURIComponent(identity)}&select=identity,count`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
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
  const { url, serviceKey } = supabaseConfig(env);
  if (!serviceKey) throw new Error('Usage database is not configured.');

  const response = await fetch(`${url}/rest/v1/rpc/record_usage_conversion`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
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

  try {
    const usage = await usageContext(context.request, env);
    if (usage.unlimited) {
      return jsonResponse({
        identity: usage.identity,
        accountType: usage.accountType,
        limit: null,
        count: 0,
        remaining: null,
        canConvert: true,
        unlimited: true,
      });
    }

    const count = await readUsage(env, usage.identity);
    return jsonResponse({
      identity: usage.identity,
      accountType: usage.accountType,
      limit: usage.limit,
      count,
      remaining: Math.max(0, usage.limit - count),
      canConvert: count < usage.limit,
      unlimited: false,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function onRequestPost(context) {
  const env = context.env || {};

  try {
    const contextUsage = await usageContext(context.request, env);
    if (contextUsage.unlimited) {
      return jsonResponse({
        identity: contextUsage.identity,
        accountType: contextUsage.accountType,
        limit: null,
        count: 0,
        remaining: null,
        canConvert: true,
        unlimited: true,
      });
    }

    const usage = await recordUsage(env, contextUsage.identity, contextUsage.limit);
    return jsonResponse({
      identity: contextUsage.identity,
      accountType: contextUsage.accountType,
      limit: contextUsage.limit,
      count: usage.count,
      remaining: usage.remaining,
      canConvert: usage.allowed,
      unlimited: false,
    }, usage.allowed ? 200 : 429);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
