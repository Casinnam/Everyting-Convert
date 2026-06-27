// Supabase Edge Function: ai-redeem-credit
// Pays for a previewed AI job with the logged-in user's credit balance
// instead of a one-time Stripe payment. On success it marks the job 'paid'
// (the same status the Stripe webhook would set), so the tool's existing
// "full mode" download flow returns the result with no further checks.
//
// POST body (JSON): { job_id: string }   + Bearer JWT
//
// Credit cost per tool:
//   remove-bg      → 15 credits (flat)
//   transcription  → 1 credit per started minute, minimum 5
//
// Required secrets:
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY  (auto-set)

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

async function dbGetJob(jobId: string): Promise<Record<string, unknown> | null> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]) return null;
  return rows[0] as Record<string, unknown>;
}

async function dbMarkPaid(jobId: string, userId: string): Promise<void> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/ai_jobs?id=eq.${jobId}`, {
    method: 'PATCH',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status: 'paid', user_id: userId }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`dbMarkPaid failed: ${text}`);
  }
}

async function spendCredits(userId: string, cost: number, tool: string, ref: string): Promise<{ balance: number; allowed: boolean }> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/rpc/record_ai_credit_spend`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user_id: userId, p_cost: cost, p_tool: tool, p_ref: ref }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error(`record_ai_credit_spend failed: ${JSON.stringify(rows)}`);
  const row = Array.isArray(rows) ? rows[0] : rows;
  return { balance: Number(row?.balance ?? 0), allowed: Boolean(row?.allowed) };
}

// Credit cost for a job, derived server-side from its tool and preview data.
function creditCost(job: Record<string, unknown>): number {
  const tool = job.tool as string;
  if (tool === 'remove-bg') return 15;
  if (tool === 'transcription') {
    const preview = (job.preview_data ?? {}) as Record<string, unknown>;
    const seconds = Number(preview.total_duration ?? 0);
    const minutes = Math.ceil(seconds / 60);
    return Math.max(5, minutes);
  }
  if (tool === 'smart-ocr') {
    const preview = (job.preview_data ?? {}) as Record<string, unknown>;
    const pages = Math.min(30, Math.max(1, Number(preview.pages ?? 1)));
    return pages * 2; // 2 credits per page
  }
  return 0; // unknown / non-credit tool
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const userId = await getUserId(req);
    if (!userId) return json({ error: 'Please log in to use credits.' }, 401);

    let body: { job_id?: string };
    try { body = await req.json(); }
    catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const jobId = body.job_id;
    if (!jobId) return json({ error: 'job_id is required.' }, 400);

    const job = await dbGetJob(jobId);
    if (!job) return json({ error: 'Job not found.' }, 404);

    // Already unlocked (paid via credits or Stripe earlier): don't charge again.
    if (job.status === 'paid' || job.status === 'complete') {
      return json({ ok: true, already_unlocked: true });
    }
    if (job.status !== 'preview_ready') {
      return json({ error: 'This job is not ready for payment.' }, 409);
    }

    const cost = creditCost(job);
    if (cost <= 0) return json({ error: 'This tool cannot be paid with credits.' }, 400);

    let result: { balance: number; allowed: boolean };
    try {
      result = await spendCredits(userId, cost, job.tool as string, `job:${jobId}`);
    } catch (error) {
      console.error('[ai-redeem-credit] spend failed', error);
      return json({ error: 'Credit service is temporarily unavailable. Please try again.' }, 503);
    }

    if (!result.allowed) {
      return json({ error: 'Not enough credits.', code: 'insufficient_credits', cost, balance: result.balance }, 402);
    }

    try {
      await dbMarkPaid(jobId, userId);
    } catch (error) {
      console.error('[ai-redeem-credit] mark paid failed', error);
      return json({ error: 'Credit was reserved, but unlock failed. Please try again; you will not be charged twice.' }, 503);
    }

    return json({ ok: true, cost, balance: result.balance });
  } catch (error) {
    console.error('[ai-redeem-credit]', error);
    return json({ error: 'Internal server error.' }, 500);
  }
});
