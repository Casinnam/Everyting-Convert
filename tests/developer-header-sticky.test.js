const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const developerHeaders = [
  ['qr code generator/qr-code-generator.css', '.qr-header'],
  ['json to csv/json-to-csv.css', '.json-header'],
  ['csv converter/csv-converter.css', '.csv-header'],
];

developerHeaders.forEach(([rel, selector]) => {
  const css = fs.readFileSync(path.join(root, rel), 'utf8');
  const blockMatch = css.match(new RegExp(`${selector.replace('.', '\\.')}\\s*\\{[^}]+\\}`));
  assert(blockMatch, `${rel} should define ${selector}.`);
  assert(blockMatch[0].includes('position: sticky'), `${selector} should stay fixed while scrolling.`);
  assert(blockMatch[0].includes('top: 0'), `${selector} should stick to the top of the viewport.`);
  assert(blockMatch[0].includes('z-index: 1000'), `${selector} should stay above page content.`);
});

console.log('developer header sticky tests passed');
