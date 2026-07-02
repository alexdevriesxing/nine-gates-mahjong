import {
  chooseAIDiscard,
  createMahjongWall,
  isWinningMahjongHand,
  sortMahjongTiles,
  type MahjongTileInstance,
} from '../game/MahjongCore';
import { buildSeoHeadTags } from '../shared/seo';

interface Env {
  ASSETS: Fetcher;
  MAHJONG_ROOM: DurableObjectNamespace;
  DB: D1Database;
}

interface RoomSeat {
  id: string;
  name: string;
  ready: boolean;
  connected: boolean;
  isAI: boolean;
}

interface RoomGame {
  wall: MahjongTileInstance[];
  hands: MahjongTileInstance[][];
  discards: MahjongTileInstance[][];
  turn: number;
  phase: 'draw' | 'discard';
  winner: number | null;
  lastAction: string;
}

interface RoomChatMessage {
  id: string;
  seat: number;
  name: string;
  text: string;
  createdAt: number;
}

interface RoomData {
  code: string;
  status: 'waiting' | 'in-progress' | 'finished';
  seats: Array<RoomSeat | null>;
  game: RoomGame | null;
  messages: RoomChatMessage[];
}

interface SocketMeta {
  playerId: string;
}

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

async function htmlWithRouteSeo(response: Response, pathname: string) {
  const html = await response.text();
  const seoTags = buildSeoHeadTags(pathname);
  const bodyAnswerBlock = buildAnswerEngineBlock(pathname);
  const rewritten = html
    .replace('</head>', `  ${seoTags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root"></div>\n  ${bodyAnswerBlock}`);
  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  return new Response(rewritten, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function buildAnswerEngineBlock(pathname: string) {
  const page = pathname.replace(/\/+$/, '') || '/';
  const facts = [
    'Nine Gates Mahjong is a free online Mahjong and Mahjongg portal.',
    'The site includes Mahjongg Solitaire, Daily Mahjongg Puzzle, Zen Mahjongg, Time Attack, Mahjong Connect, Shisen-Sho, Mahjongg Memory, and Real Mahjong vs AI.',
    'Learning content explains Mahjong versus Mahjongg, Mahjongg Solitaire rules, real four-player Mahjong, chi, pung, kong, beginner strategy, and regional Mahjong variants.',
  ];
  const routeFact = page === '/'
    ? 'The home page is the main entry point for players looking for free online Mahjong games.'
    : `This route is the canonical Nine Gates Mahjong page for ${page.slice(1).replace(/[-/]/g, ' ')}.`;
  return [
    '<noscript>',
    '<section id="answer-engine-summary">',
    '<h1>Nine Gates Mahjong</h1>',
    ...[routeFact, ...facts].map((fact) => `<p>${escapeHtml(fact)}</p>`),
    '</section>',
    '</noscript>',
  ].join('');
}

function isAdHelperPath(pathname: string) {
  const cleanPath = pathname.replace(/\/+$/, '').toLowerCase();
  return cleanPath === '/ad' || cleanPath === '/ad.html' || cleanPath === '/native' || cleanPath === '/native.html';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let index = 0; index < 6; index += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function sanitizeName(value: string | null) {
  return (value || 'Guest Dragon').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 24) || 'Guest Dragon';
}

const BLOCKED_CHAT_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'bastard', 'dick', 'pussy',
  'kanker', 'kut', 'tyfus', 'tering', 'puta', 'mierda', 'scheisse', 'arschloch',
  'connard', 'merde', 'putain',
];

function sanitizeChat(value: string | undefined) {
  let message = (value ?? '').trim().replace(/\s+/g, ' ').slice(0, 160);
  message = message.replace(/(?:https?:\/\/|www\.)\S+/giu, '[link removed]');
  for (const word of BLOCKED_CHAT_WORDS) {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'giu');
    message = message.replace(pattern, '•'.repeat(Math.max(3, word.length)));
  }
  return message;
}

const encoder = new TextEncoder();

function toHex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(value: string) {
  return new Uint8Array(value.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
}

async function hashPassword(password: string, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
    key,
    256
  );
  return { hash: toHex(new Uint8Array(bits)), salt: toHex(salt) };
}

async function verifyPassword(password: string, expectedHash: string, saltHex: string) {
  const { hash } = await hashPassword(password, fromHex(saltHex));
  if (hash.length !== expectedHash.length) return false;
  let mismatch = 0;
  for (let index = 0; index < hash.length; index += 1) mismatch |= hash.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  return mismatch === 0;
}

function cookieValue(request: Request, name: string) {
  const cookies = request.headers.get('Cookie') ?? '';
  return cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function sessionCookie(request: Request, sessionId: string, maxAge = 2_592_000) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `ngm_session=${sessionId}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

async function currentUser(request: Request, env: Env) {
  const sessionId = cookieValue(request, 'ngm_session');
  if (!sessionId) return null;
  return env.DB.prepare(`
    SELECT u.id, u.username, u.email, u.created_at, p.display_name, p.avatar_tile, p.level, p.xp,
      p.coins, p.rating, p.rated_wins, p.rated_losses, p.games_played
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    JOIN profiles p ON p.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).bind(sessionId).first<Record<string, string | number>>();
}

async function userById(userId: string, env: Env) {
  return env.DB.prepare(`
    SELECT u.id, u.username, u.email, u.created_at, p.display_name, p.avatar_tile, p.level, p.xp,
      p.coins, p.rating, p.rated_wins, p.rated_losses, p.games_played
    FROM users u JOIN profiles p ON p.user_id = u.id WHERE u.id = ?
  `).bind(userId).first<Record<string, string | number>>();
}

function publicUser(row: Record<string, string | number>) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    email: row.email,
    isGuest: false,
    avatarTile: row.avatar_tile,
    level: row.level,
    xp: row.xp,
    coins: row.coins,
    rating: row.rating,
    ratedWins: row.rated_wins,
    ratedLosses: row.rated_losses,
    gamesPlayed: row.games_played,
    createdAt: row.created_at,
  };
}

async function createSession(userId: string, env: Env) {
  const sessionId = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))"
  ).bind(sessionId, userId).run();
  return sessionId;
}

function createGame(): RoomGame {
  const wall = createMahjongWall();
  const hands: MahjongTileInstance[][] = [[], [], [], []];
  for (let round = 0; round < 13; round += 1) hands.forEach((hand) => hand.push(wall.shift()!));
  hands[0].push(wall.shift()!);
  return {
    wall,
    hands: hands.map(sortMahjongTiles),
    discards: [[], [], [], []],
    turn: 0,
    phase: 'discard',
    winner: null,
    lastAction: 'East begins with a discard.',
  };
}

export class MahjongRoom {
  private state: DurableObjectState;
  private env: Env;
  private room: RoomData | null = null;
  private sockets = new Map<WebSocket, SocketMeta>();
  private lastChatAt = new Map<string, number>();

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.state.blockConcurrencyWhile(async () => {
      this.room = (await this.state.storage.get<RoomData>('room')) ?? null;
      if (this.room && !this.room.messages) this.room.messages = [];
    });
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const code = url.pathname.split('/').filter(Boolean).at(-1)?.toUpperCase() || 'ROOM';
    if (!this.room) {
      this.room = {
        code,
        status: 'waiting',
        seats: [null, null, null, null],
        game: null,
        messages: [],
      };
      await this.persist();
    }

    if (request.headers.get('Upgrade') === 'websocket') {
      return this.connect(request);
    }
    return json(this.publicRoomState());
  }

  private async connect(request: Request) {
    const url = new URL(request.url);
    const authenticated = await currentUser(request, this.env);
    const name = authenticated ? String(authenticated.display_name) : sanitizeName(url.searchParams.get('name'));
    const requestedId = url.searchParams.get('playerId');
    const playerId = authenticated ? `user-${authenticated.id}` : requestedId || crypto.randomUUID();
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();

    let seatIndex = this.room!.seats.findIndex((seat) => seat?.id === playerId);
    if (seatIndex === -1) seatIndex = this.room!.seats.findIndex((seat) => seat === null || seat.isAI);
    if (seatIndex === -1) {
      server.close(1013, 'Room is full');
      return new Response(null, { status: 101, webSocket: client });
    }

    this.room!.seats[seatIndex] = { id: playerId, name, ready: false, connected: true, isAI: false };
    this.sockets.set(server, { playerId });
    server.addEventListener('message', (event) => void this.onMessage(server, String(event.data)));
    server.addEventListener('close', () => void this.onDisconnect(server));
    server.addEventListener('error', () => void this.onDisconnect(server));
    await this.persist();
    this.broadcast();

    return new Response(null, { status: 101, webSocket: client });
  }

  private async onMessage(socket: WebSocket, raw: string) {
    const meta = this.sockets.get(socket);
    if (!meta || !this.room) return;
    let message: { type?: string; tileId?: string; text?: string };
    try {
      message = JSON.parse(raw);
    } catch {
      this.sendError(socket, 'Invalid message.');
      return;
    }
    const seatIndex = this.room.seats.findIndex((seat) => seat?.id === meta.playerId);
    if (seatIndex === -1) return;

    switch (message.type) {
      case 'READY':
        this.room.seats[seatIndex]!.ready = !this.room.seats[seatIndex]!.ready;
        break;
      case 'START_GAME':
        if (this.room.status !== 'waiting') break;
        const humanSeats = this.room.seats.filter((seat): seat is RoomSeat => Boolean(seat && !seat.isAI));
        if (humanSeats.length < 2) {
          this.sendError(socket, 'At least two connected players are required.');
          return;
        }
        if (humanSeats.some((seat) => !seat.ready)) {
          this.sendError(socket, 'Every connected player must be ready.');
          return;
        }
        this.room.seats = this.room.seats.map((seat, index) =>
          seat ?? {
            id: `ai-${index}`,
            name: ['Uncle Lee', 'Mei Lin', 'Master Chen', 'Bao'][index],
            ready: true,
            connected: true,
            isAI: true,
          }
        );
        this.room.game = createGame();
        this.room.status = 'in-progress';
        await this.runAITurns();
        break;
      case 'DRAW_TILE':
        this.draw(seatIndex);
        break;
      case 'DISCARD_TILE':
        if (!message.tileId) return;
        this.discard(seatIndex, message.tileId);
        await this.runAITurns();
        break;
      case 'CHAT':
        this.addChatMessage(meta.playerId, seatIndex, message.text);
        break;
      case 'LEAVE_ROOM':
        socket.close(1000, 'Player left');
        return;
      default:
        this.sendError(socket, 'Unsupported action.');
        return;
    }
    await this.persist();
    this.broadcast();
  }

  private addChatMessage(playerId: string, seatIndex: number, rawText: string | undefined) {
    const now = Date.now();
    if (now - (this.lastChatAt.get(playerId) ?? 0) < 500) return;
    const text = sanitizeChat(rawText);
    if (!text) return;
    const seat = this.room!.seats[seatIndex];
    if (!seat || seat.isAI) return;
    this.lastChatAt.set(playerId, now);
    this.room!.messages = [
      ...(this.room!.messages ?? []).slice(-39),
      { id: crypto.randomUUID(), seat: seatIndex, name: seat.name, text, createdAt: now },
    ];
  }

  private draw(seatIndex: number) {
    const game = this.room?.game;
    if (!game || game.winner !== null || game.turn !== seatIndex || game.phase !== 'draw' || game.wall.length === 0) {
      return;
    }
    const tile = game.wall.shift()!;
    game.hands[seatIndex] = sortMahjongTiles([...game.hands[seatIndex], tile]);
    game.phase = 'discard';
    game.lastAction = `${this.room!.seats[seatIndex]!.name} draws.`;
    if (isWinningMahjongHand(game.hands[seatIndex])) this.finish(seatIndex);
  }

  private discard(seatIndex: number, tileId: string) {
    const game = this.room?.game;
    if (!game || game.winner !== null || game.turn !== seatIndex || game.phase !== 'discard') return;
    const tile = game.hands[seatIndex].find((candidate) => candidate.id === tileId);
    if (!tile) return;
    game.hands[seatIndex] = game.hands[seatIndex].filter((candidate) => candidate.id !== tileId);
    game.discards[seatIndex].push(tile);
    game.turn = (seatIndex + 1) % 4;
    game.phase = 'draw';
    game.lastAction = `${this.room!.seats[seatIndex]!.name} discards ${tile.name}.`;
  }

  private async runAITurns() {
    const game = this.room?.game;
    if (!game) return;
    let guard = 0;
    while (game.winner === null && this.room!.seats[game.turn]?.isAI && game.wall.length > 0 && guard < 8) {
      guard += 1;
      const seatIndex = game.turn;
      this.draw(seatIndex);
      if (game.winner !== null) break;
      const tile = chooseAIDiscard(game.hands[seatIndex]);
      this.discard(seatIndex, tile.id);
    }
  }

  private finish(seatIndex: number) {
    const game = this.room!.game!;
    game.winner = seatIndex;
    game.lastAction = `${this.room!.seats[seatIndex]!.name} declares Mahjong.`;
    this.room!.status = 'finished';
    void this.recordRatedResult(seatIndex);
  }

  private async recordRatedResult(winnerIndex: number) {
    const humans = this.room!.seats
      .map((seat, index) => ({ seat, index }))
      .filter((entry): entry is { seat: RoomSeat; index: number } => Boolean(entry.seat && !entry.seat.isAI && entry.seat.id.startsWith('user-')));
    if (humans.length < 2) return;
    const matchId = crypto.randomUUID();
    await this.env.DB.prepare(
      'INSERT INTO matches (id, mode, room_code, rated) VALUES (?, ?, ?, 1)'
    ).bind(matchId, 'multiplayer', this.room!.code).run();
    const ratings = await Promise.all(humans.map(async ({ seat, index }) => {
      const userId = seat.id.slice(5);
      const profile = await this.env.DB.prepare('SELECT rating FROM profiles WHERE user_id = ?').bind(userId).first<{ rating: number }>();
      return { userId, index, rating: profile?.rating ?? 1500 };
    }));
    for (const player of ratings) {
      const opponents = ratings.filter((candidate) => candidate.userId !== player.userId);
      const opponentAverage = opponents.reduce((sum, candidate) => sum + candidate.rating, 0) / opponents.length;
      const expected = 1 / (1 + 10 ** ((opponentAverage - player.rating) / 400));
      const actual = player.index === winnerIndex ? 1 : 0;
      const delta = Math.round(32 * (actual - expected));
      const nextRating = Math.max(100, player.rating + delta);
      await this.env.DB.batch([
        this.env.DB.prepare(`
          UPDATE profiles SET rating = ?, rated_wins = rated_wins + ?, rated_losses = rated_losses + ?,
            games_played = games_played + 1, xp = xp + ?, coins = coins + ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `).bind(nextRating, actual, actual ? 0 : 1, actual ? 120 : 35, actual ? 40 : 10, player.userId),
        this.env.DB.prepare(`
          INSERT INTO match_players (match_id, user_id, placement, rating_before, rating_after)
          VALUES (?, ?, ?, ?, ?)
        `).bind(matchId, player.userId, actual ? 1 : 2, player.rating, nextRating),
      ]);
    }
  }

  private async onDisconnect(socket: WebSocket) {
    const meta = this.sockets.get(socket);
    this.sockets.delete(socket);
    if (!meta || !this.room) return;
    const seatIndex = this.room.seats.findIndex((seat) => seat?.id === meta.playerId);
    if (seatIndex === -1) return;
    if (this.room.status === 'waiting') {
      this.room.seats[seatIndex] = null;
    } else {
      const seat = this.room.seats[seatIndex]!;
      this.room.seats[seatIndex] = { ...seat, connected: false, isAI: true, name: `${seat.name} (AI)` };
      await this.runAITurns();
    }
    await this.persist();
    this.broadcast();
  }

  private publicRoomState(playerId?: string) {
    const seatIndex = this.room!.seats.findIndex((seat) => seat?.id === playerId);
    const game = this.room!.game;
    return {
      type: game ? 'GAME_STATE' : 'ROOM_STATE',
      room: {
        code: this.room!.code,
        status: this.room!.status,
        seats: this.room!.seats.map((seat, index) =>
          seat ? { ...seat, id: index === seatIndex ? seat.id : undefined } : null
        ),
      },
      game: game
        ? {
            wallRemaining: game.wall.length,
            hand: seatIndex >= 0 ? game.hands[seatIndex] : [],
            handCounts: game.hands.map((hand) => hand.length),
            discards: game.discards,
            turn: game.turn,
            phase: game.phase,
            winner: game.winner,
            lastAction: game.lastAction,
            yourSeat: seatIndex,
          }
        : null,
      messages: this.room!.messages ?? [],
      playerId,
    };
  }

  private broadcast() {
    for (const [socket, meta] of this.sockets) {
      try {
        socket.send(JSON.stringify(this.publicRoomState(meta.playerId)));
      } catch {
        this.sockets.delete(socket);
      }
    }
  }

  private sendError(socket: WebSocket, message: string) {
    socket.send(JSON.stringify({ type: 'ERROR', message }));
  }

  private persist() {
    return this.state.storage.put('room', this.room);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ status: 'ok', service: 'Nine Gates Mahjong', date: new Date().toISOString() });
    }

    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
      const body = await request.json<{ username?: string; email?: string; password?: string }>();
      const username = sanitizeName(body.username ?? '');
      const email = (body.email ?? '').trim().toLowerCase();
      const password = body.password ?? '';
      if (username.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
        return json({ error: 'Invalid registration details.' }, { status: 400 });
      }
      const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ? OR email = ?').bind(username, email).first();
      if (existing) return json({ error: 'Username or email already exists.' }, { status: 409 });
      const userId = crypto.randomUUID();
      const { hash, salt } = await hashPassword(password);
      await env.DB.batch([
        env.DB.prepare('INSERT INTO users (id, username, email, password_hash, password_salt) VALUES (?, ?, ?, ?, ?)').bind(userId, username, email, hash, salt),
        env.DB.prepare('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)').bind(userId, username),
      ]);
      const sessionId = await createSession(userId, env);
      const row = await userById(userId, env);
      return json({ user: publicUser(row!) }, {
        status: 201,
        headers: { 'Set-Cookie': sessionCookie(request, sessionId) },
      });
    }

    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json<{ email?: string; password?: string }>();
      const email = (body.email ?? '').trim().toLowerCase();
      const record = await env.DB.prepare('SELECT id, password_hash, password_salt FROM users WHERE email = ?').bind(email).first<{ id: string; password_hash: string; password_salt: string }>();
      if (!record || !(await verifyPassword(body.password ?? '', record.password_hash, record.password_salt))) {
        return json({ error: 'Invalid email or password.' }, { status: 401 });
      }
      const sessionId = await createSession(record.id, env);
      const row = await userById(record.id, env);
      return json({ user: publicUser(row!) }, {
        headers: { 'Set-Cookie': sessionCookie(request, sessionId) },
      });
    }

    if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
      const sessionId = cookieValue(request, 'ngm_session');
      if (sessionId) await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
      return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie(request, '', 0) } });
    }

    if (url.pathname === '/api/profile' && request.method === 'GET') {
      const row = await currentUser(request, env);
      return json({ user: row ? publicUser(row) : null });
    }

    if (url.pathname === '/api/profile' && request.method === 'PUT') {
      const row = await currentUser(request, env);
      if (!row) return json({ error: 'Unauthorized' }, { status: 401 });
      const body = await request.json<{ avatarTile?: string; displayName?: string }>();
      const displayName = body.displayName ? sanitizeName(body.displayName) : row.display_name;
      const avatarTile = body.avatarTile?.slice(0, 40) || row.avatar_tile;
      await env.DB.prepare('UPDATE profiles SET display_name = ?, avatar_tile = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
        .bind(displayName, avatarTile, row.id).run();
      const updated = await currentUser(request, env);
      return json({ user: publicUser(updated!) });
    }

    if (url.pathname === '/api/leaderboards' && request.method === 'GET') {
      const results = await env.DB.prepare(`
        SELECT u.username, p.display_name, p.avatar_tile, p.rating, p.rated_wins, p.rated_losses, p.games_played
        FROM profiles p JOIN users u ON u.id = p.user_id
        WHERE p.games_played > 0
        ORDER BY p.rating DESC, p.rated_wins DESC
        LIMIT 100
      `).all();
      return json({ entries: results.results });
    }

    if (url.pathname === '/api/rooms' && request.method === 'GET') {
      return json({ rooms: [], message: 'Rooms are private by code until public matchmaking is enabled.' });
    }

    if (url.pathname === '/api/rooms' && request.method === 'POST') {
      const code = createRoomCode();
      const id = env.MAHJONG_ROOM.idFromName(code);
      await env.MAHJONG_ROOM.get(id).fetch(`https://room.internal/${code}`);
      return json({ roomCode: code }, { status: 201 });
    }

    const roomMatch = url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{6})(?:\/websocket)?$/i);
    if (roomMatch) {
      const code = roomMatch[1].toUpperCase();
      const id = env.MAHJONG_ROOM.idFromName(code);
      return env.MAHJONG_ROOM.get(id).fetch(request);
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'Not found' }, { status: 404 });
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type') || '';
    if (
      contentType.includes('text/html') || 
      url.pathname === '/' || 
      url.pathname.endsWith('.html') || 
      url.pathname === '/sitemap.xml' || 
      url.pathname === '/robots.txt'
    ) {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      const nextResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      if (contentType.includes('text/html') && !isAdHelperPath(url.pathname)) {
        return htmlWithRouteSeo(nextResponse, url.pathname);
      }
      return nextResponse;
    }

    return response;
  },
};
