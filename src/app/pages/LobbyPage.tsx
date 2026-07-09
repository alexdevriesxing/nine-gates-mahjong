import { useEffect, useMemo, useRef, useState } from 'react';
import SEOHead from '../components/SEOHead';
import ResponsiveAdSlot from '../components/ResponsiveAdSlot';
import GameChat, { type ChatMessage } from '../components/GameChat';
import MahjongTileView from '../../game/react/MahjongTileView';
import { generateGuestName } from '@shared/utils';
import type { MahjongTileInstance } from '../../game/MahjongCore';

interface RoomSeat {
  id?: string;
  name: string;
  ready: boolean;
  connected: boolean;
  isAI: boolean;
}

interface MultiplayerState {
  type: 'ROOM_STATE' | 'GAME_STATE';
  playerId?: string;
  room: {
    code: string;
    status: 'waiting' | 'in-progress' | 'finished';
    seats: Array<RoomSeat | null>;
  };
  messages: Array<ChatMessage & { seat: number }>;
  game: null | {
    wallRemaining: number;
    hand: MahjongTileInstance[];
    handCounts: number[];
    discards: MahjongTileInstance[][];
    turn: number;
    phase: 'draw' | 'discard';
    winner: number | null;
    lastAction: string;
    yourSeat: number;
  };
}

const WINDS = ['East', 'South', 'West', 'North'];

export default function LobbyPage() {
  const [name, setName] = useState(() => generateGuestName());
  const [roomCode, setRoomCode] = useState('');
  const [state, setState] = useState<MultiplayerState | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastRoom, setLastRoom] = useState(() => sessionStorage.getItem('ngm_last_room') ?? '');
  const socketRef = useRef<WebSocket | null>(null);

  const websocketOrigin = import.meta.env.DEV
    ? 'ws://127.0.0.1:8787'
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

  const send = (type: string, extra: Record<string, unknown> = {}) => {
    socketRef.current?.send(JSON.stringify({ type, ...extra }));
  };

  const connect = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (code.length !== 6) return;
    socketRef.current?.close();
    setConnecting(true);
    setError('');
    const savedId = sessionStorage.getItem(`ngm_room_${code}`);
    const params = new URLSearchParams({ name });
    if (savedId) params.set('playerId', savedId);
    const socket = new WebSocket(`${websocketOrigin}/api/rooms/${code}/websocket?${params}`);
    socketRef.current = socket;
    socket.addEventListener('open', () => setConnecting(false));
    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(String(event.data));
        if (message.type === 'ERROR') {
          setError(message.message);
          return;
        }
        const next = message as MultiplayerState;
        if (next.playerId) sessionStorage.setItem(`ngm_room_${code}`, next.playerId);
        sessionStorage.setItem('ngm_last_room', code);
        setLastRoom(code);
        setError('');
        setState(next);
        setRoomCode(code);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    });
    socket.addEventListener('close', (event) => {
      setConnecting(false);
      if (event.code !== 1000) setError(event.reason || 'Connection closed.');
    });
    socket.addEventListener('error', () => setError('Could not connect to the room service.'));
  };

  const createRoom = async () => {
    setConnecting(true);
    setError('');
    try {
      const response = await fetch('/api/rooms', { method: 'POST' });
      if (!response.ok) throw new Error('Room creation failed.');
      const data = (await response.json()) as { roomCode: string };
      connect(data.roomCode);
    } catch (reason) {
      setConnecting(false);
      setError(reason instanceof Error ? reason.message : 'Room creation failed.');
    }
  };

  useEffect(() => () => socketRef.current?.close(1000, 'Page closed'), []);

  const game = state?.game;
  const yourTurn = game && game.yourSeat === game.turn;
  const hand = useMemo(() => game?.hand ?? [], [game?.hand]);
  const humanSeats = state?.room.seats.filter((seat) => seat && !seat.isAI) ?? [];
  const everyoneReady = humanSeats.length >= 2 && humanSeats.every((seat) => seat?.ready);
  const yourSeat = state?.room.seats.find((seat) => seat?.id === state.playerId);

  const copyRoomCode = async () => {
    if (!state) return;
    try {
      await navigator.clipboard.writeText(state.room.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy failed. Select the room code and copy it manually.');
    }
  };

  const leaveRoom = () => {
    if (state?.playerId) sessionStorage.removeItem(`ngm_room_${state.room.code}`);
    sessionStorage.removeItem('ngm_last_room');
    setLastRoom('');
    send('LEAVE_ROOM');
    socketRef.current?.close(1000, 'Player left');
    socketRef.current = null;
    setState(null);
    setRoomCode('');
    setSelectedTile(null);
    setError('');
  };

  return (
    <>
      <SEOHead
        title="Multiplayer Mahjong Lobby | Nine Gates Mahjong"
        description="Create or join a real-time authoritative Mahjong room for two to four players, with AI filling empty seats."
        canonical="https://ninegatesmahjong.com/lobby"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Multiplayer Mahjong Lobby',
          description: 'Real-time four-seat Mahjong rooms with server-authoritative turns.',
        }}
      />
      <div className="lobby-page">
        <section className="lobby-hero">
          <p className="game-eyebrow">Live four-seat rooms</p>
          <h1>Multiplayer Mahjong Lobby</h1>
          <p>Create a private room, share its six-character code, and play against another person with AI filling empty seats.</p>
        </section>

        {!state ? (
          <div className="lobby-grid">
            <section className="lobby-card">
              <h2>Your table name</h2>
              <label>
                Display name
                <input className="input-nine" value={name} maxLength={24} onChange={(event) => setName(event.target.value)} />
              </label>
              <button className="btn-primary" onClick={createRoom} disabled={connecting || !name.trim()}>
                {connecting ? 'Opening room…' : 'Create private room'}
              </button>
              <p>Empty seats become server-controlled AI when the hand begins.</p>
            </section>
            <section className="lobby-card">
              <h2>Join by room code</h2>
              <label>
                Six-character code
                <input
                  className="input-nine lobby-code-input"
                  value={roomCode}
                  maxLength={6}
                  placeholder="NINE99"
                  onChange={(event) => setRoomCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                />
              </label>
              <button className="btn-secondary" onClick={() => connect(roomCode)} disabled={connecting || roomCode.length !== 6}>
                Join room
              </button>
              <p>Room actions are validated by the Cloudflare room authority; clients never receive hidden opponent hands.</p>
              {lastRoom && lastRoom !== roomCode && (
                <button className="lobby-reconnect" onClick={() => connect(lastRoom)} disabled={connecting}>
                  Reconnect to room {lastRoom}
                </button>
              )}
            </section>
          </div>
        ) : (
          <section className="multiplayer-room">
            <header>
              <div>
                <p className="game-eyebrow">Room code</p>
                <h2>{state.room.code}</h2>
              </div>
              <span className={`room-status room-status--${state.room.status}`}>{state.room.status}</span>
              <button className="btn-secondary" onClick={copyRoomCode}>{copied ? 'Copied' : 'Copy code'}</button>
              <button className="btn-secondary" onClick={leaveRoom}>Leave room</button>
            </header>

            <div className="room-seats">
              {state.room.seats.map((seat, index) => (
                <article key={index} className={`room-seat ${game?.turn === index ? 'room-seat--turn' : ''}`}>
                  <div>{seat ? seat.name.charAt(0).toUpperCase() : '+'}</div>
                  <strong>{seat?.name ?? 'Open seat'}</strong>
                  <span>{WINDS[index]} · {seat?.isAI ? 'AI' : seat?.ready ? 'Ready' : 'Not ready'}</span>
                </article>
              ))}
            </div>

            {state.room.status === 'waiting' ? (
              <div className="room-actions">
                <button className="btn-secondary" onClick={() => send('READY')}>{yourSeat?.ready ? 'Set not ready' : 'Ready up'}</button>
                <button className="btn-primary" disabled={!everyoneReady} onClick={() => send('START_GAME')}>Start with AI fill</button>
                <span className="room-readiness">
                  {humanSeats.length < 2 ? 'Waiting for a second player.' : everyoneReady ? 'All players ready.' : 'Every player must ready up.'}
                </span>
              </div>
            ) : game ? (
              <div className="multiplayer-game">
                <div className="multiplayer-game__status">
                  <strong>{game.lastAction}</strong>
                  <span>{game.wallRemaining} tiles in wall</span>
                </div>
                <div className="multiplayer-discards">
                  {game.discards.map((pool, index) => (
                    <div key={index}>
                      <span>{WINDS[index]}</span>
                      <div>
                        {pool.slice(-12).map((tile) => <MahjongTileView key={tile.id} tile={tile} compact />)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="multiplayer-hand">
                  {hand.map((tile) => (
                    <MahjongTileView
                      key={tile.id}
                      tile={tile}
                      compact
                      selected={selectedTile === tile.id}
                      disabled={!yourTurn || game.phase !== 'discard'}
                      onClick={() => setSelectedTile(tile.id)}
                    />
                  ))}
                </div>
                <div className="room-actions">
                  <button className="btn-primary" disabled={!yourTurn || game.phase !== 'draw'} onClick={() => send('DRAW_TILE')}>
                    Draw
                  </button>
                  <button
                    className="btn-vermilion"
                    disabled={!yourTurn || game.phase !== 'discard' || !selectedTile}
                    onClick={() => {
                      send('DISCARD_TILE', { tileId: selectedTile });
                      setSelectedTile(null);
                    }}
                  >
                    Discard selected
                  </button>
                </div>
                {game.winner !== null && <div className="room-winner">{state.room.seats[game.winner]?.name} wins the hand.</div>}
              </div>
            ) : null}
            <GameChat
              messages={state.messages ?? []}
              onSend={(text) => send('CHAT', { text })}
              disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN}
            />
          </section>
        )}

        {error && <p className="lobby-error" role="alert">{error}</p>}
        <div className="lobby-ad flex justify-center items-center mt-12 w-full" data-gaio-section="ads">
          <ResponsiveAdSlot
            label="Sponsored"
            placement="lobby-bottom"
            sizes={[
              { media: '(min-width: 768px)', width: 728, height: 90 },
              { width: 320, height: 50 },
            ]}
          />
        </div>
      </div>
    </>
  );
}
