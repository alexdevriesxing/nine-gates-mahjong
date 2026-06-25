import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { formatTime } from '@shared/utils';
import { getGameProgress, type GameProgress } from '@shared/utils/gameProgress';

const challenges = [
  {
    id: 'daily',
    title: 'Daily Gate',
    format: "Complete today's shared seeded puzzle.",
    path: '/daily',
    action: 'Play daily qualifier',
  },
  {
    id: 'time-attack',
    title: 'Golden Dragon Sprint',
    format: 'Clear the Time Attack grid before the clock expires.',
    path: '/time-attack',
    action: 'Enter speed qualifier',
  },
  {
    id: 'solitaire',
    title: 'Fortress Open',
    format: 'Clear a complete layered Fortress board.',
    path: '/mahjongg-solitaire',
    action: 'Enter fortress qualifier',
  },
];

const eventWindows = [
  { season: 'Lunar New Year', months: 'January-February', format: 'Daily puzzle qualifying and a weekend final' },
  { season: 'Golden Dragon Cup', months: 'May-June', format: 'Time Attack ladders and invitational tables' },
  { season: 'Autumn Lantern Open', months: 'September-October', format: 'Solitaire seeds, live rooms, and community finals' },
];

export default function EventsPage() {
  const [progress, setProgress] = useState<GameProgress>(() => getGameProgress());

  useEffect(() => {
    const refresh = () => setProgress(getGameProgress());
    window.addEventListener('focus', refresh);
    window.addEventListener('ngm-progress-updated', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('ngm-progress-updated', refresh);
    };
  }, []);

  const completed = challenges.filter((challenge) => progress[challenge.id]?.completions).length;

  return (
    <>
      <SEOHead
        title="Mahjong Events and Open Challenges | Nine Gates Mahjong"
        description="Enter live Nine Gates Mahjong puzzle qualifiers, track completed event gates, and join multiplayer practice tables."
        canonical="https://ninegatesmahjong.com/events"
      />
      <main className="events-page">
        <header>
          <div className="event-seal"><span>&#36093;</span></div>
          <p className="game-eyebrow">Seasonal tournament pavilion</p>
          <h1>Nine Gates Events</h1>
          <p>Three open qualifiers are playable now. Clear each gate to complete the current personal challenge circuit.</p>
          <span className="badge badge-jade">{completed}/3 gates complete</span>
        </header>

        <section className="event-challenges" aria-label="Open event challenges">
          {challenges.map((challenge, index) => {
            const record = progress[challenge.id];
            return (
              <article key={challenge.id} className={record ? 'event-challenge--complete' : ''}>
                <span>Gate {index + 1}</span>
                <h2>{challenge.title}</h2>
                <p>{challenge.format}</p>
                {record ? (
                  <div className="event-challenge__result">
                    <strong>{record.completions} clear{record.completions === 1 ? '' : 's'}</strong>
                    <small>
                      Best {record.bestSeconds === null ? 'recorded' : formatTime(record.bestSeconds)}
                      {record.bestScore > 0 ? ` \u00b7 ${record.bestScore.toLocaleString()} pts` : ''}
                    </small>
                  </div>
                ) : (
                  <div className="event-challenge__result"><strong>Open</strong><small>No clear recorded yet</small></div>
                )}
                <Link className={record ? 'btn-secondary' : 'btn-primary'} to={challenge.path}>
                  {record ? 'Improve result' : challenge.action}
                </Link>
              </article>
            );
          })}
        </section>

        <section className="event-live-table">
          <div>
            <p className="game-eyebrow">Live table event</p>
            <h2>Private multiplayer rooms are open</h2>
            <p>Create a room, invite another player with the six-character code, and let server-controlled AI fill the remaining seats.</p>
          </div>
          <Link className="btn-vermilion" to="/lobby">Open multiplayer lobby</Link>
        </section>

        <section className="event-calendar">
          {eventWindows.map((event, index) => (
            <article key={event.season}>
              <span>0{index + 1}</span>
              <h2>{event.season}</h2>
              <strong>{event.months}</strong>
              <p>{event.format}</p>
            </article>
          ))}
        </section>

        <section className="event-rules">
          <h2>Tournament principles</h2>
          <div>
            <p><strong>Equal boards.</strong> Puzzle events use the same deterministic seed for every entrant.</p>
            <p><strong>Registered identity.</strong> Official results connect to a Nine Gates profile and rating history.</p>
            <p><strong>No real-money wagering.</strong> Nine Gates tournaments are skill events and never accept bets or cash stakes.</p>
            <p><strong>Fair play.</strong> Live matches use server-authoritative room state and reviewable match records.</p>
          </div>
          <nav className="event-rules__actions">
            <Link className="btn-primary" to="/register">Create an event profile</Link>
            <Link className="btn-secondary" to="/leaderboards">View rankings</Link>
          </nav>
        </section>
      </main>
    </>
  );
}
