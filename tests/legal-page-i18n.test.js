const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scriptPath = path.join(root, 'legal-page-i18n.js');
assert(fs.existsSync(scriptPath), 'legal-page-i18n.js should exist.');

// Load the IIFE internals (strip browser-only init at the bottom).
let src = fs.readFileSync(scriptPath, 'utf8');
const harness = src.replace(/if \(document\.readyState[\s\S]*\}\)\(\);\s*$/, 'globalThis.__LEGAL = { pages, nav, labels }; })();');
new Function(harness)();
const { pages, nav } = globalThis.__LEGAL;

const requiredPages = ['about.html', 'privacy.html', 'terms.html', 'security.html'];
const requiredLangs = ['en', 'ko', 'de', 'es', 'fr'];

// 1. Every footer page must have a full title + content set in all 5 languages.
requiredPages.forEach((page) => {
  assert(pages[page], `legal-page-i18n.js should define ${page}.`);
  requiredLangs.forEach((lang) => {
    assert(pages[page].title[lang], `${page} should have a ${lang} title.`);
    const content = pages[page].content[lang];
    assert(content && content.trim().length > 200, `${page} should have substantial ${lang} body content.`);
  });
});

// 2. Footer/nav labels must be translated in all 5 languages.
['about', 'privacy', 'terms', 'security', 'contact', 'copyright'].forEach((key) => {
  requiredLangs.forEach((lang) => {
    assert(nav[key] && nav[key][lang], `nav.${key} should have a ${lang} label.`);
  });
});

// 3. The script must react to the shared language event and must NOT force a
//    full-page reload on language change (it renders in place like the rest
//    of the site).
assert(
  src.includes("addEventListener('everything-language-change'"),
  'legal-page-i18n.js should re-render on everything-language-change.',
);
assert(
  !src.includes('window.location.href = url'),
  'legal-page-i18n.js should not reload the page to switch language.',
);

// 4. Page lookup must tolerate clean URLs (/about as well as /about.html).
assert(
  src.includes('function pageKey') && src.includes("pages[file + '.html']"),
  'legal-page-i18n.js should resolve the page key with and without the .html extension.',
);

// 5. All four pages must load the cache-busted script.
requiredPages.forEach((page) => {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert(
    html.includes('legal-page-i18n.js?v='),
    `${page} should load legal-page-i18n.js with a cache-busting version.`,
  );
});

console.log('legal page i18n tests passed');
