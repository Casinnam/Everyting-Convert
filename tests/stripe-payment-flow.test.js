const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const checkoutSource = fs.readFileSync(path.join(root, 'functions', 'api', 'create-checkout-session.js'), 'utf8');
const confirmSource = fs.readFileSync(path.join(root, 'functions', 'api', 'confirm-checkout-session.js'), 'utf8');
const envCheckSource = fs.readFileSync(path.join(root, 'functions', 'api', 'env-check.js'), 'utf8');
const webhookSource = fs.readFileSync(path.join(root, 'functions', 'api', 'stripe-webhook.js'), 'utf8');
const successPage = fs.readFileSync(path.join(root, 'payment-success.html'), 'utf8');
const authPage = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');
const pricingPage = fs.readFileSync(path.join(root, 'pricing.html'), 'utf8');

assert(
  checkoutSource.includes('/payment-success.html?session_id={CHECKOUT_SESSION_ID}'),
  'Stripe checkout should return to the payment confirmation page with the checkout session id.',
);

assert(
  checkoutSource.includes('/pricing.html?stripe=cancel'),
  'Stripe checkout cancel URL should still return to pricing.',
);

assert(
  !checkoutSource.includes("|| 'price_1TaqXWAOoOvoyo5BqKt0fQ19'"),
  'Live checkout must not silently fall back to the old test price id.',
);

assert(
  checkoutSource.includes('in Cloudflare and redeploy') &&
    checkoutSource.includes('STRIPE_PRO_MONTHLY_PRICE_ID') &&
    checkoutSource.includes('STRIPE_PRO_YEARLY_PRICE_ID') &&
    checkoutSource.includes("body.plan === 'pro_yearly'"),
  'Checkout should explain missing price configuration clearly and support monthly and yearly plans.',
);

assert(
  envCheckSource.includes('stripeMode') && envCheckSource.includes('priceIdLooksValid'),
  'Env check should expose safe Stripe configuration diagnostics.',
);

assert(
  confirmSource.includes('/v1/checkout/sessions/'),
  'The confirmation endpoint should verify the checkout session with Stripe.',
);

assert(
  confirmSource.includes('sessionUserId !== user.id'),
  'The confirmation endpoint should reject sessions that do not belong to the signed-in user.',
);

assert(
  successPage.includes('/api/confirm-checkout-session'),
  'The payment success page should call the confirmation endpoint.',
);

assert(
  successPage.includes('Please log in to finish confirming this payment.'),
  'The payment success page should not silently redirect away when auth is missing.',
);

assert(
  successPage.includes('Confirming your Pro membership'),
  'The payment success page should explain that activation is being confirmed.',
);

assert(
  authPage.includes("window.location.href = 'payment-success.html';"),
  'Legacy auth success redirects should move to the confirmation page instead of showing Free first.',
);

assert(
  authPage.includes('function scheduleCheckoutResume') && authPage.includes('fetchWithTimeout'),
  'Auth page should keep trying to resume checkout after login and avoid hanging forever.',
);

assert(
  authPage.includes('function resolveCheckoutSession') && authPage.includes('client.auth.getSession()'),
  'Auth checkout resume should read the Supabase session directly when profile loading is slow.',
);

assert(
  authPage.includes('checkoutResumePanel') && authPage.includes('Continue to Stripe Checkout'),
  'Auth page should show a visible manual checkout resume panel when automatic Stripe resume is slow.',
);

assert(
  authPage.includes('continueCheckoutBtn.addEventListener') && authPage.includes('startCheckoutFromAuth(auth)'),
  'Auth page should let users manually continue to Stripe checkout after login.',
);

assert(
  authPage.includes('Please log in to continue to secure Stripe checkout.'),
  'Auth page should explain why it is waiting before Stripe checkout.',
);

assert(
  pricingPage.includes('function resolveCheckoutSession') && pricingPage.includes('client.auth.getSession()'),
  'Pricing checkout should not redirect to login before directly checking the Supabase session.',
);

assert(
  webhookSource.includes('function isProSubscriptionCheckout') &&
    webhookSource.includes("metadata.kind === 'credit_pack'") &&
    webhookSource.includes('metadata.job_id') &&
    webhookSource.includes("session.mode === 'subscription'"),
  'The Pro subscription webhook should ignore AI credit packs and one-time AI jobs.',
);

console.log('stripe payment flow tests passed');
