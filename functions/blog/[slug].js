// GET /blog/:slug — server-rendered single blog post (published only).
import { renderPostPage, notFoundPage } from './_render.js';

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
  const slug = String(context.params.slug || '');
  const { url, anon } = cfg(context.env || {});

  try {
    const select = 'slug,title,excerpt,body,cover_image,lang,published_at,created_at,updated_at';
    const res = await fetch(
      `${url}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=${select}&limit=1`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
    );
    const rows = res.ok ? await res.json() : [];
    if (!rows || !rows[0]) {
      return new Response(notFoundPage(origin), { status: 404, headers: HTML_HEADERS });
    }
    return new Response(renderPostPage({ post: rows[0], origin }), { headers: HTML_HEADERS });
  } catch (error) {
    return new Response(notFoundPage(origin), { status: 500, headers: HTML_HEADERS });
  }
}
