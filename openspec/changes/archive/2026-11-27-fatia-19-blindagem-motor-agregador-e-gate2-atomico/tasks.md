# Tarefas — Fatia 19: Blindagem do Motor, Agregador de Erros e Fechamento Atômico (v4.5.0)

## Fase 1 — Testes Primeiro (Vermelho)
- [x] **1.1 [Vermelho]** Criar `tests/blindagem-motor-e-agregador.test.mjs` cobrindo bloqueio de `read_file`/`view_file` em `.env`, paridade do modo `--ci` (`HEAD~1..HEAD`), agregador de múltiplas violações, bloco de válvulas ativas, teto `<= 350` linhas úteis e ordem atômica do Gate 2 + SemVer `4.5.0`.
- [x] **1.2 [Vermelho]** Executar `node --test tests/blindagem-motor-e-agregador.test.mjs` e capturar a saída falhando (Vermelho).

## Fase 2 — Implementação e Desmonolitização (Verde)
- [x] **2.1 [Verde]** Atualizar `matcher` de `PreToolUse` em `template/.agents/hooks.json` e `.agents/hooks.json` incluindo `read_file|view_file|Read` e suporte a `view_file` / `AbsolutePath` em `template/scripts/hook-agente.mjs`.
- [x] **2.2 [Verde]** Criar módulos puros zero-dependências em `template/scripts/lib/` (todos `<= 350` linhas úteis): `git-diff-helper.mjs` (120), `auditar-openspec.mjs` (257), `sensores-codigo.mjs` (274), `sensores-indices.mjs` (170).
- [x] **2.3 [Verde]** Atualizar `template/scripts/lib/classificar-cerimonia.mjs` (225 linhas úteis, suporte a `modoCi` via `git-diff-helper.mjs`) e `template/scripts/lib/auditar-matriz-requisitos.mjs` (242 linhas úteis, coleta pura de erros sem `process.exit(1)` precoce).
- [x] **2.4 [Verde]** Refatorar `template/scripts/verificar-governanca.mjs` (276 linhas úteis) com agregador de violações, bloco `[GOVERNANÇA] VÁLVULAS DE ESCAPE ATIVAS NO DIFF` e re-exports retrocompatíveis.
- [x] **2.5 [Verde]** Atualizar `template/.agents/skills/ciclo-especificacao/SKILL.md`, `template/AGENTS.md` e `template/constitution.md` com ordem atômica do Gate 2 (`archive` → `commit`) e visibilidade obrigatória de válvulas no Gate 2.
- [x] **2.6 [Verde]** Atualizar helpers dinâmicos de cópia de `lib/` em `tests/verificar-governanca.test.mjs` e `tests/planejar-proxima-fatia.test.mjs`, ajustar `tests/autogovernanca-dogfooding.test.mjs` e `tests/explorar-produto-skill.test.mjs`, sincronizar SemVer `4.5.0`, `lefthook.yml`, `.github/workflows/ci.yml`, `README.md`, `00_INDICE_E_DECISOES.md` (`D47`), `docs/arquitetura.md` (§5) e `CHANGELOG.md`.

## Fase 3 — Refatoração e Validação Completa
- [x] **3.1 [Refatorar]** Revisar legibilidade, *early returns*, ausência de duplicação entre `lib/` e `verificar-governanca.mjs` e contagem de linhas úteis de todos os módulos (`<= 350`).
- [x] **3.2 [Validar]** Executar `node --check`, `npm test` (140/140 verdes), `openspec validate --all --no-interactive`, `verificar-governanca.mjs` e `uvx copier copy --defaults`.

## Roteiro de Validação Prática
1. **Bloqueio de `.env` no hook:** simular chamada de `PreToolUse` com `read_file` apontando para `.env` via `echo '{"toolCall":{"name":"read_file","args":{"Path":".env"}}}' | node template/scripts/hook-agente.mjs pre-tool` e observar retorno `{"decision":"deny",...}`.
2. **Agregador de erros e teto anti-monólito:** verificar contagem de linhas úteis de `template/scripts/verificar-governanca.mjs` (276) e `template/scripts/lib/*.mjs` (`<= 274`) e rodar `npm test` observando 140/140 testes verdes.
3. **Paridade `--ci`:** executar `node template/scripts/verificar-governanca.mjs --ci` sobre um commit com violação e confirmar bloqueio determinístico mesmo sem arquivos staged.

## Notas de Sessão
- **Issue Linear vinculada (`P-RR-2`):** `RR-23` (*In Progress*).
- **Decisões fora do plano:** Evolução de C3 ajustada com o humano para manter 100% de rigor desde o 1º commit (hierarquia constitucional anti-diluição + sensores de maturidade em vez de modo enxuto).
- **Bloqueios atuais:** Nenhum.
- **Próximo passo:** Apresentar `entrega-fatia-19.md` no Gate 2 e aguardar aprovação humana explícita para fechamento atômico (`openspec archive` → `[x]` em `roadmap.md` → `git add` → `git commit` + opcional Project Update e *Done* em `RR-23`).
