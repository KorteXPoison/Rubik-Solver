import {
  type CubeState,
  type FaceName,
  type StickerColor,
  FACE_ORDER,
} from './cube-model';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const faceIndex: Record<FaceName, number> = {
  U: 0,
  R: 1,
  F: 2,
  D: 3,
  L: 4,
  B: 5,
};

/** Posição (0-53) do sticker `x` (1-indexado, 1..9) da face `face`. */
function pos(face: FaceName, x: number): number {
  return faceIndex[face] * 9 + (x - 1);
}

// Tabelas de referência (mesma convenção da cubejs), para mapear
// facelets para peças (cantos/arestas) e detetar combinações impossíveis.
const CORNER_FACELET: [number, number, number][] = [
  [pos('U', 9), pos('R', 1), pos('F', 3)],
  [pos('U', 7), pos('F', 1), pos('L', 3)],
  [pos('U', 1), pos('L', 1), pos('B', 3)],
  [pos('U', 3), pos('B', 1), pos('R', 3)],
  [pos('D', 3), pos('F', 9), pos('R', 7)],
  [pos('D', 1), pos('L', 9), pos('F', 7)],
  [pos('D', 7), pos('B', 9), pos('L', 7)],
  [pos('D', 9), pos('R', 9), pos('B', 7)],
];

const EDGE_FACELET: [number, number][] = [
  [pos('U', 6), pos('R', 2)],
  [pos('U', 8), pos('F', 2)],
  [pos('U', 4), pos('L', 2)],
  [pos('U', 2), pos('B', 2)],
  [pos('D', 6), pos('R', 8)],
  [pos('D', 2), pos('F', 8)],
  [pos('D', 4), pos('L', 8)],
  [pos('D', 8), pos('B', 8)],
  [pos('F', 6), pos('R', 4)],
  [pos('F', 4), pos('L', 6)],
  [pos('B', 6), pos('L', 4)],
  [pos('B', 4), pos('R', 6)],
];

const CORNER_COLOR: [StickerColor, StickerColor, StickerColor][] = [
  ['U', 'R', 'F'],
  ['U', 'F', 'L'],
  ['U', 'L', 'B'],
  ['U', 'B', 'R'],
  ['D', 'F', 'R'],
  ['D', 'L', 'F'],
  ['D', 'B', 'L'],
  ['D', 'R', 'B'],
];

const EDGE_COLOR: [StickerColor, StickerColor][] = [
  ['U', 'R'],
  ['U', 'F'],
  ['U', 'L'],
  ['U', 'B'],
  ['D', 'R'],
  ['D', 'F'],
  ['D', 'L'],
  ['D', 'B'],
  ['F', 'R'],
  ['F', 'L'],
  ['B', 'L'],
  ['B', 'R'],
];

const CORNER_NAMES = [
  'URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB',
];
const EDGE_NAMES = [
  'UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR',
];

/** Paridade de uma permutação (0 = par, 1 = ímpar), via decomposição em ciclos. */
function permutationParity(perm: number[]): number {
  const n = perm.length;
  const visited = new Array(n).fill(false);
  let cycles = 0;
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    cycles++;
    let j = i;
    while (!visited[j]) {
      visited[j] = true;
      j = perm[j];
    }
  }
  return (n - cycles) % 2;
}

export function validateCubeState(state: CubeState): ValidationResult {
  const errors: string[] = [];

  if (state.length !== 54) {
    return { valid: false, errors: ['O cubo precisa de exatamente 54 stickers.'] };
  }

  // 1. Cada cor deve aparecer exatamente 9 vezes.
  const counts: Record<StickerColor, number> = { U: 0, R: 0, F: 0, D: 0, L: 0, B: 0 };
  for (const c of state) {
    if (!(c in counts)) {
      return { valid: false, errors: [`Cor inválida encontrada: "${c}".`] };
    }
    counts[c]++;
  }
  for (const face of FACE_ORDER) {
    if (counts[face] !== 9) {
      errors.push(
        `A cor "${face}" aparece ${counts[face]}x (devia aparecer exatamente 9x).`
      );
    }
  }

  // 2. Os centros têm de corresponder à face onde estão (são a referência de cor).
  for (const face of FACE_ORDER) {
    if (state[pos(face, 5)] !== face) {
      errors.push(`O centro da face ${face} não corresponde à cor dessa face.`);
    }
  }

  // Se já há erros estruturais básicos, não vale a pena continuar para
  // a análise de cantos/arestas (que assume contagens razoáveis).
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 3. Decodificar cantos: para cada canto, localizar o facelet U/D,
  //    e usar os outros dois para identificar a peça.
  const cp: number[] = new Array(8).fill(-1);
  const co: number[] = new Array(8).fill(0);

  for (let i = 0; i < 8; i++) {
    const facelets = CORNER_FACELET[i].map((p) => state[p]);
    let ori = facelets.findIndex((c) => c === 'U' || c === 'D');
    if (ori === -1) {
      errors.push(`Canto ${CORNER_NAMES[i]}: combinação de cores impossível (sem U/D).`);
      continue;
    }
    const col1 = facelets[(ori + 1) % 3];
    const col2 = facelets[(ori + 2) % 3];
    const match = CORNER_COLOR.findIndex((c) => c[1] === col1 && c[2] === col2);
    if (match === -1) {
      errors.push(`Canto ${CORNER_NAMES[i]}: combinação de cores não corresponde a nenhuma peça real.`);
      continue;
    }
    cp[i] = match;
    co[i] = ori % 3;
  }

  // 4. Decodificar arestas, de forma análoga.
  const ep: number[] = new Array(12).fill(-1);
  const eo: number[] = new Array(12).fill(0);

  for (let i = 0; i < 12; i++) {
    const [a, b] = EDGE_FACELET[i].map((p) => state[p]);
    let match = EDGE_COLOR.findIndex((c) => c[0] === a && c[1] === b);
    if (match !== -1) {
      ep[i] = match;
      eo[i] = 0;
      continue;
    }
    match = EDGE_COLOR.findIndex((c) => c[0] === b && c[1] === a);
    if (match !== -1) {
      ep[i] = match;
      eo[i] = 1;
      continue;
    }
    errors.push(`Aresta ${EDGE_NAMES[i]}: combinação de cores não corresponde a nenhuma peça real.`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 5. Cada peça (canto/aresta) tem de aparecer exatamente uma vez —
  //    senão há stickers duplicados a "fingir" ser a mesma peça física.
  const cpSet = new Set(cp);
  if (cpSet.size !== 8) {
    errors.push('Há cantos repetidos ou em falta — verifica as cores introduzidas.');
  }
  const epSet = new Set(ep);
  if (epSet.size !== 12) {
    errors.push('Há arestas repetidas ou em falta — verifica as cores introduzidas.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 6. Orientação total dos cantos tem de ser múltipla de 3, e das
  //    arestas múltipla de 2 — senão é uma rotação impossível por
  //    qualquer sequência de movimentos físicos.
  const coSum = co.reduce((a, b) => a + b, 0);
  if (coSum % 3 !== 0) {
    errors.push('Orientação dos cantos inválida (cubo fisicamente impossível de montar).');
  }
  const eoSum = eo.reduce((a, b) => a + b, 0);
  if (eoSum % 2 !== 0) {
    errors.push('Orientação das arestas inválida (cubo fisicamente impossível de montar).');
  }

  // 7. A paridade da permutação dos cantos tem de ser igual à das
  //    arestas — caso contrário nenhuma sequência de movimentos legais
  //    consegue gerar este estado (ex: trocar só 2 peças).
  if (permutationParity(cp) !== permutationParity(ep)) {
    errors.push(
      'Permutação impossível: trocar apenas duas peças (sem mais alterações) não é um estado alcançável com movimentos legais.'
    );
  }

  return { valid: errors.length === 0, errors };
}
