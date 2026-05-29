(function () {
  const labels = {
    en: 'English',
    ko: '한국어',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
  };

  const t = {
    navHome: { en: 'Home', ko: '홈', de: 'Startseite', es: 'Inicio', fr: 'Accueil' },
    navTools: { en: 'All Tools', ko: '모든 도구', de: 'Alle Tools', es: 'Todas las herramientas', fr: 'Tous les outils' },
    navPricing: { en: 'Pricing', ko: '요금제', de: 'Preise', es: 'Precios', fr: 'Tarifs' },
    navLogin: { en: 'Login', ko: '로그인', de: 'Anmelden', es: 'Iniciar sesión', fr: 'Connexion' },
    navAccount: { en: 'Account', ko: '계정', de: 'Konto', es: 'Cuenta', fr: 'Compte' },
    navLogout: { en: 'Logout', ko: '로그아웃', de: 'Abmelden', es: 'Cerrar sesión', fr: 'Déconnexion' },
    navAdmin: { en: 'Admin', ko: '관리자', de: 'Admin', es: 'Admin', fr: 'Admin' },
    homeEyebrow: {
      en: 'All-in-one file conversion workspace',
      ko: '올인원 파일 변환 작업 공간',
      de: 'Arbeitsbereich für alle Dateikonvertierungen',
      es: 'Espacio todo en uno para convertir archivos',
      fr: 'Espace tout-en-un pour convertir les fichiers',
    },
    homeHeroA: { en: 'Convert anything.', ko: '무엇이든 변환하세요.', de: 'Konvertiere alles.', es: 'Convierte cualquier cosa.', fr: 'Convertissez tout.' },
    homeHeroB: {
      en: 'Work faster with',
      ko: '더 빠르게 작업하는',
      de: 'Arbeite schneller mit',
      es: 'Trabaja más rápido con',
      fr: 'Travaillez plus vite avec',
    },
    homeHeroAccent: {
      en: 'smarter file tools.',
      ko: '스마트 파일 도구.',
      de: 'smarteren Datei-Tools.',
      es: 'herramientas inteligentes.',
      fr: 'des outils plus intelligents.',
    },
    homeSubtitle: {
      en: 'Convert PDFs, images, videos, audio, documents, and office files in seconds. Fast, secure, and built for everyday work.',
      ko: 'PDF, 이미지, 비디오, 오디오, 문서, 오피스 파일을 몇 초 안에 변환하세요. 빠르고 안전하며 매일 쓰기 좋게 만들었습니다.',
      de: 'Konvertiere PDFs, Bilder, Videos, Audio, Dokumente und Office-Dateien in Sekunden. Schnell, sicher und für den Alltag gemacht.',
      es: 'Convierte PDF, imágenes, videos, audio, documentos y archivos Office en segundos. Rápido, seguro y listo para el trabajo diario.',
      fr: 'Convertissez PDF, images, vidéos, audio, documents et fichiers Office en quelques secondes. Rapide, sûr et conçu pour le quotidien.',
    },
    startConverting: { en: 'Start Converting', ko: '변환 시작', de: 'Konvertieren starten', es: 'Empezar a convertir', fr: 'Commencer' },
    exploreTools: { en: 'Explore All Tools', ko: '모든 도구 보기', de: 'Alle Tools ansehen', es: 'Explorar herramientas', fr: 'Explorer les outils' },
    searchTools: { en: 'Search tools...', ko: '도구 검색...', de: 'Tools suchen...', es: 'Buscar herramientas...', fr: 'Rechercher des outils...' },
    dragDrop: { en: 'Drag & drop your file here', ko: '파일을 여기에 끌어다 놓으세요', de: 'Datei hierher ziehen', es: 'Arrastra tu archivo aquí', fr: 'Déposez votre fichier ici' },
    chooseFile: { en: 'Choose File', ko: '파일 선택', de: 'Datei wählen', es: 'Elegir archivo', fr: 'Choisir un fichier' },
    noFile: { en: 'No file selected', ko: '선택된 파일 없음', de: 'Keine Datei ausgewählt', es: 'No hay archivo seleccionado', fr: 'Aucun fichier sélectionné' },
    convertFrom: { en: 'Convert from:', ko: '변환 전:', de: 'Konvertieren von:', es: 'Convertir desde:', fr: 'Convertir depuis :' },
    convertTo: { en: 'Convert to:', ko: '변환 후:', de: 'Konvertieren zu:', es: 'Convertir a:', fr: 'Convertir vers :' },
    popularTools: { en: 'Popular file tools', ko: '인기 파일 도구', de: 'Beliebte Datei-Tools', es: 'Herramientas populares', fr: 'Outils populaires' },
    popularToolsLead: {
      en: 'Start with the tools people use every day.',
      ko: '사람들이 매일 쓰는 도구부터 시작하세요.',
      de: 'Beginne mit Tools, die täglich genutzt werden.',
      es: 'Empieza con las herramientas más usadas.',
      fr: 'Commencez avec les outils les plus utilisés.',
    },
    whyTitle: { en: 'Why EverythingConvert', ko: 'EverythingConvert를 선택하는 이유', de: 'Warum EverythingConvert', es: 'Por qué EverythingConvert', fr: 'Pourquoi EverythingConvert' },
    footerTools: { en: 'Tools', ko: '도구', de: 'Tools', es: 'Herramientas', fr: 'Outils' },
    footerResources: { en: 'Resources', ko: '리소스', de: 'Ressourcen', es: 'Recursos', fr: 'Ressources' },
    footerCompany: { en: 'Company', ko: '회사', de: 'Unternehmen', es: 'Empresa', fr: 'Entreprise' },
    footerStay: { en: 'Stay updated', ko: '소식 받기', de: 'Auf dem Laufenden bleiben', es: 'Mantente al día', fr: 'Restez informé' },
    footerEmail: { en: 'Enter your email', ko: '이메일 입력', de: 'E-Mail eingeben', es: 'Introduce tu email', fr: 'Entrez votre e-mail' },
    copyright: {
      en: '© EverythingConvert.com v.00 All rights reserved (2026)',
      ko: '© EverythingConvert.com v.00 모든 권리 보유 (2026)',
      de: '© EverythingConvert.com v.00 Alle Rechte vorbehalten (2026)',
      es: '© EverythingConvert.com v.00 Todos los derechos reservados (2026)',
      fr: '© EverythingConvert.com v.00 Tous droits réservés (2026)',
    },
    aboutUs: { en: 'About Us', ko: '회사 소개', de: 'Über uns', es: 'Sobre nosotros', fr: 'À propos' },
    donate: { en: 'Donate', ko: '후원', de: 'Spenden', es: 'Donar', fr: 'Faire un don' },
    privacy: { en: 'Privacy', ko: '개인정보', de: 'Datenschutz', es: 'Privacidad', fr: 'Confidentialité' },
    terms: { en: 'Terms', ko: '이용약관', de: 'Bedingungen', es: 'Términos', fr: 'Conditions' },
    security: { en: 'Security and Compliance', ko: '보안 및 규정 준수', de: 'Sicherheit und Compliance', es: 'Seguridad y cumplimiento', fr: 'Sécurité et conformité' },
    contact: { en: 'Contact', ko: '문의', de: 'Kontakt', es: 'Contacto', fr: 'Contact' },
    authTitle: { en: 'Manage features with your account', ko: '계정으로 기능 관리하기', de: 'Funktionen mit deinem Konto verwalten', es: 'Gestiona funciones con tu cuenta', fr: 'Gérez les fonctions avec votre compte' },
    authSubtitle: {
      en: 'Free members can use standard extraction, and Pro members can use enhanced table detection.',
      ko: '무료 회원은 일반 추출을 사용할 수 있고, Pro 회원은 표 감지 강화 변환을 사용할 수 있습니다.',
      de: 'Kostenlose Mitglieder nutzen Standardextraktion, Pro-Mitglieder erweiterte Tabellenerkennung.',
      es: 'Los miembros gratuitos usan extracción estándar y los Pro detección avanzada de tablas.',
      fr: 'Les membres gratuits utilisent l’extraction standard, les membres Pro la détection avancée des tableaux.',
    },
    authGuest: { en: 'Guest', ko: '게스트', de: 'Gast', es: 'Invitado', fr: 'Invité' },
    authLoginRequired: { en: 'Login required', ko: '로그인이 필요합니다', de: 'Anmeldung erforderlich', es: 'Inicio de sesión requerido', fr: 'Connexion requise' },
    authChecking: { en: 'Checking...', ko: '확인 중...', de: 'Wird geprüft...', es: 'Comprobando...', fr: 'Vérification...' },
    authSupabaseRequired: { en: 'Supabase setup required', ko: 'Supabase 설정이 필요합니다', de: 'Supabase-Einrichtung erforderlich', es: 'Configuración de Supabase requerida', fr: 'Configuration Supabase requise' },
    authFree: { en: 'Free', ko: '무료', de: 'Kostenlos', es: 'Gratis', fr: 'Gratuit' },
    authPro: { en: 'Pro', ko: 'Pro', de: 'Pro', es: 'Pro', fr: 'Pro' },
    authAdmin: { en: 'Admin', ko: '관리자', de: 'Admin', es: 'Admin', fr: 'Admin' },
  };

  const phraseToKey = {};
  Object.entries(t).forEach(([key, values]) => {
    Object.values(values).forEach((value) => {
      phraseToKey[value] = key;
    });
  });

  let activeLanguage = 'en';
  let applying = false;

  function supported(language) {
    return Object.prototype.hasOwnProperty.call(labels, language);
  }

  function text(key, language = activeLanguage) {
    return (t[key] && (t[key][language] || t[key].en)) || key;
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem('everything_convert_language', language);
      localStorage.setItem('everything_convert_language_initialized', '1');
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function getUrlLanguage() {
    try {
      const language = new URLSearchParams(window.location.search).get('lang');
      return supported(language) ? language : null;
    } catch (error) {
      return null;
    }
  }

  function getSavedLanguage() {
    const urlLanguage = getUrlLanguage();
    if (urlLanguage) {
      saveLanguage(urlLanguage);
      return urlLanguage;
    }
    try {
      return localStorage.getItem('everything_convert_language') || 'en';
    } catch (error) {
      return 'en';
    }
  }

  function withLanguageParam(href, language) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
    try {
      const url = new URL(href, window.location.href);
      if (!['http:', 'https:', 'file:'].includes(url.protocol)) return href;
      url.searchParams.set('lang', language);
      if (url.protocol === 'file:') return url.href;
      if (url.origin === window.location.origin) return url.pathname + url.search + url.hash;
      return url.href;
    } catch (error) {
      return href;
    }
  }

  function updateLinks(language) {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.hasAttribute('data-auth-logout')) return;
      if (!link.dataset.baseHref) link.dataset.baseHref = link.getAttribute('href');
      link.setAttribute('href', withLanguageParam(link.dataset.baseHref, language));
    });
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function setAllText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function translateTextNodes(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-no-i18n]')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const trimmed = node.nodeValue.trim();
      const key = node.parentElement.dataset.i18nKey || phraseToKey[trimmed];
      if (!key || !t[key]) return;
      node.parentElement.dataset.i18nKey = key;
      node.nodeValue = node.nodeValue.replace(trimmed, text(key, language));
    });
  }

  function applyHome(language) {
    const hero = document.getElementById('homeHeroTitle');
    if (!hero) return;
    setText('.hero-eyebrow', text('homeEyebrow', language));
    hero.innerHTML = `${text('homeHeroA', language)}<br>${text('homeHeroB', language)} <span>${text('homeHeroAccent', language)}</span>`;
    setText('.home-hero-copy > p:not(.hero-eyebrow)', text('homeSubtitle', language));
    const primary = document.querySelector('.primary-cta');
    if (primary) primary.innerHTML = `${text('startConverting', language)} <i class="fa-solid fa-arrow-right"></i>`;
    setText('.secondary-cta', text('exploreTools', language));
    const search = document.getElementById('homeToolSearch');
    if (search) search.placeholder = text('searchTools', language);
    setText('#homeDropzone h2', text('dragDrop', language));
    const choose = document.querySelector('#homeChooseFile');
    if (choose) choose.innerHTML = `<i class="fa-regular fa-folder-open"></i> ${text('chooseFile', language)}`;
    setText('#selectedFileName', text('noFile', language));
    const labelsInHero = document.querySelectorAll('.quick-convert-row label span');
    if (labelsInHero[0]) labelsInHero[0].textContent = text('convertFrom', language);
    if (labelsInHero[1]) labelsInHero[1].textContent = text('convertTo', language);
    setText('#toolBrowserTitle', text('popularTools', language));
    setText('.tool-browser .section-heading p', text('popularToolsLead', language));
    setText('#whyTitle', text('whyTitle', language));
    setAllText('.tool-tab[data-tool-tab="popular"]', language === 'en' ? 'Popular' : text('popularTools', language).split(' ')[0]);
  }

  function applyFooter(language) {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const headings = Array.from(footer.querySelectorAll('.footer-group h2'));
    headings.forEach((heading) => {
      const current = heading.dataset.footerHeading || heading.textContent.trim();
      heading.dataset.footerHeading = current;
      if (/Tools|도구|Outils|Herramientas/i.test(current)) heading.textContent = text('footerTools', language);
      if (/Resources|리소스|Ressources|Recursos/i.test(current)) heading.textContent = text('footerResources', language);
      if (/Company|회사|Entreprise|Empresa/i.test(current)) heading.textContent = text('footerCompany', language);
      if (/Stay updated|소식|inform/i.test(current)) heading.textContent = text('footerStay', language);
    });
    const newsletter = footer.querySelector('.newsletter-form input');
    if (newsletter) newsletter.placeholder = text('footerEmail', language);
    const copyright = footer.querySelector('.footer-bottom p');
    if (copyright) copyright.textContent = text('copyright', language);
  }

  function applyAuth(language) {
    if (!document.body.classList.contains('auth-page')) return;
    setText('.hero-title', text('authTitle', language));
    setText('.hero-subtitle', text('authSubtitle', language));
  }

  function updateLanguageMenu(language) {
    document.querySelectorAll('[data-language-current]').forEach((element) => {
      element.textContent = labels[language];
    });
    document.querySelectorAll('[data-language]').forEach((button) => {
      const code = button.dataset.language;
      button.textContent = labels[code] || code;
      button.classList.toggle('active', code === language);
    });
  }

  function applyLanguage(language) {
    const selected = supported(language) ? language : 'en';
    if (applying) return;
    applying = true;
    activeLanguage = selected;
    document.documentElement.lang = selected;
    translateTextNodes(document.body, selected);
    applyHome(selected);
    applyFooter(selected);
    applyAuth(selected);
    updateLanguageMenu(selected);
    updateLinks(selected);
    if (window.EverythingConvertToolLanguage) {
      window.EverythingConvertToolLanguage.apply(selected);
    }
    window.dispatchEvent(new CustomEvent('everything-language-change', { detail: { language: selected } }));
    applying = false;
  }

  function scheduleApply(language = activeLanguage) {
    [0, 100, 500].forEach((delay) => {
      window.setTimeout(() => applyLanguage(language), delay);
    });
  }

  window.EverythingConvertLanguage = {
    apply: scheduleApply,
    translate: text,
    get() {
      return activeLanguage;
    },
    set(language) {
      saveLanguage(language);
      scheduleApply(language);
    },
  };

  function closeLanguageMenus(except) {
    document.querySelectorAll('.language-menu.open').forEach((menu) => {
      if (menu === except) return;
      menu.classList.remove('open');
      const toggle = menu.querySelector('.language-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.language-toggle');
    if (toggle) {
      event.preventDefault();
      const menu = toggle.closest('.language-menu');
      const willOpen = !menu.classList.contains('open');
      closeLanguageMenus(menu);
      menu.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }

    const option = event.target.closest('[data-language]');
    if (option) {
      const language = option.dataset.language;
      saveLanguage(language);
      scheduleApply(language);
      closeLanguageMenus();
      return;
    }

    if (!event.target.closest('.language-menu')) closeLanguageMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLanguageMenus();
  });

  const initialLanguage = getSavedLanguage();
  activeLanguage = supported(initialLanguage) ? initialLanguage : 'en';
  scheduleApply(activeLanguage);
  window.addEventListener('load', () => scheduleApply(activeLanguage));
})();
