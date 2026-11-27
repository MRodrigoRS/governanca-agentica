# Design Técnico: Fatia 19 — Blindagem do Motor, Agregador de Erros e Fechamento Atômico

## Contratos, Dados e Schemas

A arquitetura de scripts em `template/scripts/` permanece 100% Node.js ESM puro sem dependências externas, dividida em módulos especializados (todos estritamente `<= 350` linhas úteis) sob `template/scripts/lib/`:

1. **`template/scripts/lib/git-diff-helper.mjs` (Novo):**
   - `obterArquivosModificados(cwd, modoCi)` → retorna `Array<{ status: string, arquivo: string }>` usando `git diff --cached --name-status` (local) ou `git diff --name-status HEAD~1 HEAD` / fallback `git show` (quando `modoCi === true`).
   - `obterArquivosDelta(cwd, modoCi)` → retorna `string[]` com caminhos modificados no escopo correto.
   - `lerConteudoAlvo(cwd, arquivo, modoCi)` → lê `:arquivo` do index (ou disco) em modo local e `HEAD:arquivo` quando `modoCi === true`.
   - `lerConteudoAnterior(cwd, arquivo, modoCi)` → lê `HEAD:arquivo` em modo local e `HEAD~1:arquivo` quando `modoCi === true` (retorna `null` se inexistente).
   - `obterDiffUnificadoArquivo(cwd, arquivo, modoCi)` → gera diff `-U0` entre index/HEAD (local) ou `HEAD~1..HEAD` (CI).

2. **`template/scripts/lib/auditar-openspec.mjs` (Novo):**
   - Funções puras que recebem `(cwd, ...)` e retornam `string[]` (lista de mensagens de erro sem encerrar o processo):
     - `extrairNomeFatiaCanonica(nomeMudanca)`
     - `auditarFatiasDetalhadasV3(cwd)`
     - `auditarRoadmapV4(cwd)`
     - `auditarPastaMudancaOpenSpec(cwd, caminhoPasta, nomeMudanca)`
     - `verificarTarefasAbertasEmDeltaArquivado(caminhoPasta, nomeMudanca)`

3. **`template/scripts/lib/sensores-codigo.mjs` (Novo):**
   - Reúne os sensores estáticos de código e ambiente, retornando `{ erros: string[], infos: string[], valvulas: Array<{ tipo, arquivo, motivo }> }`:
     - `contarLinhasUteisCodigo(conteudo, extensao)` (preserva comportamento e assinatura atuais).
     - `ehArquivoIsentoDeTetoMonolito(arquivo)` (preserva comportamento e assinatura atuais).
     - `verificarLocationReload(cwd, listaArquivos, modoCi)`
     - `verificarIntegridadeDeTestes(cwd, listaArquivos, modoCi)` → detecta `.only`, teste oco, mock de banco próprio e registra ocorrências válidas de `governanca:mock-banco-justificado`.
     - `verificarVariaveisAmbiente(cwd, listaArquivos, modoCi)` → preserva `CLAUDE_PROJECT_DIR` em `variaveisIgnoradas`.
     - `verificarSensorAntiMonolitoComCatraca(cwd, arquivosProducao, modoCi)` → compara `lerConteudoAlvo` vs `lerConteudoAnterior` (corrigindo `--ci`) e registra válvulas válidas de `governanca:arquivo-extenso-justificado`.

4. **`template/scripts/lib/sensores-indices.mjs` (Novo):**
   - Extrai sensores anti-apodrecimento e avisos operacionais:
     - `verificarSensorAntiApodrecimentoCatalogo(cwd, arquivosModificados)` → `{ erros }`
     - `verificarSensorAntiApodrecimentoMapaArquitetura(cwd, arquivosModificados)` → `{ erros }`
     - `emitirAvisosOperacionaisEHandoff(cwd, listaArquivos, ehFundacao, arquivosProducao, modoCi)` → `{ avisos }`

5. **`template/scripts/lib/classificar-cerimonia.mjs` (Modificado):**
   - `verificarChavesNovasPackageJson(cwd, modoCi = false)`
   - `verificarLinhasSobAdicionadoChangelog(cwd, modoCi = false)`
   - `verificarContrabandoStyle(cwd, arquivosAlvo, modoCi = false)`
   - `validarCerimoniaNoCommit(cwd, tipo, escopo, descricao, { modoCi = false } = {})` → retrocompatível quando o 5º argumento é omitido (`commit-msg` local continua exatamente igual).

6. **`template/scripts/lib/auditar-matriz-requisitos.mjs` (Modificado):**
   - Passa a coletar erros e avisos no array retornado/injetado em vez de chamar `process.exit(1)` diretamente dentro de `auditarMatrizRequisitos`, permitindo agregação com os demais sensores.

7. **`template/scripts/verificar-governanca.mjs` (Refatorado para ≤ 350 linhas úteis):**
   - Mantém re-exports nominais `export { contarLinhasUteisCodigo, ehArquivoIsentoDeTetoMonolito } from './lib/sensores-codigo.mjs'` para compatibilidade com `tests/reuso-e-modularizacao.test.mjs`.
   - Acumula `erros[]`, `infos[]` e `valvulas[]` ao longo de todas as etapas, imprime bloco `[GOVERNANÇA] VÁLVULAS DE ESCAPE ATIVAS NO DIFF` quando `valvulas.length > 0` e imprime o relatório agregado de todas as violações antes de encerrar com `process.exit(1)`.

8. **Manifestos de Hook e Documentação de Ciclo:**
   - `.agents/hooks.json` e `template/.agents/hooks.json`: `matcher` atualizado para `"run_command|write_file|edit_file|read_file|view_file|Read"`.
   - `template/.agents/skills/ciclo-especificacao/SKILL.md`, `template/AGENTS.md` e `template/constitution.md`: ordem atômica no Gate 2 (`matriz-requisitos.md` + `openspec archive` + `[x]` em `roadmap.md` antes de `git add` / `git commit`) e destaque obrigatório de válvulas de escape no Gate 2.
   - Compatibilidade de testes e pipeline: helpers de cópia dinâmica de `template/scripts/lib/` em `tests/verificar-governanca.test.mjs` e `tests/planejar-proxima-fatia.test.mjs`; atualização de `tests/autogovernanca-dogfooding.test.mjs` (`CLAUDE_PROJECT_DIR` em `sensores-codigo.mjs`), `lefthook.yml`, `.github/workflows/ci.yml` e sincronia SemVer `v4.5.0`.

## Interface e Estados Assíncronos
Não se aplica: projeto CLI/biblioteca em Node.js ESM e templates Copier sem interface gráfica de usuário.

## Regras de Negócio e Segurança
- **Zero Dependências Externas:** Todos os módulos em `template/scripts/` utilizam exclusivamente módulos nativos `node:*`.
- **Proteção Ativa de Segredos:** A interceptação de `read_file|view_file|Read` impede vazamento acidental de `.env*` na janela de contexto do agente mantendo `.env.example` legível.
- **Zero Falso Verde no CI:** `validarCerimoniaNoCommit(..., { modoCi: true })` e o sensor Anti-Monólito comparam `HEAD~1..HEAD` mesmo com `--cached` vazio.
- **Transparência Humana:** Válvulas justificadas continuam válidas quando cumprem o mínimo técnico de 15 caracteres, mas nunca passam invisíveis: são impressas pelo auditor e exigidas no resumo do Gate 2.
- **Retrocompatibilidade Copier:** Nenhuma alteração quebra projetos consumidores sem `openspec/matriz-requisitos.md` ou atualizados via `uvx copier update`.
