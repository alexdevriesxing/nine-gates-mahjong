import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import {
  ADSTERRA_PRECONNECT_ORIGINS,
  ADSTERRA_SOCIAL_BAR_URL,
} from '@shared/ads';

type AdPreference = 'enabled';

interface AdContextValue {
  preference: AdPreference;
  adsEnabled: boolean;
  enableAds: () => void;
  disableAds: () => void;
}

const SOCIAL_SCRIPT_SELECTOR = '[data-ngm-social-ad]';
const AdContext = createContext<AdContextValue | null>(null);

// Advertising is unconditionally enabled for every visitor: no opt-out or consent prompts.
export function AdProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    for (const origin of ADSTERRA_PRECONNECT_ORIGINS) {
      if (document.head.querySelector(`link[data-ngm-ad-hint][href="${origin}"]`)) continue;
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = origin;
      preconnect.crossOrigin = 'anonymous';
      preconnect.dataset.ngmAdHint = 'true';
      document.head.appendChild(preconnect);
    }

    const existing = document.querySelector<HTMLScriptElement>(SOCIAL_SCRIPT_SELECTOR);
    if (existing) return;

    const configuredUrl = (import.meta.env.VITE_ADSTERRA_SOCIAL_BAR_URL as string | undefined)?.trim();
    const candidateUrl = configuredUrl || ADSTERRA_SOCIAL_BAR_URL;
    let socialBarUrl = ADSTERRA_SOCIAL_BAR_URL;
    try {
      const parsed = new URL(candidateUrl);
      if (parsed.protocol === 'https:' && parsed.hostname.endsWith('.effectivecpmnetwork.com')) {
        socialBarUrl = parsed.toString();
      }
    } catch {
      // Keep the verified built-in Adsterra URL when deployment configuration is invalid.
    }
    const script = document.createElement('script');
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.ngmSocialAd = 'true';
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    document.body.appendChild(script);
  }, []);

  const value = useMemo<AdContextValue>(() => ({
    preference: 'enabled',
    adsEnabled: true,
    enableAds: () => {},
    disableAds: () => {},
  }), []);

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used inside AdProvider');
  return context;
}
