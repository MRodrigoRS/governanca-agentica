# Proposta: Fatia 19 — Blindagem do Motor, Agregador de Erros e Fechamento Atômico (v4.5.0)

## Por que
Uma auditoria técnica profunda sobre a Governança v4.4.0 revelou 3 furos reais de integridade determinística e 2 pontos críticos de atrito/transparência no fluxo cotidiano:
1. **Furo no bloqueio de `.env*` em `PreToolUse`:** `template/scripts/hook-agente.mjs` implementa o bloqueio para `read_file`, `view` e `Read`, mas `template/.agents/hooks.json` e `.agents/hooks.json` declaram `matcher: "run_command|write_file|edit_file"`, deixando chamadas diretas de leitura de arquivo sem interceptação.
2. **Falsos verdes no modo `--ci`:** tanto `template/scripts/lib/classificar-cerimonia.mjs` quanto o sensor Anti-Monólito em `template/scripts/verificar-governanca.mjs` inspecionam a área de *staging* (`git diff --cached` / `git show :arq` vs `HEAD`), que está vazia no GitHub Actions pós-commit. No CI, violações de cerimônia (Via 1a/1b/1.5) e arquivos que cruzaram 350 linhas úteis passam impunes.
3. **Ordem invertida no fechamento do Gate 2:** `template/.agents/skills/ciclo-especificacao/SKILL.md` instrui `git add .` e `git commit` **antes** de `openspec archive` e da marcação `[x] Concluído` em `openspec/roadmap.md`, deixando a árvore de trabalho suja após o commit e impedindo que as travas de arquivamento em `verificar-governanca.mjs` rodem no fechamento da fatia.
4. **Monólito e *fail-fast* no verificador:** `template/scripts/verificar-governanca.mjs` atingiu 1.205 linhas (acima do próprio teto de 350 linhas úteis) e chama `process.exit(1)` na primeira violação, obrigando o agente a iterar múltiplas vezes para descobrir todos os erros de um commit.
5. **Válvulas de escape silenciosas:** com a auditoria forense opcional (`/revisar`, D38), válvulas `governanca:mock-banco-justificado` ou `governanca:arquivo-extenso-justificado` podem passar sem visibilidade explícita para o humano no Gate 2.

## O que muda
1. **Bloqueio real de leitura de `.env*`:** atualizar `matcher` de `PreToolUse` em `template/.agents/hooks.json` e `.agents/hooks.json` para incluir `read_file|view_file|Read`.
2. **Paridade real no modo `--ci`:** criar `template/scripts/lib/git-diff-helper.mjs` e adaptar `classificar-cerimonia.mjs` e o sensor Anti-Monólito para operar sobre `HEAD~1..HEAD` quando `modoCi === true`.
3. **Ordem atômica no Gate 2:** ajustar `ciclo-especificacao/SKILL.md` e `template/AGENTS.md` para executar `openspec archive` + `[x]` em `roadmap.md` + atualização final de `matriz-requisitos.md` **antes** do `git add` e `git commit`.
4. **Desmonolitização e Agregador de Erros:** extrair `auditar-openspec.mjs`, `sensores-codigo.mjs` e `sensores-indices.mjs` para `template/scripts/lib/` (todos ≤ 350 linhas úteis), adaptar `auditar-matriz-requisitos.mjs` para coleta não-destrutiva e reduzir `verificar-governanca.mjs` a um orquestrador ≤ 350 linhas úteis que lista todas as violações numa única execução antes de retornar `exit 1`.
5. **Transparência obrigatória de válvulas de escape:** emitir bloco dedicado `[GOVERNANÇA] VÁLVULAS DE ESCAPE ATIVAS NO DIFF` no auditor e exigir destaque explícito no relatório do Gate 2 (`template/constitution.md`, `template/AGENTS.md` e `ciclo-especificacao/SKILL.md`).
6. **Sincronia SemVer `v4.5.0`, docs e testes:** atualizar versão (`package.json`, cabeçalhos, `README.md`, `00_INDICE_E_DECISOES.md` `D47`, `docs/arquitetura.md` §5, `lefthook.yml`, `.github/workflows/ci.yml`, `CHANGELOG.md`), tornar dinâmica a cópia de `lib/` nos helpers de teste e adicionar `tests/blindagem-motor-e-agregador.test.mjs`.

## Fica de Fora
- Nova skill de depuração sistemática `/debug` e Prova de Runtime Pré-Gate 2 (capacidade `C2`, fatiada Just-in-Time após a Fatia 19).
- Reestruturação da `constitution.md` em 3 faixas anti-diluição e sensores determinísticos `[AVISO MATURIDADE]` (capacidade `C3`).
- Hardening de produção para migrações *expand-and-contract*, seeds idempotentes, observabilidade mínima no Artigo 7, bloqueio de CVEs `critical` no CI e contratos tipados ponta-a-ponta (capacidade `C4`).
- Suporte a paralelismo/`git worktrees` e evals comportamentais com LLM real (estacionados em `openspec/radar-oportunidades.md`).
