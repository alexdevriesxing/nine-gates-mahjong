// =====================================================
// Nine Gates Mahjong — Utility Functions
// =====================================================

/**
 * Deterministic seeded RNG using mulberry32 algorithm.
 * Used for daily puzzle generation — same seed = same puzzle.
 */
export function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Get daily seed from date — format YYYYMMDD as number.
 * Same date always produces the same seed.
 */
export function getDailySeed(date?: Date): number {
  const d = date || new Date();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return year * 10000 + month * 100 + day;
}

/**
 * Format date for human display.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a score number with commas.
 */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/**
 * Format seconds as MM:SS.
 */
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate a flavorful guest display name.
 */
export function generateGuestName(): string {
  const adjectives = [
    'Dragon', 'Jade', 'Lucky', 'Lantern', 'Bamboo', 'Golden', 'Crimson',
    'Phoenix', 'Mystic', 'Ivory', 'Silk', 'Lotus', 'Moon', 'Star',
  ];
  const nouns = ['Guest', 'Player', 'Tile', 'Hand', 'Scholar', 'Wanderer'];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000);

  return `${adj} ${noun} ${num}`;
}

/**
 * Fisher-Yates shuffle with optional seeded RNG.
 */
export function shuffle<T>(array: T[], rng?: () => number): T[] {
  const arr = [...array];
  const random = rng || Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a CSS hsl color from an arbitrary string — useful for avatar backgrounds.
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = ((hash % 360) + 360) % 360;
  return `hsl(${h}, 45%, 40%)`;
}

/**
 * Check if user has prefers-reduced-motion enabled.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Simple classnames merge utility (like clsx).
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a random room code (6 chars uppercase alphanumeric).
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Delay utility for async flows.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Capitalize first letter.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
