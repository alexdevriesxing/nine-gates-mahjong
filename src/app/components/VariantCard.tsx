import { Link } from 'react-router-dom';
import type { MahjongVariant } from '@shared/types';

interface VariantCardProps {
  variant: MahjongVariant;
}

export default function VariantCard({ variant }: VariantCardProps) {
  const isPlayable = variant.status === 'playable';
  
  // Convert complexity string to number of dots (1-4)
  const complexityLevel = 
    variant.complexity === 'beginner' ? 1 :
    variant.complexity === 'intermediate' ? 2 :
    variant.complexity === 'advanced' ? 3 : 4;
    
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl bg-ink-900 w-16 h-16 flex items-center justify-center rounded-xl border border-gold/20 shrink-0">
          {variant.regionFlag}
        </div>
        <div>
          <div className="text-xs font-semibold text-gold tracking-wider uppercase mb-1">
            {variant.region}
          </div>
          <h3 className="font-display text-xl text-ivory leading-tight">
            {variant.name}
          </h3>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4 mt-2 bg-ink-900/50 p-2 rounded border border-ink-700">
        <span className="text-xs text-ink-300 uppercase font-semibold">Complexity:</span>
        <div className="complexity-meter">
          {[1, 2, 3, 4].map(level => (
            <div 
              key={level} 
              className={`complexity-dot ${level <= complexityLevel ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      
      <p className="text-ink-200 text-sm flex-grow mb-6">
        {variant.style}
      </p>
      
      <div className="mt-auto">
        <Link 
          to={variant.path} 
          className={`w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide text-center block transition-all ${
            isPlayable 
              ? 'bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20' 
              : 'bg-ink-800 text-ink-400 border border-ink-700 cursor-default'
          }`}
          onClick={(e) => !isPlayable && e.preventDefault()}
        >
          {isPlayable ? 'Explore Rules & Play' : 'Coming Soon'}
        </Link>
      </div>
    </div>
  );
}
