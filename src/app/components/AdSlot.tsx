import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { adsterraPlacementId } from '@shared/ads';
import { useAds } from '../context/AdContext';
import { recordAdDiagnostic } from '../adDiagnostics';

interface AdSlotProps {
  width: number;
  height: number;
  label?: string;
  className?: string;
  sticky?: boolean;
  loading?: 'eager' | 'lazy';
  minViewportWidth?: number;
  maxViewportWidth?: number;
  diagnosticId?: string;
}

function viewportMatches(minViewportWidth?: number, maxViewportWidth?: number) {
  if (typeof window === 'undefined') return true;
  if (minViewportWidth !== undefined && window.innerWidth < minViewportWidth) return false;
  if (maxViewportWidth !== undefined && window.innerWidth > maxViewportWidth) return false;
  return true;
}

export default function AdSlot({
  width,
  height,
  label = 'Advertisement',
  className = '',
  sticky = false,
  loading = 'lazy',
  minViewportWidth,
  maxViewportWidth,
  diagnosticId,
}: AdSlotProps) {
  const { adsEnabled } = useAds();
  const [failed, setFailed] = useState(false);
  const [viewportEligible, setViewportEligible] = useState(() => viewportMatches(minViewportWidth, maxViewportWidth));
  const containerRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const viewableTimerRef = useRef<number | null>(null);
  const placementId = adsterraPlacementId(width, height);
  const placement = diagnosticId || placementId || `${width}x${height}`;
  const livePlacement = viewportEligible && adsEnabled && placementId && !failed ? placementId : null;

  useEffect(() => {
    const updateEligibility = () => setViewportEligible(viewportMatches(minViewportWidth, maxViewportWidth));
    updateEligibility();
    window.addEventListener('resize', updateEligibility, { passive: true });
    return () => window.removeEventListener('resize', updateEligibility);
  }, [minViewportWidth, maxViewportWidth]);

  useEffect(() => {
    setFailed(false);
  }, [adsEnabled, placementId, width, height, viewportEligible]);

  useEffect(() => {
    if (!viewportEligible || !adsEnabled || !placementId) return;
    recordAdDiagnostic('ad_slot_registered', {
      placement,
      width,
      height,
      loading,
      status: 'eligible',
    });
    recordAdDiagnostic('ad_slot_requested', {
      placement,
      width,
      height,
      loading,
      status: 'requested',
    });
  }, [adsEnabled, height, loading, placement, placementId, viewportEligible, width]);

  useEffect(() => {
    if (!livePlacement) return undefined;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { type?: string; placement?: string; status?: string } | null;
      if (!data || data.type !== 'ngm-ad-status' || data.placement !== livePlacement || !data.status) return;
      recordAdDiagnostic(`ad_provider_${data.status}`, {
        placement,
        width,
        height,
        loading,
        status: data.status,
      });
      if (data.status === 'error') setFailed(true);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [height, livePlacement, loading, placement, width]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !viewportEligible || typeof IntersectionObserver === 'undefined') return undefined;

    let visible50 = false;
    let viewable1s = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!visible50) {
            visible50 = true;
            recordAdDiagnostic('ad_slot_visible_50', { placement, width, height, loading, status: 'visible' });
          }
          if (!viewable1s && viewableTimerRef.current === null) {
            viewableTimerRef.current = window.setTimeout(() => {
              viewable1s = true;
              viewableTimerRef.current = null;
              recordAdDiagnostic('ad_slot_viewable_1s', { placement, width, height, loading, status: 'viewable' });
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
  }, [height, loading, placement, viewportEligible, width]);

  if (!viewportEligible) return null;

  return (
    <aside
      ref={containerRef}
      className={`ad-slot ${sticky ? 'ad-slot--sticky' : ''} ${className}`}
      style={{ '--ad-width': `${width}px`, '--ad-height': `${height}px` } as CSSProperties}
      aria-label={label}
      data-ad-placement={placementId || undefined}
      data-ad-loading={loading}
    >
      <span data-nosnippet>{label}</span>
      {livePlacement ? (
        <iframe
          ref={frameRef}
          src={`/ad-frame?placement=${encodeURIComponent(livePlacement)}`}
          width={width}
          height={height}
          loading={loading}
          onLoad={() => recordAdDiagnostic('ad_frame_loaded', {
            placement,
            width,
            height,
            loading,
            status: 'loaded',
          })}
          onError={() => {
            recordAdDiagnostic('ad_frame_error', {
              placement,
              width,
              height,
              loading,
              status: 'error',
            });
            setFailed(true);
          }}
          referrerPolicy="strict-origin-when-cross-origin"
          title={`${label} (${width} by ${height})`}
        />
      ) : (
        <div className="ad-slot__house" data-nosnippet>
          <img src="/favicon.svg" alt="" />
          <small>Free play supported by advertising</small>
        </div>
      )}
    </aside>
  );
}
