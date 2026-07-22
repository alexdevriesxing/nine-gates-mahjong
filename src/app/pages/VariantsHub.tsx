import SEOHead from '../components/SEOHead';
import VariantCard from '../components/VariantCard';
import { MAHJONG_VARIANTS } from '@shared/constants';

export default function VariantsHub() {
  return (
    <>
      <SEOHead
        title="Mahjong Variants | Seven Playable Regional Rule Trainers"
        description="Compare and practice Hong Kong, Riichi, MCR, American, Taiwanese, Sichuan Bloody Rules, and Zung Jung Mahjong."
        canonical="https://ninegatesmahjong.com/variants"
      />
      <main className="hub-page hub-page--variants">
        <header>
          <p className="game-eyebrow">A world of table traditions</p>
          <h1>Mahjong Variants</h1>
          <p>One family of tiles, many regional answers to what makes a hand legal, valuable, dangerous, or beautiful.</p>
        </header>
        <section className="variant-intro">
          <p><strong>Best starting point:</strong> Hong Kong Mahjong offers direct fan-based play.</p>
          <p><strong>Deepest defense:</strong> Japanese Riichi uses visible discards, yaku, furiten, and riichi declarations.</p>
          <p><strong>Broadest pattern catalog:</strong> MCR standardizes 81 scoring elements for international competition.</p>
        </section>
        <section className="hub-variant-grid">
          {MAHJONG_VARIANTS.map((variant) => <VariantCard key={variant.id} variant={variant} />)}
        </section>
      </main>
    </>
  );
}
