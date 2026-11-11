# Design Técnico — Fatia 12: Consolidação no Padrão Universal e Fechamento v4.0.0

## Contratos, Dados e Schemas
1. **Arquitetura Universal de Customização Agêntica:**
   - **Instruções Raiz:** `template/AGENTS.md` (único ponto de entrada na raiz para todos os harnesses compatíveis com o padrão AGENTS.md).
   - **Regras Modulares por Perfil/Glob:** `template/.agents/rules/` (`web-ui-pwa.md.jinja`, `backend-seguranca-dados.md.jinja`, `jogos-engines.md.jinja`, `linear-mcp.md.jinja`).
   - **Skills e Fluxos Operacionais:** `template/.agents/skills/` (`inicializar-stack`, `ciclo-especificacao`, `revisar-fatia`, `reuso-e-modularizacao`, `refinar-ideia`, `explorar-produto`, `atualizar-governanca`).
   - **Hooks de Ciclo de Vida:** `template/.agents/hooks.json` acionando `../scripts/hook-agente.mjs`.
   - **Servidores MCP:** `template/.mcp.json.jinja` na raiz.
   - **Remoção de `.claude/settings.local.json` de `copier.yml`:** Limpeza da lista `_skip_if_exists`.

2. **Fechamento Técnico dos 6 Pontos da Auditoria:**
   - **Sincronia de Versão (`v4.0.0`):** Atualizar `template/openspec/project.md.jinja` (`Governança v4.0.0`) e `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` (`Governança v4.0.0`), adicionando `assert` explícito em `tests/regras-modulares-e-docs-mercado.test.mjs`.
   - **Pre-commit Poliglota Rápido (`template/lefthook.yml`):** No bloco `unit-tests` do `pre-commit`, executar Node (`npm run --if-present test:unit || npm test --if-present`), Python (`uv run pytest -m "not slow" || pytest -m "not slow"`) ou Rust (`cargo test --lib`) conforme manifesto presente.
   - **CI Poliglota Completo (`template/.github/workflows/ci.yml`):** Adicionar verificação de migrações pendentes (Prisma `migrate status` / Alembic) e auditoria de pacotes em Python (`pip-audit`) e Rust (`cargo audit`).
   - **Inspetor Forense Universal (`template/.agents/skills/revisar-fatia/SKILL.md`):** Consolidar a instrução do Inspetor Forense diretamente na skill universal `revisar-fatia/SKILL.md` (já que `.claude/agents/inspetor-forense.md` e `.github/agents/inspetor-forense.agent.md` são removidos), incluindo explicitamente a verificação de persistência real (SQLite/PGlite) vs. mocks de ORM e auditoria da válvula `governanca:mock-banco-justificado`.

## Interface e Estados Assíncronos
Não se aplica: fatia estritamente voltada a templates de governança, scripts de CI/hooks e consolidação da árvore de arquivos agênticos.

## Regras de Negócio e Segurança
1. **Preservação Integral das Travas de Segurança em `hook-agente.mjs`:** O script `template/scripts/hook-agente.mjs` mantém todas as validações determinísticas (`force_ask` em `git commit`/`git push`/`git tag`/comandos destrutivos, bloqueio de leitura de `.env*`, anti-placeholder e sensor pós-edição).
2. **Integridade da Suíte de Testes:** Os testes existentes em `tests/template-mcp.test.mjs`, `tests/regras-modulares-e-docs-mercado.test.mjs`, `tests/comandos-e-handoff.test.mjs` e `tests/reuso-e-modularizacao.test.mjs` são atualizados para validar a árvore universal pura (garantindo ausência dos diretórios proprietários removidos e presença de `.agents/rules/`, `.agents/skills/`, `AGENTS.md` e `.mcp.json.jinja`).
