/**
 * Representação do cubo: array de 54 "facelets" (stickers), na ordem
 * usada pela biblioteca cubejs: U R F D L B, 9 stickers por face.
 *
 * Índices por face (cada bloco de 9, posições 0-8 dentro do bloco):
 *   0 1 2
 *   3 4 5
 *   6 7 8
 * (linha a linha, esquerda->direita, topo->baixo, olhando para a face)
 *
 * O facelet central de cada face (índice 4 do bloco) define a cor
 * "oficial" dessa face e nunca muda — é a referência usada na validação
 * e na UI para nomear as 6 cores.
 */

export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

export const FACE_ORDER: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];

/** Nomes amigáveis das faces, em português, para a UI. */
export const FACE_LABELS: Record<FaceName, string> = {
  U: 'Cima',
  R: 'Direita',
  F: 'Frente',
  D: 'Baixo',
  L: 'Esquerda',
  B: 'Trás',
};

/**
 * Uma "cor" no nosso modelo é identificada pela letra da face onde
 * aparece quando o cubo está resolvido (convenção standard: a cor U
 * chama-se "U", etc). Isto evita ambiguidade entre nomes de cores e
 * esquemas de cores diferentes (ex: alguns cubos trocam branco/amarelo).
 */
export type StickerColor = FaceName;

/** Estado completo do cubo: 54 stickers, na ordem U,R,F,D,L,B. */
export type CubeState = StickerColor[];

/** Cor hex associada a cada cor de sticker, para renderização na UI. */
export const STICKER_HEX: Record<StickerColor, string> = {
  U: 'var(--sticker-U)',
  R: 'var(--sticker-R)',
  F: 'var(--sticker-F)',
  D: 'var(--sticker-D)',
  L: 'var(--sticker-L)',
  B: 'var(--sticker-B)',
};

/** Cubo resolvido: cada face inteiramente preenchida com a sua cor própria. */
export function createSolvedCube(): CubeState {
  const state: CubeState = [];
  for (const face of FACE_ORDER) {
    for (let i = 0; i < 9; i++) {
      state.push(face);
    }
  }
  return state;
}

/** Devolve os 9 stickers de uma face específica. */
export function getFace(state: CubeState, face: FaceName): StickerColor[] {
  const start = FACE_ORDER.indexOf(face) * 9;
  return state.slice(start, start + 9);
}

/** Substitui os 9 stickers de uma face específica (devolve novo array). */
export function setFace(
  state: CubeState,
  face: FaceName,
  faceStickers: StickerColor[]
): CubeState {
  const start = FACE_ORDER.indexOf(face) * 9;
  const next = [...state];
  for (let i = 0; i < 9; i++) {
    next[start + i] = faceStickers[i];
  }
  return next;
}

/** Converte o estado para a string de 54 caracteres que o solver espera. */
export function cubeStateToString(state: CubeState): string {
  return state.join('');
}

export function cubeStateFromString(str: string): CubeState {
  return str.split('') as CubeState;
}
