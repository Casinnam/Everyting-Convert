(function () {
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
    ready: false,
    missingConfig,
  };
  const identityCacheKey = 'everything_convert_auth_identity_snapshot';
  const legacyCacheKey = 'everything_convert_auth_snapshot';
  let signingOut = false;

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
    if (!state.profile || !state.profile.plan) return translateAuth('authChecking');
    const plan = isPro() ? translateAuth('authPro') : translateAuth('authFree');
    return isAdmin() ? `${plan} | ${translateAuth('authAdmin')}` : plan;
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
    try {
      window.localStorage.setItem(identityCacheKey, JSON.stringify({
        username: displayName(),
        savedAt: Date.now(),
      }));
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

    const label = shortName(cached.username);

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

    document.querySelectorAll('[data-admin-only]').forEach((element) => {
      element.style.display = 'none';
    });

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
    writeAuthIdentityCache();
    return state.profile;
  }

  function renderAuthWidgets() {
    const checkingAuth = !state.ready && !state.user && !state.missingConfig;
    
    // 네트워크 확인 중(Checking)일 때 캐시 정보가 있으면 덮어쓰지 않고 캐시 화면 유지
    if (checkingAuth && renderCachedAuthWidgets()) {
      return;
    }

    const authLabel = state.missingConfig
      ? translateAuth('authSupabaseRequired')
      : state.user
        ? `${shortName(displayName())} | ${formatPlan()}`
        : checkingAuth
          ? translateAuth('authChecking')
          : translateAuth('authLoginRequired');

    document.querySelectorAll('[data-auth-state]').forEach((element) => {
      delete element.dataset.i18nKey;
      element.textContent = authLabel;
    });

    document.querySelectorAll('[data-auth-account]').forEach((element) => {
      element.style.display = state.user || checkingAuth ? '' : 'none';
    });

    document.querySelectorAll('[data-auth-login]').forEach((element) => {
      element.style.display = state.user || checkingAuth ? 'none' : '';
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

    if (state.user) writeAuthIdentityCache();
    window.dispatchEvent(new CustomEvent('everything-auth-change', { detail: { ...state } }));
  }

  function rerenderAfterHeaderChange() {
    if (!state.ready && !state.user && renderCachedAuthWidgets()) return;
    renderAuthWidgets();
  }

  async function refresh() {
    if (signingOut) return state;

    const client = initClient();
    if (!client) {
      state.ready = true;
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
      if (!state.user) clearAuthIdentityCache();
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

  async function signUp(email, password, username) {
    const client = initClient();
    if (!client) throw new Error('Supabase 설정이 필요합니다.');
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
    return data;
  }

  async function signInWithGoogle() {
    const client = initClient();
    if (!client) throw new Error('Supabase 설정이 필요합니다.');
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
      state.ready = true;
      clearAuthIdentityCache();
      renderAuthWidgets();
    } finally {
      signingOut = false;
    }
  }

  function requireLogin(message) {
    if (state.missingConfig) {
      alert('Supabase 설정이 필요합니다. supabase-config.js에 프로젝트 URL과 anon key를 입력해 주세요.');
      return false;
    }
    if (!state.user) {
      alert(message || '로그인이 필요한 기능입니다.');
      window.location.href = getAuthPath();
      return false;
    }
    return true;
  }

  function requirePro(message) {
    if (!requireLogin(message || '프로 회원만 사용할 수 있는 기능입니다.')) return false;
    if (!isPro()) {
      alert('표 감지 강화형은 Pro 회원 전용입니다. Supabase profiles 테이블에서 plan을 pro로 변경하면 사용할 수 있습니다.');
      return false;
    }
    return true;
  }

  function requireAdmin(message) {
    if (!requireLogin(message || '관리자만 사용할 수 있는 기능입니다.')) return false;
    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.');
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
      alert('로그아웃 실패: ' + error.message);
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
    displayName,
    cachedAuthSnapshot,
    updateUsername,
    renderAuthWidgets,
  };
})();
