(function () {
  const labels = {
    en: 'English',
    ko: '한국어',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
  };

  const nav = {
    home: { en: 'Home', ko: '홈', de: 'Startseite', es: 'Inicio', fr: 'Accueil' },
    tools: { en: 'Tools', ko: '도구', de: 'Tools', es: 'Herramientas', fr: 'Outils' },
    pricing: { en: 'Pricing', ko: '요금제', de: 'Preise', es: 'Precios', fr: 'Tarifs' },
    login: { en: 'Login', ko: '로그인', de: 'Anmelden', es: 'Iniciar sesión', fr: 'Connexion' },
    account: { en: 'Account', ko: '계정', de: 'Konto', es: 'Cuenta', fr: 'Compte' },
    about: { en: 'About Us', ko: '회사 소개', de: 'Über uns', es: 'Sobre nosotros', fr: 'À propos' },
    donate: { en: 'Donate', ko: '후원', de: 'Spenden', es: 'Donar', fr: 'Faire un don' },
    privacy: { en: 'Privacy', ko: '개인정보 처리방침', de: 'Datenschutz', es: 'Privacidad', fr: 'Confidentialité' },
    terms: { en: 'Terms', ko: '이용약관', de: 'Nutzungsbedingungen', es: 'Términos', fr: 'Conditions' },
    security: { en: 'Security and Compliance', ko: '보안 및 규정 준수', de: 'Sicherheit und Compliance', es: 'Seguridad y cumplimiento', fr: 'Sécurité et conformité' },
    contact: { en: 'Contact', ko: '문의', de: 'Kontakt', es: 'Contacto', fr: 'Contact' },
    copyright: {
      en: '© EverythingConvert.com All rights reserved (2026)',
      ko: '© EverythingConvert.com 모든 권리 보유 (2026)',
      de: '© EverythingConvert.com Alle Rechte vorbehalten (2026)',
      es: '© EverythingConvert.com Todos los derechos reservados (2026)',
      fr: '© EverythingConvert.com Tous droits réservés (2026)',
    },
  };

  const pages = {
    'about.html': {
      title: {
        en: 'About Us - EverythingConvert',
        ko: '회사 소개 - EverythingConvert',
        de: 'Über uns - EverythingConvert',
        es: 'Sobre nosotros - EverythingConvert',
        fr: 'À propos - EverythingConvert',
      },
      content: {
        en: `
          <section class="hero about-hero"><p class="hero-kicker"><i class="fa-solid fa-sparkles"></i> About EverythingConvert</p><h1 class="hero-title">Simple file tools for everyday work.</h1><p class="hero-subtitle">EverythingConvert brings PDF, image, office, audio, video, QR, AI, and developer utilities into one clean browser-based workspace.</p></section>
          <section class="about-section">
            <article class="about-panel"><i class="fa-solid fa-layer-group" aria-hidden="true"></i><h2>One place for tools</h2><p>People should not need to jump between many websites for simple conversion work. Our goal is to keep useful file tools close together, easy to find, and quick to use.</p></article>
            <article class="about-panel"><i class="fa-solid fa-shield-heart" aria-hidden="true"></i><h2>Privacy first</h2><p>Many tools run directly in your browser, which means your device does the work. For account, payment, and AI-assisted tools, we keep data collection limited to what the feature needs.</p></article>
            <article class="about-panel"><i class="fa-solid fa-bolt" aria-hidden="true"></i><h2>Built to grow</h2><p>EverythingConvert is built step by step: free everyday tools first, then paid workflows for AI tasks, larger files, batch work, and features that cost money to operate.</p></article>
          </section>
          <section class="pricing-note"><h2>Who runs this</h2><p>EverythingConvert is an independent web project built and maintained by a small team. We are not trying to make file tools complicated. We want a clear, useful, ad-light, privacy-respecting workspace that people can understand quickly.</p><p>Questions, feedback, and bug reports can be sent through the <a href="contact.html">contact page</a>.</p></section>`,
        ko: `
          <section class="hero about-hero"><p class="hero-kicker"><i class="fa-solid fa-sparkles"></i> EverythingConvert 소개</p><h1 class="hero-title">매일 쓰기 쉬운 파일 도구를 만듭니다.</h1><p class="hero-subtitle">EverythingConvert는 PDF, 이미지, 오피스 문서, 오디오, 비디오, QR, AI, 개발자 도구를 하나의 깔끔한 브라우저 작업 공간에 모아 둔 서비스입니다.</p></section>
          <section class="about-section">
            <article class="about-panel"><i class="fa-solid fa-layer-group" aria-hidden="true"></i><h2>도구를 한곳에</h2><p>간단한 파일 변환을 하려고 여러 웹사이트를 돌아다닐 필요는 없어야 합니다. EverythingConvert의 목표는 자주 쓰는 파일 도구를 찾기 쉽고 빠르게 사용할 수 있게 모아 두는 것입니다.</p></article>
            <article class="about-panel"><i class="fa-solid fa-shield-heart" aria-hidden="true"></i><h2>개인정보 우선</h2><p>많은 도구는 브라우저 안에서 바로 실행되어 사용자의 기기가 직접 처리합니다. 계정, 결제, AI 보조 도구처럼 서버가 필요한 기능도 목적에 필요한 정보만 최소한으로 사용하려고 합니다.</p></article>
            <article class="about-panel"><i class="fa-solid fa-bolt" aria-hidden="true"></i><h2>천천히, 제대로 성장</h2><p>EverythingConvert는 무료 일상 도구를 먼저 안정적으로 제공하고, 이후 AI 작업, 큰 파일, 일괄 처리처럼 실제 운영 비용이 드는 기능을 유료 기능으로 확장하는 방향으로 성장하고 있습니다.</p></article>
          </section>
          <section class="pricing-note"><h2>누가 운영하나요?</h2><p>EverythingConvert는 작은 팀이 만들고 관리하는 독립 웹 프로젝트입니다. 파일 도구를 어렵게 만들기보다, 누구나 빠르게 이해하고 쓸 수 있는 깔끔하고 개인정보를 존중하는 작업 공간을 만드는 것이 목표입니다.</p><p>질문, 의견, 오류 제보는 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p></section>`,
        de: `
          <section class="hero about-hero"><p class="hero-kicker"><i class="fa-solid fa-sparkles"></i> Über EverythingConvert</p><h1 class="hero-title">Einfache Datei-Tools für den Alltag.</h1><p class="hero-subtitle">EverythingConvert bündelt PDF-, Bild-, Office-, Audio-, Video-, QR-, KI- und Entwickler-Tools in einem klaren Browser-Arbeitsbereich.</p></section>
          <section class="about-section"><article class="about-panel"><i class="fa-solid fa-layer-group"></i><h2>Alles an einem Ort</h2><p>Nützliche Konverter sollen leicht zu finden sein, ohne zwischen vielen Websites zu wechseln.</p></article><article class="about-panel"><i class="fa-solid fa-shield-heart"></i><h2>Datenschutz zuerst</h2><p>Viele Tools laufen direkt im Browser. Für Konten, Zahlungen und KI-Funktionen erfassen wir nur notwendige Daten.</p></article><article class="about-panel"><i class="fa-solid fa-bolt"></i><h2>Schrittweise ausgebaut</h2><p>Wir starten mit kostenlosen Alltagstools und erweitern um bezahlte Funktionen, wenn echte Betriebskosten entstehen.</p></article></section>
          <section class="pricing-note"><h2>Wer betreibt die Seite?</h2><p>EverythingConvert ist ein unabhängiges Webprojekt mit dem Ziel, klare, nützliche und datenschutzfreundliche Datei-Tools anzubieten.</p><p>Fragen und Feedback können über die <a href="contact.html">Kontaktseite</a> gesendet werden.</p></section>`,
        es: `
          <section class="hero about-hero"><p class="hero-kicker"><i class="fa-solid fa-sparkles"></i> Sobre EverythingConvert</p><h1 class="hero-title">Herramientas sencillas para el trabajo diario.</h1><p class="hero-subtitle">EverythingConvert reúne herramientas de PDF, imagen, oficina, audio, video, QR, IA y desarrollo en un espacio limpio basado en navegador.</p></section>
          <section class="about-section"><article class="about-panel"><i class="fa-solid fa-layer-group"></i><h2>Todo en un lugar</h2><p>No deberías saltar entre muchos sitios para convertir archivos simples. Queremos que las herramientas útiles estén cerca y sean fáciles de usar.</p></article><article class="about-panel"><i class="fa-solid fa-shield-heart"></i><h2>Privacidad primero</h2><p>Muchas herramientas se ejecutan en tu navegador. Para cuentas, pagos e IA, recopilamos solo lo necesario.</p></article><article class="about-panel"><i class="fa-solid fa-bolt"></i><h2>Construido para crecer</h2><p>Primero ofrecemos herramientas gratuitas; después añadimos funciones de pago cuando requieren coste real de operación.</p></article></section>
          <section class="pricing-note"><h2>Quién está detrás</h2><p>EverythingConvert es un proyecto web independiente que busca ofrecer herramientas claras, útiles y respetuosas con la privacidad.</p><p>Preguntas y comentarios pueden enviarse desde la <a href="contact.html">página de contacto</a>.</p></section>`,
        fr: `
          <section class="hero about-hero"><p class="hero-kicker"><i class="fa-solid fa-sparkles"></i> À propos d'EverythingConvert</p><h1 class="hero-title">Des outils simples pour le travail quotidien.</h1><p class="hero-subtitle">EverythingConvert rassemble PDF, image, bureautique, audio, vidéo, QR, IA et outils développeur dans un espace clair basé sur le navigateur.</p></section>
          <section class="about-section"><article class="about-panel"><i class="fa-solid fa-layer-group"></i><h2>Tout au même endroit</h2><p>Vous ne devriez pas devoir passer d'un site à l'autre pour de simples conversions. Nous regroupons les outils utiles et faciles à utiliser.</p></article><article class="about-panel"><i class="fa-solid fa-shield-heart"></i><h2>Confidentialité d'abord</h2><p>De nombreux outils fonctionnent dans votre navigateur. Pour les comptes, paiements et fonctions IA, nous limitons les données au nécessaire.</p></article><article class="about-panel"><i class="fa-solid fa-bolt"></i><h2>Conçu pour évoluer</h2><p>Nous commençons par des outils gratuits, puis ajoutons des fonctions payantes lorsqu'elles ont un coût réel d'exploitation.</p></article></section>
          <section class="pricing-note"><h2>Qui gère le site ?</h2><p>EverythingConvert est un projet web indépendant qui vise des outils clairs, utiles et respectueux de la confidentialité.</p><p>Les questions et commentaires peuvent être envoyés via la <a href="contact.html">page de contact</a>.</p></section>`,
      },
    },
    'privacy.html': {
      title: { en: 'Privacy Policy - EverythingConvert', ko: '개인정보 처리방침 - EverythingConvert', de: 'Datenschutzerklärung - EverythingConvert', es: 'Política de privacidad - EverythingConvert', fr: 'Politique de confidentialité - EverythingConvert' },
      content: {
        en: legal('Privacy', 'Privacy Policy', 'EverythingConvert is designed to help people convert files while collecting only the information needed to operate accounts, usage limits, payments, security, and support.', 'Last updated: June 8, 2026', [
          ['1. Who we are', 'EverythingConvert provides browser-based and web-assisted file tools for PDFs, documents, images, audio, video, QR codes, AI tasks, and developer utilities. This policy explains what information we collect, how we use it, and what choices you have.'],
          ['2. Information we collect', 'We may collect account information such as email address, user ID, display name, login provider, role, plan level, timestamps, and subscription status. We may also collect limited usage and technical data such as tool used, conversion count, browser session, error state, IP-derived usage identity, and security logs.'],
          ['3. Files you process', 'Many tools run directly in your browser and do not upload files to our servers. AI tools and advanced server-side tools may require file upload; when this happens, the page should clearly indicate it before processing. We do not sell file contents or use them for advertising.'],
          ['4. Payments and providers', 'Stripe processes payments and subscriptions. Supabase may process authentication and profile data. Google may process optional sign-in. Hosting, CDN, analytics, and advertising providers may process technical information under their own policies.'],
          ['5. Cookies and storage', 'We use cookies, local storage, and similar technologies for login state, language preferences, usage limits, security, and navigation. Disabling them may prevent some features from working.'],
          ['6. Advertising and analytics', 'We may use Google AdSense, Google Analytics, and similar services. These providers may use cookies or device information to measure traffic, serve ads, and prevent abuse. You can manage ad personalization through Google settings.'],
          ['7. Retention and deletion', 'Browser-only conversions are not stored by EverythingConvert. Server-processed files, if used, are kept only as long as reasonably necessary for the requested task, troubleshooting, abuse prevention, or legal compliance.'],
          ['8. Your rights', 'Depending on your location, you may request access, correction, deletion, or export of personal information associated with your account. Contact us through the contact page for privacy requests.'],
        ]),
        ko: legal('개인정보', '개인정보 처리방침', 'EverythingConvert는 파일 변환 서비스를 제공하면서 계정 운영, 사용량 제한, 결제, 보안, 고객 지원에 필요한 정보만 최소한으로 수집하려고 합니다.', '최종 업데이트: 2026년 6월 8일', [
          ['1. 우리는 누구인가요?', 'EverythingConvert는 PDF, 문서, 이미지, 오디오, 비디오, QR 코드, AI 작업, 개발자 도구를 제공하는 브라우저 기반 파일 도구 서비스입니다. 이 문서는 어떤 정보를 수집하고 어떻게 사용하는지, 사용자가 어떤 선택권을 가지는지 설명합니다.'],
          ['2. 수집하는 정보', '계정을 만들거나 로그인하면 이메일 주소, 사용자 ID, 표시 이름, 로그인 제공자, 권한, 요금제, 로그인 시간, 구독 상태 등을 수집할 수 있습니다. 또한 사용한 도구, 변환 횟수, 브라우저 세션, 오류 상태, IP 기반 사용량 식별 정보, 보안 로그 같은 제한적인 기술 정보도 처리할 수 있습니다.'],
          ['3. 처리하는 파일', '많은 도구는 브라우저 안에서 직접 실행되며 파일을 서버에 업로드하지 않습니다. AI 도구나 고급 서버 처리 도구는 파일 업로드가 필요할 수 있으며, 이런 경우 해당 페이지에서 업로드 전 명확히 안내합니다. 파일 내용은 판매하지 않으며 광고 목적으로 사용하지 않습니다.'],
          ['4. 결제 및 외부 제공자', '결제와 구독은 Stripe가 처리합니다. 로그인과 사용자 프로필은 Supabase가 처리할 수 있고, Google 로그인 선택 시 Google이 인증 정보를 처리합니다. 호스팅, CDN, 분석, 광고 제공자는 각자의 정책에 따라 기술 정보를 처리할 수 있습니다.'],
          ['5. 쿠키와 브라우저 저장소', '로그인 상태, 언어 설정, 사용량 제한, 보안, 페이지 이동을 위해 쿠키와 로컬 저장소를 사용할 수 있습니다. 이를 차단하면 일부 기능이 정상 작동하지 않을 수 있습니다.'],
          ['6. 광고와 분석', 'Google AdSense, Google Analytics 등 광고 및 분석 서비스를 사용할 수 있습니다. 이러한 서비스는 트래픽 측정, 광고 제공, 부정 사용 방지를 위해 쿠키나 기기 정보를 사용할 수 있습니다. 광고 개인화는 Google 설정에서 조정할 수 있습니다.'],
          ['7. 보관 및 삭제', '브라우저에서만 처리되는 변환 파일은 EverythingConvert 서버에 저장되지 않습니다. 서버 처리가 필요한 파일은 요청한 작업, 오류 해결, 남용 방지, 법적 의무에 필요한 기간 동안만 보관합니다.'],
          ['8. 사용자의 권리', '거주 지역에 따라 계정과 연결된 개인정보의 열람, 수정, 삭제, 내보내기를 요청할 수 있습니다. 개인정보 관련 요청은 문의 페이지를 이용해 주세요.'],
        ]),
        de: legal('Datenschutz', 'Datenschutzerklärung', 'EverythingConvert sammelt nur Daten, die für Konten, Nutzungslimits, Zahlungen, Sicherheit und Support erforderlich sind.', 'Zuletzt aktualisiert: 8. Juni 2026', [
          ['1. Wer wir sind', 'EverythingConvert bietet Datei-Tools für PDF, Dokumente, Bilder, Audio, Video, QR, KI und Entwickleraufgaben.'],
          ['2. Erfasste Daten', 'Wir können E-Mail, Benutzer-ID, Anzeigename, Login-Anbieter, Rolle, Tarif, Zeitstempel, Nutzungsdaten, Fehlerstatus und technische Sicherheitsprotokolle verarbeiten.'],
          ['3. Dateien', 'Viele Tools laufen im Browser und laden Dateien nicht auf unsere Server hoch. KI- oder Server-Tools können Uploads erfordern; dies wird vorher angezeigt.'],
          ['4. Anbieter', 'Stripe verarbeitet Zahlungen, Supabase Konten, Google optionale Anmeldung. Hosting-, Analyse- und Werbeanbieter können technische Daten verarbeiten.'],
          ['5. Cookies', 'Cookies und lokaler Speicher dienen Login, Sprache, Limits, Sicherheit und Navigation.'],
          ['6. Werbung und Analyse', 'Wir können Google AdSense und Analytics nutzen. Einstellungen zur personalisierten Werbung können bei Google geändert werden.'],
          ['7. Speicherung', 'Browser-Konvertierungen werden nicht auf unseren Servern gespeichert. Serverdateien werden nur so lange aufbewahrt, wie es für die Aufgabe nötig ist.'],
          ['8. Rechte', 'Sie können je nach Standort Zugriff, Korrektur, Löschung oder Export Ihrer personenbezogenen Daten anfordern.'],
        ]),
        es: legal('Privacidad', 'Política de privacidad', 'EverythingConvert recopila solo la información necesaria para cuentas, límites de uso, pagos, seguridad y soporte.', 'Última actualización: 8 de junio de 2026', [
          ['1. Quiénes somos', 'EverythingConvert ofrece herramientas para PDF, documentos, imágenes, audio, video, QR, IA y utilidades para desarrolladores.'],
          ['2. Información que recopilamos', 'Podemos procesar correo electrónico, ID de usuario, nombre visible, proveedor de acceso, rol, plan, marcas de tiempo, uso, errores y registros técnicos.'],
          ['3. Archivos', 'Muchas herramientas se ejecutan en el navegador y no suben archivos a nuestros servidores. Las herramientas de IA o servidor pueden requerir carga previa notificación.'],
          ['4. Proveedores', 'Stripe procesa pagos, Supabase cuentas, Google inicio de sesión opcional. Hosting, análisis y publicidad pueden procesar datos técnicos.'],
          ['5. Cookies', 'Usamos cookies y almacenamiento local para sesión, idioma, límites, seguridad y navegación.'],
          ['6. Publicidad y análisis', 'Podemos usar Google AdSense y Analytics. Puedes gestionar la personalización de anuncios desde Google.'],
          ['7. Retención', 'Las conversiones del navegador no se almacenan en nuestros servidores. Los archivos de servidor se conservan solo el tiempo necesario.'],
          ['8. Tus derechos', 'Según tu ubicación, puedes solicitar acceso, corrección, eliminación o exportación de tus datos personales.'],
        ]),
        fr: legal('Confidentialité', 'Politique de confidentialité', 'EverythingConvert collecte uniquement les informations nécessaires aux comptes, limites d’utilisation, paiements, sécurité et assistance.', 'Dernière mise à jour : 8 juin 2026', [
          ['1. Qui sommes-nous ?', 'EverythingConvert propose des outils pour PDF, documents, images, audio, vidéo, QR, IA et développeurs.'],
          ['2. Données collectées', 'Nous pouvons traiter e-mail, identifiant utilisateur, nom affiché, fournisseur de connexion, rôle, formule, horodatage, usage, erreurs et journaux techniques.'],
          ['3. Fichiers', 'De nombreux outils fonctionnent dans le navigateur sans envoyer les fichiers à nos serveurs. Les outils IA ou serveur peuvent nécessiter un envoi clairement indiqué.'],
          ['4. Prestataires', 'Stripe traite les paiements, Supabase les comptes, Google la connexion optionnelle. Hébergement, analyse et publicité peuvent traiter des données techniques.'],
          ['5. Cookies', 'Nous utilisons cookies et stockage local pour session, langue, limites, sécurité et navigation.'],
          ['6. Publicité et analyse', 'Nous pouvons utiliser Google AdSense et Analytics. La personnalisation publicitaire se gère via Google.'],
          ['7. Conservation', 'Les conversions navigateur ne sont pas stockées sur nos serveurs. Les fichiers serveur sont conservés uniquement le temps nécessaire.'],
          ['8. Vos droits', 'Selon votre pays, vous pouvez demander accès, correction, suppression ou export de vos données personnelles.'],
        ]),
      },
    },
    'terms.html': {
      title: { en: 'Terms of Service - EverythingConvert', ko: '이용약관 - EverythingConvert', de: 'Nutzungsbedingungen - EverythingConvert', es: 'Términos de servicio - EverythingConvert', fr: 'Conditions d’utilisation - EverythingConvert' },
      content: {
        en: legal('Terms', 'Terms of Use', 'These Terms explain the rules for using EverythingConvert and the responsibilities that apply when you convert, upload, download, or process files.', 'Last updated: May 18, 2026', [
          ['1. Acceptance', 'By using EverythingConvert, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the service.'],
          ['2. What we provide', 'We provide file conversion and utility tools. Results may vary depending on browser, file structure, fonts, encryption, scanned pages, metadata, and third-party libraries.'],
          ['3. Your files and rights', 'You are responsible for the files you process and must have the legal right to convert, upload, download, and use them.'],
          ['4. Accounts and paid features', 'Some features require an account, payment, or subscription. Usage limits, pricing, and feature availability may change as the service develops.'],
          ['5. Acceptable use', 'Do not use the service for malware, phishing, stolen data, illegal content, harassment, copyright abuse, automated attacks, or attempts to bypass limits.'],
          ['6. Payments', 'Payments and subscriptions may be handled by Stripe. Payment provider terms also apply. Donations may not create paid access unless clearly stated.'],
          ['7. Disclaimers', 'The service is provided as is. Review converted files before relying on them, especially for legal, financial, medical, academic, or business use.'],
          ['8. Contact', 'Questions about these Terms can be sent through the contact page.'],
        ]),
        ko: legal('이용약관', '이용약관', '이 약관은 EverythingConvert를 사용할 때 적용되는 규칙과 파일을 변환, 업로드, 다운로드, 처리할 때의 책임을 설명합니다.', '최종 업데이트: 2026년 5월 18일', [
          ['1. 약관 동의', 'EverythingConvert를 사용하면 본 이용약관과 개인정보 처리방침에 동의한 것으로 간주됩니다. 동의하지 않는 경우 서비스를 사용하지 마세요.'],
          ['2. 제공하는 서비스', 'EverythingConvert는 파일 변환 및 유틸리티 도구를 제공합니다. 변환 결과는 브라우저, 파일 구조, 글꼴, 암호화, 스캔 문서, 메타데이터, 외부 라이브러리의 한계에 따라 달라질 수 있습니다.'],
          ['3. 파일과 권리', '사용자는 자신이 처리하는 파일에 대한 책임이 있으며, 해당 파일을 변환, 업로드, 다운로드, 사용할 법적 권리를 가지고 있어야 합니다.'],
          ['4. 계정과 유료 기능', '일부 기능은 계정, 결제, 구독이 필요할 수 있습니다. 사용량 제한, 가격, 기능 제공 여부는 서비스 발전에 따라 변경될 수 있습니다.'],
          ['5. 허용되지 않는 사용', '악성코드, 피싱, 도난 데이터, 불법 콘텐츠, 괴롭힘, 저작권 침해, 자동화 공격, 사용량 제한 우회 목적으로 서비스를 사용해서는 안 됩니다.'],
          ['6. 결제', '결제와 구독은 Stripe가 처리할 수 있으며, 결제 제공자의 약관도 함께 적용됩니다. 후원은 별도로 명시되지 않는 한 유료 이용 권한을 의미하지 않습니다.'],
          ['7. 면책', '서비스는 있는 그대로 제공됩니다. 법률, 금융, 의료, 학업, 업무상 중요한 파일은 사용 전 변환 결과를 반드시 확인해야 합니다.'],
          ['8. 문의', '약관 관련 질문은 문의 페이지를 통해 보내 주세요.'],
        ]),
        de: legal('Bedingungen', 'Nutzungsbedingungen', 'Diese Bedingungen erklären Regeln und Verantwortlichkeiten bei der Nutzung von EverythingConvert.', 'Zuletzt aktualisiert: 18. Mai 2026', [
          ['1. Zustimmung', 'Durch die Nutzung stimmen Sie diesen Bedingungen und der Datenschutzerklärung zu.'],
          ['2. Leistung', 'Wir bieten Datei-Konvertierungs- und Utility-Tools. Ergebnisse können je nach Datei, Browser und Bibliotheken variieren.'],
          ['3. Ihre Dateien', 'Sie sind für Ihre Dateien verantwortlich und müssen die Rechte zur Verarbeitung besitzen.'],
          ['4. Konten und Zahlung', 'Einige Funktionen benötigen Konto, Zahlung oder Abonnement. Preise und Limits können sich ändern.'],
          ['5. Zulässige Nutzung', 'Missbrauch, Malware, Phishing, rechtswidrige Inhalte, Angriffe und Umgehung von Limits sind verboten.'],
          ['6. Zahlungen', 'Zahlungen können über Stripe erfolgen; dessen Bedingungen gelten zusätzlich.'],
          ['7. Haftungsausschluss', 'Der Dienst wird wie verfügbar bereitgestellt. Prüfen Sie Ergebnisse vor wichtiger Nutzung.'],
          ['8. Kontakt', 'Fragen können über die Kontaktseite gesendet werden.'],
        ]),
        es: legal('Términos', 'Términos de uso', 'Estos términos explican las reglas y responsabilidades al usar EverythingConvert.', 'Última actualización: 18 de mayo de 2026', [
          ['1. Aceptación', 'Al usar el servicio aceptas estos términos y la política de privacidad.'],
          ['2. Servicio', 'Ofrecemos herramientas de conversión y utilidad. Los resultados pueden variar según archivo, navegador y bibliotecas.'],
          ['3. Tus archivos', 'Eres responsable de tus archivos y debes tener derecho legal para procesarlos.'],
          ['4. Cuentas y pago', 'Algunas funciones requieren cuenta, pago o suscripción. Precios y límites pueden cambiar.'],
          ['5. Uso aceptable', 'Se prohíbe malware, phishing, contenido ilegal, ataques, abuso y evasión de límites.'],
          ['6. Pagos', 'Stripe puede procesar pagos; también aplican sus términos.'],
          ['7. Descargo', 'El servicio se ofrece tal cual. Revisa los archivos convertidos antes de usarlos.'],
          ['8. Contacto', 'Las preguntas pueden enviarse desde la página de contacto.'],
        ]),
        fr: legal('Conditions', 'Conditions d’utilisation', 'Ces conditions expliquent les règles et responsabilités lors de l’utilisation d’EverythingConvert.', 'Dernière mise à jour : 18 mai 2026', [
          ['1. Acceptation', 'En utilisant le service, vous acceptez ces conditions et la politique de confidentialité.'],
          ['2. Service', 'Nous fournissons des outils de conversion et utilitaires. Les résultats peuvent varier selon le fichier, le navigateur et les bibliothèques.'],
          ['3. Vos fichiers', 'Vous êtes responsable de vos fichiers et devez avoir le droit légal de les traiter.'],
          ['4. Comptes et paiement', 'Certaines fonctions nécessitent compte, paiement ou abonnement. Prix et limites peuvent changer.'],
          ['5. Usage acceptable', 'Malware, phishing, contenu illégal, attaques, abus et contournement de limites sont interdits.'],
          ['6. Paiements', 'Stripe peut traiter les paiements; ses conditions s’appliquent aussi.'],
          ['7. Avertissement', 'Le service est fourni tel quel. Vérifiez les fichiers convertis avant usage important.'],
          ['8. Contact', 'Les questions peuvent être envoyées via la page de contact.'],
        ]),
      },
    },
    'security.html': {
      title: { en: 'Security and Compliance - EverythingConvert', ko: '보안 및 규정 준수 - EverythingConvert', de: 'Sicherheit und Compliance - EverythingConvert', es: 'Seguridad y cumplimiento - EverythingConvert', fr: 'Sécurité et conformité - EverythingConvert' },
      content: {
        en: legal('Security', 'Security and Compliance', 'This page explains our security model, third-party platforms, and the controls we plan to strengthen as EverythingConvert grows.', 'Last updated: May 18, 2026', [
          ['1. Security approach', 'We design around data minimization. Where practical, conversion work runs in the browser so files do not need to be uploaded.'],
          ['2. Browser-based processing', 'Local browser processing improves privacy, but still depends on your device, browser, memory, file size, and the libraries loaded by the page.'],
          ['3. Accounts', 'Supabase handles authentication and profile data. Access to account and admin features should be protected with authentication, roles, and row-level security.'],
          ['4. Payments', 'Stripe-hosted checkout helps reduce payment card exposure because full card numbers are handled by Stripe, not stored by EverythingConvert.'],
          ['5. Infrastructure', 'Hosting and edge platforms provide delivery, HTTPS, logs, and protection features. We remain responsible for application code, secrets, and configuration.'],
          ['6. Compliance posture', 'EverythingConvert does not currently claim independent SOC 2, ISO 27001, HIPAA, or PCI certification for the entire service. Provider certifications do not automatically certify our service.'],
          ['7. Responsible disclosure', 'If you find a security issue, contact us with the affected URL, steps to reproduce, and possible impact. Do not access data that is not yours.'],
        ]),
        ko: legal('보안', '보안 및 규정 준수', '이 페이지는 EverythingConvert의 현재 보안 방식, 사용하는 외부 플랫폼, 앞으로 강화할 보안 관리 항목을 설명합니다.', '최종 업데이트: 2026년 5월 18일', [
          ['1. 보안 접근 방식', 'EverythingConvert는 데이터 최소화를 중요하게 생각합니다. 가능한 경우 변환 작업은 브라우저에서 실행되어 파일을 서버에 업로드할 필요가 없습니다.'],
          ['2. 브라우저 기반 처리', '브라우저 처리 방식은 개인정보 보호에 도움이 되지만, 사용자의 기기, 브라우저, 메모리, 파일 크기, 페이지에서 사용하는 라이브러리의 영향을 받습니다.'],
          ['3. 계정 보안', '인증과 사용자 프로필은 Supabase를 통해 처리합니다. 계정 기능과 관리자 기능은 로그인, 역할 권한, Row Level Security 같은 접근 제어로 보호되어야 합니다.'],
          ['4. 결제 보안', 'Stripe Checkout을 사용하면 전체 카드 번호를 EverythingConvert가 직접 저장하지 않고 Stripe가 처리하므로 결제 카드 데이터 노출 범위를 줄일 수 있습니다.'],
          ['5. 인프라', '호스팅과 엣지 플랫폼은 HTTPS, 배포, 로그, 보호 기능을 제공합니다. 애플리케이션 코드, 비밀키, 설정, 서버리스 함수 보안은 EverythingConvert의 책임입니다.'],
          ['6. 규정 준수 상태', 'EverythingConvert는 현재 서비스 전체에 대해 독립적인 SOC 2, ISO 27001, HIPAA, PCI 인증을 주장하지 않습니다. 외부 제공자의 인증이 곧 EverythingConvert 전체 인증을 의미하지는 않습니다.'],
          ['7. 보안 제보', '보안 문제가 의심되면 영향을 받는 URL, 재현 단계, 가능한 영향을 포함해 문의 페이지로 알려 주세요. 본인 소유가 아닌 데이터에 접근하거나 변경해서는 안 됩니다.'],
        ]),
        de: legal('Sicherheit', 'Sicherheit und Compliance', 'Diese Seite erklärt Sicherheitsmodell, Drittanbieter und geplante Kontrollen.', 'Zuletzt aktualisiert: 18. Mai 2026', [
          ['1. Ansatz', 'Wir minimieren Daten. Wo möglich laufen Konvertierungen im Browser ohne Upload.'],
          ['2. Browser-Verarbeitung', 'Dies verbessert Datenschutz, hängt aber von Gerät, Browser, Speicher, Dateigröße und Bibliotheken ab.'],
          ['3. Konten', 'Supabase verarbeitet Authentifizierung und Profile. Rollen und Sicherheitsregeln schützen den Zugriff.'],
          ['4. Zahlungen', 'Stripe Checkout reduziert den Umgang mit Kartendaten durch EverythingConvert.'],
          ['5. Infrastruktur', 'Hosting-Plattformen liefern HTTPS, Logs und Schutz. Wir bleiben für Code, Secrets und Konfiguration verantwortlich.'],
          ['6. Compliance', 'Wir beanspruchen derzeit keine eigene SOC 2-, ISO 27001-, HIPAA- oder PCI-Zertifizierung für den gesamten Dienst.'],
          ['7. Meldung', 'Sicherheitsprobleme bitte mit URL, Reproduktionsschritten und Auswirkung melden.'],
        ]),
        es: legal('Seguridad', 'Seguridad y cumplimiento', 'Esta página explica el modelo de seguridad, proveedores y controles que planeamos fortalecer.', 'Última actualización: 18 de mayo de 2026', [
          ['1. Enfoque', 'Minimizamos datos. Cuando es posible, la conversión se ejecuta en el navegador sin subir archivos.'],
          ['2. Procesamiento local', 'Mejora la privacidad, pero depende del dispositivo, navegador, memoria, tamaño de archivo y bibliotecas.'],
          ['3. Cuentas', 'Supabase gestiona autenticación y perfiles. Roles y políticas protegen el acceso.'],
          ['4. Pagos', 'Stripe Checkout reduce la exposición de datos de tarjeta porque Stripe procesa los números completos.'],
          ['5. Infraestructura', 'El hosting ofrece HTTPS, registros y protección. Nosotros somos responsables del código, secretos y configuración.'],
          ['6. Cumplimiento', 'No afirmamos tener certificación SOC 2, ISO 27001, HIPAA o PCI para todo el servicio.'],
          ['7. Reportes', 'Si encuentras un problema, envía URL, pasos de reproducción e impacto posible.'],
        ]),
        fr: legal('Sécurité', 'Sécurité et conformité', 'Cette page explique notre modèle de sécurité, les prestataires et les contrôles prévus.', 'Dernière mise à jour : 18 mai 2026', [
          ['1. Approche', 'Nous minimisons les données. Quand c’est possible, la conversion se fait dans le navigateur sans envoi de fichier.'],
          ['2. Traitement local', 'Cela améliore la confidentialité, mais dépend de l’appareil, du navigateur, de la mémoire, de la taille du fichier et des bibliothèques.'],
          ['3. Comptes', 'Supabase gère l’authentification et les profils. Les rôles et politiques protègent l’accès.'],
          ['4. Paiements', 'Stripe Checkout réduit l’exposition aux données de carte car Stripe traite les numéros complets.'],
          ['5. Infrastructure', 'L’hébergement fournit HTTPS, journaux et protections. Nous restons responsables du code, secrets et configuration.'],
          ['6. Conformité', 'Nous ne revendiquons pas de certification SOC 2, ISO 27001, HIPAA ou PCI pour l’ensemble du service.'],
          ['7. Signalement', 'Pour un problème de sécurité, envoyez l’URL, les étapes de reproduction et l’impact possible.'],
        ]),
      },
    },
  };

  function legal(kicker, title, intro, updated, sections) {
    return `
      <section class="pricing-hero">
        <p class="pricing-kicker">${kicker}</p>
        <h1>${title}</h1>
        <p>${intro}</p>
        <p><strong>${updated}</strong></p>
      </section>
      ${sections.map(([heading, body]) => `<section class="pricing-note"><h2>${heading}</h2><p>${body}</p></section>`).join('')}
    `;
  }

  function supported(lang) {
    return Object.prototype.hasOwnProperty.call(labels, lang);
  }

  function currentLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (supported(urlLang)) return urlLang;
    if (window.EverythingConvertLanguage && typeof window.EverythingConvertLanguage.get === 'function') {
      const shared = window.EverythingConvertLanguage.get();
      if (supported(shared)) return shared;
    }
    try {
      const saved = localStorage.getItem('everything_convert_language');
      if (supported(saved)) return saved;
    } catch (error) {
      // Ignore storage errors.
    }
    return 'en';
  }

  function pageKey() {
    let file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    file = file.split('?')[0].split('#')[0];
    if (!file) file = 'index.html';
    // Clean-URL hosting may drop the .html extension (/about -> about).
    if (pages[file]) return file;
    if (pages[file + '.html']) return file + '.html';
    return file;
  }

  function setFooterAndNav(lang) {
    document.querySelectorAll('a.nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const key = href.includes('pricing') ? 'pricing' : href.includes('auth') ? (link.hasAttribute('data-auth-state') ? 'account' : 'login') : href.includes('#tools') ? 'tools' : href.includes('index') ? 'home' : '';
      if (key && nav[key]) link.textContent = nav[key][lang] || nav[key].en;
    });
    const footerLinks = [
      ['about', 'about.html'],
      ['donate', 'https://donate.stripe.com/9B6eVc4Rt9yo4m75nwdwc00'],
      ['privacy', 'privacy.html'],
      ['terms', 'terms.html'],
      ['security', 'security.html'],
      ['contact', 'contact.html'],
    ];
    const row = document.querySelector('.footer-legal-row');
    if (row) {
      row.innerHTML = footerLinks.map(([key, href]) => {
        const external = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
        return `<a href="${href}"${external}>${nav[key][lang] || nav[key].en}</a>`;
      }).join('');
    }
    const copyright = document.querySelector('.footer-bottom p');
    if (copyright) copyright.textContent = nav.copyright[lang] || nav.copyright.en;
    const current = document.querySelector('[data-language-current]');
    if (current) current.textContent = labels[lang];
    // The footer language dropdown is owned by language-menu.js, which handles
    // the [data-language] clicks (saving the choice and dispatching
    // everything-language-change). We only react to that event below — no
    // reload, no duplicate handlers.
  }

  let lastRendered = null;

  function render(forcedLang) {
    const page = pages[pageKey()];
    if (!page) return;
    const lang = supported(forcedLang) ? forcedLang : currentLang();
    document.documentElement.lang = lang;
    document.title = page.title[lang] || page.title.en;
    const main = document.querySelector('main');
    if (main && lastRendered !== lang) {
      main.innerHTML = page.content[lang] || page.content.en;
      lastRendered = lang;
    }
    setFooterAndNav(lang);
  }

  function init() {
    render();
    // Re-apply after the shared language system settles (it schedules its own
    // [0,100,500] ms passes) so browser-detected languages also take effect.
    [0, 120, 500].forEach((delay) => window.setTimeout(() => render(), delay));
    window.addEventListener('everything-language-change', (event) => {
      const lang = event && event.detail && event.detail.language;
      render(supported(lang) ? lang : undefined);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
