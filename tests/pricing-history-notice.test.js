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
  pricing.includes('class="team-note"') && pricing.includes('href="contact.html">Contact us</a>'),
  'Team/business interest should route to the contact page via the team note.',
);

assert(
  !pricing.includes('Enhanced PDF table detection') && !pricing.includes('Larger file workflows'),
  'Pricing page must not advertise unimplemented Pro features (table detection, larger files).',
);

assert(
  pricing.includes('data-billing="yearly"') &&
    pricing.includes("plan: billing === 'yearly' ? 'pro_yearly' : 'pro_monthly'"),
  'Pricing page should offer a working monthly/yearly billing toggle wired to checkout.',
);

assert(
  pricing.includes('AI tools, paid only when you need the final result'),
  'Pricing page should include a distinct pay-as-you-go AI tools section.',
);

assert(
  pricing.includes('$2.99 full transcript + SRT')
    && pricing.includes('$1.99 HD transparent PNG')
    && pricing.includes('$2.99 HD photo + print sheet'),
  'Pricing page should show the current one-time AI tool prices.',
);

assert(
  pricing.includes('Pro includes unlimited AI PDF Summary')
    && pricing.includes('some AI tools remain one-time purchases'),
  'Pricing page should clarify which AI benefits are included in Pro.',
);

console.log('pricing history notice tests passed');
