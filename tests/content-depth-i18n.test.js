const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const redesign = fs.readFileSync(path.join(root, 'tool-page-redesign.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'tool-page-redesign.css'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');

assert(
  redesign.includes('ec-seo-guide') && redesign.includes('ec-faq-list'),
  'Tool pages should render richer guide and FAQ content blocks.',
);

for (const phrase of ['자주 묻는 질문', 'Häufige Fragen', 'Preguntas frecuentes', 'Questions fréquentes']) {
  assert(redesign.includes(phrase), `Tool guide content should include localized phrase: ${phrase}`);
}

assert(
  redesign.includes('window.addEventListener(\'everything-language-change\'') && redesign.includes('renderLocalizedSections'),
  'Generated explanatory tool content should rerender when the selected language changes.',
);

assert(
  css.includes('.ec-seo-guide') && css.includes('.ec-faq-list'),
  'Tool guide and FAQ blocks should have shared visual styling.',
);

assert(
  index.includes('home-guides') && index.includes('File Conversion Guides'),
  'Homepage should expose guide-like content for users and AdSense review.',
);

assert(
  sitemap.includes('/guides/file-conversion-guide.html') && sitemap.includes('/guides/pdf-tools-guide.html'),
  'Sitemap should include new public guide pages.',
);

console.log('content depth and i18n tests passed');
