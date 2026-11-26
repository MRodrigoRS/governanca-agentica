# Tarefas: Matriz de Rastreabilidade End-to-End (`fatia-17-matriz-rastreabilidade-end-to-end`)

- [x] 1. Test-First (Vermelho): criar `tests/auditar-matriz-requisitos.test.mjs` cobrindo os 10 cenários obrigatórios (retrocompatibilidade, matriz íntegra, anti-preguiça, IDs inválidos/duplicados, status canônico, fonte inexistente, anti-teatro `[x]`, sensor reverso, trava de archive com prefixo de data e telemetria `SessionStart` + proteção `copier update`) e comprovar falha inicial.
- [x] 2. Implementar `template/scripts/lib/auditar-matriz-requisitos.mjs` (≤ 350 linhas úteis, zero dependências externas) com parser, 6 regras determinísticas e `resumirMatrizRequisitos`.
- [x] 3. Integrar `auditarMatrizRequisitos` em `template/scripts/verificar-governanca.mjs` mantendo contagem de linhas úteis `<= HEAD` (Catraca Anti-Monólito) e consolidando `subpastasArchiveStaged`.
- [x] 4. Integrar `[MATRIZ REQUISITOS]` em `template/scripts/hook-agente.mjs` (`session-start` e `session-start-claude`) preservando o teto de 600 caracteres.
- [x] 5. Criar `template/openspec/matriz-requisitos.md.jinja`, proteger em `copier.yml` (`_skip_if_exists`) e atualizar `template/constitution.md` (Artigo 12.6), `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja` e as 6 skills (`sintetizar-conhecimento`, `planejar-proxima-fatia`, `ciclo-especificacao`, `refinar-ideia`, `mesa-de-descoberta`, `revisar-fatia`).
- [x] 6. Atualizar `package.json` (`4.3.0`), `00_INDICE_E_DECISOES.md` (`D45`), `docs/arquitetura.md` (§5), `lefthook.yml`, `.github/workflows/ci.yml`, `CHANGELOG.md`, `README.md` e sincronizar `tests/planejar-proxima-fatia.test.mjs` para `4.3.0`.
- [x] 7. Refatorar, executar `node --check`, `npm test`, `openspec validate --all --no-interactive`, `verificar-governanca.mjs` e validação E2E do Copier.

## Notas de Sessão
- **Decisões fora do plano:** linha-guia inicial de `template/openspec/matriz-requisitos.md.jinja` em itálico sem crases para não quebrar `copier copy --defaults`; normalização de `YYYY-MM-DD-` na trava de archive; priorização da telemetria antes do corte de 600 chars; consolidação de `subpastasArchiveStaged` em `verificar-governanca.mjs` mantendo linhas úteis abaixo de `HEAD`.
- **Bloqueios abertos:** nenhum; pronto para Gate 2 e autorização humana de commit/archive/tag `v4.3.0`.
- **Próximo passo:** aguardar aprovação humana no Gate 2 para commitar, arquivar no OpenSpec e publicar `v4.3.0`.

## Roteiro de Validação Prática
1. Executar `npm test` na raiz do repositório matriz e confirmar que todos os testes (incluindo os 10 cenários de `tests/auditar-matriz-requisitos.test.mjs` e os testes Copier) passam 100% verdes.
2. Executar `uvx copier copy --defaults --vcs-ref=HEAD . <dir-temp>` (ou após commit em `HEAD`), inicializar Git, fazer `git add .` e rodar `node scripts/verificar-governanca.mjs --staged` comprovando aprovação no boot inicial sem falsos positivos.
3. Popular `openspec/matriz-requisitos.md` no diretório temporário com requisitos `[x] Entregue`, `[~] Em andamento` e `[ ] Pendente`, rodar `node scripts/hook-agente.mjs session-start` observando `[MATRIZ REQUISITOS] Total: ...` e confirmar que `verificar-governanca.mjs --staged` bloqueia `[x]` sem prova real ou `archive` com requisito `[~]` ainda aberto.
