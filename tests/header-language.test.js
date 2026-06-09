const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scriptPath = path.join(root, 'header-language.js');

assert(fs.existsSync(scriptPath), 'Common header language script should exist.');

const script = fs.readFileSync(scriptPath, 'utf8');
const htmlFiles = [];

function collectHtml(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full);
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  });
}

collectHtml(root);

const pagesWithToolsMenu = htmlFiles.filter((file) => {
  const html = fs.readFileSync(file, 'utf8');
  return html.includes('tools-menu.js');
});

const missingHeaderLanguage = pagesWithToolsMenu.filter((file) => {
  const html = fs.readFileSync(file, 'utf8');
  return !html.includes('header-language.js?v=headerlang-20260608a');
});

assert.strictEqual(
  missingHeaderLanguage.length,
  0,
  `Every page using the unified tools menu should also load common header language script: ${missingHeaderLanguage
    .map((file) => path.relative(root, file))
    .join(', ')}`,
);

assert(
  script.includes("'All Tools':") &&
    script.includes("Documents:") &&
    script.includes("Media:") &&
    script.includes("Developer:") &&
    script.includes("'AI Tools':") &&
    script.includes("Pricing:") &&
    script.includes('MutationObserver') &&
    script.includes('.ec-unified-header') &&
    script.includes('everything-language-change'),
  'Common header language script should translate unified nav labels and re-apply after menu/auth mutations.',
);

const developerScript = fs.readFileSync(path.join(root, 'developer-language.js'), 'utf8');
assert(
  developerScript.includes('script,style,textarea,select,.ec-unified-header,[data-no-i18n]'),
  'Developer-specific language patch should skip the unified header so common header translations stay consistent.',
);

const commonLanguageScript = fs.readFileSync(path.join(root, 'language-menu.js'), 'utf8');
assert(
  commonLanguageScript.includes("parent.closest('.ec-unified-header')"),
  'Main language script should skip the unified header so header-language.js remains the single owner of nav translations.',
);

console.log('header language tests passed');
