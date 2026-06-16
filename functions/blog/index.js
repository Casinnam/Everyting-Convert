// GET /blog — list of published posts, one card per post in the visitor's
// language (falling back to any available translation). Cards link to the
// language-prefixed post URL.
import { renderListPage } from './_render.js';

const LANGS = ['en', 'ko', 'de', 'es', 'fr'];

function cfg(env) {
  return {
    url: (env && env.SUPABASE_URL) || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anon: (env && (env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY))
      || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

function pickLang(request) {
  const urlObj = new URL(request.url);
  const q = (urlObj.searchParams.get('lang') || '').toLowerCase();
  if (LANGS.includes(q)) return q;
  const header = request.headers.get('accept-language') || '';
  const first = header.split(',')[0].trim().slice(0, 2).toLowerCase();
  return LANGS.includes(first) ? first : 'en';
}

export async function onRequestGet(context) {
  const origin = new URL(context.request.url).origin;
  const lang = pickLang(context.request);
  const { url, anon } = cfg(context.env || {});

  let posts = [];
  try {
    const select = 'slug,title,excerpt,cover_image,lang,group_id,published_at,created_at';
    const res = await fetch(
      `${url}/rest/v1/blog_posts?status=eq.published&select=${select}&order=published_at.desc&limit=300`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
    );
    const rows = res.ok ? await res.json() : [];

    // One entry per group, preferring the visitor's language, then English,
    // then whatever exists. Preserve recency order (rows are already sorted).
    const byGroup = new Map();
    rows.forEach((row) => {
      const key = row.group_id || row.slug;
      const existing = byGroup.get(key);
      if (!existing) { byGroup.set(key, row); return; }
      const score = (r) => (r.lang === lang ? 2 : r.lang === 'en' ? 1 : 0);
      if (score(row) > score(existing)) byGroup.set(key, row);
    });
    posts = Array.from(byGroup.values());
  } catch (error) {
    posts = [];
  }

  return new Response(renderListPage({ posts, origin, lang }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
