const apiOrigin = process.env.NGM_API_ORIGIN || 'http://127.0.0.1:8787';
const wsOrigin = apiOrigin.replace(/^http/, 'ws');
const DEFAULT_TIMEOUT_MS = 20_000;

function createClient(url, clientName) {
  const socket = new WebSocket(url);
  const queue = [];
  const waiters = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    const waiterIndex = waiters.findIndex((waiter) => waiter.predicate(message));
    if (waiterIndex >= 0) {
      const [waiter] = waiters.splice(waiterIndex, 1);
      clearTimeout(waiter.timer);
      waiter.resolve(message);
    } else {
      queue.push(message);
    }
  });

  return {
    socket,
    open: () =>
      new Promise((resolve, reject) => {
        if (socket.readyState === WebSocket.OPEN) return resolve();
        const timer = setTimeout(() => reject(new Error(`${clientName} timed out opening the multiplayer socket.`)), DEFAULT_TIMEOUT_MS);
        socket.addEventListener('open', () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
        socket.addEventListener('error', (event) => {
          clearTimeout(timer);
          reject(new Error(`${clientName} multiplayer socket failed: ${String(event)}`));
        }, { once: true });
      }),
    send: (message) => socket.send(JSON.stringify(message)),
    waitFor(predicate, options = {}) {
      const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
      const label = options.label ?? 'multiplayer state';
      const queuedIndex = queue.findIndex(predicate);
      if (queuedIndex >= 0) return Promise.resolve(queue.splice(queuedIndex, 1)[0]);
      return new Promise((resolve, reject) => {
        const waiter = { predicate, resolve, reject, timer: null };
        waiter.timer = setTimeout(() => {
          const index = waiters.indexOf(waiter);
          if (index >= 0) waiters.splice(index, 1);
          reject(new Error(`${clientName} timed out waiting for ${label}.`));
        }, timeout);
        waiters.push(waiter);
      });
    },
  };
}

async function connect(code, name) {
  const client = createClient(
    `${wsOrigin}/api/rooms/${code}/websocket?name=${encodeURIComponent(name)}`,
    name,
  );
  await client.open();
  const state = await client.waitFor((message) => message.type === 'ROOM_STATE', { label: 'initial room state' });
  return { ...client, state };
}

const createResponse = await fetch(`${apiOrigin}/api/rooms`, { method: 'POST' });
if (!createResponse.ok) throw new Error(`Room creation failed: ${createResponse.status}`);
const { roomCode } = await createResponse.json();

const alice = await connect(roomCode, 'Alice Dragon');
const bob = await connect(roomCode, 'Bob Bamboo');
await alice.waitFor(
  (message) => message.room?.seats?.filter(Boolean).length === 2,
  { label: 'both players to occupy seats' },
);

alice.send({ type: 'START_GAME' });
const notReadyError = await alice.waitFor((message) => message.type === 'ERROR', { label: 'the ready-gate error' });
if (!/ready/i.test(notReadyError.message)) throw new Error('Room started before connected players were ready.');

alice.send({ type: 'CHAT', text: 'Good luck https://example.com' });
const chatState = await bob.waitFor(
  (message) => message.messages?.length === 1,
  { label: 'filtered chat broadcast' },
);
if (chatState.messages[0].text !== 'Good luck [link removed]') {
  throw new Error('Room chat filtering or broadcast failed.');
}

alice.send({ type: 'READY' });
bob.send({ type: 'READY' });
await alice.waitFor(
  (message) => {
    const connectedSeats = message.room?.seats?.filter(Boolean) ?? [];
    return connectedSeats.length === 2 && connectedSeats.every((seat) => seat.ready === true);
  },
  { label: 'both players to become ready' },
);
alice.send({ type: 'START_GAME' });

let aliceState = await alice.waitFor((message) => message.type === 'GAME_STATE', { label: 'Alice initial game state' });
let bobState = await bob.waitFor((message) => message.type === 'GAME_STATE', { label: 'Bob initial game state' });

if (aliceState.game.yourSeat !== 0 || bobState.game.yourSeat !== 1) {
  throw new Error('Players did not receive distinct seats.');
}
if (aliceState.game.hand.length !== 14 || bobState.game.hand.length !== 13) {
  throw new Error('Initial hands were not dealt correctly.');
}
if ('hands' in aliceState.game || 'hands' in bobState.game) {
  throw new Error('Server leaked hidden opponent hands.');
}

for (let round = 0; round < 3; round += 1) {
  const aliceDiscard = aliceState.game.hand[0];
  alice.send({ type: 'DISCARD_TILE', tileId: aliceDiscard.id });
  bobState = await bob.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 1 && message.game.phase === 'draw',
    { label: `Bob draw phase in round ${round + 1}` },
  );

  bob.send({ type: 'DRAW_TILE' });
  bobState = await bob.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 1 && message.game.phase === 'discard',
    { label: `Bob discard phase in round ${round + 1}` },
  );
  const bobDiscard = bobState.game.hand[0];
  bob.send({ type: 'DISCARD_TILE', tileId: bobDiscard.id });
  aliceState = await alice.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 0 && message.game.phase === 'draw',
    { label: `Alice draw phase in round ${round + 1}` },
  );

  alice.send({ type: 'DRAW_TILE' });
  aliceState = await alice.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 0 && message.game.phase === 'discard',
    { label: `Alice discard phase in round ${round + 1}` },
  );
}

console.log(JSON.stringify({
  roomCode,
  players: ['Alice Dragon', 'Bob Bamboo'],
  turnsCompleted: 6,
  wallRemaining: aliceState.game.wallRemaining,
  discardCounts: aliceState.game.discards.map((pool) => pool.length),
  authoritativeHiddenHands: true,
  readyGateEnforced: true,
  chatBroadcastAndFiltered: true,
}));

alice.socket.close(1000, 'Smoke test complete');
bob.socket.close(1000, 'Smoke test complete');
