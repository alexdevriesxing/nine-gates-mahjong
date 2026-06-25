import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  chooseAIDiscard,
  createMahjongWall,
  isWinningMahjongHand,
  sortMahjongTiles,
  type MahjongTileInstance,
} from '../MahjongCore';
import { AI_CHARACTERS } from '@shared/constants';
import MahjongTileView from './MahjongTileView';

const SEATS = ['East', 'South', 'West', 'North'] as const;
const PLAYER_NAMES = ['You', AI_CHARACTERS[0].name, AI_CHARACTERS[3].name, AI_CHARACTERS[2].name];
const PLAYER_QUOTES = [
  'Your turn. Read the table.',
  AI_CHARACTERS[0].quote,
  AI_CHARACTERS[3].quote,
  AI_CHARACTERS[2].quote,
];

interface TableState {
  wall: MahjongTileInstance[];
  hands: MahjongTileInstance[][];
  discards: MahjongTileInstance[][];
  turn: number;
  phase: 'draw' | 'discard';
  log: string[];
  winner: number | null;
  handNumber: number;
  lastAction: string;
}

function createTableState(handNumber = 1): TableState {
  const wall = createMahjongWall();
  const hands: MahjongTileInstance[][] = [[], [], [], []];
  for (let round = 0; round < 13; round += 1) {
    hands.forEach((hand) => hand.push(wall.shift()!));
  }
  hands[0].push(wall.shift()!);
  return {
    wall,
    hands: hands.map(sortMahjongTiles),
    discards: [[], [], [], []],
    turn: 0,
    phase: 'discard',
    log: ['The gates open. East begins with a discard.'],
    winner: null,
    handNumber,
    lastAction: 'East is choosing a discard',
  };
}

function DiscardPool({ tiles }: { tiles: MahjongTileInstance[] }) {
  return (
    <div className="discard-pool">
      {tiles.slice(-18).map((tile) => (
        <MahjongTileView key={tile.id} tile={tile} compact />
      ))}
    </div>
  );
}

export default function RealMahjongGame() {
  const [state, setState] = useState<TableState>(() => createTableState());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [speechSeat, setSpeechSeat] = useState<number | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const playerHand = useMemo(() => sortMahjongTiles(state.hands[0]), [state.hands]);
  const isPlayerTurn = state.turn === 0 && state.winner === null;

  const startNewHand = useCallback(() => {
    setState((current) => createTableState(current.handNumber + 1));
    setSelectedId(null);
    setSpeechSeat(null);
  }, []);

  const drawPlayerTile = () => {
    setState((current) => {
      if (current.turn !== 0 || current.phase !== 'draw' || current.wall.length === 0 || current.winner !== null) {
        return current;
      }
      const [drawn, ...wall] = current.wall;
      const hand = sortMahjongTiles([...current.hands[0], drawn]);
      const winner = isWinningMahjongHand(hand) ? 0 : null;
      const hands = [...current.hands];
      hands[0] = hand;
      return {
        ...current,
        wall,
        hands,
        phase: 'discard',
        winner,
        lastAction: winner === 0 ? 'Nine Gates! You completed a winning hand.' : `You drew ${drawn.name}`,
        log: [`You draw ${drawn.name}.`, ...current.log].slice(0, 14),
      };
    });
  };

  const discardPlayerTile = (tileId: string) => {
    setState((current) => {
      if (current.turn !== 0 || current.phase !== 'discard' || current.winner !== null) return current;
      const tile = current.hands[0].find((candidate) => candidate.id === tileId);
      if (!tile) return current;
      const hands = [...current.hands];
      hands[0] = current.hands[0].filter((candidate) => candidate.id !== tileId);
      const discards = current.discards.map((pool) => [...pool]);
      discards[0].push(tile);
      return {
        ...current,
        hands,
        discards,
        turn: 1,
        phase: 'draw',
        lastAction: `You discarded ${tile.name}`,
        log: [`You discard ${tile.name}.`, ...current.log].slice(0, 14),
      };
    });
    setSelectedId(null);
  };

  useEffect(() => {
    if (state.turn === 0 || state.winner !== null) return;
    const seat = state.turn;
    setSpeechSeat(seat);
    const timer = window.setTimeout(() => {
      setState((current) => {
        if (current.turn !== seat || current.winner !== null || current.wall.length === 0) return current;
        const [drawn, ...wall] = current.wall;
        const fullHand = sortMahjongTiles([...current.hands[seat], drawn]);
        if (isWinningMahjongHand(fullHand)) {
          const hands = [...current.hands];
          hands[seat] = fullHand;
          return {
            ...current,
            wall,
            hands,
            winner: seat,
            lastAction: `${PLAYER_NAMES[seat]} declares Mahjong`,
            log: [`${PLAYER_NAMES[seat]} wins the hand.`, ...current.log].slice(0, 14),
          };
        }
        const discarded = chooseAIDiscard(fullHand);
        const hands = [...current.hands];
        hands[seat] = fullHand.filter((tile) => tile.id !== discarded.id);
        const discards = current.discards.map((pool) => [...pool]);
        discards[seat].push(discarded);
        const nextTurn = (seat + 1) % 4;
        return {
          ...current,
          wall,
          hands,
          discards,
          turn: nextTurn,
          phase: 'draw',
          lastAction: `${PLAYER_NAMES[seat]} discarded ${discarded.name}`,
          log: [`${PLAYER_NAMES[seat]} discards ${discarded.name}.`, ...current.log].slice(0, 14),
        };
      });
      setSpeechSeat(null);
    }, 850 / animationSpeed);
    return () => window.clearTimeout(timer);
  }, [state.turn, state.winner, animationSpeed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.querySelector('[data-real-table]')?.requestFullscreen();
      }
      if (event.key === 'Escape') setSelectedId(null);
      if (event.key === 'Enter' && state.phase === 'draw' && state.turn === 0) drawPlayerTile();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: 'real-mahjong-vs-ai',
        table: 'Player is East/bottom; opponents are South/left, West/top, North/right.',
        handNumber: state.handNumber,
        wallRemaining: state.wall.length,
        currentTurn: SEATS[state.turn],
        phase: state.phase,
        winner: state.winner === null ? null : PLAYER_NAMES[state.winner],
        playerHand: playerHand.map(({ id, key, name }) => ({ id, key, name })),
        discardPools: state.discards.map((tiles, index) => ({
          seat: SEATS[index],
          tiles: tiles.map(({ key, name }) => ({ key, name })),
        })),
        lastAction: state.lastAction,
      });
    window.advanceTime = async () => {};
    return () => {
      delete window.render_game_to_text;
    };
  }, [state, playerHand]);

  return (
    <div className="real-table-shell" data-game-shell data-real-table>
      <header className="real-table-header">
        <div>
          <p className="game-eyebrow">Hong Kong inspired training table</p>
          <h1>Real Mahjong vs AI</h1>
          <p>Draw one, discard one, and shape four melds plus a pair before the table does.</p>
        </div>
        <div className="real-table-status">
          <span>Hand {state.handNumber}</span>
          <strong>{state.wall.length}</strong>
          <small>tiles in wall</small>
        </div>
      </header>

      <div className="mahjong-table">
        <div className={`table-seat table-seat--north ${state.turn === 2 ? 'table-seat--active' : ''}`}>
          <div className="table-seat__avatar">M</div>
          <strong>{PLAYER_NAMES[2]}</strong>
          <span>West · {state.hands[2].length} tiles</span>
          {speechSeat === 2 && <blockquote>{PLAYER_QUOTES[2]}</blockquote>}
        </div>
        <div className={`table-seat table-seat--west ${state.turn === 1 ? 'table-seat--active' : ''}`}>
          <div className="table-seat__avatar">U</div>
          <strong>{PLAYER_NAMES[1]}</strong>
          <span>South · {state.hands[1].length} tiles</span>
          {speechSeat === 1 && <blockquote>{PLAYER_QUOTES[1]}</blockquote>}
        </div>
        <div className={`table-seat table-seat--east ${state.turn === 3 ? 'table-seat--active' : ''}`}>
          <div className="table-seat__avatar">C</div>
          <strong>{PLAYER_NAMES[3]}</strong>
          <span>North · {state.hands[3].length} tiles</span>
          {speechSeat === 3 && <blockquote>{PLAYER_QUOTES[3]}</blockquote>}
        </div>

        <div className="table-wall" aria-hidden="true">
          {Array.from({ length: Math.min(40, Math.ceil(state.wall.length / 3)) }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className="table-center">
          <span>{SEATS[state.turn]}</span>
          <strong>{state.winner === null ? state.lastAction : `${PLAYER_NAMES[state.winner]} wins`}</strong>
          <small>{state.phase === 'draw' ? 'Draw phase' : 'Discard phase'}</small>
        </div>

        <div className="table-discards table-discards--north"><DiscardPool tiles={state.discards[2]} /></div>
        <div className="table-discards table-discards--west"><DiscardPool tiles={state.discards[1]} /></div>
        <div className="table-discards table-discards--east"><DiscardPool tiles={state.discards[3]} /></div>
        <div className="table-discards table-discards--south"><DiscardPool tiles={state.discards[0]} /></div>

        <div className={`player-rack ${isPlayerTurn ? 'player-rack--active' : ''}`}>
          {playerHand.map((tile) => (
            <MahjongTileView
              key={tile.id}
              tile={tile}
              compact
              selected={selectedId === tile.id}
              disabled={!isPlayerTurn || state.phase !== 'discard'}
              onClick={() => {
                if (selectedId === tile.id) discardPlayerTile(tile.id);
                else setSelectedId(tile.id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="real-table-actions">
        <button
          className="btn-primary"
          disabled={!isPlayerTurn || state.phase !== 'draw'}
          onClick={drawPlayerTile}
        >
          Draw tile
        </button>
        <button
          className="btn-vermilion"
          disabled={!selectedId || !isPlayerTurn || state.phase !== 'discard'}
          onClick={() => selectedId && discardPlayerTile(selectedId)}
        >
          Discard selected
        </button>
        <button className="btn-secondary" onClick={() => setAnimationSpeed((speed) => (speed === 1 ? 1.7 : 1))}>
          AI speed: {animationSpeed === 1 ? 'Normal' : 'Fast'}
        </button>
        <button className="btn-secondary" onClick={startNewHand}>New hand</button>
      </div>

      <div className="table-log">
        <h2>Table log</h2>
        <ol>
          {state.log.slice(0, 6).map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}
        </ol>
      </div>

      {state.winner !== null && (
        <div className="game-overlay game-overlay--victory">
          <strong>{state.winner === 0 ? 'Nine Gates!' : 'Mahjong'}</strong>
          <span>{PLAYER_NAMES[state.winner]} wins hand {state.handNumber}.</span>
          <button className="btn-primary" onClick={startNewHand}>Deal next hand</button>
        </div>
      )}
    </div>
  );
}
