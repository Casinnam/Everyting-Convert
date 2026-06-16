const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'pdf to excel', 'pdf-to-excel.html'), 'utf8');

// New paid mode for AI table detection (GPT-4o), 2 credits/page.
assert(/<option value="ai"[^>]*>[^<]*2 credits\/page/i.test(page), 'PDF to Excel should offer an AI mode priced at 2 credits/page.');
assert(page.includes('ai-credits.js'), 'Page should load the credit helper.');

// Reuses the deployed Smart OCR vision function + credit redeem (no new backend).
assert(page.includes("'/ai-ocr'") || page.includes('/ai-ocr'), 'AI mode should call the ai-ocr vision function.');
assert(page.includes("mode: 'preview'") && page.includes("mode: 'full'"), 'AI mode should preview then process each page.');
assert(page.includes('credits.redeem(') , 'AI mode should charge credits via redeem.');
assert(page.includes('getBalance(') && page.includes('insufficient') === false ? true : page.includes('getBalance('),
  'AI mode should check the balance before charging.');

// Builds a real .xlsx from the detected tables and stays free for the basic mode.
assert(page.includes('tablesToRows') && page.includes('XLSX.utils.aoa_to_sheet'), 'AI tables should be written into the xlsx workbook.');
assert(page.includes("if (mode === 'ai')"), 'startConversion should branch to the AI flow.');
assert(page.includes('Standard text extraction (free)'), 'The standard extraction must remain free.');

// Free/Pro paths untouched (no credits for them).
assert(page.includes('runAiConversion'), 'AI conversion should be isolated in its own function.');

console.log('pdf-to-excel AI tests passed');
