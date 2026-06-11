const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// Pro plan sells "No ads". AdSense must only load through ads.js, which
// skips injection when the cached auth identity is a confirmed pro/admin.

const adsPath = path.join(root, 'ads.js');
assert(fs.existsSync(adsPath), 'ads.js conditional AdSense loader should exist.');

const ads = fs.readFileSync(adsPath, 'utf8');
assert(
  ads.includes('everything_convert_auth_identity_snapshot') &&
    ads.includes("cached.plan === 'pro'") &&
    ads.includes("cached.role === 'admin'") &&
    ads.includes('pagead2.googlesyndication.com'),
  'ads.js should read the auth identity snapshot and skip AdSense for pro/admin users.',
);

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

const directAds = htmlFiles.filter((file) => fs.readFileSync(file, 'utf8').includes('pagead2.googlesyndication.com'));
assert.strictEqual(
  directAds.length,
  0,
  `No HTML page may load AdSense directly — use ads.js so Pro users stay ad-free: ${directAds
    .map((file) => path.relative(root, file))
    .join(', ')}`,
);

console.log('ads gate tests passed');
