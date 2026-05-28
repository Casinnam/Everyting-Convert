(function () {
  const SAMPLE_JSON = JSON.stringify([
    {
      id: 1,
      name: 'Everything Convert',
      plan: 'Pro',
      contact: { email: 'everythingconvert@gmail.com', country: 'Canada' },
      tools: ['PDF', 'Image', 'Developer']
    },
    {
      id: 2,
      name: 'Sample User',
      plan: 'Free',
      contact: { email: 'sample@example.com', country: 'United States' },
      tools: ['QR', 'CSV']
    }
  ], null, 2);

  const input = document.getElementById('jsonInput');
  const output = document.getElementById('csvOutput');
  const status = document.getElementById('jsonStatus');
  const previewTable = document.getElementById('csvPreviewTable');
  const emptyState = document.getElementById('csvEmptyState');
  const flattenInput = document.getElementById('flattenInput');
  const bomInput = document.getElementById('bomInput');
  const delimiterSelect = document.getElementById('delimiterSelect');
  const copyButton = document.getElementById('copyButton');
  const downloadButton = document.getElementById('downloadButton');
  let currentCsv = '';

  function setStatus(message, type) {
    status.textContent = message;
    status.className = `json-status${type ? ` ${type}` : ''}`;
  }

  function parseJson() {
    const text = input.value.trim();
    if (!text) throw new Error('Paste JSON or upload a .json file first.');
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
  }

  function normalizeRows(data) {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      const arrayEntries = Object.entries(data).filter(([, value]) => Array.isArray(value));
      if (arrayEntries.length === 1) return arrayEntries[0][1];
      return [data];
    }
    throw new Error('JSON must be an object or an array.');
  }

  function flattenObject(value, prefix = '', result = {}) {
    if (Array.isArray(value)) {
      result[prefix || 'value'] = value.map((item) => (
        item && typeof item === 'object' ? JSON.stringify(item) : item
      )).join('|');
      return result;
    }
    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => {
        const nextKey = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === 'object' && !Array.isArray(child)) {
          flattenObject(child, nextKey, result);
        } else if (Array.isArray(child)) {
          result[nextKey] = child.map((item) => (
            item && typeof item === 'object' ? JSON.stringify(item) : item
          )).join('|');
        } else {
          result[nextKey] = child;
        }
      });
      return result;
    }
    result[prefix || 'value'] = value;
    return result;
  }

  function rowToObject(row, index) {
    if (row && typeof row === 'object' && !Array.isArray(row)) {
      return flattenInput.checked ? flattenObject(row) : stringifyComplex(row);
    }
    return { value: Array.isArray(row) ? JSON.stringify(row) : row, row: index + 1 };
  }

  function stringifyComplex(object) {
    return Object.entries(object).reduce((result, [key, value]) => {
      result[key] = value && typeof value === 'object' ? JSON.stringify(value) : value;
      return result;
    }, {});
  }

  function csvEscape(value, delimiter) {
    if (value === null || typeof value === 'undefined') return '';
    const stringValue = String(value);
    if (stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r') || stringValue.includes(delimiter)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  function buildCsv(rows) {
    const delimiter = delimiterSelect.value === '\\t' ? '\t' : delimiterSelect.value;
    const objects = rows.map(rowToObject);
    const headers = Array.from(objects.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set()));
    if (!headers.length) throw new Error('No columns were found in this JSON.');
    const lines = [
      headers.map((header) => csvEscape(header, delimiter)).join(delimiter),
      ...objects.map((row) => headers.map((header) => csvEscape(row[header], delimiter)).join(delimiter))
    ];
    return { csv: lines.join('\n'), headers, objects };
  }

  function renderPreview(headers, rows) {
    previewTable.querySelector('thead').innerHTML = `<tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>`;
    previewTable.querySelector('tbody').innerHTML = rows.slice(0, 50).map((row) => (
      `<tr>${headers.map((header) => `<td title="${escapeHtml(row[header] ?? '')}">${escapeHtml(row[header] ?? '')}</td>`).join('')}</tr>`
    )).join('');
    emptyState.hidden = true;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  function convert() {
    try {
      const data = parseJson();
      const rows = normalizeRows(data);
      if (!rows.length) throw new Error('The JSON array is empty.');
      const result = buildCsv(rows);
      currentCsv = bomInput.checked ? `\ufeff${result.csv}` : result.csv;
      output.value = currentCsv;
      renderPreview(result.headers, result.objects);
      copyButton.disabled = false;
      downloadButton.disabled = false;
      setStatus(`Converted ${result.objects.length} row(s) and ${result.headers.length} column(s).`, 'success');
    } catch (error) {
      currentCsv = '';
      output.value = '';
      copyButton.disabled = true;
      downloadButton.disabled = true;
      previewTable.querySelector('thead').innerHTML = '';
      previewTable.querySelector('tbody').innerHTML = '';
      emptyState.hidden = false;
      setStatus(error.message, 'error');
    }
  }

  async function copyCsv() {
    if (!currentCsv) return;
    try {
      await navigator.clipboard.writeText(currentCsv);
      setStatus('CSV copied to clipboard.', 'success');
    } catch {
      output.focus();
      output.select();
      document.execCommand('copy');
      setStatus('CSV copied to clipboard.', 'success');
    }
  }

  function downloadCsv() {
    if (!currentCsv) return;
    const blob = new Blob([currentCsv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'everythingconvert-data.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus('CSV download started.', 'success');
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      input.value = reader.result || '';
      convert();
    };
    reader.onerror = () => setStatus('Could not read this JSON file.', 'error');
    reader.readAsText(file);
  }

  function init() {
    input.value = SAMPLE_JSON;
    document.getElementById('convertButton').addEventListener('click', convert);
    document.getElementById('sampleButton').addEventListener('click', () => {
      input.value = SAMPLE_JSON;
      convert();
    });
    document.getElementById('clearButton').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      currentCsv = '';
      copyButton.disabled = true;
      downloadButton.disabled = true;
      previewTable.querySelector('thead').innerHTML = '';
      previewTable.querySelector('tbody').innerHTML = '';
      emptyState.hidden = false;
      setStatus('Paste JSON to start.');
    });
    document.getElementById('jsonFileInput').addEventListener('change', (event) => loadFile(event.target.files[0]));
    copyButton.addEventListener('click', copyCsv);
    downloadButton.addEventListener('click', downloadCsv);
    flattenInput.addEventListener('change', () => input.value.trim() && convert());
    bomInput.addEventListener('change', () => input.value.trim() && convert());
    delimiterSelect.addEventListener('change', () => input.value.trim() && convert());
    convert();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
