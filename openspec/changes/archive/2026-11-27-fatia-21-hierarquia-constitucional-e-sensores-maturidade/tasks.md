# Tarefas — Fatia 21: Hierarquia Constitucional Anti-Diluição e Sensores de Maturidade (v4.7.0)

## Fase 1 — Testes Primeiro (Vermelho)
- [x] **1.1 [Vermelho]** Criar `tests/hierarquia-e-maturidade.test.mjs` validando tabela e selos das 3 Faixas em `template/constitution.md`, Cartão em `template/AGENTS.md`, os 3 sensores `[AVISO MATURIDADE]`, supressão na fundação, teto `<= 350` linhas úteis e sincronia `v4.7.0`.
- [x] **1.2 [Vermelho]** Executar `node --test tests/hierarquia-e-maturidade.test.mjs` e capturar a falha legítima (Vermelho).

## Fase 2 — Implementação e Sincronia (Verde)
- [x] **2.1 [Verde]** Criar `template/scripts/lib/sensores-maturidade.mjs` (`<= 350` linhas úteis) e integrá-lo a `template/scripts/verificar-governanca.mjs`.
- [x] **2.2 [Verde]** Atualizar `template/constitution.md` (`v4.7.0`, tabela de 3 Faixas e selos nos Artigos 1–14) e `template/AGENTS.md` (Cartão de Invariantes por faixa, `[AVISO MATURIDADE]` e `v4.7.0`).
- [x] **2.3 [Verde]** Atualizar `lefthook.yml`, `.github/workflows/ci.yml`, `docs/arquitetura.md` (§5), `package.json`, `template/openspec/project.md.jinja`, `catalogo-stacks.md`, `README.md`, `00_INDICE_E_DECISOES.md` (`D49`), `CHANGELOG.md` e flexibilizar asserções SemVer (`4.[6-9]\.\d+`) em `tests/depuracao-e-prova-runtime.test.mjs`.

## Fase 3 — Refatoração e Validação Completa
- [x] **3.1 [Refatorar]** Revisar funções auxiliares, *early returns* e contagem de linhas úteis de `sensores-maturidade.mjs` e `verificar-governanca.mjs` (`<= 350`).
- [x] **3.2 [Validar]** Executar `node --check`, `npm test` (149/149 verdes), `npx --yes @fission-ai/openspec validate --all --no-interactive` e Prova de Runtime CLI.

## Roteiro de Validação Prática
1. **Conferir sintaxe, testes e OpenSpec:**
   ```powershell
   npm test; if ($?) { npx --yes @fission-ai/openspec validate --all --no-interactive }
   ```
   - **Esperado:** `149` testes verdes (`0` falhas) e `20 passed, 0 failed` no OpenSpec.
2. **Conferir `template/constitution.md` e teto de linhas:** verificar a tabela de 3 Faixas no topo de [template/constitution.md](template/constitution.md) e confirmar que `sensores-maturidade.mjs` e `verificar-governanca.mjs` estão `<= 350` linhas úteis.

## Notas de Sessão
- **Decisões fora do plano:** Aprovada preservação da numeração Artigo 1–14 com selos de faixa, 3 sensores não-bloqueantes (`Reúso UI/Jogo`, `Matriz de Requisitos`, `Runbook Operacional`) e registro/conclusão no Linear no fechamento do Gate 2.
- **Bloqueios atuais:** Nenhum.
- **Próximo passo:** Apresentar `entrega-fatia-21.md` no Gate 2 e aguardar aprovação humana explícita para fechamento atômico (`openspec archive` → `[x]` em `roadmap.md` → `git add` → `git commit` + registro/conclusão no Linear).
