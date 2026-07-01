// Classic browser worker — importScripts garante que cube.js e solve.js
// correm com `this === self`, que é o que o cubejs precisa para partilhar
// o objeto Cube entre os dois ficheiros via `this.Cube`.
importScripts('/cubejs/cube.js', '/cubejs/solve.js');

var initialized = false;

self.onmessage = function (event) {
  var msg = event.data;

  if (msg.type === 'init') {
    if (!initialized) {
      Cube.initSolver();
      initialized = true;
    }
    self.postMessage({ type: 'ready' });
    return;
  }

  if (msg.type === 'solve') {
    try {
      var cube = Cube.fromString(msg.cubeString);
      var solution = cube.solve();
      self.postMessage({ type: 'solution', solution: solution });
    } catch (err) {
      self.postMessage({ type: 'error', message: err.message || String(err) });
    }
  }
};
