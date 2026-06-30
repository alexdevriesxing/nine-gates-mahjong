import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import SiteAdStrip from './SiteAdStrip';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ivory">
      <Header />
      <main className="flex-grow flex flex-col relative pt-[72px] min-w-0 w-full">
        {/* pt-[72px] offsets the fixed header for most pages except Home which underlaps it */}
        <SiteAdStrip />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col min-w-0 w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
