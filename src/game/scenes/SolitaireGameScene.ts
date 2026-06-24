import Phaser from 'phaser';
import { TileRenderer } from '../TileRenderer';
import { SolitaireEngine, SolitaireTileData } from '../SolitaireEngine';
import eventBus from '../EventBus';

export class SolitaireGameScene extends Phaser.Scene {
  private engine!: SolitaireEngine;
  private tileSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private selectedId: string | null = null;

  constructor() {
    super('SolitaireGameScene');
  }

  preload() {
    // Generate all necessary SVG textures programmatically
    const suits = ['bamboo', 'circles', 'characters'];
    const winds = ['east', 'south', 'west', 'north'];
    const dragons = ['red', 'green', 'white'];
    
    const generateAndLoad = (suit: string, rank: string|number) => {
      const key = `tile_${suit}_${rank}`;
      if (!this.textures.exists(key)) {
        const uri = TileRenderer.generateTileURI(suit as any, rank);
        // Using image loader with data URI
        this.load.image(key, uri);
      }
    };

    suits.forEach(s => {
      for(let i=1; i<=9; i++) generateAndLoad(s, i);
    });
    winds.forEach(w => generateAndLoad('winds', w));
    dragons.forEach(d => generateAndLoad('dragons', d));

    // Load background (the hero image the user just created)
    this.load.image('bg', '/hero-bg.jpg');
    
    // Particles for match effects
    const g = this.add.graphics();
    g.fillStyle(0xFFD700, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle_gold', 8, 8);
    g.destroy();
  }

  create() {
    const { width, height } = this.scale;
    
    // Add gorgeous background
    const bg = this.add.image(width/2, height/2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.4); // Darken for playability
    bg.setTint(0x444444);

    this.engine = new SolitaireEngine();
    const tiles = this.engine.getTiles();

    // Tile grid spacing metrics
    const tileW = 44; // Half-width for visual overlap
    const tileH = 56;
    const offsetX = width / 2 - (12 * tileW) / 2; // center 12 columns
    const offsetY = height / 2 - (8 * tileH) / 2;

    // Create sprites
    tiles.forEach((t, i) => {
      // Calculate true screen coordinates
      const sx = offsetX + (t.gridX * tileW) - (t.z * 6); // offset slightly left/up for 3D stack effect
      const sy = offsetY + (t.gridY * tileH) - (t.z * 10);
      
      const key = `tile_${t.suit}_${t.rank}`;
      
      // Start them off-screen for dealing animation
      const sprite = this.add.image(width / 2, -100, key);
      sprite.setOrigin(0.5);
      // Depth is crucial for isometric stack sorting
      sprite.setDepth(t.z * 1000 + t.gridY * 10 + t.gridX);
      
      // We store custom data for interaction
      sprite.setData('id', t.id);
      sprite.setInteractive({ cursor: 'pointer' });
      
      sprite.on('pointerdown', () => this.onTileClick(t.id));
      sprite.on('pointerover', () => this.onTileHover(t.id, true));
      sprite.on('pointerout', () => this.onTileHover(t.id, false));

      this.tileSprites.set(t.id, sprite);

      // Super polished deal animation
      this.tweens.add({
        targets: sprite,
        x: sx,
        y: sy,
        duration: 800,
        delay: i * 15, // cascading cascade
        ease: 'Back.easeOut',
        onComplete: () => {
          this.updateVisualStates();
        }
      });
    });

    this.events.emit('scene-awake');
  }

  private updateVisualStates() {
    const tiles = this.engine.getTiles();
    tiles.forEach(t => {
      const sprite = this.tileSprites.get(t.id);
      if (sprite) {
        if (t.isPlayable) {
          sprite.setTint(0xffffff);
        } else {
          // Darken locked tiles
          sprite.setTint(0x999999);
        }
      }
    });
  }

  private onTileHover(id: string, isHovering: boolean) {
    const sprite = this.tileSprites.get(id);
    const tile = this.engine.getTiles().find(t => t.id === id);
    if (!sprite || !tile || !tile.isPlayable) return;

    if (id !== this.selectedId) {
      this.tweens.add({
        targets: sprite,
        y: isHovering ? sprite.y - 5 : sprite.y + 5,
        duration: 150,
        ease: 'Sine.easeInOut'
      });
    }
  }

  private onTileClick(id: string) {
    const tile = this.engine.getTiles().find(t => t.id === id);
    if (!tile || !tile.isPlayable) return;

    const sprite = this.tileSprites.get(id);
    if (!sprite) return;

    // Deselect if already selected
    if (this.selectedId === id) {
      this.selectedId = null;
      sprite.clearTint();
      return;
    }

    if (!this.selectedId) {
      // First selection
      this.selectedId = id;
      sprite.setTint(0xFFD700); // Golden glow
    } else {
      // Second selection, check match
      const match = this.engine.checkMatch(this.selectedId, id);
      if (match) {
        this.playMatchAnimation(this.selectedId, id);
        this.engine.removePair(this.selectedId, id);
        this.selectedId = null;
        this.updateVisualStates();
        eventBus.emit('score-update', 100);
      } else {
        // Mismatch, clear selection
        const prevSprite = this.tileSprites.get(this.selectedId);
        prevSprite?.clearTint();
        this.selectedId = id;
        sprite.setTint(0xFFD700);
      }
    }
  }

  private playMatchAnimation(id1: string, id2: string) {
    const s1 = this.tileSprites.get(id1);
    const s2 = this.tileSprites.get(id2);
    if (!s1 || !s2) return;

    // Premium Particle explosion
    [s1, s2].forEach(s => {
      s.clearTint();
      const emitter = this.add.particles(0, 0, 'particle_gold', {
        x: s.x,
        y: s.y,
        speed: { min: 50, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 800,
        quantity: 30,
        blendMode: 'ADD',
        emitting: false
      });
      emitter.explode(30);

      // Tween tile away
      this.tweens.add({
        targets: s,
        scale: 1.5,
        alpha: 0,
        angle: Phaser.Math.Between(-45, 45),
        duration: 400,
        ease: 'Power2',
        onComplete: () => s.destroy()
      });
    });

    this.tileSprites.delete(id1);
    this.tileSprites.delete(id2);
  }
}
