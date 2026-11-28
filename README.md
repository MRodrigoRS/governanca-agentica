# Governança v4 — Kit de Governança Agêntica Universal

> **Protocolo agêntico aberto e universal para desenvolvimento de software com agentes de inteligência artificial.**
> Baseado em padrões abertos e oficiais da indústria: Padrão Universal (`AGENTS.md` + `.agents/`), OpenSpec, Copier, Lefthook, Gitleaks, MADR e Agent Skills. Zero servidores locais, zero wrappers proprietários redundantes.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Produção](https://img.shields.io/badge/Status-Governança%20v4.9.0-success.svg)](00_INDICE_E_DECISOES.md)

---

## 1. Visão Geral

Desenvolver software profissional em parceria com agentes de IA exige três princípios que a maioria dos repositórios não possui:
1. **Regras inegociáveis** que a IA não pode violar ou esquecer (cláusulas pétreas, tipagem estrita, Test-First, Testing Trophy anti-mock de banco e design system nativo).
2. **Ciclo guiado por especificação viva (SDD com Rolling Wave)** que impede o agente de alucinar ou produzir código descartável, detalhando a arquitetura Just-in-Time no momento de cada fatia.
3. **Auditoria determinística:** o agente executa, mas quem fiscaliza e trava a entrega (`exit 1`) é o algoritmo da governança (Git hooks via Lefthook e GitHub Actions CI), com **Zero-Trust no Agente**.

A **Governança v4** consolida o **Padrão Universal Puro**: um único ponto de verdade agnóstico (`AGENTS.md` e `.agents/`) reconhecido por qualquer harness moderno (Antigravity, Cursor, Claude Code, GitHub Copilot, Codex, etc.), sem inchaço de dezenas de arquivos de configuração proprietários duplicados.

---

## 2. Como Usar

### 2.1. Instalação em Qualquer Pasta (Nova ou Existente)

Em qualquer terminal com `uv` e `git` instalados, execute:

```bash
uvx copier copy gh:MRodrigoRS/governanca-agentica .
```

O instalador interativo perguntará o nome do projeto, perfis de arquitetura (`web-ui`, `api-backend`, `desktop`, `mobile`, `jogo`, `cli-biblioteca`) e integrações (Linear MCP e fluxo Git), injetando a governança imediatamente.

### 2.2. O Primeiro Contato com o Agente

Ao abrir sua ferramenta ou IDE de preferência, envie uma mensagem simples:

> *"Iniciando novo projeto para resolver o problema X."*

O agente lerá automaticamente [AGENTS.md](template/AGENTS.md) e [constitution.md](template/constitution.md):
1. **Entrevista Exaustiva e Polimento de Produto (Multi-Rodadas):** O agente conversa com você para extrair toda a visão do sistema, aponta casos de borda, sugere melhorias e separa claramente **o que entra** do **que fica de fora**.
2. **Recomendação de Stack, VPS e MCPs:** O agente consulta o catálogo oficial de stacks robustas (Web, Desktop, Mobile, API, CLI, Jogos 2D/3D e VPS assistida por MCP/CLI) e sugere a arquitetura ideal em português claro.
3. **Mapa Macro de Capacidades & Fatiamento Cirúrgico Just-in-Time (`openspec/roadmap.md`):** No Gate 0, o agente consolida os Invariantes Globais, o Mapa Macro de Capacidades e apenas a `fatia-01-fundacao`. As fatias seguintes (`fatia-02+`) são descobertas uma por vez via `/fatiar` (`planejar-proxima-fatia`) sobre o código real + livro de conhecimento, sem planejamento speculativo no escuro.
4. **Gate 0 (Aprovação):** Após sua confirmação humana explícita, o agente roda o CLI oficial da stack, valida os testes iniciais e já puxa a `fatia-01-fundacao`.

### 2.3. Atualização Contínua Sem Conflitos

Quando a governança evoluir com novas regras ou melhorias:

```bash
uvx copier update
```

O Copier utiliza mesclagem de 3 vias via Git. Arquivos mistos como `AGENTS.md` e `constitution.md` possuem blocos delimitados (`governanca:inicio` / `governanca:fim`): as regras oficiais são atualizadas automaticamente, enquanto as regras locais, documentação viva (`docs/arquitetura.md`, `docs/catalogo-reuso.md`) e fatias do seu projeto (`openspec/roadmap.md`) são 100% preservadas.

---

## 3. Os 5 Pilares

| Pilar | Função | Tecnologia Oficial Adotada |
|---|---|---|
| **Bússola** | O que fazer, em que ordem e por quê | `constitution.md` + `openspec/roadmap.md` (Rolling Wave) + **OpenSpec** (`openspec/specs/` + `openspec/changes/`) |
| **Guarda-corpo** | Cláusulas pétreas inegociáveis | `constitution.md` + `AGENTS.md` + `.agents/rules/` (Padrão Universal Modular por Glob) |
| **Memória** | Decisões arquiteturais, reúso e estado atual | Base viva de especificações + `docs/arquitetura.md` + `docs/catalogo-reuso.md` + `docs/adr/` (MADR) + `CHANGELOG.md` |
| **Mãos** | Capacidades e ferramentas ativas | MCPs universais sob demanda (`.mcp.json`) + Agent Skills universais (`.agents/skills/`) |
| **Espelho** | Provar que funciona determinísticamente | Testing Trophy (anti-mock de banco), Lefthook (`pre-commit` e `pre-push`), Gitleaks, `verificar-governanca.mjs` e GitHub Actions |

---

## 4. Níveis de Cerimônia, Gates e Rotina de Commits

### 4.1. As 4 Vias Proporcionais de Cerimônia (D32)

* **Via 1a — Correção de Bug (`/fix`):** Correções pontuais de defeitos em até 3 arquivos de lógica de produção. **Exige teste automatizado demonstrando o bug staged (vermelho → verde)** antes do código de correção e aprovação humana no Gate 2.
* **Via 1b — Cosmético Puro (`style:`):** Ajustes de formatação, lint e documentação. Proibido tocar em lógica, branches condicionais ou dependências. Não exige teste automatizado.
* **Via 1.5 — Manutenção Estrutural:** Refatorações, otimizações de performance ou chore (`refactor:`, `perf:`, `chore:`, `build:`) tocando em mais de 3 arquivos ou bump de versão existente em dependências já declaradas. Valida que testes continuam verdes, mas **bloqueia sumariamente** modificações de banco/migrações, novas dependências e adições de features sem spec.
* **Via 2 — Ciclo Completo (Feature / Fatia Incremental):** Consome a fatia do roadmap, abre o delta no OpenSpec (`openspec new change <nome>`), passa pelo **Gate 1 (Plano)**, ciclo Test-First com Testing Trophy e **Gate 2 (Evidências)** antes de arquivar (`openspec archive`) e convidar a próxima fatia.

### 4.2. Os 3 Gates Humanos e a Rotina de Commits Cadenciada (D21)

O agente é proibido de realizar commits avulsos ou intermediários sem autorização. A rotina de commits é estruturada em dois marcos consolidados:

* **Gate 0 (Marco 1 de Commit — Fundação Inicial):** Aprovação do escopo polido, stack tecnológica, MCPs, tokens base de design e Mapa Rolling Wave (`openspec/roadmap.md`). Primeiro commit fundacional autorizado (`feat(fundacao): inicializa projeto com stack e mapa de fatias`).
* **Gate 1 (Plano):** Aprovação da proposta, design técnico e tarefas da fatia atual via artefato nativo (`plano-fatia-XX.md`) antes de escrever qualquer código (sem commit de código).
* **Gate 2 (Marco 2 de Commit — Fechamento da Fatia ou Fix):** Aprovação da entrega via artefato (`entrega-fatia-XX.md`) estruturado em:
  1. **Apresentação de Valor:** Resumo funcional conciso (≤ 20 linhas no chat apontando para o artefato).
  2. **🧪 Roteiro de Teste Prático Passo a Passo:** Onde acessar, dados fictícios prontos para copiar e colar e o que observar visualmente na tela.
  3. **Evidências Reais dos Testes:** Testes automatizados executados (vermelho/verde), suíte rápida e diff limpo.
  4. **Revisão Factual Cega (Opcional / Sob Demanda — D38):** O comando `/revisar` pode ser acionado a qualquer momento para convocar o Subagente Inspetor Forense em auditoria cega imparcial.
  5. **Commit Autorizado e Prevenção de Context Rot (D23):** Somente com o aval humano explícito o commit de entrega é efetuado, seguido pela recomendação de renovação de sessão (`/compact` ou nova conversa).

### 4.3. Cláusula Pétrea "Proibido Deduzir de Cabeça" (Artigo 12)

É terminantemente proibido ao agente deduzir ou presumir de memória o escopo de qualquer fatia. A leitura direta do arquivo em disco (`openspec/roadmap.md` e `openspec/changes/<change>/`) é obrigatória nos marcos de planejamento, redação de testes e implementação.

### 4.4. Reúso de Componentes e Padrões de Engenharia (D36 e D37)

* **Reuse-Before-Create (Artigo 14):** Primitivos de UI e regras comuns nascem componentizados; o catálogo `docs/catalogo-reuso.md` possui sensor determinístico anti-apodrecimento.
* **Testing Trophy e Anti-Mock de Banco:** Proibido mockar o próprio banco/ORM em testes de integração (usa-se SQLite in-memory, PGLite ou banco real).
* **Sensor Anti-Monólito com Catraca:** Arquivos de produção são limitados a 350 linhas úteis, com contagem por linguagem e catraca para arquivos legados.
* **Responsividade Móvel, PWA, Toasts e Modais:** Design mobile-first (320px a ultrawide), feedback em Toasts reativos e diálogos de confirmação destrutiva com suporte a `Escape`.

---

## 5. Estrutura de Arquivos Injetada (Padrão Universal Puro)

```text
seu-projeto/
├── AGENTS.md                         # Fonte única da verdade para qualquer agente de IA
├── constitution.md                   # Cláusulas pétreas e padrões inegociáveis de engenharia
├── .mcp.json                         # Configuração universal de servidores MCP
├── lefthook.yml                      # Orquestrador de Git Hooks (pre-commit rápido e pre-push completo)
├── .agents/
│   ├── hooks.json                    # Lifecycle Hooks universais (force_ask no commit e push)
│   ├── rules/                        # Regras modulares carregadas por glob conforme os perfis
│   │   ├── web-ui-pwa.md             # Regras frontend, design system, PWA e Playwright
│   │   ├── backend-seguranca-dados.md# Regras backend, Testing Trophy e anti-mock de banco
│   │   ├── jogos-engines.md          # Regras para Phaser, Three.js, Godot 4 e Bevy
│   │   └── linear-mcp.md             # Protocolo de handshake e isolamento de squads Linear
│   └── skills/                       # Skills no padrão aberto Agent Skills
│       ├── inicializar-stack/        # Entrevista, catálogo de stacks e setup de ferramentas
│       ├── ciclo-especificacao/      # Guia prático de OpenSpec, Test-First e gates
│       ├── refinar-ideia/            # Poda de escopo e decomposição em subfatias
│       ├── explorar-produto/         # Análise estratégica, radar de mercado e sinergias
│       ├── revisar-fatia/            # Auditoria cega forense e conferência pré-Gate 2
│       ├── reuso-e-modularizacao/    # Auditoria de componentes, tokens e anti-monólito
│       └── atualizar-governanca/     # Guia de atualização contínua via Copier
├── openspec/                         # Motor de especificações oficial (OpenSpec)
│   ├── config.yaml                   # Schema spec-driven e regras de artefatos
│   ├── project.md                    # Visão polida, stack/MCPs e âncoras
│   ├── roadmap.md                    # Planejamento Rolling Wave único em ondas
│   ├── radar-oportunidades.md        # Inteligência de mercado e oportunidades
│   ├── specs/                        # Base viva de especificações por domínio
│   └── changes/                      # Deltas ativos e arquivados (archive/)
├── docs/
│   ├── arquitetura.md                # C4 Nível 1/2 Mermaid + erDiagram + Glossário
│   ├── catalogo-reuso.md             # Primitivos de UI, tokens e componentes reutilizáveis
│   ├── particularidades.md           # Peculiaridades técnicas e regras locais do projeto
│   ├── aprendizados.md               # Erros superados e lições aprendidas pela IA
│   └── adr/                          # Registros de Decisão de Arquitetura (MADR)
├── scripts/
│   ├── hook-agente.mjs               # Bridge determinística para Lifecycle Hooks e SessionStart
│   ├── verificar-governanca.mjs      # Fiscal determinístico (Cerimônia, Changelog, Anti-Mock e Reúso)
│   └── validar-commit-msg.mjs        # Validação determinística de mensagens de commit (PT-BR)
└── CHANGELOG.md                      # Histórico Keep a Changelog em SemVer
```

---

## 6. Registro de Decisões e Histórico

Todas as decisões arquiteturais e metodológicas da Governança foram debatidas e formalizadas:

* [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md) — Índice geral e as 51 Decisões Fechadas (`D1` a `D51`).
* [docs/historico/](docs/historico/) — Documentação histórica da transição e pivots arquiteturais (v1 → v2 → v3 → v4).
* [CHANGELOG.md](CHANGELOG.md) — Histórico detalhado de lançamentos e evolução por versão.

---

## 7. Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE) para mais informações.
