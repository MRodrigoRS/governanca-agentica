# Desenho Técnico — Fatia 22 (`v4.8.0` — Capacidade C4)

## Contratos, Dados e Schemas

Este repositório matriz (`cli-biblioteca`) não possui banco de dados nem tabelas persistentes; o estado da fatia reside nos arquivos do template Copier (`template/`), documentação da matriz e testes automatizados em `tests/`.

1. **Constituição (`template/constitution.md` — v4.8.0):**
   - Preserva integralmente a tabela `## Hierarquia Constitucional (3 Faixas de Severidade — Anti-Diluição)` e os exatos 14 cabeçalhos `## Artigo 1`..`## Artigo 14` com seus selos `[Faixa X — ...]`.
   - **Artigo 1.2:** acrescenta cláusula de **Contratos Tipados Ponta-a-Ponta (Fonte Única)** exigindo compartilhamento ou geração automática de schemas entre servidor e cliente, vetando duplicação manual de DTOs e *casts* cegos (`as Tipo`) em payloads HTTP.
   - **Artigo 7.2:** acrescenta exigência de migrações zero-downtime (*expand-and-contract*) e seeds idempotentes (`upsert` / `ON CONFLICT`).
   - **Artigo 7.6 (novo):** **Observabilidade Mínima de Produção**: logs estruturados (JSON em produção) com nível, timestamp e `requestId` (*correlation ID*), proibição estrita de PII/segredos em logs, e endpoint `/health` (complementado por `/ready` quando houver dependências críticas).

2. **Regras Modulares por Glob (`template/.agents/rules/`):**
   - `backend-seguranca-dados.md.jinja`:
     - `globs` ampliado para: `"**/api/**, **/server/**, **/routes/**, **/controllers/**, **/*.prisma, **/schema*.ts, **/migrations/**, **/*.sql, **/seed*, **/seeds/**, **/schemas/**, **/*.py, **/*.go, **/*.gs"` (mantendo todas as entradas exigidas por `tests/regras-modulares-e-docs-mercado.test.mjs`).
     - Inclusão de seções dedicadas: `## 7. Migrações Seguras (Expand-and-Contract) e Seeds Idempotentes`, `## 8. Observabilidade Mínima (Logs Estruturados, requestId e /health)` e `## 9. Contratos Tipados Ponta-a-Ponta (Fonte Única)`.
   - `web-ui-pwa.md.jinja`:
     - Inclusão de `## 10. Consumo de Contratos Tipados da API (Zero Cast Cego e Zero DTO Duplicado)` sem alterar nenhum glob existente.

3. **CI Poliglota (`template/.github/workflows/ci.yml`):**
   - **Node:** substituir `npm audit --omit=dev --audit-level=high || true` por bloco condicionado ao lockfile real:
     - `package-lock.json`: `npm audit --omit=dev --audit-level=critical` (bloqueante, sem `|| true`) e checagem separada `--audit-level=high` emitindo `::warning::` se encontrar vulnerabilidades altas;
     - `pnpm-lock.yaml`: `pnpm audit --prod --audit-level=critical` + aviso `::warning::` para `high`;
     - `yarn.lock`: `yarn npm audit --environment production --severity critical` + aviso `::warning::` para `high`;
     - `bun.lockb` / `bun.lock`: `echo "::notice::[CI] Bun detectado — configure auditoria dedicada de CVEs para dependências de produção se aplicável."`.
   - **Python:**
     - `if [ -f "alembic.ini" ] && [ -n "$DATABASE_URL" ]; then uv run alembic check; fi` (sem `|| true`);
     - `if uv run pip-audit --version >/dev/null 2>&1; then uv run pip-audit; fi` (sem `|| true`, aceitando `--ignore-vuln` explícito no projeto consumidor apenas para exceções triadas não críticas).
   - **Rust:**
     - `if command -v cargo-audit >/dev/null 2>&1; then cargo audit; fi` (sem `|| true`).

## Interface e Estados Assíncronos

Não se aplica: este repositório matriz (`cli-biblioteca`) não possui interface gráfica, rotas HTTP ou componentes visuais; entrega exclusivamente regras normativas, template de CI, documentação operacional e testes unitários/integrados de contrato em Node.js ESM.

## Regras de Negócio e Segurança

- **Anti-Diluição Constitucional:** manter os detalhamentos extensos de *expand-and-contract*, PII redaction e OpenAPI nas rules modulares (`template/.agents/rules/`), deixando em `template/constitution.md` apenas as cláusulas objetivas e verificáveis.
- **Integridade Referencial (`tests/template-docs.test.mjs`):** nunca inserir caminhos fictícios iniciados por `docs/`, `openspec/`, `.agents/` ou `scripts/` em exemplos dentro de `template/AGENTS.md`, `template/README.md.jinja` ou qualquer `SKILL.md`, evitando falsos erros no auditor de referências.
- **Motor Determinístico Enxuto:** conforme decisão do `grill-me`, não serão adicionados regex SQL ou novos scripts em `template/scripts/lib/` nesta fatia.

## Fontes de Pesquisa Viva Consultadas

1. **Pesquisa Web (`pip-audit --format json` schema / flags):** confirmado que `pip-audit` emite `dependencies[].vulns[]` com `id`, `fix_versions` e `description`, **sem** campos nativos de `severity` ou `cvss` (pois PyPA/OSV não padronizam CVSS em todas as entradas) e sem `--min-severity`. Portanto, substituir o `|| true` cego por `uv run pip-audit` direto sem `|| true` evita falsos verdes artificiais de um parser por `cvss >= 9.0` inexistente.
2. **Pesquisa Web (`cargo audit` exit codes e `--json`):** confirmado que `cargo audit` retorna `exit 1` para vulnerabilidades de segurança confirmadas na base RustSec e `exit 0` com warning apenas para avisos informativos (`unmaintained`, `unsound`, `yanked`). Basta remover `|| true` de `cargo audit`.

## Impacto em Testes Existentes

- `tests/hierarquia-e-maturidade.test.mjs`: atualizar asserções literais de `4.7.0` para aceitar `4.7.0+` (`/^<!-- governanca:inicio v4\.(7|8|9|\d{2,})\.\d+/` ou similar conforme padrão de `tests/depuracao-e-prova-runtime.test.mjs`), mantendo estritas as verificações das 3 faixas, dos 3 sensores de maturidade e da existência de `D49` e `[4.7.0]`.
- `tests/template-docs.test.mjs`: preservar os 5 cabeçalhos exatos `## 1.`..`## 5.` em `template/docs/runbook.md` e validar integridade referencial após todas as edições.
- `tests/piramide-testes-e-ci-poliglota.test.mjs`: verificar manutenção de todas as regexes existentes de cobertura poliglota, lockfile, `pip-audit`, `cargo audit` e `migrate status|alembic`.
