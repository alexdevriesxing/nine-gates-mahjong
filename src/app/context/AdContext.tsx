import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ADSTERRA_PRECONNECT_ORIGINS,
  ADSTERRA_SOCIAL_BAR_URL,
} from '@shared/ads';

type ConsentChoice = 'accepted' | 'declined' | null;

interface AdContextValue {
  consent: ConsentChoice;
  adsEnabled: boolean;
  accept: () => void;
  decline: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'ngm_ad_consent';
const SOCIAL_SCRIPT_SELECTOR = '[data-ngm-social-ad]';
const AD_HINT_SELECTOR = '[data-ngm-ad-hint]';
const AdContext = createContext<AdContextValue | null>(null);

function readStoredConsent(): ConsentChoice {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'accepted' || stored === 'declined' ? stored : null;
}

export function AdProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentChoice>(readStoredConsent);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(SOCIAL_SCRIPT_SELECTOR);

    if (consent !== 'accepted') {
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

    return () => {
      script.remove();
      document.querySelectorAll(AD_HINT_SELECTOR).forEach((element) => element.remove());
    };
  }, [consent]);

  const value = useMemo<AdContextValue>(() => {
    const choose = (choice: Exclude<ConsentChoice, null>) => {
      window.localStorage.setItem(STORAGE_KEY, choice);
      setConsent(choice);
    };

    return {
      consent,
      adsEnabled: consent === 'accepted',
      accept: () => choose('accepted'),
      decline: () => choose('declined'),
      reset: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        // Reload so third-party code that ran under prior consent cannot keep
        // global listeners alive after the visitor reopens privacy choices.
        window.location.reload();
      },
    };
  }, [consent]);

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used inside AdProvider');
  return context;
}
