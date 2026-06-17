// Shared server-side rendering for the blog (imported by the /blog routes).
// Files prefixed with "_" are not treated as routes by Cloudflare Pages.
//
// Posts are stored as Markdown. We render them to HTML on the server so search
// engines get fully-formed pages (good SEO) without any client-side hydration.
// The Markdown is escaped first and only a safe subset of tags is produced, so
// even though only admins can author posts, no raw HTML/script can slip in.

const SITE_NAME = 'EverythingConvert';

export function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Allow only safe URL shapes (blocks javascript:, data:, etc.).
function safeUrl(url) {
  const v = String(url || '').trim();
  if (/^(https?:\/\/|\/|#|mailto:)/i.test(v)) return v;
  if (/^[a-z]+:/i.test(v)) return '#';       // any other scheme -> blocked
  return v || '#';                            // relative path
}

// Emphasis / links / images on a single (code-free, already-escaped) segment.
function formatSegment(s) {
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) =>
    `<img src="${safeUrl(url)}" alt="${alt}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) =>
    `<a href="${safeUrl(url)}" rel="noopener">${txt}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return s;
}

// Inline Markdown on already-HTML-escaped text. Split out `code` spans first so
// emphasis markers inside them are left literal (no placeholder collisions).
function inline(s) {
  return String(s).split(/(`[^`]+`)/).map((part) => {
    if (part.length >= 2 && part[0] === '`' && part[part.length - 1] === '`') {
      return `<code>${part.slice(1, -1)}</code>`;
    }
    return formatSegment(part);
  }).join('');
}

export function renderMarkdown(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let listType = null;
  let para = [];

  const flushPara = () => {
    if (para.length) { html += `<p>${inline(escapeHtml(para.join(' ')))}</p>`; para = []; }
  };
  const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    if (/^```/.test(raw.trim())) {
      flushPara(); closeList(); i += 1;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { code.push(lines[i]); i += 1; }
      i += 1;
      html += `<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`;
      continue;
    }

    const t = raw.trim();
    if (t === '') { flushPara(); closeList(); i += 1; continue; }

    let m;
    if ((m = t.match(/^(#{1,6})\s+(.*)$/))) {
      flushPara(); closeList();
      const lvl = m[1].length;
      html += `<h${lvl}>${inline(escapeHtml(m[2]))}</h${lvl}>`;
      i += 1; continue;
    }
    if (/^(---+|\*\*\*+)$/.test(t)) { flushPara(); closeList(); html += '<hr>'; i += 1; continue; }
    if ((m = t.match(/^>\s?(.*)$/))) {
      flushPara(); closeList();
      const bq = [m[1]]; i += 1;
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        bq.push(lines[i].trim().replace(/^>\s?/, '')); i += 1;
      }
      html += `<blockquote>${inline(escapeHtml(bq.join(' ')))}</blockquote>`;
      continue;
    }
    if ((m = t.match(/^[-*+]\s+(.*)$/))) {
      flushPara();
      if (listType !== 'ul') { closeList(); html += '<ul>'; listType = 'ul'; }
      html += `<li>${inline(escapeHtml(m[1]))}</li>`;
      i += 1; continue;
    }
    if ((m = t.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (listType !== 'ol') { closeList(); html += '<ol>'; listType = 'ol'; }
      html += `<li>${inline(escapeHtml(m[1]))}</li>`;
      i += 1; continue;
    }

    closeList();
    para.push(t);
    i += 1;
  }
  flushPara(); closeList();
  return html;
}

function plainText(md, max = 160) {
  const text = String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

const STYLE = `
  .blog-wrap { width: min(760px, calc(100% - 2rem)); margin: 0 auto; padding: 3rem 0 4rem; }
  .blog-back { display: inline-flex; gap: .4rem; align-items: center; color: #2563eb; text-decoration: none; font-weight: 800; margin-bottom: 1.25rem; }
  .blog-langs { display: flex; gap: .4rem; flex-wrap: wrap; margin: 0 0 1.5rem; }
  .blog-langs a { font-size: .82rem; font-weight: 800; text-decoration: none; color: #475569; border: 1px solid #e2e8f0; border-radius: 999px; padding: .3rem .8rem; background: #fff; }
  .blog-langs a.active { background: #2563eb; color: #fff; border-color: transparent; }
  .blog-article h1 { font-size: clamp(1.9rem, 4vw, 2.8rem); line-height: 1.15; color: #0f172a; margin: 0 0 .6rem; }
  .blog-meta { color: #64748b; font-weight: 700; margin-bottom: 1.5rem; }
  .blog-cover { width: 100%; border-radius: 16px; margin: 0 0 1.75rem; }
  .blog-body { color: #1f2937; font-size: 1.08rem; line-height: 1.85; }
  .blog-body h2 { margin: 2rem 0 .75rem; font-size: 1.5rem; color: #0f172a; }
  .blog-body h3 { margin: 1.5rem 0 .6rem; font-size: 1.2rem; color: #0f172a; }
  .blog-body p { margin: 0 0 1.1rem; }
  .blog-body img { max-width: 100%; height: auto; border-radius: 12px; }
  .blog-body a { color: #2563eb; }
  .blog-body pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 12px; overflow: auto; }
  .blog-body code { background: rgba(15,23,42,.08); padding: .12rem .35rem; border-radius: 6px; font-size: .92em; }
  .blog-body pre code { background: none; padding: 0; }
  .blog-body blockquote { border-left: 4px solid #c7d2fe; margin: 1.2rem 0; padding: .3rem 1rem; color: #475569; background: rgba(99,102,241,.06); border-radius: 0 12px 12px 0; }
  .blog-list { width: min(960px, calc(100% - 2rem)); margin: 0 auto; padding: 3rem 0 4rem; }
  .blog-list h1 { font-size: clamp(2rem, 5vw, 3rem); color: #0f172a; margin: 0 0 .4rem; }
  .blog-list .lede { color: #64748b; margin: 0 0 2rem; }
  .blog-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .blog-card { display: flex; flex-direction: column; background: rgba(255,255,255,.86); border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; text-decoration: none; box-shadow: 0 18px 40px rgba(15,23,42,.06); }
  .blog-card img { width: 100%; height: 168px; object-fit: cover; }
  .blog-card .card-body { padding: 1.1rem 1.2rem 1.3rem; }
  .blog-card h2 { font-size: 1.18rem; color: #0f172a; margin: 0 0 .4rem; }
  .blog-card p { color: #64748b; margin: 0 0 .7rem; line-height: 1.6; font-size: .95rem; }
  .blog-card .card-date { color: #94a3b8; font-weight: 700; font-size: .82rem; }
  .blog-empty { color: #64748b; padding: 3rem 0; text-align: center; }
  .blog-foot-langs { display: flex; gap: .55rem; flex-wrap: wrap; align-items: center; justify-content: center; padding: .25rem 0 1rem; }
  .blog-foot-langs i { color: #94a3b8; margin-right: .25rem; }
  .blog-foot-langs a { font-size: .85rem; font-weight: 800; color: #475569; text-decoration: none; }
  .blog-foot-langs a.active { color: #2563eb; }
`;

function shell({ lang, title, description, canonical, head = '', body, footerLangs }) {
  const footLangs = (footerLangs && footerLangs.length)
    ? `<div class="blog-foot-langs"><i class="fa-solid fa-globe"></i>${footerLangs.map((f) => `<a href="${escapeHtml(f.url)}"${f.active ? ' class="active"' : ''}>${escapeHtml(LANG_LABEL[f.lang] || f.lang)}</a>`).join('')}</div>`
    : '';
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang || 'en')}">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MWPYMT3Q6H"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MWPYMT3Q6H');</script>
<script src="/analytics.js?v=analytics-20260614a"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/styles.css?v=ui-20260614a">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>${STYLE}</style>
${head}
</head>
<body class="premium-subpage">
<header class="header">
  <a class="logo" href="/" aria-label="${SITE_NAME} home">
    <img class="brand-icon" src="/favicon.svg" alt="" width="28" height="28">
    <span>${SITE_NAME}</span>
  </a>
  <nav>
    <a class="nav-link" href="/">Home</a>
    <a class="nav-link" href="/index.html#tools">Tools</a>
    <a class="nav-link" href="/blog">Blog</a>
  </nav>
</header>
${body}
<footer class="site-footer">
  <div class="footer-legal-row" style="display:flex;align-items:center;justify-content:center;gap:1rem;flex-wrap:wrap;padding:1rem 0 1.25rem;border-top:1px solid rgba(47,38,18,.12);">
    <a href="/about.html">About Us</a>
    <a href="/privacy.html">Privacy</a>
    <a href="/terms.html">Terms</a>
    <a href="/security.html">Security and Compliance</a>
    <a href="/contact.html">Contact</a>
    <a href="/blog">Blog</a>
    <a href="#cookie-settings">Cookie Settings</a>
  </div>
  ${footLangs}
  <div class="footer-bottom">
    <div class="footer-logo"><img class="brand-icon" src="/favicon.svg" alt="" width="24" height="24"><span>${SITE_NAME}</span></div>
    <p>&copy; ${SITE_NAME}.com All rights reserved (2026)</p>
  </div>
</footer>
<script>window.EVERYTHING_CONVERT_NAV_PREFIX='/';</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/supabase-config.js"></script>
<script src="/auth.js?v=auth-20260616b"></script>
<script src="/tools-menu.js?v=nav-20260616b"></script>
<script src="/language-menu.js?v=lang-20260611a"></script>
<script src="/header-language.js?v=headerlang-20260616a"></script>
<script src="/ai-credits.js?v=credits-20260613d"></script>
</body>
</html>`;
}

const LANG_LABEL = { en: 'English', ko: '한국어', de: 'Deutsch', es: 'Español', fr: 'Français' };
const LANGS = ['en', 'ko', 'de', 'es', 'fr'];

export function postUrl(origin, lang, slug) {
  return `${origin}/blog/${lang}/${encodeURIComponent(slug)}`;
}

export function renderPostPage({ post, origin, alternates }) {
  const alts = Array.isArray(alternates) && alternates.length ? alternates : [{ lang: post.lang, slug: post.slug }];
  const canonical = postUrl(origin, post.lang, post.slug);
  const description = post.excerpt || plainText(post.body);
  const bodyHtml = renderMarkdown(post.body);
  const dateLabel = formatDate(post.published_at || post.created_at);
  const cover = post.cover_image ? safeUrl(post.cover_image) : '';

  // hreflang alternates so Google serves the right language per searcher.
  const xDefault = alts.find((a) => a.lang === 'en') || alts.find((a) => a.lang === post.lang) || alts[0];
  const hreflang = alts.map((a) => `<link rel="alternate" hreflang="${escapeHtml(a.lang)}" href="${escapeHtml(postUrl(origin, a.lang, a.slug))}">`).join('')
    + `<link rel="alternate" hreflang="x-default" href="${escapeHtml(postUrl(origin, xDefault.lang, xDefault.slug))}">`;

  const switcher = alts.length > 1
    ? `<div class="blog-langs">${alts.map((a) => `<a href="${escapeHtml(postUrl(origin, a.lang, a.slug))}"${a.lang === post.lang ? ' class="active"' : ''}>${escapeHtml(LANG_LABEL[a.lang] || a.lang)}</a>`).join('')}</div>`
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    inLanguage: post.lang || 'en',
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: { '@type': 'Organization', name: SITE_NAME, url: origin },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: origin },
    ...(cover ? { image: cover } : {}),
  };

  const head = `
<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:locale" content="${escapeHtml(post.lang || 'en')}">
${cover ? `<meta property="og:image" content="${escapeHtml(cover)}">` : ''}
<meta name="twitter:card" content="${cover ? 'summary_large_image' : 'summary'}">
<meta property="article:published_time" content="${escapeHtml(post.published_at || post.created_at || '')}">
${hreflang}
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

  const body = `
<main class="blog-wrap">
  <a class="blog-back" href="/blog"><i class="fa-solid fa-arrow-left"></i> All posts</a>
  ${switcher}
  <article class="blog-article">
    <h1>${escapeHtml(post.title)}</h1>
    <div class="blog-meta">${dateLabel ? escapeHtml(dateLabel) : ''}</div>
    ${cover ? `<img class="blog-cover" src="${escapeHtml(cover)}" alt="${escapeHtml(post.title)}">` : ''}
    <div class="blog-body">${bodyHtml}</div>
  </article>
</main>`;

  const footerLangs = alts.map((a) => ({ lang: a.lang, url: postUrl(origin, a.lang, a.slug), active: a.lang === post.lang }));
  return shell({ lang: post.lang, title: `${post.title} | ${SITE_NAME} Blog`, description, canonical, head, body, footerLangs });
}

export function renderListPage({ posts, origin, lang }) {
  const canonical = `${origin}/blog`;
  const cards = (posts || []).map((p) => {
    const cover = p.cover_image ? safeUrl(p.cover_image) : '';
    const date = formatDate(p.published_at || p.created_at);
    const excerpt = p.excerpt || plainText(p.body, 120);
    return `<a class="blog-card" href="${escapeHtml(postUrl(origin, p.lang, p.slug))}">
      ${cover ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(p.title)}" loading="lazy">` : ''}
      <div class="card-body">
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(excerpt)}</p>
        <span class="card-date">${escapeHtml(date)}</span>
      </div>
    </a>`;
  }).join('');

  const body = `
<main class="blog-list">
  <h1>Blog</h1>
  <p class="lede">Guides, tips, and updates from the ${SITE_NAME} team.</p>
  ${cards ? `<div class="blog-cards">${cards}</div>` : '<div class="blog-empty">No posts yet. Check back soon!</div>'}
</main>`;

  const footerLangs = LANGS.map((l) => ({ lang: l, url: `${origin}/blog?lang=${l}`, active: l === (lang || 'en') }));
  return shell({
    lang: lang || 'en',
    title: `Blog | ${SITE_NAME}`,
    description: `Guides, tips, and product updates from ${SITE_NAME}.`,
    canonical, body, footerLangs,
  });
}

export function notFoundPage(origin) {
  const body = `
<main class="blog-wrap">
  <a class="blog-back" href="/blog"><i class="fa-solid fa-arrow-left"></i> All posts</a>
  <h1>Post not found</h1>
  <p style="color:#64748b">This post may have been moved or unpublished.</p>
</main>`;
  const footerLangs = LANGS.map((l) => ({ lang: l, url: `${origin}/blog?lang=${l}`, active: l === 'en' }));
  return shell({
    lang: 'en', title: `Not found | ${SITE_NAME} Blog`,
    description: 'Post not found.', canonical: `${origin}/blog`, body, footerLangs,
  });
}
