const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'usage-limit.js'), 'utf8');

function loadModule() {
  const sandbox = {
    window: { addEventListener() {} },
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

console.log('usage-limit tests passed');
