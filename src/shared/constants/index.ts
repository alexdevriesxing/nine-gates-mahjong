// =====================================================
// Nine Gates Mahjong — Constants & Data
// =====================================================
import type { AICharacter, MahjongVariant, GameModeInfo } from '../types';

// ===== Site Info =====
export const SITE_NAME = 'Nine Gates Mahjong';
export const SITE_TAGLINE = 'From tile matching to true Mahjong mastery';
export const SITE_DOMAIN = 'https://ninegatesmahjong.com';
export const SITE_DESCRIPTION =
  'Play Mahjongg Solitaire, solve daily puzzles, learn real Mahjong, and master serious table variants from around the world. Free online Mahjong and Mahjongg games.';

// ===== AI Characters =====
export const AI_CHARACTERS: AICharacter[] = [
  {
    id: 'uncle-lee',
    name: 'Uncle Lee',
    title: 'The Patient Guardian',
    personality:
      'Defensive, wise, patient. Builds solid hands and rarely takes risks. Prefers safe discards and waits for the perfect hand.',
    quote: 'A patient dragon catches the best tile.',
    difficulty: 'intermediate',
    style: 'Defensive',
    aggression: 0.2,
    riskTolerance: 0.2,
    callFrequency: 0.3,
    avatarColor: '#0a4a3a',
  },
  {
    id: 'auntie-li-wen',
    name: 'Auntie Li-Wen',
    title: 'The Warm Strategist',
    personality:
      'Balanced, warm, deceptively strong. Appears casual but has excellent reads on opponents.',
    quote: 'A good hand needs a calm heart.',
    difficulty: 'advanced',
    style: 'Balanced',
    aggression: 0.5,
    riskTolerance: 0.4,
    callFrequency: 0.5,
    avatarColor: '#c4a35a',
  },
  {
    id: 'master-chen',
    name: 'Master Chen',
    title: 'The Bold Veteran',
    personality:
      "Aggressive, old-school, unpredictable. Goes for big hands and isn't afraid to call early.",
    quote: 'Fortune favors the bold.',
    difficulty: 'expert',
    style: 'Aggressive',
    aggression: 0.9,
    riskTolerance: 0.8,
    callFrequency: 0.7,
    avatarColor: '#e03c31',
  },
  {
    id: 'mei-lin',
    name: 'Mei Lin',
    title: 'The Modern Prodigy',
    personality:
      'Efficient, modern, analytical. Adapts strategy based on the flow of tiles and opponent behavior.',
    quote: 'Flexible hands win more often.',
    difficulty: 'advanced',
    style: 'Adaptive',
    aggression: 0.5,
    riskTolerance: 0.5,
    callFrequency: 0.4,
    avatarColor: '#30a86a',
  },
  {
    id: 'grandpa-wong',
    name: 'Grandpa Wong',
    title: 'The Lucky Wildcard',
    personality:
      'Chaotic and funny. Makes seemingly random plays that sometimes work brilliantly.',
    quote: 'I meant to do that. Probably.',
    difficulty: 'beginner',
    style: 'Chaotic',
    aggression: 0.6,
    riskTolerance: 0.9,
    callFrequency: 0.6,
    avatarColor: '#a08030',
  },
  {
    id: 'madam-sakura',
    name: 'Madam Sakura',
    title: 'The Silent Blade',
    personality:
      'Elegant and defensive. Rarely reveals her hand early. Excels at reading discards.',
    quote: 'Silence reveals everything.',
    difficulty: 'expert',
    style: 'Defensive',
    aggression: 0.15,
    riskTolerance: 0.2,
    callFrequency: 0.2,
    avatarColor: '#f06858',
  },
  {
    id: 'bao-panda',
    name: 'Bao the Lucky Panda',
    title: 'The Friendly Beginner',
    personality:
      'Beginner-friendly mascot. Plays simply, makes clear moves, and encourages new players.',
    quote: 'Panda thinks this tile is cute.',
    difficulty: 'beginner',
    style: 'Simple',
    aggression: 0.3,
    riskTolerance: 0.3,
    callFrequency: 0.2,
    avatarColor: '#5a5a90',
  },
];

// ===== Game Modes =====
export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'mahjongg-solitaire',
    name: 'Mahjongg Solitaire',
    description:
      'Classic tile-matching puzzle. Remove matching pairs from the board until all tiles are cleared.',
    category: 'casual',
    path: '/mahjongg-solitaire',
    status: 'playable',
    difficulty: 'Easy to Medium',
    icon: '🀄',
    color: 'jade',
  },
  {
    id: 'daily-puzzle',
    name: 'Daily Mahjongg Puzzle',
    description:
      'A fresh puzzle every day. Same puzzle for everyone — compete for the best score and build your streak.',
    category: 'daily',
    path: '/daily',
    status: 'playable',
    difficulty: 'Medium',
    icon: '📅',
    color: 'gold',
  },
  {
    id: 'zen-mahjongg',
    name: 'Zen Mahjongg',
    description:
      'Relaxing tile matching with no timer pressure. Perfect for unwinding with calming visuals and infinite shuffles.',
    category: 'casual',
    path: '/zen-mahjongg',
    status: 'playable',
    difficulty: 'Easy',
    icon: '🧘',
    color: 'jade',
  },
  {
    id: 'time-attack',
    name: 'Time Attack',
    description:
      'Race the clock! Match tiles fast, build combos, and earn time bonuses before time runs out.',
    category: 'puzzle',
    path: '/time-attack',
    status: 'playable',
    difficulty: 'Hard',
    icon: '⏱️',
    color: 'vermilion',
  },
  {
    id: 'mahjong-connect',
    name: 'Mahjong Connect',
    description:
      'Match tiles through open paths on a flat board. A unique twist on the classic Mahjong puzzle format.',
    category: 'puzzle',
    path: '/mahjong-connect',
    status: 'playable',
    difficulty: 'Medium',
    icon: '🔗',
    color: 'gold',
  },
  {
    id: 'shisen-sho',
    name: 'Shisen-Sho',
    description:
      'Japanese flat-board tile matching. Connect pairs with up to three straight lines to clear the board.',
    category: 'puzzle',
    path: '/shisen-sho',
    status: 'playable',
    difficulty: 'Medium',
    icon: '🎴',
    color: 'vermilion',
  },
  {
    id: 'mahjongg-memory',
    name: 'Mahjongg Memory',
    description:
      'Face-down tile matching meets Mahjong. Test your memory with beautiful Mahjong tiles.',
    category: 'casual',
    path: '/mahjongg-memory',
    status: 'playable',
    difficulty: 'Easy',
    icon: '🧠',
    color: 'ink',
  },
  {
    id: 'real-mahjong',
    name: 'Real Mahjong vs AI',
    description:
      'Practice 4-player table Mahjong against AI opponents. Draw, discard, read the table, and complete a legal hand.',
    category: 'real-mahjong',
    path: '/real-mahjong',
    status: 'playable',
    difficulty: 'Advanced',
    icon: '🎲',
    color: 'vermilion',
  },
  {
    id: 'lobby',
    name: 'Multiplayer Lobby',
    description:
      'Join or create rooms for real-time Mahjong with other players and AI opponents.',
    category: 'real-mahjong',
    path: '/lobby',
    status: 'playable',
    difficulty: 'Varies',
    icon: '👥',
    color: 'gold',
  },
];

// ===== Mahjong Variants =====
export const MAHJONG_VARIANTS: MahjongVariant[] = [
  {
    id: 'hong-kong',
    name: 'Hong Kong Mahjong',
    region: 'Hong Kong / Cantonese',
    regionFlag: '🇭🇰',
    complexity: 'intermediate',
    playerType: 'Social players who love fast-paced, flexible gameplay',
    style:
      'Fast, intuitive, social. The most widely played variant in Cantonese-speaking communities.',
    description:
      'Hong Kong Mahjong is fast-paced and social, with straightforward rules that make it popular among family and friends.',
    whyPlay:
      'Perfect balance of skill and speed. Great for social play and the most natural starting point for new players.',
    status: 'playable',
    path: '/real-mahjong/hong-kong',
  },
  {
    id: 'riichi',
    name: 'Japanese Riichi Mahjong',
    region: 'Japan',
    regionFlag: '🇯🇵',
    complexity: 'advanced',
    playerType: 'Competitive players who enjoy deep strategy and yaku-based scoring',
    style:
      'Strategic, competitive, structured. Known for its riichi declaration and complex scoring (yaku/han/fu).',
    description:
      'Riichi Mahjong is the competitive standard in Japan, featuring the unique riichi declaration, dora tiles, and a rich yaku system.',
    whyPlay:
      'The deepest competitive experience. Rich strategy, beautiful tradition, and a thriving global tournament scene.',
    status: 'playable',
    path: '/real-mahjong/riichi',
  },
  {
    id: 'mcr',
    name: 'Chinese Official (MCR)',
    region: 'China / International',
    regionFlag: '🇨🇳',
    complexity: 'expert',
    playerType: 'Tournament players seeking the most comprehensive scoring system',
    style:
      'Complex, analytical, tournament-ready. Features 81 official scoring patterns.',
    description:
      'Chinese Official Mahjong Competition Rules (MCR) is the international tournament standard, featuring 81 scoring patterns and strategic depth.',
    whyPlay:
      'The ultimate scoring challenge with 81 patterns to master. The official competitive format for international tournaments.',
    status: 'playable',
    path: '/real-mahjong/mcr',
  },
  {
    id: 'american',
    name: 'American Mahjongg',
    region: 'United States',
    regionFlag: '🇺🇸',
    complexity: 'intermediate',
    playerType: 'Social players who enjoy hand-building with jokers and card-based scoring',
    style:
      'Social, creative, card-based. Uses jokers, Charleston tile exchange, and annually updated scoring cards from the NMJL.',
    description:
      'American Mahjongg has its own unique identity with jokers, the Charleston tile pass, and a scoring card updated annually by the National Mah Jongg League.',
    whyPlay:
      'A uniquely American twist on Mahjong. Social, strategic, and always fresh with annually changing scoring cards.',
    status: 'playable',
    path: '/real-mahjong/american',
  },
  {
    id: 'taiwanese',
    name: 'Taiwanese Mahjong',
    region: 'Taiwan',
    regionFlag: '🇹🇼',
    complexity: 'intermediate',
    playerType: 'Players who enjoy fast rounds with exciting scoring',
    style:
      'Fast, exciting, high-stakes feel. Features 16-tile hands and immediate win scoring.',
    description:
      'Taiwanese Mahjong is known for its fast rounds, 16-tile hands (instead of the standard 13), and exciting all-or-nothing scoring.',
    whyPlay:
      'Fast, thrilling gameplay with 16-tile hands and exciting scoring. Great for players who want quick, intense rounds.',
    status: 'playable',
    path: '/real-mahjong/taiwanese',
  },
];

// ===== Guest Name Generation =====
export const GUEST_NAME_ADJECTIVES = [
  'Dragon', 'Jade', 'Lucky', 'Lantern', 'Bamboo', 'Golden', 'Crimson',
  'Phoenix', 'Mystic', 'Ivory', 'Silk', 'Lotus', 'Moon', 'Star',
  'Cloud', 'Wind', 'River', 'Mountain', 'Tiger', 'Crane',
];

export const GUEST_NAME_NOUNS = [
  'Guest', 'Player', 'Tile', 'Hand', 'Scholar', 'Wanderer',
  'Traveler', 'Spirit', 'Seeker', 'Novice', 'Apprentice',
];

// ===== Solitaire Layouts =====
export const SOLITAIRE_LAYOUTS = ['Turtle', 'Dragon', 'Pagoda', 'Lotus', 'Random'] as const;
export type SolitaireLayoutName = (typeof SOLITAIRE_LAYOUTS)[number];

// ===== Leaderboard Tabs =====
export const LEADERBOARD_TABS = [
  'Daily Puzzle',
  'Solitaire Score',
  'Time Attack',
  'Real Mahjong',
  'Weekly',
  'All-Time',
] as const;

// ===== Tile Constants =====
export const TILE_WIDTH = 60;
export const TILE_HEIGHT = 80;
export const TILE_DEPTH = 8;
export const TOTAL_SOLITAIRE_TILES = 144;

// ===== Scoring Constants =====
export const SCORE_BASE_MATCH = 100;
export const SCORE_COMBO_MULTIPLIER = 50;
export const SCORE_TIME_BONUS_MAX = 5000;
export const SCORE_HINT_PENALTY = 200;
export const SCORE_SHUFFLE_PENALTY = 500;

// ===== Time Attack Constants =====
export const TIME_ATTACK_DURATION = 180; // 3 minutes
export const TIME_ATTACK_BONUS_FAST = 5;  // seconds for fast match
export const TIME_ATTACK_BONUS_COMBO = 3; // seconds per combo

// ===== Navigation Links =====
export const NAV_LINKS = [
  { label: 'Play', path: '/play' },
  { label: 'Daily', path: '/daily' },
  { label: 'Variants', path: '/variants' },
  { label: 'Learn', path: '/learn' },
  { label: 'Lobby', path: '/lobby' },
  { label: 'Leaderboards', path: '/leaderboards' },
] as const;

// ===== Footer Links =====
export const FOOTER_SECTIONS = [
  {
    title: 'Games',
    links: [
      { label: 'Mahjongg Solitaire', path: '/mahjongg-solitaire' },
      { label: 'Daily Puzzle', path: '/daily' },
      { label: 'Zen Mahjongg', path: '/zen-mahjongg' },
      { label: 'Time Attack', path: '/time-attack' },
      { label: 'Mahjong Connect', path: '/mahjong-connect' },
      { label: 'Shisen-Sho', path: '/shisen-sho' },
      { label: 'Mahjongg Memory', path: '/mahjongg-memory' },
    ],
  },
  {
    title: 'Real Mahjong Variants',
    links: [
      { label: 'Real Mahjong vs AI', path: '/real-mahjong' },
      { label: 'Hong Kong Mahjong', path: '/real-mahjong/hong-kong' },
      { label: 'Riichi Mahjong', path: '/real-mahjong/riichi' },
      { label: 'Chinese Official (MCR)', path: '/real-mahjong/mcr' },
      { label: 'American Mahjongg', path: '/real-mahjong/american' },
      { label: 'Taiwanese Mahjong', path: '/real-mahjong/taiwanese' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Mahjong vs Mahjongg', path: '/learn/mahjong-vs-mahjongg' },
      { label: 'How to Play Solitaire', path: '/learn/how-to-play-mahjongg-solitaire' },
      { label: 'How to Play Real Mahjong', path: '/learn/how-to-play-real-mahjong' },
      { label: 'Chi, Pung & Kong', path: '/learn/chi-pung-kong' },
      { label: 'Beginner Strategy', path: '/learn/beginner-strategy' },
      { label: 'Mahjong Variants', path: '/learn/mahjong-variants' },
      { label: 'Guided Tutorials', path: '/how-to-play' },
      { label: 'History of Mahjong', path: '/history' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Play as Guest', path: '/guest' },
      { label: 'Login', path: '/login' },
      { label: 'Register', path: '/register' },
      { label: 'Profile', path: '/profile' },
      { label: 'Leaderboards', path: '/leaderboards' },
      { label: 'Multiplayer Lobby', path: '/lobby' },
      { label: 'Events & Tournaments', path: '/events' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  },
] as const;
