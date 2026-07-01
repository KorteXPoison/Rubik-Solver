// Classic Vite worker (sem { type: 'module' }) — Vite compila isto como
// IIFE, onde `this === self`. O cubejs legacy CJS usa `this.Cube` internamente
// (em solve.js: `Cube = this.Cube || require('./cube')`), por isso precisa
// de correr num contexto onde `this` não é undefined.

import Cube from 'cubejs';

declare const self: Worker;

type WorkerInMessage =
  | { type: 'init' }
  | { type: 'solve'; cubeString: string };

type WorkerOutMessage =
  | { type: 'ready' }
  | { type: 'solution'; solution: string }
  | { type: 'error'; message: string };

let initialized = false;

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  const msg = event.data;

  if (msg.type === 'init') {
    if (!initialized) {
      Cube.initSolver();
      initialized = true;
    }
    const out: WorkerOutMessage = { type: 'ready' };
    self.postMessage(out);
    return;
  }

  if (msg.type === 'solve') {
    try {
      const cube = Cube.fromString(msg.cubeString);
      const solution = cube.solve();
      const out: WorkerOutMessage = { type: 'solution', solution };
      self.postMessage(out);
    } catch (err) {
      const out: WorkerOutMessage = {
        type: 'error',
        message: err instanceof Error ? err.message : String(err),
      };
      self.postMessage(out);
    }
  }
};
