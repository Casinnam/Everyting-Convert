const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// ── DB schema ──
const sql = read('supabase/blog-setup.sql');
assert(/create table if not exists public\.blog_posts/.test(sql), 'blog-setup.sql should create blog_posts.');
assert(sql.includes("status = 'published' or public.is_admin()"), 'Public should read published; admins read all.');
assert(/for insert with check \(public\.is_admin\(\)\)/.test(sql), 'Only admins may insert posts.');
assert(sql.includes("bucket_id = 'blog-images' and public.is_admin()"), 'Only admins may upload blog images.');

// ── Multilingual migration ──
const ml = read('supabase/blog-multilang.sql');
assert(ml.includes('group_id'), 'Migration should add group_id linking translations.');
assert(/unique index[^\n]*\(slug, lang\)/.test(ml), 'slug must be unique per language, not globally.');

// ── Render module ──
const render = read('functions/blog/_render.js');
assert(/export function renderPostPage/.test(render) && /export function renderListPage/.test(render) && /export function postUrl/.test(render),
  'Render module should export the renderers + postUrl helper.');
assert(render.includes('BlogPosting') && render.includes('application/ld+json'), 'Post pages should include Article JSON-LD.');
assert(render.includes('rel="canonical"'), 'Post pages should set a canonical URL.');
assert(render.includes('hreflang') && render.includes('x-default'), 'Post pages should emit hreflang alternates incl. x-default.');
assert(render.includes('/blog/${lang}/') || render.includes('/blog/' + '${'), 'Post URLs should be language-prefixed (/blog/<lang>/<slug>).');

// ── Routes ──
const langSlugFn = read('functions/blog/[lang]/[slug].js');
assert(langSlugFn.includes('onRequestGet') && langSlugFn.includes('status=eq.published'), 'Lang post route should fetch only published posts.');
assert(langSlugFn.includes('renderPostPage') && langSlugFn.includes('notFoundPage'), 'Lang post route renders the post or 404.');
assert(langSlugFn.includes('decodeURIComponent(slug)'), 'Lang post route must decode the slug (no double-encoding of Korean).');
assert(langSlugFn.includes('group_id') && langSlugFn.includes('alternates'), 'Lang post route should load sibling translations for hreflang.');

const legacyFn = read('functions/blog/[slug].js');
assert(legacyFn.includes('Response.redirect') && legacyFn.includes('/blog/'), 'Legacy /blog/<slug> should redirect to the language URL.');
assert(legacyFn.includes('decodeURIComponent(slug)'), 'Legacy route must decode the slug.');

const indexFn = read('functions/blog/index.js');
assert(indexFn.includes('onRequestGet') && indexFn.includes('renderListPage') && indexFn.includes('status=eq.published'),
  'Blog index should list published posts.');
assert(indexFn.includes('accept-language') && indexFn.includes('group_id'), 'Blog index should pick the visitor language and dedupe by group.');

const sitemap = read('functions/blog-sitemap.xml.js');
assert(sitemap.includes('<urlset') && sitemap.includes('xhtml:link') && sitemap.includes('hreflang'),
  'Blog sitemap should output language URLs with hreflang alternates.');

// ── Translation Edge Function ──
const tr = read('supabase/functions/ai-translate-post/index.ts');
assert(tr.includes('gpt-4o-mini'), 'Translation should default to gpt-4o-mini.');
assert(tr.includes('requireAdmin') && tr.includes("role === 'admin'"), 'Translation must be admin-only.');
assert(tr.includes('OPENAI_API_KEY'), 'Translation uses the existing OpenAI key.');

// ── Admin editor (gated, not indexed, multilingual) ──
const editor = read('admin-blog.html');
assert(editor.includes('noindex'), 'admin-blog.html must not be indexed.');
assert(editor.includes('isAdmin()') && /Admin only|not an admin/.test(editor), 'Editor must gate non-admins.');
assert(editor.includes("from('blog_posts')") && editor.includes("storage.from('blog-images')"),
  'Editor should write posts and upload images via Supabase.');
assert(editor.includes('ai-translate-post') && /Auto-translate/i.test(editor), 'Editor should offer auto-translation.');
assert(/LANGS\s*=\s*\[/.test(editor) && editor.includes('group_id'), 'Editor should manage all languages as one group.');

// ── robots ──
const robots = read('robots.txt');
assert(robots.includes('Disallow: /admin-blog.html'), 'robots.txt should hide the blog editor.');
assert(robots.includes('blog-sitemap.xml'), 'robots.txt should reference the blog sitemap.');

// ── Runtime: markdown safety + language-prefixed URLs + hreflang ──
(async () => {
  const mod = await import('../functions/blog/_render.js');
  const html = mod.renderMarkdown('# Hi\n\n**b** and `c()`\n\n<script>alert(1)</script>\n\nI have 3 cats.');
  assert(html.includes('<h1>Hi</h1>'), 'Heading should render.');
  assert(html.includes('<strong>b</strong>') && html.includes('<code>c()</code>'), 'Inline formatting should render.');
  assert(html.includes('&lt;script&gt;') && !html.includes('<script>alert'), 'Raw HTML must be escaped (no XSS).');
  assert(!/<code>[^<]*cats/.test(html), 'Plain numbers must not become code.');
  const alts = [{ lang: 'ko', slug: 's' }, { lang: 'en', slug: 's' }];
  const page = mod.renderPostPage({ post: { slug: 's', title: 'T', excerpt: '', body: '# x', lang: 'ko', published_at: '2026-06-14T00:00:00Z', created_at: '2026-06-14T00:00:00Z' }, origin: 'https://x.com', alternates: alts });
  assert(page.includes('<html lang="ko">') && page.includes('https://x.com/blog/ko/s'), 'Post page should set lang + language-prefixed canonical.');
  assert(page.includes('hreflang="en" href="https://x.com/blog/en/s"'), 'Post page should link the English alternate.');
  assert(mod.postUrl('https://x.com', 'fr', 'a b') === 'https://x.com/blog/fr/a%20b', 'postUrl should language-prefix and encode.');
  console.log('blog tests passed');
})().catch((e) => { console.error(e); process.exit(1); });
