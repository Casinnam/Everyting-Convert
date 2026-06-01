const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'usage-limit.js'), 'utf8');
const serverSource = fs.readFileSync(path.join(__dirname, '..', 'functions', 'api', 'usage-limit.js'), 'utf8');
const pricing = fs.readFileSync(path.join(__dirname, '..', 'pricing.html'), 'utf8');

function loadModule(pathname = '/index.html', protocol = 'https:') {
  const sandbox = {
    window: {
      addEventListener() {},
      location: { pathname, protocol },
    },
    document: {
      readyState: 'complete',
      addEventListener() {},
      getElementById() { return null; },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      createElement() { return { className: '', innerHTML: '', addEventListener() {}, remove() {} }; },
      body: { appendChild() {} },
      head: { appendChild() {} },
    },
    URLSearchParams,
    console,
    module: { exports: {} },
    exports: {},
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'usage-limit.js' });
  return sandbox.module.exports || sandbox.window.EverythingConvertUsageLimit;
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

const api = loadModule();

{
  const controller = api.createUsageController({
    limit: 10,
    storage: memoryStorage(),
    key: 'test-free',
    isPro: () => false,
  });

  assert.strictEqual(controller.remaining(), 10);
  for (let i = 0; i < 10; i += 1) {
    assert.strictEqual(controller.canConvert(), true);
    controller.recordConversion();
  }
  assert.strictEqual(controller.remaining(), 0);
  assert.strictEqual(controller.canConvert(), false);
}

{
  const controller = api.createUsageController({
    limit: 10,
    storage: memoryStorage(),
    key: 'test-pro',
    isPro: () => true,
  });

  for (let i = 0; i < 25; i += 1) {
    assert.strictEqual(controller.canConvert(), true);
    controller.recordConversion();
  }
  assert.strictEqual(controller.remaining(), Infinity);
}

assert(
  serverSource.includes('FREE_ACCOUNT_LIMIT = 20') &&
    serverSource.includes('GUEST_LIMIT = 10') &&
    serverSource.includes("accountType: 'free'") &&
    serverSource.includes("accountType: 'guest'"),
  'Server usage limit should distinguish 10 guest conversions and 20 free account conversions.',
);

assert(
  serverSource.includes("profile.plan === 'pro'") &&
    serverSource.includes("profile.role === 'admin'") &&
    serverSource.includes('unlimited: true'),
  'Server usage limit should bypass counts for Pro users and admins.',
);

assert(
  source.includes('Authorization: `Bearer ${token}`') &&
    source.includes('free account conversions') &&
    source.includes('guest conversions'),
  'Browser usage helper should send auth tokens and show account-specific remaining text.',
);

assert(
  pricing.includes('10 guest conversions') &&
    pricing.includes('20 conversions with a free account') &&
    pricing.includes('unlimited work'),
  'Pricing page should explain guest, free account, and Pro conversion limits.',
);

{
  const rootApi = loadModule('/index.html', 'https:');
  assert.strictEqual(rootApi.rootPrefix(), '');

  const oneLevelApi = loadModule('/pdf to word/pdf-to-word.html', 'https:');
  assert.strictEqual(oneLevelApi.rootPrefix(), '../');

  const twoLevelApi = loadModule('/tools/pdf/word.html', 'https:');
  assert.strictEqual(twoLevelApi.rootPrefix(), '../../');

  const fileApi = loadModule('/D:/projects/website_dev/Everything Convert Main/pdf to word/pdf-to-word.html', 'file:');
  assert.strictEqual(fileApi.rootPrefix(), '../');
}

console.log('usage-limit tests passed');
console.log('usage path tests passed');
