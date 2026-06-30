interface NativeBannerProps {
  placement?: string;
  priority?: boolean;
}

export default function NativeBanner({ placement = 'native', priority = false }: NativeBannerProps) {
  return (
    <div className="native-ad w-full flex justify-center items-center my-4" data-ad-placement={placement}>
      <div className="native-ad__frame w-full max-w-[800px] bg-ink-950/50 border border-gold/10 flex justify-center items-center overflow-hidden">
        <iframe
          src={`/native.html?placement=${encodeURIComponent(placement)}`}
          width="100%"
          height="100%"
          style={{ minHeight: '260px', border: 'none', overflow: 'hidden' }}
          frameBorder="0"
          scrolling="no"
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="strict-origin-when-cross-origin"
          title="Native Ad"
        />
      </div>
    </div>
  );
}
