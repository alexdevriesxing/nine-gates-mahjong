import { Link } from 'react-router-dom';
import TileMatchGame, { type TileMatchMode } from '../../game/react/TileMatchGame';
import GamePageFrame from './GamePageFrame';

interface ModeDetails {
  title: string;
  description: string;
  canonical: string;
  heading: string;
  intro: string;
  rules: string[];
  controls: string[];
  strategy: string[];
  related: Array<{ name: string; path: string }>;
  faqs: Array<{ q: string; a: string }>;
}

const PAGE_DATA: Record<TileMatchMode, ModeDetails> = {
  solitaire: {
    title: 'Play Mahjongg Solitaire Free Online | Nine Gates Mahjong',
    description: 'Play free Mahjongg Solitaire online with a guaranteed-solvable layered board, hints, undo, shuffle, touch controls, and premium tile graphics.',
    canonical: '/mahjongg-solitaire',
    heading: 'Free Online Mahjongg Solitaire',
    intro: 'Mahjongg Solitaire is a popular single-player matching game played using traditional Chinese Mahjong tiles. The goal is to clear all tiles from the board by finding and matching identical pairs of free tiles.',
    rules: [
      'Select two identical tiles to match and remove them from the board.',
      'A tile is considered "free" only if no tile is covering it from above, and either its left or right side is completely open.',
      'Special suit tiles (Seasons and Flowers) can be matched with any other tile in their respective groups, even if the face icons differ.'
    ],
    controls: [
      'Click or tap on a free tile to highlight it, then click/tap a matching tile to clear the pair.',
      'Desktop shortcuts: Press H for a Hint, U to Undo your last match, or F to toggle fullscreen mode.'
    ],
    strategy: [
      'Prioritize high layers: Clear tiles from the top stack first to reveal the maximum number of buried tiles below.',
      'Open long rows: Focus on matching tiles at the outer ends of long horizontal rows to prevent locking the board.',
      'Plan your pairs: If you have four identical tiles free, match them immediately. If you have three, choose the match that unlocks the most new tiles.'
    ],
    related: [
      { name: 'Daily Mahjongg Puzzle', path: '/daily' },
      { name: 'Zen Mahjongg', path: '/zen-mahjongg' },
      { name: 'Time Attack', path: '/time-attack' }
    ],
    faqs: [
      {
        q: 'What makes a tile "free" in Mahjongg Solitaire?',
        a: 'A tile is free if there are no tiles resting on top of it, and it has an open space on either its immediate left or right side.'
      },
      {
        q: 'Can all Mahjongg Solitaire boards be solved?',
        a: 'Yes, on Nine Gates Mahjong, our layouts are generated using a reverse-solve algorithm to guarantee that every board has at least one valid solution path.'
      },
      {
        q: 'What is the difference between Mahjong and Mahjongg?',
        a: 'Traditional Mahjong is a four-player game involving hand-building and discards. Mahjongg Solitaire is a single-player matching puzzle using the same tile sets.'
      }
    ]
  },
  daily: {
    title: 'Daily Mahjongg Puzzle | Free Daily Mahjong Challenge',
    description: 'Play today’s free deterministic Mahjongg puzzle. Everyone receives the same solvable board, with score, timer, hints, and daily challenge controls.',
    canonical: '/daily',
    heading: 'Today’s Shared Mahjongg Challenge',
    intro: 'The Daily Mahjongg Puzzle gives every player around the world the exact same board layout based on the current calendar date. Compete fairly for the top score and build your daily streak.',
    rules: [
      'The layout seed is generated from the current date, ensuring a unique and identical board for all players.',
      'Matches must follow the standard rules of Mahjongg Solitaire (free tiles only).',
      'Completing the game records your time, moves, and final score to the daily leaderboards.'
    ],
    controls: [
      'Click/tap to select and match tiles.',
      'The pause button stops the timer and hides the board to ensure fair competitive play.'
    ],
    strategy: [
      'Minimize hints and shuffles: Each hint and shuffle carries a score penalty, so try to scan the board manually.',
      'Race the clock: Speed is a major factor in the final score bonus calculations, so match quickly once you spot a path.',
      'Practice on Zen mode: If you want to warm up before playing the daily challenge, try our Zen mode first.'
    ],
    related: [
      { name: 'Mahjongg Solitaire', path: '/mahjongg-solitaire' },
      { name: 'Zen Mahjongg', path: '/zen-mahjongg' },
      { name: 'Leaderboards', path: '/leaderboards' }
    ],
    faqs: [
      {
        q: 'Does the Daily Puzzle change throughout the day?',
        a: 'No, the board layout remains completely identical and stable for 24 hours based on your local timezone date.'
      },
      {
        q: 'How is the final score calculated?',
        a: 'Your score starts with base match points and combo multipliers, combined with a speed bonus that decreases as the timer counts up. Hints and shuffles subtract points.'
      }
    ]
  },
  zen: {
    title: 'Zen Mahjongg Online | Relaxing Free Mahjong Tile Game',
    description: 'Play a relaxing untimed Mahjongg game with calm lantern visuals, unlimited hints, shuffle controls, and responsive touch-friendly tiles.',
    canonical: '/zen-mahjongg',
    heading: 'Zen Mahjongg — Relax & Match',
    intro: 'Zen Mahjongg is designed for players seeking a calm, pressure-free matching experience. Enjoy the traditional layered puzzle layout with no timers, no scores, and infinite shuffles.',
    rules: [
      'Match free identical tiles to clear the board at your own pace.',
      'Use the hint and shuffle tools as much as you like with absolutely no penalties.'
    ],
    controls: [
      'Tap or click to match tiles.',
      'Use the bottom toolbar buttons for infinite hints, shuffles, and layout resets.'
    ],
    strategy: [
      'Focus on the relaxing flow: Use this mode to study tile patterns and learn to recognize standard suited and honor faces.',
      'Experiment with matches: Since there are no penalties, you can test different matching combinations to see how they impact bottom stacks.',
      'Great for mobile: The untimed nature makes Zen mode perfect for quick sessions on mobile devices during commutes.'
    ],
    related: [
      { name: 'Mahjongg Solitaire', path: '/mahjongg-solitaire' },
      { name: 'Daily Mahjongg Puzzle', path: '/daily' },
      { name: 'Mahjongg Memory', path: '/mahjongg-memory' }
    ],
    faqs: [
      {
        q: 'Is there a time limit in Zen Mahjongg?',
        a: 'No, there are no timers or time limits. You can take as long as you need to complete the board.'
      },
      {
        q: 'Can I get stuck in Zen mode?',
        a: 'If you run out of moves, you can simply click the shuffle button to rearrange the remaining tiles, allowing you to finish the board every time.'
      }
    ]
  },
  'time-attack': {
    title: 'Mahjongg Time Attack | Fast Free Matching Game',
    description: 'Race a two-minute Mahjongg timer, build combos, earn time bonuses, and clear the responsive tile grid before time expires.',
    canonical: '/time-attack',
    heading: 'Mahjongg Time Attack',
    intro: 'Time Attack is a fast-paced speed matching mode. Start with a strict time limit and earn extra seconds with every quick match and combo link you complete.',
    rules: [
      'You begin the game with 120 seconds on the clock.',
      'Each matching pair adds a small time bonus to your timer.',
      'Chain multiple matches within 3 seconds of each other to build a combo and earn additional time bonuses.'
    ],
    controls: [
      'Match identical free tiles as quickly as possible.',
      'Keyboard shortcuts are highly recommended for speed: Press U for quick undo and H for a fast hint.'
    ],
    strategy: [
      'Maintain your combo: Watch the combo bar and try to match tiles continuously to multiply your time bonuses.',
      'Clear outer tiles: Keep a few easy matching pairs in reserve near the edges to keep your combo alive when you get stuck in the middle.',
      'Quick shuffles: If you cannot find a match in 5 seconds, use a shuffle immediately to get a fresh layout rather than wasting time.'
    ],
    related: [
      { name: 'Daily Mahjongg Puzzle', path: '/daily' },
      { name: 'Mahjong Connect', path: '/mahjong-connect' },
      { name: 'Shisen-Sho', path: '/shisen-sho' }
    ],
    faqs: [
      {
        q: 'What is the maximum time limit in Time Attack?',
        a: 'The timer is capped at 180 seconds, so even with large combo bonuses, you must keep matching to maintain the clock.'
      },
      {
        q: 'Does using a hint penalize my time?',
        a: 'Hints do not subtract seconds directly, but they carry a score penalty and take valuable time to execute.'
      }
    ]
  },
  connect: {
    title: 'Play Mahjong Connect Online Free | Nine Gates Mahjong',
    description: 'Play Mahjong Connect online. Link matching tiles using open paths with no more than two turns on a responsive desktop, tablet, or mobile board.',
    canonical: '/mahjong-connect',
    heading: 'Mahjong Connect Online',
    intro: 'Mahjong Connect is an exciting variation of the classic puzzle played on a flat, single-layer grid. Clear the board by connecting matching pairs with an open path that turns no more than twice.',
    rules: [
      'Find identical tiles that can be linked by an unobstructed line.',
      'The connecting line can pass through empty spaces or around the outside of the grid, but it cannot make more than two 90-degree turns (3 line segments max).',
      'Clear the entire grid before the level timer runs out.'
    ],
    controls: [
      'Click or tap on the first tile, then select the second tile. If a valid connection exists, the tiles will clear.'
    ],
    strategy: [
      'Clear adjacent pairs first: Start by matching identical tiles that are next to each other to open up paths.',
      'Work from the outside in: Clear tiles on the outer border first to create routes around the grid.',
      'Scan the columns: Since tiles slide down or shift when pairs are cleared (in some layouts), plan your matches to align tiles in columns.'
    ],
    related: [
      { name: 'Shisen-Sho', path: '/shisen-sho' },
      { name: 'Mahjongg Memory', path: '/mahjongg-memory' },
      { name: 'Mahjongg Solitaire', path: '/mahjongg-solitaire' }
    ],
    faqs: [
      {
        q: 'How does the path rule work in Mahjong Connect?',
        a: 'The path between two matching tiles must consist of empty grid spaces. The path can have a maximum of two turns (forming a U-shape, L-shape, or straight line).'
      },
      {
        q: 'What is the difference between Mahjong Connect and Shisen-Sho?',
        a: 'They are very similar, but Mahjong Connect often features sliding gravity mechanics where tiles shift position, whereas Shisen-Sho is played on a static flat grid.'
      }
    ]
  },
  'shisen-sho': {
    title: 'Play Shisen-Sho Online Free | Mahjong Tile Puzzle',
    description: 'Play Shisen-Sho online with authentic open-path pair matching, responsive controls, hints, shuffles, and polished Mahjong tile graphics.',
    canonical: '/shisen-sho',
    heading: 'Play Shisen-Sho (Rivers Game)',
    intro: 'Shisen-Sho, also known as Four Rivers, is a traditional Japanese tile-matching game. Similar to Mahjong Connect, it challenges you to clear a flat grid of tiles by linking pairs using lines with at most two turns.',
    rules: [
      'Match identical tiles that can be linked by an open path of up to three straight segments.',
      'Unlike layered solitaire, Shisen-Sho is played entirely on a flat grid of 136 tiles (4 copies of 34 faces).',
      'The game is won when all tiles are successfully removed.'
    ],
    controls: [
      'Click/tap a tile, then click/tap its match to draw the connecting line and clear the pair.'
    ],
    strategy: [
      'Create channels: Remove inner pairs that are adjacent to clear horizontal or vertical paths across the board.',
      'Watch for twins: Look for identical tiles that are side-by-side or on the same outer edge first.',
      'Don\'t isolate tiles: Be careful not to block pathways to tiles that have no other matching options left.'
    ],
    related: [
      { name: 'Mahjong Connect', path: '/mahjong-connect' },
      { name: 'Mahjongg Solitaire', path: '/mahjongg-solitaire' },
      { name: 'Time Attack', path: '/time-attack' }
    ],
    faqs: [
      {
        q: 'Can the line go outside the grid border in Shisen-Sho?',
        a: 'Yes, the line is allowed to travel through the empty border space surrounding the tile layout to connect pairs.'
      },
      {
        q: 'How do I know if there are no more moves in Shisen-Sho?',
        a: 'The game will notify you if no valid connections remain, and you can use the shuffle button to rearrange the grid.'
      }
    ]
  },
  memory: {
    title: 'Mahjongg Memory Game | Free Tile Matching Challenge',
    description: 'Train visual memory with a free Mahjong tile matching game featuring responsive cards, animated reveals, score, moves, and touch controls.',
    canonical: '/mahjongg-memory',
    heading: 'Mahjongg Memory Game',
    intro: 'Mahjongg Memory combines the classic face-down card matching memory format with beautiful, intricate Mahjong tile faces. Test your visual recall and clear the board in the fewest moves.',
    rules: [
      'All tiles are dealt face-down in a grid.',
      'Select two tiles to flip them face-up. If the faces match, they are cleared. If they mismatch, they flip back face-down after a brief moment.',
      'Clear the entire grid to win the game.'
    ],
    controls: [
      'Click or tap a card to flip it over. Only two tiles can be flipped face-up at a time.'
    ],
    strategy: [
      'Group by suit: Mahjong tiles are highly detailed. Pay close attention to the suits (Dots, Bamboos, Characters) and ranks to avoid confusing similar-looking tiles.',
      'Memorize corners first: Work systematically from one corner of the grid to make it easier to recall locations.',
      'Take your time: There is no time penalty, so focus on accuracy to maximize your score and minimize moves.'
    ],
    related: [
      { name: 'Mahjong Connect', path: '/mahjong-connect' },
      { name: 'Zen Mahjongg', path: '/zen-mahjongg' },
      { name: 'Daily Mahjongg Puzzle', path: '/daily' }
    ],
    faqs: [
      {
        q: 'Why are Mahjong tiles harder to match than standard cards?',
        a: 'Mahjong tile faces contain complex, detailed artwork and Chinese characters that require precise visual recognition, making it a superior memory workout.'
      },
      {
        q: 'Does this game support mobile touch controls?',
        a: 'Yes, the card grid is fully responsive and optimized for smooth tapping on mobile phones and tablets.'
      }
    ]
  }
};

export default function TileGamePage({ mode }: { mode: TileMatchMode }) {
  const data = PAGE_DATA[mode];
  return (
    <GamePageFrame title={data.title} description={data.description} canonical={data.canonical}>
      <TileMatchGame mode={mode} />
      
      <article className="game-seo-card mt-12 border-t border-gold/10 pt-12">
        <h2 className="font-display text-2xl text-gold mb-4">{data.heading}</h2>
        <p className="text-ink-200 text-sm leading-relaxed mb-6">{data.intro}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-ivory text-base mb-3">Rules & How to Play</h3>
            <ul className="list-disc pl-5 text-sm text-ink-300 flex flex-col gap-2">
              {data.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-ivory text-base mb-3">Controls</h3>
            <ul className="list-disc pl-5 text-sm text-ink-300 flex flex-col gap-2">
              {data.controls.map((control, idx) => (
                <li key={idx}>{control}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-bold text-ivory text-base mb-3">Top Strategy Tips</h3>
          <ul className="list-disc pl-5 text-sm text-ink-300 flex flex-col gap-2">
            {data.strategy.map((strat, idx) => (
              <li key={idx}>{strat}</li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="mb-8 border-t border-gold/5 pt-8">
          <h3 className="font-bold text-ivory text-base mb-4">Frequently Asked Questions</h3>
          <div className="flex flex-col gap-4">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="bg-ink-950/30 p-4 rounded border border-gold/5">
                <h4 className="font-semibold text-gold text-sm mb-2">{faq.q}</h4>
                <p className="text-ink-300 text-xs leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Games */}
        <div className="border-t border-gold/5 pt-6">
          <h4 className="font-bold text-ivory text-sm mb-3">Play Next: Related Game Modes</h4>
          <div className="flex flex-wrap gap-3">
            {data.related.map((rel, idx) => (
              <Link key={idx} to={rel.path} className="btn-secondary text-xs px-4 py-2 hover:bg-gold/10 hover:text-gold border-gold/20">
                {rel.name}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-400 border-t border-gold/5 pt-6">
          New to the tiles? Read our comprehensive <Link to="/learn/how-to-play-mahjongg-solitaire" className="text-gold hover:underline">Mahjongg Solitaire guide</Link>,
          compare <Link to="/learn/mahjong-vs-mahjongg" className="text-gold hover:underline">Mahjong and Mahjongg</Link>, or explore
          authentic <Link to="/real-mahjong" className="text-gold hover:underline">four-player Mahjong vs AI</Link>.
        </p>
      </article>
    </GamePageFrame>
  );
}
