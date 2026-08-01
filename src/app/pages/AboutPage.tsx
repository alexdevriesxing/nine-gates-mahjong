import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const CANONICAL = 'https://ninegatesmahjong.com/about';
const REVIEW_DATE = '2026-07-22';

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Nine Gates Mahjong | Editorial and Testing Standards"
        description="Learn who operates Nine Gates Mahjong, how its games are tested, how regional rule guides are reviewed, and how advertising and corrections are handled."
        canonical={CANONICAL}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': `${CANONICAL}#about`,
          url: CANONICAL,
          name: 'About Nine Gates Mahjong',
          description: 'Editorial, testing, advertising and correction standards for Nine Gates Mahjong.',
          dateModified: REVIEW_DATE,
          inLanguage: 'en',
          mainEntity: { '@id': 'https://ninegatesmahjong.com/#organization' },
        }}
        dateModified={REVIEW_DATE}
      />

      <main className="editorial-page" data-gaio-container="true">
        <article>
          <nav className="mb-5 text-sm text-ink-300" aria-label="Breadcrumb">
            <Link className="text-gold hover:text-gold-light" to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>About</span>
          </nav>

          <header>
            <p className="game-eyebrow">Operator, editorial policy and testing standards</p>
            <h1>About Nine Gates Mahjong</h1>
            <div className="my-6 rounded-xl border border-gold/20 bg-gold/5 p-5" data-gaio-section="quick-answer">
              <strong className="block text-gold">Quick answer</strong>
              <p className="mt-2 text-lg leading-relaxed text-ivory">
                Nine Gates Mahjong is a free browser-game and learning portal operated by Fire Dragon Interactive. It separates Mahjongg Solitaire puzzles from traditional four-player Mahjong and clearly labels regional modes that teach a simplified subset of a ruleset.
              </p>
            </div>
            <p className="text-sm text-ink-300">
              Reviewed by the Nine Gates Mahjong Editorial Team · <time dateTime={REVIEW_DATE}>Updated July 22, 2026</time>
            </p>
          </header>

          <nav className="my-8 rounded-xl border border-gold/15 bg-ink-900/60 p-5" aria-label="On this page">
            <strong className="text-gold">On this page</strong>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              <li><a href="#purpose">Purpose and scope</a></li>
              <li><a href="#testing">How games are tested</a></li>
              <li><a href="#editorial">Editorial standards</a></li>
              <li><a href="#advertising">Advertising and independence</a></li>
              <li><a href="#corrections">Corrections and contact</a></li>
            </ul>
          </nav>

          <section id="purpose">
            <h2>Purpose and scope</h2>
            <p>
              The portal is designed for two related but different activities: single-player Mahjongg tile-matching puzzles and traditional Mahjong training. Page titles, guides and game descriptions preserve that distinction so players can quickly find the experience they intended.
            </p>
            <p>
              Regional trainers demonstrate selected mechanics and winning-hand concepts. They are learning tools, not complete replacements for an association rulebook, tournament regulation or a table's agreed house rules.
            </p>
          </section>

          <section id="testing">
            <h2>How games are tested</h2>
            <p>
              Releases are checked with deterministic game-logic tests and real-browser flows. Coverage includes solvable Mahjongg Solitaire boards, mouse and touch controls, timers, pause and restart states, regional trainer actions, account flows and authoritative multiplayer rooms with more than one browser client.
            </p>
            <p>
              Desktop, tablet and mobile layouts are checked for empty content, horizontal overflow, runtime errors, headings, landmarks, canonical URLs and usable controls before deployment.
            </p>
          </section>

          <section id="editorial">
            <h2>Editorial standards</h2>
            <p>
              Guides start with a direct answer, use descriptive headings and connect terminology to playable examples. The editorial team identifies simplified training behavior, avoids inventing scoring claims, and reviews niche rule explanations against primary ruleset or association material when it is available.
            </p>
            <p>
              Continue with the <Link to="/learn">Mahjong learning hub</Link>, compare <Link to="/variants">regional variants</Link>, or read the guide to <Link to="/learn/mahjong-vs-mahjongg">Mahjong versus Mahjongg</Link>.
            </p>
          </section>

          <section id="advertising">
            <h2>Advertising and independence</h2>
            <p>
              Optional advertising helps support free access. Third-party advertising loads only after a visitor accepts it, advertising areas are identified, and declining advertising does not block the games. Advertising does not determine rules explanations, game outcomes or rankings.
            </p>
          </section>

          <section id="corrections">
            <h2>Corrections and contact</h2>
            <p>
              Mahjong terminology and regional rules can vary. If a guide is unclear or a game behaves differently from its stated scope, contact the operator through the <a href="https://www.firedragoninteractive.com" target="_blank" rel="noreferrer">Fire Dragon Interactive website</a>. Material corrections are reflected in the visible review date and discovery files.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
