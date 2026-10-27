# Estratégia de Stacks Robustas e Cláusula Anti-Brinquedo

> **Papel:** Catálogo técnico + cláusula constitucional. **Status:** Vigente. **Índice:** [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md)
> **Atualizado:** 27/10/2026 (revisão: "presets" = catálogo de referência do agente, não gerador; comandos corrigidos)

---

## 1. O Problema: a Armadilha do Brinquedo

Um pedido simples ("crie uma tela") leva o agente ao caminho mais curto: HTML, CSS e JS soltos. Conforme entram autenticação, banco, pagamentos e estado complexo, o código vira espaguete e precisa ser reescrito.

Sintomas: sem tipagem nem contratos (o agente alucina propriedades), CSS feito à mão (inconsistência visual), nenhum executor de testes (o agente não tem como se autocorrigir).

## 2. O Princípio

**Toda aplicação interativa nasce em base de produção**, mesmo que seja uma página só. Se não crescer, a base não atrapalha; se crescer, não precisa reescrever.

## 3. O que "Preset" Significa na v2

Na v1, preset era um registro no banco da Progenitora que alimentava o gerador. Na v2, **preset é uma entrada de catálogo que o agente consulta durante a entrevista** para recomendar a stack. Não existe gerador próprio; a instalação usa o CLI oficial ([PIVOT](PIVOT_ARQUITETURAL_GOVERNANCA_V2.md)).

## 4. Catálogo de Referência

| Escopo | Stack recomendada | Composição típica |
|---|---|---|
| **Programa de Computador (Desktop moderno e leve)** | **Tauri v2** (`create-tauri-app`) | UI em React/TS + Tailwind + shadcn/ui + núcleo nativo em Rust + SQLite local + instalador `.exe`/`.msi`/`.dmg` de ~5 MB |
| **Programa de Computador (Desktop com Node.js completo)** | **Electron-Vite** (`@quick-start/electron`) | Processo principal Node.js + Preload isolado (`contextBridge`) + Renderer React/TS + Electron-Builder |
| **Programa de Computador (Nativo C#/.NET)** | **Avalonia UI** (`avalonia.mvvm`) | C# + .NET + MVVM + compilação nativa Windows/Linux/macOS |
| **SaaS web fullstack** | T3 Stack · Epic Stack | T3: Next.js + TS + Tailwind + tRPC + Drizzle/Prisma + Auth.js. Epic: React Router (ex-Remix) + TS + Prisma + SQLite + Playwright/Vitest + autenticação completa |
| **Painel interno / dashboard** | Next.js + shadcn/ui | Tailwind + Radix + React Hook Form + Zod |
| **API Node** | NestJS (ou Fastify) | Camadas/DI, validação, OpenAPI, Docker |
| **API Python** | Full Stack FastAPI Template | FastAPI + Pydantic + SQLModel + PostgreSQL + Docker + Pytest |
| **Mobile** | Create Expo Stack | Expo Router + TS + NativeWind |
| **Utilitário / Automação CLI** | Python (`uv` + Typer + Rich) · Rust (`Clap`) | Empacotável em binário/executável, argumentos tipados e testes |
| **Site de conteúdo / landing** | Astro + Tailwind | JS mínimo no cliente, ótimo SEO |

> O catálogo é **ponto de partida, não lista fechada**. O agente pode propor outra stack se justificar por escrito; ela entra só com aprovação no Gate 0. Herança da v1: "não-reinvenção" + "dependências justificadas".

## 5. Cláusula Pétrea: Proibição de Bases Frágeis

> 1. É proibido iniciar aplicação interativa (Web, Desktop ou Mobile) com arquivos avulsos (como HTML/JS solto na web ou scripts Tkinter/PyQt amadores num único arquivo no desktop), sem tipagem, sem arquitetura de pacotes e sem testes.
> 2. Toda aplicação parte de uma stack do catálogo (ou aprovada no Gate 0) e garante desde o 1º commit:
>    - **Tipagem estrita:** TypeScript `strict`, Rust, C# ou Python com type hints verificados.
>    - **Validação de entradas e fronteiras IPC:** Zod/Pydantic/Serde em toda fronteira (HTTP ou ponte IPC entre tela e sistema operacional no Desktop).
>    - **Design system:** componentes reutilizáveis (ex.: shadcn/ui + Tailwind ou equivalente nativo).
>    - **Testes funcionando:** executor configurado e ao menos um teste passando.
> 3. **Exceção:** artefatos que de fato são estáticos (protótipo descartável, documento HTML), declarados assim no Gate 0.

**Aplicação real (não só texto):** o CI e o Lefthook falham sem type-check, lint e testes verdes (**D15**).
