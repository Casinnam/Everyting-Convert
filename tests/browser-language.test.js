const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'language-menu.js'), 'utf8');

// 1. Browser language detection must exist and only accept supported codes.
assert(
  script.includes('navigator.languages') &&
    script.includes('getBrowserLanguage') &&
    script.includes('if (supported(code)) return code;'),
  'language-menu.js should detect the browser/OS language and accept it only when it is a supported site language.',
);

// 2. Priority order: URL ?lang → saved manual choice → browser language → en.
const savedIdx = script.indexOf("localStorage.getItem('everything_convert_language')");
const detectIdx = script.indexOf('return getBrowserLanguage() || ', savedIdx);
assert(
  savedIdx !== -1 && detectIdx > savedIdx,
  'Browser language must be a fallback only: a manually saved language must be checked first so user choice always wins.',
);

// 3. The detected language must not be persisted — only manual picks call
//    saveLanguage, so visitors keep following their device language until
//    they choose one themselves.
const detectBlock = script.slice(script.indexOf('function getBrowserLanguage'), script.indexOf('function getSavedLanguage'));
assert(
  !detectBlock.includes('saveLanguage('),
  'getBrowserLanguage should not persist the detected language to localStorage.',
);

// 4. Pages must reference the bumped cache version so browsers load the new script.
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(
  indexHtml.includes('language-menu.js?v=lang-20260618b'),
  'index.html should load the cache-busted language-menu.js version that ships browser language detection.',
);

console.log('browser language tests passed');
