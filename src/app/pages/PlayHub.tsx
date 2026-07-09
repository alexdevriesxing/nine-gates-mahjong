import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import GameModeCard from '../components/GameModeCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { GAME_MODES } from '@shared/constants';
import NativeBanner from '../components/NativeBanner';
import ResponsiveAdSlot from '../components/ResponsiveAdSlot';

const containerVar = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
} as const;

export default function PlayHub() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'casual' | 'daily' | 'puzzle' | 'real-mahjong'>('all');

  const filterTabs = [
    { id: 'all', label: 'All Modes' },
    { id: 'casual', label: 'Casual' },
    { id: 'daily', label: 'Daily Challenge' },
    { id: 'puzzle', label: 'Puzzles' },
    { id: 'real-mahjong', label: 'Real Mahjong' }
  ] as const;

  const filteredModes = GAME_MODES.filter(mode => {
    if (activeFilter === 'all') return true;
    return mode.category === activeFilter;
  });

  return (
    <>
      <SEOHead 
        title="Play Mahjong Games Online Free | Nine Gates Mahjong" 
        description="Choose from a collection of premium online Mahjong games: Classic Solitaire, Daily challenges, Time Attack, and authentic 4-player Real Mahjong."
        canonical="/play"
      />
      
      <div className="container-wide py-12 md:py-24">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-gold mb-4"
          >
            Free Online Mahjong Games
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-ink-300 text-lg"
          >
            From relaxing tile-matching solitaire to deep strategic 4-player tables against our AI characters.
          </motion.p>
        </div>

        {/* Top responsive ad */}
        <div className="flex justify-center items-center mb-12 w-full">
          <ResponsiveAdSlot
            label="Sponsored"
            placement="play-hub-top"
            priority
            sizes={[
              { media: '(min-width: 768px)', width: 728, height: 90 },
              { width: 320, height: 50 },
            ]}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-start md:justify-center overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-gold/10 gap-2">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-3 text-sm font-semibold tracking-wider uppercase rounded-t-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-t from-gold/20 to-gold/5 text-gold border-t border-x border-gold/30' 
                    : 'text-ink-300 hover:text-gold hover:bg-ink-900/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Game Modes Grid */}
        <motion.div 
          variants={containerVar}
          initial="hidden"
          animate="visible"
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {filteredModes.map((mode) => (
            <motion.div key={mode.id} variants={itemVar}>
              <GameModeCard mode={mode} />
            </motion.div>
          ))}
        </motion.div>

        {/* SEO Prose Block */}
        <article className="mt-16 border-t border-gold/10 pt-12 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-gold mb-4">Discover the Nine Gates Mahjong Library</h2>
          <p className="text-ink-200 text-sm leading-relaxed mb-4">
            Welcome to the ultimate online destination for Mahjong enthusiasts. Whether you are looking for a quick matching puzzle or wanting to learn the deep strategies of traditional four-player tables, we have a game mode designed specifically for your skill level.
          </p>
          <p className="text-ink-200 text-sm leading-relaxed mb-6">
            Our casual puzzle library includes classic <strong>Mahjongg Solitaire</strong> with beautiful 3D tile rendering, <strong>Zen Mahjongg</strong> for relaxing untimed gameplay, and the deterministic <strong>Daily Puzzle</strong> where everyone matches the same layout. If you crave speed, try <strong>Time Attack</strong>. For flat-board alternatives, explore <strong>Mahjong Connect</strong> and <strong>Shisen-Sho</strong>. To practice real table play, seat yourself at our <strong>Real Mahjong vs AI</strong> trainer.
          </p>

          {/* FAQs */}
          <div className="mt-10 border-t border-gold/5 pt-8">
            <h3 className="font-bold text-ivory text-base mb-6">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-6">
              <div className="bg-ink-950/30 p-6 rounded border border-gold/5">
                <h4 className="font-semibold text-gold text-sm mb-2">How do I start playing?</h4>
                <p className="text-ink-300 text-xs leading-relaxed">
                  Simply select any game card above to load that specific mode directly in your browser. You can play immediately as a guest. All games are fully optimized for smooth click controls on desktops and touch gestures on mobile and tablets.
                </p>
              </div>
              <div className="bg-ink-950/30 p-6 rounded border border-gold/5">
                <h4 className="font-semibold text-gold text-sm mb-2">Can I play against other real players?</h4>
                <p className="text-ink-300 text-xs leading-relaxed">
                  Yes! Head over to our <Link to="/lobby" className="text-gold hover:underline">Multiplayer Lobby</Link> to create or join dynamic rooms. You can invite friends using room codes or fill empty seats with our advanced AI opponents.
                </p>
              </div>
              <div className="bg-ink-950/30 p-6 rounded border border-gold/5">
                <h4 className="font-semibold text-gold text-sm mb-2">Where can I read the rules?</h4>
                <p className="text-ink-300 text-xs leading-relaxed">
                  We offer a complete <Link to="/learn" className="text-gold hover:underline">Learning Hub</Link> explaining everything from basic solitaire tile recognition to advanced four-player meld rules like Cantonese Hong Kong, Japanese Riichi, MCR, and Taiwanese Mahjong.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Bottom native ad */}
        <div className="mt-16" data-gaio-section="ads">
          <NativeBanner placement="play-hub-native" />
        </div>
      </div>
    </>
  );
}
