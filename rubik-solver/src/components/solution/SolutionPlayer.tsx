import { useEffect, useRef, useState } from 'react';
import type { Move } from '../../core/moves';
import { moveDescription } from '../../core/moves';
import MoveIllustration from './MoveIllustration';
import './SolutionPlayer.css';

interface SolutionPlayerProps {
  moves: Move[];
  currentStep: number; // -1 = posição inicial
  onStep: (step: number) => void;
}

export default function SolutionPlayer({
  moves,
  currentStep,
  onStep,
}: SolutionPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(currentStep);
  stepRef.current = currentStep;

  const atStart = currentStep === -1;
  const atEnd = currentStep === moves.length - 1;

  function stop() {
    setPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function play() {
    if (atEnd) onStep(-1);
    setPlaying(true);
  }

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      const next = stepRef.current + 1;
      if (next >= moves.length) {
        stop();
      } else {
        onStep(next);
      }
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, moves.length]);

  useEffect(() => {
    if (playing && atEnd) stop();
  }, [playing, atEnd]);

  const currentMove = currentStep >= 0 ? moves[currentStep] : null;

  return (
    <div className="solution-player">
      {/* ── Ilustração do movimento atual ── */}
      <div className="solution-player__illustration-row">
        {currentMove ? (
          <div className="solution-player__illustration-wrap">
            <MoveIllustration key={currentMove.notation + currentStep} move={currentMove} size={180} />
          </div>
        ) : (
          <div className="solution-player__illustration-placeholder">
            <span className="solution-player__placeholder-icon">↻</span>
            <span>
              {moves.length > 0
                ? 'Carrega em ▶ para começar'
                : '—'}
            </span>
          </div>
        )}

        {/* Painel lateral: próximos 3 movimentos */}
        {currentMove && (
          <div className="solution-player__upcoming">
            <p className="solution-player__upcoming-label">A seguir</p>
            {moves.slice(currentStep + 1, currentStep + 4).map((m, i) => (
              <div key={i} className="solution-player__upcoming-item">
                <span className="solution-player__upcoming-num mono">
                  {currentStep + 2 + i}
                </span>
                <MoveIllustration move={m} size={64} />
              </div>
            ))}
            {currentStep + 1 >= moves.length && (
              <p className="solution-player__upcoming-done">Último movimento!</p>
            )}
          </div>
        )}
      </div>

      {/* ── Info do movimento atual ── */}
      <div className="solution-player__info">
        <span className="solution-player__counter mono">
          Passo {currentStep + 1} / {moves.length}
        </span>
        {currentMove && (
          <span className="solution-player__description">
            {moveDescription(currentMove)}
          </span>
        )}
      </div>

      {/* ── Controlos ── */}
      <div className="solution-player__controls">
        <button
          className="player-btn"
          disabled={atStart}
          onClick={() => { stop(); onStep(-1); }}
          title="Início"
          aria-label="Voltar ao início"
        >⏮</button>
        <button
          className="player-btn"
          disabled={atStart}
          onClick={() => { stop(); onStep(Math.max(-1, currentStep - 1)); }}
          title="Recuar"
          aria-label="Recuar um passo"
        >◀</button>
        <button
          className="player-btn player-btn--primary"
          onClick={playing ? stop : play}
          title={playing ? 'Pausar' : 'Reproduzir'}
          aria-label={playing ? 'Pausar' : 'Reproduzir'}
        >{playing ? '⏸' : '▶'}</button>
        <button
          className="player-btn"
          disabled={atEnd}
          onClick={() => { stop(); onStep(Math.min(moves.length - 1, currentStep + 1)); }}
          title="Avançar"
          aria-label="Avançar um passo"
        >▶</button>
        <button
          className="player-btn"
          disabled={atEnd}
          onClick={() => { stop(); onStep(moves.length - 1); }}
          title="Fim"
          aria-label="Ir para o fim"
        >⏭</button>
      </div>
    </div>
  );
}
