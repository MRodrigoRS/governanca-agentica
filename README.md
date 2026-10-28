# Governança v2 — Kit de Governança Agêntica

> **Protocolo agêntico aberto para desenvolvimento de software com agentes de inteligência artificial.**
> Baseado em padrões oficiais da indústria (OpenSpec, Copier, Lefthook, Gitleaks, MADR e Agent Skills). Zero servidores locais, zero convenções proprietárias frágeis.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Produção](https://img.shields.io/badge/Status-Governança%20v2-success.svg)](00_INDICE_E_DECISOES.md)

---

## 1. Visão Geral

Desenvolver software profissional em parceria com agentes de IA exige três coisas que a maioria dos repositórios não possui:
1. **Regras inegociáveis** que a IA não pode violar ou esquecer (cláusulas pétreas, tipagem estrita, Test-First).
2. **Ciclo guiado por especificação viva** que impede o agente de alucinar ou produzir código descartável.
3. **Auditoria determinística:** o agente executa, mas quem fiscaliza e trava a entrega (`exit 1`) é o algoritmo da governança (Git hooks e CI), com **Zero-Trust no Agente**.

A **Governança v2** substitui plataformas pesadas e templates interpolados por um protocolo ágil distribuído em uma linha.

---

## 2. Como Usar

### 2.1. Instalação em Qualquer Pasta (Nova ou Existente)

Em qualquer terminal com `uv` e `git` instalados, execute:

```bash
uvx copier copy gh:MRodrigoRS/governanca-v2 .
```

O instalador perguntará o nome do projeto e detalhes básicos, injetando a governança imediatamente.

### 2.2. O Primeiro Contato com o Agente

Ao abrir sua IDE de preferência (Antigravity, Cursor, Claude Code, VS Code com Copilot, etc.), envie uma mensagem simples:

> *"Iniciando novo projeto para resolver o problema X."*

O agente lerá automaticamente [AGENTS.md](template/AGENTS.md) e [constitution.md](template/constitution.md):
1. **Entrevista Exaustiva e Polimento de Produto (Multi-Rodadas):** O agente conversa com você para extrair toda a visão do sistema, aponta casos de borda, sugere melhorias e separa claramente **o que entra** do **que foi descartado no polimento**.
2. **Recomendação de Stack, VPS e MCPs:** O agente consulta o catálogo oficial (Web, Desktop, Mobile, API, CLI, Filas e VPS operada por MCP/CLI) e sugere a arquitetura ideal em português claro.
3. **Decomposição em Fatias Incrementais Detalhadas (`openspec/roadmap/`):** O próprio agente divide o sistema inteiro na ordem técnica onde uma ponta puxa a outra, criando um arquivo detalhado (`fatia-01-*.md`, `fatia-02-*.md`, etc.) com 7 seções completas para cada entrega — permitindo que até um modelo mais leve saiba implementar sem adivinhar regras.
4. **Gate 0 (Aprovação):** Após sua confirmação humana, o agente roda o CLI oficial da stack, valida os testes iniciais e já puxa automaticamente a **Fatia 01**.

### 2.3. Atualização Contínua Sem Conflitos

Quando a governança evoluir com novas regras ou melhorias:

```bash
uvx copier update
```

O Copier utiliza mesclagem de 3 vias via Git. Arquivos mistos como `AGENTS.md` e `constitution.md` possuem blocos delimitados: as regras oficiais são atualizadas automaticamente, enquanto as regras locais e as fatias do seu projeto (`openspec/project.md` e `openspec/roadmap/fatia-*.md`) são 100% preservadas.

---

## 3. Os 5 Pilares

| Pilar | Função | Tecnologia Oficial Adotada |
|---|---|---|
| **Bússola** | O que fazer, em que ordem e por quê | `constitution.md` + `openspec/roadmap/` + **OpenSpec** (`openspec/specs/` + `openspec/changes/`) |
| **Guarda-corpo** | Cláusulas pétreas inegociáveis | `constitution.md` + `AGENTS.md` (padrão aberto multi-ferramenta) |
| **Memória** | Decisões arquiteturais e estado atual | Base viva de especificações + `docs/adr/` (MADR) + `CHANGELOG.md` |
| **Mãos** | Capacidades e ferramentas ativas | MCPs sob demanda + Agent Skills abertas (`.agents/skills/`) |
| **Espelho** | Provar que funciona determinísticamente | Test-First, Lefthook, Gitleaks, `verificar-governanca.mjs` e GitHub Actions |

---

## 4. Níveis de Cerimônia e Gates

### Dois Níveis de Cerimônia (D14)

* **Nível 1 — Via Rápida (`/fix`):** Correções pontuais de bugs ou ajustes sem alteração de comportamento especificado. Toca em no máximo **3 arquivos de lógica**, não requer abertura de delta de spec, mas **exige teste reproduzindo o bug antes da correção (vermelho → verde)** e aprovação no Gate 2.
* **Nível 2 — Ciclo Completo (Feature / Fatia Incremental):** Consome a fatia detalhada de `openspec/roadmap/fatia-XX-*.md`, abre o delta no OpenSpec (`proposal.md`, `specs/`, `design.md`, `tasks.md`), passa pelo **Gate 1 (Plano)**, Test-First e **Gate 2 (Evidências)** antes de arquivar (`openspec archive`) e puxar automaticamente a próxima fatia da fila.

*Trava de Escalonamento Automático e Anti-Preguiça:* Se um `/fix` tocar em mais de 3 arquivos ou modificar manifestos de dependência/banco, ou se uma fatia/delta for criada de forma vazia/resumida, o algoritmo `verificar-governanca.mjs` bloqueia o commit (`exit 1`).

### Os 3 Gates Humanos

* **Gate 0:** Aprovação do escopo polido, da stack tecnológica/VPS/MCPs e do Mapa de Fatias Incrementais (`openspec/roadmap/`).
* **Gate 1:** Aprovação da proposta e do design técnico da fatia atual antes de escrever o código.
* **Gate 2:** Aprovação da entrega com evidência obrigatória (saída do teste falhando e depois passando, diff limpo e `CHANGELOG.md` atualizado), seguida pela puxada automática da próxima fatia.

---

## 5. Estrutura de Arquivos Injetada

```text
seu-projeto/
├── AGENTS.md                         # Fonte única da verdade para agentes de IA
├── CLAUDE.md / GEMINI.md             # Ponteiros finos universais
├── .github/
│   ├── copilot-instructions.md       # Ponteiro fino para Copilot
│   └── workflows/ci.yml              # CI determinístico no GitHub Actions
├── .cursor/rules/governanca.mdc      # Ponteiro fino para o Cursor
├── constitution.md                   # Cláusulas pétreas e padrões de engenharia
├── openspec/                         # Motor de specs oficial (OpenSpec)
│   ├── project.md                    # Visão polida, stack/MCPs e Mapa de Fatias Incrementais
│   ├── radar-oportunidades.md        # Inteligência de mercado, concorrência, sinergias e ideias futuras
│   ├── roadmap/                      # Fatias detalhadas individuais (fatia-01-*.md + _template-fatia.md)
│   ├── specs/                        # Base viva de especificações por domínio
│   └── changes/                      # Deltas ativos e archive/
├── docs/adr/                         # Registros de Decisão de Arquitetura (MADR)
│   ├── 0000-usar-madr.md
│   └── template.md
├── lefthook.yml                      # Orquestrador de Git Hooks (pre-commit e commit-msg)
├── scripts/
│   ├── verificar-governanca.mjs      # Fiscal determinístico (Cerimônia, Changelog e Anti-Preguiça)
│   └── validar-commit-msg.mjs        # Validação de mensagens de commit (PT-BR)
├── .agents/skills/                   # Skills no padrão Agent Skills
│   ├── inicializar-stack/            # Entrevista exaustiva, fatiamento e catálogo oficial
│   ├── ciclo-especificacao/          # Guia prático de OpenSpec, Test-First e fila de fatias
│   ├── explorar-produto/             # Modo estratégico: mercado, concorrência e sinergias (sem código)
│   └── atualizar-governanca/         # Guia de atualização via Copier
└── CHANGELOG.md                      # Histórico Keep a Changelog
```

---

## 6. Registro de Decisões do Projeto

Todas as decisões de design da Governança v2 foram debatidas, fundamentadas e registradas formalmente:

* [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md) — Índice geral e as 19 Decisões Fechadas (`D1` a `D19`).
* [PIVOT_ARQUITETURAL_GOVERNANCA_V2.md](PIVOT_ARQUITETURAL_GOVERNANCA_V2.md) — O abandono do servidor/UI e a adoção do protocolo agêntico.
* [ESTRATEGIA_DE_PRESETS_E_STACKS_ROBUSTAS.md](ESTRATEGIA_DE_PRESETS_E_STACKS_ROBUSTAS.md) — Catálogo de stacks e Cláusula Anti-Brinquedo.
* [SINTESE_FRAMEWORKS_SDD_E_GOVERNANCA_V2.md](SINTESE_FRAMEWORKS_SDD_E_GOVERNANCA_V2.md) — Síntese metodológica (Spec Kit, OpenSpec, Kiro, BMAD).
* [PROPOSTA_DISTRIBUICAO_E_ATUALIZACAO.md](PROPOSTA_DISTRIBUICAO_E_ATUALIZACAO.md) — Distribuição e atualização via Copier.
* [PROPOSTA_CERIMONIA_E_ENFORCEMENT.md](PROPOSTA_CERIMONIA_E_ENFORCEMENT.md) — Níveis de cerimônia e aplicação determinística Zero-Trust.

---

## 7. Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE) para mais informações.
