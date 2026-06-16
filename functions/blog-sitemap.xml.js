// GET /blog-sitemap.xml — sitemap of published blog posts with hreflang
// alternates (one <url> per language per post group).
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

function postUrl(origin, lang, slug) {
  return `${origin}/blog/${lang}/${encodeURIComponent(slug)}`;
}

export async function onRequestGet(context) {
  const origin = new URL(context.request.url).origin;
  const { url, anon } = cfg(context.env || {});

  let rows = [];
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?status=eq.published&select=slug,lang,group_id,updated_at,published_at&order=published_at.desc&limit=2000`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
    );
    rows = res.ok ? await res.json() : [];
  } catch (error) {
    rows = [];
  }

  // Group siblings so each <url> can list its hreflang alternates.
  const groups = new Map();
  rows.forEach((r) => {
    const key = r.group_id || r.slug;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  });

  const entries = rows.map((r) => {
    const siblings = groups.get(r.group_id || r.slug) || [r];
    const lastmod = String(r.updated_at || r.published_at || '').slice(0, 10);
    const alts = siblings.map((s) =>
      `<xhtml:link rel="alternate" hreflang="${xmlEscape(s.lang)}" href="${xmlEscape(postUrl(origin, s.lang, s.slug))}"/>`).join('');
    return `  <url><loc>${xmlEscape(postUrl(origin, r.lang, r.slug))}</loc>`
      + (lastmod ? `<lastmod>${lastmod}</lastmod>` : '')
      + '<changefreq>monthly</changefreq>'
      + alts
      + '</url>';
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
