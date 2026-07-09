import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SEOHead from '../components/SEOHead';
import GameModeCard from '../components/GameModeCard';
import VariantCard from '../components/VariantCard';
import { GAME_MODES, MAHJONG_VARIANTS, AI_CHARACTERS } from '@shared/constants';
import { useAuth } from '../context/AuthContext';
import NativeBanner from '../components/NativeBanner';
import ResponsiveAdSlot from '../components/ResponsiveAdSlot';

// Animation variant for staggered reveals
const fadeUpVar = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HomePage() {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();
  
  // Refs for scroll animations
  const pathRef = useRef(null);
  const isPathInView = useInView(pathRef, { once: true, margin: '-100px' });
  
  const modesRef = useRef(null);
  const isModesInView = useInView(modesRef, { once: true, margin: '-100px' });
  
  const variantsRef = useRef(null);
  const isVariantsInView = useInView(variantsRef, { once: true, margin: '-100px' });

  return (
    <div className="w-full -mt-[72px]"> {/* Negative margin to underlap the fixed header */}
      <SEOHead 
        title="Nine Gates Mahjong — The Definitive Online Mahjong Portal"
        description="Play Mahjongg Solitaire, solve daily puzzles, learn real Mahjong, and take your seat at serious table variants played around the world."
        canonical="https://ninegatesmahjong.com"
      />

      {/* HERO SECTION */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-950 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        {/* Dark vignette overlay for readability and blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/40 to-ink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,16,0.9)_100%)]" />

        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute top-[20%] left-[10%] w-24 h-32 border-2 border-gold/30 rounded-md animate-float" />
          <div className="absolute top-[60%] left-[80%] w-20 h-28 border-2 border-lacquer-light/30 rounded-md animate-float-delay" />
          <div className="absolute top-[15%] right-[20%] w-32 h-40 border-2 border-vermilion-light/20 rounded-md animate-float-slow" />
          <div className="absolute bottom-[20%] left-[30%] w-16 h-24 border-2 border-gold/40 rounded-md animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container-narrow relative z-10 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6 flex justify-center"
          >
            <div className="gate-medallion scale-150">
              <span /><span /><span />
              <span /><span /><span />
              <span /><span /><span />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl text-ivory mb-6 leading-tight"
          >
            Nine Gates <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark gold-shimmer">Mahjong</span> <br className="hidden md:block" />
            Free Online Games
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-ink-200 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light leading-relaxed text-balance"
          >
            Nine Gates Mahjong is a free online Mahjong and Mahjongg portal with multiple browser-playable games, including Mahjongg Solitaire, Daily Mahjongg, Mahjong Connect, Shisen-Sho, and Real Mahjong. Play instantly in your browser without downloading or registering.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/play" className="btn-primary text-lg w-full sm:w-auto px-8 py-4">
              Play Free Now
            </Link>
            <Link to="/real-mahjong" className="btn-vermilion text-lg w-full sm:w-auto px-8 py-4">
              Try Real Mahjong
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex justify-center"
            data-gaio-section="hero-ad"
          >
            <ResponsiveAdSlot
              label="Sponsored"
              placement="home-hero"
              priority
              sizes={[
                { media: '(min-width: 768px)', width: 728, height: 90 },
                { width: 320, height: 50 },
              ]}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-6"
          >
            <button 
              onClick={() => { loginAsGuest(); navigate('/play'); }}
              className="text-gold hover:text-gold-light underline text-sm transition-colors"
            >
              Continue as Guest
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gold opacity-50"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section className="py-24 bg-ink-950" ref={pathRef}>
        <div className="container-wide">
          <motion.div 
            initial="hidden"
            animate={isPathInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Casual Path */}
            <motion.div variants={fadeUpVar} className="lacquer-panel group overflow-hidden flex flex-col h-full !p-0">
              <div className="relative overflow-hidden h-60 bg-ink-950 flex items-center justify-center shrink-0">
                <img 
                  src="/images/casual_path.png" 
                  alt="Casual Mahjongg" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-85" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,16,0.4)_100%)]" />
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <h2 className="font-display text-3xl text-gold mb-4">Casual Mahjongg</h2>
                <p className="text-ink-200 text-lg mb-8 flex-grow">
                  Relax with classic tile-matching puzzles. Perfect for unwinding, testing your speed, or solving a fresh challenge every day.
                </p>
                <div className="flex flex-wrap gap-3 mt-auto">
                  <Link to="/mahjongg-solitaire" className="btn-secondary text-sm">Solitaire</Link>
                  <Link to="/daily" className="btn-secondary text-sm border-jade-500 text-jade-400 hover:bg-jade-900/30 hover:text-jade-300">Daily Puzzle</Link>
                  <Link to="/zen-mahjongg" className="btn-secondary text-sm">Zen Mode</Link>
                </div>
              </div>
            </motion.div>

            {/* Real Mahjong Path */}
            <motion.div variants={fadeUpVar} className="lacquer-panel group bg-gradient-to-br from-lacquer to-ink-900 overflow-hidden flex flex-col h-full !p-0">
              <div className="relative overflow-hidden h-60 bg-ink-950 flex items-center justify-center shrink-0">
                <img 
                  src="/images/real_path.png" 
                  alt="Real Mahjong" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-85" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,16,0.4)_100%)]" />
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <h2 className="font-display text-3xl text-ivory mb-4">Real Mahjong</h2>
                <p className="text-ink-200 text-lg mb-8 flex-grow">
                  Learn the authentic four-player draw-and-discard rhythm, shape legal hands, and practice against AI or real opponents.
                </p>
                <div className="flex flex-wrap gap-3 mt-auto">
                  <Link to="/real-mahjong" className="btn-vermilion text-sm">Play vs AI</Link>
                  <Link to="/variants" className="btn-secondary text-sm border-gold text-gold">Explore Variants</Link>
                  <Link to="/learn" className="btn-secondary text-sm border-ink-500 text-ink-300">How to Play</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mid-page ad section */}
      <div className="container-wide py-4 flex justify-center items-center">
        <NativeBanner placement="home-mid-native" />
      </div>

      {/* FEATURED GAME MODES */}
      <section className="py-24 bg-ink-900/30" ref={modesRef}>
        <div className="container-wide">
          <motion.div 
            initial="hidden"
            animate={isModesInView ? "visible" : "hidden"}
            variants={fadeUpVar}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-display text-4xl text-gold mb-2">Choose Your Game</h2>
              <p className="text-ink-300 text-lg">From relaxing puzzles to high-stakes tables.</p>
            </div>
            <Link to="/play" className="hidden sm:flex text-gold hover:text-gold-light items-center gap-2 font-semibold">
              See All Games <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate={isModesInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {GAME_MODES.slice(0, 6).map((mode) => (
              <motion.div key={mode.id} variants={fadeUpVar}>
                <GameModeCard mode={mode} />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-8 sm:hidden flex justify-center">
            <Link to="/play" className="btn-secondary w-full text-center">
              See All Games
            </Link>
          </div>
        </div>
      </section>

      {/* WORLD OF MAHJONG VARIANTS */}
      <section className="py-24 bg-ink-950 relative" ref={variantsRef}>
        {/* Subtle texture */}
        <div className="absolute inset-0 silk-texture opacity-30 pointer-events-none" />
        
        <div className="container-wide relative z-10">
          <motion.div 
            initial="hidden"
            animate={isVariantsInView ? "visible" : "hidden"}
            variants={fadeUpVar}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl text-ivory mb-6">Discover the World of Mahjong</h2>
            <p className="text-ink-300 text-lg">
              Mahjong has evolved into diverse regional variants, each with its own unique flavor, strategy, and scoring rules. Which one will you master?
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate={isVariantsInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MAHJONG_VARIANTS.slice(0, 3).map((variant) => (
              <motion.div key={variant.id} variants={fadeUpVar}>
                <VariantCard variant={variant} />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Link to="/variants" className="btn-secondary px-8">
              View All Variants
            </Link>
          </div>
        </div>
      </section>

      {/* MEET THE AI CHARACTERS */}
      <section className="py-24 bg-ink-900/50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-gold mb-4">Meet Your Opponents</h2>
            <p className="text-ink-300 text-lg">Play against diverse AI personalities with unique playstyles.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {AI_CHARACTERS.map((ai) => (
              <div key={ai.id} className="glass-card min-w-[280px] sm:min-w-[320px] snap-center shrink-0">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 border-gold/30 shadow-lg"
                    style={{ backgroundColor: ai.avatarColor }}
                  >
                    {ai.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-ivory leading-tight">{ai.name}</h3>
                    <div className="text-xs text-gold uppercase tracking-wider">{ai.title}</div>
                  </div>
                </div>
                <blockquote className="italic text-ink-300 text-sm mb-4 border-l-2 border-gold/20 pl-3">
                  "{ai.quote}"
                </blockquote>
                <div className="flex justify-between items-center mt-auto border-t border-gold/10 pt-4">
                  <span className="text-xs text-ink-400 font-semibold uppercase">Style: {ai.style}</span>
                  <span className={`badge ${
                    ai.difficulty === 'beginner' ? 'badge-jade' : 
                    ai.difficulty === 'expert' ? 'badge-vermilion' : 'badge-gold'
                  }`}>
                    {ai.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-wide py-8 flex justify-center items-center">
        <ResponsiveAdSlot
          label="Sponsored"
          placement="home-late-banner"
          sizes={[
            { media: '(min-width: 768px)', width: 728, height: 90 },
            { width: 320, height: 50 },
          ]}
        />
      </div>

      <section className="home-seo-section" data-gaio-section="answers">
        <div className="container-wide">
          <div className="home-seo-section__grid">
            <article>
              <p className="game-eyebrow">Free online Mahjong portal</p>
              <h2>Play Mahjongg Solitaire, puzzle Mahjong, and real Mahjong in one place</h2>
              <p>
                Nine Gates Mahjong is built for players who search for free online Mahjong games and want more than a single
                tile-matching board. Start with Mahjongg Solitaire, return for the shared Daily Mahjongg Puzzle, switch into
                Mahjong Connect or Shisen-Sho, then practice authentic four-player Mahjong against AI opponents.
              </p>
              <p>
                The learning hub explains the difference between Mahjong and Mahjongg, free-tile logic, chi, pung, kong,
                discard strategy, and regional rules such as Hong Kong Mahjong, Riichi, MCR, American Mahjongg, and Taiwanese Mahjong.
              </p>
            </article>
            <dl>
              <div>
                <dt>Best game for beginners</dt>
                <dd>Mahjongg Solitaire teaches tile recognition and matching before moving into strategy-heavy table Mahjong.</dd>
              </div>
              <div>
                <dt>Best daily challenge</dt>
                <dd>The Daily Mahjongg Puzzle gives every visitor the same deterministic solvable board for comparable scores.</dd>
              </div>
              <div>
                <dt>Best real Mahjong practice</dt>
                <dd>Real Mahjong vs AI teaches drawing, discarding, concealed hands, table reading, and the four-player rhythm.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-ink-950/40 border-t border-gold/5">
        <div className="container-narrow">
          <h2 className="font-display text-3xl text-gold text-center mb-12">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-6 text-left">
            <div className="glass-card p-6">
              <h3 className="font-bold text-lg text-ivory mb-2">What is the difference between Mahjong and Mahjongg?</h3>
              <p className="text-ink-200 text-sm leading-relaxed">
                Traditional Mahjong is a four-player game originating from China, played with 136 or 144 tiles, involving drawing, discarding, and forming sets (melds). Mahjongg Solitaire (often spelled with double 'g') is a single-player matching puzzle using the same tiles arranged in layered patterns like the Turtle layout.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-lg text-ivory mb-2">Are these games free to play without downloads?</h3>
              <p className="text-ink-200 text-sm leading-relaxed">
                Yes! All games on Nine Gates Mahjong are 100% free and playable directly in your web browser on desktop, tablet, or mobile devices. There are no downloads, plugins, or installations required.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-lg text-ivory mb-2">How does the Daily Mahjongg Puzzle work?</h3>
              <p className="text-ink-200 text-sm leading-relaxed">
                Every visitor to the site receives the exact same solvable board layout seed based on the current calendar date. This allows you to play the puzzle, complete it, and compare your completion time and score fairly against friends and the daily leaderboard.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-lg text-ivory mb-2">Which regional Mahjong variants can I learn here?</h3>
              <p className="text-ink-200 text-sm leading-relaxed">
                Our learning section features comprehensive guides for major global variants, including Cantonese Hong Kong Mahjong, Japanese Riichi Mahjong, Chinese Competition Rules (MCR), American Mahjongg (featuring the Charleston pass and card), and Taiwanese Mahjong (with 16-tile hands).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 bg-gradient-to-b from-ink-950 to-lacquer-dark border-t border-gold/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 gold-shimmer opacity-10 pointer-events-none" />
        <div className="container-narrow relative z-10">
          <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">Ready to Play?</h2>
          <p className="text-xl text-ink-200 mb-10">Join thousands of players in the ultimate Mahjong experience.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/play" className="btn-primary text-lg px-10 py-4">
              Start Playing Now
            </Link>
            <Link to="/learn" className="btn-secondary text-lg px-10 py-4">
              Learn How to Play
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
