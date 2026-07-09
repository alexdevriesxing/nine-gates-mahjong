import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const clean = location.pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return null;

  const parts = clean.split('/').filter(Boolean);
  const items: Array<{ name: string; path: string }> = [];

  // Home link
  items.push({ name: 'Home', path: '/' });

  let currentPath = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath += `/${part}`;
    
    let name = part.replace(/[-/]/g, ' ');
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Special overrides
    if (part === 'play') name = 'Play';
    if (part === 'learn') name = 'Learn';
    if (part === 'real-mahjong') name = 'Real Mahjong';
    if (part === 'mcr') name = 'MCR';
    if (part === 'hong-kong') name = 'Hong Kong';
    if (part === 'riichi') name = 'Riichi';
    if (part === 'american') name = 'American';
    if (part === 'taiwanese') name = 'Taiwanese';
    if (part === 'mahjong-vs-mahjongg') name = 'Mahjong vs Mahjongg';
    if (part === 'how-to-play-mahjongg-solitaire') name = 'How to Play Solitaire';
    if (part === 'how-to-play-real-mahjong') name = 'How to Play Real Mahjong';
    if (part === 'chi-pung-kong') name = 'Chi, Pung & Kong';
    if (part === 'beginner-strategy') name = 'Beginner Strategy';
    if (part === 'mahjong-variants') name = 'Mahjong Variants';
    if (part === 'mahjong-tiles') name = 'Mahjong Tiles';
    if (part === 'how-to-win-mahjong') name = 'How to Win';
    if (part === 'mahjong-scoring-basics') name = 'Scoring Basics';
    if (part === 'common-mistakes') name = 'Common Mistakes';
    if (part === 'glossary') name = 'Glossary';

    items.push({
      name,
      path: currentPath,
    });
  }

  return (
    <nav className="mb-4 text-xs text-ink-300 flex items-center gap-2 select-none" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.path} className="flex items-center gap-2">
            {index > 0 && <span className="opacity-40" aria-hidden="true">/</span>}
            {isLast ? (
              <span className="text-gold font-medium truncate max-w-[150px] sm:max-w-none" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-gold transition-colors hover:underline">
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
