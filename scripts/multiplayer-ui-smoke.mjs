import { chromium } from 'playwright';

const base = process.env.NGM_BASE_URL || 'http://127.0.0.1:8787';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const aliceContext = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const bobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await aliceContext.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
await bobContext.addInitScript(() => localStorage.setItem('ngm_ad_consent', 'declined'));
const alice = await aliceContext.newPage();
const bob = await bobContext.newPage();
const errors = [];
for (const page of [alice, bob]) {
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
}

await alice.goto(`${base}/lobby`, { waitUntil: 'networkidle' });
await alice.getByLabel('Display name').fill('Alice Dragon');
await alice.getByRole('button', { name: 'Create private room' }).click();
const roomHeading = alice.locator('.multiplayer-room h2');
await roomHeading.waitFor();
const roomCode = (await roomHeading.innerText()).trim();
if (roomCode.length !== 6) throw new Error('Browser room creation did not return a six-character code.');
if (!(await alice.getByRole('button', { name: 'Start with AI fill' }).isDisabled())) {
  throw new Error('Room could start with only one human player.');
}

await alice.getByRole('button', { name: 'Copy code' }).click();
if ((await alice.evaluate(() => navigator.clipboard.readText())) !== roomCode) throw new Error('Copy room code failed.');

await bob.goto(`${base}/lobby`, { waitUntil: 'networkidle' });
await bob.getByLabel('Display name').fill('Bob Bamboo');
await bob.getByLabel('Six-character code').fill(roomCode);
await bob.getByRole('button', { name: 'Join room' }).click();
await bob.locator('.multiplayer-room h2').waitFor();
await alice.getByText('Bob Bamboo').waitFor();

await alice.getByRole('button', { name: 'Ready up' }).click();
await bob.getByRole('button', { name: 'Ready up' }).click();
await alice.getByText('All players ready.').waitFor();
await alice.getByRole('button', { name: 'Start with AI fill' }).waitFor({ state: 'visible' });
if (await alice.getByRole('button', { name: 'Start with AI fill' }).isDisabled()) throw new Error('Ready room did not enable start.');

await alice.getByRole('button', { name: 'Room chat & reactions' }).click();
await bob.getByRole('button', { name: 'Room chat & reactions' }).click();
await alice.getByLabel('Room chat message').fill('Good luck https://example.com');
await alice.getByRole('button', { name: 'Send' }).click();
await bob.getByText('Good luck [link removed]').waitFor();

await alice.getByRole('button', { name: 'Start with AI fill' }).click();
await alice.locator('.multiplayer-game').waitFor();
await bob.locator('.multiplayer-game').waitFor();

await alice.locator('.multiplayer-hand .mahjong-tile:not(:disabled)').first().click();
await alice.getByRole('button', { name: 'Discard selected' }).click();
await bob.waitForFunction(() => [...document.querySelectorAll('button')].some((button) => button.textContent?.trim() === 'Draw' && !button.disabled));
if (await bob.getByRole('button', { name: 'Draw', exact: true }).isDisabled()) throw new Error('Bob did not receive the draw turn.');
await bob.getByRole('button', { name: 'Draw', exact: true }).click();
await bob.locator('.multiplayer-hand .mahjong-tile:not(:disabled)').first().click();
await bob.getByRole('button', { name: 'Discard selected' }).click();
await alice.waitForFunction(() => [...document.querySelectorAll('button')].some((button) => button.textContent?.trim() === 'Draw' && !button.disabled));
if (await alice.getByRole('button', { name: 'Draw', exact: true }).isDisabled()) throw new Error('AI seats did not return the turn to Alice.');

await bob.getByRole('button', { name: 'Leave room' }).click();
await bob.getByRole('heading', { name: 'Multiplayer Mahjong Lobby' }).waitFor();
await alice.getByText('Bob Bamboo (AI)').waitFor();

if (errors.length) throw new Error(errors.join(' | '));
await aliceContext.close();
await bobContext.close();
await browser.close();
console.log(JSON.stringify({
  roomCode,
  readyGate: true,
  clipboard: true,
  chat: true,
  twoPlayerTurns: 2,
  disconnectAiTakeover: true,
}));
