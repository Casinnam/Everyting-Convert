const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const menu = fs.readFileSync(path.join(root, 'tools-menu.js'), 'utf8');
const mediaPage = fs.readFileSync(path.join(root, 'media converter', 'media-converter.html'), 'utf8');
const pdfWordPage = fs.readFileSync(path.join(root, 'pdf to word', 'pdf-to-word.html'), 'utf8');

assert(
  menu.includes('.ec-unified-header .tools-menu') &&
    menu.includes('position: relative !important') &&
    menu.includes('.ec-unified-header .tools-group') &&
    menu.includes('display: grid !important') &&
    menu.includes('transform: translateX(-50%) !important') &&
    menu.includes('white-space: nowrap !important'),
  'Unified tools menu should define stable dropdown positioning, grouped layout, centered mega menu placement, and readable link labels.',
);

assert(
  !menu.includes('display: grid !important;\n      }\n        right: auto !important;'),
  'Unified tools menu CSS should not contain orphaned dropdown declarations.',
);

assert(
  mediaPage.includes('tools-menu.js?v=nav-20260601a') &&
    pdfWordPage.includes('tools-menu.js?v=nav-20260601a'),
  'Tool pages should use the latest tools menu cache-busting version.',
);

console.log('tools menu layout tests passed');
