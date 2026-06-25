import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead 
        title="Privacy Policy | Nine Gates Mahjong" 
        description="Nine Gates Mahjong Privacy Policy. We do not collect, store, or sell your personal data." 
        canonical="https://ninegatesmahjong.com/privacy" 
      />
      <main className="legal-page">
        <article>
          <h1>Privacy Policy</h1>
          <p>Last updated June 25, 2026.</p>
          <p>
            At Nine Gates Mahjong, your privacy is paramount. We do not collect, store, or sell your personal data to third parties. 
            All gameplay preferences, statistics, and guest profiles are processed locally inside your web browser.
          </p>
          <p>
            We display advertisements from trusted third-party networks to support the site and keep play free. 
            These ads are served in sandboxed frames and do not collect or track your personal identifier data from our portal.
          </p>
        </article>
      </main>
    </>
  );
}
