const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const api = fs.readFileSync(path.join(root, 'functions', 'api', 'conversion-history.js'), 'utf8');
const helper = fs.readFileSync(path.join(root, 'conversion-history.js'), 'utf8');
const qrHtml = fs.readFileSync(path.join(root, 'qr code generator', 'qr-code-generator.html'), 'utf8');
const qrJs = fs.readFileSync(path.join(root, 'qr code generator', 'qr-code-generator.js'), 'utf8');
const jsonHtml = fs.readFileSync(path.join(root, 'json to csv', 'json-to-csv.html'), 'utf8');
const jsonJs = fs.readFileSync(path.join(root, 'json to csv', 'json-to-csv.js'), 'utf8');

assert(
  api.includes('export async function onRequestGet') && api.includes('export async function onRequestPost'),
  'Conversion history API should support GET and POST.',
);

assert(
  api.includes('SUPABASE_SERVICE_ROLE_KEY') && api.includes('/auth/v1/user'),
  'Conversion history API should verify the user token and use the service role key server-side.',
);

assert(
  api.includes("profile.plan === 'pro'") && api.includes("profile.role === 'admin'"),
  'Conversion history API should enforce Pro/Admin access.',
);

assert(
  api.includes('conversion_history') && api.includes('user_id: user.id'),
  'Conversion history API should insert user-owned conversion_history rows.',
);

assert(
  helper.includes('window.EverythingConvertHistory') &&
    helper.includes('recordConversion') &&
    helper.includes('fetchHistory'),
  'Browser helper should expose record and fetch methods.',
);

assert(
  helper.includes('Authorization: `Bearer ${token}`') && helper.includes('not_pro'),
  'Browser helper should send the Supabase token and skip non-Pro users.',
);

assert(
  qrHtml.includes('../conversion-history.js') && qrJs.includes("tool_id: 'qr-code-generator'"),
  'QR Code Generator should load the helper and record successful QR activity.',
);

assert(
  jsonHtml.includes('../conversion-history.js') && jsonJs.includes("tool_id: 'json-to-csv'"),
  'JSON to CSV should load the helper and record successful CSV activity.',
);

console.log('conversion history API tests passed');
