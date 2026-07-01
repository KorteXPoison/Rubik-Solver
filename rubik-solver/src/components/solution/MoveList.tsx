import type { Move } from '../../core/moves';
import './MoveList.css';

interface MoveListProps {
  moves: Move[];
  currentStep: number; // -1 = estado inicial (nenhum movimento aplicado)
  onJump: (step: number) => void;
}

export default function MoveList({ moves, currentStep, onJump }: MoveListProps) {
  if (moves.length === 0) return null;

  return (
    <div className="move-list">
      <div className="move-list__header">
        <span className="move-list__title">
          {moves.length} movimento{moves.length !== 1 ? 's' : ''}
        </span>
        <button
          className="move-list__copy"
          title="Copiar solução"
          onClick={() => {
            const text = moves.map((m) => m.notation).join(' ');
            navigator.clipboard.writeText(text);
          }}
        >
          Copiar
        </button>
      </div>

      <div className="move-list__grid" role="list">
        {moves.map((move, i) => {
          const isPast = i < currentStep;
          const isActive = i === currentStep;
          return (
            <button
              key={i}
              role="listitem"
              className={
                'move-list__badge mono' +
                (isActive ? ' move-list__badge--active' : '') +
                (isPast ? ' move-list__badge--past' : '')
              }
              onClick={() => onJump(i)}
              title={`Ir para o movimento ${i + 1}`}
            >
              <span className="move-list__badge-num">{i + 1}</span>
              {move.notation}
            </button>
          );
        })}
      </div>
    </div>
  );
}
