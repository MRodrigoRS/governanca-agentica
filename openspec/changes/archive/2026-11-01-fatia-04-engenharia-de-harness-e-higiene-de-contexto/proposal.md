# Proposta: Engenharia de Harness Determinística, Guardrails Pós-Edição e Higiene de Contexto (`fatia-04`)

## Vínculo com o Roadmap e Linear

- **Fatia do Roadmap:** [openspec/roadmap/fatia-04-engenharia-de-harness-e-higiene-de-contexto.md](../../roadmap/fatia-04-engenharia-de-harness-e-higiene-de-contexto.md)
- **Issue Linear (`P-RR-2`):** [`RR-6`](https://linear.app/rr-diario-agents/issue/RR-6/texto-profissional-da-mais-avancada-programacao-com-agentes)

## Por Quê (Motivação)

A auditoria forense do código real da Governança (`v3.3.0`) contra as práticas de Engenharia de Harness e Gestão de Contexto da issue `RR-6` revelou quatro oportunidades de alto retorno:
1. **Ausência de feedback determinístico imediato na escrita/edição de arquivos:** Hoje as violações (`location.reload`, `.only(`, teste oco, fatia de roadmap preguiçosa ou erro de sintaxe `.mjs`) só são detectadas tardiamente no pre-commit/Gate 2, desperdiçando tokens até lá.
2. **Brechas e assimetrias em `hook-agente.mjs` e `.agents/hooks.json`:** A flag curta `-n` em `git commit` burlava a trava de `--no-verify`; comandos destrutivos (`git clean -f`, `git restore .`, resets de ORM) passavam sem confirmação; `.agents/hooks.json` apontava para `scripts/hook-agente.mjs` sem subir um nível (`../scripts/`) a partir de `.agents/`; e o Claude Code não exigia confirmação humana em `git commit`/`push` nem recebia contexto no `SessionStart`.
3. **Brecha no vínculo Roadmap ↔ OpenSpec (`verificar-governanca.mjs`):** Um delta `fatia-XX-*` podia ser criado e arquivado em `openspec/changes/` sem o arquivo físico correspondente em `openspec/roadmap/fatia-XX-*.md`.
4. **Higiene de Contexto e Antifragilidade:** Necessidade de formalizar o teto enxuto de MCPs ativos (3 a 5 + banco *read-only*), o fallback `/llms.txt` para SDKs externos, a delegação de varreduras amplas a subagentes *read-only* e a conversão de falhas recorrentes em regras determinísticas no `/fix`.

## Escopo Fechado

### O Que ENTRA
- Sensor instantâneo (< 30ms) de escrita/edição de arquivos (`PreToolUse` `write_file|edit_file` no Antigravity e `PostToolUse` `Write|Edit|MultiEdit` no Claude Code).
- Bloqueio da flag curta `-n` em `git commit`, interceptação (`force_ask`/`ask`) de comandos destrutivos e paridade completa Antigravity + Claude Code em `hook-agente.mjs`, `.agents/hooks.json` e `.claude/settings.json`.
- Validação determinística da correspondência física `openspec/roadmap/fatia-XX-*.md` para deltas `fatia-XX-*` em `verificar-governanca.mjs`, além de auditoria exata das pastas staged em `openspec/changes/archive/`.
- Diretrizes cirúrgicas de Orçamento MCP (3–5 ativos + banco *read-only*), `/llms.txt`, subagente explorador *read-only* e antifragilidade no `/fix` em `template/AGENTS.md`, `catalogo-stacks.md` e `ciclo-especificacao/SKILL.md`.
- Expansão da suíte automatizada em `tests/` (Test-First).

### O Que FICA DE FORA
- Criação de `SPEC.md` ou `TODO.md` paralelos ao OpenSpec.
- Fragmentação de `template/constitution.md` em múltiplos arquivos (preservação do `copier update`).
- Imposição de `git worktree` paralelo no fluxo padrão de fatias sequenciais.
- Dependências externas npm em `template/`.
