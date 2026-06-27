const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// Both credit-eligible tool pages must offer a "Use credits" path alongside
// the one-time Stripe payment, loading the shared helper and falling back to
// a buy-credits link when the balance is short.
const pages = {
  'ai tools/transcription/index.html': { redeem: true },
  'ai tools/background-remover/index.html': { redeem: true },
};

Object.keys(pages).forEach((rel) => {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  assert(html.includes('ai-credits.js?v='), `${rel} should load ai-credits.js.`);
  assert(html.includes('id="creditBtn"'), `${rel} should render a credit button in the paywall.`);
  assert(html.includes('credit-policy-note'), `${rel} should explain AI credit usage before payment.`);
  assert(
    html.includes('credits.redeem(') && html.includes('setupCreditOption'),
    `${rel} should redeem with credits and set up the credit option on preview.`,
  );
  assert(
    html.includes('pricing.html#credit-packs'),
    `${rel} should link to the pack purchase section when credits are short.`,
  );
  // The one-time Stripe pay button must still be present.
  assert(html.includes('id="payBtn"'), `${rel} should keep the one-time Stripe pay button.`);
});

// Background removal is a flat 15-credit cost on the client display.
const bg = fs.readFileSync(path.join(root, 'ai tools/background-remover/index.html'), 'utf8');
assert(bg.includes('CREDIT_COST = 15'), 'background-remover should show a 15-credit cost.');

// Transcription cost scales with duration (1/min, min 5).
const tr = fs.readFileSync(path.join(root, 'ai tools/transcription/index.html'), 'utf8');
assert(
  tr.includes('Math.max(5, Math.ceil((currentDuration || 0) / 60))'),
  'transcription should price credits at 1 per minute, minimum 5.',
);

assert(
  tr.includes('txtUrl = data.txt_url') && tr.includes('srtUrl = data.srt_url'),
  'transcription should store paid result URLs for the TXT and SRT download buttons.',
);

const pdfSummary = fs.readFileSync(path.join(root, 'ai tools/pdf-summary/index.html'), 'utf8');
assert(
  pdfSummary.includes('credit-policy-note') && pdfSummary.includes('extra summaries after the free limit use 1 AI credit'),
  'PDF Summary should explain that credits are only used after the daily free limit.',
);

console.log('ai tool credit UI tests passed');
