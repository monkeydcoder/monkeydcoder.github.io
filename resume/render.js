// Renders resume/cv.html to resume/cv.pdf (two A4 pages, Carlito from Google Fonts).
// Needs Playwright with Chromium (npm i -g playwright && npx playwright install chromium);
// set PLAYWRIGHT to the module path if it is installed somewhere else. Then run resume/finalize.py.
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const src = path.join(__dirname, 'cv.html');
const out = path.join(__dirname, 'cv.pdf');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + src, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.__ready);
  const layout = await page.evaluate(() => window.__layout);
  console.log('layout', JSON.stringify(layout));
  // cv.html is laid out at 5x (html { zoom: 5 }); scale 0.2 brings it back to A4.
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true, scale: 0.2 });
  await browser.close();
  if (!layout.ok) {
    console.error('Page 2 overflows: shorten the content.');
    process.exit(2);
  }
  console.log('wrote', out);
})();
