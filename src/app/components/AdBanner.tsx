import { useEffect, useRef } from 'react';

interface AdBannerProps {
  keyId: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdBanner({ keyId, width, height, className = '' }: AdBannerProps) {
  return (
    <div 
      className={`flex justify-center items-center overflow-hidden bg-ink-950/50 border border-gold/10 ${className}`} 
      style={{ minHeight: height, minWidth: width }}
    >
      <iframe 
        src={`/ad.html?key=${keyId}&w=${width}&h=${height}`}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        title="Adsterra Banner"
        style={{ border: 'none', overflow: 'hidden' }}
      />
    </div>
  );
}
