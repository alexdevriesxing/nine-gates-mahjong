import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ResponsiveAdSlot from '../components/ResponsiveAdSlot';

const guides = [
  ['Mahjong vs Mahjongg', 'Understand real four-player Mahjong, American Mahjongg, and Mahjongg Solitaire.', '/learn/mahjong-vs-mahjongg', 'Foundations'],
  ['How to Play Mahjongg Solitaire', 'Learn free-tile logic, matching strategy, hints, shuffles, and board recovery.', '/learn/how-to-play-mahjongg-solitaire', 'Casual'],
  ['How to Play Real Mahjong', 'Follow the draw-and-discard turn, build melds, and complete a legal hand.', '/learn/how-to-play-real-mahjong', 'Foundations'],
  ['Mahjong Tiles Guide', 'Learn to identify all 144 tiles, including suits, honors, winds, dragons, and bonus tiles.', '/learn/mahjong-tiles', 'Foundations'],
  ['How to Win Mahjong', 'Understand the basic four-meld and one-pair winning hand structure.', '/learn/how-to-win-mahjong', 'Rules'],
  ['Chi, Pung, and Kong', 'See exactly how sequences, triplets, and four-of-a-kind melds work.', '/learn/chi-pung-kong', 'Rules'],
  ['Mahjong Scoring Basics', 'Learn how hands are scored and compare fan, yaku, han, and tournament points.', '/learn/mahjong-scoring-basics', 'Rules'],
  ['Beginner Strategy', 'Improve tile efficiency, discard choices, hand shape, and table awareness.', '/learn/beginner-strategy', 'Strategy'],
  ['Common Beginner Mistakes', 'Avoid typical beginner mistakes like calling too early or breaking hand structure.', '/learn/common-mistakes', 'Strategy'],
  ['Mahjong Glossary', 'Reference sheet for traditional Mahjong terminology, terms, and definitions.', '/learn/glossary', 'Reference'],
  ['Mahjong Variants', 'Compare Hong Kong, Riichi, MCR, American, and Taiwanese Mahjong.', '/learn/mahjong-variants', 'World rules'],
  ['Guided How-to-Play Lessons', 'Move through interactive, step-by-step lessons before entering a game.', '/how-to-play', 'Interactive'],
  ['The History of Mahjong', 'Read about Mahjong’s origins, cultures, global spread, and relationship with gambling.', '/history', 'Culture'],
];

export default function LearnHub() {
  return (
    <>
      <SEOHead
        title="Learn Mahjong | Rules, Strategy, History and Tutorials"
        description="Learn Mahjong with clear beginner rules, Mahjongg Solitaire guidance, meld explanations, strategy, regional variants, interactive tutorials, and history."
        canonical="/learn"
      />
      <main className="hub-page py-12 md:py-24">
        {/* Breadcrumbs */}
        <div className="container-wide mb-6">
          <Breadcrumbs />
        </div>

        <header className="container-wide text-center mb-16">
          <p className="game-eyebrow">Nine Gates academy</p>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Learn Mahjong</h1>
          <p className="text-ink-300 text-lg max-w-2xl mx-auto">
            Direct answers for first-time players, deeper strategy for improving hands, and cultural context for the many games called Mahjong.
          </p>
        </header>

        {/* Key Facts Summary Box */}
        <section className="container-wide mb-16">
          <div className="bg-gradient-to-r from-lacquer-dark/30 to-ink-950/30 p-8 rounded-xl border border-gold/15 max-w-4xl mx-auto">
            <h2 className="font-display text-xl text-gold mb-4">Quick Start: Mahjong Essentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-ink-200">
              <div>
                <strong className="text-ivory block mb-1">1. The Tile Set</strong>
                A standard set consists of 144 tiles: 3 suits (Dots, Bamboos, Characters) ranked 1-9, plus Winds, Dragons, and optional Flowers.
              </div>
              <div>
                <strong className="text-ivory block mb-1">2. Hand Objective</strong>
                To win, build a hand of 14 tiles consisting of four melds (Chow runs or Pung triplets) and one matching pair (the eyes).
              </div>
              <div>
                <strong className="text-ivory block mb-1">3. Game Rhythm</strong>
                Players take turns drawing a tile from the wall and discarding one to the table, trying to shape their hand before opponents do.
              </div>
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="hub-grid container-wide">
          {guides.map(([title, description, path, category], index) => (
            <Link to={path} key={path} className="hub-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>{category}</small>
              <h2>{title}</h2>
              <p>{description}</p>
              <strong>Read guide →</strong>
            </Link>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="container-wide mt-24 border-t border-gold/10 pt-16 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-gold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-6">
            <div className="bg-ink-950/20 p-6 rounded border border-gold/5">
              <h3 className="font-semibold text-ivory text-sm mb-2">How long does it take to learn Mahjong?</h3>
              <p className="text-ink-300 text-xs leading-relaxed">
                The basic rules of hand structure (four sets and a pair) can be learned in 15 minutes. However, mastering discard strategy, memory management, and regional scoring patterns is a lifelong journey.
              </p>
            </div>
            <div className="bg-ink-950/20 p-6 rounded border border-gold/5">
              <h3 className="font-semibold text-ivory text-sm mb-2">Is American Mahjongg different from Chinese Mahjong?</h3>
              <p className="text-ink-300 text-xs leading-relaxed">
                Yes. American Mahjongg uses a physical card of valid hands updated yearly by the NMJL, includes 8 joker tiles, and starts with the "Charleston" tile pass. Chinese and Japanese variants rely on memorized hand combinations and do not use jokers.
              </p>
            </div>
            <div className="bg-ink-950/20 p-6 rounded border border-gold/5">
              <h3 className="font-semibold text-ivory text-sm mb-2">What is a Chow, Pung, and Kong?</h3>
              <p className="text-ink-300 text-xs leading-relaxed">
                These are the three types of tile sets in a hand: a <strong>Chow</strong> is a sequence of three consecutive tiles in the same suit; a <strong>Pung</strong> is three identical tiles; and a <strong>Kong</strong> is four identical tiles.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-center items-center mt-20 w-full" data-gaio-section="ads">
          <ResponsiveAdSlot
            label="Sponsored"
            placement="learn-hub-bottom"
            sizes={[
              { media: '(min-width: 768px)', width: 728, height: 90 },
              { width: 320, height: 50 },
            ]}
          />
        </div>
      </main>
    </>
  );
}
