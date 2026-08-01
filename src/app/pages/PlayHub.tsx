import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import GameModeCard from '../components/GameModeCard';
import { GAME_MODES } from '@shared/constants';
import AdSlot from '../components/AdSlot';
import NativeBanner from '../components/NativeBanner';

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
        title="Free Online Mahjongg Games | Nine Gates Mahjong"
        description="Choose from Mahjongg Solitaire, Daily Mahjongg, Zen Mahjongg, Time Attack, Mahjong Connect, Shisen-Sho, Memory and Mahjong training modes."
        canonical="https://ninegatesmahjong.com/play"
      />
      
      <main className="container-wide py-12 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="section-reveal font-display text-4xl md:text-5xl text-gold mb-4">
            Choose Your Game
          </h1>
          <p className="section-reveal text-ink-300 text-lg" style={{ animationDelay: '80ms' }}>
            From relaxing tile-matching solitaire to deep strategic 4-player tables against our AI characters.
          </p>
        </div>

        {/* Top responsive ad */}
        <div className="flex justify-center items-center mb-12 w-full">
          <AdSlot width={728} height={90} className="hidden md:flex" />
          <AdSlot width={320} height={50} className="flex md:hidden" />
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
        <div
          key={activeFilter}
          className="section-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredModes.map((mode) => (
            <div key={mode.id}>
              <GameModeCard mode={mode} />
            </div>
          ))}
        </div>

        {/* Bottom native ad */}
        <div className="mt-16" data-gaio-section="ads">
          <NativeBanner />
        </div>
      </main>
    </>
  );
}
