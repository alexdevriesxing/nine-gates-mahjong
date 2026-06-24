import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Safely load the Adsterra Social Bar script dynamically
    const script = document.createElement('script');
    script.src = 'https://pl29884537.effectivecpmnetwork.com/3e/87/21/3e8721aaa237eaa7a4118f7681d665f6.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ivory">
      <Header />
      <main className="flex-grow flex flex-col relative pt-[72px]">
        {/* pt-[72px] offsets the fixed header for most pages except Home which underlaps it */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
