import { chromium } from 'playwright';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const routes = [
  '/', '/play', '/mahjongg-solitaire', '/daily', '/zen-mahjongg', '/time-attack',
  '/mahjong-connect', '/shisen-sho', '/mahjongg-memory', '/real-mahjong',
  '/variants', '/real-mahjong/hong-kong', '/real-mahjong/riichi', '/real-mahjong/mcr',
  '/real-mahjong/american', '/real-mahjong/taiwanese', '/learn',
  '/learn/mahjong-vs-mahjongg', '/learn/how-to-play-mahjongg-solitaire',
  '/learn/how-to-play-real-mahjong', '/learn/chi-pung-kong', '/learn/beginner-strategy',
  '/learn/mahjong-variants', '/how-to-play', '/history', '/events', '/lobby',
  '/leaderboards', '/login', '/register', '/privacy', '/terms',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];
let checked = 0;

for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  if (!response.ok) failures.push(`HTTP ${route}: ${response.status}`);
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
  const page = await context.newPage();
  await page.route('**/api/profile', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ user: null }),
  }));
  await page.route('**/api/leaderboards', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ entries: [] }),
  }));
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 20000 });

  for (const route of routes) {
    errors.length = 0;
    await page.evaluate((nextRoute) => {
      history.pushState(null, '', nextRoute);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, route);
    await page.waitForTimeout(120);
    await page.locator('h1').first().waitFor({ state: 'attached', timeout: 7000 }).catch(() => {});
    checked += 1;
    const rootText = await page.locator('#root').innerText().catch(() => '');
    if (!rootText.trim()) failures.push(`${viewport.name} ${route}: empty root`);
    if (/under construction/i.test(rootText)) failures.push(`${viewport.name} ${route}: placeholder content`);
    const h1Count = await page.locator('h1').count();
    if (h1Count === 0 && route !== '/guest') failures.push(`${viewport.name} ${route}: missing H1`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 4) failures.push(`${viewport.name} ${route}: horizontal overflow ${overflow}px`);
    if (errors.length) failures.push(`${viewport.name} ${route}: ${errors.join(' | ')}`);
  }
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ checked, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ checked, routes: routes.length, viewports: viewports.map((item) => item.name), failures: 0 }));
