const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const auth = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');

[
  'Manage features',
  'with your account',
  'Login</button>',
  'Sign up</button>',
  'Continue with Gmail',
  'or continue with email',
  'Email</label>',
  'Password</label>',
  'Remember my email',
  'Display name:',
  'Membership level:',
  'Current status:',
].forEach((text) => {
  assert(auth.includes(text), `Auth page should include readable text: ${text}`);
});

const forbiddenVisibleText = [
  '??/button>',
  '??/label>',
  '?/button>',
  '?/label>',
  '\uFFFD',
  '占쏙옙',
  '??�뎅',
  'Espa챰ol',
  'Fran챌ais',
];

forbiddenVisibleText.forEach((text) => {
  assert(!auth.includes(text), `Auth page should not include mojibake text: ${text}`);
});

console.log('auth page content tests passed');
