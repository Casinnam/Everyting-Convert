const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'developer-language.js'), 'utf8');
const qr = fs.readFileSync(path.join(root, 'qr code generator', 'qr-code-generator.html'), 'utf8');
const json = fs.readFileSync(path.join(root, 'json to csv', 'json-to-csv.html'), 'utf8');
const csv = fs.readFileSync(path.join(root, 'csv converter', 'csv-converter.html'), 'utf8');

assert(
  qr.includes('../developer-language.js?v=devlang-20260606a') &&
    json.includes('../developer-language.js?v=devlang-20260606a') &&
    csv.includes('../developer-language.js?v=devlang-20260606a'),
  'Developer pages should load the developer-specific language patch after their page scripts.',
);

assert(
  script.includes("'QR Code Generator': 'QR 코드 생성기'") &&
    script.includes("'JSON to CSV Converter': 'JSON to CSV 변환기'") &&
    script.includes("'CSV Converter': 'CSV 변환기'") &&
    script.includes("'Generate QR Code': 'QR 코드 생성'") &&
    script.includes("'Upload File': '파일 업로드'"),
  'Developer language patch should include Korean translations for visible QR, JSON, and CSV tool text.',
);

assert(
  script.includes('canonicalPhrase') &&
    script.includes('MutationObserver') &&
    script.includes('[data-language]') &&
    script.includes('[data-type], [data-csv-mode]'),
  'Developer language patch should support switching languages and re-applying translations after dynamic UI updates.',
);

console.log('developer language tests passed');
