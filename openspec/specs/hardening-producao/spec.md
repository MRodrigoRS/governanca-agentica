# hardening-producao Specification

## Purpose

TBD - created by archiving change fatia-22-hardening-producao-banco-observabilidade-ci-contratos. Update Purpose after archive.

## Requirements

### Requirement: Observabilidade mínima no Artigo 7 e migrações/seeds seguros
A Constituição (`template/constitution.md`) e as regras/runbook do template DEVEM definir observabilidade mínima no Artigo 7 e práticas seguras de evolução de banco e seeds sem fragmentar as 3 Faixas nem quebrar a ordem dos Artigos 1–14.

#### Scenario: Constituição exige observabilidade mínima e migrações expand-and-contract
- **WHEN** um agente ou projeto consumidor lê `template/constitution.md`
- **THEN** o Artigo 7 (`[Faixa 1 — Crítico]`) contém o item 6 definindo logs estruturados sem PII/segredos, propagação de `requestId` (*correlation ID*) e endpoint `/health`, o Artigo 7.2 inclui migrações zero-downtime (*expand-and-contract*) e seeds idempotentes, e todos os títulos `## Artigo 1`..`## Artigo 14` preservam seus selos de faixa e ordem original.

#### Scenario: Regras de backend e runbook detalham operação real de migrações, seeds e observabilidade
- **WHEN** o projeto utiliza `.agents/rules/backend-seguranca-dados.md` e `docs/runbook.md`
- **THEN** `backend-seguranca-dados.md.jinja` detalha fases *expand* e *contract*, proibição de `DROP`/`RENAME` ou `NOT NULL` sem `DEFAULT` em passo único sob tráfego, seeds idempotentes (`upsert`/`ON CONFLICT`), logs JSON com redação de PII e `/health` + `/ready`, enquanto `template/docs/runbook.md` mantém intactos seus 5 cabeçalhos canônicos (`## 1.`..`## 5.`).

---

### Requirement: Diretriz transversal de contratos tipados ponta-a-ponta (Fonte Única)
O protocolo DEVE estabelecer fonte única de contratos tipados entre servidor e cliente, proibindo duplicação manual de DTOs e *type assertions* cegas sobre respostas HTTP.

#### Scenario: Constituição, regras modulares e catálogo de stacks formalizam fonte única de contratos
- **WHEN** o projeto envolve API e frontend ou clientes desacoplados
- **THEN** `template/constitution.md` (Artigo 1.2), `backend-seguranca-dados.md.jinja`, `web-ui-pwa.md.jinja` e `catalogo-stacks.md` orientam o compartilhamento de schemas declarativos ou geração a partir de OpenAPI/tRPC, proibindo DTOs duplicados à mão e `res.json() as Tipo` sem validação ou geração tipada.

---

### Requirement: Hardening determinístico de CVEs e migrações no CI poliglota
O workflow distribuído `template/.github/workflows/ci.yml` DEVE eliminar comandos mascarados por `|| true` nos auditores de vulnerabilidades e na checagem do Alembic.

#### Scenario: Auditoria Node respeita o lockfile, bloqueia CVEs critical e avisa em high
- **WHEN** o job `qualidade-e-testes` roda em um repositório Node com `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` ou `bun.lock*`
- **THEN** o passo de segurança executa auditoria específica para o gerenciador detectado sem `|| true` na severidade `critical` (falhando o CI se houver vulnerabilidade crítica) e executa verificação separada emitindo `::warning::` para `high` sem ocultar falhas com `|| true` cego.

#### Scenario: Auditorias Python e Rust removem || true cego com transparência operacional
- **WHEN** o job `qualidade-e-testes` encontra `pyproject.toml` ou `Cargo.toml`
- **THEN** `uv run alembic check` é executado apenas quando `alembic.ini` e `$DATABASE_URL` existem (sem `|| true`), `uv run pip-audit` executa sem `|| true` quando instalado no ambiente e `cargo audit` executa sem `|| true` (bloqueando vulnerabilidades RustSec e mantendo comportamento nativo não-bloqueante para avisos `unmaintained`/`yanked`).

---

### Requirement: Cobertura forense, AppSec e ampliação de globs nas regras de backend
As skills de revisão e auditoria e a Matriz Universal DEVEM refletir os novos controles de C4, e `backend-seguranca-dados.md.jinja` DEVE ativar em arquivos SQL, seeds e schemas.

#### Scenario: Skills forense/AppSec e globs de backend cobrem os controles de C4
- **WHEN** um agente edita migrações `.sql`, arquivos `seed*`/`seeds/**` ou `schemas/**`, ou executa `/revisar` e `/auditar-seguranca`
- **THEN** `backend-seguranca-dados.md.jinja` inclui `**/*.sql`, `**/seed*`, `**/seeds/**` e `**/schemas/**` preservando todos os globs preexistentes, `template/AGENTS.md` reflete essas entradas na Matriz Universal, `revisar-fatia/SKILL.md` audita migrações destrutivas/seeds, PII em logs/`requestId` e deriva de contratos, e `auditoria-seguranca/SKILL.md` audita logs estruturados com `requestId` e política rigorosa de CVEs no CI.

---

### Requirement: Sincronia SemVer v4.8.0 e integridade referencial preservada
Todos os artefatos versionados da matriz e do template DEVEM avançar de forma sincronizada para `4.8.0` mantendo 100% de integridade referencial e compatibilidade com a suíte existente.

#### Scenario: Versão v4.8.0 sincronizada entre pacote, template, decisões e testes
- **WHEN** `npm test`, `node template/scripts/verificar-governanca.mjs` e `openspec validate --all --no-interactive` são executados após a entrega
- **THEN** `package.json` (`4.8.0`), cabeçalhos `governanca:inicio v4.8.0`, `project.md.jinja`, `catalogo-stacks.md`, `00_INDICE_E_DECISOES.md` (`D50`), `README.md` e `CHANGELOG.md` estão em `4.8.0`, `tests/hierarquia-e-maturidade.test.mjs` aceita `4.7.0+` e `tests/hardening-producao.test.mjs` passa integralmente junto com toda a suíte.
