import { chromium } from 'playwright';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const notFoundRoute = '/this-route-does-not-exist';
const routes = [
  '/', '/play', '/mahjongg-solitaire', '/daily', '/zen-mahjongg', '/time-attack',
  '/mahjong-connect', '/shisen-sho', '/mahjongg-memory', '/real-mahjong',
  '/variants', '/real-mahjong/hong-kong', '/real-mahjong/riichi', '/real-mahjong/mcr',
  '/real-mahjong/american', '/real-mahjong/taiwanese', '/real-mahjong/sichuan',
  '/real-mahjong/zung-jung', '/learn',
  '/learn/mahjong-vs-mahjongg', '/learn/how-to-play-mahjongg-solitaire',
  '/learn/how-to-play-real-mahjong', '/learn/chi-pung-kong', '/learn/beginner-strategy',
  '/learn/mahjong-variants', '/how-to-play', '/history', '/events', '/lobby',
  '/leaderboards', '/login', '/register', '/profile', '/guest', '/privacy', '/terms',
  notFoundRoute,
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
  const expectedStatus = route === notFoundRoute ? 404 : 200;
  if (response.status !== expectedStatus) failures.push(`HTTP ${route}: expected ${expectedStatus}, received ${response.status}`);
  if ((response.headers.get('x-content-type-options') ?? '').toLowerCase() !== 'nosniff') {
    failures.push(`HTTP ${route}: missing security headers`);
  }
}

for (const framePath of [
  '/native-frame',
  '/ad-frame?placement=320x50',
]) {
  const response = await fetch(`${base}${framePath}`);
  if (response.status !== 200) failures.push(`Advertising frame ${framePath}: ${response.status}`);
  if (!(response.headers.get('content-type') ?? '').includes('text/html')) {
    failures.push(`Advertising frame ${framePath}: incorrect content type`);
  }
  if ((response.headers.get('x-robots-tag') ?? '').toLowerCase() !== 'noindex, nofollow') {
    failures.push(`Advertising frame ${framePath}: missing noindex header`);
  }
}

const invalidFrame = await fetch(`${base}/ad-frame?key=cdc33de3506804ba73d2d3661ed4fd0a&w=320&h=50`);
if (invalidFrame.status !== 400) failures.push(`Unapproved advertising frame parameters returned ${invalidFrame.status}`);
if ((invalidFrame.headers.get('x-robots-tag') ?? '').toLowerCase() !== 'noindex, nofollow') {
  failures.push('Invalid advertising frame is missing noindex header');
}

for (const retiredPath of ['/ad.html', '/ad-frame.htm', '/native.html', '/native-frame.htm']) {
  const response = await fetch(`${base}${retiredPath}`);
  if (response.status !== 410) failures.push(`Retired advertising endpoint ${retiredPath}: ${response.status}`);
}

const initialHtmlResponse = await fetch(`${base}/mahjongg-solitaire`);
const initialHtml = await initialHtmlResponse.text();
if (!initialHtml.includes('Play Mahjongg Solitaire Free Online')) failures.push('Initial HTML missing route title.');
if (!initialHtml.includes('guaranteed-solvable layered Mahjongg Solitaire board')) failures.push('Initial HTML missing route description.');
if (!initialHtml.includes('server-seo-fallback')) failures.push('Initial HTML missing crawlable fallback content.');
if (!initialHtml.includes('application/ld+json')) failures.push('Initial HTML missing structured data.');
if (!initialHtml.includes('WebApplication') || !initialHtml.includes('GameApplication')) {
  failures.push('Initial game HTML is missing eligible web-game structured data.');
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

  for (const route of routes) {
    errors.length = 0;
    const navigation = await page.goto(`${base}${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    const expectedStatus = route === notFoundRoute ? 404 : 200;
    if (navigation?.status() !== expectedStatus) {
      failures.push(`${viewport.name} ${route}: navigation returned ${navigation?.status()} instead of ${expectedStatus}`);
    }

    await page.locator('h1').first().waitFor({ state: 'attached', timeout: 7000 }).catch(() => {});
    checked += 1;
    const rootText = await page.locator('#root').innerText().catch(() => '');
    if (!rootText.trim()) failures.push(`${viewport.name} ${route}: empty root`);
    if (/under construction/i.test(rootText)) failures.push(`${viewport.name} ${route}: placeholder content`);
    const h1Count = await page.locator('h1').count();
    if (h1Count === 0 && route !== '/guest') failures.push(`${viewport.name} ${route}: missing H1`);
    const mainCount = await page.locator('main').count();
    if (mainCount !== 1) failures.push(`${viewport.name} ${route}: expected one main landmark, found ${mainCount}`);
    const canonicalCount = await page.locator('link[rel="canonical"]').count();
    if (canonicalCount !== 1) failures.push(`${viewport.name} ${route}: expected one canonical link, found ${canonicalCount}`);
    if (['/login', '/register', '/profile'].includes(route)) {
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      if (robots !== 'noindex,follow') failures.push(`${viewport.name} ${route}: private route is indexable`);
    }
    if (route === notFoundRoute) {
      await page.getByRole('heading', { name: /404/ }).waitFor({ state: 'visible', timeout: 7000 }).catch(() => {});
      const notFoundText = await page.locator('#root').innerText().catch(() => '');
      if (!/404/i.test(notFoundText)) failures.push(`${viewport.name} ${route}: missing not-found state`);
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      if (robots !== 'noindex,follow') failures.push(`${viewport.name} ${route}: 404 is indexable`);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 4) failures.push(`${viewport.name} ${route}: horizontal overflow ${overflow}px`);

    const unexpectedErrors = route === notFoundRoute
      ? errors.filter((message) => !/Failed to load resource:.*status of 404/i.test(message))
      : errors;
    if (unexpectedErrors.length) failures.push(`${viewport.name} ${route}: ${unexpectedErrors.join(' | ')}`);
  }
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ checked, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ checked, routes: routes.length, viewports: viewports.map((item) => item.name), initialHtml: true, advertisingFrames: true, retiredAdvertisingEndpoints: true, structuredData: true, landmarks: true, securityHeaders: true, failures: 0 }));
