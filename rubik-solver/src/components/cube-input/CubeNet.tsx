import { getFace, type CubeState, type FaceName } from '../../core/cube-model';
import FaceGrid from './FaceGrid';
import './CubeNet.css';


interface CubeNetProps {
  state: CubeState;
  onPaint: (face: FaceName, indexInFace: number) => void;
}

export default function CubeNet({ state, onPaint }: CubeNetProps) {
  const face = (f: FaceName) => (
    <FaceGrid
      face={f}
      stickers={getFace(state, f)}
      onPaint={(i) => onPaint(f, i)}
    />
  );

  return (
    <div className="cube-net">
      <div className="cube-net__row cube-net__row--top">
        <div className="cube-net__cell" />
        {face('U')}
        <div className="cube-net__cell" />
        <div className="cube-net__cell" />
      </div>
      <div className="cube-net__row cube-net__row--mid">
        {face('L')}
        {face('F')}
        {face('R')}
        {face('B')}
      </div>
      <div className="cube-net__row cube-net__row--bottom">
        <div className="cube-net__cell" />
        {face('D')}
        <div className="cube-net__cell" />
        <div className="cube-net__cell" />
      </div>
    </div>
  );
}
