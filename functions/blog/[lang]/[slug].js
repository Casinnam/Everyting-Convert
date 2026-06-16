// GET /blog/:lang/:slug — server-rendered post in a specific language.
import { renderPostPage, notFoundPage } from '../_render.js';

const LANGS = ['en', 'ko', 'de', 'es', 'fr'];

function cfg(env) {
  return {
    url: (env && env.SUPABASE_URL) || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anon: (env && (env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY))
      || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'public, max-age=0, must-revalidate',
};

export async function onRequestGet(context) {
  const origin = new URL(context.request.url).origin;
  const lang = String(context.params.lang || '').toLowerCase();
  // Cloudflare passes the raw (percent-encoded) segment; decode before re-encoding.
  let slug = String(context.params.slug || '');
  try { slug = decodeURIComponent(slug); } catch (error) { /* keep raw */ }
  const { url, anon } = cfg(context.env || {});
  const headers = { apikey: anon, Authorization: `Bearer ${anon}` };

  if (!LANGS.includes(lang)) {
    return new Response(notFoundPage(origin), { status: 404, headers: HTML_HEADERS });
  }

  try {
    const select = 'slug,title,excerpt,body,cover_image,lang,group_id,published_at,created_at,updated_at';
    const res = await fetch(
      `${url}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&lang=eq.${lang}&status=eq.published&select=${select}&limit=1`,
      { headers },
    );
    const rows = res.ok ? await res.json() : [];
    const post = rows && rows[0];
    if (!post) {
      return new Response(notFoundPage(origin), { status: 404, headers: HTML_HEADERS });
    }

    // Sibling translations (same group) for hreflang + the language switcher.
    let alternates = [{ lang: post.lang, slug: post.slug }];
    if (post.group_id) {
      try {
        const altRes = await fetch(
          `${url}/rest/v1/blog_posts?group_id=eq.${post.group_id}&status=eq.published&select=lang,slug`,
          { headers },
        );
        if (altRes.ok) {
          const altRows = await altRes.json();
          if (Array.isArray(altRows) && altRows.length) alternates = altRows;
        }
      } catch (error) { /* fall back to self only */ }
    }

    return new Response(renderPostPage({ post, origin, alternates }), { headers: HTML_HEADERS });
  } catch (error) {
    return new Response(notFoundPage(origin), { status: 500, headers: HTML_HEADERS });
  }
}
