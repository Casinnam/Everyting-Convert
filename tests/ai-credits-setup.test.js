const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sqlPath = path.join(root, 'supabase', 'ai-credits-setup.sql');
assert(fs.existsSync(sqlPath), 'supabase/ai-credits-setup.sql should exist.');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Ledger table with idempotency + RLS.
assert(
  sql.includes('create table if not exists public.ai_credit_entries') &&
    sql.includes('ref         text unique') &&
    sql.includes('enable row level security'),
  'ai_credit_entries should be an idempotent (unique ref) ledger table with RLS.',
);

// Balance is readable by the logged-in user; mutations are not.
assert(
  sql.includes('function public.ai_credit_balance()') &&
    sql.includes('grant execute on function public.ai_credit_balance() to authenticated'),
  'ai_credit_balance() should be callable by authenticated users.',
);

// Spend must be atomic (advisory lock), deny when short, and service-role only.
assert(
  sql.includes('function public.record_ai_credit_spend') &&
    sql.includes('p_ref text default null') &&
    sql.includes('pg_advisory_xact_lock') &&
    sql.includes('and ref = p_ref') &&
    sql.includes('return query select current_balance, false;') &&
    sql.includes('grant execute on function public.record_ai_credit_spend(uuid, integer, text, text) to service_role'),
  'record_ai_credit_spend should lock per user, be idempotent by ref, deny when balance is short, and be service-role only.',
);
assert(
  sql.includes('revoke execute on function public.record_ai_credit_spend(uuid, integer, text, text) from authenticated'),
  'record_ai_credit_spend must not be callable directly by the browser.',
);

// Grant is idempotent and service-role only.
assert(
  sql.includes('function public.grant_ai_credits') &&
    sql.includes('on conflict (ref) do nothing') &&
    sql.includes('grant execute on function public.grant_ai_credits(uuid, integer, text, text) to service_role'),
  'grant_ai_credits should be idempotent on ref and service-role only.',
);

// New signups get a 10-credit bonus via a profiles trigger, with backfill.
assert(
  sql.includes('function public.grant_signup_credits') &&
    sql.includes('values (new.id, 10,') &&
    sql.includes('create trigger on_profile_created_grant_credits') &&
    sql.includes("select id, 10, 'signup', 'signup:' || id"),
  'A profiles trigger should grant 10 signup credits, and existing users should be backfilled.',
);

console.log('ai credits setup tests passed');
