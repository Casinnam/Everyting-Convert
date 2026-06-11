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
    const english = labels[mode] || 'Convert';
    const language = getLanguage();
    const translated = i18n[language]?.[english] || english;
    primary.innerHTML = `${translated} <i class="fa-solid fa-arrow-right"></i>`;
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

  const i18n = {
    ko: {
      'Home': '홈',
      'Developer': '개발자',
      'Browser-based': '브라우저 기반',
      'No signup required': '회원가입 필요 없음',
      'Private input': '입력 내용 비공개',
      'Input': '입력',
      'Output': '출력',
      'Upload': '업로드',
      'Sample': '샘플',
      'Clear': '지우기',
      'Copy': '복사',
      'Download': '다운로드',
      'Format': '정리',
      'Minify': '압축',
      'Validate': '검증',
      'Encode': '인코딩',
      'Decode': '디코딩',
      'JSON Formatter': 'JSON 정리 도구',
      'JSON Formatter & Validator': '<span>JSON</span> 정리 및 검증 도구',
      'Paste JSON': 'JSON 붙여넣기',
      'Formatted JSON': '정리된 JSON',
      'Format JSON': 'JSON 정리',
      'Minify JSON': 'JSON 압축',
      'Validate JSON': 'JSON 검증',
      'Paste JSON to format it for reading, minify it for production, or validate syntax before using it in an API, app, or spreadsheet workflow.': 'JSON을 붙여넣어 읽기 좋게 정리하거나, 운영용으로 압축하거나, API와 앱에서 사용하기 전에 문법을 검증하세요.',
      'Paste JSON here, for example: {"name":"EverythingConvert","active":true}': '여기에 JSON을 붙여넣으세요. 예: {"name":"EverythingConvert","active":true}',
      'Formatted or validated JSON will appear here.': '정리되거나 검증된 JSON이 여기에 표시됩니다.',
      'Readable JSON': '읽기 쉬운 JSON',
      'Indent messy JSON so APIs, logs, and settings files are easier to inspect.': '복잡한 JSON을 들여쓰기하여 API 응답, 로그, 설정 파일을 쉽게 확인하세요.',
      'Minify for production': '운영용 압축',
      'Remove extra whitespace when you need compact JSON for transport or storage.': '전송이나 저장을 위해 불필요한 공백을 제거하세요.',
      'Private by design': '개인정보 중심 설계',
      'Your JSON is processed locally in your browser and is not uploaded.': 'JSON은 브라우저에서만 처리되며 서버로 업로드되지 않습니다.',
      'How to use this JSON formatter': 'JSON 정리 도구 사용 방법',
      'Paste JSON or upload a .json file.': 'JSON을 붙여넣거나 .json 파일을 업로드하세요.',
      'Choose Format, Minify, or Validate.': '정리, 압축, 검증 중 하나를 선택하세요.',
      'Copy or download the result when the JSON is ready.': '결과가 준비되면 복사하거나 다운로드하세요.',
      'Does it fix invalid JSON automatically?': '잘못된 JSON을 자동으로 고치나요?',
      'No. It shows a syntax error so you can correct the original data safely.': '아니요. 원본 데이터를 안전하게 수정할 수 있도록 문법 오류를 알려줍니다.',
      'Is my JSON uploaded?': 'JSON이 업로드되나요?',
      'No. The formatting and validation happen in your browser.': '아니요. 정리와 검증은 브라우저 안에서 실행됩니다.',
      'Can I format API responses?': 'API 응답도 정리할 수 있나요?',
      'Yes. Paste a JSON response from an API to make it easier to read.': '네. API의 JSON 응답을 붙여넣으면 읽기 쉽게 정리됩니다.',
      'Base64 Encode Decode': 'Base64 인코딩 / 디코딩',
      'Base64 Encode / Decode': '<span>Base64</span> 인코딩 / 디코딩',
      'Text or Base64': '텍스트 또는 Base64',
      'Result': '결과',
      'Encode Base64': 'Base64 인코딩',
      'Decode Base64': 'Base64 디코딩',
      'Convert readable text into Base64 for data URLs, tokens, and developer workflows, or decode Base64 back into plain text.': '읽을 수 있는 텍스트를 Base64로 변환하거나 Base64를 다시 일반 텍스트로 디코딩하세요.',
      'Type or paste text here.': '여기에 텍스트를 입력하거나 붙여넣으세요.',
      'Encoded or decoded text will appear here.': '인코딩 또는 디코딩된 텍스트가 여기에 표시됩니다.',
      'Two-way conversion': '양방향 변환',
      'Encode plain text to Base64 or decode Base64 back to readable UTF-8 text.': '일반 텍스트를 Base64로 인코딩하거나 Base64를 읽을 수 있는 UTF-8 텍스트로 디코딩하세요.',
      'Developer friendly': '개발자 친화적',
      'Useful for data URLs, API examples, configuration strings, and quick debugging.': '데이터 URL, API 예시, 설정 문자열, 빠른 디버깅에 유용합니다.',
      'Local processing': '로컬 처리',
      'The conversion runs in your browser and does not need an API key.': '변환은 브라우저에서 실행되며 API 키가 필요 없습니다.',
      'How to use Base64 encode decode': 'Base64 인코딩/디코딩 사용 방법',
      'Paste text or a Base64 string.': '텍스트 또는 Base64 문자열을 붙여넣으세요.',
      'Choose Encode or Decode.': '인코딩 또는 디코딩을 선택하세요.',
      'Copy or download the result.': '결과를 복사하거나 다운로드하세요.',
      'Is Base64 encryption?': 'Base64는 암호화인가요?',
      'No. Base64 is encoding, not security. Anyone can decode it.': '아니요. Base64는 암호화가 아니라 인코딩입니다. 누구나 디코딩할 수 있습니다.',
      'Does it support Korean or accented text?': '한국어나 악센트 문자를 지원하나요?',
      'Yes. The tool uses UTF-8 encoding for readable Unicode text.': '네. 읽을 수 있는 유니코드 텍스트를 위해 UTF-8을 사용합니다.',
      'Is my text uploaded?': '텍스트가 업로드되나요?',
      'No. Everything runs locally in your browser.': '아니요. 모든 작업은 브라우저에서 로컬로 실행됩니다.',
      'URL Encoder Decoder': 'URL 인코딩 / 디코딩',
      'URL Encoder / Decoder': '<span>URL</span> 인코딩 / 디코딩',
      'URL or text': 'URL 또는 텍스트',
      'Encode URL': 'URL 인코딩',
      'Decode URL': 'URL 디코딩',
      'Encode query strings and special characters for safe URLs, or decode percent-encoded links back into readable text.': '쿼리 문자열과 특수 문자를 안전한 URL 형식으로 인코딩하거나, 퍼센트 인코딩된 링크를 읽기 쉬운 텍스트로 디코딩하세요.',
      'Paste a URL, query string, or text with spaces and symbols.': 'URL, 쿼리 문자열, 공백과 기호가 포함된 텍스트를 붙여넣으세요.',
      'Encoded or decoded URL text will appear here.': '인코딩 또는 디코딩된 URL 텍스트가 여기에 표시됩니다.',
      'Safe URL text': '안전한 URL 텍스트',
      'Encode spaces, symbols, and non-English text for query strings and links.': '공백, 기호, 비영어 문자를 쿼리 문자열과 링크에 맞게 인코딩하세요.',
      'Decode for debugging': '디버깅용 디코딩',
      'Turn percent-encoded URLs back into readable text when checking tracking links.': '추적 링크를 확인할 때 퍼센트 인코딩된 URL을 읽기 쉬운 텍스트로 바꿉니다.',
      'No server needed': '서버 불필요',
      'The tool runs locally in your browser and does not require an API key.': '이 도구는 브라우저에서 로컬로 실행되며 API 키가 필요하지 않습니다.',
      'How to use URL encoder decoder': 'URL 인코딩/디코딩 사용 방법',
      'Paste text, a URL, or a query string.': '텍스트, URL 또는 쿼리 문자열을 붙여넣으세요.',
      'Copy the clean result for your app, link, or campaign URL.': '앱, 링크, 캠페인 URL에 사용할 결과를 복사하세요.',
      'When should I encode a URL?': '언제 URL을 인코딩해야 하나요?',
      'Encode text before placing spaces, symbols, or non-English characters into a URL parameter.': '공백, 기호, 비영어 문자를 URL 파라미터에 넣기 전에 인코딩하세요.',
      'Can it decode UTM links?': 'UTM 링크도 디코딩할 수 있나요?',
      'Yes. Paste an encoded URL or query value to make it easier to read.': '네. 인코딩된 URL이나 쿼리 값을 붙여넣으면 읽기 쉽게 바꿔줍니다.',
      'Is anything uploaded?': '무언가 업로드되나요?',
      'Encoding and decoding happen in your browser.': '인코딩과 디코딩은 브라우저 안에서 실행됩니다.'
    }
  };

  function getLanguage() {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl) return fromUrl;
      return localStorage.getItem('everything_convert_language') || document.documentElement.lang || 'en';
    } catch (error) {
      return document.documentElement.lang || 'en';
    }
  }

  function rememberEnglish(node, html) {
    if (!node) return;
    if (node.dataset.devI18nEn === undefined) node.dataset.devI18nEn = html ? node.innerHTML : node.textContent.trim();
  }

  function translateNode(node, language, html) {
    if (!node) return;
    rememberEnglish(node, html);
    const english = node.dataset.devI18nEn;
    const translated = i18n[language]?.[english];
    if (html) node.innerHTML = translated || english;
    else if (node.children.length) {
      Array.from(node.childNodes)
        .filter((child) => child.nodeType === Node.TEXT_NODE)
        .forEach((child) => child.remove());
      const text = document.createTextNode(` ${translated || english} `);
      const inputChild = Array.from(node.childNodes).find((child) => child.nodeType === Node.ELEMENT_NODE && child.tagName === 'INPUT');
      if (inputChild) node.insertBefore(text, inputChild);
      else node.appendChild(text);
    } else {
      node.textContent = translated || english;
    }
  }

  function translateExactText(language) {
    const selector = '.dev-breadcrumb a, .dev-breadcrumb span, .dev-benefits span, .dev-toolbar p, .dev-toolbar h2, .dev-tabs button, .dev-actions button, .dev-file-button, .dev-info-grid strong, .dev-info-grid span, .dev-guide-panel h2, .dev-guide-panel li, .dev-guide-panel summary, .dev-guide-panel p';
    document.querySelectorAll(selector).forEach((node) => translateNode(node, language, false));
    translateNode(document.querySelector('.dev-hero h1'), language, true);
    translateNode(document.querySelector('.dev-hero p'), language, false);

    if (input) {
      if (input.dataset.devPlaceholderEn === undefined) input.dataset.devPlaceholderEn = input.getAttribute('placeholder') || '';
      input.setAttribute('placeholder', i18n[language]?.[input.dataset.devPlaceholderEn] || input.dataset.devPlaceholderEn);
    }
    if (output) {
      if (output.dataset.devPlaceholderEn === undefined) output.dataset.devPlaceholderEn = output.getAttribute('placeholder') || '';
      output.setAttribute('placeholder', i18n[language]?.[output.dataset.devPlaceholderEn] || output.dataset.devPlaceholderEn);
    }
    updatePrimaryLabel();
  }

  window.addEventListener('everything-language-change', (event) => {
    translateExactText(event.detail?.language || getLanguage());
  });

  updatePrimaryLabel();
  setOutput('');
  translateExactText(getLanguage());
})();
