import PhaserGame from '../../game/PhaserGame';
import AdBanner from '../components/AdBanner';
import NativeBanner from '../components/NativeBanner';
import SEOHead from '../components/SEOHead';

export default function SolitairePage() {
  return (
    <>
      <SEOHead 
        title="Play Mahjong Solitaire | Nine Gates Mahjong" 
        description="Play authentic Mahjong Solitaire for free with premium graphics. No download required." 
      />
      
      {/* Mobile Sticky Footer Ad (320x50) */}
      <div className="fixed bottom-0 left-0 w-full z-[100] flex justify-center md:hidden bg-ink-950/90 backdrop-blur shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <AdBanner keyId="cdc33de3506804ba73d2d3661ed4fd0a" width={320} height={50} />
      </div>

      <div className="min-h-screen pt-24 pb-20 md:pb-8 flex flex-col relative z-10">
        {/* Tablet Top Banner (468x60) */}
        <div className="hidden md:flex lg:hidden justify-center mb-6">
          <AdBanner keyId="3d687f838f7b1a2353a56d39e059e906" width={468} height={60} />
        </div>
        
        {/* Main Game Area with Sidebars */}
        <div className="flex-1 container-wide flex items-start justify-center gap-6">
          {/* Desktop Left Skyscraper (160x600) */}
          <div className="hidden lg:block w-[160px] flex-shrink-0">
            <AdBanner keyId="f2411eb715b2fe1af0fafb73c5825345" width={160} height={600} className="sticky top-28 shadow-2xl" />
          </div>

          {/* Game Canvas Container */}
          <div className="flex-1 w-full max-w-[1200px] flex flex-col items-center">
            
            {/* The Game */}
            <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl bg-ink-950 flex justify-center">
              <PhaserGame mode="solitaire" />
            </div>
            
            {/* Below Game Area */}
            <div className="w-full mt-8 flex flex-col items-center gap-8">
              {/* Desktop Bottom Leaderboard (728x90) */}
              <div className="hidden xl:flex justify-center w-full">
                <AdBanner keyId="759777117285af8156ae217ed7fc2a0b" width={728} height={90} />
              </div>
              
              {/* Tablet Bottom Rectangle (300x250) */}
              <div className="hidden md:flex xl:hidden justify-center w-full">
                <AdBanner keyId="933dafe9ee5494fdc3ed74bb4ad047a6" width={300} height={250} />
              </div>

              {/* Native Banner for all devices below content */}
              <div className="w-full max-w-[800px]">
                <NativeBanner />
              </div>
            </div>
          </div>

          {/* Desktop Right Skyscraper (160x600 or 160x300 fallback) */}
          <div className="hidden xl:block w-[160px] flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-6">
              <AdBanner keyId="f2411eb715b2fe1af0fafb73c5825345" width={160} height={600} className="shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
