import { chromium } from 'playwright';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const captures = [
  { route: '/events', name: 'events-desktop', width: 1440, height: 900, fullPage: true },
  { route: '/events', name: 'events-mobile', width: 390, height: 844, fullPage: true },
  { route: '/real-mahjong/american', name: 'american-mobile', width: 390, height: 844, fullPage: false },
];

for (const capture of captures) {
  const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height } });
  await page.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
  await page.goto(`${base}${capture.route}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `output/${capture.name}.png`, fullPage: capture.fullPage });
  await page.close();
}

await browser.close();
