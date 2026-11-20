# Changelog — Governança Agêntica (v4.0.0)

Todas as alterações notáveis neste protocolo de governança são documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Não publicado]

### Adicionado
- **Auto-Governança da Matriz / Dogfooding em Fonte Única (`fatia-13-autogovernanca-dogfooding`, D41):**
  - Criação da camada universal na raiz em fonte única (`AGENTS.md`, `.agents/hooks.json` apontando para `../template/scripts/hook-agente.mjs`, `.agents/rules/linear-mcp.md`, `.agents/rules/matriz-governanca.md`) e inclusão de `.agents/handoff.md` no `.gitignore`, sem duplicar `template/constitution.md` nem skills.
  - Refinamento de `template/scripts/lib/classificar-arquivos.mjs` para remover a isenção cega de `template/` (passando a isentar apenas templates/docs `.md`/`.jinja`/`.yml`/`.json` e auditar `template/scripts/*.mjs` como código de produção) e inclusão de `CLAUDE_PROJECT_DIR` em `variaveisIgnoradas` no `verificar-governanca.mjs` dentro da catraca anti-monólito.
  - Documentação viva da matriz na raiz (`docs/arquitetura.md` com §5 Mapa Físico, `docs/particularidades.md`, `docs/runbook.md`, `docs/aprendizados.md`), alinhamento de `openspec/config.yaml` ao perfil `cli-biblioteca` e ativação de `verificar-governanca.mjs` no `lefthook.yml` e `.github/workflows/ci.yml` (`--ci`, `fetch-depth: 2` e checagem de `docs/runbook.md` / `auditoria-seguranca/SKILL.md` no Copier).
  - Suíte `tests/autogovernanca-dogfooding.test.mjs` elevando a cobertura para 99 testes verdes.
- **Pesquisa Viva Obrigatória e Papel Ativo de Arquiteto Crítico (Artigo 8 / `AGENTS.md` / `ciclo-especificacao`):**
  - Proibição de recomendar stacks, versões, APIs ou segurança apenas por memória de treinamento quando houver `context7`, `/llms.txt` ou busca web disponíveis, com registro das fontes consultadas em `design.md`.
  - Gate 1 em 2 tempos com **Check-up Ativo de Saúde Arquitetural** e **Discussão Pré-Plano Obrigatória (`grill-me`)** antes do plano fechado, mantendo isenção explícita para ajustes puramente triviais/cosméticos (`Via 1b` `style`, copy, cor, espaçamento).
- **Ampliação do Catálogo de Stacks (`catalogo-stacks.md` + `inicializar-stack`):**
  - Inclusão de **Vite + React + TanStack Router**, **Monorepo (`pnpm` + Turborepo)**, **Go (Chi/Echo/Fiber + `sqlc`)**, **Rust (Axum + SQLx)**, **Flutter**, pré-requisitos nativos de **Tauri v2** (`MSVC/WebView2`/`webkit2gtk`), **Extensões de Navegador (`WXT`)**, diretriz **AI-Native** e descoberta dinâmica via `npx skills find`.
- **Atualização de `grill-me` em Projetos Existentes (`atualizar-governanca`):**
  - Inclusão do passo de instalação de `mattpocock/skills --skill grill-me grilling` na migração v3 → v4 e preservação de skills instaladas via `skills.sh`.
- **Suíte `tests/pesquisa-viva-e-arquiteto-critico.test.mjs`:** 4 novos testes automatizados elevando a suíte para 82 testes verdes.
- **Onboarding Estruturado Brownfield (`mapear-brownfield` / `/mapear-projeto`):**
  - Nova pergunta `repositorio_existente` (`bool`, padrão `false`) em `copier.yml`, marcando `openspec/project.md` com `Status: Aguardando Onboarding Brownfield` quando `true`.
  - Nova skill [mapear-brownfield/SKILL.md](template/.agents/skills/mapear-brownfield/SKILL.md) e trava firme na Seção 2 de `AGENTS.md` congelando alterações até concluir varredura read-only, check-up de saúde do legado, preenchimento dos documentos vivos (`AGENTS.md`, `docs/arquitetura.md`, `docs/catalogo-reuso.md`, `docs/particularidades.md`, `.env.example`, `openspec/project.md`, `openspec/specs/` e `openspec/roadmap.md`) e **Gate de Onboarding**.
  - Suíte `tests/onboarding-brownfield.test.mjs` com 3 novos testes automatizados elevando a suíte para 85 testes verdes.
- **Confirmação Explícita no Linear MCP (`linear-mcp.md.jinja` / `AGENTS.md` / `ciclo-especificacao`):**
  - Exigência de confirmação humana prévia antes de criar, editar ou mover issues e publicar *Project Updates* no Linear, com pergunta ao final do ciclo sobre novas tarefas ou edições a registrar.

### Modificado
- **Renomeação do Repositório para `governanca-agentica` e Limpeza de Identidade `-v2`:**
  - Atualização das URLs oficiais do Copier (`gh:MRodrigoRS/governanca-agentica`) em `copier.yml`, `README.md`, `docs/runbook.md` e `00_INDICE_E_DECISOES.md`.
  - Inclusão de nota preventiva de migração de `_src_path` em `template/.agents/skills/atualizar-governanca/SKILL.md` orientando projetos consumidores antigos antes de executar `uvx copier update`.
  - Atualização da identidade interna do projeto (`package.json`, `AGENTS.md`, `.agents/rules/`, `docs/`, `openspec/`) e renomeação do projeto Linear `P-RR-2` para `Governança Agêntica`.
- **Auditoria Sob Demanda de UX & Analytics (`auditoria-ux-analytics` / `/auditar-ux`):**
  - Inclusão da skill opcional para integração LGPD/CSP de PostHog/Microsoft Clarity e auditoria contínua de UX orientada a dados reais de uso.
- **Hardening AppSec, Linguagem Humana na UI e Auditoria de Segurança (`/auditar-seguranca`):**
  - Artigo 6.8 na Constituição (`template/constitution.md`) e Seção 9 em `web-ui-pwa.md.jinja` proibindo jargões técnicos/entidades de banco em textos exibidos ao usuário final, com prevenção de XSS.
  - Reforço Zero-Trust no backend (`backend-seguranca-dados.md.jinja` + `constitution.md` Artigo 7): IDOR/BOLA, RBAC, Anti-Mass Assignment, webhooks HMAC/idempotência, cookies HttpOnly/Secure/SameSite, Argon2id/bcrypt, validação de magic bytes, anti-SSRF e bloqueio determinístico em `verificar-governanca.mjs` para credenciais privadas sob prefixos públicos (`NEXT_PUBLIC_`, `VITE_`, `EXPO_PUBLIC_`, `REACT_APP_`, `PUBLIC_`).
  - Inclusão da skill `auditoria-seguranca` (`/auditar-seguranca`) com varredura paralela read-only (3 subagentes em legado/projeto ou 1 focado) e encaminhamento proporcional para `Via 1a`, `Via 1.5` ou `Via 2`.
- **Runbook Dedicado, Handoff fora do OpenSpec, Mapa Físico e Integridade Referencial:**
  - Inclusão de `template/docs/runbook.md` protegido no `copier.yml` (`_skip_if_exists`), com aviso determinístico não-bloqueante em `verificar-governanca.mjs` ao alterar deploy/infra ou `.env.example`.
  - Protocolo de handoff efêmero `.agents/handoff.md` (no `.gitignore`) injetado no `SessionStart` (`hook-agente.mjs`) fora de deltas OpenSpec, com aviso local anti-handoff zumbi em commits locais.
  - Seção 5 (`Mapa Físico de Módulos`) em `docs/arquitetura.md` protegida por sensor anti-apodrecimento unificado com `docs/catalogo-reuso.md`.
  - Tabela completa em `template/README.md.jinja` e teste bidirecional de integridade referencial em `tests/template-docs.test.mjs` elevando a suíte para 94 testes verdes.

### Corrigido
- Correção do glob de `npm test` em `package.json` (`tests/*.test.mjs`) para compatibilidade com `/bin/sh` e Node 20 no GitHub Actions (`ubuntu-latest`).
- Remoção de referências legadas a `.cursor/mcp.json` e `.vscode/mcp.json` em `catalogo-stacks.md` após a consolidação no Padrão Universal Puro (`fatia-12`).
- Padronização do frontmatter YAML (`globs`) nas rules em `template/.agents/rules/*.md.jinja` e correção de referência legada `openspec/roadmap/` → `openspec/roadmap.md` em `explorar-produto/SKILL.md`.

---

## [4.0.0] - 2026-11-11

### Adicionado
- **Consolidação no Padrão Universal Puro (`AGENTS.md` + `.agents/`) e Fechamento Fino da Auditoria v4.0.0 (`fatia-12`):**
  - **Padrão Universal Puro (D40):** Eliminação dos 51 arquivos de wrappers proprietários redundantes (`template/CLAUDE.md`, `template/GEMINI.md`, `template/.claude/`, `template/.cursor/`, `template/.vscode/`, `template/.github/copilot-instructions.md`, `template/.github/agents/`, `template/.github/instructions/`, `template/.github/prompts/`), mantendo exclusivamente a estrutura universal agnóstica (`template/AGENTS.md`, `template/.agents/rules/`, `template/.agents/skills/`, `template/.agents/hooks.json` e `template/.mcp.json.jinja`).
  - **Fechamento das 6 Pendências da Auditoria v4.0.0:** Assert real de versão `v4.0.0` nos cabeçalhos e templates (`project.md.jinja`, `catalogo-stacks.md`), execução rápida poliglota no `pre-commit` de `template/lefthook.yml` (Node, Python `pytest -m "not slow"`, Rust `cargo test --lib`), contrato `@axe-core/playwright` em `catalogo-stacks.md`, cláusula explícita de auditoria de persistência real (SQLite/PGlite) e válvula `governanca:mock-banco-justificado` em `revisar-fatia/SKILL.md`, e validação de migrações (`prisma migrate status` / `alembic`) + `pip-audit`/`cargo audit` em `template/.github/workflows/ci.yml`.
- **Pirâmide Moderna de Testes (Testing Trophy), Anti-Mock de Banco, CI Poliglota e Graduação v4.0.0 Estável (`fatia-11`):**
  - **Testing Trophy e Anti-Mock de Banco Próprio:** Inclusão no Artigo 2 da Constituição (`template/constitution.md`) e em `template/.agents/rules/backend-seguranca-dados.md.jinja` das 3 camadas (Unitário Puro < 50ms, Integração Real contra SQLite in-memory/PGlite/banco real, e Smoke E2E Crítico + Acessibilidade). Proibição de mockar ou espionar o próprio cliente de banco/ORM (`prisma`, `drizzle`, `db`, `session`, `repository`), com sensor determinístico em `template/scripts/verificar-governanca.mjs` e válvula formal `governanca:mock-banco-justificado:`. Falsos positivos em clientes externos (`requests.Session`, `stripe`) rigorosamente prevenidos.
  - **Fechamento do Furo no Lefthook (`pre-commit` Rápido + `pre-push` Poliglota Completo):** Execução de testes unitários rápidos no `pre-commit` (garantindo o Artigo 4 antes do commit no Marco 2) e suíte poliglota completa no `pre-push` (Node/TS, Python pytest, Rust cargo test, .NET dotnet test e Godot 4 GUT headless com fallback seguro e amigável caso o binário não esteja no PATH local).
  - **CI Poliglota Íntegro e Lockfile Obrigatório:** Eliminação do fallback inseguro `npm ci || npm install` no CI (falha com erro explícito se nenhum lockfile for versionado), execução de `validar-commit-msg.mjs` no GitHub Actions, suporte nativo a Godot 4 GUT, .NET (`dotnet test`), Python uv e Rust no template do CI, e dogfooding completo de todos os artefatos da v4 no workflow de CI da Governança.
  - **Contrato Oficial de Smoke Test Web Real (Playwright + Axe):** Padrão oficial em `template/.agents/rules/web-ui-pwa.md.jinja` com `@axe-core/playwright`, ausência de overflow horizontal em 320px e monitoramento de `pageerror`/console.
  - **Desburocratização dos Subagentes (Eficiência de Tokens e Tempo):** Formalização na Constituição (Artigos 8 e 12), `AGENTS.md` e skills de que a auditoria cega por subagente é um recurso opcional sob demanda (acionável a qualquer momento via `/revisar`), tornando a entrega do Gate 2 direta, ágil e respaldada por testes reais determinísticos e roteiro prático.
  - **Graduação para Release Estável `v4.0.0`:** Bump final de `4.0.0-alpha.1` para `4.0.0` em `package.json`, cabeçalhos `governanca:inicio` e documentação oficial.
  - **Suíte `tests/piramide-testes-e-ci-poliglota.test.mjs`:** 4 novos testes automatizados elevando a suíte para 80 testes verdes (zero falhas).
- **Governança de Reúso, Tokens de Movimento, Component-as-Asset e Anti-Monólito (`fatia-10`):**
  - **Artigo 14 na Constituição (`template/constitution.md`):** Instituição de *Reuse-Before-Create* como extensão do Artigo 1.2, exigência de Tokens Base (cores, tipografia, durações de 150ms/250ms e curvas canônicas de animação) na Fatia 01 (Fundação), e padrão *Component-as-Asset* em `template/.agents/rules/` (`web-ui-pwa.md.jinja` e `jogos-engines.md.jinja`).
  - **Catálogo Vivo de Reúso (`template/docs/catalogo-reuso.md`):** Inventário enxuto de 1 linha por item em 4 tabelas canônicas (Tokens, Primitivos de UI, Prefabs/Cenas de Jogos, Hooks/Módulos de Domínio), protegido em `_skip_if_exists` no `copier.yml`.
  - **Sensor Anti-Apodrecimento de Catálogo em `verificar-governanca.mjs`:** Bloqueio determinístico de remoção/renomeação de arquivos catalogados sem atualização do índice e rejeição de ponteiros inexistentes no disco.
  - **Sensor Anti-Monólito com Catraca (> 350 Linhas Úteis):** Teto de 350 linhas úteis para código de produção com suporte a GDScript (`.gd`), descarte de comentários por sintaxe de linguagem (preservando atributos em Rust e diretivas em C#), mecanismo de catraca para arquivos legados (permite correções se linhas úteis não aumentarem) e válvula formal `governanca:arquivo-extenso-justificado: <motivo >= 15 chars>`.
  - **Skill e Comando `/auditar-reuso`:** Nova skill `template/.agents/skills/reuso-e-modularizacao/` com modos preventivo e corretivo (Web e Engines: Godot 4, Phaser 3, Three.js, Bevy) e wrappers nos 3 harnesses (`template/.claude/commands/`, `template/.github/prompts/`, `template/.cursor/commands/`).
  - **Paridade Tripla no Inspetor Forense:** Atualização de `.claude/agents/inspetor-forense.md`, `.github/agents/inspetor-forense.agent.md` e `revisar-fatia/SKILL.md` para auditar reúso, catraca e válvulas de arquivo extenso.
  - **Suíte `tests/reuso-e-modularizacao.test.mjs`:** 7 novos testes automatizados elevando a suíte para 76 testes verdes.
- **Apresentação por Artefatos e Higiene de Contexto no Chat (`fatia-09b`):**
  - Instituição da apresentação obrigatória por artefatos dedicados em harnesses que suportam artefatos nativos (ex.: Antigravity): `plano-fatia-XX.md` com `RequestFeedback: true` (botão interativo de ação) para Gate 1, e `entrega-fatia-XX.md` e `parecer-forense.md` para Gate 2.
  - Teto estrito de mensagem de chat (≤ 20 linhas) nos Gates 1 e 2, preservando a higiene de contexto, prevenindo Context Rot e poluição por dumps longos de texto.
  - Em harnesses CLI (Claude Code, Cursor CLI), resumo conciso em ≤ 20 linhas apontando diretamente para os arquivos físicos do delta em disco.
  - Atualização dos Artigos 8.5 e 12.5 na `template/constitution.md`, Gate 1 e Gate 2 em `template/AGENTS.md`, e skills `template/.agents/skills/ciclo-especificacao/` e `template/.agents/skills/revisar-fatia/`.
  - Suíte `tests/artefatos-e-higiene-chat.test.mjs` com 3 novos testes automatizados, elevando o repositório para 69 testes verdes.
- **Comandos de Atalho Multi-Harness com Paridade Total (`fatia-09a`):**
  - Criação de wrappers finos (≤ 20 linhas) nos 3 harnesses: Claude Code (`template/.claude/commands/`), GitHub Copilot (`template/.github/prompts/`) e Cursor (`template/.cursor/commands/`) cobrindo `/fix`, `/proxima-fatia`, `/retomar`, `/revisar`, `/grill-me`, `/refinar`, `/explorar`, `/aprendizado`, `/atualizar-governanca` e `/linear-inbox` (condicional a `integrar_linear: true`).
  - Tabela canônica de comandos de atalho documentada em `template/AGENTS.md`.
- **Handoff Determinístico de Sessão e Trava Anti-Arquivamento (`fatia-09a`):**
  - Seção obrigatória `## Notas de Sessão` em `tasks.md` contendo decisões fora do plano, bloqueios e próximo passo acionável.
  - Injeção contextual no evento `SessionStart` do `hook-agente.mjs` apresentando progresso (`X/Y tarefas`), próxima tarefa pendente e próximo passo (teto de 600 caracteres).
  - Trava determinística em `verificar-governanca.mjs` bloqueando commits que arquivam deltas com tarefas `- [ ]` abertas sem justificativa `(adiada: ...)` ou `(cancelada: ...)`.
- **Template de Pull Request e Configuração `fluxo_git` (`fatia-09a`):**
  - `template/.github/pull_request_template.md` espelhando estruturalmente as 5 seções do Gate 2.
  - Pergunta `fluxo_git` no `copier.yml` (`trunk` ou `branch-por-fatia`) com instruções para `gh pr create` na skill `ciclo-especificacao`.
  - Suíte de testes `tests/comandos-e-handoff.test.mjs` com 4 novos testes automatizados, elevando o repositório para 66 testes verdes.
- **Regras Modulares em Fonte Única e Wrappers Anti-Ponto-Cego (`template/.agents/rules/`):**
  - Pergunta `perfis_projeto` no `copier.yml` e módulos condicionais (`web-ui-pwa.md`, `backend-seguranca-dados.md`, `jogos-engines.md`, `linear-mcp.md`) com frontmatter nativo Antigravity (`trigger: glob`/`model_decision`).
  - Wrappers finos (< 15 linhas) em `template/.claude/rules/`, `template/.cursor/rules/`, `template/.github/instructions/`.
  - Matriz Universal de Leitura Pré-Edição e seção `## Comandos do Projeto` em `template/AGENTS.md`.
- **Kit de Documentação Viva e Sensor de Variáveis de Ambiente:**
  - `template/docs/arquitetura.md` (C4 Nível 1/2 em Mermaid + `erDiagram` + Glossário de Domínio) protegido no Copier, com gatilho determinístico que bloqueia commits de banco sem atualização da arquitetura.
  - `template/README.md.jinja`, `template/.env.example` e `template/.gitignore` protegidos no Copier.
  - Sensor determinístico `.env.example` em `verificar-governanca.mjs` bloqueando variáveis de produção staged ausentes e rejeitando segredos reais no example.
  - Bloqueio determinístico nos hooks de agente (`hook-agente.mjs` e `.claude/settings.json`) contra leitura de `.env*` por agentes.
  - Ritual de release documentado em `CONTRIBUTING.md`.
  - Suíte `tests/regras-modulares-e-docs-mercado.test.mjs` com 6 novos testes automatizados, elevando o repositório para 62 testes verdes.
- **Planejamento Rolling Wave e Mapa Macro em Arquivo Único (`openspec/roadmap.md`):**
  - Criação de `template/openspec/roadmap.md.jinja` consolidando Invariantes Globais de Arquitetura no Gate 0 e blocos enxutos por onda (Onda 1 Imediata detalhada, Onda 2 Planejada, Onda 3 Futura).
  - Proteção de `openspec/roadmap.md` em `_skip_if_exists` no `copier.yml`.
- **Módulos Especializados de Classificação e Cerimônia (`template/scripts/lib/`):**
  - `classificar-arquivos.mjs`: classificação determinística de testes (incluindo `tests/` e `test/` na raiz do projeto, `test_*.py` e `*_test.py`), arquivos de produção, banco, manifestos de dependência e restrição da isenção de `scripts/` apenas a scripts oficiais de governança.
  - `classificar-cerimonia.mjs`: implementação pura das Vias de cerimônia: Via 1a (`fix` com teste), Via 1b (`style` cosmético anti-contrabando), Via 1.5 (Manutenção Estrutural aprovando `refactor`/`perf`/`style`/`chore`/`build` com >3 arquivos ou bump de dependência existente) e Via 2 (Feature com delta completo).
- **Suíte de Testes da Governança v4:**
  - Criação de `tests/desburocratizacao-sdd-v4.test.mjs` com 8 novos testes automatizados cobrindo os cenários de cabeçalhos OpenSpec, preservação retroativa v3, blocos de roadmap, cerimônias Via 1a, 1b e 1.5, elevando a suíte para 56 testes verdes.

### Modificado
- **Alinhamento Integral das 7 Skills ao Padrão Universal e Âncoras v4 (`template/.agents/skills/`):**
  - `inicializar-stack/SKILL.md`: comando `openspec init` ajustado para `--tools antigravity,agents` (evitando recriar pastas proprietárias legadas), instrução de preenchimento de `## Comandos do Projeto` em `AGENTS.md`, `docs/arquitetura.md` e Tokens Base em `docs/catalogo-reuso.md` na Fatia 01.
  - `refinar-ideia/SKILL.md` e `explorar-produto/SKILL.md`: exemplos de blocos de fatia sincronizados com as 4 âncoras obrigatórias auditadas (`Depende de`, `Objetivo de Valor`, `O que ENTRA`, `O que FICA DE FORA`).
  - `ciclo-especificacao/SKILL.md`: consulta explícita a `docs/catalogo-reuso.md` na Via 1a (`/fix`) e na matriz `Reutilizar vs. Extrair Novo` do `design.md` (Gate 1).
- **Reparo de Tags Históricas e SemVer:**
  - Reparo das tags históricas `v3.4.0` a `v3.7.0` no Git.
  - Bump de versão para `4.0.0-alpha.1` no `package.json` e sincronização dos cabeçalhos `governanca:inicio`.
  - Atualização dos links em `00_INDICE_E_DECISOES.md` apontando para `docs/historico/`.
- **Desburocratização SDD nos Deltas do OpenSpec (`openspec/`):**
  - `template/openspec/config.yaml.jinja` e `openspec/config.yaml`: substituição de checklists duplicados por validação determinística de cabeçalhos nos 4 pilares (`proposal.md`, `specs/`, `design.md`, `tasks.md`), contagem mínima de linhas e proibição de placeholders lazy.
  - `template/openspec/project.md.jinja`: Seção 3 convertida em ponteiro canônico para `openspec/roadmap.md`.
- **Emenda Constitucional por Re-mapeamento (`template/constitution.md`):**
  - Re-mapeamento dos artigos 8.3, 8.5, 11.2, 12.2–12.4 para espelhar o `openspec/roadmap.md` e os 4 pilares de delta do OpenSpec, preservando 100% dos exemplos concretos de domínio e o hook de autorização humana `force_ask`.
- **Cartão de Invariantes em `template/AGENTS.md`:**
  - Inclusão do Cartão de Invariantes conciso (≤ 15 linhas) para máxima adesão de contexto pelos agentes, com cravação do item 9 (Interrogatório grill-me Mandatório e congelamento de código).
- **Blindagem Constitucional do Protocolo grill-me (`template/constitution.md`, `template/AGENTS.md`, `ciclo-especificacao`):**
  - Cravação pétrea nos Artigos 8.2 e 8.4 proibindo aceitação de ideias cruas e impondo rodadas sucessivas de interrogatório técnico (`➡️`), congelamento imediato de código em novas ideias e esclarecimento exaustivo antes do desenho técnico no Gate 1.
- **Auditoria de Governança e Validação de Commits (`template/scripts/`):**
  - `verificar-governanca.mjs`: auditoria estrutural do `openspec/roadmap.md`, auditoria de deltas por cabeçalhos e postergação da Via 1.5 para o estágio `commit-msg`.
  - `validar-commit-msg.mjs`: validação determinística da Via 1.5, bloqueio de commits `fix` em código de produção sem teste staged e inspeção anti-contrabando de lógica em `style`.
  - `hook-agente.mjs`: bloqueio de escrita com placeholders preguiçosos expandido para `openspec/roadmap.md` e `openspec/changes/`.
- **Atualização de Skills e Subagentes:**
  - Atualização de `inicializar-stack`, `ciclo-especificacao`, `refinar-ideia`, `explorar-produto`, `revisar-fatia`, `atualizar-governanca` e perfis de agente de `inspetor-forense`.

### Removido
- **Faxina Histórica da Raiz:**
  - Movimentação dos 8 arquivos históricos de transição v1→v2 da raiz para `docs/historico/` via `git mv`.
- **Template Físico Legado:**
  - Remoção de `template/openspec/roadmap/_template-fatia.md` em prol do template único de roadmap `template/openspec/roadmap.md.jinja`.

---

## [3.7.0] - 2026-11-03

### Adicionado
- **Protocolo de Handshake Pré-Operação e Tríade de Âncora Linear (`Artigo 13` / Issue `RR-9`):**
  - **Constituição (`template/constitution.md`):** Criação do Artigo 13 estabelecendo a Tríade de Âncora obrigatória (`Workspace`, `Equipe`, `Projeto`), a obrigatoriedade de handshake prévio com `whoami` antes de qualquer leitura ou escrita no Linear MCP, bloqueio imediato com alerta se o workspace divergir, e a proibição absoluta de fallback silencioso.
  - **Instruções de Agente (`template/AGENTS.md`):** Especificação operacional do handshake com `whoami` e Tríade de Âncora na Seção 6 de ferramentas e MCPs.
  - **Template Jinja (`template/openspec/project.md.jinja`):** Renderização canônica da Tríade de Âncora e das regras de isolamento quando `integrar_linear: true`.
  - **Questionário Copier (`copier.yml`):** Adição das perguntas condicionais `linear_workspace_slug` e `linear_team_key` ativadas quando `integrar_linear: true`.
  - **Âncora do Repositório Atual (`openspec/project.md`):** Atualização da Seção 3 com os dados imutáveis do projeto (`rr-diario-agents`, `RR_DIARIO_AGENTS`, `GOV-AGENTS-V2 / P-RR-2`).
- **Suíte de Testes Automatizados:**
  - Criação de `tests/template-linear.test.mjs` com 6 novos testes unitários automatizados cobrindo Copier, Jinja, Constituição e AGENTS.md, elevando a suíte para 48 testes verdes.

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
