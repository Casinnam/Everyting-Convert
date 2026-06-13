const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const checkout = fs.readFileSync(path.join(root, 'supabase', 'functions', 'ai-checkout', 'index.ts'), 'utf8');
const webhook = fs.readFileSync(path.join(root, 'supabase', 'functions', 'ai-webhook', 'index.ts'), 'utf8');

// ai-checkout must offer the four packs at the agreed prices/credits and
// require a logged-in user before creating a pack checkout.
assert(
  checkout.includes('starter: { amount: 299, credits: 30') &&
    checkout.includes('standard: { amount: 699, credits: 100') &&
    checkout.includes('power: { amount: 1499, credits: 250') &&
    checkout.includes('business: { amount: 2999, credits: 600'),
  'ai-checkout PACKS should define starter/standard/power/business at the agreed prices and credits.',
);
assert(
  checkout.includes('Please log in to buy credits') &&
    checkout.includes("'metadata[kind]': 'credit_pack'") &&
    checkout.includes("'metadata[credits]'") &&
    checkout.includes("'metadata[user_id]'"),
  'Pack checkout should require login and tag the session with kind/credits/user_id metadata.',
);
// The existing per-job checkout flow must remain.
assert(
  checkout.includes('const PRICES') && checkout.includes("'remove-bg'") && checkout.includes("'transcription'"),
  'ai-checkout should keep the per-job PRICES flow for transcription and background removal.',
);

// ai-webhook must grant credits on a paid pack session, idempotently, and
// keep the job-paid path for tool purchases.
assert(
  webhook.includes('grant_ai_credits') &&
    webhook.includes('`pack:${sessionId}`') &&
    webhook.includes("metadata?.kind === 'credit_pack'") &&
    webhook.includes('dbUpdateJobBySession'),
  'ai-webhook should grant credits for credit_pack sessions (idempotent on session id) and still mark tool jobs paid.',
);

console.log('ai credit packs tests passed');
