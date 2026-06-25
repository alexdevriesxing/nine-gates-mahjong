export interface GameCompletionRecord {
  completions: number;
  bestScore: number;
  bestSeconds: number | null;
  lastCompletedAt: string;
}

export type GameProgress = Record<string, GameCompletionRecord>;

const STORAGE_KEY = 'ngm_game_progress';

export function getGameProgress(): GameProgress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as GameProgress;
  } catch {
    return {};
  }
}

export function recordGameCompletion(mode: string, score: number, seconds: number) {
  if (typeof window === 'undefined') return;
  const progress = getGameProgress();
  const current = progress[mode];
  progress[mode] = {
    completions: (current?.completions ?? 0) + 1,
    bestScore: Math.max(current?.bestScore ?? 0, score),
    bestSeconds:
      current?.bestSeconds === null || current?.bestSeconds === undefined
        ? seconds
        : Math.min(current.bestSeconds, seconds),
    lastCompletedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent('ngm-progress-updated', { detail: { mode } }));
}
