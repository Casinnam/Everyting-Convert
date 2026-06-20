// Read-only: returns the logged-in user's subscription renewal/expiry date so the
// account page can show it without sending the user to the Stripe portal.
// Resolves the Stripe customer by account email; does not touch the DB or webhook.
const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const corsHeaders = {
  ...jsonHeaders,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders });
}

async function getSupabaseUser(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return { error: 'Please log in.', status: 401 };

  const supabaseUrl = env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf';

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { error: 'Your login session expired.', status: 401 };
  return { user: await response.json() };
}

async function findCustomerId(email, env) {
  if (!email) return null;
  const res = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data && Array.isArray(data.data) && data.data[0] ? data.data[0].id : null;
}

const LIVE_STATES = new Set(['active', 'trialing', 'past_due', 'unpaid']);

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

async function handle(context) {
  const env = context.env || {};
  const request = context.request;
  if (!env.STRIPE_SECRET_KEY) return jsonResponse({ active: false });

  const { user, error, status } = await getSupabaseUser(request, env);
  if (error) return jsonResponse({ error }, status || 401);

  const customerId = await findCustomerId(user && user.email ? user.email : null, env);
  if (!customerId) return jsonResponse({ active: false });

  const res = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=10`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return jsonResponse({ active: false });

  const data = await res.json();
  const subs = Array.isArray(data.data) ? data.data : [];
  const sub = subs.find((s) => LIVE_STATES.has(s.status)) || null;
  if (!sub) return jsonResponse({ active: false });

  const price = sub.items && sub.items.data && sub.items.data[0] ? sub.items.data[0].price : null;
  return jsonResponse({
    active: true,
    status: sub.status,
    current_period_end: sub.current_period_end || null,
    cancel_at_period_end: !!sub.cancel_at_period_end,
    amount: price ? price.unit_amount : null,
    currency: price ? price.currency : null,
    interval: price && price.recurring ? price.recurring.interval : null,
  });
}

export async function onRequestGet(context) {
  return handle(context);
}

export async function onRequestPost(context) {
  return handle(context);
}
