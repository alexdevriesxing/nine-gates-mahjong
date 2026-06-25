import GamePageFrame from '../components/GamePageFrame';
import RealMahjongGame from '../../game/react/RealMahjongGame';

export default function RealMahjongPage() {
  return (
    <GamePageFrame
      title="Play Real Mahjong vs AI Online | Nine Gates Mahjong"
      description="Play a free four-seat Mahjong training hand against three AI personalities. Draw, sort, discard, read the table, and complete a standard winning hand."
      canonical="/real-mahjong"
    >
      <RealMahjongGame />
      <article className="game-seo-card">
        <h2>Practice real four-player Mahjong</h2>
        <p>
          Unlike Mahjongg Solitaire, real Mahjong is a four-player draw-and-discard game. Each player builds
          a hand of four melds and one pair while watching the table’s discards. This training table uses a
          complete 136-tile set, concealed opponent hands, AI discard choices, turn order, and standard hand
          validation. It is designed to teach the rhythm of drawing one tile and discarding one tile.
        </p>
      </article>
    </GamePageFrame>
  );
}
