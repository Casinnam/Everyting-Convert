(function () {
  const MEASUREMENT_ID = 'G-MWPYMT3Q6H';
  const ADS_ID = 'AW-18249432363'; // Google Ads — Pro purchase conversion tracking
  const CONSENT_KEY = 'everything_convert_cookie_consent_v1';
  const VERSION = '20260614a';
  const LANGS = {
    en: {
      title: 'Privacy choices',
      body: 'We use necessary storage for login, language, and security. With your permission, we also use analytics and ads to understand visits and keep free tools available.',
      accept: 'Accept all',
      reject: 'Reject optional',
      manage: 'Manage',
      save: 'Save choices',
      analytics: 'Analytics',
      ads: 'Ads',
      close: 'Close',
    },
    ko: {
      title: '개인정보 선택',
      body: '로그인, 언어 설정, 보안을 위한 필수 저장소를 사용합니다. 동의하시면 방문 분석과 광고를 통해 무료 도구 운영에 필요한 정보를 확인합니다.',
      accept: '모두 동의',
      reject: '선택 항목 거절',
      manage: '설정',
      save: '선택 저장',
      analytics: '방문 분석',
      ads: '광고',
      close: '닫기',
    },
    de: {
      title: 'Datenschutzeinstellungen',
      body: 'Wir nutzen notwendige Speicherung für Anmeldung, Sprache und Sicherheit. Mit Ihrer Zustimmung verwenden wir Analyse und Werbung.',
      accept: 'Alle akzeptieren',
      reject: 'Optionale ablehnen',
      manage: 'Anpassen',
      save: 'Auswahl speichern',
      analytics: 'Analyse',
      ads: 'Werbung',
      close: 'Schließen',
    },
    es: {
      title: 'Opciones de privacidad',
      body: 'Usamos almacenamiento necesario para inicio de sesión, idioma y seguridad. Con tu permiso usamos analítica y anuncios.',
      accept: 'Aceptar todo',
      reject: 'Rechazar opcional',
      manage: 'Configurar',
      save: 'Guardar',
      analytics: 'Analítica',
      ads: 'Anuncios',
      close: 'Cerrar',
    },
    fr: {
      title: 'Choix de confidentialité',
      body: 'Nous utilisons le stockage nécessaire pour la connexion, la langue et la sécurité. Avec votre accord, nous utilisons l’analyse et la publicité.',
      accept: 'Tout accepter',
      reject: 'Refuser optionnel',
      manage: 'Gérer',
      save: 'Enregistrer',
      analytics: 'Analyse',
      ads: 'Publicité',
      close: 'Fermer',
    },
  };

  const dataLayer = window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ dataLayer.push(arguments); };

  function getLang() {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const saved = window.localStorage && window.localStorage.getItem('everything_convert_lang');
    const htmlLang = document.documentElement.getAttribute('lang');
    const lang = (urlLang || saved || htmlLang || 'en').slice(0, 2).toLowerCase();
    return LANGS[lang] ? lang : 'en';
  }

  function getStoredConsent() {
    try {
      const raw = window.localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function consentStateToGtag(consent) {
    const analyticsGranted = consent && consent.analytics ? 'granted' : 'denied';
    const adsGranted = consent && consent.ads ? 'granted' : 'denied';
    return {
      analytics_storage: analyticsGranted,
      ad_storage: adsGranted,
      ad_user_data: adsGranted,
      ad_personalization: adsGranted,
      functionality_storage: 'granted',
      security_storage: 'granted',
    };
  }

  function updateConsent(consent, persist) {
    window.gtag('consent', 'update', consentStateToGtag(consent));
    if (persist) {
      try {
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify({
          version: VERSION,
          analytics: !!consent.analytics,
          ads: !!consent.ads,
          updatedAt: new Date().toISOString(),
        }));
      } catch (error) {}
    }
    window.dispatchEvent(new CustomEvent('everythingconvert:consentchange', { detail: consent }));
    if (consent && consent.ads && window.EverythingConvertAds && window.EverythingConvertAds.load) {
      window.EverythingConvertAds.load();
    }
  }

  function loadGtag() {
    if (document.querySelector('script[data-ec-ga]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.dataset.ecGa = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function track(name, params) {
    if (!name || typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      page_location: window.location.href,
      page_title: document.title,
    }, params || {}));
  }

  // Fire-and-forget: record a successful conversion in our own analytics table so
  // the admin dashboard can show per-tool usage (guests included). Best-effort —
  // never blocks the user. Skipped on file:// (local) where there is no API.
  function recordToolUsage(toolId) {
    if (window.location.protocol === 'file:') return;
    try {
      const auth = window.EverythingConvertAuth;
      const token = auth && auth.state && auth.state.session ? auth.state.session.access_token : '';
      fetch('/api/track-conversion', {
        method: 'POST',
        keepalive: true,
        headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
        body: JSON.stringify({ tool_id: String(toolId || 'unknown').slice(0, 64) }),
      }).catch(function () {});
    } catch (e) { /* analytics is best-effort */ }
  }

  function injectStyles() {
    if (document.getElementById('ec-cookie-consent-style')) return;
    const style = document.createElement('style');
    style.id = 'ec-cookie-consent-style';
    style.textContent = `
      .ec-cookie-consent{position:fixed;left:50%;bottom:18px;z-index:2147483000;transform:translateX(-50%);width:min(940px,calc(100vw - 28px));background:rgba(255,255,255,.96);backdrop-filter:blur(16px);border:1px solid rgba(148,163,184,.34);box-shadow:0 24px 70px rgba(15,23,42,.2);border-radius:22px;padding:18px;color:#0f172a;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .ec-cookie-consent[hidden]{display:none}
      .ec-cookie-consent__row{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}
      .ec-cookie-consent h2{margin:0 0 6px;font-size:1.02rem;line-height:1.2}
      .ec-cookie-consent p{margin:0;color:#475569;font-size:.9rem;line-height:1.55}
      .ec-cookie-consent__actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
      .ec-cookie-consent button{border:0;border-radius:999px;padding:.72rem 1rem;font-weight:800;cursor:pointer;font-size:.86rem}
      .ec-cookie-consent__accept{background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;box-shadow:0 12px 28px rgba(79,70,229,.24)}
      .ec-cookie-consent__reject,.ec-cookie-consent__manage{background:#eef2ff;color:#1e293b}
      .ec-cookie-consent__choices{display:none;margin-top:14px;padding-top:14px;border-top:1px solid rgba(148,163,184,.28);gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
      .ec-cookie-consent.is-managing .ec-cookie-consent__choices{display:flex}
      .ec-cookie-consent label{display:inline-flex;gap:8px;align-items:center;font-weight:800;color:#334155}
      .ec-cookie-consent input{width:18px;height:18px;accent-color:#4f46e5}
      @media (max-width:720px){.ec-cookie-consent__row{grid-template-columns:1fr}.ec-cookie-consent__actions{justify-content:flex-start}.ec-cookie-consent{bottom:12px;border-radius:18px}}
    `;
    document.head.appendChild(style);
  }

  function renderBanner(force) {
    const stored = getStoredConsent();
    if (!force && stored) return;
    const existing = document.getElementById('ecCookieConsent');
    if (existing) {
      existing.hidden = false;
      existing.classList.add('is-managing');
      return;
    }
    const t = LANGS[getLang()];
    injectStyles();
    const banner = document.createElement('section');
    banner.className = 'ec-cookie-consent';
    banner.id = 'ecCookieConsent';
    banner.setAttribute('aria-label', t.title);
    banner.innerHTML = `
      <div class="ec-cookie-consent__row">
        <div>
          <h2>${t.title}</h2>
          <p>${t.body}</p>
        </div>
        <div class="ec-cookie-consent__actions">
          <button type="button" class="ec-cookie-consent__reject" data-consent-reject>${t.reject}</button>
          <button type="button" class="ec-cookie-consent__manage" data-consent-manage>${t.manage}</button>
          <button type="button" class="ec-cookie-consent__accept" data-consent-accept>${t.accept}</button>
        </div>
      </div>
      <div class="ec-cookie-consent__choices">
        <div>
          <label><input type="checkbox" data-consent-analytics checked> ${t.analytics}</label>
          <label><input type="checkbox" data-consent-ads checked> ${t.ads}</label>
        </div>
        <button type="button" class="ec-cookie-consent__accept" data-consent-save>${t.save}</button>
      </div>
    `;
    document.body.appendChild(banner);
    if (stored) {
      const analyticsInput = banner.querySelector('[data-consent-analytics]');
      const adsInput = banner.querySelector('[data-consent-ads]');
      if (analyticsInput) analyticsInput.checked = !!stored.analytics;
      if (adsInput) adsInput.checked = !!stored.ads;
      banner.classList.add('is-managing');
    }
    banner.querySelector('[data-consent-accept]').addEventListener('click', () => {
      updateConsent({ analytics: true, ads: true }, true);
      banner.hidden = true;
      track('cookie_consent_update', { consent_choice: 'accept_all' });
    });
    banner.querySelector('[data-consent-reject]').addEventListener('click', () => {
      updateConsent({ analytics: false, ads: false }, true);
      banner.hidden = true;
    });
    banner.querySelector('[data-consent-manage]').addEventListener('click', () => {
      banner.classList.toggle('is-managing');
    });
    banner.querySelector('[data-consent-save]').addEventListener('click', () => {
      const analytics = banner.querySelector('[data-consent-analytics]').checked;
      const ads = banner.querySelector('[data-consent-ads]').checked;
      updateConsent({ analytics, ads }, true);
      banner.hidden = true;
      if (analytics) track('cookie_consent_update', { consent_choice: 'custom', ads_enabled: ads });
    });
  }

  function wireDelegatedEvents() {
    document.addEventListener('click', (event) => {
      const cookieSettings = event.target.closest('[href="#cookie-settings"], [data-cookie-settings]');
      if (cookieSettings) {
        event.preventDefault();
        renderBanner(true);
        return;
      }

      const checkout = event.target.closest('[data-stripe-checkout], #proCheckoutButton');
      if (checkout) track('begin_checkout', { checkout_type: 'pro_subscription' });

      const creditPack = event.target.closest('[data-buy-pack]');
      if (creditPack) track('begin_checkout', {
        checkout_type: 'ai_credit_pack',
        credit_pack: creditPack.getAttribute('data-buy-pack') || '',
      });

      const convert = event.target.closest('#convertBtn, [data-usage-guard], [data-convert-button]');
      if (convert) track('conversion_start', {
        tool_id: document.body.getAttribute('data-tool-id') || document.title || 'unknown',
      });
    }, true);

    window.addEventListener('everythingconvert:conversion-success', (event) => {
      const detail = event.detail || {};
      track('conversion_success', detail);
      recordToolUsage(detail.tool_id || document.body.getAttribute('data-tool-id') || 'unknown');
    });
    window.addEventListener('everythingconvert:conversion-error', (event) => {
      track('conversion_error', event.detail || {});
    });
  }

  window.EverythingConvertAnalytics = {
    track,
    updateConsent,
    getConsent: getStoredConsent,
    showConsentBanner: renderBanner,
  };

  const savedConsent = getStoredConsent();
  window.gtag('consent', 'default', consentStateToGtag(savedConsent || { analytics: false, ads: false }));
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
  window.gtag('config', ADS_ID);
  loadGtag();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      wireDelegatedEvents();
      renderBanner();
      if (window.location.hash === '#cookie-settings') renderBanner(true);
      if (savedConsent && savedConsent.ads && window.EverythingConvertAds) window.EverythingConvertAds.load();
    });
  } else {
    wireDelegatedEvents();
    renderBanner();
    if (window.location.hash === '#cookie-settings') renderBanner(true);
    if (savedConsent && savedConsent.ads && window.EverythingConvertAds) window.EverythingConvertAds.load();
  }
})();
