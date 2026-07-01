import { NavLink } from 'react-router-dom';
import './Header.css';

const TICKER_MOVES = [
  "R", "U", "R'", "U'", "F", "B2", "L'", "D", "R2", "U'",
  "F'", "L", "B", "D2", "R'", "U", "F2", "L'", "B'", "D'",
];

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__brand">
          <span className="header__brand-mark">⬛</span>
          <span>Cube Solver</span>
        </NavLink>

        <nav className="header__nav">
          <NavLink
            to="/resolver"
            className={({ isActive }) =>
              isActive ? 'header__link header__link--active' : 'header__link'
            }
          >
            Resolver cubo
          </NavLink>
        </nav>
      </div>

      <div className="header__ticker" aria-hidden="true">
        <div className="header__ticker-track">
          {[...TICKER_MOVES, ...TICKER_MOVES].map((move, i) => (
            <span key={i} className="header__ticker-move mono">
              {move}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
