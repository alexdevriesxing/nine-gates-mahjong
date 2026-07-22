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
          '@type': ['VideoGame', 'WebApplication'],
          name: title.split('|')[0].trim(),
          description,
          url: `https://ninegatesmahjong.com${canonical}`,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Any modern web browser',
          browserRequirements: 'Requires JavaScript and a modern browser with local storage enabled.',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        }}
      />
      <div className="game-page" data-gaio-container="true">
        <div className="game-page__mobile-ad flex justify-center items-center">
          <AdSlot width={468} height={60} className="hidden sm:flex" />
          <AdSlot width={320} height={50} className="flex sm:hidden" />
        </div>
        <div className="game-page__layout">
          <div className="game-page__rail game-page__rail--left">
            <AdSlot width={160} height={600} sticky />
          </div>
          <main className="game-page__main">
            {children}
            <div className="flex justify-center items-center my-6 w-full">
              <AdSlot width={728} height={90} className="hidden md:flex" />
              <AdSlot width={300} height={250} className="flex md:hidden" />
            </div>
            {afterGame}
          </main>
          <div className="game-page__rail game-page__rail--right">
            <AdSlot width={160} height={300} sticky />
          </div>
        </div>
      </div>
    </>
  );
}
