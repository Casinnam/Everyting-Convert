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
    psGuide2Title: { en: 'Scanned PDF? Open Smart OCR first', ko: '스캔 PDF는 Smart OCR로 먼저', de: 'Gescannte PDF? Zuerst Smart OCR oeffnen', es: 'PDF escaneado? Abre Smart OCR primero', fr: 'PDF scanne ? Ouvrez Smart OCR d abord' },
    psGuide2Desc: {
      en: 'Image-only PDFs need OCR before AI can read them. Use Smart OCR to extract clean text first, then return here for a stronger summary.',
      ko: '이미지로 된 PDF는 AI가 바로 읽기 어렵습니다. Smart OCR에서 텍스트를 먼저 추출한 뒤 PDF 요약을 사용하면 더 정확한 결과를 얻을 수 있습니다.',
      de: 'Bildbasierte PDFs brauchen OCR, bevor KI sie lesen kann. Nutzen Sie zuerst Smart OCR und kommen Sie danach fuer eine bessere Zusammenfassung zurueck.',
      es: 'Los PDF basados en imagen necesitan OCR antes de que la IA pueda leerlos. Usa Smart OCR primero y vuelve aqui para obtener un mejor resumen.',
      fr: 'Les PDF sous forme d image ont besoin d OCR avant que l IA puisse les lire. Utilisez Smart OCR, puis revenez ici pour un meilleur resume.',
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
      en: 'Yes, but scan-based PDFs should go through Smart OCR first. Smart OCR turns image pages into readable text, so PDF Summary can produce cleaner key points and suggested questions.',
      ko: '가능합니다. 다만 스캔 PDF는 먼저 Smart OCR에서 이미지 속 글자를 텍스트로 추출해야 합니다. 그런 다음 PDF 요약을 사용하면 핵심 요약과 추천 질문을 더 깔끔하게 만들 수 있습니다.',
      de: 'Ja, aber gescannte PDFs sollten zuerst durch Smart OCR laufen. Smart OCR macht Bildseiten zu lesbarem Text, damit PDF Summary bessere Kernpunkte und Fragen erstellen kann.',
      es: 'Si, pero los PDF escaneados deben pasar primero por Smart OCR. Smart OCR convierte paginas de imagen en texto legible para que PDF Summary genere mejores puntos clave y preguntas.',
      fr: 'Oui, mais les PDF scannes doivent d abord passer par Smart OCR. Smart OCR transforme les pages image en texte lisible afin que PDF Summary cree de meilleurs points cles et questions.',
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
    brDrop: { en: 'Drop your image here', ko: '이미지를 여기에 놓으세요', de: 'Bild hier ablegen', es: 'Suelta tu imagen aquí', fr: 'Déposez votre image ici' },
    brPrivacy: {
      en: 'Your image is processed on our secure server and automatically deleted within 24 hours. We never use your images for training or any other purpose.',
      ko: '이미지는 보안 서버에서 처리되며 24시간 이내에 자동 삭제됩니다. 이미지를 학습이나 다른 용도로 사용하지 않습니다.',
      de: 'Ihr Bild wird auf unserem sicheren Server verarbeitet und innerhalb von 24 Stunden automatisch gelöscht. Wir verwenden Ihre Bilder nie für Training oder andere Zwecke.',
      es: 'Tu imagen se procesa en nuestro servidor seguro y se elimina automáticamente en 24 horas. Nunca usamos tus imágenes para entrenamiento ni para ningún otro fin.',
      fr: 'Votre image est traitée sur notre serveur sécurisé et supprimée automatiquement sous 24 heures. Nous n\'utilisons jamais vos images pour l\'entraînement ou à d\'autres fins.',
    },
    brFaq1Q: { en: 'What is the output format?', ko: '출력 형식은 무엇인가요?', de: 'Welches Ausgabeformat gibt es?', es: '¿Cuál es el formato de salida?', fr: 'Quel est le format de sortie ?' },
    brFaq1A: {
      en: 'The downloaded file is a transparent PNG (RGBA). You can place it over any background in Photoshop, Canva, PowerPoint, or any graphics tool.',
      ko: '다운로드 파일은 투명 PNG(RGBA)입니다. Photoshop, Canva, PowerPoint 등 어떤 그래픽 도구에서도 원하는 배경 위에 올릴 수 있습니다.',
      de: 'Die heruntergeladene Datei ist ein transparentes PNG (RGBA). Sie können es in Photoshop, Canva, PowerPoint oder jedem Grafiktool über einen beliebigen Hintergrund legen.',
      es: 'El archivo descargado es un PNG transparente (RGBA). Puedes colocarlo sobre cualquier fondo en Photoshop, Canva, PowerPoint o cualquier herramienta gráfica.',
      fr: 'Le fichier téléchargé est un PNG transparent (RGBA). Vous pouvez le placer sur n\'importe quel fond dans Photoshop, Canva, PowerPoint ou tout autre outil graphique.',
    },
    brFaq2Q: { en: 'What types of images work best?', ko: '어떤 이미지가 가장 잘 작동하나요?', de: 'Welche Bilder funktionieren am besten?', es: '¿Qué tipos de imágenes funcionan mejor?', fr: 'Quels types d\'images fonctionnent le mieux ?' },
    brFaq2A: {
      en: 'Clear photos with a distinct subject — portraits, products, logos. Complex backgrounds with similar colors to the subject may have minor edge artifacts.',
      ko: '피사체가 뚜렷한 선명한 사진(인물, 제품, 로고)이 가장 좋습니다. 피사체와 색이 비슷한 복잡한 배경은 가장자리가 약간 거칠어질 수 있습니다.',
      de: 'Klare Fotos mit deutlichem Motiv – Porträts, Produkte, Logos. Bei komplexen Hintergründen mit ähnlichen Farben können kleine Kantenartefakte auftreten.',
      es: 'Fotos claras con un sujeto definido: retratos, productos, logotipos. Fondos complejos con colores similares al sujeto pueden tener pequeños defectos en los bordes.',
      fr: 'Des photos nettes avec un sujet distinct — portraits, produits, logos. Les fonds complexes aux couleurs proches du sujet peuvent présenter de légers défauts de bord.',
    },
    brFaq3Q: { en: 'What is the difference between the preview and the HD download?', ko: '미리보기와 HD 다운로드는 무엇이 다른가요?', de: 'Was ist der Unterschied zwischen Vorschau und HD-Download?', es: '¿Cuál es la diferencia entre la vista previa y la descarga HD?', fr: 'Quelle est la différence entre l\'aperçu et le téléchargement HD ?' },
    brFaq3A: {
      en: 'The free preview is a low-resolution version (400px wide). The HD download is the full-resolution result at your original image dimensions.',
      ko: '무료 미리보기는 저해상도(가로 400px)입니다. HD 다운로드는 원본 이미지 크기 그대로의 전체 해상도 결과물입니다.',
      de: 'Die kostenlose Vorschau ist eine niedrig aufgelöste Version (400 px breit). Der HD-Download liefert das Ergebnis in der vollen Auflösung Ihres Originalbilds.',
      es: 'La vista previa gratuita es de baja resolución (400 px de ancho). La descarga HD es el resultado a la resolución completa de tu imagen original.',
      fr: 'L\'aperçu gratuit est en basse résolution (400 px de large). Le téléchargement HD correspond au résultat en pleine résolution de votre image d\'origine.',
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
    trDrop: { en: 'Drop your audio or video file here', ko: '오디오 또는 비디오 파일을 여기에 놓으세요', de: 'Audio- oder Videodatei hier ablegen', es: 'Suelta tu archivo de audio o video aquí', fr: 'Déposez votre fichier audio ou vidéo ici' },
    trPrivacy: {
      en: 'Your file is sent directly to our secure processing server, transcribed, and automatically deleted within 24 hours. We never store or share your audio.',
      ko: '파일은 보안 처리 서버로 직접 전송되어 텍스트로 변환된 후 24시간 이내에 자동 삭제됩니다. 오디오를 저장하거나 공유하지 않습니다.',
      de: 'Ihre Datei wird direkt an unseren sicheren Server gesendet, transkribiert und innerhalb von 24 Stunden automatisch gelöscht. Wir speichern oder teilen Ihre Audiodatei nie.',
      es: 'Tu archivo se envía directamente a nuestro servidor seguro, se transcribe y se elimina automáticamente en 24 horas. Nunca almacenamos ni compartimos tu audio.',
      fr: 'Votre fichier est envoyé directement à notre serveur sécurisé, transcrit, puis supprimé automatiquement sous 24 heures. Nous ne stockons ni ne partageons jamais votre audio.',
    },
    trFaq1Q: { en: 'What file formats are supported?', ko: '어떤 파일 형식을 지원하나요?', de: 'Welche Dateiformate werden unterstützt?', es: '¿Qué formatos de archivo se admiten?', fr: 'Quels formats de fichier sont pris en charge ?' },
    trFaq1A: {
      en: 'MP3, M4A, WAV, OGG, FLAC, MP4, MOV, and WebM. Maximum file size is 25 MB.',
      ko: 'MP3, M4A, WAV, OGG, FLAC, MP4, MOV, WebM을 지원합니다. 최대 파일 크기는 25 MB입니다.',
      de: 'MP3, M4A, WAV, OGG, FLAC, MP4, MOV und WebM. Maximale Dateigröße: 25 MB.',
      es: 'MP3, M4A, WAV, OGG, FLAC, MP4, MOV y WebM. El tamaño máximo es de 25 MB.',
      fr: 'MP3, M4A, WAV, OGG, FLAC, MP4, MOV et WebM. Taille maximale : 25 Mo.',
    },
    trFaq2Q: { en: 'How accurate is the transcription?', ko: '텍스트 변환은 얼마나 정확한가요?', de: 'Wie genau ist die Transkription?', es: '¿Qué tan precisa es la transcripción?', fr: 'Quelle est la précision de la transcription ?' },
    trFaq2A: {
      en: 'We use OpenAI Whisper, one of the most accurate speech-to-text models available. Accuracy depends on audio quality and accent, but typically exceeds 95% for clear recordings.',
      ko: '가장 정확한 음성 인식 모델 중 하나인 OpenAI Whisper를 사용합니다. 정확도는 음질과 억양에 따라 다르지만, 선명한 녹음은 보통 95% 이상입니다.',
      de: 'Wir nutzen OpenAI Whisper, eines der genauesten Spracherkennungsmodelle. Die Genauigkeit hängt von Audioqualität und Akzent ab, liegt bei klaren Aufnahmen aber meist über 95 %.',
      es: 'Usamos OpenAI Whisper, uno de los modelos de voz a texto más precisos. La precisión depende de la calidad del audio y el acento, pero suele superar el 95% en grabaciones claras.',
      fr: 'Nous utilisons OpenAI Whisper, l\'un des modèles de reconnaissance vocale les plus précis. La précision dépend de la qualité audio et de l\'accent, mais dépasse généralement 95 % pour les enregistrements clairs.',
    },
    trFaq3Q: { en: 'What languages are supported?', ko: '어떤 언어를 지원하나요?', de: 'Welche Sprachen werden unterstützt?', es: '¿Qué idiomas se admiten?', fr: 'Quelles langues sont prises en charge ?' },
    trFaq3A: {
      en: 'Whisper supports over 50 languages including English, Korean, Japanese, Spanish, French, German, Portuguese, Chinese, and more. Language is detected automatically.',
      ko: 'Whisper는 영어, 한국어, 일본어, 스페인어, 프랑스어, 독일어, 포르투갈어, 중국어 등 50개 이상의 언어를 지원합니다. 언어는 자동으로 감지됩니다.',
      de: 'Whisper unterstützt über 50 Sprachen, darunter Englisch, Koreanisch, Japanisch, Spanisch, Französisch, Deutsch, Portugiesisch und Chinesisch. Die Sprache wird automatisch erkannt.',
      es: 'Whisper admite más de 50 idiomas, incluidos inglés, coreano, japonés, español, francés, alemán, portugués y chino. El idioma se detecta automáticamente.',
      fr: 'Whisper prend en charge plus de 50 langues, dont l\'anglais, le coréen, le japonais, l\'espagnol, le français, l\'allemand, le portugais et le chinois. La langue est détectée automatiquement.',
    },
    trFaq4Q: { en: 'What is the SRT file?', ko: 'SRT 파일이 무엇인가요?', de: 'Was ist die SRT-Datei?', es: '¿Qué es el archivo SRT?', fr: 'Qu\'est-ce que le fichier SRT ?' },
    trFaq4A: {
      en: 'An SRT (SubRip Subtitle) file contains timestamped captions compatible with most video players (VLC, YouTube, Premiere, etc.).',
      ko: 'SRT(SubRip Subtitle) 파일은 타임스탬프가 포함된 자막 파일로, VLC, YouTube, Premiere 등 대부분의 비디오 플레이어와 호환됩니다.',
      de: 'Eine SRT-Datei (SubRip Subtitle) enthält Untertitel mit Zeitstempeln und ist mit den meisten Videoplayern kompatibel (VLC, YouTube, Premiere usw.).',
      es: 'Un archivo SRT (SubRip Subtitle) contiene subtítulos con marcas de tiempo compatibles con la mayoría de reproductores de video (VLC, YouTube, Premiere, etc.).',
      fr: 'Un fichier SRT (SubRip Subtitle) contient des sous-titres horodatés compatibles avec la plupart des lecteurs vidéo (VLC, YouTube, Premiere, etc.).',
    },

    /* ─── Shared across AI tools ─── */
    aiPrivacyLabel: { en: 'Privacy:', ko: '개인정보:', de: 'Datenschutz:', es: 'Privacidad:', fr: 'Confidentialité :' },
    aiFaqPayQ: { en: 'Is my payment secure?', ko: '결제는 안전한가요?', de: 'Ist meine Zahlung sicher?', es: '¿Es seguro mi pago?', fr: 'Mon paiement est-il sécurisé ?' },
    aiFaqPayA: {
      en: 'Yes. Payments are processed by Stripe. We never see or store your card details.',
      ko: '네. 결제는 Stripe에서 처리되며, 카드 정보는 저희가 보거나 저장하지 않습니다.',
      de: 'Ja. Zahlungen werden über Stripe abgewickelt. Wir sehen oder speichern Ihre Kartendaten nie.',
      es: 'Sí. Los pagos se procesan con Stripe. Nunca vemos ni almacenamos los datos de tu tarjeta.',
      fr: 'Oui. Les paiements sont traités par Stripe. Nous ne voyons ni ne stockons jamais vos données de carte.',
    },
  };

  function getPageKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/pdf-summary/')) return 'pdf-summary';
    if (path.includes('/transcription/')) return 'transcription';
    if (path.includes('/background-remover/')) return 'background-remover';
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

  Object.assign(i18n, {
    psGuide2Title: {
      en: 'Scanned PDF? Open Smart OCR first',
      ko: '스캔 PDF는 Smart OCR로 먼저',
      de: 'Gescannte PDF? Zuerst Smart OCR oeffnen',
      es: 'PDF escaneado? Abre Smart OCR primero',
      fr: 'PDF scanne ? Ouvrez Smart OCR d abord',
    },
    psGuide2Desc: {
      en: 'Image-only PDFs need OCR before AI can read them. Use Smart OCR to extract clean text first, then return here for a stronger summary.',
      ko: '이미지로 된 PDF는 AI가 바로 읽기 어렵습니다. Smart OCR에서 텍스트를 먼저 추출한 뒤 PDF 요약을 사용하면 더 정확한 결과를 얻을 수 있습니다.',
      de: 'Bildbasierte PDFs brauchen OCR, bevor KI sie lesen kann. Nutzen Sie zuerst Smart OCR und kommen Sie danach fuer eine bessere Zusammenfassung zurueck.',
      es: 'Los PDF basados en imagen necesitan OCR antes de que la IA pueda leerlos. Usa Smart OCR primero y vuelve aqui para obtener un mejor resumen.',
      fr: 'Les PDF sous forme d image ont besoin d OCR avant que l IA puisse les lire. Utilisez Smart OCR, puis revenez ici pour un meilleur resume.',
    },
    psSmartOcrLink: {
      en: 'Open Smart OCR',
      ko: 'Smart OCR로 이동',
      de: 'Smart OCR oeffnen',
      es: 'Abrir Smart OCR',
      fr: 'Ouvrir Smart OCR',
    },
    psFaq1A: {
      en: 'Yes, but scan-based PDFs should go through Smart OCR first. Smart OCR turns image pages into readable text, so PDF Summary can produce cleaner key points and suggested questions.',
      ko: '가능합니다. 다만 스캔 PDF는 먼저 Smart OCR에서 이미지 속 글자를 텍스트로 추출해야 합니다. 그런 다음 PDF 요약을 사용하면 핵심 요약과 추천 질문을 더 깔끔하게 만들 수 있습니다.',
      de: 'Ja, aber gescannte PDFs sollten zuerst durch Smart OCR laufen. Smart OCR macht Bildseiten zu lesbarem Text, damit PDF Summary bessere Kernpunkte und Fragen erstellen kann.',
      es: 'Si, pero los PDF escaneados deben pasar primero por Smart OCR. Smart OCR convierte paginas de imagen en texto legible para que PDF Summary genere mejores puntos clave y preguntas.',
      fr: 'Oui, mais les PDF scannes doivent d abord passer par Smart OCR. Smart OCR transforme les pages image en texte lisible afin que PDF Summary cree de meilleurs points cles et questions.',
    },
  });

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
