// POST /api/track-conversion  { tool_id }
// Fire-and-forget analytics: records one successful conversion (all tools,
// guests included) into tool_usage_daily/tool_usage_visitors via the
// record_tool_usage RPC. Never blocks or errors the client — always 200.

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

function ok(payload = { ok: true }) {
  return new Response(JSON.stringify(payload), { status: 200, headers: jsonHeaders });
}

function clientIp(request) {
  const cfIp = request.headers.get('CF-Connecting-IP');
  const forwarded = request.headers.get('X-Forwarded-For');
  const realIp = request.headers.get('X-Real-IP');
  return String(cfIp || forwarded || realIp || 'unknown').split(',')[0].trim();
}

async function ipHash(request, env) {
  const salt = env.USAGE_IDENTITY_SALT || 'everything-convert-v00';
  const data = new TextEncoder().encode(`${salt}:${clientIp(request)}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

function authToken(request) {
  const h = request.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7).trim() : '';
}

function supa(env) {
  return {
    url: env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

async function resolveActor(request, env) {
  // Returns { accountType, identity }. Logged-out -> guest + ip hash.
  const token = authToken(request);
  if (token && token.startsWith('eyJ')) {
    const { url, anonKey } = supa(env);
    try {
      const res = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const user = await res.json();
        if (user && user.id) {
          let accountType = 'free';
          const { serviceKey } = supa(env);
          if (serviceKey) {
            try {
              const pr = await fetch(`${url}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=plan,role&limit=1`, {
                headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
              });
              if (pr.ok) {
                const rows = await pr.json();
                const p = rows && rows[0];
                if (p) accountType = p.role === 'admin' ? 'admin' : (p.plan === 'pro' ? 'pro' : 'free');
              }
            } catch (e) { /* default free */ }
          }
          return { accountType, identity: `user-${user.id}` };
        }
      }
    } catch (e) { /* fall through to guest */ }
  }
  return { accountType: 'guest', identity: `ip-${await ipHash(request, env)}` };
}

export async function onRequestPost(context) {
  const env = context.env || {};
  try {
    let body = {};
    try { body = await context.request.json(); } catch (e) { body = {}; }
    const toolId = String(body.tool_id || body.toolId || '').slice(0, 64) || 'unknown';

    const { serviceKey, url } = supa(env);
    if (!serviceKey) return ok({ ok: false }); // not configured; stay silent

    const { accountType, identity } = await resolveActor(context.request, env);
    const day = new Date().toISOString().slice(0, 10);

    await fetch(`${url}/rest/v1/rpc/record_tool_usage`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_tool_id: toolId, p_account_type: accountType, p_identity: identity, p_day: day }),
    });
    return ok();
  } catch (error) {
    // Analytics must never disrupt the user — swallow everything.
    return ok({ ok: false });
  }
}

export async function onRequest() {
  return ok({ ok: false });
}
