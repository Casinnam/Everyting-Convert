(function () {
  const translations = {
    ko: {
      'All Tools': '모든 도구',
      Documents: '문서',
      Media: '미디어',
      Developer: '개발자',
      'AI Tools': 'AI 도구',
      Pricing: '요금제',
      Login: '로그인',
      Logout: '로그아웃',
      Account: '계정',
      Admin: '관리자',
      'Try Pro': 'Try Pro',
      Home: '홈',
      'QR Code Generator': 'QR 코드 생성기',
      'QR Code': 'QR 코드',
      Generator: '생성기',
      'Create custom QR codes for links, Wi-Fi, contacts, files, events, social profiles, and more. Fast, free, and easy to use.': '링크, Wi-Fi, 연락처, 파일, 이벤트, 소셜 프로필 등을 위한 QR 코드를 빠르고 쉽게 만들 수 있습니다.',
      'Free to use': '무료 사용',
      'No signup required': '회원가입 불필요',
      'High Quality': '고품질',
      'Privacy First': '개인정보 우선',
      'Basic QR': '기본 QR',
      'Business QR': '비즈니스 QR',
      'Social QR': '소셜 QR',
      'File QR': '파일 QR',
      'Marketing QR': '마케팅 QR',
      'Personal QR': '개인 QR',
      'URL QR': 'URL QR',
      'Text QR': '텍스트 QR',
      'Enter URL': 'URL 입력',
      'Enter Text': '텍스트 입력',
      'QR Code Name (Optional)': 'QR 코드 이름 (선택)',
      Reset: '초기화',
      'Generate QR Code': 'QR 코드 생성',
      'Your data is safe with us': '입력한 데이터는 안전합니다',
      'Your QR code is generated in your browser. We do not store the text you enter on this page.': 'QR 코드는 브라우저에서 생성되며, 이 페이지에 입력한 내용은 저장하지 않습니다.',
      'QR Code Preview': 'QR 코드 미리보기',
      Test: '테스트',
      'Ready to generate.': '생성 준비 완료.',
      'Customize Design': '디자인 맞춤 설정',
      Color: '색상',
      Logo: '로고',
      Frame: '프레임',
      'Foreground Color': '전경 색상',
      'Background Color': '배경 색상',
      'Upload Custom Logo': '사용자 로고 업로드',
      'Choose Image': '이미지 선택',
      'Logo is auto-sized to 20% to maintain scan reliability.': '스캔 안정성을 위해 로고는 자동으로 20% 크기로 조정됩니다.',
      'Frame Template': '프레임 템플릿',
      None: '없음',
      Size: '크기',
      'Download PNG': 'PNG 다운로드',
      'Unlimited QR Codes': '무제한 QR 코드',
      'Create as many QR codes as you need.': '필요한 만큼 QR 코드를 만들 수 있습니다.',
      Customizable: '맞춤 설정 가능',
      'Choose colors and output size.': '색상과 출력 크기를 선택할 수 있습니다.',
      'Track & Update': '추적 및 업데이트',
      'Dynamic tracking can be added later for Pro.': 'Pro 기능으로 동적 추적을 나중에 추가할 수 있습니다.',
      'Choose a QR purpose, then enter the details above.': 'QR 코드 목적을 선택한 뒤 위에 필요한 정보를 입력하세요.',
      'What would you like to create?': '무엇을 만들고 싶나요?',
      'How It Works': '사용 방법',
      'Choose Type': '유형 선택',
      'Select the type of QR code you want to create.': '만들고 싶은 QR 코드 유형을 선택하세요.',
      'Enter Details': '정보 입력',
      'Add the required information and customize your design.': '필요한 정보를 입력하고 디자인을 조정하세요.',
      'Generate & Download': '생성 및 다운로드',
      'Download your QR code as a PNG file.': 'QR 코드를 PNG 파일로 다운로드하세요.',
      'Built for Everyone': '누구나 쉽게 사용',
      'Whether you are a business owner, marketer, student, creator, or just sharing something with friends, QR codes make it simple.': '비즈니스, 마케팅, 학습, 창작, 개인 공유 등 다양한 목적에 쉽게 사용할 수 있습니다.',
      'Works on Any Device': '모든 기기에서 사용',
      'Scan on iOS, Android, and tablets.': 'iOS, Android, 태블릿에서 스캔할 수 있습니다.',
      'No Expiration': '만료 없음',
      'Static QR codes keep working.': '정적 QR 코드는 계속 작동합니다.',
      'Secure & Private': '안전하고 비공개',
      'We do not store your private QR data.': '개인 QR 데이터는 저장하지 않습니다.',
      More: '더 보기',
      URL: 'URL',
      Text: '텍스트',
      Email: '이메일',
      Phone: '전화',
      SMS: 'SMS',
      'Wi-Fi': 'Wi-Fi',
      vCard: 'vCard',
      Location: '위치',
      Event: '이벤트',
      Menu: '메뉴',
      Review: '리뷰',
      Image: '이미지',
      Video: '비디오',
      Audio: '오디오',
      Document: '문서',
      Coupon: '쿠폰',
      Survey: '설문',
      'App Download': '앱 다운로드',
      'Product Page': '제품 페이지',
      Resume: '이력서',
      Portfolio: '포트폴리오',
      Invitation: '초대장',
      'JSON to CSV': 'JSON to CSV',
      'JSON to CSV Converter': 'JSON to CSV 변환기',
      'Paste JSON or upload a .json file, flatten nested data, preview the table, then copy or download a clean CSV file.': 'JSON을 붙여넣거나 .json 파일을 업로드한 뒤, 중첩 데이터를 펼쳐 표로 미리보고 CSV 파일로 다운로드하세요.',
      'Browser-based': '브라우저 기반',
      'Private conversion': '비공개 변환',
      'Instant CSV': '즉시 CSV 생성',
      Input: '입력',
      Output: '출력',
      'Paste JSON': 'JSON 붙여넣기',
      'Upload JSON': 'JSON 업로드',
      Sample: '샘플',
      Clear: '지우기',
      'Flatten nested objects': '중첩 객체 펼치기',
      'Add Excel UTF-8 BOM': 'Excel UTF-8 BOM 추가',
      Delimiter: '구분자',
      'Convert to CSV': 'CSV로 변환',
      'Paste JSON to start.': '시작하려면 JSON을 붙여넣으세요.',
      'CSV Preview': 'CSV 미리보기',
      'Copy CSV': 'CSV 복사',
      'Download CSV': 'CSV 다운로드',
      'No CSV yet': '아직 CSV 없음',
      'Convert JSON to preview rows here.': 'JSON을 변환하면 이곳에 행이 표시됩니다.',
      'Nested JSON Support': '중첩 JSON 지원',
      'Objects can be flattened into dot notation columns like address.city.': '객체를 address.city 같은 점 표기 열로 펼칠 수 있습니다.',
      'Spreadsheet Ready': '스프레드시트 준비 완료',
      'Download CSV files that open in Excel, Google Sheets, and Numbers.': 'Excel, Google Sheets, Numbers에서 열 수 있는 CSV 파일을 다운로드하세요.',
      'Private by Design': '개인정보 중심 설계',
      'JSON is converted in your browser and is not uploaded to our server.': 'JSON은 브라우저에서 변환되며 서버로 업로드되지 않습니다.',
      'CSV Converter': 'CSV 변환기',
      'Convert CSV to JSON, Excel, or XML — and convert Excel spreadsheets back to CSV. All conversions run in your browser.': 'CSV를 JSON, Excel, XML로 변환하고 Excel 파일을 다시 CSV로 변환하세요. 모든 변환은 브라우저에서 실행됩니다.',
      'Instant output': '즉시 출력',
      'CSV to JSON': 'CSV to JSON',
      'CSV to Excel': 'CSV to Excel',
      'Excel to CSV': 'Excel to CSV',
      'CSV to XML': 'CSV to XML',
      'Paste CSV': 'CSV 붙여넣기',
      'Upload File': '파일 업로드',
      'First row is header': '첫 행을 헤더로 사용',
      'Upload a file or paste data to start.': '시작하려면 파일을 업로드하거나 데이터를 붙여넣으세요.',
      'JSON Output': 'JSON 출력',
      Copy: '복사',
      Download: '다운로드',
      'No output yet': '아직 출력 없음',
      'Convert your data to preview rows here.': '데이터를 변환하면 이곳에 미리보기가 표시됩니다.',
      'Multi-Format Support': '다중 형식 지원',
      'Convert between CSV, JSON, Excel (XLSX), and XML in one tool.': '하나의 도구에서 CSV, JSON, Excel(XLSX), XML을 변환하세요.'
    },
    de: {
      Documents: 'Dokumente',
      Media: 'Medien',
      Developer: 'Entwickler',
      'AI Tools': 'KI-Tools',
      Pricing: 'Preise',
      Login: 'Anmelden',
      Logout: 'Abmelden',
      Home: 'Startseite',
      'QR Code Generator': 'QR-Code-Generator',
      'Create custom QR codes for links, Wi-Fi, contacts, files, events, social profiles, and more. Fast, free, and easy to use.': 'Erstellen Sie QR-Codes fuer Links, WLAN, Kontakte, Dateien, Events und mehr.',
      'Free to use': 'Kostenlos nutzbar',
      'No signup required': 'Keine Anmeldung erforderlich',
      'Privacy First': 'Datenschutz zuerst',
      'Generate QR Code': 'QR-Code erstellen',
      'Download PNG': 'PNG herunterladen',
      'How It Works': 'So funktioniert es',
      'JSON to CSV Converter': 'JSON-zu-CSV-Konverter',
      'CSV Converter': 'CSV-Konverter',
      Input: 'Eingabe',
      Output: 'Ausgabe',
      'Upload File': 'Datei hochladen',
      Sample: 'Beispiel',
      Clear: 'Loeschen',
      Copy: 'Kopieren',
      Download: 'Herunterladen'
    },
    es: {
      Documents: 'Documentos',
      Media: 'Medios',
      Developer: 'Desarrollador',
      'AI Tools': 'Herramientas IA',
      Pricing: 'Precios',
      Login: 'Iniciar sesion',
      Logout: 'Cerrar sesion',
      Home: 'Inicio',
      'QR Code Generator': 'Generador de codigos QR',
      'Create custom QR codes for links, Wi-Fi, contacts, files, events, social profiles, and more. Fast, free, and easy to use.': 'Crea codigos QR para enlaces, Wi-Fi, contactos, archivos, eventos y mas.',
      'Free to use': 'Gratis',
      'No signup required': 'Sin registro',
      'Privacy First': 'Privacidad primero',
      'Generate QR Code': 'Generar codigo QR',
      'Download PNG': 'Descargar PNG',
      'How It Works': 'Como funciona',
      'JSON to CSV Converter': 'Convertidor JSON a CSV',
      'CSV Converter': 'Convertidor CSV',
      Input: 'Entrada',
      Output: 'Salida',
      'Upload File': 'Subir archivo',
      Sample: 'Ejemplo',
      Clear: 'Borrar',
      Copy: 'Copiar',
      Download: 'Descargar'
    },
    fr: {
      Documents: 'Documents',
      Media: 'Media',
      Developer: 'Developpeur',
      'AI Tools': 'Outils IA',
      Pricing: 'Tarifs',
      Login: 'Connexion',
      Logout: 'Deconnexion',
      Home: 'Accueil',
      'QR Code Generator': 'Generateur de QR code',
      'Create custom QR codes for links, Wi-Fi, contacts, files, events, social profiles, and more. Fast, free, and easy to use.': 'Creez des QR codes pour liens, Wi-Fi, contacts, fichiers, evenements et plus.',
      'Free to use': 'Gratuit',
      'No signup required': 'Sans inscription',
      'Privacy First': 'Confidentialite',
      'Generate QR Code': 'Generer le QR code',
      'Download PNG': 'Telecharger PNG',
      'How It Works': 'Comment ca marche',
      'JSON to CSV Converter': 'Convertisseur JSON vers CSV',
      'CSV Converter': 'Convertisseur CSV',
      Input: 'Entree',
      Output: 'Sortie',
      'Upload File': 'Importer un fichier',
      Sample: 'Exemple',
      Clear: 'Effacer',
      Copy: 'Copier',
      Download: 'Telecharger'
    }
  };

  const placeholders = {
    ko: {
      'https://example.com': 'https://example.com',
      'My QR Code': '내 QR 코드',
      'Write the text you want to share...': '공유하고 싶은 텍스트를 입력하세요...',
      'Paste your menu URL': '메뉴 URL을 붙여넣으세요',
      'Paste your review page URL': '리뷰 페이지 URL을 붙여넣으세요'
    }
  };

  const canonicalPhrase = {};
  Object.values(translations).forEach((languageMap) => {
    Object.entries(languageMap).forEach(([english, translated]) => {
      canonicalPhrase[english] = english;
      canonicalPhrase[translated] = english;
    });
  });

  function getLanguage() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('lang');
    if (translations[fromUrl]) return fromUrl;
    try {
      const saved = localStorage.getItem('everything_convert_language');
      if (translations[saved]) return saved;
    } catch (error) {
      return 'en';
    }
    return 'en';
  }

  function translatePhrase(value, language) {
    const english = canonicalPhrase[value] || value;
    if (language === 'en') return english;
    return (translations[language] && translations[language][english]) || english;
  }

  function replaceTextNode(node, language) {
    const text = node.nodeValue;
    const trimmed = text.trim();
    if (!trimmed) return;
    const translated = translatePhrase(trimmed, language);
    if (translated === trimmed) return;
    node.nodeValue = text.replace(trimmed, translated);
  }

  function walkText(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,textarea,select,[data-no-i18n]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => replaceTextNode(node, language));
  }

  function translateAttributes(language) {
    const attrMap = placeholders[language] || {};
    document.querySelectorAll('[placeholder]').forEach((element) => {
      const current = element.getAttribute('placeholder');
      if (attrMap[current]) element.setAttribute('placeholder', attrMap[current]);
    });
  }

  function translatePageTitles(language) {
    if (language === 'en') return;
    const titleMap = translations[language] || {};
    const qrTitle = document.getElementById('qrTitle');
    if (qrTitle && titleMap['QR Code Generator']) {
      qrTitle.textContent = titleMap['QR Code Generator'];
    }
    const jsonTitle = document.getElementById('jsonCsvTitle');
    if (jsonTitle && titleMap['JSON to CSV Converter']) {
      jsonTitle.textContent = titleMap['JSON to CSV Converter'];
    }
    const csvTitle = document.getElementById('csvConverterTitle');
    if (csvTitle && titleMap['CSV Converter']) {
      csvTitle.textContent = titleMap['CSV Converter'];
    }
  }

  function applyDeveloperLanguage() {
    const language = getLanguage();
    if (language === 'en') return;
    translatePageTitles(language);
    walkText(document.body, language);
    translateAttributes(language);
  }

  let timer = null;
  function scheduleApply() {
    window.clearTimeout(timer);
    timer = window.setTimeout(applyDeveloperLanguage, 30);
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-language]')) scheduleApply();
    if (event.target.closest('[data-type], [data-csv-mode], #resetQrButton, #generateQrButton, #resetDesignButton')) {
      scheduleApply();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    applyDeveloperLanguage();
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
