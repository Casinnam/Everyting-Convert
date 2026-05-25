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

function hexToBytes(hex) {
  const clean = String(hex || '').trim();
  const bytes = new Uint8Array(clean.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(clean.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

function parseStripeSignature(header) {
  return String(header || '').split(',').reduce((parts, item) => {
    const [key, value] = item.split('=');
    if (!key || !value) return parts;
    if (key === 't') parts.timestamp = value;
    if (key === 'v1') parts.signatures.push(value);
    return parts;
  }, { timestamp: '', signatures: [] });
}

async function verifyStripeSignature(rawBody, signatureHeader, secret) {
  const parsed = parseStripeSignature(signatureHeader);
  if (!parsed.timestamp || !parsed.signatures.length) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signedPayload = `${parsed.timestamp}.${rawBody}`;
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
  const expected = new Uint8Array(digest);

  return parsed.signatures.some((signature) => timingSafeEqual(expected, hexToBytes(signature)));
}

async function updateSupabasePlan(env, userId, plan) {
  if (!userId) return false;

  const supabaseUrl = env.SUPABASE_URL || 'https://tuwhuftbjqkgduukvbfv.supabase.co';
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      plan,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Supabase profile update failed.');
  }

  return true;
}

function userIdFromSession(session) {
  return (
    session.client_reference_id ||
    (session.metadata && session.metadata.user_id) ||
    (session.subscription_details && session.subscription_details.metadata && session.subscription_details.metadata.user_id) ||
    ''
  );
}

export async function onRequestPost(context) {
  const env = context.env || {};
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return jsonResponse({ error: 'Stripe webhook is not configured.' }, 500);
  }

  const rawBody = await context.request.text();
  const signature = context.request.headers.get('Stripe-Signature') || '';
  const verified = await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);

  if (!verified) {
    return jsonResponse({ error: 'Invalid Stripe signature.' }, 400);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (error) {
    return jsonResponse({ error: 'Invalid Stripe event.' }, 400);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data && event.data.object ? event.data.object : {};
      await updateSupabasePlan(env, userIdFromSession(session), 'pro');
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data && event.data.object ? event.data.object : {};
      const userId = subscription.metadata && subscription.metadata.user_id;
      await updateSupabasePlan(env, userId, 'free');
    }
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ received: true });
}

export async function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405);
}
