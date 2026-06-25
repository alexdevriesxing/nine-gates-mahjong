import SEOHead from '../components/SEOHead';

export default function HistoryPage() {
  return (
    <>
      <SEOHead
        title="The History of Mahjong | Origins, Culture and Gambling"
        description="Explore Mahjong’s late-Qing origins, global spread, role in Asian and diaspora communities, regional variants, and historical relationship with gambling."
        canonical="https://ninegatesmahjong.com/history"
      />
      <main className="history-page">
        <header>
          <p className="game-eyebrow">The sparrow tiles across time</p>
          <h1>The History of Mahjong</h1>
          <p>From nineteenth-century China to family tables, clubs, competitions, and online play around the world.</p>
        </header>
        <section className="history-timeline">
          <article><time>Mid–late 1800s</time><h2>Emergence in China</h2><p>The exact inventor is unknown. Surviving evidence places the game’s development in nineteenth-century China, probably evolving from money-suited draw-and-discard card games before taking its familiar tile form.</p></article>
          <article><time>Late Qing era</time><h2>Rapid regional spread</h2><p>Mahjong became a social and commercial game in cities and ports. Local rules developed as players carried it between communities, producing the deep regional variety still seen today.</p></article>
          <article><time>Early 1900s</time><h2>Japan and wider Asia</h2><p>The game spread through East and Southeast Asia. Japanese, Taiwanese, Vietnamese, Korean, and other local traditions adapted the tiles, scoring, hand size, and competitive conventions.</p></article>
          <article><time>1920s</time><h2>A global craze</h2><p>Mahjong sets and simplified rulebooks reached Europe and North America. Marketing often exoticized China, but the game also became a durable connection to heritage for Chinese diaspora communities.</p></article>
          <article><time>1930s–1950s</time><h2>American Mahjongg communities</h2><p>American rules developed around jokers, the Charleston, and standardized hand cards. Mahjongg became especially important as a social institution among many Jewish-American women and families.</p></article>
          <article><time>Today</time><h2>Social game and mind sport</h2><p>Mahjong remains a family ritual, neighborhood pastime, club activity, competitive mind sport, and online game. Riichi leagues, MCR events, American groups, and countless house tables all preserve different parts of its living culture.</p></article>
        </section>
        <section className="history-essay">
          <h2>Mahjong in Asian cultures</h2>
          <p>The clatter of shuffled tiles is strongly associated with gathering. Mahjong creates a table where generations talk, teach, argue, celebrate holidays, and maintain relationships. In different places it can be a casual household game, a teahouse pastime, a serious club competition, or a marker of regional identity.</p>
          <p>Its cultural history is not uniformly celebratory. Authorities have sometimes criticized or restricted Mahjong because of associations with idleness, smoking, corruption, or gambling. At other times it has been promoted as recreation, mathematics, memory training, or organized competition. Those tensions are part of the history rather than a simple side note.</p>
          <h2>Mahjong and gambling</h2>
          <p>Real-life groups often attach money or counters to hand results, and Mahjong historically developed in environments where wagering was common. The combination of skill, incomplete information, and random draws makes it attractive for stakes. Gambling laws and cultural attitudes vary substantially by country and region.</p>
          <p><strong>Nine Gates Mahjong does not offer real-money betting, deposits, cash prizes, or wagering.</strong> Scores, ratings, tournaments, and coins on this site are game progression only. This history section acknowledges real-world gambling without encouraging it.</p>
          <h2>What historians can say with confidence</h2>
          <p>Claims that Confucius invented Mahjong are folklore, not established history. The strongest evidence points to nineteenth-century China and earlier card-game ancestors. The exact place and individual inventor remain debated, which is why responsible histories describe an emergence rather than a single proven creation moment.</p>
        </section>
      </main>
    </>
  );
}
