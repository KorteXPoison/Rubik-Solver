# Cube Solver

App web responsiva para resolver qualquer cubo de Rubik 3×3.
Toda a lógica (validação + solver) corre no browser — sem servidor.

## Tecnologias

- **React 19 + TypeScript + Vite** — frontend moderno, dev loop rápido
- **cubejs** — algoritmo two-phase de Kociemba (soluções em ≤22 movimentos)
- **Web Worker** — solver em thread separada, sem bloquear a UI
- **react-router-dom** — SPA com 3 páginas

## Correr localmente

```bash
# 1. Instalar dependências
npm install

# 2. Arrancar o servidor de desenvolvimento
npm run dev
# → http://localhost:5173

# 3. Build de produção
npm run build

# 4. Preview do build de produção
npm run preview
# → http://localhost:4173
```

## Deploy

### Vercel (recomendado — 0 configuração)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Fazer upload da pasta `dist/` em app.netlify.com
# Ou: netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# No vite.config.ts, adicionar: base: '/nome-do-repo/'
npm run build
# Fazer push da pasta dist/ para o branch gh-pages
```

### Docker / servidor estático
```bash
npm run build
# Servir a pasta dist/ com qualquer servidor estático:
npx serve dist
```

## Estrutura do projeto

```
src/
├── components/
│   ├── cube-input/     # ColorPalette, FaceGrid, CubeNet, ValidationBanner
│   ├── layout/         # Header (com ticker), Footer, PageContainer
│   └── solution/       # MoveList, SolutionPlayer
├── core/
│   ├── cube-model.ts       # Estrutura de dados (54 facelets)
│   ├── validation.ts       # Validação completa (paridade, orientação)
│   ├── moves.ts            # Tipos e parser de notação de movimentos
│   └── solver.worker.ts    # Web Worker com algoritmo two-phase
├── hooks/
│   ├── useCubeInput.ts     # Estado do input manual + validação reactiva
│   └── useSolver.ts        # Máquina de estados: idle→init→solving→done
└── pages/
    ├── Home.tsx
    ├── InputCube.tsx
    └── Solution.tsx
```

## Algoritmo

O solver usa o **algoritmo two-phase de Herbert Kociemba**:

- **Fase 1** — reduzir o cubo a um subgrupo `<U,D,F2,B2,L2,R2>` (orientar cantos e arestas, colocar arestas UD na camada do meio).
- **Fase 2** — dentro desse subgrupo, resolver completamente o cubo.

Tipicamente devolve soluções de **18–22 movimentos** (o "God's Number" — máximo necessário — é 20). O cálculo demora entre 10ms e 2s, dependendo do estado inicial.
