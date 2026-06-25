import { Link } from 'react-router-dom';
import TileMatchGame, { type TileMatchMode } from '../../game/react/TileMatchGame';
import GamePageFrame from './GamePageFrame';

const PAGE_DATA: Record<
  TileMatchMode,
  { title: string; description: string; canonical: string; heading: string; body: string }
> = {
  solitaire: {
    title: 'Play Mahjongg Solitaire Free Online | Nine Gates Mahjong',
    description: 'Play free Mahjongg Solitaire online with a guaranteed-solvable layered board, hints, undo, shuffle, touch controls, and premium tile graphics.',
    canonical: '/mahjongg-solitaire',
    heading: 'How to play Mahjongg Solitaire',
    body: 'Mahjongg Solitaire is a one-player matching puzzle played with Mahjong tiles. Choose two identical free tiles to remove them. A tile is free when no tile covers it and either its left or right side is open. Work from the upper layers and long rows first so you do not trap important pairs.',
  },
  daily: {
    title: 'Daily Mahjongg Puzzle | Free Daily Mahjong Challenge',
    description: 'Play today’s free deterministic Mahjongg puzzle. Everyone receives the same solvable board, with score, timer, hints, and daily challenge controls.',
    canonical: '/daily',
    heading: 'Today’s shared Mahjongg challenge',
    body: 'The Daily Mahjongg Puzzle uses the current date as its seed, so every player receives the same arrangement. This makes completion time, hints, and final score directly comparable. Return tomorrow for a newly generated board while today’s layout remains stable all day.',
  },
  zen: {
    title: 'Zen Mahjongg Online | Relaxing Free Mahjong Tile Game',
    description: 'Play a relaxing untimed Mahjongg game with calm lantern visuals, unlimited hints, shuffle controls, and responsive touch-friendly tiles.',
    canonical: '/zen-mahjongg',
    heading: 'A quieter way to play Mahjongg',
    body: 'Zen Mahjongg removes the timer and score pressure while keeping the layered matching rules of Mahjongg Solitaire. Use hints and shuffles whenever you need them. The slower pace makes this mode suitable for learning free-tile patterns or simply unwinding.',
  },
  'time-attack': {
    title: 'Mahjongg Time Attack | Fast Free Matching Game',
    description: 'Race a two-minute Mahjongg timer, build combos, earn time bonuses, and clear the responsive tile grid before time expires.',
    canonical: '/time-attack',
    heading: 'Fast Mahjongg matching',
    body: 'Time Attack turns tile matching into a speed challenge. Match identical visible tiles, chain successful pairs to build your combo, and earn small time bonuses. Accuracy matters because a fast scan of the whole board is usually better than random tapping.',
  },
  connect: {
    title: 'Play Mahjong Connect Online Free | Nine Gates Mahjong',
    description: 'Play Mahjong Connect online. Link matching tiles using open paths with no more than two turns on a responsive desktop, tablet, or mobile board.',
    canonical: '/mahjong-connect',
    heading: 'What is Mahjong Connect?',
    body: 'Mahjong Connect is a flat-board puzzle where matching faces must be connected by an unobstructed path. The path may bend no more than twice and can travel around the outside edge. Clearing outer tiles first opens longer routes through the board.',
  },
  'shisen-sho': {
    title: 'Play Shisen-Sho Online Free | Mahjong Tile Puzzle',
    description: 'Play Shisen-Sho online with authentic open-path pair matching, responsive controls, hints, shuffles, and polished Mahjong tile graphics.',
    canonical: '/shisen-sho',
    heading: 'How Shisen-Sho works',
    body: 'Shisen-Sho is a Japanese tile-matching puzzle related to Mahjong Connect. Two identical tiles can be removed when a clear route joins them with at most three straight line segments. Planning ahead matters because every removal changes the available routes.',
  },
  memory: {
    title: 'Mahjongg Memory Game | Free Tile Matching Challenge',
    description: 'Train visual memory with a free Mahjong tile matching game featuring responsive cards, animated reveals, score, moves, and touch controls.',
    canonical: '/mahjongg-memory',
    heading: 'Train memory with Mahjong tiles',
    body: 'Mahjongg Memory hides pairs behind lacquered tile backs. Reveal two positions, remember each face, and clear the board in as few moves as possible. The symbols are more varied than a standard card deck, making this a useful visual recall exercise.',
  },
};

export default function TileGamePage({ mode }: { mode: TileMatchMode }) {
  const data = PAGE_DATA[mode];
  return (
    <GamePageFrame title={data.title} description={data.description} canonical={data.canonical}>
      <TileMatchGame mode={mode} />
      <article className="game-seo-card">
        <h2>{data.heading}</h2>
        <p>{data.body}</p>
        <p>
          New to the tiles? Read the <Link to="/learn/how-to-play-mahjongg-solitaire">Mahjongg Solitaire guide</Link>,
          compare <Link to="/learn/mahjong-vs-mahjongg">Mahjong and Mahjongg</Link>, or explore
          authentic <Link to="/real-mahjong">four-player Mahjong</Link>.
        </p>
      </article>
    </GamePageFrame>
  );
}
