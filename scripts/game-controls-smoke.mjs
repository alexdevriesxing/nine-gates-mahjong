import { chromium } from 'playwright';
import { canConnectTiles } from '../src/game/MahjongCore.ts';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true });
await context.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
const page = await context.newPage();
page.setDefaultNavigationTimeout(45_000);
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});

async function state(targetPage = page) {
  return JSON.parse(await targetPage.evaluate(() => window.render_game_to_text?.() || '{}'));
}

async function openGame(route, targetPage = page) {
  const response = await targetPage.goto(`${base}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: 45_000,
  });
  if (!response?.ok()) throw new Error(`${route}: navigation returned ${response?.status()}.`);
  await targetPage.waitForFunction(
    () => typeof window.render_game_to_text === 'function',
    null,
    { timeout: 45_000 },
  );
}

async function clickLayeredPair() {
  const current = await state();
  const groups = new Map();
  current.playableTiles.forEach((tile) => groups.set(tile.key, [...(groups.get(tile.key) || []), tile]));
  const pair = [...groups.values()].find((items) => items.length >= 2);
  if (!pair) throw new Error('No layered pair found.');
  const active = page.locator(`[data-tile-key="${pair[0].key}"]:not(:disabled)`);
  await active.nth(0).click();
  await active.nth(1).click();
}

function findGridPair(keys) {
  for (let first = 0; first < keys.length; first += 1) {
    if (!keys[first]) continue;
    for (let second = first + 1; second < keys.length; second += 1) {
      if (keys[first] === keys[second] && canConnectTiles(keys, 6, 8, first, second)) {
        return [first, second];
      }
    }
  }
  return null;
}

const results = {};

// Layered game controls: hint, pair, undo, pause, keyboard, reset, fullscreen.
await openGame('/mahjongg-solitaire');
const layeredStart = await state();
await page.getByRole('button', { name: /Hint/ }).click();
if (await page.locator('.mahjong-tile--hinted').count() !== 2) throw new Error('Layered hint did not highlight a pair.');
await clickLayeredPair();
let layered = await state();
if (layered.remaining !== layeredStart.remaining - 2 || layered.score <= 0) throw new Error('Layered match did not update state.');
await page.getByRole('button', { name: /Undo/ }).click();
layered = await state();
if (layered.remaining !== layeredStart.remaining) throw new Error('Layered undo did not restore the pair.');
await page.getByRole('button', { name: 'Pause' }).click();
if (!(await state()).paused) throw new Error('Layered pause did not set paused state.');
await page.getByRole('button', { name: 'Resume' }).click();
await page.keyboard.press('h');
if (await page.locator('.mahjong-tile--hinted').count() !== 2) throw new Error('Layered H shortcut failed.');
const originalSeed = (await state()).seed;
await page.getByRole('button', { name: 'New board' }).click();
if ((await state()).seed === originalSeed) throw new Error('New layered board did not change seed.');
await page.getByRole('button', { name: /Fullscreen/ }).click();
await page.waitForTimeout(100);
if (!(await page.evaluate(() => Boolean(document.fullscreenElement)))) throw new Error('Fullscreen control did not enter fullscreen.');
await page.keyboard.press('Escape');
results.layeredControls = true;

// Alternate layered layouts reset the board and remain visible in text state.
for (const [buttonName, expectedLayout] of [
  ['Jade Courtyard', 'courtyard'],
  ['Four-Storey Pagoda', 'pagoda'],
  ['Fortress', 'fortress'],
]) {
  await page.getByRole('button', { name: new RegExp(buttonName) }).click();
  await page.waitForFunction(
    (layout) => JSON.parse(window.render_game_to_text?.() || '{}').layout === layout,
    expectedLayout,
  );
}
results.solitaireLayouts = true;

// Flat grid controls, hint visibility, path-valid match, pause and reset.
await openGame('/mahjong-connect');
const gridStart = await state();
await page.getByRole('button', { name: /Hint/ }).click();
await page.waitForFunction(() => JSON.parse(window.render_game_to_text?.() || '{}').selected !== null, null, { timeout: 3000 });
if (await page.locator('.grid-board .mahjong-tile--selected').count() !== 1) {
  throw new Error('Grid hint did not visibly select a tile.');
}
await page.waitForFunction(() => JSON.parse(window.render_game_to_text?.() || '{}').selected === null, null, { timeout: 3000 });
const readyGrid = await state();
const keys = readyGrid.visibleTiles.map((tile) => tile?.key ?? null);
const pair = findGridPair(keys);
if (!pair) throw new Error('No path-valid grid pair found.');
const gridCells = page.locator('.grid-board > .mahjong-tile, .grid-board > .grid-board__empty');
await gridCells.nth(pair[0]).click();
await gridCells.nth(pair[1]).click();
await page.waitForFunction(
  (expectedRemaining) => JSON.parse(window.render_game_to_text?.() || '{}').remaining === expectedRemaining,
  gridStart.remaining - 2,
  { timeout: 5000 },
);
await page.getByRole('button', { name: 'Pause' }).click();
if (!(await state()).paused) throw new Error('Grid pause failed.');
await page.getByRole('button', { name: 'Resume' }).click();
const gridSeed = (await state()).seed;
await page.getByRole('button', { name: 'New board' }).click();
if ((await state()).seed === gridSeed) throw new Error('Grid reset did not create a new seed.');
results.gridControls = true;

// Memory mismatch recovery and successful match.
await openGame('/mahjongg-memory');
const memory = await state();
const visible = await page.locator('.grid-board .mahjong-tile').evaluateAll((tiles) =>
  tiles.map((tile) => tile.getAttribute('data-tile-key'))
);
let mismatch = null;
for (let first = 0; first < visible.length && !mismatch; first += 1) {
  const second = visible.findIndex((key, index) => index > first && key !== visible[first]);
  if (second > first) mismatch = [first, second];
}
if (!mismatch) throw new Error('Could not find a memory mismatch.');
await page.locator('.grid-board .mahjong-tile').nth(mismatch[0]).click();
await page.locator('.grid-board .mahjong-tile').nth(mismatch[1]).click();
await page.waitForTimeout(800);
if ((await state()).remaining !== memory.remaining) throw new Error('Memory mismatch removed tiles.');
const groups = new Map();
visible.forEach((key, index) => groups.set(key, [...(groups.get(key) || []), index]));
const matching = [...groups.values()].find((indices) => indices.length >= 2);
if (!matching) throw new Error('Could not find a memory pair.');
await page.locator('.grid-board .mahjong-tile').nth(matching[0]).click();
await page.locator('.grid-board .mahjong-tile').nth(matching[1]).click();
await page.waitForTimeout(500);
if ((await state()).remaining !== memory.remaining - 2) throw new Error('Memory match did not remove tiles.');
results.memoryControls = true;

// Time attack timeout and recovery.
await openGame('/time-attack');
await page.evaluate(async () => window.advanceTime?.(121000));
await page.waitForTimeout(100);
await page.getByText('Time’s up').waitFor();
await page.getByRole('button', { name: 'Play again' }).click();
if ((await state()).seconds !== 120) throw new Error('Time Attack restart did not reset the clock.');
results.timeAttackTimeout = true;

// Real Mahjong turn flow, speed toggle, and new hand.
await openGame('/real-mahjong');
let real = await state();
const handNumber = real.handNumber;
const firstTile = page.locator(`.player-rack [data-tile-key="${real.playerHand[0].key}"]`).first();
await firstTile.click();
await page.getByRole('button', { name: 'Discard selected' }).click();
await page.waitForTimeout(2800);
real = await state();
if (real.phase !== 'draw' || real.currentTurn !== 'East') throw new Error('AI turn cycle did not return to the player.');
await page.getByRole('button', { name: 'Draw tile' }).click();
if ((await state()).playerHand.length !== 14) throw new Error('Real Mahjong draw did not restore 14 tiles.');
await page.getByRole('button', { name: /AI speed/ }).click();
await page.getByRole('button', { name: 'New hand' }).click();
if ((await state()).handNumber !== handNumber + 1) throw new Error('New hand control failed.');
results.realMahjongControls = true;

// Mobile touch sanity runs in a fresh page to avoid retaining completed game canvases,
// timers and fullscreen state from the desktop control audit.
const mobilePage = await context.newPage();
mobilePage.setDefaultNavigationTimeout(45_000);
const mobileErrors = [];
mobilePage.on('pageerror', (error) => mobileErrors.push(String(error)));
mobilePage.on('console', (message) => {
  if (message.type() === 'error') mobileErrors.push(message.text());
});
await mobilePage.setViewportSize({ width: 390, height: 844 });
for (const route of [
  '/mahjongg-solitaire', '/daily', '/zen-mahjongg', '/time-attack',
  '/mahjong-connect', '/shisen-sho', '/mahjongg-memory', '/real-mahjong',
]) {
  await openGame(route, mobilePage);
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 4) throw new Error(`${route}: mobile horizontal overflow ${overflow}px`);
  const tile = mobilePage.locator('.mahjong-tile:not(:disabled)').first();
  if (await tile.count()) await tile.tap();
}
results.mobileTouchRoutes = 8;

if (errors.length || mobileErrors.length) throw new Error([...errors, ...mobileErrors].join(' | '));
await mobilePage.close();
await context.close();
await browser.close();
console.log(JSON.stringify(results));
