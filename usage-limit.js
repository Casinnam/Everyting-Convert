(function () {
  // Site-styled alert (falls back to native where ec-modal.js isn't loaded).
  function ecAlert(m) { return window.EverythingConvertUI ? window.EverythingConvertUI.alert(m) : Promise.resolve(window.alert(m)); }
  const DEFAULT_LIMIT = 5;
  const COUNT_PREFIX = 'everything_convert_usage_count_';
  const DEFAULT_ID_KEY = 'everything_convert_usage_identity';

  // Daily reset for the offline fallback counter (the server path resets daily by
  // keying the counter on the UTC date; mirror that here).
  function dayStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function safeStorage() {
    try {
      const testKey = '__everything_convert_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (error) {
      const values = new Map();
      return {
        getItem: (key) => (values.has(key) ? values.get(key) : null),
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
      };
    }
  }

  function createUsageController(options = {}) {
    const limit = Number.isFinite(options.limit) ? options.limit : DEFAULT_LIMIT;
    const storage = options.storage || safeStorage();
    const isPro = options.isPro || (() => false);
    const key = options.key || `${COUNT_PREFIX}local`;

    function count() {
      const raw = Number.parseInt(storage.getItem(key) || '0', 10);
      return Number.isFinite(raw) && raw > 0 ? raw : 0;
    }

    return {
      key,
      limit,
      count,
      remaining() {
        return isPro() ? Infinity : Math.max(0, limit - count());
      },
      canConvert() {
        return isPro() || count() < limit;
      },
      recordConversion() {
        if (isPro()) return count();
        const next = count() + 1;
        storage.setItem(key, String(next));
        return next;
      },
      reset() {
        storage.removeItem(key);
      },
    };
  }

  const storage = safeStorage();
  let identityPromise = null;
  let controller = null;
  let serverUsage = null;

  function isProUser() {
    return Boolean(
      window.EverythingConvertAuth &&
      window.EverythingConvertAuth.isPro &&
      window.EverythingConvertAuth.isPro()
    );
  }

  function isFreeToolPage() {
    return Boolean(document.querySelector('meta[name="usage-limit"][content="none"]'));
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

  function rootPrefix() {
    return '../'.repeat(pathDepth());
  }

  async function usageIdentity() {
    if (identityPromise) return identityPromise;

    identityPromise = (async () => {
      const cached = storage.getItem(DEFAULT_ID_KEY);
      if (cached) return cached;

      try {
        const response = await fetch(`${rootPrefix()}api/usage-identity`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data && data.identity) {
            storage.setItem(DEFAULT_ID_KEY, data.identity);
            return data.identity;
          }
        }
      } catch (error) {
        // Static hosting or local file access may not have the serverless helper.
      }

      const fallback = `browser-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      storage.setItem(DEFAULT_ID_KEY, fallback);
      return fallback;
    })();

    return identityPromise;
  }

  async function getController() {
    if (controller) return controller;
    const identity = await usageIdentity();
    controller = createUsageController({
      limit: DEFAULT_LIMIT,
      storage,
      key: `${COUNT_PREFIX}${identity}:${dayStamp()}`,
      isPro: isProUser,
    });
    return controller;
  }

  function authHeaders() {
    const auth = window.EverythingConvertAuth;
    const token = auth && auth.state && auth.state.session ? auth.state.session.access_token : '';
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function fetchServerUsage(method = 'GET') {
    const response = await fetch(`${rootPrefix()}api/usage-limit`, {
      method,
      cache: 'no-store',
      headers: authHeaders(),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = data && data.error ? data.error : 'Usage limit could not be checked.';
      const error = new Error(message);
      error.status = response.status;
      error.usage = data;
      throw error;
    }
    return data;
  }

  async function getUsageStatus() {
    if (isProUser()) {
      return {
        accountType: 'pro',
        limit: null,
        count: 0,
        remaining: null,
        canConvert: true,
        unlimited: true,
      };
    }

    try {
      serverUsage = await fetchServerUsage('GET');
      return serverUsage;
    } catch (error) {
      const fallback = await getController();
      return {
        limit: fallback.limit,
        count: fallback.count(),
        remaining: fallback.remaining(),
        canConvert: fallback.canConvert(),
        accountType: window.EverythingConvertAuth && window.EverythingConvertAuth.state && window.EverythingConvertAuth.state.user ? 'free' : 'guest',
        unlimited: false,
      };
    }
  }

  function remainingValue(usage) {
    if (!usage) return 0;
    if (typeof usage.remaining === 'function') return usage.remaining();
    return usage.remaining;
  }

  function panelText(usage) {
    const remaining = remainingValue(usage);
    const lang = (window.EverythingConvertLanguage && window.EverythingConvertLanguage.get && window.EverythingConvertLanguage.get()) || 'en';
    if (lang === 'ko') return `오늘 무료 다운로드 ${remaining}회 남음`;
    return `${remaining} free download${remaining === 1 ? '' : 's'} left today`;
  }

  // Hybrid badge policy: stay invisible while there is plenty of headroom, and
  // only surface the remaining count once the user is close to the daily limit
  // (a scarcity nudge at the decision moment, not a constant restriction).
  const USAGE_BADGE_THRESHOLD = 2;

  function ensureStyles() {
    if (document.getElementById('usageLimitStyles')) return;
    const style = document.createElement('style');
    style.id = 'usageLimitStyles';
    style.textContent = `
      .usage-badge {
        width: max-content;
        max-width: calc(100% - 2rem);
        margin: 0 auto 1.25rem;
        padding: 0.55rem 0.85rem;
        border: 1px solid rgba(59, 130, 246, 0.42);
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.78);
        color: #dbeafe;
        font: 700 0.84rem/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
      }
      .usage-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 1.25rem;
        background: rgba(2, 6, 23, 0.78);
        backdrop-filter: blur(10px);
      }
      .usage-modal {
        position: relative;
        width: min(520px, 100%);
        border: 1px solid rgba(148, 163, 184, 0.24);
        border-radius: 14px;
        padding: 2rem;
        background: #0f172a;
        color: #f8fafc;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
      }
      .usage-modal-close {
        position: absolute;
        top: 0.8rem;
        right: 0.8rem;
        width: 2rem;
        height: 2rem;
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 999px;
        background: transparent;
        color: #cbd5e1;
        cursor: pointer;
        font-size: 1.2rem;
      }
      .usage-kicker {
        margin: 0 0 0.65rem;
        color: #60a5fa;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 0.76rem;
        letter-spacing: 0.08em;
      }
      .usage-modal h2 {
        margin: 0 0 0.8rem;
        font-size: clamp(1.7rem, 5vw, 2.35rem);
        line-height: 1.05;
      }
      .usage-modal p {
        color: #94a3b8;
        line-height: 1.65;
      }
      .usage-modal-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      .usage-primary,
      .usage-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.8rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-weight: 800;
        text-decoration: none;
      }
      .usage-primary {
        background: #3b82f6;
        color: white;
      }
      .usage-secondary {
        border: 1px solid rgba(148, 163, 184, 0.32);
        color: #e2e8f0;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureUsageBadge() {
    if (document.querySelector('[data-usage-badge]')) return;
    const main = document.querySelector('main');
    if (!main) return;
    const badge = document.createElement('div');
    badge.setAttribute('data-usage-badge', '');
    badge.className = 'usage-badge';
    badge.textContent = '';
    badge.style.display = 'none'; // hidden until we know the count is low
    main.insertBefore(badge, main.firstChild);
  }

  async function renderUsage() {
    const usage = await getUsageStatus();
    const remaining = remainingValue(usage);
    // Show only when the free user is near the limit; never for Pro/admin.
    const show = Boolean(usage) && !usage.unlimited && typeof remaining === 'number' && remaining <= USAGE_BADGE_THRESHOLD;
    document.querySelectorAll('[data-usage-badge]').forEach((element) => {
      if (show) {
        element.textContent = panelText(usage);
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  }

  function showUpgradeModal() {
    const oldModal = document.querySelector('.usage-modal-backdrop');
    if (oldModal) oldModal.remove();

    const usage = serverUsage || {};
    const limit = usage.limit || DEFAULT_LIMIT;
    const isGuestLimit = usage.accountType === 'guest';
    const message = isGuestLimit
      ? 'Create a free account for more daily conversions, or upgrade to Pro for unlimited conversions, an ad-free workspace, and AI tools.'
      : 'You can convert again tomorrow when the daily limit resets, or upgrade to Pro for unlimited conversions, an ad-free workspace, and AI tools.';
    const accountLabel = isGuestLimit ? 'Log in or sign up' : 'Account';

    const backdrop = document.createElement('div');
    backdrop.className = 'usage-modal-backdrop';
    backdrop.innerHTML = `
      <div class="usage-modal" role="dialog" aria-modal="true" aria-labelledby="usageModalTitle">
        <button class="usage-modal-close" type="button" aria-label="Close">×</button>
        <p class="usage-kicker">Daily free limit reached</p>
        <h2 id="usageModalTitle">You've used all ${limit} free conversions today.</h2>
        <p>${message}</p>
        <div class="usage-modal-actions">
          <a class="usage-primary" href="${rootPrefix()}pricing.html">See pricing</a>
          <a class="usage-secondary" href="${rootPrefix()}auth.html">${accountLabel}</a>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    backdrop.querySelector('.usage-modal-close').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) backdrop.remove();
    });
  }

  async function checkConversionAllowed() {
    if (isFreeToolPage()) return true;

    if (
      window.EverythingConvertAuth &&
      window.EverythingConvertAuth.state &&
      !window.EverythingConvertAuth.state.ready &&
      window.EverythingConvertAuth.refresh
    ) {
      try {
        await window.EverythingConvertAuth.refresh();
      } catch (error) {
        // If auth cannot refresh, keep the free-limit path working.
      }
    }

    if (isProUser()) {
      renderUsage();
      return true;
    }

    try {
      const usage = await fetchServerUsage('GET');
      serverUsage = usage;
      if (usage && usage.canConvert === false) {
        showUpgradeModal();
        renderUsage();
        return false;
      }
      renderUsage();
      return true;
    } catch (error) {
      if (error.status === 429 || (error.usage && error.usage.canConvert === false)) {
        serverUsage = error.usage;
        showUpgradeModal();
        renderUsage();
        return false;
      }

      const fallback = await getController();
      if (!fallback.canConvert()) {
        serverUsage = {
          accountType: window.EverythingConvertAuth && window.EverythingConvertAuth.state && window.EverythingConvertAuth.state.user ? 'free' : 'guest',
          limit: fallback.limit,
          count: fallback.count(),
          remaining: 0,
          canConvert: false,
          unlimited: false,
        };
        showUpgradeModal();
        renderUsage();
        return false;
      }

      renderUsage();
      return true;
    }
  }

  async function recordSuccessfulConversion() {
    // Fire the analytics success signal for the funnel (analytics.js listens for
    // this). conversion_start already fires on the convert click; this records
    // the completion so we can measure the start -> success rate.
    try {
      window.dispatchEvent(new CustomEvent('everythingconvert:conversion-success', {
        detail: { tool_id: document.body.getAttribute('data-tool-id') || document.title || 'unknown' },
      }));
    } catch (error) { /* analytics is best-effort */ }

    if (isFreeToolPage()) return { skipped: true, reason: 'free-tool' };

    if (isProUser()) {
      renderUsage();
      return { skipped: true, reason: 'pro' };
    }

    try {
      const usage = await fetchServerUsage('POST');
      serverUsage = usage;
      renderUsage();
      return usage;
    } catch (error) {
      if (error.status === 429 || (error.usage && error.usage.canConvert === false)) {
        serverUsage = error.usage;
        showUpgradeModal();
        renderUsage();
        return { skipped: true, error: error.message };
      }

      const fallback = await getController();
      if (!fallback.canConvert()) {
        serverUsage = {
          accountType: window.EverythingConvertAuth && window.EverythingConvertAuth.state && window.EverythingConvertAuth.state.user ? 'free' : 'guest',
          limit: fallback.limit,
          count: fallback.count(),
          remaining: 0,
          canConvert: false,
          unlimited: false,
        };
        showUpgradeModal();
        renderUsage();
        return { skipped: true, reason: 'limit_reached' };
      }

      fallback.recordConversion();
      renderUsage();
      return {
        accountType: window.EverythingConvertAuth && window.EverythingConvertAuth.state && window.EverythingConvertAuth.state.user ? 'free' : 'guest',
        limit: fallback.limit,
        count: fallback.count(),
        remaining: fallback.remaining(),
        canConvert: fallback.canConvert(),
        unlimited: false,
      };
    }
  }

  // Gate a file download behind the daily free limit. Converting/previewing stays
  // free; only the actual download counts toward the limit. The SAME produced
  // result can be re-downloaded for free — pass `alreadyCounted: true` on repeat
  // downloads of an unchanged result so a user is never charged twice for it.
  //
  // Usage from a tool page:
  //   const res = await EverythingConvertUsageLimit.gatedDownload({
  //     alreadyCounted: resultCounted,
  //     download: () => { /* trigger the real browser download here */ },
  //   });
  //   if (res.ok) resultCounted = resultCounted || res.counted;
  //   // res.ok === false means the daily limit was hit (upgrade modal already shown)
  // Tracks result objects (a jsPDF doc, a Blob, an XLSX workbook, etc.) that have
  // already counted, so re-downloading the SAME result is free without each page
  // wiring its own flag. Pass `token: <resultObject>` for this automatic behavior,
  // or the explicit `alreadyCounted: <bool>` for primitives.
  const countedResults = new WeakSet();

  async function gatedDownload(options = {}) {
    const download = typeof options.download === 'function' ? options.download : null;
    if (!download) return { ok: false, reason: 'no-download' };

    const token = options.token && typeof options.token === 'object' ? options.token : null;
    const already = options.alreadyCounted || (token && countedResults.has(token));

    // Re-download of an already-counted result: always free and never blocked.
    if (already) {
      await download();
      return { ok: true, counted: false };
    }

    const allowed = await checkConversionAllowed();
    if (!allowed) return { ok: false, reason: 'limit_reached' };

    await download();
    // Pro/admin and free (meta="none") pages no-op inside recordSuccessfulConversion.
    await recordSuccessfulConversion();
    if (token) countedResults.add(token);
    return { ok: true, counted: true };
  }

  // ── Multi-file download helpers ───────────────────────────────────────────
  // Tools that produce several files (image converter, PDF split, …) offer two
  // ways to save: each file one-by-one, or everything bundled into a single ZIP.
  // Both run client-side — files never leave the browser — and both share the
  // same result token, so whichever the user picks (and re-picks) counts at most
  // once toward the daily limit.
  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  // Save every file individually, staggered so the browser doesn't drop the
  // rapid-fire download requests.
  function saveFilesIndividually(files) {
    files.forEach((f, i) => setTimeout(() => saveBlob(f.blob, f.name), i * 160));
  }

  // Lazy-load JSZip from the CDN the first time a ZIP is requested. Pages that
  // already include their own <script> tag (pdf-tools, pdf-to-jpg) resolve
  // instantly via the existing window.JSZip global.
  let jszipPromise = null;
  function loadJSZip() {
    if (typeof window !== 'undefined' && window.JSZip) return Promise.resolve(window.JSZip);
    if (jszipPromise) return jszipPromise;
    jszipPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      script.onload = () => window.JSZip ? resolve(window.JSZip) : reject(new Error('JSZip failed to load'));
      script.onerror = () => reject(new Error('JSZip failed to load'));
      document.head.appendChild(script);
    });
    return jszipPromise;
  }

  // Bundle [{name, blob}] into a single ZIP and download it. Throws on failure
  // (so the caller's gatedDownload does NOT count a failed attempt).
  async function zipAndDownload(files, zipName) {
    const JSZipCtor = await loadJSZip();
    const zip = new JSZipCtor();
    for (const f of files) zip.file(f.name, f.blob);
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    saveBlob(blob, (zipName || 'download').replace(/\.zip$/i, '') + '.zip');
  }

  // ── Shared result card (Group B converters) ───────────────────────────────
  // Replaces "auto-download after convert" with a consistent completion card:
  // a title, a limit-gated Download button, and a "Convert another file" reset.
  function ensureResultCardStyles() {
    if (typeof document === 'undefined' || document.getElementById('ecResultCardStyles')) return;
    const style = document.createElement('style');
    style.id = 'ecResultCardStyles';
    style.textContent = `
      .ec-result-card { text-align:center; margin-top:1.6rem; }
      .ec-result-title { font-family:'Bebas Neue', sans-serif; font-size:1.5rem; letter-spacing:2px; text-transform:uppercase; color:#0f172a; }
      .ec-download-actions { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:1.25rem; }
      .ec-download-btn { display:inline-flex; align-items:center; gap:10px; padding:1rem 2rem; background:transparent; border:2px solid #0f172a; color:#0f172a; font-family:inherit; font-weight:700; font-size:1.05rem; border-radius:8px; cursor:pointer; transition:all .2s; }
      .ec-download-btn:hover { background:#0f172a; color:#fff; }
      .ec-download-btn:disabled { opacity:.6; cursor:default; }
      .ec-download-btn-alt { border-color:#cbd5e1; color:#475569; }
      .ec-download-btn-alt:hover { background:#475569; border-color:#475569; color:#fff; }
      .ec-reset-btn { display:block; margin:1.25rem auto 0; padding:.55rem 1.4rem; background:none; border:1px solid #e2e8f0; color:#64748b; font-family:inherit; font-size:.8rem; letter-spacing:1px; text-transform:uppercase; border-radius:6px; cursor:pointer; transition:all .2s; }
      .ec-reset-btn:hover { border-color:#0f172a; color:#0f172a; }
      .ec-review { margin:1.5rem auto 0; padding-top:1.25rem; border-top:1px solid #eef2f7; max-width:420px; }
      .ec-review-q { font-size:.92rem; color:#475569; font-weight:600; }
      .ec-stars { display:inline-flex; gap:6px; margin-top:.6rem; }
      .ec-star { font-size:1.6rem; line-height:1; color:#cbd5e1; cursor:pointer; transition:color .12s, transform .12s; background:none; border:none; padding:2px; }
      .ec-star:hover { transform:scale(1.12); }
      .ec-star.on { color:#f59e0b; }
      .ec-review-comment { display:none; width:100%; box-sizing:border-box; margin-top:.85rem; padding:.6rem .75rem; border:1px solid #e2e8f0; border-radius:8px; font-family:inherit; font-size:.9rem; resize:vertical; min-height:54px; }
      .ec-review-send { display:none; margin-top:.7rem; padding:.5rem 1.4rem; background:#0f172a; color:#fff; border:none; border-radius:8px; font-family:inherit; font-weight:700; font-size:.85rem; cursor:pointer; }
      .ec-review-send:disabled { opacity:.6; cursor:default; }
      .ec-review-thanks { margin-top:.6rem; font-size:.9rem; color:#166534; font-weight:600; }
    `;
    document.head.appendChild(style);
  }

  // Best-effort tool id for a review: an explicit body[data-tool-id] wins;
  // otherwise derive a clean slug from the page's directory (e.g.
  // "/pdf to powerpoint/index.html" -> "pdf-to-powerpoint").
  function resolveToolId() {
    if (typeof document === 'undefined') return 'unknown';
    const explicit = document.body && document.body.getAttribute('data-tool-id');
    if (explicit && explicit.trim()) return explicit.trim().slice(0, 64);
    try {
      const parts = (window.location.pathname || '').split('/').filter(Boolean);
      while (parts.length && /\.(html?|php)$/i.test(parts[parts.length - 1])) parts.pop();
      const dir = parts.length ? parts[parts.length - 1] : '';
      const slug = decodeURIComponent(dir).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (slug) return slug.slice(0, 64);
    } catch (e) { /* ignore */ }
    return (document.title || 'unknown').slice(0, 64);
  }

  // Submit one review to the backend. Fire-and-forget; never throws to the card.
  async function submitToolReview(toolId, rating, comment) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = (window.EverythingConvertAuth && window.EverythingConvertAuth.state
        && window.EverythingConvertAuth.state.session && window.EverythingConvertAuth.state.session.access_token) || '';
      if (token) headers.Authorization = `Bearer ${token}`;
      await fetch('/api/tool-review', {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool_id: toolId, rating, comment: comment || '' }),
      });
    } catch (e) { /* swallow — a review must never disrupt the user */ }
  }

  // Build the "How was it?" star-rating widget appended under the download card.
  // Stars + an optional short comment (revealed after the first star). On submit
  // it POSTs to /api/tool-review and is replaced with a thank-you line. Shown at
  // most once per tool per browser (localStorage flag).
  function buildReviewWidget(pick) {
    if (typeof document === 'undefined') return null;
    const toolId = resolveToolId();
    const flagKey = 'ec_reviewed_' + toolId;
    try { if (localStorage.getItem(flagKey)) return null; } catch (e) { /* ignore */ }

    const wrap = document.createElement('div');
    wrap.className = 'ec-review';

    const q = document.createElement('div');
    q.className = 'ec-review-q';
    q.textContent = pick('How was this tool?', '이 도구는 어떠셨나요?');

    const stars = document.createElement('div');
    stars.className = 'ec-stars';
    let chosen = 0;
    const starEls = [];
    function paint(n) { starEls.forEach((s, i) => s.classList.toggle('on', i < n)); }
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('button');
      s.type = 'button';
      s.className = 'ec-star';
      s.textContent = '★';
      s.setAttribute('aria-label', i + ' star' + (i > 1 ? 's' : ''));
      s.addEventListener('mouseenter', () => paint(i));
      s.addEventListener('click', () => {
        chosen = i;
        paint(i);
        comment.style.display = 'block';
        send.style.display = 'inline-block';
      });
      starEls.push(s);
      stars.appendChild(s);
    }
    stars.addEventListener('mouseleave', () => paint(chosen));

    const comment = document.createElement('textarea');
    comment.className = 'ec-review-comment';
    comment.maxLength = 500;
    comment.placeholder = pick('Add a comment (optional)', '한마디 남겨주세요 (선택)');

    const send = document.createElement('button');
    send.type = 'button';
    send.className = 'ec-review-send';
    send.textContent = pick('Send', '보내기');
    send.addEventListener('click', async () => {
      if (!chosen) return;
      send.disabled = true;
      try { localStorage.setItem(flagKey, '1'); } catch (e) { /* ignore */ }
      submitToolReview(toolId, chosen, comment.value);
      wrap.innerHTML = '';
      const thanks = document.createElement('div');
      thanks.className = 'ec-review-thanks';
      thanks.textContent = pick('Thanks for your feedback!', '소중한 의견 감사합니다!');
      wrap.appendChild(thanks);
    });

    wrap.appendChild(q);
    wrap.appendChild(stars);
    wrap.appendChild(comment);
    wrap.appendChild(send);
    return wrap;
  }

  // opts: { mount, title, titleKo, downloadLabel, downloadLabelKo, token, download,
  //         hide:[elements to hide while the card shows], onAnother }
  // Multi-file mode: pass `files: [{name, blob}]` (and optional `zipName`)
  // instead of `download`. A single file renders one Download button; two or
  // more render BOTH "Download all" (each file) and "Download .zip" buttons,
  // sharing one result token so the user is charged at most once.
  function showDownloadCard(opts) {
    if (typeof document === 'undefined') return null;
    const mount = typeof opts.mount === 'string' ? document.querySelector(opts.mount) : opts.mount;
    if (!mount) { if (typeof opts.download === 'function') opts.download(); return null; }
    ensureResultCardStyles();

    const lang = (window.EverythingConvertLanguage && window.EverythingConvertLanguage.get && window.EverythingConvertLanguage.get()) || 'en';
    const pick = (en, ko) => (lang === 'ko' && ko) ? ko : en;
    const hideEls = (opts.hide || []).filter(Boolean);

    let card = mount.querySelector(':scope > .ec-result-card');
    if (!card) { card = document.createElement('div'); card.className = 'ec-result-card'; mount.appendChild(card); }
    card.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'ec-result-title';
    title.textContent = pick(opts.title || 'Conversion complete — your file is ready', opts.titleKo);
    if (opts.titleKo) title.setAttribute('data-ko', opts.titleKo);

    // Build a limit-gated download button. While its action runs, every button
    // in the actions row is disabled so a slow ZIP build can't be double-fired.
    function makeButton(labelEn, labelKo, iconClass, downloadFn, token, alt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ec-download-btn' + (alt ? ' ec-download-btn-alt' : '');
      btn.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span></span>`;
      const sp = btn.querySelector('span');
      sp.textContent = pick(labelEn, labelKo);
      if (labelKo) sp.setAttribute('data-ko', labelKo);
      btn.addEventListener('click', async () => {
        const row = btn.parentElement;
        const siblings = row ? Array.from(row.querySelectorAll('.ec-download-btn')) : [btn];
        siblings.forEach((b) => { b.disabled = true; });
        try { await gatedDownload({ token, download: downloadFn }); }
        finally { siblings.forEach((b) => { b.disabled = false; }); }
      });
      return btn;
    }

    const actions = document.createElement('div');
    actions.className = 'ec-download-actions';

    if (Array.isArray(opts.files)) {
      const files = opts.files.filter((f) => f && f.blob);
      const token = opts.token || opts.files;
      if (files.length > 1) {
        const zipName = opts.zipName || 'download';
        actions.appendChild(makeButton(
          opts.downloadLabel || `Download all (${files.length})`,
          opts.downloadLabelKo || `전체 다운로드 (${files.length})`,
          'fa-download', () => saveFilesIndividually(files), token, false));
        actions.appendChild(makeButton(
          'Download .zip', 'ZIP으로 받기',
          'fa-file-zipper', async () => {
            try { await zipAndDownload(files, zipName); }
            catch (e) { ecAlert('ZIP creation failed. Please use the individual downloads instead.'); throw e; }
          }, token, true));
      } else if (files.length === 1) {
        const one = files[0];
        actions.appendChild(makeButton(
          opts.downloadLabel || 'Download', opts.downloadLabelKo || '다운로드',
          'fa-download', () => saveBlob(one.blob, one.name), token, false));
      }
    } else {
      actions.appendChild(makeButton(
        opts.downloadLabel || 'Download', opts.downloadLabelKo,
        'fa-download', opts.download, opts.token, false));
    }

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'ec-reset-btn';
    reset.textContent = pick('Convert another file', '다른 파일 변환');
    reset.setAttribute('data-ko', '다른 파일 변환');
    reset.addEventListener('click', () => {
      card.style.display = 'none';
      hideEls.forEach((el) => { el.style.display = ''; });
      if (typeof opts.onAnother === 'function') opts.onAnother();
    });

    card.appendChild(title);
    card.appendChild(actions);
    card.appendChild(reset);
    if (opts.review !== false) {
      const review = buildReviewWidget(pick);
      if (review) card.appendChild(review);
    }
    card.style.display = '';
    hideEls.forEach((el) => { el.style.display = 'none'; });
    return { el: card, hide() { card.style.display = 'none'; hideEls.forEach((e) => { e.style.display = ''; }); } };
  }

  // Hide any result card under `mount` and restore the elements it hid. Call this
  // when a new file is selected so the convert button reappears.
  function clearDownloadCard(mount) {
    if (typeof document === 'undefined') return;
    const root = typeof mount === 'string' ? document.querySelector(mount) : (mount || document);
    if (!root) return;
    const card = root.querySelector ? root.querySelector('.ec-result-card') : null;
    if (card) card.style.display = 'none';
  }

  async function guardConversion() {
    return checkConversionAllowed();
  }

  function installConversionGuard() {
    if (isFreeToolPage()) return;

    ensureStyles();
    ensureUsageBadge();
    renderUsage();

    // NOTE: we intentionally do NOT auto-gate the convert button anymore.
    // Converting/previewing is free; the daily limit is enforced on the DOWNLOAD
    // action via EverythingConvertUsageLimit.gatedDownload(). Pages that still want
    // click-time gating can opt in with [data-usage-guard].
    document.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-usage-guard]');
      if (!button || button.disabled) return;
      if (button.dataset.usageBypass === '1') return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const allowed = await guardConversion();
      if (!allowed) {
        if (window.EverythingConvertAnalytics && window.EverythingConvertAnalytics.track) {
          window.EverythingConvertAnalytics.track('conversion_blocked', {
            tool_id: document.body.getAttribute('data-tool-id') || document.title || 'unknown',
            reason: 'usage_limit',
          });
        }
        return;
      }

      if (window.EverythingConvertAnalytics && window.EverythingConvertAnalytics.track) {
        window.EverythingConvertAnalytics.track('conversion_allowed', {
          tool_id: document.body.getAttribute('data-tool-id') || document.title || 'unknown',
        });
      }

      button.dataset.usageBypass = '1';
      button.click();
      delete button.dataset.usageBypass;
    }, true);

    window.addEventListener('everything-auth-change', () => renderUsage());
  }

  const api = {
    createUsageController,
    rootPrefix,
    getController,
    getUsageStatus,
    checkConversionAllowed,
    recordSuccessfulConversion,
    gatedDownload,
    showDownloadCard,
    clearDownloadCard,
    loadJSZip,
    zipAndDownload,
    guardConversion,
    renderUsage,
    showUpgradeModal,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  window.EverythingConvertUsageLimit = api;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', installConversionGuard);
    } else {
      installConversionGuard();
    }
  }
})();
