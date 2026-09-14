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
console.log('Chromium:', EXE);
const URL = process.argv[2] || 'http://localhost:8080/';
const VIEWPORTS = [
  { width: 320, height: 700 },
  { width: 375, height: 812 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 1024, height: 800 },
  { width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  let failures = 0;
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: vp });
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(URL, { waitUntil: 'networkidle' });

    const result = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const offenders = [];
      const isClipped = (el) => {
        let p = el.parentElement;
        while (p) {
          const o = getComputedStyle(p).overflowX;
          if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true;
          p = p.parentElement;
        }
        return false;
      };
      const els = document.querySelectorAll('body *');
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const pos = getComputedStyle(el).position;
        if (pos === 'fixed') continue;
        if (pos === 'absolute' && r.left < 0 && r.right < 0) continue;
        if ((r.right > docW + 1 || r.left < -1) && !isClipped(el)) {
          offenders.push(`${el.tagName.toLowerCase()}.${(el.className + '').trim().split(/\s+/).slice(0,2).join('.')} right=${Math.round(r.right)} left=${Math.round(r.left)} (docW=${docW})`);
        }
      }
      return { docW, scrollW: document.documentElement.scrollWidth, offenders: [...new Set(offenders)].slice(0, 8) };
    });

    const hasOverflow = result.scrollW > result.docW + 1 || result.offenders.length > 0;
    if (hasOverflow) failures++;
    console.log(`\n== ${vp.width}x${vp.height} — docW=${result.docW} scrollW=${result.scrollW} ${hasOverflow ? 'OVERFLOW!' : 'OK'}`);
    result.offenders.forEach(o => console.log('   -', o));
    if (errors.length) { console.log('   console errors:', errors.slice(0, 3)); failures++; }
    await page.close();
  }
  await browser.close();
  console.log(failures ? `\n${failures} viewport(s) con problemas` : '\nTodos los viewports OK (sin overflow)');
  process.exit(failures ? 1 : 0);
})();
