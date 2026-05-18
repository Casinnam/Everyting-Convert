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
  const cacheKey = 'everything_convert_auth_snapshot';

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

  function formatPlan() {
    if (!state.user) return 'Guest';
    const plan = isPro() ? 'Pro' : 'Free';
    return isAdmin() ? `${plan} · Admin` : plan;
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

  function readAuthCache() {
    try {
      const raw = window.localStorage.getItem(cacheKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeAuthCache() {
    if (!state.user || !state.profile) return;
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify({
        username: displayName(),
        plan: state.profile.plan || 'free',
        role: state.profile.role || 'user',
        savedAt: Date.now(),
      }));
    } catch (error) {
      // Ignore storage failures; auth still works through Supabase.
    }
  }

  function clearAuthCache() {
    try {
      window.localStorage.removeItem(cacheKey);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function renderCachedAuthWidgets() {
    const cached = readAuthCache();
    if (!cached || !cached.username) return false;

    const plan = cached.plan === 'pro' ? 'Pro' : 'Free';
    const label = cached.role === 'admin'
      ? `${shortName(cached.username)} · ${plan} · Admin`
      : `${shortName(cached.username)} · ${plan}`;

    document.querySelectorAll('[data-auth-state]').forEach((element) => {
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
      element.style.display = cached.role === 'admin' ? '' : 'none';
    });

    return true;
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
    state.profile = state.user
      ? { id: state.user.id, email: state.user.email, username: emailPrefix(state.user.email), plan: 'free', role: 'user' }
      : null;
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
          .select('id,email,username,plan,role')
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
        data = fallback.data ? { ...fallback.data, username: emailPrefix(state.user.email), role: 'user' } : null;
      }
    } else if (error) {
      console.warn('Could not load profile:', error.message);
    } else {
      data = profileWithRole;
    }

    state.profile = data || { id: state.user.id, email: state.user.email, username: emailPrefix(state.user.email), plan: 'free', role: 'user' };
    if (!state.profile.username) state.profile.username = emailPrefix(state.user.email);
    writeAuthCache();
    return state.profile;
  }

  function renderAuthWidgets() {
    const authLabel = state.missingConfig
      ? 'Supabase 설정 필요'
      : state.user
        ? `${shortName(displayName())} · ${formatPlan()}`
        : '로그인 필요';

    document.querySelectorAll('[data-auth-state]').forEach((element) => {
      element.textContent = authLabel;
    });

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

    if (state.user) writeAuthCache();
    window.dispatchEvent(new CustomEvent('everything-auth-change', { detail: { ...state } }));
  }

  async function refresh() {
    const client = initClient();
    if (!client) {
      state.ready = true;
      renderAuthWidgets();
      return state;
    }

    let data = { session: null };
    try {
      const result = await withTimeout(client.auth.getSession(), '세션 확인');
      data = result.data || data;
      if (result.error) console.warn('Could not read auth session:', result.error.message);
    } catch (error) {
      console.warn('Could not read auth session:', error.message);
    }

    state.session = data && data.session ? data.session : null;
    state.user = state.session ? state.session.user : null;
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
    loadProfile()
      .then(renderAuthWidgets)
      .catch((profileError) => {
        console.warn('Could not refresh profile after login:', profileError.message);
        renderAuthWidgets();
      });
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
      },
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const client = initClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
    state.session = null;
    state.user = null;
    state.profile = null;
    clearAuthCache();
    renderAuthWidgets();
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
    const path = decodeURIComponent(window.location.pathname);
    const fileName = path.split('/').pop();
    const isRootPage = ['index.html', 'auth.html', 'admin.html', 'about.html', ''].includes(fileName);
    return isRootPage ? 'auth.html' : '../auth.html';
  }

  function getAuthRedirectUrl() {
    const authUrl = new URL(getAuthPath(), window.location.href);
    if (authUrl.protocol !== 'file:') return authUrl.href;

    const path = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
    const rootMarker = '/Everything Convert Main/';
    const markerIndex = path.indexOf(rootMarker);
    const relativePath = markerIndex >= 0
      ? path.slice(markerIndex + rootMarker.length)
      : 'auth.html';
    const depth = relativePath.includes('/')
      ? '../'.repeat(relativePath.split('/').length - 1)
      : '';

    return new URL(depth + 'auth.html', 'http://127.0.0.1:8016/' + relativePath).href;
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

  document.addEventListener('click', async (event) => {
    const logoutButton = event.target.closest('[data-auth-logout]');
    if (!logoutButton) return;
    event.preventDefault();
    try {
      await signOut();
      window.location.href = getAuthPath();
    } catch (error) {
      alert('로그아웃 실패: ' + error.message);
    }
  });

  function startAuth() {
    if (normalizeAuthRedirect()) return;
    renderCachedAuthWidgets();
    const client = initClient();
    if (client) {
      client.auth.onAuthStateChange(async () => {
        await refresh();
      });
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
    isPro,
    isAdmin,
    formatPlan,
    displayName,
    updateUsername,
  };
})();
