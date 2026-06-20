const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const auth = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');
const authJs = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');

[
  'Welcome to',
  'EverythingConvert</span>',
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

assert(
  auth.includes("const cachedPlan = cached.plan === 'pro' ? 'Pro' : '';") &&
    auth.includes("accountPlan.textContent = cachedRole ? `${cachedPlan || 'Free'} | ${cachedRole}` : cachedPlan;"),
  'Auth page should show a cached confirmed Pro/Admin account status while refreshing profile data.',
);

assert(
  authJs.includes('profileResolved: false') &&
    authJs.includes('state.profileResolved = true;') &&
    authJs.includes("cache.plan = state.profile.plan === 'pro' ? 'pro' : '';"),
  'Auth script should distinguish fallback profile data from resolved Supabase profile data.',
);

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
