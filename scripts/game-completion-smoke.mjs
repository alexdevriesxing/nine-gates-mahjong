import {
  canConnectTiles,
  createPairGrid,
  createSolvableSolitaireBoard,
  getFace,
  isSolitaireTileFree,
  isWinningMahjongHand,
} from '../src/game/MahjongCore.ts';

function completeSolitaire(seed, layout = 'fortress') {
  const tiles = createSolvableSolitaireBoard(seed, layout);
  let moves = 0;
  while (tiles.some((tile) => !tile.removed)) {
    const free = tiles.filter((tile) => isSolitaireTileFree(tile, tiles));
    let pair = null;
    for (let first = 0; first < free.length; first += 1) {
      const second = free.slice(first + 1).find((tile) => tile.key === free[first].key);
      if (second) {
        pair = [free[first], second];
        break;
      }
    }
    if (!pair) throw new Error(`Solitaire ${layout} seed ${seed} deadlocked after ${moves} moves.`);
    pair.forEach((tile) => { tile.removed = true; });
    moves += 1;
  }
  return moves;
}

function completeAdjacentGrid(seed) {
  const rows = 6;
  const columns = 8;
  const tiles = createPairGrid(24, seed, true);
  const grid = tiles.map((tile) => tile.key);
  let moves = 0;
  while (grid.some(Boolean)) {
    let pair = null;
    for (let index = 0; index < grid.length; index += 1) {
      if (!grid[index]) continue;
      for (let candidate = index + 1; candidate < grid.length; candidate += 1) {
        if (grid[index] === grid[candidate] && canConnectTiles(grid, rows, columns, index, candidate)) {
          pair = [index, candidate];
          break;
        }
      }
      if (pair) break;
    }
    if (!pair) throw new Error(`Connect seed ${seed} deadlocked after ${moves} moves.`);
    grid[pair[0]] = null;
    grid[pair[1]] = null;
    moves += 1;
  }
  return moves;
}

const standardWinKeys = [
  'characters:1', 'characters:2', 'characters:3',
  'characters:4', 'characters:5', 'characters:6',
  'circles:2', 'circles:3', 'circles:4',
  'bamboo:7', 'bamboo:7', 'bamboo:7',
  'dragons:red', 'dragons:red',
];
const winningHand = standardWinKeys.map((key, index) => ({ ...getFace(key), id: `known-${index}` }));

const solitaireLayouts = ['fortress', 'courtyard', 'pagoda'];
const solitaireRuns = Object.fromEntries(solitaireLayouts.map((layout) => [
  layout,
  Array.from({ length: 80 }, (_, index) => completeSolitaire(20260624 + index, layout)),
]));
const connectRuns = Array.from({ length: 80 }, (_, index) => completeAdjacentGrid(20260624 + index));

if (!isWinningMahjongHand(winningHand)) throw new Error('Known standard Mahjong hand was not recognized.');

console.log(JSON.stringify({
  solitaireBoardsCompleted: Object.values(solitaireRuns).reduce((total, runs) => total + runs.length, 0),
  solitaireMovesPerLayout: Object.fromEntries(
    Object.entries(solitaireRuns).map(([layout, runs]) => [layout, [...new Set(runs)]])
  ),
  connectBoardsCompleted: connectRuns.length,
  connectMovesPerBoard: [...new Set(connectRuns)],
  memoryPairsCompletable: createPairGrid(12, 42).length / 2,
  realMahjongKnownHandValidated: true,
}));
