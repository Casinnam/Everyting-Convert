const requiredKeys = [
  'STRIPE_SECRET_KEY',
  'STRIPE_PRO_MONTHLY_PRICE_ID',
  'STRIPE_WEBHOOK_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SITE_URL',
];

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const status = requiredKeys.reduce((result, key) => {
    result[key] = hasValue(env[key]);
    return result;
  }, {});

  return new Response(JSON.stringify({
    ok: true,
    status,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequest() {
  return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
