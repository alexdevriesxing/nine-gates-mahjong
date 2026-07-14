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
  '320x50': import.meta.env.VITE_ADSTERRA_320X50_KEY || 'cdc33de3506804ba73d2d3661ed4fd0a',
  '728x90': import.meta.env.VITE_ADSTERRA_728X90_KEY || '759777117285af8156ae217ed7fc2a0b',
  '468x60': import.meta.env.VITE_ADSTERRA_468X60_KEY || '3d687f838f7b1a2353a56d39e059e906',
  '300x250': import.meta.env.VITE_ADSTERRA_300X250_KEY || '933dafe9ee5494fdc3ed74bb4ad047a6',
  '160x300': import.meta.env.VITE_ADSTERRA_160X300_KEY || '4492bd5c94522d00777227f98028a4c4',
  '160x600': import.meta.env.VITE_ADSTERRA_160X600_KEY || 'f2411eb715b2fe1af0fafb73c5825345',
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
          src={`/ad-frame.htm?key=${encodeURIComponent(liveKey)}&w=${width}&h=${height}`}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setFailed(true)}
          referrerPolicy="strict-origin-when-cross-origin"
          title={label}
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
