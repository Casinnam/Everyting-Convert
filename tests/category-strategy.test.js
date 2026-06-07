const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const menu = fs.readFileSync(path.join(root, 'tools-menu.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert(menu.includes('>Documents</button>'), 'Header should keep Documents as the document/PDF category.');
assert(menu.includes('>Media</button>'), 'Header should keep Media as the image/video/audio category.');
assert(menu.includes('>Developer</button>'), 'Header should expose Developer as its own top-level category.');
assert(menu.includes('>AI Tools</button>'), 'Header should expose AI Tools as its own top-level category.');
assert(!menu.includes('>Advanced</button>'), 'Advanced should be removed because it is vague for users.');

assert(menu.includes('PDF Converters') && menu.includes('PDF Tools') && menu.includes('Office & Ebooks'), 'Documents dropdown should be split into clear subgroups.');
assert(menu.includes('Image Tools') && menu.includes('Video & Audio'), 'Media dropdown should be split into image and media subgroups.');
assert(menu.includes('QR & Data') && menu.includes('Developer Utilities'), 'Developer dropdown should organize current and future developer tools.');
assert(menu.includes('AI Roadmap') && menu.includes('Smart OCR'), 'AI Tools dropdown should show the future AI/OCR direction without pretending it is fully launched.');

assert(index.includes('data-tool-tab="documents"') && index.includes('data-tool-tab="media"'), 'Homepage tool browser should use broad Documents and Media tabs.');
assert(!index.includes('data-tool-tab="office"') && !index.includes('data-tool-tab="video"'), 'Homepage tabs should avoid over-fragmented Office/Video categories.');
assert(index.includes('data-categories="popular documents') && index.includes('data-categories="popular media'), 'Tool cards should be assigned to the broad categories.');

console.log('category strategy tests passed');
