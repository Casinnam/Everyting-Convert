(function () {
  const labels = {
    en: 'English',
    ko: '한국어',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
  };

  const common = {
    footerCopyright: {
      en: '© EverythingConvert.com All rights reserved (2026)',
      ko: '© EverythingConvert.com 모든 권리 보유 (2026)',
      de: '© EverythingConvert.com Alle Rechte vorbehalten (2026)',
      es: '© EverythingConvert.com Todos los derechos reservados (2026)',
      fr: '© EverythingConvert.com Tous droits réservés (2026)',
    },
    privacy: { en: 'Privacy', ko: '개인정보 처리방침', de: 'Datenschutz', es: 'Privacidad', fr: 'Confidentialité' },
    terms: { en: 'Terms', ko: '이용약관', de: 'Bedingungen', es: 'Términos', fr: 'Conditions' },
    security: { en: 'Security and Compliance', ko: '보안 및 규정 준수', de: 'Sicherheit und Compliance', es: 'Seguridad y cumplimiento', fr: 'Sécurité et conformité' },
    contact: { en: 'Contact', ko: '문의', de: 'Kontakt', es: 'Contacto', fr: 'Contact' },
    about: { en: 'About Us', ko: '회사 소개', de: 'Über uns', es: 'Sobre nosotros', fr: 'À propos' },
    donate: { en: 'Donate', ko: '후원', de: 'Spenden', es: 'Donar', fr: 'Faire un don' },
    faq: { en: 'Frequently asked questions', ko: '자주 묻는 질문', de: 'Häufige Fragen', es: 'Preguntas frecuentes', fr: 'Questions fréquentes' },
  };

  const pageText = {
    'pdf-summary': {
      '.page-hero .badge': { en: 'AI TOOL • PDF SUMMARY', ko: 'AI 도구 • PDF 요약', de: 'KI-Tool • PDF-Zusammenfassung', es: 'Herramienta IA • Resumen PDF', fr: 'Outil IA • Résumé PDF' },
      '.page-hero h1': { en: 'PDF Summary', ko: 'PDF 요약', de: 'PDF-Zusammenfassung', es: 'Resumen de PDF', fr: 'Résumé PDF' },
      '.page-hero p': {
        en: 'Upload a text-based PDF. Keep the original document visible on the left and create a simple AI outline on the right.',
        ko: '텍스트가 들어 있는 PDF를 업로드하세요. 왼쪽에서 원본을 보면서 오른쪽에 간단한 AI 요약을 만들 수 있습니다.',
        de: 'Laden Sie ein textbasiertes PDF hoch. Links bleibt das Original sichtbar, rechts entsteht eine einfache KI-Übersicht.',
        es: 'Sube un PDF con texto. Mantén el original a la izquierda y crea un resumen simple con IA a la derecha.',
        fr: 'Importez un PDF contenant du texte. Gardez l’original à gauche et créez un résumé IA simple à droite.',
      },
      '.summary-panel .panel-head h2': { en: 'Simple Summary', ko: '간단 요약', de: 'Kurze Zusammenfassung', es: 'Resumen simple', fr: 'Résumé simple' },
      '#summarizeBtn': { en: 'Generate summary', ko: '요약 생성', de: 'Zusammenfassung erstellen', es: 'Generar resumen', fr: 'Générer le résumé' },
      '#downloadSummaryBtn': { en: 'Download', ko: '다운로드', de: 'Herunterladen', es: 'Descargar', fr: 'Télécharger' },
    },
    transcription: {
      '.page-hero .badge': { en: 'AI TOOL • PAY-AS-YOU-GO', ko: 'AI 도구 • 단건 결제', de: 'KI-Tool • Einmalzahlung', es: 'Herramienta IA • Pago por uso', fr: 'Outil IA • Paiement à l’usage' },
      '.page-hero h1': { en: 'Audio & Video Transcription', ko: '오디오 및 비디오 텍스트 변환', de: 'Audio- und Video-Transkription', es: 'Transcripción de audio y video', fr: 'Transcription audio et vidéo' },
      '.page-hero p': {
        en: 'Upload an audio or video file and get an accurate text transcript + SRT subtitle file in seconds.',
        ko: '오디오나 비디오 파일을 업로드하면 텍스트 기록과 SRT 자막 파일을 만들 수 있습니다.',
        de: 'Laden Sie Audio oder Video hoch und erhalten Sie ein Transkript plus SRT-Untertitel.',
        es: 'Sube un archivo de audio o video y obtén transcripción y subtítulos SRT.',
        fr: 'Importez un fichier audio ou vidéo et obtenez une transcription avec sous-titres SRT.',
      },
      '#transcribeBtn': { en: '▶ Transcribe (free preview)', ko: '▶ 텍스트 변환 (무료 미리보기)', de: '▶ Transkribieren (kostenlose Vorschau)', es: '▶ Transcribir (vista previa gratis)', fr: '▶ Transcrire (aperçu gratuit)' },
      '.faq h2': common.faq,
    },
    'background-remover': {
      '.page-hero .badge': { en: 'AI TOOL • PAY-AS-YOU-GO', ko: 'AI 도구 • 단건 결제', de: 'KI-Tool • Einmalzahlung', es: 'Herramienta IA • Pago por uso', fr: 'Outil IA • Paiement à l’usage' },
      '.page-hero h1': { en: 'Background Remover', ko: '배경 제거', de: 'Hintergrund entfernen', es: 'Eliminar fondo', fr: 'Suppression d’arrière-plan' },
      '.page-hero p': {
        en: 'AI-powered background removal in seconds. Get a clean, transparent PNG ready for any project.',
        ko: 'AI로 몇 초 안에 배경을 제거하고 투명 PNG 결과를 받을 수 있습니다.',
        de: 'Entfernen Sie Hintergründe per KI und erhalten Sie eine transparente PNG-Datei.',
        es: 'Elimina fondos con IA y descarga un PNG transparente limpio.',
        fr: 'Supprimez l’arrière-plan avec l’IA et obtenez un PNG transparent.',
      },
      '#processBtn': { en: '✨ Remove background (free preview)', ko: '✨ 배경 제거 (무료 미리보기)', de: '✨ Hintergrund entfernen (Vorschau)', es: '✨ Eliminar fondo (vista previa)', fr: '✨ Supprimer l’arrière-plan (aperçu)' },
      '.faq h2': common.faq,
    },
    'id-photo': {
      '.page-hero .badge': { en: 'AI TOOL • PAY-AS-YOU-GO', ko: 'AI 도구 • 단건 결제', de: 'KI-Tool • Einmalzahlung', es: 'Herramienta IA • Pago por uso', fr: 'Outil IA • Paiement à l’usage' },
      '.page-hero h1': { en: 'ID / Passport Photo Maker', ko: '증명사진 / 여권사진 만들기', de: 'Passfoto-Generator', es: 'Creador de foto de identidad', fr: 'Créateur de photo d’identité' },
      '.page-hero .subtitle': {
        en: 'Regulation-compliant ID photos made by AI. Background removal, crop, and resize — no face retouching.',
        ko: 'AI로 배경 제거, 자르기, 크기 조정을 처리합니다. 얼굴 보정은 하지 않습니다.',
        de: 'ID-Fotos per KI: Hintergrund entfernen, zuschneiden und skalieren, ohne Gesichtsretusche.',
        es: 'Fotos de identidad con IA: fondo, recorte y tamaño, sin retoque facial.',
        fr: 'Photos d’identité avec IA : fond, recadrage et taille, sans retouche du visage.',
      },
      '#processBtn': { en: '👤 Create ID photo (free preview)', ko: '👤 증명사진 만들기 (무료 미리보기)', de: '👤 Passfoto erstellen (Vorschau)', es: '👤 Crear foto (vista previa)', fr: '👤 Créer la photo (aperçu)' },
      '.specs-table h2': { en: 'Supported specifications', ko: '지원 규격', de: 'Unterstützte Vorgaben', es: 'Especificaciones compatibles', fr: 'Formats pris en charge' },
      '.faq h2': common.faq,
    },
  };

  function getPageKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/pdf-summary/')) return 'pdf-summary';
    if (path.includes('/transcription/')) return 'transcription';
    if (path.includes('/background-remover/')) return 'background-remover';
    if (path.includes('/id-photo/')) return 'id-photo';
    return '';
  }

  function getLanguage() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('lang');
    if (labels[fromUrl]) return fromUrl;
    try {
      const saved = localStorage.getItem('everything_convert_language');
      if (labels[saved]) return saved;
    } catch (error) {
      return 'en';
    }
    return 'en';
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function applyAiLanguage(language = getLanguage()) {
    const key = getPageKey();
    const map = pageText[key] || {};
    document.querySelectorAll('.subtitle-ko').forEach((node) => {
      node.style.display = 'none';
    });
    Object.entries(map).forEach(([selector, values]) => setText(selector, values[language] || values.en));
    document.querySelectorAll('[data-language-current]').forEach((node) => {
      node.textContent = labels[language] || labels.en;
    });
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.classList.toggle('active', button.dataset.language === language);
    });
  }

  function installFooter() {
    const oldFooter = document.querySelector('footer');
    if (!oldFooter) return;
    oldFooter.className = 'site-footer';
    oldFooter.innerHTML = `
      <div class="footer-legal-row">
        <a href="../../about.html">${common.about.en}</a>
        <a href="https://donate.stripe.com/9B6eVc4Rt9yo4m75nwdwc00" target="_blank" rel="noopener">${common.donate.en}</a>
        <a href="../../privacy.html">${common.privacy.en}</a>
        <a href="../../terms.html">${common.terms.en}</a>
        <a href="../../security.html">${common.security.en}</a>
        <a href="../../contact.html">${common.contact.en}</a>
      </div>
      <div class="footer-bottom">
        <div class="footer-logo"><img class="brand-icon" src="../../favicon.svg" alt="" width="28" height="28"><span>EverythingConvert</span></div>
        <p>${common.footerCopyright.en}</p>
        <div class="language-menu">
          <button class="language-toggle" type="button" aria-expanded="false"><i class="fa-solid fa-globe"></i><span data-language-current>English</span></button>
          <div class="language-dropdown">
            <button type="button" data-language="en">English</button>
            <button type="button" data-language="ko">한국어</button>
            <button type="button" data-language="de">Deutsch</button>
            <button type="button" data-language="es">Español</button>
            <button type="button" data-language="fr">Français</button>
          </div>
        </div>
      </div>
    `;
  }

  function translateFooter(language) {
    const links = document.querySelectorAll('.site-footer .footer-legal-row a');
    const keys = ['about', 'donate', 'privacy', 'terms', 'security', 'contact'];
    links.forEach((link, index) => {
      const values = common[keys[index]];
      if (values) link.textContent = values[language] || values.en;
    });
    const copyright = document.querySelector('.site-footer .footer-bottom p');
    if (copyright) copyright.textContent = common.footerCopyright[language] || common.footerCopyright.en;
  }

  function applyAll(language = getLanguage()) {
    applyAiLanguage(language);
    translateFooter(language);
  }

  document.addEventListener('DOMContentLoaded', () => {
    installFooter();
    applyAll();
    [100, 500, 1200].forEach((delay) => window.setTimeout(() => applyAll(), delay));
  });

  window.addEventListener('everything-language-change', (event) => {
    const language = event?.detail?.language || getLanguage();
    applyAll(language);
  });

})();
