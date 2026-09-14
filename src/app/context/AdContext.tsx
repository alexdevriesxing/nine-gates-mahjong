import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ADSTERRA_PRECONNECT_ORIGINS,
  ADSTERRA_SOCIAL_BAR_URL,
} from '@shared/ads';
import { recordAdDiagnostic } from '../adDiagnostics';

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

function isLocalAdTestHost() {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// Production advertising is always enabled by the application. The old
// ngm_ad_consent preference is honored only on localhost so browser smoke and
// visual-capture tooling can suppress third-party frames without creating a
// production ad-free path. Browser, network, provider and legally required
// regional privacy controls remain outside this application-level switch.
function readStoredPreference(): AdPreference {
  if (!isLocalAdTestHost()) return 'enabled';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'disabled' || stored === 'declined' ? 'disabled' : 'enabled';
  } catch {
    return 'enabled';
  }
}

function writeStoredPreference(preference: AdPreference) {
  if (!isLocalAdTestHost()) return;
  try {
    if (preference === 'enabled') {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, 'disabled');
  } catch {
    // Local test preference is best-effort.
  }
}

export function AdProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<AdPreference>(readStoredPreference);

  useEffect(() => {
    // Migrate every production browser away from the legacy opt-out value so a
    // returning visitor cannot remain permanently excluded from ad delivery.
    if (!isLocalAdTestHost()) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage can be unavailable in privacy-focused browsers; ads still run.
      }
      if (preference !== 'enabled') setPreference('enabled');
    }

    const existing = document.querySelector<HTMLScriptElement>(SOCIAL_SCRIPT_SELECTOR);

    if (preference === 'disabled' && isLocalAdTestHost()) {
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

    recordAdDiagnostic('ad_slot_registered', {
      placement: 'social-bar',
      loading: 'eager',
      status: 'eligible',
    });
    recordAdDiagnostic('ad_slot_requested', {
      placement: 'social-bar',
      loading: 'eager',
      status: 'requested',
    });

    const script = document.createElement('script');
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.ngmSocialAd = 'true';
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.onload = () => recordAdDiagnostic('ad_provider_loaded', {
      placement: 'social-bar',
      loading: 'eager',
      status: 'loaded',
    });
    script.onerror = () => recordAdDiagnostic('ad_provider_error', {
      placement: 'social-bar',
      loading: 'eager',
      status: 'error',
    });
    document.body.appendChild(script);
  }, [preference]);

  const value = useMemo<AdContextValue>(() => ({
    preference,
    adsEnabled: !isLocalAdTestHost() || preference === 'enabled',
    enableAds: () => {
      writeStoredPreference('enabled');
      setPreference('enabled');
    },
    disableAds: () => {
      if (!isLocalAdTestHost()) return;
      writeStoredPreference('disabled');
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
