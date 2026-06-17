const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const languageMenu = fs.readFileSync(path.join(root, 'language-menu.js'), 'utf8');

assert(
  index.includes('class="home-showcase"') &&
    index.includes('id="homeShowcase"') &&
    index.includes('data-showcase-slide'),
  'Home hero should use a clickable showcase slider instead of an upload dropzone.',
);

assert(
  !index.includes('id="homeDropzone"') &&
    !index.includes('id="homeFileInput"') &&
    !index.includes('Drag & drop your file here'),
  'Home hero should not imply that uploaded files continue into the next page.',
);

[
  'Explore PDF tools',
  'Explore Image tools',
  'Explore Video tools',
  'Explore Audio tools',
  'Explore AI tools',
].forEach((label) => {
  assert(index.includes(label), `Home showcase should include ${label}.`);
});

assert(
  index.includes('setInterval') &&
    index.includes('mouseenter') &&
    index.includes('mouseleave') &&
    index.includes('focusin') &&
    index.includes('focusout'),
  'Home showcase should autoplay and pause on hover or keyboard focus.',
);

assert(
  languageMenu.includes('showcasePdfTitle') &&
    languageMenu.includes('showcaseImageTitle') &&
    languageMenu.includes('showcaseVideoTitle') &&
    languageMenu.includes('showcaseAudioTitle') &&
    languageMenu.includes('showcaseAiTitle') &&
    languageMenu.includes('showcaseSlides.forEach'),
  'Home showcase copy should be connected to the shared language menu.',
);

assert(
  styles.includes('.home-showcase') &&
    styles.includes('.home-showcase-frame') &&
    styles.includes('.home-showcase-slide') &&
    styles.includes('.home-showcase-dot') &&
    styles.includes('font-size: clamp(2.35rem, 4.1vw, 4.05rem)'),
  'Home hero styles should define the showcase slider and smaller hero title.',
);

assert(
  index.includes('styles.css?v=ui-20260616c') &&
    index.includes('home-showcase-copy') &&
    index.includes('home-showcase-visual') &&
    index.includes('home-showcase-action') &&
    languageMenu.includes('.home-showcase-copy h2') &&
    languageMenu.includes('.home-showcase-action'),
  'Home showcase should use home-specific class names and a fresh CSS cache key.',
);

console.log('home showcase slider tests passed');
