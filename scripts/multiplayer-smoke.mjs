const apiOrigin = process.env.NGM_API_ORIGIN || 'http://127.0.0.1:8787';
const wsOrigin = apiOrigin.replace(/^http/, 'ws');

function createClient(url) {
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
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
      }),
    send: (message) => socket.send(JSON.stringify(message)),
    waitFor(predicate, timeout = 7000) {
      const queuedIndex = queue.findIndex(predicate);
      if (queuedIndex >= 0) return Promise.resolve(queue.splice(queuedIndex, 1)[0]);
      return new Promise((resolve, reject) => {
        const waiter = { predicate, resolve, reject, timer: null };
        waiter.timer = setTimeout(() => {
          const index = waiters.indexOf(waiter);
          if (index >= 0) waiters.splice(index, 1);
          reject(new Error('Timed out waiting for multiplayer state.'));
        }, timeout);
        waiters.push(waiter);
      });
    },
  };
}

async function connect(code, name) {
  const client = createClient(`${wsOrigin}/api/rooms/${code}/websocket?name=${encodeURIComponent(name)}`);
  await client.open();
  const state = await client.waitFor((message) => message.type === 'ROOM_STATE');
  return { ...client, state };
}

const createResponse = await fetch(`${apiOrigin}/api/rooms`, { method: 'POST' });
if (!createResponse.ok) throw new Error(`Room creation failed: ${createResponse.status}`);
const { roomCode } = await createResponse.json();

const alice = await connect(roomCode, 'Alice Dragon');
const bob = await connect(roomCode, 'Bob Bamboo');
await alice.waitFor((message) => message.room?.seats?.filter(Boolean).length === 2);

alice.send({ type: 'READY' });
bob.send({ type: 'READY' });
alice.send({ type: 'START_GAME' });

let aliceState = await alice.waitFor((message) => message.type === 'GAME_STATE');
let bobState = await bob.waitFor((message) => message.type === 'GAME_STATE');

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
    (message) => message.type === 'GAME_STATE' && message.game.turn === 1 && message.game.phase === 'draw'
  );

  bob.send({ type: 'DRAW_TILE' });
  bobState = await bob.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 1 && message.game.phase === 'discard'
  );
  const bobDiscard = bobState.game.hand[0];
  bob.send({ type: 'DISCARD_TILE', tileId: bobDiscard.id });
  aliceState = await alice.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 0 && message.game.phase === 'draw'
  );

  alice.send({ type: 'DRAW_TILE' });
  aliceState = await alice.waitFor(
    (message) => message.type === 'GAME_STATE' && message.game.turn === 0 && message.game.phase === 'discard'
  );
}

console.log(JSON.stringify({
  roomCode,
  players: ['Alice Dragon', 'Bob Bamboo'],
  turnsCompleted: 6,
  wallRemaining: aliceState.game.wallRemaining,
  discardCounts: aliceState.game.discards.map((pool) => pool.length),
  authoritativeHiddenHands: true,
}));

alice.socket.close(1000, 'Smoke test complete');
bob.socket.close(1000, 'Smoke test complete');
