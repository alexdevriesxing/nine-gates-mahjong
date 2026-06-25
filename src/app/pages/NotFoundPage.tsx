import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="Page Not Found | Nine Gates Mahjong"
        description="The requested Nine Gates Mahjong page could not be found."
        canonical="https://ninegatesmahjong.com/404"
        noIndex
      />
      <main className="not-found-page">
        <div className="gate-medallion" aria-hidden="true">
          <span /><span /><span />
          <span /><span /><span />
          <span /><span /><span />
        </div>
        <p className="game-eyebrow">The gate is closed</p>
        <h1>404 — Page not found</h1>
        <p>The page may have moved, but every playable table is still available from the game hall.</p>
        <nav>
          <Link className="btn-primary" to="/play">Browse games</Link>
          <Link className="btn-secondary" to="/">Return home</Link>
        </nav>
      </main>
    </>
  );
}
