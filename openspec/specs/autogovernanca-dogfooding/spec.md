# autogovernanca-dogfooding Specification

## Purpose

Auto-governança (*dogfooding*) do repositório matriz `governança-de-agentes` em fonte única, refinando a classificação de `template/scripts/*.mjs`, provendo entrada universal na raiz (`AGENTS.md`, `.agents/`, `docs/`) e ligando `verificar-governanca.mjs` no Lefthook e no CI.

## Requirements

### Requirement: Classificacao Refinada da Pasta template/ sem Ponto Cego de Codigo
A função `ehArquivoDeDocumentacaoOuGovernanca()` em `template/scripts/lib/classificar-arquivos.mjs` DEVE isentar sob `template/` exclusivamente artefatos não-código de template e documentação (`.md`, `.jinja`, `.yml`, `.yaml`, `.json`, `.gitkeep`, `.gitignore`, `.env.example`), classificando código executável em `template/scripts/*.mjs` (ou código de usuário sob `template/`) como código de produção em `ehArquivoDeProducao()` mantendo isenção de `scripts/` apenas para os scripts oficiais da governança em projetos consumidores.

#### Scenario: Scripts da matriz classificados como producao e templates preservados como docs
- **GIVEN** o módulo `template/scripts/lib/classificar-arquivos.mjs`
- **WHEN** `ehArquivoDeProducao()` e `ehArquivoDeDocumentacaoOuGovernanca()` são avaliados para arquivos em `template/` e `scripts/`
- **THEN** `template/scripts/verificar-governanca.mjs`, `template/scripts/lib/classificar-arquivos.mjs` e `template/email.ts` retornam `true` em `ehArquivoDeProducao()`
- **AND** `template/AGENTS.md` e `template/.agents/rules/web-ui-pwa.md.jinja` retornam `true` em `ehArquivoDeDocumentacaoOuGovernanca()` e `false` em `ehArquivoDeProducao()`
- **AND** `scripts/verificar-governanca.mjs` em projetos consumidores permanece classificado como governança (`ehArquivoDeDocumentacaoOuGovernanca() === true`)

### Requirement: Camada Universal de Auto-Governanca na Raiz em Fonte Unica
A raiz do repositório matriz DEVE prover exclusivamente os pontos de entrada universais exigidos pelo harness (`AGENTS.md`, `.agents/hooks.json`, `.agents/rules/linear-mcp.md`, `.agents/rules/matriz-governanca.md`) e o conjunto enxuto de documentos vivos (`docs/arquitetura.md` com Seção 5 Mapa Físico, `docs/particularidades.md`, `docs/runbook.md`, `docs/aprendizados.md`), referenciando `template/constitution.md` e `template/.agents/skills/` em fonte única sem duplicação de arquivos nem wrappers proprietários, com `.agents/handoff.md` ignorado no `.gitignore` e `openspec/config.yaml` ajustado ao perfil `cli-biblioteca`.

#### Scenario: Hooks nativos da raiz e integridade referencial da matriz
- **GIVEN** a estrutura da raiz com `AGENTS.md`, `.agents/hooks.json`, `.agents/rules/` e `docs/`
- **WHEN** `.agents/hooks.json` aciona `node ../template/scripts/hook-agente.mjs` a partir de `.agents/` e os ponteiros de `AGENTS.md` e `docs/arquitetura.md §5` são auditados
- **THEN** `session-start` retorna JSON válido com `injectSteps[0].systemMessage.systemMessage` e `pre-tool` retorna `decision: "deny"` para `git commit --no-verify`
- **AND** todos os caminhos estáticos em `AGENTS.md` e caminhos entre crases na tabela `## 5. Mapa Físico de Módulos` de `docs/arquitetura.md` existem fisicamente no disco
- **AND** não existem `.claude/`, `.cursor/`, `CLAUDE.md`, `GEMINI.md`, `.agents/skills/`, `docs/catalogo-reuso.md` nem `docs/adr/` na raiz

### Requirement: Enforcement Deterministico da Governanca no Lefthook e no GitHub Actions
O `lefthook.yml` e o `.github/workflows/ci.yml` da raiz DEVEM executar `template/scripts/verificar-governanca.mjs` (localmente no `pre-commit` e com `--ci` + `fetch-depth: 2` no pipeline), além de checar sintaxe de `template/scripts/lib/*.mjs`, validar o catálogo Copier com `docs/runbook.md` e `auditoria-seguranca/SKILL.md` e ignorar a variável de harness `CLAUDE_PROJECT_DIR` no sensor `.env.example`.

#### Scenario: Execucao integral do verificar-governanca.mjs na raiz e no CI
- **GIVEN** os arquivos `lefthook.yml`, `.github/workflows/ci.yml` e `template/scripts/verificar-governanca.mjs`
- **WHEN** os comandos configurados no `pre-commit` local e no CI são executados no repositório matriz
- **THEN** `node template/scripts/verificar-governanca.mjs` e `node template/scripts/verificar-governanca.mjs --ci` auditam a matriz com código de saída `0` sem falso positivo para `CLAUDE_PROJECT_DIR`
- **AND** `lefthook.yml` e `.github/workflows/ci.yml` validam sintaxe dos scripts e bibliotecas `template/scripts/lib/*.mjs`
