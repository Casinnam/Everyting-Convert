const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const menu = fs.readFileSync(path.join(root, 'tools-menu.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert(
  menu.includes('[data-auth-account][style*="display:none"]') &&
    menu.includes('[data-auth-account][style*="display: none"]'),
  'Hidden account avatar containers must stay hidden even when .ec-user has display styles.',
);

assert(
  menu.includes('[data-admin-only][style*="display:none"]') &&
    menu.includes('[data-admin-only][style*="display: none"]'),
  'Admin-only links must stay hidden even when dropdown link styles use display:flex.',
);

assert(
  index.includes('tools-menu.js?v=nav-20260620c'),
  'The homepage should load the cache-busted tools-menu.js version that includes avatar visibility fixes.',
);

console.log('auth avatar visibility tests passed');
