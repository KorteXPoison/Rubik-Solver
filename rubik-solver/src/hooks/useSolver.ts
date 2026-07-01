import { useEffect, useRef, useState } from 'react';
import { parseMoves, type Move } from '../core/moves';

export type SolverStatus =
  | 'idle'
  | 'initialising'
  | 'solving'
  | 'done'
  | 'error';

export interface SolverState {
  status: SolverStatus;
  moves: Move[];
  errorMessage: string | null;
  solveTimeMs: number | null;
}

type WorkerInMessage =
  | { type: 'init' }
  | { type: 'solve'; cubeString: string };

type WorkerOutMessage =
  | { type: 'ready' }
  | { type: 'solution'; solution: string }
  | { type: 'error'; message: string };

export function useSolver(cubeString: string | null) {
  // Worker clássico carregado da pasta public/ via importScripts.
  // Desta forma o cubejs (cube.js + solve.js) corre com `this === self`,
  // que é o contexto que a biblioteca precisa para funcionar corretamente.
  const workerRef = useRef<Worker | null>(null);
  const solveStartRef = useRef<number>(0);

  const [solverState, setSolverState] = useState<SolverState>({
    status: 'idle',
    moves: [],
    errorMessage: null,
    solveTimeMs: null,
  });

  useEffect(() => {
    if (!cubeString) return;

    if (!workerRef.current) {
      // Sem { type: 'module' } — classic worker, necessário para importScripts
      workerRef.current = new Worker('/cubejs/solver-worker.js');
    }

    const worker = workerRef.current;

    worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
      const msg = event.data;

      if (msg.type === 'ready') {
        setSolverState((prev) => ({ ...prev, status: 'solving' }));
        solveStartRef.current = performance.now();
        const req: WorkerInMessage = { type: 'solve', cubeString };
        worker.postMessage(req);
        return;
      }

      if (msg.type === 'solution') {
        const elapsed = performance.now() - solveStartRef.current;
        try {
          const moves = parseMoves(msg.solution);
          setSolverState({
            status: 'done',
            moves,
            errorMessage: null,
            solveTimeMs: Math.round(elapsed),
          });
        } catch (err) {
          setSolverState({
            status: 'error',
            moves: [],
            errorMessage:
              err instanceof Error ? err.message : 'Erro ao processar solução.',
            solveTimeMs: null,
          });
        }
        return;
      }

      if (msg.type === 'error') {
        setSolverState({
          status: 'error',
          moves: [],
          errorMessage: msg.message,
          solveTimeMs: null,
        });
      }
    };

    worker.onerror = (e) => {
      setSolverState({
        status: 'error',
        moves: [],
        errorMessage: `Erro no worker: ${e.message}`,
        solveTimeMs: null,
      });
    };

    setSolverState({
      status: 'initialising',
      moves: [],
      errorMessage: null,
      solveTimeMs: null,
    });

    const req: WorkerInMessage = { type: 'init' };
    worker.postMessage(req);
  }, [cubeString]);

  return solverState;
}
