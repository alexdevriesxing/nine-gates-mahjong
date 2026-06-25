import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import AdSlot from './AdSlot';
import NativeBanner from './NativeBanner';
import { EDITORIAL } from '../content/editorial';
import VariantMahjongTrainer, { type VariantRuleset } from '../../game/react/VariantMahjongTrainer';

const VARIANT_RULESETS = new Set<VariantRuleset>([
  'hong-kong',
  'riichi',
  'mcr',
  'american',
  'taiwanese',
]);

export default function EditorialPage({ slug }: { slug: string }) {
  const entry = EDITORIAL[slug];
  if (!entry) throw new Error(`Missing editorial entry: ${slug}`);
  const ruleset = VARIANT_RULESETS.has(slug as VariantRuleset) ? (slug as VariantRuleset) : null;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <SEOHead
        title={`${entry.metaTitle} | Nine Gates Mahjong`}
        description={entry.description}
        canonical={`https://ninegatesmahjong.com${entry.canonical}`}
        ogImage="https://ninegatesmahjong.com/hero-bg.jpg"
        jsonLd={faqSchema}
      />
      <main className="editorial-page" data-gaio-container="true">
        {ruleset && (
          <div className="editorial-page__trainer">
            <VariantMahjongTrainer ruleset={ruleset} />
          </div>
        )}
        <article>
          <header>
            <p className="game-eyebrow">Nine Gates Mahjong guide</p>
            <h1>{entry.title}</h1>
            <p>{entry.summary}</p>
          </header>
          <div className="flex justify-center items-center my-6 w-full">
            <AdSlot width={728} height={90} className="hidden md:flex" />
            <AdSlot width={320} height={50} className="flex md:hidden" />
          </div>
          {entry.sections.map((section, index) => (
            <div key={section.heading}>
              <section>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
              {index === 0 && <NativeBanner />}
              {index === 2 && (
                <div className="flex justify-center items-center my-6 w-full">
                  <AdSlot width={300} height={250} />
                </div>
              )}
            </div>
          ))}
          <section>
            <h2>Frequently asked questions</h2>
            <div className="editorial-faq">
              {entry.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <nav className="editorial-links" aria-label="Continue learning">
            <Link to="/learn">Mahjong learning hub</Link>
            <Link to="/variants">Compare Mahjong variants</Link>
            <Link to="/mahjongg-solitaire">Play Mahjongg Solitaire</Link>
            <Link to="/real-mahjong">Practice real Mahjong</Link>
          </nav>
        </article>
      </main>
    </>
  );
}
