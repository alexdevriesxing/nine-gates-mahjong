import { useEffect, useRef, useState } from 'react';
import { useAds } from '../context/AdContext';

const MIN_HEIGHT = 300;
const MAX_HEIGHT = 800;

export default function NativeBanner() {
  const { adsEnabled } = useAds();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    if (!adsEnabled) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { type?: string; height?: number } | null;
      if (!data || data.type !== 'ngm-native-height') return;
      const reported = Number(data.height);
      if (!Number.isFinite(reported) || reported <= 0) return;
      setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(reported))));
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [adsEnabled]);

  return (
    <aside className="w-full flex justify-center items-center my-4" aria-label="Advertisement">
      <div
        className="w-full max-w-[800px] bg-ink-950/50 border border-gold/10 flex justify-center items-center overflow-hidden"
        style={{ minHeight: adsEnabled ? height : 100 }}
        data-nosnippet
      >
        {adsEnabled ? (
          <iframe
            ref={frameRef}
            src="/native-frame"
            width="100%"
            height={height}
            style={{ display: 'block', width: '100%', border: 'none', overflow: 'hidden' }}
            scrolling="no"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Native advertisement"
          />
        ) : (
          <div className="flex min-h-[100px] items-center gap-3 px-6 text-center text-sm text-ink-300">
            <img className="h-8 w-8 opacity-70" src="/favicon.svg" alt="" />
            <span>Free play supported by advertising</span>
          </div>
        )}
      </div>
    </aside>
  );
}
