// GET /blog — server-rendered list of published blog posts.
import { renderListPage } from './_render.js';

function cfg(env) {
  return {
    url: (env && env.SUPABASE_URL) || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anon: (env && (env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY))
      || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

export async function onRequestGet(context) {
  const origin = new URL(context.request.url).origin;
  const { url, anon } = cfg(context.env || {});

  let posts = [];
  try {
    const select = 'slug,title,excerpt,cover_image,lang,published_at,created_at';
    const res = await fetch(
      `${url}/rest/v1/blog_posts?status=eq.published&select=${select}&order=published_at.desc&limit=100`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
    );
    posts = res.ok ? await res.json() : [];
  } catch (error) {
    posts = [];
  }

  return new Response(renderListPage({ posts, origin }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
