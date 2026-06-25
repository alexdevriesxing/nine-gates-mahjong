import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const tutorials = [
  {
    id: 'solitaire',
    title: 'Mahjongg Solitaire',
    subtitle: 'Learn free tiles and layered matching',
    steps: [
      ['Read the board', 'Look for tiles with nothing on top and an open left or right side. Locked tiles appear dimmer.'],
      ['Select a free tile', 'Tap or click one available tile. A gold glow marks your selection.'],
      ['Find the identical partner', 'Choose another free tile with the same suit and rank. The pair disappears.'],
      ['Open the structure', 'Prioritize high tiles and the ends of long rows to expose more choices.'],
      ['Recover from a dead end', 'Use undo to reverse a pair or shuffle to rebuild a solvable route through remaining positions.'],
    ],
  },
  {
    id: 'real',
    title: 'Real four-player Mahjong',
    subtitle: 'Draw, discard, and complete a hand',
    steps: [
      ['Recognize the tiles', 'Numbered characters, circles, and bamboo form sequences. Winds and dragons form pairs or identical groups.'],
      ['Build four melds and a pair', 'A common hand uses sequences or triplets plus one final pair.'],
      ['Draw one tile', 'Your turn begins by taking a tile from the wall, giving you one extra tile temporarily.'],
      ['Discard one tile', 'Choose the least useful tile while considering what may be dangerous for opponents.'],
      ['Watch the table', 'Discard pools and exposed melds reveal which tiles are scarce, safe, or likely wanted.'],
      ['Declare Mahjong', 'When your drawn or claimed tile completes a legal hand, declare the win under the table’s ruleset.'],
    ],
  },
  {
    id: 'connect',
    title: 'Mahjong Connect and Shisen-Sho',
    subtitle: 'Match through open paths',
    steps: [
      ['Find identical faces', 'Both tiles must show the same symbol and rank.'],
      ['Trace an open route', 'The route cannot pass through another tile.'],
      ['Count the bends', 'A legal connection uses no more than two turns, or three straight segments.'],
      ['Use the outer edge', 'Paths can travel around the outside of the grid, which makes edge pairs valuable.'],
      ['Keep routes open', 'Remove easy outside pairs first and avoid isolating a matching tile behind a solid block.'],
    ],
  },
];

export default function TutorialsPage() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const tutorial = tutorials[active];
  return (
    <>
      <SEOHead
        title="How to Play Mahjong | Guided Tutorials"
        description="Follow guided step-by-step tutorials for Mahjongg Solitaire, real four-player Mahjong, Mahjong Connect, and Shisen-Sho."
        canonical="https://ninegatesmahjong.com/how-to-play"
      />
      <main className="tutorial-page">
        <header>
          <p className="game-eyebrow">Guided learning hall</p>
          <h1>How to Play Mahjong</h1>
          <p>Choose a lesson and move through the rules one clear step at a time.</p>
        </header>
        <div className="tutorial-tabs">
          {tutorials.map((item, index) => (
            <button key={item.id} className={active === index ? 'active' : ''} onClick={() => { setActive(index); setStep(0); }}>
              <strong>{item.title}</strong><span>{item.subtitle}</span>
            </button>
          ))}
        </div>
        <section className="tutorial-stage">
          <div className="tutorial-gate" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div>
            <span>Step {step + 1} of {tutorial.steps.length}</span>
            <h2>{tutorial.steps[step][0]}</h2>
            <p>{tutorial.steps[step][1]}</p>
          </div>
          <nav>
            <button className="btn-secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Previous</button>
            {step < tutorial.steps.length - 1 ? (
              <button className="btn-primary" onClick={() => setStep((value) => value + 1)}>Next step</button>
            ) : (
              <Link className="btn-primary" to={tutorial.id === 'real' ? '/real-mahjong' : tutorial.id === 'connect' ? '/mahjong-connect' : '/mahjongg-solitaire'}>Practice now</Link>
            )}
          </nav>
        </section>
      </main>
    </>
  );
}
