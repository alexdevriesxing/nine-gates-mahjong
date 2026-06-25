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
const AdContext = createContext<AdContextValue | null>(null);

export function AdProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentChoice>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'declined' ? stored : null;
  });

  useEffect(() => {
    if (consent) localStorage.setItem(STORAGE_KEY, consent);
    else localStorage.removeItem(STORAGE_KEY);
  }, [consent]);

  useEffect(() => {
    if (consent !== 'accepted') return;
    const socialBarUrl = import.meta.env.VITE_ADSTERRA_SOCIAL_BAR_URL as string | undefined;
    if (!socialBarUrl || document.querySelector('[data-ngm-social-ad]')) return;
    const script = document.createElement('script');
    script.src = socialBarUrl;
    script.async = true;
    script.dataset.ngmSocialAd = 'true';
    document.body.appendChild(script);
    return () => script.remove();
  }, [consent]);

  const value = useMemo<AdContextValue>(
    () => ({
      consent,
      adsEnabled: consent === 'accepted',
      accept: () => setConsent('accepted'),
      decline: () => setConsent('declined'),
      reset: () => setConsent(null),
    }),
    [consent]
  );

  return (
    <AdContext.Provider value={value}>
      {children}
      {consent === null && (
        <aside className="consent-banner" aria-label="Privacy choices">
          <div>
            <strong>Privacy and advertising choices</strong>
            <p>
              Nine Gates uses advertising to keep play free. Optional ad technology loads only after you choose.
            </p>
          </div>
          <div className="consent-banner__actions">
            <button className="btn-secondary" onClick={value.decline}>Decline optional ads</button>
            <button className="btn-primary" onClick={value.accept}>Accept ads</button>
          </div>
        </aside>
      )}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used inside AdProvider');
  return context;
}
