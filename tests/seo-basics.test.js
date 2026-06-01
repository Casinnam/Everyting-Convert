const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
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
  index.includes('<!-- SEO:START -->') &&
    index.includes('<link rel="canonical" href="https://www.everythingconvert.com/">') &&
    index.includes('application/ld+json') &&
    index.includes('"@type": "WebSite"') &&
    !index.includes('"@type": "SearchAction"'),
  'Homepage should include canonical metadata and structured data.',
);

assert(
  pricing.includes('Choose Everything Convert plans') &&
    pricing.includes('<meta property="og:title" content="Pricing - Everything Convert">'),
  'Pricing page should include a search description and Open Graph title.',
);

assert(
  pdfWord.includes('PDF to Word Converter - Everything Convert') &&
    pdfWord.includes('<link rel="canonical" href="https://www.everythingconvert.com/pdf%20to%20word/pdf-to-word.html">'),
  'PDF to Word page should include tool-specific SEO metadata.',
);

assert(
  auth.includes('<meta name="robots" content="noindex, nofollow">') &&
    admin.includes('<meta name="robots" content="noindex, nofollow">') &&
    oldIndex.includes('<meta name="robots" content="noindex, nofollow">'),
  'Account, admin, and duplicate legacy pages should be noindex.',
);

console.log('seo basics tests passed');
