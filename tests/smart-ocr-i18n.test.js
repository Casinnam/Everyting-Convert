const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'ai tools', 'smart-ocr', 'index.html'), 'utf8');
const common = fs.readFileSync(path.join(root, 'ai tools', 'ai-common.js'), 'utf8');

// The page must mark its visible text for translation and load the shared i18n.
assert(page.includes('ai-common.js'), 'Smart OCR should load ai-common.js for i18n.');
const keys = [
  'ocBadge', 'ocHeroDesc', 'ocDrop', 'ocFreeTitle', 'ocFreeDesc', 'ocFreeBtn',
  'ocSmartTitle', 'ocSmartBtn', 'ocCreditNote', 'ocFreeQText', 'ocSmartQText',
  'ocPrivacyText', 'ocFaqTitle', 'ocFaqQ1', 'ocFaqA1', 'ocFaqQ4', 'ocTranslateBtn',
];
keys.forEach((k) => {
  assert(page.includes(`data-i18n="${k}"`), `Smart OCR page should tag ${k} with data-i18n.`);
  const entry = new RegExp(`${k}:\\s*\\{[^}]*\\bko:`);
  assert(entry.test(common), `ai-common.js should define ${k} with translations (incl. ko).`);
});

// Every oc* key used in the page must exist in the dictionary for all 5 langs.
const usedKeys = [...page.matchAll(/data-i18n="(oc[A-Za-z0-9]+)"/g)].map((m) => m[1]);
const uniqueKeys = [...new Set(usedKeys)];
assert(uniqueKeys.length >= 20, 'Smart OCR should translate the bulk of its text.');
uniqueKeys.forEach((k) => {
  const block = common.match(new RegExp(`${k}:\\s*\\{([\\s\\S]*?)\\}`));
  assert(block, `Missing dictionary entry for ${k}.`);
  ['en', 'ko', 'de', 'es', 'fr'].forEach((lang) => {
    assert(new RegExp(`\\b${lang}:`).test(block[1]), `${k} is missing the ${lang} translation.`);
  });
});

// Dynamic strings (page count / credits) are localized too.
assert(page.includes('OCR_T') && page.includes("ocT('smartDesc'"), 'Dynamic Smart OCR description should be localized.');

console.log('smart ocr i18n tests passed');
