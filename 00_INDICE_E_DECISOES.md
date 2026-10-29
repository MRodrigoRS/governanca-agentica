# Índice e Registro de Decisões — Governança v2

> **Ponto de entrada do planejamento.** Leia este arquivo primeiro em qualquer sessão nova.
> **Última atualização:** 27/10/2026 (após [revisão](REVISAO_2026-10-27.md))

---

## 1. Mapa dos Documentos

| Documento | Papel | Status |
|---|---|---|
| [PROPOSTA_KIT_GOVERNANCA_AGENTICA.md](PROPOSTA_KIT_GOVERNANCA_AGENTICA.md) | Visão: o que é a governança v2 e o que ela instala | Vigente |
| [PIVOT_ARQUITETURAL_GOVERNANCA_V2.md](PIVOT_ARQUITETURAL_GOVERNANCA_V2.md) | Decisão: sem servidor/UI; o agente entrevista e instala a stack | Vigente |
| [ESTRATEGIA_DE_PRESETS_E_STACKS_ROBUSTAS.md](ESTRATEGIA_DE_PRESETS_E_STACKS_ROBUSTAS.md) | Catálogo de stacks oficiais e cláusula anti-brinquedo | Vigente |
| [SINTESE_FRAMEWORKS_SDD_E_GOVERNANCA_V2.md](SINTESE_FRAMEWORKS_SDD_E_GOVERNANCA_V2.md) | Método: o que absorver de Spec Kit, OpenSpec, Kiro e BMAD | Vigente |
| [PROPOSTA_DISTRIBUICAO_E_ATUALIZACAO.md](PROPOSTA_DISTRIBUICAO_E_ATUALIZACAO.md) | Distribuição e atualização via Copier (D12 + D13) | Vigente |
| [PROPOSTA_CERIMONIA_E_ENFORCEMENT.md](PROPOSTA_CERIMONIA_E_ENFORCEMENT.md) | Níveis de cerimônia e aplicação determinística (D14 + D15) | Vigente |
| [ARQUITETURA_PROGENITORA_E_SATELITES.md](ARQUITETURA_PROGENITORA_E_SATELITES.md) | Análise da v1: o que ela era e o que herdamos | Histórico |
| [REVISAO_2026-10-27.md](REVISAO_2026-10-27.md) | Correções factuais, contradições e lacunas | Registro |

---

## 2. Decisões Fechadas

| ID | Decisão | Origem |
|---|---|---|
| D1 | A v2 é um **protocolo agêntico**: sem servidor local, sem SQLite, sem painel web, sem gerador por templates. | PIVOT |
| D2 | A stack é escolhida **pelo agente após uma entrevista de escopo**, instalada pelo **CLI oficial da própria stack** (versão mais recente) e só **depois da aprovação humana**. | PIVOT |
| D3 | **Cláusula anti-brinquedo:** nenhum app interativo começa com HTML/CSS/JS soltos. Exige tipagem, validação de entradas, design system e testes desde o 1º commit. | PRESETS |
| D4 | Base em **padrões oficiais da indústria**, não em convenções caseiras. | Conversa |
| D5 | **Herança da v1 (o ouro):** Dever de Crítica, Honestidade Radical, Zero-Trust no backend, PT-BR no domínio/EN nos termos técnicos, zero segredos, zero testes quebrados, dependências justificadas, gates humanos, divulgação progressiva, zero dependências no bootstrap. | Análise v1 |
| D6 | **`constitution.md`** (conceito do Spec Kit) guarda as cláusulas pétreas, incluindo **Test-First (vermelho → verde → refatorar)** com evidência do teste falhando. | SÍNTESE |
| D7 | **Base viva de specs + deltas** (conceito do OpenSpec) para a documentação não envelhecer nem inchar. | SÍNTESE |
| D8 | ADRs em `docs/adr/` (formato MADR), sem ferramenta. | Revisão |
| D9 | **`AGENTS.md` é a fonte única** de instruções. `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md` e `.cursor/rules/` apenas apontam para ele. | Revisão |
| D10 | Skills no padrão aberto **Agent Skills (`SKILL.md` + `scripts/` + `references/`)**. | Revisão |
| D11 | **Motor de specs oficial (ex-P1):** **OpenSpec CLI** (`openspec/specs/` + `openspec/changes/`) combinado com `constitution.md` na raiz do repositório. | Aprovado |
| D12 | **Distribuição em 1 linha (ex-P3):** `uvx copier copy gh:MRodrigoRS/<repo-v2> .` (funciona em projetos novos e existentes). | Aprovado |
| D13 | **Atualização contínua (ex-P2):** `uvx copier update` com separação estrita de propriedade de arquivos (da governança, mistos com blocos delimitados e exclusivos do projeto). | Aprovado |
| D14 | **Níveis de cerimônia (ex-P4):** **Nível 1 `/fix`** (até 3 arquivos de lógica, sem mudar requisito, com Test-First e Gate 2) e **Nível 2 Feature** (OpenSpec completo + Gate 1 e Gate 2), com escalonamento automático. | Aprovado |
| D15 | **Aplicação determinística / Zero-Trust no agente (ex-P7):** O agente executa, mas **quem valida e trava é o algoritmo da governança** via **Lefthook + Gitleaks + `openspec validate` + script `verificar-governanca` + GitHub Actions CI**. | Aprovado |
| D16 | **Superação das pendências herdadas da v1 (ex-P5, P6, P8, P9):**<br>• **Memória de sessão (`SESSAO.md`):** superada nativamente por `openspec list`, `tasks.md` do delta ativo e `CHANGELOG.md`.<br>• **Brownfield (`VINCULAR.md`):** superado pelo Copier (`D12`) + natureza *brownfield-first* nativa do OpenSpec (`D11`).<br>• **MCPs (ex-P6):** definidos sob demanda junto com a stack no Gate 0 (`D2`), sem pacote estático inchado.<br>• **28 skills da v1 (ex-P5):** superadas pelo Copier, `AGENTS.md`, OpenSpec e Lefthook/Gitleaks/CI. O único conteúdo técnico herdado são as regras práticas de engenharia de `padroes/frontend.md` (reatividade sem `location.reload`, HTML semântico, `Escape`, alvos de 44px, estados assíncronos) e `padroes/backend.md` (Zero-Trust Anti-F12, ACID, cabeçalhos CSP/HSTS, Rate Limiting, OWASP Agentic Top 10), incorporadas de forma enxuta na `constitution.md`. | Aprovado |
| D17 | **Sem orquestração caseira de multiagentes:** A qualidade e confirmação vêm do próprio fluxo determinístico (OpenSpec + Test-First + Tipagem + Lefthook/Gitleaks/CI). O uso de subagentes/paralelismo fica 100% delegado aos recursos nativos da própria IDE/plataforma (Antigravity, Claude Code, Cursor, GitHub) ou kits externos dedicados, sem criar regras de multiagentes na governança. Da v1 herda-se apenas o **Circuit Breaker de 3 tentativas** na `constitution.md` (falhou 3x seguidas no mesmo teste → para e alinha com o humano). | Aprovado |
| D18 | **Entrevista Exaustiva + Decomposição em Fatias Incrementais Detalhadas (Anti-Preguiça):** O humano descreve a visão do sistema como um todo e não precisa saber dividir em partes técnicas. No Gate 0, o agente conduz uma entrevista multi-rodadas para polir o que entra e o que fica de fora, define a stack/VPS/MCPs (incluindo filas, tempo real e operação assistida via MCP/CLI/SSH) e **decompõe o sistema inteiro em arquivos individuais detalhados** (`openspec/roadmap/fatia-XX-<slug>.md` baseados em `_template-fatia.md`). É proibido comprimir fatias em um único `.md` superficial; o script `verificar-governanca.mjs` audita se cada fatia possui as 7 seções completas para que até um modelo mais fraco saiba implementá-la. Ao concluir cada Gate 2, o agente puxa automaticamente a próxima fatia da fila. | Aprovado |
| D19 | **Modo de Ampliação e Estratégia de Produto (`explorar-produto` + `openspec/radar-oportunidades.md`):** Skill dedicada a sessões de negócios e evolução de produto (com **congelamento estrito de código**). O agente analisa o repositório em busca de sinergias ("ouro barato"), pesquisa concorrentes e mercado na web, classifica oportunidades por Impacto vs. Esforço e encaminha as conclusões para 3 gavetas formais: (1) promoção imediata para fatia detalhada em `openspec/roadmap/fatia-XX-*.md`, (2) estacionamento no arquivo dedicado `openspec/radar-oportunidades.md` (inteligência de mercado + backlog futuro) ou (3) descarte formal em `openspec/project.md`. | Aprovado |
| D20 | **Responsividade e Portabilidade PWA Inatas (Artigo 6, item 6):** Em todo desenvolvimento que envolva a web, o design fluido/responsivo (mobile-first, 320px a ultrawide) e a portabilidade para PWA (`manifest.json`, viewport, cores de tema, ícones adaptativos e service worker) são requisitos inatos da interface, documentados nos padrões de engenharia frontend e no template de fatias, nunca tratados como débito ou tarefa posterior. | Aprovado |
| D21 | **Rotina de Commits Cadenciada por Aprovação Humana (Artigo 11):** O agente é expressamente proibido de realizar commits avulsos ou intermediários sem autorização. Os commits ocorrem em dois marcos consolidados: **Marco 1 — Fundação e Sedimentação Inicial (Gate 0)** (após aprovação humana do scaffold, documentação e fatias em `openspec/roadmap/`) e **Marco 2 — Fechamento de Fatia ou Correção (Gate 2)** (após aprovação final humana das evidências de teste e CHANGELOG). Auditado determinísticamente por `verificar-governanca.mjs` e `validar-commit-msg.mjs`. | Aprovado |
| D22 | **Roteiro Mandatório de Teste Prático e Apresentação no Gate 2 (Artigo 2 e Artigo 8):** É expressamente proibido ao agente encerrar o Gate 2 apenas despejando logs de terminal. Toda entrega deve conter obrigatoriamente: (1) o que foi entregue, (2) roteiro passo a passo com rota/tela/comando, dados fictícios prontos para copiar e colar e comportamento visual esperado na tela, além das evidências de testes automatizados e diff limpo. | Aprovado |
| D23 | **Cláusula Pétrea "Proibido Deduzir de Cabeça" (Artigo 12):** É expressamente proibido ao agente presumir ou deduzir de cabeça qualquer escopo de fatia. A leitura física de `openspec/roadmap/fatia-XX-*.md` é obrigatória nos 4 marcos: (1) ao resumir para o humano, (2) ao abrir o delta (`openspec new`), (3) ao submeter o plano no Gate 1 e (4) imediatamente antes de escrever a primeira linha de teste/código. Além disso, institui a orientação de renovação de sessão (`/compact` ou nova conversa) após o Gate 2 para prevenir saturação de contexto (*Context Rot*). | Aprovado |
| D24 | **Agente Revisor Independente Pré-Gate 2 (Skill `revisar-fatia`):** Antes de apresentar o Gate 2 ao humano e solicitar autorização de commit, o agente executor convoca obrigatoriamente um Agente Revisor Independente (com contexto limpo e imparcial). O Revisor audita o código vs. roadmap físico em 5 pilares (fidelidade, testes substanciais, constituição, escopo fechado e roteiro prático). Havendo ressalvas, o executor deve corrigir antes de chamar o humano; aprovado, o parecer é anexado ao Gate 2. | Aprovado |

---

## 3. Status da Governança v2: Construção Concluída com Sucesso

Todas as decisões arquiteturais, metodológicas e de herança (`D1` a `D24`) foram implementadas e validadas:
- **Distribuição e Atualização (D12 + D13):** `copier.yml` configurado com `_subdirectory: template`, `.copier-answers.yml.jinja`, questionário inicial e `_skip_if_exists` protegendo `openspec/project.md`, `openspec/radar-oportunidades.md` e `openspec/roadmap/fatia-*.md`.
- **Fonte Única e Ponteiros (D9):** `AGENTS.md` enxuto com blocos delimitados, acompanhado por ponteiros finos para Claude, Gemini, Copilot e Cursor.
- **Constituição e Engenharia (D3, D6, D16, D17, D18, D20, D21, D22, D23, D24):** `constitution.md` com 12 artigos pétreos (Anti-Brinquedo, Test-First com Comprovação Prática/Visual, Zero Segredos, Zero Testes Quebrados, Dependências Justificadas, Padrões Frontend com Responsividade e PWA Inatos, Padrões Backend, Entrevista Exaustiva + Fatias Anti-Preguiça, Circuit Breaker de 3 tentativas, PT-BR no domínio/Keep a Changelog, Rotina de Commits Cadenciada por Aprovação Humana e Cláusula Pétrea "Proibido Deduzir de Cabeça" com Revisor Independente Pré-Gate 2).
- **Especificações, Radar Estratégico, Roadmap de Fatias e Decisões (D7, D8, D11, D18, D19, D20, D22, D23):** Estrutura `openspec/` integrada com `project.md`, `radar-oportunidades.md`, `roadmap/_template-fatia.md` (com seções completas incluindo UI responsiva/PWA e Roteiro de Validação Prática do Usuário), `specs/` (base viva) e `changes/` (deltas e `archive/`), além de `docs/adr/` no formato MADR.
- **Enforcement Determinístico (D14, D15, D18, D21, D22, D23):** Git hooks via Lefthook (`lefthook.yml`), scanner de segredos (Gitleaks), script `scripts/verificar-governanca.mjs` (trava Nível 1 vs Nível 2, suporte aos marcos de fundação e fatias arquivadas, verificação de correspondência entre deltas e fatias físicas do roadmap contra deduções de cabeça, CHANGELOG e Cláusula Anti-Preguiça) e `scripts/validar-commit-msg.mjs` (valida PT-BR e Conventional Commits).
- **Agent Skills (D10, D16, D18, D19, D24):** `.agents/skills/` contendo `inicializar-stack`, `ciclo-especificacao`, `explorar-produto`, `atualizar-governanca` e `revisar-fatia` (Agente Revisor Independente Pré-Gate 2).
