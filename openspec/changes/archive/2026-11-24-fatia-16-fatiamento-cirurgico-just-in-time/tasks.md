# Tarefas — Fatia 16: Fatiamento Cirúrgico Just-in-Time (Subagente Arquiteto-Fatiador)

- [x] 1. **Test-First (Vermelho):** Criar `tests/planejar-proxima-fatia.test.mjs` cobrindo `template/.agents/skills/planejar-proxima-fatia/SKILL.md`, novo layout em 3 camadas de `template/openspec/roadmap.md.jinja`, integração em `inicializar-stack`, `sintetizar-conhecimento`, `mesa-de-descoberta`, `ciclo-especificacao`, `template/constitution.md` (Artigo 8.2/8.3), `template/AGENTS.md`, `template/README.md.jinja`, `AGENTS.md` (raiz), `.github/workflows/ci.yml`, retrocompatibilidade de `verificar-governanca.mjs --staged` (layout novo 3 camadas + legado multi-fatias), SemVer `4.2.0` e Decisão `D44`; executar `node --test tests/planejar-proxima-fatia.test.mjs` e confirmar falha legítima (Vermelho).
- [x] 2. **Skill `planejar-proxima-fatia` e `roadmap.md.jinja` (Verde — Parte 1):** Criar `template/.agents/skills/planejar-proxima-fatia/SKILL.md` e reestruturar `template/openspec/roadmap.md.jinja` com as 3 camadas e apenas `### [ ] fatia-01-fundacao`.
- [x] 3. **Skills, Constituição, Índices e CI (Verde — Parte 2):** Atualizar `inicializar-stack/SKILL.md`, `sintetizar-conhecimento/SKILL.md`, `mesa-de-descoberta/SKILL.md`, `ciclo-especificacao/SKILL.md`, `template/constitution.md`, `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, `AGENTS.md` (raiz) e `.github/workflows/ci.yml`.
- [x] 4. **Decisão `D44`, SemVer `4.2.0` e Validação Completa (Refactor):** Atualizar `00_INDICE_E_DECISOES.md`, `package.json`, `CHANGELOG.md` e `README.md`, confirmar `node --test tests/planejar-proxima-fatia.test.mjs`, `npm test` e `npx --yes @fission-ai/openspec validate --all --no-interactive` 100% verdes para Gate 2.

## Notas de Sessão
- **Decisões fora do plano:** Nenhuma. Mantido `template/scripts/verificar-governanca.mjs` intacto (Catraca Anti-Monólito / Artigo 14) e versão elevada para `4.2.0` conforme acordado no alinhamento.
- **Bloqueios abertos:** Nenhum.
- **Próximo passo:** Aprovação humana no Gate 2 para marcar `[x] Concluído` em `openspec/roadmap.md`, arquivar o delta OpenSpec (`openspec archive`), validar com `verificar-governanca.mjs`, comitar e criar a tag `v4.2.0`.

## Roteiro de Validação Prática
1. Executar `node --test tests/planejar-proxima-fatia.test.mjs` e confirmar todos os testes passando.
2. Executar `npm test` e confirmar toda a suíte verde (incluindo `tests/template-docs.test.mjs`, `tests/copier-e2e-e-consistencia.test.mjs`, `tests/sintetizar-conhecimento.test.mjs` e `tests/mesa-de-descoberta.test.mjs`).
3. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive` e confirmar saída `0`.
4. Verificar `template/.agents/skills/planejar-proxima-fatia/SKILL.md` e `template/openspec/roadmap.md.jinja` gerados por `uvx copier copy`.
