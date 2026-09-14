import { useEffect, useRef, useState } from 'react';
import { useAds } from '../context/AdContext';
import { recordAdDiagnostic } from '../adDiagnostics';

const MIN_HEIGHT = 300;
const MAX_HEIGHT = 800;

interface NativeBannerProps {
  loading?: 'eager' | 'lazy';
  diagnosticId?: string;
}

export default function NativeBanner({ loading = 'lazy', diagnosticId = 'native-banner' }: NativeBannerProps) {
  const { adsEnabled } = useAds();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const wrapperRef = useRef<HTMLElement | null>(null);
  const viewableTimerRef = useRef<number | null>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [failed, setFailed] = useState(false);
  const live = adsEnabled && !failed;

  useEffect(() => {
    setFailed(false);
  }, [adsEnabled]);

  useEffect(() => {
    if (!live) return;
    recordAdDiagnostic('ad_slot_registered', {
      placement: diagnosticId,
      loading,
      status: 'eligible',
    });
    recordAdDiagnostic('ad_slot_requested', {
      placement: diagnosticId,
      loading,
      status: 'requested',
    });
  }, [diagnosticId, live, loading]);

  useEffect(() => {
    if (!live) return undefined;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { type?: string; height?: number; status?: string } | null;
      if (!data) return;

      if (data.type === 'ngm-native-height') {
        const reported = Number(data.height);
        if (!Number.isFinite(reported) || reported <= 0) return;
        setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(reported))));
        return;
      }

      if (data.type === 'ngm-native-status' && data.status) {
        recordAdDiagnostic(`ad_provider_${data.status}`, {
          placement: diagnosticId,
          loading,
          status: data.status,
        });
        if (data.status === 'error') setFailed(true);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [diagnosticId, live, loading]);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || !live || typeof IntersectionObserver === 'undefined') return undefined;

    let visible50 = false;
    let viewable1s = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!visible50) {
            visible50 = true;
            recordAdDiagnostic('ad_slot_visible_50', { placement: diagnosticId, loading, status: 'visible' });
          }
          if (!viewable1s && viewableTimerRef.current === null) {
            viewableTimerRef.current = window.setTimeout(() => {
              viewable1s = true;
              viewableTimerRef.current = null;
              recordAdDiagnostic('ad_slot_viewable_1s', { placement: diagnosticId, loading, status: 'viewable' });
            }, 1000);
          }
        } else if (!viewable1s && viewableTimerRef.current !== null) {
          window.clearTimeout(viewableTimerRef.current);
          viewableTimerRef.current = null;
        }
      });
    }, { threshold: [0, 0.5] });

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (viewableTimerRef.current !== null) {
        window.clearTimeout(viewableTimerRef.current);
        viewableTimerRef.current = null;
      }
    };
  }, [diagnosticId, live, loading]);

  return (
    <aside ref={wrapperRef} className="w-full flex justify-center items-center my-4" aria-label="Advertisement" data-ad-placement="native-banner" data-ad-loading={loading}>
      <div
        className="w-full max-w-[800px] bg-ink-950/50 border border-gold/10 flex justify-center items-center overflow-hidden"
        style={{ minHeight: live ? height : 100 }}
        data-nosnippet
      >
        {live ? (
          <iframe
            ref={frameRef}
            src="/native-frame"
            width="100%"
            height={height}
            style={{ display: 'block', width: '100%', border: 'none', overflow: 'hidden' }}
            scrolling="no"
            loading={loading}
            onLoad={() => recordAdDiagnostic('ad_frame_loaded', {
              placement: diagnosticId,
              loading,
              status: 'loaded',
            })}
            onError={() => {
              recordAdDiagnostic('ad_frame_error', {
                placement: diagnosticId,
                loading,
                status: 'error',
              });
              setFailed(true);
            }}
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
