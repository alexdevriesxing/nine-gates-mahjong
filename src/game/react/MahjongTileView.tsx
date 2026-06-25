import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { MahjongTileInstance } from '../MahjongCore';
import { TileRenderer } from '../TileRenderer';

interface MahjongTileViewProps {
  tile: MahjongTileInstance;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  concealed?: boolean;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export default function MahjongTileView({
  tile,
  selected = false,
  highlighted = false,
  disabled = false,
  concealed = false,
  compact = false,
  onClick,
  className = '',
  style,
}: MahjongTileViewProps) {
  const image = useMemo(
    () => TileRenderer.generateTileURI(tile.suit, tile.rank),
    [tile.suit, tile.rank]
  );
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      aria-label={concealed ? 'Concealed Mahjong tile' : tile.name}
      className={`mahjong-tile ${compact ? 'mahjong-tile--compact' : ''} ${
        selected ? 'mahjong-tile--selected' : ''
      } ${highlighted ? 'mahjong-tile--hinted' : ''} ${
        disabled ? 'mahjong-tile--disabled' : ''
      } ${concealed ? 'mahjong-tile--concealed' : ''} ${className}`}
      data-tile-key={tile.key}
      style={style}
    >
      {concealed ? (
        <span className="mahjong-tile__back" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : (
        <img src={image} alt="" draggable={false} />
      )}
    </Component>
  );
}
