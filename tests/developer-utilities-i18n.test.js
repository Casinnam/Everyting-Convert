const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets', 'developer-tools.js'), 'utf8');

// 1. The developer utility pages (JSON Formatter, Base64, URL Encoder) must
//    translate into every supported language, not only Korean.
['ko:', 'de:', 'es:', 'fr:'].forEach((language) => {
  assert(
    script.includes(`    ${language} {`) || script.includes(`${language} {`),
    `developer-tools.js i18n dictionary should include a ${language.replace(':', '')} section.`,
  );
});

// 2. Every language must translate the page titles (sampled keys).
[
  "'JSON Formatter & Validator':",
  "'Base64 Encode / Decode':",
  "'URL Encoder / Decoder':",
  "'Sample loaded.':",
].forEach((key) => {
  const count = script.split(key).length - 1;
  assert(
    count >= 4,
    `developer-tools.js should translate ${key} in all 4 languages (found ${count}).`,
  );
});

// 3. The hero h1 contains <span> markup and an &amp; entity, so the lookup
//    key must come from textContent (decoded), not innerHTML — otherwise the
//    title never matches the dictionary and stays English.
assert(
  script.includes('node.dataset.devI18nEn = node.textContent.trim();') &&
    script.includes('devI18nEnHtml'),
  'translateNode must key html nodes on decoded textContent and keep the original innerHTML for English.',
);

// 4. Language detection must follow the shared language system / browser
//    language when nothing is saved, so first paint is translated.
assert(
  script.includes('window.EverythingConvertLanguage') && script.includes('navigator.languages'),
  'developer-tools.js getLanguage should fall back to the shared language system and browser language.',
);

// 5. Pages must load the cache-busted script.
[
  'json formatter/json-formatter.html',
  'base64 encode decode/base64-encode-decode.html',
  'url encoder decoder/url-encoder-decoder.html',
].forEach((page) => {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert(
    html.includes('developer-tools.js?v='),
    `${page} should load developer-tools.js with a cache-busting version.`,
  );
});

console.log('developer utilities i18n tests passed');
