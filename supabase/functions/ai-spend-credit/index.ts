// Supabase Edge Function: ai-spend-credit
// Direct credit spend for browser-only premium tools that do not create an
// ai_jobs row, such as premium QR exports.
//
// POST body: { tool: 'qr-premium', ref?: string } + Bearer JWT

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const COSTS: Record<string, number> = {
  'qr-premium': 5,
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const userId = await getUserId(req);
    if (!userId) return json({ error: 'Please log in to use credits.', code: 'login_required' }, 401);

    let body: { tool?: string; ref?: string };
    try { body = await req.json(); }
    catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const tool = String(body.tool || '');
    const cost = COSTS[tool];
    if (!cost) return json({ error: 'This tool cannot be paid with credits.' }, 400);

    const rawRef = String(body.ref || '').replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 160);
    const ref = rawRef || `${tool}:${userId}:${crypto.randomUUID()}`;
    const result = await spendCredits(userId, cost, tool, ref);

    if (!result.allowed) {
      return json({ error: 'Not enough credits.', code: 'insufficient_credits', cost, balance: result.balance }, 402);
    }

    return json({ ok: true, cost, balance: result.balance, ref });
  } catch (error) {
    console.error('[ai-spend-credit]', error);
    return json({ error: 'Credit service is temporarily unavailable. Please try again.' }, 503);
  }
});
