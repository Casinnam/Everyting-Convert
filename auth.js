(function () {
  // Site-styled alert (falls back to native where ec-modal.js isn't loaded).
  function ecAlert(m) { return window.EverythingConvertUI ? window.EverythingConvertUI.alert(m) : Promise.resolve(window.alert(m)); }
  const config = window.EVERYTHING_CONVERT_SUPABASE || {};
  const missingConfig =
    !config.url ||
    !config.anonKey ||
    config.url === 'YOUR_SUPABASE_PROJECT_URL' ||
    config.anonKey === 'YOUR_SUPABASE_ANON_PUBLIC_KEY';

  const state = {
    client: null,
    session: null,
    user: null,
    profile: null,
    profileResolved: false,
    ready: false,
    missingConfig,
  };
  const identityCacheKey = 'everything_convert_auth_identity_snapshot';
  const legacyCacheKey = 'everything_convert_auth_snapshot';
  let signingOut = false;
  let refreshPromise = null;

  function trackAuthEvent(name, params) {
    if (window.EverythingConvertAnalytics && window.EverythingConvertAnalytics.track) {
      window.EverythingConvertAnalytics.track(name, params || {});
    }
  }

  function initClient() {
    if (missingConfig || !window.supabase) return null;
    if (!state.client) {
      state.client = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return state.client;
  }

  function isPro() {
    return state.profile && state.profile.plan === 'pro';
  }

  function isAdmin() {
    return state.profile && state.profile.role === 'admin';
  }

  function activeLanguage() {
    return window.EverythingConvertLanguage && window.EverythingConvertLanguage.get
      ? window.EverythingConvertLanguage.get()
      : 'en';
  }

  function translateAuth(key) {
    return window.EverythingConvertLanguage && window.EverythingConvertLanguage.translate
      ? window.EverythingConvertLanguage.translate(key, activeLanguage())
      : {
          authGuest: 'Guest',
          authLoginRequired: 'Login required',
          authChecking: 'Checking...',
          authSupabaseRequired: 'Supabase setup required',
          authFree: 'Free',
          authPro: 'Pro',
          authAdmin: 'Admin',
        }[key] || key;
  }

  function formatPlan() {
    if (!state.user) return translateAuth('authGuest');
    if (!state.profile || !state.profile.plan) return '';
    const plan = isPro() ? translateAuth('authPro') : translateAuth('authFree');
    return isAdmin() ? `${plan} | ${translateAuth('authAdmin')}` : plan;
  }

  function accountLabel() {
    if (state.missingConfig) return translateAuth('authSupabaseRequired');
    if (state.user) {
      const plan = formatPlan();
      const name = shortName(displayName());
      return plan ? `${name} | ${plan}` : name;
    }
    return !state.ready ? translateAuth('authChecking') : translateAuth('authLoginRequired');
  }

  function emailPrefix(email) {
    return email ? String(email).split('@')[0] : '';
  }

  function displayName() {
    if (!state.user) return 'Guest';
    const username = state.profile && state.profile.username ? state.profile.username : '';
    return username || emailPrefix(state.user.email) || 'User';
  }

  function shortEmail(email) {
    if (!email) return '';
    return email.length > 26 ? email.slice(0, 23) + '...' : email;
  }

  function shortName(name) {
    if (!name) return '';
    return name.length > 22 ? name.slice(0, 19) + '...' : name;
  }

  // Avatar initials, e.g. "economicalhuman" -> "EC", "Jae Smith" -> "JS".
  function initialsFrom(name) {
    if (!name || name === 'Guest') return '?';
    const parts = String(name).trim().split(/[\s._\-@]+/).filter(Boolean);
    const s = parts.length >= 2
      ? (parts[0][0] + parts[1][0])
      : String(name).replace(/[^A-Za-z0-9가-힣]/g, '').slice(0, 2);
    return (s || '?').toUpperCase();
  }

  // Credit balance for the account dropdown. Uses the shared helper when present,
  // otherwise calls the ai_credit_balance RPC directly so the avatar shows credits
  // on every page (ai-credits.js is not loaded site-wide).
  async function fetchCreditBalance() {
    if (window.EverythingConvertCredits && window.EverythingConvertCredits.getBalance) {
      try { const b = await window.EverythingConvertCredits.getBalance(); if (b != null) return b; } catch (error) { /* fall through */ }
    }
    const token = state.session && state.session.access_token;
    const cfg = window.EVERYTHING_CONVERT_SUPABASE || {};
    if (!token || !cfg.url) return null;
    try {
      const res = await fetch(`${cfg.url}/rest/v1/rpc/ai_credit_balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(cfg.anonKey ? { apikey: cfg.anonKey } : {}), Authorization: `Bearer ${token}` },
        body: '{}',
      });
      if (!res.ok) return null;
      const data = await res.json();
      return Number(data) || 0;
    } catch (error) {
      return null;
    }
  }

  let creditWidgetsBusy = false;
  function refreshCredits() {
    const els = document.querySelectorAll('[data-auth-credits]');
    if (!els.length || !state.user || creditWidgetsBusy) return;
    creditWidgetsBusy = true;
    fetchCreditBalance()
      .then((n) => { creditWidgetsBusy = false; if (n != null) els.forEach((el) => { el.textContent = String(n); }); })
      .catch(() => { creditWidgetsBusy = false; });
  }

  // Fill the avatar + account dropdown. `info` = { name, email, plan, pro }.
  function fillUserWidgets(info) {
    const ini = initialsFrom(info.name);
    document.querySelectorAll('[data-auth-initials]').forEach((el) => { el.textContent = ini; });
    document.querySelectorAll('[data-auth-name]').forEach((el) => { el.textContent = shortName(info.name) || translateAuth('authGuest'); });
    document.querySelectorAll('[data-auth-email]').forEach((el) => { el.textContent = info.email || ''; });
    document.querySelectorAll('[data-auth-plan]').forEach((el) => { el.textContent = info.plan || translateAuth('authFree'); });
    document.querySelectorAll('[data-hide-pro]').forEach((el) => { el.style.display = info.pro ? 'none' : ''; });
  }

  function readAuthIdentityCache() {
    try {
      const raw = window.localStorage.getItem(identityCacheKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeAuthIdentityCache() {
    if (!state.user) return;
    const previous = readAuthIdentityCache() || {};
    const cache = {
      username: displayName(),
      savedAt: Date.now(),
    };
    if (state.profileResolved && state.profile) {
      cache.plan = state.profile.plan === 'pro' ? 'pro' : '';
      cache.role = state.profile.role === 'admin' ? 'admin' : 'user';
    } else if (previous.plan === 'pro' || previous.role === 'admin') {
      cache.plan = previous.plan === 'pro' ? 'pro' : '';
      cache.role = previous.role === 'admin' ? 'admin' : 'user';
    }
    try {
      window.localStorage.setItem(identityCacheKey, JSON.stringify(cache));
    } catch (error) {
      // Ignore storage failures; auth still works through Supabase.
    }
  }

  function clearAuthIdentityCache() {
    try {
      window.localStorage.removeItem(identityCacheKey);
      window.localStorage.removeItem(legacyCacheKey);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function renderCachedAuthWidgets() {
    const cached = readAuthIdentityCache();
    if (!cached || !cached.username) return false;

    const cachedPlan = cached.plan === 'pro' ? translateAuth('authPro') : '';
    const cachedRole = cached.role === 'admin' ? translateAuth('authAdmin') : '';
    const planLabel = cachedRole ? `${cachedPlan || translateAuth('authFree')} | ${cachedRole}` : cachedPlan;
    const label = planLabel ? `${shortName(cached.username)} | ${planLabel}` : shortName(cached.username);

    document.querySelectorAll('[data-auth-state]').forEach((element) => {
      delete element.dataset.i18nKey;
      element.textContent = label;
    });

    document.querySelectorAll('[data-auth-account]').forEach((element) => {
      element.style.display = '';
    });

    document.querySelectorAll('[data-auth-login]').forEach((element) => {
      element.style.display = 'none';
    });

    document.querySelectorAll('[data-auth-logout]').forEach((element) => {
      element.style.display = '';
    });

    // Never reveal admin links from cache — only a live-confirmed admin (in
    // renderAuthWidgets) may show them, so a stale cache can't flash Admin to a
    // non-admin.
    document.querySelectorAll('[data-admin-only]').forEach((element) => {
      element.style.display = 'none';
    });

    fillUserWidgets({ name: cached.username, email: '', plan: planLabel || translateAuth('authFree'), pro: cached.plan === 'pro' });

    return true;
  }

  function cachedAuthSnapshot() {
    return readAuthIdentityCache();
  }

  function withTimeout(promise, label, ms = 8000) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`${label} 시간이 초과되었습니다.`)), ms);
      }),
    ]);
  }

  function setFallbackProfile() {
    if (!state.user) {
      state.profile = null;
      state.profileResolved = false;
      return state.profile;
    }

    const cached = readAuthIdentityCache();
    state.profile = {
      id: state.user.id,
      email: state.user.email,
      username: cached && cached.username ? cached.username : emailPrefix(state.user.email),
      plan: '',
      role: 'user',
    };
    state.profileResolved = false;
    return state.profile;
  }

  async function loadProfile() {
    if (!state.client || !state.user) {
      state.profile = null;
      return null;
    }

    let data = null;
    let profileWithRole = null;
    let error = null;

    try {
      const result = await withTimeout(
        state.client
          .from('profiles')
          .select('id,email,plan,role')
          .eq('id', state.user.id)
          .maybeSingle(),
        '프로필 확인',
      );
      profileWithRole = result.data;
      error = result.error;
    } catch (profileError) {
      console.warn('Could not load profile:', profileError.message);
      return setFallbackProfile();
    }

    if (error && error.code === '42703') {
      const fallback = await withTimeout(
        state.client
          .from('profiles')
          .select('id,email,plan')
          .eq('id', state.user.id)
          .maybeSingle(),
        '프로필 확인',
      );
      if (fallback.error) {
        console.warn('Could not load profile:', fallback.error.message);
      } else {
        data = fallback.data ? { ...fallback.data, username: emailPrefix(state.user.email), role: fallback.data.role || 'user' } : null;
      }
    } else if (error) {
      console.warn('Could not load profile:', error.message);
    } else {
      data = profileWithRole;
    }

    if (!data && state.user.email) {
      try {
        const profileByEmail = await withTimeout(
          state.client
            .from('profiles')
            .select('id,email,plan,role')
            .eq('email', state.user.email)
            .maybeSingle(),
          'profile email check',
        );
        if (profileByEmail.error) {
          console.warn('Could not load profile by email:', profileByEmail.error.message);
        } else {
          data = profileByEmail.data ? { ...profileByEmail.data, username: emailPrefix(state.user.email) } : null;
        }
      } catch (profileByEmailError) {
        console.warn('Could not load profile by email:', profileByEmailError.message);
      }
    }

    state.profile = data || { id: state.user.id, email: state.user.email, username: emailPrefix(state.user.email), plan: 'free', role: 'user' };
    if (!state.profile.username) state.profile.username = emailPrefix(state.user.email);
    state.profileResolved = true;
    writeAuthIdentityCache();
    return state.profile;
  }

  function renderAuthWidgets() {
    const checkingAuth = !state.ready && !state.user && !state.missingConfig;
    
    // 네트워크 확인 중(Checking)일 때 캐시 정보가 있으면 덮어쓰지 않고 캐시 화면 유지
    if (checkingAuth && renderCachedAuthWidgets()) {
      return;
    }

    const authLabel = accountLabel();

    document.querySelectorAll('[data-auth-state]').forEach((element) => {
      delete element.dataset.i18nKey;
      element.textContent = authLabel;
    });

    // Avatar shows only for a real logged-in user. Returning users get the avatar
    // immediately via renderCachedAuthWidgets; everyone else just sees Login.
    document.querySelectorAll('[data-auth-account]').forEach((element) => {
      element.style.display = state.user ? '' : 'none';
    });

    document.querySelectorAll('[data-auth-login]').forEach((element) => {
      element.style.display = state.user ? 'none' : '';
    });

    document.querySelectorAll('[data-auth-logout]').forEach((element) => {
      element.style.display = state.user ? '' : 'none';
    });

    document.querySelectorAll('[data-pro-only]').forEach((element) => {
      element.disabled = !isPro();
      element.classList.toggle('locked', !isPro());
    });

    document.querySelectorAll('[data-admin-only]').forEach((element) => {
      element.style.display = isAdmin() ? '' : 'none';
    });

    if (state.user) {
      fillUserWidgets({ name: displayName(), email: state.user.email || '', plan: formatPlan(), pro: isPro() });
      refreshCredits();
    } else {
      // logged out: keep Try Pro visible
      document.querySelectorAll('[data-hide-pro]').forEach((element) => { element.style.display = ''; });
    }

    if (state.user) writeAuthIdentityCache();
    window.dispatchEvent(new CustomEvent('everything-auth-change', { detail: { ...state } }));
  }

  function rerenderAfterHeaderChange() {
    if (!state.ready && !state.user && renderCachedAuthWidgets()) return;
    renderAuthWidgets();
  }

  async function performRefresh() {
    if (signingOut) return state;

    const client = initClient();
    if (!client) {
      state.ready = true;
      state.profileResolved = false;
      clearAuthIdentityCache();
      renderAuthWidgets();
      return state;
    }

    let data = { session: null };
    let isTimeout = false;
    try {
      const result = await withTimeout(client.auth.getSession(), '세션 확인', 15000);
      data = result.data || data;
      if (result.error) console.warn('Could not read auth session:', result.error.message);
    } catch (error) {
      console.warn('Could not read auth session:', error.message);
      if (error.message.includes('초과')) isTimeout = true;
    }

    if (!isTimeout) {
      state.session = data && data.session ? data.session : null;
      state.user = state.session ? state.session.user : null;
      if (!state.user) {
        state.profileResolved = false;
        clearAuthIdentityCache();
      }
    }
    if (state.user) {
      setFallbackProfile();
      state.ready = true;
      renderAuthWidgets();
    }
    await loadProfile();
    state.ready = true;
    renderAuthWidgets();
    return state;
  }

  async function refresh() {
    if (signingOut) return state;
    if (refreshPromise) return refreshPromise;
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
    return refreshPromise;
  }

  async function signUp(email, password, username) {
    const client = initClient();
    if (!client) throw new Error('Supabase 설정이 필요합니다.');
    trackAuthEvent('sign_up_start', { method: 'email' });
    const emailRedirectTo = getAuthRedirectUrl();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          username,
        },
      },
    });
    if (error) throw error;
    trackAuthEvent('sign_up', { method: 'email' });
    return data;
  }

  async function updateUsername(username) {
    const client = initClient();
    if (!client) throw new Error('Supabase 설정이 필요합니다.');
    if (!state.user) throw new Error('로그인이 필요합니다.');

    const { data, error } = await withTimeout(
      client.rpc('update_own_username', { new_username: username }),
      '유저 ID 저장',
      12000,
    );
    if (error) throw error;
    await loadProfile();
    renderAuthWidgets();
    return data;
  }

  async function signIn(email, password) {
    const client = initClient();
    if (!client) throw new Error('Supabase 설정이 필요합니다.');
    trackAuthEvent('login_start', { method: 'email' });
    const { data, error } = await withTimeout(
      client.auth.signInWithPassword({ email, password }),
      '로그인',
      12000,
    );
    if (error) throw error;
    state.session = data && data.session ? data.session : null;
    state.user = state.session ? state.session.user : null;
    setFallbackProfile();
    state.ready = true;
    renderAuthWidgets();
    try {
      await loadProfile();
    } catch (profileError) {
      console.warn('Could not refresh profile after login:', profileError.message);
    }
    renderAuthWidgets();
    trackAuthEvent('login', { method: 'email' });
    return data;
  }

  async function signInWithGoogle() {
    const client = initClient();
    if (!client) throw new Error('Supabase 설정이 필요합니다.');
    trackAuthEvent('login_start', { method: 'google' });
    const redirectTo = getAuthRedirectUrl();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account'
        }
      },
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const client = initClient();
    if (!client) return;
    signingOut = true;
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) throw error;
      state.session = null;
      state.user = null;
      state.profile = null;
      state.profileResolved = false;
      state.ready = true;
      clearAuthIdentityCache();
      renderAuthWidgets();
      trackAuthEvent('logout', {});
    } finally {
      signingOut = false;
    }
  }

  function requireLogin(message) {
    if (state.missingConfig) {
      ecAlert('Supabase 설정이 필요합니다. supabase-config.js에 프로젝트 URL과 anon key를 입력해 주세요.');
      return false;
    }
    if (!state.user) {
      ecAlert(message || '로그인이 필요한 기능입니다.');
      window.location.href = getAuthPath();
      return false;
    }
    return true;
  }

  function requirePro(message) {
    if (!requireLogin(message || '프로 회원만 사용할 수 있는 기능입니다.')) return false;
    if (!isPro()) {
      ecAlert('표 감지 강화형은 Pro 회원 전용입니다. Supabase profiles 테이블에서 plan을 pro로 변경하면 사용할 수 있습니다.');
      return false;
    }
    return true;
  }

  function requireAdmin(message) {
    if (!requireLogin(message || '관리자만 사용할 수 있는 기능입니다.')) return false;
    if (!isAdmin()) {
      ecAlert('관리자 권한이 필요합니다.');
      return false;
    }
    return true;
  }

  function getAuthPath() {
    return rootRelativePath('auth.html');
  }

  function getAuthRedirectUrl() {
    const targetPath = rootRelativePath('auth.html');
    const currentParams = new URLSearchParams(window.location.search);
    const next = currentParams.get('next');
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    let redirectUrl;

    if (window.location.protocol === 'file:') {
      redirectUrl = new URL(targetPath, localDevBaseUrl());
    } else if (config.publicOrigin && !isLocalHost) {
      redirectUrl = new URL('auth.html', config.publicOrigin);
    } else {
      redirectUrl = new URL(targetPath, window.location.href);
    }

    if (next) redirectUrl.searchParams.set('next', next);
    return redirectUrl.href;
  }

  function pathDepth() {
    const path = decodeURIComponent(window.location.pathname || '/').replace(/\\/g, '/');
    const withoutFile = path.endsWith('/')
      ? path
      : path.slice(0, path.lastIndexOf('/') + 1);
    const segments = withoutFile.split('/').filter(Boolean);

    if (window.location.protocol === 'file:') {
      const rootIndex = segments.lastIndexOf('Everything Convert Main');
      if (rootIndex >= 0) return Math.max(0, segments.length - rootIndex - 1);
    }

    return Math.max(0, segments.length);
  }

  function rootRelativePath(fileName) {
    return `${'../'.repeat(pathDepth())}${fileName}`;
  }

  function localDevBaseUrl() {
    return config.publicOrigin || window.EVERYTHING_CONVERT_LOCAL_ORIGIN || 'http://127.0.0.1:8016/';
  }

  function normalizeAuthRedirect() {
    const params = new URLSearchParams(window.location.search);
    const hasOAuthPayload =
      params.has('code') ||
      params.has('error') ||
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('error=');

    if (hasOAuthPayload && window.location.protocol === 'file:') {
      window.location.replace(getAuthRedirectUrl() + window.location.search + window.location.hash);
      return true;
    }

    return false;
  }

  async function completeOAuthCallback(client) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const errorDescription = params.get('error_description') || params.get('error');
    if (errorDescription) {
      console.warn('OAuth callback error:', errorDescription);
      window.dispatchEvent(new CustomEvent('everything-auth-error', {
        detail: { message: errorDescription },
      }));
      return false;
    }
    if (!code) return false;

    // Supabase JS v2 automatically handles the code exchange when detectSessionInUrl is true.
    // Doing it manually causes a Race Condition (Invalid Grant).
    
    params.delete('code');
    params.delete('state');
    const cleanUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, cleanUrl);
    return true;
  }

  document.addEventListener('click', async (event) => {
    const logoutButton = event.target.closest('[data-auth-logout]');
    if (!logoutButton) return;
    event.preventDefault();
    if (signingOut) return;
    
    // 즉각적인 시각적 피드백 제공
    const originalText = logoutButton.innerHTML;
    logoutButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 로그아웃 중...';
    logoutButton.style.pointerEvents = 'none';
    logoutButton.style.opacity = '0.7';

    try {
      await signOut();
      window.location.href = getAuthPath();
    } catch (error) {
      logoutButton.innerHTML = originalText;
      logoutButton.style.pointerEvents = '';
      logoutButton.style.opacity = '1';
      ecAlert('로그아웃 실패: ' + error.message);
    }
  });

  window.addEventListener('everything-language-change', renderAuthWidgets);
  window.addEventListener('everything-header-ready', rerenderAfterHeaderChange);

  async function startAuth() {
    if (normalizeAuthRedirect()) return;
    renderCachedAuthWidgets();
    const client = initClient();
    if (client) {
      client.auth.onAuthStateChange(async () => {
        if (signingOut) return;
        await refresh();
      });
      try {
        await completeOAuthCallback(client);
      } catch (error) {
        console.warn('Could not complete OAuth callback:', error.message);
        window.dispatchEvent(new CustomEvent('everything-auth-error', {
          detail: { message: error.message },
        }));
      }
    }
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAuth);
  } else {
    startAuth();
  }

  window.EverythingConvertAuth = {
    state,
    refresh,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    requireLogin,
    requirePro,
    requireAdmin,
    getAuthPath,
    getAuthRedirectUrl,
    isPro,
    isAdmin,
    formatPlan,
    accountLabel,
    displayName,
    cachedAuthSnapshot,
    updateUsername,
    renderAuthWidgets,
    refreshCredits,
  };
})();
