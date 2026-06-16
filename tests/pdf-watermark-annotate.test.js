const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const wm = read('pdf watermark/pdf-watermark.html');
const an = read('pdf annotate/pdf-annotate.html');

// ── Shared conventions both pages must follow (the bits we keep forgetting) ──
[['watermark', wm], ['annotate', an]].forEach(([name, html]) => {
  assert(html.includes('analytics.js'), `${name}: must load analytics consent script.`);
  assert(html.includes('rel="canonical"'), `${name}: needs a canonical URL.`);
  assert(html.includes('name="description"'), `${name}: needs a meta description.`);
  assert(html.includes('application/ld+json'), `${name}: needs structured data.`);
  assert(html.includes('#cookie-settings'), `${name}: footer must expose Cookie Settings.`);
  assert(html.includes('class="site-footer"'), `${name}: needs the shared footer.`);
  assert(/tools-menu\.js\?v=nav-20260616b/.test(html), `${name}: must load the current tools-menu (common sticky header).`);
  assert(/tool-language\.js\?v=toollang-20260616a/.test(html), `${name}: must load current tool-language for i18n.`);
  assert(html.includes('pdf-lib'), `${name}: needs pdf-lib to write the PDF.`);
  assert(html.includes('pdf.min.js'), `${name}: needs pdf.js to read/preview the PDF.`);
  assert(html.includes('class="hero"') || html.includes(' hero"'), `${name}: hero must carry the .hero class for i18n.`);
  assert(html.includes('embedPng') && html.includes('drawImage'), `${name}: should bake text via canvas->PNG into the PDF.`);
  assert(html.includes('.pdf'), `${name}: should download a .pdf.`);
});

// ── Watermark specifics ──
assert(wm.includes('makeWatermarkCanvas') && wm.includes('getPages'), 'Watermark should stamp every page.');
assert(/opacity|wmOpacity/.test(wm) && wm.includes('wmColor'), 'Watermark should expose opacity + color.');

// ── Annotate specifics ──
assert(an.includes('addText') && an.includes('pointerdown'), 'Annotate should add draggable text.');

// ── Annotate: edit existing PDF text (Pro / 3 credits) ──
assert(an.includes('editTextBtn') && an.includes('getTextContent'), 'Annotate should detect existing text for editing.');
assert(an.includes('drawRectangle'), 'Annotate edit-text should erase the original via a covering rectangle.');
assert(an.includes("spend('pdf-edit-text'"), 'Annotate edit-text should charge via the pdf-edit-text credit spend.');
assert(an.includes('ai-credits.js'), 'Annotate should load the credit helper for edit-text.');
assert(/EDIT_COST\s*=\s*3/.test(an), 'Annotate edit-text should cost 3 credits.');
assert(an.includes('isPro'), 'Annotate edit-text should be free for Pro members.');
const spendFn = read('supabase/functions/ai-spend-credit/index.ts');
assert(/'pdf-edit-text':\s*3/.test(spendFn), 'ai-spend-credit must price pdf-edit-text at 3 credits.');

// ── i18n wiring ──
const tl = read('tool-language.js');
assert(tl.includes("'/pdf watermark/'") && tl.includes("'/pdf annotate/'"), 'detectTool must map the new tool folders.');
['pdfWatermark', 'pdfAnnotate'].forEach((k) => {
  const block = tl.match(new RegExp(`${k}:\\s*\\{[\\s\\S]*?title:\\s*\\{([^}]*)\\}`));
  assert(block, `tool-language must define ${k}.`);
  ['en', 'ko', 'de', 'es', 'fr'].forEach((l) => assert(new RegExp(`\\b${l}:`).test(block[1]), `${k} title missing ${l}.`));
});

// ── Discoverability ──
const menu = read('tools-menu.js');
assert(menu.includes('pdf watermark/pdf-watermark.html') && menu.includes('pdf annotate/pdf-annotate.html'), 'Nav menu should link both tools.');
const sitemap = read('sitemap.xml');
assert(sitemap.includes('pdf%20watermark/pdf-watermark.html') && sitemap.includes('pdf%20annotate/pdf-annotate.html'), 'Sitemap should include both tools.');

console.log('pdf watermark + annotate tests passed');
