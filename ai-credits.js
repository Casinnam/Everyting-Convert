// ai-credits.js
// Shared client helper for the AI credit system. Exposes
// window.EverythingConvertCredits with: getBalance(), redeem(jobId),
// buyPack(packKey), isLoggedIn(). Requires supabase-config.js + auth.js.
(function () {
  const FUNC_BASE = 'https://tuwhuftbjqkgduukvbfv.functions.supabase.co';
  const ANON = (window.EVERYTHING_CONVERT_SUPABASE && window.EVERYTHING_CONVERT_SUPABASE.anonKey) || '';

  const PACKS = {
    starter: { credits: 30, price: '$2.99' },
    standard: { credits: 100, price: '$6.99' },
    power: { credits: 250, price: '$14.99' },
    business: { credits: 600, price: '$29.99' },
  };

  function authState() {
    return window.EverythingConvertAuth && window.EverythingConvertAuth.state;
  }

  function accessToken() {
    const s = authState();
    return s && s.session && s.session.access_token ? s.session.access_token : '';
  }

  function isLoggedIn() {
    return !!accessToken();
  }

  // Returns the user's credit balance (number), or null when logged out / on error.
  async function getBalance() {
    const s = authState();
    const client = s && s.client;
    if (!client || !isLoggedIn()) return null;
    try {
      const { data, error } = await client.rpc('ai_credit_balance');
      if (error) return null;
      return Number(data) || 0;
    } catch (error) {
      return null;
    }
  }

  // Pay for a previewed job with credits. Resolves to
  // { ok, status, cost, balance, code, error }.
  async function redeem(jobId) {
    const token = accessToken();
    if (!token) return { ok: false, code: 'login_required', error: 'Please log in.' };
    try {
      const res = await fetch(`${FUNC_BASE}/ai-redeem-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ANON ? { apikey: ANON } : {}),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: jobId }),
      });
      let data = {};
      try { data = await res.json(); } catch (error) { data = {}; }
      return { status: res.status, ok: res.ok && !!data.ok, ...data };
    } catch (error) {
      return { ok: false, code: 'network', error: 'Network error. Please try again.' };
    }
  }

  // Start Stripe checkout for a credit pack. Redirects to login first if needed.
  async function buyPack(packKey) {
    if (!PACKS[packKey]) return;
    const token = accessToken();
    const origin = window.location.origin;
    if (!token) {
      window.location.href = 'auth.html?next=' + encodeURIComponent('pricing.html#credit-packs');
      return;
    }
    try {
      const res = await fetch(`${FUNC_BASE}/ai-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ANON ? { apikey: ANON } : {}),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pack: packKey,
          success_url: `${origin}/pricing.html?credits=success`,
          cancel_url: `${origin}/pricing.html?credits=cancel#credit-packs`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || 'Could not start checkout. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  }

  window.EverythingConvertCredits = { getBalance, redeem, buyPack, isLoggedIn, PACKS };
})();
