import { useMemo, useState, useCallback } from 'react';
import {
  type CubeState,
  type FaceName,
  type StickerColor,
  createSolvedCube,
  FACE_ORDER,
} from '../core/cube-model';
import { validateCubeState, type ValidationResult } from '../core/validation';

export function useCubeInput() {
  const [state, setState] = useState<CubeState>(createSolvedCube);
  const [activeColor, setActiveColor] = useState<StickerColor>('U');

  const setSticker = useCallback(
    (face: FaceName, indexInFace: number, color: StickerColor) => {
      setState((prev) => {
        const next = [...prev];
        const flatIndex = FACE_ORDER.indexOf(face) * 9 + indexInFace;
        // O centro (índice 4) é fixo: define a cor da própria face e
        // não pode ser editado, para não quebrar a referência de cores.
        if (indexInFace === 4) return prev;
        next[flatIndex] = color;
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => setState(createSolvedCube()), []);

  const validation: ValidationResult = useMemo(
    () => validateCubeState(state),
    [state]
  );

  // Contagem de cada cor, para dar feedback visual de progresso
  // (ex: "9/9 brancas", ou destacar a vermelho se passar de 9).
  const colorCounts = useMemo(() => {
    const counts: Record<StickerColor, number> = {
      U: 0,
      R: 0,
      F: 0,
      D: 0,
      L: 0,
      B: 0,
    };
    for (const c of state) counts[c]++;
    return counts;
  }, [state]);

  return {
    state,
    setSticker,
    activeColor,
    setActiveColor,
    reset,
    validation,
    colorCounts,
  };
}
