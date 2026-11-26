# Catálogo de Stacks Oficiais Robustas — Governança v4.4.0

> **Papel:** Catálogo técnico consultado pelo agente como **ponto de partida vivo** para sugerir a stack tecnológica durante o Gate 0. É obrigatório validar versões atuais, CLI e recomendações vigentes via **Pesquisa Viva** (`context7`, `/llms.txt` ou busca web) antes de recomendar.
> **Regra Anti-Brinquedo (Artigo 1):** Nenhuma aplicação interativa nasce com arquivos HTML/CSS/JS soltos. Toda base deve ter tipagem estrita, validação de schema e testes.
> **Responsividade e Portabilidade PWA Inatas (Artigo 6, item 6):** Qualquer desenvolvimento que envolva web deve nascer responsivo por padrão (mobile-first 320px+) e preparado para portabilidade como PWA instalável (`manifest.json`, viewport, theme-color e service workers) e Smoke Test E2E com Playwright + @axe-core/playwright (validando viewports 320x640 e 1280x800 sem overflow horizontal scrollWidth <= innerWidth e zero pageerror).

---

## 1. SaaS Web Fullstack (TypeScript)

### Opção A: T3 Stack (Next.js + TypeScript + Tailwind + tRPC + Drizzle/Prisma + Auth.js)
* **Quando usar:** Aplicações SaaS completas, dashboards orientados a dados, portais com autenticação e banco relacional.
* **Comando oficial de criação:**
  ```bash
  npm create t3-app@latest
  ```
* **Composição padrão:** Next.js (App Router), TypeScript (`strict`), Tailwind CSS, tRPC (segurança de tipo ponta a ponta), Drizzle ORM ou Prisma, Auth.js (NextAuth), Zod.
* **Executor de Testes:** Vitest.

### Opção B: Epic Stack (React Router / Remix + TypeScript + Tailwind + Prisma + SQLite/Postgres + Playwright/Vitest)
* **Quando usar:** Aplicações focadas em resiliência na web, renderização rápida no servidor, formulários robustos e testes E2E completos prontos para uso.
* **Comando oficial de criação:**
  ```bash
  npx create-epic-app@latest
  ```
* **Composição padrão:** React Router v7 / Remix, TypeScript (`strict`), Tailwind CSS, Prisma, Zod, Vitest + Playwright com autenticação completa pré-configurada.

### Opção C: Web SPA / Offline-First (Vite + React + TanStack Router + TanStack Query + shadcn/ui)
* **Quando usar:** Aplicações client-heavy, frontends desacoplados de uma API dedicada (FastAPI, NestJS, Go, Rust) ou apps offline-first sem necessidade de SSR.
* **Comando oficial de criação:**
  ```bash
  npm create vite@latest <nome-do-projeto> -- --template react-ts
  ```
* **Composição padrão:** Vite, React, TypeScript (`strict`), TanStack Router (rotas type-safe), TanStack Query, Tailwind CSS + shadcn/ui, Zod, Vitest + Playwright.

### Opção D: Monorepo Multi-App (pnpm workspaces + Turborepo)
* **Quando usar:** Projetos que combinam Web + API + Mobile compartilhando contratos Zod, tipos TypeScript e design system em pacotes internos.
* **Comando oficial de criação:**
  ```bash
  npx create-turbo@latest
  ```
* **Composição padrão:** `pnpm` workspaces, Turborepo (cache e pipelines paralelos), pacotes compartilhados (`packages/schemas`, `packages/ui`) e Vitest.

---

## 2. Painéis Internos e Dashboards

### Next.js + shadcn/ui + Tailwind CSS
* **Quando usar:** Ferramentas internas, painéis administrativos, CRUDs corporativos.
* **Comando oficial de criação:**
  ```bash
  npx create-next-app@latest --typescript --tailwind --eslint --app
  npx shadcn@latest init
  ```
* **Composição padrão:** Next.js (App Router), React Hook Form, Zod, Radix UI primitives, Lucide Icons, Vitest.

---

## 3. Backend e APIs Robustas

### Opção A: NestJS (TypeScript / Node.js)
* **Quando usar:** Sistemas corporativos em Node.js com arquitetura em camadas, injeção de dependência, OpenAPI (Swagger) e microsserviços.
* **Comando oficial de criação:**
  ```bash
  npx @nestjs/cli new <nome-do-projeto>
  ```
* **Composição padrão:** NestJS, TypeScript, class-validator, class-transformer, Jest.

### Opção B: Full Stack FastAPI Template (Python)
* **Quando usar:** APIs de alta performance com Python, machine learning, integrações de IA e processamento intensivo de dados.
* **Comando oficial de criação:**
  ```bash
  copier copy https://github.com/fastapi/full-stack-fastapi-template.git <nome-do-projeto>
  ```
* **Composição padrão:** FastAPI, Pydantic v2, SQLModel, PostgreSQL, Docker Compose, Pytest, Ruff.

### Opção C: Go API (Chi / Echo / Fiber + `sqlc` + `golangci-lint`)
* **Quando usar:** APIs de altíssima concorrência, proxies, gateways de rede ou microserviços distribuídos como binário único enxuto.
* **Comando oficial de criação:**
  ```bash
  go mod init <modulo>
  ```
* **Composição padrão:** Go moderno, router leve (Chi/Echo/Fiber), `sqlc` (SQL tipado em tempo de compilação), `golangci-lint` e `go test`.

### Opção D: Rust API (Axum + SQLx + Tokio)
* **Quando usar:** Serviços backend críticos em latência, segurança de memória e previsibilidade de recursos em produção.
* **Comando oficial de criação:**
  ```bash
  cargo init <nome-do-projeto>
  cargo add axum tokio --features tokio/full
  ```
* **Composição padrão:** Rust, Axum, Tokio, SQLx (queries verificadas contra o banco), Serde e `cargo test`.

---

## 4. Aplicações Mobile

### Create Expo Stack (React Native + Expo)
* **Quando usar:** Aplicativos móveis iOS e Android com base moderna e tipada.
* **Comando oficial de criação:**
  ```bash
  npx create-expo-stack@latest
  ```
* **Composição padrão:** Expo Router, TypeScript, NativeWind (Tailwind no mobile), TanStack Query.

---

## 5. Sites de Conteúdo e Documentação

### Astro + Tailwind CSS
* **Quando usar:** Landing pages, blogs corporativos, sites de documentação e marketing com foco em performance e SEO.
* **Comando oficial de criação:**
  ```bash
  npm create astro@latest
  ```
* **Composição padrão:** Astro (zero JavaScript no cliente por padrão), Tailwind CSS, TypeScript.

---

## 6. Programas de Computador (Desktop — Windows, macOS e Linux)

### Opção A: Tauri v2 (React/TypeScript + Tailwind + Rust Nativo) — *Padrão Ouro*
* **Quando usar:** Programas de computador modernos, rápidos e leves (instaladores `.exe`/`.msi`/`.dmg` de ~5 MB), com acesso seguro ao sistema de arquivos, banco SQLite local e baixo consumo de memória RAM.
* **Comando oficial de criação:**
  ```bash
  npm create tauri-app@latest
  ```
* **Composição padrão:** Frontend em React + TypeScript (`strict`) + Tailwind CSS + shadcn/ui; núcleo nativo em Rust (`Cargo.toml`), ponte IPC tipada e empacotador nativo embutido.
* **Pré-requisitos nativos (validar antes do Gate 0):** No Windows exige MSVC Build Tools + WebView2; no Linux exige `webkit2gtk` + `libayatana-appindicator` + `build-essential`.
* **Executor de Testes:** Vitest (UI) + `cargo test` (núcleo Rust).

### Opção B: Electron-Vite (Node.js Completo + React/TypeScript)
* **Quando usar:** Programas de computador que exigem o runtime Node.js completo no processo principal ou bibliotecas nativas do ecossistema Node (mesma arquitetura do VS Code e Cursor).
* **Comando oficial de criação:**
  ```bash
  npm create @quick-start/electron@latest
  ```
* **Composição padrão:** Electron, Vite, TypeScript (`strict`), Preload isolado (`contextBridge`), React + Tailwind CSS, Electron-Builder.
* **Executor de Testes:** Vitest + Playwright (Electron).

### Opção C: Avalonia UI (.NET / C# Multiplataforma)
* **Quando usar:** Softwares corporativos nativos, sistemas industriais, automação comercial (PDV/ERP) ou integrações profundas com o ecossistema .NET no Windows/Linux/macOS.
* **Comando oficial de criação:**
  ```bash
  dotnet new avalonia.mvvm -o <nome-do-projeto>
  ```
* **Composição padrão:** C# (.NET 8+), arquitetura MVVM, compilação nativa e xUnit para testes.

### Opção D: Flutter (Codebase Única Desktop + Mobile sem WebView)
* **Quando usar:** Quando o requisito central exige compartilhar 100% da interface compilada nativamente entre Desktop (Windows/macOS/Linux) e Mobile (Android/iOS) sem depender de WebView.
* **Comando oficial de criação:**
  ```bash
  flutter create <nome-do-projeto>
  ```
* **Composição padrão:** Dart com null-safety estrita, Riverpod/Bloc, `flutter_test` e `integration_test`.

---

## 7. Utilitários de Linha de Comando (CLI) e Automação

### Opção A: Python Moderno (`uv` + Typer + Rich)
* **Quando usar:** Ferramentas de terminal, automações de engenharia, pipelines de dados e CLIs com integração de IA.
* **Comando oficial de criação:**
  ```bash
  uv init --app <nome-do-projeto>
  uv add typer rich pydantic
  uv add --dev pytest ruff pyright
  ```
* **Composição padrão:** Python gerenciado via `uv`, Typer (argumentos tipados), Rich (interface visual no terminal), Pydantic v2 e Pytest.

### Opção B: Rust CLI (`Cargo` + Clap)
* **Quando usar:** Utilitários de sistema de altíssima velocidade distribuídos como binário único sem dependências externas.
* **Comando oficial de criação:**
  ```bash
  cargo init <nome-do-projeto>
  cargo add clap --features derive
  ```
* **Composição padrão:** Rust, Clap (parser declarativo tipado), Serde e `cargo test`.

---

## 8. Infraestrutura VPS, Tempo Real, Filas e Operação Assistida (MCP / CLI)

Quando o sistema exigir processos contínuos em segundo plano (ex.: CRMs com WhatsApp/Evolution API, filas de mensagens programadas, orquestração de múltiplos agentes de IA, WebSockets em tempo real e bancos de dados dedicados):

### A. Mensageria, Filas Agendadas e Tempo Real
* **Filas e Agendamentos Resilientes:** **Redis + BullMQ** (Node/TS) ou **Celery / ARQ** (Python). Garante que tarefas programadas ("enviar mensagem daqui a 2h", "follow-up automático após 24h") sobrevivam a reinicializações do servidor com retentativas automáticas.
* **Tempo Real na Interface:** **Server-Sent Events (SSE)** ou **WebSockets (Socket.io / ws / Supabase Realtime)** para atualizar chats, selos de atendimento e colunas de Kanban instantaneamente sem `location.reload`.

### B. Empacotamento e Hospedagem em VPS (Padrão Produção)
* **Containerização Padrão:** `Dockerfile` multi-stage enxuto + `docker-compose.yml` orquestrando Aplicação + PostgreSQL + Redis + Serviços Auxiliares.
* **Painel PaaS Auto-Hospedado na VPS:** **Dokploy** ou **Coolify** instalados na VPS (Hetzner, Hostinger, Contabo, DigitalOcean). Fornecem deploy automático via Git push, SSL/HTTPS automático (Let's Encrypt) e backups de banco.

### C. Operação Assistida pelo Agente (Zero Sofrimento em Painel para o Humano)
Sempre priorize configurar a infraestrutura usando ferramentas que o próprio agente opera diretamente:
1. **Supabase MCP (`supabase`):** Criação de projeto, execução de migrações SQL, configuração de Auth, Realtime e Edge Functions diretamente pelo agente sem o humano precisar operar o painel web.
2. **CLIs Oficiais (`railway`, `flyctl`, `vercel`, `gh`):** O humano apenas autentica uma vez (`login`) e o agente provisiona banco, variáveis de ambiente e deploy pelo terminal.
3. **Acesso SSH / MCP de VPS (Dokploy / Coolify API):** O agente conecta via SSH ou Token de API para instalar o orquestrador Docker e subir toda a stack automaticamente.

---

## 9. Agent Skills Oficiais da Comunidade e MCPs Padrão

Para que o agente não trabalhe isolado nem invente convenções, toda base inicializada deve conectar-se aos ecossistemas oficiais:

### A. MCPs Padrão Injetados na Governança
- **Context7 MCP (`@upstash/context7-mcp`):** Configurado em `.mcp.json` (Padrão Universal). Fornece documentação oficial atualizada e assinaturas de métodos diretamente ao LLM sob demanda, eliminando alucinações de versões antigas.
- **Playwright MCP (`@playwright/mcp`):** Permite ao agente navegar no browser real nos viewports de 320px e desktop, comprovando visualmente estados assíncronos, toasts e modais de confirmação antes do Gate 2.
- **Linear MCP (Oficial via Remote Server `https://mcp.linear.app/mcp`):** Conecta o agente ao fluxo de gestão e diário de bordo do time:
  * Associa a fatia à issue correspondente no Gate 1 (`[LIN-XXX]`).
  * Publica **Project Updates** e resumos de entrega com roteiro prático no Gate 2.
  * Encaminha ideias despriorizadas pelo `refinar-ideia` para o Backlog/Triage do Linear.
  * *Ativação:* Selecione `integrar_linear: true` na inicialização do Copier ou conecte via `npx -y mcp-remote https://mcp.linear.app/mcp`.

### B. Agent Skills Oficiais (`npx skills add <repositorio>`)
Durante o Gate 0, o agente instala as skills oficiais mantidas pelos criadores das tecnologias adotadas:
- **Ecossistema React / Next.js / TypeScript:** `npx --yes skills add vercel-labs/agent-skills`
- **Ecossistema Backend / Supabase:** `npx --yes skills add supabase/agent-skills`
- **Ecossistema de Testes E2E:** `npx --yes skills add microsoft/playwright`
- **Descoberta Dinâmica para Demais Stacks (Python, Rust, Go, Tauri, Expo, Godot):** Execute `npx --yes skills find <tecnologia>` durante o Gate 0 para descobrir e instalar skills oficiais atualizadas do ecossistema adotado.

### C. Controle Leve de Complexidade via Linter Oficial (Zero Custo de Tokens)
Em vez de criar scripts caseiros ou rodar mutadores físicos pesados (que consomem horas e dezenas de dólares em tokens lendo logs gigantescos), o controle de complexidade e duplicação é delegado exclusivamente a regras nativas do linter oficial da stack:
- **Biome (JS/TS):** Ativar a regra de complexidade cognitiva (`complexity: { noExcessiveCognitiveComplexity: "warn" }`).
- **ESLint (JS/TS):** Ativar o limite cyclomatic padrão (`"complexity": ["warn", 10]`).
- **Ruff (Python):** Ativar a métrica de complexidade McCabe (`C901` com `max-complexity = 10`).
- **Proibição de Mutadores Pesados no Fluxo Padrão:** É terminantemente proibido instalar ou rodar frameworks pesados de mutação física de código (como Stryker ou Mutmut) ou geradores de relatórios em massa (`matrix/`) no fluxo padrão de pre-commit e CI, preservando velocidade instantânea (< 50ms) e economia estrita de tokens.

### D. Teto de Higiene MCP e Padrão /llms.txt (Orçamento Enxuto de Contexto)
- **Teto Estrito de MCPs (3 a 5 Servidores Ativos):** Manter dezenas de servidores MCP ativos degrada gravemente a precisão do LLM, satura a janela de contexto com tool schemas a cada turno e induz alucinações. O teto recomendado para operação eficiente é de 3 a 5 servidores ativos (ex.: `context7`, `linear`, `playwright`).
- **Credenciais Read-Only em Bancos Compartilhados:** Ao conectar servidores MCP a bancos relacionais (PostgreSQL, SQLite, Supabase), configure credenciais estritamente de leitura (*read-only*). Mutações e migrações devem ser realizadas exclusivamente via código de migração versionado e testado.
- **Padrão `/llms.txt` para Integrações e SDKs:** Ao adotar bibliotecas de terceiros sem MCP oficial, utilize endpoints padronizados `/llms.txt` (ex.: `curl -s https://docs.exemplo.com/llms.txt`) para injetar documentação curada em Markdown, evitando scraping de páginas HTML inchadas.

---

## 10. Jogos, Gráficos Interativos e Simulações (Browser e Desktop Nativo)

Quando o projeto envolver entretenimento digital, gamificação corporativa, simuladores ou experiências visuais imersivas:

### Opção A: Jogo de Navegador 2D (Phaser 3 + TypeScript `strict` + Vite) — *Padrão Ouro Web 2D*
* **Quando usar:** Jogos 2D para web, minigames promocionais, arcades, plataformas e RPGs 2D.
* **Comando oficial de criação:**
  ```bash
  npm create @phaserjs/template-vite-ts@latest <nome-do-projeto>
  ```
* **Composição padrão:** Phaser 3, TypeScript (`strict`), Vite, Vitest.
* **Regra de Ouro de Desacoplamento:** A lógica de jogo (máquinas de estado, regras de pontuação, inventário, cálculos de dano e colisões matemáticas AABB puras) deve residir em classes e módulos puros desacoplados da renderização. Os testes automatizados (Vitest) validam 100% das regras em < 50ms sem precisar instanciar canvas WebGL no terminal.

### Opção B: Jogo de Navegador 3D / WebGL (Three.js / React Three Fiber + TypeScript + Vite)
* **Quando usar:** Experiências 3D imersivas no navegador, visualizadores de produto, simulações espaciais e minigames 3D.
* **Comando oficial de criação:**
  ```bash
  npm create vite@latest <nome-do-projeto> -- --template react-ts
  npm install three @types/three @react-three/fiber @react-three/drei
  ```
* **Composição padrão:** Three.js, React Three Fiber, TypeScript, Vite, Vitest.
* **Viewport e Portabilidade:** Canvas responsivo com aspect ratio adaptativo (mínimo 320px) e suporte a modo tela cheia (`fullscreen`) PWA instalável.

### Opção C: Jogo Nativo Instalado no Computador (Godot Engine 4 — C# ou GDScript) — *Padrão Ouro Desktop*
* **Quando usar:** Jogos completos para computador (Windows, Linux, macOS) e mobile, 2D e 3D.
* **Estrutura padrão:** Manifesto `project.godot`, pastas `scenes/`, `scripts/`, `assets/`, `tests/`.
* **Framework de Testes:** GUT (*Godot Unit Testing*) executado em modo headless via CLI (`godot --headless -s addons/gut/gut_cmdln.gd`) para pre-commit e CI instantâneos.

### Opção D: Jogo Nativo Baixo Nível / Ultra-Performance (Rust + Bevy ECS ou Raylib)
* **Quando usar:** Jogos de altíssima performance, simulações com dezenas de milhares de entidades simultâneas ou engines personalizadas.
* **Comando oficial de criação:**
  ```bash
  cargo init <nome-do-projeto>
  cargo add bevy
  ```
* **Composição padrão:** Rust, Bevy (arquitetura ECS - Entity Component System) e `cargo test` para testar sistemas e componentes puros sem abrir janela gráfica.

---

## 11. Extensões de Navegador e Produtos AI-Native

### A. Extensões de Navegador (Manifest V3 — Chrome / Firefox / Edge)
* **Quando usar:** Extensões modernas com popup, side panel, content scripts isolados e HMR instantâneo.
* **Comando oficial de criação:**
  ```bash
  npx wxt@latest init <nome-do-projeto>
  ```
* **Composição padrão:** WXT, React + TypeScript (`strict`), Tailwind CSS, Zod na ponte de mensageria e Vitest.

### B. Produtos AI-Native (Agentes, RAG, Workflows Duráveis)
* **Diretriz de Pesquisa Viva:** Como o ecossistema de IA evolui semanalmente, consulte sempre `context7` / `/llms.txt` no Gate 0 antes de cravar SDKs e padrões (ex.: **Vercel AI SDK** para streaming/tool-calling/UI, **PostgreSQL + `pgvector`** para busca semântica unificada e workflows/filas duráveis para tarefas assíncronas de longa duração), evitando copiar padrões obsoletos da memória de treinamento.
