(function () {
  const TYPES = {
    url: {
      label: 'URL',
      category: 'Basic QR',
      icon: 'fa-link',
      intro: 'Link to any website',
      fields: [
        { name: 'url', label: 'Enter URL', type: 'url', placeholder: 'https://example.com', full: true },
        { name: 'name', label: 'QR Code Name (Optional)', type: 'text', placeholder: 'My QR Code', full: true, maxlength: 50 }
      ],
      build: (v) => v.url
    },
    text: {
      label: 'Text',
      category: 'Basic QR',
      icon: 'fa-align-left',
      intro: 'Plain text or notes',
      fields: [
        { name: 'text', label: 'Enter Text', type: 'textarea', placeholder: 'Write the text you want to share...', full: true },
        { name: 'name', label: 'QR Code Name (Optional)', type: 'text', placeholder: 'Text QR', full: true, maxlength: 50 }
      ],
      build: (v) => v.text
    },
    email: {
      label: 'Email',
      category: 'Basic QR',
      icon: 'fa-envelope',
      intro: 'Email address',
      fields: [
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
        { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Hello' },
        { name: 'body', label: 'Message', type: 'textarea', placeholder: 'Email message', full: true }
      ],
      build: (v) => `mailto:${v.email}?subject=${encodeURIComponent(v.subject || '')}&body=${encodeURIComponent(v.body || '')}`
    },
    phone: {
      label: 'Phone',
      category: 'Basic QR',
      icon: 'fa-phone',
      intro: 'Phone number',
      fields: [
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 555 123 4567', full: true }
      ],
      build: (v) => `tel:${v.phone}`
    },
    sms: {
      label: 'SMS',
      category: 'Basic QR',
      icon: 'fa-comment-dots',
      intro: 'Text message',
      fields: [
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 555 123 4567' },
        { name: 'message', label: 'Message', type: 'text', placeholder: 'Your message' }
      ],
      build: (v) => `SMSTO:${v.phone}:${v.message || ''}`
    },
    wifi: {
      label: 'Wi-Fi',
      category: 'Basic QR',
      icon: 'fa-wifi',
      intro: 'Wi-Fi network access',
      fields: [
        { name: 'ssid', label: 'Network Name', type: 'text', placeholder: 'Wi-Fi SSID' },
        { name: 'password', label: 'Password', type: 'text', placeholder: 'Wi-Fi password' },
        { name: 'encryption', label: 'Security', type: 'select', options: ['WPA', 'WEP', 'nopass'], value: 'WPA' }
      ],
      build: (v) => `WIFI:T:${escapeQrValue(v.encryption || 'WPA')};S:${escapeQrValue(v.ssid)};P:${escapeQrValue(v.password)};;`
    },
    vcard: {
      label: 'vCard',
      category: 'Business QR',
      icon: 'fa-address-card',
      intro: 'Digital business card',
      fields: [
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
        { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Company' },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 123 4567' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
        { name: 'website', label: 'Website', type: 'url', placeholder: 'https://example.com', full: true }
      ],
      build: (v) => [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${v.fullName || ''}`,
        `ORG:${v.organization || ''}`,
        `TEL:${v.phone || ''}`,
        `EMAIL:${v.email || ''}`,
        `URL:${v.website || ''}`,
        'END:VCARD'
      ].join('\n')
    },
    location: {
      label: 'Location',
      category: 'Business QR',
      icon: 'fa-location-dot',
      intro: 'Map location',
      fields: [
        { name: 'latitude', label: 'Latitude', type: 'text', placeholder: '37.7749' },
        { name: 'longitude', label: 'Longitude', type: 'text', placeholder: '-122.4194' },
        { name: 'mapsUrl', label: 'Or Google Maps URL', type: 'url', placeholder: 'https://maps.google.com/...', full: true }
      ],
      build: (v) => v.mapsUrl || `geo:${v.latitude},${v.longitude}`
    },
    event: {
      label: 'Event',
      category: 'Business QR',
      icon: 'fa-calendar-days',
      intro: 'Calendar event',
      fields: [
        { name: 'title', label: 'Event Title', type: 'text', placeholder: 'Meeting' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'Event location', full: true }
      ],
      build: (v) => {
        const stamp = `${(v.date || '2026-01-01').replaceAll('-', '')}T${(v.time || '0900').replace(':', '')}00`;
        return ['BEGIN:VEVENT', `SUMMARY:${v.title || ''}`, `LOCATION:${v.location || ''}`, `DTSTART:${stamp}`, 'END:VEVENT'].join('\n');
      }
    },
    menu: linkType('Menu', 'Business QR', 'fa-utensils', 'Restaurant or service menu', 'Paste your menu URL'),
    review: linkType('Review', 'Business QR', 'fa-star', 'Review page link', 'Paste your review page URL'),
    instagram: linkType('Instagram', 'Social QR', 'fa-brands fa-instagram', 'Instagram profile', 'https://instagram.com/username'),
    youtube: linkType('YouTube', 'Social QR', 'fa-brands fa-youtube', 'YouTube channel or video', 'https://youtube.com/@channel'),
    tiktok: linkType('TikTok', 'Social QR', 'fa-brands fa-tiktok', 'TikTok profile', 'https://tiktok.com/@username'),
    linkedin: linkType('LinkedIn', 'Social QR', 'fa-brands fa-linkedin', 'LinkedIn profile', 'https://linkedin.com/in/username'),
    whatsapp: linkType('WhatsApp', 'Social QR', 'fa-brands fa-whatsapp', 'WhatsApp chat link', 'https://wa.me/15551234567'),
    kakaotalk: linkType('KakaoTalk', 'Social QR', 'fa-comment', 'KakaoTalk channel link', 'https://pf.kakao.com/...'),
    pdf: linkType('PDF', 'File QR', 'fa-regular fa-file-pdf', 'Link to a PDF file', 'https://example.com/file.pdf'),
    image: linkType('Image', 'File QR', 'fa-regular fa-image', 'Link to an image file', 'https://example.com/image.jpg'),
    video: linkType('Video', 'File QR', 'fa-regular fa-file-video', 'Link to a video file', 'https://example.com/video.mp4'),
    audio: linkType('Audio', 'File QR', 'fa-regular fa-file-audio', 'Link to an audio file', 'https://example.com/audio.mp3'),
    document: linkType('Document', 'File QR', 'fa-regular fa-file-lines', 'Link to a document', 'https://example.com/document.docx'),
    coupon: linkType('Coupon', 'Marketing QR', 'fa-ticket', 'Coupon or discount link', 'https://example.com/coupon'),
    survey: linkType('Survey', 'Marketing QR', 'fa-square-poll-vertical', 'Survey form link', 'https://example.com/survey'),
    app: linkType('App Download', 'Marketing QR', 'fa-mobile-screen-button', 'App store link', 'https://example.com/app'),
    product: linkType('Product Page', 'Marketing QR', 'fa-bag-shopping', 'Product page link', 'https://example.com/product'),
    utm: linkType('UTM Link', 'Marketing QR', 'fa-chart-line', 'Tracked marketing URL', 'https://example.com/?utm_source=qr'),
    resume: linkType('Resume', 'Personal QR', 'fa-regular fa-file-lines', 'Resume link', 'https://example.com/resume'),
    portfolio: linkType('Portfolio', 'Personal QR', 'fa-briefcase', 'Portfolio website', 'https://example.com/portfolio'),
    pet: linkType('Pet ID', 'Personal QR', 'fa-paw', 'Pet ID information link', 'https://example.com/pet-id'),
    emergency: linkType('Emergency Contact', 'Personal QR', 'fa-kit-medical', 'Emergency information link', 'https://example.com/emergency'),
    invitation: linkType('Invitation', 'Personal QR', 'fa-envelope-open-text', 'Invitation or RSVP link', 'https://example.com/invite')
  };

  const CATEGORY_ORDER = ['Basic QR', 'Business QR', 'Social QR', 'File QR', 'Marketing QR', 'Personal QR'];
  const QUICK_TYPES = ['url', 'text', 'wifi', 'email', 'phone', 'sms', 'vcard', 'location'];
  const COLORS = ['#111827', '#2563eb', '#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#dc2626', '#0f766e'];
  const state = {
    type: 'url',
    dark: '#111827',
    light: '#ffffff',
    size: 512,
    format: 'png'
  };

  const quickTabs = document.getElementById('quickTypeTabs');
  const categoryGrid = document.getElementById('qrCategoryGrid');
  const form = document.getElementById('qrForm');
  const canvas = document.getElementById('qrCanvas');
  const status = document.getElementById('qrStatus');
  const activeCategory = document.getElementById('activeCategoryLabel');
  const activeTitle = document.getElementById('activeTypeTitle');
  const foregroundSwatches = document.getElementById('foregroundSwatches');
  const backgroundInput = document.getElementById('backgroundColorInput');
  const sizeSelect = document.getElementById('qrSizeSelect');

  function linkType(label, category, icon, intro, placeholder) {
    return {
      label,
      category,
      icon,
      intro,
      fields: [
        { name: 'link', label: `${label} Link`, type: 'url', placeholder, full: true },
        { name: 'name', label: 'QR Code Name (Optional)', type: 'text', placeholder: `${label} QR`, full: true, maxlength: 50 }
      ],
      build: (v) => v.link
    };
  }

  function escapeQrValue(value) {
    return String(value || '').replace(/[\\;,:"]/g, '\\$&');
  }

  function safeId(name) {
    return `qr-${name}`;
  }

  function renderQuickTabs() {
    quickTabs.innerHTML = QUICK_TYPES.map((key) => tabMarkup(key)).join('') +
      `<button class="qr-type-tab" type="button" data-scroll-catalog><i class="fa-solid fa-ellipsis"></i><span>More</span></button>`;
    quickTabs.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-type]');
      if (tab) {
        selectType(tab.dataset.type);
        return;
      }
      if (event.target.closest('[data-scroll-catalog]')) {
        document.getElementById('qrCatalogTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function tabMarkup(key) {
    const type = TYPES[key];
    return `<button class="qr-type-tab${state.type === key ? ' active' : ''}" type="button" data-type="${key}">
      <i class="${iconClass(type.icon)}"></i>
      <span>${type.label}</span>
    </button>`;
  }

  function iconClass(icon) {
    return /\bfa-(solid|regular|brands)\b/.test(icon) ? icon : `fa-solid ${icon}`;
  }

  function renderCategoryGrid() {
    categoryGrid.innerHTML = CATEGORY_ORDER.map((category) => {
      const items = Object.entries(TYPES).filter(([, type]) => type.category === category);
      return `<article class="qr-category-card">
        <h3><i class="fa-solid ${categoryIcon(category)}"></i>${category}</h3>
        <div class="qr-type-list">
          ${items.map(([key, type]) => `<button type="button" data-type="${key}"><span>${type.label}</span><i class="fa-solid fa-arrow-right"></i></button>`).join('')}
        </div>
      </article>`;
    }).join('');
    categoryGrid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-type]');
      if (!button) return;
      selectType(button.dataset.type);
      document.querySelector('.qr-workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function categoryIcon(category) {
    return {
      'Basic QR': 'fa-qrcode',
      'Business QR': 'fa-briefcase',
      'Social QR': 'fa-share-nodes',
      'File QR': 'fa-folder-open',
      'Marketing QR': 'fa-bullhorn',
      'Personal QR': 'fa-user'
    }[category] || 'fa-qrcode';
  }

  function selectType(typeKey) {
    if (!TYPES[typeKey]) return;
    state.type = typeKey;
    renderForm();
    syncActiveTabs();
    generateQr();
  }

  function syncActiveTabs() {
    document.querySelectorAll('.qr-type-tab').forEach((button) => {
      button.classList.toggle('active', button.dataset.type === state.type);
    });
  }

  function renderForm() {
    const type = TYPES[state.type];
    activeCategory.textContent = type.category;
    activeTitle.textContent = `${type.label} QR`;
    form.innerHTML = type.fields.map((field) => {
      const id = safeId(field.name);
      const maxlength = field.maxlength ? ` maxlength="${field.maxlength}"` : '';
      const value = field.value ? ` value="${escapeHtml(field.value)}"` : '';
      const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : '';
      const full = field.full || field.type === 'textarea' ? ' full' : '';
      if (field.type === 'textarea') {
        return `<div class="qr-field${full}"><label for="${id}">${field.label}</label><textarea id="${id}" name="${field.name}"${placeholder}${maxlength}>${escapeHtml(field.value || '')}</textarea></div>`;
      }
      if (field.type === 'select') {
        return `<div class="qr-field${full}"><label for="${id}">${field.label}</label><select id="${id}" name="${field.name}">
          ${field.options.map((option) => `<option value="${escapeHtml(option)}"${option === field.value ? ' selected' : ''}>${escapeHtml(option)}</option>`).join('')}
        </select></div>`;
      }
      return `<div class="qr-field${full}"><label for="${id}">${field.label}</label><input id="${id}" name="${field.name}" type="${field.type || 'text'}"${placeholder}${maxlength}${value}></div>`;
    }).join('');
    form.querySelectorAll('input, textarea, select').forEach((control) => {
      control.addEventListener('input', debounce(generateQr, 150));
      control.addEventListener('change', generateQr);
    });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  function collectValues() {
    return Array.from(new FormData(form).entries()).reduce((values, [key, value]) => {
      values[key] = String(value).trim();
      return values;
    }, {});
  }

  function payload() {
    const type = TYPES[state.type];
    const values = collectValues();
    const output = type.build(values);
    return String(output || '').trim();
  }

  async function generateQr() {
    const text = payload();
    if (!text) {
      status.textContent = 'Enter details to generate your QR code.';
      clearCanvas();
      return false;
    }
    if (!window.QRCode || !window.QRCode.toCanvas) {
      status.textContent = 'QR generator library is still loading. Try again in a moment.';
      return false;
    }
    try {
      await window.QRCode.toCanvas(canvas, text, {
        width: state.size,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: state.dark,
          light: state.light
        }
      });
      status.textContent = `${TYPES[state.type].label} QR code is ready.`;
      return true;
    } catch (error) {
      status.textContent = error.message || 'Could not generate this QR code.';
      return false;
    }
  }

  function clearCanvas() {
    const context = canvas.getContext('2d');
    context.fillStyle = state.light;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function renderSwatches() {
    foregroundSwatches.innerHTML = COLORS.map((color) => `<button type="button" style="background:${color}" data-color="${color}" aria-label="Use ${color}"></button>`).join('');
    foregroundSwatches.addEventListener('click', (event) => {
      const button = event.target.closest('[data-color]');
      if (!button) return;
      state.dark = button.dataset.color;
      updateSwatchState();
      generateQr();
    });
    updateSwatchState();
  }

  function updateSwatchState() {
    foregroundSwatches.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button.dataset.color === state.dark);
    });
  }

  function debounce(fn, wait) {
    let timer = null;
    return function debounced() {
      window.clearTimeout(timer);
      timer = window.setTimeout(fn, wait);
    };
  }

  function resetFields() {
    renderForm();
    generateQr();
  }

  function resetDesign() {
    state.dark = '#111827';
    state.light = '#ffffff';
    state.size = 512;
    backgroundInput.value = state.light;
    sizeSelect.value = String(state.size);
    updateSwatchState();
    generateQr();
  }

  function getFilename(ext) {
    const nameField = form.querySelector('[name="name"]');
    const name = (nameField && nameField.value.trim()) || `${TYPES[state.type].label}-qr-code`;
    return `${name.replace(/[^\w\-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'qr-code'}.${ext}`;
  }

  async function downloadPng() {
    const ok = await generateQr();
    if (!ok) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = getFilename('png');
    link.click();
  }

  async function downloadSvg() {
    const text = payload();
    if (!text) return;
    try {
      const svgString = await new Promise((resolve, reject) => {
        window.QRCode.toString(text, {
          type: 'svg',
          width: state.size,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: state.dark, light: state.light }
        }, (err, string) => {
          if (err) reject(err);
          else resolve(string);
        });
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = getFilename('svg');
      link.click();
    } catch (e) {
      status.textContent = 'Failed to generate SVG.';
    }
  }

  async function downloadPdf() {
    const ok = await generateQr();
    if (!ok) return;
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [state.size, state.size]
      });
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, state.size, state.size);
      pdf.save(getFilename('pdf'));
    } catch (e) {
      status.textContent = 'Failed to generate PDF. Make sure jsPDF is loaded.';
    }
  }

  async function handleDownload() {
    if (state.format === 'svg') await downloadSvg();
    else if (state.format === 'pdf') await downloadPdf();
    else await downloadPng();
  }

  function selectFormat(format) {
    if ((format === 'svg' || format === 'pdf') && window.EverythingConvertAuth) {
      if (!window.EverythingConvertAuth.isPro()) return;
    }
    state.format = format;
    document.querySelectorAll('.qr-format-row button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.format === format);
    });
    const downloadBtn = document.getElementById('downloadQrButton');
    if (format === 'svg') downloadBtn.innerHTML = 'Download SVG <i class="fa-solid fa-download"></i>';
    else if (format === 'pdf') downloadBtn.innerHTML = 'Download PDF <i class="fa-solid fa-download"></i>';
    else downloadBtn.innerHTML = 'Download PNG <i class="fa-solid fa-download"></i>';
  }

  function applyProFeatures() {
    const isPro = window.EverythingConvertAuth && typeof window.EverythingConvertAuth.isPro === 'function' ? window.EverythingConvertAuth.isPro() : false;
    document.querySelectorAll('.qr-format-row button[data-format="svg"], .qr-format-row button[data-format="pdf"]').forEach(btn => {
      if (isPro) {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', 'true');
        if (state.format === btn.dataset.format) selectFormat('png');
      }
    });
  }

  function testQr() {
    const text = payload();
    if (!text) {
      status.textContent = 'Enter details before testing this QR code.';
      return;
    }
    if (/^https?:\/\//i.test(text) || /^mailto:|^tel:/i.test(text)) {
      window.open(text, '_blank', 'noopener');
      return;
    }
    status.textContent = 'This QR contains text or app data. Scan it with a phone to test.';
  }

  function init() {
    renderQuickTabs();
    renderCategoryGrid();
    renderSwatches();
    renderForm();
    document.getElementById('generateQrButton').addEventListener('click', generateQr);
    document.getElementById('downloadQrButton').addEventListener('click', handleDownload);
    
    document.querySelectorAll('.qr-format-row button').forEach(btn => {
      btn.addEventListener('click', () => selectFormat(btn.dataset.format));
    });

    window.addEventListener('everything-header-ready', applyProFeatures);
    applyProFeatures();

    document.getElementById('resetQrButton').addEventListener('click', resetFields);
    document.getElementById('resetDesignButton').addEventListener('click', resetDesign);
    document.getElementById('testQrButton').addEventListener('click', testQr);
    backgroundInput.addEventListener('input', () => {
      state.light = backgroundInput.value;
      generateQr();
    });
    sizeSelect.addEventListener('change', () => {
      state.size = Number(sizeSelect.value) || 512;
      generateQr();
    });
    generateQr();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
