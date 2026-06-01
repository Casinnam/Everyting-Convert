const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pricing = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');

assert(
  pricing.includes('saved conversion history') || pricing.includes('Pro conversion history'),
  'Pricing page should mention saved conversion history as a Pro benefit.',
);

assert(
  pricing.includes('My Conversions') && pricing.includes('More tools will be connected to history'),
  'Pricing page should explain where Pro users can review conversion history.',
);

assert(
  pricing.includes('<a class="plan-button secondary-plan" href="contact.html">Contact us</a>'),
  'Business Contact us button should link to the site contact page.',
);

console.log('pricing history notice tests passed');
