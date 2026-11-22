# Tarefas — Fatia 15: Síntese de Conhecimento em Escala (Map-Reduce Anti-Alucinação)

- [x] 1. **Test-First (Vermelho):** Criar `tests/sintetizar-conhecimento.test.mjs` cobrindo `template/.agents/skills/sintetizar-conhecimento/SKILL.md`, `template/docs/conhecimento/materiais/.gitkeep`, atualização de `INDICE.md`, gatilho automático em `mesa-de-descoberta` e `inicializar-stack`, registros em `AGENTS.md`, `template/AGENTS.md`, `template/README.md.jinja`, classificação documental e checagem no `.github/workflows/ci.yml`; executar `node --test tests/sintetizar-conhecimento.test.mjs` e confirmar falha legítima (Vermelho).
- [x] 2. **Skill de Síntese e Pasta de Materiais (Verde — Parte 1):** Criar `template/.agents/skills/sintetizar-conhecimento/SKILL.md` e `template/docs/conhecimento/materiais/.gitkeep`, e atualizar `template/docs/conhecimento/INDICE.md`.
- [x] 3. **Integração Automática, Índices e CI (Verde — Parte 2):** Atualizar `template/.agents/skills/mesa-de-descoberta/SKILL.md` (Passo 3), `template/.agents/skills/inicializar-stack/SKILL.md` (Passo 2), `template/AGENTS.md`, `template/README.md.jinja`, `AGENTS.md` (raiz) e `.github/workflows/ci.yml`.
- [x] 4. **Memória da Matriz e Validação Final (Refactor):** Registrar Decisão `D43` em `00_INDICE_E_DECISOES.md`, atualizar `CHANGELOG.md`, marcar esta checklist como concluída e executar `npm test` + `npx --yes @fission-ai/openspec validate --all --no-interactive` para emissão do artefato do Gate 2.

## Notas de Sessão
- **Decisões fora do plano:** Referência em `AGENTS.md` (raiz) usa `template/docs/conhecimento/materiais/` para respeitar a integridade referencial da raiz validada por `tests/autogovernanca-dogfooding.test.mjs`.
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Aprovação humana no Gate 2 para atualizar `openspec/roadmap.md`, arquivar o delta OpenSpec (`openspec archive`), validar com `verificar-governanca.mjs` e realizar o commit.

## Roteiro de Validação Prática
1. Executar `node --test tests/sintetizar-conhecimento.test.mjs` e confirmar todos os testes passando.
2. Executar `npm test` e confirmar toda a suíte verde (incluindo `tests/template-docs.test.mjs` e `tests/autogovernanca-dogfooding.test.mjs`).
3. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive` e confirmar saída `0`.
4. Inspecionar `.agents/skills/sintetizar-conhecimento/SKILL.md`, `docs/conhecimento/INDICE.md` e os gatilhos automáticos em `mesa-de-descoberta` e `inicializar-stack`.
