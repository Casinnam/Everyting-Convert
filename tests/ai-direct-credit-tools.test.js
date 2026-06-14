const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const spendFn = fs.readFileSync(path.join(root, 'supabase', 'functions', 'ai-spend-credit', 'index.ts'), 'utf8');
const pdfSummaryFn = fs.readFileSync(path.join(root, 'supabase', 'functions', 'ai-pdf-summary', 'index.ts'), 'utf8');
const pdfSummaryPage = fs.readFileSync(path.join(root, 'ai tools', 'pdf-summary', 'index.html'), 'utf8');
const qrPage = fs.readFileSync(path.join(root, 'qr code generator', 'qr-code-generator.html'), 'utf8');
const qrScript = fs.readFileSync(path.join(root, 'qr code generator', 'qr-code-generator.js'), 'utf8');
const credits = fs.readFileSync(path.join(root, 'ai-credits.js'), 'utf8');

assert(
  spendFn.includes("'qr-premium': 5") &&
    spendFn.includes('record_ai_credit_spend') &&
    spendFn.includes('p_ref') &&
    spendFn.includes('insufficient_credits'),
  'ai-spend-credit should support direct qr-premium spends at 5 credits with idempotency refs.',
);

assert(
  credits.includes('async function spend(tool, ref)') &&
    credits.includes('/ai-spend-credit') &&
    credits.includes('window.EverythingConvertCredits = { getBalance, redeem, spend, buyPack'),
  'ai-credits.js should expose spend(tool, ref) for direct credit tools.',
);

assert(
  pdfSummaryFn.includes('p_tool: \'pdf-summary-extra\'') &&
    pdfSummaryFn.includes('p_cost: 1') &&
    pdfSummaryFn.includes('use_credit') &&
    pdfSummaryPage.includes('limitCreditBtn') &&
    pdfSummaryPage.includes('1크레딧 사용'),
  'PDF Summary should allow logged-in users to spend 1 credit after the free daily limit.',
);

assert(
  qrPage.includes('../ai-credits.js') &&
    qrPage.includes('5 credits') &&
    qrScript.includes('ensurePremiumUnlocked') &&
    qrScript.includes("credits.spend('qr-premium'") &&
    qrScript.includes('Unlocking premium QR features with 5 credits'),
  'QR premium logo/frame/SVG/PDF features should unlock through the 5-credit spend flow.',
);

console.log('ai direct credit tools tests passed');
