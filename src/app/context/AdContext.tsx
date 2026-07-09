import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ConsentChoice = 'accepted' | 'declined' | null;

interface AdContextValue {
  consent: ConsentChoice;
  adsEnabled: boolean;
  accept: () => void;
  decline: () => void;
  reset: () => void;
}

const AdContext = createContext<AdContextValue | null>(null);

export function AdProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const socialBarUrl = (import.meta.env.VITE_ADSTERRA_SOCIAL_BAR_URL as string | undefined) || 
      'https://demolishwrestconclusions.com/3e/87/21/3e8721aaa237eaa7a4118f7681d665f6.js';
    
    if (document.querySelector('[data-ngm-social-ad]')) return;
    
    const script = document.createElement('script');
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.ngmSocialAd = 'true';
    document.body.appendChild(script);
  }, []);

  const value = useMemo<AdContextValue>(
    () => ({
      consent: 'accepted',
      adsEnabled: true,
      accept: () => {},
      decline: () => {},
      reset: () => {},
    }),
    []
  );

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used inside AdProvider');
  return context;
}
