const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const fn = fs.readFileSync(path.join(root, 'supabase', 'functions', 'ai-redeem-credit', 'index.ts'), 'utf8');

// Must authenticate via JWT and refuse anonymous callers.
assert(
  fn.includes('getUserId') && fn.includes('Please log in to use credits'),
  'ai-redeem-credit should require a logged-in user.',
);

// Cost is computed server-side, never trusted from the client.
assert(
  fn.includes("if (tool === 'remove-bg') return 25;") &&
    fn.includes("if (tool === 'transcription')") &&
    fn.includes('Math.max(5, minutes)'),
  'ai-redeem-credit should price remove-bg at 25 and transcription at 1/min (min 5), computed server-side.',
);

// Spends atomically and only unlocks the job when the spend is allowed.
assert(
  fn.includes('record_ai_credit_spend') &&
    fn.includes('p_ref') &&
    fn.includes('`job:${jobId}`') &&
    fn.includes('insufficient_credits') &&
    fn.includes('402') &&
    fn.includes("status: 'paid'"),
  'ai-redeem-credit should spend idempotently via RPC, return 402 on insufficient credits, and mark the job paid on success.',
);

// Idempotent: an already-paid job is not charged again.
assert(
  fn.includes('already_unlocked'),
  'ai-redeem-credit should not double-charge a job that is already paid/complete.',
);

console.log('ai redeem credit tests passed');
