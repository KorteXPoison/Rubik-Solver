import {
  FACE_ORDER,
  FACE_LABELS,
  type StickerColor,
} from '../../core/cube-model';
import './ColorPalette.css';

interface ColorPaletteProps {
  active: StickerColor;
  onSelect: (color: StickerColor) => void;
  counts: Record<StickerColor, number>;
}

export default function ColorPalette({
  active,
  onSelect,
  counts,
}: ColorPaletteProps) {
  return (
    <div className="color-palette" role="radiogroup" aria-label="Cor a pintar">
      {FACE_ORDER.map((color) => {
        const count = counts[color];
        const over = count > 9;
        const complete = count === 9;
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={active === color}
            className={
              'color-palette__swatch' +
              (active === color ? ' color-palette__swatch--active' : '')
            }
            style={{ background: `var(--sticker-${color})` }}
            onClick={() => onSelect(color)}
            title={FACE_LABELS[color]}
          >
            <span
              className={
                'color-palette__count' +
                (over ? ' color-palette__count--over' : '') +
                (complete ? ' color-palette__count--complete' : '')
              }
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
