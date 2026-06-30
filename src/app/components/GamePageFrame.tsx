import type { ReactNode } from 'react';
import ResponsiveAdSlot from './ResponsiveAdSlot';
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
      <div className="game-page" data-gaio-container="true">
        <div className="game-page__mobile-ad flex justify-center items-center">
          <ResponsiveAdSlot
            label="Sponsored"
            placement={`${canonical}-top`}
            priority
            sizes={[
              { media: '(min-width: 640px)', width: 468, height: 60 },
              { width: 320, height: 50 },
            ]}
          />
        </div>
        <div className="game-page__layout">
          <div className="game-page__rail game-page__rail--left">
            <ResponsiveAdSlot
              label="Sponsored"
              placement={`${canonical}-left-rail`}
              sticky
              priority
              sizes={[
                { media: '(min-width: 1131px)', width: 160, height: 600 },
                { disabled: true },
              ]}
            />
          </div>
          <main className="game-page__main">
            {children}
            <div className="flex justify-center items-center my-6 w-full">
              <ResponsiveAdSlot
                label="Sponsored"
                placement={`${canonical}-post-game`}
                sizes={[
                  { media: '(min-width: 768px)', width: 728, height: 90 },
                  { width: 300, height: 250 },
                ]}
              />
            </div>
            {afterGame}
          </main>
          <div className="game-page__rail game-page__rail--right">
            <ResponsiveAdSlot
              label="Sponsored"
              placement={`${canonical}-right-rail`}
              sticky
              priority
              sizes={[
                { media: '(min-width: 1491px)', width: 160, height: 600 },
                { disabled: true },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
