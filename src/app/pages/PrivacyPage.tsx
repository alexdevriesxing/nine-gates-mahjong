import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Nine Gates Mahjong"
        description="Learn how Nine Gates Mahjong uses account, session, profile, multiplayer, browser-storage and advertising data, and how to exercise your privacy choices."
        canonical="https://ninegatesmahjong.com/privacy"
      />
      <main className="legal-page">
        <article>
          <h1>Privacy Policy</h1>
          <p>Last updated July 14, 2026.</p>

          <h2>Who operates the service</h2>
          <p>
            Nine Gates Mahjong is operated by Fire Dragon Interactive. This policy explains the information used to provide the website, games, accounts, rankings, multiplayer rooms and advertising-supported features.
          </p>

          <h2>Information used without an account</h2>
          <p>
            You can play the core games without creating an account. Guest names, interface-language choices, puzzle progress and advertising choices may be stored locally in your browser. You can remove this information through your browser settings.
          </p>

          <h2>Account and profile information</h2>
          <p>
            When you register, the service stores your email address, username, display name, avatar selection, account creation date, rating, game totals, wins, losses, experience points and virtual coins. Passwords are not stored in plain text; the service stores a salted server-side password hash.
          </p>

          <h2>Sessions and security logs</h2>
          <p>
            Registered accounts use a secure HTTP-only session cookie. The service may process IP address, user-agent, request timing and similar technical data for authentication, abuse prevention, rate limiting, troubleshooting and service security. Sessions expire and can be invalidated by logging out.
          </p>

          <h2>Multiplayer rooms and chat</h2>
          <p>
            Private room codes, seat state, readiness, game actions, connection state and recent chat messages are stored with the multiplayer room while that room remains available. Chat is automatically filtered for links and selected abusive terms. Room and chat information may be reviewed when needed to investigate abuse or technical faults.
          </p>

          <h2>Ratings and match history</h2>
          <p>
            Rated multiplayer results may create a match record containing participating registered accounts, placement and rating changes. These records support profiles, leaderboards and fair-play review.
          </p>

          <h2>Advertising and consent</h2>
          <p>
            Third-party advertising scripts load only after you choose “Accept ads.” If you choose “Continue without ads,” the games remain available and third-party ad placements are replaced by internal house messages. Advertising providers may process device, browser, approximate-location and interaction data under their own privacy policies when consent applies.
          </p>

          <h2>Legal bases and purposes</h2>
          <p>
            Account, session, room and gameplay information is processed to provide the service, maintain security, prevent abuse and administer rankings. Optional advertising technology is used only after consent. Where applicable, necessary security and fraud-prevention processing is based on legitimate interests in operating a safe service.
          </p>

          <h2>Retention</h2>
          <p>
            Browser-stored guest data remains until you clear it. Sessions expire after their configured lifetime or when invalidated. Account and match information is retained while the account and related competitive records remain active, unless deletion is requested or retention is required for security, dispute or legal reasons. Multiplayer room state is temporary and should not be treated as permanent message storage.
          </p>

          <h2>Your choices and rights</h2>
          <p>
            You may play without registering, decline optional advertising, reopen the privacy choices from the footer, clear local browser storage, log out, or request access, correction or deletion of your account information. Depending on your location, you may also have rights to object, restrict processing or receive a portable copy of information you provided.
          </p>

          <h2>Children and wagering</h2>
          <p>
            The service does not provide real-money gambling, deposits, betting or cash prizes. Parents and guardians should supervise younger players’ use of account and chat features.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy and account-deletion requests can be sent to privacy@ninegatesmahjong.com. Please do not send passwords or sensitive identification documents unless specifically requested through a secure process.
          </p>
        </article>
      </main>
    </>
  );
}
