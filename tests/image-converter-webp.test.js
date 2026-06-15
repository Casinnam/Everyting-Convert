const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'image converter', 'image-converter.html'), 'utf8');

// The core bug: convert() used the mode's fixed format (always 'png' in the
// generic converter), so choosing WEBP in the dropdown was ignored and the
// output was a (larger) PNG. It must use the selected format.
assert(
  /const outputFormat = formatSelect\.value/.test(page),
  'convert() must use the chosen output format (formatSelect.value), not the mode default.',
);
assert(
  !/const outputFormat = currentMode\.format;/.test(page),
  'convert() must not fall back to currentMode.format as the primary output format.',
);

// WEBP must be a real output option and encoded as image/webp.
assert(page.includes("format === 'webp' ? 'image/webp'"), 'mimeFor must map webp to image/webp.');

// New preset modes requested: PNG to WEBP and JPG to WEBP, both outputting webp.
assert(/'png-webp':\s*\{[^}]*format:\s*'webp'/.test(page), 'A PNG to WEBP mode (format webp) should exist.');
assert(/'jpg-webp':\s*\{[^}]*format:\s*'webp'/.test(page), 'A JPG to WEBP mode (format webp) should exist.');

// The new modes should be discoverable in the navigation + homepage.
const menu = fs.readFileSync(path.join(root, 'tools-menu.js'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
['png-webp', 'jpg-webp'].forEach((mode) => {
  assert(menu.includes(`mode=${mode}`), `tools-menu should link the ${mode} mode.`);
  assert(home.includes(`mode=${mode}`), `homepage should link the ${mode} mode.`);
});

console.log('image converter webp tests passed');
