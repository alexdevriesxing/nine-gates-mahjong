import GamePageFrame from '../components/GamePageFrame';
import RealMahjongGame from '../../game/react/RealMahjongGame';

export default function RealMahjongPage() {
  return (
    <GamePageFrame
      title="Real Mahjong Training vs AI Online | Nine Gates Mahjong"
      description="Practice a simplified four-seat Mahjong draw-and-discard hand against three AI personalities. Learn turn rhythm, table reading and standard hand shape."
      canonical="/real-mahjong"
    >
      <RealMahjongGame />
      <article className="game-seo-card">
        <h2>Practice the draw-and-discard rhythm of four-player Mahjong</h2>
        <p>
          Unlike Mahjongg Solitaire, traditional Mahjong is a four-player draw-and-discard game. Each player builds
          a legal hand while watching the table’s discards. This training table uses a 136-tile wall, concealed
          opponent hands, AI discard choices, turn order and standard four-melds-plus-a-pair hand validation.
        </p>
        <p>
          This is a learning mode rather than a complete regional rules engine. Calls such as Chi, Pung and Kong,
          full regional scoring, dealer continuation, penalties and tournament edge cases are not yet simulated.
          Use the dedicated guided variant pages to explore selected Hong Kong, Riichi, MCR, American and Taiwanese concepts.
        </p>
      </article>
    </GamePageFrame>
  );
}
