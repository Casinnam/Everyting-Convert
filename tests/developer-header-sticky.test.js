const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const developerHeaders = [
  ['qr code generator/qr-code-generator.css', '.qr-header'],
  ['json to csv/json-to-csv.css', '.json-header'],
  ['csv converter/csv-converter.css', '.csv-header'],
];

// `overflow-x: hidden` on html/body turns them into scroll containers, which
// silently breaks `position: sticky` on the header (verified: the header
// scrolls away on every page). `overflow-x: clip` still prevents horizontal
// scroll but keeps the sticky header pinned. Guard against a regression.
const globalCss = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const htmlBlock = globalCss.match(/\bhtml\s*\{[^}]*\}/);
const bodyBlock = globalCss.match(/\bbody\s*\{[^}]*\}/);
assert(htmlBlock && bodyBlock, 'styles.css should define html and body blocks.');
[['html', htmlBlock[0]], ['body', bodyBlock[0]]].forEach(([name, block]) => {
  assert(!/overflow-x:\s*hidden/.test(block), `${name} must not use overflow-x: hidden (it breaks the sticky header).`);
  assert(/overflow-x:\s*clip/.test(block), `${name} should use overflow-x: clip so the sticky header stays pinned.`);
});

developerHeaders.forEach(([rel, selector]) => {
  const css = fs.readFileSync(path.join(root, rel), 'utf8');
  const blockMatch = css.match(new RegExp(`${selector.replace('.', '\\.')}\\s*\\{[^}]+\\}`));
  assert(blockMatch, `${rel} should define ${selector}.`);
  assert(blockMatch[0].includes('position: sticky'), `${selector} should stay fixed while scrolling.`);
  assert(blockMatch[0].includes('top: 0'), `${selector} should stick to the top of the viewport.`);
  assert(blockMatch[0].includes('z-index: 1000'), `${selector} should stay above page content.`);
});

console.log('developer header sticky tests passed');
