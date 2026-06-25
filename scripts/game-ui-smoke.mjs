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

async function completeByState(route, memory = false) {
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.render_game_to_text === 'function', null, { timeout: 10000 });
  for (let move = 0; move < 80; move += 1) {
    const state = JSON.parse(await page.evaluate(() => window.render_game_to_text?.() || '{}'));
    if (state.complete) return move;
    if (memory) {
      const tiles = await page.locator('.grid-board .mahjong-tile').evaluateAll((elements) =>
        elements.map((element) => ({ key: element.getAttribute('data-tile-key') }))
      );
      const groups = new Map();
      tiles.forEach((tile, index) => groups.set(tile.key, [...(groups.get(tile.key) || []), index]));
      const pair = [...groups.values()].find((indices) => indices.length >= 2);
      if (!pair) throw new Error(`${route}: no memory pair found`);
      const buttons = page.locator('.grid-board .mahjong-tile');
      await buttons.nth(pair[0]).click();
      await buttons.nth(pair[1]).click();
      await page.waitForTimeout(460);
      continue;
    }
    const candidates = state.playableTiles || state.visibleTiles?.filter(Boolean);
    const groups = new Map();
    candidates.forEach((tile) => groups.set(tile.key, [...(groups.get(tile.key) || []), tile]));
    const pair = [...groups.values()].find((items) => items.length >= 2);
    if (!pair) throw new Error(`${route}: no pair found after ${move} moves`);
    if (state.playableTiles) {
      const active = page.locator(`[data-tile-key="${pair[0].key}"]:not(:disabled)`);
      await active.nth(0).click();
      await active.nth(1).click();
    } else {
      const active = page.locator(`.grid-board [data-tile-key="${pair[0].key}"]`);
      await active.nth(0).click();
      await active.nth(1).click();
      await page.waitForTimeout(180);
    }
  }
  throw new Error(`${route}: did not complete`);
}

const results = {};
results.solitaire = await completeByState('/mahjongg-solitaire');
results.daily = await completeByState('/daily');
results.zen = await completeByState('/zen-mahjongg');
results.timeAttack = await completeByState('/time-attack');
results.connect = await completeByState('/mahjong-connect');
results.shisen = await completeByState('/shisen-sho');
results.memory = await completeByState('/mahjongg-memory', true);

await page.goto(`${base}/events`, { waitUntil: 'domcontentloaded' });
await page.getByText('3/3 gates complete').waitFor({ state: 'visible', timeout: 10000 });
results.eventChallengeCircuit = true;

await page.goto(`${base}/real-mahjong`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.render_game_to_text === 'function', null, { timeout: 10000 });
for (let turn = 0; turn < 5; turn += 1) {
  const state = JSON.parse(await page.evaluate(() => window.render_game_to_text?.() || '{}'));
  const tileId = state.playerHand?.[0]?.id;
  if (!tileId) throw new Error('Real Mahjong hand missing');
  const tile = page.locator(`.player-rack [data-tile-key="${state.playerHand[0].key}"]`).first();
  await tile.click();
  await tile.click();
  await page.waitForTimeout(2800);
  const next = JSON.parse(await page.evaluate(() => window.render_game_to_text?.() || '{}'));
  if (next.phase === 'draw') await page.getByRole('button', { name: 'Draw tile' }).click();
}
results.realMahjongTurns = 5;

await browser.close();
console.log(JSON.stringify(results));
