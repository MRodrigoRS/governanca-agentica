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
