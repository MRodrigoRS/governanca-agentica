# Proposta — Fatia 22: Hardening de Produção (Banco, Observabilidade, CI CVEs e Contratos)

## Why

Apesar de a Governança v4.7.0 já blindar segurança de borda, transações ACID, testes reais sem mocks de banco e hierarquia constitucional anti-diluição, a auditoria da capacidade **C4** em `openspec/roadmap.md` identificou 4 pontos cegos críticos quando projetos governados chegam à produção:

1. **Migrações e seeds frágeis:** falta exigir migrações zero-downtime (*expand-and-contract*) e seeds idempotentes (`upsert` / `ON CONFLICT`); no CI Python, `uv run alembic check || true` mascara drift de migração.
2. **Ausência de observabilidade mínima no Artigo 7:** não há requisito constitucional nem contratual para logs estruturados sem PII/segredos, `requestId` (*correlation ID*) e endpoint `/health` (além de `/ready` quando aplicável).
3. **Auditores de CVEs cegos no CI (`template/.github/workflows/ci.yml`):** `npm audit`, `pip-audit` e `cargo audit` executam todos com `|| true` silencioso (nem CVEs `critical` bloqueiam o build) e o fluxo Node tenta `npm audit` mesmo em projetos `pnpm` ou `yarn`.
4. **Deriva de contratos tipados entre servidor e cliente:** o Artigo 1.2 exige schemas de entrada na borda, mas não impede duplicação manual de DTOs nem *type assertions* cegas (`res.json() as T`) no cliente.

## What Changes

Esta fatia fecha os 4 pilares acima mantendo `template/constitution.md` enxuta (preservando as 3 Faixas e a numeração `Artigo 1`..`Artigo 14`) e mantendo o motor determinístico sem regex SQL frágeis:

1. **Constituição Enxuta (`template/constitution.md`):** adicionar o item 6 ao Artigo 7 (**Observabilidade Mínima**: logs estruturados JSON sem PII, `requestId` e `/health`), reforçar o Artigo 7.2 (*expand-and-contract* e seeds idempotentes) e o Artigo 1.2 (fonte única de contratos tipados ponta-a-ponta).
2. **Regras Modulares (`template/.agents/rules/`):** ampliar os globs de `backend-seguranca-dados.md.jinja` (`**/*.sql`, `**/seed*`, `**/seeds/**`, `**/schemas/**`) preservando os globs atuais, detalhar migrações *expand-and-contract*, seeds idempotentes, observabilidade mínima e contratos tipados como fonte única; adicionar diretriz complementar de consumo tipado em `web-ui-pwa.md.jinja`.
3. **CI Poliglota Sem `|| true` Cego (`template/.github/workflows/ci.yml`):** tornar o auditor Node *lockfile-aware* (`npm`, `pnpm`, `yarn`, aviso `::notice::` para Bun) bloqueando `critical` e emitindo `::warning::` para `high`; condicionar `uv run alembic check` a `[ -n "$DATABASE_URL" ]` sem `|| true`; executar `uv run pip-audit` (com `--ignore-vuln` explícito apenas para exceções triadas, pois `pip-audit --format json` não expõe CVSS/severity nativamente) e `cargo audit` sem `|| true`.
4. **Runbook, Skills, Catálogo de Stacks e Matriz Universal:** atualizar `template/docs/runbook.md` (§2, §3 e §4 preservando os 5 cabeçalhos canônicos), `template/.agents/skills/revisar-fatia/SKILL.md`, `template/.agents/skills/auditoria-seguranca/SKILL.md`, `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` e `template/AGENTS.md`.
5. **Sincronia SemVer `v4.8.0` e Suíte Test-First:** atualizar `package.json`, cabeçalhos `v4.8.0`, `README.md`, `00_INDICE_E_DECISOES.md` (`D50`), `CHANGELOG.md`, flexibilizar asserções `4.7.0` → `4.7.0+` em `tests/hierarquia-e-maturidade.test.mjs` e adicionar `tests/hardening-producao.test.mjs`.

## Fica de Fora

- Novos sensores ou parsers SQL/AST em `template/scripts/lib/` (o motor em `verificar-governanca.mjs` permanece inalterado).
- Provisionamento obrigatório de stacks completas de telemetria (OpenTelemetry Collector, Prometheus, Grafana).
- Bloqueio de CVEs de severidade `moderate` ou `low` no CI Node.
- Itens estacionados no Radar (`git worktree` paralelo e evals comportamentais de skills).
