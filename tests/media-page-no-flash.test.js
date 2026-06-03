const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const mediaPages = [
  path.join('media converter', 'media-converter.html'),
  path.join('gif converter', 'gif-converter.html'),
  path.join('image converter', 'image-converter.html'),
];
const binarySafePages = [
  path.join('image to pdf', 'image-to-pdf.html'),
];

for (const relativePath of mediaPages) {
  const html = fs.readFileSync(path.join(root, relativePath), 'utf8');
  assert(
    html.includes('<body class="ec-tool-page'),
    `${relativePath} should apply the redesigned tool-page class before scripts run to prevent first-paint flicker.`,
  );
  assert(
    html.includes('tool-page-redesign.css?v=20260602a'),
    `${relativePath} should request the latest redesign CSS cache-busting version.`,
  );
}

for (const relativePath of binarySafePages) {
  const html = fs.readFileSync(path.join(root, relativePath));
  assert(
    html.includes(Buffer.from('<body class="ec-tool-page')),
    `${relativePath} should apply the redesigned tool-page class before scripts run to prevent first-paint flicker.`,
  );
  assert(
    html.includes(Buffer.from('tool-page-redesign.css?v=20260602a')),
    `${relativePath} should request the latest redesign CSS cache-busting version.`,
  );
}

const redesignCss = fs.readFileSync(path.join(root, 'tool-page-redesign.css'), 'utf8');
assert(
  redesignCss.includes('.ec-tool-page header:not(.ec-unified-header)') &&
    redesignCss.includes('visibility: hidden') &&
    redesignCss.includes('min-height: 4.4rem'),
  'Redesigned tool pages should hide the legacy header until tools-menu.js replaces it with the unified header.',
);

console.log('media page no-flash tests passed');
