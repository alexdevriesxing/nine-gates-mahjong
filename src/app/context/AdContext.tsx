import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

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
const DEFAULT_SOCIAL_BAR_URL = 'https://pl29884537.effectivecpmnetwork.com/3e/87/21/3e8721aaa237eaa7a4118f7681d665f6.js';
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
      return;
    }

    if (existing) return;

    const socialBarUrl = (import.meta.env.VITE_ADSTERRA_SOCIAL_BAR_URL as string | undefined)?.trim()
      || DEFAULT_SOCIAL_BAR_URL;
    const script = document.createElement('script');
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.ngmSocialAd = 'true';
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    document.body.appendChild(script);

    return () => {
      script.remove();
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
