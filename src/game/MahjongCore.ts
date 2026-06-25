import { seededRandom, shuffle } from '@shared/utils';

export type MahjongSuit = 'bamboo' | 'circles' | 'characters' | 'winds' | 'dragons';

export interface MahjongFace {
  suit: MahjongSuit;
  rank: number | string;
  key: string;
  name: string;
}

export interface MahjongTileInstance extends MahjongFace {
  id: string;
}

export interface SolitaireTileInstance extends MahjongTileInstance {
  x: number;
  y: number;
  z: number;
  removed: boolean;
}

export const MAHJONG_FACES: MahjongFace[] = [
  ...(['bamboo', 'circles', 'characters'] as const).flatMap((suit) =>
    Array.from({ length: 9 }, (_, index) => {
      const rank = index + 1;
      return {
        suit,
        rank,
        key: `${suit}:${rank}`,
        name: `${rank} ${suit}`,
      };
    })
  ),
  ...(['east', 'south', 'west', 'north'] as const).map((rank) => ({
    suit: 'winds' as const,
    rank,
    key: `winds:${rank}`,
    name: `${rank[0].toUpperCase()}${rank.slice(1)} wind`,
  })),
  ...(['red', 'green', 'white'] as const).map((rank) => ({
    suit: 'dragons' as const,
    rank,
    key: `dragons:${rank}`,
    name: `${rank[0].toUpperCase()}${rank.slice(1)} dragon`,
  })),
];

export function getFace(key: string): MahjongFace {
  const face = MAHJONG_FACES.find((candidate) => candidate.key === key);
  if (!face) throw new Error(`Unknown Mahjong tile: ${key}`);
  return face;
}

export function createMahjongWall(rng: () => number = Math.random): MahjongTileInstance[] {
  const tiles = MAHJONG_FACES.flatMap((face) =>
    Array.from({ length: 4 }, (_, copy) => ({
      ...face,
      id: `${face.key}:${copy}`,
    }))
  );
  return shuffle(tiles, rng);
}

export function sortMahjongTiles<T extends MahjongTileInstance>(tiles: T[]): T[] {
  const suitOrder: MahjongSuit[] = ['characters', 'circles', 'bamboo', 'winds', 'dragons'];
  const honorOrder = ['east', 'south', 'west', 'north', 'red', 'green', 'white'];
  return [...tiles].sort((a, b) => {
    const suitDifference = suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
    if (suitDifference !== 0) return suitDifference;
    if (typeof a.rank === 'number' && typeof b.rank === 'number') return a.rank - b.rank;
    return honorOrder.indexOf(String(a.rank)) - honorOrder.indexOf(String(b.rank));
  });
}

interface BoardPosition {
  id: string;
  x: number;
  y: number;
  z: number;
}

export function createFortressPositions(): BoardPosition[] {
  const positions: BoardPosition[] = [];
  const addLayer = (z: number, rows: number, columns: number, xOffset: number, yOffset: number) => {
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        positions.push({
          id: `p-${z}-${row}-${column}`,
          x: xOffset + column * 2,
          y: yOffset + row * 2,
          z,
        });
      }
    }
  };

  addLayer(0, 6, 8, 0, 0);
  addLayer(1, 4, 4, 4, 2);
  addLayer(2, 2, 2, 6, 4);
  return positions;
}

function overlaps(a: BoardPosition, b: BoardPosition): boolean {
  return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
}

export function isPositionFree(position: BoardPosition, active: BoardPosition[]): boolean {
  const covered = active.some((other) => other.z > position.z && overlaps(position, other));
  if (covered) return false;

  const leftBlocked = active.some(
    (other) => other.z === position.z && other.x === position.x - 2 && Math.abs(other.y - position.y) < 2
  );
  const rightBlocked = active.some(
    (other) => other.z === position.z && other.x === position.x + 2 && Math.abs(other.y - position.y) < 2
  );
  return !leftBlocked || !rightBlocked;
}

function createRemovalPairs(positions: BoardPosition[], rng: () => number): [BoardPosition, BoardPosition][] {
  const active = [...positions];
  const pairs: [BoardPosition, BoardPosition][] = [];

  while (active.length > 0) {
    const free = active.filter((position) => isPositionFree(position, active));
    if (free.length < 2) {
      throw new Error('The Mahjong layout cannot be removed in pairs.');
    }

    const shuffledFree = shuffle(free, rng);
    const first = shuffledFree[0];
    const second =
      shuffledFree.find((candidate) => candidate.z !== first.z || Math.abs(candidate.x - first.x) > 2) ??
      shuffledFree[1];
    pairs.push([first, second]);

    for (const selected of [first, second]) {
      const index = active.findIndex((position) => position.id === selected.id);
      active.splice(index, 1);
    }
  }

  return pairs;
}

export function createSolvableSolitaireBoard(seed = Date.now()): SolitaireTileInstance[] {
  const rng = seededRandom(seed);
  const positions = createFortressPositions();
  const removalPairs = createRemovalPairs(positions, rng);
  const faces = shuffle(
    Array.from({ length: removalPairs.length }, (_, index) => MAHJONG_FACES[index % MAHJONG_FACES.length]),
    rng
  );

  const tiles: SolitaireTileInstance[] = [];
  removalPairs.forEach(([first, second], pairIndex) => {
    const face = faces[pairIndex];
    tiles.push(
      { ...face, ...first, id: `tile-${first.id}`, removed: false },
      { ...face, ...second, id: `tile-${second.id}`, removed: false }
    );
  });
  return tiles;
}

export function reshuffleSolvableSolitaireBoard(
  tiles: SolitaireTileInstance[],
  seed = Date.now()
): SolitaireTileInstance[] {
  const rng = seededRandom(seed);
  const active = tiles.filter((tile) => !tile.removed);
  const removalPairs = createRemovalPairs(active, rng);
  const faces = shuffle(MAHJONG_FACES.slice(0, removalPairs.length), rng);
  const faceById = new Map<string, MahjongFace>();
  removalPairs.forEach(([first, second], index) => {
    faceById.set(first.id, faces[index]);
    faceById.set(second.id, faces[index]);
  });
  return tiles.map((tile) => {
    const face = faceById.get(tile.id);
    return face ? { ...tile, ...face } : tile;
  });
}

export function isSolitaireTileFree(tile: SolitaireTileInstance, tiles: SolitaireTileInstance[]): boolean {
  if (tile.removed) return false;
  const active = tiles.filter((candidate) => !candidate.removed);
  return isPositionFree(tile, active);
}

export function findSolitaireMatch(
  tiles: SolitaireTileInstance[]
): [SolitaireTileInstance, SolitaireTileInstance] | null {
  const freeTiles = tiles.filter((tile) => isSolitaireTileFree(tile, tiles));
  for (let index = 0; index < freeTiles.length; index += 1) {
    const match = freeTiles.slice(index + 1).find((tile) => tile.key === freeTiles[index].key);
    if (match) return [freeTiles[index], match];
  }
  return null;
}

export function createPairGrid(
  pairCount: number,
  seed = Date.now(),
  keepPairsAdjacent = false
): MahjongTileInstance[] {
  const rng = seededRandom(seed);
  const faces = shuffle(
    Array.from({ length: pairCount }, (_, index) => MAHJONG_FACES[index % MAHJONG_FACES.length]),
    rng
  );
  const tiles = faces.flatMap((face, pairIndex) => [
    { ...face, id: `grid-${pairIndex}-a` },
    { ...face, id: `grid-${pairIndex}-b` },
  ]);
  if (!keepPairsAdjacent) return shuffle(tiles, rng);
  const pairGroups = Array.from({ length: pairCount }, (_, index) => tiles.slice(index * 2, index * 2 + 2));
  return shuffle(pairGroups, rng).flat();
}

export function canConnectTiles(
  grid: Array<string | null>,
  rows: number,
  columns: number,
  startIndex: number,
  endIndex: number
): boolean {
  if (startIndex === endIndex || !grid[startIndex] || grid[startIndex] !== grid[endIndex]) return false;

  const paddedRows = rows + 2;
  const paddedColumns = columns + 2;
  const blocked = Array.from({ length: paddedRows * paddedColumns }, () => false);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const originalIndex = row * columns + column;
      const paddedIndex = (row + 1) * paddedColumns + column + 1;
      blocked[paddedIndex] = grid[originalIndex] !== null && originalIndex !== endIndex;
    }
  }

  const startRow = Math.floor(startIndex / columns) + 1;
  const startColumn = (startIndex % columns) + 1;
  const endRow = Math.floor(endIndex / columns) + 1;
  const endColumn = (endIndex % columns) + 1;
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  const queue = directions.map((_, direction) => ({
    row: startRow,
    column: startColumn,
    direction,
    turns: 0,
  }));
  const best = new Map<string, number>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const [rowDelta, columnDelta] = directions[current.direction];
    const row = current.row + rowDelta;
    const column = current.column + columnDelta;
    if (row < 0 || row >= paddedRows || column < 0 || column >= paddedColumns) continue;
    if (blocked[row * paddedColumns + column]) continue;
    if (row === endRow && column === endColumn) return true;

    for (let direction = 0; direction < directions.length; direction += 1) {
      const turns = current.turns + (direction === current.direction ? 0 : 1);
      if (turns > 2) continue;
      const key = `${row}:${column}:${direction}`;
      if ((best.get(key) ?? 3) <= turns) continue;
      best.set(key, turns);
      queue.push({ row, column, direction, turns });
    }
  }
  return false;
}

export function isWinningMahjongHand(tiles: MahjongTileInstance[], meldCount = 4): boolean {
  if (tiles.length !== meldCount * 3 + 2) return false;
  const counts = new Map<string, number>();
  tiles.forEach((tile) => counts.set(tile.key, (counts.get(tile.key) ?? 0) + 1));

  const canFormMelds = (working: Map<string, number>): boolean => {
    const first = MAHJONG_FACES.find((face) => (working.get(face.key) ?? 0) > 0);
    if (!first) return true;

    const count = working.get(first.key) ?? 0;
    if (count >= 3) {
      working.set(first.key, count - 3);
      if (canFormMelds(working)) return true;
      working.set(first.key, count);
    }

    if (
      typeof first.rank === 'number' &&
      first.rank <= 7 &&
      ['bamboo', 'circles', 'characters'].includes(first.suit)
    ) {
      const secondKey = `${first.suit}:${first.rank + 1}`;
      const thirdKey = `${first.suit}:${first.rank + 2}`;
      if ((working.get(secondKey) ?? 0) > 0 && (working.get(thirdKey) ?? 0) > 0) {
        working.set(first.key, count - 1);
        working.set(secondKey, (working.get(secondKey) ?? 0) - 1);
        working.set(thirdKey, (working.get(thirdKey) ?? 0) - 1);
        if (canFormMelds(working)) return true;
        working.set(first.key, count);
        working.set(secondKey, (working.get(secondKey) ?? 0) + 1);
        working.set(thirdKey, (working.get(thirdKey) ?? 0) + 1);
      }
    }
    return false;
  };

  for (const [key, count] of counts) {
    if (count < 2) continue;
    const working = new Map(counts);
    working.set(key, count - 2);
    if (canFormMelds(working)) return true;
  }
  return false;
}

export function findWinningMahjongDraws(
  tiles: MahjongTileInstance[],
  meldCount = 4
): MahjongFace[] {
  if (tiles.length !== meldCount * 3 + 1) return [];
  const counts = new Map<string, number>();
  tiles.forEach((tile) => counts.set(tile.key, (counts.get(tile.key) ?? 0) + 1));

  return MAHJONG_FACES.filter((face) => (counts.get(face.key) ?? 0) < 4).filter((face, index) =>
    isWinningMahjongHand(
      [...tiles, { ...face, id: `winning-draw-${face.key}-${index}` }],
      meldCount
    )
  );
}

export function chooseAIDiscard(hand: MahjongTileInstance[], rng: () => number = Math.random): MahjongTileInstance {
  const counts = new Map<string, number>();
  hand.forEach((tile) => counts.set(tile.key, (counts.get(tile.key) ?? 0) + 1));
  const scored = hand.map((tile) => {
    let value = (counts.get(tile.key) ?? 0) * 4;
    if (typeof tile.rank === 'number') {
      for (const offset of [-2, -1, 1, 2]) {
        value += counts.get(`${tile.suit}:${tile.rank + offset}`) ?? 0;
      }
      if (tile.rank === 1 || tile.rank === 9) value -= 0.25;
    } else {
      value -= 0.5;
    }
    return { tile, value: value + rng() * 0.1 };
  });
  scored.sort((a, b) => a.value - b.value);
  return scored[0].tile;
}
