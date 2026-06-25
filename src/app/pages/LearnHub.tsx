import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import AdSlot from '../components/AdSlot';

const guides = [
  ['Mahjong vs Mahjongg', 'Understand real four-player Mahjong, American Mahjongg, and Mahjongg Solitaire.', '/learn/mahjong-vs-mahjongg', 'Foundations'],
  ['How to Play Mahjongg Solitaire', 'Learn free-tile logic, matching strategy, hints, shuffles, and board recovery.', '/learn/how-to-play-mahjongg-solitaire', 'Casual'],
  ['How to Play Real Mahjong', 'Follow the draw-and-discard turn, build melds, and complete a legal hand.', '/learn/how-to-play-real-mahjong', 'Foundations'],
  ['Chi, Pung, and Kong', 'See exactly how sequences, triplets, and four-of-a-kind melds work.', '/learn/chi-pung-kong', 'Rules'],
  ['Beginner Strategy', 'Improve tile efficiency, discard choices, hand shape, and table awareness.', '/learn/beginner-strategy', 'Strategy'],
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
        canonical="https://ninegatesmahjong.com/learn"
      />
      <main className="hub-page">
        <header>
          <p className="game-eyebrow">Nine Gates academy</p>
          <h1>Learn Mahjong</h1>
          <p>Direct answers for first-time players, deeper strategy for improving hands, and cultural context for the many games called Mahjong.</p>
        </header>
        <section className="hub-grid">
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
        <div className="flex justify-center items-center mt-16 w-full" data-gaio-section="ads">
          <AdSlot width={728} height={90} className="hidden md:flex" />
          <AdSlot width={320} height={50} className="flex md:hidden" />
        </div>
      </main>
    </>
  );
}
