(function () {
  const labels = {
    en: 'English',
    ko: '한국어',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
  };

  const translations = {
    navHome: {
      en: 'Home',
      ko: '홈',
      de: 'Startseite',
      es: 'Inicio',
      fr: 'Accueil',
    },
    navTools: {
      en: 'Tools',
      ko: '도구',
      de: 'Tools',
      es: 'Herramientas',
      fr: 'Outils',
    },
    navAbout: {
      en: 'About us',
      ko: '회사 소개',
      de: 'Über uns',
      es: 'Sobre nosotros',
      fr: 'À propos',
    },
    navAdmin: {
      en: 'Admin',
      ko: '관리자',
      de: 'Admin',
      es: 'Admin',
      fr: 'Admin',
    },
    navLogin: {
      en: 'Login',
      ko: '로그인',
      de: 'Anmelden',
      es: 'Iniciar sesión',
      fr: 'Connexion',
    },
    navAccount: {
      en: 'Account',
      ko: '계정',
      de: 'Konto',
      es: 'Cuenta',
      fr: 'Compte',
    },
    navLogout: {
      en: 'Logout',
      ko: '로그아웃',
      de: 'Abmelden',
      es: 'Cerrar sesión',
      fr: 'Déconnexion',
    },
    heroLine1: {
      en: 'Convert every file',
      ko: '모든 파일 변환을',
      de: 'Alle Dateien konvertieren',
      es: 'Convierte cualquier archivo',
      fr: 'Convertir tous les fichiers',
    },
    heroLine2: {
      en: 'faster by category',
      ko: '카테고리별로 빠르게',
      de: 'schneller nach Kategorie',
      es: 'más rápido por categoría',
      fr: 'plus vite par catégorie',
    },
    heroSubtitle: {
      en: 'Find and use PDF, image, document, audio, and GIF conversion tools in one place.',
      ko: 'PDF, 이미지, 문서, 음성, GIF 변환 도구를 한곳에서 찾고 사용할 수 있습니다.',
      de: 'Finden und nutzen Sie PDF-, Bild-, Dokument-, Audio- und GIF-Konverter an einem Ort.',
      es: 'Encuentra y usa herramientas para convertir PDF, imágenes, documentos, audio y GIF en un solo lugar.',
      fr: 'Trouvez et utilisez des outils de conversion PDF, image, document, audio et GIF au même endroit.',
    },
    pdfDocuments: {
      en: 'PDF & Documents',
      ko: 'PDF & 문서',
      de: 'PDF & Dokumente',
      es: 'PDF y documentos',
      fr: 'PDF et documents',
    },
    imageCategory: {
      en: 'Image',
      ko: '이미지',
      de: 'Bild',
      es: 'Imagen',
      fr: 'Image',
    },
    videoAudio: {
      en: 'Video & Audio',
      ko: '비디오 & 오디오',
      de: 'Video & Audio',
      es: 'Video y audio',
      fr: 'Vidéo et audio',
    },
    gifCategory: {
      en: 'GIF',
      ko: 'GIF',
      de: 'GIF',
      es: 'GIF',
      fr: 'GIF',
    },
    ready: {
      en: 'Available',
      ko: '사용 가능',
      de: 'Verfügbar',
      es: 'Disponible',
      fr: 'Disponible',
    },
    soon: {
      en: 'Coming soon',
      ko: '준비 중',
      de: 'Demnächst',
      es: 'Próximamente',
      fr: 'Bientôt',
    },
    allTools: {
      en: 'All tools',
      ko: '모든 도구',
      de: 'Alle Tools',
      es: 'Todas las herramientas',
      fr: 'Tous les outils',
    },
    copyright: {
      en: '© EverythingConvert.com v.00 All rights reserved (2026)',
      ko: '© EverythingConvert.com v.00 모든 권리 보유 (2026)',
      de: '© EverythingConvert.com v.00 Alle Rechte vorbehalten (2026)',
      es: '© EverythingConvert.com v.00 Todos los derechos reservados (2026)',
      fr: '© EverythingConvert.com v.00 Tous droits réservés (2026)',
    },
    authHero1: {
      en: 'Manage features',
      ko: '계정으로 기능을',
      de: 'Funktionen verwalten',
      es: 'Administra funciones',
      fr: 'Gérer les fonctions',
    },
    authHero2: {
      en: 'with your account',
      ko: '관리하세요',
      de: 'mit deinem Konto',
      es: 'con tu cuenta',
      fr: 'avec votre compte',
    },
    authSubtitle: {
      en: 'Free members can use standard extraction, and Pro members can use enhanced table detection.',
      ko: '무료 회원은 일반 추출을, Pro 회원은 표 감지 강화형 변환을 사용할 수 있습니다.',
      de: 'Kostenlose Mitglieder können die Standardextraktion nutzen, Pro-Mitglieder die erweiterte Tabellenerkennung.',
      es: 'Los miembros gratuitos pueden usar la extracción estándar y los miembros Pro pueden usar la detección avanzada de tablas.',
      fr: 'Les membres gratuits peuvent utiliser l’extraction standard, et les membres Pro la détection avancée des tableaux.',
    },
    signUp: {
      en: 'Sign up',
      ko: '회원가입',
      de: 'Registrieren',
      es: 'Registrarse',
      fr: 'S’inscrire',
    },
    continueGmail: {
      en: 'Continue with Gmail',
      ko: 'Gmail로 계속하기',
      de: 'Mit Gmail fortfahren',
      es: 'Continuar con Gmail',
      fr: 'Continuer avec Gmail',
    },
    continueEmail: {
      en: 'Or continue with email',
      ko: '또는 이메일로 계속',
      de: 'Oder mit E-Mail fortfahren',
      es: 'O continuar con correo electrónico',
      fr: 'Ou continuer avec l’e-mail',
    },
    userId: {
      en: 'User ID',
      ko: '유저 ID',
      de: 'Benutzer-ID',
      es: 'ID de usuario',
      fr: 'ID utilisateur',
    },
    email: {
      en: 'Email',
      ko: '이메일',
      de: 'E-Mail',
      es: 'Correo electrónico',
      fr: 'E-mail',
    },
    password: {
      en: 'Password',
      ko: '비밀번호',
      de: 'Passwort',
      es: 'Contraseña',
      fr: 'Mot de passe',
    },
    displayName: {
      en: 'Display name:',
      ko: '표시 이름:',
      de: 'Anzeigename:',
      es: 'Nombre visible:',
      fr: 'Nom affiché :',
    },
    membershipLevel: {
      en: 'Membership level:',
      ko: '회원 등급:',
      de: 'Mitgliedsstufe:',
      es: 'Nivel de membresía:',
      fr: 'Niveau d’adhésion :',
    },
    changeUserId: {
      en: 'Change User ID',
      ko: '유저 ID 변경',
      de: 'Benutzer-ID ändern',
      es: 'Cambiar ID de usuario',
      fr: 'Modifier l’ID utilisateur',
    },
    userIdHint: {
      en: 'This name appears in the top account label and the admin screen.',
      ko: '상단 계정 표시와 관리자 화면에 이 이름이 보입니다.',
      de: 'Dieser Name erscheint oben im Konto und im Admin-Bereich.',
      es: 'Este nombre aparece en la cuenta superior y en la pantalla de administración.',
      fr: 'Ce nom apparaît dans le compte en haut et dans l’écran d’administration.',
    },
    usernameRules: {
      en: 'Use 3-24 letters, numbers, or underscores. Example: hijacker05',
      ko: '영문, 숫자, 밑줄(_)만 사용해서 3~24자로 입력해 주세요. 예: hijacker05',
      de: 'Verwende 3-24 Buchstaben, Zahlen oder Unterstriche. Beispiel: hijacker05',
      es: 'Usa de 3 a 24 letras, números o guiones bajos. Ejemplo: hijacker05',
      fr: 'Utilisez 3 à 24 lettres, chiffres ou traits de soulignement. Exemple : hijacker05',
    },
    proMemberHint: {
      en: 'You are a Pro member. Enhanced table detection is available.',
      ko: 'Pro 회원입니다. 표 감지 강화형 변환을 사용할 수 있습니다.',
      de: 'Du bist Pro-Mitglied. Die erweiterte Tabellenerkennung ist verfügbar.',
      es: 'Eres miembro Pro. La detección avanzada de tablas está disponible.',
      fr: 'Vous êtes membre Pro. La détection avancée des tableaux est disponible.',
    },
    freeMemberHint: {
      en: 'You are a Free member. Standard text extraction is available, and enhanced table detection requires Pro.',
      ko: 'Free 회원입니다. 일반 텍스트 추출을 사용할 수 있고, 표 감지 강화형은 Pro 전용입니다.',
      de: 'Du bist Free-Mitglied. Standard-Textextraktion ist verfügbar; die erweiterte Tabellenerkennung erfordert Pro.',
      es: 'Eres miembro Free. La extracción de texto estándar está disponible; la detección avanzada de tablas requiere Pro.',
      fr: 'Vous êtes membre Free. L’extraction de texte standard est disponible ; la détection avancée des tableaux nécessite Pro.',
    },
    saveUserId: {
      en: 'Save User ID',
      ko: '유저 ID 저장',
      de: 'Benutzer-ID speichern',
      es: 'Guardar ID de usuario',
      fr: 'Enregistrer l’ID utilisateur',
    },
    goTools: {
      en: 'Go to tools',
      ko: '도구로 이동',
      de: 'Zu den Tools',
      es: 'Ir a herramientas',
      fr: 'Aller aux outils',
    },
    adminPage: {
      en: 'Admin page',
      ko: '관리자 페이지',
      de: 'Admin-Seite',
      es: 'Página de administración',
      fr: 'Page admin',
    },
    currentStatus: {
      en: 'Current status:',
      ko: '현재 상태:',
      de: 'Aktueller Status:',
      es: 'Estado actual:',
      fr: 'État actuel :',
    },
    checking: {
      en: 'Checking...',
      ko: '확인 중...',
      de: 'Prüfen...',
      es: 'Comprobando...',
      fr: 'Vérification...',
    },
    logoutKr: {
      en: 'Logout',
      ko: '로그아웃',
      de: 'Abmelden',
      es: 'Cerrar sesión',
      fr: 'Déconnexion',
    },
    aboutTitle1: {
      en: 'About',
      ko: '소개',
      de: 'Über',
      es: 'Acerca de',
      fr: 'À propos',
    },
    aboutTitle2: {
      en: 'Everything Convert',
      ko: 'Everything Convert',
      de: 'Everything Convert',
      es: 'Everything Convert',
      fr: 'Everything Convert',
    },
    aboutSubtitle: {
      en: 'A set of tools built to make file conversion faster, simpler, and safer.',
      ko: '파일 변환을 더 빠르고, 더 단순하고, 더 안전하게 만들기 위해 시작한 도구 모음입니다.',
      de: 'Eine Sammlung von Tools, die Dateikonvertierung schneller, einfacher und sicherer machen.',
      es: 'Un conjunto de herramientas creado para que la conversión de archivos sea más rápida, simple y segura.',
      fr: 'Un ensemble d’outils conçu pour rendre la conversion de fichiers plus rapide, plus simple et plus sûre.',
    },
    aboutPanel1Title: {
      en: 'What we build',
      ko: '우리가 만드는 것',
      de: 'Was wir entwickeln',
      es: 'Lo que creamos',
      fr: 'Ce que nous créons',
    },
    aboutPanel1Text: {
      en: 'Everything Convert is a web platform that brings PDF, image, document, audio, and GIF conversion tools into one place. Users can convert files directly in the browser without complicated installation.',
      ko: 'Everything Convert는 PDF, 이미지, 문서, 오디오, GIF 변환 도구를 한곳에 모으는 웹 플랫폼입니다. 사용자는 복잡한 설치 없이 브라우저에서 바로 파일을 변환하고 필요한 결과물을 받을 수 있습니다.',
      de: 'Everything Convert ist eine Webplattform, die PDF-, Bild-, Dokument-, Audio- und GIF-Konverter an einem Ort bündelt. Nutzer können Dateien direkt im Browser ohne komplizierte Installation konvertieren.',
      es: 'Everything Convert es una plataforma web que reúne herramientas de conversión de PDF, imágenes, documentos, audio y GIF en un solo lugar. Los usuarios pueden convertir archivos directamente en el navegador sin instalaciones complejas.',
      fr: 'Everything Convert est une plateforme web qui réunit des outils de conversion PDF, image, document, audio et GIF au même endroit. Les utilisateurs peuvent convertir des fichiers directement dans le navigateur sans installation compliquée.',
    },
    aboutPanel2Title: {
      en: 'Our direction',
      ko: '우리의 방향',
      de: 'Unsere Richtung',
      es: 'Nuestra dirección',
      fr: 'Notre direction',
    },
    aboutPanel2Text: {
      en: 'Even a small tool should feel useful in real work. Each feature is designed around quick access, clear status, easy downloads, and room for future Pro-level options.',
      ko: '작은 도구 하나도 실제 업무 흐름에서 편해야 한다고 생각합니다. 그래서 각 기능은 빠른 접근, 명확한 상태 표시, 쉬운 다운로드, 그리고 필요한 경우 Pro 기능 확장까지 고려해 설계합니다.',
      de: 'Auch ein kleines Tool sollte im echten Arbeitsalltag nützlich sein. Jede Funktion wird für schnellen Zugriff, klare Statusanzeigen, einfache Downloads und zukünftige Pro-Optionen gestaltet.',
      es: 'Incluso una herramienta pequeña debe ser útil en el trabajo real. Cada función se diseña con acceso rápido, estados claros, descargas sencillas y espacio para futuras opciones Pro.',
      fr: 'Même un petit outil doit être utile dans le travail réel. Chaque fonctionnalité est pensée pour un accès rapide, des statuts clairs, des téléchargements simples et de futures options Pro.',
    },
    aboutPanel3Title: {
      en: 'Privacy and files',
      ko: '개인정보와 파일',
      de: 'Datenschutz und Dateien',
      es: 'Privacidad y archivos',
      fr: 'Confidentialité et fichiers',
    },
    aboutPanel3Text: {
      en: 'Core conversion tools are designed to run in the browser whenever possible. We prioritize processing files on the user’s device instead of uploading them to a server.',
      ko: '현재 주요 변환 기능은 브라우저 안에서 실행되도록 구성하고 있습니다. 가능한 한 파일을 서버로 업로드하지 않고, 사용자의 장치에서 직접 처리하는 방향을 우선합니다.',
      de: 'Die wichtigsten Konvertierungsfunktionen sollen nach Möglichkeit im Browser laufen. Wir priorisieren die Verarbeitung auf dem Gerät des Nutzers statt eines Server-Uploads.',
      es: 'Las herramientas principales están pensadas para ejecutarse en el navegador siempre que sea posible. Priorizamos procesar los archivos en el dispositivo del usuario en lugar de subirlos a un servidor.',
      fr: 'Les principaux outils de conversion sont conçus pour fonctionner dans le navigateur lorsque c’est possible. Nous privilégions le traitement sur l’appareil de l’utilisateur plutôt que l’envoi vers un serveur.',
    },
  };

  const phraseToKey = {};
  Object.entries(translations).forEach(([key, values]) => {
    Object.values(values).forEach((phrase) => {
      phraseToKey[phrase] = key;
    });
  });

  function isSupportedLanguage(language) {
    return Boolean(labels[language]);
  }

  let activeLanguage = 'en';

  function getLanguageFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const language = params.get('lang');
      return isSupportedLanguage(language) ? language : null;
    } catch (error) {
      return null;
    }
  }

  function getSavedLanguage() {
    const urlLanguage = getLanguageFromUrl();
    if (urlLanguage) {
      saveLanguage(urlLanguage);
      return urlLanguage;
    }

    try {
      if (!localStorage.getItem('everything_convert_language_initialized')) {
        localStorage.setItem('everything_convert_language_initialized', '1');
        localStorage.setItem('everything_convert_language', 'en');
        return 'en';
      }

      return localStorage.getItem('everything_convert_language') || 'en';
    } catch (error) {
      return 'en';
    }
  }

  function withLanguageParam(href, language) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return href;
    }

    try {
      const url = new URL(href, window.location.href);
      if (!['http:', 'https:', 'file:'].includes(url.protocol)) return href;

      url.searchParams.set('lang', language);
      if (url.protocol === 'file:') {
        return url.href;
      }

      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }

      return url.href;
    } catch (error) {
      return href;
    }
  }

  function updateLanguageLinks(language) {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.hasAttribute('data-auth-logout')) return;

      if (!link.dataset.baseHref) {
        link.dataset.baseHref = link.getAttribute('href');
      }

      link.setAttribute('href', withLanguageParam(link.dataset.baseHref, language));
    });
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem('everything_convert_language', language);
    } catch (error) {
      // Language choice is a convenience; ignore storage failures.
    }
  }

  function translateTextNodes(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        return node.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const original = node.nodeValue;
      const trimmed = original.trim();
      const key = node.parentElement.dataset.i18nKey || phraseToKey[trimmed];
      if (!key || !translations[key] || !translations[key][language]) return;

      node.parentElement.dataset.i18nKey = key;
      node.nodeValue = original.replace(trimmed, translations[key][language]);
    });
  }

  function applyLanguage(language) {
    const selected = labels[language] ? language : 'en';
    activeLanguage = selected;
    document.documentElement.lang = selected;
    translateTextNodes(document.body, selected);
    updateLanguageLinks(selected);

    document.querySelectorAll('[data-language-current]').forEach((element) => {
      element.textContent = labels[selected];
    });

    document.querySelectorAll('[data-language]').forEach((button) => {
      button.classList.toggle('active', button.dataset.language === selected);
    });

    document.title = selected === 'en'
      ? document.title.replace('모든 파일 변환의 시작', 'Start converting every file')
      : document.title;
  }

  window.EverythingConvertLanguage = {
    apply() {
      applyLanguage(activeLanguage);
    },
    get() {
      return activeLanguage;
    },
    set(language) {
      saveLanguage(language);
      applyLanguage(language);
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
      applyLanguage(language);
      closeLanguageMenus();
      return;
    }

    if (!event.target.closest('.language-menu')) closeLanguageMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLanguageMenus();
  });

  applyLanguage(getSavedLanguage());
})();
