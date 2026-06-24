import { Link } from 'react-router-dom';
import type { GameModeInfo } from '@shared/types';

interface GameModeCardProps {
  mode: GameModeInfo;
}

export default function GameModeCard({ mode }: GameModeCardProps) {
  const isPlayable = mode.status === 'playable';

  // Map mode.id to the correct image file name
  const getImageSrc = (id: string) => {
    switch (id) {
      case 'mahjongg-solitaire': return '/images/solitaire_card.png';
      case 'daily-puzzle': return '/images/daily_card.png';
      case 'zen-mahjongg': return '/images/zen_card.png';
      case 'time-attack': return '/images/time_attack_card.png';
      case 'mahjong-connect': return '/images/connect_card.png';
      case 'shisen-sho': return '/images/shisen_card.png';
      case 'mahjongg-memory': return '/images/memory_card.png';
      case 'real-mahjong': return '/images/real_mahjong_card.png';
      case 'lobby': return '/images/lobby_card.png';
      default: return '';
    }
  };
  
  return (
    <Link to={mode.path} className="game-card block group h-full flex flex-col">
      <div className="card-image relative overflow-hidden shrink-0 h-48 bg-ink-950 flex items-center justify-center">
        <img 
          src={getImageSrc(mode.id)} 
          alt={mode.name} 
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
          {isPlayable ? (
            <span className="badge badge-jade shrink-0">Play Now</span>
          ) : (
            <span className="badge badge-ink shrink-0">Coming Soon</span>
          )}
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
