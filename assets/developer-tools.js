(function () {
  const page = document.body.dataset.devTool || '';
  const input = document.getElementById('devInput');
  const output = document.getElementById('devOutput');
  const status = document.getElementById('devStatus');
  const primary = document.getElementById('devPrimary');
  const copyButton = document.getElementById('copyOutput');
  const downloadButton = document.getElementById('downloadOutput');
  const sampleButton = document.getElementById('loadSample');
  const clearButton = document.getElementById('clearInput');
  const fileInput = document.getElementById('devFileInput');
  const tabs = Array.from(document.querySelectorAll('[data-mode]'));

  let mode = document.querySelector('[data-mode].active')?.dataset.mode || 'format';

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message || '';
    status.className = 'dev-status' + (type ? ' ' + type : '');
  }

  function setOutput(value) {
    if (!output) return;
    output.value = value || '';
    if (copyButton) copyButton.disabled = !output.value;
    if (downloadButton) downloadButton.disabled = !output.value;
  }

  function sampleForCurrentPage() {
    if (page === 'json-formatter') {
      return '{"name":"EverythingConvert","tools":["PDF","Image","Developer"],"active":true,"stats":{"users":1280,"formats":42}}';
    }
    if (page === 'base64') {
      return 'EverythingConvert makes browser-based file and text tools easier to use.';
    }
    return 'https://www.everythingconvert.com/search?q=PDF to Word&lang=en';
  }

  function updatePrimaryLabel() {
    if (!primary) return;
    const labels = {
      format: 'Format JSON',
      minify: 'Minify JSON',
      validate: 'Validate JSON',
      encode: page === 'url-encoder' ? 'Encode URL' : 'Encode Base64',
      decode: page === 'url-encoder' ? 'Decode URL' : 'Decode Base64'
    };
    primary.innerHTML = `${labels[mode] || 'Convert'} <i class="fa-solid fa-arrow-right"></i>`;
  }

  function parseJson(text) {
    if (!text.trim()) throw new Error('Paste JSON first.');
    return JSON.parse(text);
  }

  function runJsonTool() {
    const data = parseJson(input.value);
    if (mode === 'validate') {
      const type = Array.isArray(data) ? 'array' : typeof data;
      const count = Array.isArray(data) ? ` with ${data.length} items` : '';
      setOutput(JSON.stringify(data, null, 2));
      setStatus(`Valid JSON ${type}${count}.`, 'success');
      return;
    }
    const formatted = mode === 'minify' ? JSON.stringify(data) : JSON.stringify(data, null, 2);
    setOutput(formatted);
    setStatus(mode === 'minify' ? 'JSON minified.' : 'JSON formatted.', 'success');
  }

  function bytesToBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function base64ToText(text) {
    const binary = atob(text.replace(/\s+/g, ''));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function runBase64Tool() {
    if (!input.value.trim()) throw new Error('Enter text or Base64 first.');
    if (mode === 'decode') {
      setOutput(base64ToText(input.value));
      setStatus('Base64 decoded.', 'success');
      return;
    }
    setOutput(bytesToBase64(input.value));
    setStatus('Text encoded to Base64.', 'success');
  }

  function runUrlTool() {
    if (!input.value.trim()) throw new Error('Enter text or a URL first.');
    if (mode === 'decode') {
      setOutput(decodeURIComponent(input.value.replace(/\+/g, ' ')));
      setStatus('URL decoded.', 'success');
      return;
    }
    setOutput(encodeURIComponent(input.value));
    setStatus('URL encoded.', 'success');
  }

  function runTool() {
    try {
      if (page === 'json-formatter') runJsonTool();
      if (page === 'base64') runBase64Tool();
      if (page === 'url-encoder') runUrlTool();
    } catch (error) {
      setOutput('');
      setStatus(error.message || 'Unable to process the input.', 'error');
    }
  }

  tabs.forEach((button) => {
    button.addEventListener('click', () => {
      mode = button.dataset.mode;
      tabs.forEach((item) => item.classList.toggle('active', item === button));
      setStatus('');
      updatePrimaryLabel();
    });
  });

  primary?.addEventListener('click', runTool);

  sampleButton?.addEventListener('click', () => {
    input.value = sampleForCurrentPage();
    setStatus('Sample loaded.');
    input.focus();
  });

  clearButton?.addEventListener('click', () => {
    input.value = '';
    setOutput('');
    setStatus('');
    input.focus();
  });

  copyButton?.addEventListener('click', async () => {
    if (!output.value) return;
    await navigator.clipboard.writeText(output.value);
    setStatus('Output copied to clipboard.', 'success');
  });

  downloadButton?.addEventListener('click', () => {
    if (!output.value) return;
    const extension = page === 'json-formatter' ? 'json' : 'txt';
    const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${page || 'developer-output'}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  });

  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    input.value = await file.text();
    setStatus(`${file.name} loaded.`);
  });

  updatePrimaryLabel();
  setOutput('');
})();
