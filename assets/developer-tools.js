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
    const language = getLanguage();
    const translated = (message && i18n[language] && i18n[language][message]) || message;
    status.textContent = translated || '';
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
      'Encoding and decoding happen in your browser.': '인코딩과 디코딩은 브라우저 안에서 실행됩니다.',
      'Paste JSON first.': 'JSON을 먼저 붙여넣으세요.',
      'JSON formatted.': 'JSON이 정리되었습니다.',
      'JSON minified.': 'JSON이 압축되었습니다.',
      'Enter text or Base64 first.': '텍스트 또는 Base64를 먼저 입력하세요.',
      'Base64 decoded.': 'Base64가 디코딩되었습니다.',
      'Text encoded to Base64.': '텍스트가 Base64로 인코딩되었습니다.',
      'Enter text or a URL first.': '텍스트 또는 URL을 먼저 입력하세요.',
      'URL decoded.': 'URL이 디코딩되었습니다.',
      'URL encoded.': 'URL이 인코딩되었습니다.',
      'Sample loaded.': '샘플을 불러왔습니다.',
      'Output copied to clipboard.': '출력이 클립보드에 복사되었습니다.',
      'Unable to process the input.': '입력을 처리할 수 없습니다.'
    },
    de: {
      'Home': 'Startseite',
      'Developer': 'Entwickler',
      'Browser-based': 'Browserbasiert',
      'No signup required': 'Keine Anmeldung erforderlich',
      'Private input': 'Private Eingabe',
      'Input': 'Eingabe',
      'Output': 'Ausgabe',
      'Upload': 'Hochladen',
      'Sample': 'Beispiel',
      'Clear': 'Leeren',
      'Copy': 'Kopieren',
      'Download': 'Herunterladen',
      'Format': 'Formatieren',
      'Minify': 'Minimieren',
      'Validate': 'Validieren',
      'Encode': 'Kodieren',
      'Decode': 'Dekodieren',
      'JSON Formatter': 'JSON-Formatierer',
      'JSON Formatter & Validator': '<span>JSON</span> Formatierer & Validator',
      'Paste JSON': 'JSON einfügen',
      'Formatted JSON': 'Formatiertes JSON',
      'Format JSON': 'JSON formatieren',
      'Minify JSON': 'JSON minimieren',
      'Validate JSON': 'JSON validieren',
      'Paste JSON to format it for reading, minify it for production, or validate syntax before using it in an API, app, or spreadsheet workflow.': 'Fügen Sie JSON ein, um es lesbar zu formatieren, für die Produktion zu minimieren oder die Syntax zu prüfen, bevor Sie es in einer API oder App verwenden.',
      'Paste JSON here, for example: {"name":"EverythingConvert","active":true}': 'JSON hier einfügen, zum Beispiel: {"name":"EverythingConvert","active":true}',
      'Formatted or validated JSON will appear here.': 'Formatiertes oder validiertes JSON erscheint hier.',
      'Readable JSON': 'Lesbares JSON',
      'Indent messy JSON so APIs, logs, and settings files are easier to inspect.': 'Rücken Sie unübersichtliches JSON ein, um APIs, Logs und Konfigurationsdateien leichter zu prüfen.',
      'Minify for production': 'Für Produktion minimieren',
      'Remove extra whitespace when you need compact JSON for transport or storage.': 'Entfernen Sie überflüssige Leerzeichen, wenn Sie kompaktes JSON für Transport oder Speicherung benötigen.',
      'Private by design': 'Datenschutz von Anfang an',
      'Your JSON is processed locally in your browser and is not uploaded.': 'Ihr JSON wird lokal im Browser verarbeitet und nicht hochgeladen.',
      'How to use this JSON formatter': 'So verwenden Sie den JSON-Formatierer',
      'Paste JSON or upload a .json file.': 'JSON einfügen oder eine .json-Datei hochladen.',
      'Choose Format, Minify, or Validate.': 'Formatieren, Minimieren oder Validieren wählen.',
      'Copy or download the result when the JSON is ready.': 'Kopieren oder laden Sie das Ergebnis herunter, sobald das JSON fertig ist.',
      'Does it fix invalid JSON automatically?': 'Korrigiert es ungültiges JSON automatisch?',
      'No. It shows a syntax error so you can correct the original data safely.': 'Nein. Es zeigt einen Syntaxfehler, damit Sie die Originaldaten sicher korrigieren können.',
      'Is my JSON uploaded?': 'Wird mein JSON hochgeladen?',
      'No. The formatting and validation happen in your browser.': 'Nein. Formatierung und Validierung laufen in Ihrem Browser.',
      'Can I format API responses?': 'Kann ich API-Antworten formatieren?',
      'Yes. Paste a JSON response from an API to make it easier to read.': 'Ja. Fügen Sie eine JSON-Antwort einer API ein, um sie lesbarer zu machen.',
      'Base64 Encode Decode': 'Base64 kodieren / dekodieren',
      'Base64 Encode / Decode': '<span>Base64</span> kodieren / dekodieren',
      'Text or Base64': 'Text oder Base64',
      'Result': 'Ergebnis',
      'Encode Base64': 'Base64 kodieren',
      'Decode Base64': 'Base64 dekodieren',
      'Convert readable text into Base64 for data URLs, tokens, and developer workflows, or decode Base64 back into plain text.': 'Wandeln Sie lesbaren Text in Base64 für Daten-URLs, Tokens und Entwickler-Workflows um, oder dekodieren Sie Base64 zurück in Klartext.',
      'Type or paste text here.': 'Text hier eingeben oder einfügen.',
      'Encoded or decoded text will appear here.': 'Kodierter oder dekodierter Text erscheint hier.',
      'Two-way conversion': 'Umwandlung in beide Richtungen',
      'Encode plain text to Base64 or decode Base64 back to readable UTF-8 text.': 'Kodieren Sie Klartext zu Base64 oder dekodieren Sie Base64 zurück zu lesbarem UTF-8-Text.',
      'Developer friendly': 'Entwicklerfreundlich',
      'Useful for data URLs, API examples, configuration strings, and quick debugging.': 'Nützlich für Daten-URLs, API-Beispiele, Konfigurationsstrings und schnelles Debugging.',
      'Local processing': 'Lokale Verarbeitung',
      'The conversion runs in your browser and does not need an API key.': 'Die Umwandlung läuft im Browser und benötigt keinen API-Schlüssel.',
      'How to use Base64 encode decode': 'So verwenden Sie Base64 kodieren/dekodieren',
      'Paste text or a Base64 string.': 'Text oder einen Base64-String einfügen.',
      'Choose Encode or Decode.': 'Kodieren oder Dekodieren wählen.',
      'Copy or download the result.': 'Ergebnis kopieren oder herunterladen.',
      'Is Base64 encryption?': 'Ist Base64 eine Verschlüsselung?',
      'No. Base64 is encoding, not security. Anyone can decode it.': 'Nein. Base64 ist eine Kodierung, keine Sicherheit. Jeder kann sie dekodieren.',
      'Does it support Korean or accented text?': 'Unterstützt es Koreanisch oder Akzentzeichen?',
      'Yes. The tool uses UTF-8 encoding for readable Unicode text.': 'Ja. Das Tool verwendet UTF-8 für lesbaren Unicode-Text.',
      'Is my text uploaded?': 'Wird mein Text hochgeladen?',
      'No. Everything runs locally in your browser.': 'Nein. Alles läuft lokal in Ihrem Browser.',
      'URL Encoder Decoder': 'URL kodieren / dekodieren',
      'URL Encoder / Decoder': '<span>URL</span> kodieren / dekodieren',
      'URL or text': 'URL oder Text',
      'Encode URL': 'URL kodieren',
      'Decode URL': 'URL dekodieren',
      'Encode query strings and special characters for safe URLs, or decode percent-encoded links back into readable text.': 'Kodieren Sie Query-Strings und Sonderzeichen für sichere URLs, oder dekodieren Sie prozentkodierte Links zurück in lesbaren Text.',
      'Paste a URL, query string, or text with spaces and symbols.': 'URL, Query-String oder Text mit Leerzeichen und Symbolen einfügen.',
      'Encoded or decoded URL text will appear here.': 'Kodierter oder dekodierter URL-Text erscheint hier.',
      'Safe URL text': 'Sicherer URL-Text',
      'Encode spaces, symbols, and non-English text for query strings and links.': 'Kodieren Sie Leerzeichen, Symbole und nicht-englischen Text für Query-Strings und Links.',
      'Decode for debugging': 'Dekodieren zum Debuggen',
      'Turn percent-encoded URLs back into readable text when checking tracking links.': 'Wandeln Sie prozentkodierte URLs zurück in lesbaren Text, etwa beim Prüfen von Tracking-Links.',
      'No server needed': 'Kein Server nötig',
      'The tool runs locally in your browser and does not require an API key.': 'Das Tool läuft lokal im Browser und benötigt keinen API-Schlüssel.',
      'How to use URL encoder decoder': 'So verwenden Sie den URL-Kodierer/-Dekodierer',
      'Paste text, a URL, or a query string.': 'Text, eine URL oder einen Query-String einfügen.',
      'Copy the clean result for your app, link, or campaign URL.': 'Kopieren Sie das saubere Ergebnis für Ihre App, Ihren Link oder Ihre Kampagnen-URL.',
      'When should I encode a URL?': 'Wann sollte ich eine URL kodieren?',
      'Encode text before placing spaces, symbols, or non-English characters into a URL parameter.': 'Kodieren Sie Text, bevor Sie Leerzeichen, Symbole oder nicht-englische Zeichen in einen URL-Parameter einsetzen.',
      'Can it decode UTM links?': 'Kann es UTM-Links dekodieren?',
      'Yes. Paste an encoded URL or query value to make it easier to read.': 'Ja. Fügen Sie eine kodierte URL oder einen Query-Wert ein, um sie lesbarer zu machen.',
      'Is anything uploaded?': 'Wird etwas hochgeladen?',
      'Encoding and decoding happen in your browser.': 'Kodierung und Dekodierung erfolgen in Ihrem Browser.',
      'Paste JSON first.': 'Bitte zuerst JSON einfügen.',
      'JSON formatted.': 'JSON formatiert.',
      'JSON minified.': 'JSON minimiert.',
      'Enter text or Base64 first.': 'Bitte zuerst Text oder Base64 eingeben.',
      'Base64 decoded.': 'Base64 dekodiert.',
      'Text encoded to Base64.': 'Text in Base64 kodiert.',
      'Enter text or a URL first.': 'Bitte zuerst Text oder eine URL eingeben.',
      'URL decoded.': 'URL dekodiert.',
      'URL encoded.': 'URL kodiert.',
      'Sample loaded.': 'Beispiel geladen.',
      'Output copied to clipboard.': 'Ausgabe in die Zwischenablage kopiert.',
      'Unable to process the input.': 'Eingabe konnte nicht verarbeitet werden.'
    },
    es: {
      'Home': 'Inicio',
      'Developer': 'Desarrollador',
      'Browser-based': 'En el navegador',
      'No signup required': 'Sin registro',
      'Private input': 'Entrada privada',
      'Input': 'Entrada',
      'Output': 'Salida',
      'Upload': 'Subir',
      'Sample': 'Ejemplo',
      'Clear': 'Borrar',
      'Copy': 'Copiar',
      'Download': 'Descargar',
      'Format': 'Formatear',
      'Minify': 'Minificar',
      'Validate': 'Validar',
      'Encode': 'Codificar',
      'Decode': 'Decodificar',
      'JSON Formatter': 'Formateador JSON',
      'JSON Formatter & Validator': 'Formateador y validador <span>JSON</span>',
      'Paste JSON': 'Pegar JSON',
      'Formatted JSON': 'JSON formateado',
      'Format JSON': 'Formatear JSON',
      'Minify JSON': 'Minificar JSON',
      'Validate JSON': 'Validar JSON',
      'Paste JSON to format it for reading, minify it for production, or validate syntax before using it in an API, app, or spreadsheet workflow.': 'Pega JSON para formatearlo, minificarlo para producción o validar la sintaxis antes de usarlo en una API, app u hoja de cálculo.',
      'Paste JSON here, for example: {"name":"EverythingConvert","active":true}': 'Pega JSON aquí, por ejemplo: {"name":"EverythingConvert","active":true}',
      'Formatted or validated JSON will appear here.': 'El JSON formateado o validado aparecerá aquí.',
      'Readable JSON': 'JSON legible',
      'Indent messy JSON so APIs, logs, and settings files are easier to inspect.': 'Indenta JSON desordenado para inspeccionar APIs, logs y archivos de configuración fácilmente.',
      'Minify for production': 'Minificar para producción',
      'Remove extra whitespace when you need compact JSON for transport or storage.': 'Elimina espacios innecesarios cuando necesites JSON compacto para transporte o almacenamiento.',
      'Private by design': 'Privado por diseño',
      'Your JSON is processed locally in your browser and is not uploaded.': 'Tu JSON se procesa localmente en tu navegador y no se sube.',
      'How to use this JSON formatter': 'Cómo usar este formateador JSON',
      'Paste JSON or upload a .json file.': 'Pega JSON o sube un archivo .json.',
      'Choose Format, Minify, or Validate.': 'Elige Formatear, Minificar o Validar.',
      'Copy or download the result when the JSON is ready.': 'Copia o descarga el resultado cuando el JSON esté listo.',
      'Does it fix invalid JSON automatically?': '¿Corrige JSON inválido automáticamente?',
      'No. It shows a syntax error so you can correct the original data safely.': 'No. Muestra un error de sintaxis para que corrijas los datos originales con seguridad.',
      'Is my JSON uploaded?': '¿Se sube mi JSON?',
      'No. The formatting and validation happen in your browser.': 'No. El formateo y la validación ocurren en tu navegador.',
      'Can I format API responses?': '¿Puedo formatear respuestas de API?',
      'Yes. Paste a JSON response from an API to make it easier to read.': 'Sí. Pega una respuesta JSON de una API para leerla más fácilmente.',
      'Base64 Encode Decode': 'Codificar / decodificar Base64',
      'Base64 Encode / Decode': '<span>Base64</span> codificar / decodificar',
      'Text or Base64': 'Texto o Base64',
      'Result': 'Resultado',
      'Encode Base64': 'Codificar Base64',
      'Decode Base64': 'Decodificar Base64',
      'Convert readable text into Base64 for data URLs, tokens, and developer workflows, or decode Base64 back into plain text.': 'Convierte texto legible en Base64 para data URLs, tokens y flujos de desarrollo, o decodifica Base64 a texto plano.',
      'Type or paste text here.': 'Escribe o pega texto aquí.',
      'Encoded or decoded text will appear here.': 'El texto codificado o decodificado aparecerá aquí.',
      'Two-way conversion': 'Conversión bidireccional',
      'Encode plain text to Base64 or decode Base64 back to readable UTF-8 text.': 'Codifica texto plano a Base64 o decodifica Base64 a texto UTF-8 legible.',
      'Developer friendly': 'Pensado para desarrolladores',
      'Useful for data URLs, API examples, configuration strings, and quick debugging.': 'Útil para data URLs, ejemplos de API, cadenas de configuración y depuración rápida.',
      'Local processing': 'Procesamiento local',
      'The conversion runs in your browser and does not need an API key.': 'La conversión se ejecuta en tu navegador y no necesita clave de API.',
      'How to use Base64 encode decode': 'Cómo usar codificar/decodificar Base64',
      'Paste text or a Base64 string.': 'Pega texto o una cadena Base64.',
      'Choose Encode or Decode.': 'Elige Codificar o Decodificar.',
      'Copy or download the result.': 'Copia o descarga el resultado.',
      'Is Base64 encryption?': '¿Base64 es cifrado?',
      'No. Base64 is encoding, not security. Anyone can decode it.': 'No. Base64 es codificación, no seguridad. Cualquiera puede decodificarlo.',
      'Does it support Korean or accented text?': '¿Admite coreano o texto con acentos?',
      'Yes. The tool uses UTF-8 encoding for readable Unicode text.': 'Sí. La herramienta usa UTF-8 para texto Unicode legible.',
      'Is my text uploaded?': '¿Se sube mi texto?',
      'No. Everything runs locally in your browser.': 'No. Todo se ejecuta localmente en tu navegador.',
      'URL Encoder Decoder': 'Codificador / decodificador de URL',
      'URL Encoder / Decoder': '<span>URL</span> codificar / decodificar',
      'URL or text': 'URL o texto',
      'Encode URL': 'Codificar URL',
      'Decode URL': 'Decodificar URL',
      'Encode query strings and special characters for safe URLs, or decode percent-encoded links back into readable text.': 'Codifica cadenas de consulta y caracteres especiales para URLs seguras, o decodifica enlaces codificados a texto legible.',
      'Paste a URL, query string, or text with spaces and symbols.': 'Pega una URL, cadena de consulta o texto con espacios y símbolos.',
      'Encoded or decoded URL text will appear here.': 'El texto de URL codificado o decodificado aparecerá aquí.',
      'Safe URL text': 'Texto de URL seguro',
      'Encode spaces, symbols, and non-English text for query strings and links.': 'Codifica espacios, símbolos y texto no inglés para cadenas de consulta y enlaces.',
      'Decode for debugging': 'Decodificar para depurar',
      'Turn percent-encoded URLs back into readable text when checking tracking links.': 'Convierte URLs codificadas en texto legible al revisar enlaces de seguimiento.',
      'No server needed': 'Sin servidor',
      'The tool runs locally in your browser and does not require an API key.': 'La herramienta se ejecuta localmente en tu navegador y no requiere clave de API.',
      'How to use URL encoder decoder': 'Cómo usar el codificador/decodificador de URL',
      'Paste text, a URL, or a query string.': 'Pega texto, una URL o una cadena de consulta.',
      'Copy the clean result for your app, link, or campaign URL.': 'Copia el resultado limpio para tu app, enlace o URL de campaña.',
      'When should I encode a URL?': '¿Cuándo debo codificar una URL?',
      'Encode text before placing spaces, symbols, or non-English characters into a URL parameter.': 'Codifica el texto antes de poner espacios, símbolos o caracteres no ingleses en un parámetro de URL.',
      'Can it decode UTM links?': '¿Puede decodificar enlaces UTM?',
      'Yes. Paste an encoded URL or query value to make it easier to read.': 'Sí. Pega una URL o valor codificado para leerlo más fácilmente.',
      'Is anything uploaded?': '¿Se sube algo?',
      'Encoding and decoding happen in your browser.': 'La codificación y decodificación ocurren en tu navegador.',
      'Paste JSON first.': 'Primero pega JSON.',
      'JSON formatted.': 'JSON formateado.',
      'JSON minified.': 'JSON minificado.',
      'Enter text or Base64 first.': 'Primero introduce texto o Base64.',
      'Base64 decoded.': 'Base64 decodificado.',
      'Text encoded to Base64.': 'Texto codificado en Base64.',
      'Enter text or a URL first.': 'Primero introduce texto o una URL.',
      'URL decoded.': 'URL decodificada.',
      'URL encoded.': 'URL codificada.',
      'Sample loaded.': 'Ejemplo cargado.',
      'Output copied to clipboard.': 'Salida copiada al portapapeles.',
      'Unable to process the input.': 'No se pudo procesar la entrada.'
    },
    fr: {
      'Home': 'Accueil',
      'Developer': 'Développeur',
      'Browser-based': 'Dans le navigateur',
      'No signup required': 'Sans inscription',
      'Private input': 'Saisie privée',
      'Input': 'Entrée',
      'Output': 'Sortie',
      'Upload': 'Importer',
      'Sample': 'Exemple',
      'Clear': 'Effacer',
      'Copy': 'Copier',
      'Download': 'Télécharger',
      'Format': 'Formater',
      'Minify': 'Minifier',
      'Validate': 'Valider',
      'Encode': 'Encoder',
      'Decode': 'Décoder',
      'JSON Formatter': 'Formateur JSON',
      'JSON Formatter & Validator': 'Formateur et validateur <span>JSON</span>',
      'Paste JSON': 'Coller du JSON',
      'Formatted JSON': 'JSON formaté',
      'Format JSON': 'Formater le JSON',
      'Minify JSON': 'Minifier le JSON',
      'Validate JSON': 'Valider le JSON',
      'Paste JSON to format it for reading, minify it for production, or validate syntax before using it in an API, app, or spreadsheet workflow.': 'Collez du JSON pour le formater, le minifier pour la production ou valider la syntaxe avant de l\'utiliser dans une API ou une application.',
      'Paste JSON here, for example: {"name":"EverythingConvert","active":true}': 'Collez du JSON ici, par exemple : {"name":"EverythingConvert","active":true}',
      'Formatted or validated JSON will appear here.': 'Le JSON formaté ou validé apparaîtra ici.',
      'Readable JSON': 'JSON lisible',
      'Indent messy JSON so APIs, logs, and settings files are easier to inspect.': 'Indentez le JSON désordonné pour inspecter plus facilement les API, journaux et fichiers de configuration.',
      'Minify for production': 'Minifier pour la production',
      'Remove extra whitespace when you need compact JSON for transport or storage.': 'Supprimez les espaces superflus quand vous avez besoin d\'un JSON compact.',
      'Private by design': 'Privé par conception',
      'Your JSON is processed locally in your browser and is not uploaded.': 'Votre JSON est traité localement dans votre navigateur et n\'est pas téléversé.',
      'How to use this JSON formatter': 'Comment utiliser ce formateur JSON',
      'Paste JSON or upload a .json file.': 'Collez du JSON ou importez un fichier .json.',
      'Choose Format, Minify, or Validate.': 'Choisissez Formater, Minifier ou Valider.',
      'Copy or download the result when the JSON is ready.': 'Copiez ou téléchargez le résultat quand le JSON est prêt.',
      'Does it fix invalid JSON automatically?': 'Corrige-t-il automatiquement le JSON invalide ?',
      'No. It shows a syntax error so you can correct the original data safely.': 'Non. Il affiche une erreur de syntaxe pour que vous corrigiez les données d\'origine en toute sécurité.',
      'Is my JSON uploaded?': 'Mon JSON est-il téléversé ?',
      'No. The formatting and validation happen in your browser.': 'Non. Le formatage et la validation se font dans votre navigateur.',
      'Can I format API responses?': 'Puis-je formater des réponses d\'API ?',
      'Yes. Paste a JSON response from an API to make it easier to read.': 'Oui. Collez une réponse JSON d\'une API pour la rendre plus lisible.',
      'Base64 Encode Decode': 'Encoder / décoder Base64',
      'Base64 Encode / Decode': '<span>Base64</span> encoder / décoder',
      'Text or Base64': 'Texte ou Base64',
      'Result': 'Résultat',
      'Encode Base64': 'Encoder en Base64',
      'Decode Base64': 'Décoder le Base64',
      'Convert readable text into Base64 for data URLs, tokens, and developer workflows, or decode Base64 back into plain text.': 'Convertissez du texte lisible en Base64 pour les data URLs, jetons et workflows de développement, ou décodez le Base64 en texte clair.',
      'Type or paste text here.': 'Saisissez ou collez du texte ici.',
      'Encoded or decoded text will appear here.': 'Le texte encodé ou décodé apparaîtra ici.',
      'Two-way conversion': 'Conversion bidirectionnelle',
      'Encode plain text to Base64 or decode Base64 back to readable UTF-8 text.': 'Encodez du texte clair en Base64 ou décodez le Base64 en texte UTF-8 lisible.',
      'Developer friendly': 'Pensé pour les développeurs',
      'Useful for data URLs, API examples, configuration strings, and quick debugging.': 'Utile pour les data URLs, exemples d\'API, chaînes de configuration et débogage rapide.',
      'Local processing': 'Traitement local',
      'The conversion runs in your browser and does not need an API key.': 'La conversion s\'exécute dans votre navigateur et ne nécessite pas de clé API.',
      'How to use Base64 encode decode': 'Comment utiliser l\'encodeur/décodeur Base64',
      'Paste text or a Base64 string.': 'Collez du texte ou une chaîne Base64.',
      'Choose Encode or Decode.': 'Choisissez Encoder ou Décoder.',
      'Copy or download the result.': 'Copiez ou téléchargez le résultat.',
      'Is Base64 encryption?': 'Le Base64 est-il un chiffrement ?',
      'No. Base64 is encoding, not security. Anyone can decode it.': 'Non. Le Base64 est un encodage, pas une sécurité. N\'importe qui peut le décoder.',
      'Does it support Korean or accented text?': 'Prend-il en charge le coréen ou les caractères accentués ?',
      'Yes. The tool uses UTF-8 encoding for readable Unicode text.': 'Oui. L\'outil utilise l\'encodage UTF-8 pour le texte Unicode lisible.',
      'Is my text uploaded?': 'Mon texte est-il téléversé ?',
      'No. Everything runs locally in your browser.': 'Non. Tout s\'exécute localement dans votre navigateur.',
      'URL Encoder Decoder': 'Encodeur / décodeur d\'URL',
      'URL Encoder / Decoder': '<span>URL</span> encoder / décoder',
      'URL or text': 'URL ou texte',
      'Encode URL': 'Encoder l\'URL',
      'Decode URL': 'Décoder l\'URL',
      'Encode query strings and special characters for safe URLs, or decode percent-encoded links back into readable text.': 'Encodez les chaînes de requête et caractères spéciaux pour des URL sûres, ou décodez les liens encodés en texte lisible.',
      'Paste a URL, query string, or text with spaces and symbols.': 'Collez une URL, une chaîne de requête ou du texte avec espaces et symboles.',
      'Encoded or decoded URL text will appear here.': 'Le texte d\'URL encodé ou décodé apparaîtra ici.',
      'Safe URL text': 'Texte d\'URL sûr',
      'Encode spaces, symbols, and non-English text for query strings and links.': 'Encodez les espaces, symboles et textes non anglais pour les chaînes de requête et les liens.',
      'Decode for debugging': 'Décoder pour déboguer',
      'Turn percent-encoded URLs back into readable text when checking tracking links.': 'Transformez les URL encodées en texte lisible lors de la vérification des liens de suivi.',
      'No server needed': 'Aucun serveur requis',
      'The tool runs locally in your browser and does not require an API key.': 'L\'outil s\'exécute localement dans votre navigateur et ne nécessite pas de clé API.',
      'How to use URL encoder decoder': 'Comment utiliser l\'encodeur/décodeur d\'URL',
      'Paste text, a URL, or a query string.': 'Collez du texte, une URL ou une chaîne de requête.',
      'Copy the clean result for your app, link, or campaign URL.': 'Copiez le résultat propre pour votre application, lien ou URL de campagne.',
      'When should I encode a URL?': 'Quand dois-je encoder une URL ?',
      'Encode text before placing spaces, symbols, or non-English characters into a URL parameter.': 'Encodez le texte avant de placer des espaces, symboles ou caractères non anglais dans un paramètre d\'URL.',
      'Can it decode UTM links?': 'Peut-il décoder les liens UTM ?',
      'Yes. Paste an encoded URL or query value to make it easier to read.': 'Oui. Collez une URL ou une valeur encodée pour la rendre plus lisible.',
      'Is anything uploaded?': 'Quelque chose est-il téléversé ?',
      'Encoding and decoding happen in your browser.': 'L\'encodage et le décodage se font dans votre navigateur.',
      'Paste JSON first.': 'Collez d\'abord du JSON.',
      'JSON formatted.': 'JSON formaté.',
      'JSON minified.': 'JSON minifié.',
      'Enter text or Base64 first.': 'Saisissez d\'abord du texte ou du Base64.',
      'Base64 decoded.': 'Base64 décodé.',
      'Text encoded to Base64.': 'Texte encodé en Base64.',
      'Enter text or a URL first.': 'Saisissez d\'abord du texte ou une URL.',
      'URL decoded.': 'URL décodée.',
      'URL encoded.': 'URL encodée.',
      'Sample loaded.': 'Exemple chargé.',
      'Output copied to clipboard.': 'Sortie copiée dans le presse-papiers.',
      'Unable to process the input.': 'Impossible de traiter l\'entrée.'
    }
  };

  function getLanguage() {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl) return fromUrl;
      const saved = localStorage.getItem('everything_convert_language');
      if (saved) return saved;
      // No saved choice: follow the shared language system (which already
      // applies the browser-language fallback), then navigator directly.
      if (window.EverythingConvertLanguage && typeof window.EverythingConvertLanguage.get === 'function') {
        return window.EverythingConvertLanguage.get();
      }
      const candidates = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
      for (const candidate of candidates) {
        const code = String(candidate || '').slice(0, 2).toLowerCase();
        if (code === 'en' || i18n[code]) return code;
      }
    } catch (error) {
      return document.documentElement.lang || 'en';
    }
    return document.documentElement.lang || 'en';
  }

  function rememberEnglish(node, html) {
    if (!node) return;
    if (node.dataset.devI18nEn === undefined) node.dataset.devI18nEn = html ? node.innerHTML : node.textContent.trim();
  }

  function translateNode(node, language, html) {
    if (!node) return;
    if (html) {
      // Key on textContent (entities like &amp; decoded) so dictionary keys
      // stay plain text; keep the original innerHTML for the English render.
      if (node.dataset.devI18nEn === undefined) {
        node.dataset.devI18nEn = node.textContent.trim();
        node.dataset.devI18nEnHtml = node.innerHTML;
      }
      const translatedHtml = i18n[language]?.[node.dataset.devI18nEn];
      node.innerHTML = translatedHtml || node.dataset.devI18nEnHtml;
      return;
    }
    rememberEnglish(node, html);
    const english = node.dataset.devI18nEn;
    const translated = i18n[language]?.[english];
    if (node.children.length) {
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
  // Re-apply after the shared language system settles (it schedules its own
  // [0, 100, 500] ms passes), so the page is translated on first paint even
  // when the language comes from browser detection rather than localStorage.
  [0, 150, 600].forEach((delay) => window.setTimeout(() => translateExactText(getLanguage()), delay));
})();
