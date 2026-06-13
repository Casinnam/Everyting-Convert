// Supabase Edge Function: ai-checkout
// Creates a Stripe Checkout session for a single AI job.
// The job must already exist (created during preview) and be in 'preview_ready' status.
//
// POST body (JSON):
//   { job_id: string, success_url: string, cancel_url: string }
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

async function dbGetJob(jobId: string): Promise<Record<string, unknown>> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]) throw new Error('Job not found.');
  return rows[0] as Record<string, unknown>;
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) return json({ error: 'Payment service not configured.' }, 500);

  let body: { job_id?: string; success_url?: string; cancel_url?: string };
  try { body = await req.json(); }
  catch { return json({ error: 'Invalid JSON body.' }, 400); }

  const { job_id: jobId, success_url: successUrl, cancel_url: cancelUrl } = body;

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

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok || !session.url) {
    return json({ error: `Failed to create checkout session: ${session.error?.message ?? 'unknown'}` }, 502);
  }

  return json({ checkout_url: session.url, session_id: session.id });
});
