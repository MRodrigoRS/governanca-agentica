# Especificação Delta: Hierarquia Constitucional Anti-Diluição e Sensores de Maturidade

## ADDED Requirements

### Requirement: Hierarquia Constitucional em 3 Faixas de Severidade sem Perda de Rigor
A Constituição única (`template/constitution.md`) e o Cartão de Invariantes (`template/AGENTS.md`) SHALL classificar explicitamente todos os 14 Artigos em 3 Faixas de Severidade (`[Faixa 1 — Crítico]`, `[Faixa 2 — Engenharia]`, `[Faixa 3 — Processo]`), preservando a numeração `## Artigo 1`..`## Artigo 14` e mantendo 100% das cláusulas ativas desde o primeiro commit.

#### Scenario: Consulta da Constituição e precedência de severidade
- **GIVEN** `template/constitution.md` atualizada na versão `v4.7.0`
- **WHEN** um agente ou desenvolvedor lê o documento
- **THEN** a tabela `## Hierarquia Constitucional (3 Faixas de Severidade — Anti-Diluição)` aparece antes dos artigos mapeando os Artigos 1–14
- **AND** cada cabeçalho `## Artigo N` exibe seu selo de faixa (`[Faixa 1 — Crítico]`, `[Faixa 2 — Engenharia]` ou `[Faixa 3 — Processo]`).

### Requirement: Sensores Determinísticos de Maturidade Não-Bloqueantes (`[AVISO MATURIDADE]`)
O módulo zero-dependências `template/scripts/lib/sensores-maturidade.mjs` (≤ 350 linhas úteis), integrado a `template/scripts/verificar-governanca.mjs`, SHALL emitir avisos determinísticos não-bloqueantes (`[AVISO MATURIDADE]`) quando o crescimento do repositório atingir limiares objetivos sem preenchimento do artefato vivo correspondente.

#### Scenario: Projeto acumula componentes UI/jogo sem popular o catálogo de reúso
- **GIVEN** um repositório (fora do commit de fundação) com `>= 5` arquivos de UI/cenas (`.tsx`, `.jsx`, `.vue`, `.svelte`, `.gd`) fora de `node_modules`/`.git`/`dist`/`build`/`.next` e `docs/catalogo-reuso.md` sem nenhum ponteiro real entre crases
- **WHEN** `verificar-governanca.mjs` é executado
- **THEN** a saída exibe `[AVISO MATURIDADE]` recomendando atualizar `docs/catalogo-reuso.md`
- **AND** o processo conclui sem bloquear o commit (`exit 0` quando não houver outras violações).

#### Scenario: Projeto acumula histórico ou conhecimento sem popular a matriz de requisitos
- **GIVEN** um repositório com `>= 4` mudanças arquivadas em `openspec/changes/archive/` (ou `>= 5` capítulos em `docs/conhecimento/` além de `INDICE.md`) e `openspec/matriz-requisitos.md` sem nenhum `REQ-XX`
- **WHEN** `verificar-governanca.mjs` é executado fora da fundação
- **THEN** a saída exibe `[AVISO MATURIDADE]` recomendando popular `openspec/matriz-requisitos.md` sem retornar `exit 1`.

#### Scenario: Projeto possui arquivos de deploy/infra com runbook em placeholder
- **GIVEN** um repositório contendo arquivo de infraestrutura/deploy (`Dockerfile`, `docker-compose*`, `vercel.json`, `fly.toml`, `render.yaml`, `railway.json`, `Procfile` ou `.github/workflows/*deploy*`) e `docs/runbook.md` ainda com marcadores `*(Ex.:` do template
- **WHEN** `verificar-governanca.mjs` é executado fora da fundação
- **THEN** a saída exibe `[AVISO MATURIDADE]` recomendando preencher `docs/runbook.md` sem bloquear o commit.

### Requirement: Sincronia de Pipeline, Mapa Físico e SemVer `v4.7.0`
A entrega da Fatia 21 SHALL registrar `template/scripts/lib/sensores-maturidade.mjs` em `lefthook.yml`, `.github/workflows/ci.yml` e `docs/arquitetura.md` (§5 Mapa Físico), atualizar a versão para `4.7.0` nos cabeçalhos e manifestos e registrar a Decisão `D49` em `00_INDICE_E_DECISOES.md`.

#### Scenario: Validação completa de dogfooding e Copier na v4.7.0
- **GIVEN** todos os arquivos atualizados para `v4.7.0`
- **WHEN** `npm test`, `node template/scripts/verificar-governanca.mjs` e `uvx copier copy --defaults` são executados
- **THEN** todos os módulos em `template/scripts/lib/*.mjs` e `verificar-governanca.mjs` permanecem `<= 350` linhas úteis e a suíte aprova sem falhas.
