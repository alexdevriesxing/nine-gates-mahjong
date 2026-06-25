import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES, useLocale } from '../context/LocaleContext';

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const { isLoggedIn, displayName, logout } = useAuth();
  const { language, setLanguage, t } = useLocale();

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="relative w-full max-w-sm h-full bg-ink-950/95 backdrop-blur-xl border-l border-gold/10 p-6 flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="flex justify-between items-center mb-10">
          <div className="font-display text-gold text-xl tracking-wider">MENU</div>
          <button onClick={onClose} className="text-gold p-2" aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2 mb-auto">
          {[
            { label: t('play'), path: '/play' },
            { label: t('daily'), path: '/daily' },
            { label: t('variants'), path: '/variants' },
            { label: t('learn'), path: '/learn' },
            { label: t('tutorials'), path: '/how-to-play' },
            { label: t('history'), path: '/history' },
            { label: t('events'), path: '/events' },
            { label: t('lobby'), path: '/lobby' },
            { label: t('rankings'), path: '/leaderboards' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className="py-4 text-xl font-semibold text-ivory hover:text-gold transition-colors border-b border-gold/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gold/10">
          <label className="mobile-language">
            <span>{t('language')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)}>
              {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </label>
          {isLoggedIn ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-jade-700 flex items-center justify-center border border-gold/30 text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-ivory font-semibold">{displayName}</div>
                  <div className="text-ink-400 text-sm">Player</div>
                </div>
              </div>
              <Link to="/profile" onClick={onClose} className="btn-secondary w-full text-center">
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="py-3 text-vermilion-light font-semibold hover:text-vermilion transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/play" onClick={onClose} className="btn-primary w-full text-center">
                Play as Guest
              </Link>
              <Link to="/login" onClick={onClose} className="btn-secondary w-full text-center">
                Log In
              </Link>
              <Link to="/register" onClick={onClose} className="py-2 text-center text-ivory hover:text-gold transition-colors">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
