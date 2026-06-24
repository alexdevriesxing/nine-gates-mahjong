import { useEffect, useRef } from 'react';

interface AdBannerProps {
  keyId: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdBanner({ keyId, width, height, className = '' }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up container before injecting
    containerRef.current.innerHTML = '';
    
    // Create config script
    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `
      atOptions = {
        'key' : '${keyId}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    containerRef.current.appendChild(conf);
    
    // Create invoke script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.highperformanceformat.com/${keyId}/invoke.js`;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [keyId, width, height]);

  return (
    <div 
      className={`flex justify-center items-center overflow-hidden bg-ink-950/50 border border-gold/10 ${className}`} 
      style={{ minHeight: height, minWidth: width }}
    >
      <div ref={containerRef} />
    </div>
  );
}
