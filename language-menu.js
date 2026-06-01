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
    // Why section
    whyFast: { en: 'Fast Conversion', ko: '빠른 변환', de: 'Schnelle Konvertierung', es: 'Conversión rápida', fr: 'Conversion rapide' },
    whyFastDesc: { en: 'Convert files in seconds with a clean workflow.', ko: '깔끔한 워크플로우로 몇 초 만에 파일을 변환하세요.', de: 'Konvertiere Dateien in Sekunden mit einem klaren Workflow.', es: 'Convierte archivos en segundos con un flujo de trabajo limpio.', fr: 'Convertissez des fichiers en quelques secondes avec un flux de travail clair.' },
    whyPrivacy: { en: 'Privacy First', ko: '개인정보 보호 최우선', de: 'Datenschutz zuerst', es: 'Privacidad primero', fr: 'La confidentialité d\'abord' },
    whyPrivacyDesc: { en: 'Your files are processed securely and never shared.', ko: '파일은 안전하게 처리되며 절대 공유되지 않습니다.', de: 'Deine Dateien werden sicher verarbeitet und niemals geteilt.', es: 'Tus archivos se procesan de forma segura y nunca se comparten.', fr: 'Vos fichiers sont traités en toute sécurité et ne sont jamais partagés.' },
    whyNoInstall: { en: 'No Software Install', ko: '소프트웨어 설치 없음', de: 'Keine Software-Installation', es: 'Sin instalación de software', fr: 'Aucune installation de logiciel' },
    whyNoInstallDesc: { en: '100% web-based. Nothing to download or install.', ko: '100% 웹 기반입니다. 다운로드하거나 설치할 필요가 없습니다.', de: '100% webbasiert. Nichts herunterzuladen oder zu installieren.', es: '100% basado en web. Nada que descargar o instalar.', fr: '100% basé sur le web. Rien à télécharger ou à installer.' },
    whyAnywhere: { en: 'Works Everywhere', ko: '어디서나 작동', de: 'Funktioniert überall', es: 'Funciona en todas partes', fr: 'Fonctionne partout' },
    whyAnywhereDesc: { en: 'Access tools from any device, anytime, anywhere.', ko: '언제 어디서나 모든 장치에서 도구에 접속하세요.', de: 'Greife jederzeit, überall und von jedem Gerät auf Tools zu.', es: 'Accede a las herramientas desde cualquier dispositivo, en cualquier momento y lugar.', fr: 'Accédez aux outils depuis n\'importe quel appareil, à tout moment, n\'importe où.' },
    // AI Section
    aiEyebrow: { en: 'Go beyond conversion.', ko: '단순한 변환 그 이상.', de: 'Gehe über Konvertierung hinaus.', es: 'Ve más allá de la conversión.', fr: 'Allez au-delà de la conversion.' },
    aiTitle: { en: 'Turn documents, audio, and images into usable content.', ko: '문서, 오디오, 이미지를 유용한 콘텐츠로 변환하세요.', de: 'Mache Dokumente, Audio und Bilder zu nutzbaren Inhalten.', es: 'Convierte documentos, audio e imágenes en contenido útil.', fr: 'Transformez des documents, de l\'audio et des images en contenu utile.' },
    tryAiTools: { en: 'Try AI Tools', ko: 'AI 도구 체험하기', de: 'KI-Tools ausprobieren', es: 'Probar herramientas de IA', fr: 'Essayer les outils d\'IA' },
    aiPdfSummary: { en: 'PDF Summary', ko: 'PDF 요약', de: 'PDF-Zusammenfassung', es: 'Resumen de PDF', fr: 'Résumé PDF' },
    aiPdfSummaryDesc: { en: 'Summarize long PDFs in seconds.', ko: '몇 초 만에 긴 PDF를 요약하세요.', de: 'Fasse lange PDFs in Sekunden zusammen.', es: 'Resume PDFs largos en segundos.', fr: 'Résumez de longs PDF en quelques secondes.' },
    aiAudioText: { en: 'Audio to Text', ko: '오디오를 텍스트로', de: 'Audio zu Text', es: 'Audio a texto', fr: 'Audio en texte' },
    aiAudioTextDesc: { en: 'Transcribe audio and video to text.', ko: '오디오 및 비디오를 텍스트로 변환하세요.', de: 'Transkribiere Audio und Video zu Text.', es: 'Transcribe audio y video a texto.', fr: 'Transcrivez de l\'audio et de la vidéo en texte.' },
    aiBgRemover: { en: 'Background Remover', ko: '배경 제거', de: 'Hintergrund-Entferner', es: 'Eliminador de fondo', fr: 'Suppresseur de fond' },
    aiBgRemoverDesc: { en: 'Remove backgrounds from any image.', ko: '모든 이미지의 배경을 제거하세요.', de: 'Entferne Hintergründe von jedem Bild.', es: 'Elimina el fondo de cualquier imagen.', fr: 'Supprimez les fonds de n\'importe quelle image.' },
    aiImageUpscaler: { en: 'Image Upscaler', ko: '이미지 업스케일러', de: 'Bild-Upscaler', es: 'Mejorador de imagen', fr: 'Améliorateur d\'image' },
    aiImageUpscalerDesc: { en: 'Enhance resolution without losing quality.', ko: '품질 저하 없이 해상도를 향상시키세요.', de: 'Verbessere die Auflösung ohne Qualitätsverlust.', es: 'Mejora la resolución sin perder calidad.', fr: 'Améliorez la resolución sans perte de qualité.' },
    // Use Cases Section
    useCasesTitle: { en: 'Built for everyone', ko: '모두를 위한 도구', de: 'Für alle gemacht', es: 'Construido para todos', fr: 'Conçu pour tout le monde' },
    forOfficeWorkers: { en: 'For Office Workers', ko: '직장인을 위해', de: 'Für Büroangestellte', es: 'Para oficinistas', fr: 'Pour les employés de bureau' },
    forCreators: { en: 'For Creators', ko: '크리에이터를 위해', de: 'Für Creator', es: 'Para creadores', fr: 'Pour les créateurs' },
    forStudents: { en: 'For Students', ko: '학생을 위해', de: 'Für Studenten', es: 'Para estudiantes', fr: 'Pour les étudiants' },
    forDevelopers: { en: 'For Developers', ko: '개발자를 위해', de: 'Für Entwickler', es: 'Para desarrolladores', fr: 'Pour les développeurs' },
    forOnlineSellers: { en: 'For Online Sellers', ko: '온라인 판매자를 위해', de: 'Für Online-Verkäufer', es: 'Para vendedores online', fr: 'Pour les vendeurs en ligne' },
    // Security note
    securityPrivate: { en: 'Private by design.', ko: '설계부터 프라이버시를 고려합니다.', de: 'Private by Design.', es: 'Privacidad por diseño.', fr: 'Privé par conception.' },
    securityPrivateDesc: { en: 'No suspicious downloads, no required browser extensions, and no unnecessary permissions. Just secure browser-based file conversion.', ko: '의심스러운 다운로드, 브라우저 확장 프로그램 설치 요구, 불필요한 권한 요청이 없습니다. 안전한 브라우저 기반 파일 변환만 제공합니다.', de: 'Keine verdächtigen Downloads, keine erforderlichen Browser-Erweiterungen und keine unnötigen Berechtigungen. Nur sichere webbasierte Dateikonvertierung.', es: 'Sin descargas sospechosas, sin extensiones de navegador requeridas y sin permisos innecesarios. Solo conversión segura basada en el navegador.', fr: 'Aucun téléchargement suspect, aucune extension de navigateur requise et aucune autorisation inutile. Juste une conversion de fichiers sécurisée basée sur le navigateur.' },
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
