const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const pp = read('pdf to powerpoint/pdf-to-powerpoint.html');

// ── Shared conventions (the bits we keep forgetting) ──
assert(pp.includes('analytics.js'), 'pp: must load analytics consent script.');
assert(pp.includes('rel="canonical"'), 'pp: needs a canonical URL.');
assert(pp.includes('name="description"'), 'pp: needs a meta description.');
assert(pp.includes('application/ld+json'), 'pp: needs structured data.');
assert(pp.includes('#cookie-settings'), 'pp: footer must expose Cookie Settings.');
assert(pp.includes('class="site-footer"'), 'pp: needs the shared footer.');
assert(/tools-menu\.js\?v=nav-20260616c/.test(pp), 'pp: must load the current tools-menu (common sticky header).');
assert(/tool-language\.js\?v=toollang-20260616a/.test(pp), 'pp: must load current tool-language for i18n.');
assert(pp.includes('pdf.min.js'), 'pp: needs pdf.js to read/rasterize the PDF.');
assert(pp.includes('pptxgen'), 'pp: needs pptxgenjs to build the .pptx.');
assert(pp.includes('class="pp-hero hero"') || pp.includes(' hero"'), 'pp: hero must carry the .hero class for i18n.');
assert(pp.includes('.pptx'), 'pp: should download a .pptx.');

// ── Dual mode: free image slides + AI editable-text slides (2 credits/page) ──
assert(pp.includes('runImage') && pp.includes('placeContain'), 'pp: free image-slide mode must exist.');
assert(pp.includes('runAi') && pp.includes('ai-ocr') && pp.includes('credits.redeem'), 'pp: AI mode must use ai-ocr + credit redemption.');
assert(pp.includes('ai-credits.js'), 'pp: must load the shared credit helper for AI mode.');
assert(pp.includes('writeFile'), 'pp: must export the presentation via pptxgenjs writeFile.');

// ── i18n wiring ──
const tl = read('tool-language.js');
assert(tl.includes("'/pdf to powerpoint/'"), 'detectTool must map the pdf-to-powerpoint folder.');
const block = tl.match(/pdfPpt:\s*\{[\s\S]*?title:\s*\{([^}]*)\}/);
assert(block, 'tool-language must define pdfPpt.');
['en', 'ko', 'de', 'es', 'fr'].forEach((l) => assert(new RegExp(`\\b${l}:`).test(block[1]), `pdfPpt title missing ${l}.`));
assert(/pdfPpt:[\s\S]*?modesNote:/.test(tl), 'pdfPpt should define a modesNote (free vs AI).');

// ── Discoverability ──
const menu = read('tools-menu.js');
assert(menu.includes('pdf to powerpoint/pdf-to-powerpoint.html'), 'Nav menu should link the tool.');
const sitemap = read('sitemap.xml');
assert(sitemap.includes('pdf%20to%20powerpoint/pdf-to-powerpoint.html'), 'Sitemap should include the tool.');
const home = read('index.html');
assert(home.includes('pdf to powerpoint/pdf-to-powerpoint.html'), 'Homepage should link the tool.');

console.log('pdf to powerpoint tests passed');
