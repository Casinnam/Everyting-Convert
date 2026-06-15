const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// ── SQL: admin-gated credit functions ──
const sql = read('supabase/admin-credits.sql');
['admin_credit_balances', 'admin_credit_ledger', 'admin_adjust_credits'].forEach((fn) => {
  assert(sql.includes(`function public.${fn}`), `admin-credits.sql should define ${fn}.`);
});
assert(sql.includes('public.is_admin()'), 'Admin credit functions must be gated by is_admin().');
assert(sql.includes('security definer'), 'Admin credit functions should be SECURITY DEFINER.');
assert(/current_balance \+ p_amount < 0/.test(sql), 'admin_adjust_credits must prevent negative balances.');
assert(sql.includes("grant execute on function public.admin_adjust_credits(uuid, integer, text) to authenticated"),
  'admin_adjust_credits should be callable by authenticated admins.');

// ── admin.html UI wiring ──
const admin = read('admin.html');
assert(admin.includes("rpc('admin_credit_balances')"), 'Admin page should load all balances.');
assert(admin.includes("rpc('admin_credit_ledger'") && admin.includes("rpc('admin_adjust_credits'"),
  'Admin page should read the ledger and apply adjustments.');
assert(admin.includes('function isCreditUser') && admin.includes("profile.plan !== 'pro'"),
  'Credit user must be a derived status (free plan + positive balance), not a stored plan.');
assert(admin.includes('value="credit">Credit users'), 'Plan filter should offer Credit users.');
assert(admin.includes('badge credit'), 'Credit users should get a credit badge.');
assert(admin.includes('<th>Credits</th>') && admin.includes('data-credits'),
  'The members table should have a Credits column with a manage action.');
assert(admin.includes('id="creditModal"') && admin.includes('applyCreditAdjust'),
  'Admin page should include the credit management modal.');
assert(admin.includes("['Credit users', profiles.filter(isCreditUser).length]"),
  'Stats should count credit users.');

// ── Plan enum must stay free/pro (credit is derived, not stored) ──
const setup = read('supabase-setup.sql');
assert(/plan[^\n]*check \(plan in \('free', 'pro'\)\)/.test(setup) || setup.includes("plan in ('free', 'pro')"),
  'profiles.plan should remain free/pro — credit user is derived, never stored as a plan.');

console.log('admin credits tests passed');
