(function () {
  /* ================================================================
   *  CSV Converter  –  EverythingConvert
   *  Modes: CSV to JSON | CSV to XLSX | XLSX to CSV | CSV to XML
   *  All conversion runs in the browser. No data is uploaded.
   * ================================================================ */

  /* ---------- helpers ---------- */
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[ch];
    });
  }

  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[ch];
    });
  }

  /* ---------- CSV parser (RFC 4180 compliant) ---------- */
  function detectDelimiter(text) {
    var firstLine = text.split(/\r?\n/)[0] || '';
    var commas = (firstLine.match(/,/g) || []).length;
    var tabs = (firstLine.match(/\t/g) || []).length;
    var semis = (firstLine.match(/;/g) || []).length;
    if (tabs > commas && tabs > semis) return '\t';
    if (semis > commas) return ';';
    return ',';
  }

  function parseCsv(text, delimiter) {
    if (!delimiter) delimiter = detectDelimiter(text);
    var rows = [];
    var row = [];
    var cell = '';
    var inQuote = false;
    var i = 0;
    var len = text.length;
    while (i < len) {
      var ch = text[i];
      if (inQuote) {
        if (ch === '"') {
          if (i + 1 < len && text[i + 1] === '"') {
            cell += '"';
            i += 2;
            continue;
          }
          inQuote = false;
          i++;
          continue;
        }
        cell += ch;
        i++;
        continue;
      }
      if (ch === '"') {
        inQuote = true;
        i++;
        continue;
      }
      if (ch === delimiter) {
        row.push(cell);
        cell = '';
        i++;
        continue;
      }
      if (ch === '\r') {
        if (i + 1 < len && text[i + 1] === '\n') i++;
        row.push(cell);
        cell = '';
        rows.push(row);
        row = [];
        i++;
        continue;
      }
      if (ch === '\n') {
        row.push(cell);
        cell = '';
        rows.push(row);
        row = [];
        i++;
        continue;
      }
      cell += ch;
      i++;
    }
    if (cell.length > 0 || row.length > 0) {
      row.push(cell);
      rows.push(row);
    }
    return rows;
  }

  /* ---------- CSV builder ---------- */
  function csvEscape(value, delimiter) {
    if (value === null || value === undefined) return '';
    var s = String(value);
    if (s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1 || s.indexOf(delimiter) !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function buildCsvFromRows(headers, dataRows, delimiter) {
    var lines = [headers.map(function (h) { return csvEscape(h, delimiter); }).join(delimiter)];
    for (var i = 0; i < dataRows.length; i++) {
      lines.push(headers.map(function (h) { return csvEscape(dataRows[i][h], delimiter); }).join(delimiter));
    }
    return lines.join('\n');
  }

  /* ---------- mode definitions ---------- */
  var MODES = {
    'csv-json': {
      label: 'CSV to JSON',
      inputLabel: 'Paste CSV',
      outputLabel: 'JSON Output',
      inputAccept: '.csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain',
      fileMode: 'text'
    },
    'csv-xlsx': {
      label: 'CSV to Excel',
      inputLabel: 'Paste CSV',
      outputLabel: 'Excel Ready',
      inputAccept: '.csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain',
      fileMode: 'text'
    },
    'xlsx-csv': {
      label: 'Excel to CSV',
      inputLabel: 'Upload Excel',
      outputLabel: 'CSV Output',
      inputAccept: '.xlsx,.xls,.ods,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
      fileMode: 'binary'
    },
    'csv-xml': {
      label: 'CSV to XML',
      inputLabel: 'Paste CSV',
      outputLabel: 'XML Output',
      inputAccept: '.csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain',
      fileMode: 'text'
    }
  };

  /* ---------- state ---------- */
  var currentMode = 'csv-json';
  var currentOutput = '';
  var loadedFileName = '';

  /* ---------- DOM refs ---------- */
  var modeButtons = document.querySelectorAll('[data-csv-mode]');
  var inputArea = document.getElementById('csvInputArea');
  var dropZone = document.getElementById('csvDropZone');
  var dropLabel = document.getElementById('csvDropLabel');
  var fileInput = document.getElementById('csvFileInput');
  var fileNameEl = document.getElementById('csvFileName');
  var inputToolbarLabel = document.getElementById('csvInputLabel');
  var outputToolbarLabel = document.getElementById('csvOutputLabel');
  var convertBtn = document.getElementById('csvConvertBtn');
  var convertBtnText = document.getElementById('csvConvertBtnText');
  var copyBtn = document.getElementById('csvCopyBtn');
  var downloadBtn = document.getElementById('csvDownloadBtn');
  var clearBtn = document.getElementById('csvClearBtn');
  var sampleBtn = document.getElementById('csvSampleBtn');
  var previewTable = document.getElementById('csvPreviewTable');
  var emptyState = document.getElementById('csvEmptyState');
  var outputArea = document.getElementById('csvOutputArea');
  var statusEl = document.getElementById('csvStatus');
  var delimiterSelect = document.getElementById('csvDelimiter');
  var bomCheck = document.getElementById('csvBom');
  var headerCheck = document.getElementById('csvHeaderCheck');

  /* ---------- UI updates ---------- */
  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'csv-status' + (type ? ' ' + type : '');
  }

  function updateUIForMode() {
    var m = MODES[currentMode];
    for (var i = 0; i < modeButtons.length; i++) {
      modeButtons[i].classList.toggle('active', modeButtons[i].getAttribute('data-csv-mode') === currentMode);
    }
    inputToolbarLabel.textContent = m.inputLabel;
    outputToolbarLabel.textContent = m.outputLabel;
    convertBtnText.textContent = m.label;
    fileInput.setAttribute('accept', m.inputAccept);

    var isBinary = m.fileMode === 'binary';
    if (inputArea) inputArea.style.display = isBinary ? 'none' : '';
    if (dropZone) dropZone.style.display = isBinary ? '' : 'none';
    if (dropLabel) dropLabel.textContent = isBinary ? 'Drag & drop your Excel file here' : 'Drag & drop your CSV file here';

    /* show/hide options per mode */
    var delimRow = delimiterSelect ? delimiterSelect.closest('label') : null;
    var bomRow = bomCheck ? bomCheck.closest('label') : null;
    var headerRow = headerCheck ? headerCheck.closest('label') : null;
    if (delimRow) delimRow.style.display = (currentMode === 'xlsx-csv' || currentMode === 'csv-json') ? '' : '';
    if (bomRow) bomRow.style.display = (currentMode === 'xlsx-csv') ? '' : '';
    if (headerRow) headerRow.style.display = '';

    clearOutput();
    setStatus('Upload a file or paste data to start.', '');
  }

  function clearOutput() {
    currentOutput = '';
    if (outputArea) outputArea.value = '';
    if (previewTable) {
      previewTable.querySelector('thead').innerHTML = '';
      previewTable.querySelector('tbody').innerHTML = '';
    }
    if (emptyState) emptyState.hidden = false;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
  }

  function renderPreview(headers, objects) {
    if (!previewTable || !emptyState) return;
    var thead = previewTable.querySelector('thead');
    var tbody = previewTable.querySelector('tbody');
    thead.innerHTML = '<tr>' + headers.map(function (h) { return '<th>' + escapeHtml(h) + '</th>'; }).join('') + '</tr>';
    var limit = Math.min(objects.length, 100);
    var html = '';
    for (var i = 0; i < limit; i++) {
      html += '<tr>';
      for (var j = 0; j < headers.length; j++) {
        var v = objects[i][headers[j]];
        var s = v !== null && v !== undefined ? String(v) : '';
        html += '<td title="' + escapeHtml(s) + '">' + escapeHtml(s) + '</td>';
      }
      html += '</tr>';
    }
    tbody.innerHTML = html;
    emptyState.hidden = true;
  }

  /* ---------- sample data ---------- */
  var SAMPLE_CSV = 'name,email,country,plan\nEverything Convert,everythingconvert@gmail.com,Canada,Pro\nSample User,sample@example.com,United States,Free\nTest User,test@example.com,Japan,Free';

  function loadSample() {
    if (currentMode === 'xlsx-csv') {
      setStatus('Sample is not available for Excel to CSV mode. Please upload an .xlsx file.', 'error');
      return;
    }
    if (inputArea) inputArea.value = SAMPLE_CSV;
    fileNameEl.textContent = 'sample-data.csv';
    loadedFileName = 'sample-data.csv';
    convert(false);
  }

  /* ---------- file loading ---------- */
  function handleFile(file) {
    if (!file) return;
    loadedFileName = file.name;
    fileNameEl.textContent = file.name;
    var m = MODES[currentMode];
    if (m.fileMode === 'binary') {
      var reader = new FileReader();
      reader.onload = function () {
        processBinaryFile(new Uint8Array(reader.result), file.name);
      };
      reader.onerror = function () { setStatus('Could not read this file.', 'error'); };
      reader.readAsArrayBuffer(file);
    } else {
      var reader2 = new FileReader();
      reader2.onload = function () {
        if (inputArea) inputArea.value = reader2.result || '';
        convert(true);
      };
      reader2.onerror = function () { setStatus('Could not read this file.', 'error'); };
      reader2.readAsText(file, 'UTF-8');
    }
  }

  function processBinaryFile(uint8, filename) {
    if (typeof XLSX === 'undefined') {
      setStatus('SheetJS library is loading. Please try again in a moment.', 'error');
      return;
    }
    try {
      var workbook = XLSX.read(uint8, { type: 'array' });
      var sheetName = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheetName];
      var delimiter = delimiterSelect ? delimiterSelect.value : ',';
      if (delimiter === '\\t') delimiter = '\t';
      var csvText = XLSX.utils.sheet_to_csv(sheet, { FS: delimiter });

      if (bomCheck && bomCheck.checked) {
        csvText = '\ufeff' + csvText;
      }

      var rows = parseCsv(csvText, delimiter);
      if (rows.length === 0) throw new Error('The spreadsheet appears to be empty.');
      var headers = rows[0];
      var objects = [];
      for (var i = 1; i < rows.length; i++) {
        var obj = {};
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = rows[i][j] !== undefined ? rows[i][j] : '';
        }
        objects.push(obj);
      }

      currentOutput = csvText;
      if (outputArea) outputArea.value = csvText;
      renderPreview(headers, objects);
      copyBtn.disabled = false;
      downloadBtn.disabled = false;
      setStatus('Converted ' + objects.length + ' row(s) and ' + headers.length + ' column(s) from sheet "' + sheetName + '".', 'success');
      recordHistory(filename, objects.length, headers.length);
    } catch (err) {
      clearOutput();
      setStatus(err.message || 'Failed to read Excel file.', 'error');
    }
  }

  /* ---------- conversion ---------- */
  function convert(shouldRecord) {
    if (currentMode === 'xlsx-csv') {
      setStatus('Please upload an Excel (.xlsx) file using the drop zone above.', 'error');
      return;
    }
    var text = inputArea ? inputArea.value.trim() : '';
    if (!text) {
      setStatus('Paste CSV data or upload a file first.', 'error');
      return;
    }
    try {
      var delimiter = delimiterSelect ? delimiterSelect.value : ',';
      if (delimiter === '\\t') delimiter = '\t';
      var rows = parseCsv(text, delimiter);
      if (rows.length === 0) throw new Error('No data found in the CSV.');

      var hasHeader = headerCheck ? headerCheck.checked : true;
      var headers;
      var dataStart;
      if (hasHeader) {
        headers = rows[0];
        dataStart = 1;
      } else {
        headers = [];
        for (var c = 0; c < rows[0].length; c++) headers.push('column_' + (c + 1));
        dataStart = 0;
      }

      var objects = [];
      for (var i = dataStart; i < rows.length; i++) {
        var obj = {};
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = rows[i][j] !== undefined ? rows[i][j] : '';
        }
        objects.push(obj);
      }

      if (objects.length === 0) throw new Error('The CSV contains headers but no data rows.');

      var result;
      var resultType;
      if (currentMode === 'csv-json') {
        result = JSON.stringify(objects, null, 2);
        resultType = 'json';
      } else if (currentMode === 'csv-xml') {
        result = buildXml(headers, objects);
        resultType = 'xml';
      } else if (currentMode === 'csv-xlsx') {
        result = buildXlsx(headers, objects);
        resultType = 'xlsx';
      }

      if (resultType === 'xlsx') {
        /* binary – no text output */
        currentOutput = result;
        renderPreview(headers, objects);
        copyBtn.disabled = true;
        downloadBtn.disabled = false;
        setStatus('Converted ' + objects.length + ' row(s) and ' + headers.length + ' column(s). Ready to download.', 'success');
      } else {
        currentOutput = result;
        if (outputArea) outputArea.value = result;
        renderPreview(headers, objects);
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
        setStatus('Converted ' + objects.length + ' row(s) and ' + headers.length + ' column(s).', 'success');
      }

      if (shouldRecord) recordHistory(loadedFileName || 'pasted-data', objects.length, headers.length);
    } catch (err) {
      clearOutput();
      setStatus(err.message, 'error');
    }
  }

  /* ---------- CSV to XML ---------- */
  function buildXml(headers, objects) {
    var lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<records>'];
    for (var i = 0; i < objects.length; i++) {
      lines.push('  <record>');
      for (var j = 0; j < headers.length; j++) {
        var tag = headers[j].replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1') || 'field';
        lines.push('    <' + tag + '>' + escapeXml(objects[i][headers[j]] || '') + '</' + tag + '>');
      }
      lines.push('  </record>');
    }
    lines.push('</records>');
    return lines.join('\n');
  }

  /* ---------- CSV to XLSX ---------- */
  function buildXlsx(headers, objects) {
    if (typeof XLSX === 'undefined') {
      throw new Error('SheetJS library is still loading. Please try again in a moment.');
    }
    var aoaData = [headers];
    for (var i = 0; i < objects.length; i++) {
      var row = [];
      for (var j = 0; j < headers.length; j++) {
        row.push(objects[i][headers[j]] || '');
      }
      aoaData.push(row);
    }
    var ws = XLSX.utils.aoa_to_sheet(aoaData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  /* ---------- copy & download ---------- */
  function copyOutput() {
    if (!currentOutput || typeof currentOutput !== 'string') return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentOutput).then(function () {
        setStatus('Copied to clipboard.', 'success');
      });
    } else {
      if (outputArea) {
        outputArea.focus();
        outputArea.select();
        document.execCommand('copy');
        setStatus('Copied to clipboard.', 'success');
      }
    }
  }

  function downloadOutput() {
    if (!currentOutput) return;
    var blob;
    var ext;
    if (currentMode === 'csv-json') {
      blob = new Blob([currentOutput], { type: 'application/json;charset=utf-8' });
      ext = '.json';
    } else if (currentMode === 'csv-xml') {
      blob = new Blob([currentOutput], { type: 'application/xml;charset=utf-8' });
      ext = '.xml';
    } else if (currentMode === 'csv-xlsx') {
      blob = new Blob([currentOutput], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      ext = '.xlsx';
    } else if (currentMode === 'xlsx-csv') {
      blob = new Blob([currentOutput], { type: 'text/csv;charset=utf-8' });
      ext = '.csv';
    } else {
      blob = new Blob([currentOutput], { type: 'text/plain;charset=utf-8' });
      ext = '.txt';
    }
    var baseName = loadedFileName ? loadedFileName.replace(/\.[^.]+$/, '') : 'everythingconvert-data';
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = baseName + ext;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus('Download started.', 'success');
  }

  /* ---------- conversion history ---------- */
  function recordHistory(filename, rows, cols) {
    if (window.EverythingConvertHistory && typeof window.EverythingConvertHistory.recordToolConversion === 'function') {
      window.EverythingConvertHistory.recordToolConversion({
        tool_id: 'csv-converter',
        tool_name: 'CSV Converter (' + MODES[currentMode].label + ')',
        output_filename: filename,
        output_size: currentOutput ? (typeof currentOutput === 'string' ? new Blob([currentOutput]).size : currentOutput.byteLength) : 0,
        status: 'completed',
        metadata: { mode: currentMode, rows: rows, columns: cols }
      });
    }
  }

  /* ---------- init ---------- */
  function detectModeFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var mode = params.get('mode');
    if (mode && MODES[mode]) return mode;
    return 'csv-json';
  }

  function init() {
    currentMode = detectModeFromUrl();
    updateUIForMode();

    /* mode switching */
    for (var i = 0; i < modeButtons.length; i++) {
      modeButtons[i].addEventListener('click', (function (btn) {
        return function () {
          var newMode = btn.getAttribute('data-csv-mode');
          if (newMode && MODES[newMode]) {
            currentMode = newMode;
            var url = new URL(window.location);
            url.searchParams.set('mode', currentMode);
            window.history.replaceState(null, '', url);
            updateUIForMode();
          }
        };
      })(modeButtons[i]));
    }

    /* convert */
    convertBtn.addEventListener('click', function () { convert(true); });

    /* sample */
    if (sampleBtn) sampleBtn.addEventListener('click', loadSample);

    /* clear */
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (inputArea) inputArea.value = '';
        loadedFileName = '';
        fileNameEl.textContent = 'No file selected';
        clearOutput();
        setStatus('Upload a file or paste data to start.', '');
      });
    }

    /* file input */
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
      });
    }

    /* drop zone drag & drop */
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) { e.preventDefault(); dropZone.classList.add('dragging'); });
      });
      ['dragleave', 'drop'].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) {
          e.preventDefault();
          dropZone.classList.remove('dragging');
          if (evt === 'drop' && e.dataTransfer && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        });
      });
    }

    /* binary file input inside drop zone */
    var binaryInput = document.getElementById('csvFileInputBinary');
    if (binaryInput) {
      binaryInput.addEventListener('change', function () {
        if (binaryInput.files[0]) handleFile(binaryInput.files[0]);
      });
    }

    /* copy & download */
    copyBtn.addEventListener('click', copyOutput);
    downloadBtn.addEventListener('click', downloadOutput);

    /* option changes trigger re-convert for text modes */
    if (delimiterSelect) delimiterSelect.addEventListener('change', function () { if (inputArea && inputArea.value.trim()) convert(false); });
    if (headerCheck) headerCheck.addEventListener('change', function () { if (inputArea && inputArea.value.trim()) convert(false); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
