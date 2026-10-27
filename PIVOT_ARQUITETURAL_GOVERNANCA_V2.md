# Pivot Arquitetural — Governança v2 (Protocolo Agêntico)

> **Papel:** Decisão arquitetural. **Status:** Aprovado. **Índice:** [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md)
> **Atualizado:** 27/10/2026 (revisão: comandos das stacks corrigidos; Gate 0 explícito)

---

## 1. A Decisão

A v2 **abandona** o servidor local (Next.js + SQLite), o painel de escolha de perfil, o painel do satélite (`ui.mjs`) e o gerador por templates interpolados.

No lugar, entra um **protocolo agêntico**:
1. Um comando leve injeta a governança (padrões oficiais + regras pessoais).
2. O agente entrevista o desenvolvedor sobre o escopo.
3. O agente propõe e, com aprovação, instala a fullstack oficial mais adequada.
4. O desenvolvimento segue o ciclo guiado por especificação.

## 2. v1 vs. v2

| Dimensão | v1 | v2 |
|---|---|---|
| Infraestrutura | Servidor Next.js + SQLite + rotas | Nenhuma: arquivos + agente |
| Escolha da stack | Formulário fixo (`localhost:3000`) | Entrevista contextual com o agente |
| Geração do código | Templates congelados (`{{variavel}}`) | CLI oficial da stack, versão mais recente |
| Manutenção | Alta (servidor, banco, templates) | Baixa (padrões da indústria) |
| Painel | `ui.mjs` na porta 3333 | A própria IDE |
| Atualizar projetos existentes | `sincronizar.mjs` | `uvx copier update` com separação de propriedade de arquivos (**D13**) |

## 3. Protocolo de Inicialização

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Desenvolvedor
    participant Ag as Agente
    participant Gov as Governança v2
    participant OSS as CLI oficial da stack

    Dev->>Gov: Instala a governança na pasta
    Dev->>Ag: "Novo projeto para o problema X"
    Ag->>Gov: Lê AGENTS.md + constituição
    Ag->>Dev: Entrevista de escopo
    Dev->>Ag: Respostas
    Ag->>Dev: Proposta de stack com justificativa
    Dev->>Ag: Gate 0: aprovado
    Ag->>OSS: Executa o scaffolder oficial
    Ag->>Ag: Roda build + testes da stack recém-criada (prova de saúde)
    Ag->>Dev: Stack pronta; abre o 1º delta de spec
```

### Entrevista de escopo (mínima)
1. Qual problema e para quem?
2. Canal principal: **Programa de Computador (Desktop Windows/Mac/Linux)**, Web SaaS, painel interno, API/servidor, mobile ou utilitário de terminal (CLI)?
3. Exigências fixas: acesso a hardware/arquivos locais, funcionamento offline, instalador nativo (`.exe`/`.msi`), banco local (SQLite) ou na nuvem?
4. Escala e prazo esperados (MVP para validar ou produto para operar)?

### Scaffolders oficiais (verificados em 27/10/2026)

> Comandos mudam. **Regra:** antes de executar, o agente confere o README oficial atual da stack.

| Escopo | Comando |
|---|---|
| **Programa de Computador (Desktop leve e nativo)** | `npm create tauri-app@latest` (Tauri v2: UI em React/TS/Tailwind + núcleo nativo em Rust, gera `.exe`/`.msi` leve) |
| **Programa de Computador (Desktop com Node.js completo)** | `npm create @quick-start/electron@latest` (Electron + Vite + TypeScript, padrão VS Code) |
| **Programa de Computador (.NET / Corporativo Multiplataforma)** | `dotnet new avalonia.mvvm -o <nome>` (Avalonia UI + C#/.NET) |
| SaaS fullstack (TS) | `npm create t3-app@latest` · `npx create-epic-app@latest` |
| Mobile | `npx create-expo-stack@latest` |
| API Node | `npx @nestjs/cli new <nome>` |
| API Python fullstack | `copier copy https://github.com/fastapi/full-stack-fastapi-template.git <nome>` |
| Utilitário de Terminal (CLI) | `uv init --app` (+ Typer/Rich em Python) · `cargo init` (+ Clap em Rust) |
| Site de conteúdo | `npm create astro@latest` |

## 4. Depois da Instalação

O agente **não** escreve código solto. Abre um delta de spec para a primeira funcionalidade → plano (**Gate 1**) → tarefas → Test-First → entrega com evidências (**Gate 2**). Correções pequenas seguem o nível rápido (**P4**).

## 5. Ganhos

- Nenhum processo rodando à toa na máquina.
- Projetos novos nascem com as versões atuais das stacks.
- Fim do "HTML de brinquedo" que trava quando o produto cresce.
