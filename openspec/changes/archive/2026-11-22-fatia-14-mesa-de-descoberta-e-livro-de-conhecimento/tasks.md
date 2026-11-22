# Tarefas — Fatia 14: Mesa de Descoberta Contínua e Livro de Conhecimento

- [x] 1. **Test-First (Vermelho):** Criar `tests/mesa-de-descoberta.test.mjs` cobrindo `template/.agents/skills/mesa-de-descoberta/SKILL.md`, `template/docs/conhecimento/INDICE.md`, proteção `"docs/conhecimento/**"` no `copier.yml`, registros em `template/AGENTS.md`, `template/README.md.jinja` e `AGENTS.md`, classificação documental em `classificar-arquivos.mjs` e checagem no `.github/workflows/ci.yml`; executar `node --test tests/mesa-de-descoberta.test.mjs` e confirmar falha legítima (Vermelho).
- [x] 2. **Skill e Índice do Livro (Verde — Parte 1):** Criar `template/.agents/skills/mesa-de-descoberta/SKILL.md` e `template/docs/conhecimento/INDICE.md` conforme os contratos de `design.md` e respeitando placeholders com `<...>` para integridade referencial.
- [x] 3. **Copier, Documentação e Índices (Verde — Parte 2):** Atualizar `copier.yml` (`_skip_if_exists`), `template/AGENTS.md`, `template/README.md.jinja`, `AGENTS.md` (raiz) e `.github/workflows/ci.yml`.
- [x] 4. **Ativação Automática Greenfield & Anti-Amnésia (Vermelho → Verde):** Adicionar teste `deve_ativar_mesa_de_descoberta_automaticamente_no_greenfield_e_exigir_leitura_fisica_anti_alucinacao` em `tests/mesa-de-descoberta.test.mjs`, comprovar falha Vermelha e atualizar `template/AGENTS.md`, `template/.agents/skills/inicializar-stack/SKILL.md` e `template/.agents/skills/mesa-de-descoberta/SKILL.md` até o Verde.
- [x] 5. **Memória da Matriz e Validação Final (Refactor):** Registrar Decisão `D42` em `00_INDICE_E_DECISOES.md`, atualizar `CHANGELOG.md`, marcar esta checklist como concluída e executar `npm test` + `npx --yes @fission-ai/openspec validate --all --no-interactive` para emissão do artefato do Gate 2.

## Notas de Sessão
- **Decisões fora do plano:** Referência ao índice do livro na raiz `AGENTS.md` escrita como `template/docs/conhecimento/INDICE.md` para manter integridade referencial da raiz em `tests/autogovernanca-dogfooding.test.mjs`; integração Greenfield ativada automaticamente com eixos progressivos e trava anti-amnésia/anti-alucinação antes do Gate 0.
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Aprovação humana no Gate 2 para arquivar o delta OpenSpec (`openspec archive`), atualizar o status em `openspec/roadmap.md` e realizar o commit.

## Roteiro de Validação Prática
1. Executar `node --test tests/mesa-de-descoberta.test.mjs` e confirmar que todos os testes da Fatia 14 passam.
2. Executar `npm test` e confirmar toda a suíte verde (incluindo `tests/template-docs.test.mjs` de integridade referencial bidirecional e `tests/autogovernanca-dogfooding.test.mjs`).
3. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive` e confirmar saída `0`.
4. Verificar que o template Copier gerado contém `.agents/skills/mesa-de-descoberta/SKILL.md` e `docs/conhecimento/INDICE.md`, e que `AGENTS.md` (raiz e template) e `template/README.md.jinja` documentam `/descobrir` e `/mesa`.
