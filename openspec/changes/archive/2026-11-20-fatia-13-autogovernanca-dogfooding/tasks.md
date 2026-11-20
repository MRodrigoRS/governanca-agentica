# Tarefas — Fatia 13: Auto-Governança da Matriz (Dogfooding em Fonte Única)

- [x] 1. **Test-First (Vermelho):** Criar `tests/autogovernanca-dogfooding.test.mjs` cobrindo classificação refinada de `template/`, camada universal em fonte única na raiz, execução de `.agents/hooks.json` apontando para `../template/scripts/hook-agente.mjs`, integridade referencial de `AGENTS.md` + `docs/arquitetura.md §5`, enforcement em `lefthook.yml`/`.github/workflows/ci.yml` e `CLAUDE_PROJECT_DIR` em `variaveisIgnoradas`; executar `npm test` e comprovar falha legítima (Vermelho).
- [x] 2. **Motor Determinístico (Verde — Parte 1):** Refinar `ehArquivoDeDocumentacaoOuGovernanca()` em `template/scripts/lib/classificar-arquivos.mjs` e incluir `'CLAUDE_PROJECT_DIR'` na linha existente de `variaveisIgnoradas` em `template/scripts/verificar-governanca.mjs` respeitando a catraca anti-monólito.
- [x] 3. **Camada Universal na Raiz (Verde — Parte 2):** Criar `AGENTS.md`, `.agents/hooks.json`, `.agents/rules/linear-mcp.md`, `.agents/rules/matriz-governanca.md` e adicionar `.agents/handoff.md` ao `.gitignore`.
- [x] 4. **Docs Vivos, OpenSpec Config e Memória (Verde — Parte 3):** Criar `docs/arquitetura.md` (C4 + §5 Mapa Físico), `docs/particularidades.md`, `docs/runbook.md` e `docs/aprendizados.md`; limpar `openspec/config.yaml` para perfil `cli-biblioteca`; atualizar `00_INDICE_E_DECISOES.md` (D41) e `CHANGELOG.md`.
- [x] 5. **Enforcement Local e CI + Validação Final (Refactor):** Atualizar `lefthook.yml` e `.github/workflows/ci.yml`, executar `npm test`, `openspec validate --all --no-interactive` e `verificar-governanca.mjs` (staged e `--ci`), e emitir artefato do Gate 2.

## Notas de Sessão
- **Decisões fora do plano:** Adotada Arquitetura 1A (fonte única sem duplicar `template/constitution.md` nem skills), Decisão 2A (refinamento de `classificar-arquivos.mjs` para `template/scripts/*.mjs`) e Decisão 3 (docs vivos na raiz sem `catalogo-reuso.md`/`docs/adr/`).
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Aprovação humana no Gate 2 para arquivar delta, commitar e enviar ao remoto.

## Roteiro de Validação Prática
1. Executar `npm test` e confirmar 99/99 testes passando (incluindo `tests/autogovernanca-dogfooding.test.mjs`).
2. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive` e confirmar retorno `0`.
3. Stagear as mudanças (`git add -A`) e executar `node template/scripts/verificar-governanca.mjs` e `node template/scripts/verificar-governanca.mjs --ci`, confirmando código de saída `0`.
4. Testar os hooks da raiz com cwd em `.agents/` (`node ../template/scripts/hook-agente.mjs session-start` e `pre-tool` bloqueando `git commit --no-verify`).
