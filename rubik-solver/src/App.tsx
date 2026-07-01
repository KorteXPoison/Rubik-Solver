import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageContainer from './components/layout/PageContainer';
import Home from './pages/Home';
import InputCube from './pages/InputCube';
import Solution from './pages/Solution';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resolver" element={<InputCube />} />
          <Route path="/solucao" element={<Solution />} />
        </Routes>
      </PageContainer>
      <Footer />
    </BrowserRouter>
  );
}
