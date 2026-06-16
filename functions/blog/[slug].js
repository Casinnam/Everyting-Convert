// GET /blog/:slug — legacy single-language URL. Redirect to the language-prefixed
// URL (/blog/:lang/:slug) so old links and the original posts keep working.
import { notFoundPage } from './_render.js';

const LANGS = ['en', 'ko', 'de', 'es', 'fr'];

function cfg(env) {
  return {
    url: (env && env.SUPABASE_URL) || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anon: (env && (env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY))
      || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

export async function onRequestGet(context) {
  const origin = new URL(context.request.url).origin;
  let slug = String(context.params.slug || '');
  try { slug = decodeURIComponent(slug); } catch (error) { /* keep raw */ }

  // /blog/<lang> (a bare language code) → the blog index.
  if (LANGS.includes(slug.toLowerCase())) {
    return Response.redirect(`${origin}/blog`, 302);
  }

  const { url, anon } = cfg(context.env || {});
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=lang,slug&order=published_at.desc&limit=1`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
    );
    const rows = res.ok ? await res.json() : [];
    const post = rows && rows[0];
    if (post) {
      return Response.redirect(`${origin}/blog/${post.lang}/${encodeURIComponent(post.slug)}`, 301);
    }
  } catch (error) { /* fall through to 404 */ }

  return new Response(notFoundPage(origin), {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate' },
  });
}
