(function () {
  function rootPrefix() {
    const path = decodeURIComponent(window.location.pathname || '').replace(/\\/g, '/');
    const parts = path.split('/').filter(Boolean);
    const fileName = parts[parts.length - 1] || '';
    const rootFiles = [
      'index.html',
      'index.htm',
      'auth.html',
      'pricing.html',
      'admin.html',
      'about.html',
      'privacy.html',
      'terms.html',
      'security.html',
      'contact.html',
      'contact-success.html',
      'donate.html',
      'payment-success.html',
      'my-conversions.html',
    ];
    return rootFiles.includes(fileName) || parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  function authApi() {
    return window.EverythingConvertAuth || null;
  }

  function accessToken() {
    const auth = authApi();
    return auth && auth.state && auth.state.session ? auth.state.session.access_token : '';
  }

  function hasProAccess() {
    const auth = authApi();
    if (!auth || !auth.state || !auth.state.user) return false;
    if (typeof auth.isAdmin === 'function' && auth.isAdmin()) return true;
    if (typeof auth.isPro === 'function' && auth.isPro()) return true;
    if (typeof auth.cachedAuthSnapshot === 'function') {
      const cache = auth.cachedAuthSnapshot();
      return Boolean(cache && (cache.plan === 'pro' || cache.role === 'admin'));
    }
    return false;
  }

  function endpoint() {
    return `${rootPrefix()}api/conversion-history`;
  }

  async function requestHistory(method, body) {
    const token = accessToken();
    if (!token) {
      throw new Error('Login required.');
    }

    const response = await fetch(endpoint(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || 'Conversion history request failed.');
    }
    return payload;
  }

  async function fetchHistory() {
    if (!hasProAccess()) {
      return { history: [], skipped: true, reason: 'not_pro' };
    }
    return requestHistory('GET');
  }

  async function recordConversion(record) {
    if (!hasProAccess()) {
      return { skipped: true, reason: 'not_pro' };
    }

    try {
      return await requestHistory('POST', record || {});
    } catch (error) {
      console.warn('[Everything Convert] Conversion history was not saved:', error.message);
      return { skipped: true, error: error.message };
    }
  }

  window.EverythingConvertHistory = {
    fetchHistory,
    recordConversion,
    rootPrefix,
  };
})();
