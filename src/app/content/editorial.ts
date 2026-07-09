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
    description: 'Compare Hong Kong Mahjong, Japanese Riichi, Chinese Official MCR, American Mahjongg, and Taiwanese Mahjong.',
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
        heading: 'Five important variants',
        paragraphs: [
          'Hong Kong Mahjong is a direct social introduction with fan-based scoring. Japanese Riichi adds yaku requirements, riichi declarations, dora, furiten, and detailed defensive play. Chinese Official or MCR uses a broad list of standardized patterns and an eight-point minimum.',
          'American Mahjongg uses jokers, racks, a Charleston pass, and an annually changing card of legal hands. Taiwanese Mahjong commonly uses sixteen tiles between turns, producing five melds and a pair in the finished hand.',
        ],
      },
      {
        heading: 'Which variant should you learn?',
        paragraphs: [
          'Choose Hong Kong for an approachable family-table style, Riichi for deep competitive defense, MCR for pattern variety, American Mahjongg for social card-driven play, or Taiwanese Mahjong for a larger and faster hand structure. Learning one variant makes the tile vocabulary of the others much easier.',
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
        'The familiar numbered suits, winds, dragons, draw-and-discard turn, and four-player table remain at the center. What changes is the value system and the strategic meaning of calls, concealed play, and risk.',
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
  'mahjong-tiles': {
    title: 'Mahjong Tiles Guide: Suits, Honors and Flowers',
    metaTitle: 'Mahjong Tiles Guide: Suits, Honors and Flowers',
    description: 'Learn to recognize all 144 Mahjong tiles, including the dot, bamboo, and character suits, winds, dragons, and optional season/flower tiles.',
    canonical: '/learn/mahjong-tiles',
    summary: 'A standard Mahjong set contains 144 tiles representing three suits, honor groups (winds and dragons), and optional flower and season bonus tiles. Learning to recognize these tiles is the first step toward mastering the game.',
    sections: [
      {
        heading: 'The Three Suited Tile Groups',
        paragraphs: [
          'The majority of tiles in a Mahjong set belong to the three suits: Dots (Tong), Bamboos (Tiao), and Characters (Wan). Each suit has ranks numbered 1 through 9, with 4 copies of each tile, totaling 108 suited tiles.',
          'Dots represent circular copper coins. Bamboos represent stalks of bamboo (with the 1 of Bamboos usually depicted as a bird). Characters display the traditional Chinese character for ten thousand (Wan) beneath the number symbol.'
        ]
      },
      {
        heading: 'Honors: Winds and Dragons',
        paragraphs: [
          'Honor tiles do not have numeric ranks. There are four Winds (East, South, West, and North) and three Dragons (Red, Green, and White). With 4 copies of each, honors total 28 tiles.',
          'Winds represent the four directions and are crucial for determining seating and round scoring. Dragons represent three traditional concepts: Red (beauty/success), Green (wealth/prosperity), and White (purity/filial piety).'
        ]
      },
      {
        heading: 'Bonus Tiles: Flowers and Seasons',
        paragraphs: [
          'Many Mahjong variants include four optional Flower tiles and four Season tiles (totaling 8 tiles). These are generally treated as bonus cards: when drawn, they are immediately declared, set aside, and a replacement tile is drawn from the back of the wall.'
        ]
      }
    ],
    faqs: [
      { question: 'How many tiles are in a standard Mahjong set?', answer: 'A standard set has 144 tiles: 108 suited tiles, 28 honors, and 8 flower/season tiles.' },
      { question: 'What does the bird tile represent?', answer: 'The bird tile represents the 1 of Bamboos suit. It is decorated as a sparrow, peacock, or crane in most standard sets.' }
    ]
  },
  'how-to-win-mahjong': {
    title: 'How to Win Mahjong: Complete Winning Hand Rules',
    metaTitle: 'How to Win Mahjong: Complete Winning Hand Rules',
    description: 'Understand the basic four-meld and one-pair winning hand structure, hand validation, and special winning hands in traditional Mahjong.',
    canonical: '/learn/how-to-win-mahjong',
    summary: 'To win a standard Mahjong hand, a player must be the first to build a legal complete hand of 14 tiles, consisting of four melds (sets) and one pair (eyes). Understanding this structure is core to hand-building strategy.',
    sections: [
      {
        heading: 'The Standard 14-Tile Hand Structure',
        paragraphs: [
          'A complete winning hand contains exactly 14 tiles. When it is not your turn, you hold 13 tiles. When you draw a tile (or claim a discarded tile for a win), your hand size becomes 14. If these 14 tiles form four sets (melds) of three tiles each and one matching pair, you have a winning hand.',
          'Melds can consist of: Chows (three consecutive suited tiles), Pungs (three identical tiles), or Kongs (four identical tiles, which requires drawing an extra replacement tile to maintain the 13-tile hand count).'
        ]
      },
      {
        heading: 'Meld Types: Chow, Pung, and Kong',
        paragraphs: [
          'Chow (Chi): A run of three consecutive tiles of the same suit (e.g., 4, 5, 6 of Bamboos). You can only claim a discarded tile for a Chow from the player to your immediate left.',
          'Pung (Peng): Three identical tiles (e.g., three Red Dragons). You can claim a discard for a Pung from any player at the table.',
          'Kong (Gang): Four identical tiles. If you claim a discard or hold all four in your hand, you must declare it, lay them down, and draw a tile from the dead wall.'
        ]
      },
      {
        heading: 'The Eyes (Matching Pair)',
        paragraphs: [
          'The final component of any winning hand is a pair of identical tiles, often called the "eyes". Any tile can form the eyes, including suited tiles, winds, or dragons. You cannot win a hand without completing the pair.'
        ]
      }
    ],
    faqs: [
      { question: 'Can I win with a discarded tile?', answer: 'Yes, if any opponent discards your winning tile (completing your fourth meld or eyes), you can claim it for a win (Ron/Hu).' },
      { question: 'What is a self-drawn win?', answer: 'If you draw the winning tile yourself from the wall, you declare a self-drawn win (Tsumo), and all three opponents must pay you.' }
    ]
  },
  'mahjong-scoring-basics': {
    title: 'Mahjong Scoring Basics: Points, Fan and Yaku',
    metaTitle: 'Mahjong Scoring Basics: Points, Fan and Yaku',
    description: 'Learn how Mahjong hands are scored across variants. Compare Cantonese fan, Japanese yaku/han/fu, and standardized MCR points.',
    canonical: '/learn/mahjong-scoring-basics',
    summary: 'Scoring in Mahjong varies heavily by variant, but all methods assign points based on hand patterns, hand complexity, and method of winning (discard vs self-draw).',
    sections: [
      {
        heading: 'Scoring Principles Across Variants',
        paragraphs: [
          'While a legal hand is almost always four melds and a pair, the way its value is calculated differs. Some variants use simple additive points, while others use exponential multipliers (doubles or fan).',
          'In Cantonese Hong Kong Mahjong, you count "Fan" (doubles) based on patterns. In Japanese Riichi, you evaluate "Han" (yaku patterns) and "Fu" (mini-points) to compute a final score. In Chinese Official MCR, you sum points from 81 defined patterns.'
        ]
      },
      {
        heading: 'Common Scoring Patterns',
        paragraphs: [
          'All Chows: A hand consisting entirely of runs and a pair. Usually worth minimal points but easy to complete.',
          'All Pungs: A hand with no runs, only sets of three identical tiles. Worth significant points.',
          'Half Flush: A hand built using tiles of a single suit combined with honors (winds/dragons).',
          'Full Flush: A hand consisting entirely of tiles from a single suit with no honors. Very high value.'
        ]
      }
    ],
    faqs: [
      { question: 'What is a limit hand?', answer: 'A limit hand (yakuman in Japanese, maximum fan in Cantonese) is the highest possible hand value, awarded for extremely rare layouts.' },
      { question: 'Why does self-drawing pay more?', answer: 'When you draw the winning tile yourself, all players pay you. When you win on a discard, the player who discarded the tile typically pays the full amount.' }
    ]
  },
  'common-mistakes': {
    title: 'Common Beginner Mahjong Mistakes and How to Avoid Them',
    metaTitle: 'Common Beginner Mahjong Mistakes and How to Avoid Them',
    description: 'Avoid typical beginner mistakes like calling too early, failing to defend, missing furiten, discarding safe tiles, or breaking hand structure.',
    canonical: '/learn/common-mistakes',
    summary: 'New players often make classic mistakes that lead to lost rounds or penalties. Learning simple defensive habits and hand-building hygiene will quickly improve your play.',
    sections: [
      {
        heading: 'Mistake 1: Calling Discards Too Early',
        paragraphs: [
          'Beginners love to shout "Pung" or "Chi" on every available discard. Opening your hand (revealing melds on the table) makes your hand public, limits your flexibility, and reduces its final score value in variants like Riichi where concealed hands are worth more.',
          'Strategy: Try to keep your hand concealed for the first 5-6 turns unless you are close to completion or calling a high-value honor set.'
        ]
      },
      {
        heading: 'Mistake 2: Ignoring Opponent Discards',
        paragraphs: [
          'Many novices only focus on their own tiles, treating Mahjong like a solo puzzle. You must watch what others discard. If a player is discarding only one suit, they are likely building a flush. If they declare readiness, do not discard tiles they might need.',
          'Strategy: Pay attention to safe discards. If a player just discarded a tile, discarding that same tile immediately is 100% safe (they cannot claim it on the same turn).'
        ]
      },
      {
        heading: 'Mistake 3: Breaking the 14-Tile Count',
        paragraphs: [
          'Ensure you always have the correct number of tiles. If you forget to draw a replacement tile after declaring a Kong, you will have too few tiles (Short Hand) and be disqualified from winning that round.',
          'Strategy: Double-check your tile count. Between turns, you must have exactly 13 tiles (excluding laid-down Kongs).'
        ]
      }
    ],
    faqs: [
      { question: 'What happens if I make a false claim?', answer: 'Making a false claim (shouting win on a tile you cannot legally use) usually results in a penalty fee paid to the other players (Chombo).' },
      { question: 'What is furiten in Japanese Mahjong?', answer: 'It is a state where you cannot win on a discard because you have previously discarded a tile that could complete your hand. You must win by self-draw instead.' }
    ]
  },
  'glossary': {
    title: 'Mahjong Glossary: Terms, Definitions and Slang',
    metaTitle: 'Mahjong Glossary: Terms, Definitions and Slang',
    description: 'Reference sheet for traditional Mahjong terminology, including chi, pung, kong, meld, discard, wall, shanten, tenpai, and mahjongg.',
    canonical: '/learn/glossary',
    summary: 'Familiarize yourself with the traditional language of Mahjong. This glossary contains key terms, tile designations, call types, and table slang.',
    sections: [
      {
        heading: 'Meld & Action Calls',
        paragraphs: [
          'Chow (Chi): Calling a discard to complete a sequence of three suited tiles.',
          'Pung (Peng): Calling a discard to complete a set of three identical tiles.',
          'Kong (Gang): Declaring a set of four identical tiles.',
          'Mahjong (Hu/Ron): Declaring a win on an opponent\'s discard.'
        ]
      },
      {
        heading: 'Hand States',
        paragraphs: [
          'Concealed: A hand that has not used any opponent discards (no open melds on the table).',
          'Tenpai: A ready hand that is exactly one tile away from a legal win.',
          'Shanten: A measure of how many steps your hand is from tenpai. If you need 3 tiles to get ready, you are 3-shanten.'
        ]
      },
      {
        heading: 'Game Components',
        paragraphs: [
          'Wall: The square stack of face-down tiles from which players draw.',
          'Dead Wall: A reserved section of tiles at the end of the wall, used for drawing replacement tiles after Kongs or bonus tiles.'
        ]
      }
    ],
    faqs: [
      { question: 'What is the difference between Hu and Ron?', answer: 'Both mean declaring a win on a discard, with Ron being the Japanese term and Hu being the Chinese term.' },
      { question: 'What does Tsumo mean?', answer: 'Tsumo is the Japanese term for winning on a self-drawn tile.' }
    ]
  },
  'about': {
    title: 'About Nine Gates Mahjong',
    metaTitle: 'About Nine Gates Mahjong',
    description: 'Read the story behind Nine Gates Mahjong, our mission to build the definitive browser-playable portal, and our dedication to tile games.',
    canonical: '/about',
    summary: 'Nine Gates Mahjong is a dedicated online portal built by tile game enthusiasts for players around the world. We offer high-fidelity browser games, rules trainers, and guides.',
    sections: [
      {
        heading: 'Our Mission',
        paragraphs: [
          'We believe Mahjong is one of the greatest strategy games ever created. Our mission is to build the definitive browser-playable portal for both single-player puzzles and traditional table rules.',
          'Our platform features state-of-the-art vector rendering for high-fidelity tile designs, smooth animations, and responsive controls across all devices. Best of all, everything is 100% free with no registration required.'
        ]
      },
      {
        heading: 'Why "Nine Gates"?',
        paragraphs: [
          'The name "Nine Gates" (Jiu Lian Bao Deng) is a tribute to one of the rarest, most beautiful, and legendary winning hands in traditional Mahjong. It consists of a specific sequence of suited tiles (1-1-1-2-3-4-5-6-7-8-9-9-9 plus any matching tile of the same suit).'
        ]
      }
    ],
    faqs: [
      { question: 'Who built this site?', answer: 'Nine Gates Mahjong was created by a global team of developers, designers, and Mahjong players dedicated to preserving tile game culture.' },
      { question: 'Is the multiplayer real-time?', answer: 'Yes, our multiplayer lobby utilizes secure WebSockets to connect players for real-time play with hidden hand privacy.' }
    ]
  },
  'contact': {
    title: 'Contact Nine Gates Mahjong',
    metaTitle: 'Contact Nine Gates Mahjong',
    description: 'Get in touch with Nine Gates Mahjong for support, bug reports, feature requests, business inquiries, or general feedback.',
    canonical: '/contact',
    summary: 'We appreciate your support and value your feedback. Contact us with any comments, bugs, or feature suggestions.',
    sections: [
      {
        heading: 'How to Reach Us',
        paragraphs: [
          'For support, gameplay feedback, or bug reports, please email us directly at support@ninegatesmahjong.com.',
          'Alternatively, you can open an issue or pull request directly on our GitHub repository if you are a developer looking to contribute.'
        ]
      }
    ],
    faqs: [
      { question: 'How do I report a bug?', answer: 'Please send an email to support@ninegatesmahjong.com with details about your device, browser, and the steps to reproduce the issue.' },
      { question: 'Are you open to business partnerships?', answer: 'Yes, for media, advertising, or licensing inquiries, please contact us at business@ninegatesmahjong.com.' }
    ]
  }
});
