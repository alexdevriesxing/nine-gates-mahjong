// =====================================================
// Nine Gates Mahjong — High Resolution Tile SVG Generator
// Generates super-detailed, glossy, premium pseudo-3D Mahjong tiles
// =====================================================
import type { TileSuit } from '@shared/types';

export class TileRenderer {
  // Tile dimensions
  static W = 76;
  static H = 104;
  static D = 10; // 3D depth
  static RX = 10; // border radius

  // Colors
  static IVORY_TOP = '#FFFDF5';
  static IVORY_BOTTOM = '#E6DECE';
  static IVORY_EDGE = '#DED3BA';
  static LACQUER_BACK = '#6E2116';
  static LACQUER_BACK_DARK = '#3A1009';
  
  static RED_INK = '#BC251E';
  static GREEN_INK = '#1E5A3A';
  static BLUE_INK = '#143152';
  static BLACK_INK = '#181818';

  static generateTileURI(suit: TileSuit | 'winds' | 'dragons' | 'flowers' | 'seasons', rank: number | string): string {
    const svgStr = this.createSVG(suit, rank);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgStr)))}`;
  }

  static createSVG(suit: string, rank: number | string): string {
    const content = this.renderFaceContent(suit, rank);
    const shadowY = this.D;
    // We add extra padding to the SVG to account for drop shadows
    const pad = 12; 
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.W + pad*2}" height="${this.H + this.D + pad*2}" viewBox="-${pad} -${pad} ${this.W + pad*2} ${this.H + this.D + pad*2}">
        <defs>
          <linearGradient id="ivoryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${this.IVORY_TOP}"/>
            <stop offset="90%" stop-color="${this.IVORY_BOTTOM}"/>
            <stop offset="100%" stop-color="${this.IVORY_EDGE}"/>
          </linearGradient>
          
          <linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${this.LACQUER_BACK}"/>
            <stop offset="100%" stop-color="${this.LACQUER_BACK_DARK}"/>
          </linearGradient>

          <!-- Specular Gloss Highlight -->
          <linearGradient id="glossGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="white" stop-opacity="0.6"/>
            <stop offset="30%" stop-color="white" stop-opacity="0.1"/>
            <stop offset="50%" stop-color="white" stop-opacity="0"/>
          </linearGradient>

          <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.5" />
          </filter>

          <filter id="engrave" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-color="white" flood-opacity="0.8" />
            <feDropShadow dx="0" dy="-1" stdDeviation="1" flood-color="black" flood-opacity="0.4" />
          </filter>
        </defs>

        <!-- 3D Base (Back of the tile with Drop Shadow) -->
        <rect x="0" y="${shadowY}" width="${this.W}" height="${this.H}" rx="${this.RX}" fill="url(#backGrad)" filter="url(#dropShadow)" />
        
        <!-- Main Ivory Body -->
        <rect x="0" y="0" width="${this.W}" height="${this.H}" rx="${this.RX}" fill="url(#ivoryGrad)" stroke="#B3A588" stroke-width="1.5"/>
        
        <!-- Glossy Overlay -->
        <rect x="1" y="1" width="${this.W-2}" height="${this.H-2}" rx="${this.RX-1}" fill="url(#glossGrad)" pointer-events="none"/>

        <!-- Tile Face Symbols -->
        <g transform="translate(0, 0)" filter="url(#engrave)">
          ${content}
        </g>
      </svg>
    `.trim();
  }

  // Symbol rendering implementation same as before but adjusted to new W/H
  private static renderFaceContent(suit: string, rank: number | string): string {
    const cx = this.W / 2;
    const cy = this.H / 2;
    
    if (suit === 'circles') return this.renderCircles(Number(rank), cx, cy);
    if (suit === 'bamboo') return this.renderBamboos(Number(rank), cx, cy);
    if (suit === 'characters') return this.renderCharacters(Number(rank), cx, cy);
    if (suit === 'winds') return this.renderChineseChar(this.getWindChar(rank as string), cx, cy, this.BLACK_INK, 48);
    if (suit === 'dragons') return this.renderDragon(rank as string, cx, cy);
    
    return `<text x="${cx}" y="${cy}" font-family="sans-serif" font-size="28" font-weight="bold" fill="${this.BLACK_INK}" text-anchor="middle" dominant-baseline="central">${suit[0].toUpperCase()}${rank}</text>`;
  }

  private static renderCircles(rank: number, cx: number, cy: number): string {
    const drawCircle = (x: number, y: number, color: string, r2: number = 9) => 
      `<circle cx="${x}" cy="${y}" r="${r2}" fill="${color}" stroke="${this.BLACK_INK}" stroke-width="0.5" />
       <circle cx="${x}" cy="${y}" r="${r2*0.35}" fill="${this.IVORY_TOP}" />
       <circle cx="${x-r2*0.3}" cy="${y-r2*0.3}" r="${r2*0.2}" fill="white" fill-opacity="0.6" />`;

    let svg = '';
    const r = 11;
    if (rank === 1) {
      svg += `<circle cx="${cx}" cy="${cy}" r="28" fill="${this.RED_INK}" stroke="${this.BLACK_INK}" stroke-width="2"/>
              <circle cx="${cx}" cy="${cy}" r="14" fill="${this.BLUE_INK}" />
              <circle cx="${cx}" cy="${cy}" r="7" fill="${this.IVORY_TOP}" />
              <circle cx="${cx-8}" cy="${cy-8}" r="4" fill="white" fill-opacity="0.6"/>`;
    } else if (rank === 2) {
      svg += drawCircle(cx, cy - 20, this.GREEN_INK, r);
      svg += drawCircle(cx, cy + 20, this.BLUE_INK, r);
    } else if (rank === 3) {
      svg += drawCircle(cx - 18, cy - 24, this.BLUE_INK, r);
      svg += drawCircle(cx, cy, this.RED_INK, r);
      svg += drawCircle(cx + 18, cy + 24, this.GREEN_INK, r);
    } else if (rank === 4) {
      svg += drawCircle(cx - 16, cy - 20, this.BLUE_INK, r);
      svg += drawCircle(cx + 16, cy - 20, this.GREEN_INK, r);
      svg += drawCircle(cx - 16, cy + 20, this.GREEN_INK, r);
      svg += drawCircle(cx + 16, cy + 20, this.BLUE_INK, r);
    } else if (rank === 5) {
      svg += drawCircle(cx - 18, cy - 24, this.BLUE_INK, r);
      svg += drawCircle(cx + 18, cy - 24, this.GREEN_INK, r);
      svg += drawCircle(cx, cy, this.RED_INK, r);
      svg += drawCircle(cx - 18, cy + 24, this.GREEN_INK, r);
      svg += drawCircle(cx + 18, cy + 24, this.BLUE_INK, r);
    } else if (rank === 6) {
      [-26, 0, 26].forEach((y, i) => {
        svg += drawCircle(cx - 16, cy + y, i === 1 ? this.RED_INK : this.GREEN_INK, r);
        svg += drawCircle(cx + 16, cy + y, i === 1 ? this.RED_INK : this.GREEN_INK, r);
      });
    } else if (rank === 7) {
      svg += drawCircle(cx - 18, cy - 30, this.GREEN_INK, r*0.85);
      svg += drawCircle(cx + 18, cy - 26, this.GREEN_INK, r*0.85);
      svg += drawCircle(cx, cy - 12, this.GREEN_INK, r*0.85);
      svg += drawCircle(cx - 16, cy + 8, this.RED_INK, r*0.85);
      svg += drawCircle(cx + 16, cy + 8, this.RED_INK, r*0.85);
      svg += drawCircle(cx - 16, cy + 30, this.RED_INK, r*0.85);
      svg += drawCircle(cx + 16, cy + 30, this.RED_INK, r*0.85);
    } else if (rank === 8) {
      [-30, -10, 10, 30].forEach(y => {
        svg += drawCircle(cx - 16, cy + y, this.BLUE_INK, r*0.85);
        svg += drawCircle(cx + 16, cy + y, this.BLUE_INK, r*0.85);
      });
    } else if (rank === 9) {
      [-28, 0, 28].forEach((y, i) => {
        const c = [this.BLUE_INK, this.RED_INK, this.GREEN_INK][i];
        svg += drawCircle(cx - 20, cy + y, c, r*0.9);
        svg += drawCircle(cx, cy + y, c, r*0.9);
        svg += drawCircle(cx + 20, cy + y, c, r*0.9);
      });
    }
    return svg;
  }

  private static renderBamboos(rank: number, cx: number, cy: number): string {
    if (rank === 1) {
      return `<path d="M ${cx} ${cy-20} C ${cx+25} ${cy-5}, ${cx+20} ${cy+30}, ${cx} ${cy+25} C ${cx-20} ${cy+30}, ${cx-25} ${cy-5}, ${cx} ${cy-20} Z" fill="${this.GREEN_INK}" stroke="${this.RED_INK}" stroke-width="2"/>
              <circle cx="${cx}" cy="${cy-22}" r="5" fill="${this.RED_INK}"/>
              <path d="M ${cx-10} ${cy} L ${cx+10} ${cy} M ${cx-6} ${cy+10} L ${cx+6} ${cy+10}" stroke="${this.IVORY_TOP}" stroke-width="2"/>`;
    }

    const drawStick = (x: number, y: number, color: string) => 
      `<rect x="${x-3.5}" y="${y-12}" width="7" height="24" rx="3.5" fill="${color}" />
       <line x1="${x-2.5}" y1="${y}" x2="${x+2.5}" y2="${y}" stroke="${this.IVORY_TOP}" stroke-width="2"/>
       <rect x="${x-2}" y="${y-10}" width="2" height="20" fill="white" fill-opacity="0.3" rx="1"/>`;

    let svg = '';
    const offX = 16;
    const offY = 24;

    if (rank === 2) {
      svg += drawStick(cx, cy - offY, this.BLUE_INK) + drawStick(cx, cy + offY, this.GREEN_INK);
    } else if (rank === 3) {
      svg += drawStick(cx, cy - offY, this.BLUE_INK) + drawStick(cx - offX, cy + offY, this.GREEN_INK) + drawStick(cx + offX, cy + offY, this.GREEN_INK);
    } else if (rank === 4) {
      svg += drawStick(cx - offX, cy - offY, this.BLUE_INK) + drawStick(cx + offX, cy - offY, this.GREEN_INK) + drawStick(cx - offX, cy + offY, this.GREEN_INK) + drawStick(cx + offX, cy + offY, this.BLUE_INK);
    } else if (rank === 5) {
      svg += drawStick(cx - offX, cy - offY, this.GREEN_INK) + drawStick(cx + offX, cy - offY, this.BLUE_INK) + drawStick(cx, cy, this.RED_INK) + drawStick(cx - offX, cy + offY, this.BLUE_INK) + drawStick(cx + offX, cy + offY, this.GREEN_INK);
    } else if (rank === 6) {
      svg += drawStick(cx - offX, cy - offY, this.GREEN_INK) + drawStick(cx, cy - offY, this.GREEN_INK) + drawStick(cx + offX, cy - offY, this.GREEN_INK);
      svg += drawStick(cx - offX, cy + offY, this.BLUE_INK) + drawStick(cx, cy + offY, this.BLUE_INK) + drawStick(cx + offX, cy + offY, this.BLUE_INK);
    } else if (rank === 7) {
      svg += drawStick(cx, cy - 32, this.RED_INK);
      svg += drawStick(cx - offX, cy, this.GREEN_INK) + drawStick(cx, cy, this.GREEN_INK) + drawStick(cx + offX, cy, this.GREEN_INK);
      svg += drawStick(cx - offX, cy + 32, this.BLUE_INK) + drawStick(cx, cy + 32, this.BLUE_INK) + drawStick(cx + offX, cy + 32, this.BLUE_INK);
    } else if (rank === 8) {
      svg += drawStick(cx - offX, cy - 30, this.GREEN_INK) + drawStick(cx + offX, cy - 30, this.GREEN_INK);
      svg += drawStick(cx - 22, cy, this.RED_INK) + drawStick(cx + 22, cy, this.RED_INK);
      svg += drawStick(cx - offX, cy + 30, this.BLUE_INK) + drawStick(cx + offX, cy + 30, this.BLUE_INK);
    } else if (rank === 9) {
      [-30, 0, 30].forEach((y, i) => {
        const c = [this.RED_INK, this.BLUE_INK, this.GREEN_INK][i];
        svg += drawStick(cx - offX, cy + y, c) + drawStick(cx, cy + y, c) + drawStick(cx + offX, cy + y, c);
      });
    }
    return svg;
  }

  private static renderCharacters(rank: number, cx: number, cy: number): string {
    const wan = this.renderChineseChar('萬', cx, cy + 22, this.RED_INK, 40);
    const numChar = ['一','二','三','四','五','六','七','八','九'][rank - 1];
    const topNum = this.renderChineseChar(numChar, cx, cy - 22, this.BLACK_INK, 40);
    return topNum + wan;
  }

  private static getWindChar(wind: string): string {
    switch(wind) {
      case 'east': return '東';
      case 'south': return '南';
      case 'west': return '西';
      case 'north': return '北';
      default: return '?';
    }
  }

  private static renderDragon(dragon: string, cx: number, cy: number): string {
    if (dragon === 'red') return this.renderChineseChar('中', cx, cy, this.RED_INK, 56);
    if (dragon === 'green') return this.renderChineseChar('發', cx, cy, this.GREEN_INK, 56);
    if (dragon === 'white') {
      return `<rect x="${cx - 20}" y="${cy - 28}" width="40" height="56" fill="none" stroke="${this.BLUE_INK}" stroke-width="5" rx="3" />
              <rect x="${cx - 16}" y="${cy - 24}" width="32" height="48" fill="none" stroke="${this.BLUE_INK}" stroke-width="2" stroke-dasharray="4,4" />`;
    }
    return '';
  }

  private static renderChineseChar(char: string, cx: number, cy: number, color: string, size: number = 48): string {
    return `<text x="${cx}" y="${cy + size * 0.1}" font-family="'Noto Serif SC', 'KaiTi', 'STKaiti', serif" font-size="${size}" font-weight="900" fill="${color}" text-anchor="middle" dominant-baseline="central">${char}</text>`;
  }
}
