const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const analytics = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
const ads = fs.readFileSync(path.join(root, 'ads.js'), 'utf8');
const privacy = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
const pricing = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const usageLimit = fs.readFileSync(path.join(root, 'usage-limit.js'), 'utf8');
const aiCredits = fs.readFileSync(path.join(root, 'ai-credits.js'), 'utf8');
const paymentSuccess = fs.readFileSync(path.join(root, 'payment-success.html'), 'utf8');

assert(
  analytics.includes("gtag('consent', 'default'") &&
    analytics.includes("analytics_storage: analyticsGranted") &&
    analytics.includes("ad_storage: adsGranted") &&
    analytics.includes('ad_user_data') &&
    analytics.includes('ad_personalization'),
  'analytics.js should initialize Google Consent Mode before analytics and ads are used.',
);

assert(
  analytics.includes('ec-cookie-consent') &&
    analytics.includes('Accept all') &&
    analytics.includes('Reject optional') &&
    analytics.includes('Cookie Settings') === false &&
    analytics.includes('everythingconvert:consentchange'),
  'analytics.js should render a reusable consent banner and notify ads.js when choices change.',
);

assert(
  ads.includes('everything_convert_cookie_consent_v1') &&
    ads.includes('hasAdConsent') &&
    ads.includes('everythingconvert:consentchange'),
  'ads.js should wait for stored ad consent before loading AdSense.',
);

const htmlFiles = [];
function collectHtml(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full);
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  });
}
collectHtml(root);

const missingAnalytics = htmlFiles.filter((file) => !fs.readFileSync(file, 'utf8').includes('analytics.js?v=analytics-20260614a'));
assert.strictEqual(
  missingAnalytics.length,
  0,
  `Every HTML page should load the shared analytics consent script: ${missingAnalytics
    .map((file) => path.relative(root, file))
    .join(', ')}`,
);

const legacyInlineGa = htmlFiles.filter((file) => {
  const source = fs.readFileSync(file, 'utf8');
  return source.includes('googletagmanager.com/gtag/js') || source.includes("gtag('config', 'G-MWPYMT3Q6H')");
});
assert.strictEqual(
  legacyInlineGa.length,
  0,
  `HTML pages should not bypass consent with inline GA snippets: ${legacyInlineGa
    .map((file) => path.relative(root, file))
    .join(', ')}`,
);

assert(
  auth.includes("trackAuthEvent('sign_up_start'") &&
    auth.includes("trackAuthEvent('sign_up'") &&
    auth.includes("trackAuthEvent('login_start'") &&
    auth.includes("trackAuthEvent('login'") &&
    auth.includes("trackAuthEvent('logout'"),
  'auth.js should track signup, login, and logout funnel events.',
);

assert(
  pricing.includes("track('checkout_redirect'") &&
    pricing.includes("track('checkout_error'") &&
    pricing.includes("checkout_type: 'ai_credit_pack'"),
  'pricing.html should track Stripe checkout redirects, errors, and credit purchases.',
);

assert(
  usageLimit.includes("track('conversion_allowed'") &&
    usageLimit.includes("track('conversion_blocked'"),
  'usage-limit.js should track conversion allowance and usage-limit blocks.',
);

assert(
  aiCredits.includes("track('ai_credit_redeem_start'") &&
    aiCredits.includes('ai_credit_redeem_success') &&
    aiCredits.includes('ai_credit_spend_success'),
  'ai-credits.js should track AI credit redemption and spend outcomes.',
);

assert(
  paymentSuccess.includes("track('purchase'") &&
    paymentSuccess.includes("checkout_type: 'pro_subscription'"),
  'payment-success.html should track confirmed Pro purchases.',
);

assert(
  privacy.includes('Cookie Settings link in the footer') &&
    privacy.includes('Google AdSense'),
  'Privacy policy should describe cookie settings and advertising/analytics storage.',
);

const missingCookieSettings = htmlFiles.filter((file) => {
  const source = fs.readFileSync(file, 'utf8');
  return source.includes('site-footer') && !source.includes('#cookie-settings');
});
assert.strictEqual(
  missingCookieSettings.length,
  0,
  `Footers should expose Cookie Settings so consent can be changed: ${missingCookieSettings
    .map((file) => path.relative(root, file))
    .join(', ')}`,
);

console.log('analytics consent tests passed');
