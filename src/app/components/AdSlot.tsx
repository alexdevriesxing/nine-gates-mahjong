import { useState } from 'react';
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
  const key = import.meta.env.VITE_ADSTERRA_BANNER_KEY as string | undefined;
  const live = adsEnabled && key && !key.startsWith('placeholder') && !failed;

  return (
    <aside
      className={`ad-slot ${sticky ? 'ad-slot--sticky' : ''} ${className}`}
      style={{ '--ad-width': `${width}px`, '--ad-height': `${height}px` } as React.CSSProperties}
      aria-label={label}
    >
      <span>{label}</span>
      {live ? (
        <iframe
          src={`/ad.html?key=${encodeURIComponent(key)}&w=${width}&h=${height}`}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setFailed(true)}
          title={label}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
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
