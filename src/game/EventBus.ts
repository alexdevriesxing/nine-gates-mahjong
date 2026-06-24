// =====================================================
// Nine Gates Mahjong — React ↔ Phaser Event Bus
// Communication bridge between React UI and Phaser game
// =====================================================

type EventCallback = (...args: unknown[]) => void;

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    return this;
  }

  off(event: string, callback: EventCallback): this {
    const cbs = this.listeners.get(event);
    if (cbs) {
      this.listeners.set(
        event,
        cbs.filter((cb) => cb !== callback)
      );
    }
    return this;
  }

  emit(event: string, ...args: unknown[]): this {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach((cb) => cb(...args));
    }
    return this;
  }

  once(event: string, callback: EventCallback): this {
    const wrapper: EventCallback = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}

// Singleton event bus instance
export const eventBus = new EventBus();

// ===== Event Names =====
export const GameEvents = {
  // Game lifecycle
  GAME_STARTED: 'game:started',
  GAME_COMPLETED: 'game:completed',
  GAME_PAUSED: 'game:paused',
  GAME_RESUMED: 'game:resumed',

  // Score
  SCORE_UPDATED: 'game:score-updated',
  COMBO_UPDATED: 'game:combo-updated',

  // Tiles
  TILE_MATCHED: 'game:tile-matched',
  TILE_SELECTED: 'game:tile-selected',
  TILE_INVALID: 'game:tile-invalid',
  TILES_SHUFFLED: 'game:tiles-shuffled',
  HINT_USED: 'game:hint-used',
  UNDO_USED: 'game:undo-used',
  DEAD_BOARD: 'game:dead-board',

  // Daily
  DAILY_COMPLETED: 'daily:completed',

  // Ads
  REQUEST_INTERSTITIAL: 'ad:request-interstitial',

  // Profile
  PROFILE_UPDATE: 'profile:update',

  // Real Mahjong
  MAHJONG_TURN: 'mahjong:turn',
  MAHJONG_DISCARD: 'mahjong:discard',
  MAHJONG_CALL: 'mahjong:call',
  MAHJONG_WIN: 'mahjong:win',

  // Scene
  SCENE_READY: 'scene:ready',
  REQUEST_RESTART: 'game:request-restart',
  REQUEST_NEW_LAYOUT: 'game:request-new-layout',
} as const;

export default eventBus;
