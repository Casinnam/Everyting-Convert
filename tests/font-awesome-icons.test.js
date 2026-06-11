const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// The unified header injected by tools-menu.js renders its hamburger button,
// globe, and dropdown group icons with Font Awesome classes (fa-bars,
// fa-globe, ...). Any page that loads tools-menu.js without the Font Awesome
// stylesheet shows an empty square instead of the mobile menu icon.

const htmlFiles = [];
function collectHtml(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full);
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  });
}
collectHtml(root);

const missing = htmlFiles.filter((file) => {
  const html = fs.readFileSync(file, 'utf8');
  return html.includes('tools-menu.js') && !html.includes('font-awesome');
});

assert.strictEqual(
  missing.length,
  0,
  `Every page that loads tools-menu.js must also load the Font Awesome stylesheet, otherwise the mobile hamburger icon renders as an empty box: ${missing
    .map((file) => path.relative(root, file))
    .join(', ')}`,
);

console.log('font awesome icon tests passed');
