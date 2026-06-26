// Invariants for the tool-review feature: a star rating + optional comment left
// from the shared download card, stored privately and surfaced only in the admin
// dashboard.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// ── Frontend: the widget lives in the ONE shared card (usage-limit.js) ──
const usage = read('usage-limit.js');
assert(usage.includes('buildReviewWidget'), 'usage-limit.js should build the review widget');
assert(usage.includes("'/api/tool-review'"), 'review widget should POST to /api/tool-review');
assert(usage.includes('ec_reviewed_'), 'review should be shown at most once per tool (localStorage flag)');
assert(usage.includes('resolveToolId'), 'review should resolve a clean tool id');
assert(/buildReviewWidget\(pick\)/.test(usage), 'showDownloadCard should append the review widget');

// The widget must be wired into the shared card, not duplicated per page.
const reviewCallers = ['ebook converter/ebook-converter.html', 'image converter/image-converter.html']
  .map(read).filter((html) => html.includes('buildReviewWidget'));
assert.strictEqual(reviewCallers.length, 0, 'tool pages must not hand-roll the review widget — it comes from the shared card');

// ── Backend: validates the rating and stays silent on failure ──
const api = read('functions/api/tool-review.js');
assert(api.includes('record_tool_review'), 'API should call the record_tool_review RPC');
assert(/rating < 1 \|\| rating > 5/.test(api), 'API should reject ratings outside 1-5');
assert(api.includes('.slice(0, 500)'), 'API should cap comment length');
assert(api.includes('SUPABASE_SERVICE_ROLE_KEY') || api.includes('serviceKey'), 'API writes with the service role');

// ── Database: private storage + admin-only reads ──
const sql = read('supabase/tool-reviews.sql');
assert(sql.includes('create table if not exists public.tool_reviews'), 'tool_reviews table must exist');
assert(sql.includes('enable row level security'), 'tool_reviews must have RLS enabled');
assert(!/create policy/i.test(sql), 'no public RLS policies — reads go through admin security-definer functions');
assert(/grant execute on function public.record_tool_review[\s\S]*to service_role/.test(sql), 'record_tool_review is service-role only');
['admin_tool_reviews', 'admin_tool_review_stats', 'admin_set_review_hidden'].forEach((fn) => {
  assert(sql.includes(fn), `SQL should define ${fn}`);
});
assert((sql.match(/public\.is_admin\(\)/g) || []).length >= 3, 'admin read/action functions must gate on is_admin()');

// ── Admin dashboard surfaces reviews + comments ──
const admin = read('admin.html');
assert(admin.includes('reviewsPanel'), 'admin should have a reviews panel');
assert(admin.includes("rpc('admin_tool_reviews'"), 'admin should fetch reviews via admin_tool_reviews');
assert(admin.includes("rpc('admin_tool_review_stats'"), 'admin should fetch the rating summary');
assert(admin.includes("rpc('admin_set_review_hidden'"), 'admin should be able to hide a review');
assert(/loadReviews\(\);/.test(admin), 'admin should load reviews on init');

console.log('tool-reviews tests passed');
