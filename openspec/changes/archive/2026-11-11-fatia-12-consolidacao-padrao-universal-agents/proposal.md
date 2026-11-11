# Proposta — Fatia 12: Consolidação no Padrão Universal (`AGENTS.md` + `.agents/`) e Fechamento Fino da v4.0.0

## Por que
A proliferação de ~50 arquivos de wrappers proprietários de harnesses (`template/CLAUDE.md`, `template/GEMINI.md`, `template/.claude/`, `template/.cursor/`, `template/.vscode/`, `template/.github/prompts/`, `template/.github/instructions/`, `template/.github/agents/`, `template/.github/copilot-instructions.md`) criava volume visual e duplicação desnecessária na árvore de diretórios dos projetos consumidores. Com a convergência do mercado (Antigravity, Claude Code, OpenAI Codex, Cursor, Copilot, Windsurf) em torno do padrão agnóstico `AGENTS.md` e `.agents/` (`rules/`, `skills/`, `hooks.json`), manter dezenas de redirecionadores proprietários tornou-se obsoleto. Além disso, a auditoria de fechamento da v4.0.0 identificou 6 pendências pontuais de sincronia de versão, `pre-commit` poliglota, catálogo de stacks e `ci.yml` que precisam ser sanadas.

## O que muda
1. **Remoção Integral de Wrappers Proprietários de Harness:**
   - Exclusão de `template/CLAUDE.md`, `template/GEMINI.md`, `template/.claude/` (incluindo `commands/`, `rules/`, `agents/`, `settings.json`), `template/.cursor/` (`commands/`, `rules/`, `mcp.json.jinja`), `template/.vscode/` (`mcp.json.jinja`), `template/.github/copilot-instructions.md`, `template/.github/agents/`, `template/.github/instructions/` e `template/.github/prompts/`.
   - Manutenção exclusiva da fonte universal: `template/AGENTS.md`, `template/.agents/rules/*.md.jinja`, `template/.agents/skills/*/SKILL.md`, `template/.agents/hooks.json`, `template/.mcp.json.jinja`, `template/.github/workflows/ci.yml` e `template/.github/pull_request_template.md`.
2. **Fechamento das 6 Pendências da Auditoria v4.0.0:**
   - Atualização de `template/openspec/project.md.jinja` e `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` para `v4.0.0` + asserção real de versão em `tests/regras-modulares-e-docs-mercado.test.mjs`.
   - Inclusão explícita da auditoria de *Anti-Mock de Banco Próprio* e válvula `governanca:mock-banco-justificado` em `template/.agents/skills/revisar-fatia/SKILL.md`.
   - Execução rápida poliglota no `pre-commit` de `template/lefthook.yml` (Node, Python `pytest -m "not slow"` e Rust `cargo test --lib`).
   - Inclusão do contrato oficial de Smoke Test Web (`@axe-core/playwright`, viewports `320x640` e `1280x800`, `pageerror`) em `catalogo-stacks.md`.
   - Adição de validação de migrações limpas e auditoria `pip-audit`/`cargo audit` em `template/.github/workflows/ci.yml`, e remoção das checagens de `.claude/` em `.github/workflows/ci.yml` da raiz e `copier.yml`.

## Fica de Fora
- Novos sensores regex em `verificar-governanca.mjs` ou mudanças nas regras de cerimônia (`classificar-cerimonia.mjs`).
