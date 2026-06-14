const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const authPage = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');

assert(
  authPage.includes('function currentMembershipLabel') &&
    authPage.includes("'Credit user'") &&
    authPage.includes('loadAccountCredits()'),
  'Auth account page should label credit-only users separately from Pro subscribers.',
);

assert(
  authPage.includes('accountCredits.textContent = String(balance)') &&
    authPage.includes('currentMembershipLabel(balance)'),
  'Auth account page should update the membership label after loading the AI credit balance.',
);

console.log('auth credit user label tests passed');
