const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const authJs = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const authHtml = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');

assert(
  authJs.includes('function accountLabel') &&
    !authJs.includes("`${shortName(displayName())} | ${formatPlan()}`"),
  'Header auth labels should not append a temporary Checking plan while the profile is loading.',
);

assert(
  !authHtml.includes("element.dataset.i18nKey = 'checking';\n                    element.textContent = 'Checking...';"),
  'Auth page should not force data-auth-state back to Checking after auth.js renders the account label.',
);

function htmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html') || entry.name.endsWith('.htm')) results.push(full);
  }
  return results;
}

const badStaticMarkers = [
  '\uFFFD',
  'Espa챰ol',
  'Fran챌ais',
  '??�뎅',
  '?혵',
  '횄짹',
  '횄짠',
];

for (const file of htmlFiles(root)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const marker of badStaticMarkers) {
    assert(!source.includes(marker), `${path.relative(root, file)} should not contain static mojibake marker: ${marker}`);
  }
  if (source.includes('data-language="ko"')) {
    assert(
      /data-language="ko">한국어<\/button>/.test(source),
      `${path.relative(root, file)} should render the Korean language option before JavaScript runs.`,
    );
  }
}

console.log('loading and flash regression tests passed');
