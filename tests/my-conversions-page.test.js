const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'my-conversions.html'), 'utf8');
const authPage = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');

assert(
  page.includes('My Conversions') && page.includes('conversion_history'),
  'My Conversions page should exist and query conversion_history.',
);

assert(
  page.includes('auth.isPro()') && page.includes('auth.isAdmin()'),
  'My Conversions page should only show history to Pro users or admins.',
);

assert(
  page.includes('Pro membership required') && page.includes('pricing.html'),
  'Free users should see an upgrade path instead of conversion history.',
);

assert(
  page.includes("href=\"auth.html?next=my-conversions.html\""),
  'Logged-out users should be able to log in and return to My Conversions.',
);

assert(
  page.includes('Files are not stored here yet'),
  'My Conversions should clearly say this first version stores records only.',
);

assert(
  authPage.includes('href="my-conversions.html"'),
  'Account page should link to My Conversions.',
);

console.log('my conversions page tests passed');
