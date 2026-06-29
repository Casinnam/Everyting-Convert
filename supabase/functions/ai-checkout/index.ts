// Supabase Edge Function: ai-checkout
// Creates a Stripe Checkout session for either:
//   (a) a single AI job   — body: { job_id, success_url, cancel_url }
//   (b) a credit pack      — body: { pack, success_url, cancel_url } + Bearer JWT
//
// Required secrets:
//   STRIPE_SECRET_KEY
//   SUPABASE_URL  (auto-set)
//   SUPABASE_SERVICE_ROLE_KEY  (auto-set)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

// Summer 2026 promo window (-07:00, matches the Stripe coupon redeem-by).
// Keep this in sync with public.is_summer_promo() in summer-2026-promo.sql.
function isSummerPromo(): boolean {
  const now = Date.now();
  const start = new Date('2026-07-01T00:00:00-07:00').getTime();
  const end = new Date('2026-08-31T23:59:59-07:00').getTime();
  return now >= start && now <= end;
}

// Resolve a referral code → referrer user id via the SECURITY DEFINER RPC.
// Returns null for unknown/blank codes.
async function resolveReferrer(code: string): Promise<string | null> {
  const trimmed = (code || '').trim();
  if (!trimmed) return null;
  const { url, key } = supa();
  try {
    const res = await fetch(`${url}/rest/v1/rpc/referrer_for_code`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: trimmed }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data === 'string' && data ? data : null;
  } catch {
    return null;
  }
}

async function dbGetJob(jobId: string): Promise<Record<string, unknown>> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]) throw new Error('Job not found.');
  return rows[0] as Record<string, unknown>;
}

// Resolve the logged-in user from the Bearer JWT (required for pack purchases
// so the webhook knows whose balance to credit).
async function getUserId(req: Request): Promise<string | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token || !token.startsWith('eyJ')) return null;
  const { url, key } = supa();
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// Pricing per tool (in cents USD)
const PRICES: Record<string, { amount: number; label: string; description: string }> = {
  'transcription': {
    amount: 299,
    label: 'Audio Transcription',
    description: 'Full transcript + SRT subtitles',
  },
  'remove-bg': {
    amount: 199,
    label: 'Background Removal',
    description: 'High-resolution transparent PNG',
  },
};

// Credit packs (amount in cents USD → credits granted)
const PACKS: Record<string, { amount: number; credits: number; label: string }> = {
  starter: { amount: 299, credits: 30, label: 'Starter Pack — 30 AI credits' },
  standard: { amount: 699, credits: 100, label: 'Standard Pack — 100 AI credits' },
  power: { amount: 1499, credits: 250, label: 'Power Pack — 250 AI credits' },
  business: { amount: 2999, credits: 600, label: 'Business Pack — 600 AI credits' },
};

async function createStripeSession(stripeKey: string, params: URLSearchParams) {
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const session = await res.json();
  return { ok: res.ok, session };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) return json({ error: 'Payment service not configured.' }, 500);

  let body: { job_id?: string; pack?: string; success_url?: string; cancel_url?: string; referral_code?: string };
  try { body = await req.json(); }
  catch { return json({ error: 'Invalid JSON body.' }, 400); }

  const { job_id: jobId, pack: packKey, success_url: successUrl, cancel_url: cancelUrl } = body;

  // ── Credit pack purchase ──
  if (packKey) {
    if (!successUrl || !cancelUrl) {
      return json({ error: 'success_url and cancel_url are required.' }, 400);
    }
    const pack = PACKS[packKey];
    if (!pack) return json({ error: 'Unknown credit pack.' }, 400);

    const userId = await getUserId(req);
    if (!userId) return json({ error: 'Please log in to buy credits.' }, 401);

    // ② Summer promo: same price, double the credits granted.
    const promo = isSummerPromo();
    const grantedCredits = promo ? pack.credits * 2 : pack.credits;
    const packLabel = promo ? `${pack.label} (Summer 2× bonus)` : pack.label;

    // ④ Referral (B): if the buyer arrived with a referral code (and we're in
    // the promo window), record the referrer so the webhook can reward them on
    // this purchase. Self-referrals are ignored.
    let referrerId: string | null = null;
    if (promo && body.referral_code) {
      const resolved = await resolveReferrer(String(body.referral_code));
      if (resolved && resolved !== userId) referrerId = resolved;
    }

    const successWithParams = new URL(successUrl);
    successWithParams.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
    successWithParams.searchParams.set('credits', String(grantedCredits));

    const params = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': String(pack.amount),
      'line_items[0][price_data][product_data][name]': packLabel,
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'success_url': successWithParams.toString(),
      'cancel_url': cancelUrl,
      'metadata[kind]': 'credit_pack',
      'metadata[pack]': packKey,
      'metadata[credits]': String(grantedCredits),
      'metadata[user_id]': userId,
    });
    if (referrerId) {
      params.set('metadata[referrer_id]', referrerId);
      params.set('metadata[buyer_id]', userId);
    }

    const { ok, session } = await createStripeSession(stripeKey, params);
    if (!ok || !session.url) {
      return json({ error: `Failed to create checkout session: ${session.error?.message ?? 'unknown'}` }, 502);
    }
    return json({ checkout_url: session.url, session_id: session.id });
  }

  // ── Single AI job purchase ──
  if (!jobId || !successUrl || !cancelUrl) {
    return json({ error: 'job_id, success_url, and cancel_url are required.' }, 400);
  }

  let job: Record<string, unknown>;
  try { job = await dbGetJob(jobId); }
  catch { return json({ error: 'Job not found.' }, 404); }

  if (job.status === 'complete' || job.status === 'paid') {
    return json({ error: 'This job has already been paid.' }, 409);
  }
  if (job.status !== 'preview_ready') {
    return json({ error: 'Job is not ready for payment.' }, 409);
  }

  const tool = job.tool as string;
  const pricing = PRICES[tool];
  if (!pricing) return json({ error: 'Unknown tool type.' }, 400);

  // Build success URL with session_id and job_id for redirect-back verification
  const successWithParams = new URL(successUrl);
  successWithParams.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
  successWithParams.searchParams.set('job_id', jobId);

  // Create Stripe Checkout session (one-time payment)
  const params = new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(pricing.amount),
    'line_items[0][price_data][product_data][name]': pricing.label,
    'line_items[0][price_data][product_data][description]': pricing.description,
    'line_items[0][quantity]': '1',
    'mode': 'payment',
    'success_url': successWithParams.toString(),
    'cancel_url': cancelUrl,
    'metadata[job_id]': jobId,
    'metadata[tool]': tool,
  });

  const { ok, session } = await createStripeSession(stripeKey, params);
  if (!ok || !session.url) {
    return json({ error: `Failed to create checkout session: ${session.error?.message ?? 'unknown'}` }, 502);
  }

  return json({ checkout_url: session.url, session_id: session.id });
});
