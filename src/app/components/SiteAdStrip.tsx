import { useLocation } from 'react-router-dom';
import ResponsiveAdSlot from './ResponsiveAdSlot';

const EXACT_EXCLUSIONS = new Set([
  '/',
  '/play',
  '/mahjongg-solitaire',
  '/daily',
  '/zen-mahjongg',
  '/time-attack',
  '/mahjong-connect',
  '/shisen-sho',
  '/mahjongg-memory',
  '/real-mahjong',
  '/login',
  '/register',
  '/guest',
  '/profile',
  '/privacy',
  '/terms',
]);

export default function SiteAdStrip() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';

  if (EXACT_EXCLUSIONS.has(pathname)) return null;

  return (
    <div className="site-ad-strip" data-gaio-section="ads">
      <ResponsiveAdSlot
        label="Sponsored"
        placement={`route-top-${pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'}`}
        priority
        sizes={[
          { media: '(min-width: 768px)', width: 728, height: 90 },
          { width: 320, height: 50 },
        ]}
      />
    </div>
  );
}
