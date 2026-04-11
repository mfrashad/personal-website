import type { SpriteConfig, SpritePlacement } from '../../data/sprites';
import SpriteCharacter from './SpriteCharacter';

interface SpriteOnEdgeProps {
  placement: SpritePlacement;
  config: SpriteConfig;
}

export default function SpriteOnEdge({ placement, config }: SpriteOnEdgeProps) {
  const scale = placement.scale ?? 1;
  const offsetX = placement.offsetX ?? 0;
  const offsetY = placement.offsetY ?? 0;

  const positionStyle: React.CSSProperties = { position: 'absolute' };

  switch (placement.anchor) {
    case 'top-left':
      positionStyle.top = offsetY;
      positionStyle.left = offsetX;
      break;
    case 'top-right':
      positionStyle.top = offsetY;
      positionStyle.right = -offsetX;
      break;
    case 'top-center':
      positionStyle.top = offsetY;
      positionStyle.left = '50%';
      positionStyle.marginLeft = offsetX;
      break;
    case 'bottom-left':
      positionStyle.bottom = -offsetY;
      positionStyle.left = offsetX;
      break;
    case 'bottom-right':
      positionStyle.bottom = -offsetY;
      positionStyle.right = -offsetX;
      break;
    case 'bottom-center':
      positionStyle.bottom = -offsetY;
      positionStyle.left = '50%';
      positionStyle.marginLeft = offsetX;
      break;
  }

  const hideOnMobile = placement.hideOnMobile !== false;

  return (
    <div
      style={positionStyle}
      className={`pointer-events-auto ${hideOnMobile ? 'hidden lg:block' : ''}`}
    >
      <SpriteCharacter
        config={config}
        scale={scale}
        flipX={placement.flipX}
        zIndex={placement.zIndex ?? 50}
      />
    </div>
  );
}
