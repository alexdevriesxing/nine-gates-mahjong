import { useEffect, useRef } from 'react';

export default function NativeBanner() {
  return (
    <div className="w-full flex justify-center items-center my-4">
      <div className="w-full max-w-[800px] min-h-[100px] bg-ink-950/50 border border-gold/10 flex justify-center items-center overflow-hidden">
        <iframe
          src="/native.html"
          width="100%"
          height="100%"
          style={{ minHeight: '100px', border: 'none', overflow: 'hidden' }}
          frameBorder="0"
          scrolling="no"
          title="Native Ad"
        />
      </div>
    </div>
  );
}
