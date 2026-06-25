import type { ReactNode } from 'react';
import AdSlot from './AdSlot';
import SEOHead from './SEOHead';

interface GamePageFrameProps {
  title: string;
  description: string;
  canonical: string;
  children: ReactNode;
  afterGame?: ReactNode;
}

export default function GamePageFrame({
  title,
  description,
  canonical,
  children,
  afterGame,
}: GamePageFrameProps) {
  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={`https://ninegatesmahjong.com${canonical}`}
        ogImage="https://ninegatesmahjong.com/hero-bg.jpg"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: title.split('|')[0].trim(),
          description,
          url: `https://ninegatesmahjong.com${canonical}`,
          applicationCategory: 'Game',
          operatingSystem: 'Any modern web browser',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        }}
      />
      <div className="game-page">
        <div className="game-page__mobile-ad">
          <AdSlot width={320} height={50} />
        </div>
        <div className="game-page__layout">
          <div className="game-page__rail game-page__rail--left">
            <AdSlot width={160} height={600} sticky />
          </div>
          <main className="game-page__main">
            {children}
            <div className="game-page__leaderboard-ad">
              <AdSlot width={728} height={90} />
            </div>
            {afterGame}
          </main>
          <div className="game-page__rail game-page__rail--right">
            <AdSlot width={160} height={600} sticky />
          </div>
        </div>
      </div>
    </>
  );
}
