import { useEffect, useMemo, useState } from 'react';
import SEOHead from '../components/SEOHead';

const categories = ['Hall of Fame', 'Real Mahjong', 'Solitaire', 'Daily Puzzle', 'Time Attack'] as const;
const players = [
  ['JadePhoenix', 1842, 1296, 71, 'Grandmaster', 2318],
  ['RiichiRonin', 1627, 1088, 68, 'Grandmaster', 2264],
  ['BambooScholar', 1401, 921, 66, 'Master', 2179],
  ['RedDragonNL', 1298, 803, 62, 'Master', 2116],
  ['LotusWind', 1184, 702, 59, 'Expert', 2044],
  ['EastGate', 1060, 611, 58, 'Expert', 1998],
  ['SilentSakura', 986, 559, 57, 'Expert', 1941],
  ['GoldenCircle', 902, 487, 54, 'Advanced', 1874],
];

interface LiveEntry {
  display_name: string;
  rating: number;
  rated_wins: number;
  rated_losses: number;
  games_played: number;
}

export default function LeaderboardsPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('Hall of Fame');
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>([]);
  useEffect(() => {
    fetch('/api/leaderboards')
      .then((response) => response.ok ? response.json() : { entries: [] })
      .then((payload: { entries?: LiveEntry[] }) => setLiveEntries(payload.entries ?? []))
      .catch(() => setLiveEntries([]));
  }, []);
  const rows = useMemo(() => liveEntries.length
    ? liveEntries.map((entry) => [
        entry.display_name,
        entry.games_played,
        entry.rated_wins,
        entry.games_played ? Math.round((entry.rated_wins / entry.games_played) * 100) : 0,
        entry.rating >= 2200 ? 'Grandmaster' : entry.rating >= 2000 ? 'Master' : entry.rating >= 1800 ? 'Expert' : 'Rated',
        entry.rating,
      ])
    : players, [liveEntries]);
  return (
    <>
      <SEOHead
        title="Mahjong Hall of Fame and Player Rankings"
        description="View Nine Gates Mahjong registered-player rankings, match wins, win rates, rating tiers, and seasonal Hall of Fame standings."
        canonical="https://ninegatesmahjong.com/leaderboards"
      />
      <main className="rankings-page">
        <header>
          <div className="ranking-emblem">冠</div>
          <p className="game-eyebrow">Registered player records</p>
          <h1>Hall of Fame</h1>
          <p>Authentic skill ratings combine results, opponent strength, consistency, and activity. Wins matter, but beating stronger players matters more.</p>
        </header>
        <nav className="ranking-tabs">
          {categories.map((item) => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}
        </nav>
        <section className="ranking-method">
          <div><strong>Elo-style rating</strong><span>Ratings move according to expected result and opponent strength.</span></div>
          <div><strong>Provisional period</strong><span>The first 20 rated matches adjust more quickly to find an accurate level.</span></div>
          <div><strong>Season integrity</strong><span>Inactivity decay affects public placement, not a player’s permanent match history.</span></div>
        </section>
        <section className="ranking-table" aria-label={`${category} ranking`}>
          <div className="ranking-row ranking-row--header"><span>Rank</span><span>Player</span><span>Wins</span><span>Win rate</span><span>Tier</span><span>Rating</span></div>
          {rows.map(([name, matches, wins, winRate, tier, rating], index) => (
            <div className={`ranking-row ${index < 3 ? `ranking-row--podium ranking-row--${index + 1}` : ''}`} key={String(name)}>
              <span>{index + 1}</span>
              <span><i>{String(name).charAt(0)}</i><strong>{name}</strong><small>{matches} matches</small></span>
              <span>{wins}</span>
              <span>{winRate}%</span>
              <span>{tier}</span>
              <span><strong>{rating}</strong></span>
            </div>
          ))}
        </section>
        <p className="ranking-note">{liveEntries.length ? 'Live standings from registered rated matches.' : 'Demonstration standings are shown until production accounts accumulate rated match history. Only registered accounts qualify for permanent Hall of Fame records.'}</p>
      </main>
    </>
  );
}
