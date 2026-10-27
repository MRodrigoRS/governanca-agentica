# Visão — Governança v2 (Kit de Governança Agêntica)

> **Papel:** Visão geral. **Status:** Vigente. **Índice:** [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md)
> **Atualizado:** 27/10/2026 (revisão: alinhado ao PIVOT; estrutura corrigida para os padrões oficiais)

---

## 1. O Problema

Começar um projeto com agentes de IA hoje exige montar à mão: regras para cada ferramenta, ciclo de especificação, ADRs, MCPs, testes e CI. Sem isso, o agente improvisa a stack, esquece decisões e entrega sem evidência.

A v1 (`rr-controle-de-agentes`) resolveu parte disso, mas ficou **inchada** (dezenas de Markdown estáticos), **caseira** (convenções próprias em vez de padrões da indústria) e **pesada** (servidor, banco e painel só para gerar projetos).

## 2. O Objetivo

Um repositório próprio de governança que, instalado em qualquer pasta:

1. Injeta os **padrões oficiais da indústria** com as **suas regras inegociáveis**.
2. Faz o agente **entrevistar** você sobre o que o software é e onde vai rodar.
3. Faz o agente **instalar a stack moderna adequada** pelo CLI oficial dela.
4. Conduz o desenvolvimento por **especificação → plano → tarefas → testes**, com gates humanos.

## 3. Os 5 Pilares

| Pilar | Função | Padrão adotado |
|---|---|---|
| **Bússola** | O que fazer, em que ordem | `constitution.md` + **OpenSpec** (`openspec/specs/` + `openspec/changes/`, decisão **D11**) |
| **Guarda-corpo** | Regras inegociáveis | `constitution.md` + `AGENTS.md` (padrão aberto) |
| **Memória** | Decisões e estado atual | Base viva (`openspec/specs/`) + `docs/adr/` (MADR) + `CHANGELOG.md` |
| **Mãos** | Agir no mundo real | MCP (servidores oficiais) + Agent Skills (`SKILL.md`) |
| **Espelho** | Provar que funciona | Test-First, linters, type-check, hooks e CI |

**Regra transversal:** texto sozinho é sugestão. Toda regra crítica precisa de um **mecanismo de aplicação** (teste, hook ou CI). Foi a lição da v1 (lacuna L4).

## 4. Estrutura Instalada no Projeto

```text
projeto/
├── AGENTS.md                         # Fonte única de instruções para os agentes (padrão aberto)
├── CLAUDE.md / GEMINI.md             # Ponteiros finos para AGENTS.md
├── .github/copilot-instructions.md   # Ponteiro fino para AGENTS.md
├── .cursor/rules/governanca.mdc      # Ponteiro fino para AGENTS.md
├── constitution.md                   # Cláusulas pétreas
├── openspec/                         # Motor de specs oficial (D11)
│   ├── project.md                    # Contexto e convenções da stack do projeto
│   ├── specs/                        # Base viva do sistema por domínio
│   └── changes/                      # Deltas ativos e archive/
├── docs/adr/                         # Registros de decisão (MADR)
├── .agents/skills/<skill>/SKILL.md   # Skills ativas no padrão Agent Skills
├── <config MCP por ferramenta>       # .vscode/mcp.json, .cursor/mcp.json, .mcp.json (P6)
├── .github/workflows/ci.yml          # Validação automática
└── CHANGELOG.md                      # Keep a Changelog
```

A **stack da aplicação** não vem do kit. O agente a instala depois da entrevista ([PIVOT](PIVOT_ARQUITETURAL_GOVERNANCA_V2.md)).

## 5. Fluxo de Uso

1. Pasta nova (ou projeto existente, **P9**) → executa o comando de instalação da governança (**P3**).
2. Abre o agente → ele lê `AGENTS.md` e a constituição → faz a entrevista de escopo.
3. Propõe a stack → **Gate 0 (aprovação)** → executa o CLI oficial da stack.
4. Primeira funcionalidade via delta de spec → **Gate 1 (plano)** → Test-First → **Gate 2 (entrega com evidências)**.
