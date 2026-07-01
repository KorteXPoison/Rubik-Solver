/**
 * Notação padrão de movimentos do cubo de Rubik (notação Singmaster):
 *   Face: U R F D L B
 *   Modificador: sem sufixo = 90° no sentido dos ponteiros do relógio
 *                '           = 90° anti-horário
 *                2           = 180°
 */

export type MoveFace = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';
export type MoveModifier = '' | "'" | '2';

export interface Move {
  face: MoveFace;
  modifier: MoveModifier;
  /** String canónica, ex: "R'", "U2", "F" */
  notation: string;
}

const FACE_SET = new Set<string>(['U', 'R', 'F', 'D', 'L', 'B']);

/**
 * Converte a string devolvida pelo solver (ex: "R U2 F' B L D'")
 * num array de Move estruturados.
 */
export function parseMoves(solution: string): Move[] {
  if (!solution.trim()) return [];
  return solution
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const face = token[0] as MoveFace;
      const modifier = (token[1] ?? '') as MoveModifier;
      if (!FACE_SET.has(face)) {
        throw new Error(`Movimento inválido: "${token}"`);
      }
      return { face, modifier, notation: token };
    });
}

/** Descrição textual amigável de um movimento, em português. */
export function moveDescription(move: Move): string {
  const faceNames: Record<MoveFace, string> = {
    U: 'Cima',
    R: 'Direita',
    F: 'Frente',
    D: 'Baixo',
    L: 'Esquerda',
    B: 'Trás',
  };
  const name = faceNames[move.face];
  if (move.modifier === "'") return `${name} anti-horário`;
  if (move.modifier === '2') return `${name} 180°`;
  return `${name} horário`;
}
