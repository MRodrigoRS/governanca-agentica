# Proposta: Fatia 21 — Hierarquia Constitucional Anti-Diluição e Sensores de Maturidade (v4.7.0)

## Por que
Com 14 artigos constitucionais e dezenas de regras operacionais acumuladas até a v4.6.0, surge um risco clássico de engenharia de contexto com LLMs (**Instruction Dilution**): quando todas as regras usam exatamente o mesmo peso retórico absoluto (*"expressamente proibido / cláusula pétrea"*), modelos sob janela longa tendem a diluir atenção entre regras críticas de segurança/dados (IDOR, vazamento de segredos, anti-mock de banco) e regras de processo ou convenção.
Ao mesmo tempo, enfraquecer a régua em projetos iniciais por meio de um "modo enxuto" corroeria a fundação do sistema desde o primeiro dia. A solução correta preserva 100% do rigor desde o 1º commit, organizando `template/constitution.md` em **3 Faixas Explícitas de Severidade** e adicionando **sensores determinísticos não-bloqueantes (`[AVISO MATURIDADE]`)** que alertam objetivamente quando o crescimento real do repositório exige preencher artefatos de escala (`catalogo-reuso.md`, `matriz-requisitos.md`, `runbook.md`).

## O que muda
1. **Hierarquia Constitucional em 3 Faixas de Severidade (`template/constitution.md`):**
   - Adição da tabela `## Hierarquia Constitucional (3 Faixas de Severidade — Anti-Diluição)` no topo de `template/constitution.md` e aplicação do selo `[Faixa 1 — Crítico]`, `[Faixa 2 — Engenharia]` ou `[Faixa 3 — Processo]` em cada um dos 14 Artigos.
   - Preservação integral da ordem `## Artigo 1`..`## Artigo 14` (compatível com merge 3-way Copier e todas as citações existentes).
2. **Espelhamento em `template/AGENTS.md`:**
   - Cartão de Invariantes rotulado conforme as 3 Faixas (Faixa 1 Crítico → Faixa 2 Engenharia → Faixa 3 Processo) e documentação dos avisos `[AVISO MATURIDADE]`.
3. **Módulo Puro `template/scripts/lib/sensores-maturidade.mjs` (`<= 350` linhas úteis):**
   - Sensor 1 (Reúso UI/Jogo): `>= 5` arquivos UI/jogo (`.tsx`, `.jsx`, `.vue`, `.svelte`, `.gd`) e `docs/catalogo-reuso.md` sem ponteiros reais.
   - Sensor 2 (Matriz de Requisitos): (`>= 4` fatias arquivadas OU `>= 5` capítulos em `docs/conhecimento/` além de `INDICE.md`) e `openspec/matriz-requisitos.md` sem `REQ-XX`.
   - Sensor 3 (Runbook Operacional): arquivo de deploy/infra presente e `docs/runbook.md` ainda com placeholders originais (`*(Ex.:`).
   - Integrado ao orquestrador `template/scripts/verificar-governanca.mjs` (sempre não-bloqueante e suprimido durante `ehFundacao === true`).
4. **Sincronia SemVer `v4.7.0`, Pipeline, Docs e Testes:**
   - Atualização de `package.json`, cabeçalhos `v4.7.0`, `lefthook.yml`, `.github/workflows/ci.yml`, `docs/arquitetura.md` (§5), `README.md`, `00_INDICE_E_DECISOES.md` (`D49`), `CHANGELOG.md`, flexibilização de asserção de versão em `tests/depuracao-e-prova-runtime.test.mjs` e nova suíte `tests/hierarquia-e-maturidade.test.mjs`.

## Fica de Fora
- Perfis que desliguem Test-First, tipagem estrita, Anti-Mock ou OpenSpec no início do projeto ("modo enxuto").
- Fragmentação física de `template/constitution.md` em múltiplos arquivos (mantida única conforme `openspec/project.md`).
- Bloqueio rígido (`exit 1`) nos sensores de maturidade (permanecem estritamente informativos `[AVISO MATURIDADE]`).
- Hardening de migrações em produção, observabilidade mínima, bloqueio de CVEs `critical` no CI e contratos tipados ponta-a-ponta (capacidade `C4`).
