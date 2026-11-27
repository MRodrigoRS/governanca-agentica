# Mapa Macro Rolling Wave — Governança v4.0.0

> **Papel:** Fonte única do planejamento macro incremental do projeto (*Rolling Wave Planning*).
> **Regra de Ouro (Zero Escrita Duplicada):** Este arquivo registra a visão macro, dependências e fronteiras (`Entra` vs. `Fica de Fora`) de cada fatia. A especificação técnica profunda (contratos, schemas, cenários `Given/When/Then` e tarefas Test-First) nasce **Just-in-Time exclusivamente dentro de `openspec/changes/fatia-XX-<slug>/`** no momento de executar aquela fatia, consolidando-se em `openspec/specs/` após o `archive`.
> **Proteção Copier:** Listado em `_skip_if_exists` no `copier.yml` nos projetos consumidores.

---

## Histórico Consolidado (Ciclo v3 — Concluído)

- `[x]` `fatia-01-fundacao-v3` — OpenSpec nativo, Lifecycle Hooks e suíte inicial de testes unitários.
- `[x]` `fatia-02-linear-mcp-e-inbox` — Integração Linear MCP, Diário de Bordo e Inbox Móvel.
- `[x]` `fatia-03-rigor-tdd-e-mutacao-mental` — Ciclo Faça Funcionar → Faça Direito, mutação mental e trava anti-teatro de testes.
- `[x]` `fatia-04-engenharia-de-harness-e-higiene-de-contexto` — Sensores pós-edição, paridade de hooks, vínculo Roadmap ↔ OpenSpec e higiene MCP.
- `[x]` `fatia-05-catalogo-jogos-e-simulacoes` — Catálogo de Jogos (Phaser 3, Three.js, Godot 4, Bevy) e manifesto `project.godot`.
- `[x]` `fatia-06-documentos-de-particularidades-e-aprendizados` — `docs/particularidades.md` e `docs/aprendizados.md` protegidos no Copier.
- `[x]` `fatia-07-protocolo-handshake-e-triade-linear` — Artigo 13 (`whoami` obrigatório e Tríade de Âncora anti-vazamento de squads).

---

## Fila Evolutiva Ativa — Ciclo Governança v4.0.0

### `[x] Concluído` — `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md](roadmap/fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md)
- **Depende de:** `fatia-07-protocolo-handshake-e-triade-linear`
- **Objetivo de Valor:** Eliminar a tripla burocracia documental (`project.md` §3 + `roadmap/fatia-XX.md` + 4 arquivos repetidos no OpenSpec) **sem regredir 1 milímetro no rigor**: transfere a auditoria determinística dos pilares Anti-Preguiça (por cabeçalhos PT-BR/EN) para dentro do OpenSpec, exige Invariantes Globais no Gate 0, destrava manutenções estruturais legítimas no estágio `commit-msg`, corrige bugs de classificação de arquivos e desduplica `AGENTS.md` com Cartão de Invariantes + Emenda por Re-mapeamento da Constituição.
- **O que ENTRA:**
  1. **Rolling Wave Sem Perda de Rigor (`template/openspec/roadmap.md.jinja` + Pilares Auditados por Cabeçalho no OpenSpec):** `roadmap.md` é a fonte única de status (`project.md` §3 vira ponteiro) com seção de *Invariantes Globais do Gate 0* e blocos estruturados por fatia; `verificar-governanca.mjs` audita cabeçalhos obrigatórios (PT-BR ou EN do OpenSpec CLI) em `proposal.md`, `specs/` (`Scenario:`), `design.md` e `tasks.md` (Roteiro Prático Gate 2), preservando regra v3 legada para fatias em voo.
  2. **Via Nível 1.5 — Manutenção Estrutural Blindada (`refactor` / `perf` / `style` / `chore` / `build` no `commit-msg`):** Permite commits > 3 arquivos ou bumps de versões já presentes em `HEAD:package.json` sem spec artificial, decididos em `scripts/lib/classificar-cerimonia.mjs` (estágio `commit-msg` e `--ci`), bloqueando banco/migrations, pacote inédito em qualquer seção de dependências, linhas sob `### Adicionado` no `CHANGELOG.md` e tipos `feat`/`fix`.
  3. **Enforcement Determinístico de `/fix` (`fix`) vs. Estético (`style`):** `fix(...)` tocando código de produção sem arquivo de teste staged bloqueia (`exit 1`); `style(...)` dispensa teste novo mas bloqueia se adicionar fluxo de controle, hooks, handlers ou I/O.
  4. **Emenda por Re-mapeamento (`constitution.md` ↔ `AGENTS.md`) + Correção de Classificação + Migração v3→v4:** Preserva 100% dos exemplos e garantias da Constituição re-mapeando a mecânica (8.3, 8.5, 11.2, 12.2–12.4), mantém Cartão de Invariantes (≤ 15 linhas) em `AGENTS.md`, corrige `ehArquivoDeTeste` (`tests/` na raiz e `test_*.py`) e a isenção excessiva de `scripts/`, e documenta a migração v3→v4 em `atualizar-governanca`.
- **O que FICA DE FORA:** Extração das regras modulares por glob em `.agents/rules/`, C4/`.env.example`/SemVer (Fatia 09), comandos de atalho e handoff de sessão (Fatia 09a), Catálogo de Reúso e teto anti-monólito (Fatia 10) e CI poliglota/Testing Trophy (Fatia 11).

---

### `[x] Concluído` — `fatia-09-regras-modulares-por-glob-e-docs-mercado`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-09-regras-modulares-por-glob-e-docs-mercado.md](roadmap/fatia-09-regras-modulares-por-glob-e-docs-mercado.md)
- **Depende de:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`
- **Objetivo de Valor:** Carregar regras detalhadas de Web, Backend, Jogos e Linear sob demanda por perfil/glob **sem criar pontos cegos em agentes CLI**, adotar os padrões de mercado de documentação viva (Diátaxis, C4 + `erDiagram` + Glossário, `## Comandos do Projeto`, `.env.example`, `.gitignore`, `README.md`), proteger `.env` contra leitura por agentes, reparar tags SemVer e higienizar a raiz deste repositório.
- **O que ENTRA:**
  1. **Pergunta `perfis_projeto` no Copier + Fonte Única em `template/.agents/rules/` + Wrappers + Matriz Universal:** Renderiza módulos e `openspec/config.yaml` conforme o perfil (`web-ui`, `api-backend`, `desktop`, `mobile`, `jogo`, `cli-biblioteca`), com frontmatter nativo Antigravity, wrappers < 15 linhas em `.claude/rules/`, `.cursor/rules/` e `.github/instructions/`, `linear-mcp.md` condicional (`trigger: model_decision`) e Matriz Pré-Edição em `AGENTS.md`.
  2. **Kit de Documentação Viva e Segurança de `.env`:** `template/docs/arquitetura.md` (C4 Nível 1/2 + `erDiagram` + Glossário de Domínio, exigido quando schema mudar), seção `## Comandos do Projeto` em `AGENTS.md`, `template/README.md.jinja`, `template/.gitignore`, sensor determinístico `.env.example` e bloqueio de leitura de `.env*` pelos agentes (`hook-agente.mjs` + `.claude/settings.json`).
  3. **Unificação SemVer, Reparo de Tags (`v3.4.0`–`v3.7.0`) e Pré-Releases `v4.0.0-alpha.N`:** Sincronia automática de versão com `package.json`, reparo das tags ausentes para destravar `copier update` e uso de pré-releases `alpha` até o fechamento da Fatia 11.
  4. **Faxina Histórica sem Perda (`git mv`):** Arquivamento íntegro dos 8 documentos históricos da transição v1→v2 em `docs/historico/` com atualização e teste de todos os links.
- **O que FICA DE FORA:** Comandos de atalho multi-harness, handoff de sessão e template de PR (Fatia 09a), Catálogo de reúso/tokens de movimento/anti-monólito (Fatia 10) e Testing Trophy/Lefthook/CI poliglota (Fatia 11).

---

### `[x] Concluído` — `fatia-09a-comandos-atalho-handoff-de-sessao-e-pr`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-09a-comandos-atalho-handoff-de-sessao-e-pr.md](roadmap/fatia-09a-comandos-atalho-handoff-de-sessao-e-pr.md)
- **Depende de:** `fatia-09-regras-modulares-por-glob-e-docs-mercado`
- **Objetivo de Valor:** Materializar fisicamente os comandos de atalho citados pela governança (`/fix`, `/proxima-fatia`, `/retomar`, `/revisar`, `/refinar`, `/explorar`, `/aprendizado`, `/atualizar-governanca`, `/linear-inbox`), instituir handoff determinístico de sessão em `tasks.md` (eliminando dependência de memória do chat após `/compact`) e fornecer template de PR + fluxo Git configurável (`trunk` vs. `branch-por-fatia`).
- **O que ENTRA:**
  1. **Comandos de Atalho Multi-Harness (`.claude/commands/`, `.github/prompts/`, `.cursor/commands/`):** Wrappers finos (≤ 20 linhas) apontando para as skills oficiais e tabela canônica em `AGENTS.md`.
  2. **Handoff de Sessão em `tasks.md` + `SessionStart` Inteligente + Trava Anti-Archive Incompleto:** Seção obrigatória `## Notas de Sessão` em `tasks.md`, injeção automática de progresso (`X/Y tarefas` + próxima tarefa + próximo passo, ≤ 600 chars) no `SessionStart` e bloqueio (`exit 1`) ao arquivar mudança com `- [ ]` em aberto sem justificativa `(adiada: ...)` / `(cancelada: ...)`.
  3. **Template de PR Espelhando o Gate 2 + `fluxo_git` no Copier:** `template/.github/pull_request_template.md` e opção `trunk` (padrão) ou `branch-por-fatia` (com `gh pr create`).
- **O que FICA DE FORA:** Catálogo de reúso, `/auditar-reuso` e teto anti-monólito (Fatia 10) e Testing Trophy/CI poliglota (Fatia 11).

---

### `[x] Concluído` — `fatia-09b-apresentacao-por-artefatos-e-higiene-de-chat`
- **Depende de:** `fatia-09a-comandos-atalho-handoff-de-sessao-e-pr`
- **Objetivo de Valor:** Erradicar a poluição de contexto e o despejo de textos longos no chat, obrigando o agente em ambientes com suporte a artefatos (Antigravity / Generative UI) a publicar os planos de Gate 1, relatórios de entrega de Gate 2 e laudos do Inspetor Forense em artefatos dedicados com `RequestFeedback: true`, mantendo no chat apenas o link direto e a pergunta objetiva de decisão.
- **O que ENTRA:**
  1. **Cláusula Pétrea de Apresentação por Artefatos na Constituição (Artigo 8.5 e Artigo 12.5):** Obrigatório publicar planos de Gate 1 e relatórios de Gate 2 como artefatos dedicados interativos quando o harness suportar artefatos, limitando o chat a ≤ 20 linhas.
  2. **Diretrizes em `template/AGENTS.md` e Skills (`ciclo-especificacao`, `revisar-fatia`, `inspetor-forense`):** Instrução explícita de uso de artefatos com `RequestFeedback: true` (botão Proceed) e emissão de `parecer-forense.md` no diretório de artefatos.
  3. **Suíte de Testes Automatizados (`tests/artefatos-e-higiene-chat.test.mjs`):** Testes verificando a integridade das cláusulas na Constituição, `AGENTS.md` e skills.
- **O que FICA DE FORA:** Modificações no catálogo de reúso ou teto anti-monólito (escopo da Fatia 10).

---

### `[x] Concluído` — `fatia-10-reuso-tokens-movimento-e-component-as-asset`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-10-reuso-tokens-movimento-e-component-as-asset.md](roadmap/fatia-10-reuso-tokens-movimento-e-component-as-asset.md)
- **Depende de:** `fatia-09b-apresentacao-por-artefatos-e-higiene-de-chat`
- **Objetivo de Valor:** Impedir deriva estética/cinética e páginas ou cenas de jogos monolíticas, instituindo memória leve de reúso com sensor anti-apodrecimento, Tokens de Movimento na Fatia 01, *Component-as-Asset* e teto anti-monólito com **catraca** para não travar correções em arquivos legados.
- **O que ENTRA:**
  1. **Artigo 14 (*Reuse-Before-Create* & *Component-as-Asset*, estendendo o Artigo 1.2):** Primitivos de UI, transições/animações e entidades/mecânicas de jogos nascem tokenizados/componentizados na 1ª ocorrência; blocos específicos extraem-se na 2ª ocorrência; Fatia 01 institui Tokens Base (cores, tipografia, durações e curvas de animação).
  2. **Catálogo Vivo Enxuto (`template/docs/catalogo-reuso.md`) com Sensor Anti-Apodrecimento:** Ponteiros de 1 linha entre crases em 4 tabelas, protegido em `_skip_if_exists`, bloqueando commits que apaguem/renomeiem arquivo catalogado sem atualizar o catálogo ou que apontem para arquivo inexistente.
  3. **Skill `reuso-e-modularizacao/SKILL.md` + Comando `/auditar-reuso` + Paridade no Inspetor Forense:** Atuação preventiva no Gate 0/Gate 1/`/fix` e corretiva via `/auditar-reuso` (propondo fatias Via 1.5 para Web e Jogos em Godot 4, Phaser 3, Three.js/R3F e Bevy ECS).
  4. **Sensor Anti-Monólito (> 350 Linhas Úteis) com Catraca e Suporte `.gd`:** Suporte a `.gd` (GDScript), contagem de comentários sensível à linguagem (sem tratar `#[derive]` em Rust ou `#region` em C# como comentário) e catraca que bloqueia arquivos novos/cruzando 350 linhas ou arquivos legados (> 350 em `HEAD`) que aumentem de tamanho, com válvula `governanca:arquivo-extenso-justificado: <motivo >= 15 chars>`.
- **O que FICA DE FORA:** Parsers pesados de AST externos ou bloqueio regex cego de cores hexadecimais em SVGs/mocks.

---

### `[x] Concluído` — `fatia-11-piramide-testes-anti-mock-e-ci-poliglota`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-11-piramide-testes-anti-mock-e-ci-poliglota.md](roadmap/fatia-11-piramide-testes-anti-mock-e-ci-poliglota.md)
- **Depende de:** `fatia-10-reuso-tokens-movimento-e-component-as-asset`
- **Objetivo de Valor:** Erradicar falsos positivos de testes mockados/spies no banco próprio, fechar o furo local de commits e pushes sem rodar testes, tornar o CI poliglota com lockfile estrito e validação de mensagem de commit, e publicar a release estável `v4.0.0`.
- **O que ENTRA:**
  1. **Política *Testing Trophy* & Anti-Mocking/Anti-Spy de Banco Próprio:** Proibição constitucional + sensor determinístico contra `vi.mock`/`jest.mock`, `vi.spyOn(prisma|db...)` e `@patch` de sessão de banco próprio (ancorado para não bloquear `requests.Session` ou `stripe`), exigindo SQLite in-memory, PGlite ou banco real de teste.
  2. **Fechamento do Furo no `template/lefthook.yml` (`pre-commit` Rápido + `pre-push` Completo):** Testes unitários rápidos no `pre-commit` (garantindo Artigo 4 antes do commit no Marco 2) e suíte poliglota completa no `pre-push` (com fallback seguro se o binário `godot` não estiver no `PATH` local).
  3. **CI Poliglota Íntegro (`template/.github/workflows/ci.yml` e `.github/workflows/ci.yml`):** Exigência determinística de lockfile (sem `npm ci || npm install`), execução de `validar-commit-msg.mjs` no CI, cobertura nativa para **Godot 4 (GUT headless)** e **.NET / Avalonia (`dotnet test`)**, validação de migrações, auditoria de CVEs e validação dos artefatos v4 no job Copier da própria governança.
  4. **Qualidade Web Real (Smoke E2E + `@axe-core/playwright`) e Fechamento `v4.0.0` Estável:** Padrão oficial de Smoke Test Playwright (viewports `320x640` e `1280x800`, zero overflow, `pageerror` e Axe) e graduação final da versão para `4.0.0` estável com tag `v4.0.0`.
- **O que FICA DE FORA:** Frameworks lentos de mutação física (Stryker/Mutmut) no pre-commit ou cobertura 100% E2E para cada botão secundário.

---

### `[x] Concluído` — `fatia-12-consolidacao-padrao-universal-agents`
- **Depende de:** `fatia-11-piramide-testes-anti-mock-e-ci-poliglota`
- **Objetivo de Valor:** Eliminar a proliferação de ~50 wrappers proprietários de harnesses (`CLAUDE.md`, `GEMINI.md`, `.cursor/`, `.vscode/`, `.claude/`, `.github/prompts|instructions|agents|copilot-instructions.md`) consolidando o template no **Padrão Universal Puro** (`AGENTS.md` + `.agents/rules/` + `.agents/skills/` + `.agents/hooks.json` + `.mcp.json.jinja`), e fechar as 6 pendências residuais identificadas na auditoria de fechamento da `v4.0.0`.
- **O que ENTRA:**
  1. **Consolidação Universal (`AGENTS.md` + `.agents/`):** Remoção integral dos diretórios e arquivos wrappers proprietários (`template/CLAUDE.md`, `template/GEMINI.md`, `template/.claude/`, `template/.cursor/`, `template/.vscode/`, `template/.github/copilot-instructions.md`, `template/.github/agents/`, `template/.github/instructions/`, `template/.github/prompts/`), mantendo exclusivamente `template/AGENTS.md`, `template/.agents/` (`rules/`, `skills/`, `hooks.json`), `template/.mcp.json.jinja` e `template/.github/workflows/ci.yml` + `pull_request_template.md`.
  2. **Fechamento das 6 Pendências da Auditoria `v4.0.0`:**
     - Assert real de sincronia de versão `4.0.0` nos cabeçalhos `governanca:inicio` e em `template/openspec/project.md.jinja` / `catalogo-stacks.md`.
     - Item explícito de auditoria de *Anti-Mock de Banco Próprio* e válvula `governanca:mock-banco-justificado` em `template/.agents/skills/revisar-fatia/SKILL.md`.
     - Execução poliglota rápida no `pre-commit` de `template/lefthook.yml` (Node, Python `pytest -m "not slow"`, Rust `cargo test --lib`).
     - Contrato `@axe-core/playwright` espelhado em `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md`.
     - Passos de validação de migrações e `pip-audit`/`cargo audit` em `template/.github/workflows/ci.yml` e limpeza de asserções legadas no `.github/workflows/ci.yml` da raiz.
     - Atualização das suítes de teste e documentação (`00_INDICE_E_DECISOES.md` D40 e `CHANGELOG.md`).
- **O que FICA DE FORA:** Criação de novos sensores no verificador ou alteração nos contratos de `classificar-cerimonia.mjs`.

---

### `[x] Concluído` — `fatia-13-autogovernanca-dogfooding`
- **Depende de:** `fatia-12-consolidacao-padrao-universal-agents`
- **Objetivo de Valor:** Aplicar o próprio protocolo da Governança v4 para governar o repositório matriz (`dogfooding` em fonte única), fechando pontos cegos do harness na raiz (`AGENTS.md`, `.agents/hooks.json`, `.agents/rules/`), corrigindo a isenção cega de `template/` em `classificar-arquivos.mjs` (expondo bugs reais de código sob `template/scripts/*.mjs`), criando os documentos vivos da matriz (`docs/arquitetura.md`, `docs/particularidades.md`, `docs/runbook.md`, `docs/aprendizados.md`) e ligando `verificar-governanca.mjs` no `lefthook.yml` e no CI.
- **O que ENTRA:**
  1. **Camada Universal na Raiz em Fonte Única (`AGENTS.md`, `.agents/hooks.json`, `.agents/rules/`):** Entrada do harness na raiz apontando para `template/constitution.md` e `template/.agents/skills/` (zero duplicação e zero symlinks no Windows), `.agents/hooks.json` apontando para `../template/scripts/hook-agente.mjs`, `.agents/rules/linear-mcp.md` com a Tríade `rr-diario-agents` / `P-RR-2` e `.agents/rules/matriz-governanca.md`, além de `.agents/handoff.md` no `.gitignore`.
  2. **Refinamento do Motor em `template/scripts/lib/classificar-arquivos.mjs`:** Remoção da isenção cega `template/` para passar a classificar apenas templates/docs (`.md`, `.jinja`, `.yml`, `.yaml`, `.json`, `.gitkeep`, `.gitignore`, `.env.example`) como governança e tratar `template/scripts/*.mjs` (ou código de usuário sob `template/`) como código de produção; inclusão de `'CLAUDE_PROJECT_DIR'` em `variaveisIgnoradas` no `verificar-governanca.mjs` respeitando a catraca anti-monólito.
  3. **Docs Vivos da Matriz, OpenSpec `cli-biblioteca` e Enforcement Git/CI:** Criação de `docs/arquitetura.md` (C4 + §5 Mapa Físico), `docs/particularidades.md`, `docs/runbook.md` e `docs/aprendizados.md`; limpeza de `openspec/config.yaml` para `cli-biblioteca`; inclusão de `verificar-governanca.mjs` e checagem de `template/scripts/lib/*.mjs` em `lefthook.yml` e `.github/workflows/ci.yml` (`--ci` com `fetch-depth: 2`); registro da Decisão `D41` em `00_INDICE_E_DECISOES.md`, `CHANGELOG.md` e suíte `tests/autogovernanca-dogfooding.test.mjs`.
- **O que FICA DE FORA:** Duplicação de `template/constitution.md` ou `template/.agents/skills/` na raiz, `docs/catalogo-reuso.md` (sem UI/jogos na matriz) ou `docs/adr/` paralelo ao `00_INDICE_E_DECISOES.md`.

---

### `[x] Concluído` — `fatia-14-mesa-de-descoberta-e-livro-de-conhecimento`
- **Depende de:** `fatia-13-autogovernanca-dogfooding`
- **Objetivo de Valor:** Instituir uma camada *upstream* de descoberta contínua e cristalização incremental de conhecimento (`mesa-de-descoberta`, comandos `/descobrir` e `/mesa`), **ativada automaticamente quando houver ausência de produto/stack (Greenfield)** em conjunto com `inicializar-stack` — além de acionável sob demanda — para conduzir entrevistas profundas sem teto de rodadas e consolidar temas em capítulos `.md` separados (`docs/conhecimento/`) com permissão humana explícita, garantindo leitura física obrigatória antes do Gate 0 (anti-amnésia e anti-alucinação) e entregando insumo pronto para NotebookLM, grafos (Obsidian/Mermaid) e mega-planos sem poluir `openspec/specs/`.
- **O que ENTRA:**
  1. **Skill Universal `template/.agents/skills/mesa-de-descoberta/SKILL.md` (`/descobrir` e `/mesa`) + Ativação Automática em Greenfield:** Dois gatilhos oficiais (automático em ausência de produto/stack integrado a `inicializar-stack` e manual via `/descobrir` ou `/mesa`); congelamento estrito de código; separação de Fonte Única (livro *upstream* não concorre com `openspec/specs/`); loop contínuo multi-sessão anti-Context Rot guiado por `docs/conhecimento/INDICE.md`; modelo híbrido de especialistas (`[Produto]`, `[Arquitetura]`, `[Dados & Escala]`, `[Segurança]`, `[UX]`, `[Negócio]` + painel paralelo *read-only* sob demanda); cristalização incremental em `docs/conhecimento/<NN>-<slug>.md` somente com autorização explícita humana; e ponte opcional para `openspec/roadmap.md`.
  2. **Integração `inicializar-stack/SKILL.md` & `template/AGENTS.md` com Trava Anti-Alucinação:** Entrevista do Gate 0 sem teto artificial de 3 rodadas (eixos progressivos), extração incremental autorizada por tema durante a entrevista e **leitura física obrigatória** de `docs/conhecimento/INDICE.md` + capítulos consolidados antes de gerar `openspec/roadmap.md` e `openspec/project.md` (proibido deduzir/lembrar de cabeça).
  3. **Estrutura Inicial `template/docs/conhecimento/INDICE.md`, Proteção Copier, CI e Memória:** Índice mestre protegido em `_skip_if_exists` (`"docs/conhecimento/**"`) no `copier.yml`; registros em `AGENTS.md`, `template/AGENTS.md` e `template/README.md.jinja`; verificação no job Copier do `.github/workflows/ci.yml`; Decisão `D42`, `CHANGELOG.md` e suíte `tests/mesa-de-descoberta.test.mjs`.
- **O que FICA DE FORA:** Fusão destrutiva ou alteração do fluxo de `explorar-produto` (`/explorar`) e `refinar-ideia` (`/refinar`); criação de servidor MCP externo de grafos ou scripts geradores em `template/scripts/verificar-governanca.mjs`.

---

### `[x] Concluído` — `fatia-15-sintese-de-conhecimento-map-reduce`
- **Depende de:** `fatia-14-mesa-de-descoberta-e-livro-de-conhecimento`
- **Objetivo de Valor:** Prover uma skill dedicada de síntese em escala (`sintetizar-conhecimento`, comando `/sintetizar`) para digerir livros volumosos em `docs/conhecimento/` e materiais externos de apoio (`docs/conhecimento/materiais/` — exportações do NotebookLM, atas, specs brutas) sem estourar a janela de contexto nem alucinar regras, convertendo o corpus em Invariantes Globais e fatias estruturadas em `openspec/roadmap.md`.
- **O que ENTRA:**
  1. **Skill Universal `template/.agents/skills/sintetizar-conhecimento/SKILL.md` (`/sintetizar`):** Congelamento estrito de código; dois gatilhos (manual via `/sintetizar` e automático via Passo 3 de `mesa-de-descoberta` ou Passo 2 de `inicializar-stack` quando houver `> 8` arquivos ou materiais em `docs/conhecimento/materiais/`); triagem de volume (leitura direta `≤ 8` capítulos vs. modo **Map-Reduce** com subagentes *read-only* em paralelo por lote de domínio); detector de contradições *cross-arquivos* com parada obrigatória para decisão humana; rastreabilidade anti-alucinação (`Fontes de Conhecimento` obrigatórias + seção explícita de **Lacunas / Decisões Pendentes**); e destilação em 2 camadas (Camada 1: Invariantes Globais + Mapa de Domínios com aprovação humana; Camada 2: blocos *Rolling Wave* em `openspec/roadmap.md` com as 4 âncoras v4).
  2. **Subpasta `template/docs/conhecimento/materiais/.gitkeep` & Atualização de `INDICE.md` / Skills:** Pasta dedicada a insumos externos já protegida por `"docs/conhecimento/**"` no `copier.yml`; integração automática em `mesa-de-descoberta/SKILL.md` (Passo 3) e `inicializar-stack/SKILL.md` (Passo 2).
  3. **Índices, CI e Memória (`AGENTS.md`, `template/AGENTS.md`, `template/README.md.jinja`, `.github/workflows/ci.yml`, `00_INDICE_E_DECISOES.md`, `CHANGELOG.md`):** Registro de `/sintetizar` e `sintetizar-conhecimento` preservando integridade referencial bidirecional; verificação dos novos artefatos no job Copier do CI; Decisão `D43` e suíte `tests/sintetizar-conhecimento.test.mjs`.
- **O que FICA DE FORA:** Implementação de banco vetorial/embeddings local, servidores MCP de indexação ou parsers externos em `template/scripts/verificar-governanca.mjs`.

---

### `[x] Concluído` — `fatia-16-fatiamento-cirurgico-just-in-time`
- **Depende de:** `fatia-15-sintese-de-conhecimento-map-reduce`
- **Objetivo de Valor:** Substituir o fatiamento total antecipado no Gate 0 pelo modelo híbrido **Mapa Macro de Capacidades + Fatiamento Cirúrgico Just-in-Time**, instituindo a skill `planejar-proxima-fatia` (`/fatiar`) com subagente *read-only* que lê simultaneamente o livro/documentação e o código real existente para propor apenas a próxima fatia cirúrgica por vez.
- **O que ENTRA:**
  1. **Nova Skill `template/.agents/skills/planejar-proxima-fatia/SKILL.md` (`/fatiar` / `/planejar-fatia`):** Gatilhos manual e automáticos (`/proxima-fatia` com fila vazia e pós-Gate 2), congelamento estrito de código, delegação a subagente *read-only* (`Fatiador Cirúrgico`) com fallback em CLIs sem subagentes, leitura física do livro + código real, critérios decisórios anti-miopia, saída estruturada e alinhamento curto `grill-me` (`➡️`).
  2. **Novo Layout em 3 Camadas em `template/openspec/roadmap.md.jinja`:** `## 1. Invariantes Globais do Gate 0`, `## 2. Mapa Macro de Capacidades` e `## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)` gerando apenas `fatia-01-fundacao` no Gate 0, preservando 100% de retrocompatibilidade em `verificar-governanca.mjs` para projetos legados.
  3. **Integração no Ecossistema, SemVer `v4.2.0` e Testes:** Atualização de `inicializar-stack`, `sintetizar-conhecimento`, `mesa-de-descoberta`, `ciclo-especificacao`, `template/AGENTS.md`, `template/constitution.md` (Artigos 8.2 e 8.3), `template/README.md.jinja`, `template/openspec/project.md.jinja`, `AGENTS.md` (raiz), `.github/workflows/ci.yml`, `00_INDICE_E_DECISOES.md` (`D44`), `package.json`, `CHANGELOG.md`, `README.md` e suíte `tests/planejar-proxima-fatia.test.mjs`.
- **O que FICA DE FORA:** Alterações em `template/scripts/verificar-governanca.mjs` (Catraca Anti-Monólito / Artigo 14) ou quebra de compatibilidade com roadmaps legados multi-fatias em `copier update`.

---

### `[x] Concluído` — `fatia-17-matriz-rastreabilidade-end-to-end`
- **Depende de:** `fatia-16-fatiamento-cirurgico-just-in-time`
- **Objetivo de Valor:** Fechar a rastreabilidade ponta-a-ponta do Livro de Conhecimento (`docs/conhecimento/`) ao Mapa Macro (`openspec/roadmap.md`), fatias (`openspec/changes/`), especificações (`openspec/specs/`) e provas reais de teste via `openspec/matriz-requisitos.md`, com auditoria determinística opt-in (`auditar-matriz-requisitos.mjs`), telemetria no `SessionStart`, sincronia nas skills e bump para `v4.3.0`.
- **O que ENTRA:**
  1. **Contrato & Proteção Copier (`template/openspec/matriz-requisitos.md.jinja` + `copier.yml`):** Tabela enxuta de 6 colunas (`ID`, `Requisito`, `Fonte`, `Capacidade / Fatia`, `Status`, `Prova Real`) protegida em `_skip_if_exists`, com linha-guia sem crases no template para não falhar o primeiro commit pós-`copier copy`.
  2. **Auditor Determinístico ESM Zero-Deps (`template/scripts/lib/auditar-matriz-requisitos.mjs` ≤ 350 linhas + integração em `verificar-governanca.mjs`):** 100% opt-in (sem quebrar projetos sem matriz); 6 regras (anti-preguiça, IDs `REQ-XX` únicos, 4 status canônicos, anti-apodrecimento em `Fonte`, anti-teatro `[x]` → prova real + sensor reverso de remoção/renomeação, trava de archive normalizando prefixo `YYYY-MM-DD-` + aviso `[AVISO MATRIZ]`).
  3. **Telemetria `SessionStart` (`template/scripts/hook-agente.mjs`):** Emissão de 1 linha `[MATRIZ REQUISITOS] Total: ... | Entregues: ... | Em andamento: ... | Pendentes: ... | Descartados: ...` preservada contra truncamento no teto de 600 caracteres.
  4. **Constituição (Artigo 12.6), `AGENTS.md`, 6 Skills, SemVer `v4.3.0` e Suíte Test-First (`tests/auditar-matriz-requisitos.test.mjs`):** Atualização de `sintetizar-conhecimento`, `planejar-proxima-fatia`, `ciclo-especificacao`, `refinar-ideia`, `mesa-de-descoberta`, `revisar-fatia`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, `00_INDICE_E_DECISOES.md` (`D45`), `docs/arquitetura.md` (§5), `.github/workflows/ci.yml`, `lefthook.yml`, `package.json`, `CHANGELOG.md` e os 10 cenários automatizados + validação `copier copy` / `copier update`.
- **O que FICA DE FORA:** Dependências npm externas, duplicação de prosa do livro dentro da matriz, quebra de projetos v4.0–v4.2 sem matriz ou alteração direta de repositórios consumidores externos (como Orvix) durante esta fatia da matriz.

---

### `[x] Concluído` — `fatia-18-conselho-evolutivo-de-produto`
- **Depende de:** `fatia-17-matriz-rastreabilidade-end-to-end`
- **Objetivo de Valor:** Evoluir a skill `explorar-produto` (`/explorar` + alias `/evoluir`) para um **Conselho Evolutivo de 3 Subagentes Especialistas (*read-only* em paralelo)** capaz de propor inovações de mercado, "ouro barato", refatorações/repensamentos do código entregue e novos capítulos no Livro (`docs/conhecimento/`), sem conflitar com o modelo *Rolling Wave* nem com a Matriz de Requisitos `v4.3.0`.
- **O que ENTRA:**
  1. **Reescrita de `template/.agents/skills/explorar-produto/SKILL.md` (≤ 150 linhas):** Congelamento estrito de código; painel paralelo de 3 especialistas *read-only* (`Produto & Mercado`, `Arquiteto Evolutivo`, `UX & Jornada`, com fallback sequencial em CLIs); contrato conciso de até 25 linhas/3 achados com `[fonte]`; Síntese Crítica em 4 Quadrantes (máx. 8–10 propostas); artefato `exploracao-produto-YYYY-MM-DD.md` (em harnesses compatíveis); e 4 Saídas Oficiais (`docs/conhecimento/`, `Mapa Macro` + `openspec/matriz-requisitos.md` ou `refinar-ideia` / `Via 1.5`, `openspec/radar-oportunidades.md`, `Fora de Escopo`).
  2. **Atualização de `template/openspec/radar-oportunidades.md.jinja`:** Inclusão de seção para *Evoluções e Refatorações Estruturais Estacionadas*.
  3. **Sincronia Normativa & SemVer `v4.4.0`:** Atualização de `template/AGENTS.md` (alias `/evoluir` e §2), `AGENTS.md` (raiz), `template/constitution.md` (Artigo 8 separando evolução divergente sob demanda de fatiamento convergente), `template/openspec/project.md.jinja`, `catalogo-stacks.md`, `package.json`, `00_INDICE_E_DECISOES.md` (`D46`), `CHANGELOG.md` e suíte Test-First `tests/explorar-produto-skill.test.mjs` (+ atualização das asserções de versão/âncoras legadas em `tests/comandos-e-handoff.test.mjs` e `tests/auditar-matriz-requisitos.test.mjs`).
- **O que FICA DE FORA:** Disparo automático de `/explorar` dentro do `/fatiar` ou `Gate 2`, criação de 14ª skill paralela ou alteração de código em `template/scripts/verificar-governanca.mjs`.

---

## Mapa Macro de Capacidades — Ciclo v4.5+ (Evolução Estrutural)

| Capacidade | Escopo Macro | Status |
|---|---|---|
| **C1 — Blindagem do Motor, Agregador de Erros e Fechamento Atômico** | Corrigir `read_file` em `.agents/hooks.json` (raiz e template), modo `--ci` em `classificar-cerimonia.mjs` e sensor Anti-Monólito (`HEAD~1..HEAD`), ordem atômica `archive` → `commit` em `ciclo-especificacao/SKILL.md`, desmonolitizar `verificar-governanca.mjs` (≤ 350 linhas úteis com módulos puros em `template/scripts/lib/` e agregação de todas as violações numa única passada) e destaque obrigatório de válvulas de escape no Gate 2. | `Entregue (fatia-19)` |
| **C2 — Depuração Sistemática (`/debug`) e Prova de Runtime Pré-Gate 2** | Nova skill `depuracao-sistematica` (`/debug`) acoplada ao Circuit Breaker de 3 tentativas + etapa de auto-verificação em runtime (app/API rodando, console/network limpos) antes do roteiro humano no Gate 2. | `Em fila (Just-in-Time via /fatiar)` |
| **C3 — Hierarquia Constitucional Anti-Diluição e Sensores de Maturidade** | Reorganizar `template/constitution.md` única (sem fragmentar, preservando merge 3-way Copier) em 3 faixas de severidade mantendo 100% do rigor desde o 1º commit + avisos determinísticos `[AVISO MATURIDADE]` conforme o projeto cresce. | `Em fila (Just-in-Time via /fatiar)` |
| **C4 — Hardening de Produção (Banco, Observabilidade, CI CVEs e Contratos)** | Migrações seguras (*expand-and-contract*) + seeds idempotentes, observabilidade mínima no Artigo 7 (logs estruturados sem PII, `requestId`, `/health`), CI bloqueando CVEs `critical` (aviso em `high`, removendo `|| true` cego) e diretriz de contratos tipados ponta-a-ponta. | `Em fila (Just-in-Time via /fatiar)` |

---

## Fila Executável Ativa (Rolling Wave Cirúrgico — v4.5+)

### [x] fatia-19-blindagem-motor-agregador-e-gate2-atomico
- **Depende de:** `fatia-18-conselho-evolutivo-de-produto`
- **Objetivo de Valor:** Fechar 3 furos reais de integridade determinística (`read_file` no `.agents/hooks.json`, modo `--ci` em cerimônia/anti-monólito e ordem atômica `archive` → `commit` no Gate 2), desmonolitizar `template/scripts/verificar-governanca.mjs` (de 1.205 para ≤ 350 linhas úteis via módulos puros em `template/scripts/lib/`) com agregador de todas as violações numa única passada, tornar visíveis as válvulas de escape no Gate 2 e publicar a release `v4.5.0`.
- **O que ENTRA:**
  1. **Bloqueio Real de Leitura de `.env*` nos Hooks:** Incluir `read_file|view_file|Read` no `matcher` de `PreToolUse` em `template/.agents/hooks.json` e `.agents/hooks.json` (raiz), garantindo disparo real do bloqueio já existente em `hook-agente.mjs`.
  2. **Paridade Real do Modo `--ci` (`HEAD~1..HEAD`):** Extrair helper portátil `template/scripts/lib/git-diff-helper.mjs` e corrigir `classificar-cerimonia.mjs` e o sensor Anti-Monólito para comparar `HEAD~1..HEAD` quando `modoCi === true` (eliminando falsos verdes no GitHub Actions).
  3. **Ordem Atômica no Fechamento do Gate 2:** Corrigir Passo 6/7 de `template/.agents/skills/ciclo-especificacao/SKILL.md` (e sincronizar `template/AGENTS.md`) para executar `openspec archive` + atualização de `[x] Concluído` em `openspec/roadmap.md` e `openspec/matriz-requisitos.md` **antes** do `git add` / `git commit`, garantindo working tree limpo e acionamento real das travas determinísticas de archive.
  4. **Desmonolitização de `verificar-governanca.mjs` + Agregador de Erros:** Extrair sensores puros em `template/scripts/lib/` (`git-diff-helper.mjs`, `auditar-openspec.mjs`, `sensores-codigo.mjs`, `sensores-indices.mjs`) e ajustar `auditar-matriz-requisitos.mjs` para coletar erros/avisos sem `process.exit(1)` precoce, trazendo `verificar-governanca.mjs` para ≤ 350 linhas úteis com relatório consolidado de todas as violações numa única execução e mantendo re-exports (`contarLinhasUteisCodigo`, `ehArquivoIsentoDeTetoMonolito`).
  5. **Transparência Obrigatória de Válvulas de Escape no Gate 2:** Reportar em bloco dedicado no auditor qualquer uso de `governanca:mock-banco-justificado` ou `governanca:arquivo-extenso-justificado` no diff e exigir destaque explícito no relatório do Gate 2 (`template/constitution.md`, `template/AGENTS.md`, `ciclo-especificacao/SKILL.md`).
  6. **Sincronia SemVer `v4.5.0`, Docs da Matriz e Suíte Test-First:** Atualizar `package.json`, cabeçalhos `v4.5.0`, `README.md`, `00_INDICE_E_DECISOES.md` (`D47`), `docs/arquitetura.md` (§5), `lefthook.yml`, `.github/workflows/ci.yml`, `CHANGELOG.md`, helpers dinâmicos de cópia de `lib/` nos testes e nova suíte `tests/blindagem-motor-e-agregador.test.mjs`.
- **O que FICA DE FORA:** Skill `/debug` e Prova de Runtime (C2), reestruturação da `constitution.md` em 3 faixas e sensores `[AVISO MATURIDADE]` (C3), hardening de migrações/observabilidade/CI CVEs/contratos (C4) e itens estacionados no Radar (worktrees e evals comportamentais).
