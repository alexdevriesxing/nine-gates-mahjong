import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@shared/constants';
import { useAuth } from '../context/AuthContext';
import MobileMenu from './MobileMenu';
import { TileRenderer } from '../../game/TileRenderer';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, displayName, avatarTile } = useAuth();

  const isHome = location.pathname === '/';

  const getAvatarURI = () => {
    try {
      if (!avatarTile) return '';
      const [suit, rank] = avatarTile.split(':');
      return TileRenderer.generateTileURI(suit as any, rank);
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll
    } else {
      setIsScrolled(true); // Always solid on other pages
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const headerClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isHome && !isScrolled ? 'bg-transparent py-6' : 'header-glass py-4'
  }`;

  return (
    <>
      <motion.header
        className={headerClass}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container-wide flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Nine Gates Mahjong" className="h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-300" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-ivory font-semibold tracking-wide hover:text-gold transition-colors text-sm uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/play" className="btn-primary py-2 px-6 text-sm">
              Play Free
            </Link>

            {isLoggedIn ? (
              <Link to="/profile" className="flex items-center gap-3 text-ivory hover:text-gold transition-colors ml-4 bg-ink-900/50 pr-4 pl-1 py-1 rounded-full border border-gold/20 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold/50 shadow-md bg-ink-950 flex items-center justify-center">
                  {avatarTile ? (
                    <img src={getAvatarURI()} alt="Avatar" className="w-[140%] h-[140%] object-cover object-center transform scale-110" />
                  ) : (
                    <span className="font-bold">{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-semibold">{displayName}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link to="/login" className="text-ivory-dark hover:text-gold text-sm font-semibold transition-colors">
                  Login
                </Link>
              </div>
            )}
          </div>

          <button
            className="lg:hidden text-gold p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
