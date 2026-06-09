const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const adsTxt = fs.readFileSync(path.join(root, 'ads.txt'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pricing = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');
const pdfWord = fs.readFileSync(path.join(root, 'pdf to word', 'pdf-to-word.html'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'admin.html'), 'utf8');
const oldIndex = fs.readFileSync(path.join(root, 'everything convert', 'index.html'), 'utf8');

assert(
  robots.includes('Sitemap: https://www.everythingconvert.com/sitemap.xml') &&
    robots.includes('Disallow: /admin.html') &&
    robots.includes('Disallow: /auth.html') &&
    robots.includes('Disallow: /everything%20convert/') &&
    robots.includes('Disallow: /node_modules/'),
  'robots.txt should expose the sitemap and block private account/admin pages.',
);

assert(
  sitemap.includes('<loc>https://www.everythingconvert.com/</loc>') &&
    sitemap.includes('<loc>https://www.everythingconvert.com/pdf%20to%20word/pdf-to-word.html</loc>') &&
    sitemap.includes('<loc>https://www.everythingconvert.com/qr%20code%20generator/qr-code-generator.html</loc>'),
  'sitemap.xml should include the homepage and public tool pages.',
);

assert(
  adsTxt.trim() === 'google.com, pub-7281685131923147, DIRECT, f08c47fec0942fa0',
  'ads.txt should publish the AdSense publisher ID at the site root.',
);

assert(
  index.includes('<!-- SEO:START -->') &&
    index.includes('<link rel="canonical" href="https://www.everythingconvert.com/">') &&
    index.includes('application/ld+json') &&
    index.includes('"@type": "WebSite"') &&
    !index.includes('"@type": "SearchAction"'),
  'Homepage should include canonical metadata and structured data.',
);

assert(
  pricing.includes('Choose EverythingConvert plans') &&
    pricing.includes('<meta property="og:title" content="Pricing - EverythingConvert">'),
  'Pricing page should include a search description and Open Graph title.',
);

assert(
  pdfWord.includes('PDF to Word Converter - EverythingConvert') &&
    pdfWord.includes('<link rel="canonical" href="https://www.everythingconvert.com/pdf%20to%20word/pdf-to-word.html">'),
  'PDF to Word page should include tool-specific SEO metadata.',
);

assert(
  auth.includes('<meta name="robots" content="noindex, nofollow">') &&
    admin.includes('<meta name="robots" content="noindex, nofollow">') &&
    oldIndex.includes('<meta name="robots" content="noindex, nofollow">'),
  'Account, admin, and duplicate legacy pages should be noindex.',
);

assert(
  auth.includes('<title>EverythingConvert - Login</title>') &&
    !/<title>[^<]*\/title>/.test(auth),
  'Auth page should have a valid closing title tag so the page body renders.',
);

console.log('seo basics tests passed');
