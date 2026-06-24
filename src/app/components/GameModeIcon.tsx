import React from 'react';

interface GameModeIconProps {
  id: string;
  className?: string;
}

export default function GameModeIcon({ id, className = '' }: GameModeIconProps) {
  const baseClass = `w-24 h-24 drop-shadow-xl ${className}`;

  switch (id) {
    case 'mahjongg-solitaire':
      // High-fidelity 3D-angled Red Dragon '中' Tile
      return (
        <svg viewBox="0 0 100 120" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tileBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8A2C1B" />
              <stop offset="100%" stopColor="#4A1208" />
            </linearGradient>
            <linearGradient id="tileFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="100%" stopColor="#E6DECE" />
            </linearGradient>
            <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>
          {/* 3D Lacquer Layer */}
          <rect x="8" y="18" width="76" height="96" rx="10" fill="url(#tileBack)" filter="url(#tileShadow)" />
          {/* Ivory Body */}
          <rect x="8" y="10" width="76" height="96" rx="10" fill="url(#tileFront)" stroke="#C4A35A" strokeWidth="1.5" />
          {/* Gloss overlay */}
          <path d="M 12 14 Q 46 11, 80 14 Q 76 40, 78 50 Q 44 48, 12 50 Z" fill="white" fillOpacity="0.15" />
          {/* Red Dragon Symbol '中' */}
          <g stroke="#BC251E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Vertical stem */}
            <path d="M 46 26 L 46 82" />
            {/* Box */}
            <path d="M 28 36 H 64 V 62 H 28 Z" fill="#9C1E18" fillOpacity="0.2" strokeWidth="4" />
          </g>
          {/* Ornate Gold Border Line */}
          <rect x="13" y="15" width="66" height="86" rx="6" stroke="#C4A35A" strokeWidth="0.75" strokeDasharray="3,3" fill="none" opacity="0.7" />
        </svg>
      );

    case 'daily-puzzle':
      // Ornate Bronze Temple Gong
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bronzeFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A67C45" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#5C4017" />
            </linearGradient>
            <linearGradient id="goldGong" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F3E5AB" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C6212" />
            </linearGradient>
          </defs>
          {/* Torii/Temple Frame */}
          <path d="M 15 85 L 15 20 L 85 20 L 85 85" stroke="url(#bronzeFrame)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 8 20 Q 50 12, 92 20" stroke="url(#bronzeFrame)" strokeWidth="8" strokeLinecap="round" />
          {/* Hanger ropes */}
          <path d="M 35 20 L 35 35 M 65 20 L 65 35" stroke="#BC251E" strokeWidth="3" />
          {/* The Gong */}
          <circle cx="50" cy="48" r="24" fill="url(#goldGong)" stroke="#5C4017" strokeWidth="2" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.5))" />
          <circle cx="50" cy="48" r="16" stroke="#A67C45" strokeWidth="1" strokeDasharray="4,2" />
          <circle cx="50" cy="48" r="4" fill="#5C4017" />
          {/* Mallet */}
          <path d="M 22 75 L 42 62" stroke="#FFFDF5" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="18" y="70" width="8" height="12" rx="4" transform="rotate(-30 18 70)" fill="#BC251E" stroke="#5C4017" strokeWidth="1" />
        </svg>
      );

    case 'zen-mahjongg':
      // Glowing Pink Lotus in Zen style
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lotusRipple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D5A4C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#080810" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Water ripples */}
          <ellipse cx="50" cy="76" rx="35" ry="8" fill="url(#lotusRipple)" />
          <ellipse cx="50" cy="76" rx="25" ry="5" stroke="#7eeaab" strokeWidth="1" opacity="0.5" />
          <ellipse cx="50" cy="76" rx="15" ry="3" stroke="#7eeaab" strokeWidth="0.75" opacity="0.3" />
          {/* Lotus Petals */}
          <g filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.4))">
            {/* Outer Petals */}
            <path d="M 50 72 C 20 70, 15 50, 50 80 C 85 50, 80 70, 50 72 Z" fill="#DA70D6" fillOpacity="0.4" stroke="#EE82EE" strokeWidth="1" />
            <path d="M 50 74 C 25 65, 30 40, 50 76 C 70 40, 75 65, 50 74 Z" fill="#FFB6C1" fillOpacity="0.6" stroke="#FF69B4" strokeWidth="1" />
            {/* Mid Petals */}
            <path d="M 50 75 C 32 60, 38 30, 50 78 C 62 30, 68 60, 50 75 Z" fill="#FFC0CB" fillOpacity="0.8" stroke="#FF1493" strokeWidth="1.2" />
            {/* Inner Center Petals */}
            <path d="M 50 76 C 40 50, 42 22, 50 78 C 58 22, 60 50, 50 76 Z" fill="#FFF0F5" stroke="#FF69B4" strokeWidth="1.5" />
            {/* Golden Lotus seed pod */}
            <ellipse cx="50" cy="65" rx="6" ry="4" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
          </g>
        </svg>
      );

    case 'time-attack':
      // Ornate Dragon Sundial / Bronze Sandglass
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8C6212" />
              <stop offset="50%" stopColor="#C4A35A" />
              <stop offset="100%" stopColor="#3A2807" />
            </linearGradient>
            <linearGradient id="redSand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E03C31" />
              <stop offset="100%" stopColor="#80150F" />
            </linearGradient>
          </defs>
          {/* Hourglass Ornate frame */}
          <path d="M 30 18 L 70 18 M 30 82 L 70 82 M 35 18 L 35 82 M 65 18 L 65 82" stroke="url(#bronze)" strokeWidth="5" strokeLinecap="round" />
          {/* Glass bulb shape */}
          <path d="M 38 20 C 38 42, 46 48, 46 50 C 46 52, 38 58, 38 80 H 62 C 62 58, 54 52, 54 50 C 54 48, 62 42, 62 20 Z" fill="rgba(255, 255, 255, 0.08)" stroke="url(#bronze)" strokeWidth="2.5" />
          {/* Sand top */}
          <path d="M 40 28 C 40 40, 60 40, 60 28 Z" fill="url(#redSand)" />
          {/* Sand falling line */}
          <line x1="50" y1="36" x2="50" y2="70" stroke="#E03C31" strokeWidth="2" strokeDasharray="3,3" />
          {/* Sand bottom stack */}
          <path d="M 42 80 C 45 68, 55 68, 58 80 Z" fill="url(#redSand)" />
          {/* Ornate Dragon Filigree Caps */}
          <rect x="26" y="10" width="48" height="8" rx="2" fill="url(#bronze)" stroke="#3A2807" strokeWidth="1" />
          <rect x="26" y="82" width="48" height="8" rx="2" fill="url(#bronze)" stroke="#3A2807" strokeWidth="1" />
        </svg>
      );

    case 'mahjong-connect':
      // Red Silk Chinese Endless Knot (Pan Chang Knot)
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <filter id="knotShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <g filter="url(#knotShadow)" stroke="#E03C31" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            {/* The loops of the knot */}
            <path d="M 50 15 L 25 40 L 50 65 L 75 40 Z" />
            <path d="M 50 25 L 35 40 L 50 55 L 65 40 Z" />
            <path d="M 25 40 H 75" />
            <path d="M 50 15 V 65" />
            {/* Loops on sides */}
            <path d="M 25 40 C 15 30, 15 50, 25 40" />
            <path d="M 75 40 C 85 30, 85 50, 75 40" />
            <path d="M 50 15 C 40 5, 60 5, 50 15" />
            {/* Tassels hanging at bottom */}
            <path d="M 50 65 V 82" stroke="#BC251E" strokeWidth="4" />
            <circle cx="50" cy="68" r="4.5" fill="#C4A35A" stroke="none" />
            <path d="M 45 82 L 45 92 M 50 82 L 50 94 M 55 82 L 55 92" stroke="#BC251E" strokeWidth="2.5" />
          </g>
        </svg>
      );

    case 'shisen-sho':
      // Traditional Japanese Hanafuda Card (Cherry Blossom & Red Sun)
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>
          {/* Card Border */}
          <rect x="25" y="10" width="50" height="80" rx="4" fill="#080810" stroke="#FFFDF5" strokeWidth="2" filter="url(#cardShadow)" />
          {/* Card Inner Background */}
          <rect x="29" y="14" width="42" height="72" fill="#FFF5EE" />
          {/* Red Sun */}
          <circle cx="50" cy="38" r="16" fill="#E03C31" />
          {/* Stylized Black Hills */}
          <path d="M 29 86 C 40 76, 60 76, 71 86 Z" fill="#080810" />
          <path d="M 38 86 C 50 70, 58 74, 71 86 Z" fill="#1A1A2E" />
          {/* Pine Needles / Branch */}
          <path d="M 71 50 Q 55 58, 40 68" stroke="#5C4017" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="53" r="2" fill="#1E5A3A" />
          <circle cx="55" cy="56" r="2.5" fill="#1E5A3A" />
          <circle cx="48" cy="61" r="2" fill="#1E5A3A" />
        </svg>
      );

    case 'mahjongg-memory':
      // Yin-Yang Gold Medallion
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="30%" stopColor="#C4A35A" />
              <stop offset="70%" stopColor="#8A641A" />
              <stop offset="100%" stopColor="#FFF2B2" />
            </linearGradient>
          </defs>
          {/* Ornate Gold Rim Outer Circle */}
          <circle cx="50" cy="50" r="44" fill="url(#goldRim)" filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.5))" />
          {/* Decorative notches */}
          <circle cx="50" cy="50" r="39" stroke="#3A2807" strokeWidth="1.5" strokeDasharray="6,4" />
          {/* Core Medallion Inner */}
          <circle cx="50" cy="50" r="35" fill="#080810" />
          
          {/* Yin-Yang Symbol */}
          <g>
            {/* White side */}
            <path d="M 50 15 A 17.5 17.5 0 0 0 50 50 A 17.5 17.5 0 0 1 50 85 A 35 35 0 0 0 50 15 Z" fill="#FFFDF5" />
            {/* Small dots */}
            <circle cx="50" cy="32.5" r="5" fill="#080810" />
            <circle cx="50" cy="67.5" r="5" fill="#FFFDF5" />
          </g>
        </svg>
      );

    case 'real-mahjong':
      // Hand of authentic tiles and rolling bone dice
      return (
        <svg viewBox="0 0 120 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tileBackMini" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E5A3A" />
              <stop offset="100%" stopColor="#0B2F1B" />
            </linearGradient>
            <linearGradient id="tileFrontMini" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="100%" stopColor="#E6DECE" />
            </linearGradient>
          </defs>
          
          {/* Three cascading tiles */}
          {/* Tile 1 */}
          <g transform="translate(15, 20)">
            <rect x="0" y="5" width="28" height="40" rx="4" fill="url(#tileBackMini)" />
            <rect x="0" y="0" width="28" height="40" rx="4" fill="url(#tileFrontMini)" stroke="#C4A35A" strokeWidth="1" />
            {/* Character One '一' */}
            <line x1="6" y1="14" x2="22" y2="14" stroke="#143152" strokeWidth="3" strokeLinecap="round" />
            <text x="14" y="32" fontFamily="serif" fontSize="11" fontWeight="bold" fill="#BC251E" textAnchor="middle">萬</text>
          </g>

          {/* Tile 2 */}
          <g transform="translate(32, 28) rotate(-5)">
            <rect x="0" y="5" width="28" height="40" rx="4" fill="url(#tileBackMini)" />
            <rect x="0" y="0" width="28" height="40" rx="4" fill="url(#tileFrontMini)" stroke="#C4A35A" strokeWidth="1" />
            {/* Green Dragon '發' */}
            <text x="14" y="24" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#1E5A3A" textAnchor="middle">發</text>
          </g>

          {/* Tile 3 */}
          <g transform="translate(52, 22) rotate(8)">
            <rect x="0" y="5" width="28" height="40" rx="4" fill="url(#tileBackMini)" />
            <rect x="0" y="0" width="28" height="40" rx="4" fill="url(#tileFrontMini)" stroke="#C4A35A" strokeWidth="1" />
            {/* Red Dragon '中' */}
            <text x="14" y="24" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#BC251E" textAnchor="middle">中</text>
          </g>

          {/* Bone Dice */}
          <g transform="translate(85, 55) rotate(15)" filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.4))">
            <rect x="0" y="0" width="18" height="18" rx="3" fill="#FFFDF5" stroke="#C4A35A" strokeWidth="0.75" />
            {/* Dots (Four is Red, others black) */}
            <circle cx="9" cy="9" r="2.5" fill="#BC251E" />
          </g>
          <g transform="translate(98, 40) rotate(-20)" filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.4))">
            <rect x="0" y="0" width="16" height="16" rx="3" fill="#FFFDF5" stroke="#C4A35A" strokeWidth="0.75" />
            {/* Dice Face: Two */}
            <circle cx="5" cy="5" r="1.5" fill="#181818" />
            <circle cx="11" cy="11" r="1.5" fill="#181818" />
          </g>
        </svg>
      );

    case 'lobby':
      // Assembly of ancient scrolls
      return (
        <svg viewBox="0 0 100 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scrollWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4A35A" />
              <stop offset="100%" stopColor="#8A641A" />
            </linearGradient>
            <linearGradient id="scrollPaper" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFF5EE" />
              <stop offset="100%" stopColor="#E6DECE" />
            </linearGradient>
          </defs>
          <g filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.5))">
            {/* Opened Scroll Background */}
            <rect x="18" y="25" width="64" height="42" rx="2" fill="url(#scrollPaper)" stroke="#C4A35A" strokeWidth="1.5" />
            <path d="M 28 35 H 72 M 28 45 H 72 M 28 55 H 72" stroke="#5C4017" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
            
            {/* Left Roller */}
            <rect x="12" y="20" width="6" height="52" rx="2" fill="url(#scrollWood)" stroke="#3A2807" strokeWidth="1" />
            <circle cx="15" cy="20" r="4.5" fill="#BC251E" />
            <circle cx="15" cy="72" r="4.5" fill="#BC251E" />
            
            {/* Right Roller */}
            <rect x="82" y="20" width="6" height="52" rx="2" fill="url(#scrollWood)" stroke="#3A2807" strokeWidth="1" />
            <circle cx="85" cy="20" r="4.5" fill="#BC251E" />
            <circle cx="85" cy="72" r="4.5" fill="#BC251E" />

            {/* Red Knot / Seal on scroll */}
            <path d="M 50 32 L 47 42 H 53 Z" fill="#BC251E" />
            <circle cx="50" cy="30" r="4.5" fill="#BC251E" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}
