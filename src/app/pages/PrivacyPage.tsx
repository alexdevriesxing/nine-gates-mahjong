import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead title="Privacy Policy | Nine Gates Mahjong" description="Read how Nine Gates Mahjong handles local profile data, room connections, advertising choices, analytics, and player rights." canonical="https://ninegatesmahjong.com/privacy" />
      <main className="legal-page"><article><h1>Privacy Policy</h1><p>Last updated June 24, 2026.</p><h2>Data used to provide the service</h2><p>Nine Gates may process a display name, account email, profile settings, game results, ratings, room actions, and technical security logs. Guest preferences and preview account data are currently stored in the browser. Production account services will use secure server sessions and password hashing.</p><h2>Advertising and consent</h2><p>Optional advertising technology loads only after an affirmative choice. Players can decline optional ads and continue using the core games. Advertising partners may process device or interaction data according to their own policies when consent applies.</p><h2>Chat moderation</h2><p>Game chat is filtered for profanity and links. Production multiplayer chat may be logged temporarily for abuse prevention, moderation, and safety review.</p><h2>Your choices</h2><p>You may avoid account creation, clear local browser storage, decline optional advertising, or request deletion of a production account after account services launch. Contact privacy@ninegatesmahjong.com for privacy requests.</p><h2>Children and wagering</h2><p>The site does not provide real-money gambling, betting, deposits, or cash prizes. Parents and guardians should supervise younger players’ online chat use.</p></article></main>
    </>
  );
}
