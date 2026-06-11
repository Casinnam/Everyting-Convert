// Supabase Edge Function: ai-pdf-summary
// Receives extracted PDF text and returns a compact outline summary.
//
// Daily free limits (enforced server-side via record_ai_usage RPC):
//   guest (no login):   3 summaries/day per hashed IP
//   free account:      10 summaries/day per user
//   pro / admin:       unlimited
//
// Required secrets:
//   OPENAI_API_KEY
//   USAGE_IDENTITY_SALT   (same salt used by functions/api/usage-limit.js)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY  (auto-set)
//
// Required DB setup: supabase/ai-usage-setup.sql

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LIMITS = { guest: 3, free: 10 };
const TOOL = 'pdf-summary';

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

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  return fwd.split(',')[0].trim() || req.headers.get('cf-connecting-ip') || 'unknown';
}

// Resolve the caller from the Authorization bearer token.
// Guests send the publishable anon key (not a user JWT), which fails the
// /auth/v1/user lookup and falls through to null.
async function getUser(req: Request): Promise<{ id: string; plan: string; role: string } | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token || !token.startsWith('eyJ')) return null;

  const { url, key } = supa();
  if (!url || !key) return null;

  try {
    const userRes = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return null;
    const user = await userRes.json();
    if (!user?.id) return null;

    const profileRes = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=plan,role`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = profileRes.ok ? await profileRes.json() : [];
    return {
      id: user.id as string,
      plan: rows?.[0]?.plan ?? 'free',
      role: rows?.[0]?.role ?? 'user',
    };
  } catch {
    return null;
  }
}

async function recordUsage(identity: string, limit: number): Promise<{ remaining: number; allowed: boolean }> {
  const { url, key } = supa();
  const res = await fetch(`${url}/rest/v1/rpc/record_ai_usage`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usage_identity: identity, usage_tool: TOOL, usage_limit: limit }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error(`record_ai_usage failed: ${JSON.stringify(rows)}`);
  const row = Array.isArray(rows) ? rows[0] : rows;
  return { remaining: Number(row?.remaining ?? 0), allowed: Boolean(row?.allowed) };
}

function languageName(code: string): string {
  const clean = String(code || 'en').toLowerCase();
  if (clean.startsWith('ko')) return 'Korean';
  if (clean.startsWith('de')) return 'German';
  if (clean.startsWith('es')) return 'Spanish';
  if (clean.startsWith('fr')) return 'French';
  return 'English';
}

function fallbackSummary(text: string, fileName: string): Record<string, unknown> {
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 5);
  return {
    title: `${fileName || 'PDF'} summary`,
    brief: sentences.slice(0, 2).join(' ') || 'The PDF text was extracted, but a complete AI summary could not be created.',
    key_points: sentences.slice(0, 4),
    important_details: ['Verify names, dates, amounts, and account numbers in the original PDF.'],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) return json({ error: 'PDF summary service is not configured.' }, 500);

    let body: { text?: string; file_name?: string; language?: string };
    try { body = await req.json(); }
    catch { return json({ error: 'Invalid JSON body.' }, 400); }

    const fileName = String(body.file_name || 'PDF document').slice(0, 160);
    const text = String(body.text || '').replace(/\s+/g, ' ').trim().slice(0, 16000);
    const outputLanguage = languageName(String(body.language || 'en'));

    if (text.length < 80) {
      return json({ error: 'Not enough readable text was found in this PDF. OCR may be required.' }, 400);
    }

    // ── Usage limit ──
    const user = await getUser(req);
    const isUnlimited = !!user && (user.plan === 'pro' || user.role === 'admin');
    let usage: { remaining: number; limit: number } | null = null;

    if (!isUnlimited) {
      const identity = user
        ? `user:${user.id}`
        : `ip:${await sha256Hex(`${Deno.env.get('USAGE_IDENTITY_SALT') ?? 'ec-ai-usage'}|${clientIp(req)}`)}`;
      const limit = user ? LIMITS.free : LIMITS.guest;

      let result: { remaining: number; allowed: boolean };
      try {
        result = await recordUsage(identity, limit);
      } catch (error) {
        // Fail closed: without the counter we cannot protect the API budget.
        console.error('[ai-pdf-summary] usage check failed', error);
        return json({ error: 'Usage service is temporarily unavailable. Please try again shortly.' }, 503);
      }

      if (!result.allowed) {
        return json({
          error: 'Daily free limit reached.',
          code: 'limit_reached',
          remaining: 0,
          limit,
          logged_in: !!user,
        }, 429);
      }
      usage = { remaining: result.remaining, limit };
    }

    const model = Deno.env.get('OPENAI_SUMMARY_MODEL') || 'gpt-4o-mini';
    const prompt = `
You are summarizing a PDF for an online file utility.
Return ONLY valid JSON, with no markdown.
The response language must be ${outputLanguage}.

JSON shape:
{
  "title": "short user-friendly title",
  "brief": "3-5 sentence summary",
  "key_points": ["5-8 bullet points"],
  "important_details": ["dates, amounts, account numbers, names, addresses, deadlines, or other concrete details"]
}

Rules:
- Do not invent missing facts.
- If a value is unclear, say it is unclear.
- Keep each bullet concise.
- Tell the user to verify sensitive legal, financial, medical, or tax details in the original document when appropriate.

File name: ${fileName}
Extracted text:
${text}
`;

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You produce careful, concise PDF summaries as valid JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      console.error('[ai-pdf-summary] OpenAI error', aiData);
      return json({ error: 'AI summary failed. Please try again later.' }, 502);
    }

    const content = aiData?.choices?.[0]?.message?.content;
    if (!content) return json({ summary: fallbackSummary(text, fileName), usage, warning: 'Fallback summary used.' });

    try {
      return json({ summary: JSON.parse(content), usage });
    } catch {
      return json({ summary: fallbackSummary(text, fileName), usage, warning: 'Fallback summary used.' });
    }
  } catch (error) {
    console.error('[ai-pdf-summary]', error);
    return json({ error: 'Internal server error.' }, 500);
  }
});
