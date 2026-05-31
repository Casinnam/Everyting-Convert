const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'auth.js'), 'utf8');

assert(
  source.includes("client.auth.signOut({ scope: 'local' })"),
  'Logout should use Supabase local scope so the current browser session ends quickly.',
);

assert(
  source.includes('if (signingOut) return state;') && source.includes('if (signingOut) return;'),
  'Logout should prevent overlapping auth refresh work while sign-out is in progress.',
);

assert(
  source.includes("!state.profile.plan) return translateAuth('authChecking')"),
  'Logged-in users should see Checking instead of a temporary Free plan before profile data resolves.',
);

assert(
  source.includes("plan: cached && cached.plan ? cached.plan : ''"),
  'Fallback profiles should use cached plan data and avoid defaulting logged-in users to Free.',
);

function loadAuth(pathname, protocol = 'https:') {
  const sandbox = {
    window: {
      location: {
        pathname,
        protocol,
        href: `${protocol}//example.test${pathname}`,
        search: '',
        hash: '',
      },
      addEventListener() {},
      dispatchEvent() {},
      localStorage: {
        getItem() { return null; },
        setItem() {},
        removeItem() {},
      },
    },
    document: {
      readyState: 'loading',
      addEventListener() {},
      querySelectorAll() { return []; },
    },
    setTimeout,
    URL,
    URLSearchParams,
    console,
    CustomEvent: function CustomEvent(type, init) {
      return { type, detail: init && init.detail };
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'auth.js' });
  return sandbox.window.EverythingConvertAuth;
}

{
  const auth = loadAuth('/index.html');
  assert.strictEqual(auth.getAuthPath(), 'auth.html');
}

{
  const auth = loadAuth('/pdf to word/pdf-to-word.html');
  assert.strictEqual(auth.getAuthPath(), '../auth.html');
}

{
  const auth = loadAuth('/tools/pdf/word.html');
  assert.strictEqual(auth.getAuthPath(), '../../auth.html');
}

{
  const auth = loadAuth('/D:/projects/website_dev/Everything Convert Main/pdf to word/pdf-to-word.html', 'file:');
  assert.strictEqual(auth.getAuthPath(), '../auth.html');
  assert.strictEqual(auth.getAuthRedirectUrl(), 'http://127.0.0.1:8016/auth.html');
}

console.log('auth path tests passed');
