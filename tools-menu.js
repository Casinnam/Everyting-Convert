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
      .ec-unified-header .ec-mobile-toggle {
        display: none !important;
        align-items: center !important;
        justify-content: center !important;
        width: 3rem !important;
        height: 3rem !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 14px !important;
        background: rgba(255, 255, 255, .92) !important;
        color: #0f172a !important;
        font-size: 1.2rem !important;
        cursor: pointer !important;
        box-shadow: 0 12px 24px rgba(15, 23, 42, .08) !important;
      }
      .ec-unified-header .tools-menu {
        position: relative !important;
        display: inline-flex !important;
        align-items: center !important;
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
        flex-direction: column !important;
        gap: .45rem !important;
        min-width: 230px !important;
        padding: .65rem !important;
      }
      .ec-unified-header .tools-menu.open .tools-dropdown {
        display: flex !important;
      }
      .ec-unified-header .tools-dropdown.mega-tools {
        position: fixed !important;
        left: 50vw !important;
        right: auto !important;
        top: 4.45rem !important;
        width: min(1320px, calc(100vw - 2rem)) !important;
        transform: translateX(-50%) !important;
        grid-template-columns: repeat(6, minmax(150px, 1fr)) !important;
        gap: 1.05rem !important;
        padding: 1.05rem !important;
        background:
          radial-gradient(circle at 15% 20%, rgba(59, 130, 246, .12), transparent 28%),
          radial-gradient(circle at 82% 10%, rgba(124, 58, 237, .12), transparent 26%),
          rgba(255, 255, 255, .98) !important;
      }
      .ec-unified-header .tools-dropdown.category-dropdown {
        grid-template-columns: repeat(var(--ec-category-cols, 2), minmax(210px, 1fr)) !important;
        gap: .95rem !important;
        width: max-content !important;
        max-width: calc(100vw - 2rem) !important;
        min-width: var(--ec-category-width, 460px) !important;
        padding: .85rem !important;
      }
      .ec-unified-header .tools-menu.open .tools-dropdown.category-dropdown {
        display: grid !important;
      }
      .ec-unified-header .tools-menu.open .tools-dropdown.mega-tools {
        display: grid !important;
      }
      .ec-unified-header .tools-group {
        display: grid !important;
        align-content: start !important;
        gap: .18rem !important;
        min-width: 0 !important;
      }
      .ec-unified-header .tools-dropdown a {
        display: flex !important;
        align-items: center !important;
        gap: .58rem !important;
        min-height: 2.5rem !important;
        padding: .5rem .6rem !important;
        color: #334155 !important;
        border-radius: 8px !important;
        text-decoration: none !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        transition: background .16s ease, color .16s ease, transform .16s ease !important;
      }
      .ec-unified-header .tools-dropdown a:hover {
        color: #2563eb !important;
        background: rgba(37, 99, 235, .08) !important;
        transform: translateX(2px) !important;
      }
      .ec-unified-header .tools-group-title {
        display: flex !important;
        align-items: center !important;
        gap: .35rem !important;
        padding: .35rem .7rem .55rem !important;
        color: #0f172a !important;
        font-family: Inter, "Noto Sans KR", system-ui, sans-serif !important;
        font-size: .86rem !important;
        font-weight: 900 !important;
        white-space: nowrap !important;
        border-bottom: 1px solid #e2e8f0 !important;
        border-bottom-color: #e2e8f0 !important;
      }
      .ec-unified-header .tools-subgroup-title {
        display: flex !important;
        align-items: center !important;
        gap: .4rem !important;
        padding: .45rem .6rem .35rem !important;
        color: #64748b !important;
        font-size: .74rem !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: .05em !important;
      }
      .ec-unified-header .tools-dropdown a.tool-disabled {
        cursor: default !important;
        color: #94a3b8 !important;
        background: rgba(248, 250, 252, .72) !important;
      }
      .ec-unified-header .tools-dropdown a.tool-disabled:hover {
        color: #94a3b8 !important;
        transform: none !important;
      }
      .ec-unified-header .tool-emoji {
        display: inline-grid !important;
        place-items: center !important;
        flex: 0 0 1.85rem !important;
        width: 1.85rem !important;
        height: 1.85rem !important;
        border-radius: 8px !important;
        color: #fff !important;
        font-size: 1rem !important;
        line-height: 1 !important;
        box-shadow: 0 8px 18px rgba(15, 23, 42, .12) !important;
      }
      .ec-unified-header .tool-emoji.pdf { background: linear-gradient(135deg, #ef4444, #fb7185) !important; }
      .ec-unified-header .tool-emoji.word { background: linear-gradient(135deg, #2563eb, #60a5fa) !important; }
      .ec-unified-header .tool-emoji.excel { background: linear-gradient(135deg, #16a34a, #22c55e) !important; }
      .ec-unified-header .tool-emoji.image { background: linear-gradient(135deg, #06b6d4, #2dd4bf) !important; }
      .ec-unified-header .tool-emoji.video { background: linear-gradient(135deg, #7c3aed, #a855f7) !important; }
      .ec-unified-header .tool-emoji.audio { background: linear-gradient(135deg, #f59e0b, #fb923c) !important; }
      .ec-unified-header .tool-emoji.gif { background: linear-gradient(135deg, #ec4899, #f472b6) !important; }
      .ec-unified-header .tool-emoji.dev { background: linear-gradient(135deg, #0f172a, #475569) !important; }
      .ec-unified-header .tool-emoji.ai { background: linear-gradient(135deg, #4f46e5, #8b5cf6) !important; }
      .ec-unified-header .tool-emoji.lock { background: linear-gradient(135deg, #64748b, #94a3b8) !important; }
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
          gap: .8rem !important;
        }
      }
      @media (max-width: 920px) {
        .ec-unified-header {
          align-items: center !important;
          flex-wrap: wrap !important;
        }
        .ec-unified-header .logo {
          flex: 1 1 auto !important;
        }
        .ec-unified-header .ec-mobile-toggle {
          display: inline-flex !important;
        }
        .ec-unified-header .top-nav {
          order: 3 !important;
          display: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: .85rem !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 18px !important;
          background: rgba(255, 255, 255, .96) !important;
          box-shadow: 0 22px 50px rgba(15, 23, 42, .12) !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          gap: .45rem !important;
        }
        .ec-unified-header.mobile-open .top-nav {
          display: flex !important;
        }
        .ec-unified-header .top-actions {
          order: 4 !important;
          display: none !important;
          width: 100% !important;
          flex: 0 0 100% !important;
          justify-content: stretch !important;
          align-items: stretch !important;
          flex-direction: column !important;
          gap: .55rem !important;
        }
        .ec-unified-header.mobile-open .top-actions {
          display: flex !important;
        }
        .ec-unified-header .top-nav > a,
        .ec-unified-header .tools-toggle,
        .ec-unified-header .top-actions > a {
          width: 100% !important;
          min-height: 2.75rem !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: .75rem .85rem !important;
          border-radius: 12px !important;
          background: rgba(248, 250, 252, .9) !important;
        }
        .ec-unified-header .tools-menu {
          display: grid !important;
          width: 100% !important;
        }
        .ec-unified-header .tools-dropdown,
        .ec-unified-header .tools-dropdown.mega-tools {
          position: static !important;
          left: auto !important;
          right: auto !important;
          top: auto !important;
          width: 100% !important;
          max-height: min(58vh, 540px) !important;
          transform: none !important;
          grid-template-columns: 1fr !important;
          flex-direction: column !important;
          margin-top: .45rem !important;
          box-shadow: 0 16px 34px rgba(15, 23, 42, .1) !important;
        }
        .ec-unified-header .tools-dropdown.category-dropdown {
          width: 100% !important;
          min-width: 0 !important;
          grid-template-columns: 1fr !important;
        }
        .ec-unified-header .tools-dropdown.mega-tools {
          grid-template-columns: 1fr !important;
        }
        .ec-unified-header .tools-menu.open .tools-dropdown,
        .ec-unified-header .tools-menu.open .tools-dropdown.mega-tools {
          display: grid !important;
        }
        .ec-unified-header .tools-dropdown a {
          white-space: normal !important;
        }
      }
      @media (max-width: 560px) {
        .ec-unified-header {
          padding: .75rem 1rem !important;
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
      <button class="ec-mobile-toggle" type="button" aria-label="Open menu" aria-expanded="false">
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
      </button>
      <nav class="top-nav" aria-label="Primary navigation">
        <div class="tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">All Tools</button>
          <div class="tools-dropdown mega-tools">
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-regular fa-star"></i> Popular</div>
              <a href="${prefix}pdf to word/pdf-to-word.html"><span class="tool-emoji word">W</span><span>PDF to Word</span></a>
              <a href="${prefix}pdf to jpg/pdf-to-jpg.html"><span class="tool-emoji image">&#128444;</span><span>PDF to JPG</span></a>
              <a href="${prefix}image to pdf/image-to-pdf.html"><span class="tool-emoji pdf">&#128196;</span><span>Image to PDF</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=mp4-mp3"><span class="tool-emoji audio">&#127925;</span><span>MP4 to MP3</span></a>
              <a href="${prefix}gif converter/gif-converter.html"><span class="tool-emoji gif">GIF</span><span>Video to GIF</span></a>
              <a href="${prefix}qr code generator/qr-code-generator.html"><span class="tool-emoji dev">QR</span><span>QR Code Generator</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-solid fa-file-export"></i> PDF Converters</div>
              <a href="${prefix}pdf to word/pdf-to-word.html"><span class="tool-emoji word">W</span><span>PDF to Word</span></a>
              <a href="${prefix}pdf to excel/pdf-to-excel.html"><span class="tool-emoji excel">X</span><span>PDF to Excel</span></a>
              <a href="${prefix}pdf to jpg/pdf-to-jpg.html"><span class="tool-emoji image">&#128444;</span><span>PDF to JPG</span></a>
              <a href="${prefix}excel to pdf/excel-to-pdf.html"><span class="tool-emoji pdf">PDF</span><span>Excel to PDF</span></a>
              <a href="${prefix}docx to pdf/docx-to-pdf.html"><span class="tool-emoji word">D</span><span>DOCX to PDF</span></a>
              <a href="${prefix}pdf to epub/pdf-to-epub.html"><span class="tool-emoji pdf">&#128218;</span><span>PDF to EPUB</span></a>
              <a href="${prefix}ebook converter/ebook-converter.html"><span class="tool-emoji pdf">&#128214;</span><span>Ebook Converter</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-solid fa-wrench"></i> PDF Tools</div>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=merge"><span class="tool-emoji pdf">&#128279;</span><span>Merge PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=compress"><span class="tool-emoji pdf">&#128230;</span><span>Compress PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=split"><span class="tool-emoji pdf">&#9986;</span><span>Split PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=rotate"><span class="tool-emoji pdf">&#8635;</span><span>Rotate PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=remove"><span class="tool-emoji lock">&#128465;</span><span>Remove Pages</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=extract"><span class="tool-emoji pdf">&#128229;</span><span>Extract Pages</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=organize"><span class="tool-emoji pdf">&#128450;</span><span>Organize PDF</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-regular fa-image"></i> Image</div>
              <a href="${prefix}image converter/image-converter.html"><span class="tool-emoji image">&#128247;</span><span>Image Converter</span></a>
              <a href="${prefix}image to pdf/image-to-pdf.html"><span class="tool-emoji pdf">PDF</span><span>Image to PDF</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=webp-png"><span class="tool-emoji image">PNG</span><span>WEBP to PNG</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=webp-jpg"><span class="tool-emoji image">JPG</span><span>WEBP to JPG</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=heic-jpg"><span class="tool-emoji image">HEIC</span><span>HEIC to JPG</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=png-svg"><span class="tool-emoji image">SVG</span><span>PNG to SVG</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=svg"><span class="tool-emoji image">&#9671;</span><span>SVG Converter</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-regular fa-circle-play"></i> Video & Audio</div>
              <a href="${prefix}media converter/media-converter.html"><span class="tool-emoji video">&#9654;</span><span>Video Converter</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=audio"><span class="tool-emoji audio">&#127911;</span><span>Audio Converter</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=mp3"><span class="tool-emoji audio">MP3</span><span>MP3 Converter</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=mp4-mp3"><span class="tool-emoji audio">&#9835;</span><span>MP4 to MP3</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=mov-mp4"><span class="tool-emoji video">MP4</span><span>MOV to MP4</span></a>
              <a href="${prefix}gif converter/gif-converter.html"><span class="tool-emoji gif">GIF</span><span>GIF Converter</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-group-title"><i class="fa-solid fa-code"></i> Developer</div>
              <a href="${prefix}qr code generator/qr-code-generator.html"><span class="tool-emoji dev">QR</span><span>QR Code Generator</span></a>
              <a href="${prefix}json to csv/json-to-csv.html"><span class="tool-emoji dev">{ }</span><span>JSON to CSV</span></a>
              <a href="${prefix}csv converter/csv-converter.html"><span class="tool-emoji excel">CSV</span><span>CSV Converter</span></a>
              <a href="${prefix}index.html#ai-preview" data-tab-jump="ai"><span class="tool-emoji ai">AI</span><span>AI Tools</span></a>
              <a href="${prefix}contact.html"><span class="tool-emoji lock">&#9993;</span><span>Contact</span></a>
            </div>
          </div>
        </div>
        <div class="tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">Documents</button>
          <div class="tools-dropdown category-dropdown" style="--ec-category-cols: 3; --ec-category-width: 690px;">
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-solid fa-file-export"></i> PDF Converters</div>
              <a href="${prefix}pdf to word/pdf-to-word.html"><span class="tool-emoji word">W</span><span>PDF to Word</span></a>
              <a href="${prefix}pdf to excel/pdf-to-excel.html"><span class="tool-emoji excel">X</span><span>PDF to Excel</span></a>
              <a href="${prefix}pdf to jpg/pdf-to-jpg.html"><span class="tool-emoji image">&#128444;</span><span>PDF to JPG</span></a>
              <a href="${prefix}excel to pdf/excel-to-pdf.html"><span class="tool-emoji pdf">PDF</span><span>Excel to PDF</span></a>
              <a href="${prefix}docx to pdf/docx-to-pdf.html"><span class="tool-emoji word">D</span><span>DOCX to PDF</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-solid fa-wrench"></i> PDF Tools</div>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=merge"><span class="tool-emoji pdf">&#128279;</span><span>Merge PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=compress"><span class="tool-emoji pdf">&#128230;</span><span>Compress PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=split"><span class="tool-emoji pdf">&#9986;</span><span>Split PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=rotate"><span class="tool-emoji pdf">&#8635;</span><span>Rotate PDF</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=remove"><span class="tool-emoji lock">&#128465;</span><span>Remove Pages</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=extract"><span class="tool-emoji pdf">&#128229;</span><span>Extract Pages</span></a>
              <a href="${prefix}pdf tools/pdf-tools.html?mode=organize"><span class="tool-emoji pdf">&#128450;</span><span>Organize PDF</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-solid fa-book"></i> Office & Ebooks</div>
              <a href="${prefix}pdf to epub/pdf-to-epub.html"><span class="tool-emoji pdf">&#128218;</span><span>PDF to EPUB</span></a>
              <a href="${prefix}ebook converter/ebook-converter.html"><span class="tool-emoji pdf">&#128214;</span><span>Ebook Converter</span></a>
              <a class="tool-disabled" href="${prefix}index.html#ai-preview" data-tab-jump="ai"><span class="tool-emoji ai">OCR</span><span>Smart OCR</span></a>
            </div>
          </div>
        </div>
        <div class="tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">Media</button>
          <div class="tools-dropdown category-dropdown" style="--ec-category-cols: 2; --ec-category-width: 470px;">
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-regular fa-image"></i> Image Tools</div>
              <a href="${prefix}image converter/image-converter.html"><span class="tool-emoji image">&#128247;</span><span>Image Converter</span></a>
              <a href="${prefix}image to pdf/image-to-pdf.html"><span class="tool-emoji pdf">PDF</span><span>Image to PDF</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=webp-png"><span class="tool-emoji image">PNG</span><span>WEBP to PNG</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=webp-jpg"><span class="tool-emoji image">JPG</span><span>WEBP to JPG</span></a>
              <a href="${prefix}image converter/image-converter.html?mode=heic-jpg"><span class="tool-emoji image">HEIC</span><span>HEIC to JPG</span></a>
              <a class="tool-disabled" href="${prefix}index.html#tool-browser"><span class="tool-emoji image">&#128247;</span><span>Image Compressor</span></a>
              <a class="tool-disabled" href="${prefix}index.html#tool-browser"><span class="tool-emoji image">&#8596;</span><span>Image Resizer</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-regular fa-circle-play"></i> Video & Audio</div>
              <a href="${prefix}media converter/media-converter.html"><span class="tool-emoji video">&#9654;</span><span>Video Converter</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=audio"><span class="tool-emoji audio">&#127911;</span><span>Audio Converter</span></a>
              <a href="${prefix}media converter/media-converter.html?mode=mp4-mp3"><span class="tool-emoji audio">&#9835;</span><span>MP4 to MP3</span></a>
              <a href="${prefix}gif converter/gif-converter.html"><span class="tool-emoji gif">GIF</span><span>GIF Converter</span></a>
            </div>
          </div>
        </div>
        <div class="tools-menu developer-tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">Developer</button>
          <div class="tools-dropdown category-dropdown" style="--ec-category-cols: 2; --ec-category-width: 470px;">
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-solid fa-qrcode"></i> QR & Data</div>
            <a href="${prefix}qr code generator/qr-code-generator.html"><span class="tool-emoji dev">QR</span><span>QR Code</span></a>
            <a href="${prefix}json to csv/json-to-csv.html"><span class="tool-emoji dev">{ }</span><span>JSON to CSV</span></a>
            <a href="${prefix}csv converter/csv-converter.html"><span class="tool-emoji excel">CSV</span><span>CSV Converter</span></a>
            </div>
            <div class="tools-group">
              <div class="tools-subgroup-title"><i class="fa-solid fa-code"></i> Developer Utilities</div>
              <a class="tool-disabled" href="${prefix}index.html#tool-browser"><span class="tool-emoji dev">JSON</span><span>JSON Formatter</span></a>
              <a class="tool-disabled" href="${prefix}index.html#tool-browser"><span class="tool-emoji dev">64</span><span>Base64 Encode / Decode</span></a>
              <a class="tool-disabled" href="${prefix}index.html#tool-browser"><span class="tool-emoji dev">URL</span><span>URL Encoder / Decoder</span></a>
            </div>
          </div>
        </div>
        <div class="tools-menu">
          <button class="tools-toggle" type="button" aria-expanded="false">AI Tools</button>
          <div class="tools-dropdown">
            <div class="tools-subgroup-title"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Roadmap</div>
            <a href="${prefix}index.html#ai-preview" data-tab-jump="ai"><span class="tool-emoji ai">AI</span><span>AI Tools Overview</span></a>
            <a class="tool-disabled" href="${prefix}index.html#ai-preview"><span class="tool-emoji ai">OCR</span><span>Smart OCR</span></a>
            <a class="tool-disabled" href="${prefix}index.html#ai-preview"><span class="tool-emoji ai">&#128196;</span><span>PDF Summary</span></a>
            <a class="tool-disabled" href="${prefix}index.html#ai-preview"><span class="tool-emoji ai">&#127908;</span><span>Audio to Text</span></a>
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

  function closeMobileMenu() {
    document.querySelectorAll('.ec-unified-header.mobile-open').forEach((header) => {
      header.classList.remove('mobile-open');
      const toggle = header.querySelector('.ec-mobile-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  function toggleMobileMenu(button) {
    const header = button.closest('.ec-unified-header');
    if (!header) return;
    const willOpen = !header.classList.contains('mobile-open');
    closeAll();
    header.classList.toggle('mobile-open', willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !willOpen);
      icon.classList.toggle('fa-xmark', willOpen);
    }
  }

  document.addEventListener('click', (event) => {
    const disabledTool = event.target.closest('.tool-disabled');
    if (disabledTool) {
      event.preventDefault();
      return;
    }

    const mobileToggle = event.target.closest('.ec-mobile-toggle');
    if (mobileToggle) {
      event.preventDefault();
      toggleMobileMenu(mobileToggle);
      return;
    }

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
    if (!event.target.closest('.ec-unified-header')) closeMobileMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAll();
      closeMobileMenu();
    }
  });

  injectHeaderStyles();
  if (normalizeHeader()) syncAuthHeaderState();
  bindHomeHeaderTools();
})();
