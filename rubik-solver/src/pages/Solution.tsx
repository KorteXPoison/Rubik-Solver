import { useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSolver } from '../hooks/useSolver';
import MoveList from '../components/solution/MoveList';
import SolutionPlayer from '../components/solution/SolutionPlayer';
import './Solution.css';

export default function Solution() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cubeString = searchParams.get('cube');

  const { status, moves, errorMessage, solveTimeMs } = useSolver(cubeString);
  const [currentStep, setCurrentStep] = useState(-1);

  const handleStep = useCallback((stepOrUpdater: number | ((prev: number) => number)) => {
    setCurrentStep(stepOrUpdater);
  }, []);

  if (!cubeString) {
    return (
      <section>
        <h2 className="page-title">Solução</h2>
        <p className="page-subtitle">
          Nenhum cubo encontrado. Volta atrás e introduz o estado do cubo.
        </p>
        <button className="btn btn--ghost" onClick={() => navigate('/resolver')}>
          ← Introduzir cubo
        </button>
      </section>
    );
  }

  return (
    <section className="solution-page">
      <div className="solution-page__header">
        <div>
          <h2 className="page-title">Solução</h2>
          {status === 'done' && (
            <p className="solution-page__meta page-subtitle">
              {moves.length} movimentos
              {solveTimeMs !== null && (
                <span className="mono"> · calculado em {solveTimeMs} ms</span>
              )}
            </p>
          )}
        </div>
        <button
          className="btn btn--ghost solution-page__back"
          onClick={() => navigate('/resolver')}
        >
          ← Novo cubo
        </button>
      </div>

      {(status === 'initialising' || status === 'solving') && (
        <div className="solution-page__loading">
          <div className="solution-page__spinner" aria-hidden="true" />
          <div>
            <p className="solution-page__loading-title">
              {status === 'initialising'
                ? 'A inicializar o solver…'
                : 'A calcular a solução…'}
            </p>
            <p className="solution-page__loading-sub">
              {status === 'initialising'
                ? 'O algoritmo two-phase está a carregar as tabelas de lookup (primeira execução — demora ~3 seg).'
                : 'A encontrar a sequência de movimentos mais curta possível.'}
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="solution-page__error">
          <strong>Erro ao calcular a solução</strong>
          <p>{errorMessage}</p>
          <button className="btn btn--ghost" onClick={() => navigate('/resolver')}>
            ← Verificar o estado do cubo
          </button>
        </div>
      )}

      {status === 'done' && moves.length === 0 && (
        <div className="solution-page__solved">
          <span className="solution-page__solved-icon">✓</span>
          <div>
            <strong>O cubo já está resolvido!</strong>
            <p>Não são necessários movimentos.</p>
          </div>
        </div>
      )}

      {status === 'done' && moves.length > 0 && (
        <div className="solution-page__content">
          <SolutionPlayer
            moves={moves}
            currentStep={currentStep}
            onStep={handleStep}
          />
          <MoveList
            moves={moves}
            currentStep={currentStep}
            onJump={(step) => setCurrentStep(step)}
          />
        </div>
      )}
    </section>
  );
}
