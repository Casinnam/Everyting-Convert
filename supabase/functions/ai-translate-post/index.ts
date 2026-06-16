// Supabase Edge Function: ai-translate-post
// Admin-only. Translates a blog post (title, excerpt, body markdown) from a
// source language into the other site languages using gpt-4o-mini. Called once
// at authoring time; the results are stored, so there is no per-view cost.
//
// POST { source_lang, title, excerpt, body, targets?: string[] } + admin JWT
// -> { translations: { en: {title,excerpt,body}, de: {...}, ... } }
//
// Required secret: OPENAI_API_KEY (already configured)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LANGS = ['en', 'ko', 'de', 'es', 'fr'];
const LANG_NAME: Record<string, string> = {
  en: 'English', ko: 'Korean', de: 'German', es: 'Spanish', fr: 'French',
};
const MODEL = Deno.env.get('OPENAI_TRANSLATE_MODEL') || 'gpt-4o-mini';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function supa() {
  return { url: Deno.env.get('SUPABASE_URL') ?? '', key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' };
}

// Verify the caller is a signed-in admin (defense in depth beyond the UI gate).
async function requireAdmin(req: Request): Promise<boolean> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token || !token.startsWith('eyJ')) return false;
  const { url, key } = supa();
  try {
    const userRes = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
    if (!userRes.ok) return false;
    const user = await userRes.json();
    if (!user?.id) return false;
    const profRes = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=role&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = await profRes.json();
    return Array.isArray(rows) && rows[0]?.role === 'admin';
  } catch {
    return false;
  }
}

async function translateOne(srcName: string, tgtName: string, payload: { title: string; excerpt: string; body: string }): Promise<{ title: string; excerpt: string; body: string }> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('not_configured');

  const sys = 'You are a professional translator for a software/file-conversion blog. Output valid JSON only.';
  const instruction = `Translate the following blog post from ${srcName} into ${tgtName}. `
    + 'Preserve the Markdown structure EXACTLY (headings #, lists, links, images, code blocks, tables). '
    + 'Do NOT translate code, URLs, file extensions, or the brand name "EverythingConvert". '
    + 'Use a natural, fluent tone a native speaker would write. '
    + 'Return ONLY JSON with this exact shape: {"title": "...", "excerpt": "...", "body": "..."}.\n\n'
    + `TITLE:\n${payload.title}\n\nEXCERPT:\n${payload.excerpt}\n\nBODY (Markdown):\n${payload.body}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: instruction },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('[ai-translate-post] OpenAI error', data?.error?.message);
    throw new Error('ai_failed');
  }
  const content = data?.choices?.[0]?.message?.content;
  try {
    const parsed = JSON.parse(content);
    return {
      title: String(parsed.title ?? ''),
      excerpt: String(parsed.excerpt ?? ''),
      body: String(parsed.body ?? ''),
    };
  } catch {
    throw new Error('parse_failed');
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  if (!Deno.env.get('OPENAI_API_KEY')) return json({ error: 'Translation service is not configured.' }, 500);
  if (!(await requireAdmin(req))) return json({ error: 'Admin access required.' }, 403);

  let body: { source_lang?: string; title?: string; excerpt?: string; body?: string; targets?: string[] };
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body.' }, 400); }

  const source = LANGS.includes(String(body.source_lang)) ? String(body.source_lang) : 'en';
  const src = { title: String(body.title || ''), excerpt: String(body.excerpt || ''), body: String(body.body || '') };
  if (!src.title && !src.body) return json({ error: 'Nothing to translate.' }, 400);

  const targets = (Array.isArray(body.targets) && body.targets.length
    ? body.targets
    : LANGS).filter((l) => LANGS.includes(l) && l !== source);

  const translations: Record<string, { title: string; excerpt: string; body: string }> = {};
  const errors: Record<string, string> = {};

  for (const tgt of targets) {
    try {
      translations[tgt] = await translateOne(LANG_NAME[source], LANG_NAME[tgt], src);
    } catch (error) {
      errors[tgt] = (error as Error).message || 'failed';
    }
  }

  return json({ source_lang: source, translations, errors });
});
