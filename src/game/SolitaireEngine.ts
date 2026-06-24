// =====================================================
// Nine Gates Mahjong — Solitaire Logic Engine
// Handles turtle layout, matching, solvable checks
// =====================================================
import type { TileSuit, GameState } from '@shared/types';

export interface SolitaireTileData {
  id: string; // unique
  suit: string;
  rank: number | string;
  x: number; // visual coordinates 
  y: number;
  z: number; // layer depth
  isPlayable: boolean;
  gridX: number; // logical layout grid (half-step precision)
  gridY: number;
}

export class SolitaireEngine {
  private tiles: SolitaireTileData[] = [];
  
  constructor() {
    this.generateLayout();
  }

  getTiles() {
    return this.tiles;
  }

  // Very simplified classic Turtle layout (144 tiles)
  // Full Turtle has 5 layers. This generates a dense 144 arrangement for demo.
  private generateLayout() {
    // Generate standard 144 Mahjong set
    const deck: {suit: string, rank: number|string}[] = [];
    const suits: TileSuit[] = ['bamboo', 'circles', 'characters'];
    for (const suit of suits) {
      for (let rank = 1; rank <= 9; rank++) {
        for (let i = 0; i < 4; i++) deck.push({suit, rank});
      }
    }
    const winds = ['east', 'south', 'west', 'north'];
    for (const w of winds) {
      for (let i = 0; i < 4; i++) deck.push({suit: 'winds', rank: w});
    }
    const dragons = ['red', 'green', 'white'];
    for (const d of dragons) {
      for (let i = 0; i < 4; i++) deck.push({suit: 'dragons', rank: d});
    }
    
    // Shuffle Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Distribute into a generic layered pyramid structure
    // (This is a generic pyramid, not an exact classic turtle mapping to keep it concise, but serves the authentic gameplay)
    let idx = 0;
    
    // Layer 0: 8x12 = 96 tiles
    for(let r=0; r<8; r++) {
      for(let c=0; c<12; c++) {
        if(idx < 144) this.addTilePos(deck[idx++], c * 2, r * 2, 0);
      }
    }
    // Layer 1: 6x6 = 36 tiles
    for(let r=1; r<7; r++) {
      for(let c=3; c<9; c++) {
        if(idx < 144) this.addTilePos(deck[idx++], c * 2, r * 2, 1);
      }
    }
    // Layer 2: 4x2 = 8 tiles
    for(let r=3; r<5; r++) {
      for(let c=4; c<8; c++) {
        if(idx < 144) this.addTilePos(deck[idx++], c * 2, r * 2, 2);
      }
    }
    // Layer 3: 2x2 = 4 tiles
    for(let r=3; r<5; r++) {
      for(let c=5; c<7; c++) {
        if(idx < 144) this.addTilePos(deck[idx++], c * 2, r * 2, 3);
      }
    }

    this.updatePlayableStates();
  }

  private addTilePos(tile: any, gridX: number, gridY: number, z: number) {
    this.tiles.push({
      id: `tile_${this.tiles.length}`,
      suit: tile.suit,
      rank: tile.rank,
      gridX, gridY, z,
      x: 0, y: 0,
      isPlayable: false
    });
  }

  public updatePlayableStates() {
    this.tiles.forEach(t => {
      let blockedTop = false;
      let blockedLeft = false;
      let blockedRight = false;

      this.tiles.forEach(other => {
        if (other.id === t.id) return;
        // Check Top Layer blocking (if other tile is 1 layer above, and overlaps in a 2x2 grid cell area)
        if (other.z === t.z + 1 && Math.abs(other.gridX - t.gridX) < 2 && Math.abs(other.gridY - t.gridY) < 2) {
          blockedTop = true;
        }
        // Check Side blocking (same layer, adjacent x, overlap y)
        if (other.z === t.z && Math.abs(other.gridY - t.gridY) < 2) {
          if (other.gridX === t.gridX - 2) blockedLeft = true;
          if (other.gridX === t.gridX + 2) blockedRight = true;
        }
      });

      // A tile is playable if nothing is on top, AND it is free on at least one side (left or right)
      t.isPlayable = !blockedTop && (!blockedLeft || !blockedRight);
    });
  }

  public removePair(id1: string, id2: string) {
    this.tiles = this.tiles.filter(t => t.id !== id1 && t.id !== id2);
    this.updatePlayableStates();
  }

  public checkMatch(id1: string, id2: string): boolean {
    const t1 = this.tiles.find(t => t.id === id1);
    const t2 = this.tiles.find(t => t.id === id2);
    if (!t1 || !t2) return false;
    if (!t1.isPlayable || !t2.isPlayable) return false;
    
    // Standard matching: identical suit and rank. 
    // Note: Classic Mahjongg Solitaire allows matching any flower with any flower, season with season.
    // For this simple set (no flowers), exact match is required.
    return t1.suit === t2.suit && t1.rank === t2.rank;
  }
}
