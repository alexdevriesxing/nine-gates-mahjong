import { useState } from 'react';
import { useAds } from '../context/AdContext';

interface AdSlotProps {
  width: number;
  height: number;
  label?: string;
  className?: string;
  sticky?: boolean;
}

const ADSTERRA_KEYS: Record<string, string | undefined> = {
  '320x50': import.meta.env.VITE_ADSTERRA_320X50_KEY,
  '728x90': import.meta.env.VITE_ADSTERRA_728X90_KEY,
  '160x600': import.meta.env.VITE_ADSTERRA_160X600_KEY,
};

export default function AdSlot({
  width,
  height,
  label = 'Advertisement',
  className = '',
  sticky = false,
}: AdSlotProps) {
  const { adsEnabled } = useAds();
  const [failed, setFailed] = useState(false);
  const key = ADSTERRA_KEYS[`${width}x${height}`]?.trim();
  const liveKey = adsEnabled && key && !failed ? key : null;

  return (
    <aside
      className={`ad-slot ${sticky ? 'ad-slot--sticky' : ''} ${className}`}
      style={{ '--ad-width': `${width}px`, '--ad-height': `${height}px` } as React.CSSProperties}
      aria-label={label}
    >
      <span>{label}</span>
      {liveKey ? (
        <iframe
          src={`/ad.html?key=${encodeURIComponent(liveKey)}&w=${width}&h=${height}`}
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
