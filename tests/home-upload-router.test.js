const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(
  index.includes('id="homeOpenConverter"') && index.includes('Open selected converter'),
  'Home upload console should include a clear continue button.',
);

assert(
  index.includes('styles.css?v=ui-20260603a'),
  'Home page should bust the cached stylesheet after upload console styling changes.',
);

assert(
  index.includes('id="homeConvertSource"') && index.includes('id="homeConvertTarget"'),
  'Home upload console should expose source and target converter controls.',
);

assert(
  index.includes('function openSelectedConverter()') &&
    index.includes('fromHome=1') &&
    index.includes('Please choose or drop a file first'),
  'Home upload console should route selected files to the chosen converter and guard empty selection.',
);

assert(
  index.includes('PDF to Word') &&
    index.includes('Image to PDF') &&
    index.includes('Excel to PDF') &&
    index.includes('JSON to CSV'),
  'Home upload router should include common converter destinations.',
);

assert(
  styles.includes('.home-convert-button') && styles.includes('.home-route-note'),
  'Home upload router should have styled action and status text.',
);

console.log('home upload router tests passed');
