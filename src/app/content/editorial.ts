export interface EditorialSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface EditorialEntry {
  title: string;
  metaTitle: string;
  description: string;
  canonical: string;
  summary: string;
  sections: EditorialSection[];
  faqs: Array<{ question: string; answer: string }>;
}

export const EDITORIAL: Record<string, EditorialEntry> = {
  'mahjong-vs-mahjongg': {
    title: 'Mahjong vs Mahjongg: What Is the Difference?',
    metaTitle: 'Mahjong vs Mahjongg: Real Mahjong and Solitaire Explained',
    description: 'Learn the clear difference between four-player Mahjong, Mahjongg Solitaire, American Mahjongg, and the spellings players see online.',
    canonical: '/learn/mahjong-vs-mahjongg',
    summary: 'Mahjong usually means the traditional four-player draw-and-discard game. Mahjongg often refers to American Mahjongg or to the one-player matching puzzle called Mahjongg Solitaire.',
    sections: [
      {
        heading: 'Mahjong is a four-player strategy game',
        paragraphs: [
          'Traditional Mahjong is played by four people around a table. Players draw and discard tiles while building a legal hand, usually four groups and one pair. The exact scoring rules vary by region, but reading discards, managing risk, and improving the shape of your hand are central to every major form.',
          'Hong Kong Mahjong, Japanese Riichi, Chinese Official or MCR, and Taiwanese Mahjong all belong to this family. They share a common tile set and turn structure while differing in winning requirements, special declarations, and scoring.',
        ],
      },
      {
        heading: 'Mahjongg Solitaire is a matching puzzle',
        paragraphs: [
          'Mahjongg Solitaire uses Mahjong-style tiles but is normally a one-player puzzle. The tiles begin in a layered layout. You remove identical free pairs until the board is empty. A free tile has no tile covering it and has an open left or right side.',
          'The puzzle does not use drawing, discarding, meld calls, or four-player scoring. Its appeal comes from visual scanning, planning, and avoiding blocked pairs.',
        ],
      },
      {
        heading: 'Why the extra g appears',
        paragraphs: [
          'The spelling “Mah-Jongg” became strongly associated with organized American play. Online game sites also adopted “Mahjongg” to distinguish solitaire matching games from traditional table Mahjong. There is no universal spelling rule, so context matters more than the number of letters.',
        ],
      },
    ],
    faqs: [
      { question: 'Is Mahjongg Solitaire real Mahjong?', answer: 'It uses Mahjong tile imagery, but its rules are a separate one-player matching puzzle rather than the traditional four-player game.' },
      { question: 'Is American Mahjongg the same as Mahjongg Solitaire?', answer: 'No. American Mahjongg is a four-player game using jokers, a Charleston pass, and an annually published hand card.' },
    ],
  },
  'how-to-play-mahjongg-solitaire': {
    title: 'How to Play Mahjongg Solitaire',
    metaTitle: 'How to Play Mahjongg Solitaire: Rules and Strategy',
    description: 'Learn Mahjongg Solitaire rules, free-tile logic, matching, hints, shuffles, and practical strategy for clearing layered boards.',
    canonical: '/learn/how-to-play-mahjongg-solitaire',
    summary: 'Remove identical pairs of free tiles. A tile is free when no tile is on top of it and at least one long side is open.',
    sections: [
      {
        heading: 'The objective',
        paragraphs: [
          'Your goal is to remove every tile from the layout. Select one free tile and then an identical free partner. A successful pair disappears and can expose tiles below or open the side of neighboring tiles.',
          'Most layouts contain duplicate faces in sets of four. Removing the first available pair is not always best because the remaining copies may become trapped behind each other.',
        ],
      },
      {
        heading: 'How to identify a free tile',
        paragraphs: [
          'A tile cannot be selected if another tile overlaps it from a higher layer. It also needs an open left or right side. Tiles at the outer ends of rows are often available, while tiles in the middle remain locked until one side is cleared.',
        ],
        bullets: [
          'Prioritize high tiles that cover several lower tiles.',
          'Open long rows from both ends instead of stripping one side only.',
          'Compare all four copies before committing to a pair.',
          'Use a hint to reveal a legal pair, not as proof that the pair is strategically best.',
        ],
      },
      {
        heading: 'When a board becomes stuck',
        paragraphs: [
          'A board is stuck when no legal matching pair remains. A shuffle rearranges the faces on remaining positions while preserving the current shape. An undo can be more useful when the previous pair caused the dead end. Nine Gates generates its main layered boards from a removable pair sequence, so every fresh board begins with a solution.',
        ],
      },
    ],
    faqs: [
      { question: 'Can every Mahjongg Solitaire board be solved?', answer: 'Not every randomly shuffled board is solvable. A generator can guarantee a solution by assigning pairs in reverse removal order.' },
      { question: 'Do flowers and seasons have to match exactly?', answer: 'Traditional solitaire rules often allow any flower to match another flower and any season to match another season. Nine Gates currently uses exact matches in its core boards.' },
    ],
  },
  'how-to-play-real-mahjong': {
    title: 'How to Play Real Mahjong',
    metaTitle: 'How to Play Mahjong: Beginner Four-Player Guide',
    description: 'Learn the basic turn, hand structure, draw and discard flow, melds, winning, and table awareness used in real four-player Mahjong.',
    canonical: '/learn/how-to-play-real-mahjong',
    summary: 'On each turn, draw one tile and discard one tile. Build a legal winning hand before the other three players.',
    sections: [
      {
        heading: 'The basic hand',
        paragraphs: [
          'A common winning structure contains fourteen tiles arranged as four groups and one pair. A group can be a sequence of three suited tiles, a triplet of identical tiles, or a four-tile kong. Honor tiles—winds and dragons—cannot form sequences.',
          'Players normally hold thirteen tiles between turns. The active player draws a fourteenth tile, checks whether the hand wins, and otherwise discards one tile.',
        ],
      },
      {
        heading: 'The flow of a turn',
        paragraphs: [
          'Play moves around the table from East to South, West, and North. After a discard, another player may sometimes claim that tile for a legal meld. The exact call priority and restrictions depend on the variant.',
        ],
        bullets: [
          'Draw from the wall.',
          'Evaluate whether the hand is complete.',
          'Choose a discard that improves shape while limiting danger.',
          'Watch every discard because it reveals what tiles are becoming safer or scarcer.',
        ],
      },
      {
        heading: 'Learning without memorizing every score',
        paragraphs: [
          'Beginners should first learn tile recognition, sequences, triplets, pairs, and turn order. Scoring can be added one pattern at a time. Riichi requires at least one yaku; MCR requires a minimum point value; Hong Kong tables often use a minimum fan requirement. The shared foundation remains draw, improve, discard, and read the table.',
        ],
      },
    ],
    faqs: [
      { question: 'How many tiles does a Mahjong player hold?', answer: 'Usually thirteen between turns and fourteen immediately after drawing. Taiwanese Mahjong commonly uses a larger sixteen-tile hand structure.' },
      { question: 'Can Mahjong be played with two people?', answer: 'Training variants exist, but the standard strategic game is designed for four players.' },
    ],
  },
  'chi-pung-kong': {
    title: 'Chi, Pung, and Kong Explained',
    metaTitle: 'Chi, Pung, Kong: Mahjong Melds Explained Clearly',
    description: 'Understand chi sequences, pung triplets, kong quads, claim restrictions, exposed melds, and how calls change a Mahjong hand.',
    canonical: '/learn/chi-pung-kong',
    summary: 'Chi is a suited sequence, pung is a triplet, and kong is a four-of-a-kind. Calling a discard usually exposes the group and changes how the hand can score.',
    sections: [
      {
        heading: 'Chi: a sequence of three',
        paragraphs: [
          'A chi contains three consecutive numbers from one suit, such as 3-4-5 bamboo. Winds and dragons cannot form a chi. In many variants, only the player immediately before you in turn order can provide a discarded tile for your chi.',
          'Calling chi can improve speed, but exposing a sequence may narrow your scoring options and reveal the direction of your hand.',
        ],
      },
      {
        heading: 'Pung: three identical tiles',
        paragraphs: [
          'A pung contains three copies of the same tile. A player can usually call pung from any opponent’s discard, subject to call priority. Pungs of dragons, the round wind, or the player’s seat wind can be especially valuable.',
        ],
      },
      {
        heading: 'Kong: four identical tiles',
        paragraphs: [
          'A kong uses all four copies of a tile. Because a four-tile group still counts as one meld, the player normally draws a replacement tile. Rules distinguish concealed kongs, open kongs claimed from a discard, and added kongs formed by upgrading an exposed pung.',
          'Declaring a kong can increase value but also reveals information. In Riichi it can change dora indicators and can be restricted when it would alter a declared wait.',
        ],
      },
    ],
    faqs: [
      { question: 'Can honor tiles form a chi?', answer: 'No. Winds and dragons can form pairs, pungs, and kongs, but never numerical sequences.' },
      { question: 'Is it always good to call a meld?', answer: 'No. Calls make the hand faster but expose information and may remove access to concealed-hand scoring patterns.' },
    ],
  },
  'beginner-strategy': {
    title: 'Beginner Mahjong Strategy',
    metaTitle: 'Beginner Mahjong Strategy: Improve Hands and Discards',
    description: 'Learn practical beginner Mahjong strategy for tile efficiency, pairs, shapes, safe discards, calls, and reading the table.',
    canonical: '/learn/beginner-strategy',
    summary: 'Keep flexible connected shapes, discard isolated tiles, and balance hand speed against the danger shown by the table.',
    sections: [
      {
        heading: 'Build flexible shapes',
        paragraphs: [
          'Connected tiles are more useful than isolated tiles. A shape such as 3-4 can accept either 2 or 5, while a lone 1 has fewer ways to improve. Middle numbers generally connect more easily than terminals because they participate in more possible sequences.',
          'Do not collect too many pairs automatically. One pair is required, and extra pairs can become triplets, but a hand full of disconnected pairs may improve slowly unless the rules reward seven pairs.',
        ],
      },
      {
        heading: 'Choose discards with a plan',
        paragraphs: [
          'Early in a hand, discard isolated honors and terminals that do not support a scoring direction. Later, table safety becomes more important. A tile already discarded by the player you fear is often safer against that player, although safety concepts differ by variant.',
        ],
        bullets: [
          'Count useful tiles, not only completed groups.',
          'Keep two-sided waits when possible.',
          'Avoid calls that leave no valid scoring route.',
          'Reassess after every draw instead of following the opening plan blindly.',
        ],
      },
      {
        heading: 'Watch the table',
        paragraphs: [
          'Discards show which suits and numbers opponents may not need. Calls reveal even more. If a player exposes several groups quickly, the hand may be close to completion. A good player sometimes gives up a small chance to win in order to avoid dealing into an expensive hand.',
        ],
      },
    ],
    faqs: [
      { question: 'What should a beginner discard first?', answer: 'Usually an isolated honor or terminal that does not connect to the rest of the hand, unless it supports a valuable scoring pattern.' },
      { question: 'Should I call every pung?', answer: 'No. Call only when the speed or value gained is worth exposing the hand and losing concealed options.' },
    ],
  },
  'mahjong-variants': {
    title: 'Mahjong Variants Around the World',
    metaTitle: 'Mahjong Variants Guide: Hong Kong, Riichi, MCR and More',
    description: 'Compare Hong Kong, Riichi, MCR, American, Taiwanese, Sichuan Bloody Rules, and Zung Jung Mahjong.',
    canonical: '/learn/mahjong-variants',
    summary: 'Major Mahjong variants share the tile set and draw-discard rhythm but differ in hand size, calls, minimum winning requirements, and scoring.',
    sections: [
      {
        heading: 'A shared game with regional rules',
        paragraphs: [
          'Most forms use three numbered suits, winds, and dragons. Four players build a hand while drawing from a wall and discarding to a shared table. The largest differences appear in what makes a hand legal, how points are counted, and which strategic risks matter most.',
        ],
      },
      {
        heading: 'Seven important variants',
        paragraphs: [
          'Hong Kong Mahjong is a direct social introduction with fan-based scoring. Japanese Riichi adds yaku requirements, riichi declarations, dora, furiten, and detailed defensive play. Chinese Official or MCR uses a broad list of standardized patterns and an eight-point minimum.',
          'American Mahjongg uses jokers, racks, a Charleston pass, and an annually changing card of legal hands. Taiwanese Mahjong commonly uses sixteen tiles between turns, producing five melds and a pair in the finished hand.',
          'Sichuan Bloody Rules removes honors, forces a missing-suit declaration, and continues after the first win. Zung Jung keeps the familiar hand flow and applies a balanced additive pattern-scoring system.',
        ],
      },
      {
        heading: 'Which variant should you learn?',
        paragraphs: [
          'Choose Hong Kong for an approachable family-table style, Riichi for deep competitive defense, MCR for pattern variety, American Mahjongg for social card-driven play, Taiwanese for a larger hand, Sichuan for forced suit strategy, or Zung Jung for transparent additive scoring. Learning one variant makes the tile vocabulary of the others much easier.',
        ],
      },
    ],
    faqs: [
      { question: 'Which Mahjong variant is easiest for beginners?', answer: 'Hong Kong-style rules are often the most direct introduction, although the best choice is the version played by people available to teach you.' },
      { question: 'Are Riichi and Chinese Mahjong the same?', answer: 'They share ancestry and core mechanics, but Riichi has its own yaku, dora, furiten, declarations, and scoring system.' },
    ],
  },
};

const variant = (
  slug: string,
  title: string,
  region: string,
  description: string,
  summary: string,
  differences: string[],
  faq: Array<{ question: string; answer: string }>
): EditorialEntry => ({
  title,
  metaTitle: `${title}: Rules, Style and Online Play`,
  description,
  canonical: `/real-mahjong/${slug}`,
  summary,
  sections: [
    {
      heading: `${region} style at a glance`,
      paragraphs: [
        summary,
        'The familiar draw-and-discard turn, set building, and four-player table remain at the center. What changes is the tile mix, value system, and strategic meaning of calls, concealed play, and risk.',
      ],
    },
    {
      heading: 'Key rule characteristics',
      paragraphs: ['House rules and tournament rules can differ, so players should confirm the exact scoring table before a match. These are the defining features most learners encounter:'],
      bullets: differences,
    },
    {
      heading: 'Who should play it?',
      paragraphs: [
        'This variant rewards players who enjoy its particular balance of speed, calculation, and table reading. Start by learning legal hand structure and the most common scoring patterns. Add edge cases only after the turn rhythm feels natural.',
        "The interactive trainer above applies this variant's hand size, opening flow, readiness target, and defining rule focus. It is a guided learning table rather than a substitute for the complete regional tournament rulebook.",
      ],
    },
  ],
  faqs: faq,
});

Object.assign(EDITORIAL, {
  'hong-kong': variant(
    'hong-kong',
    'Hong Kong Mahjong',
    'Hong Kong and Cantonese',
    'Learn Hong Kong Mahjong rules, fan scoring, common hands, table style, and how this fast social variant differs from Riichi and MCR.',
    'Hong Kong Mahjong is a fast, social four-player variant with relatively direct fan-based scoring and flexible hand development.',
    ['Four melds and a pair form the common hand structure.', 'Fan or faan determine whether a hand meets the table minimum and how much it pays.', 'Flower and season bonuses are common in many rulesets.', 'Calls are frequent, making speed and visible information important.'],
    [
      { question: 'Is Hong Kong Mahjong good for beginners?', answer: 'Yes. Its basic turn and common scoring patterns provide a direct introduction to real Mahjong.' },
      { question: 'How many fan are needed to win?', answer: 'The minimum is a house rule. Three fan is common, but tables may use one, three, or another threshold.' },
    ]
  ),
  riichi: variant(
    'riichi',
    'Japanese Riichi Mahjong',
    'Japanese competitive',
    'Learn Japanese Riichi Mahjong, including yaku, riichi, dora, furiten, defensive play, and the strategic features that define the game.',
    'Riichi Mahjong is a structured competitive variant where every winning hand needs a yaku and defense is shaped by visible discards and furiten.',
    ['A legal win requires at least one yaku; dora alone is not a yaku.', 'A concealed ready hand may declare riichi by paying 1,000 points.', 'Furiten can prevent a player from winning on another player’s discard.', 'Han and fu combine to determine hand value, with limit hands at higher values.'],
    [
      { question: 'What is riichi?', answer: 'Riichi is a declaration that a concealed hand is ready to win. It locks the hand and creates additional scoring possibilities.' },
      { question: 'What is furiten?', answer: 'Furiten is a restriction that can prevent winning by discard when one of the player’s winning tiles appears in their own discard history or after passing a valid win.' },
    ]
  ),
  mcr: variant(
    'mcr',
    'Chinese Official Mahjong (MCR)',
    'International tournament',
    'Learn Mahjong Competition Rules (MCR), the international Chinese Official format with standardized patterns and an eight-point minimum.',
    'MCR is a standardized tournament ruleset built around a broad catalog of scoring patterns and a minimum of eight points to win.',
    ['The official catalog contains 81 scoring elements.', 'A winning hand must normally total at least eight points before flower points.', 'Patterns may combine, but exclusion and non-duplication principles affect scoring.', 'There is no Riichi-style furiten or dora system.'],
    [
      { question: 'What does MCR mean in Mahjong?', answer: 'MCR means Mahjong Competition Rules, an international standardized form also called Chinese Official Mahjong.' },
      { question: 'Why is MCR considered complex?', answer: 'Players evaluate many possible pattern combinations while also meeting the eight-point minimum.' },
    ]
  ),
  american: variant(
    'american',
    'American Mahjongg',
    'United States social',
    'Learn how American Mahjongg uses jokers, the Charleston pass, racks, and an annually updated card of valid hands.',
    'American Mahjongg is a four-player social variant defined by jokers, the Charleston tile exchange, and a published card listing the hands allowed that year.',
    ['Players use racks and usually include eight jokers in the set.', 'The Charleston passes groups of tiles before play.', 'The annual card defines exact legal combinations and values.', 'Jokers can substitute in many groups but are restricted in pairs and singles.'],
    [
      { question: 'Do American Mahjongg hands change every year?', answer: 'Yes. The commonly used National Mah Jongg League card is updated annually with a new list of hands.' },
      { question: 'What is the Charleston?', answer: 'It is a structured sequence of tile passes before normal drawing and discarding begins.' },
    ]
  ),
  taiwanese: variant(
    'taiwanese',
    'Taiwanese Mahjong',
    'Taiwanese sixteen-tile',
    'Learn Taiwanese Mahjong’s sixteen-tile hand, five-meld structure, fast table rhythm, and common regional scoring characteristics.',
    'Taiwanese Mahjong commonly gives each player sixteen tiles between turns, so a standard winning hand contains five melds and one pair.',
    ['Players usually hold sixteen tiles and draw a seventeenth.', 'A common complete hand uses five melds plus one pair.', 'Scoring is often counted in tai, with details varying by table.', 'The larger hand creates more connected shapes and visible calls.'],
    [
      { question: 'Why does Taiwanese Mahjong use more tiles in the hand?', answer: 'Its standard structure adds a fifth meld, producing sixteen tiles between turns and seventeen after drawing.' },
      { question: 'Are Taiwanese rules identical everywhere?', answer: 'No. House rules for tai, flowers, special hands, and payments vary, so confirm the table rules.' },
    ]
  ),
  sichuan: variant(
    'sichuan',
    'Sichuan Bloody Rules Mahjong',
    'Sichuan Blood Battle',
    'Learn Sichuan Bloody Rules Mahjong, including the 108 suited-tile set, dingque missing-suit declaration, no-chow calls, and play continuing after the first win.',
    'Sichuan Bloody Rules removes all honor tiles, requires every player to declare and clear one missing suit, and lets the remaining players continue after the first winner leaves the hand.',
    [
      'The game uses 108 suited tiles; winds and dragons are excluded.',
      'After the deal, each player declares a missing suit (dingque) and must discard that suit before other tiles.',
      'Players may call pungs and kongs, but not chows from another player’s discard.',
      'Under Blood Battle to the End, play continues until three players win or the wall is exhausted.',
    ],
    [
      { question: 'What is dingque in Sichuan Mahjong?', answer: 'Dingque is the declaration of one missing suit. A player must discard every tile of that suit and cannot win while any remain.' },
      { question: 'Why does play continue after someone wins?', answer: 'Blood Battle keeps the remaining players active, allowing up to three winners and creating separate scoring events in one hand.' },
    ]
  ),
  'zung-jung': variant(
    'zung-jung',
    'Zung Jung Mahjong',
    'International additive scoring',
    'Learn Zung Jung Mahjong’s accessible additive scoring, standard hand flow, compatible pattern combinations, and competitive World Series heritage.',
    'Zung Jung is a modern competitive scoring system designed to value recognizable Mahjong patterns with transparent additive points and relatively few special procedural rules.',
    [
      'The normal four-meld-and-a-pair structure and familiar draw-discard rhythm apply.',
      'Compatible scoring patterns add together instead of being reduced to a single best label.',
      'Only the winning hand is scored; payment details depend on the table or tournament format.',
      'The system emphasizes readable pattern values and practical competition play.',
    ],
    [
      { question: 'What does Zung Jung mean?', answer: 'The name refers to the Confucian Doctrine of the Mean and reflects the system’s goal of balanced, proportionate scoring.' },
      { question: 'Is Zung Jung the same as MCR?', answer: 'No. Both are competition-friendly systems, but they use different pattern lists, values, combination rules, and tournament procedures.' },
    ]
  ),
});
