(function () {
  // Pro plan includes "No ads": skip loading AdSense entirely when the cached
  // auth identity says the visitor is a confirmed pro or admin. The snapshot
  // only ever caches confirmed pro/admin (see auth.js writeAuthIdentityCache),
  // so free users keep ads even while the cache is warm.
  try {
    var raw = window.localStorage.getItem('everything_convert_auth_identity_snapshot');
    if (raw) {
      var cached = JSON.parse(raw);
      if (cached && (cached.plan === 'pro' || cached.role === 'admin')) return;
    }
  } catch (error) {
    // Storage unavailable: fall through and show ads.
  }

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7281685131923147';
  script.crossOrigin = 'anonymous';
  (document.head || document.documentElement).appendChild(script);
})();
