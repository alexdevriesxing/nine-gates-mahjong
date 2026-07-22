import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createMahjongWall,
  findWinningMahjongDraws,
  isWinningMahjongHand,
  sortMahjongTiles,
  type MahjongSuit,
  type MahjongTileInstance,
} from '../MahjongCore';
import MahjongTileView from './MahjongTileView';

export type VariantRuleset =
  | 'hong-kong'
  | 'riichi'
  | 'mcr'
  | 'american'
  | 'taiwanese'
  | 'sichuan'
  | 'zung-jung';

interface RulesetConfig {
  title: string;
  eyebrow: string;
  focus: string;
  handSize: number;
  meldCount: number;
  target: string;
  charleston?: boolean;
  riichi?: boolean;
  voidSuit?: boolean;
}

const RULESETS: Record<VariantRuleset, RulesetConfig> = {
  'hong-kong': {
    title: 'Hong Kong Hand Trainer',
    eyebrow: 'Three-fan foundations',
    focus: 'Build four melds and a pair while keeping flexible chow and pung shapes.',
    handSize: 13,
    meldCount: 4,
    target: 'Common table target: a legal hand meeting the selected fan minimum.',
  },
  riichi: {
    title: 'Riichi Readiness Trainer',
    eyebrow: 'Tenpai, waits, and riichi',
    focus: 'Find a discard that leaves the hand in tenpai, then declare riichi before drawing the winner.',
    handSize: 13,
    meldCount: 4,
    target: 'Winning target: four melds, a pair, and at least one yaku.',
    riichi: true,
  },
  mcr: {
    title: 'MCR Pattern Trainer',
    eyebrow: 'Eight-point foundations',
    focus: 'Shape a standard hand while preserving combinations that can reach the MCR eight-point minimum.',
    handSize: 13,
    meldCount: 4,
    target: 'Tournament target: a legal hand worth at least eight points before flowers.',
  },
  american: {
    title: 'American Mahjongg Trainer',
    eyebrow: 'Charleston and card-hand foundations',
    focus: 'Practice the right, across, and left Charleston passes before working a guided card-style hand.',
    handSize: 13,
    meldCount: 4,
    target: 'Match play uses the exact combinations printed on the current annual card.',
    charleston: true,
  },
  taiwanese: {
    title: 'Taiwanese 16-Tile Trainer',
    eyebrow: 'Five melds and a pair',
    focus: 'Manage the larger sixteen-tile hand and complete five melds plus one pair.',
    handSize: 16,
    meldCount: 5,
    target: 'Winning target: seventeen tiles arranged as five melds and one pair.',
  },
  sichuan: {
    title: 'Sichuan Missing-Suit Trainer',
    eyebrow: 'Dingque and Blood Battle foundations',
    focus: 'Declare one suit as missing, discard every tile from it first, then finish a legal two-suit hand.',
    handSize: 13,
    meldCount: 4,
    target: 'Blood Battle target: four melds and a pair using no honors and at most two suits.',
    voidSuit: true,
  },
  'zung-jung': {
    title: 'Zung Jung Pattern Trainer',
    eyebrow: 'Additive competitive scoring',
    focus: 'Complete a flexible standard hand, then evaluate every qualifying pattern instead of stopping at one label.',
    handSize: 13,
    meldCount: 4,
    target: 'Scoring target: a legal hand whose compatible Zung Jung patterns are added together.',
  },
};

interface TrainerState {
  wall: MahjongTileInstance[];
  hand: MahjongTileInstance[];
  playerDiscards: MahjongTileInstance[];
  opponentDiscards: MahjongTileInstance[][];
  phase: 'void-suit' | 'charleston' | 'discard' | 'draw' | 'won' | 'wall-empty';
  charlestonPass: number;
  selectedIds: string[];
  riichiDeclared: boolean;
  voidSuit: MahjongSuit | null;
  turns: number;
  lastAction: string;
}

const STANDARD_READY_KEYS = [
  'characters:1', 'characters:2', 'characters:3',
  'characters:4', 'characters:5', 'characters:6',
  'circles:2', 'circles:3', 'circles:4',
  'bamboo:7', 'bamboo:7', 'bamboo:7',
  'dragons:red',
];

const TAIWANESE_READY_KEYS = [
  ...STANDARD_READY_KEYS.slice(0, 9),
  'bamboo:2', 'bamboo:3', 'bamboo:4',
  'bamboo:7', 'bamboo:7', 'bamboo:7',
  'dragons:red',
];

const AMERICAN_READY_KEYS = [
  'characters:1', 'characters:1', 'characters:1',
  'characters:2', 'characters:2', 'characters:2',
  'characters:3', 'characters:3', 'characters:3',
  'winds:east', 'winds:east', 'winds:east',
  'dragons:red',
];

const SICHUAN_READY_KEYS = [
  'characters:1', 'characters:2', 'characters:3',
  'characters:4', 'characters:5', 'characters:6',
  'circles:2', 'circles:3', 'circles:4',
  'circles:7', 'circles:7', 'circles:7',
  'circles:9',
];

function drawKey(wall: MahjongTileInstance[], key: string) {
  const index = wall.findIndex((tile) => tile.key === key);
  if (index < 0) throw new Error(`Practice wall is missing ${key}.`);
  return wall.splice(index, 1)[0];
}

function createGuidedHand(ruleset: VariantRuleset, includeDiscard: boolean) {
  const wall = createMahjongWall().filter(
    (tile) => ruleset !== 'sichuan' || ['characters', 'circles', 'bamboo'].includes(tile.suit)
  );
  const keys =
    ruleset === 'taiwanese'
      ? TAIWANESE_READY_KEYS
      : ruleset === 'american'
        ? AMERICAN_READY_KEYS
        : ruleset === 'sichuan'
          ? SICHUAN_READY_KEYS
          : STANDARD_READY_KEYS;
  const hand = keys.map((key) => drawKey(wall, key));
  if (includeDiscard) hand.push(drawKey(wall, ruleset === 'sichuan' ? 'bamboo:9' : 'dragons:white'));

  const winningTile = drawKey(wall, ruleset === 'sichuan' ? 'circles:9' : 'dragons:red');
  const opponentTiles = ruleset === 'sichuan'
    ? [drawKey(wall, 'bamboo:1'), drawKey(wall, 'bamboo:2'), drawKey(wall, 'bamboo:3')]
    : [drawKey(wall, 'winds:north'), drawKey(wall, 'winds:west'), drawKey(wall, 'winds:south')];
  wall.unshift(...opponentTiles, winningTile);

  return { wall, hand: sortMahjongTiles(hand) };
}

function createTrainerState(ruleset: VariantRuleset): TrainerState {
  const config = RULESETS[ruleset];
  const guided = createGuidedHand(ruleset, !config.charleston);
  return {
    wall: guided.wall,
    hand: guided.hand,
    playerDiscards: [],
    opponentDiscards: [[], [], []],
    phase: config.charleston ? 'charleston' : config.voidSuit ? 'void-suit' : 'discard',
    charlestonPass: 0,
    selectedIds: [],
    riichiDeclared: false,
    voidSuit: null,
    turns: 0,
    lastAction: config.charleston
      ? 'Select three tiles for the right pass.'
      : config.voidSuit
        ? 'Declare the suit you will remove from your hand. Bamboo is the guided choice.'
        : 'Choose the least useful tile and discard it.',
  };
}

const PASS_NAMES = ['right', 'across', 'left'];

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.querySelector('[data-variant-trainer]')?.requestFullscreen();
}

export default function VariantMahjongTrainer({ ruleset }: { ruleset: VariantRuleset }) {
  const config = RULESETS[ruleset];
  const [state, setState] = useState<TrainerState>(() => createTrainerState(ruleset));

  const waits = useMemo(
    () =>
      state.phase === 'draw' || state.phase === 'charleston' || state.phase === 'void-suit'
        ? []
        : findWinningMahjongDraws(
            state.hand.filter((tile) => !state.selectedIds.includes(tile.id)),
            config.meldCount
          ),
    [state.hand, state.phase, state.selectedIds, config.meldCount]
  );

  const reset = useCallback(() => setState(createTrainerState(ruleset)), [ruleset]);

  const toggleTile = (tileId: string) => {
    setState((current) => {
      if (current.phase !== 'charleston' && current.phase !== 'discard') return current;
      const selected = current.selectedIds.includes(tileId);
      if (selected) {
        return { ...current, selectedIds: current.selectedIds.filter((id) => id !== tileId) };
      }
      const limit = current.phase === 'charleston' ? 3 : 1;
      return {
        ...current,
        selectedIds:
          limit === 1 ? [tileId] : current.selectedIds.length < limit ? [...current.selectedIds, tileId] : current.selectedIds,
      };
    });
  };

  const declareVoidSuit = (suit: Extract<MahjongSuit, 'characters' | 'circles' | 'bamboo'>) => {
    setState((current) => {
      if (current.phase !== 'void-suit') return current;
      const suitCount = current.hand.filter((tile) => tile.suit === suit).length;
      return {
        ...current,
        voidSuit: suit,
        phase: 'discard',
        lastAction: suitCount > 0
          ? `${suitCount} ${suit} tile${suitCount === 1 ? '' : 's'} must be discarded before any other suit.`
          : `${suit} declared missing. The hand already satisfies that part of dingque.`,
      };
    });
  };

  const passCharleston = () => {
    setState((current) => {
      if (current.phase !== 'charleston' || current.selectedIds.length !== 3) return current;
      const remaining = current.hand.filter((tile) => !current.selectedIds.includes(tile.id));
      const wall = [...current.wall];
      const incoming = wall.splice(0, 3);
      const nextPass = current.charlestonPass + 1;
      if (nextPass >= 3) {
        const guided = createGuidedHand('american', true);
        return {
          ...current,
          wall: guided.wall,
          hand: guided.hand,
          phase: 'discard',
          charlestonPass: nextPass,
          selectedIds: [],
          lastAction: 'Charleston complete. Discard the tile that does not support the guided card line.',
        };
      }
      return {
        ...current,
        wall,
        hand: sortMahjongTiles([...remaining, ...incoming]),
        charlestonPass: nextPass,
        selectedIds: [],
        lastAction: `Pass ${PASS_NAMES[nextPass - 1]} complete. Select three tiles to pass ${PASS_NAMES[nextPass]}.`,
      };
    });
  };

  const discardSelected = (declareRiichi = false) => {
    setState((current) => {
      if (current.phase !== 'discard' || current.selectedIds.length !== 1) return current;
      const tile = current.hand.find((candidate) => candidate.id === current.selectedIds[0]);
      if (!tile) return current;
      if (
        current.voidSuit &&
        current.hand.some((candidate) => candidate.suit === current.voidSuit) &&
        tile.suit !== current.voidSuit
      ) {
        return {
          ...current,
          lastAction: `Dingque requires discarding every ${current.voidSuit} tile first.`,
        };
      }
      const hand = current.hand.filter((candidate) => candidate.id !== tile.id);
      if (declareRiichi && findWinningMahjongDraws(hand, config.meldCount).length === 0) return current;

      const wall = [...current.wall];
      const opponentDiscards = current.opponentDiscards.map((pool) => [...pool]);
      for (let opponent = 0; opponent < 3 && wall.length > 0; opponent += 1) {
        opponentDiscards[opponent].push(wall.shift()!);
      }
      return {
        ...current,
        wall,
        hand,
        playerDiscards: [...current.playerDiscards, tile],
        opponentDiscards,
        phase: wall.length > 0 ? 'draw' : 'wall-empty',
        selectedIds: [],
        riichiDeclared: current.riichiDeclared || declareRiichi,
        turns: current.turns + 1,
        lastAction: declareRiichi
          ? `Riichi declared on the ${tile.name} discard. Draw for the wait.`
          : `You discarded ${tile.name}. Draw the next tile.`,
      };
    });
  };

  const drawTile = () => {
    setState((current) => {
      if (current.phase !== 'draw' || current.wall.length === 0) return current;
      const [drawn, ...wall] = current.wall;
      const hand = sortMahjongTiles([...current.hand, drawn]);
      const won = isWinningMahjongHand(hand, config.meldCount);
      return {
        ...current,
        wall,
        hand,
        phase: won ? 'won' : 'discard',
        lastAction: won
          ? `${drawn.name} completes the guided ${config.meldCount}-meld structure.`
          : `You drew ${drawn.name}. Choose a discard.`,
      };
    });
  };

  const showHint = () => {
    setState((current) => {
      if (current.phase !== 'discard') return current;
      const forcedVoidTile = current.voidSuit
        ? current.hand.find((tile) => tile.suit === current.voidSuit)
        : null;
      if (forcedVoidTile) {
        return {
          ...current,
          selectedIds: [forcedVoidTile.id],
          lastAction: `Hint: discard this ${current.voidSuit} tile to satisfy your declared missing suit.`,
        };
      }
      const hintCandidates = [...current.hand].sort((a, b) =>
        Number(b.key === 'dragons:white') - Number(a.key === 'dragons:white')
      );
      const best = hintCandidates.reduce<{ id: string; waits: number } | null>((currentBest, tile) => {
        const waitCount = findWinningMahjongDraws(
          current.hand.filter((candidate) => candidate.id !== tile.id),
          config.meldCount
        ).length;
        return !currentBest || waitCount > currentBest.waits
          ? { id: tile.id, waits: waitCount }
          : currentBest;
      }, null);
      return best
        ? {
            ...current,
            selectedIds: [best.id],
            lastAction: best.waits > 0 ? `Hint: this discard leaves ${best.waits} winning tile type.` : 'Hint: this tile has the weakest shape.',
          }
        : current;
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f') toggleFullscreen();
      if (event.key.toLowerCase() === 'h') showHint();
      if (event.key === 'Escape') setState((current) => ({ ...current, selectedIds: [] }));
      if (event.key === 'Enter' && state.phase === 'draw') drawTile();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: 'variant-mahjong-trainer',
        ruleset,
        phase: state.phase,
        handSizeTarget: config.handSize,
        meldCountTarget: config.meldCount,
        wallRemaining: state.wall.length,
        turns: state.turns,
        riichiDeclared: state.riichiDeclared,
        voidSuit: state.voidSuit,
        charlestonPass: state.charlestonPass,
        selectedIds: state.selectedIds,
        waits: waits.map(({ key, name }) => ({ key, name })),
        hand: state.hand.map(({ id, key, name }) => ({ id, key, name })),
        lastAction: state.lastAction,
      });
    window.advanceTime = async () => {};
    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [ruleset, config, state, waits]);

  const canDeclareRiichi =
    Boolean(config.riichi) &&
    !state.riichiDeclared &&
    state.phase === 'discard' &&
    state.selectedIds.length === 1 &&
    waits.length > 0;

  return (
    <section className="variant-trainer" data-game-shell data-variant-trainer>
      <header className="variant-trainer__header">
        <div>
          <p className="game-eyebrow">{config.eyebrow}</p>
          <h2>{config.title}</h2>
          <p>{config.focus}</p>
        </div>
        <div className="variant-trainer__stats">
          <span><strong>{state.wall.length}</strong> wall</span>
          <span><strong>{state.turns}</strong> turns</span>
          <span><strong>{config.handSize}</strong> held</span>
        </div>
      </header>

      <div className="variant-trainer__rule">
        <strong>Ruleset target</strong>
        <span>{config.target}</span>
      </div>

      <div className="variant-trainer__table">
        <div className="variant-trainer__opponents">
          {state.opponentDiscards.map((pool, index) => (
            <div key={index}>
              <span>{['South', 'West', 'North'][index]}</span>
              <div>{pool.slice(-6).map((tile) => <MahjongTileView key={tile.id} tile={tile} compact />)}</div>
            </div>
          ))}
        </div>
        <div className="variant-trainer__status" aria-live="polite">
          <strong>{state.phase === 'won' ? 'Hand complete' : state.lastAction}</strong>
          {waits.length > 0 && <span>Current wait: {waits.map((tile) => tile.name).join(', ')}</span>}
          {state.riichiDeclared && <span className="badge badge-vermilion">Riichi declared</span>}
          {state.voidSuit && <span className="badge badge-gold">Missing suit: {state.voidSuit}</span>}
        </div>
        <div className="variant-trainer__hand">
          {state.hand.map((tile) => (
            <MahjongTileView
              key={tile.id}
              tile={tile}
              compact
              selected={state.selectedIds.includes(tile.id)}
              disabled={state.phase !== 'charleston' && state.phase !== 'discard'}
              onClick={() => toggleTile(tile.id)}
            />
          ))}
        </div>
      </div>

      <div className="real-table-actions">
        {state.phase === 'void-suit' ? (
          <div className="variant-trainer__declaration" role="group" aria-label="Declare missing suit">
            {(['characters', 'circles', 'bamboo'] as const).map((suit) => {
              const count = state.hand.filter((tile) => tile.suit === suit).length;
              return (
                <button
                  className={suit === 'bamboo' ? 'btn-primary' : 'btn-secondary'}
                  key={suit}
                  type="button"
                  onClick={() => declareVoidSuit(suit)}
                >
                  Declare {suit} as missing ({count})
                </button>
              );
            })}
          </div>
        ) : state.phase === 'charleston' ? (
          <button className="btn-primary" disabled={state.selectedIds.length !== 3} onClick={passCharleston}>
            Pass {PASS_NAMES[state.charlestonPass]} ({state.selectedIds.length}/3)
          </button>
        ) : (
          <>
            <button className="btn-primary" disabled={state.phase !== 'draw'} onClick={drawTile}>Draw tile</button>
            <button className="btn-vermilion" disabled={state.phase !== 'discard' || state.selectedIds.length !== 1} onClick={() => discardSelected()}>
              Discard selected
            </button>
            {config.riichi && (
              <button className="btn-secondary" disabled={!canDeclareRiichi} onClick={() => discardSelected(true)}>
                Declare riichi
              </button>
            )}
            <button className="btn-secondary" disabled={state.phase !== 'discard'} onClick={showHint}>Hint <kbd>H</kbd></button>
          </>
        )}
        <button className="btn-secondary" onClick={toggleFullscreen}>Fullscreen <kbd>F</kbd></button>
        <button className="btn-secondary" onClick={reset}>New practice hand</button>
      </div>

      {(state.phase === 'won' || state.phase === 'wall-empty') && (
        <div className={`game-overlay ${state.phase === 'won' ? 'game-overlay--victory' : ''}`}>
          <strong>{state.phase === 'won' ? 'Structure complete' : 'Wall exhausted'}</strong>
          <span>{state.phase === 'won' ? config.target : 'Start a new guided practice hand and try another discard line.'}</span>
          <button className="btn-primary" onClick={reset}>Practice again</button>
        </div>
      )}
    </section>
  );
}
