# Tarefas — Fatia 12: Consolidação no Padrão Universal (`AGENTS.md` + `.agents/`) e Fechamento v4.0.0

- [x] 1. **Test-First (Vermelho):** Atualizar `tests/template-mcp.test.mjs`, `tests/regras-modulares-e-docs-mercado.test.mjs`, `tests/comandos-e-handoff.test.mjs`, `tests/reuso-e-modularizacao.test.mjs` e `tests/piramide-testes-e-ci-poliglota.test.mjs` exigindo ausência dos ~50 wrappers proprietários, assert real de versão `v4.0.0` nos cabeçalhos, `pre-commit` poliglota, `@axe-core/playwright` em `catalogo-stacks.md` e cláusula anti-mock de banco em `revisar-fatia/SKILL.md` (comprovar falha legítima — Vermelho).
- [x] 2. **Remoção de Wrappers Proprietários (Verde — Parte 1):** Remover `template/CLAUDE.md`, `template/GEMINI.md`, `template/.claude/`, `template/.cursor/`, `template/.vscode/`, `template/.github/copilot-instructions.md`, `template/.github/agents/`, `template/.github/instructions/` e `template/.github/prompts/`, limpando referências em `copier.yml`, `template/AGENTS.md`, skills e `.github/workflows/ci.yml`.
- [x] 3. **Fechamento das 6 Pendências da Auditoria (Verde — Parte 2):**
  - Sincronizar versão `v4.0.0` em `template/openspec/project.md.jinja` e `catalogo-stacks.md`.
  - Adicionar cláusula de auditoria Anti-Mock de Banco e válvula `governanca:mock-banco-justificado` em `template/.agents/skills/revisar-fatia/SKILL.md`.
  - Atualizar `pre-commit` em `template/lefthook.yml` para rodar testes rápidos poliglotas (Node, Python, Rust).
  - Espelhar contrato de Smoke Test (`@axe-core/playwright`, viewports `320x640` e `1280x800`) em `catalogo-stacks.md`.
  - Adicionar checagem de migrações e `pip-audit`/`cargo audit` em `template/.github/workflows/ci.yml`.
- [x] 4. **Documentação e Validação Final (Refactor):** Registrar Decisão D40 em `00_INDICE_E_DECISOES.md`, atualizar `CHANGELOG.md`, marcar `fatia-12` como concluída em `openspec/roadmap.md`, arquivar o delta e validar `npm test`, `openspec validate --all --no-interactive` e `verificar-governanca.mjs`.

## Notas de Sessão
- **Decisões fora do plano:** Adotado o Padrão Universal Puro (`AGENTS.md` + `.agents/`) eliminando 51 wrappers proprietários de harnesses.
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Apresentar Gate 2 ao usuário para commit final e criação da tag `v4.0.0`.

## Roteiro de Validação Prática
1. Executar `npm test` e confirmar 100% dos testes verdes (77/77).
2. Verificar que `template/.claude`, `template/.cursor`, `template/.vscode`, `template/CLAUDE.md` e `template/GEMINI.md` não existem mais.
3. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` com código de saída `0`.
