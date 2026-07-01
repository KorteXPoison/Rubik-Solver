import type { Move, MoveFace, MoveModifier } from '../../core/moves';
import './MoveIllustration.css';

interface MoveIllustrationProps {
  move: Move;
  size?: number;
}

const FACE_LABEL: Record<MoveFace, string> = {
  U: 'Face de Cima',
  R: 'Face Direita',
  F: 'Face da Frente',
  D: 'Face de Baixo',
  L: 'Face Esquerda',
  B: 'Face de Trás',
};

const FACE_COLOR: Record<MoveFace, string> = {
  U: 'var(--sticker-U)',
  R: 'var(--sticker-R)',
  F: 'var(--sticker-F)',
  D: 'var(--sticker-D)',
  L: 'var(--sticker-L)',
  B: 'var(--sticker-B)',
};

// A description of the move in plain portuguese
const DIRECTION_LABEL: Record<MoveModifier, string> = {
  '':   'Sentido horário',
  "'":  'Sentido anti-horário',
  '2':  '180° (duas vezes)',
};

// In a 180×180 SVG centred at (90,90), radius 74:
//   top  = (90, 16)    right = (164, 90)
//   bottom = (90, 164) left  = (16, 90)
//
// CW  large arc from top → right  (sweep=1)
// CCW large arc from right → top  (sweep=0)
// 180 half arc  from top → bottom (sweep=1)

function arrowPath(modifier: MoveModifier) {
  if (modifier === '')   return 'M 90,16 A 74,74 0 1 1 164,90';
  if (modifier === "'")  return 'M 164,90 A 74,74 0 1 0 90,16';
  /* '2' */ return 'M 90,16 A 74,74 0 0 1 90,164';
}

// Position the arrowhead marker at the correct end of each path

export default function MoveIllustration({ move, size = 200 }: MoveIllustrationProps) {
  const { face, modifier, notation } = move;
  // Unique ID per notation to avoid SVG marker ID collisions
  const uid = `mi-${notation.replace("'", 'p').replace('2', 'tt')}`;
  const faceColor = FACE_COLOR[face];
  const path = arrowPath(modifier);
  const dirLabel = DIRECTION_LABEL[modifier];
  const faceLabel = FACE_LABEL[face];

  // 3×3 grid: each cell 25×25 with 3px gap, total 81px, centred at (90,90)
  const cellSize = 25;
  const gap = 3;
  const gridStart = 90 - (3 * cellSize + 2 * gap) / 2; // = 49.5 ≈ 50

  return (
    <div className="move-illustration">
      <svg
        viewBox="0 0 180 180"
        width={size}
        height={size}
        aria-label={`Movimento ${notation}: ${faceLabel}, ${dirLabel}`}
        role="img"
      >
        <defs>
          {/* Arrowhead marker — orient=auto aligns tip with path direction */}
          <marker
            id={`${uid}-arrow`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-orange)" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="180" height="180" rx="14" fill="var(--surface-raised)" />

        {/* ── 3×3 face grid ─────────────────────────────── */}
        {Array.from({ length: 9 }, (_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const x = gridStart + col * (cellSize + gap);
          const y = gridStart + row * (cellSize + gap);
          const isCenter = i === 4;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={3}
              fill={isCenter ? faceColor : 'var(--surface)'}
              stroke={isCenter ? faceColor : 'var(--border)'}
              strokeWidth={isCenter ? 2 : 1}
            />
          );
        })}

        {/* ── Rotation arrow ────────────────────────────── */}
        <path
          d={path}
          stroke="var(--accent-orange)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          markerEnd={`url(#${uid}-arrow)`}
        />

        {/* Second arrow for 180° (show arc from bottom back to top so user
            understands it's two quarter-turns or one half-turn) */}
        {modifier === '2' && (
          <path
            d="M 90,164 A 74,74 0 0 1 90,16"
            stroke="var(--accent-orange)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="6 5"
            fill="none"
            opacity="0.45"
          />
        )}
      </svg>

      {/* ── Text labels below the SVG ─────────────────── */}
      <div className="move-illustration__labels">
        <span className="move-illustration__notation mono">{notation}</span>
        <span className="move-illustration__face">{faceLabel}</span>
        <span className="move-illustration__dir">{dirLabel}</span>
      </div>
    </div>
  );
}
