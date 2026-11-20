# Proposta — Fatia 13: Auto-Governança da Matriz (Dogfooding em Fonte Única)

## Por que
Embora a matriz `governança-de-agentes` já possua `openspec/`, `CHANGELOG.md`, `validar-commit-msg.mjs` no `lefthook.yml` e validação de Copier no CI, o repositório ainda opera sem os próprios guard-rails que prega para projetos consumidores:
1. Não há `AGENTS.md`, `.agents/hooks.json` nem `.agents/rules/` na raiz, deixando qualquer sessão nova sem injeção automática de `SessionStart`, proteção `PreToolUse` (`--no-verify`, `.env*`, `force_ask`) nem âncora Linear carregada na entrada.
2. O script principal [verificar-governanca.mjs](../../template/scripts/verificar-governanca.mjs) não roda no `lefthook.yml` nem no `.github/workflows/ci.yml` deste repositório, e [classificar-arquivos.mjs](../../template/scripts/lib/classificar-arquivos.mjs) isentava cegamente toda a pasta `template/`, mascarando scripts `.mjs` (e eventuais pastas `template/` de código em projetos consumidores) da auditoria de produção e da catraca anti-monólito.
3. Os documentos vivos da matriz (`docs/arquitetura.md` com §5 Mapa Físico, `docs/particularidades.md`, `docs/runbook.md` e `docs/aprendizados.md`) ainda não existiam na raiz, e `openspec/config.yaml` carregava regras de UI web indevidas para um repositório `cli-biblioteca`.

## O que muda
1. **Camada Universal na Raiz em Fonte Única:** Criação de `AGENTS.md` enxuto da matriz (apontando para `template/constitution.md` e `template/.agents/skills/` sem duplicá-los), `.agents/hooks.json` acionando `../template/scripts/hook-agente.mjs`, `.agents/rules/linear-mcp.md`, `.agents/rules/matriz-governanca.md` e inclusão de `.agents/handoff.md` no `.gitignore`.
2. **Classificação Refinada de `template/` e Catraca Ativa:** Ajuste de `ehArquivoDeDocumentacaoOuGovernanca()` em `template/scripts/lib/classificar-arquivos.mjs` para isentar sob `template/` apenas templates/docs (`.md`, `.jinja`, `.yml`, `.yaml`, `.json`, `.gitkeep`, `.gitignore`, `.env.example`), tratando `template/scripts/*.mjs` como código de produção auditável; adição de `'CLAUDE_PROJECT_DIR'` em `variaveisIgnoradas` no `template/scripts/verificar-governanca.mjs` sem expandir o total de linhas úteis.
3. **Docs Vivos, Perfil `cli-biblioteca` e Enforcement Local/CI:** Criação de `docs/arquitetura.md` (C4 + §5 Mapa Físico), `docs/particularidades.md`, `docs/runbook.md` e `docs/aprendizados.md`; ajuste de `openspec/config.yaml` para `cli-biblioteca`; ativação de `verificar-governanca.mjs` e checagem de `template/scripts/lib/*.mjs` no `lefthook.yml` e `.github/workflows/ci.yml` (com `fetch-depth: 2` e checagem de `docs/runbook.md` e `auditoria-seguranca/SKILL.md` no job Copier); registro da Decisão `D41` em `00_INDICE_E_DECISOES.md`, `CHANGELOG.md` e suíte `tests/autogovernanca-dogfooding.test.mjs`.

## Fica de Fora
- Duplicação física de `template/constitution.md` ou `template/.agents/skills/` na raiz do repositório (evitando symlinks problemáticos no Windows e diffs duplicados).
- Criação de `docs/catalogo-reuso.md` (peso morto em repositório sem componentes de UI ou cenas de jogos) ou `docs/adr/` paralelo a `00_INDICE_E_DECISOES.md`.
- Refatoração completa para quebrar `template/scripts/verificar-governanca.mjs` abaixo de 350 linhas nesta fatia (a catraca passa a proteger contra novo crescimento).
