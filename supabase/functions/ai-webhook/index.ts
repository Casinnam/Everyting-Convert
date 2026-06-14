// Supabase Edge Function: ai-webhook
// Handles Stripe webhook events.
// On checkout.session.completed → marks the ai_jobs row as 'paid'.
//
// Required secrets:
//   STRIPE_WEBHOOK_SECRET
//   SUPABASE_URL  (auto-set)
//   SUPABASE_SERVICE_ROLE_KEY  (auto-set)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function supa() {
  return {
    url: Deno.env.get('SUPABASE_URL') ?? '',
    key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  };
}

async function dbUpdateJobBySession(sessionId: string, jobId: string): Promise<void> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}`, {
    method: 'PATCH',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status: 'paid', stripe_session_id: sessionId }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`dbUpdateJobBySession failed: ${text}`);
  }
}

// Credit a user's balance for a purchased pack. Idempotent on the Stripe
// session id (grant_ai_credits uses ON CONFLICT (ref) DO NOTHING), so webhook
// retries never double-grant.
async function grantCreditPack(userId: string, credits: number, sessionId: string): Promise<void> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/rpc/grant_ai_credits`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_user_id: userId,
      p_amount: credits,
      p_kind: 'pack',
      p_ref: `pack:${sessionId}`,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`grantCreditPack failed: ${text}`);
  }
}

// Stripe webhook signature verification (HMAC-SHA256)
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split('=');
    acc[k.trim()] = v?.trim() ?? '';
    return acc;
  }, {});

  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;

  // Reject events older than 5 minutes (replay protection)
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (age > 300) return false;

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const signedData = enc.encode(`${timestamp}.${payload}`);
  const mac = await crypto.subtle.sign('HMAC', keyMaterial, signedData);
  const computed = Array.from(new Uint8Array(mac))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // Constant-time comparison
  if (computed.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!webhookSecret) return json({ error: 'Webhook not configured.' }, 500);

  const sigHeader = req.headers.get('stripe-signature') ?? '';
  const payload = await req.text();

  const valid = await verifyStripeSignature(payload, sigHeader, webhookSecret);
  if (!valid) return json({ error: 'Invalid signature.' }, 400);

  let event: { type: string; data: { object: Record<string, unknown> } };
  try { event = JSON.parse(payload); }
  catch { return json({ error: 'Invalid JSON.' }, 400); }

  try {
    // Only handle completed checkout sessions
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const paymentStatus = session.payment_status as string;
      const sessionId = session.id as string;
      const metadata = session.metadata as Record<string, string> | null;

      if (paymentStatus === 'paid' && sessionId) {
        if (metadata?.kind === 'credit_pack') {
          const userId = metadata.user_id;
          const credits = parseInt(metadata.credits ?? '0', 10);
          if (!userId || credits <= 0) {
            throw new Error('Credit pack session is missing user_id or credits metadata.');
          }
          await grantCreditPack(userId, credits, sessionId);
        } else if (metadata?.job_id) {
          await dbUpdateJobBySession(sessionId, metadata.job_id);
        }
      }
    }
  } catch (error) {
    console.error('[ai-webhook] delivery failed', error);
    return json({ error: 'Webhook processing failed. Stripe should retry.' }, 500);
  }

  return json({ received: true });
});
