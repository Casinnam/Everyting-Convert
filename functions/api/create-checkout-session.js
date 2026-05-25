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

function siteOrigin(request, env) {
  const configured = env.SITE_URL || env.PUBLIC_SITE_URL || 'https://www.everythingconvert.com';
  try {
    return new URL(configured).origin;
  } catch (error) {
    return new URL(request.url).origin;
  }
}

async function getSupabaseUser(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return { error: 'Please log in before choosing Pro.', status: 401 };
  }

  const supabaseUrl = env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf';

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { error: 'Your login session expired. Please log in again.', status: 401 };
  }

  return { user: await response.json() };
}

async function createStripeCheckoutSession({ env, request, user }) {
  const priceId = env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_1TaqXWAOoOvoyo5BqKt0fQ19';
  const origin = siteOrigin(request, env);
  const successUrl = `${origin}/auth.html?stripe=success`;
  const cancelUrl = `${origin}/pricing.html?stripe=cancel`;
  const body = new URLSearchParams();

  body.set('mode', 'subscription');
  body.set('line_items[0][price]', priceId);
  body.set('line_items[0][quantity]', '1');
  body.set('success_url', successUrl);
  body.set('cancel_url', cancelUrl);
  body.set('client_reference_id', user.id);
  body.set('customer_email', user.email || '');
  body.set('allow_promotion_codes', 'true');
  body.set('metadata[user_id]', user.id);
  body.set('metadata[email]', user.email || '');
  body.set('subscription_data[metadata][user_id]', user.id);
  body.set('subscription_data[metadata][email]', user.email || '');

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const payload = await response.json();
  if (!response.ok) {
    return {
      error: payload.error && payload.error.message ? payload.error.message : 'Stripe checkout could not be created.',
      status: 502,
    };
  }

  return { url: payload.url };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestPost(context) {
  const env = context.env || {};

  if (!env.STRIPE_SECRET_KEY) {
    return jsonResponse({ error: 'Stripe is not configured yet.' }, 500);
  }

  const { user, error, status } = await getSupabaseUser(context.request, env);
  if (error) {
    return jsonResponse({ error }, status);
  }

  const checkout = await createStripeCheckoutSession({ env, request: context.request, user });
  if (checkout.error) {
    return jsonResponse({ error: checkout.error }, checkout.status || 500);
  }

  return jsonResponse({ url: checkout.url });
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
