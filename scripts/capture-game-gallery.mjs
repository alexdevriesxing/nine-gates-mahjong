import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const routes = [
  ['solitaire', '/mahjongg-solitaire'],
  ['daily', '/daily'],
  ['zen', '/zen-mahjongg'],
  ['time-attack', '/time-attack'],
  ['connect', '/mahjong-connect'],
  ['shisen-sho', '/shisen-sho'],
  ['memory', '/mahjongg-memory'],
  ['real-mahjong', '/real-mahjong'],
  ['hong-kong', '/real-mahjong/hong-kong'],
  ['riichi', '/real-mahjong/riichi'],
  ['mcr', '/real-mahjong/mcr'],
  ['american', '/real-mahjong/american'],
  ['taiwanese', '/real-mahjong/taiwanese'],
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900, columns: 3 },
  { name: 'mobile', width: 390, height: 844, columns: 2 },
];

fs.mkdirSync('output/final-gallery', { recursive: true });

for (const viewport of viewports) {
  const captures = [];
  for (const [name, route] of routes) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.name === 'mobile',
    });
    await context.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
    const page = await context.newPage();
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(350);
    const hint = page.getByRole('button', { name: /Hint/ });
    if (route !== '/real-mahjong' && route !== '/real-mahjong/american' && await hint.count()) {
      await hint.click();
      await page.waitForTimeout(120);
    } else if (route === '/real-mahjong') {
      await page.locator('.player-rack .mahjong-tile:not(:disabled)').first().click();
    }
    const shell = page.locator('[data-game-shell]').first();
    await shell.waitFor();
    const buffer = await shell.screenshot({ type: 'png' });
    fs.writeFileSync(`output/final-gallery/${viewport.name}-${name}.png`, buffer);
    captures.push({ name, data: buffer.toString('base64') });
    await context.close();
  }

  const contact = await browser.newPage({ viewport: { width: viewport.name === 'desktop' ? 1280 : 900, height: 900 } });
  await contact.setContent(`
    <style>
      body { margin: 0; padding: 18px; color: #f5ead0; background: #080810; font-family: Arial, sans-serif; }
      h1 { margin: 0 0 16px; font-size: 24px; }
      main { display: grid; grid-template-columns: repeat(${viewport.columns}, minmax(0, 1fr)); gap: 14px; align-items: start; }
      article { padding: 8px; border: 1px solid #6e5b2b; border-radius: 10px; background: #11121c; }
      h2 { margin: 0 0 7px; color: #e0cc8a; font-size: 14px; text-transform: uppercase; }
      img { display: block; width: 100%; height: 280px; object-fit: contain; object-position: top; background: #05060a; }
    </style>
    <h1>Nine Gates Mahjong — ${viewport.name} game gallery</h1>
    <main>${captures.map((capture) => `<article><h2>${capture.name}</h2><img src="data:image/png;base64,${capture.data}"></article>`).join('')}</main>
  `);
  await contact.screenshot({ path: `output/final-gallery/contact-${viewport.name}.png`, fullPage: true });
  await contact.close();
}

await browser.close();
console.log(JSON.stringify({ games: routes.length, viewports: viewports.map((viewport) => viewport.name), captures: routes.length * viewports.length }));
