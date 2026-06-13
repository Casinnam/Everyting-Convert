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
        en: legal('Terms', 'Terms of Use', 'These Terms explain the rules for using EverythingConvert and the responsibilities that apply when you convert, upload, download, or process files.', 'Last updated: June 12, 2026', [
          ['1. Acceptance of Terms', 'By accessing or using EverythingConvert (the "Service"), you agree to these Terms of Use and our Privacy Policy. If you do not agree, do not use the Service. If you use the Service on behalf of an organization, you confirm that you are authorized to bind that organization to these Terms.'],
          ['2. Description of the Service', 'EverythingConvert provides browser-based file conversion plus document, image, media, QR, developer, and AI-assisted tools. Some tools run entirely in your browser; others use secure server-side or third-party processing. Output may vary depending on browser, file structure, fonts, encryption, scanned pages, metadata, and third-party libraries.'],
          ['3. Eligibility', 'You must be at least 13 years old, or the minimum age of digital consent in your country, to use the Service. If you are not old enough to form a binding contract on your own, you may use the Service only with the involvement of a parent or guardian.'],
          ['4. Accounts', 'Some features require an account. You are responsible for keeping your login credentials secure and for all activity under your account. Authentication is handled through our provider (Supabase). Please notify us promptly of any unauthorized use of your account.'],
          ['5. Your Files and Content', 'You keep all rights to the files and text you process, and we do not claim ownership of your content. You grant us only the limited, temporary right to process your content as needed to provide the tool you requested. You are solely responsible for having the legal right to upload, convert, download, and use every file you process.'],
          ['6. Acceptable Use', 'You agree not to use the Service for malware, phishing, stolen or illegal data, copyright or trademark infringement, harassment, attempts to overload or attack the Service, reverse engineering, or bypassing usage limits or access controls. We may restrict or remove access that violates these rules.'],
          ['7. Plans and Pricing', 'The Service offers a free tier, a Pro subscription (monthly or yearly), and one-time pay-as-you-go AI tools. Free usage may be subject to daily or total limits. Prices, limits, and feature availability may change as the Service develops; changes do not apply retroactively to a subscription period you have already paid for.'],
          ['8. Payments and Auto-Renewal', 'Payments are processed by Stripe, and Stripe’s terms also apply. Pro subscriptions renew automatically at the end of each billing period until cancelled. You may cancel at any time, and cancellation takes effect at the end of the current paid period. Applicable taxes may be added.'],
          ['9. Refunds', 'Subscription fees for the current billing period are generally non-refundable, but you can cancel to stop future renewals. One-time AI tools provide a free preview before payment and deliver the full result immediately after payment, so they are generally non-refundable once the result has been generated — except where required by law, or where a paid result failed to generate due to a fault on our side. To request a refund, contact us through the contact page.'],
          ['10. Donations', 'Voluntary donations help support the Service. A donation does not by itself create paid access, a subscription, or any entitlement unless we clearly state otherwise.'],
          ['11. Intellectual Property', 'The EverythingConvert name, logo, site design, text, and software are owned by us or our licensors and are protected by intellectual property laws. You may not copy, resell, or create derivative works from the Service without permission. This does not affect your rights to your own files.'],
          ['12. Third-Party Services', 'The Service relies on third parties such as Supabase (authentication and database), Stripe (payments), Cloudflare (hosting and delivery), and AI providers used by specific tools. Your use of features that depend on these providers is also subject to their terms and privacy policies.'],
          ['13. Disclaimer of Warranties', 'The Service is provided "as is" and "as available," without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted or error-free, or that converted files will be accurate or suitable for a specific purpose. Always review converted files before relying on them, especially for legal, financial, medical, academic, or business use.'],
          ['14. Limitation of Liability', 'To the maximum extent permitted by law, EverythingConvert and its operators will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost data, lost profits, or business interruption arising from your use of the Service. To the maximum extent permitted by law, our total liability for any claim relating to the Service will not exceed the greater of the amount you paid us for the Service in the three months before the claim, or USD 50.'],
          ['15. Indemnification', 'You agree to indemnify and hold harmless EverythingConvert and its operators from claims, damages, and expenses arising from your misuse of the Service, your content, or your violation of these Terms or of any law or third-party right.'],
          ['16. Suspension and Termination', 'We may suspend, restrict, or terminate access to the Service, with or without notice, if we reasonably believe you have violated these Terms, or to protect the Service, other users, or third parties. You may stop using the Service at any time. Provisions that by their nature should survive termination — such as disclaimers, limitation of liability, and indemnification — will continue to apply.'],
          ['17. Changes to These Terms', 'We may update these Terms as the Service evolves. When we make material changes, we will update the "Last updated" date and, where appropriate, provide additional notice. Continued use of the Service after changes take effect means you accept the updated Terms.'],
          ['18. Governing Law and Disputes', 'These Terms are governed by the laws of the Republic of Korea, without regard to conflict-of-law rules. Disputes will be subject to the courts having jurisdiction over the operator’s location, unless mandatory consumer-protection laws in your country of residence provide otherwise.'],
          ['19. Severability', 'If any provision of these Terms is found unenforceable, the remaining provisions will stay in full effect, and the unenforceable provision will be applied to the maximum extent permitted by law.'],
          ['20. Contact', 'Questions about these Terms can be sent through the contact page.'],
        ]),
        ko: legal('이용약관', '이용약관', '이 약관은 EverythingConvert를 사용할 때 적용되는 규칙과 파일을 변환, 업로드, 다운로드, 처리할 때의 책임을 설명합니다.', '최종 업데이트: 2026년 6월 12일', [
          ['1. 약관 동의', 'EverythingConvert(이하 "서비스")에 접속하거나 이를 사용하면 본 이용약관과 개인정보 처리방침에 동의한 것으로 간주됩니다. 동의하지 않는 경우 서비스를 사용하지 마세요. 조직을 대신하여 서비스를 사용하는 경우, 해당 조직을 본 약관에 구속시킬 권한이 있음을 확인하는 것으로 봅니다.'],
          ['2. 제공하는 서비스', 'EverythingConvert는 브라우저 기반 파일 변환과 함께 문서, 이미지, 미디어, QR, 개발자, AI 보조 도구를 제공합니다. 일부 도구는 브라우저에서 모두 실행되며, 일부는 보안 서버 또는 외부 제공자의 처리를 사용합니다. 변환 결과는 브라우저, 파일 구조, 글꼴, 암호화, 스캔 문서, 메타데이터, 외부 라이브러리에 따라 달라질 수 있습니다.'],
          ['3. 이용 자격', '서비스를 이용하려면 만 13세 이상이거나 거주 국가에서 정한 디지털 동의 최소 연령 이상이어야 합니다. 단독으로 계약을 체결할 수 있는 연령에 미치지 못하는 경우, 부모 또는 보호자의 참여가 있어야만 서비스를 이용할 수 있습니다.'],
          ['4. 계정', '일부 기능은 계정이 필요합니다. 사용자는 로그인 정보를 안전하게 관리할 책임이 있으며, 자신의 계정에서 발생하는 모든 활동에 대해 책임을 집니다. 인증은 제공자(Supabase)를 통해 처리됩니다. 계정의 무단 사용을 발견하면 즉시 알려 주세요.'],
          ['5. 파일과 콘텐츠', '사용자가 처리하는 파일과 텍스트에 대한 모든 권리는 사용자에게 있으며, 당사는 사용자의 콘텐츠에 대한 소유권을 주장하지 않습니다. 사용자는 요청한 도구를 제공하는 데 필요한 범위에서만 콘텐츠를 처리할 수 있는 제한적·일시적 권리를 당사에 부여합니다. 처리하는 모든 파일을 업로드, 변환, 다운로드, 사용할 법적 권리를 보유할 책임은 전적으로 사용자에게 있습니다.'],
          ['6. 허용되지 않는 사용', '악성코드, 피싱, 도난 또는 불법 데이터, 저작권·상표 침해, 괴롭힘, 서비스 과부하 또는 공격 시도, 리버스 엔지니어링, 사용량 제한·접근 제어 우회 목적으로 서비스를 사용해서는 안 됩니다. 이러한 규칙을 위반하는 접근은 제한하거나 차단할 수 있습니다.'],
          ['7. 요금제와 가격', '서비스는 무료 등급, Pro 구독(월간 또는 연간), 단건 결제 방식의 AI 도구를 제공합니다. 무료 사용에는 일일 또는 누적 한도가 적용될 수 있습니다. 가격, 한도, 기능 제공 여부는 서비스 발전에 따라 변경될 수 있으나, 이미 결제한 구독 기간에는 소급 적용되지 않습니다.'],
          ['8. 결제와 자동 갱신', '결제는 Stripe가 처리하며 Stripe의 약관도 함께 적용됩니다. Pro 구독은 해지하기 전까지 각 결제 기간이 끝날 때마다 자동으로 갱신됩니다. 언제든지 해지할 수 있으며, 해지는 현재 결제된 기간이 끝날 때 적용됩니다. 해당되는 세금이 추가될 수 있습니다.'],
          ['9. 환불', '현재 결제 기간의 구독 요금은 원칙적으로 환불되지 않으나, 해지를 통해 다음 갱신을 중단할 수 있습니다. 단건 AI 도구는 결제 전에 무료 미리보기를 제공하고 결제 직후 전체 결과물을 전달하므로, 결과물이 생성된 이후에는 원칙적으로 환불되지 않습니다. 다만 법령이 요구하는 경우나 당사의 귀책으로 유료 결과물이 생성되지 않은 경우는 예외입니다. 환불 요청은 문의 페이지를 통해 보내 주세요.'],
          ['10. 후원', '자발적 후원은 서비스 운영에 도움이 됩니다. 후원은 당사가 명시적으로 달리 정하지 않는 한 그 자체로 유료 이용 권한, 구독, 어떠한 권리도 발생시키지 않습니다.'],
          ['11. 지식재산권', 'EverythingConvert의 명칭, 로고, 사이트 디자인, 텍스트, 소프트웨어는 당사 또는 라이선스 제공자의 소유이며 지식재산권법으로 보호됩니다. 허가 없이 서비스를 복제, 재판매하거나 2차적 저작물을 만들 수 없습니다. 이는 사용자가 자신의 파일에 대해 가지는 권리에는 영향을 주지 않습니다.'],
          ['12. 외부 서비스', '서비스는 Supabase(인증·데이터베이스), Stripe(결제), Cloudflare(호스팅·전송), 특정 도구가 사용하는 AI 제공자 등 외부 업체에 의존합니다. 이러한 제공자에 의존하는 기능을 사용할 때는 해당 제공자의 약관과 개인정보 처리방침도 함께 적용됩니다.'],
          ['13. 보증의 부인', '서비스는 명시적이든 묵시적이든 어떠한 보증도 없이 "있는 그대로" 그리고 "이용 가능한 상태로" 제공되며, 여기에는 상품성, 특정 목적 적합성, 비침해에 대한 보증이 포함됩니다. 당사는 서비스가 중단 없이 또는 오류 없이 제공된다거나 변환 결과가 정확하거나 특정 목적에 적합하다고 보증하지 않습니다. 특히 법률, 금융, 의료, 학업, 업무상 중요한 용도에서는 사용 전에 변환 결과를 반드시 확인하세요.'],
          ['14. 책임의 제한', '관련 법령이 허용하는 최대 범위에서, EverythingConvert와 운영자는 서비스 사용으로 인한 간접적·부수적·특별·결과적·징벌적 손해나 데이터 손실, 이익 손실, 영업 중단에 대해 책임지지 않습니다. 또한 관련 법령이 허용하는 최대 범위에서, 서비스와 관련된 모든 청구에 대한 당사의 총책임은 청구 발생 직전 3개월간 사용자가 서비스에 지급한 금액과 미화 50달러 중 더 큰 금액을 초과하지 않습니다.'],
          ['15. 면책 보장', '사용자는 서비스 오용, 자신의 콘텐츠, 본 약관 또는 법령·제3자의 권리 위반으로 발생하는 청구, 손해, 비용으로부터 EverythingConvert와 운영자를 면책하고 보호하는 데 동의합니다.'],
          ['16. 이용 정지 및 해지', '본 약관 위반이 합리적으로 의심되거나 서비스, 다른 이용자, 제3자를 보호하기 위해 필요한 경우, 당사는 사전 통지 여부와 관계없이 서비스 접근을 정지·제한·종료할 수 있습니다. 사용자는 언제든지 서비스 이용을 중단할 수 있습니다. 보증의 부인, 책임의 제한, 면책 보장 등 그 성질상 존속되어야 하는 조항은 해지 이후에도 계속 적용됩니다.'],
          ['17. 약관 변경', '서비스 발전에 따라 본 약관을 변경할 수 있습니다. 중요한 변경이 있을 경우 "최종 업데이트" 날짜를 갱신하고 필요한 경우 추가로 고지합니다. 변경 발효 후에도 서비스를 계속 사용하면 변경된 약관에 동의한 것으로 간주됩니다.'],
          ['18. 준거법과 분쟁', '본 약관은 법률 충돌 원칙과 관계없이 대한민국 법률에 따라 규율됩니다. 분쟁은 사용자가 거주하는 국가의 강행적 소비자 보호법이 달리 정하지 않는 한 운영자 소재지를 관할하는 법원의 관할에 따릅니다.'],
          ['19. 분리 가능성', '본 약관의 어느 조항이 집행 불가능하다고 판단되더라도 나머지 조항은 완전한 효력을 유지하며, 해당 조항은 법령이 허용하는 최대 범위에서 적용됩니다.'],
          ['20. 문의', '약관 관련 질문은 문의 페이지를 통해 보내 주세요.'],
        ]),
        de: legal('Bedingungen', 'Nutzungsbedingungen', 'Diese Bedingungen erklären die Regeln für die Nutzung von EverythingConvert und Ihre Verantwortlichkeiten beim Konvertieren, Hochladen, Herunterladen und Verarbeiten von Dateien.', 'Zuletzt aktualisiert: 12. Juni 2026', [
          ['1. Annahme der Bedingungen', 'Durch den Zugriff auf oder die Nutzung von EverythingConvert (der "Dienst") stimmen Sie diesen Nutzungsbedingungen und unserer Datenschutzerklärung zu. Wenn Sie nicht einverstanden sind, nutzen Sie den Dienst nicht. Nutzen Sie den Dienst für eine Organisation, bestätigen Sie, dass Sie diese binden dürfen.'],
          ['2. Beschreibung des Dienstes', 'EverythingConvert bietet browserbasierte Dateikonvertierung sowie Dokument-, Bild-, Medien-, QR-, Entwickler- und KI-gestützte Tools. Manche Tools laufen vollständig im Browser, andere nutzen sichere serverseitige oder Drittanbieter-Verarbeitung. Ergebnisse können je nach Browser, Dateistruktur, Schriften, Verschlüsselung, gescannten Seiten, Metadaten und Bibliotheken variieren.'],
          ['3. Voraussetzungen', 'Sie müssen mindestens 13 Jahre alt sein oder das Mindestalter für die digitale Einwilligung in Ihrem Land erreicht haben. Sind Sie nicht alt genug, um selbst einen bindenden Vertrag zu schließen, dürfen Sie den Dienst nur mit Beteiligung eines Erziehungsberechtigten nutzen.'],
          ['4. Konten', 'Einige Funktionen erfordern ein Konto. Sie sind dafür verantwortlich, Ihre Zugangsdaten sicher zu halten, und für alle Aktivitäten unter Ihrem Konto. Die Authentifizierung erfolgt über unseren Anbieter (Supabase). Melden Sie uns jede unbefugte Nutzung umgehend.'],
          ['5. Ihre Dateien und Inhalte', 'Sie behalten alle Rechte an den von Ihnen verarbeiteten Dateien und Texten; wir beanspruchen kein Eigentum an Ihren Inhalten. Sie gewähren uns nur das begrenzte, vorübergehende Recht, Ihre Inhalte zur Bereitstellung des gewünschten Tools zu verarbeiten. Sie sind allein dafür verantwortlich, die rechtliche Befugnis für jede verarbeitete Datei zu besitzen.'],
          ['6. Zulässige Nutzung', 'Sie dürfen den Dienst nicht für Malware, Phishing, gestohlene oder rechtswidrige Daten, Urheberrechts- oder Markenverletzung, Belästigung, Überlastungs- oder Angriffsversuche, Reverse Engineering oder die Umgehung von Limits und Zugriffskontrollen nutzen. Wir können Zugriffe, die diese Regeln verletzen, einschränken oder sperren.'],
          ['7. Tarife und Preise', 'Der Dienst bietet eine kostenlose Stufe, ein Pro-Abonnement (monatlich oder jährlich) und einmalige KI-Tools nach Verbrauch. Für die kostenlose Nutzung können Tages- oder Gesamtlimits gelten. Preise, Limits und Verfügbarkeit können sich ändern, gelten aber nicht rückwirkend für einen bereits bezahlten Abozeitraum.'],
          ['8. Zahlungen und automatische Verlängerung', 'Zahlungen werden über Stripe abgewickelt; dessen Bedingungen gelten zusätzlich. Pro-Abonnements verlängern sich bis zur Kündigung automatisch am Ende jedes Abrechnungszeitraums. Sie können jederzeit kündigen; die Kündigung wird zum Ende des laufenden bezahlten Zeitraums wirksam. Anfallende Steuern können hinzukommen.'],
          ['9. Erstattungen', 'Abogebühren für den laufenden Abrechnungszeitraum sind grundsätzlich nicht erstattungsfähig, Sie können jedoch kündigen, um künftige Verlängerungen zu stoppen. Einmalige KI-Tools bieten vor der Zahlung eine kostenlose Vorschau und liefern das vollständige Ergebnis sofort nach der Zahlung; sie sind daher nach Erstellung des Ergebnisses grundsätzlich nicht erstattungsfähig — außer wenn gesetzlich vorgeschrieben oder wenn ein bezahltes Ergebnis aufgrund eines Fehlers unsererseits nicht erstellt wurde. Erstattungen können über die Kontaktseite angefragt werden.'],
          ['10. Spenden', 'Freiwillige Spenden unterstützen den Dienst. Eine Spende begründet für sich genommen keinen bezahlten Zugang, kein Abonnement und keinen Anspruch, sofern wir dies nicht ausdrücklich angeben.'],
          ['11. Geistiges Eigentum', 'Name, Logo, Design, Texte und Software von EverythingConvert gehören uns oder unseren Lizenzgebern und sind durch Schutzrechte geschützt. Sie dürfen den Dienst ohne Erlaubnis nicht kopieren, weiterverkaufen oder daraus abgeleitete Werke erstellen. Ihre Rechte an Ihren eigenen Dateien bleiben unberührt.'],
          ['12. Drittanbieter-Dienste', 'Der Dienst nutzt Dritte wie Supabase (Authentifizierung und Datenbank), Stripe (Zahlungen), Cloudflare (Hosting und Auslieferung) und KI-Anbieter einzelner Tools. Für Funktionen, die von diesen Anbietern abhängen, gelten auch deren Bedingungen und Datenschutzerklärungen.'],
          ['13. Gewährleistungsausschluss', 'Der Dienst wird "wie besehen" und "wie verfügbar" ohne jegliche ausdrückliche oder stillschweigende Gewährleistung bereitgestellt, einschließlich Marktgängigkeit, Eignung für einen bestimmten Zweck und Nichtverletzung. Wir gewährleisten nicht, dass der Dienst unterbrechungs- oder fehlerfrei ist oder dass konvertierte Dateien korrekt oder für einen bestimmten Zweck geeignet sind. Prüfen Sie Ergebnisse stets vor wichtiger Nutzung.'],
          ['14. Haftungsbeschränkung', 'Soweit gesetzlich zulässig, haften EverythingConvert und seine Betreiber nicht für indirekte, zufällige, besondere, Folge- oder Strafschäden oder für Datenverlust, entgangenen Gewinn oder Betriebsunterbrechung aus der Nutzung des Dienstes. Soweit gesetzlich zulässig, übersteigt unsere Gesamthaftung für Ansprüche im Zusammenhang mit dem Dienst nicht den höheren Betrag aus dem, was Sie uns in den drei Monaten vor dem Anspruch gezahlt haben, oder 50 USD.'],
          ['15. Freistellung', 'Sie stellen EverythingConvert und seine Betreiber von Ansprüchen, Schäden und Kosten frei, die aus Ihrem Missbrauch des Dienstes, Ihren Inhalten oder Ihrem Verstoß gegen diese Bedingungen oder gegen Gesetze bzw. Rechte Dritter entstehen.'],
          ['16. Sperrung und Kündigung', 'Wir können den Zugang mit oder ohne Vorankündigung sperren, einschränken oder beenden, wenn wir begründet annehmen, dass Sie gegen diese Bedingungen verstoßen, oder um den Dienst, andere Nutzer oder Dritte zu schützen. Sie können die Nutzung jederzeit beenden. Bestimmungen, die ihrem Wesen nach fortgelten sollen (z. B. Gewährleistungsausschluss, Haftungsbeschränkung, Freistellung), gelten weiter.'],
          ['17. Änderungen dieser Bedingungen', 'Wir können diese Bedingungen mit der Weiterentwicklung des Dienstes aktualisieren. Bei wesentlichen Änderungen aktualisieren wir das Datum "Zuletzt aktualisiert" und weisen ggf. zusätzlich darauf hin. Die fortgesetzte Nutzung nach Inkrafttreten gilt als Zustimmung.'],
          ['18. Anwendbares Recht und Streitigkeiten', 'Diese Bedingungen unterliegen dem Recht der Republik Korea, ohne Berücksichtigung kollisionsrechtlicher Regeln. Für Streitigkeiten sind die für den Sitz des Betreibers zuständigen Gerichte zuständig, sofern nicht zwingendes Verbraucherschutzrecht Ihres Wohnsitzlandes etwas anderes vorsieht.'],
          ['19. Salvatorische Klausel', 'Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleiben die übrigen Bestimmungen voll wirksam, und die unwirksame Bestimmung wird im gesetzlich zulässigen Umfang angewendet.'],
          ['20. Kontakt', 'Fragen zu diesen Bedingungen können über die Kontaktseite gesendet werden.'],
        ]),
        es: legal('Términos', 'Términos de uso', 'Estos términos explican las reglas para usar EverythingConvert y las responsabilidades que aplican al convertir, subir, descargar o procesar archivos.', 'Última actualización: 12 de junio de 2026', [
          ['1. Aceptación de los términos', 'Al acceder o usar EverythingConvert (el "Servicio"), aceptas estos términos de uso y nuestra política de privacidad. Si no estás de acuerdo, no uses el Servicio. Si lo usas en nombre de una organización, confirmas que estás autorizado para vincularla a estos términos.'],
          ['2. Descripción del servicio', 'EverythingConvert ofrece conversión de archivos en el navegador, además de herramientas de documentos, imágenes, multimedia, QR, desarrollo y asistidas por IA. Algunas se ejecutan totalmente en tu navegador; otras usan procesamiento seguro en servidor o de terceros. Los resultados pueden variar según navegador, estructura del archivo, fuentes, cifrado, páginas escaneadas, metadatos y bibliotecas.'],
          ['3. Elegibilidad', 'Debes tener al menos 13 años, o la edad mínima de consentimiento digital de tu país, para usar el Servicio. Si no tienes edad para celebrar un contrato vinculante por ti mismo, solo puedes usar el Servicio con la participación de un padre o tutor.'],
          ['4. Cuentas', 'Algunas funciones requieren una cuenta. Eres responsable de mantener seguras tus credenciales y de toda la actividad de tu cuenta. La autenticación se gestiona mediante nuestro proveedor (Supabase). Avísanos de inmediato si detectas un uso no autorizado.'],
          ['5. Tus archivos y contenido', 'Conservas todos los derechos sobre los archivos y textos que procesas, y no reclamamos la propiedad de tu contenido. Nos concedes solo el derecho limitado y temporal de procesar tu contenido según sea necesario para ofrecer la herramienta solicitada. Eres el único responsable de tener el derecho legal de subir, convertir, descargar y usar cada archivo.'],
          ['6. Uso aceptable', 'Aceptas no usar el Servicio para malware, phishing, datos robados o ilegales, infracción de derechos de autor o marcas, acoso, intentos de sobrecargar o atacar el Servicio, ingeniería inversa o evasión de límites o controles de acceso. Podemos restringir o retirar el acceso que infrinja estas reglas.'],
          ['7. Planes y precios', 'El Servicio ofrece un nivel gratuito, una suscripción Pro (mensual o anual) y herramientas de IA de pago único. El uso gratuito puede estar sujeto a límites diarios o totales. Los precios, límites y disponibilidad pueden cambiar con el desarrollo del Servicio; los cambios no se aplican de forma retroactiva a un periodo de suscripción ya pagado.'],
          ['8. Pagos y renovación automática', 'Los pagos los procesa Stripe, y también aplican sus términos. Las suscripciones Pro se renuevan automáticamente al final de cada periodo de facturación hasta que se cancelen. Puedes cancelar en cualquier momento, y la cancelación surte efecto al final del periodo pagado en curso. Pueden añadirse los impuestos aplicables.'],
          ['9. Reembolsos', 'Las cuotas de suscripción del periodo de facturación actual no suelen ser reembolsables, pero puedes cancelar para detener renovaciones futuras. Las herramientas de IA de pago único ofrecen una vista previa gratuita antes del pago y entregan el resultado completo inmediatamente después, por lo que no suelen ser reembolsables una vez generado el resultado, salvo que la ley lo exija o que un resultado pagado no se generara por un fallo de nuestra parte. Solicita reembolsos a través de la página de contacto.'],
          ['10. Donaciones', 'Las donaciones voluntarias ayudan a sostener el Servicio. Una donación no crea por sí misma acceso de pago, suscripción ni derecho alguno, salvo que indiquemos lo contrario claramente.'],
          ['11. Propiedad intelectual', 'El nombre, logotipo, diseño, textos y software de EverythingConvert son propiedad nuestra o de nuestros licenciantes y están protegidos por leyes de propiedad intelectual. No puedes copiar, revender ni crear obras derivadas del Servicio sin permiso. Esto no afecta a tus derechos sobre tus propios archivos.'],
          ['12. Servicios de terceros', 'El Servicio depende de terceros como Supabase (autenticación y base de datos), Stripe (pagos), Cloudflare (alojamiento y entrega) y proveedores de IA usados por herramientas concretas. El uso de funciones que dependen de estos proveedores también está sujeto a sus términos y políticas de privacidad.'],
          ['13. Renuncia de garantías', 'El Servicio se ofrece "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas, incluidas las de comerciabilidad, idoneidad para un fin concreto y no infracción. No garantizamos que el Servicio sea ininterrumpido o sin errores, ni que los archivos convertidos sean precisos o adecuados para un fin específico. Revisa siempre los archivos convertidos antes de confiar en ellos.'],
          ['14. Limitación de responsabilidad', 'En la máxima medida permitida por la ley, EverythingConvert y sus operadores no serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de pérdida de datos, lucro cesante o interrupción del negocio derivados de tu uso del Servicio. En la máxima medida permitida por la ley, nuestra responsabilidad total por cualquier reclamación relacionada con el Servicio no superará el mayor entre lo que nos pagaste en los tres meses previos a la reclamación o 50 USD.'],
          ['15. Indemnización', 'Aceptas indemnizar y eximir de responsabilidad a EverythingConvert y sus operadores frente a reclamaciones, daños y gastos derivados del uso indebido del Servicio, de tu contenido o de tu incumplimiento de estos términos o de cualquier ley o derecho de terceros.'],
          ['16. Suspensión y terminación', 'Podemos suspender, restringir o terminar el acceso, con o sin aviso, si creemos razonablemente que has incumplido estos términos, o para proteger el Servicio, a otros usuarios o a terceros. Puedes dejar de usar el Servicio cuando quieras. Las disposiciones que por su naturaleza deban subsistir (como renuncias, limitación de responsabilidad e indemnización) seguirán vigentes.'],
          ['17. Cambios en estos términos', 'Podemos actualizar estos términos a medida que evoluciona el Servicio. Ante cambios sustanciales, actualizaremos la fecha de "Última actualización" y, cuando corresponda, daremos aviso adicional. El uso continuado tras su entrada en vigor implica que aceptas los términos actualizados.'],
          ['18. Ley aplicable y disputas', 'Estos términos se rigen por las leyes de la República de Corea, sin atender a las normas de conflicto de leyes. Las disputas se someterán a los tribunales competentes del domicilio del operador, salvo que la legislación imperativa de protección al consumidor de tu país de residencia disponga otra cosa.'],
          ['19. Divisibilidad', 'Si alguna disposición de estos términos resulta inaplicable, las demás seguirán plenamente vigentes, y la disposición afectada se aplicará en la máxima medida permitida por la ley.'],
          ['20. Contacto', 'Las preguntas sobre estos términos pueden enviarse desde la página de contacto.'],
        ]),
        fr: legal('Conditions', 'Conditions d’utilisation', 'Ces conditions expliquent les règles d’utilisation d’EverythingConvert et vos responsabilités lors de la conversion, du téléversement, du téléchargement ou du traitement de fichiers.', 'Dernière mise à jour : 12 juin 2026', [
          ['1. Acceptation des conditions', 'En accédant à EverythingConvert (le « Service ») ou en l’utilisant, vous acceptez ces conditions d’utilisation et notre politique de confidentialité. Si vous n’êtes pas d’accord, n’utilisez pas le Service. Si vous l’utilisez pour une organisation, vous confirmez être autorisé à l’engager.'],
          ['2. Description du service', 'EverythingConvert propose la conversion de fichiers dans le navigateur ainsi que des outils document, image, média, QR, développeur et assistés par IA. Certains fonctionnent entièrement dans le navigateur, d’autres utilisent un traitement sécurisé côté serveur ou par des tiers. Les résultats peuvent varier selon le navigateur, la structure du fichier, les polices, le chiffrement, les pages numérisées, les métadonnées et les bibliothèques.'],
          ['3. Admissibilité', 'Vous devez avoir au moins 13 ans, ou l’âge minimal du consentement numérique dans votre pays, pour utiliser le Service. Si vous n’avez pas l’âge de conclure seul un contrat, vous ne pouvez utiliser le Service qu’avec la participation d’un parent ou tuteur.'],
          ['4. Comptes', 'Certaines fonctions nécessitent un compte. Vous êtes responsable de la sécurité de vos identifiants et de toute activité sur votre compte. L’authentification est gérée par notre prestataire (Supabase). Signalez-nous rapidement toute utilisation non autorisée.'],
          ['5. Vos fichiers et contenus', 'Vous conservez tous les droits sur les fichiers et textes que vous traitez, et nous ne revendiquons aucune propriété sur votre contenu. Vous nous accordez seulement le droit limité et temporaire de traiter votre contenu afin de fournir l’outil demandé. Vous êtes seul responsable de détenir le droit légal de téléverser, convertir, télécharger et utiliser chaque fichier.'],
          ['6. Usage acceptable', 'Vous vous engagez à ne pas utiliser le Service pour des logiciels malveillants, l’hameçonnage, des données volées ou illégales, la contrefaçon de droits d’auteur ou de marques, le harcèlement, des tentatives de surcharge ou d’attaque, l’ingénierie inverse ou le contournement des limites ou contrôles d’accès. Nous pouvons restreindre ou retirer tout accès qui enfreint ces règles.'],
          ['7. Offres et tarifs', 'Le Service propose un palier gratuit, un abonnement Pro (mensuel ou annuel) et des outils IA à l’unité. L’usage gratuit peut être soumis à des limites quotidiennes ou totales. Les prix, limites et disponibilités peuvent évoluer avec le Service ; les changements ne s’appliquent pas rétroactivement à une période d’abonnement déjà payée.'],
          ['8. Paiements et renouvellement automatique', 'Les paiements sont traités par Stripe, dont les conditions s’appliquent également. Les abonnements Pro se renouvellent automatiquement à la fin de chaque période de facturation jusqu’à résiliation. Vous pouvez résilier à tout moment ; la résiliation prend effet à la fin de la période payée en cours. Les taxes applicables peuvent s’ajouter.'],
          ['9. Remboursements', 'Les frais d’abonnement de la période en cours ne sont en général pas remboursables, mais vous pouvez résilier pour arrêter les renouvellements. Les outils IA à l’unité offrent un aperçu gratuit avant paiement et livrent le résultat complet immédiatement après, ils ne sont donc en général pas remboursables une fois le résultat généré — sauf si la loi l’exige ou si un résultat payé n’a pas été généré en raison d’une faute de notre part. Les demandes de remboursement se font via la page de contact.'],
          ['10. Dons', 'Les dons volontaires aident à soutenir le Service. Un don ne crée pas en lui-même un accès payant, un abonnement ni aucun droit, sauf indication contraire explicite de notre part.'],
          ['11. Propriété intellectuelle', 'Le nom, le logo, le design, les textes et le logiciel d’EverythingConvert nous appartiennent ou appartiennent à nos concédants et sont protégés par le droit de la propriété intellectuelle. Vous ne pouvez ni copier, ni revendre, ni créer d’œuvres dérivées du Service sans autorisation. Cela n’affecte pas vos droits sur vos propres fichiers.'],
          ['12. Services tiers', 'Le Service s’appuie sur des tiers tels que Supabase (authentification et base de données), Stripe (paiements), Cloudflare (hébergement et diffusion) et des fournisseurs d’IA utilisés par certains outils. L’usage des fonctions dépendant de ces fournisseurs est aussi soumis à leurs conditions et politiques de confidentialité.'],
          ['13. Exclusion de garanties', 'Le Service est fourni « tel quel » et « selon disponibilité », sans garantie d’aucune sorte, expresse ou implicite, y compris la qualité marchande, l’adéquation à un usage particulier et l’absence de contrefaçon. Nous ne garantissons pas que le Service soit ininterrompu ou sans erreur, ni que les fichiers convertis soient exacts ou adaptés à un usage précis. Vérifiez toujours les fichiers convertis avant de vous y fier.'],
          ['14. Limitation de responsabilité', 'Dans la mesure maximale permise par la loi, EverythingConvert et ses exploitants ne sauraient être tenus responsables de dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de perte de données, perte de profits ou interruption d’activité liés à votre usage du Service. Dans la mesure maximale permise par la loi, notre responsabilité totale pour toute réclamation liée au Service n’excédera pas le montant le plus élevé entre ce que vous nous avez payé durant les trois mois précédant la réclamation et 50 USD.'],
          ['15. Indemnisation', 'Vous acceptez d’indemniser et de dégager de toute responsabilité EverythingConvert et ses exploitants contre les réclamations, dommages et frais découlant de votre usage abusif du Service, de votre contenu ou de votre violation de ces conditions, de la loi ou des droits de tiers.'],
          ['16. Suspension et résiliation', 'Nous pouvons suspendre, restreindre ou résilier l’accès, avec ou sans préavis, si nous estimons raisonnablement que vous avez enfreint ces conditions, ou pour protéger le Service, d’autres utilisateurs ou des tiers. Vous pouvez cesser d’utiliser le Service à tout moment. Les clauses qui par nature doivent survivre (exclusion de garanties, limitation de responsabilité, indemnisation) continuent de s’appliquer.'],
          ['17. Modifications des conditions', 'Nous pouvons mettre à jour ces conditions à mesure que le Service évolue. En cas de changement important, nous mettrons à jour la date « Dernière mise à jour » et, le cas échéant, fournirons un avis supplémentaire. Continuer à utiliser le Service après l’entrée en vigueur vaut acceptation.'],
          ['18. Droit applicable et litiges', 'Ces conditions sont régies par le droit de la République de Corée, sans égard aux règles de conflit de lois. Les litiges relèvent des tribunaux compétents du lieu de l’exploitant, sauf disposition contraire impérative du droit de la consommation de votre pays de résidence.'],
          ['19. Divisibilité', 'Si une clause de ces conditions est jugée inapplicable, les autres restent pleinement en vigueur, et la clause concernée s’applique dans la mesure maximale permise par la loi.'],
          ['20. Contact', 'Les questions sur ces conditions peuvent être envoyées via la page de contact.'],
        ]),
      },
    },
    'security.html': {
      title: { en: 'Security and Compliance - EverythingConvert', ko: '보안 및 규정 준수 - EverythingConvert', de: 'Sicherheit und Compliance - EverythingConvert', es: 'Seguridad y cumplimiento - EverythingConvert', fr: 'Sécurité et conformité - EverythingConvert' },
      content: {
        en: legal('Security', 'Security and Compliance', 'This page explains our security model, how we handle data, the third-party platforms we use, and the controls we plan to strengthen as EverythingConvert grows.', 'Last updated: June 12, 2026', [
          ['1. Our Security Approach', 'We design EverythingConvert around data minimization: we try to collect and keep as little data as possible, and where practical we process files directly in your browser so they never leave your device.'],
          ['2. Browser-Based Processing', 'Many conversion tools run locally in your browser using JavaScript libraries. This keeps files on your device, but performance and reliability depend on your device, browser, available memory, file size, and the libraries loaded by the page.'],
          ['3. Encryption in Transit and at Rest', 'Traffic to and from the Service is served over HTTPS/TLS. Data stored by our providers (such as account records and temporary AI results) is held on infrastructure that supports encryption at rest. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.'],
          ['4. Account Security', 'Authentication and profile data are handled by Supabase, including support for Google sign-in. Access to account and administrative features is protected with authentication, role checks, and row-level security. You are responsible for keeping your own credentials secure.'],
          ['5. Payment Security', 'Payments use Stripe-hosted checkout. Full card numbers are entered on Stripe and are not seen or stored by EverythingConvert, which reduces our exposure to payment card data. Stripe maintains its own PCI DSS compliance.'],
          ['6. AI Tools and Data Handling', 'Some AI tools send only the input needed — such as extracted PDF text, an uploaded image, or an audio file — to a secure server function and then to the relevant AI provider to produce your result. This data is used only to generate your result and is not used by us to train models.'],
          ['7. Data Retention and Deletion', 'We keep data only as long as needed. Temporary AI job files and results are deleted automatically shortly after processing (typically within 24 hours). Usage counters store limited, often hashed, identifiers to enforce free limits. Account data is kept while your account is active and is removed on request or after account deletion, subject to legal requirements.'],
          ['8. Sub-processors', 'To run the Service we rely on trusted providers, which may include Supabase (authentication, database, storage), Stripe (payments), Cloudflare (hosting, delivery, and serverless functions), AI providers used by specific tools (such as OpenAI), and analytics and advertising providers (such as Google). Each processes only the data needed for its function.'],
          ['9. Infrastructure', 'Hosting and edge platforms provide delivery, HTTPS, logging, and protection features. We remain responsible for our application code, configuration, secrets management, and access controls.'],
          ['10. Your Privacy Rights', 'Depending on where you live, you may have rights to access, correct, export, or delete your personal data. You can exercise these rights, or ask how your data is handled, through the contact page. Our Privacy Policy describes data handling in more detail.'],
          ['11. Data Breach Notification', 'If we become aware of a security incident affecting your personal data, we will take reasonable steps to investigate and contain it, and will notify affected users and, where required, the relevant authorities, in line with applicable law.'],
          ['12. Compliance Posture', 'EverythingConvert does not currently claim independent SOC 2, ISO 27001, HIPAA, or PCI certification for the entire service. Certifications held by our providers cover their own platforms and do not automatically certify EverythingConvert. We aim to strengthen controls as the Service grows.'],
          ['13. Responsible Disclosure', 'If you find a potential security issue, please contact us with the affected URL, steps to reproduce, and possible impact. Please do not access, modify, or delete data that is not yours, and give us a reasonable opportunity to respond before any public disclosure.'],
          ['14. Contact', 'Security questions and reports can be sent through the contact page.'],
        ]),
        ko: legal('보안', '보안 및 규정 준수', '이 페이지는 EverythingConvert의 보안 모델, 데이터 처리 방식, 사용하는 외부 플랫폼, 그리고 서비스 성장에 따라 강화할 보안 관리 항목을 설명합니다.', '최종 업데이트: 2026년 6월 12일', [
          ['1. 보안 접근 방식', 'EverythingConvert는 데이터 최소화를 기본 원칙으로 설계합니다. 가능한 한 적은 데이터만 수집·보관하며, 실행 가능한 경우 변환 작업을 브라우저에서 직접 처리하여 파일이 기기를 벗어나지 않도록 합니다.'],
          ['2. 브라우저 기반 처리', '많은 변환 도구가 JavaScript 라이브러리를 이용해 브라우저에서 로컬로 실행됩니다. 이렇게 하면 파일이 기기에 머무르지만, 성능과 안정성은 사용자의 기기, 브라우저, 가용 메모리, 파일 크기, 페이지가 불러오는 라이브러리에 따라 달라집니다.'],
          ['3. 전송 및 저장 구간 암호화', '서비스와의 모든 통신은 HTTPS/TLS로 제공됩니다. 제공자가 저장하는 데이터(계정 정보, 임시 AI 결과물 등)는 저장 시 암호화를 지원하는 인프라에 보관됩니다. 다만 어떠한 전송·저장 방식도 완벽하게 안전하지는 않으므로 절대적인 보안을 보장할 수는 없습니다.'],
          ['4. 계정 보안', '인증과 프로필 데이터는 Google 로그인 지원을 포함해 Supabase가 처리합니다. 계정 기능과 관리자 기능 접근은 인증, 역할 확인, Row Level Security로 보호됩니다. 본인의 로그인 정보를 안전하게 관리할 책임은 사용자에게 있습니다.'],
          ['5. 결제 보안', '결제는 Stripe Checkout을 사용합니다. 전체 카드 번호는 Stripe에서 입력되며 EverythingConvert가 보거나 저장하지 않으므로 결제 카드 데이터 노출 범위가 줄어듭니다. Stripe는 자체적으로 PCI DSS를 준수합니다.'],
          ['6. AI 도구와 데이터 처리', '일부 AI 도구는 결과물 생성에 필요한 입력(추출된 PDF 텍스트, 업로드한 이미지, 오디오 파일 등)만 보안 서버 함수로 보낸 뒤 해당 AI 제공자에게 전달합니다. 이 데이터는 결과물 생성에만 사용되며, 당사가 모델 학습에 사용하지 않습니다.'],
          ['7. 데이터 보관 및 삭제', '데이터는 필요한 기간만 보관합니다. 임시 AI 작업 파일과 결과물은 처리 후 보통 24시간 이내에 자동 삭제됩니다. 사용량 카운터는 무료 한도 적용을 위해 제한적이며 대개 해시 처리된 식별자만 저장합니다. 계정 데이터는 계정이 활성 상태인 동안 보관되며, 요청 시 또는 계정 삭제 후 법령상 요구를 전제로 삭제됩니다.'],
          ['8. 하위 처리자', '서비스 운영을 위해 신뢰할 수 있는 제공자를 이용하며, 여기에는 Supabase(인증·데이터베이스·스토리지), Stripe(결제), Cloudflare(호스팅·전송·서버리스 함수), 특정 도구가 사용하는 AI 제공자(예: OpenAI), 분석·광고 제공자(예: Google)가 포함될 수 있습니다. 각 제공자는 자신의 기능에 필요한 데이터만 처리합니다.'],
          ['9. 인프라', '호스팅과 엣지 플랫폼은 전송, HTTPS, 로깅, 보호 기능을 제공합니다. 애플리케이션 코드, 설정, 비밀키 관리, 접근 제어에 대한 책임은 당사에 있습니다.'],
          ['10. 이용자의 개인정보 권리', '거주 지역에 따라 개인정보에 대한 열람, 정정, 이전(내보내기), 삭제를 요청할 권리가 있을 수 있습니다. 이러한 권리 행사나 데이터 처리에 대한 문의는 문의 페이지를 통해 할 수 있습니다. 데이터 처리에 대한 자세한 내용은 개인정보 처리방침에 설명되어 있습니다.'],
          ['11. 개인정보 침해 통지', '개인정보에 영향을 주는 보안 사고를 인지하면, 합리적인 조치를 통해 조사·억제하고 관련 법령에 따라 영향을 받는 이용자와 필요한 경우 관계 당국에 통지합니다.'],
          ['12. 규정 준수 상태', 'EverythingConvert는 현재 서비스 전체에 대해 독립적인 SOC 2, ISO 27001, HIPAA, PCI 인증을 주장하지 않습니다. 제공자가 보유한 인증은 해당 제공자의 플랫폼에 적용되며 EverythingConvert 전체를 자동으로 인증하지는 않습니다. 서비스 성장에 따라 관리 체계를 강화해 나갈 계획입니다.'],
          ['13. 보안 제보', '잠재적 보안 문제를 발견하면 영향을 받는 URL, 재현 단계, 가능한 영향을 포함해 문의 페이지로 알려 주세요. 본인 소유가 아닌 데이터에 접근·수정·삭제하지 마시고, 공개 전에 당사가 대응할 합리적인 기회를 주시기 바랍니다.'],
          ['14. 문의', '보안 관련 질문과 제보는 문의 페이지를 통해 보내 주세요.'],
        ]),
        de: legal('Sicherheit', 'Sicherheit und Compliance', 'Diese Seite erklärt unser Sicherheitsmodell, den Umgang mit Daten, die genutzten Drittanbieter und die Kontrollen, die wir mit dem Wachstum von EverythingConvert ausbauen wollen.', 'Zuletzt aktualisiert: 12. Juni 2026', [
          ['1. Unser Sicherheitsansatz', 'Wir gestalten EverythingConvert nach dem Prinzip der Datenminimierung: Wir erfassen und speichern so wenig Daten wie möglich und verarbeiten Dateien, wo praktikabel, direkt im Browser, sodass sie Ihr Gerät nicht verlassen.'],
          ['2. Browserbasierte Verarbeitung', 'Viele Tools laufen lokal im Browser über JavaScript-Bibliotheken. Dadurch bleiben Dateien auf Ihrem Gerät; Leistung und Zuverlässigkeit hängen jedoch von Gerät, Browser, Speicher, Dateigröße und geladenen Bibliotheken ab.'],
          ['3. Verschlüsselung bei Übertragung und Speicherung', 'Der Datenverkehr erfolgt über HTTPS/TLS. Von unseren Anbietern gespeicherte Daten (etwa Kontodaten und temporäre KI-Ergebnisse) liegen auf Infrastruktur, die Verschlüsselung im Ruhezustand unterstützt. Keine Übertragungs- oder Speichermethode ist vollkommen sicher, daher können wir keine absolute Sicherheit garantieren.'],
          ['4. Kontosicherheit', 'Authentifizierung und Profildaten werden von Supabase verarbeitet, einschließlich Google-Anmeldung. Der Zugriff auf Konto- und Adminfunktionen ist durch Authentifizierung, Rollenprüfungen und Row-Level-Security geschützt. Für die Sicherheit Ihrer Zugangsdaten sind Sie selbst verantwortlich.'],
          ['5. Zahlungssicherheit', 'Zahlungen laufen über Stripe-Checkout. Vollständige Kartennummern werden bei Stripe eingegeben und von EverythingConvert weder eingesehen noch gespeichert, was unsere Exposition gegenüber Kartendaten reduziert. Stripe ist selbst PCI-DSS-konform.'],
          ['6. KI-Tools und Datenverarbeitung', 'Einige KI-Tools senden nur die nötige Eingabe — etwa extrahierten PDF-Text, ein hochgeladenes Bild oder eine Audiodatei — an eine sichere Serverfunktion und dann an den jeweiligen KI-Anbieter, um Ihr Ergebnis zu erzeugen. Diese Daten dienen nur der Ergebniserstellung und werden von uns nicht zum Training von Modellen verwendet.'],
          ['7. Aufbewahrung und Löschung', 'Wir speichern Daten nur so lange wie nötig. Temporäre KI-Dateien und -Ergebnisse werden kurz nach der Verarbeitung automatisch gelöscht (in der Regel innerhalb von 24 Stunden). Nutzungszähler speichern begrenzte, oft gehashte Kennungen zur Durchsetzung der Freigrenzen. Kontodaten bleiben erhalten, solange Ihr Konto aktiv ist, und werden auf Anfrage oder nach Kontolöschung im Rahmen der gesetzlichen Vorgaben entfernt.'],
          ['8. Unterauftragsverarbeiter', 'Für den Betrieb nutzen wir vertrauenswürdige Anbieter, darunter ggf. Supabase (Authentifizierung, Datenbank, Speicher), Stripe (Zahlungen), Cloudflare (Hosting, Auslieferung, Serverless-Funktionen), KI-Anbieter einzelner Tools (z. B. OpenAI) sowie Analyse- und Werbeanbieter (z. B. Google). Jeder verarbeitet nur die für seine Funktion nötigen Daten.'],
          ['9. Infrastruktur', 'Hosting- und Edge-Plattformen liefern Auslieferung, HTTPS, Protokollierung und Schutzfunktionen. Für unseren Anwendungscode, die Konfiguration, das Secrets-Management und die Zugriffskontrollen bleiben wir verantwortlich.'],
          ['10. Ihre Datenschutzrechte', 'Je nach Wohnort haben Sie möglicherweise Rechte auf Auskunft, Berichtigung, Export oder Löschung Ihrer personenbezogenen Daten. Sie können diese Rechte ausüben oder Fragen zur Datenverarbeitung über die Kontaktseite stellen. Unsere Datenschutzerklärung beschreibt die Verarbeitung näher.'],
          ['11. Meldung von Datenschutzverletzungen', 'Werden wir auf einen Sicherheitsvorfall aufmerksam, der Ihre personenbezogenen Daten betrifft, ergreifen wir angemessene Maßnahmen zur Untersuchung und Eindämmung und benachrichtigen betroffene Nutzer sowie, sofern erforderlich, die zuständigen Behörden gemäß geltendem Recht.'],
          ['12. Compliance-Status', 'EverythingConvert beansprucht derzeit keine eigene SOC 2-, ISO 27001-, HIPAA- oder PCI-Zertifizierung für den gesamten Dienst. Zertifizierungen unserer Anbieter betreffen deren eigene Plattformen und zertifizieren EverythingConvert nicht automatisch. Wir wollen die Kontrollen mit dem Wachstum ausbauen.'],
          ['13. Verantwortungsvolle Offenlegung', 'Wenn Sie ein mögliches Sicherheitsproblem finden, melden Sie es uns bitte mit betroffener URL, Reproduktionsschritten und möglicher Auswirkung. Greifen Sie nicht auf fremde Daten zu, ändern oder löschen Sie diese nicht, und geben Sie uns vor einer Veröffentlichung eine angemessene Gelegenheit zur Reaktion.'],
          ['14. Kontakt', 'Sicherheitsfragen und Meldungen können über die Kontaktseite gesendet werden.'],
        ]),
        es: legal('Seguridad', 'Seguridad y cumplimiento', 'Esta página explica nuestro modelo de seguridad, cómo tratamos los datos, los proveedores externos que usamos y los controles que planeamos reforzar a medida que EverythingConvert crece.', 'Última actualización: 12 de junio de 2026', [
          ['1. Nuestro enfoque de seguridad', 'Diseñamos EverythingConvert en torno a la minimización de datos: intentamos recopilar y conservar la menor cantidad posible y, cuando es práctico, procesamos los archivos directamente en tu navegador para que no salgan de tu dispositivo.'],
          ['2. Procesamiento en el navegador', 'Muchas herramientas se ejecutan localmente en tu navegador con bibliotecas JavaScript. Esto mantiene los archivos en tu dispositivo, pero el rendimiento y la fiabilidad dependen del dispositivo, navegador, memoria disponible, tamaño del archivo y bibliotecas cargadas.'],
          ['3. Cifrado en tránsito y en reposo', 'El tráfico hacia y desde el Servicio se sirve por HTTPS/TLS. Los datos almacenados por nuestros proveedores (como registros de cuenta y resultados temporales de IA) se guardan en infraestructura que admite cifrado en reposo. Ningún método de transmisión o almacenamiento es totalmente seguro, por lo que no podemos garantizar seguridad absoluta.'],
          ['4. Seguridad de la cuenta', 'La autenticación y los datos de perfil los gestiona Supabase, incluido el inicio de sesión con Google. El acceso a las funciones de cuenta y administración se protege con autenticación, comprobación de roles y seguridad a nivel de fila. Eres responsable de mantener seguras tus credenciales.'],
          ['5. Seguridad de los pagos', 'Los pagos usan el checkout alojado por Stripe. Los números de tarjeta completos se introducen en Stripe y EverythingConvert no los ve ni los almacena, lo que reduce nuestra exposición a los datos de tarjeta. Stripe mantiene su propio cumplimiento PCI DSS.'],
          ['6. Herramientas de IA y tratamiento de datos', 'Algunas herramientas de IA envían solo la entrada necesaria —como texto extraído de un PDF, una imagen subida o un archivo de audio— a una función de servidor segura y luego al proveedor de IA correspondiente para generar tu resultado. Estos datos se usan solo para generar tu resultado y no los usamos para entrenar modelos.'],
          ['7. Conservación y eliminación de datos', 'Conservamos los datos solo el tiempo necesario. Los archivos y resultados temporales de IA se eliminan automáticamente poco después del procesamiento (normalmente en 24 horas). Los contadores de uso almacenan identificadores limitados, a menudo cifrados, para aplicar los límites gratuitos. Los datos de cuenta se conservan mientras la cuenta esté activa y se eliminan a petición o tras eliminar la cuenta, sujeto a requisitos legales.'],
          ['8. Subencargados', 'Para operar el Servicio usamos proveedores de confianza, que pueden incluir Supabase (autenticación, base de datos, almacenamiento), Stripe (pagos), Cloudflare (alojamiento, entrega y funciones serverless), proveedores de IA de herramientas concretas (como OpenAI) y proveedores de analítica y publicidad (como Google). Cada uno procesa solo los datos necesarios para su función.'],
          ['9. Infraestructura', 'Las plataformas de alojamiento y edge proporcionan entrega, HTTPS, registros y funciones de protección. Seguimos siendo responsables de nuestro código, configuración, gestión de secretos y controles de acceso.'],
          ['10. Tus derechos de privacidad', 'Según dónde vivas, puedes tener derecho a acceder, corregir, exportar o eliminar tus datos personales. Puedes ejercer estos derechos, o preguntar cómo se tratan tus datos, a través de la página de contacto. Nuestra política de privacidad describe el tratamiento con más detalle.'],
          ['11. Notificación de brechas', 'Si detectamos un incidente de seguridad que afecte a tus datos personales, tomaremos medidas razonables para investigarlo y contenerlo, y notificaremos a los usuarios afectados y, cuando se exija, a las autoridades competentes, conforme a la ley aplicable.'],
          ['12. Postura de cumplimiento', 'EverythingConvert no afirma actualmente tener certificación independiente SOC 2, ISO 27001, HIPAA o PCI para todo el servicio. Las certificaciones de nuestros proveedores cubren sus propias plataformas y no certifican automáticamente EverythingConvert. Buscamos reforzar los controles a medida que el Servicio crece.'],
          ['13. Divulgación responsable', 'Si encuentras un posible problema de seguridad, contáctanos con la URL afectada, los pasos para reproducirlo y el impacto posible. No accedas, modifiques ni elimines datos que no sean tuyos, y danos una oportunidad razonable de responder antes de cualquier divulgación pública.'],
          ['14. Contacto', 'Las preguntas y reportes de seguridad pueden enviarse desde la página de contacto.'],
        ]),
        fr: legal('Sécurité', 'Sécurité et conformité', 'Cette page explique notre modèle de sécurité, notre traitement des données, les prestataires tiers que nous utilisons et les contrôles que nous prévoyons de renforcer à mesure qu’EverythingConvert se développe.', 'Dernière mise à jour : 12 juin 2026', [
          ['1. Notre approche de la sécurité', 'Nous concevons EverythingConvert autour de la minimisation des données : nous collectons et conservons le moins de données possible et, lorsque c’est faisable, traitons les fichiers directement dans votre navigateur afin qu’ils ne quittent pas votre appareil.'],
          ['2. Traitement dans le navigateur', 'De nombreux outils s’exécutent localement dans votre navigateur via des bibliothèques JavaScript. Les fichiers restent ainsi sur votre appareil, mais la performance et la fiabilité dépendent de l’appareil, du navigateur, de la mémoire disponible, de la taille du fichier et des bibliothèques chargées.'],
          ['3. Chiffrement en transit et au repos', 'Le trafic vers et depuis le Service est servi en HTTPS/TLS. Les données stockées par nos prestataires (comme les enregistrements de compte et les résultats IA temporaires) sont hébergées sur une infrastructure prenant en charge le chiffrement au repos. Aucune méthode de transmission ou de stockage n’est totalement sûre, nous ne pouvons donc garantir une sécurité absolue.'],
          ['4. Sécurité des comptes', 'L’authentification et les données de profil sont gérées par Supabase, y compris la connexion Google. L’accès aux fonctions de compte et d’administration est protégé par authentification, vérification des rôles et sécurité au niveau des lignes. Vous êtes responsable de la sécurité de vos identifiants.'],
          ['5. Sécurité des paiements', 'Les paiements utilisent le checkout hébergé par Stripe. Les numéros de carte complets sont saisis chez Stripe et ne sont ni vus ni stockés par EverythingConvert, ce qui réduit notre exposition aux données de carte. Stripe maintient sa propre conformité PCI DSS.'],
          ['6. Outils IA et traitement des données', 'Certains outils IA n’envoient que les données nécessaires — texte extrait d’un PDF, image téléversée ou fichier audio — à une fonction serveur sécurisée puis au fournisseur d’IA concerné pour produire votre résultat. Ces données servent uniquement à générer votre résultat et ne sont pas utilisées par nous pour entraîner des modèles.'],
          ['7. Conservation et suppression', 'Nous conservons les données seulement le temps nécessaire. Les fichiers et résultats IA temporaires sont supprimés automatiquement peu après le traitement (généralement sous 24 heures). Les compteurs d’usage stockent des identifiants limités, souvent hachés, pour appliquer les limites gratuites. Les données de compte sont conservées tant que le compte est actif et supprimées sur demande ou après suppression du compte, sous réserve des obligations légales.'],
          ['8. Sous-traitants', 'Pour exploiter le Service, nous faisons appel à des prestataires de confiance pouvant inclure Supabase (authentification, base de données, stockage), Stripe (paiements), Cloudflare (hébergement, diffusion, fonctions serverless), des fournisseurs d’IA de certains outils (comme OpenAI) et des fournisseurs d’analyse et de publicité (comme Google). Chacun ne traite que les données nécessaires à sa fonction.'],
          ['9. Infrastructure', 'Les plateformes d’hébergement et edge fournissent la diffusion, le HTTPS, la journalisation et des fonctions de protection. Nous restons responsables de notre code applicatif, de la configuration, de la gestion des secrets et des contrôles d’accès.'],
          ['10. Vos droits sur les données', 'Selon votre lieu de résidence, vous pouvez avoir le droit d’accéder à vos données personnelles, de les corriger, de les exporter ou de les supprimer. Vous pouvez exercer ces droits, ou poser des questions sur le traitement, via la page de contact. Notre politique de confidentialité décrit le traitement plus en détail.'],
          ['11. Notification de violation', 'Si nous prenons connaissance d’un incident de sécurité affectant vos données personnelles, nous prendrons des mesures raisonnables pour enquêter et le contenir, et informerons les utilisateurs concernés et, le cas échéant, les autorités compétentes, conformément au droit applicable.'],
          ['12. Posture de conformité', 'EverythingConvert ne revendique pas actuellement de certification indépendante SOC 2, ISO 27001, HIPAA ou PCI pour l’ensemble du service. Les certifications de nos prestataires couvrent leurs propres plateformes et ne certifient pas automatiquement EverythingConvert. Nous comptons renforcer les contrôles à mesure que le Service grandit.'],
          ['13. Divulgation responsable', 'Si vous trouvez un problème de sécurité potentiel, contactez-nous avec l’URL concernée, les étapes de reproduction et l’impact possible. N’accédez pas, ne modifiez pas et ne supprimez pas des données qui ne sont pas les vôtres, et laissez-nous une occasion raisonnable de répondre avant toute divulgation publique.'],
          ['14. Contact', 'Les questions et signalements de sécurité peuvent être envoyés via la page de contact.'],
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
