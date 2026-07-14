import { Link } from 'react-router-dom';
import { useAds } from '../context/AdContext';

export default function PrivacyChoices() {
  const { consent, accept, decline } = useAds();

  if (consent !== null) return null;

  return (
    <aside
      aria-label="Privacy choices"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-2xl border border-gold/30 bg-ink-950/95 p-5 shadow-2xl backdrop-blur-xl md:inset-x-6 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl text-ivory">Your privacy choices</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">
            Core games work without advertising cookies or third-party ad scripts. Choose “Accept ads” to support free play through our advertising partner, or continue with house messages only.
          </p>
          <p className="mt-2 text-xs text-ink-300">
            Read the <Link className="text-gold underline" to="/privacy">privacy policy</Link> for the data used by accounts, multiplayer rooms and advertising.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
          <button className="btn-secondary whitespace-nowrap" type="button" onClick={decline}>
            Continue without ads
          </button>
          <button className="btn-primary whitespace-nowrap" type="button" onClick={accept}>
            Accept ads
          </button>
        </div>
      </div>
    </aside>
  );
}
