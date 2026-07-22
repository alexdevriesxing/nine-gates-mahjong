import { useEffect, useState } from 'react';
import { adsterraPlacementId } from '@shared/ads';
import { useAds } from '../context/AdContext';

interface AdSlotProps {
  width: number;
  height: number;
  label?: string;
  className?: string;
  sticky?: boolean;
}

export default function AdSlot({
  width,
  height,
  label = 'Advertisement',
  className = '',
  sticky = false,
}: AdSlotProps) {
  const { adsEnabled } = useAds();
  const [failed, setFailed] = useState(false);
  const placementId = adsterraPlacementId(width, height);
  const livePlacement = adsEnabled && placementId && !failed ? placementId : null;

  useEffect(() => {
    setFailed(false);
  }, [adsEnabled, placementId, width, height]);

  return (
    <aside
      className={`ad-slot ${sticky ? 'ad-slot--sticky' : ''} ${className}`}
      style={{ '--ad-width': `${width}px`, '--ad-height': `${height}px` } as React.CSSProperties}
      aria-label={label}
    >
      <span>{label}</span>
      {livePlacement ? (
        <iframe
          src={`/ad-frame?placement=${encodeURIComponent(livePlacement)}`}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setFailed(true)}
          referrerPolicy="strict-origin-when-cross-origin"
          title={`${label} (${width} by ${height})`}
        />
      ) : (
        <div className="ad-slot__house">
          <img src="/favicon.svg" alt="" />
          <small>Free play supported by advertising</small>
        </div>
      )}
    </aside>
  );
}
