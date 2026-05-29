(function () {
  function scriptPrefix() {
    const current = document.currentScript || Array.from(document.scripts).find((script) => /tools-menu\.js/.test(script.src || ''));
    const src = current ? current.getAttribute('src') || '' : '';
    return src.includes('../') ? '../' : '';
  }

  function injectHeaderStyles() {
    if (document.getElementById('ec-unified-header-style')) return;
    const style = document.createElement('style');
    style.id = 'ec-unified-header-style';
    style.textContent = `
      .ec-unified-header {
        position: sticky !important;
        top: 0 !important;
        z-index: 9000 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 1.2rem !important;
        min-height: 4.4rem !important;
        padding: .85rem clamp(1rem, 4vw, 3rem) !important;
        border-bottom: 1px solid rgba(226, 232, 240, .88) !important;
        background: rgba(255, 255, 255, .9) !important;
        box-shadow: 0 10px 28px rgba(15, 23, 42, .05) !important;
        backdrop-filter: blur(18px) !important;
        -webkit-backdrop-filter: blur(18px) !important;
      }
      .ec-unified-header .logo {
        flex: 1 1 0% !important;
        justify-content: flex-start !important;
        color: #0f172a !important;
        text-decoration: none !important;
        font-family: Inter, "Noto Sans KR", system-ui, sans-serif !important;
        font-size: 1.1rem !important;
        font-weight: 900 !important;
        white-space: nowrap !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }
      .ec-unified-header .top-nav {
        display: flex !important;
        align-items: center !important;
        gap: 1.15rem !important;
        margin: 0 auto !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
      }
      .ec-unified-header .top-actions {
        flex: 1 1 0% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex-wrap: nowrap !important;
        gap: clamp(.5rem, .8vw, .75rem) !important;
        min-width: 0 !important;
      }
      .ec-unified-header .top-nav a,
      .ec-unified-header .top-actions a,
      .ec-unified-header .tools-toggle {
        color: #0f172a !important;
        text-decoration: none !important;
        font-family: Inter, "Noto Sans KR", system-ui, sans-serif !important;
        font-size: .88rem !important;
        font-weight: 800 !important;
        white-space: nowrap !important;
      }
      .ec-unified-header .tools-toggle {
        display: inline-flex !important;
        align-items: center !important;
        gap: .35rem !important;
        border: 0 !important;
        background: transparent !important;
        cursor: pointer !important;
      }
      .ec-unified-header .tools-toggle::after {
        content: '' !important;
        width: 0;
        height: 0;
        border-left: .23rem solid transparent;
        border-right: .23rem solid transparent;
        border-top: .32rem solid currentColor;
      }
      .ec-unified-header .tools-dropdown {
        position: absolute !important;
        top: calc(100% + 0.6rem) !important;
        left: 0 !important;
        right: auto !important;
        z-index: 9100 !important;
        max-height: min(72vh, 620px) !important;
        overflow: auto !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        background: rgba(255, 255, 255, .98) !important;
        box-shadow: 0 24px 70px rgba(15, 23, 42, .16) !important;
        display: none !important;
      }
      .ec-unified-header .tools-menu.open .tools-dropdown {
        display: flex !important;
      }
      .ec-unified-header .tools-dropdown.mega-tools {
        position: absolute !important;
        left: 0 !important;
        right: auto !important;
        top: 100% !important;
        width: min(980px, calc(100vw - 2rem)) !important;
        grid-template-columns: repeat(5, minmax(130px, 1fr)) !important;
      }
      .ec-unified-header .tools-menu.open .tools-dropdown.mega-tools {
        display: grid !important;
      }
        right: auto !important;
        top: 100% !important;
        width: min(980px, calc(100vw - 2rem)) !important;
        grid-template-columns: repeat(5, minmax(130px, 1fr)) !important;
      }
      .ec-unified-header .tools-dropdown a {
        color: #334155 !important;
        border-radius: 8px !important;
      }
      .ec-unified-header .tools-dropdown a:hover {
        color: #2563eb !important;
        background: rgba(37, 99, 235, .08) !important;
      }
      .ec-unified-header .tools-group-title {
        color: #0f172a !important;
        border-bottom-color: #e2e8f0 !important;
      }
      .ec-unified-header .ec-tool-search {
        display: grid !important;
        grid-template-columns: auto minmax(5.8rem, 1fr) !important;
        align-items: center !important;
        gap: .45rem !important;
        min-width: min(12rem, 16vw) !important;
        padding: .55rem .75rem !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 999px !important;
        background: rgba(248, 250, 252, .92) !important;
        color: #64748b !important;
      }
      .ec-unified-header .ec-tool-search input {
        min-width: 0 !important;
        border: 0 !important;
        background: transparent !important;
        color: #0f172a !important;
        padding: 0 !important;
        font: inherit !important;
        font-size: .82rem !important;
        outline: none !important;
      }
      .ec-unified-header .ec-try-pro {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 2.55rem !important;
        padding: 0 1rem !important;
        border-radius: 12px !important;
        color: #fff !important;
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
        box-shadow: 0 14px 30px rgba(37, 99, 235, .22) !important;
      }
      @media (max-width: 1600px) {
        .ec-unified-header .ec-tool-search {
          display: none !important;
        }
        .ec-unified-header {
          gap: .85rem !important;
        }
        .ec-unified-header .top-nav {
        display: flex !important;
        align-items: center !important;
        gap: 1.15rem !important;
        margin: 0 auto !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
      }
      @media (max-width: 920px) {
        .ec-unified-header {
          align-items: flex-start !important;
          flex-wrap: wrap !important;
        }
        .ec-unified-header .logo {
          flex: 1 1 auto !important;
        }
        .ec-unified-header .top-nav {
        display: flex !important;
        align-items: center !important;
        gap: 1.15rem !important;
        margin: 0 auto !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
      }
      @media (max-width: 560px) {
        .ec-unified-header .top-nav a[data-tab-jump="office"],
        .ec-unified-header .top-nav a[data-tab-jump="ai"],
        .ec-unified-header .top-nav a[data-tab-jump="video"],
        .ec-unified-header .developer-tools-menu {
          display: none !important;
        }
        .ec-unified-header .ec-try-pro {
          min-height: 2.25rem !important;
          padding: 0 .75rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeHeader() {
    const header = document.querySelector('header');
    if (!header) return false;
    if (header.dataset.ecUnifiedHeader === 'true') return true;
    const prefix = scriptPrefix();
    header.dataset.ecUnifiedHeader = 'true';
    header.classList.add('ec-unified-header');
    header.innerHTML = `
      <a class="logo" href="${prefix}index.html" aria-label="EverythingConvert home">
        <img class="brand-icon" src="${prefix}favicon.svg" alt="" width="28" height="28">
        <span>EverythingConvert</span>
      </a>
      <nav class="top-nav" aria-label="Primary navigation">
        <div class="tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">All Tools</button>
          <div class="tools-dropdown mega-tools">
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-regular fa-star"></i> Popular</div>
              <a href="${prefix}pdf to word/pdf-to-word.html">PDF to Word</a>
              <a href="${prefix}pdf to jpg/pdf-to-jpg.html">PDF to JPG</a>
              <a href="${prefix}image to pdf/image-to-pdf.html">Image to PDF</a>
              <a href="${prefix}media converter/media-converter.html?mode=mp4-mp3">MP4 to MP3</a>
              <a href="${prefix}gif converter/gif-converter.html">Video to GIF</a>
              <a href="${prefix}qr code generator/qr-code-generator.html">QR Code Generator</a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-solid fa-file-export"></i> PDF Convert</div>
              <a href="${prefix}pdf to word/pdf-to-word.html">PDF to Word</a>
              <a href="${prefix}pdf to excel/pdf-to-excel.html">PDF to Excel</a>
              <a href="${prefix}pdf to jpg/pdf-to-jpg.html">PDF to JPG</a>
              <a href="${prefix}excel to pdf/excel-to-pdf.html">Excel to PDF</a>
              <a href="${prefix}docx to pdf/docx-to-pdf.html">DOCX to PDF</a>
              <a href="${prefix}pdf to epub/pdf-to-epub.html">PDF to EPUB</a>
              <a href="${prefix}ebook converter/ebook-converter.html">Ebook Converter</a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-solid fa-wrench"></i> PDF Tools</div>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=merge">Merge PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=compress">Compress PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=split">Split PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=rotate">Rotate PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=remove">Remove Pages</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=extract">Extract Pages</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=organize">Organize PDF</a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-regular fa-image"></i> Image</div>
              <a href="${prefix}image converter/image-converter.html">Image Converter</a>
              <a href="${prefix}image to pdf/image-to-pdf.html">Image to PDF</a>
              <a href="${prefix}image converter/image-converter.html?mode=webp-png">WEBP to PNG</a>
              <a href="${prefix}image converter/image-converter.html?mode=heic-jpg">HEIC to JPG</a>
              <a href="${prefix}image converter/image-converter.html?mode=png-svg">PNG to SVG</a>
              <a href="${prefix}image converter/image-converter.html?mode=svg">SVG Converter</a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-regular fa-circle-play"></i> Video & Audio</div>
              <a href="${prefix}media converter/media-converter.html">Video Converter</a>
              <a href="${prefix}media converter/media-converter.html?mode=audio">Audio Converter</a>
              <a href="${prefix}media converter/media-converter.html?mode=mp3">MP3 Converter</a>
              <a href="${prefix}media converter/media-converter.html?mode=mp4-mp3">MP4 to MP3</a>
              <a href="${prefix}media converter/media-converter.html?mode=mov-mp4">MOV to MP4</a>
              <a href="${prefix}gif converter/gif-converter.html">GIF Converter</a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-solid fa-code"></i> Developer</div>
              <a href="${prefix}qr code generator/qr-code-generator.html">QR Code Generator</a>
              <a href="${prefix}json to csv/json-to-csv.html">JSON to CSV</a>
              <a href="${prefix}contact.html">Contact</a>
            </div>
          </div>
        </div>
        <div class="tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">PDF</button>
          <div class="tools-dropdown" style="flex-direction: row; gap: 0.5rem; width: max-content; padding: 0.5rem;">
            <div style="display: flex; flex-direction: column; min-width: 160px;">
              <div style="padding: 0.5rem 1rem 0.25rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 800; pointer-events: none;"><i class="fa-solid fa-file-export"></i> Convert</div>
              <a href="${prefix}pdf to word/pdf-to-word.html">PDF to Word</a>
              <a href="${prefix}pdf to excel/pdf-to-excel.html">PDF to Excel</a>
              <a href="${prefix}pdf to jpg/pdf-to-jpg.html">PDF to JPG</a>
              <a href="${prefix}excel to pdf/excel-to-pdf.html">Excel to PDF</a>
              <a href="${prefix}docx to pdf/docx-to-pdf.html">DOCX to PDF</a>
              <a href="${prefix}pdf to epub/pdf-to-epub.html">PDF to EPUB</a>
              <a href="${prefix}ebook converter/ebook-converter.html">Ebook Converter</a>
            </div>
            <div style="display: flex; flex-direction: column; min-width: 160px; border-left: 1px solid #f1f5f9; padding-left: 0.5rem;">
              <div style="padding: 0.5rem 1rem 0.25rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 800; pointer-events: none;"><i class="fa-solid fa-wrench"></i> Tools</div>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=merge">Merge PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=compress">Compress PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=split">Split PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=rotate">Rotate PDF</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=remove">Remove Pages</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=extract">Extract Pages</a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=organize">Organize PDF</a>
            </div>
          </div>
        </div>
        <a href="${prefix}index.html#tool-browser" data-tab-jump="image">Image</a>
        <a href="${prefix}index.html#tool-browser" data-tab-jump="video">Video & Audio</a>
        <a href="${prefix}index.html#tool-browser" data-tab-jump="office">Office</a>
        <a href="${prefix}index.html#ai-preview" data-tab-jump="ai">AI Tools</a>
        <div class="tools-menu developer-tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">Developer</button>
          <div class="tools-dropdown">
            <a href="${prefix}qr code generator/qr-code-generator.html">QR Code Generator</a>
            <a href="${prefix}json to csv/json-to-csv.html">JSON to CSV</a>
          </div>
        </div>
        <a href="${prefix}pricing.html">Pricing</a>
      </nav>
      <div class="top-actions">
        <label class="ec-tool-search" aria-label="Search tools">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" placeholder="Search tools...">
        </label>
        <a href="${prefix}auth.html" data-auth-login style="display:none;">Login</a>
        <a href="${prefix}auth.html" data-auth-state data-auth-account>Checking...</a>
        <a href="#" data-auth-logout style="display:none;">Logout</a>
        <a href="${prefix}admin.html" data-admin-only style="display:none;">Admin</a>
        <a class="ec-try-pro" href="${prefix}pricing.html">Try Pro</a>
      </div>
    `;
    const nav = header.querySelector('.top-nav');
    if (nav) nav.dataset.ecHeaderEnhanced = 'true';
    return true;
  }

  function syncAuthHeaderState() {
    window.dispatchEvent(new CustomEvent('everything-header-ready'));
    if (
      window.EverythingConvertAuth &&
      typeof window.EverythingConvertAuth.renderAuthWidgets === 'function' &&
      (window.EverythingConvertAuth.state?.ready || window.EverythingConvertAuth.state?.user)
    ) {
      window.EverythingConvertAuth.renderAuthWidgets();
    }
  }

  function bindHomeHeaderTools() {
    const grid = document.getElementById('homeToolGrid');
    const searchInput = document.querySelector('.ec-unified-header .ec-tool-search input');
    if (!grid || !searchInput || searchInput.dataset.ecBound === 'true') return;
    searchInput.dataset.ecBound = 'true';
    const cards = Array.from(document.querySelectorAll('.home-tool-card'));
    const tabs = Array.from(document.querySelectorAll('.tool-tab'));
    const emptyMessage = document.getElementById('toolEmptyMessage');
    let activeTab = document.querySelector('.tool-tab.active')?.dataset.toolTab || 'popular';

    function filterCards() {
      const query = (searchInput.value || '').trim().toLowerCase();
      let visibleCount = 0;
      cards.forEach((card) => {
        const categories = card.dataset.categories || '';
        const text = `${card.dataset.toolName || ''} ${card.textContent}`.toLowerCase();
        const matchesTab = activeTab === 'popular' ? categories.includes('popular') : categories.includes(activeTab);
        const matchesSearch = !query || text.includes(query);
        const visible = matchesTab && matchesSearch;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    }

    function setActiveTab(nextTab) {
      activeTab = nextTab || 'popular';
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.toolTab === activeTab));
      filterCards();
    }

    searchInput.addEventListener('input', filterCards);
    document.querySelectorAll('.ec-unified-header [data-tab-jump]').forEach((link) => {
      link.addEventListener('click', () => setActiveTab(link.dataset.tabJump));
    });
  }

  function closeAll(except) {
    document.querySelectorAll('.tools-menu.open').forEach((menu) => {
      if (menu === except) return;
      menu.classList.remove('open');
      const toggle = menu.querySelector('.tools-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.tools-toggle');
    if (toggle) {
      event.preventDefault();
      const menu = toggle.closest('.tools-menu');
      const willOpen = !menu.classList.contains('open');
      closeAll(menu);
      menu.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }

    if (!event.target.closest('.tools-menu')) closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });

  injectHeaderStyles();
  if (normalizeHeader()) syncAuthHeaderState();
  bindHomeHeaderTools();
})();
