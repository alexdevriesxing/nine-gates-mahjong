import { useEffect, useRef } from 'react';

export default function NativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    containerRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl29884536.effectivecpmnetwork.com/c9947e22755623a8fe8d556aa1ba06d5/invoke.js';
    
    const div = document.createElement('div');
    div.id = 'container-c9947e22755623a8fe8d556aa1ba06d5';
    
    containerRef.current.appendChild(script);
    containerRef.current.appendChild(div);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-4">
      <div ref={containerRef} className="w-full max-w-[800px] min-h-[100px] bg-ink-950/50 border border-gold/10 flex justify-center items-center" />
    </div>
  );
}
