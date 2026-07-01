import { type FaceName, type StickerColor } from '../../core/cube-model';
import './FaceGrid.css';

interface FaceGridProps {
  face: FaceName;
  stickers: StickerColor[]; // 9 cores, índices 0-8
  onPaint: (indexInFace: number) => void;
}

export default function FaceGrid({ face, stickers, onPaint }: FaceGridProps) {
  return (
    <div className="face-grid" data-face={face}>
      {stickers.map((color, i) => {
        const isCenter = i === 4;
        return (
          <button
            key={i}
            type="button"
            className={
              'face-grid__cell' +
              (isCenter ? ' face-grid__cell--center' : '')
            }
            style={{ background: `var(--sticker-${color})` }}
            onClick={() => !isCenter && onPaint(i)}
            disabled={isCenter}
            aria-label={
              isCenter
                ? `Centro da face ${face} (fixo)`
                : `Sticker ${i + 1} da face ${face}, cor atual ${color}`
            }
          />
        );
      })}
    </div>
  );
}
