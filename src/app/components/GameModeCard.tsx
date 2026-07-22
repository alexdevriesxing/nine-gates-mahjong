import { Link } from 'react-router-dom';
import type { GameModeInfo } from '@shared/types';

interface GameModeCardProps {
  mode: GameModeInfo;
}

const GAME_IMAGES: Record<string, string> = {
  'mahjongg-solitaire': '/images/solitaire_card.webp',
  'daily-puzzle': '/images/daily_card.webp',
  'zen-mahjongg': '/images/zen_card.webp',
  'time-attack': '/images/time_attack_card.webp',
  'mahjong-connect': '/images/connect_card.webp',
  'shisen-sho': '/images/shisen_card.webp',
  'mahjongg-memory': '/images/memory_card.webp',
  'real-mahjong': '/images/real_mahjong_card.webp',
  lobby: '/images/lobby_card.webp',
};

export default function GameModeCard({ mode }: GameModeCardProps) {
  return (
    <Link to={mode.path} className="game-card block group h-full flex flex-col">
      <div className="card-image relative overflow-hidden shrink-0 h-48 bg-ink-950 flex items-center justify-center">
        <img 
          src={GAME_IMAGES[mode.id] ?? '/favicon.svg'}
          alt={mode.name} 
          width="1024"
          height="1024"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 ease-out" 
        />
        {/* Subtle decorative vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,16,0.4)_100%)]" />
      </div>
      
      <div className="card-body flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-display text-xl text-gold group-hover:text-gold-light transition-colors">
            {mode.name}
          </h3>
          <span className="badge badge-jade shrink-0">Play Now</span>
        </div>
        
        <p className="text-ink-200 text-sm mb-4 flex-grow">
          {mode.description}
        </p>
        
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-400 mt-auto">
          <span>Difficulty: {mode.difficulty}</span>
        </div>
      </div>
    </Link>
  );
}
