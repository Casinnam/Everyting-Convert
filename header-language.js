(function () {
  const translations = {
    ko: {
      'All Tools': '모든 도구',
      Documents: '문서',
      Media: '미디어',
      Developer: '개발자',
      'AI Tools': 'AI 도구',
      Pricing: '요금제',
      Login: '로그인',
      Logout: '로그아웃',
      Admin: '관리자',
      Account: '계정',
      'My Conversions': '내 변환 기록',
      'Buy Credits': '크레딧 구매',
      'Admin Dashboard': '관리자 대시보드',
      Membership: '멤버십',
      'AI Credits': 'AI 크레딧',
      'Try Pro': 'Try Pro',
      Checking: '확인 중',
      'Checking...': '확인 중...',
      Popular: '인기',
      'PDF Converters': 'PDF 변환',
      'PDF Tools': 'PDF 도구',
      Image: '이미지',
      'Video & Audio': '비디오 & 오디오',
      'Image Tools': '이미지 도구',
      'Office & Ebooks': '오피스 & 전자책',
      'QR & Data': 'QR & 데이터',
      'Developer Utilities': '개발자 도구',
      'AI Roadmap': 'AI 로드맵',
      Contact: '문의',
      'Search tools...': '도구 검색...',
    },
    de: {
      'All Tools': 'Alle Tools',
      Documents: 'Dokumente',
      Media: 'Medien',
      Developer: 'Entwickler',
      'AI Tools': 'KI-Tools',
      Pricing: 'Preise',
      Login: 'Anmelden',
      Logout: 'Abmelden',
      Admin: 'Admin',
      Account: 'Konto',
      'My Conversions': 'Meine Konvertierungen',
      'Buy Credits': 'Credits kaufen',
      'Admin Dashboard': 'Admin-Dashboard',
      Membership: 'Mitgliedschaft',
      'AI Credits': 'KI-Credits',
      'Try Pro': 'Try Pro',
      Checking: 'Pruefen',
      'Checking...': 'Pruefen...',
      Popular: 'Beliebt',
      'PDF Converters': 'PDF-Konverter',
      'PDF Tools': 'PDF-Tools',
      Image: 'Bild',
      'Video & Audio': 'Video & Audio',
      'Image Tools': 'Bild-Tools',
      'Office & Ebooks': 'Office & E-Books',
      'QR & Data': 'QR & Daten',
      'Developer Utilities': 'Entwickler-Tools',
      'AI Roadmap': 'KI-Roadmap',
      Contact: 'Kontakt',
      'Search tools...': 'Tools suchen...',
    },
    es: {
      'All Tools': 'Todas las herramientas',
      Documents: 'Documentos',
      Media: 'Medios',
      Developer: 'Desarrollador',
      'AI Tools': 'Herramientas IA',
      Pricing: 'Precios',
      Login: 'Iniciar sesión',
      Logout: 'Cerrar sesión',
      Admin: 'Admin',
      Account: 'Cuenta',
      'My Conversions': 'Mis conversiones',
      'Buy Credits': 'Comprar créditos',
      'Admin Dashboard': 'Panel de administración',
      Membership: 'Membresía',
      'AI Credits': 'Créditos IA',
      'Try Pro': 'Try Pro',
      Checking: 'Comprobando',
      'Checking...': 'Comprobando...',
      Popular: 'Popular',
      'PDF Converters': 'Convertidores PDF',
      'PDF Tools': 'Herramientas PDF',
      Image: 'Imagen',
      'Video & Audio': 'Video y audio',
      'Image Tools': 'Herramientas de imagen',
      'Office & Ebooks': 'Office y ebooks',
      'QR & Data': 'QR y datos',
      'Developer Utilities': 'Utilidades para desarrolladores',
      'AI Roadmap': 'Ruta de IA',
      Contact: 'Contacto',
      'Search tools...': 'Buscar herramientas...',
    },
    fr: {
      'All Tools': 'Tous les outils',
      Documents: 'Documents',
      Media: 'Media',
      Developer: 'Développeur',
      'AI Tools': 'Outils IA',
      Pricing: 'Tarifs',
      Login: 'Connexion',
      Logout: 'Déconnexion',
      Admin: 'Admin',
      Account: 'Compte',
      'My Conversions': 'Mes conversions',
      'Buy Credits': 'Acheter des crédits',
      'Admin Dashboard': 'Tableau de bord admin',
      Membership: 'Adhésion',
      'AI Credits': 'Crédits IA',
      'Try Pro': 'Try Pro',
      Checking: 'Vérification',
      'Checking...': 'Vérification...',
      Popular: 'Populaire',
      'PDF Converters': 'Convertisseurs PDF',
      'PDF Tools': 'Outils PDF',
      Image: 'Image',
      'Video & Audio': 'Vidéo et audio',
      'Image Tools': 'Outils image',
      'Office & Ebooks': 'Office et ebooks',
      'QR & Data': 'QR et données',
      'Developer Utilities': 'Outils développeur',
      'AI Roadmap': 'Feuille de route IA',
      Contact: 'Contact',
      'Search tools...': 'Rechercher des outils...',
    },
  };

  const canonicalPhrase = {};
  Object.values(translations).forEach((languageMap) => {
    Object.entries(languageMap).forEach(([english, translated]) => {
      canonicalPhrase[english] = english;
      canonicalPhrase[translated] = english;
    });
  });

  function getSavedLanguage() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('lang');
    if (translations[fromUrl] || fromUrl === 'en') return fromUrl;
    if (window.EverythingConvertLanguage && typeof window.EverythingConvertLanguage.get === 'function') {
      const current = window.EverythingConvertLanguage.get();
      if (translations[current] || current === 'en') return current;
    }
    try {
      const saved = localStorage.getItem('everything_convert_language');
      if (translations[saved] || saved === 'en') return saved;
    } catch (error) {
      return 'en';
    }
    return 'en';
  }

  function translate(value, language) {
    const english = canonicalPhrase[value] || value;
    if (language === 'en') return english;
    return (translations[language] && translations[language][english]) || english;
  }

  function replaceTextNode(node, language) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = translate(trimmed, language);
    if (translated === trimmed) return;
    node.nodeValue = original.replace(trimmed, translated);
  }

  function translatePlaceholders(root, language) {
    root.querySelectorAll('input[placeholder]').forEach((input) => {
      const current = input.getAttribute('placeholder');
      const translated = translate(current, language);
      if (translated !== current) input.setAttribute('placeholder', translated);
    });
  }

  // activeLanguage tracks the most recently requested language so that
  // applyHeaderLanguage always uses the correct target even if the 30 ms
  // debounce fires after language-menu.js has already moved on.
  let activeLanguage = null;

  function applyHeaderLanguage() {
    const header = document.querySelector('.ec-unified-header') || document.querySelector('header');
    if (!header) return;
    const language = activeLanguage || getSavedLanguage();
    const walker = document.createTreeWalker(header, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,textarea,select,[data-no-i18n]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => replaceTextNode(node, language));
    translatePlaceholders(header, language);
  }

  let timer = null;

  function scheduleApply() {
    window.clearTimeout(timer);
    timer = window.setTimeout(applyHeaderLanguage, 30);
  }

  window.EverythingConvertHeaderLanguage = {
    apply: scheduleApply,
  };

  document.addEventListener('DOMContentLoaded', () => {
    [0, 100, 500].forEach((delay) => window.setTimeout(applyHeaderLanguage, delay));
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  // Capture the target language from the event detail so that even if
  // language-menu.js fires another scheduleApply in the background the
  // header always ends up in the language the user just selected.
  window.addEventListener('everything-language-change', (event) => {
    const lang = event && event.detail && event.detail.language;
    if (lang) activeLanguage = lang;
    scheduleApply();
  });

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-language]');
    if (btn) {
      activeLanguage = btn.dataset.language;
      scheduleApply();
    }
  });
})();
