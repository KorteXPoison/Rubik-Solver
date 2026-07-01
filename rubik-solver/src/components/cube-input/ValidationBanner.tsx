import type { ValidationResult } from '../../core/validation';
import './ValidationBanner.css';

interface ValidationBannerProps {
  result: ValidationResult;
}

export default function ValidationBanner({ result }: ValidationBannerProps) {
  if (result.valid) {
    return (
      <div className="validation-banner validation-banner--ok" role="status">
        <span className="validation-banner__icon">✓</span>
        <span>Estado válido — pronto para resolver!</span>
      </div>
    );
  }

  return (
    <div
      className="validation-banner validation-banner--error"
      role="alert"
      aria-live="polite"
    >
      <span className="validation-banner__icon">✗</span>
      <ul className="validation-banner__list">
        {result.errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
