import { chromium } from 'playwright';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = {};

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

async function assertNoBrokenImages(page, label) {
  const broken = await page.locator('img').evaluateAll((images) =>
    images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src'))
  );
  if (broken.length) throw new Error(`${label}: broken images ${broken.join(', ')}`);
}

// Consent choice, persistence and ad gating.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = trackErrors(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('complementary', { name: 'Privacy choices' }).waitFor();
  if (await page.locator('script[data-ngm-social-ad]').count()) throw new Error('Social ad loaded before consent.');
  if (await page.locator('link[rel="preconnect"][href*="effectivecpmnetwork.com"], link[rel="preconnect"][href*="demolishwrestconclusions.com"]').count()) {
    throw new Error('Ad network preconnect occurred before consent.');
  }
  await page.getByRole('button', { name: 'Accept ads' }).click();
  if ((await page.evaluate(() => localStorage.getItem('ngm_ad_consent'))) !== 'accepted') {
    throw new Error('Advertising consent was not stored.');
  }
  const adHints = await page.locator('link[data-ngm-ad-hint][rel="preconnect"]').count();
  if (adHints < 2) throw new Error('Consent-aware Adsterra connection hints were not installed.');
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(`${base}/mahjongg-solitaire`, { waitUntil: 'networkidle' });
  if (await page.getByRole('complementary', { name: 'Privacy choices' }).count()) {
    throw new Error('Consent banner returned after a stored choice.');
  }
  if (await page.locator('.ad-slot').count() < 1) throw new Error('Ad slots did not render.');
  if (await page.locator('iframe[src*="placement=160x600"]').count() !== 1) {
    throw new Error('The desktop game layout requested a duplicate or missing 160x600 placement.');
  }
  if (await page.locator('iframe[src*="placement=160x300"]').count() !== 1) {
    throw new Error('The wide desktop secondary rail did not use its distinct 160x300 placement.');
  }
  await page.getByRole('button', { name: /Privacy choices/ }).click();
  await page.getByRole('button', { name: 'Continue without ads' }).click();
  if ((await page.evaluate(() => localStorage.getItem('ngm_ad_consent'))) !== 'declined') {
    throw new Error('Advertising decline was not stored.');
  }
  if (await page.locator('script[data-ngm-social-ad], .ad-slot iframe').count()) {
    throw new Error('Third-party advertising remained active after consent withdrawal.');
  }
  if (errors.length) throw new Error(`Consent/ad flow: ${errors.join(' | ')}`);
  results.consentAndAds = true;
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
const page = await context.newPage();
const errors = trackErrors(page);

// Interface-language persistence without falsely relabelling English documents.
await page.goto(base, { waitUntil: 'networkidle' });
await page.locator('.language-select select').selectOption('ar');
let locale = await page.evaluate(() => ({
  language: localStorage.getItem('ngm_language'),
  uiLanguage: document.documentElement.dataset.uiLanguage,
  lang: document.documentElement.lang,
  dir: document.documentElement.dir,
}));
if (locale.language !== 'ar' || locale.uiLanguage !== 'ar' || locale.lang !== 'en' || locale.dir !== 'ltr') {
  throw new Error('Interface locale did not persist truthfully.');
}
await page.reload({ waitUntil: 'networkidle' });
locale = await page.evaluate(() => ({
  uiLanguage: document.documentElement.dataset.uiLanguage,
  lang: document.documentElement.lang,
  dir: document.documentElement.dir,
}));
if (locale.uiLanguage !== 'ar' || locale.lang !== 'en' || locale.dir !== 'ltr') {
  throw new Error('Saved interface locale did not survive reload.');
}
await page.locator('.language-select select').selectOption('en');
results.localePersistence = true;

// Mobile menu, interface-language selector and navigation.
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('dialog', { name: 'Menu' }).waitFor();
await page.keyboard.press('Escape');
await page.getByRole('dialog', { name: 'Menu' }).waitFor({ state: 'detached' });
await page.getByRole('button', { name: 'Open menu' }).click();
await page.locator('.mobile-language select').selectOption('ja');
if ((await page.evaluate(() => document.documentElement.dataset.uiLanguage)) !== 'ja') throw new Error('Mobile locale selector failed.');
if ((await page.evaluate(() => document.documentElement.lang)) !== 'en') throw new Error('Partial translation incorrectly changed document language.');
await page.getByRole('link', { name: /プレイ/ }).first().click();
await page.waitForURL('**/play');
await page.getByRole('button', { name: 'Close menu' }).waitFor({ state: 'detached' });
results.mobileNavigation = true;

// Play filters must materially change the visible cards.
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${base}/play`, { waitUntil: 'networkidle' });
const allCards = await page.locator('.game-card').count();
await page.getByRole('button', { name: 'Casual' }).click();
const casualCards = await page.locator('.game-card').count();
await page.getByRole('button', { name: 'Real Mahjong' }).click();
const realCards = await page.locator('.game-card').count();
if (!(allCards > casualCards && casualCards > 0 && realCards > 0)) throw new Error('Play filters did not change the game list.');
results.playFilters = { allCards, casualCards, realCards };

// Ranking tabs must change metrics and content.
await page.goto(`${base}/leaderboards`, { waitUntil: 'networkidle' });
const rankingFirstNames = new Set();
for (const category of ['Hall of Fame', 'Real Mahjong', 'Solitaire', 'Daily Puzzle', 'Time Attack']) {
  await page.getByRole('button', { name: category, exact: true }).click();
  const table = page.locator('.ranking-table');
  if ((await table.getAttribute('data-ranking-category')) !== category) throw new Error(`Ranking category ${category} did not activate.`);
  rankingFirstNames.add((await table.locator('.ranking-row').nth(1).innerText()).split('\n')[1]);
}
if (rankingFirstNames.size < 4) throw new Error('Ranking categories still show effectively identical data.');
results.rankingCategories = true;

// Tutorial tabs, step controls and practice route.
await page.goto(`${base}/how-to-play`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Real four-player Mahjong/ }).click();
await page.getByRole('button', { name: 'Next step' }).click();
await page.getByText('Step 2 of 6').waitFor();
await page.getByRole('button', { name: 'Previous' }).click();
await page.getByRole('button', { name: /Mahjong Connect and Shisen-Sho/ }).click();
for (let index = 0; index < 4; index += 1) await page.getByRole('button', { name: 'Next step' }).click();
if ((await page.getByRole('link', { name: 'Practice now' }).getAttribute('href')) !== '/mahjong-connect') {
  throw new Error('Tutorial practice link targets the wrong game.');
}
results.tutorials = true;

// FAQ accordions and SEO metadata.
await page.goto(`${base}/learn/mahjong-vs-mahjongg`, { waitUntil: 'networkidle' });
const details = page.locator('details').first();
await details.locator('summary').click();
if (!(await details.getAttribute('open') !== null)) throw new Error('FAQ accordion did not open.');
const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
if (canonical !== 'https://ninegatesmahjong.com/learn/mahjong-vs-mahjongg') throw new Error('Editorial canonical URL is incorrect.');
await page.getByText('Quick answer', { exact: true }).waitFor();
await page.getByText(/Reviewed by the Nine Gates Mahjong Editorial Team/).waitFor();
results.editorialAndSeo = true;

// 404 route and noindex metadata.
const errorsBeforeNotFound = errors.length;
const notFoundResponse = await page.goto(`${base}/this-route-does-not-exist`, { waitUntil: 'networkidle' });
if (notFoundResponse?.status() !== 404) throw new Error(`Unknown route returned ${notFoundResponse?.status()} instead of 404.`);
await page.getByRole('heading', { name: /404/ }).waitFor();
if ((await page.locator('meta[name="robots"]').getAttribute('content')) !== 'noindex,follow') throw new Error('404 route is indexable.');
const notFoundConsoleMessages = errors.splice(errorsBeforeNotFound);
errors.push(...notFoundConsoleMessages.filter((message) =>
  !/Failed to load resource:.*status of 404/i.test(message)
));
results.notFound = true;

// Guest session and guest profile.
await page.goto(`${base}/guest`, { waitUntil: 'networkidle' });
await page.waitForURL('**/play');
if (!(await page.evaluate(() => Boolean(localStorage.getItem('ngm_guest'))))) throw new Error('Guest session was not persisted.');
await page.goto(`${base}/profile`, { waitUntil: 'networkidle' });
await page.getByText('Guest Player', { exact: true }).waitFor();
await page.getByRole('link', { name: 'Register now' }).waitFor();
results.guestProfile = true;

// Browser account registration, avatar persistence, logout and login.
const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
const username = `Browser${suffix}`.slice(0, 24);
const email = `browser-${suffix}@example.com`;
const password = 'NineGates!Browser2026';
await page.goto(`${base}/register`, { waitUntil: 'networkidle' });
await page.getByLabel('Display name').fill(username);
await page.getByLabel('Email').fill(email);
await page.getByLabel('Password').fill(password);
await page.getByRole('button', { name: 'Create free profile' }).click();
await page.waitForURL('**/profile');
await page.getByText('Registered Member').waitFor();
await page.getByRole('button', { name: 'Use winds east as avatar' }).click();
await page.getByText('Avatar updated successfully!').waitFor();
await page.reload({ waitUntil: 'networkidle' });
await page.getByText('Registered Member').waitFor();
if ((await page.getByRole('button', { name: 'Use winds east as avatar' }).getAttribute('aria-pressed')) !== 'true') {
  throw new Error('Avatar update did not persist after reload.');
}
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('button', { name: 'Log Out' }).click();
await page.goto(`${base}/profile`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'You are not logged in' }).waitFor();
await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
await page.getByLabel('Email').fill(email);
await page.getByLabel('Password').fill(password);
await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForURL('**/profile');
await page.getByText('Registered Member').waitFor();
results.accountUi = true;

await assertNoBrokenImages(page, 'Feature audit');
if (errors.length) throw new Error(errors.join(' | '));
await context.close();
await browser.close();
console.log(JSON.stringify(results));
