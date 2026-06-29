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
      en: 'Private, browser-based file conversion',
      ko: '브라우저에서 처리하는 안전한 파일 변환',
      de: 'Private Dateikonvertierung im Browser',
      es: 'Conversión de archivos privada en el navegador',
      fr: 'Conversion de fichiers privée dans le navigateur',
    },
    homeHeroA: { en: 'Convert files privately.', ko: '파일을 안전하게 변환하세요.', de: 'Dateien privat konvertieren.', es: 'Convierte archivos en privado.', fr: 'Convertissez en toute confidentialité.' },
    homeHeroB: { en: 'Your files never', ko: '당신의 파일은', de: 'Ihre Dateien verlassen', es: 'Tus archivos nunca', fr: 'Vos fichiers ne quittent' },
    homeHeroAccent: {
      en: 'leave your browser.',
      ko: '브라우저를 떠나지 않습니다.',
      de: 'nie den Browser.',
      es: 'salen del navegador.',
      fr: 'jamais le navigateur.',
    },
    homeSubtitle: {
      en: 'PDF, image, video, audio, and office conversions run entirely in your browser — nothing is uploaded. Fast, free, and private by design.',
      ko: 'PDF, 이미지, 비디오, 오디오, 오피스 변환이 모두 브라우저 안에서 실행되며 아무것도 업로드되지 않습니다. 빠르고 무료이며, 처음부터 프라이버시 중심으로 설계했습니다.',
      de: 'PDF-, Bild-, Video-, Audio- und Office-Konvertierungen laufen komplett in Ihrem Browser – nichts wird hochgeladen. Schnell, kostenlos und von Grund auf privat.',
      es: 'Las conversiones de PDF, imagen, video, audio y Office se ejecutan por completo en tu navegador: no se sube nada. Rápido, gratis y privado por diseño.',
      fr: 'Les conversions PDF, image, vidéo, audio et Office se déroulent entièrement dans votre navigateur — rien n’est envoyé. Rapide, gratuit et privé par conception.',
    },
    startConverting: { en: 'Start Converting', ko: '변환 시작', de: 'Konvertieren starten', es: 'Empezar a convertir', fr: 'Commencer' },
    exploreTools: { en: 'Explore All Tools', ko: '모든 도구 보기', de: 'Alle Tools ansehen', es: 'Explorar herramientas', fr: 'Explorer les outils' },
    trustHeadline: { en: 'Your files never leave your device', ko: '파일이 기기를 떠나지 않습니다', de: 'Ihre Dateien verlassen Ihr Gerät nie', es: 'Tus archivos nunca salen de tu dispositivo', fr: 'Vos fichiers ne quittent jamais votre appareil' },
    trustSub: { en: 'Every standard conversion runs right in your browser — nothing is uploaded to a server. No account, no installation, no catch.', ko: '모든 표준 변환은 브라우저 안에서 바로 실행되며 서버로 아무것도 업로드되지 않습니다. 계정도, 설치도, 숨은 조건도 없습니다.', de: 'Jede Standardkonvertierung läuft direkt in Ihrem Browser – nichts wird auf einen Server hochgeladen. Kein Konto, keine Installation, kein Haken.', es: 'Cada conversión estándar se ejecuta en tu navegador: no se sube nada a un servidor. Sin cuenta, sin instalación, sin trucos.', fr: 'Chaque conversion standard se fait dans votre navigateur — rien n’est envoyé à un serveur. Sans compte, sans installation, sans piège.' },
    trustP1T: { en: '100% in your browser', ko: '100% 브라우저에서', de: '100% im Browser', es: '100% en tu navegador', fr: '100% dans le navigateur' },
    trustP1B: { en: 'Files are processed on your device and never uploaded.', ko: '파일은 기기에서 처리되며 업로드되지 않습니다.', de: 'Dateien werden auf Ihrem Gerät verarbeitet und nie hochgeladen.', es: 'Los archivos se procesan en tu dispositivo y nunca se suben.', fr: 'Les fichiers sont traités sur votre appareil et jamais envoyés.' },
    trustP2T: { en: 'No install, no account', ko: '설치도 계정도 없이', de: 'Keine Installation, kein Konto', es: 'Sin instalar, sin cuenta', fr: 'Sans installation, sans compte' },
    trustP2B: { en: 'Start instantly in any modern browser, free.', ko: '최신 브라우저에서 즉시, 무료로 시작하세요.', de: 'Sofort in jedem modernen Browser starten, kostenlos.', es: 'Empieza al instante en cualquier navegador moderno, gratis.', fr: 'Commencez aussitôt dans tout navigateur moderne, gratuitement.' },
    trustP3T: { en: '20+ tools, 5 languages', ko: '20개 이상 도구, 5개 언어', de: '20+ Tools, 5 Sprachen', es: 'Más de 20 herramientas, 5 idiomas', fr: 'Plus de 20 outils, 5 langues' },
    trustP3B: { en: 'PDF, image, video, QR and AI tools in one place.', ko: 'PDF·이미지·비디오·QR·AI 도구를 한곳에서.', de: 'PDF-, Bild-, Video-, QR- und KI-Tools an einem Ort.', es: 'Herramientas de PDF, imagen, vídeo, QR e IA en un solo lugar.', fr: 'Outils PDF, image, vidéo, QR et IA au même endroit.' },
    homeTrust: {
      en: 'No download · No installation · Works in your browser',
      ko: '다운로드 없음 · 설치 없음 · 브라우저에서 바로 작동',
      de: 'Kein Download · Keine Installation · Läuft im Browser',
      es: 'Sin descargas · Sin instalación · Funciona en tu navegador',
      fr: 'Sans téléchargement · Sans installation · Fonctionne dans le navigateur',
    },
    searchTools: { en: 'Search tools...', ko: '도구 검색...', de: 'Tools suchen...', es: 'Buscar herramientas...', fr: 'Rechercher des outils...' },
    extCtaKicker: { en: 'Chrome Extension', ko: '크롬 확장프로그램', de: 'Chrome-Erweiterung', es: 'Extensión de Chrome', fr: 'Extension Chrome' },
    extCtaTitle: {
      en: 'Convert files without opening a tab',
      ko: '탭을 열지 않고 바로 변환하세요',
      de: 'Dateien konvertieren, ohne einen Tab zu öffnen',
      es: 'Convierte archivos sin abrir una pestaña',
      fr: 'Convertissez vos fichiers sans ouvrir d’onglet',
    },
    extCtaText: {
      en: 'Add EverythingConvert to Chrome and reach every tool from your toolbar — the same private, browser-based conversion.',
      ko: 'EverythingConvert를 크롬에 추가하면 툴바에서 모든 도구에 바로 접근할 수 있습니다 — 똑같이 브라우저 안에서 처리하는 안전한 변환.',
      de: 'Füge EverythingConvert zu Chrome hinzu und erreiche jedes Tool aus der Symbolleiste — dieselbe private, browserbasierte Konvertierung.',
      es: 'Añade EverythingConvert a Chrome y accede a cada herramienta desde la barra — la misma conversión privada en el navegador.',
      fr: 'Ajoutez EverythingConvert à Chrome et accédez à chaque outil depuis la barre — la même conversion privée dans le navigateur.',
    },
    extCtaButton: { en: 'Add to Chrome — Free', ko: '크롬에 추가 — 무료', de: 'Zu Chrome hinzufügen — kostenlos', es: 'Añadir a Chrome — Gratis', fr: 'Ajouter à Chrome — Gratuit' },
    showcasePdfKicker: { en: 'PDF & Documents', ko: 'PDF 및 문서', de: 'PDF & Dokumente', es: 'PDF y documentos', fr: 'PDF et documents' },
    showcasePdfTitle: { en: 'Turn PDFs and office files into the format you need.', ko: 'PDF와 오피스 파일을 필요한 형식으로 바꾸세요.', de: 'Wandle PDFs und Office-Dateien in das passende Format um.', es: 'Convierte PDF y archivos Office al formato que necesitas.', fr: 'Transformez PDF et fichiers Office dans le format utile.' },
    showcasePdfText: { en: 'Convert PDF to Word, PDF to Excel, PDF Summary, Smart OCR, Word to PDF, and Excel to PDF from one focused workspace.', ko: 'PDF to Word, PDF to Excel, PDF Summary, Smart OCR, Word to PDF, Excel to PDF를 한 공간에서 빠르게 찾아보세요.', de: 'Nutze PDF zu Word, PDF zu Excel, PDF Summary, Smart OCR, Word zu PDF und Excel zu PDF an einem Ort.', es: 'Usa PDF a Word, PDF a Excel, PDF Summary, Smart OCR, Word a PDF y Excel a PDF desde un solo espacio.', fr: 'Utilisez PDF vers Word, PDF vers Excel, PDF Summary, Smart OCR, Word vers PDF et Excel vers PDF au même endroit.' },
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
    showcaseSummerKicker: { en: 'Summer Special 2026', ko: '2026 여름 특별 이벤트', de: 'Sommer-Special 2026', es: 'Especial de Verano 2026', fr: 'Spécial Été 2026' },
    showcaseSummerTitle: { en: 'Twice the fun, twice the value — summer sale is on.', ko: '기쁨도 두 배, 혜택도 두 배 — 여름 세일이 시작됐어요.', de: 'Doppelter Spaß, doppelter Wert – der Sommer-Sale läuft.', es: 'El doble de diversión, el doble de valor: la oferta de verano ya está aquí.', fr: 'Deux fois plus de plaisir et d’avantages — les soldes d’été sont là.' },
    showcaseSummerText: { en: 'For July and August only: Pro 30% off with code SUMMER, double credits on every purchase, and 20 free signup credits.', ko: '7월과 8월 단 두 달: SUMMER 코드로 Pro 30% 할인, 구매 시 크레딧 두 배, 가입하면 무료 크레딧 20개.', de: 'Nur im Juli und August: Pro 30 % günstiger mit Code SUMMER, doppelte Credits bei jedem Kauf und 20 Gratis-Credits zur Anmeldung.', es: 'Solo en julio y agosto: Pro 30 % de descuento con el código SUMMER, doble de créditos en cada compra y 20 créditos gratis al registrarte.', fr: 'En juillet et août uniquement : Pro à −30 % avec le code SUMMER, crédits doublés à chaque achat et 20 crédits offerts à l’inscription.' },
    showcaseSummerAction: { en: 'See the summer deal', ko: '여름 혜택 보기', de: 'Sommer-Deal ansehen', es: 'Ver la oferta de verano', fr: 'Voir l’offre d’été' },
    summerTab: { en: 'SUMMER SALE', ko: '여름 세일', de: 'SOMMER-SALE', es: 'OFERTA VERANO', fr: 'SOLDES ÉTÉ' },
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
    privacyChoices: { en: 'Privacy Choices', ko: '개인정보 선택', de: 'Datenschutzoptionen', es: 'Opciones de privacidad', fr: 'Choix de confidentialité' },
    terms: { en: 'Terms', ko: '이용약관', de: 'Bedingungen', es: 'Términos', fr: 'Conditions' },
    security: { en: 'Security and Compliance', ko: '보안 및 규정 준수', de: 'Sicherheit und Compliance', es: 'Seguridad y cumplimiento', fr: 'Sécurité et conformité' },
    contact: { en: 'Contact', ko: '문의', de: 'Kontakt', es: 'Contacto', fr: 'Contact' },

    authTitle: { en: 'Welcome to EverythingConvert', ko: 'EverythingConvert에 오신 것을 환영합니다', de: 'Willkommen bei EverythingConvert', es: 'Bienvenido a EverythingConvert', fr: 'Bienvenue sur EverythingConvert' },
    authSubtitle: {
      en: 'Log in or create a free account to unlock more daily conversions, free AI credits, and a saved history of everything you convert — on any device, nothing to install.',
      ko: '로그인하거나 무료 계정을 만들면 하루 변환 횟수가 늘고, 무료 AI 크레딧과 변환 기록까지 사용할 수 있어요 — 어떤 기기에서든, 설치 없이.',
      de: 'Melde dich an oder erstelle ein kostenloses Konto für mehr tägliche Konvertierungen, kostenlose KI-Credits und einen gespeicherten Verlauf all deiner Konvertierungen – auf jedem Gerät, ohne Installation.',
      es: 'Inicia sesión o crea una cuenta gratis para tener más conversiones al día, créditos de IA gratuitos y un historial de todo lo que conviertes, en cualquier dispositivo y sin instalar nada.',
      fr: 'Connectez-vous ou créez un compte gratuit pour profiter de plus de conversions par jour, de crédits IA gratuits et d’un historique de toutes vos conversions — sur tout appareil, sans rien installer.',
    },
    proMemberHint: {
      en: "You're on Pro — unlimited conversions, no ads, and 300 AI credits every month.",
      ko: 'Pro 회원입니다 — 무제한 변환, 광고 없음, 매달 300 AI 크레딧.',
      de: 'Du bist Pro – unbegrenzte Konvertierungen, keine Werbung und 300 KI-Credits pro Monat.',
      es: 'Tienes Pro: conversiones ilimitadas, sin anuncios y 300 créditos de IA al mes.',
      fr: 'Vous êtes Pro — conversions illimitées, sans publicité et 300 crédits IA par mois.',
    },
    freeMemberHint: {
      en: "You're on the Free plan — 10 conversions a day plus AI credits. Upgrade to Pro for unlimited use and 300 monthly AI credits.",
      ko: '무료 플랜입니다 — 하루 10회 변환과 AI 크레딧. Pro로 업그레이드하면 무제한 사용과 매달 300 AI 크레딧을 받습니다.',
      de: 'Du nutzt den kostenlosen Plan – 10 Konvertierungen pro Tag plus KI-Credits. Mit Pro: unbegrenzt und 300 KI-Credits monatlich.',
      es: 'Estás en el plan gratuito: 10 conversiones al día más créditos de IA. Pasa a Pro para uso ilimitado y 300 créditos de IA al mes.',
      fr: 'Vous êtes sur le plan gratuit — 10 conversions par jour et des crédits IA. Passez à Pro pour un usage illimité et 300 crédits IA par mois.',
    },
    accountLoadingHint: {
      en: 'Refreshing account status...',
      ko: '계정 상태를 새로고침하는 중...',
      de: 'Kontostatus wird aktualisiert...',
      es: 'Actualizando el estado de la cuenta...',
      fr: 'Actualisation du statut du compte...',
    },
    authGuest: { en: 'Guest', ko: '게스트', de: 'Gast', es: 'Invitado', fr: 'Invité' },
    authLoginRequired: { en: 'Login required', ko: '로그인 필요', de: 'Anmeldung erforderlich', es: 'Inicio de sesión requerido', fr: 'Connexion requise' },
    authChecking: { en: 'Checking...', ko: '확인 중...', de: 'Wird geprüft...', es: 'Comprobando...', fr: 'Vérification...' },
    authSupabaseRequired: { en: 'Supabase setup required', ko: 'Supabase 설정 필요', de: 'Supabase-Einrichtung erforderlich', es: 'Configuración de Supabase requerida', fr: 'Configuration Supabase requise' },
    authFree: { en: 'Free', ko: '무료', de: 'Kostenlos', es: 'Gratis', fr: 'Gratuit' },
    authPro: { en: 'Pro', ko: 'Pro', de: 'Pro', es: 'Pro', fr: 'Pro' },
    authAdmin: { en: 'Admin', ko: '관리자', de: 'Admin', es: 'Admin', fr: 'Admin' },

    accountKicker: { en: 'EverythingConvert Account', ko: 'EverythingConvert 계정', de: 'EverythingConvert-Konto', es: 'Cuenta de EverythingConvert', fr: 'Compte EverythingConvert' },

    featPrivateTitle: { en: 'Private by design', ko: '설계부터 프라이버시', de: 'Von Grund auf privat', es: 'Privado por diseño', fr: 'Privé par conception' },
    featPrivateBody: {
      en: 'Most tools run entirely in your browser — your files are never uploaded to a server.',
      ko: '대부분의 도구가 브라우저 안에서 실행돼요 — 파일이 서버로 업로드되지 않습니다.',
      de: 'Die meisten Tools laufen komplett in deinem Browser – deine Dateien werden nie auf einen Server hochgeladen.',
      es: 'La mayoría de las herramientas se ejecutan en tu navegador: tus archivos nunca se suben a un servidor.',
      fr: 'La plupart des outils s’exécutent entièrement dans votre navigateur — vos fichiers ne sont jamais envoyés sur un serveur.',
    },
    featLimitTitle: { en: 'More free conversions', ko: '무료 변환 횟수 증가', de: 'Mehr kostenlose Konvertierungen', es: 'Más conversiones gratis', fr: 'Plus de conversions gratuites' },
    featLimitBody: {
      en: 'Free accounts get 10 conversions a day — double the guest limit.',
      ko: '무료 계정은 하루 10회 변환 — 게스트의 두 배예요.',
      de: 'Kostenlose Konten erhalten 10 Konvertierungen pro Tag – doppelt so viele wie Gäste.',
      es: 'Las cuentas gratuitas tienen 10 conversiones al día, el doble que los invitados.',
      fr: 'Les comptes gratuits bénéficient de 10 conversions par jour — le double de la limite invité.',
    },
    featCreditsTitle: { en: 'Free AI credits', ko: '무료 AI 크레딧', de: 'Kostenlose KI-Credits', es: 'Créditos de IA gratis', fr: 'Crédits IA gratuits' },
    featCreditsBody: {
      en: 'Get monthly AI credits for our smart, AI-powered tools.',
      ko: '매달 AI 크레딧으로 스마트한 AI 도구를 사용하세요.',
      de: 'Erhalte monatliche KI-Credits für unsere smarten, KI-gestützten Tools.',
      es: 'Recibe créditos de IA cada mes para nuestras herramientas inteligentes con IA.',
      fr: 'Recevez des crédits IA chaque mois pour nos outils intelligents propulsés par l’IA.',
    },
    featHistoryTitle: { en: 'History that follows you', ko: '어디서나 따라오는 기록', de: 'Verlauf, der dir folgt', es: 'Un historial que te acompaña', fr: 'Un historique qui vous suit' },
    featHistoryBody: {
      en: 'Your conversion history syncs across every device. Nothing to install.',
      ko: '변환 기록이 모든 기기에서 동기화돼요. 설치할 필요 없이.',
      de: 'Dein Konvertierungsverlauf wird auf allen Geräten synchronisiert. Keine Installation nötig.',
      es: 'Tu historial de conversiones se sincroniza en todos los dispositivos. Sin instalar nada.',
      fr: 'Votre historique de conversions se synchronise sur tous vos appareils. Rien à installer.',
    },
    featToolsTitle: { en: '40+ tools in one place', ko: '40여 가지 도구를 한곳에', de: '40+ Tools an einem Ort', es: 'Más de 40 herramientas en un lugar', fr: 'Plus de 40 outils en un seul endroit' },
    featToolsBody: {
      en: 'PDF, image, video, audio, and document tools — all under one account.',
      ko: 'PDF, 이미지, 영상, 오디오, 문서 도구를 하나의 계정으로.',
      de: 'PDF-, Bild-, Video-, Audio- und Dokument-Tools – alles in einem Konto.',
      es: 'Herramientas de PDF, imagen, vídeo, audio y documentos, todo en una cuenta.',
      fr: 'Outils PDF, image, vidéo, audio et documents — le tout dans un seul compte.',
    },

    signedInKicker: { en: "You're signed in", ko: '로그인됨', de: 'Du bist angemeldet', es: 'Has iniciado sesión', fr: 'Vous êtes connecté' },
    welcomeBack: { en: 'Welcome back', ko: '다시 오신 것을 환영합니다', de: 'Willkommen zurück', es: 'Bienvenido de nuevo', fr: 'Bon retour' },
    memberAsideSub: {
      en: 'Manage your account, track your AI credits, and pick up right where you left off.',
      ko: '계정을 관리하고, AI 크레딧을 확인하고, 하던 작업을 이어가세요.',
      de: 'Verwalte dein Konto, behalte deine KI-Credits im Blick und mach dort weiter, wo du aufgehört hast.',
      es: 'Gestiona tu cuenta, controla tus créditos de IA y retoma justo donde lo dejaste.',
      fr: 'Gérez votre compte, suivez vos crédits IA et reprenez là où vous vous êtes arrêté.',
    },
    mFeatPrivateTitle: { en: 'Your files stay private', ko: '파일은 비공개로 유지돼요', de: 'Deine Dateien bleiben privat', es: 'Tus archivos siguen siendo privados', fr: 'Vos fichiers restent privés' },
    mFeatPrivateBody: {
      en: 'Every conversion still runs right inside your browser.',
      ko: '모든 변환은 브라우저 안에서 실행됩니다.',
      de: 'Jede Konvertierung läuft weiterhin direkt in deinem Browser.',
      es: 'Cada conversión sigue ejecutándose dentro de tu navegador.',
      fr: 'Chaque conversion s’exécute toujours directement dans votre navigateur.',
    },
    mFeatPerksTitle: { en: 'Member perks active', ko: '회원 혜택 적용 중', de: 'Mitglieder-Vorteile aktiv', es: 'Ventajas de miembro activas', fr: 'Avantages membre actifs' },
    mFeatPerksBody: {
      en: 'More daily conversions plus monthly AI credits on your account.',
      ko: '계정에 더 많은 일일 변환과 매달 AI 크레딧이 적용돼요.',
      de: 'Mehr tägliche Konvertierungen und monatliche KI-Credits für dein Konto.',
      es: 'Más conversiones diarias y créditos de IA mensuales en tu cuenta.',
      fr: 'Plus de conversions quotidiennes et des crédits IA mensuels sur votre compte.',
    },
    mFeatHistoryTitle: { en: 'Your conversion history', ko: '내 변환 기록', de: 'Dein Konvertierungsverlauf', es: 'Tu historial de conversiones', fr: 'Votre historique de conversions' },
    mFeatHistoryBody: {
      en: 'Review and re-download anything from My Conversions.',
      ko: '내 변환 기록에서 언제든 다시 확인하고 다운로드하세요.',
      de: 'In „Meine Konvertierungen“ kannst du alles ansehen und erneut herunterladen.',
      es: 'Consulta y vuelve a descargar lo que quieras desde Mis conversiones.',
      fr: 'Consultez et retéléchargez tout depuis Mes conversions.',
    },
    mFeatProTitle: { en: 'Go unlimited with Pro', ko: 'Pro로 무제한 사용', de: 'Mit Pro unbegrenzt nutzen', es: 'Hazte ilimitado con Pro', fr: 'Passez en illimité avec Pro' },
    mFeatProBody: {
      en: 'Unlimited conversions, no ads, and 300 AI credits every month.',
      ko: '무제한 변환, 광고 없음, 매달 300 AI 크레딧.',
      de: 'Unbegrenzte Konvertierungen, keine Werbung und 300 KI-Credits pro Monat.',
      es: 'Conversiones ilimitadas, sin anuncios y 300 créditos de IA al mes.',
      fr: 'Conversions illimitées, sans publicité et 300 crédits IA par mois.',
    },

    signUp: { en: 'Sign up', ko: '회원가입', de: 'Registrieren', es: 'Registrarse', fr: 'S’inscrire' },
    continueGmail: { en: 'Continue with Gmail', ko: 'Gmail로 계속하기', de: 'Mit Gmail fortfahren', es: 'Continuar con Gmail', fr: 'Continuer avec Gmail' },
    continueEmail: { en: 'Or continue with email', ko: '또는 이메일로 계속하기', de: 'Oder mit E-Mail fortfahren', es: 'O continúa con tu correo', fr: 'Ou continuez avec l’e-mail' },
    userId: { en: 'User ID', ko: '사용자 ID', de: 'Benutzer-ID', es: 'ID de usuario', fr: 'Identifiant' },
    email: { en: 'Email', ko: '이메일', de: 'E-Mail', es: 'Correo electrónico', fr: 'E-mail' },
    password: { en: 'Password', ko: '비밀번호', de: 'Passwort', es: 'Contraseña', fr: 'Mot de passe' },
    rememberEmail: { en: 'Remember my email', ko: '이메일 기억하기', de: 'E-Mail merken', es: 'Recordar mi correo', fr: 'Se souvenir de mon e-mail' },
    changeUserId: { en: 'Change User ID', ko: '사용자 ID 변경', de: 'Benutzer-ID ändern', es: 'Cambiar ID de usuario', fr: 'Modifier l’identifiant' },
    usernameRules: {
      en: 'Use 3-24 letters, numbers, or underscores. Example: hijacker05',
      ko: '3~24자의 영문, 숫자, 밑줄(_)을 사용하세요. 예: hijacker05',
      de: 'Verwende 3–24 Buchstaben, Zahlen oder Unterstriche. Beispiel: hijacker05',
      es: 'Usa de 3 a 24 letras, números o guiones bajos. Ejemplo: hijacker05',
      fr: 'Utilisez 3 à 24 lettres, chiffres ou tirets bas. Exemple : hijacker05',
    },
    userIdHint: {
      en: 'This name appears in the top account label and the admin screen.',
      ko: '이 이름은 상단 계정 라벨과 관리자 화면에 표시됩니다.',
      de: 'Dieser Name erscheint im oberen Konto-Label und im Admin-Bereich.',
      es: 'Este nombre aparece en la etiqueta de cuenta superior y en la pantalla de administración.',
      fr: 'Ce nom apparaît dans l’étiquette de compte en haut et sur l’écran d’administration.',
    },
    saveUserId: { en: 'Save User ID', ko: '사용자 ID 저장', de: 'Benutzer-ID speichern', es: 'Guardar ID de usuario', fr: 'Enregistrer l’identifiant' },
    goTools: { en: 'Go to tools', ko: '도구로 이동', de: 'Zu den Tools', es: 'Ir a las herramientas', fr: 'Aller aux outils' },
    adminPage: { en: 'Admin page', ko: '관리자 페이지', de: 'Admin-Seite', es: 'Página de administración', fr: 'Page d’administration' },
    writeBlog: { en: 'Write Blog', ko: '블로그 작성', de: 'Blog schreiben', es: 'Escribir blog', fr: 'Écrire un article' },
    currentStatus: { en: 'Current status:', ko: '현재 상태:', de: 'Aktueller Status:', es: 'Estado actual:', fr: 'Statut actuel :' },
    displayName: { en: 'Display name:', ko: '표시 이름:', de: 'Anzeigename:', es: 'Nombre visible:', fr: 'Nom affiché :' },
    membershipLevel: { en: 'Membership level:', ko: '멤버십 등급:', de: 'Mitgliedsstufe:', es: 'Nivel de membresía:', fr: 'Niveau d’abonnement :' },
    aiCreditsLabel: { en: 'AI credits:', ko: 'AI 크레딧:', de: 'KI-Credits:', es: 'Créditos de IA:', fr: 'Crédits IA :' },
    buyMore: { en: 'Buy more', ko: '더 구매', de: 'Mehr kaufen', es: 'Comprar más', fr: 'Acheter plus' },
    statPlan: { en: 'Membership', ko: '멤버십', de: 'Mitgliedschaft', es: 'Membresía', fr: 'Abonnement' },
    statCredits: { en: 'AI credits', ko: 'AI 크레딧', de: 'KI-Credits', es: 'Créditos IA', fr: 'Crédits IA' },
    statDaily: { en: 'Free downloads left today', ko: '오늘 남은 무료 다운로드', de: 'Heute verbleibende Gratis-Downloads', es: 'Descargas gratis hoy', fr: 'Téléchargements gratuits restants aujourd’hui' },
    statUnlimited: { en: 'Unlimited', ko: '무제한', de: 'Unbegrenzt', es: 'Ilimitado', fr: 'Illimité' },
    dashboardHeading: { en: 'Account overview', ko: '계정 한눈에 보기', de: 'Kontoübersicht', es: 'Resumen de la cuenta', fr: 'Aperçu du compte' },
    myConversions: { en: 'My Conversions', ko: '내 변환 기록', de: 'Meine Konvertierungen', es: 'Mis conversiones', fr: 'Mes conversions' },
    manageSubscription: { en: 'Manage subscription', ko: '구독 관리', de: 'Abo verwalten', es: 'Gestionar suscripción', fr: 'Gérer l’abonnement' },
    upgrade: { en: 'Upgrade', ko: '업그레이드', de: 'Upgrade', es: 'Mejorar', fr: 'Améliorer' },

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
    setText('.hero-trust span', text('homeTrust', language));
    const search = document.getElementById('homeToolSearch');
    if (search) search.placeholder = text('searchTools', language);
    const showcaseSlides = Array.from(document.querySelectorAll('.home-showcase [data-showcase-slide]'));
    const showcaseCopy = [
      { icon: 'fa-regular fa-file-pdf', kicker: 'showcasePdfKicker', title: 'showcasePdfTitle', body: 'showcasePdfText', action: 'showcasePdfAction' },
      { icon: 'fa-regular fa-image', kicker: 'showcaseImageKicker', title: 'showcaseImageTitle', body: 'showcaseImageText', action: 'showcaseImageAction' },
      { icon: 'fa-regular fa-circle-play', kicker: 'showcaseVideoKicker', title: 'showcaseVideoTitle', body: 'showcaseVideoText', action: 'showcaseVideoAction' },
      { icon: 'fa-solid fa-music', kicker: 'showcaseAudioKicker', title: 'showcaseAudioTitle', body: 'showcaseAudioText', action: 'showcaseAudioAction' },
      { icon: 'fa-solid fa-wand-magic-sparkles', kicker: 'showcaseAiKicker', title: 'showcaseAiTitle', body: 'showcaseAiText', action: 'showcaseAiAction' },
      { icon: 'fa-solid fa-umbrella-beach', kicker: 'showcaseSummerKicker', title: 'showcaseSummerTitle', body: 'showcaseSummerText', action: 'showcaseSummerAction' },
    ];
    showcaseSlides.forEach((slide, index) => {
      const copy = showcaseCopy[index];
      if (!copy) return;
      const kicker = slide.querySelector('.home-showcase-kicker');
      const title = slide.querySelector('.home-showcase-copy h2');
      const body = slide.querySelector('.home-showcase-copy p');
      const action = slide.querySelector('.home-showcase-action');
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

    // AI pages: translate footer-legal-row links by destination. Some pages
    // include Privacy Choices before Contact, so index-based mapping duplicates Contact.
    const legalLinks = footer.querySelectorAll('.footer-legal-row a');
    if (legalLinks.length) {
      const legalKeyForLink = (link) => {
        const href = link.getAttribute('href') || '';
        if (href === '#cookie-settings') return 'privacyChoices';
        if (href.endsWith('about.html')) return 'aboutUs';
        if (href.includes('donate.stripe.com')) return 'donate';
        if (href.endsWith('privacy.html')) return 'privacy';
        if (href.endsWith('terms.html')) return 'terms';
        if (href.endsWith('security.html')) return 'security';
        if (href.endsWith('contact.html')) return 'contact';
        return '';
      };
      legalLinks.forEach((link) => {
        const key = legalKeyForLink(link);
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
