const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// ── DB schema ──
const sql = read('supabase/blog-setup.sql');
assert(/create table if not exists public\.blog_posts/.test(sql), 'blog-setup.sql should create blog_posts.');
assert(/status\s+text[^,]*check \(status in \('draft', 'published'\)\)/.test(sql), 'blog_posts.status should be draft/published.');
assert(sql.includes("status = 'published' or public.is_admin()"), 'Public should read published; admins read all.');
assert(/for insert with check \(public\.is_admin\(\)\)/.test(sql), 'Only admins may insert posts.');
assert(sql.includes("storage.buckets") && sql.includes("'blog-images'"), 'Should provision the blog-images bucket.');
assert(sql.includes("bucket_id = 'blog-images' and public.is_admin()"), 'Only admins may upload blog images.');

// ── Render module ──
const render = read('functions/blog/_render.js');
assert(/export function renderMarkdown/.test(render) && /export function renderPostPage/.test(render) && /export function renderListPage/.test(render),
  'Render module should export markdown + page renderers.');
assert(render.includes('BlogPosting') && render.includes('application/ld+json'), 'Post pages should include Article JSON-LD.');
assert(render.includes('rel="canonical"'), 'Post pages should set a canonical URL.');

// ── Routes ──
const slugFn = read('functions/blog/[slug].js');
assert(slugFn.includes('onRequestGet') && slugFn.includes('status=eq.published'), 'Post route should fetch only published posts.');
assert(slugFn.includes('renderPostPage') && slugFn.includes('notFoundPage'), 'Post route should render the post or a 404 page.');

const indexFn = read('functions/blog/index.js');
assert(indexFn.includes('onRequestGet') && indexFn.includes('renderListPage') && indexFn.includes('status=eq.published'),
  'Blog index should list published posts.');

const sitemap = read('functions/blog-sitemap.xml.js');
assert(sitemap.includes('onRequestGet') && sitemap.includes('<urlset') && sitemap.includes('/blog/'), 'Blog sitemap should output post URLs.');

// ── Admin editor (gated, not indexed) ──
const editor = read('admin-blog.html');
assert(editor.includes('noindex'), 'admin-blog.html must not be indexed.');
assert(editor.includes('isAdmin()') && /Admin only|not an admin/.test(editor), 'Editor must gate non-admins.');
assert(editor.includes("from('blog_posts')") && editor.includes("storage.from('blog-images')"),
  'Editor should write posts and upload images via Supabase.');

// ── Footer link site-wide, not in top menu ──
const menu = read('tools-menu.js');
assert(menu.includes('injectFooterBlogLink') && menu.includes("link.href = '/blog'"), 'Footer should get a Blog link.');
assert(!/top-nav[\s\S]*href="\/blog"/.test(menu.slice(0, menu.indexOf('injectFooterBlogLink'))),
  'Blog should not be added to the top navigation markup.');

// ── robots ──
const robots = read('robots.txt');
assert(robots.includes('Disallow: /admin-blog.html'), 'robots.txt should hide the blog editor.');
assert(robots.includes('blog-sitemap.xml'), 'robots.txt should reference the blog sitemap.');

// ── Runtime: markdown is safe + correct ──
(async () => {
  const mod = await import('../functions/blog/_render.js');
  const html = mod.renderMarkdown('# Hi\n\n**b** and `c()`\n\n<script>alert(1)</script>\n\nI have 3 cats.');
  assert(html.includes('<h1>Hi</h1>'), 'Heading should render.');
  assert(html.includes('<strong>b</strong>') && html.includes('<code>c()</code>'), 'Inline formatting should render.');
  assert(html.includes('&lt;script&gt;') && !html.includes('<script>alert'), 'Raw HTML must be escaped (no XSS).');
  assert(!/<code>[^<]*cats/.test(html), 'Plain numbers must not become code.');
  const page = mod.renderPostPage({ post: { slug: 's', title: 'T', excerpt: '', body: '# x', lang: 'ko', published_at: '2026-06-14T00:00:00Z', created_at: '2026-06-14T00:00:00Z' }, origin: 'https://x.com' });
  assert(page.includes('<html lang="ko">') && page.includes('https://x.com/blog/s'), 'Post page should set lang + canonical.');
  console.log('blog tests passed');
})().catch((e) => { console.error(e); process.exit(1); });
