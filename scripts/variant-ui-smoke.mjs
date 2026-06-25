import { chromium } from 'playwright';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
await page.route('**/api/profile', (route) => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ user: null }),
}));

const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});

async function state() {
  return JSON.parse(await page.evaluate(() => window.render_game_to_text?.() || '{}'));
}

async function completeGuidedVariant(route, american = false, riichi = false) {
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.render_game_to_text === 'function', null, { timeout: 10000 });

  if (american) {
    for (let pass = 0; pass < 3; pass += 1) {
      const tiles = page.locator('.variant-trainer__hand .mahjong-tile:not(:disabled)');
      await tiles.nth(0).click();
      await tiles.nth(1).click();
      await tiles.nth(2).click();
      await page.getByRole('button', { name: /^Pass / }).click();
    }
  }

  await page.getByRole('button', { name: /Hint/ }).click();
  const ready = await state();
  if (ready.selectedIds?.length !== 1 || ready.waits?.length < 1) {
    throw new Error(`${route}: hint did not select a tenpai discard`);
  }

  if (riichi) {
    await page.getByRole('button', { name: 'Declare riichi' }).click();
    const declared = await state();
    if (!declared.riichiDeclared) throw new Error(`${route}: riichi was not declared`);
  } else {
    await page.getByRole('button', { name: 'Discard selected' }).click();
  }

  await page.getByRole('button', { name: 'Draw tile' }).click();
  const completed = await state();
  if (completed.phase !== 'won') {
    throw new Error(`${route}: guided hand did not complete: ${JSON.stringify(completed)}`);
  }
  return {
    ruleset: completed.ruleset,
    turns: completed.turns,
    handSizeTarget: completed.handSizeTarget,
    riichiDeclared: completed.riichiDeclared,
  };
}

await page.goto(`${base}/variants`, { waitUntil: 'domcontentloaded' });
if (await page.getByText('Coming Soon', { exact: true }).count()) {
  throw new Error('Variants hub still contains a Coming Soon state.');
}

const results = {
  hongKong: await completeGuidedVariant('/real-mahjong/hong-kong'),
  riichi: await completeGuidedVariant('/real-mahjong/riichi', false, true),
  mcr: await completeGuidedVariant('/real-mahjong/mcr'),
  american: await completeGuidedVariant('/real-mahjong/american', true),
  taiwanese: await completeGuidedVariant('/real-mahjong/taiwanese'),
};

if (errors.length) throw new Error(errors.join(' | '));
await browser.close();
console.log(JSON.stringify(results));
