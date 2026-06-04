const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (error) {
  console.log('Playwright is not available; skipping mobile nav browser test.');
  process.exit(0);
}

const root = path.join(__dirname, '..');
const pages = [
  '/index.html?lang=en',
  '/media%20converter/media-converter.html?lang=en',
  '/gif%20converter/gif-converter.html?lang=en',
];

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
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
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

    for (const pagePath of pages) {
      await page.goto(`http://127.0.0.1:${port}${pagePath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.ec-unified-header');

      const closed = await page.evaluate(() => {
        const toggle = document.querySelector('.ec-mobile-toggle');
        const nav = document.querySelector('.top-nav');
        const actions = document.querySelector('.top-actions');
        const toggleDisplay = getComputedStyle(toggle).display;
        const navDisplay = getComputedStyle(nav).display;
        const actionsDisplay = getComputedStyle(actions).display;
        return {
          toggleDisplay,
          navDisplay,
          actionsDisplay,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
        };
      });

      assert.notStrictEqual(closed.toggleDisplay, 'none', `${pagePath} should show the hamburger button on mobile.`);
      assert.strictEqual(closed.navDisplay, 'none', `${pagePath} should hide desktop navigation before mobile menu opens.`);
      assert.strictEqual(closed.actionsDisplay, 'none', `${pagePath} should hide top actions before mobile menu opens.`);
      assert.ok(closed.overflow <= 2, `${pagePath} should not overflow horizontally before menu opens.`);

      await page.click('.ec-mobile-toggle');
      const opened = await page.evaluate(() => {
        const header = document.querySelector('.ec-unified-header');
        const nav = document.querySelector('.top-nav');
        const actions = document.querySelector('.top-actions');
        return {
          open: header.classList.contains('mobile-open'),
          navDisplay: getComputedStyle(nav).display,
          actionsDisplay: getComputedStyle(actions).display,
          expanded: document.querySelector('.ec-mobile-toggle').getAttribute('aria-expanded'),
          overflow: document.documentElement.scrollWidth - window.innerWidth,
        };
      });

      assert.strictEqual(opened.open, true, `${pagePath} should open mobile menu.`);
      assert.strictEqual(opened.navDisplay, 'flex', `${pagePath} should show navigation after mobile menu opens.`);
      assert.strictEqual(opened.actionsDisplay, 'flex', `${pagePath} should show top actions after mobile menu opens.`);
      assert.strictEqual(opened.expanded, 'true', `${pagePath} should update hamburger aria-expanded.`);
      assert.ok(opened.overflow <= 2, `${pagePath} should not overflow horizontally after menu opens.`);

      await page.click('.tools-menu:last-of-type .tools-toggle');
      const dropdown = await page.evaluate(() => {
        const menu = [...document.querySelectorAll('.tools-menu')].at(-1);
        const dropdownEl = menu.querySelector('.tools-dropdown');
        const rect = dropdownEl.getBoundingClientRect();
        return {
          display: getComputedStyle(dropdownEl).display,
          position: getComputedStyle(dropdownEl).position,
          width: rect.width,
          viewport: window.innerWidth,
        };
      });

      assert.ok(['flex', 'grid'].includes(dropdown.display), `${pagePath} should show the opened mobile dropdown.`);
      assert.strictEqual(dropdown.position, 'static', `${pagePath} mobile dropdown should stay inside the menu flow.`);
      assert.ok(dropdown.width <= dropdown.viewport, `${pagePath} mobile dropdown should fit the viewport.`);

      await page.click('.ec-mobile-toggle');
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('mobile nav browser tests passed');
})();
