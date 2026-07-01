import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="home-hero">
      <p className="home-hero__eyebrow mono">3x3 · ALGORITMO TWO-PHASE</p>
      <h1 className="home-hero__title">
        Introduz o teu cubo.
        <br />
        Recebe a solução.
      </h1>
      <p className="home-hero__lede">
        Indica as cores de cada face e obtém uma sequência de movimentos
        quase ótima, com animação passo a passo — tudo a correr no teu
        browser, sem enviar dados para nenhum servidor.
      </p>
      <button
        className="home-hero__cta"
        onClick={() => navigate('/resolver')}
      >
        Resolver o meu cubo
      </button>
    </section>
  );
}
