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
  'sichuan',
  'zung-jung',
]);

const REVIEW_DATE = '2026-07-22';
const PUBLISHED_DATE = '2026-06-25T00:00:00+02:00';

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function EditorialPage({ slug }: { slug: string }) {
  const entry = EDITORIAL[slug];
  if (!entry) throw new Error(`Missing editorial entry: ${slug}`);
  const ruleset = VARIANT_RULESETS.has(slug as VariantRuleset) ? (slug as VariantRuleset) : null;
  const canonical = `https://ninegatesmahjong.com${entry.canonical}`;
  const sectionLinks = entry.sections.map((section) => ({ heading: section.heading, id: sectionId(section.heading) }));
  const wordCount = [
    entry.summary,
    ...entry.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]),
    ...entry.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(' ').trim().split(/\s+/).length;
  const routeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: entry.title,
        description: entry.description,
        mainEntityOfPage: { '@id': `${canonical}#webpage` },
        author: {
          '@type': 'Organization',
          name: 'Nine Gates Mahjong Editorial Team',
          url: 'https://ninegatesmahjong.com/about',
        },
        publisher: { '@id': 'https://ninegatesmahjong.com/#organization' },
        datePublished: PUBLISHED_DATE,
        dateModified: `${REVIEW_DATE}T00:00:00+02:00`,
        inLanguage: 'en',
        wordCount,
        articleSection: entry.sections.map((section) => section.heading),
        image: {
          '@type': 'ImageObject',
          url: 'https://ninegatesmahjong.com/hero-bg.jpg',
          width: 1916,
          height: 821,
        },
      },
      ...(ruleset ? [{
        '@type': ['VideoGame', 'WebApplication'],
        '@id': `${canonical}#application`,
        name: `${entry.title} Guided Trainer`,
        description: entry.description,
        url: canonical,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any modern web browser',
        browserRequirements: 'Requires JavaScript and a modern browser with local storage enabled.',
        gamePlatform: 'Web browser',
        playMode: 'SinglePlayer',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      }] : []),
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: entry.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <SEOHead
        title={`${entry.metaTitle} | Nine Gates Mahjong`}
        description={entry.description}
        canonical={canonical}
        ogImage="https://ninegatesmahjong.com/hero-bg.jpg"
        ogType="article"
        jsonLd={routeSchema}
        dateModified={REVIEW_DATE}
      />
      <main className="editorial-page" data-gaio-container="true">
        {ruleset && (
          <div className="editorial-page__trainer">
            <VariantMahjongTrainer ruleset={ruleset} />
          </div>
        )}
        <article>
          <nav className="mb-5 text-sm text-ink-300" aria-label="Breadcrumb">
            <Link className="text-gold hover:text-gold-light" to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link className="text-gold hover:text-gold-light" to={ruleset ? '/variants' : '/learn'}>
              {ruleset ? 'Mahjong variants' : 'Learn Mahjong'}
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{entry.title}</span>
          </nav>
          <header>
            <p className="game-eyebrow">{ruleset ? 'Guided Mahjong ruleset trainer' : 'Nine Gates Mahjong guide'}</p>
            <h1>{entry.title}</h1>
            <div className="my-6 rounded-xl border border-gold/20 bg-gold/5 p-5" data-gaio-section="quick-answer">
              <strong className="block text-gold">Quick answer</strong>
              <p className="mt-2 text-lg leading-relaxed text-ivory">{entry.summary}</p>
            </div>
            <p className="text-sm text-ink-300">
              Reviewed by the <Link to="/about">Nine Gates Mahjong Editorial Team</Link> · <time dateTime={REVIEW_DATE}>Updated July 22, 2026</time>
            </p>
            {ruleset && (
              <p className="mt-4 rounded-lg border border-vermilion/30 bg-vermilion/10 p-4 text-sm text-ink-100">
                This interactive mode is a guided training hand. It demonstrates selected concepts from the named ruleset but does not replace the complete scoring rules or tournament regulations used by an official association or event.
              </p>
            )}
          </header>
          <nav className="my-8 rounded-xl border border-gold/15 bg-ink-900/60 p-5" aria-label="On this page">
            <strong className="text-gold">On this page</strong>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {sectionLinks.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>
              ))}
              <li><a href="#frequently-asked-questions">Frequently asked questions</a></li>
            </ul>
          </nav>
          <div className="flex justify-center items-center my-6 w-full">
            <AdSlot width={728} height={90} className="hidden md:flex" />
            <AdSlot width={320} height={50} className="flex md:hidden" />
          </div>
          {entry.sections.map((section, index) => (
            <div key={section.heading}>
              <section id={sectionLinks[index].id}>
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
          <section id="frequently-asked-questions">
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
          <section className="rounded-xl border border-gold/15 bg-ink-900/50 p-5">
            <h2>Editorial scope</h2>
            <p>
              Nine Gates separates Mahjongg Solitaire from traditional four-player Mahjong and identifies when an interactive mode simplifies a regional ruleset. Rule wording can vary by association, table and tournament, so competitive players should confirm the rules used by their organizer.
            </p>
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
