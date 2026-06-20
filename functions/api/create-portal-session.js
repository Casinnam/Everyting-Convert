// Creates a Stripe Billing Customer Portal session so a logged-in subscriber can
// cancel, change payment method, download invoices, and see their renewal date —
// all hosted by Stripe. We never handle the cancellation/refund logic ourselves.
//
// NOTE: the Customer Portal must be enabled once in the Stripe Dashboard
// (Settings -> Billing -> Customer portal). Until then Stripe returns an error.
const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const corsHeaders = {
  ...jsonHeaders,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders });
}

async function getSupabaseUser(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return { error: 'Please log in to manage your subscription.', status: 401 };

  const supabaseUrl = env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf';

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { error: 'Your login session expired. Please log in again.', status: 401 };
  return { user: await response.json() };
}

function siteOrigin(request, env) {
  const configured = env.SITE_URL || env.PUBLIC_SITE_URL || 'https://www.everythingconvert.com';
  try {
    return new URL(configured).origin;
  } catch (error) {
    try {
      return new URL(request.url).origin;
    } catch (innerError) {
      return 'https://www.everythingconvert.com';
    }
  }
}

// Resolve the Stripe customer for this account by email. Storing the customer id
// on the profile would be cleaner, but lookup-by-email works for every existing
// subscriber without a migration.
async function findCustomerId(email, env) {
  if (!email) return null;
  const res = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data && Array.isArray(data.data) && data.data[0] ? data.data[0].id : null;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const request = context.request;

  if (!env.STRIPE_SECRET_KEY) {
    return jsonResponse({ error: 'Billing is not configured yet.' }, 500);
  }

  const { user, error, status } = await getSupabaseUser(request, env);
  if (error) return jsonResponse({ error }, status || 401);

  const email = user && user.email ? user.email : null;
  const customerId = await findCustomerId(email, env);
  if (!customerId) {
    return jsonResponse({
      error: 'We could not find a subscription linked to your account. If you just subscribed, wait a minute and try again, or contact support.',
    }, 404);
  }

  const params = new URLSearchParams();
  params.set('customer', customerId);
  params.set('return_url', `${siteOrigin(request, env)}/index.html`);

  const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const detail = await res.text();
    return jsonResponse({
      error: 'Could not open the billing portal. Please try again shortly or contact support.',
      detail: detail.slice(0, 300),
    }, 502);
  }

  const data = await res.json();
  return jsonResponse({ url: data.url });
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
