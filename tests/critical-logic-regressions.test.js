const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const auth = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const languageMenu = fs.readFileSync(path.join(root, 'language-menu.js'), 'utf8');
const toolLanguage = fs.readFileSync(path.join(root, 'tool-language.js'), 'utf8');
const usage = fs.readFileSync(path.join(root, 'usage-limit.js'), 'utf8');
const history = fs.readFileSync(path.join(root, 'conversion-history.js'), 'utf8');

const commonMojibake = [
  '?쒓뎅',
  'Espa챰ol',
  'Fran챌ais',
  '濡쒓',
  '臾몄꽌',
  '鍮꾨뵒',
  'Datei w채hlen',
  'm찼s',
  'Vid챕o',
  '쨌',
];

for (const [name, source] of Object.entries({ auth, languageMenu, toolLanguage })) {
  for (const marker of commonMojibake) {
    assert(!source.includes(marker), `${name} should not contain mojibake marker: ${marker}`);
  }
}

for (const expected of [
  "ko: '한국어'",
  "es: 'Español'",
  "fr: 'Français'",
  "navLogin: { en: 'Login', ko: '로그인'",
  "chooseFile: { en: 'Choose File', ko: '파일 선택'",
  "copyright: {",
]) {
  assert(languageMenu.includes(expected), `language-menu.js should include readable translation: ${expected}`);
}

for (const expected of [
  "pdfDocuments: 'PDF & 문서'",
  "media: '비디오 & 오디오'",
  "browse: '파일 선택'",
  "Datei wählen",
  "vídeo",
  "Vidéo",
]) {
  assert(toolLanguage.includes(expected), `tool-language.js should include readable tool text: ${expected}`);
}

assert(
  auth.includes('const identityCacheKey') &&
    auth.includes('writeAuthIdentityCache') &&
    auth.includes('readAuthIdentityCache'),
  'Auth should keep a lightweight identity cache for instant account labels.',
);

assert(
  !auth.includes('plan: state.profile.plan') &&
    !auth.includes('role: state.profile.role') &&
    !auth.includes('cached && cached.plan') &&
    !auth.includes('cached.role'),
  'Auth identity cache should not store or reuse stale plan/role values.',
);

assert(
  usage.includes('async function checkConversionAllowed') &&
    usage.includes('async function recordSuccessfulConversion') &&
    usage.indexOf("fetchServerUsage('POST')") > usage.indexOf('async function recordSuccessfulConversion'),
  'Usage helper should check before conversion and record only after a successful conversion.',
);

assert(
  history.includes('recordToolConversion') &&
    history.includes('window.EverythingConvertUsageLimit.recordSuccessfulConversion'),
  'Conversion history helper should expose a shared success recorder that also updates usage limits.',
);

console.log('critical logic regression tests passed');
