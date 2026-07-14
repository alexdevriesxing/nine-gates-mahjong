import { useAds } from '../context/AdContext';

export default function NativeBanner() {
  const { adsEnabled } = useAds();

  return (
    <aside className="w-full flex justify-center items-center my-4" aria-label="Advertisement">
      <div className="w-full max-w-[800px] min-h-[100px] bg-ink-950/50 border border-gold/10 flex justify-center items-center overflow-hidden">
        {adsEnabled ? (
          <iframe
            src="/native-frame"
            width="100%"
            height="100%"
            style={{ minHeight: '100px', border: 'none', overflow: 'hidden' }}
            frameBorder="0"
            scrolling="no"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Native advertisement"
          />
        ) : (
          <div className="flex min-h-[100px] items-center gap-3 px-6 text-center text-sm text-ink-300">
            <img className="h-8 w-8 opacity-70" src="/favicon.svg" alt="" />
            <span>Free play supported by optional advertising</span>
          </div>
        )}
      </div>
    </aside>
  );
}
