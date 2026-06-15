(function () {
  var loaded = false;

  function mayShowAds() {
    // Pro plan includes "No ads": skip loading AdSense entirely when the cached
    // auth identity says the visitor is a confirmed pro or admin. The snapshot
    // only ever caches confirmed pro/admin (see auth.js writeAuthIdentityCache),
    // so free users keep ads even while the cache is warm.
    try {
      var raw = window.localStorage.getItem('everything_convert_auth_identity_snapshot');
      if (raw) {
        var cached = JSON.parse(raw);
        if (cached && (cached.plan === 'pro' || cached.role === 'admin')) return false;
      }
    } catch (error) {
      // Storage unavailable: fall through and show ads if consent allows it.
    }
    return true;
  }

  function hasAdConsent() {
    try {
      var raw = window.localStorage.getItem('everything_convert_cookie_consent_v1');
      if (!raw) return false;
      var consent = JSON.parse(raw);
      return !!(consent && consent.ads);
    } catch (error) {
      return false;
    }
  }

  function loadAds() {
    if (loaded || !mayShowAds() || !hasAdConsent()) return;
    if (document.querySelector('script[data-ec-adsense]')) {
      loaded = true;
      return;
    }
    var script = document.createElement('script');
    script.async = true;
    script.dataset.ecAdsense = 'true';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7281685131923147';
    script.crossOrigin = 'anonymous';
    (document.head || document.documentElement).appendChild(script);
    loaded = true;
  }

  window.EverythingConvertAds = {
    load: loadAds
  };

  window.addEventListener('everythingconvert:consentchange', function (event) {
    if (event.detail && event.detail.ads) loadAds();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAds);
  } else {
    loadAds();
  }
})();
