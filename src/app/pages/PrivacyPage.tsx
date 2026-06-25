import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead title="Privacy Policy | Nine Gates Mahjong" description="Read how Nine Gates Mahjong handles local profile data, room connections, advertising choices, analytics, and player rights." canonical="https://ninegatesmahjong.com/privacy" />
      <main className="legal-page"><article><h1>Privacy Policy</h1><p>Last updated June 25, 2026.</p><h2>Data used to provide the service</h2><p>Nine Gates processes account email, display name, profile settings, ratings, multiplayer room actions, and technical security logs when you use those features. Registered accounts use secure HTTP-only sessions and salted server-side password hashes. Guest names, language, consent choices, and personal puzzle progress are stored in your browser.</p><h2>Advertising and consent</h2><p>Optional advertising technology loads only after an affirmative choice. Players can decline optional ads and continue using the core games. Advertising partners may process device or interaction data according to their own policies when consent applies.</p><h2>Chat moderation</h2><p>Multiplayer room chat is filtered for profanity and links. Recent room messages are stored with the room state for table coordination and moderation, then expire with that room’s retained state.</p><h2>Your choices</h2><p>You may play without an account, clear local browser storage, decline optional advertising, log out to invalidate the current session, or request deletion of an account. Contact privacy@ninegatesmahjong.com for privacy requests.</p><h2>Children and wagering</h2><p>The site does not provide real-money gambling, betting, deposits, or cash prizes. Parents and guardians should supervise younger players’ online chat use.</p></article></main>
    </>
  );
}
