// ai-credits.js
// Shared client helper for the AI credit system. Exposes
// window.EverythingConvertCredits with: getBalance(), redeem(jobId),
// buyPack(packKey), isLoggedIn(). Requires supabase-config.js + auth.js.
(function () {
  // Site-styled alert (falls back to native where ec-modal.js isn't loaded).
  function ecAlert(m) { return window.EverythingConvertUI ? window.EverythingConvertUI.alert(m) : Promise.resolve(window.alert(m)); }
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

  function track(name, params) {
    if (window.EverythingConvertAnalytics && window.EverythingConvertAnalytics.track) {
      window.EverythingConvertAnalytics.track(name, params || {});
    }
  }

  // The auth session is sometimes only inside the Supabase client and not yet
  // mirrored onto auth.state.session. Fall back to client.auth.getSession()
  // so a logged-in user is never wrongly treated as logged out.
  async function resolveToken() {
    const sync = accessToken();
    if (sync) return sync;
    const s = authState();
    const client = s && s.client;
    if (client && client.auth && typeof client.auth.getSession === 'function') {
      try {
        const result = await client.auth.getSession();
        const session = result && result.data ? result.data.session : null;
        if (session && session.access_token) {
          if (s) { s.session = session; s.user = session.user || s.user; }
          return session.access_token;
        }
      } catch (error) {
        return '';
      }
    }
    return '';
  }

  // Reliable async login check. The sync isLoggedIn() reads only the auth-state
  // snapshot, which isn't hydrated yet right after a page load or a post-login
  // redirect — so a logged-in user can be wrongly bounced to the login screen
  // (and then bounced back by auth.html, looping). Prefer this for nav gates.
  async function ensureLoggedIn() {
    return !!(await resolveToken());
  }

  // Returns the user's credit balance (number), or null when logged out / on error.
  // Calls the ai_credit_balance RPC over REST with the explicitly resolved user
  // token (same reliable pattern as redeem/spend). client.rpc() did not always
  // attach the session, so the balance never loaded.
  async function getBalance() {
    const token = await resolveToken();
    if (!token) return null;
    const cfg = window.EVERYTHING_CONVERT_SUPABASE || {};
    if (!cfg.url) return null;
    try {
      const res = await fetch(`${cfg.url}/rest/v1/rpc/ai_credit_balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ANON ? { apikey: ANON } : {}),
          Authorization: `Bearer ${token}`,
        },
        body: '{}',
      });
      if (!res.ok) return null;
      const data = await res.json();
      return Number(data) || 0;
    } catch (error) {
      return null;
    }
  }

  // Pay for a previewed job with credits. Resolves to
  // { ok, status, cost, balance, code, error }.
  async function redeem(jobId) {
    const token = await resolveToken();
    if (!token) return { ok: false, code: 'login_required', error: 'Please log in.' };
    track('ai_credit_redeem_start', { job_id: jobId || '' });
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
      track(res.ok && data.ok ? 'ai_credit_redeem_success' : 'ai_credit_redeem_error', {
        job_id: jobId || '',
        status: res.status,
        code: data.code || '',
        cost: data.cost || 0,
      });
      return { status: res.status, ok: res.ok && !!data.ok, ...data };
    } catch (error) {
      track('ai_credit_redeem_error', { job_id: jobId || '', code: 'network' });
      return { ok: false, code: 'network', error: 'Network error. Please try again.' };
    }
  }

  // Direct credit spend for non-job tools (e.g. premium QR). Idempotent on ref.
  async function spend(tool, ref) {
    const token = await resolveToken();
    if (!token) return { ok: false, code: 'login_required', error: 'Please log in.' };
    track('ai_credit_spend_start', { tool: tool || '', ref: ref || '' });
    try {
      const res = await fetch(`${FUNC_BASE}/ai-spend-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ANON ? { apikey: ANON } : {}),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tool, ref }),
      });
      let data = {};
      try { data = await res.json(); } catch (error) { data = {}; }
      track(res.ok && data.ok ? 'ai_credit_spend_success' : 'ai_credit_spend_error', {
        tool: tool || '',
        status: res.status,
        code: data.code || '',
        cost: data.cost || 0,
      });
      return { status: res.status, ok: res.ok && !!data.ok, ...data };
    } catch (error) {
      track('ai_credit_spend_error', { tool: tool || '', code: 'network' });
      return { ok: false, code: 'network', error: 'Network error. Please try again.' };
    }
  }

  // The referral code remembered from a ?ref=CODE landing (set in auth.js).
  function storedRefCode() {
    try { return localStorage.getItem('ec_ref_code') || ''; } catch (e) { return ''; }
  }

  // The logged-in user's own referral code (so pages can show a share link).
  // Reads their own profile row (allowed by the profiles own-row RLS policy).
  async function getMyReferralCode() {
    const token = await resolveToken();
    if (!token) return null;
    const cfg = window.EVERYTHING_CONVERT_SUPABASE || {};
    if (!cfg.url) return null;
    try {
      const res = await fetch(`${cfg.url}/rest/v1/profiles?select=referral_code`, {
        headers: { ...(ANON ? { apikey: ANON } : {}), Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const rows = await res.json();
      return rows && rows[0] && rows[0].referral_code ? rows[0].referral_code : null;
    } catch (error) {
      return null;
    }
  }

  // Start Stripe checkout for a credit pack. Redirects to login first if needed.
  async function buyPack(packKey) {
    if (!PACKS[packKey]) return;
    track('begin_checkout', {
      checkout_type: 'ai_credit_pack',
      credit_pack: packKey,
      credits: PACKS[packKey].credits,
    });
    const origin = window.location.origin;
    const token = await resolveToken();
    if (!token) {
      window.location.href = 'auth.html?next=' + encodeURIComponent('pricing.html#credit-packs');
      return;
    }
    try {
      const refCode = storedRefCode();
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
          ...(refCode ? { referral_code: refCode } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        ecAlert(data.error || 'Could not start checkout. Please try again.');
      }
    } catch (error) {
      ecAlert('Network error. Please try again.');
    }
  }

  window.EverythingConvertCredits = { getBalance, redeem, spend, buyPack, isLoggedIn, ensureLoggedIn, getMyReferralCode, PACKS };
})();
