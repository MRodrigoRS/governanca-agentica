# Changelog — Governança v2

Todas as alterações notáveis neste protocolo de governança são documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [3.6.0] - 2026-11-03

### Adicionado
- **Documentos Canônicos de Memória de Projeto (`template/docs/`):**
  - `particularidades.md`: repositório estruturado para restrições de infraestrutura, portas, banco de dados (RLS, pooler), webhooks e regras não-óbvias de domínio, com diretriz estrita de Zero Segredos.
  - `aprendizados.md`: diário empírico com modelo padronizado para registro de cicatrizes de produção, causas raízes, armadilhas mentais e regras inegociáveis decorrentes.
- **Blindagem Determinística no Copier (`copier.yml`):**
  - Inclusão de `"docs/particularidades.md"` e `"docs/aprendizados.md"` em `_skip_if_exists`, garantindo proteção contra sobrescrita durante atualizações com `uvx copier update`.
- **Higiene de Contexto e Amarração no `template/AGENTS.md`:**
  - Inclusão de ponteiros explícitos de leitura sob demanda na Seção 6 de ferramentas e recursos.
- **Suíte de Testes Expandida:**
  - Criação de `tests/template-docs.test.mjs` com 4 novos testes unitários automatizados, elevando a suíte para 42 testes verdes.

---

## [3.5.0] - 2026-11-01

### Adicionado
- **Catálogo Oficial de Jogos, Simulações e Gráficos Interativos (`catalogo-stacks.md`):**
  - Inclusão da Seção 10 cobrindo quatro vertentes canônicas de Game Dev:
    * **Web 2D:** Phaser 3 + TypeScript (`strict`) + Vite + Vitest.
    * **Web 3D / WebGL:** Three.js / React Three Fiber + TypeScript + Vite.
    * **Desktop Nativo Indie:** Godot Engine 4 (C# ou GDScript) com testes headless via GUT (*Godot Unit Testing*).
    * **Desktop Nativo Baixo Nível / Ultra-Performance:** Rust + Bevy (ECS) ou Raylib com `cargo test`.
  - Regra de Ouro de Desacoplamento Arquitetural: a lógica matemática, estados, colisões, inventário e regras do jogo são isoladas da renderização gráfica, viabilizando execução de testes no pre-commit e CI em < 50ms.
- **Auditoria Determinística de Manifestos de Jogos (`verificar-governanca.mjs`):**
  - Monitoramento de `project.godot` e arquivos de configuração de engines como manifestos de dependência protegidos, exigindo formalização de Nível 2 antes de qualquer alteração de dependências.
- **Suíte de Testes Expandida:** Novo teste automatizado adicionado em `tests/verificar-governanca.test.mjs`, elevando a suíte para 37 testes verdes.

---

## [3.4.0] - 2026-11-01

### Adicionado
- **Blindagem de Hooks de Agente e Paridade Multi-IDE (`hook-agente.mjs`):**
  - Bloqueio determinístico do bypass curto `git commit -n` e flags combinadas (ex.: `-am "..." -n`), com desconsideração de literais entre aspas para evitar falsos positivos em mensagens de commit.
  - Interceptação de comandos destrutivos (`git clean -fd`, `git restore .`, `prisma migrate reset`) exigindo confirmação humana prévia (`force_ask` no Antigravity e `permissionDecision: "ask"` no Claude Code).
  - Paridade completa para Claude Code: suporte aos hooks `pre-tool-claude`, `session-start-claude` e `post-tool-claude` com injeção automática de contexto de mudanças ativas do OpenSpec e bloqueio sintático imediato.
  - Interceptação prévia de ferramentas de escrita/edição (`write_file`/`edit_file` no Antigravity e `PostToolUse` no Claude Code) bloqueando instantaneamente violações de `location.reload`, `.only(`, testes ocos e placeholders preguiçosos no roadmap.
  - Correção do caminho relativo de execução em `template/.agents/hooks.json` (`node ../scripts/hook-agente.mjs`) respeitando o CWD da IDE Antigravity.
- **Vínculo Físico Obrigatório Roadmap ↔ OpenSpec (`verificar-governanca.mjs`):**
  - Validador determinístico rejeita deltas ativos ou arquivados (`fatia-*`) em `openspec/changes/` que não possuam arquivo correspondente com as 7 seções completas em `openspec/roadmap/fatia-*.md`.
  - Extração e auditoria cirúrgica de pastas arquivadas em staged (`openspec/changes/archive/`).
- **Engenharia de Contexto, Subagentes e Teto de MCPs:**
  - Diretrizes em `template/AGENTS.md` e `catalogo-stacks.md` para delegação de varreduras exploratórias amplas a subagentes efêmeros *read-only*, prevenindo *context rot* na sessão principal.
  - Priorização do padrão `/llms.txt` para consulta enxuta de documentações externas e preferência pela CLI oficial `gh` sobre MCPs pesados.
  - Teto de higiene de MCPs limitando a 3–5 servidores ativos simultâneos por projeto e imposição de credenciais *read-only* em servidores MCP de banco relacional.
  - Diretriz de antifragilidade na skill `ciclo-especificacao`: conversão de erros recorrentes em regras determinísticas no linter/validador durante o `/fix` com suporte a regras escopadas por padrão *glob*.
- **Suíte de Testes Expandida:** 11 novos testes automatizados adicionados (`tests/hook-agente.test.mjs` e `tests/verificar-governanca.test.mjs`), totalizando 36 testes verdes cobrindo 100% dos novos comportamentos.

---

## [3.3.0] - 2026-10-30

### Adicionado
- **Rigor TDD (Faça Funcionar → Faça Direito / D31):**
  - Artigo 2 da Constituição e Seção 5 de `ciclo-especificacao` atualizados com o ciclo em 3 etapas explícitas: (1) Vermelho com asserções reais, (2) Verde com o código mais direto possível e (3) Refatoração obrigatória antes do Gate 2 aplicando *early returns* para podar aninhamentos e eliminando duplicações estruturais (DRY).
- **Prova de Mutação Mental e Auditoria de Testes no Inspetor Forense:**
  - O Subagente Inspetor Forense (`revisar-fatia/SKILL.md`, `.claude/agents/` e `.github/agents/`) agora audita ativamente a substância dos testes de staged, eliminando o "teatro de testes": verifica se mutações óbvias de cálculo quebram a suíte e aponta funções com excesso de caminhos ramificados sem testes proporcionais.
- **Trava Determinística Local Anti-Teatro de Testes (`verificar-governanca.mjs`):**
  - Bloqueio automático de commits com arquivos de teste contendo foco exclusivo esquecido (`.only(`), que ignorariam silenciosamente o restante da suíte.
  - Bloqueio automático de arquivos de teste ocos sem marcadores de asserção real (`expect`, `assert`, etc.).
- **Zero Overengineering e Zero Custo Extra de Tokens:**
  - Proibição formal em `catalogo-stacks.md` contra o uso de frameworks pesados de mutação física ou relatórios massivos (`matrix/`) no fluxo padrão, delegando o controle de complexidade exclusivamente a regras nativas dos linters da stack (Biome, ESLint, Ruff) em < 50ms.
- **Suíte de Testes Expandida:** 3 novos testes unitários adicionados a `tests/verificar-governanca.test.mjs`, elevando a suíte para 25 testes verdes.

---

## [3.2.0] - 2026-10-30

### Adicionado
- **Inbox Móvel de Ideias (Mobile-to-Agent):**
  - Skill `refinar-ideia` enriquecida com o **Passo 0 (Captura do Inbox Linear)**: o agente consulta notas e tarefas anotadas pelo usuário no celular pelo app do Linear (`Backlog`, `Triage`, `Todo`), apresenta um menu de seleção e carrega o escopo bruto para o raio-X e poda construtiva.
  - Suporte a gatilhos em linguagem natural: *"veja o que tem no Linear"*, *"puxe as ideias do celular"*, *"quais tarefas novas tem no Linear?"*, `/linear-inbox`.
- **Suporte Híbrido a Identificador e URL do Linear:**
  - `copier.yml` e `project.md.jinja` atualizados para aceitar tanto o Identificador único copiado via *"Copiar documento de identidade"* no Linear (ex: `P-RR-2`) quanto a URL completa do projeto.
- **Auto-Governança Deste Repositório (Dogfooding Limpo):**
  - O próprio repositório da governança passa a ser gerido sob seu protocolo, ancorado no projeto `P-RR-2` (`GOV-AGENTS-V2`) do Linear.
  - Blindagem total via `_subdirectory: template`: os arquivos de governança interna da raiz (`openspec/`, `.mcp.json`) não vazam para projetos criados ou atualizados via Copier.

---

## [3.1.0] - 2026-10-30

### Adicionado
- **Integração Oficial com Linear MCP & Diário de Bordo da Equipe (D29):**
  - Pergunta opcional no `copier.yml` (`integrar_linear: bool`, default `false`) e captura de âncora de projeto (`linear_project_url: str`).
  - **Isolamento Estrito de Projetos e Equipes:** Registro da URL do projeto em `openspec/project.md`, garantindo que o agente opere exclusivamente dentro do escopo do projeto selecionado, prevenindo poluição cruzada em organizações com múltiplas equipes.
  - Templates Jinja para MCP (`template/.mcp.json.jinja`, `template/.cursor/mcp.json.jinja`, `template/.vscode/mcp.json.jinja`) conectando diretamente ao Hosted Remote MCP Server oficial da Linear (`https://mcp.linear.app/mcp`) via conector `mcp-remote`.
  - Diretrizes operacionais em `AGENTS.md` e na skill `ciclo-especificacao`:
    * **Gate 1:** Vínculo automático da fatia à issue correspondente no Linear (`[LIN-XXX] fatia-XXa-...`) e transição para *In Progress*.
    * **Gate 2 (Diário de Bordo):** Publicação oficial de *Project Update* no mural do projeto com resumo funcional e roteiro prático, movendo a issue para *Done*.
    * **Skill `refinar-ideia`:** Ideias podadas ou despriorizadas são enviadas para o Backlog do mesmo projeto no Linear para acompanhamento futuro da equipe.
  - Documentação do Linear MCP adicionada ao catálogo de ferramentas de infraestrutura e stacks em `catalogo-stacks.md`.

---

## [3.0.0] - 2026-10-29

### Adicionado
- **Suíte de Testes Automatizados da Governança (`tests/`):** 16 testes unitários e de integração cobrindo `validar-commit-msg.mjs`, `hook-agente.mjs` e `verificar-governanca.mjs` (com repositório git temporário e cenários de borda). Integrado ao `npm test`, Lefthook e GitHub Actions CI da governança.
- **Lifecycle Hooks Nativos de Agentes (`PreToolUse`, `SessionStart`):** Configurações prontas para Antigravity (`template/.agents/hooks.json`) e Claude Code (`template/.claude/settings.json`), bloqueando execuções de bypass (`--no-verify`, `-n`, git add blanket perigoso) e forçando confirmação explícita (`ask_question`/prompt) antes de commits no Gate 2.
- **Subagentes Oficiais de Auditoria Factual (`inspetor-forense`):** Arquivos declarativos prontos para Claude Code (`template/.claude/agents/inspetor-forense.md`) e GitHub Copilot (`template/.github/agents/inspetor-forense.agent.md`), com ferramentas estritamente read-only (`git diff`, `git status`, busca de arquivos) sem permissão de mutação ou acesso antecipado ao roadmap.
- **Integração Real com Ecossistema de MCPs Oficiais:** Configuração nativa de Context7 MCP em `template/.mcp.json`, `template/.cursor/mcp.json` e `template/.vscode/mcp.json` para consulta oficial de documentações atualizadas (Next.js, Tailwind, Shadcn, Supabase, Playwright).
- **Skill `inicializar-stack` com Ferramental Oficial:** Integração com `openspec init --tools`, comando padrão da indústria `npx skills add` e MCPs oficiais.
- **Configuração Raiz do OpenSpec (`openspec/config.yaml.jinja`):** Adicionada com `schema: spec-driven` e regras por artefato, garantindo que `openspec doctor` retorne `OpenSpec root: ok`.

### Alterado
- **Transição de Subfatias Decimais para Alfanuméricas (D28):** Substituição do padrão `fatia-02.1` por `fatia-02a-<slug>`, compatibilizando o refinamento de escopo pendente com as regras estritas de nomenclatura do OpenSpec CLI (`lowercase letters, numbers, and hyphens`), Git branches e Conventional Commits.
- **Injeção Ativa de Contexto por Diretivas de Importação:** Adoção de `@[constitution.md](constitution.md)` para Antigravity e `@constitution.md` para Claude Code em `AGENTS.md`, `CLAUDE.md` e `GEMINI.md`, eliminando a perda de diretrizes por link estático markdown.
- **`lefthook.yml` e CI com Validação Inteligente:** Comandos do OpenSpec atualizados para `openspec validate --all --no-interactive` com verificação prévia de existência de specs, prevenindo quebras em fases iniciais (Gate 0) ou sem TTY.
- **Regras Cursor MDC Limpas:** Removidos campos legados `version` e `scope` de `template/.cursor/rules/governanca.mdc`, mantendo `alwaysApply: true`.

### Corrigido
- **Correção de Comandos Alucinados do OpenSpec CLI:** Substituído o comando inexistente `openspec new <nome>` pelo comando oficial `openspec new change <nome>` em todas as skills, templates e documentações.
- **Correção da Remoção de Changes Concluídas:** Substituído `rm -rf openspec/changes/<fatia>` por `openspec archive <fatia> -y`, preservando histórico em `openspec/archive/`.
- **Validação de Mensagens de Commit (`validar-commit-msg.mjs`):** Correção do regex para permitir subfatias alfanuméricas, escopos com pontos e hífens, além de ignorar commits nativos do Git (`Merge`, `Revert`).
- **Detecção Rigorosa de `location.reload()` em `verificar-governanca.mjs`:** Verificação estrita que bloqueia o uso de recarregamento forçado de página no frontend em favor de reatividade pura (signals, stores, router, optimistic UI).
- **Detecção de Dependências e Bancos Desconectados:** `verificar-governanca.mjs` agora audita se alterações em manifestos (`package.json`, etc.) ou scripts de banco ocorrem isoladamente sem especificação associada.
- **URL do Repositório Template no Copier:** Atualizada para `gh:MRodrigoRS/governan-a-de-agentes-v2` em `copier.yml` e `README.md`.

---

## [2.6.0] - 2026-10-29

### Adicionado
- **Feedback Reativo (Toasts) e Modais de Confirmação no Frontend (D27):** Inclusão formal no Artigo 6 (Item 7) da Constituição. Toda mutação física de dados no banco (criação, edição, exclusão) deve disparar uma notificação Toast temporária e reativa (sucesso verde ou erro vermelho amigável). Ações destrutivas ou críticas (deleções, arquivamentos, desativações) exigem obrigatoriamente um Modal/Dialog de confirmação detalhando o impacto antes da execução.
- **Campos de Toasts e Modais no Template de Fatia:** Seções 4 e 7.1 de `_template-fatia.md` atualizadas para documentar e auditar os Toasts e Modais de cada entrega.
- **Inspeção Forense:** Skill `revisar-fatia` atualizada para verificar a presença de Toasts de mutação e Modais de segurança.

---

## [2.5.0] - 2026-10-29

### Adicionado
- **Auditoria Factual Cega Pré-Gate 2 (D26):** Reformulação da skill `.agents/skills/revisar-fatia/SKILL.md` dividindo a revisão em dois papéis complementares: (1) o Subagente Inspetor Forense analisa cegamente o `git diff` (sem ler o roadmap) gerando um relatório descritivo factual ("o que o código realmente faz e omite"), e (2) o Agente Principal confronta esse relatório ponto a ponto contra o arquivo físico `openspec/roadmap/fatia-XX-*.md` (Duelo de Conformidade), corrigindo divergências antes de apresentar o Gate 2 ao humano.
- **Constituição e Instruções:** Artigo 8, Artigo 12, `AGENTS.md` e `ciclo-especificacao` atualizados com o protocolo de auditoria factual cega.

---

## [2.4.0] - 2026-10-29

### Adicionado
- **Nova Skill `refinar-ideia` (D25):** Intervenção ativa quando surgem ideias no meio do desenvolvimento. Realiza raio-X de complexidade oculta, poda construtiva ("entra vs. sai"), análise de afinidade no roadmap e decisão de encaixe.
- **Subfatias Decimais Hierárquicas (ex.: `fatia-02.1`):** Suporte nativo para desdobramentos de fatias pendentes, aproveitando o contexto de código fresco sem reordenar as fatias posteriores.
- **Auditoria de Fatias Decimais:** `verificar-governanca.mjs` atualizado para validar a correspondência e as 7 seções completas de fatias decimais.

---

## [2.3.0] - 2026-10-29

### Adicionado
- **Artigo 12 na Constituição — Cláusula Pétrea "Proibido Deduzir de Cabeça" (D23):** É expressamente proibido presumir ou deduzir de memória o escopo de fatias. Leitura física em `openspec/roadmap/fatia-XX-*.md` mandatória nos 4 marcos: (1) resumir ao humano, (2) abrir delta, (3) plano no Gate 1 e (4) antes de escrever qualquer linha de teste ou código.
- **Agente Revisor Independente Pré-Gate 2 (D24):** Nova skill `.agents/skills/revisar-fatia/SKILL.md` instituindo auditoria independente e imparcial em 5 pilares (fidelidade ao roadmap, testes substanciais, conformidade constitucional, escopo fechado e roteiro prático) antes de solicitar aprovação de commit ao humano.
- **Prevenção Ativa de Context Rot:** Orientação formal no Gate 2 para renovação de sessão (`/compact` ou nova conversa limpa) antes de puxar a próxima fatia do roadmap.
- **Auditoria Determinística de Vínculo de Roadmap:** `verificar-governanca.mjs` atualizado para checar se todo delta `fatia-XX-*` possui correspondência física no diretório `openspec/roadmap/`.

---

## [2.2.0] - 2026-10-28

### Adicionado
- **Roteiro Mandatório de Teste Prático e Apresentação no Gate 2 (D22):** Inclusão formal nos Artigos 2 e 8 da Constituição, em `AGENTS.md` e em `ciclo-especificacao`. É proibido ao agente encerrar o Gate 2 apenas despejando logs de terminal. A apresentação da entrega passa a exigir obrigatoriamente: (1) o que foi entregue, (2) rota ou tela de acesso, (3) passo a passo de teste com dados de exemplo prontos para copiar e colar, (4) comportamento visual esperado na interface e (5) teste de borda prático simulando erro.
- **Roteiro de Validação Humana no Roadmap:** Subseção 7.2 adicionada a `_template-fatia.md`, estruturando previamente o roteiro que o agente deve apresentar ao final de cada fatia.

---

## [2.1.0] - 2026-10-28

### Adicionado
- **Artigo 11 na Constituição:** Rotina de commits cadenciada por autorização humana em dois marcos exclusivos — Marco 1 (Fundação e Sedimentação Inicial, Gate 0) e Marco 2 (Fechamento de Fatia ou Fix, Gate 2).
- **Artigo 6 (Item 6):** Padrão inato de responsividade móvel (mobile-first 320px+) e portabilidade como PWA instalável (`manifest.json`, viewport, cores de tema, ícones adaptativos e service worker) para todo desenvolvimento web.
- **Campos de PWA e Responsividade em Fatias:** Seções 4 e 7 do `_template-fatia.md` atualizadas com requisitos e checklist de aceitação determinístico para web responsiva e PWA.
- **Decisões D20 e D21:** Registradas formalmente no índice de decisões e no README.

### Modificado
- `verificar-governanca.mjs` atualizado para reconhecer determinísticamente o Marco 1 (Commit de Fundação) e Marco 2 (Fatia recém-arquivada no OpenSpec), eliminando falsos positivos na auditoria de commits.
- Instruções de `AGENTS.md`, `ciclo-especificacao` e `inicializar-stack` atualizadas com a rotina de autorização humana antes de qualquer commit.

---

## [2.0.0] - 2026-10-27

### Adicionado
- Lançamento inicial da Governança v2 como protocolo agêntico aberto via Copier.
- 10 artigos pétreos na Constituição e integração com OpenSpec (`openspec/specs/`, `openspec/changes/`, `openspec/roadmap/`).
- Hooks determinísticos com Lefthook, Gitleaks, `verificar-governanca.mjs` e `validar-commit-msg.mjs`.
- Modo estratégico `explorar-produto` e Radar de Oportunidades.
- Catálogo oficial de stacks robustas, infraestrutura VPS e MCPs assistidos.
