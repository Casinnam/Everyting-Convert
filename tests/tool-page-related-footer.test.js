const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'tool-page-redesign.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'tool-page-redesign.css'), 'utf8');

assert(
  script.includes('function compactToolPageFooter(meta, language = currentLanguage())') &&
    script.includes('footerGrid.dataset.ecRelatedFooter = \'true\'') &&
    script.includes('popularFooterTools.map((name) => footerToolLink(name, language)).join(\'\')'),
  'Tool pages should compact the large all-tools footer into a curated popular-tools footer.',
);

assert(
  script.includes('const popularFooterTools = [') &&
    script.includes("'PDF to Word'") &&
    script.includes("'PDF to JPG'") &&
    script.includes("'QR Code Generator'") &&
    script.includes("'Image Converter'") &&
    script.includes("'PDF Summary'") &&
    !script.includes('footerRelatedTitle'),
  'Popular footer should replace the related-tools column with the requested five curated links.',
);

for (const [language, text] of [
  ['en', 'Popular tools'],
  ['ko', '인기 도구'],
  ['de', 'Beliebte Tools'],
  ['es', 'Herramientas populares'],
  ['fr', 'Outils populaires'],
]) {
  assert(
    script.includes(`${language}:`) && script.includes(`footerPopularTitle: '${text}'`),
    `Popular footer title should be translated for ${language}.`,
  );
}

assert(
  script.includes('compactToolPageFooter(meta, language);') &&
    script.includes('compactToolPageFooter(meta, event.detail.language);'),
  'Popular footer should render on first load and update after language changes.',
);

assert(
  script.includes('const localizedToolNames = {') &&
    script.includes('function displayToolName(name, language = currentLanguage())') &&
    script.includes('${displayToolName(name, language)}'),
  'Popular tool link names should be localized instead of always rendering English labels.',
);

assert(
  script.includes("footerGrid.classList.add('ec-related-footer-grid')") &&
    css.includes('.site-footer .footer-grid.ec-related-footer-grid') &&
    css.includes('grid-template-columns: minmax(230px, .9fr) minmax(260px, 1.05fr) minmax(260px, 1fr)'),
  'Popular footer should keep the current polished three-column layout.',
);

assert(
  script.includes('footerHubTitle') &&
    script.includes('footerHubText') &&
    !script.includes('<h2><img class="brand-icon" src="${prefix}favicon.svg"') &&
    css.includes('.ec-related-footer-grid .footer-note') &&
    css.includes('.ec-related-footer-grid a::after'),
  'Popular footer should keep the current tool-navigation panel design.',
);

console.log('tool page popular footer tests passed');
