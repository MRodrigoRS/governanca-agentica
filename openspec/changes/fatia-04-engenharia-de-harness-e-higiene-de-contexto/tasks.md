# Tarefas de Implementação — `fatia-04-engenharia-de-harness-e-higiene-de-contexto`

- [ ] **1. Testes Automatizados de Hooks (`tests/hook-agente.test.mjs` — Ciclo Vermelho → Verde):**
  - [ ] 1.1. Escrever testes falhando para bloqueio de `git commit -n` / `-am "..." -n` sem falso positivo quando `-n` está na mensagem entre aspas.
  - [ ] 1.2. Escrever testes falhando para confirmação humana (`force_ask` no Antigravity e `permissionDecision: "ask"` no Claude Code) em commits, pushes, `git clean -fd`, `git restore .` e `prisma migrate reset`.
  - [ ] 1.3. Escrever testes falhando para bloqueio instantâneo de `write_file`/`edit_file` (Antigravity) e `post-tool-claude` (Claude Code) ao detectar `location.reload`, `.only(`, teste oco, fatia com placeholder/incompleta e erro de sintaxe `.mjs`.
  - [ ] 1.4. Escrever testes falhando para `session-start-claude` injetando `additionalContext` com mudanças ativas e validação do caminho relativo em `template/.agents/hooks.json` executado a partir de `template/.agents/`.
  - [ ] 1.5. Implementar as evoluções e refatoração limpa (*early returns*, DRY, PT-BR) em `template/scripts/hook-agente.mjs`, `template/.agents/hooks.json` e `template/.claude/settings.json` até todos os testes ficarem verdes.
- [ ] **2. Testes e Blindagem de Vínculo Roadmap ↔ OpenSpec (`tests/verificar-governanca.test.mjs` — Ciclo Vermelho → Verde):**
  - [ ] 2.1. Escrever teste falhando em `tests/verificar-governanca.test.mjs` comprovando que um delta `openspec/changes/fatia-09-fantasma` sem `openspec/roadmap/fatia-09-fantasma.md` é rejeitado com `exit 1` (e aprovado com `exit 0` quando o arquivo físico existe).
  - [ ] 2.2. Implementar `verificarVinculoRoadmapMudanca` e refinar a extração das pastas staged de `openspec/changes/archive/` em `template/scripts/verificar-governanca.mjs`, comprovando todos os testes verdes.
- [ ] **3. Diretrizes Cirúrgicas de Engenharia de Contexto e Antifragilidade:**
  - [ ] 3.1. Atualizar `template/AGENTS.md` com delegação de varredura ampla a subagentes *read-only*, fallback `/llms.txt` / `gh` CLI e orçamento enxuto de MCPs.
  - [ ] 3.2. Atualizar `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` com o Teto de Higiene MCP (3–5 servidores ativos), diretriz *read-only* para MCPs de banco compartilhado e padrão `/llms.txt`.
  - [ ] 3.3. Atualizar `template/.agents/skills/ciclo-especificacao/SKILL.md` com a diretriz de antifragilidade no `/fix` (converter falhas recorrentes em regra determinística de linter/validador) e nota de regras escopadas por *glob* quando aplicável.
- [ ] **4. Versionamento, Auditoria Forense Cega e Gate 2:**
  - [ ] 4.1. Atualizar versão para `3.4.0` em `package.json` e documentar entregas em `CHANGELOG.md`.
  - [ ] 4.2. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive`, `npm test` e `node template/scripts/verificar-governanca.mjs`.
  - [ ] 4.3. Acionar Subagente Inspetor Forense para auditoria cega do `git diff`, realizar Duelo de Conformidade contra `openspec/roadmap/fatia-04-engenharia-de-harness-e-higiene-de-contexto.md` e submeter ao Gate 2.
