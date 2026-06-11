const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// 1. The daily usage SQL setup must exist and define the per-day counter.
const sqlPath = path.join(root, 'supabase', 'ai-usage-setup.sql');
assert(fs.existsSync(sqlPath), 'supabase/ai-usage-setup.sql should exist.');
const sql = fs.readFileSync(sqlPath, 'utf8');
assert(
  sql.includes('ai_usage_counters') &&
    sql.includes('record_ai_usage') &&
    sql.includes('primary key (identity, day, tool)') &&
    sql.includes('revoke execute on function public.record_ai_usage'),
  'ai-usage-setup.sql should create a per-day counter keyed by (identity, day, tool) and block direct client calls to the RPC.',
);

// 2. The PDF summary edge function must enforce the limit server-side.
const fnPath = path.join(root, 'supabase', 'functions', 'ai-pdf-summary', 'index.ts');
const fn = fs.readFileSync(fnPath, 'utf8');
assert(
  fn.includes('record_ai_usage') &&
    fn.includes('limit_reached') &&
    fn.includes('429') &&
    fn.includes('USAGE_IDENTITY_SALT'),
  'ai-pdf-summary should call record_ai_usage, hash guest IPs with USAGE_IDENTITY_SALT, and return 429 with code limit_reached when over quota.',
);
assert(
  fn.includes("user.plan === 'pro'") || fn.includes('isUnlimited'),
  'ai-pdf-summary should let pro/admin accounts bypass the daily limit.',
);
assert(
  fn.includes('503'),
  'ai-pdf-summary should fail closed (503) if the usage counter is unavailable, so the OpenAI budget stays protected.',
);
assert(
  !fn.includes('suggested_questions'),
  'ai-pdf-summary prompt should no longer request suggested_questions (UI section was removed; tokens are wasted).',
);

// 3. The frontend must read the canonical language key and handle the limit.
const pagePath = path.join(root, 'ai tools', 'pdf-summary', 'index.html');
const page = fs.readFileSync(pagePath, 'utf8');
assert(
  page.includes('everything_convert_language') && !page.includes('everythingConvertLanguage'),
  'pdf-summary page should read the shared everything_convert_language localStorage key (the camelCase key was a bug).',
);
assert(
  page.includes('limit_reached') && page.includes('limitCard') && page.includes('pricing.html'),
  'pdf-summary page should show the upgrade card with a pricing link when the daily limit is reached.',
);
assert(
  page.includes('access_token'),
  'pdf-summary page should send the logged-in user access token so account/Pro limits apply instead of the guest limit.',
);

// 4. Pricing page should advertise the AI benefit on both plans.
const pricing = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');
assert(
  pricing.includes('Unlimited AI PDF Summary') && pricing.includes('AI PDF Summary — 10 free per day'),
  'pricing.html should list the AI PDF Summary benefit on the Free and Pro plans.',
);

console.log('ai usage limit tests passed');
