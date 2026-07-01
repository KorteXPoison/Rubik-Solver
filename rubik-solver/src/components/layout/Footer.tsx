import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>Cube Solver — resolução no browser, sem servidor.</span>
        <span className="footer__sep">·</span>
        <span>Algoritmo two-phase (Kociemba)</span>
      </div>
    </footer>
  );
}
