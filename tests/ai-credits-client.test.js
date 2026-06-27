const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const helper = fs.readFileSync(path.join(root, 'ai-credits.js'), 'utf8');
const pricing = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');

// Shared helper exposes the credit API and the four packs.
assert(
  helper.includes('window.EverythingConvertCredits') &&
    helper.includes('getBalance') && helper.includes('redeem') && helper.includes('buyPack') &&
    helper.includes("ai_credit_balance") &&
    helper.includes('/ai-redeem-credit') &&
    helper.includes('/ai-checkout'),
  'ai-credits.js should expose getBalance/redeem/buyPack wired to the right endpoints.',
);
assert(
  helper.includes('starter:') && helper.includes('standard:') && helper.includes('power:') && helper.includes('business:'),
  'ai-credits.js should know all four packs.',
);

// Pricing page renders the pack purchase section and loads the helper.
assert(
  pricing.includes('ai-credits.js?v=') &&
    pricing.includes('id="credit-packs"') &&
    pricing.includes('data-buy-pack="starter"') &&
    pricing.includes('data-buy-pack="standard"') &&
    pricing.includes('data-buy-pack="power"') &&
    pricing.includes('data-buy-pack="business"') &&
    pricing.includes('id="creditBalance"'),
  'pricing.html should render the four credit packs, a balance line, and load ai-credits.js.',
);
assert(
  pricing.includes('15 credits per HD image') && pricing.includes('1 credit per minute'),
  'pricing.html should explain what credits unlock.',
);

// Account page shows the user's own balance so they can check it any time.
const auth = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');
assert(
  auth.includes('ai-credits.js?v=') &&
    auth.includes('id="accountCredits"') &&
    auth.includes('loadAccountCredits') &&
    auth.includes('pricing.html#credit-packs'),
  'auth.html account panel should display the credit balance and link to buy more.',
);

console.log('ai credits client tests passed');
