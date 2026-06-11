const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'pricing-language.js'), 'utf8');
const pricing = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');

// 1. Pricing page must load the pricing translation script after the shared
//    language system so it can react to everything-language-change events.
assert(
  pricing.includes('pricing-language.js?v='),
  'pricing.html should load pricing-language.js with a cache-busting version.',
);
assert(
  pricing.indexOf('language-menu.js') < pricing.indexOf('pricing-language.js'),
  'pricing-language.js must load after language-menu.js.',
);

// 2. All four languages must be present.
['ko:', 'de:', 'es:', 'fr:'].forEach((language) => {
  assert(
    script.includes(`    ${language} {`),
    `pricing-language.js should include a ${language.replace(':', '')} dictionary.`,
  );
});

// 3. Sampled keys that must exist in every language (4 occurrences each).
[
  "'Upgrade to Pro':",
  "'Unlimited AI PDF Summary':",
  "'AI tools, paid only when you need the final result.':",
  "'Cancel any time':",
].forEach((key) => {
  const count = script.split(key).length - 1;
  assert(count >= 4, `pricing-language.js should translate ${key} in all 4 languages (found ${count}).`);
});

// 4. The walker must support switching between non-English languages
//    (canonical phrase mapping) and re-apply when the checkout script
//    mutates prices/statuses (MutationObserver), without fighting
//    language-menu.js-owned nodes.
assert(
  script.includes('canonicalPhrase') &&
    script.includes('MutationObserver') &&
    script.includes('everything-language-change') &&
    script.includes('dataset.i18nKey'),
  'pricing-language.js should map phrases bidirectionally, observe DOM changes, and skip language-menu-owned nodes.',
);

console.log('pricing language tests passed');
