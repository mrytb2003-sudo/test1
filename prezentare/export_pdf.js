// Generează PDF-ul de rezervă: toate slide-urile în starea finală, 1920x1080 pe pagină.
// Rulare: node export_pdf.js   (necesită Playwright cu Chromium)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const html = 'file://' + path.join(__dirname, 'index.html') + '?print';
  const out = path.join(__dirname, 'Personalitatea_brandurilor_Juganaru.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(html);
  await page.waitForFunction(() => window.__ready === true);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  console.log('PDF:', out);
})();
