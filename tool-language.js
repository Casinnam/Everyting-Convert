(function () {
  const common = {
    en: {
      pdfDocuments: 'PDF & Documents',
      image: 'Image',
      media: 'Video & Audio',
      gif: 'GIF',
      dropFile: 'Click or drop a file here',
      dropPdf: 'Click or drop a PDF file here',
      dropImage: 'Click or drop image files here',
      dropExcel: 'Click or drop an Excel/CSV file here',
      dropDocx: 'Click or drop a DOCX file here',
      browse: 'Choose file',
      browseImages: 'Choose images',
      convert: 'Convert',
      convertToPdf: 'Convert to PDF',
      savePdf: 'Save PDF',
      noFile: 'No file selected.',
      settings: 'Conversion settings',
      outputFormat: 'Output format',
      pageNumbers: 'Page numbers',
      pageRange: 'Page range',
      allPages: 'All pages',
      firstPage: 'First page only',
      customPages: 'Custom pages',
      pageNumberInput: 'Page numbers (ex: 1,3,5-8)',
      resolution: 'Resolution (DPI)',
      jpgQuality: 'JPG quality',
      conversionMode: 'Conversion mode',
      simpleExtraction: 'Standard text extraction',
      enhancedExtraction: 'Enhanced table detection (Pro)',
      sheetStructure: 'Sheet structure',
      sheetPerPage: 'Create one sheet per page',
      tableSensitivity: 'Table detection sensitivity',
      normal: 'Normal',
      loose: 'Loose',
      strict: 'Strict',
      pageSize: 'Page size',
      originalImageSize: 'Original image size',
      fitMode: 'Fit mode',
      contain: 'Fit entire image',
      cover: 'Fill page',
      stretch: 'Stretch to page',
      margin: 'Margin mm',
      reset: 'Start over',
    },
    ko: {
      pdfDocuments: 'PDF & 문서',
      image: '이미지',
      media: '비디오 & 오디오',
      gif: 'GIF',
      dropFile: '파일을 클릭하거나 여기에 끌어오세요',
      dropPdf: 'PDF 파일을 클릭하거나 여기에 끌어오세요',
      dropImage: '이미지 파일을 클릭하거나 여기에 끌어오세요',
      dropExcel: 'Excel/CSV 파일을 클릭하거나 여기에 끌어오세요',
      dropDocx: 'DOCX 파일을 클릭하거나 여기에 끌어오세요',
      browse: '파일 선택',
      browseImages: '이미지 선택',
      convert: '변환',
      convertToPdf: 'PDF로 변환',
      savePdf: 'PDF 저장',
      noFile: '선택된 파일이 없습니다.',
      settings: '변환 설정',
      outputFormat: '출력 형식',
      pageNumbers: '페이지 번호',
      pageRange: '페이지 범위',
      allPages: '모든 페이지',
      firstPage: '첫 페이지만',
      customPages: '직접 입력',
      pageNumberInput: '페이지 번호 (예: 1,3,5-8)',
      resolution: '해상도 (DPI)',
      jpgQuality: 'JPG 품질',
      conversionMode: '변환 모드',
      simpleExtraction: '일반 텍스트 추출',
      enhancedExtraction: '표 감지 강화형 (Pro)',
      sheetStructure: '시트 구성',
      sheetPerPage: '페이지별 시트 생성',
      tableSensitivity: '표 감지 민감도',
      normal: '기본',
      loose: '느슨하게',
      strict: '정확하게',
      pageSize: '페이지 크기',
      originalImageSize: '이미지 원본 크기',
      fitMode: '맞춤 방식',
      contain: '전체 보이기',
      cover: '페이지 채우기',
      stretch: '페이지에 맞게 늘리기',
      margin: '여백 mm',
      reset: '처음부터 다시',
    },
    de: {
      pdfDocuments: 'PDF & Dokumente',
      image: 'Bild',
      media: 'Video & Audio',
      gif: 'GIF',
      dropFile: 'Datei anklicken oder hier ablegen',
      dropPdf: 'PDF-Datei anklicken oder hier ablegen',
      dropImage: 'Bilddateien anklicken oder hier ablegen',
      dropExcel: 'Excel-/CSV-Datei anklicken oder hier ablegen',
      dropDocx: 'DOCX-Datei anklicken oder hier ablegen',
      browse: 'Datei wählen',
      browseImages: 'Bilder wählen',
      convert: 'Konvertieren',
      convertToPdf: 'In PDF konvertieren',
      savePdf: 'PDF speichern',
      noFile: 'Keine Datei ausgewählt.',
      settings: 'Konvertierungseinstellungen',
      outputFormat: 'Ausgabeformat',
      pageNumbers: 'Seitennummern',
      pageRange: 'Seitenbereich',
      allPages: 'Alle Seiten',
      firstPage: 'Nur erste Seite',
      customPages: 'Eigene Eingabe',
      pageNumberInput: 'Seitennummern (z. B. 1,3,5-8)',
      resolution: 'Auflösung (DPI)',
      jpgQuality: 'JPG-Qualität',
      conversionMode: 'Konvertierungsmodus',
      simpleExtraction: 'Standard-Textextraktion',
      enhancedExtraction: 'Erweiterte Tabellenerkennung (Pro)',
      sheetStructure: 'Blattstruktur',
      sheetPerPage: 'Ein Blatt pro Seite erstellen',
      tableSensitivity: 'Tabellenerkennungs-Empfindlichkeit',
      normal: 'Normal',
      loose: 'Locker',
      strict: 'Streng',
      pageSize: 'Seitengröße',
      originalImageSize: 'Originalbildgröße',
      fitMode: 'Anpassung',
      contain: 'Ganzes Bild anzeigen',
      cover: 'Seite füllen',
      stretch: 'Auf Seite strecken',
      margin: 'Rand mm',
      reset: 'Neu starten',
    },
    es: {
      pdfDocuments: 'PDF y documentos',
      image: 'Imagen',
      media: 'Video y audio',
      gif: 'GIF',
      dropFile: 'Haz clic o suelta un archivo aquí',
      dropPdf: 'Haz clic o suelta un PDF aquí',
      dropImage: 'Haz clic o suelta imágenes aquí',
      dropExcel: 'Haz clic o suelta un archivo Excel/CSV aquí',
      dropDocx: 'Haz clic o suelta un DOCX aquí',
      browse: 'Elegir archivo',
      browseImages: 'Elegir imágenes',
      convert: 'Convertir',
      convertToPdf: 'Convertir a PDF',
      savePdf: 'Guardar PDF',
      noFile: 'No hay archivo seleccionado.',
      settings: 'Ajustes de conversión',
      outputFormat: 'Formato de salida',
      pageNumbers: 'Números de página',
      pageRange: 'Rango de páginas',
      allPages: 'Todas las páginas',
      firstPage: 'Solo la primera página',
      customPages: 'Entrada personalizada',
      pageNumberInput: 'Números de página (ej: 1,3,5-8)',
      resolution: 'Resolución (DPI)',
      jpgQuality: 'Calidad JPG',
      conversionMode: 'Modo de conversión',
      simpleExtraction: 'Extracción de texto estándar',
      enhancedExtraction: 'Detección avanzada de tablas (Pro)',
      sheetStructure: 'Estructura de hojas',
      sheetPerPage: 'Crear una hoja por página',
      tableSensitivity: 'Sensibilidad de detección de tablas',
      normal: 'Normal',
      loose: 'Flexible',
      strict: 'Estricto',
      pageSize: 'Tamaño de página',
      originalImageSize: 'Tamaño original de imagen',
      fitMode: 'Modo de ajuste',
      contain: 'Mostrar imagen completa',
      cover: 'Llenar página',
      stretch: 'Estirar a la página',
      margin: 'Margen mm',
      reset: 'Empezar de nuevo',
    },
    fr: {
      pdfDocuments: 'PDF et documents',
      image: 'Image',
      media: 'Vidéo et audio',
      gif: 'GIF',
      dropFile: 'Cliquez ou déposez un fichier ici',
      dropPdf: 'Cliquez ou déposez un PDF ici',
      dropImage: 'Cliquez ou déposez des images ici',
      dropExcel: 'Cliquez ou déposez un fichier Excel/CSV ici',
      dropDocx: 'Cliquez ou déposez un DOCX ici',
      browse: 'Choisir un fichier',
      browseImages: 'Choisir des images',
      convert: 'Convertir',
      convertToPdf: 'Convertir en PDF',
      savePdf: 'Enregistrer le PDF',
      noFile: 'Aucun fichier sélectionné.',
      settings: 'Paramètres de conversion',
      outputFormat: 'Format de sortie',
      pageNumbers: 'Numéros de page',
      pageRange: 'Plage de pages',
      allPages: 'Toutes les pages',
      firstPage: 'Première page uniquement',
      customPages: 'Saisie personnalisée',
      pageNumberInput: 'Numéros de page (ex. : 1,3,5-8)',
      resolution: 'Résolution (DPI)',
      jpgQuality: 'Qualité JPG',
      conversionMode: 'Mode de conversion',
      simpleExtraction: 'Extraction de texte standard',
      enhancedExtraction: 'Détection avancée des tableaux (Pro)',
      sheetStructure: 'Structure des feuilles',
      sheetPerPage: 'Créer une feuille par page',
      tableSensitivity: 'Sensibilité de détection des tableaux',
      normal: 'Normal',
      loose: 'Souple',
      strict: 'Strict',
      pageSize: 'Taille de page',
      originalImageSize: 'Taille d’image originale',
      fitMode: 'Mode d’ajustement',
      contain: 'Afficher l’image entière',
      cover: 'Remplir la page',
      stretch: 'Étirer à la page',
      margin: 'Marge mm',
      reset: 'Recommencer',
    },
  };

  const descriptions = {
    pdfWord: {
      category: 'pdfDocuments',
      title: { en: 'PDF to Word', ko: 'PDF를 Word로 변환', de: 'PDF zu Word', es: 'PDF a Word', fr: 'PDF vers Word' },
      description: {
        en: 'Extract text from your PDF and save it as a Word document (.docx) directly in your browser.',
        ko: '브라우저에서 PDF 텍스트를 추출해 Word 문서(.docx)로 저장합니다.',
        de: 'Extrahieren Sie PDF-Text und speichern Sie ihn direkt im Browser als Word-Dokument (.docx).',
        es: 'Extrae texto de tu PDF y guárdalo como documento Word (.docx) directamente en el navegador.',
        fr: 'Extrayez le texte du PDF et enregistrez-le en document Word (.docx) dans le navigateur.',
      },
      drop: 'dropPdf',
      convert: { en: 'Convert to Word', ko: 'Word로 변환', de: 'In Word konvertieren', es: 'Convertir a Word', fr: 'Convertir en Word' },
    },
    pdfJpg: {
      category: 'pdfDocuments',
      title: { en: 'PDF to JPG', ko: 'PDF를 JPG로 변환', de: 'PDF zu JPG', es: 'PDF a JPG', fr: 'PDF vers JPG' },
      description: {
        en: 'Convert PDF pages into JPG images in your browser. No server upload is required.',
        ko: 'PDF 페이지를 브라우저에서 JPG 이미지로 변환합니다. 서버 업로드가 필요 없습니다.',
        de: 'Konvertieren Sie PDF-Seiten im Browser in JPG-Bilder. Kein Server-Upload nötig.',
        es: 'Convierte páginas PDF en imágenes JPG en tu navegador. No se suben archivos al servidor.',
        fr: 'Convertissez les pages PDF en images JPG dans le navigateur. Aucun envoi au serveur.',
      },
      drop: 'dropPdf',
      convert: { en: 'Convert to JPG', ko: 'JPG로 변환', de: 'In JPG konvertieren', es: 'Convertir a JPG', fr: 'Convertir en JPG' },
    },
    pdfExcel: {
      category: 'pdfDocuments',
      title: { en: 'PDF to Excel', ko: 'PDF를 Excel로 변환', de: 'PDF zu Excel', es: 'PDF a Excel', fr: 'PDF vers Excel' },
      description: {
        en: 'Extract text and table-like rows from PDFs, then export them as an Excel workbook (.xlsx).',
        ko: 'PDF의 텍스트와 표 형태의 행을 추출해 Excel 문서(.xlsx)로 저장합니다.',
        de: 'Extrahieren Sie Text und tabellenartige Zeilen aus PDFs und exportieren Sie sie als Excel-Arbeitsmappe.',
        es: 'Extrae texto y filas con estructura de tabla de PDF y expórtalas como Excel (.xlsx).',
        fr: 'Extrayez le texte et les lignes de type tableau des PDF, puis exportez-les en Excel (.xlsx).',
      },
      drop: 'dropPdf',
      convert: { en: 'Convert to Excel', ko: 'Excel로 변환', de: 'In Excel konvertieren', es: 'Convertir a Excel', fr: 'Convertir en Excel' },
    },
    imagePdf: {
      category: 'image',
      title: { en: 'Image to PDF', ko: '이미지를 PDF로 변환', de: 'Bild zu PDF', es: 'Imagen a PDF', fr: 'Image vers PDF' },
      description: {
        en: 'Combine JPG, PNG, WebP, and other images into one PDF in the order you choose.',
        ko: 'JPG, PNG, WebP 등 여러 이미지를 원하는 순서대로 하나의 PDF로 병합합니다.',
        de: 'Kombinieren Sie JPG, PNG, WebP und andere Bilder in der gewünschten Reihenfolge zu einer PDF.',
        es: 'Combina JPG, PNG, WebP y otras imágenes en un PDF en el orden que elijas.',
        fr: 'Fusionnez JPG, PNG, WebP et autres images en un PDF dans l’ordre choisi.',
      },
      drop: 'dropImage',
      browse: 'browseImages',
      convertKey: 'savePdf',
    },
    excelPdf: {
      category: 'pdfDocuments',
      title: { en: 'Excel to PDF', ko: 'Excel을 PDF로 변환', de: 'Excel zu PDF', es: 'Excel a PDF', fr: 'Excel vers PDF' },
      description: {
        en: 'Upload an XLSX, XLS, or CSV file, choose a sheet, and export the table to a clean PDF.',
        ko: 'XLSX, XLS, CSV 파일을 업로드하고 시트를 선택해 깔끔한 PDF로 저장합니다.',
        de: 'Laden Sie XLSX, XLS oder CSV hoch, wählen Sie ein Blatt und exportieren Sie es als PDF.',
        es: 'Sube un XLSX, XLS o CSV, elige una hoja y expórtala como PDF.',
        fr: 'Importez un fichier XLSX, XLS ou CSV, choisissez une feuille et exportez-la en PDF.',
      },
      drop: 'dropExcel',
      convertKey: 'convertToPdf',
    },
    docxPdf: {
      category: 'pdfDocuments',
      title: { en: 'DOCX to PDF', ko: 'DOCX를 PDF로 변환', de: 'DOCX zu PDF', es: 'DOCX a PDF', fr: 'DOCX vers PDF' },
      description: {
        en: 'Convert Word documents to a simple text-based PDF directly in your browser.',
        ko: 'Word 문서를 브라우저에서 간단한 텍스트 기반 PDF로 변환합니다.',
        de: 'Konvertieren Sie Word-Dokumente direkt im Browser in eine einfache PDF.',
        es: 'Convierte documentos Word en un PDF de texto directamente en el navegador.',
        fr: 'Convertissez des documents Word en PDF texte directement dans le navigateur.',
      },
      drop: 'dropDocx',
      convertKey: 'convertToPdf',
    },
    pdfEpub: {
      category: 'pdfDocuments',
      title: { en: 'PDF to EPUB', ko: 'PDF를 EPUB로 변환', de: 'PDF zu EPUB', es: 'PDF a EPUB', fr: 'PDF vers EPUB' },
      description: {
        en: 'Extract readable text from a PDF and package it as a lightweight EPUB ebook.',
        ko: 'PDF에서 읽을 수 있는 텍스트를 추출해 가벼운 EPUB 전자책으로 저장합니다.',
        de: 'Extrahieren Sie lesbaren Text aus PDF und packen Sie ihn als leichtes EPUB.',
        es: 'Extrae texto legible de un PDF y guárdalo como ebook EPUB ligero.',
        fr: 'Extrayez le texte lisible d’un PDF et créez un ebook EPUB léger.',
      },
      drop: 'dropPdf',
      convert: { en: 'Convert to EPUB', ko: 'EPUB로 변환', de: 'In EPUB konvertieren', es: 'Convertir a EPUB', fr: 'Convertir en EPUB' },
    },
    ebook: {
      category: 'pdfDocuments',
      title: { en: 'Ebook Converter', ko: '전자책 변환기', de: 'Ebook-Konverter', es: 'Convertidor de ebooks', fr: 'Convertisseur ebook' },
      description: {
        en: 'Convert EPUB ebooks to a readable PDF by extracting chapter text into a clean document.',
        ko: 'EPUB 전자책의 본문을 추출해 읽기 쉬운 PDF로 변환합니다.',
        de: 'Konvertieren Sie EPUB-Ebooks in eine lesbare PDF mit extrahiertem Kapiteltext.',
        es: 'Convierte ebooks EPUB en PDF legibles extrayendo el texto de los capítulos.',
        fr: 'Convertissez les ebooks EPUB en PDF lisibles en extrayant le texte des chapitres.',
      },
      drop: 'dropFile',
      convert: { en: 'Convert EPUB to PDF', ko: 'EPUB를 PDF로 변환', de: 'EPUB in PDF konvertieren', es: 'Convertir EPUB a PDF', fr: 'Convertir EPUB en PDF' },
    },
    imageConverter: {
      category: 'image',
      title: { en: 'Image Converter', ko: '이미지 변환기', de: 'Bildkonverter', es: 'Convertidor de imágenes', fr: 'Convertisseur d’images' },
      description: {
        en: 'Convert images between common browser-supported formats directly on your device.',
        ko: '브라우저가 지원하는 일반 이미지 형식으로 기기에서 바로 변환합니다.',
        de: 'Konvertieren Sie Bilder direkt auf Ihrem Gerät zwischen gängigen Browserformaten.',
        es: 'Convierte imágenes entre formatos comunes compatibles con el navegador.',
        fr: 'Convertissez des images entre formats courants pris en charge par le navigateur.',
      },
      drop: 'dropImage',
    },
    mediaConverter: {
      category: 'media',
      title: { en: 'Media Converter', ko: '미디어 변환기', de: 'Medienkonverter', es: 'Convertidor multimedia', fr: 'Convertisseur média' },
      description: {
        en: 'Convert video and audio files in your browser with FFmpeg. Large files can take a little time.',
        ko: 'FFmpeg로 브라우저에서 비디오와 오디오 파일을 변환합니다. 큰 파일은 시간이 걸릴 수 있습니다.',
        de: 'Konvertieren Sie Video- und Audiodateien im Browser mit FFmpeg. Große Dateien brauchen etwas Zeit.',
        es: 'Convierte video y audio en el navegador con FFmpeg. Los archivos grandes pueden tardar.',
        fr: 'Convertissez vidéos et audios dans le navigateur avec FFmpeg. Les gros fichiers peuvent prendre du temps.',
      },
      drop: 'dropFile',
    },
    gifConverter: {
      category: 'gif',
      title: { en: 'GIF Converter', ko: 'GIF 변환기', de: 'GIF-Konverter', es: 'Convertidor GIF', fr: 'Convertisseur GIF' },
      description: {
        en: 'Create GIFs from videos or turn GIF/APNG files into other formats with FFmpeg.',
        ko: '비디오로 GIF를 만들거나 GIF/APNG 파일을 다른 형식으로 변환합니다.',
        de: 'Erstellen Sie GIFs aus Videos oder wandeln Sie GIF/APNG-Dateien mit FFmpeg um.',
        es: 'Crea GIF desde videos o convierte GIF/APNG a otros formatos con FFmpeg.',
        fr: 'Créez des GIF depuis des vidéos ou convertissez GIF/APNG avec FFmpeg.',
      },
      drop: 'dropFile',
    },
  };

  const modeTitles = {
    'webp-png': 'WEBP to PNG',
    'jfif-png': 'JFIF to PNG',
    'png-svg': 'PNG to SVG',
    'heic-jpg': 'HEIC to JPG',
    svg: 'SVG Converter',
    audio: 'Audio Converter',
    mp3: 'MP3 Converter',
    'mp4-mp3': 'MP4 to MP3',
    'video-mp3': 'Video to MP3',
    'mov-mp4': 'MOV to MP4',
    'mp4-gif': 'MP4 to GIF',
    'webm-gif': 'WEBM to GIF',
    'apng-gif': 'APNG to GIF',
    'gif-mp4': 'GIF to MP4',
    'image-gif': 'Image to GIF',
  };

  function currentLanguage() {
    if (window.EverythingConvertLanguage && window.EverythingConvertLanguage.get) {
      return window.EverythingConvertLanguage.get();
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || localStorage.getItem('everything_convert_language') || 'en';
  }

  function localText(value, language) {
    if (typeof value === 'string') return value;
    return (value && (value[language] || value.en)) || '';
  }

  function replaceText(element, text) {
    if (!element || !text) return;
    element.textContent = text;
  }

  function replaceButtonText(button, text) {
    if (!button || !text) return;
    const textNode = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.nodeValue = ` ${text}`;
      return;
    }
    const label = button.querySelector('[data-button-label]');
    if (label) {
      label.textContent = text;
      return;
    }
    button.appendChild(document.createTextNode(` ${text}`));
  }

  function replaceLabelText(label, text) {
    if (!label || !text) return;
    const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
    if (textNode) {
      textNode.nodeValue = text;
      return;
    }
    const labelText = label.querySelector('[data-label-text]');
    if (labelText) {
      labelText.textContent = text;
      return;
    }
    label.insertBefore(document.createTextNode(text), label.firstChild);
  }

  function detectTool() {
    const path = decodeURIComponent(window.location.pathname).toLowerCase();
    if (path.includes('/pdf to word/')) return 'pdfWord';
    if (path.includes('/pdf to jpg/')) return 'pdfJpg';
    if (path.includes('/pdf to excel/')) return 'pdfExcel';
    if (path.includes('/image to pdf/')) return 'imagePdf';
    if (path.includes('/excel to pdf/')) return 'excelPdf';
    if (path.includes('/docx to pdf/')) return 'docxPdf';
    if (path.includes('/pdf to epub/')) return 'pdfEpub';
    if (path.includes('/ebook converter/')) return 'ebook';
    if (path.includes('/image converter/')) return 'imageConverter';
    if (path.includes('/media converter/')) return 'mediaConverter';
    if (path.includes('/gif converter/')) return 'gifConverter';
    return null;
  }

  function applyToolLanguage(language = currentLanguage()) {
    const lang = common[language] ? language : 'en';
    const toolKey = detectTool();
    const tool = descriptions[toolKey];
    if (!tool) return;

    const labels = common[lang];
    const params = new URLSearchParams(window.location.search);
    const modeTitle = modeTitles[params.get('mode')];
    const title = modeTitle || localText(tool.title, lang);
    const convertText = localText(tool.convert, lang) || labels[tool.convertKey] || labels.convert;

    document.documentElement.lang = lang;
    document.title = `${title} - Everything Convert`;

    replaceText(document.querySelector('.eyebrow'), labels[tool.category]);
    replaceText(document.querySelector('.hero h1, #pageTitle, .hero-title'), title);
    replaceText(document.querySelector('.hero p, #pageDescription, .hero-subtitle'), localText(tool.description, lang));

    replaceText(document.querySelector('#dropTitle, .drop-zone h2, .drop-title, .drop-zone strong'), labels[tool.drop] || labels.dropFile);
    replaceText(document.querySelector('#dropHint, .drop-zone span:not(.line2), .drop-subtitle'), toolKey === 'imagePdf'
      ? localText({
        en: 'You can select multiple images and reorder them before saving.',
        ko: '여러 이미지를 선택하고 저장 전에 순서를 바꿀 수 있습니다.',
        de: 'Sie können mehrere Bilder auswählen und vor dem Speichern sortieren.',
        es: 'Puedes seleccionar varias imágenes y ordenarlas antes de guardar.',
        fr: 'Vous pouvez choisir plusieurs images et les réordonner avant l’enregistrement.',
      }, lang)
      : '');
    replaceText(document.querySelector('.drop-zone p'), labels[tool.drop] || labels.dropFile);

    document.querySelectorAll('.browse-btn').forEach((button) => replaceButtonText(button, labels[tool.browse] || labels.browse));
    document.querySelectorAll('#convertBtn, .convert-btn, .primary-btn').forEach((button) => replaceButtonText(button, convertText));
    replaceText(document.querySelector('.settings-title'), labels.settings);

    document.querySelectorAll('label').forEach((label) => {
      if (/Output format|출력|Ausgabeformat|Formato|Format de sortie/i.test(label.textContent)) {
        const select = label.querySelector('select');
        label.childNodes[0].nodeValue = labels.outputFormat;
        if (select && !label.contains(select)) label.appendChild(select);
      }
    });

    const fieldLabels = {
      includePageNum: 'pageNumbers',
      pageRange: 'pageRange',
      dpiSelect: 'resolution',
      qualityRange: 'jpgQuality',
      conversionMode: 'conversionMode',
      sheetPerPage: 'sheetStructure',
      sensitivity: 'tableSensitivity',
      pageSize: 'pageSize',
      fitMode: 'fitMode',
      marginInput: 'margin',
    };

    Object.entries(fieldLabels).forEach(([id, key]) => {
      const control = document.getElementById(id);
      const label = control && document.querySelector(`label[for="${id}"]`);
      const fallback = control && control.closest('.setting-item, .option-field')?.querySelector('label');
      replaceLabelText(label || fallback, labels[key]);
    });

    const optionLabels = {
      pageRange: { all: 'allPages', first: 'firstPage', custom: 'customPages' },
      conversionMode: { simple: 'simpleExtraction', enhanced: 'enhancedExtraction' },
      sensitivity: { normal: 'normal', loose: 'loose', strict: 'strict' },
      pageSize: { image: 'originalImageSize' },
      fitMode: { contain: 'contain', cover: 'cover', stretch: 'stretch' },
    };

    Object.entries(optionLabels).forEach(([selectId, options]) => {
      const select = document.getElementById(selectId);
      if (!select) return;
      Object.entries(options).forEach(([value, key]) => {
        const option = select.querySelector(`option[value="${value}"]`);
        replaceText(option, labels[key]);
      });
    });

    const customPageLabel = document.querySelector('#customPageInput label');
    replaceText(customPageLabel, labels.pageNumberInput);

    const sheetPerPage = document.getElementById('sheetPerPage');
    if (sheetPerPage && sheetPerPage.parentElement) {
      Array.from(sheetPerPage.parentElement.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
          node.nodeValue = ` ${labels.sheetPerPage}`;
        }
      });
    }

    replaceButtonText(document.querySelector('#resetBtn'), labels.reset);

    const status = document.querySelector('#status');
    if (status && /No file selected|선택된 파일|Keine Datei|No hay archivo|Aucun fichier/i.test(status.textContent)) {
      status.textContent = labels.noFile;
    }
  }

  window.EverythingConvertToolLanguage = { apply: applyToolLanguage };
  window.addEventListener('everything-language-change', (event) => applyToolLanguage(event.detail.language));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => applyToolLanguage(), 0));
  } else {
    setTimeout(() => applyToolLanguage(), 0);
  }
})();
