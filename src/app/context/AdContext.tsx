import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ADSTERRA_PRECONNECT_ORIGINS,
  ADSTERRA_SOCIAL_BAR_URL,
} from '@shared/ads';

type AdPreference = 'enabled' | 'disabled';

interface AdContextValue {
  preference: AdPreference;
  adsEnabled: boolean;
  enableAds: () => void;
  disableAds: () => void;
}

const STORAGE_KEY = 'ngm_ad_consent';
const SOCIAL_SCRIPT_SELECTOR = '[data-ngm-social-ad]';
const AD_HINT_SELECTOR = '[data-ngm-ad-hint]';
const AdContext = createContext<AdContextValue | null>(null);

// Advertising is on by default for every visitor: no interstitial consent prompt
// gates the ad stack. Only an explicit opt-out stored in this browser turns it
// off, which also lets automated capture/smoke runs suppress third-party frames.
function readStoredPreference(): AdPreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'disabled' || stored === 'declined' ? 'disabled' : 'enabled';
  } catch {
    // Private-mode or storage-blocked browsers still see advertising.
    return 'enabled';
  }
}

function writeStoredPreference(preference: AdPreference) {
  try {
    if (preference === 'enabled') {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, 'disabled');
  } catch {
    // Preference is best-effort; the in-memory value still drives this session.
  }
}

export function AdProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<AdPreference>(readStoredPreference);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(SOCIAL_SCRIPT_SELECTOR);

    if (preference === 'disabled') {
      existing?.remove();
      document.querySelectorAll(AD_HINT_SELECTOR).forEach((element) => element.remove());
      return;
    }

    for (const origin of ADSTERRA_PRECONNECT_ORIGINS) {
      if (document.head.querySelector(`link[data-ngm-ad-hint][href="${origin}"]`)) continue;
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = origin;
      preconnect.crossOrigin = 'anonymous';
      preconnect.dataset.ngmAdHint = 'true';
      document.head.appendChild(preconnect);
    }

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
  }, [preference]);

  const value = useMemo<AdContextValue>(() => ({
    preference,
    adsEnabled: preference === 'enabled',
    enableAds: () => {
      writeStoredPreference('enabled');
      setPreference('enabled');
    },
    disableAds: () => {
      writeStoredPreference('disabled');
      // Reload so third-party code that already ran cannot keep global
      // listeners or overlay inventory alive after the visitor opts out.
      window.location.reload();
    },
  }), [preference]);

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used inside AdProvider');
  return context;
}
