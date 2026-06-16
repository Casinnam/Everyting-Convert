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
    homeHeroB: { en: 'Work faster with', ko: '더 빠르게 작업하는', de: 'Arbeite schneller mit', es: 'Trabaja más rápido con', fr: 'Travaillez plus vite avec' },
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
    showcasePdfKicker: { en: 'PDF & Documents', ko: 'PDF 및 문서', de: 'PDF & Dokumente', es: 'PDF y documentos', fr: 'PDF et documents' },
    showcasePdfTitle: { en: 'Turn PDFs and office files into the format you need.', ko: 'PDF와 오피스 파일을 필요한 형식으로 바꾸세요.', de: 'Wandle PDFs und Office-Dateien in das passende Format um.', es: 'Convierte PDF y archivos Office al formato que necesitas.', fr: 'Transformez PDF et fichiers Office dans le format utile.' },
    showcasePdfText: { en: 'Convert PDF to Word, PDF to Excel, PDF Summary, Smart OCR, DOCX to PDF, and Excel to PDF from one focused workspace.', ko: 'PDF to Word, PDF to Excel, PDF Summary, Smart OCR, DOCX to PDF, Excel to PDF를 한 공간에서 빠르게 찾아보세요.', de: 'Nutze PDF zu Word, PDF zu Excel, PDF Summary, Smart OCR, DOCX zu PDF und Excel zu PDF an einem Ort.', es: 'Usa PDF a Word, PDF a Excel, PDF Summary, Smart OCR, DOCX a PDF y Excel a PDF desde un solo espacio.', fr: 'Utilisez PDF vers Word, PDF vers Excel, PDF Summary, Smart OCR, DOCX vers PDF et Excel vers PDF au même endroit.' },
    showcasePdfAction: { en: 'Explore PDF tools', ko: 'PDF 도구 보기', de: 'PDF-Tools ansehen', es: 'Ver herramientas PDF', fr: 'Voir les outils PDF' },
    showcaseImageKicker: { en: 'Image Tools', ko: '이미지 도구', de: 'Bildtools', es: 'Herramientas de imagen', fr: 'Outils image' },
    showcaseImageTitle: { en: 'Resize, convert, and package images for every channel.', ko: '이미지를 변환하고 채널별 크기로 준비하세요.', de: 'Skaliere, konvertiere und bereite Bilder für jeden Kanal vor.', es: 'Redimensiona, convierte y prepara imágenes para cada canal.', fr: 'Redimensionnez, convertissez et préparez vos images pour chaque canal.' },
    showcaseImageText: { en: 'Create PDFs from images, convert JPG, PNG, WEBP, and HEIC, then prepare social media sizes without extra software.', ko: '이미지로 PDF를 만들고 JPG, PNG, WEBP, HEIC를 변환하며 소셜 미디어 크기까지 준비할 수 있습니다.', de: 'Erstelle PDFs aus Bildern, konvertiere JPG, PNG, WEBP und HEIC und bereite Social-Media-Größen vor.', es: 'Crea PDF desde imágenes, convierte JPG, PNG, WEBP y HEIC, y prepara tamaños para redes sociales.', fr: 'Créez des PDF depuis des images, convertissez JPG, PNG, WEBP et HEIC, puis préparez les tailles sociales.' },
    showcaseImageAction: { en: 'Explore Image tools', ko: '이미지 도구 보기', de: 'Bildtools ansehen', es: 'Ver herramientas de imagen', fr: 'Voir les outils image' },
    showcaseVideoKicker: { en: 'Video Convert', ko: '비디오 변환', de: 'Videokonvertierung', es: 'Convertir video', fr: 'Conversion vidéo' },
    showcaseVideoTitle: { en: 'Move video files into practical web-friendly formats.', ko: '비디오 파일을 웹에서 쓰기 좋은 형식으로 바꾸세요.', de: 'Bringe Videodateien in praktische webfreundliche Formate.', es: 'Convierte videos a formatos prácticos para la web.', fr: 'Convertissez vos vidéos en formats pratiques pour le web.' },
    showcaseVideoText: { en: 'Use video converter, MOV to MP4, video to GIF, and quick audio extraction tools directly in your browser.', ko: '비디오 변환, MOV to MP4, Video to GIF, 빠른 오디오 추출을 브라우저에서 바로 사용할 수 있습니다.', de: 'Nutze Videokonverter, MOV zu MP4, Video zu GIF und schnelle Audioextraktion direkt im Browser.', es: 'Usa convertidor de video, MOV a MP4, video a GIF y extracción rápida de audio en el navegador.', fr: 'Utilisez le convertisseur vidéo, MOV vers MP4, vidéo vers GIF et l’extraction audio rapide dans le navigateur.' },
    showcaseVideoAction: { en: 'Explore Video tools', ko: '비디오 도구 보기', de: 'Videotools ansehen', es: 'Ver herramientas de video', fr: 'Voir les outils vidéo' },
    showcaseAudioKicker: { en: 'Audio Convert', ko: '오디오 변환', de: 'Audiokonvertierung', es: 'Convertir audio', fr: 'Conversion audio' },
    showcaseAudioTitle: { en: 'Extract, convert, and prepare audio with fewer steps.', ko: '오디오 추출과 변환을 더 적은 단계로 처리하세요.', de: 'Extrahiere, konvertiere und bereite Audio mit weniger Schritten vor.', es: 'Extrae, convierte y prepara audio con menos pasos.', fr: 'Extrayez, convertissez et préparez l’audio en moins d’étapes.' },
    showcaseAudioText: { en: 'Convert audio formats, extract MP3 from video, and move from media files to usable text with AI transcription.', ko: '오디오 형식 변환, 비디오에서 MP3 추출, AI 전사로 미디어를 텍스트로 바꾸는 작업까지 이어갈 수 있습니다.', de: 'Konvertiere Audioformate, extrahiere MP3 aus Videos und erstelle mit KI-Transkription nutzbaren Text.', es: 'Convierte audio, extrae MP3 de video y pasa de medios a texto con transcripción AI.', fr: 'Convertissez l’audio, extrayez du MP3 depuis une vidéo et transformez les médias en texte avec l’IA.' },
    showcaseAudioAction: { en: 'Explore Audio tools', ko: '오디오 도구 보기', de: 'Audiotools ansehen', es: 'Ver herramientas de audio', fr: 'Voir les outils audio' },
    showcaseAiKicker: { en: 'AI Tools', ko: 'AI 도구', de: 'KI-Tools', es: 'Herramientas AI', fr: 'Outils IA' },
    showcaseAiTitle: { en: 'Summarize, transcribe, OCR, and clean images faster.', ko: '요약, 전사, OCR, 이미지 정리를 더 빠르게 처리하세요.', de: 'Fasse zusammen, transkribiere, nutze OCR und bereinige Bilder schneller.', es: 'Resume, transcribe, usa OCR y limpia imágenes más rápido.', fr: 'Résumez, transcrivez, utilisez l’OCR et nettoyez les images plus vite.' },
    showcaseAiText: { en: 'Use Audio to Text, PDF Summary, Smart OCR, and Background Remover when ordinary converters are not enough.', ko: '일반 변환만으로 부족할 때 Audio to Text, PDF Summary, Smart OCR, Background Remover를 사용할 수 있습니다.', de: 'Nutze Audio to Text, PDF Summary, Smart OCR und Background Remover, wenn normale Konverter nicht reichen.', es: 'Usa Audio to Text, PDF Summary, Smart OCR y Background Remover cuando los convertidores comunes no bastan.', fr: 'Utilisez Audio to Text, PDF Summary, Smart OCR et Background Remover quand les convertisseurs classiques ne suffisent pas.' },
    showcaseAiAction: { en: 'Explore AI tools', ko: 'AI 도구 보기', de: 'KI-Tools ansehen', es: 'Ver herramientas AI', fr: 'Voir les outils IA' },
    dragDrop: {
      en: 'Drag & drop your file here',
      ko: '파일을 여기에 끌어다 놓으세요',
      de: 'Datei hierher ziehen',
      es: 'Arrastra tu archivo aquí',
      fr: 'Déposez votre fichier ici',
    },
    chooseFile: { en: 'Choose File', ko: '파일 선택', de: 'Datei wählen', es: 'Elegir archivo', fr: 'Choisir un fichier' },
    noFile: { en: 'No file selected', ko: '선택된 파일 없음', de: 'Keine Datei ausgewählt', es: 'No hay archivo seleccionado', fr: 'Aucun fichier sélectionné' },
    routeNoteDefault: {
      en: 'Choose a file and a converter. We will open the right tool page for you.',
      ko: '파일과 변환기를 선택하세요. 맞는 도구 페이지를 열어드립니다.',
      de: 'Wählen Sie eine Datei und einen Konverter. Wir öffnen die richtige Seite.',
      es: 'Elige un archivo y un convertidor. Abriremos la página correcta por ti.',
      fr: 'Choisissez un fichier et un convertisseur. Nous ouvrirons la bonne page.',
    },
    routeNoteReady: {
      en: 'is ready. Continue to',
      ko: '준비됨. 계속하여',
      de: 'ist bereit. Weiter zu',
      es: 'está listo. Continúa a',
      fr: 'est prêt. Continuez vers',
    },
    routeNoteReadySuffix: {
      en: 'and select the file there to convert.',
      ko: '에서 파일을 선택해 변환하세요.',
      de: 'und dort die Datei zur Konvertierung auswählen.',
      es: 'y selecciona el archivo allí para convertir.',
      fr: 'et sélectionnez le fichier pour convertir.',
    },
    routeNoteNoFile: {
      en: 'Please choose or drop a file first, then continue to the selected converter.',
      ko: '먼저 파일을 선택하거나 드롭한 후 계속하세요.',
      de: 'Bitte zuerst eine Datei wählen oder ablegen, dann fortfahren.',
      es: 'Por favor elige o suelta un archivo primero, luego continúa.',
      fr: 'Veuillez d\'abord choisir ou déposer un fichier, puis continuer.',
    },
    convertFrom: { en: 'Convert from:', ko: '변환 전:', de: 'Konvertieren von:', es: 'Convertir desde:', fr: 'Convertir depuis :' },
    convertTo: { en: 'Convert to:', ko: '변환 후:', de: 'Konvertieren zu:', es: 'Convertir a:', fr: 'Convertir vers :' },
    openSelectedConverter: {
      en: 'Open selected converter',
      ko: '선택한 변환기 열기',
      de: 'Ausgewählten Konverter öffnen',
      es: 'Abrir convertidor seleccionado',
      fr: 'Ouvrir le convertisseur choisi',
    },
    popularTools: { en: 'Popular file tools', ko: '인기 파일 도구', de: 'Beliebte Datei-Tools', es: 'Herramientas populares', fr: 'Outils populaires' },
    popularToolsLead: {
      en: 'Start with the tools people use every day.',
      ko: '사람들이 매일 사용하는 도구부터 시작하세요.',
      de: 'Beginne mit Tools, die täglich genutzt werden.',
      es: 'Empieza con las herramientas más usadas.',
      fr: 'Commencez avec les outils les plus utilisés.',
    },
    whyTitle: { en: 'Why EverythingConvert', ko: 'EverythingConvert를 선택하는 이유', de: 'Warum EverythingConvert', es: 'Por qué EverythingConvert', fr: 'Pourquoi EverythingConvert' },
    guideSectionLead: {
      en: 'Learn before you convert.',
      ko: '변환하기 전에 쉽게 알아보세요.',
      de: 'Erst verstehen, dann konvertieren.',
      es: 'Aprende antes de convertir.',
      fr: 'Comprendre avant de convertir.',
    },
    guideSectionTitle: {
      en: 'File Conversion Guides',
      ko: '파일 변환 가이드',
      de: 'Dateikonvertierungs-Guides',
      es: 'Guías de conversión de archivos',
      fr: 'Guides de conversion de fichiers',
    },
    guideSectionText: {
      en: 'Simple tips for choosing the right converter, preparing files, fixing common problems, and protecting privacy while using online file tools.',
      ko: '어떤 변환기를 선택해야 하는지, 파일을 어떻게 준비하면 좋은지, 자주 생기는 문제를 어떻게 해결하는지, 온라인 파일 도구를 쓸 때 개인정보를 어떻게 지키는지 쉽게 정리했습니다.',
      de: 'Einfache Tipps zur Auswahl des richtigen Konverters, zur Dateivorbereitung, zur Fehlerbehebung und zum Schutz der Privatsphäre.',
      es: 'Consejos sencillos para elegir el convertidor correcto, preparar archivos, resolver problemas comunes y proteger la privacidad.',
      fr: 'Des conseils simples pour choisir le bon convertisseur, préparer les fichiers, résoudre les problèmes courants et protéger la confidentialité.',
    },
    guidePdfTitle: { en: 'PDF conversion guide', ko: 'PDF 변환 가이드', de: 'PDF-Konvertierungs-Guide', es: 'Guía de conversión PDF', fr: 'Guide de conversion PDF' },
    guidePdfText: {
      en: 'Learn when to use PDF to Word, PDF to Excel, PDF to JPG, merge, split, rotate, and compress tools.',
      ko: 'PDF to Word, PDF to Excel, PDF to JPG, 병합, 분할, 회전, 압축 도구를 언제 사용하면 좋은지 알아보세요.',
      de: 'Erfahren Sie, wann PDF zu Word, PDF zu Excel, PDF zu JPG, Zusammenführen, Teilen, Drehen und Komprimieren sinnvoll sind.',
      es: 'Aprende cuándo usar PDF a Word, PDF a Excel, PDF a JPG, unir, dividir, rotar y comprimir.',
      fr: 'Découvrez quand utiliser PDF vers Word, PDF vers Excel, PDF vers JPG, fusion, division, rotation et compression.',
    },
    guideMediaTitle: { en: 'Image, video, and audio tips', ko: '이미지, 비디오, 오디오 팁', de: 'Bild-, Video- und Audiotipps', es: 'Consejos de imagen, video y audio', fr: 'Conseils image, vidéo et audio' },
    guideMediaText: {
      en: 'Understand browser-based conversion limits and how to prepare images, short videos, GIFs, and audio files.',
      ko: '브라우저 기반 변환의 한계와 이미지, 짧은 비디오, GIF, 오디오 파일을 준비하는 방법을 확인하세요.',
      de: 'Verstehen Sie Browser-Grenzen und die Vorbereitung von Bildern, kurzen Videos, GIFs und Audiodateien.',
      es: 'Comprende los límites del navegador y cómo preparar imágenes, videos cortos, GIF y audio.',
      fr: 'Comprenez les limites du navigateur et préparez images, courtes vidéos, GIF et audio.',
    },
    guidePrivacyTitle: { en: 'Privacy and file safety', ko: '개인정보와 파일 안전', de: 'Datenschutz und Dateisicherheit', es: 'Privacidad y seguridad de archivos', fr: 'Confidentialité et sécurité des fichiers' },
    guidePrivacyText: {
      en: 'See how to avoid risky uploads, protect sensitive files, and decide when a browser tool is the right choice.',
      ko: '위험한 업로드를 피하고 민감한 파일을 보호하며 브라우저 도구가 적합한 상황을 판단하는 방법을 확인하세요.',
      de: 'Erfahren Sie, wie Sie riskante Uploads vermeiden, sensible Dateien schützen und Browser-Tools richtig einsetzen.',
      es: 'Aprende a evitar subidas riesgosas, proteger archivos sensibles y elegir cuándo usar una herramienta web.',
      fr: 'Apprenez à éviter les envois risqués, protéger les fichiers sensibles et choisir un outil web adapté.',
    },
    readGuide: { en: 'Read guide', ko: '가이드 보기', de: 'Guide lesen', es: 'Leer guía', fr: 'Lire le guide' },

    footerTools: { en: 'Tools', ko: '도구', de: 'Tools', es: 'Herramientas', fr: 'Outils' },
    footerResources: { en: 'Resources', ko: '리소스', de: 'Ressourcen', es: 'Recursos', fr: 'Ressources' },
    footerCompany: { en: 'Company', ko: '회사', de: 'Unternehmen', es: 'Empresa', fr: 'Entreprise' },
    footerStay: { en: 'Stay updated', ko: '소식 받기', de: 'Auf dem Laufenden bleiben', es: 'Mantente al día', fr: 'Restez informé' },
    footerEmail: { en: 'Enter your email', ko: '이메일 입력', de: 'E-Mail eingeben', es: 'Introduce tu email', fr: 'Entrez votre e-mail' },
    copyright: {
      en: '© EverythingConvert.com All rights reserved (2026)',
      ko: '© EverythingConvert.com 모든 권리 보유 (2026)',
      de: '© EverythingConvert.com Alle Rechte vorbehalten (2026)',
      es: '© EverythingConvert.com Todos los derechos reservados (2026)',
      fr: '© EverythingConvert.com Tous droits réservés (2026)',
    },
    aboutUs: { en: 'About Us', ko: '회사 소개', de: 'Über uns', es: 'Sobre nosotros', fr: 'À propos' },
    donate: { en: 'Donate', ko: '후원', de: 'Spenden', es: 'Donar', fr: 'Faire un don' },
    privacy: { en: 'Privacy', ko: '개인정보 처리방침', de: 'Datenschutz', es: 'Privacidad', fr: 'Confidentialité' },
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
    authLoginRequired: { en: 'Login required', ko: '로그인 필요', de: 'Anmeldung erforderlich', es: 'Inicio de sesión requerido', fr: 'Connexion requise' },
    authChecking: { en: 'Checking...', ko: '확인 중...', de: 'Wird geprüft...', es: 'Comprobando...', fr: 'Vérification...' },
    authSupabaseRequired: { en: 'Supabase setup required', ko: 'Supabase 설정 필요', de: 'Supabase-Einrichtung erforderlich', es: 'Configuración de Supabase requerida', fr: 'Configuration Supabase requise' },
    authFree: { en: 'Free', ko: '무료', de: 'Kostenlos', es: 'Gratis', fr: 'Gratuit' },
    authPro: { en: 'Pro', ko: 'Pro', de: 'Pro', es: 'Pro', fr: 'Pro' },
    authAdmin: { en: 'Admin', ko: '관리자', de: 'Admin', es: 'Admin', fr: 'Admin' },

    subEmailLabel: { en: 'Email', ko: '이메일', de: 'E-Mail', es: 'Correo electrónico', fr: 'E-mail' },
    subBtn: { en: 'Subscribe', ko: '구독하기', de: 'Abonnieren', es: 'Suscribirse', fr: 'S’abonner' },
    subCancel: { en: 'Cancel', ko: '취소', de: 'Abbrechen', es: 'Cancelar', fr: 'Annuler' },
    subReturnToMain: { en: 'Return to Main Page', ko: '메인 페이지로 돌아가기', de: 'Zurück zur Hauptseite', es: 'Volver a la página principal', fr: 'Retour à la page principale' },
  };

  const phraseToKey = {};
  Object.entries(t).forEach(([key, values]) => {
    Object.values(values).forEach((value) => {
      phraseToKey[value] = key;
    });
  });

  let activeLanguage = 'en';
  let applying = false;
  const pendingApplyTimers = [];

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

  // First-visit fallback: use the browser/OS language when it matches a
  // supported language. Not persisted on purpose — the visitor keeps
  // following their device language until they pick one manually, and a
  // manual pick (saveLanguage) always wins on later visits.
  function getBrowserLanguage() {
    try {
      const candidates = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
      for (const candidate of candidates) {
        const code = String(candidate || '').slice(0, 2).toLowerCase();
        if (supported(code)) return code;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function getSavedLanguage() {
    const urlLanguage = getUrlLanguage();
    if (urlLanguage) {
      saveLanguage(urlLanguage);
      return urlLanguage;
    }
    try {
      const saved = localStorage.getItem('everything_convert_language');
      if (saved) return saved;
    } catch (error) {
      return 'en';
    }
    return getBrowserLanguage() || 'en';
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
    if (!root || typeof document.createTreeWalker !== 'function') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.ec-unified-header')) return NodeFilter.FILTER_REJECT;
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
    const showcaseSlides = Array.from(document.querySelectorAll('.home-showcase [data-showcase-slide]'));
    const showcaseCopy = [
      { icon: 'fa-regular fa-file-pdf', kicker: 'showcasePdfKicker', title: 'showcasePdfTitle', body: 'showcasePdfText', action: 'showcasePdfAction' },
      { icon: 'fa-regular fa-image', kicker: 'showcaseImageKicker', title: 'showcaseImageTitle', body: 'showcaseImageText', action: 'showcaseImageAction' },
      { icon: 'fa-regular fa-circle-play', kicker: 'showcaseVideoKicker', title: 'showcaseVideoTitle', body: 'showcaseVideoText', action: 'showcaseVideoAction' },
      { icon: 'fa-solid fa-music', kicker: 'showcaseAudioKicker', title: 'showcaseAudioTitle', body: 'showcaseAudioText', action: 'showcaseAudioAction' },
      { icon: 'fa-solid fa-wand-magic-sparkles', kicker: 'showcaseAiKicker', title: 'showcaseAiTitle', body: 'showcaseAiText', action: 'showcaseAiAction' },
    ];
    showcaseSlides.forEach((slide, index) => {
      const copy = showcaseCopy[index];
      if (!copy) return;
      const kicker = slide.querySelector('.showcase-kicker');
      const title = slide.querySelector('.showcase-copy h2');
      const body = slide.querySelector('.showcase-copy p');
      const action = slide.querySelector('.showcase-action');
      if (kicker) kicker.innerHTML = `<i class="${copy.icon}"></i> ${text(copy.kicker, language)}`;
      if (title) title.textContent = text(copy.title, language);
      if (body) body.textContent = text(copy.body, language);
      if (action) action.innerHTML = `${text(copy.action, language)} <i class="fa-solid fa-arrow-right"></i>`;
    });
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

    // AI pages: translate footer-legal-row links (About, Donate, Privacy, Terms, Security, Contact)
    const legalLinks = footer.querySelectorAll('.footer-legal-row a');
    if (legalLinks.length) {
      const legalKeys = ['aboutUs', 'donate', 'privacy', 'terms', 'security', 'contact'];
      legalLinks.forEach((link, index) => {
        const key = legalKeys[index];
        if (key && t[key]) link.textContent = text(key, language);
      });
    }
  }

  function applyAuth(language) {
    if (!document.body.classList.contains('auth-page')) return;
    setText('.hero-title', text('authTitle', language));
    setText('.hero-subtitle', text('authSubtitle', language));
  }

  function applySubscribe(language) {
    const emailInput = document.getElementById('subscribeEmail');
    if (emailInput) emailInput.placeholder = text('subEmailLabel', language);
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
    applySubscribe(selected);
    updateLanguageMenu(selected);
    updateLinks(selected);
    if (window.EverythingConvertToolLanguage) window.EverythingConvertToolLanguage.apply(selected);
    window.dispatchEvent(new CustomEvent('everything-language-change', { detail: { language: selected } }));
    applying = false;
  }

  function scheduleApply(language = activeLanguage) {
    pendingApplyTimers.forEach((id) => window.clearTimeout(id));
    pendingApplyTimers.length = 0;
    [0, 100, 500].forEach((delay) => {
      const id = window.setTimeout(() => applyLanguage(language), delay);
      pendingApplyTimers.push(id);
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
