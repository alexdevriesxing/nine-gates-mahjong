import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  canConnectTiles,
  createPairGrid,
  createSolvableSolitaireBoard,
  findSolitaireMatch,
  isSolitaireTileFree,
  reshuffleSolvableSolitaireBoard,
  SOLITAIRE_LAYOUTS,
  type MahjongTileInstance,
  type SolitaireLayout,
  type SolitaireTileInstance,
} from '../MahjongCore';
import { formatTime, getDailySeed, seededRandom, shuffle } from '@shared/utils';
import { recordGameCompletion } from '@shared/utils/gameProgress';
import MahjongTileView from './MahjongTileView';

export type TileMatchMode =
  | 'solitaire'
  | 'daily'
  | 'zen'
  | 'time-attack'
  | 'connect'
  | 'shisen-sho'
  | 'memory';

const MODE_COPY: Record<
  TileMatchMode,
  { title: string; eyebrow: string; description: string }
> = {
  solitaire: {
    title: 'Mahjongg Solitaire',
    eyebrow: 'Classic layered puzzle',
    description: 'Choose a layout and match identical free tiles. A tile is free when nothing covers it and one side is open.',
  },
  daily: {
    title: 'Daily Mahjongg Challenge',
    eyebrow: 'One board for everyone',
    description: 'Today’s seeded board is identical for every player. Clear it efficiently and protect your streak.',
  },
  zen: {
    title: 'Zen Mahjongg',
    eyebrow: 'Untimed quiet play',
    description: 'A calm, solvable layered board with unlimited hints and no score pressure.',
  },
  'time-attack': {
    title: 'Mahjongg Time Attack',
    eyebrow: 'Two-minute sprint',
    description: 'Match any identical visible pair. Fast matches build a combo and add precious seconds.',
  },
  connect: {
    title: 'Mahjong Connect',
    eyebrow: 'Open-path matching',
    description: 'Connect identical tiles with a path containing no more than two turns.',
  },
  'shisen-sho': {
    title: 'Shisen-Sho',
    eyebrow: 'Japanese path puzzle',
    description: 'Clear the flat board by linking pairs across open lanes, including around the outer edge.',
  },
  memory: {
    title: 'Mahjongg Memory',
    eyebrow: 'Recall the hidden pairs',
    description: 'Reveal two tiles at a time and remember where every Mahjong face is hiding.',
  },
};

interface TileMatchGameProps {
  mode: TileMatchMode;
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  } else {
    void document.querySelector('[data-game-shell]')?.requestFullscreen();
  }
}

function Stat({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return (
    <div className={`game-stat ${danger ? 'game-stat--danger' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function GameHeader({
  mode,
  stats,
}: {
  mode: TileMatchMode;
  stats: React.ReactNode;
}) {
  const copy = MODE_COPY[mode];
  return (
    <div className="game-panel__header">
      <div>
        <p className="game-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
      <div className="game-stats">{stats}</div>
    </div>
  );
}

function LayeredMahjongGame({ mode }: { mode: 'solitaire' | 'daily' | 'zen' }) {
  const initialSeed = mode === 'daily' ? getDailySeed() : Date.now();
  const [layout, setLayout] = useState<SolitaireLayout>('fortress');
  const [seed, setSeed] = useState(initialSeed);
  const [tiles, setTiles] = useState<SolitaireTileInstance[]>(() =>
    createSolvableSolitaireBoard(initialSeed, 'fortress')
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintedIds, setHintedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionRecorded = useRef(false);
  const remaining = tiles.filter((tile) => !tile.removed).length;
  const complete = remaining === 0;

  const reset = useCallback(
    (
      nextSeed = mode === 'daily' ? getDailySeed() : Date.now(),
      nextLayout: SolitaireLayout = layout
    ) => {
      setSeed(nextSeed);
      setLayout(nextLayout);
      setTiles(createSolvableSolitaireBoard(nextSeed, nextLayout));
      setSelectedId(null);
      setHintedIds([]);
      setHistory([]);
      setScore(0);
      setCombo(0);
      setElapsed(0);
      setPaused(false);
      completionRecorded.current = false;
    },
    [mode, layout]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!paused && !complete) setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused, complete]);

  useEffect(() => {
    if (!complete || completionRecorded.current) return;
    completionRecorded.current = true;
    recordGameCompletion(mode, score, elapsed);
  }, [complete, mode, score, elapsed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f') toggleFullscreen();
      if (event.key.toLowerCase() === 'h') showHint();
      if (event.key.toLowerCase() === 'u') undo();
      if (event.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode,
        coordinateSystem: 'Board x increases left-to-right; y increases top-to-bottom; z is layer height.',
        seed,
        layout,
        score,
        combo,
        elapsed,
        paused,
        complete,
        remaining,
        selectedId,
        playableTiles: tiles
          .filter((tile) => isSolitaireTileFree(tile, tiles))
          .map(({ id, key, name, x, y, z }) => ({ id, key, name, x, y, z })),
      });
    window.advanceTime = async (milliseconds: number) => {
      if (!paused && !complete) setElapsed((value) => value + milliseconds / 1000);
    };
    return () => {
      delete window.render_game_to_text;
    };
  }, [mode, seed, layout, score, combo, elapsed, paused, complete, remaining, selectedId, tiles]);

  const showHint = useCallback(() => {
    const match = findSolitaireMatch(tiles);
    if (!match) return;
    setHintedIds(match.map((tile) => tile.id));
    if (mode !== 'zen') setScore((value) => Math.max(0, value - 150));
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHintedIds([]), 1600);
  }, [tiles, mode]);

  const undo = useCallback(() => {
    const latest = history[history.length - 1];
    if (!latest) return;
    setTiles((current) =>
      current.map((tile) => (latest.includes(tile.id) ? { ...tile, removed: false } : tile))
    );
    setHistory((current) => current.slice(0, -1));
    setScore((value) => Math.max(0, value - 100));
    setCombo(0);
  }, [history]);

  const shuffleRemaining = () => {
    setTiles((current) => reshuffleSolvableSolitaireBoard(current, Date.now()));
    setSelectedId(null);
    setCombo(0);
    if (mode !== 'zen') setScore((value) => Math.max(0, value - 300));
  };

  const selectTile = (tile: SolitaireTileInstance) => {
    if (paused || complete || !isSolitaireTileFree(tile, tiles)) return;
    if (selectedId === tile.id) {
      setSelectedId(null);
      return;
    }
    if (!selectedId) {
      setSelectedId(tile.id);
      return;
    }

    const selected = tiles.find((candidate) => candidate.id === selectedId);
    if (selected?.key === tile.key) {
      const pair = [selected.id, tile.id];
      const nextCombo = combo + 1;
      setTiles((current) =>
        current.map((candidate) => (pair.includes(candidate.id) ? { ...candidate, removed: true } : candidate))
      );
      setHistory((current) => [...current, pair]);
      setScore((value) => value + 100 + nextCombo * 25);
      setCombo(nextCombo);
      setSelectedId(null);
      setHintedIds([]);
    } else {
      setSelectedId(tile.id);
      setCombo(0);
    }
  };

  return (
    <div className="game-panel" data-game-shell>
      <GameHeader
        mode={mode}
        stats={
          <>
            {mode !== 'zen' && <Stat label="Score" value={score.toLocaleString()} />}
            <Stat label="Tiles" value={remaining} />
            <Stat label="Time" value={formatTime(elapsed)} />
          </>
        }
      />

      {mode !== 'daily' && (
        <div className="solitaire-layout-picker" role="group" aria-label="Solitaire layout">
          {SOLITAIRE_LAYOUTS.map((candidate) => (
            <button
              key={candidate.id}
              className={layout === candidate.id ? 'is-active' : ''}
              type="button"
              aria-pressed={layout === candidate.id}
              title={candidate.description}
              onClick={() => reset(Date.now(), candidate.id)}
            >
              <strong>{candidate.name}</strong>
              <span>{candidate.description}</span>
            </button>
          ))}
        </div>
      )}

      <div className={`layered-board ${paused ? 'layered-board--paused' : ''}`}>
        <div className="board-ambient" aria-hidden="true" />
        {tiles.map((tile) => {
          if (tile.removed) return null;
          const playable = isSolitaireTileFree(tile, tiles);
          return (
            <MahjongTileView
              key={tile.id}
              tile={tile}
              selected={selectedId === tile.id}
              highlighted={hintedIds.includes(tile.id)}
              disabled={!playable || paused}
              onClick={() => selectTile(tile)}
              className="layered-board__tile"
              style={
                {
                  '--tile-left': `${7 + (tile.x / 14) * 86}%`,
                  '--tile-top': `${10 + (tile.y / 10) * 76}%`,
                  '--tile-z': tile.z,
                } as React.CSSProperties
              }
            />
          );
        })}
        {paused && <div className="game-overlay"><strong>Paused</strong><span>Press resume to continue.</span></div>}
        {complete && (
          <div className="game-overlay game-overlay--victory">
            <strong>Gate cleared</strong>
            <span>{mode === 'daily' ? 'Today’s challenge is complete.' : 'A flawless board.'}</span>
            <button className="btn-primary" onClick={() => reset()}>Play again</button>
          </div>
        )}
      </div>

      <div className="game-controls" aria-label="Game controls">
        <button onClick={showHint}>Hint <kbd>H</kbd></button>
        <button onClick={undo} disabled={history.length === 0}>Undo <kbd>U</kbd></button>
        <button onClick={shuffleRemaining}>Shuffle</button>
        <button onClick={() => setPaused((value) => !value)}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={toggleFullscreen}>Fullscreen <kbd>F</kbd></button>
        <button className="game-controls__danger" onClick={() => reset()}>New board</button>
      </div>
      <p className="game-help">Touch or click a free tile, then choose its identical partner. Keyboard: H hint, U undo, F fullscreen.</p>
    </div>
  );
}

function GridMahjongGame({ mode }: { mode: 'time-attack' | 'connect' | 'shisen-sho' | 'memory' }) {
  const isMemory = mode === 'memory';
  const rows = isMemory ? 4 : 6;
  const columns = isMemory ? 6 : 8;
  const pairCount = (rows * columns) / 2;
  const [seed, setSeed] = useState(Date.now());
  const [tiles, setTiles] = useState<Array<MahjongTileInstance | null>>(() =>
    createPairGrid(pairCount, Date.now(), mode === 'connect' || mode === 'shisen-sho')
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(mode === 'time-attack' ? 120 : 0);
  const [paused, setPaused] = useState(false);
  const completionRecorded = useRef(false);
  const remaining = tiles.filter(Boolean).length;
  const complete = remaining === 0;
  const timedOut = mode === 'time-attack' && seconds <= 0 && !complete;
  const gridKeys = useMemo(() => tiles.map((tile) => tile?.key ?? null), [tiles]);

  const reset = useCallback(() => {
    const nextSeed = Date.now();
    setSeed(nextSeed);
    setTiles(createPairGrid(pairCount, nextSeed, mode === 'connect' || mode === 'shisen-sho'));
    setSelected(null);
    setRevealed(new Set());
    setLocked(false);
    setScore(0);
    setCombo(0);
    setMoves(0);
    setSeconds(mode === 'time-attack' ? 120 : 0);
    setPaused(false);
    completionRecorded.current = false;
  }, [mode, pairCount]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (paused || complete || timedOut) return;
      setSeconds((value) => value + (mode === 'time-attack' ? -1 : 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode, paused, complete, timedOut]);

  useEffect(() => {
    if (!complete || completionRecorded.current) return;
    completionRecorded.current = true;
    const duration = mode === 'time-attack' ? Math.max(0, 120 - seconds) : seconds;
    recordGameCompletion(mode, score, duration);
  }, [complete, mode, score, seconds]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f') toggleFullscreen();
      if (event.key.toLowerCase() === 'h') showHint();
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode,
        coordinateSystem: `Grid is ${rows} rows by ${columns} columns, row-major indices.`,
        seed,
        score,
        combo,
        moves,
        seconds,
        paused,
        complete,
        remaining,
        selected,
        visibleTiles: tiles.map((tile, index) =>
          tile
            ? {
                index,
                key: isMemory && !revealed.has(index) ? 'concealed' : tile.key,
                name: isMemory && !revealed.has(index) ? 'concealed' : tile.name,
              }
            : null
        ),
      });
    window.advanceTime = async (milliseconds: number) => {
      if (!paused && !complete && !timedOut) {
        setSeconds((value) => value + (mode === 'time-attack' ? -1 : 1) * (milliseconds / 1000));
      }
    };
    return () => {
      delete window.render_game_to_text;
    };
  }, [
    mode,
    rows,
    columns,
    seed,
    score,
    combo,
    moves,
    seconds,
    paused,
    complete,
    remaining,
    selected,
    tiles,
    isMemory,
    revealed,
    timedOut,
  ]);

  const canMatch = useCallback(
    (first: number, second: number) => {
      if (!tiles[first] || tiles[first]?.key !== tiles[second]?.key) return false;
      if (mode === 'connect' || mode === 'shisen-sho') {
        return canConnectTiles(gridKeys, rows, columns, first, second);
      }
      return true;
    },
    [tiles, mode, gridKeys, rows, columns]
  );

  const findGridMatch = useCallback((): [number, number] | null => {
    for (let first = 0; first < tiles.length; first += 1) {
      if (!tiles[first]) continue;
      for (let second = first + 1; second < tiles.length; second += 1) {
        if (canMatch(first, second)) return [first, second];
      }
    }
    return null;
  }, [tiles, canMatch]);

  const showHint = useCallback(() => {
    const match = findGridMatch();
    if (!match) {
      shuffleGrid();
      return;
    }
    setRevealed((current) => new Set([...current, ...match]));
    setSelected(match[0]);
    window.setTimeout(() => {
      setSelected(null);
      if (isMemory) setRevealed(new Set());
    }, 1400);
    setScore((value) => Math.max(0, value - 100));
  }, [findGridMatch, isMemory]);

  const shuffleGrid = useCallback(() => {
    const active = tiles.filter((tile): tile is MahjongTileInstance => tile !== null);
    const pairs = new Map<string, MahjongTileInstance[]>();
    active.forEach((tile) => pairs.set(tile.key, [...(pairs.get(tile.key) ?? []), tile]));
    const ordered: MahjongTileInstance[] = [];
    const keys = shuffle([...pairs.keys()], seededRandom(Date.now()));
    keys.forEach((key) => ordered.push(...(pairs.get(key) ?? [])));
    const shuffled =
      mode === 'connect' || mode === 'shisen-sho'
        ? ordered
        : shuffle(ordered, seededRandom(Date.now() + 1));
    let index = 0;
    setTiles((current) => current.map((tile) => (tile ? shuffled[index++] : null)));
    setSelected(null);
    setRevealed(new Set());
    setCombo(0);
  }, [tiles, mode]);

  const selectGridTile = (index: number) => {
    const tile = tiles[index];
    if (!tile || locked || paused || timedOut || complete) return;
    if (selected === index) {
      if (!isMemory) setSelected(null);
      return;
    }

    if (selected === null) {
      setSelected(index);
      if (isMemory) setRevealed((current) => new Set(current).add(index));
      return;
    }

    setMoves((value) => value + 1);
    if (isMemory) setRevealed((current) => new Set([...current, index]));
    if (canMatch(selected, index)) {
      const nextCombo = combo + 1;
      setLocked(true);
      window.setTimeout(() => {
        setTiles((current) => current.map((candidate, tileIndex) =>
          tileIndex === selected || tileIndex === index ? null : candidate
        ));
        setRevealed(new Set());
        setSelected(null);
        setLocked(false);
      }, isMemory ? 420 : 160);
      setScore((value) => value + 100 + nextCombo * 20);
      setCombo(nextCombo);
      if (mode === 'time-attack') setSeconds((value) => value + Math.min(4, nextCombo));
    } else {
      setCombo(0);
      setLocked(true);
      window.setTimeout(() => {
        setRevealed(new Set());
        setSelected(null);
        setLocked(false);
      }, isMemory ? 700 : 220);
      if (!isMemory) setSelected(index);
    }
  };

  return (
    <div className="game-panel" data-game-shell>
      <GameHeader
        mode={mode}
        stats={
          <>
            <Stat label="Score" value={score.toLocaleString()} />
            <Stat label={isMemory ? 'Pairs' : 'Tiles'} value={isMemory ? remaining / 2 : remaining} />
            <Stat
              label={mode === 'time-attack' ? 'Time left' : 'Time'}
              value={formatTime(seconds)}
              danger={mode === 'time-attack' && seconds < 20}
            />
          </>
        }
      />

      <div className={`grid-board grid-board--${columns}`} style={{ '--grid-columns': columns } as React.CSSProperties}>
        {tiles.map((tile, index) =>
          tile ? (
            <MahjongTileView
              key={tile.id}
              tile={tile}
              compact
              concealed={isMemory && !revealed.has(index)}
              selected={selected === index}
              onClick={() => selectGridTile(index)}
            />
          ) : (
            <div key={`empty-${index}`} className="grid-board__empty" aria-hidden="true" />
          )
        )}
        {paused && <div className="game-overlay"><strong>Paused</strong><span>Your board is waiting.</span></div>}
        {(complete || timedOut) && (
          <div className={`game-overlay ${complete ? 'game-overlay--victory' : ''}`}>
            <strong>{complete ? 'Board cleared' : 'Time’s up'}</strong>
            <span>{complete ? `${score.toLocaleString()} points in ${moves} moves.` : 'Take another run at the gate.'}</span>
            <button className="btn-primary" onClick={reset}>Play again</button>
          </div>
        )}
      </div>

      <div className="game-controls">
        <button onClick={showHint}>Hint <kbd>H</kbd></button>
        {!isMemory && <button onClick={shuffleGrid}>Shuffle</button>}
        <button onClick={() => setPaused((value) => !value)}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={toggleFullscreen}>Fullscreen <kbd>F</kbd></button>
        <button className="game-controls__danger" onClick={reset}>New board</button>
      </div>
      <p className="game-help">Large touch targets work with mouse, stylus, and fingers. Press F for fullscreen and H for a hint.</p>
    </div>
  );
}

export default function TileMatchGame({ mode }: TileMatchGameProps) {
  if (mode === 'solitaire' || mode === 'daily' || mode === 'zen') {
    return <LayeredMahjongGame mode={mode} />;
  }
  return <GridMahjongGame mode={mode} />;
}
