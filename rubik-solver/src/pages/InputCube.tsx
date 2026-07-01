import { useNavigate } from 'react-router-dom';
import { useCubeInput } from '../hooks/useCubeInput';
import { cubeStateToString } from '../core/cube-model';
import CubeNet from '../components/cube-input/CubeNet';
import ColorPalette from '../components/cube-input/ColorPalette';
import ValidationBanner from '../components/cube-input/ValidationBanner';
import './InputCube.css';

export default function InputCube() {
  const navigate = useNavigate();
  const {
    state,
    setSticker,
    activeColor,
    setActiveColor,
    reset,
    validation,
    colorCounts,
  } = useCubeInput();

  function handleSolve() {
    const encoded = encodeURIComponent(cubeStateToString(state));
    navigate(`/solucao?cube=${encoded}`);
  }

  return (
    <section className="input-page">
      <header className="input-page__header">
        <h2 className="page-title">Introduzir o cubo</h2>
        <p className="page-subtitle">
          Escolhe uma cor na paleta e clica nos stickers para os pintar.
          Os centros (peças centrais) são fixos — definem a cor de cada face.
        </p>
      </header>

      <div className="input-page__layout">
        {/* Left: net + controls */}
        <div className="input-page__left">
          <div className="input-page__legend">
            <span className="input-page__legend-label">Face vista de frente:</span>
            <span className="input-page__legend-faces mono">L · F · R · B</span>
          </div>

          <CubeNet state={state} onPaint={(face, idx) => setSticker(face, idx, activeColor)} />

          <div className="input-page__actions">
            <button className="btn btn--ghost" onClick={reset}>
              Repor (cubo resolvido)
            </button>
          </div>
        </div>

        {/* Right: palette + validation + solve */}
        <div className="input-page__right">
          <div className="input-page__section">
            <p className="input-page__section-label">Cor selecionada</p>
            <ColorPalette
              active={activeColor}
              onSelect={setActiveColor}
              counts={colorCounts}
            />
            <p className="input-page__hint">
              Cada cor deve aparecer exatamente 9 vezes. Clica na cor e
              depois nos stickers da grelha.
            </p>
          </div>

          <div className="input-page__section">
            <p className="input-page__section-label">Validação</p>
            <ValidationBanner result={validation} />
          </div>

          <button
            className="btn btn--primary"
            disabled={!validation.valid}
            onClick={handleSolve}
          >
            Calcular solução →
          </button>
        </div>
      </div>
    </section>
  );
}
