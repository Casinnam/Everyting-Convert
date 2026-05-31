const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const checkoutSource = fs.readFileSync(path.join(root, 'functions', 'api', 'create-checkout-session.js'), 'utf8');
const confirmSource = fs.readFileSync(path.join(root, 'functions', 'api', 'confirm-checkout-session.js'), 'utf8');
const envCheckSource = fs.readFileSync(path.join(root, 'functions', 'api', 'env-check.js'), 'utf8');
const successPage = fs.readFileSync(path.join(root, 'payment-success.html'), 'utf8');
const authPage = fs.readFileSync(path.join(root, 'auth.html'), 'utf8');

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
  checkoutSource.includes('STRIPE_PRO_MONTHLY_PRICE_ID in Cloudflare and redeploy'),
  'Checkout should explain missing price configuration clearly.',
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

console.log('stripe payment flow tests passed');
