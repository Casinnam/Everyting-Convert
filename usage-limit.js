(function () {
  const DEFAULT_LIMIT = 10;
  const COUNT_PREFIX = 'everything_convert_usage_count_';
  const DEFAULT_ID_KEY = 'everything_convert_usage_identity';

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

  function isProUser() {
    return Boolean(
      window.EverythingConvertAuth &&
      window.EverythingConvertAuth.isPro &&
      window.EverythingConvertAuth.isPro()
    );
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
      key: `${COUNT_PREFIX}${identity}`,
      isPro: isProUser,
    });
    return controller;
  }

  function panelText(remaining) {
    if (remaining === Infinity) return 'Pro plan active: unlimited conversions';
    return `${remaining} free conversions left`;
  }

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
    badge.textContent = 'Checking free conversions...';
    main.insertBefore(badge, main.firstChild);
  }

  async function renderUsage() {
    const usage = await getController();
    document.querySelectorAll('[data-usage-badge]').forEach((element) => {
      element.textContent = panelText(usage.remaining());
    });
  }

  function showUpgradeModal() {
    const oldModal = document.querySelector('.usage-modal-backdrop');
    if (oldModal) oldModal.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'usage-modal-backdrop';
    backdrop.innerHTML = `
      <div class="usage-modal" role="dialog" aria-modal="true" aria-labelledby="usageModalTitle">
        <button class="usage-modal-close" type="button" aria-label="Close">×</button>
        <p class="usage-kicker">Free limit reached</p>
        <h2 id="usageModalTitle">You used all 10 free conversions.</h2>
        <p>Log in with a Pro account to keep converting without limits, use enhanced table detection, and unlock larger-file workflows.</p>
        <div class="usage-modal-actions">
          <a class="usage-primary" href="${rootPrefix()}pricing.html">See pricing</a>
          <a class="usage-secondary" href="${rootPrefix()}auth.html">Log in</a>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    backdrop.querySelector('.usage-modal-close').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) backdrop.remove();
    });
  }

  async function guardConversion() {
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

    const usage = await getController();
    if (!usage.canConvert()) {
      showUpgradeModal();
      renderUsage();
      return false;
    }

    usage.recordConversion();
    renderUsage();
    return true;
  }

  function installConversionGuard() {
    ensureStyles();
    ensureUsageBadge();
    renderUsage();

    document.addEventListener('click', async (event) => {
      const button = event.target.closest('#convertBtn, [data-usage-guard]');
      if (!button || button.disabled) return;
      if (button.dataset.usageBypass === '1') return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const allowed = await guardConversion();
      if (!allowed) {
        return;
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
