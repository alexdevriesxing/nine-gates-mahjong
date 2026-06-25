// =====================================================
// Nine Gates Mahjong — Shared Type Definitions
// =====================================================

// ===== Tile Types =====
export type TileSuit = 'bamboo' | 'circles' | 'characters';
export type TileHonor = 'wind' | 'dragon';
export type TileBonus = 'flower' | 'season';
export type TileCategory = TileSuit | TileHonor | TileBonus;

export interface TileDefinition {
  id: number;
  category: TileCategory;
  suit?: TileSuit;
  value: number | string;
  name: string;
  /** Tiles match if their matchGroup is the same */
  matchGroup: string;
}

export interface SolitaireTile extends TileDefinition {
  instanceId: number;
  gridX: number;
  gridY: number;
  gridZ: number;
  removed: boolean;
}

// ===== Layout Types =====
export interface LayoutPosition {
  x: number;
  y: number;
  z: number;
}

export interface LayoutDefinition {
  name: string;
  positions: LayoutPosition[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

// ===== Game State =====
export type GameMode =
  | 'solitaire'
  | 'daily'
  | 'zen'
  | 'time-attack'
  | 'connect'
  | 'shisen-sho'
  | 'memory'
  | 'real-mahjong';

export interface GameState {
  mode: GameMode;
  score: number;
  combo: number;
  maxCombo: number;
  tilesRemaining: number;
  totalTiles: number;
  timeElapsed: number;
  timeLimit?: number;
  hintsUsed: number;
  shufflesUsed: number;
  undosUsed: number;
  isComplete: boolean;
  isWon: boolean;
}

// ===== Real Mahjong Types =====
export type Wind = 'east' | 'south' | 'west' | 'north';
export type MeldType = 'chi' | 'pung' | 'kong' | 'concealed-kong';

export interface MahjongTile {
  id: number;
  category: TileCategory;
  suit?: TileSuit;
  value: number | string;
  name: string;
}

export interface Meld {
  type: MeldType;
  tiles: MahjongTile[];
  isConcealed: boolean;
}

export interface PlayerHand {
  tiles: MahjongTile[];
  melds: Meld[];
  discards: MahjongTile[];
}

export interface MahjongGameState {
  wall: MahjongTile[];
  wallIndex: number;
  players: PlayerData[];
  currentTurn: number;
  currentWind: Wind;
  roundNumber: number;
  turnPhase: 'draw' | 'discard' | 'call-window';
  lastDiscard?: MahjongTile;
  lastDiscardPlayer?: number;
  gameLog: string[];
  isGameOver: boolean;
}

export interface PlayerData {
  seat: Wind;
  name: string;
  isAI: boolean;
  isHuman: boolean;
  hand: PlayerHand;
  score: number;
  character?: AICharacter;
}

// ===== AI Characters =====
export interface AICharacter {
  id: string;
  name: string;
  title: string;
  personality: string;
  quote: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  style: string;
  aggression: number;
  riskTolerance: number;
  callFrequency: number;
  avatarColor: string;
}

// ===== User & Auth =====
export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  isGuest: boolean;
  avatarUrl?: string;
  avatarTile?: string; // Format: "suit:rank", e.g. "dragons:red"
  level: number;
  xp: number;
  coins: number;
  rating?: number;
  ratedWins?: number;
  ratedLosses?: number;
  gamesPlayed?: number;
  createdAt: string;
}

export interface GuestSession {
  id: string;
  guestName: string;
  createdAt: string;
  avatarTile?: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  coins: number;
  gamesPlayed: number;
  gamesWon: number;
  dailyStreak: number;
  favoriteMode?: GameMode;
  achievements: string[];
  tileSkin: string;
  tableSkin: string;
}

// ===== Leaderboard =====
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  time?: number;
  date: string;
  badge?: string;
}

// ===== Lobby & Rooms =====
export interface RoomInfo {
  roomCode: string;
  hostName: string;
  ruleSet: string;
  seats: SeatInfo[];
  maxPlayers: number;
  status: 'waiting' | 'starting' | 'in-progress' | 'finished';
  turnTimer: number;
  aiFill: boolean;
  isPrivate: boolean;
  createdAt: string;
}

export interface SeatInfo {
  wind: Wind;
  playerName?: string;
  isAI: boolean;
  isReady: boolean;
  isEmpty: boolean;
}

// ===== WebSocket Events =====
export type ClientEvent =
  | { type: 'JOIN_ROOM'; roomCode: string; playerName: string }
  | { type: 'LEAVE_ROOM' }
  | { type: 'READY' }
  | { type: 'START_GAME' }
  | { type: 'DISCARD_TILE'; tileId: number }
  | { type: 'DRAW_TILE' }
  | { type: 'CALL_CHI'; tiles: number[] }
  | { type: 'CALL_PUNG' }
  | { type: 'CALL_KONG' }
  | { type: 'DECLARE_WIN' }
  | { type: 'PASS' }
  | { type: 'EMOTE'; emote: string };

export type ServerEvent =
  | { type: 'ROOM_STATE'; room: RoomInfo }
  | { type: 'GAME_STATE'; state: Partial<MahjongGameState> }
  | { type: 'PLAYER_JOINED'; playerName: string; seat: Wind }
  | { type: 'PLAYER_LEFT'; playerName: string }
  | { type: 'GAME_STARTED' }
  | { type: 'TURN_STARTED'; seat: Wind }
  | { type: 'TILE_DISCARDED'; seat: Wind; tile: MahjongTile }
  | { type: 'CALL_WINDOW'; options: string[] }
  | { type: 'MELD_CREATED'; seat: Wind; meld: Meld }
  | { type: 'HAND_ENDED'; scores: Record<Wind, number> }
  | { type: 'MATCH_ENDED'; finalScores: Record<Wind, number> }
  | { type: 'ERROR'; message: string };

// ===== SEO =====
export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

// ===== Ads =====
export interface AdConfig {
  bannerKey: string;
  nativeKey: string;
  socialBarKey: string;
  interstitialKey: string;
  smartlinkUrl: string;
  enablePlaceholders: boolean;
}

// ===== Variants =====
export interface MahjongVariant {
  id: string;
  name: string;
  region: string;
  regionFlag: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  playerType: string;
  style: string;
  description: string;
  whyPlay: string;
  status: 'playable' | 'coming-soon' | 'planned';
  path: string;
}

// ===== Game Mode Info =====
export interface GameModeInfo {
  id: string;
  name: string;
  description: string;
  category: 'casual' | 'puzzle' | 'daily' | 'real-mahjong' | 'coming-soon';
  path: string;
  status: 'playable' | 'coming-soon' | 'planned';
  difficulty: string;
  icon: string;
  color: string;
}
