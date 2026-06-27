(function () {
  const modes = {
    merge: {
      title: 'PDF Merge',
      label: 'Merge PDF',
      icon: 'fa-layer-group',
      description: 'Combine multiple PDF files into one clean PDF.',
      drop: 'Drag & drop your PDF files here',
      help: 'Select two or more PDF files.',
      button: 'Merge PDF',
      multiple: true,
    },
    compress: {
      title: 'PDF Compress',
      label: 'Compress PDF',
      icon: 'fa-compress',
      description: 'Reduce PDF file size by rebuilding the PDF with compact object streams.',
      drop: 'Drag & drop your PDF file here',
      help: 'Best for PDFs that can be optimized structurally. Image-heavy PDFs may shrink only a little.',
      button: 'Compress PDF',
      multiple: false,
    },
    split: {
      title: 'PDF Split',
      label: 'Split PDF',
      icon: 'fa-scissors',
      description: 'Split every page of a PDF into separate PDF files packed in a ZIP.',
      drop: 'Drag & drop your PDF file here',
      help: 'One PDF will be split into individual page files.',
      button: 'Split PDF',
      multiple: false,
    },
    rotate: {
      title: 'Rotate PDF',
      label: 'Rotate PDF',
      icon: 'fa-rotate-right',
      description: 'Rotate all pages in a PDF by 90, 180, or 270 degrees.',
      drop: 'Drag & drop your PDF file here',
      help: 'Choose a rotation angle before converting.',
      button: 'Rotate PDF',
      multiple: false,
    },
    remove: {
      title: 'Remove PDF Pages',
      label: 'Remove Pages',
      icon: 'fa-trash-can',
      description: 'Remove unwanted pages from a PDF using page numbers or ranges.',
      drop: 'Drag & drop your PDF file here',
      help: 'Example: 1,3,5-7 removes those pages.',
      button: 'Remove Pages',
      multiple: false,
    },
    extract: {
      title: 'Extract PDF Pages',
      label: 'Extract Pages',
      icon: 'fa-copy',
      description: 'Extract selected pages from a PDF into a new PDF file.',
      drop: 'Drag & drop your PDF file here',
      help: 'Example: 2-4,8 extracts those pages.',
      button: 'Extract Pages',
      multiple: false,
    },
    organize: {
      title: 'Organize PDF',
      label: 'Organize PDF',
      icon: 'fa-arrow-up-short-wide',
      description: 'Reorder PDF pages by typing the page order you want.',
      drop: 'Drag & drop your PDF file here',
      help: 'Example: 3,1,2,4-6 creates a new order.',
      button: 'Organize PDF',
      multiple: false,
    },
  };

  const modeTranslations = {
    ko: {
      merge: ['PDF 병합', '여러 PDF 파일을 하나의 PDF로 합치세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '두 개 이상의 PDF 파일을 선택하세요.', 'PDF 병합'],
      compress: ['PDF 압축', 'PDF를 압축 저장 방식으로 다시 만들어 파일 크기를 줄이세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '이미지가 많은 PDF는 줄어드는 폭이 작을 수 있습니다.', 'PDF 압축'],
      split: ['PDF 분할', 'PDF의 각 페이지를 별도 PDF로 나누고 ZIP으로 저장하세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '하나의 PDF가 페이지별 파일로 분할됩니다.', 'PDF 분할'],
      rotate: ['PDF 회전', 'PDF 전체 페이지를 90, 180, 270도로 회전하세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '변환 전 회전 각도를 선택하세요.', 'PDF 회전'],
      remove: ['PDF 페이지 삭제', '페이지 번호나 범위를 입력해 원하지 않는 페이지를 삭제하세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '예: 1,3,5-7 페이지를 삭제합니다.', '페이지 삭제'],
      extract: ['PDF 페이지 추출', '선택한 페이지를 새 PDF 파일로 저장하세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '예: 2-4,8 페이지를 추출합니다.', '페이지 추출'],
      organize: ['PDF 정리', '원하는 순서대로 페이지 번호를 입력해 PDF를 재정렬하세요.', 'PDF 파일을 여기에 끌어다 놓으세요', '예: 3,1,2,4-6 순서로 새 PDF를 만듭니다.', 'PDF 정리'],
    },
    de: {
      merge: ['PDF zusammenführen', 'Kombinieren Sie mehrere PDFs zu einer Datei.', 'PDF-Dateien hierher ziehen', 'Wählen Sie mindestens zwei PDF-Dateien.', 'PDF zusammenführen'],
      compress: ['PDF komprimieren', 'Reduzieren Sie die Dateigröße durch kompaktes erneutes Speichern.', 'PDF-Datei hierher ziehen', 'Bei bildlastigen PDFs kann die Einsparung gering sein.', 'PDF komprimieren'],
      split: ['PDF teilen', 'Teilen Sie jede PDF-Seite in separate Dateien als ZIP.', 'PDF-Datei hierher ziehen', 'Ein PDF wird in einzelne Seiten geteilt.', 'PDF teilen'],
      rotate: ['PDF drehen', 'Drehen Sie alle PDF-Seiten um 90, 180 oder 270 Grad.', 'PDF-Datei hierher ziehen', 'Wählen Sie vor dem Konvertieren den Winkel.', 'PDF drehen'],
      remove: ['PDF-Seiten entfernen', 'Entfernen Sie unerwünschte Seiten per Seitenbereich.', 'PDF-Datei hierher ziehen', 'Beispiel: 1,3,5-7 entfernt diese Seiten.', 'Seiten entfernen'],
      extract: ['PDF-Seiten extrahieren', 'Speichern Sie ausgewählte Seiten als neue PDF.', 'PDF-Datei hierher ziehen', 'Beispiel: 2-4,8 extrahiert diese Seiten.', 'Seiten extrahieren'],
      organize: ['PDF organisieren', 'Ordnen Sie PDF-Seiten mit einer Seitenliste neu.', 'PDF-Datei hierher ziehen', 'Beispiel: 3,1,2,4-6 erstellt eine neue Reihenfolge.', 'PDF organisieren'],
    },
    es: {
      merge: ['Unir PDF', 'Combina varios PDF en un solo archivo.', 'Arrastra tus PDF aquí', 'Selecciona dos o más archivos PDF.', 'Unir PDF'],
      compress: ['Comprimir PDF', 'Reduce el tamaño reconstruyendo el PDF con guardado compacto.', 'Arrastra tu PDF aquí', 'Los PDF con muchas imágenes pueden reducirse poco.', 'Comprimir PDF'],
      split: ['Dividir PDF', 'Divide cada página del PDF en archivos separados dentro de un ZIP.', 'Arrastra tu PDF aquí', 'Un PDF se dividirá en páginas individuales.', 'Dividir PDF'],
      rotate: ['Rotar PDF', 'Rota todas las páginas 90, 180 o 270 grados.', 'Arrastra tu PDF aquí', 'Elige un ángulo antes de convertir.', 'Rotar PDF'],
      remove: ['Eliminar páginas', 'Elimina páginas no deseadas con números o rangos.', 'Arrastra tu PDF aquí', 'Ejemplo: 1,3,5-7 elimina esas páginas.', 'Eliminar páginas'],
      extract: ['Extraer páginas', 'Guarda páginas seleccionadas en un nuevo PDF.', 'Arrastra tu PDF aquí', 'Ejemplo: 2-4,8 extrae esas páginas.', 'Extraer páginas'],
      organize: ['Organizar PDF', 'Reordena páginas escribiendo el orden deseado.', 'Arrastra tu PDF aquí', 'Ejemplo: 3,1,2,4-6 crea un nuevo orden.', 'Organizar PDF'],
    },
    fr: {
      merge: ['Fusionner PDF', 'Combinez plusieurs PDF en un seul fichier.', 'Déposez vos PDF ici', 'Sélectionnez au moins deux fichiers PDF.', 'Fusionner PDF'],
      compress: ['Compresser PDF', 'Réduisez la taille en reconstruisant le PDF avec un enregistrement compact.', 'Déposez votre PDF ici', 'Les PDF riches en images peuvent peu diminuer.', 'Compresser PDF'],
      split: ['Diviser PDF', 'Divisez chaque page du PDF en fichiers séparés dans un ZIP.', 'Déposez votre PDF ici', 'Un PDF sera divisé en pages individuelles.', 'Diviser PDF'],
      rotate: ['Faire pivoter PDF', 'Faites pivoter toutes les pages de 90, 180 ou 270 degrés.', 'Déposez votre PDF ici', 'Choisissez un angle avant de convertir.', 'Faire pivoter PDF'],
      remove: ['Supprimer des pages', 'Supprimez les pages inutiles avec des numéros ou plages.', 'Déposez votre PDF ici', 'Exemple : 1,3,5-7 supprime ces pages.', 'Supprimer'],
      extract: ['Extraire des pages', 'Enregistrez les pages choisies dans un nouveau PDF.', 'Déposez votre PDF ici', 'Exemple : 2-4,8 extrait ces pages.', 'Extraire'],
      organize: ['Organiser PDF', 'Réorganisez les pages avec une liste de numéros.', 'Déposez votre PDF ici', 'Exemple : 3,1,2,4-6 crée un nouvel ordre.', 'Organiser PDF'],
    },
  };

  const state = {
    mode: 'merge',
    files: [],
    selectedPages: new Set(),
    pageOrder: [],
    pdfjsDoc: null,
    thumbFileRef: null,
    thumbToken: 0,
    thumbObserver: null,
  };

  const els = {};

  function qs(selector) {
    return document.querySelector(selector);
  }

  function currentLanguage() {
    if (window.EverythingConvertLanguage && window.EverythingConvertLanguage.get) {
      return window.EverythingConvertLanguage.get();
    }
    return new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('everything_convert_language') || 'en';
  }

  function localizedMode(modeKey) {
    const base = modes[modeKey];
    const values = modeTranslations[currentLanguage()] && modeTranslations[currentLanguage()][modeKey];
    if (!values) return base;
    return {
      ...base,
      title: values[0],
      label: values[0],
      description: values[1],
      drop: values[2],
      help: values[3],
      button: values[4],
    };
  }

  function setStatus(message, type = '') {
    els.status.textContent = message || '';
    els.status.dataset.type = type;
  }

  function sanitizeBaseName(name) {
    return (name || 'pdf')
      .replace(/\.[^.]+$/, '')
      .replace(/[\\/:*?"<>|]+/g, '-')
      .trim() || 'pdf';
  }

  function rawDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  // Every tool funnels its result here. Instead of auto-downloading, present a
  // daily-limit-gated download card (re-download of the same result is free).
  function downloadBlob(blob, filename) {
    const ul = window.EverythingConvertUsageLimit;
    if (ul && ul.showDownloadCard) {
      ul.showDownloadCard({
        mount: document.querySelector('.converter-card'),
        title: 'Conversion complete — your file is ready',
        titleKo: '변환 완료 — 파일이 준비되었습니다',
        downloadLabel: 'Download', downloadLabelKo: '다운로드',
        token: blob,
        download: () => rawDownload(blob, filename),
        hide: [els.convert]
      });
    } else {
      rawDownload(blob, filename);
    }
  }

  // Multi-file result (e.g. Split). Offers both per-page downloads and a single
  // ZIP via the shared result card; both share one token (counted once).
  function downloadFiles(files, zipName) {
    const ul = window.EverythingConvertUsageLimit;
    if (ul && ul.showDownloadCard) {
      ul.showDownloadCard({
        mount: document.querySelector('.converter-card'),
        title: `Split complete — ${files.length} pages ready`,
        titleKo: `분할 완료 — ${files.length}페이지 준비됨`,
        downloadLabel: `Download all (${files.length})`,
        downloadLabelKo: `전체 다운로드 (${files.length})`,
        files,
        zipName,
        // Back-compat: a cached older usage-limit.js without `files` support
        // falls back to this single ZIP action (the prior behavior).
        token: files,
        download: async () => {
          const zip = new window.JSZip();
          files.forEach((f) => zip.file(f.name, f.blob));
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          rawDownload(zipBlob, `${zipName}.zip`);
        },
        hide: [els.convert]
      });
    } else {
      files.forEach((f) => rawDownload(f.blob, f.name));
    }
  }

  function resetResultCard() {
    const ul = window.EverythingConvertUsageLimit;
    if (ul && ul.clearDownloadCard) ul.clearDownloadCard('.converter-card');
    if (els.convert) els.convert.style.display = '';
  }

  function parsePageList(value, pageCount, options = {}) {
    const preserveOrder = Boolean(options.preserveOrder);
    const text = (value || '').trim();
    if (!text) throw new Error('Enter at least one page number.');

    const result = [];
    const seen = new Set();
    const parts = text.split(',').map((part) => part.trim()).filter(Boolean);

    parts.forEach((part) => {
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      const single = part.match(/^\d+$/);
      let numbers = [];

      if (range) {
        const start = Number(range[1]);
        const end = Number(range[2]);
        if (start > end) throw new Error(`Invalid range: ${part}`);
        for (let page = start; page <= end; page += 1) numbers.push(page);
      } else if (single) {
        numbers = [Number(part)];
      } else {
        throw new Error(`Invalid page value: ${part}`);
      }

      numbers.forEach((page) => {
        if (page < 1 || page > pageCount) {
          throw new Error(`Page ${page} is outside the PDF page count (${pageCount}).`);
        }
        const index = page - 1;
        if (preserveOrder) {
          result.push(index);
        } else if (!seen.has(index)) {
          seen.add(index);
          result.push(index);
        }
      });
    });

    return preserveOrder ? result : result.sort((a, b) => a - b);
  }

  async function loadPdf(file) {
    const bytes = await file.arrayBuffer();
    return window.PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
  }

  function renderFileList() {
    if (!state.files.length) {
      els.fileList.textContent = 'No PDF selected.';
      return;
    }

    els.fileList.innerHTML = state.files.map((file, index) => `
      <div>
        <i class="fa-regular fa-file-pdf"></i>
        <span>${index + 1}. ${file.name}</span>
        <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
      </div>
    `).join('');
  }

  function renderOptions() {
    const mode = localizedMode(state.mode);
    let html = `<p>${mode.help}</p>`;

    if (state.mode === 'compress') {
      html += `
        <label>
          <span>Compression method</span>
          <select id="compressMethod">
            <option value="safe">Safe browser compression</option>
          </select>
        </label>
      `;
    }

    if (state.mode === 'rotate') {
      html += `
        <label>
          <span>Rotation angle</span>
          <select id="rotateAngle">
            <option value="90">90 degrees clockwise</option>
            <option value="180">180 degrees</option>
            <option value="270">270 degrees clockwise</option>
          </select>
        </label>
      `;
    }

    if (state.mode === 'remove' || state.mode === 'extract') {
      html += `
        <label>
          <span>Page range</span>
          <input id="pageRange" type="text" placeholder="Example: 1,3,5-7">
        </label>
      `;
    }

    if (state.mode === 'organize') {
      html += `
        <label>
          <span>New page order</span>
          <input id="pageOrder" type="text" placeholder="Example: 3,1,2,4-6">
        </label>
      `;
    }

    els.options.innerHTML = html;

    if (state.mode === 'remove' || state.mode === 'extract' || state.mode === 'organize') {
      wireRangeInput();
    }
  }

  function setMode(nextMode) {
    state.mode = modes[nextMode] ? nextMode : 'merge';
    const mode = localizedMode(state.mode);

    document.title = `${mode.title} - EverythingConvert`;
    qs('[data-mode-label]').textContent = mode.title;
    qs('#pdfToolTitle').innerHTML = `<span class="ec-title-accent">PDF</span> ${mode.title.replace(/^PDF\s*/i, '')}`;
    qs('[data-mode-description]').textContent = mode.description;
    qs('[data-mode-icon]').className = `fa-solid ${mode.icon}`;
    qs('[data-drop-title]').textContent = mode.drop;
    qs('[data-file-help]').textContent = mode.help;
    qs('[data-convert-label]').textContent = mode.button;

    els.fileInput.multiple = mode.multiple;
    state.files = mode.multiple ? state.files : state.files.slice(0, 1);
    renderFileList();
    renderOptions();
    setStatus('');
    resetResultCard();

    document.querySelectorAll('[data-mode-button]').forEach((button) => {
      button.classList.toggle('active', button.dataset.modeButton === state.mode);
      const buttonMode = localizedMode(button.dataset.modeButton);
      const label = button.querySelector('span');
      if (label && buttonMode) label.textContent = buttonMode.label;
    });

    const url = new URL(window.location.href);
    url.searchParams.set('mode', state.mode);
    window.history.replaceState({}, '', url);

    refreshThumbs();
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList || []).filter((file) => {
      return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    });

    if (!incoming.length) {
      setStatus('Please choose a PDF file.', 'error');
      return;
    }

    state.files = modes[state.mode].multiple ? incoming : incoming.slice(0, 1);
    // A new file invalidates any prior page selection/order and cached pdf.js doc.
    state.selectedPages = new Set();
    state.pageOrder = [];
    state.thumbFileRef = null;
    renderFileList();
    resetResultCard();
    refreshThumbs();
    setStatus(`${state.files.length} PDF file${state.files.length > 1 ? 's' : ''} ready.`, 'success');
  }

  async function mergePdfs() {
    if (state.files.length < 2) throw new Error('Choose at least two PDF files to merge.');
    const merged = await window.PDFLib.PDFDocument.create();

    for (const file of state.files) {
      const source = await loadPdf(file);
      const pages = await merged.copyPages(source, source.getPageIndices());
      pages.forEach((page) => merged.addPage(page));
    }

    const bytes = await merged.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf');
  }

  async function splitPdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose one PDF file to split.');
    const source = await loadPdf(file);
    const base = sanitizeBaseName(file.name);
    const files = [];

    for (let index = 0; index < source.getPageCount(); index += 1) {
      const doc = await window.PDFLib.PDFDocument.create();
      const [page] = await doc.copyPages(source, [index]);
      doc.addPage(page);
      const bytes = await doc.save();
      files.push({
        name: `${base}-page-${String(index + 1).padStart(3, '0')}.pdf`,
        blob: new Blob([bytes], { type: 'application/pdf' }),
      });
    }

    downloadFiles(files, `${base}-split-pages`);
  }

  async function compressPdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose one PDF file to compress.');
    const originalBytes = await file.arrayBuffer();
    const doc = await window.PDFLib.PDFDocument.load(originalBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    doc.setProducer('EverythingConvert');
    doc.setCreator('EverythingConvert');
    doc.setModificationDate(new Date());

    const bytes = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 80,
    });
    const originalSize = originalBytes.byteLength;
    const newSize = bytes.byteLength;
    const reduction = originalSize > 0 ? Math.round((1 - newSize / originalSize) * 100) : 0;
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${sanitizeBaseName(file.name)}-compressed.pdf`);

    if (reduction > 0) {
      return `Done. Compressed by about ${reduction}%. Your download should start automatically.`;
    }

    return 'Done. This PDF was already compact, so the new file may be similar in size.';
  }

  async function rotatePdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose one PDF file to rotate.');
    const angle = Number(qs('#rotateAngle').value || '90');
    const doc = await loadPdf(file);
    doc.getPages().forEach((page) => page.setRotation(window.PDFLib.degrees(angle)));
    const bytes = await doc.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${sanitizeBaseName(file.name)}-rotated.pdf`);
  }

  async function removePages() {
    const file = state.files[0];
    if (!file) throw new Error('Choose one PDF file.');
    const doc = await loadPdf(file);
    const pages = parsePageList(qs('#pageRange').value, doc.getPageCount());
    if (pages.length >= doc.getPageCount()) throw new Error('At least one page must remain in the PDF.');
    pages.slice().reverse().forEach((index) => doc.removePage(index));
    const bytes = await doc.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${sanitizeBaseName(file.name)}-pages-removed.pdf`);
  }

  async function extractPages() {
    const file = state.files[0];
    if (!file) throw new Error('Choose one PDF file.');
    const source = await loadPdf(file);
    const pages = parsePageList(qs('#pageRange').value, source.getPageCount());
    const doc = await window.PDFLib.PDFDocument.create();
    const copied = await doc.copyPages(source, pages);
    copied.forEach((page) => doc.addPage(page));
    const bytes = await doc.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${sanitizeBaseName(file.name)}-extracted.pdf`);
  }

  async function organizePdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose one PDF file.');
    const source = await loadPdf(file);
    const pages = parsePageList(qs('#pageOrder').value, source.getPageCount(), { preserveOrder: true });
    const doc = await window.PDFLib.PDFDocument.create();
    const copied = await doc.copyPages(source, pages);
    copied.forEach((page) => doc.addPage(page));
    const bytes = await doc.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${sanitizeBaseName(file.name)}-organized.pdf`);
  }

  async function processPdf() {
    const actions = {
      merge: mergePdfs,
      compress: compressPdf,
      split: splitPdf,
      rotate: rotatePdf,
      remove: removePages,
      extract: extractPages,
      organize: organizePdf,
    };

    try {
      els.convert.disabled = true;
      setStatus('Processing your PDF...', '');
      const message = await actions[state.mode]();
      setStatus(message || 'Done. Your download should start automatically.', 'success');
    } catch (error) {
      setStatus(error.message || 'Could not process this PDF.', 'error');
    } finally {
      els.convert.disabled = false;
    }
  }

  // ---- Page thumbnail preview (Remove / Extract / Organize) -----------------
  // These modes let the user work with pages visually instead of typing numbers.
  // Remove/Extract: clicking a thumbnail toggles selection and rewrites the
  // page-range input. Organize: dragging (or ◀ ▶) reorders thumbnails and
  // rewrites the page-order input. All stay in two-way sync with the input.

  function selectableMode() {
    return state.mode === 'remove' || state.mode === 'extract';
  }

  function organizeMode() {
    return state.mode === 'organize';
  }

  function previewMode() {
    return selectableMode() || organizeMode();
  }

  function ensureWorker() {
    if (!window.pdfjsLib || window.__ecPdfWorkerSet) return;
    const workerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    // A classic Worker can't be created from a cross-origin URL directly, so we
    // wrap the CDN worker in a same-origin blob that importScripts() it. This is
    // the reliable way to give pdf.js a real worker from a CDN.
    try {
      const blob = new Blob(["importScripts('" + workerUrl + "');"], { type: 'application/javascript' });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
    } catch (error) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    }
    window.__ecPdfWorkerSet = true;
  }

  // Compact a sorted list of 1-based page numbers into "1-3,5,8-9".
  function formatRanges(pages) {
    if (!pages.length) return '';
    const parts = [];
    let start = pages[0];
    let prev = pages[0];
    for (let i = 1; i <= pages.length; i += 1) {
      const cur = pages[i];
      if (cur === prev + 1) { prev = cur; continue; }
      parts.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = cur;
      prev = cur;
    }
    return parts.join(',');
  }

  // Lenient parse (ignores invalid/out-of-range bits) for live input → selection.
  function parseSelection(value, pageCount) {
    const set = new Set();
    (value || '').split(',').forEach((raw) => {
      const part = raw.trim();
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        let s = Number(range[1]);
        let e = Number(range[2]);
        if (s > e) [s, e] = [e, s];
        for (let p = s; p <= e; p += 1) if (p >= 1 && p <= pageCount) set.add(p);
      } else if (/^\d+$/.test(part)) {
        const p = Number(part);
        if (p >= 1 && p <= pageCount) set.add(p);
      }
    });
    return set;
  }

  function syncInputFromSelection() {
    const input = qs('#pageRange');
    if (input) input.value = formatRanges([...state.selectedPages].sort((a, b) => a - b));
  }

  function applySelectionHighlight() {
    if (!els.thumbs) return;
    els.thumbs.querySelectorAll('.pdf-thumb').forEach((cell) => {
      cell.classList.toggle('selected', state.selectedPages.has(Number(cell.dataset.page)));
    });
  }

  function togglePage(pageNum) {
    if (state.selectedPages.has(pageNum)) state.selectedPages.delete(pageNum);
    else state.selectedPages.add(pageNum);
    syncInputFromSelection();
    applySelectionHighlight();
  }

  // ---- Organize: drag-to-reorder -------------------------------------------
  // The grid's visual order is the new page order. Dragging (or the ◀ ▶
  // buttons) rewrites state.pageOrder and the #pageOrder input; typing in the
  // input re-orders the existing thumbnails without re-rendering.

  // Order-preserving parse: "3,1,2,4-6" -> [3,1,2,4,5,6] (keeps duplicates).
  function parseOrder(value, pageCount) {
    const order = [];
    (value || '').split(',').forEach((raw) => {
      const part = raw.trim();
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        const s = Number(range[1]);
        const e = Number(range[2]);
        const step = s <= e ? 1 : -1;
        for (let p = s; step > 0 ? p <= e : p >= e; p += step) {
          if (p >= 1 && p <= pageCount) order.push(p);
        }
      } else if (/^\d+$/.test(part)) {
        const p = Number(part);
        if (p >= 1 && p <= pageCount) order.push(p);
      }
    });
    return order;
  }

  function syncOrderInput() {
    const input = qs('#pageOrder');
    if (input) input.value = formatRanges(state.pageOrder);
  }

  // Rebuild state.pageOrder from the live DOM order of thumbnail cells.
  function readOrderFromDom() {
    state.pageOrder = [...els.thumbs.querySelectorAll('.pdf-thumb')]
      .map((cell) => Number(cell.dataset.page));
    syncOrderInput();
  }

  // Move existing cells to match state.pageOrder (no canvas re-render).
  function applyOrganizeOrder() {
    if (!els.thumbs) return;
    const map = new Map();
    els.thumbs.querySelectorAll('.pdf-thumb').forEach((cell) => {
      map.set(Number(cell.dataset.page), cell);
    });
    state.pageOrder.forEach((page) => {
      const cell = map.get(page);
      if (cell) els.thumbs.appendChild(cell);
    });
  }

  function moveCell(cell, direction) {
    if (direction < 0 && cell.previousElementSibling) {
      els.thumbs.insertBefore(cell, cell.previousElementSibling);
    } else if (direction > 0 && cell.nextElementSibling) {
      els.thumbs.insertBefore(cell.nextElementSibling, cell);
    }
    readOrderFromDom();
  }

  function setupOrganizeDrag(token) {
    let dragged = null;
    els.thumbs.querySelectorAll('.pdf-thumb').forEach((cell) => {
      cell.draggable = true;
      cell.addEventListener('dragstart', () => {
        dragged = cell;
        cell.classList.add('dragging');
      });
      cell.addEventListener('dragend', () => {
        cell.classList.remove('dragging');
        dragged = null;
        if (token === state.thumbToken) readOrderFromDom();
      });
      cell.addEventListener('dragover', (event) => {
        event.preventDefault();
        if (!dragged || dragged === cell) return;
        const box = cell.getBoundingClientRect();
        const before = event.clientX < box.left + box.width / 2;
        els.thumbs.insertBefore(dragged, before ? cell : cell.nextElementSibling);
      });
    });
  }

  function wireRangeInput() {
    if (selectableMode()) {
      const input = qs('#pageRange');
      if (!input) return;
      input.addEventListener('input', () => {
        const count = state.pdfjsDoc ? state.pdfjsDoc.numPages : 1e9;
        state.selectedPages = parseSelection(input.value, count);
        applySelectionHighlight();
      });
    } else if (organizeMode()) {
      const input = qs('#pageOrder');
      if (!input) return;
      input.addEventListener('input', () => {
        const count = state.pdfjsDoc ? state.pdfjsDoc.numPages : 0;
        if (!count) return;
        state.pageOrder = parseOrder(input.value, count);
        applyOrganizeOrder();
      });
    }
  }

  function clearThumbs() {
    state.thumbToken += 1;
    if (state.thumbObserver) {
      state.thumbObserver.disconnect();
      state.thumbObserver = null;
    }
    if (els.thumbs) {
      els.thumbs.hidden = true;
      els.thumbs.innerHTML = '';
    }
  }

  function refreshThumbs() {
    if (previewMode() && state.files.length && window.pdfjsLib) {
      renderThumbGrid();
    } else {
      clearThumbs();
    }
  }

  async function renderThumbCanvas(cell, pageNum, token) {
    try {
      const page = await state.pdfjsDoc.getPage(pageNum);
      if (token !== state.thumbToken) return;
      const base = page.getViewport({ scale: 1 });
      const scale = (150 * (window.devicePixelRatio || 1)) / base.width;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      if (token !== state.thumbToken) return;
      const skeleton = cell.querySelector('.pdf-thumb-skeleton');
      if (skeleton) skeleton.replaceWith(canvas);
      else cell.prepend(canvas);
    } catch (error) {
      /* keep the skeleton if a single page fails to render */
    }
  }

  function setupLazyRender(token) {
    if (state.thumbObserver) state.thumbObserver.disconnect();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        renderThumbCanvas(entry.target, Number(entry.target.dataset.page), token);
      });
    }, { root: els.thumbs, rootMargin: '250px' });
    state.thumbObserver = observer;
    els.thumbs.querySelectorAll('.pdf-thumb').forEach((cell) => observer.observe(cell));
  }

  async function renderThumbGrid() {
    const token = ++state.thumbToken;
    const file = state.files[0];
    if (!file) { clearThumbs(); return; }

    els.thumbs.hidden = false;
    els.thumbs.innerHTML = '';
    els.thumbs.classList.toggle('mode-remove', state.mode === 'remove');
    els.thumbs.classList.toggle('mode-extract', state.mode === 'extract');
    els.thumbs.classList.toggle('mode-organize', state.mode === 'organize');

    try {
      if (state.thumbFileRef !== file) {
        ensureWorker();
        const bytes = await file.arrayBuffer();
        if (token !== state.thumbToken) return;
        state.pdfjsDoc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
        state.thumbFileRef = file;
      }
    } catch (error) {
      // Protected/unreadable PDF: pdf.js can't render it, but manual page entry
      // still works. Show a hint instead of failing silently.
      if (token !== state.thumbToken) return;
      els.thumbs.hidden = false;
      els.thumbs.classList.remove('mode-remove', 'mode-extract', 'mode-organize');
      const protectedPdf = error && error.name === 'PasswordException';
      els.thumbs.innerHTML =
        '<p class="pdf-thumb-hint">' +
        (protectedPdf
          ? 'This PDF is password-protected, so a page preview can’t be shown. You can still enter page numbers below.'
          : 'Page preview isn’t available for this PDF. You can still enter page numbers below.') +
        '</p>';
      return;
    }
    if (token !== state.thumbToken) return;

    const pageCount = state.pdfjsDoc.numPages;

    if (organizeMode()) {
      // Start from the natural order (or a valid retained order) and let the
      // user drag pages around; the input is prefilled so it works immediately.
      if (state.pageOrder.length !== pageCount) {
        state.pageOrder = Array.from({ length: pageCount }, (_, i) => i + 1);
      }
      const fragment = document.createDocumentFragment();
      state.pageOrder.forEach((page) => {
        const cell = document.createElement('div');
        cell.className = 'pdf-thumb';
        cell.dataset.page = String(page);
        cell.title = `Page ${page} — drag to reorder`;
        cell.innerHTML =
          '<div class="pdf-thumb-skeleton"></div>' +
          '<span class="pdf-thumb-num">' + page + '</span>' +
          '<span class="pdf-thumb-move">' +
            '<button type="button" class="pdf-move-left" aria-label="Move left"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<button type="button" class="pdf-move-right" aria-label="Move right"><i class="fa-solid fa-chevron-right"></i></button>' +
          '</span>';
        cell.querySelector('.pdf-move-left').addEventListener('click', () => moveCell(cell, -1));
        cell.querySelector('.pdf-move-right').addEventListener('click', () => moveCell(cell, 1));
        fragment.appendChild(cell);
      });
      els.thumbs.appendChild(fragment);
      syncOrderInput();
      setupOrganizeDrag(token);
      setupLazyRender(token);
      return;
    }

    const markIcon = state.mode === 'remove' ? 'fa-xmark' : 'fa-check';
    const fragment = document.createDocumentFragment();
    for (let n = 1; n <= pageCount; n += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'pdf-thumb';
      cell.dataset.page = String(n);
      cell.title = `Page ${n}`;
      cell.innerHTML =
        '<div class="pdf-thumb-skeleton"></div>' +
        `<span class="pdf-thumb-mark"><i class="fa-solid ${markIcon}"></i></span>` +
        `<span class="pdf-thumb-num">${n}</span>`;
      cell.addEventListener('click', () => togglePage(n));
      fragment.appendChild(cell);
    }
    els.thumbs.appendChild(fragment);

    syncInputFromSelection();
    applySelectionHighlight();
    setupLazyRender(token);
  }

  function init() {
    els.dropZone = qs('#dropZone');
    els.fileInput = qs('#fileInput');
    els.fileList = qs('#fileList');
    els.options = qs('#optionsPanel');
    els.thumbs = qs('#pageThumbs');
    els.convert = qs('#convertBtn');
    els.status = qs('#statusText');

    document.querySelectorAll('[data-mode-button]').forEach((button) => {
      button.addEventListener('click', () => setMode(button.dataset.modeButton));
    });

    els.dropZone.addEventListener('click', (event) => {
      // The "Choose File" label already opens the picker natively; without this
      // guard the bubbled drop-zone click triggers it a second time (two dialogs).
      if (event.target.closest('.ec-choose-file')) return;
      els.fileInput.click();
    });
    els.dropZone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        els.fileInput.click();
      }
    });
    els.dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      els.dropZone.classList.add('dragging');
    });
    els.dropZone.addEventListener('dragleave', () => els.dropZone.classList.remove('dragging'));
    els.dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      els.dropZone.classList.remove('dragging');
      addFiles(event.dataTransfer.files);
    });
    els.fileInput.addEventListener('change', () => addFiles(els.fileInput.files));
    els.convert.addEventListener('click', processPdf);

    const params = new URLSearchParams(window.location.search);
    setMode(params.get('mode') || 'merge');
    window.addEventListener('everything-language-change', () => setMode(state.mode));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
