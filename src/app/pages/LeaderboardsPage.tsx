import { useEffect, useMemo, useState } from 'react';
import SEOHead from '../components/SEOHead';

const categories = ['Hall of Fame', 'Real Mahjong', 'Solitaire', 'Daily Puzzle', 'Time Attack'] as const;
type Category = (typeof categories)[number];

interface LiveEntry {
  display_name: string;
  rating: number;
  rated_wins: number;
  rated_losses: number;
  games_played: number;
}

interface RankingRow {
  name: string;
  context: string;
  values: [string | number, string | number, string | number, string | number];
}

const CATEGORY_HEADERS: Record<Category, [string, string, string, string]> = {
  'Hall of Fame': ['Matches', 'Wins', 'Win rate', 'Rating'],
  'Real Mahjong': ['Matches', 'Wins', 'Win rate', 'Rating'],
  Solitaire: ['Boards', 'Best score', 'Best time', 'Efficiency'],
  'Daily Puzzle': ['Streak', 'Clears', 'Best time', 'Score'],
  'Time Attack': ['Runs', 'Best score', 'Best time', 'Max combo'],
};

const DEMO_ROWS: Record<Category, RankingRow[]> = {
  'Hall of Fame': [
    { name: 'JadePhoenix', context: 'Grandmaster', values: [1842, 1296, '71%', 2318] },
    { name: 'RiichiRonin', context: 'Grandmaster', values: [1627, 1088, '68%', 2264] },
    { name: 'BambooScholar', context: 'Master', values: [1401, 921, '66%', 2179] },
    { name: 'RedDragonNL', context: 'Master', values: [1298, 803, '62%', 2116] },
    { name: 'LotusWind', context: 'Expert', values: [1184, 702, '59%', 2044] },
  ],
  'Real Mahjong': [
    { name: 'RiichiRonin', context: 'Defensive specialist', values: [1627, 1088, '68%', 2264] },
    { name: 'JadePhoenix', context: 'Balanced table play', values: [1510, 1009, '67%', 2218] },
    { name: 'EastGate', context: 'Fast hand builder', values: [1060, 611, '58%', 1998] },
    { name: 'SilentSakura', context: 'Closed-hand expert', values: [986, 559, '57%', 1941] },
    { name: 'GoldenCircle', context: 'Rising contender', values: [902, 487, '54%', 1874] },
  ],
  Solitaire: [
    { name: 'LotusWind', context: 'Fortress layout', values: [684, '48,950', '2:41', '96%'] },
    { name: 'TileArchitect', context: 'Fortress layout', values: [521, '47,725', '2:58', '94%'] },
    { name: 'QuietCrane', context: 'Fortress layout', values: [438, '46,800', '3:06', '93%'] },
    { name: 'MoonScholar', context: 'Fortress layout', values: [401, '45,650', '3:17', '91%'] },
    { name: 'IvoryGate', context: 'Fortress layout', values: [376, '44,975', '3:23', '90%'] },
  ],
  'Daily Puzzle': [
    { name: 'JadePhoenix', context: 'Current daily season', values: [84, 312, '2:36', '49,200'] },
    { name: 'MorningBamboo', context: 'Current daily season', values: [63, 290, '2:44', '48,675'] },
    { name: 'LanternFox', context: 'Current daily season', values: [52, 248, '2:51', '47,950'] },
    { name: 'RedDragonNL', context: 'Current daily season', values: [41, 207, '3:02', '46,825'] },
    { name: 'EastGate', context: 'Current daily season', values: [37, 196, '3:10', '45,900'] },
  ],
  'Time Attack': [
    { name: 'FlashBamboo', context: 'Two-minute sprint', values: [418, '28,440', '0:49', 24] },
    { name: 'GoldenCircle', context: 'Two-minute sprint', values: [392, '27,980', '0:52', 22] },
    { name: 'CrimsonTile', context: 'Two-minute sprint', values: [356, '27,425', '0:55', 21] },
    { name: 'FastLotus', context: 'Two-minute sprint', values: [301, '26,875', '0:59', 19] },
    { name: 'NorthWind', context: 'Two-minute sprint', values: [287, '26,300', '1:03', 18] },
  ],
};

function tierFor(rating: number) {
  if (rating >= 2200) return 'Grandmaster';
  if (rating >= 2000) return 'Master';
  if (rating >= 1800) return 'Expert';
  return 'Rated';
}

export default function LeaderboardsPage() {
  const [category, setCategory] = useState<Category>('Hall of Fame');
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>([]);

  useEffect(() => {
    fetch('/api/leaderboards')
      .then((response) => response.ok ? response.json() : { entries: [] })
      .then((payload: { entries?: LiveEntry[] }) => setLiveEntries(payload.entries ?? []))
      .catch(() => setLiveEntries([]));
  }, []);

  const rows = useMemo<RankingRow[]>(() => {
    if ((category === 'Hall of Fame' || category === 'Real Mahjong') && liveEntries.length) {
      return liveEntries.map((entry) => ({
        name: entry.display_name,
        context: tierFor(entry.rating),
        values: [
          entry.games_played,
          entry.rated_wins,
          `${entry.games_played ? Math.round((entry.rated_wins / entry.games_played) * 100) : 0}%`,
          entry.rating,
        ],
      }));
    }
    return DEMO_ROWS[category];
  }, [category, liveEntries]);

  const headers = CATEGORY_HEADERS[category];
  const liveCategory = (category === 'Hall of Fame' || category === 'Real Mahjong') && liveEntries.length > 0;

  return (
    <>
      <SEOHead
        title="Mahjong Hall of Fame and Player Rankings"
        description="View Nine Gates Mahjong registered-player rankings, puzzle records, win rates, rating tiers, and seasonal standings."
        canonical="https://ninegatesmahjong.com/leaderboards"
      />
      <main className="rankings-page">
        <header>
          <div className="ranking-emblem">&#20896;</div>
          <p className="game-eyebrow">Player and puzzle records</p>
          <h1>Hall of Fame</h1>
          <p>Compare rated table results, board-clearing records, daily consistency, and speed-run performance.</p>
        </header>
        <nav className="ranking-tabs" aria-label="Ranking category">
          {categories.map((item) => (
            <button
              className={category === item ? 'active' : ''}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </nav>
        <section className="ranking-method">
          <div><strong>Verified categories</strong><span>Each tab uses metrics appropriate to that game mode.</span></div>
          <div><strong>Rated table play</strong><span>Real Mahjong ratings move according to result and opponent strength.</span></div>
          <div><strong>Season integrity</strong><span>Public records may be reviewed when automated or invalid play is detected.</span></div>
        </section>
        <section className="ranking-table" aria-label={`${category} ranking`} data-ranking-category={category}>
          <div className="ranking-row ranking-row--header">
            <span>Rank</span><span>Player</span>
            {headers.map((header) => <span key={header}>{header}</span>)}
          </div>
          {rows.map((row, index) => (
            <div className={`ranking-row ${index < 3 ? `ranking-row--podium ranking-row--${index + 1}` : ''}`} key={`${category}-${row.name}`}>
              <span>{index + 1}</span>
              <span><i>{row.name.charAt(0)}</i><strong>{row.name}</strong><small>{row.context}</small></span>
              {row.values.map((value, valueIndex) => <span key={`${row.name}-${headers[valueIndex]}`}><strong>{value}</strong></span>)}
            </div>
          ))}
        </section>
        <p className="ranking-note">
          {liveCategory
            ? 'Live standings from registered rated matches.'
            : `${category} sample standings demonstrate the published ranking format until enough verified public results are available.`}
        </p>
      </main>
    </>
  );
}
