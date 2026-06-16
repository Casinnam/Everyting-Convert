const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const menu = fs.readFileSync(path.join(root, 'tools-menu.js'), 'utf8');
const mediaPage = fs.readFileSync(path.join(root, 'media converter', 'media-converter.html'), 'utf8');
const pdfWordPage = fs.readFileSync(path.join(root, 'pdf to word', 'pdf-to-word.html'), 'utf8');
const qrCss = fs.readFileSync(path.join(root, 'qr code generator', 'qr-code-generator.css'), 'utf8');

assert(
    menu.includes('.ec-unified-header .tools-menu') &&
    menu.includes('.ec-unified-header .ec-header-inner') &&
    menu.includes('width: min(100%, 1220px) !important') &&
    menu.includes('padding: .85rem clamp(1.5rem, 3.5vw, 2.5rem) !important') &&
    menu.includes('position: relative !important') &&
    menu.includes('.ec-unified-header .tools-group') &&
    menu.includes('display: grid !important') &&
    menu.includes('flex-direction: column !important') &&
    menu.includes('min-width: 230px !important') &&
    menu.includes('width: min(1320px, calc(100vw - 2rem)) !important') &&
    menu.includes('grid-template-columns: repeat(6, minmax(150px, 1fr)) !important') &&
    menu.includes('grid-template-columns: repeat(var(--ec-category-cols, 2), minmax(210px, 1fr)) !important') &&
    menu.includes('transform: translateX(-50%) !important') &&
    menu.includes('white-space: nowrap !important') &&
    menu.includes('.ec-mobile-toggle') &&
    menu.includes('.ec-unified-header.mobile-open .top-nav') &&
    menu.includes('.ec-unified-header.mobile-open .top-actions') &&
    menu.includes('grid-template-columns: 1fr !important') &&
    menu.includes('position: static !important') &&
    menu.includes('.ec-unified-header .tool-emoji') &&
    menu.includes('&#128444;') &&
    menu.includes('AI Tools'),
  'Unified tools menu should define centered header spacing, stable dropdown positioning, a wide grouped mega layout, mobile hamburger behavior, colored icon badges, and readable link labels.',
);

assert(
  !menu.includes('ec-tool-search') &&
    !menu.includes('Search tools...') &&
    !menu.includes('type="search"'),
  'Unified header should not render a search box on any page.',
);

assert(
  menu.includes('<button class="tools-toggle" type="button" aria-expanded="false">Documents</button>') &&
    menu.includes('PDF Converters') &&
    menu.includes('PDF to EPUB</span>') &&
    menu.includes('<button class="tools-toggle" type="button" aria-expanded="false">Media</button>') &&
    menu.includes('Image Tools') &&
    menu.includes('Image Compressor</span>') &&
    menu.includes('Social Media Resizer</span>') &&
    menu.includes('Favicon Generator</span>') &&
    menu.includes('Audio Converter</span>') &&
    menu.includes('<button class="tools-toggle" type="button" aria-expanded="false">Developer</button>') &&
    menu.includes('QR Code</span>') &&
    menu.includes('<button class="tools-toggle" type="button" aria-expanded="false">AI Tools</button>') &&
    menu.includes('Smart OCR</span>') &&
    !menu.includes('<button class="tools-toggle" type="button" aria-expanded="false">Advanced</button>'),
  'Documents, Media, Developer, and AI Tools dropdowns should use clear grouped labels and colored icon badge link patterns.',
);

assert(
  !menu.includes('display: grid !important;\n      }\n        right: auto !important;'),
  'Unified tools menu CSS should not contain orphaned dropdown declarations.',
);

assert(
  !menu.includes('Image Resizer</span></a>\n            </div>\n            </div>') &&
    menu.includes('Favicon Generator</span></a>\n            </div>\n            <div class="tools-group">'),
  'Media dropdown should keep the expanded image tool list and video group as sibling columns, not nested or prematurely closed.',
);

assert(
  mediaPage.includes('tools-menu.js?v=nav-20260614d') &&
    pdfWordPage.includes('tools-menu.js?v=nav-20260614d'),
  'Tool pages should use the latest tools menu cache-busting version.',
);

console.log('tools menu layout tests passed');

assert(
  qrCss.includes('.qr-feature-strip span,') &&
    qrCss.includes('.qr-everyone span,') &&
    qrCss.includes('grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))') &&
    qrCss.includes('grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))') &&
    qrCss.includes('word-break: keep-all'),
  'QR feature strip descriptions should use roomy card columns instead of wrapping under narrow icon columns.',
);
