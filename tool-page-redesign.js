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

  function addFeatureStrip() {
    const main = document.querySelector('main');
    const toolCard = document.querySelector('.tool-card') || document.querySelector('.converter-card') || document.querySelector('.upload-card');
    if (!main || !toolCard || document.querySelector('.ec-feature-strip')) return;
    const strip = document.createElement('section');
    strip.className = 'ec-feature-strip';
    strip.innerHTML = `
      <article><i class="fa-solid fa-gauge-high"></i><strong>Fast Conversion</strong><span>Convert in seconds</span></article>
      <article><i class="fa-regular fa-square-check"></i><strong>High Accuracy</strong><span>Keep formatting clear</span></article>
      <article><i class="fa-solid fa-shield-halved"></i><strong>Secure & Private</strong><span>Files are auto-deleted</span></article>
      <article><i class="fa-solid fa-display"></i><strong>Works Everywhere</strong><span>Web-based converter</span></article>
    `;
    toolCard.insertAdjacentElement('afterend', strip);
  }

  function addInfoSections(meta) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-info-grid')) return;
    const input = meta.input;
    const output = meta.output;
    const info = document.createElement('section');
    info.className = 'ec-info-grid';
    info.innerHTML = `
      <article class="ec-info-panel">
        <h2>How to Convert ${input} to ${output}</h2>
        <ol class="ec-step-list">
          ${meta.steps.map((step, index) => `
            <li><b>${index + 1}</b><div><strong>${step}</strong><span>${index === 0 ? 'Drag and drop your file or click the upload button.' : index === 1 ? 'EverythingConvert prepares the file in your browser.' : 'Download the converted file instantly.'}</span></div></li>
          `).join('')}
        </ol>
      </article>
      <article class="ec-info-panel">
        <h2>Why Choose EverythingConvert?</h2>
        <ul class="ec-check-list">
          <li><i class="fa-solid fa-check"></i><span>Fast, simple conversion workflow</span></li>
          <li><i class="fa-solid fa-check"></i><span>Clean output for everyday files</span></li>
          <li><i class="fa-solid fa-check"></i><span>No software installation required</span></li>
          <li><i class="fa-solid fa-check"></i><span>Private browser-first experience where possible</span></li>
          <li><i class="fa-solid fa-check"></i><span>Built for PDF, image, office, video, audio, and GIF tools</span></li>
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

  function addRelated(meta) {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-related')) return;
    const related = document.createElement('section');
    related.className = 'ec-related';
    related.innerHTML = `
      <h2>More ${meta.category} Tools You'll Love</h2>
      <div class="ec-related-grid">
        ${meta.related.map((name) => {
          const link = relatedLinks[name] || ['index.html#tools', 'fa-wand-magic-sparkles', 'Explore this tool'];
          return `<a href="${rootPrefix()}${link[0]}"><i class="fa-solid ${link[1]}"></i><strong>${name}</strong><span>${link[2]}</span></a>`;
        }).join('')}
      </div>
    `;
    main.appendChild(related);
  }

  function addSecurityBand() {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ec-security-band')) return;
    const band = document.createElement('section');
    band.className = 'ec-security-band';
    band.innerHTML = `
      <div><h2>Your Files Are Safe With Us</h2><p>We use secure workflows and keep privacy at the center of every converter.</p></div>
      <div class="ec-security-item"><i class="fa-solid fa-shield-halved"></i><strong>Secure Transfer</strong><span>Protected browser sessions</span></div>
      <div class="ec-security-item"><i class="fa-regular fa-trash-can"></i><strong>Auto File Deletion</strong><span>Temporary files are removed</span></div>
      <div class="ec-security-item"><i class="fa-regular fa-user"></i><strong>No One Can Access</strong><span>Your files stay private</span></div>
    `;
    main.appendChild(band);
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
    addFeatureStrip();
    addInfoSections(meta);
    addRelated(meta);
    addSecurityBand();
    fixFooterText();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
