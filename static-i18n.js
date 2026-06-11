// static-i18n.js
// Translates hand-authored static tool-page sections (the data-static blocks
// added for SEO/AdSense) between English and Korean when the visitor switches
// language. Each translatable element carries a `data-ko` attribute holding its
// Korean innerHTML; the original English innerHTML is cached on first run.
//
// Other languages (de/es/fr) fall back to English for these sections for now.
// Loaded on every tool page (all of them already load language-menu.js, which
// dispatches the `everything-language-change` event this script listens for).
(function () {
  function currentLanguage() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl) return fromUrl;
      var saved = localStorage.getItem('everything_convert_language');
      if (saved) return saved;
    } catch (e) { /* ignore */ }
    return document.documentElement.lang || 'en';
  }

  function apply(language) {
    var nodes = document.querySelectorAll('[data-ko]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.__enHTML === undefined) el.__enHTML = el.innerHTML;
      el.innerHTML = (language === 'ko') ? el.getAttribute('data-ko') : el.__enHTML;
    }
  }

  function run() { apply(currentLanguage()); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.addEventListener('everything-language-change', function (event) {
    var lang = (event && event.detail && event.detail.language) || currentLanguage();
    apply(lang);
  });
})();
