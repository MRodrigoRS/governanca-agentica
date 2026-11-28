# Tarefas — Fatia 22: Hardening de Produção (`v4.8.0`)

## Tarefas

- [x] 1. **Test-First (Vermelho):** Flexibilizar asserts literais de versão `4.7.0` → `4.7.0+` em `tests/hierarquia-e-maturidade.test.mjs` (seguindo padrão de `tests/depuracao-e-prova-runtime.test.mjs`) e criar `tests/hardening-producao.test.mjs` cobrindo os 5 requisitos da spec (Constituição Artigos 1.2, 7.2 e 7.6 + 3 Faixas preservadas; Rules modulares backend/web + globs ampliados; CI poliglota sem `|| true` cego, lockfile-aware em Node e `alembic check` com `DATABASE_URL`; Runbook, Skills e `template/AGENTS.md`; Sincronia SemVer `4.8.0`, `D50` e `CHANGELOG.md`). Executar `node --test tests/hardening-producao.test.mjs` comprovando falha (Vermelho).
- [x] 2. **Constituição (`template/constitution.md`):** Atualizar cabeçalho para `v4.8.0`, incluir fonte única de contratos tipados no Artigo 1.2, migrações *expand-and-contract* e seeds idempotentes no Artigo 7.2 e adicionar Artigo 7.6 (**Observabilidade Mínima**: logs estruturados JSON sem PII/segredos, `requestId` e endpoint `/health`), preservando intactos os selos de Faixa e ordem `Artigo 1`..`Artigo 14`.
- [x] 3. **Regras Modulares (`template/.agents/rules/`):** Atualizar `backend-seguranca-dados.md.jinja` (globs com `**/*.sql`, `**/seed*`, `**/seeds/**`, `**/schemas/**` + seções de Migrações *Expand-and-Contract* & Seeds Idempotentes, Observabilidade Mínima e Contratos Tipados Ponta-a-Ponta) e `web-ui-pwa.md.jinja` (consumo tipado sem DTO duplicado à mão nem *cast* cego `as`).
- [x] 4. **CI Poliglota (`template/.github/workflows/ci.yml`):** Substituir `npm audit ... || true` por auditoria Node lockfile-aware (`npm`/`pnpm`/`yarn`/`bun`) bloqueando `critical` e emitindo `::warning::` em `high`; condicionar `uv run alembic check` a `[ -n "$DATABASE_URL" ]` sem `|| true`; remover `|| true` de `uv run pip-audit` e `cargo audit`.
- [x] 5. **Runbook, Skills, Catálogo de Stacks e `template/AGENTS.md`:** Atualizar `template/docs/runbook.md` (preservando `## 1.`..`## 5.`), `template/.agents/skills/revisar-fatia/SKILL.md`, `template/.agents/skills/auditoria-seguranca/SKILL.md`, `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` (`v4.8.0` + seção/contratos tipados) e `template/AGENTS.md` (`v4.8.0` + Matriz Universal).
- [x] 6. **Sincronia SemVer `v4.8.0` e Memória da Matriz:** Atualizar `package.json` (`4.8.0`), `template/openspec/project.md.jinja` (`v4.8.0`), `README.md`, `00_INDICE_E_DECISOES.md` (`D50`), e `CHANGELOG.md` (`## [4.8.0]`).
- [x] 7. **Verificação Final e Prova de Runtime:** Executar `npm test`, `node --check` em todos os `.mjs`, `npx --yes @fission-ai/openspec validate --all --no-interactive`, testar scaffolding com `uvx copier copy --defaults --vcs-ref=HEAD . <tmp>` e emitir relatório no Gate 2 (`entrega-fatia-22.md`).

## Notas de Sessão

- **Estado atual:** Implementação concluída e verificada (`154/154` testes passando em `13` suítes; OpenSpec `21/21` validado; syntax check `exit 0`; scaffolding Copier `--vcs-ref=HEAD` validado). Aguardando aprovação humana do **Gate 2** via `entrega-fatia-22.md`.
- **Próximo passo:** Após aprovação do Gate 2, executar fechamento atômico (`openspec archive fatia-22-hardening-producao-banco-observabilidade-ci-contratos -y` → atualizar `openspec/roadmap.md` → `git add .` → `verificar-governanca.mjs --staged` → `git commit` → `verificar-governanca.mjs --ci` → criar/concluir issue no Linear `P-RR-2`).

## Roteiro de Validação Prática (Gate 2)

1. Confirmar em `template/constitution.md` os Artigos 1.2, 7.2 e 7.6 com todas as 3 Faixas preservadas.
2. Inspecionar `template/.github/workflows/ci.yml` comprovando ausência de `|| true` nos auditores de CVEs e no `alembic check`.
3. Rodar `npm test` e `npx --yes @fission-ai/openspec validate --all --no-interactive` com 100% de sucesso e 0 falhas.
