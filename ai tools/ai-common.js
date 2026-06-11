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

  /* ── CSS-selector-based translations (legacy, still used for hero h1 etc.) ── */
  const pageText = {
    'pdf-summary': {
      '.page-hero h1': { en: 'PDF Summary', ko: 'PDF 요약', de: 'PDF-Zusammenfassung', es: 'Resumen de PDF', fr: 'Résumé PDF' },
      '#summarizeBtn': { en: 'Generate summary', ko: '요약 생성', de: 'Zusammenfassung erstellen', es: 'Generar resumen', fr: 'Générer le résumé' },
      '#changeFileBtn': { en: 'Change PDF', ko: 'PDF 변경', de: 'PDF ändern', es: 'Cambiar PDF', fr: 'Changer le PDF' },
    },
    transcription: {
      '.page-hero h1': { en: 'Audio & Video Transcription', ko: '오디오 및 비디오 텍스트 변환', de: 'Audio- und Video-Transkription', es: 'Transcripción de audio y video', fr: 'Transcription audio et vidéo' },
      '#transcribeBtn': { en: '▶ Transcribe (free preview)', ko: '▶ 텍스트 변환 (무료 미리보기)', de: '▶ Transkribieren (kostenlose Vorschau)', es: '▶ Transcribir (vista previa gratis)', fr: '▶ Transcrire (aperçu gratuit)' },
      '.faq h2': common.faq,
    },
    'background-remover': {
      '.page-hero h1': { en: 'Background Remover', ko: '배경 제거', de: 'Hintergrund entfernen', es: 'Eliminar fondo', fr: 'Suppression d\'arrière-plan' },
      '#processBtn': { en: '✨ Remove background (free preview)', ko: '✨ 배경 제거 (무료 미리보기)', de: '✨ Hintergrund entfernen (Vorschau)', es: '✨ Eliminar fondo (vista previa)', fr: '✨ Supprimer l\'arrière-plan (aperçu)' },
      '.faq h2': common.faq,
    },
    'id-photo': {
      '.page-hero h1': { en: 'ID / Passport Photo Maker', ko: '증명사진 / 여권사진 만들기', de: 'Passfoto-Generator', es: 'Creador de foto de identidad', fr: 'Créateur de photo d\'identité' },
      '.page-hero .subtitle': {
        en: 'Regulation-compliant ID photos made by AI. Background removal, crop, and resize — no face retouching.',
        ko: 'AI로 배경 제거, 자르기, 크기 조정을 처리합니다. 얼굴 보정은 하지 않습니다.',
        de: 'ID-Fotos per KI: Hintergrund entfernen, zuschneiden und skalieren, ohne Gesichtsretusche.',
        es: 'Fotos de identidad con IA: fondo, recorte y tamaño, sin retoque facial.',
        fr: 'Photos d\'identité avec IA : fond, recadrage et taille, sans retouche du visage.',
      },
      '#processBtn': { en: '👤 Create ID photo (free preview)', ko: '👤 증명사진 만들기 (무료 미리보기)', de: '👤 Passfoto erstellen (Vorschau)', es: '👤 Crear foto (vista previa)', fr: '👤 Créer la photo (aperçu)' },
      '.specs-table h2': { en: 'Supported specifications', ko: '지원 규격', de: 'Unterstützte Vorgaben', es: 'Especificaciones compatibles', fr: 'Formats pris en charge' },
      '.faq h2': common.faq,
    },
  };

  /* ── data-i18n translations (new system) ── */
  const i18n = {
    /* ─── PDF Summary ─── */
    psBadge: { en: 'AI PDF TOOL', ko: 'AI PDF 도구', de: 'KI-PDF-TOOL', es: 'HERRAMIENTA PDF IA', fr: 'OUTIL PDF IA' },
    psHeroDesc: {
      en: 'Upload a text-based PDF, keep the original document visible on the left, and create a simple AI outline on the right.',
      ko: '텍스트가 포함된 PDF를 업로드하세요. 왼쪽에서 원본을 보면서 오른쪽에 AI 요약을 생성할 수 있습니다.',
      de: 'Laden Sie ein textbasiertes PDF hoch. Links sehen Sie das Original, rechts erscheint eine KI-Zusammenfassung.',
      es: 'Sube un PDF con texto. Mantén el original a la izquierda y crea un resumen con IA a la derecha.',
      fr: 'Importez un PDF textuel. Gardez l\'original à gauche et créez un résumé IA à droite.',
    },
    psTranslateNote: {
      en: 'Select your language at the bottom of the page before generating a summary. The AI will summarize and translate any PDF into your chosen language automatically.',
      ko: '요약을 생성하기 전에 페이지 하단에서 원하는 언어를 선택하세요. AI가 어떤 언어의 PDF든 선택한 언어로 자동 번역하여 요약합니다.',
      de: 'Wählen Sie vor der Zusammenfassung Ihre Sprache unten auf der Seite. Die KI fasst jedes PDF zusammen und übersetzt es automatisch in Ihre Sprache.',
      es: 'Seleccione su idioma en la parte inferior de la página antes de generar un resumen. La IA resumirá y traducirá cualquier PDF a su idioma automáticamente.',
      fr: 'Sélectionnez votre langue en bas de la page avant de générer un résumé. L\'IA résumera et traduira tout PDF dans votre langue automatiquement.',
    },
    psOriginal: { en: 'Original PDF', ko: '원본 PDF', de: 'Original-PDF', es: 'PDF original', fr: 'PDF original' },
    psUploadHint: { en: 'Upload a PDF to preview it here', ko: 'PDF를 업로드하면 여기에 미리보기가 표시됩니다', de: 'PDF hochladen, um es hier anzuzeigen', es: 'Sube un PDF para previsualizarlo aquí', fr: 'Importez un PDF pour le prévisualiser ici' },
    psDrop: { en: 'Drop your PDF file here', ko: 'PDF 파일을 여기에 놓으세요', de: 'PDF-Datei hier ablegen', es: 'Suelta tu archivo PDF aquí', fr: 'Déposez votre fichier PDF ici' },
    psDropDesc: {
      en: 'or choose a file from your device. Text-based PDFs work best in this first version.',
      ko: '또는 기기에서 파일을 선택하세요. 텍스트 기반 PDF가 가장 잘 작동합니다.',
      de: 'oder wählen Sie eine Datei von Ihrem Gerät. Textbasierte PDFs funktionieren am besten.',
      es: 'o elige un archivo de tu dispositivo. Los PDFs basados en texto funcionan mejor.',
      fr: 'ou choisissez un fichier depuis votre appareil. Les PDF textuels fonctionnent le mieux.',
    },
    psSummaryTitle: { en: 'Simple Summary', ko: '간단 요약', de: 'Kurze Zusammenfassung', es: 'Resumen simple', fr: 'Résumé simple' },
    psDownload: { en: 'Download', ko: '다운로드', de: 'Herunterladen', es: 'Descargar', fr: 'Télécharger' },
    psNoSummary: { en: 'No summary yet', ko: '아직 요약이 없습니다', de: 'Noch keine Zusammenfassung', es: 'Aún sin resumen', fr: 'Pas encore de résumé' },
    psNoSummaryDesc: {
      en: 'Choose a text-based PDF and click Generate summary. The result will appear here as a short outline.',
      ko: '텍스트 기반 PDF를 선택하고 요약 생성을 클릭하세요. 결과가 여기에 표시됩니다.',
      de: 'Wählen Sie ein textbasiertes PDF und klicken Sie auf Zusammenfassung erstellen.',
      es: 'Elige un PDF con texto y haz clic en Generar resumen. El resultado aparecerá aquí.',
      fr: 'Choisissez un PDF textuel et cliquez sur Générer le résumé. Le résultat apparaîtra ici.',
    },
    psGuide1Title: { en: 'Best for readable PDFs', ko: '읽을 수 있는 PDF에 최적', de: 'Am besten für lesbare PDFs', es: 'Ideal para PDFs legibles', fr: 'Idéal pour les PDF lisibles' },
    psGuide1Desc: {
      en: 'Invoices, reports, contracts, statements, and text-based PDFs can usually be summarized quickly.',
      ko: '청구서, 보고서, 계약서, 명세서 등 텍스트 기반 PDF를 빠르게 요약할 수 있습니다.',
      de: 'Rechnungen, Berichte, Verträge und textbasierte PDFs lassen sich schnell zusammenfassen.',
      es: 'Facturas, informes, contratos y PDFs con texto se resumen rápidamente.',
      fr: 'Factures, rapports, contrats et PDF textuels peuvent être résumés rapidement.',
    },
    psGuide2Title: { en: 'OCR comes later', ko: 'OCR은 추후 지원', de: 'OCR kommt später', es: 'OCR próximamente', fr: 'OCR à venir' },
    psGuide2Desc: {
      en: 'Scanned PDFs are image files inside a PDF wrapper. They need OCR before AI summary can understand the text.',
      ko: '스캔된 PDF는 이미지 파일입니다. AI가 텍스트를 이해하려면 OCR이 필요합니다.',
      de: 'Gescannte PDFs sind Bilddateien. OCR wird benötigt, damit die KI den Text versteht.',
      es: 'Los PDFs escaneados son imágenes. Necesitan OCR para que la IA entienda el texto.',
      fr: 'Les PDF numérisés sont des images. L\'OCR est nécessaire pour que l\'IA comprenne le texte.',
    },
    psGuide3Title: { en: 'Always verify details', ko: '항상 세부 사항을 확인하세요', de: 'Details immer prüfen', es: 'Siempre verifica los detalles', fr: 'Vérifiez toujours les détails' },
    psGuide3Desc: {
      en: 'Use summaries as a reading aid. For legal, tax, medical, or financial decisions, check the original PDF.',
      ko: '요약은 읽기 보조 수단입니다. 법률, 세금, 의료, 재무 관련 결정은 반드시 원본 PDF를 확인하세요.',
      de: 'Zusammenfassungen dienen als Lesehilfe. Bei wichtigen Entscheidungen prüfen Sie das Original.',
      es: 'Use los resúmenes como ayuda. Para decisiones importantes, consulte el PDF original.',
      fr: 'Les résumés sont une aide à la lecture. Pour les décisions importantes, consultez le PDF original.',
    },
    psHowTitle: { en: 'How to summarize a PDF', ko: 'PDF를 요약하는 방법', de: 'So fassen Sie ein PDF zusammen', es: 'Cómo resumir un PDF', fr: 'Comment résumer un PDF' },
    psHowDesc: {
      en: 'PDF Summary is designed for documents that already contain selectable text. The page first reads the text in your browser, then sends only the extracted text to the summary service. Your original PDF is not uploaded to the AI model.',
      ko: 'PDF 요약은 선택 가능한 텍스트가 포함된 문서용입니다. 페이지가 브라우저에서 텍스트를 먼저 읽은 후, 추출된 텍스트만 요약 서비스로 전송합니다. 원본 PDF는 AI 모델에 업로드되지 않습니다.',
      de: 'PDF-Zusammenfassung ist für Dokumente mit auswählbarem Text gedacht. Die Seite liest den Text im Browser und sendet nur den extrahierten Text an den Dienst.',
      es: 'El resumen de PDF es para documentos con texto seleccionable. La página lee el texto en tu navegador y envía solo el texto extraído al servicio.',
      fr: 'Le résumé PDF est conçu pour les documents avec du texte sélectionnable. La page lit le texte dans votre navigateur et envoie uniquement le texte extrait au service.',
    },
    psStep1: {
      en: 'Upload a readable PDF such as a report, bill, statement, or contract draft.',
      ko: '보고서, 청구서, 명세서, 계약서 초안 등 읽을 수 있는 PDF를 업로드하세요.',
      de: 'Laden Sie ein lesbares PDF hoch, z. B. einen Bericht, eine Rechnung oder einen Vertragsentwurf.',
      es: 'Sube un PDF legible como un informe, factura, extracto o borrador de contrato.',
      fr: 'Importez un PDF lisible tel qu\'un rapport, une facture ou un brouillon de contrat.',
    },
    psStep2: {
      en: 'Check the original document on the left side while the extracted text is prepared.',
      ko: '추출된 텍스트가 준비되는 동안 왼쪽에서 원본 문서를 확인하세요.',
      de: 'Prüfen Sie links das Originaldokument, während der Text extrahiert wird.',
      es: 'Revisa el documento original a la izquierda mientras se prepara el texto extraído.',
      fr: 'Consultez le document original à gauche pendant que le texte est extrait.',
    },
    psStep3: {
      en: 'Generate a short outline with key points and important details.',
      ko: '핵심 사항과 중요한 세부 정보가 포함된 간단한 요약을 생성하세요.',
      de: 'Erstellen Sie eine kurze Übersicht mit Kernpunkten und wichtigen Details.',
      es: 'Genera un resumen corto con puntos clave y detalles importantes.',
      fr: 'Générez un résumé avec les points clés et les détails importants.',
    },
    psStep4: {
      en: 'Download the summary as a text file and compare sensitive details with the original PDF.',
      ko: '요약을 텍스트 파일로 다운로드하고 원본 PDF와 민감한 내용을 비교하세요.',
      de: 'Laden Sie die Zusammenfassung als Textdatei herunter und vergleichen Sie sie mit dem Original.',
      es: 'Descarga el resumen como archivo de texto y compara los detalles con el PDF original.',
      fr: 'Téléchargez le résumé et comparez les détails sensibles avec le PDF original.',
    },
    psFaqTitle: { en: 'PDF Summary FAQ', ko: 'PDF 요약 FAQ', de: 'PDF-Zusammenfassung FAQ', es: 'FAQ del Resumen PDF', fr: 'FAQ Résumé PDF' },
    psFaq1Q: { en: 'Can it summarize scanned PDFs?', ko: '스캔된 PDF도 요약할 수 있나요?', de: 'Kann es gescannte PDFs zusammenfassen?', es: '¿Puede resumir PDFs escaneados?', fr: 'Peut-il résumer des PDF numérisés ?' },
    psFaq1A: {
      en: 'Not in this first version. Scanned documents need OCR before the text can be summarized. Smart OCR can be added later as a separate AI tool.',
      ko: '현재 버전에서는 불가능합니다. 스캔 문서는 텍스트를 요약하기 전에 OCR이 필요합니다. 스마트 OCR은 별도의 AI 도구로 추후 추가될 수 있습니다.',
      de: 'Nicht in dieser ersten Version. Gescannte Dokumente benötigen OCR. Smart OCR kann später als separates KI-Tool hinzugefügt werden.',
      es: 'No en esta primera versión. Los documentos escaneados necesitan OCR. Smart OCR se puede añadir después como herramienta separada.',
      fr: 'Pas dans cette première version. Les documents numérisés nécessitent l\'OCR. L\'OCR intelligent peut être ajouté ultérieurement.',
    },
    psFaq2Q: { en: 'Does this replace legal, tax, or medical advice?', ko: '법률, 세무, 의료 자문을 대체할 수 있나요?', de: 'Ersetzt dies rechtliche, steuerliche oder medizinische Beratung?', es: '¿Reemplaza el asesoramiento legal, fiscal o médico?', fr: 'Cela remplace-t-il un avis juridique, fiscal ou médical ?' },
    psFaq2A: {
      en: 'No. The summary is a reading helper. Always confirm names, dates, amounts, account numbers, deadlines, and official wording in the original document.',
      ko: '아니요. 요약은 읽기 보조 도구입니다. 이름, 날짜, 금액, 계좌번호, 기한 및 공식 문구는 반드시 원본 문서에서 확인하세요.',
      de: 'Nein. Die Zusammenfassung ist eine Lesehilfe. Bestätigen Sie Namen, Daten, Beträge und offizielle Formulierungen im Originaldokument.',
      es: 'No. El resumen es una ayuda de lectura. Siempre confirme nombres, fechas, montos y redacción oficial en el documento original.',
      fr: 'Non. Le résumé est une aide à la lecture. Confirmez toujours noms, dates, montants et formulations officielles dans le document original.',
    },
    psFaq3Q: { en: 'Why does the result look like an outline?', ko: '결과가 개요 형태로 보이는 이유는?', de: 'Warum sieht das Ergebnis wie eine Gliederung aus?', es: '¿Por qué el resultado parece un esquema?', fr: 'Pourquoi le résultat ressemble-t-il à un plan ?' },
    psFaq3A: {
      en: 'An outline is easier to scan than a long paragraph. It helps you quickly see the main topic, key details, and questions worth asking next.',
      ko: '개요 형태는 긴 문단보다 빠르게 훑어볼 수 있습니다. 주요 주제, 핵심 세부 정보를 빠르게 파악할 수 있습니다.',
      de: 'Eine Gliederung ist schneller zu lesen als ein langer Absatz. Sie hilft, das Hauptthema und wichtige Details schnell zu erfassen.',
      es: 'Un esquema es más fácil de leer que un párrafo largo. Ayuda a ver rápidamente el tema principal y los detalles clave.',
      fr: 'Un plan est plus facile à parcourir qu\'un long paragraphe. Il permet de voir rapidement le sujet principal et les détails clés.',
    },

    /* ─── Background Remover ─── */
    brBadge: { en: 'AI TOOL • PAY-AS-YOU-GO', ko: 'AI 도구 • 단건 결제', de: 'KI-Tool • Einmalzahlung', es: 'Herramienta IA • Pago por uso', fr: 'Outil IA • Paiement à l\'usage' },
    brHeroDesc: {
      en: 'AI-powered background removal in seconds. Get a clean, transparent PNG ready for any project.',
      ko: 'AI로 몇 초 안에 배경을 제거합니다. 어떤 프로젝트에도 사용할 수 있는 투명 PNG를 받으세요.',
      de: 'KI-gestützte Hintergrundentfernung in Sekunden. Erhalten Sie ein sauberes, transparentes PNG.',
      es: 'Eliminación de fondo con IA en segundos. Obtén un PNG transparente listo para cualquier proyecto.',
      fr: 'Suppression d\'arrière-plan par IA en quelques secondes. Obtenez un PNG transparent prêt pour tout projet.',
    },
    brFaq1Q: { en: 'What image formats are supported?', ko: '어떤 이미지 형식을 지원하나요?', de: 'Welche Bildformate werden unterstützt?', es: '¿Qué formatos de imagen se admiten?', fr: 'Quels formats d\'image sont pris en charge ?' },
    brFaq1A: {
      en: 'You can upload JPG, JPEG, PNG, and WebP images. The result is always a transparent PNG file.',
      ko: 'JPG, JPEG, PNG, WebP 이미지를 업로드할 수 있습니다. 결과는 항상 투명 PNG 파일입니다.',
      de: 'Sie können JPG, JPEG, PNG und WebP hochladen. Das Ergebnis ist immer eine transparente PNG-Datei.',
      es: 'Puedes subir imágenes JPG, JPEG, PNG y WebP. El resultado es siempre un archivo PNG transparente.',
      fr: 'Vous pouvez importer des images JPG, JPEG, PNG et WebP. Le résultat est toujours un fichier PNG transparent.',
    },
    brFaq2Q: { en: 'Is my image stored on your server?', ko: '이미지가 서버에 저장되나요?', de: 'Wird mein Bild auf Ihrem Server gespeichert?', es: '¿Se almacena mi imagen en su servidor?', fr: 'Mon image est-elle stockée sur votre serveur ?' },
    brFaq2A: {
      en: 'Images are processed temporarily and deleted after the result is returned. We do not keep your files.',
      ko: '이미지는 임시로 처리되며 결과가 반환된 후 삭제됩니다. 파일을 보관하지 않습니다.',
      de: 'Bilder werden temporär verarbeitet und nach der Rückgabe des Ergebnisses gelöscht.',
      es: 'Las imágenes se procesan temporalmente y se eliminan después de devolver el resultado.',
      fr: 'Les images sont traitées temporairement et supprimées après le retour du résultat.',
    },

    /* ─── ID Photo ─── */
    idBadge: { en: 'AI TOOL • PAY-AS-YOU-GO', ko: 'AI 도구 • 단건 결제', de: 'KI-Tool • Einmalzahlung', es: 'Herramienta IA • Pago por uso', fr: 'Outil IA • Paiement à l\'usage' },
    idFaq1Q: { en: 'Does this retouch my face?', ko: '얼굴 보정을 하나요?', de: 'Wird mein Gesicht retuschiert?', es: '¿Retoca mi rostro?', fr: 'Cela retouche-t-il mon visage ?' },
    idFaq1A: {
      en: 'No. This tool only removes the background, crops, and resizes. There is no skin smoothing or face editing.',
      ko: '아니요. 이 도구는 배경 제거, 자르기, 크기 조정만 수행합니다. 피부 보정이나 얼굴 편집은 하지 않습니다.',
      de: 'Nein. Dieses Tool entfernt nur den Hintergrund, schneidet zu und skaliert. Keine Hautglättung oder Gesichtsbearbeitung.',
      es: 'No. Esta herramienta solo elimina el fondo, recorta y redimensiona. Sin suavizado de piel ni edición facial.',
      fr: 'Non. Cet outil supprime uniquement l\'arrière-plan, recadre et redimensionne. Pas de lissage de peau ni d\'édition faciale.',
    },
    idFaq2Q: { en: 'Which photo sizes are available?', ko: '어떤 사진 규격을 지원하나요?', de: 'Welche Fotogrößen sind verfügbar?', es: '¿Qué tamaños de foto están disponibles?', fr: 'Quelles tailles de photo sont disponibles ?' },
    idFaq2A: {
      en: 'Common sizes include passport (35×45mm), visa (2×2in), and national ID formats. Check the specifications table for details.',
      ko: '여권(35×45mm), 비자(2×2인치), 주민등록증 등 일반적인 규격을 지원합니다. 상세 내용은 규격 표를 확인하세요.',
      de: 'Gängige Größen: Reisepass (35×45mm), Visum (2×2 Zoll) und nationale ID-Formate. Details in der Spezifikationstabelle.',
      es: 'Tamaños comunes: pasaporte (35×45mm), visa (2×2 pulg.) y formatos nacionales. Consulta la tabla de especificaciones.',
      fr: 'Tailles courantes : passeport (35×45mm), visa (2×2po) et formats nationaux. Consultez le tableau des spécifications.',
    },

    /* ─── Transcription ─── */
    trBadge: { en: 'AI TOOL • PAY-AS-YOU-GO', ko: 'AI 도구 • 단건 결제', de: 'KI-Tool • Einmalzahlung', es: 'Herramienta IA • Pago por uso', fr: 'Outil IA • Paiement à l\'usage' },
    trHeroDesc: {
      en: 'Upload an audio or video file and get an accurate text transcript + SRT subtitle file in seconds.',
      ko: '오디오나 비디오 파일을 업로드하면 텍스트 기록과 SRT 자막 파일을 만들 수 있습니다.',
      de: 'Laden Sie Audio oder Video hoch und erhalten Sie ein Transkript plus SRT-Untertitel.',
      es: 'Sube un archivo de audio o video y obtén transcripción y subtítulos SRT.',
      fr: 'Importez un fichier audio ou vidéo et obtenez une transcription avec sous-titres SRT.',
    },
    trFaq1Q: { en: 'What file formats are supported?', ko: '어떤 파일 형식을 지원하나요?', de: 'Welche Dateiformate werden unterstützt?', es: '¿Qué formatos de archivo se admiten?', fr: 'Quels formats de fichier sont pris en charge ?' },
    trFaq1A: {
      en: 'Most common audio and video formats are supported, including MP3, WAV, M4A, MP4, and WebM.',
      ko: 'MP3, WAV, M4A, MP4, WebM 등 대부분의 오디오 및 비디오 형식을 지원합니다.',
      de: 'Die meisten gängigen Audio- und Videoformate werden unterstützt, darunter MP3, WAV, M4A, MP4 und WebM.',
      es: 'Se admiten los formatos de audio y video más comunes, incluyendo MP3, WAV, M4A, MP4 y WebM.',
      fr: 'Les formats audio et vidéo les plus courants sont pris en charge, dont MP3, WAV, M4A, MP4 et WebM.',
    },
    trFaq2Q: { en: 'How long can the audio/video be?', ko: '오디오/비디오 길이 제한이 있나요?', de: 'Wie lang darf die Audio-/Videodatei sein?', es: '¿Cuánto puede durar el audio/video?', fr: 'Quelle est la durée maximale de l\'audio/vidéo ?' },
    trFaq2A: {
      en: 'The free preview supports files up to a few minutes. Longer files may require a Pro account.',
      ko: '무료 미리보기는 몇 분 이내의 파일을 지원합니다. 더 긴 파일은 Pro 계정이 필요할 수 있습니다.',
      de: 'Die kostenlose Vorschau unterstützt Dateien bis zu einigen Minuten. Längere Dateien erfordern möglicherweise ein Pro-Konto.',
      es: 'La vista previa gratuita admite archivos de hasta unos minutos. Archivos más largos pueden requerir una cuenta Pro.',
      fr: 'L\'aperçu gratuit prend en charge les fichiers de quelques minutes. Les fichiers plus longs peuvent nécessiter un compte Pro.',
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

  function applyI18nAttributes(language) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      const entry = i18n[key];
      if (!entry) return;
      const value = entry[language] || entry.en;
      if (!value) return;
      // Preserve child <i> icons in elements like .translate-highlight
      const icon = element.querySelector('i');
      if (icon) {
        element.textContent = '';
        element.appendChild(icon);
        element.append(' ' + value);
      } else {
        element.textContent = value;
      }
    });
  }

  function applyAiLanguage(language = getLanguage()) {
    const key = getPageKey();
    const map = pageText[key] || {};
    document.querySelectorAll('.subtitle-ko').forEach((node) => {
      node.style.display = 'none';
    });
    Object.entries(map).forEach(([selector, values]) => setText(selector, values[language] || values.en));
    applyI18nAttributes(language);
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
