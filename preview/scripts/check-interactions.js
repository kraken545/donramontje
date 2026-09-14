const { chromium } = require('playwright-core');
const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const candidates = [
    path.join(os.homedir(), '.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell'),
    path.join(os.homedir(), '.cache/ms-playwright/chromium-1228/chrome-linux64/chrome'),
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  ];
  for (const c of candidates) {
    try { execSync(`test -f "${c}"`); return c; } catch (e) {}
  }
  return null;
}
const EXE = findChrome();
if (!EXE) { console.error('Chromium no encontrado. Define CHROME_BIN o instala playwright browsers.'); process.exit(2); }

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });

  // 1. Burger opens mobile nav
  await page.click('#navBurger');
  const navOpen = await page.evaluate(() => document.getElementById('mainNav').classList.contains('open'));
  console.log('burger abre nav móvil:', navOpen ? 'OK' : 'FALLA');
  await page.click('#navBurger'); // cerrar

  // 2. Sticky CTA visible on mobile after scroll
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(300);
  const sticky = await page.evaluate(() => {
    const el = document.getElementById('stickyCta');
    const r = el.getBoundingClientRect();
    return getComputedStyle(el).display !== 'none' && r.top < window.innerHeight;
  });
  console.log('sticky CTA visible en móvil:', sticky ? 'OK' : 'FALLA');

  // 3. Language toggle -> ES
  await page.click('#langToggle');
  const langEs = await page.evaluate(() => document.body.dataset.lang);
  const titleEs = await page.evaluate(() => document.querySelector('.section-title').textContent.trim());
  console.log('toggle idioma:', langEs === 'es' ? 'OK' : 'FALLA', '| título:', titleEs);

  // 4. Currency toggle -> XCG
  await page.click('.currency-btn[data-cur="xcg"]');
  const price = await page.evaluate(() => document.querySelector('.menu-item-price').textContent.trim());
  console.log('toggle moneda XCG:', price.includes('XCG') ? 'OK' : 'FALLA', '| precio:', price);

  // 5. Menu tab KAPSALON (centrar elemento para evitar sticky bar)
  await page.evaluate(() => {
    const t = document.querySelector('.menu-tab[data-cat="1"]');
    window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY - 300);
  });
  await page.waitForTimeout(300);
  await page.click('.menu-tab[data-cat="1"]');
  const panelActive = await page.evaluate(() => {
    const p = document.querySelectorAll('.menu-panel')[1];
    return p.classList.contains('active');
  });
  console.log('tab KAPSALON:', panelActive ? 'OK' : 'FALLA');

  // 6. Lightbox opens
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  await page.click('.gallery-item');
  const lb = await page.evaluate(() => !document.getElementById('lightbox').hidden);
  console.log('lightbox galería:', lb ? 'OK' : 'FALLA');

  console.log('errores JS:', errors.length ? errors : 'ninguno');
  await browser.close();
})();
