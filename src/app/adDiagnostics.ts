export interface NGMAdDiagnosticEvent {
  event: string;
  event_time: string;
  page_path: string;
  viewport_width: number;
  placement?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  status?: string;
  detail?: string;
}

const STORAGE_KEY = 'ngm_ad_diagnostics_v1';
const MAX_EVENTS = 600;

export function getStoredAdDiagnostics(): NGMAdDiagnosticEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearStoredAdDiagnostics() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Diagnostics are best-effort and must never interfere with advertising.
  }
}

export function recordAdDiagnostic(
  event: string,
  payload: Omit<NGMAdDiagnosticEvent, 'event' | 'event_time' | 'page_path' | 'viewport_width'> = {},
) {
  if (typeof window === 'undefined') return;
  const body: NGMAdDiagnosticEvent = {
    event,
    event_time: new Date().toISOString(),
    page_path: window.location.pathname,
    viewport_width: window.innerWidth,
    ...payload,
  };

  try {
    const current = getStoredAdDiagnostics();
    const next = [body, ...current].slice(0, MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable or full; ad delivery must remain fail-open.
  }

  window.dispatchEvent(new CustomEvent('ngm:ad-diagnostic', { detail: body }));
}
