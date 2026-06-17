const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (error) {
  console.log('Playwright is not available; skipping home showcase mobile test.');
  process.exit(0);
}

const root = path.join(__dirname, '..');
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    const decoded = decodeURIComponent(url.pathname);
    const safePath = path.normalize(decoded === '/' ? '/index.html' : decoded).replace(/^([/\\])+/, '');
    const target = path.join(root, safePath);

    if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(target).toLowerCase()] || 'application/octet-stream',
    });
    response.end(fs.readFileSync(target));
  });
}

(async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
  });

  try {
    async function checkViewport(width, height, isMobile = true) {
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: isMobile ? 2 : 1,
        isMobile,
      });
      await page.goto(`http://127.0.0.1:${port}/index.html?lang=ko`, { waitUntil: 'networkidle' });

      const state = await page.evaluate(() => {
        const hero = document.querySelector('.home-hero');
        const copy = document.querySelector('.home-hero-copy');
        const showcase = document.querySelector('.home-showcase');
        const slides = [...document.querySelectorAll('[data-showcase-slide]')];
        const visibleSlides = slides.filter((slide) => {
          const style = getComputedStyle(slide);
          const rect = slide.getBoundingClientRect();
          return style.opacity !== '0' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        });
        const heroRect = hero.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();
        const showcaseRect = showcase.getBoundingClientRect();

        return {
          heroColumns: getComputedStyle(hero).gridTemplateColumns.split(' ').length,
          slidePositions: slides.map((slide) => getComputedStyle(slide).position),
          visibleSlideCount: visibleSlides.length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          showcaseLeft: showcaseRect.left,
          showcaseRight: showcaseRect.right,
          showcaseTop: showcaseRect.top,
          copyBottom: copyRect.bottom,
          heroBottom: heroRect.bottom,
          viewport: window.innerWidth,
        };
      });

      await page.close();
      return state;
    }

    for (const width of [390, 820]) {
      const state = await checkViewport(width, width === 390 ? 1000 : 1180, width === 390);

      assert.strictEqual(state.heroColumns, 1, `${width}px home hero should render as a single column.`);
      assert.ok(
        state.slidePositions.every((position) => position === 'absolute'),
        `${width}px showcase slides should stay stacked in the slide frame.`,
      );
      assert.strictEqual(state.visibleSlideCount, 1, `${width}px should show only the active showcase slide.`);
      assert.ok(state.overflow <= 2, `${width}px home page should not overflow horizontally.`);
      assert.ok(state.showcaseLeft >= -1 && state.showcaseRight <= state.viewport + 1, `${width}px showcase should fit the viewport.`);
      assert.ok(state.showcaseTop >= state.copyBottom - 1, `${width}px showcase should sit below the hero copy instead of overlapping it.`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('home showcase mobile tests passed');
})();
