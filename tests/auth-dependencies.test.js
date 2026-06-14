const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// auth.js cannot establish a session without the Supabase client library and
// supabase-config.js. Any page that loads auth.js must load both, or the user
// appears logged out and cannot log in (the bug seen on the AI tool pages).
const htmlFiles = [];
function collect(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collect(full);
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  });
}
collect(root);

const broken = htmlFiles.filter((file) => {
  const html = fs.readFileSync(file, 'utf8');
  if (!/auth\.js\?v=/.test(html)) return false; // page doesn't use auth
  const hasLib = html.includes('@supabase/supabase-js@2');
  const hasConfig = html.includes('supabase-config.js');
  return !(hasLib && hasConfig);
});

assert.strictEqual(
  broken.length,
  0,
  `Every page that loads auth.js must also load the Supabase library and supabase-config.js: ${broken
    .map((f) => path.relative(root, f))
    .join(', ')}`,
);

console.log('auth dependencies tests passed');
