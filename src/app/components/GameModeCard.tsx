import { Link } from 'react-router-dom';
import type { GameModeInfo } from '@shared/types';

interface GameModeCardProps {
  mode: GameModeInfo;
}

export default function GameModeCard({ mode }: GameModeCardProps) {
  const isPlayable = mode.status === 'playable';
  
  return (
    <Link to={mode.path} className="game-card block group h-full flex flex-col">
      <div className={`card-image relative overflow-hidden bg-gradient-to-br shrink-0 ${
        mode.color === 'jade' ? 'from-jade-800 to-jade-950' : 
        mode.color === 'gold' ? 'from-gold-dark to-ink-900' :
        mode.color === 'vermilion' ? 'from-vermilion-dark to-ink-900' :
        'from-ink-800 to-ink-950'
      }`}>
        <span className="text-6xl drop-shadow-lg transform transition-transform group-hover:scale-110 duration-500">
          {mode.icon}
        </span>
        
        {/* Subtle decorative overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
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
