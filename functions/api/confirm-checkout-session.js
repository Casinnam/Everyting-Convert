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
    return { error: 'Please log in to confirm your payment.', status: 401 };
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

async function getStripeSession(env, sessionId) {
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error && payload.error.message ? payload.error.message : 'Stripe session could not be confirmed.');
  }

  return payload;
}

async function updateSupabasePlan(env, user, plan) {
  const supabaseUrl = env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co';
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      email: user.email || null,
      plan,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Supabase profile update failed.');
  }
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

  const body = await readJson(context.request);
  const sessionId = String(body.session_id || '').trim();
  if (!sessionId) {
    return jsonResponse({ error: 'Missing checkout session.' }, 400);
  }

  const { user, error, status } = await getSupabaseUser(context.request, env);
  if (error) {
    return jsonResponse({ error }, status);
  }

  try {
    const session = await getStripeSession(env, sessionId);
    const sessionUserId = session.client_reference_id || (session.metadata && session.metadata.user_id) || '';
    const paid = session.payment_status === 'paid' || session.status === 'complete' || Boolean(session.subscription);

    if (sessionUserId !== user.id) {
      return jsonResponse({ error: 'This checkout session does not belong to the signed-in account.' }, 403);
    }

    if (!paid) {
      return jsonResponse({ pending: true, message: 'Stripe has not marked this checkout as paid yet.' }, 202);
    }

    await updateSupabasePlan(env, user, 'pro');
    return jsonResponse({ plan: 'pro', confirmed: true });
  } catch (confirmError) {
    return jsonResponse({ error: confirmError.message || 'Payment could not be confirmed yet.' }, 500);
  }
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
