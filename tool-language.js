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
      convert: 'Convert',
      convertToPdf: 'Convert to PDF',
      reset: 'Start over',
      noFile: 'No file selected.',
    },
    ko: {
      pdfDocuments: 'PDF & 문서',
      image: '이미지',
      media: '비디오 & 오디오',
      gif: 'GIF',
      dropFile: '파일을 클릭하거나 여기에 놓으세요',
      dropPdf: 'PDF 파일을 클릭하거나 여기에 놓으세요',
      dropImage: '이미지 파일을 클릭하거나 여기에 놓으세요',
      dropExcel: 'Excel/CSV 파일을 클릭하거나 여기에 놓으세요',
      dropDocx: 'DOCX 파일을 클릭하거나 여기에 놓으세요',
      browse: '파일 선택',
      convert: '변환',
      convertToPdf: 'PDF로 변환',
      reset: '처음부터 다시',
      noFile: '선택된 파일이 없습니다.',
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
      convert: 'Konvertieren',
      convertToPdf: 'In PDF konvertieren',
      reset: 'Neu starten',
      noFile: 'Keine Datei ausgewählt.',
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
      convert: 'Convertir',
      convertToPdf: 'Convertir a PDF',
      reset: 'Empezar de nuevo',
      noFile: 'No hay archivo seleccionado.',
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
      convert: 'Convertir',
      convertToPdf: 'Convertir en PDF',
      reset: 'Recommencer',
      noFile: 'Aucun fichier sélectionné.',
    },
  };

  const tools = {
    pdfWord: {
      category: 'pdfDocuments',
      drop: 'dropPdf',
      title: { en: 'PDF to Word', ko: 'PDF를 Word로 변환', de: 'PDF zu Word', es: 'PDF a Word', fr: 'PDF vers Word' },
      description: {
        en: 'Convert PDF files to editable Word documents (DOCX) in seconds.',
        ko: 'PDF 파일을 편집 가능한 Word 문서(DOCX)로 변환하세요.',
        de: 'Konvertieren Sie PDF-Dateien in bearbeitbare Word-Dokumente.',
        es: 'Convierte PDF en documentos Word editables.',
        fr: 'Convertissez des PDF en documents Word modifiables.',
      },
      convert: { en: 'Convert to Word', ko: 'Word로 변환', de: 'In Word konvertieren', es: 'Convertir a Word', fr: 'Convertir en Word' },
    },
    pdfJpg: {
      category: 'pdfDocuments',
      drop: 'dropPdf',
      title: { en: 'PDF to JPG', ko: 'PDF를 JPG로 변환', de: 'PDF zu JPG', es: 'PDF a JPG', fr: 'PDF vers JPG' },
      description: {
        en: 'Turn PDF pages into high-quality JPG images.',
        ko: 'PDF 페이지를 고품질 JPG 이미지로 변환하세요.',
        de: 'Wandeln Sie PDF-Seiten in hochwertige JPG-Bilder um.',
        es: 'Convierte páginas PDF en imágenes JPG.',
        fr: 'Transformez les pages PDF en images JPG.',
      },
      convert: { en: 'Convert to JPG', ko: 'JPG로 변환', de: 'In JPG konvertieren', es: 'Convertir a JPG', fr: 'Convertir en JPG' },
    },
    pdfExcel: {
      category: 'pdfDocuments',
      drop: 'dropPdf',
      title: { en: 'PDF to Excel', ko: 'PDF를 Excel로 변환', de: 'PDF zu Excel', es: 'PDF a Excel', fr: 'PDF vers Excel' },
      description: {
        en: 'Extract text and table-like data from PDFs into an Excel workbook.',
        ko: 'PDF의 텍스트와 표 형태 데이터를 Excel 문서로 추출하세요.',
        de: 'Extrahieren Sie Text und Tabellendaten aus PDF in Excel.',
        es: 'Extrae texto y tablas de PDF a Excel.',
        fr: 'Extrayez le texte et les tableaux d’un PDF vers Excel.',
      },
      convert: { en: 'Convert to Excel', ko: 'Excel로 변환', de: 'In Excel konvertieren', es: 'Convertir a Excel', fr: 'Convertir en Excel' },
    },
    imagePdf: {
      category: 'image',
      drop: 'dropImage',
      title: { en: 'Image to PDF', ko: '이미지를 PDF로 변환', de: 'Bild zu PDF', es: 'Imagen a PDF', fr: 'Image vers PDF' },
      description: {
        en: 'Combine JPG, PNG, WEBP, and other images into a clean PDF.',
        ko: 'JPG, PNG, WEBP 등 여러 이미지를 깔끔한 PDF로 합치세요.',
        de: 'Kombinieren Sie Bilder zu einer sauberen PDF.',
        es: 'Combina imágenes en un PDF limpio.',
        fr: 'Combinez des images dans un PDF propre.',
      },
      convertKey: 'convertToPdf',
    },
    excelPdf: {
      category: 'pdfDocuments',
      drop: 'dropExcel',
      title: { en: 'Excel to PDF', ko: 'Excel을 PDF로 변환', de: 'Excel zu PDF', es: 'Excel a PDF', fr: 'Excel vers PDF' },
      description: {
        en: 'Convert Excel and CSV sheets into PDF documents directly in your browser.',
        ko: 'Excel과 CSV 시트를 브라우저에서 PDF 문서로 변환하세요.',
        de: 'Konvertieren Sie Excel- und CSV-Tabellen im Browser in PDF.',
        es: 'Convierte hojas Excel y CSV en PDF.',
        fr: 'Convertissez Excel et CSV en PDF.',
      },
      convertKey: 'convertToPdf',
    },
    docxPdf: {
      category: 'pdfDocuments',
      drop: 'dropDocx',
      title: { en: 'DOCX to PDF', ko: 'DOCX를 PDF로 변환', de: 'DOCX zu PDF', es: 'DOCX a PDF', fr: 'DOCX vers PDF' },
      description: {
        en: 'Convert Word documents into PDF files with a simple workflow.',
        ko: 'Word 문서를 간단한 과정으로 PDF 파일로 변환하세요.',
        de: 'Konvertieren Sie Word-Dokumente einfach in PDF.',
        es: 'Convierte documentos Word en PDF.',
        fr: 'Convertissez des documents Word en PDF.',
      },
      convertKey: 'convertToPdf',
    },
    pdfEpub: {
      category: 'pdfDocuments',
      drop: 'dropPdf',
      title: { en: 'PDF to EPUB', ko: 'PDF를 EPUB로 변환', de: 'PDF zu EPUB', es: 'PDF a EPUB', fr: 'PDF vers EPUB' },
      description: {
        en: 'Extract readable PDF text and package it as a lightweight EPUB ebook.',
        ko: 'PDF의 읽을 수 있는 텍스트를 추출해 가벼운 EPUB 전자책으로 만드세요.',
        de: 'Erstellen Sie aus PDF-Text ein leichtes EPUB.',
        es: 'Crea un EPUB ligero desde texto PDF.',
        fr: 'Créez un EPUB léger à partir du texte PDF.',
      },
      convert: { en: 'Convert to EPUB', ko: 'EPUB로 변환', de: 'In EPUB konvertieren', es: 'Convertir a EPUB', fr: 'Convertir en EPUB' },
    },
    ebook: {
      category: 'pdfDocuments',
      drop: 'dropFile',
      title: { en: 'Ebook Converter', ko: '전자책 변환기', de: 'Ebook-Konverter', es: 'Convertidor de ebooks', fr: 'Convertisseur ebook' },
      description: {
        en: 'Convert supported ebook and document files into readable formats.',
        ko: '지원되는 전자책과 문서 파일을 읽기 좋은 형식으로 변환하세요.',
        de: 'Konvertieren Sie unterstützte E-Book- und Dokumentdateien.',
        es: 'Convierte ebooks y documentos compatibles.',
        fr: 'Convertissez les ebooks et documents pris en charge.',
      },
      convert: { en: 'Convert ebook', ko: '전자책 변환', de: 'Ebook konvertieren', es: 'Convertir ebook', fr: 'Convertir ebook' },
    },
    imageConverter: {
      category: 'image',
      drop: 'dropImage',
      title: { en: 'Image Converter', ko: '이미지 변환기', de: 'Bildkonverter', es: 'Convertidor de imágenes', fr: 'Convertisseur d’images' },
      description: {
        en: 'Convert images between JPG, PNG, WEBP, HEIC, and SVG formats.',
        ko: 'JPG, PNG, WEBP, HEIC, SVG 등 이미지 형식을 변환하세요.',
        de: 'Konvertieren Sie Bilder zwischen JPG, PNG, WEBP, HEIC und SVG.',
        es: 'Convierte imágenes entre JPG, PNG, WEBP, HEIC y SVG.',
        fr: 'Convertissez les images entre JPG, PNG, WEBP, HEIC et SVG.',
      },
    },
    mediaConverter: {
      category: 'media',
      drop: 'dropFile',
      title: { en: 'Video & Audio Converter', ko: '비디오 & 오디오 변환기', de: 'Video- & Audiokonverter', es: 'Convertidor de video y audio', fr: 'Convertisseur vidéo et audio' },
      description: {
        en: 'Convert video and audio files in your browser with simple controls.',
        ko: '간단한 설정으로 비디오와 오디오 파일을 브라우저에서 변환하세요.',
        de: 'Konvertieren Sie Video- und Audiodateien im Browser.',
        es: 'Convierte video y audio en el navegador.',
        fr: 'Convertissez vidéo et audio dans le navigateur.',
      },
    },
    gifConverter: {
      category: 'gif',
      drop: 'dropFile',
      title: { en: 'GIF Converter', ko: 'GIF 변환기', de: 'GIF-Konverter', es: 'Convertidor GIF', fr: 'Convertisseur GIF' },
      description: {
        en: 'Create GIFs from videos or convert animated formats.',
        ko: '비디오로 GIF를 만들거나 애니메이션 형식을 변환하세요.',
        de: 'Erstellen Sie GIFs aus Videos oder konvertieren Sie Animationen.',
        es: 'Crea GIF desde videos o convierte formatos animados.',
        fr: 'Créez des GIF à partir de vidéos ou convertissez des animations.',
      },
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
    if (window.EverythingConvertLanguage && window.EverythingConvertLanguage.get) return window.EverythingConvertLanguage.get();
    return new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('everything_convert_language') || 'en';
  }

  function local(value, language) {
    return (value && (value[language] || value.en)) || '';
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

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function setButtonText(button, value) {
    if (!button || !value) return;
    const icon = button.querySelector('i');
    button.textContent = value;
    if (icon) button.appendChild(icon);
  }

  function applyToolLanguage(language = currentLanguage()) {
    const lang = common[language] ? language : 'en';
    const labels = common[lang];
    const tool = tools[detectTool()];
    if (!tool) return;

    const params = new URLSearchParams(window.location.search);
    const title = modeTitles[params.get('mode')] || local(tool.title, lang);
    const convertText = local(tool.convert, lang) || labels[tool.convertKey] || labels.convert;

    document.documentElement.lang = lang;
    document.title = `${title} - Everything Convert`;
    setText('.eyebrow', labels[tool.category]);
    setText('.hero h1, #pageTitle, .hero-title', title);
    setText('.hero p, #pageDescription, .hero-subtitle', local(tool.description, lang));
    setText('#dropTitle, .drop-zone h2, .drop-title, .drop-zone strong', labels[tool.drop] || labels.dropFile);
    setText('#dropHint, .drop-subtitle', '');
    document.querySelectorAll('.browse-btn').forEach((button) => setButtonText(button, labels.browse));
    document.querySelectorAll('#convertBtn, .convert-btn').forEach((button) => setButtonText(button, convertText));
    setButtonText(document.querySelector('#resetBtn'), labels.reset);
    const status = document.querySelector('#status');
    if (status && /No file selected|선택된 파일|Keine Datei|No hay archivo|Aucun fichier/i.test(status.textContent)) {
      status.textContent = labels.noFile;
    }
  }

  window.EverythingConvertToolLanguage = { apply: applyToolLanguage };
  window.addEventListener('everything-language-change', (event) => applyToolLanguage(event.detail.language));
  window.addEventListener('load', () => window.setTimeout(() => applyToolLanguage(), 100));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(() => applyToolLanguage(), 0));
  } else {
    window.setTimeout(() => applyToolLanguage(), 0);
  }
})();
