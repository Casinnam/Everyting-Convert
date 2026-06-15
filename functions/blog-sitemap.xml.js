// GET /blog-sitemap.xml — sitemap of published blog posts (referenced in robots.txt).
function cfg(env) {
  return {
    url: (env && env.SUPABASE_URL) || 'https://tuwhuftbjqkgduukvbfv.supabase.co',
    anon: (env && (env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY))
      || 'sb_publishable_Y6tx3YNPVh56QruGfVkEnw_gfissksf',
  };
}

function xmlEscape(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  }[c]));
}

export async function onRequestGet(context) {
  const origin = new URL(context.request.url).origin;
  const { url, anon } = cfg(context.env || {});

  let posts = [];
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?status=eq.published&select=slug,updated_at,published_at&order=published_at.desc&limit=1000`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
    );
    posts = res.ok ? await res.json() : [];
  } catch (error) {
    posts = [];
  }

  const entries = posts.map((p) => {
    const lastmod = String(p.updated_at || p.published_at || '').slice(0, 10);
    return `  <url><loc>${xmlEscape(`${origin}/blog/${encodeURIComponent(p.slug)}`)}</loc>`
      + (lastmod ? `<lastmod>${lastmod}</lastmod>` : '')
      + '<changefreq>monthly</changefreq></url>';
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${xmlEscape(`${origin}/blog`)}</loc><changefreq>weekly</changefreq></url>
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
