(function () {
  const pageData = {
    'pdf-to-word.html': {
      category: 'PDF',
      title: 'PDF to Word Converter',
      accent: 'PDF',
      description: 'Convert PDF files to editable Word documents (DOCX) in seconds. Fast, accurate, and easy to use.',
      input: 'PDF',
      output: 'DOCX',
      iconIn: 'fa-file-pdf',
      iconOut: 'fa-file-word',
      drop: 'Drag & drop your PDF file here',
      max: 'Max file size: 100MB',
      steps: ['Upload your PDF file', 'Convert to Word', 'Download your Word file'],
      related: ['PDF to JPG', 'PDF to Excel', 'Merge PDF', 'Compress PDF', 'Rotate PDF']
    },
    'pdf-to-jpg.html': {
      category: 'PDF',
      title: 'PDF to JPG Converter',
      accent: 'PDF',
      description: 'Turn PDF pages into high-quality JPG images, then download each image or a ZIP file.',
      input: 'PDF',
      output: 'JPG',
      iconIn: 'fa-file-pdf',
      iconOut: 'fa-file-image',
      drop: 'Drag & drop your PDF file here',
      max: 'Max file size: 100MB',
      steps: ['Upload your PDF file', 'Choose image quality', 'Download JPG images'],
      related: ['PDF to Word', 'PDF to Excel', 'Merge PDF', 'Compress PDF', 'Extract PDF Pages']
    },
    'pdf-to-excel.html': {
      category: 'PDF',
      title: 'PDF to Excel Converter',
      accent: 'PDF',
      description: 'Extract text and table-like data from PDFs into an Excel workbook.',
      input: 'PDF',
      output: 'XLSX',
      iconIn: 'fa-file-pdf',
      iconOut: 'fa-file-excel',
      drop: 'Drag & drop your PDF file here',
      max: 'Enhanced table detection is available for Pro members.',
      steps: ['Upload your PDF file', 'Select extraction mode', 'Download your Excel file'],
      related: ['PDF to Word', 'Excel to PDF', 'PDF to JPG', 'Merge PDF', 'Compress PDF']
    },
    'excel-to-pdf.html': {
      category: 'Office',
      title: 'Excel to PDF Converter',
      accent: 'Excel',
      description: 'Convert Excel and CSV sheets into clean PDF documents directly in your browser.',
      input: 'XLS',
      output: 'PDF',
      iconIn: 'fa-file-excel',
      iconOut: 'fa-file-pdf',
      drop: 'Drag & drop your Excel or CSV file here',
      max: 'Supports XLSX, XLS, and CSV files.',
      steps: ['Upload your spreadsheet', 'Choose sheet and layout', 'Download your PDF file'],
      related: ['PDF to Excel', 'PDF to Word', 'DOCX to PDF', 'Image to PDF', 'PDF to JPG']
    },
    'docx-to-pdf.html': {
      category: 'Office',
      title: 'DOCX to PDF Converter',
      accent: 'DOCX',
      description: 'Convert Word documents into PDF files with a simple browser-based workflow.',
      input: 'DOCX',
      output: 'PDF',
      iconIn: 'fa-file-word',
      iconOut: 'fa-file-pdf',
      drop: 'Drag & drop your DOCX file here',
      max: 'Best for text-focused documents.',
      steps: ['Upload your DOCX file', 'Convert to PDF', 'Download your PDF file'],
      related: ['PDF to Word', 'Excel to PDF', 'PDF to JPG', 'Image to PDF', 'PDF to EPUB']
    },
    'pdf-to-epub.html': {
      category: 'PDF',
      title: 'PDF to EPUB Converter',
      accent: 'PDF',
      description: 'Convert PDF text into EPUB format for ebook readers and reading apps.',
      input: 'PDF',
      output: 'EPUB',
      iconIn: 'fa-file-pdf',
      iconOut: 'fa-book',
      drop: 'Drag & drop your PDF file here',
      max: 'Works best with text-based PDFs.',
      steps: ['Upload your PDF file', 'Extract readable text', 'Download EPUB file'],
      related: ['Ebook Converter', 'PDF to Word', 'PDF to JPG', 'DOCX to PDF', 'PDF to Excel']
    },
    'ebook-converter.html': {
      category: 'Office',
      title: 'Ebook Converter',
      accent: 'Ebook',
      description: 'Convert supported document text into ebook-friendly formats.',
      input: 'DOC',
      output: 'EPUB',
      iconIn: 'fa-file-lines',
      iconOut: 'fa-book',
      drop: 'Drag & drop your ebook or document file here',
      max: 'Browser-based conversion for supported formats.',
      steps: ['Upload your file', 'Choose ebook output', 'Download converted ebook'],
      related: ['PDF to EPUB', 'PDF to Word', 'DOCX to PDF', 'PDF to Excel', 'Image to PDF']
    },
    'image-to-pdf.html': {
      category: 'Image',
      title: 'Image to PDF Converter',
      accent: 'Image',
      description: 'Combine JPG, PNG, WEBP, and other images into a clean multi-page PDF.',
      input: 'IMG',
      output: 'PDF',
      iconIn: 'fa-file-image',
      iconOut: 'fa-file-pdf',
      drop: 'Drag & drop your images here',
      max: 'Select multiple images and arrange them before saving.',
      steps: ['Upload one or more images', 'Choose page layout', 'Download your PDF file'],
      related: ['JPG to PDF', 'PNG to PDF', 'Image Converter', 'PDF to JPG', 'WEBP to PNG']
    },
    'image-converter.html': {
      category: 'Image',
      title: 'Image Converter',
      accent: 'Image',
      description: 'Convert images between popular formats such as JPG, PNG, WEBP, and SVG.',
      input: 'IMG',
      output: 'PNG',
      iconIn: 'fa-file-image',
      iconOut: 'fa-image',
      drop: 'Drag & drop your image file here',
      max: 'Fast browser-based image conversion.',
      steps: ['Upload your image', 'Choose output format', 'Download converted image'],
      related: ['WEBP to PNG', 'HEIC to JPG', 'PNG to SVG', 'Image to PDF', 'PDF to JPG']
    },
    'media-converter.html': {
      category: 'Video & Audio',
      title: 'Video & Audio Converter',
      accent: 'Video',
      description: 'Convert video and audio files in your browser with FFmpeg-powered tools.',
      input: 'MP4',
      output: 'MP3',
      iconIn: 'fa-file-video',
      iconOut: 'fa-file-audio',
      drop: 'Drag & drop your media file here',
      max: 'Large files may take longer depending on your device.',
      steps: ['Upload video or audio', 'Choose output format', 'Download converted file'],
      related: ['MP4 to MP3', 'MOV to MP4', 'Video to MP3', 'Video to GIF', 'GIF to MP4']
    },
    'gif-converter.html': {
      category: 'GIF',
      title: 'GIF Converter',
      accent: 'GIF',
      description: 'Create GIFs from videos, images, and animated formats with simple controls.',
      input: 'MP4',
      output: 'GIF',
      iconIn: 'fa-file-video',
      iconOut: 'fa-file-image',
      drop: 'Drag & drop your video, GIF, or images here',
      max: 'Short clips work best for GIF conversion.',
      steps: ['Upload your source file', 'Choose GIF settings', 'Download converted file'],
      related: ['Video to GIF', 'MP4 to GIF', 'WEBM to GIF', 'GIF to MP4', 'Image to GIF']
    },
    'csv-converter.html': {
      category: 'Developer',
      title: 'CSV Converter',
      accent: 'CSV',
      description: 'Convert CSV to JSON, Excel, or XML and convert Excel spreadsheets to CSV.',
      input: 'CSV',
      output: 'JSON',
      iconIn: 'fa-file-csv',
      iconOut: 'fa-file-code',
      drop: 'Drag & drop your CSV or Excel file here',
      max: 'Supports CSV, TSV, XLSX, and XLS files.',
      steps: ['Upload your CSV or Excel file', 'Choose output format', 'Download converted file'],
      related: ['JSON to CSV', 'Excel to PDF', 'PDF to Excel', 'Image Converter', 'QR Code Generator']
    }
  };

  const relatedLinks = {
    'PDF to Word': ['pdf to word/pdf-to-word.html', 'fa-file-word', 'Convert PDFs into editable DOCX files'],
    'PDF to JPG': ['pdf to jpg/pdf-to-jpg.html', 'fa-file-image', 'Convert PDF pages into images'],
    'PDF to Excel': ['pdf to excel/pdf-to-excel.html', 'fa-file-excel', 'Extract PDF data to Excel'],
    'Excel to PDF': ['excel to pdf/excel-to-pdf.html', 'fa-file-pdf', 'Convert sheets to PDF'],
    'Image to PDF': ['image to pdf/image-to-pdf.html', 'fa-file-pdf', 'Combine images into PDF'],
    'DOCX to PDF': ['docx to pdf/docx-to-pdf.html', 'fa-file-pdf', 'Convert Word files to PDF'],
    'PDF to EPUB': ['pdf to epub/pdf-to-epub.html', 'fa-book', 'Create EPUB ebooks'],
    'Merge PDF': ['pdf tools/pdf-tools.html?mode=merge', 'fa-layer-group', 'Combine multiple PDFs'],
    'Compress PDF': ['pdf tools/pdf-tools.html?mode=compress', 'fa-compress', 'Reduce PDF file size'],
    'Split PDF': ['pdf tools/pdf-tools.html?mode=split', 'fa-scissors', 'Split pages into files'],
    'Rotate PDF': ['pdf tools/pdf-tools.html?mode=rotate', 'fa-rotate-right', 'Rotate PDF pages'],
    'Remove PDF Pages': ['pdf tools/pdf-tools.html?mode=remove', 'fa-trash-can', 'Delete selected pages'],
    'Extract PDF Pages': ['pdf tools/pdf-tools.html?mode=extract', 'fa-copy', 'Save selected pages'],
    'Organize PDF': ['pdf tools/pdf-tools.html?mode=organize', 'fa-arrow-up-short-wide', 'Reorder PDF pages'],
    'Ebook Converter': ['ebook converter/ebook-converter.html', 'fa-book-open', 'Convert ebook files'],
    'Image Converter': ['image converter/image-converter.html', 'fa-image', 'Convert image formats'],
    'JPG to PDF': ['image to pdf/image-to-pdf.html', 'fa-file-pdf', 'Turn JPGs into PDF'],
    'PNG to PDF': ['image to pdf/image-to-pdf.html', 'fa-file-pdf', 'Turn PNGs into PDF'],
    'WEBP to PNG': ['image converter/image-converter.html?mode=webp-png', 'fa-image', 'Convert WEBP to PNG'],
    'WEBP to JPG': ['image converter/image-converter.html?mode=webp-jpg', 'fa-image', 'Convert WEBP to JPG'],
    'HEIC to JPG': ['image converter/image-converter.html?mode=heic-jpg', 'fa-image', 'Convert HEIC photos'],
    'PNG to SVG': ['image converter/image-converter.html?mode=png-svg', 'fa-bezier-curve', 'Vectorize PNG files'],
    'MP4 to MP3': ['media converter/media-converter.html?mode=mp4-mp3', 'fa-music', 'Extract audio from video'],
    'MOV to MP4': ['media converter/media-converter.html?mode=mov-mp4', 'fa-file-video', 'Convert MOV to MP4'],
    'Video to MP3': ['media converter/media-converter.html?mode=video-mp3', 'fa-file-audio', 'Extract audio tracks'],
    'Video to GIF': ['gif converter/gif-converter.html', 'fa-file-video', 'Turn clips into GIFs'],
    'MP4 to GIF': ['gif converter/gif-converter.html?mode=mp4-gif', 'fa-file-video', 'Create GIFs from MP4'],
    'WEBM to GIF': ['gif converter/gif-converter.html?mode=webm-gif', 'fa-file-video', 'Create GIFs from WEBM'],
    'GIF to MP4': ['gif converter/gif-converter.html?mode=gif-mp4', 'fa-file-video', 'Convert GIFs to video'],
    'Image to GIF': ['gif converter/gif-converter.html?mode=image-gif', 'fa-images', 'Animate images as GIF'],
    'QR Code Generator': ['qr code generator/qr-code-generator.html', 'fa-qrcode', 'Create custom QR codes instantly'],
    'JSON to CSV': ['json to csv/json-to-csv.html', 'fa-code', 'Convert JSON data to spreadsheet CSV'],
    'CSV Converter': ['csv converter/csv-converter.html', 'fa-file-csv', 'Convert CSV to JSON, Excel, or XML']
  };

  const localizedContent = {
    en: {
      featureFastTitle: 'Fast Conversion',
      featureFastText: 'Convert in seconds',
      featureAccuracyTitle: 'High Accuracy',
      featureAccuracyText: 'Keep formatting clear',
      featurePrivacyTitle: 'Secure & Private',
      featurePrivacyText: 'Files are handled carefully',
      featureDeviceTitle: 'Works Everywhere',
      featureDeviceText: 'Web-based converter',
      howTitle: 'How to Convert {input} to {output}',
      stepUploadDetail: 'Drag and drop your file or click the upload button.',
      stepPrepareDetail: 'Choose the settings that match your file and output goal.',
      stepDownloadDetail: 'Download the converted file and check the result before sharing.',
      whyTitle: 'Why Choose EverythingConvert?',
      whyItems: [
        'Fast, simple conversion workflow',
        'Clean output for everyday files',
        'No software installation required',
        'Private browser-first experience where possible',
        'Built for PDF, image, office, video, audio, and GIF tools'
      ],
      guideTitle: 'Helpful guide for better results',
      guideIntro: 'A little preparation helps this converter produce cleaner files, especially when documents include tables, images, scans, or mixed formatting.',
      bestTitle: 'Best files to use',
      bestItems: [
        'Use files that open correctly on your device before uploading.',
        'For scanned documents, choose the clearest version available.',
        'For images and media, smaller test files are useful before converting large batches.'
      ],
      fixesTitle: 'Common issues and fixes',
      fixesItems: [
        'If formatting looks different, try converting a smaller page range or a simpler copy.',
        'If a browser-based media conversion is slow, reduce the file size or clip length first.',
        'If a file does not open after download, repeat the conversion with a fresh source file.'
      ],
      privacyTitle: 'Privacy note',
      privacyText: 'Many conversions run directly in your browser. When a server feature is needed, we keep the workflow limited to the conversion task and avoid unnecessary file access.',
      faqTitle: 'Frequently asked questions',
      faqs: [
        ['Do I need to install software?', 'No. EverythingConvert tools are designed to work in a modern browser.'],
        ['Will the result always match perfectly?', 'Simple files usually convert cleanly. Complex layouts, scans, and unusual fonts may need a second check.'],
        ['Can I use this on mobile?', 'Yes. The site works on mobile browsers, although large files are usually easier on a desktop or laptop.']
      ],
      relatedTitle: 'More {category} Tools You May Need',
      securityTitle: 'Your Files Are Safe With Us',
      securityText: 'We use secure workflows and keep privacy at the center of every converter.',
      secureTransfer: 'Secure Transfer',
      secureTransferText: 'Protected browser sessions',
      autoDelete: 'Auto File Deletion',
      autoDeleteText: 'Temporary files are removed',
      noAccess: 'No One Can Access',
      noAccessText: 'Your files stay private'
    },
    ko: {
      featureFastTitle: '빠른 변환',
      featureFastText: '몇 초 안에 작업 시작',
      featureAccuracyTitle: '높은 정확도',
      featureAccuracyText: '형식을 최대한 깔끔하게 유지',
      featurePrivacyTitle: '안전한 개인정보 보호',
      featurePrivacyText: '파일을 조심스럽게 처리',
      featureDeviceTitle: '어디서나 사용',
      featureDeviceText: '웹 기반 변환 도구',
      howTitle: '{input}을 {output}로 변환하는 방법',
      stepUploadDetail: '파일을 끌어다 놓거나 업로드 버튼을 눌러 선택하세요.',
      stepPrepareDetail: '파일 상태와 원하는 결과에 맞게 변환 옵션을 선택하세요.',
      stepDownloadDetail: '변환된 파일을 다운로드한 뒤 공유하기 전에 결과를 확인하세요.',
      whyTitle: 'EverythingConvert를 선택하는 이유',
      whyItems: [
        '처음 사용하는 분도 이해하기 쉬운 변환 과정',
        '일상 문서와 이미지에 적합한 깔끔한 결과',
        '별도 프로그램 설치가 필요 없는 웹 기반 사용',
        '가능한 경우 브라우저 안에서 먼저 처리하는 개인정보 보호 방식',
        'PDF, 이미지, 오피스, 비디오, 오디오, GIF 도구를 한곳에서 제공'
      ],
      guideTitle: '더 좋은 결과를 위한 사용 가이드',
      guideIntro: '파일을 조금만 준비해도 변환 결과가 훨씬 좋아집니다. 특히 표, 이미지, 스캔본, 복잡한 문서 형식이 들어간 파일은 아래 내용을 확인해 주세요.',
      bestTitle: '사용하기 좋은 파일',
      bestItems: [
        '업로드하기 전에 내 기기에서 정상적으로 열리는 파일을 사용하세요.',
        '스캔 문서는 글자가 선명하고 기울어짐이 적은 파일이 좋습니다.',
        '이미지나 미디어 파일은 큰 파일을 변환하기 전에 작은 파일로 먼저 테스트하면 좋습니다.'
      ],
      fixesTitle: '자주 생기는 문제와 해결 방법',
      fixesItems: [
        '문서 형식이 다르게 보이면 작은 페이지 범위나 단순한 복사본으로 다시 시도해 보세요.',
        '브라우저 미디어 변환이 느리면 파일 용량이나 영상 길이를 먼저 줄이는 것이 좋습니다.',
        '다운로드한 파일이 열리지 않으면 원본 파일을 새로 준비해서 다시 변환해 보세요.'
      ],
      privacyTitle: '개인정보 보호 안내',
      privacyText: '많은 변환은 사용자의 브라우저 안에서 직접 처리됩니다. 서버 기능이 필요한 경우에도 변환에 필요한 범위로만 처리하고 불필요한 파일 접근을 피합니다.',
      faqTitle: '자주 묻는 질문',
      faqs: [
        ['프로그램을 설치해야 하나요?', '아니요. EverythingConvert 도구는 최신 웹 브라우저에서 바로 사용할 수 있도록 만들었습니다.'],
        ['변환 결과가 항상 원본과 완전히 같나요?', '단순한 파일은 대체로 깔끔하게 변환됩니다. 복잡한 레이아웃, 스캔본, 특수 글꼴은 결과 확인이 필요할 수 있습니다.'],
        ['휴대폰에서도 사용할 수 있나요?', '네. 모바일 브라우저에서도 사용할 수 있습니다. 다만 큰 파일은 컴퓨터에서 작업하는 것이 더 안정적입니다.']
      ],
      relatedTitle: '함께 쓰기 좋은 {category} 도구',
      securityTitle: '파일을 안전하게 보호합니다',
      securityText: 'EverythingConvert는 모든 변환 도구에서 보안과 개인정보 보호를 중요하게 생각합니다.',
      secureTransfer: '안전한 전송',
      secureTransferText: '보호된 브라우저 세션',
      autoDelete: '자동 파일 삭제',
      autoDeleteText: '임시 파일은 작업 후 제거',
      noAccess: '불필요한 접근 없음',
      noAccessText: '내 파일은 비공개로 유지'
    },
    de: {
      featureFastTitle: 'Schnelle Konvertierung',
      featureFastText: 'In Sekunden starten',
      featureAccuracyTitle: 'Hohe Genauigkeit',
      featureAccuracyText: 'Formatierung klar halten',
      featurePrivacyTitle: 'Sicher & privat',
      featurePrivacyText: 'Dateien werden sorgfältig behandelt',
      featureDeviceTitle: 'Überall nutzbar',
      featureDeviceText: 'Webbasierter Konverter',
      howTitle: '{input} in {output} konvertieren',
      stepUploadDetail: 'Ziehen Sie Ihre Datei hierher oder wählen Sie sie über die Upload-Schaltfläche aus.',
      stepPrepareDetail: 'Wählen Sie Einstellungen, die zu Ihrer Datei und zum gewünschten Ergebnis passen.',
      stepDownloadDetail: 'Laden Sie die konvertierte Datei herunter und prüfen Sie das Ergebnis vor dem Teilen.',
      whyTitle: 'Warum EverythingConvert?',
      whyItems: ['Einfacher und schneller Ablauf', 'Saubere Ergebnisse für Alltagsdateien', 'Keine Softwareinstallation nötig', 'Browser-first Datenschutz, wo möglich', 'Tools für PDF, Bilder, Office, Video, Audio und GIF'],
      guideTitle: 'Hilfreiche Tipps für bessere Ergebnisse',
      guideIntro: 'Eine gute Vorbereitung verbessert die Ausgabe, besonders bei Tabellen, Bildern, Scans oder gemischten Layouts.',
      bestTitle: 'Geeignete Dateien',
      bestItems: ['Nutzen Sie Dateien, die auf Ihrem Gerät korrekt geöffnet werden.', 'Bei Scans hilft eine klare, gerade Vorlage.', 'Testen Sie große Bild- oder Mediendateien zuerst mit kleineren Beispielen.'],
      fixesTitle: 'Häufige Probleme und Lösungen',
      fixesItems: ['Wenn das Layout anders aussieht, versuchen Sie einen kleineren Seitenbereich.', 'Wenn Medienkonvertierung langsam ist, reduzieren Sie Größe oder Länge.', 'Wenn eine Datei nicht geöffnet wird, konvertieren Sie erneut mit einer frischen Quelle.'],
      privacyTitle: 'Datenschutzhinweis',
      privacyText: 'Viele Konvertierungen laufen direkt im Browser. Wenn Serverfunktionen nötig sind, beschränken wir die Verarbeitung auf die Aufgabe.',
      faqTitle: 'Häufige Fragen',
      faqs: [['Muss ich Software installieren?', 'Nein. Die Tools funktionieren in modernen Browsern.'], ['Ist das Ergebnis immer perfekt?', 'Einfache Dateien gelingen meist sauber. Komplexe Layouts sollten geprüft werden.'], ['Funktioniert es auf Mobilgeräten?', 'Ja, große Dateien sind jedoch auf Desktop oder Laptop einfacher.']],
      relatedTitle: 'Weitere {category}-Tools',
      securityTitle: 'Ihre Dateien sind bei uns sicher',
      securityText: 'Sichere Abläufe und Datenschutz stehen im Mittelpunkt.',
      secureTransfer: 'Sichere Übertragung',
      secureTransferText: 'Geschützte Browsersitzungen',
      autoDelete: 'Automatische Löschung',
      autoDeleteText: 'Temporäre Dateien werden entfernt',
      noAccess: 'Kein unnötiger Zugriff',
      noAccessText: 'Ihre Dateien bleiben privat'
    },
    es: {
      featureFastTitle: 'Conversión rápida',
      featureFastText: 'Empieza en segundos',
      featureAccuracyTitle: 'Alta precisión',
      featureAccuracyText: 'Mantén el formato claro',
      featurePrivacyTitle: 'Seguro y privado',
      featurePrivacyText: 'Archivos tratados con cuidado',
      featureDeviceTitle: 'Funciona en todas partes',
      featureDeviceText: 'Convertidor web',
      howTitle: 'Cómo convertir {input} a {output}',
      stepUploadDetail: 'Arrastra tu archivo o usa el botón de subida.',
      stepPrepareDetail: 'Elige las opciones adecuadas para tu archivo y resultado.',
      stepDownloadDetail: 'Descarga el archivo convertido y revisa el resultado antes de compartirlo.',
      whyTitle: 'Por qué elegir EverythingConvert',
      whyItems: ['Flujo rápido y sencillo', 'Resultados limpios para archivos comunes', 'No requiere instalar software', 'Privacidad primero en el navegador cuando sea posible', 'Herramientas para PDF, imagen, oficina, video, audio y GIF'],
      guideTitle: 'Guía para obtener mejores resultados',
      guideIntro: 'Preparar un poco el archivo ayuda mucho, sobre todo con tablas, imágenes, escaneos o formatos mixtos.',
      bestTitle: 'Archivos recomendados',
      bestItems: ['Usa archivos que se abran correctamente en tu dispositivo.', 'Para escaneos, elige la versión más clara.', 'Para imágenes y medios grandes, prueba primero con un archivo pequeño.'],
      fixesTitle: 'Problemas comunes y soluciones',
      fixesItems: ['Si el formato cambia, prueba con menos páginas o una copia más simple.', 'Si un video tarda mucho, reduce tamaño o duración.', 'Si el archivo descargado no abre, repite la conversión con un original nuevo.'],
      privacyTitle: 'Nota de privacidad',
      privacyText: 'Muchas conversiones se ejecutan en tu navegador. Cuando se necesita servidor, limitamos el uso a la tarea de conversión.',
      faqTitle: 'Preguntas frecuentes',
      faqs: [['¿Necesito instalar software?', 'No. Las herramientas funcionan en navegadores modernos.'], ['¿El resultado siempre será perfecto?', 'Los archivos simples suelen salir bien. Los diseños complejos deben revisarse.'], ['¿Funciona en móvil?', 'Sí, aunque los archivos grandes son más cómodos en ordenador.']],
      relatedTitle: 'Más herramientas de {category}',
      securityTitle: 'Tus archivos están seguros',
      securityText: 'Usamos flujos seguros y priorizamos la privacidad.',
      secureTransfer: 'Transferencia segura',
      secureTransferText: 'Sesiones protegidas',
      autoDelete: 'Eliminación automática',
      autoDeleteText: 'Archivos temporales eliminados',
      noAccess: 'Sin acceso innecesario',
      noAccessText: 'Tus archivos siguen privados'
    },
    fr: {
      featureFastTitle: 'Conversion rapide',
      featureFastText: 'Commencez en quelques secondes',
      featureAccuracyTitle: 'Haute précision',
      featureAccuracyText: 'Gardez un format clair',
      featurePrivacyTitle: 'Sécurisé et privé',
      featurePrivacyText: 'Fichiers traités avec soin',
      featureDeviceTitle: 'Fonctionne partout',
      featureDeviceText: 'Convertisseur web',
      howTitle: 'Comment convertir {input} en {output}',
      stepUploadDetail: 'Déposez votre fichier ou choisissez-le avec le bouton d’envoi.',
      stepPrepareDetail: 'Choisissez les réglages adaptés au fichier et au résultat souhaité.',
      stepDownloadDetail: 'Téléchargez le fichier converti et vérifiez le résultat avant de le partager.',
      whyTitle: 'Pourquoi choisir EverythingConvert ?',
      whyItems: ['Flux simple et rapide', 'Résultats propres pour les fichiers courants', 'Aucune installation nécessaire', 'Confidentialité côté navigateur quand c’est possible', 'Outils PDF, image, office, vidéo, audio et GIF'],
      guideTitle: 'Guide pour de meilleurs résultats',
      guideIntro: 'Une petite préparation améliore la conversion, surtout avec des tableaux, images, scans ou mises en page mixtes.',
      bestTitle: 'Fichiers recommandés',
      bestItems: ['Utilisez des fichiers qui s’ouvrent correctement sur votre appareil.', 'Pour les scans, choisissez la version la plus nette.', 'Pour les grandes images ou vidéos, testez d’abord un petit fichier.'],
      fixesTitle: 'Problèmes fréquents et solutions',
      fixesItems: ['Si la mise en page change, essayez moins de pages ou une copie plus simple.', 'Si la conversion média est lente, réduisez la taille ou la durée.', 'Si le fichier téléchargé ne s’ouvre pas, recommencez avec une source propre.'],
      privacyTitle: 'Note de confidentialité',
      privacyText: 'De nombreuses conversions se font dans le navigateur. Quand un serveur est nécessaire, nous limitons le traitement à la conversion.',
      faqTitle: 'Questions fréquentes',
      faqs: [['Dois-je installer un logiciel ?', 'Non. Les outils fonctionnent dans les navigateurs modernes.'], ['Le résultat sera-t-il toujours parfait ?', 'Les fichiers simples se convertissent bien. Les mises en page complexes doivent être vérifiées.'], ['Puis-je utiliser le site sur mobile ?', 'Oui, mais les gros fichiers sont plus pratiques sur ordinateur.']],
      relatedTitle: 'Autres outils {category}',
      securityTitle: 'Vos fichiers sont en sécurité',
      securityText: 'Nous utilisons des flux sécurisés et plaçons la confidentialité au centre.',
      secureTransfer: 'Transfert sécurisé',
      secureTransferText: 'Sessions protégées',
      autoDelete: 'Suppression automatique',
      autoDeleteText: 'Fichiers temporaires supprimés',
      noAccess: 'Aucun accès inutile',
      noAccessText: 'Vos fichiers restent privés'
    }
  };

  function currentLanguage() {
    const fromDom = document.documentElement.lang;
    if (localizedContent[fromDom]) return fromDom;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (localizedContent[fromUrl]) return fromUrl;
      const saved = localStorage.getItem('everything_convert_language');
      if (localizedContent[saved]) return saved;
    } catch (error) {
      // Keep English fallback.
    }
    return 'en';
  }

  function tr(key, replacements = {}, language = currentLanguage()) {
    const pack = localizedContent[language] || localizedContent.en;
    let value = pack[key] || localizedContent.en[key] || key;
    if (typeof value !== 'string') return value;
    Object.entries(replacements).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, replacement);
    });
    return value;
  }

  function list(key, language = currentLanguage()) {
    const pack = localizedContent[language] || localizedContent.en;
    return pack[key] || localizedContent.en[key] || [];
  }

  function currentFileName() {
    return decodeURIComponent(location.pathname.split('/').pop() || '');
  }

  function rootPrefix() {
    return location.pathname.split('/').length > 2 ? '../' : '';
  }

  function pageMeta() {
    const file = currentFileName();
    return pageData[file] || {
      category: 'Tools',
      title: document.title.replace(' - Everything Convert', '') || 'File Converter',
      accent: 'File',
      description: 'Convert files quickly and securely with EverythingConvert.',
      input: 'FILE',
      output: 'OUT',
      iconIn: 'fa-file',
      iconOut: 'fa-file-arrow-down',
      drop: 'Drag & drop your file here',
      max: 'Files are processed securely.',
      steps: ['Upload your file', 'Choose conversion options', 'Download your result'],
      related: ['PDF to Word', 'Image to PDF', 'Video to GIF', 'Excel to PDF', 'Image Converter']
    };
  }

  function ensureFontAwesome() {
    if (document.querySelector('link[href*="font-awesome"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }

  function normalizeTitle(title, accent) {
    const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (!accent || !safeTitle.includes(accent)) return safeTitle;
    return safeTitle.replace(accent, `<span class="ec-title-accent">${accent}</span>`);
  }

  function addBreadcrumb(meta) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-breadcrumb')) return;
    const shell = document.createElement('div');
    shell.className = 'ec-tool-shell';
    shell.innerHTML = `
      <nav class="ec-breadcrumb" aria-label="Breadcrumb">
        <a href="${rootPrefix()}index.html">Home</a>
        <i class="fa-solid fa-chevron-right"></i>
        <a href="${rootPrefix()}index.html#tools">${meta.category}</a>
        <i class="fa-solid fa-chevron-right"></i>
        <span>${meta.title}</span>
      </nav>
    `;
    main.parentNode.insertBefore(shell, main);
  }

  function enhanceHeader() {
    const nav = document.querySelector('header .top-nav');
    if (!nav || nav.dataset.ecHeaderEnhanced) return;
    nav.dataset.ecHeaderEnhanced = 'true';
    const prefix = rootPrefix();
    const loginLink = nav.querySelector('[data-auth-login], a[href$="auth.html"]');
    const labels = Array.from(nav.querySelectorAll('a,button')).map((node) => node.textContent.trim());
    const categoryLinks = [
      ['All Tools', `${prefix}index.html#tools`],
      ['Image', `${prefix}index.html#tool-browser`],
      ['Video & Audio', `${prefix}index.html#tool-browser`],
      ['Office', `${prefix}index.html#tool-browser`],
      ['AI Tools', `${prefix}index.html#ai-preview`],
      ['Developer', `${prefix}index.html#tool-browser`],
      ['Pricing', `${prefix}pricing.html`]
    ];
    categoryLinks.forEach(([label, href]) => {
      if (labels.includes(label)) return;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      nav.insertBefore(link, loginLink || null);
    });
    if (!labels.includes('PDF') && !nav.querySelector('.ec-pdf-menu')) {
      const pdfMenu = document.createElement('div');
      pdfMenu.className = 'tools-menu ec-pdf-menu';
      pdfMenu.innerHTML = `
        <button class="tools-toggle" type="button" aria-expanded="false">PDF</button>
        <div class="tools-dropdown mega-tools">
          <div class="tools-group">
            <div class="tools-group-title">Convert</div>
            <a href="${prefix}pdf to word/pdf-to-word.html">PDF to Word</a>
            <a href="${prefix}pdf to excel/pdf-to-excel.html">PDF to Excel</a>
            <a href="${prefix}pdf to jpg/pdf-to-jpg.html">PDF to JPG</a>
            <a href="${prefix}excel to pdf/excel-to-pdf.html">Excel to PDF</a>
            <a href="${prefix}docx to pdf/docx-to-pdf.html">DOCX to PDF</a>
            <a href="${prefix}pdf to epub/pdf-to-epub.html">PDF to EPUB</a>
          </div>
          <div class="tools-group">
            <div class="tools-group-title">Tools</div>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=merge">Merge PDF</a>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=compress">Compress PDF</a>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=split">Split PDF</a>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=rotate">Rotate PDF</a>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=remove">Remove Pages</a>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=extract">Extract Pages</a>
            <a href="${prefix}pdf tools/pdf-tools.html?mode=organize">Organize PDF</a>
            <a href="${prefix}qr code generator/qr-code-generator.html">QR Code Generator</a>
            <a href="${prefix}json to csv/json-to-csv.html">JSON to CSV</a>
          </div>
        </div>
      `;
      const allToolsLink = Array.from(nav.querySelectorAll('a')).find((link) => link.textContent.trim() === 'All Tools');
      nav.insertBefore(pdfMenu, allToolsLink ? allToolsLink.nextSibling : (loginLink || null));
    }
    if (!nav.querySelector('.ec-tool-search')) {
      const search = document.createElement('label');
      search.className = 'ec-tool-search';
      search.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Search tools..." aria-label="Search tools">';
      nav.insertBefore(search, loginLink || null);
    }
    if (!nav.querySelector('.ec-try-pro')) {
      const tryPro = document.createElement('a');
      tryPro.className = 'ec-try-pro';
      tryPro.href = `${prefix}pricing.html`;
      tryPro.textContent = 'Try Pro';
      nav.appendChild(tryPro);
    }
  }

  function enhanceHero(meta) {
    const hero = document.querySelector('main .hero') || document.querySelector('.hero');
    if (!hero || hero.dataset.ecEnhanced) return;
    hero.dataset.ecEnhanced = 'true';
    hero.innerHTML = `
      <div class="ec-tool-flow-icon" aria-hidden="true">
        <span class="ec-file-badge"><i class="fa-solid ${meta.iconIn}"></i></span>
        <i class="fa-solid fa-arrow-right"></i>
        <span class="ec-file-badge ec-output"><i class="fa-solid ${meta.iconOut}"></i></span>
      </div>
      <h1>${normalizeTitle(meta.title, meta.accent)}</h1>
      <p>${meta.description}</p>
      <div class="ec-tool-chips" aria-label="Tool benefits">
        <span><i class="fa-regular fa-circle-check"></i> Free to use</span>
        <span><i class="fa-regular fa-user"></i> No signup required</span>
        <span><i class="fa-solid fa-shield-halved"></i> Secure & Private</span>
        <span><i class="fa-regular fa-gem"></i> High Quality</span>
      </div>
    `;
  }

  function enhanceDropZone(meta) {
    const dropZone = document.getElementById('dropZone') || document.querySelector('.drop-zone');
    if (!dropZone || dropZone.dataset.ecEnhanced) return;
    dropZone.dataset.ecEnhanced = 'true';
    const fileInput = dropZone.querySelector('input[type="file"]') || document.getElementById('fileInput');
    if (!dropZone.querySelector('.ec-drop-cloud')) {
      dropZone.insertAdjacentHTML('afterbegin', '<div class="ec-drop-cloud"><i class="fa-solid fa-file-arrow-up"></i></div>');
    }
    const title = dropZone.querySelector('#dropTitle, .drop-title, h2, strong, p:first-of-type');
    if (title) title.textContent = meta.drop;
    const subtitle = dropZone.querySelector('.drop-subtitle, p:last-of-type, span');
    if (subtitle && subtitle !== title) subtitle.textContent = 'or choose a file from your device';
    const oldIcons = dropZone.querySelectorAll('.drop-icon, svg:not(.fa-solid)');
    oldIcons.forEach(i => i.style.display = 'none');
    const oldBtn = dropZone.querySelector('.browse-btn');
    if (oldBtn) oldBtn.style.display = 'none';
    if (!dropZone.querySelector('.ec-choose-file')) {
      const chooseButton = document.createElement('button');
      chooseButton.className = 'primary-btn ec-choose-file';
      chooseButton.type = 'button';
      chooseButton.textContent = 'Choose File';
      if (fileInput) dropZone.insertBefore(chooseButton, fileInput);
      else dropZone.appendChild(chooseButton);
    }
    if (!dropZone.querySelector('.ec-file-note')) {
      const note = document.createElement('div');
      note.className = 'ec-file-note';
      note.textContent = meta.max;
      if (fileInput) dropZone.insertBefore(note, fileInput);
      else dropZone.appendChild(note);
    }
    const newInput = fileInput || dropZone.querySelector('input[type="file"]');
    const choose = dropZone.querySelector('.ec-choose-file');
    if (choose && newInput) {
      choose.addEventListener('click', (event) => {
        event.stopPropagation();
        newInput.click();
      });
    }
  }

  function addFeatureStrip(language = currentLanguage()) {
    const main = document.querySelector('main');
    const toolCard = document.querySelector('.tool-card') || document.querySelector('.converter-card') || document.querySelector('.upload-card');
    if (!main || !toolCard || document.querySelector('.ec-feature-strip')) return;
    const strip = document.createElement('section');
    strip.className = 'ec-feature-strip';
    strip.innerHTML = `
      <article><i class="fa-solid fa-gauge-high"></i><strong>${tr('featureFastTitle', {}, language)}</strong><span>${tr('featureFastText', {}, language)}</span></article>
      <article><i class="fa-regular fa-square-check"></i><strong>${tr('featureAccuracyTitle', {}, language)}</strong><span>${tr('featureAccuracyText', {}, language)}</span></article>
      <article><i class="fa-solid fa-shield-halved"></i><strong>${tr('featurePrivacyTitle', {}, language)}</strong><span>${tr('featurePrivacyText', {}, language)}</span></article>
      <article><i class="fa-solid fa-display"></i><strong>${tr('featureDeviceTitle', {}, language)}</strong><span>${tr('featureDeviceText', {}, language)}</span></article>
    `;
    toolCard.insertAdjacentElement('afterend', strip);
  }

  function addInfoSections(meta, language = currentLanguage()) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-info-grid')) return;
    const input = meta.input;
    const output = meta.output;
    const stepDetails = [tr('stepUploadDetail', {}, language), tr('stepPrepareDetail', {}, language), tr('stepDownloadDetail', {}, language)];
    const info = document.createElement('section');
    info.className = 'ec-info-grid';
    info.innerHTML = `
      <article class="ec-info-panel">
        <h2>${tr('howTitle', { input, output }, language)}</h2>
        <ol class="ec-step-list">
          ${meta.steps.map((step, index) => `
            <li><b>${index + 1}</b><div><strong>${step}</strong><span>${stepDetails[index] || stepDetails[2]}</span></div></li>
          `).join('')}
        </ol>
      </article>
      <article class="ec-info-panel">
        <h2>${tr('whyTitle', {}, language)}</h2>
        <ul class="ec-check-list">
          ${list('whyItems', language).map((item) => `<li><i class="fa-solid fa-check"></i><span>${item}</span></li>`).join('')}
        </ul>
        <div class="ec-mini-flow" aria-hidden="true">
          <span class="ec-file-badge"><i class="fa-solid ${meta.iconIn}"></i></span>
          <i class="fa-solid fa-arrow-right"></i>
          <span class="ec-file-badge ec-output"><i class="fa-solid ${meta.iconOut}"></i></span>
        </div>
      </article>
    `;
    main.appendChild(info);
  }

  function addSeoGuide(meta, language = currentLanguage()) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-seo-guide')) return;
    const guide = document.createElement('section');
    guide.className = 'ec-seo-guide';
    guide.innerHTML = `
      <div class="ec-guide-copy">
        <p class="ec-guide-kicker">${meta.category}</p>
        <h2>${tr('guideTitle', {}, language)}</h2>
        <p>${tr('guideIntro', {}, language)}</p>
      </div>
      <div class="ec-guide-grid">
        <article>
          <i class="fa-solid fa-file-circle-check"></i>
          <h3>${tr('bestTitle', {}, language)}</h3>
          <ul>${list('bestItems', language).map((item) => `<li>${item}</li>`).join('')}</ul>
        </article>
        <article>
          <i class="fa-solid fa-screwdriver-wrench"></i>
          <h3>${tr('fixesTitle', {}, language)}</h3>
          <ul>${list('fixesItems', language).map((item) => `<li>${item}</li>`).join('')}</ul>
        </article>
        <article>
          <i class="fa-solid fa-user-shield"></i>
          <h3>${tr('privacyTitle', {}, language)}</h3>
          <p>${tr('privacyText', {}, language)}</p>
        </article>
      </div>
      <div class="ec-faq-list">
        <h2>${tr('faqTitle', {}, language)}</h2>
        ${list('faqs', language).map(([question, answer]) => `
          <details>
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>
        `).join('')}
      </div>
    `;
    main.appendChild(guide);
  }

  function addRelated(meta, language = currentLanguage()) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-related')) return;
    const related = document.createElement('section');
    related.className = 'ec-related';
    related.innerHTML = `
      <h2>${tr('relatedTitle', { category: meta.category }, language)}</h2>
      <div class="ec-related-grid">
        ${meta.related.map((name) => {
          const link = relatedLinks[name] || ['index.html#tools', 'fa-wand-magic-sparkles', 'Explore this tool'];
          return `<a href="${rootPrefix()}${link[0]}"><i class="fa-solid ${link[1]}"></i><strong>${name}</strong><span>${link[2]}</span></a>`;
        }).join('')}
      </div>
    `;
    main.appendChild(related);
  }

  function addSecurityBand(language = currentLanguage()) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-security-band')) return;
    const band = document.createElement('section');
    band.className = 'ec-security-band';
    band.innerHTML = `
      <div><h2>${tr('securityTitle', {}, language)}</h2><p>${tr('securityText', {}, language)}</p></div>
      <div class="ec-security-item"><i class="fa-solid fa-shield-halved"></i><strong>${tr('secureTransfer', {}, language)}</strong><span>${tr('secureTransferText', {}, language)}</span></div>
      <div class="ec-security-item"><i class="fa-regular fa-trash-can"></i><strong>${tr('autoDelete', {}, language)}</strong><span>${tr('autoDeleteText', {}, language)}</span></div>
      <div class="ec-security-item"><i class="fa-regular fa-user"></i><strong>${tr('noAccess', {}, language)}</strong><span>${tr('noAccessText', {}, language)}</span></div>
    `;
    main.appendChild(band);
  }

  function renderLocalizedSections(meta, language = currentLanguage()) {
    document.querySelectorAll('.ec-feature-strip, .ec-info-grid, .ec-seo-guide, .ec-related, .ec-security-band').forEach((node) => node.remove());
    addFeatureStrip(language);
    addInfoSections(meta, language);
    addSeoGuide(meta, language);
    addRelated(meta, language);
    addSecurityBand(language);
  }

  function fixFooterText() {
    document.querySelectorAll('.footer-bottom p').forEach((node) => {
      if (node.textContent.includes('EverythingConvert.com')) {
        node.textContent = '\u00a9 EverythingConvert.com v.00 All rights reserved (2026)';
      }
    });
    document.querySelectorAll('[data-language="ko"]').forEach((node) => { node.textContent = '한국어'; });
    document.querySelectorAll('[data-language="es"]').forEach((node) => { node.textContent = 'Español'; });
    document.querySelectorAll('[data-language="fr"]').forEach((node) => { node.textContent = 'Français'; });
  }

  function init() {
    const meta = pageMeta();
    ensureFontAwesome();
    document.body.classList.add('ec-tool-page');
    enhanceHeader();
    addBreadcrumb(meta);
    enhanceHero(meta);
    enhanceDropZone(meta);
    renderLocalizedSections(meta);
    window.addEventListener('everything-language-change', (event) => {
      renderLocalizedSections(meta, event.detail.language);
    });
    fixFooterText();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
