const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'ai tools', 'smart-ocr', 'index.html'), 'utf8');

// The translate feature needs an explicit target-language picker — without it
// the page translated to the site UI language (English by default), so the
// result looked unchanged ("doesn't work").
assert(page.includes('id="translateLang"'), 'Smart OCR should have a translate target-language selector.');
['Korean', 'Japanese', 'Spanish', 'French'].forEach((lang) => {
  assert(page.includes(`>${lang}`) || page.includes(`"${lang}"`), `Translate selector should offer ${lang}.`);
});

// enhance('translate') must use the chosen language, not just the site language.
assert(
  /action === 'translate'[\s\S]*translateLang[\s\S]*\.value/.test(page),
  'Translate should read the selected target language from #translateLang.',
);

// It still calls the ai-ocr enhance endpoint with the language.
assert(
  page.includes("mode:'enhance'") && page.includes('language: langName'),
  'Translate should call ai-ocr enhance with the target language.',
);

console.log('smart ocr translate tests passed');
