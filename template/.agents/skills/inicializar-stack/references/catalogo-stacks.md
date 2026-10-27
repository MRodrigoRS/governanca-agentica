# Catálogo de Stacks Oficiais Robustas — Governança v2

> **Papel:** Catálogo técnico consultado pelo agente para sugerir a stack tecnológica durante o Gate 0.
> **Regra Anti-Brinquedo:** Nenhuma aplicação interativa nasce com arquivos HTML/CSS/JS soltos. Toda base deve ter tipagem estrita, validação de schema e testes.

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

