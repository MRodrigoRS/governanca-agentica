# matriz-rastreabilidade Specification

## Purpose

TBD - created by archiving change fatia-17-matriz-rastreabilidade-end-to-end. Update Purpose after archive.

## Requirements

### Requirement: Contrato Tabular Enxuto e Proteção Copier
O template MUST distribuir `openspec/matriz-requisitos.md` a partir de `template/openspec/matriz-requisitos.md.jinja`, protegido em `_skip_if_exists` no `copier.yml`, com tabela de 6 colunas (`ID`, `Requisito`, `Fonte`, `Capacidade / Fatia`, `Status`, `Prova Real`) e linha-guia inicial sem placeholders proibidos nem ponteiros fictícios entre crases.

#### Scenario: Preservação em atualização Copier e boot limpo em novo projeto
- GIVEN um projeto gerado com `uvx copier copy --defaults` ou atualizado via `copier update` mantendo edições prévias em `openspec/matriz-requisitos.md`
- WHEN `verificar-governanca.mjs --staged` é executado no primeiro commit ou após `copier update`
- THEN o conteúdo editado pelo projeto é preservado intacto pelo Copier e o commit inicial é aprovado sem falsos positivos.

### Requirement: Auditor Determinístico Opt-In de 6 Regras (`auditar-matriz-requisitos.mjs`)
O módulo `template/scripts/lib/auditar-matriz-requisitos.mjs` MUST operar em Node.js ESM puro (≤ 350 linhas úteis), ignorar silenciosamente repositórios sem `openspec/matriz-requisitos.md` e, quando o arquivo existir, validar: ausência de marcadores preguiçosos, unicidade e formato `REQ-\d{2,4}` de IDs, status entre os 4 marcadores canônicos (`[ ] Pendente`, `[~] Em andamento`, `[x] Entregue`, `[-] Descartado`), existência em disco de caminhos em `Fonte` iniciados por `docs/`, `openspec/` ou `src/`, existência de prova real em disco para `[x] Entregue` com sensor anti-apodrecimento reverso em deleções/renomeações e trava de `openspec/changes/archive/` para `[~] Em andamento` vinculado à fatia arquivada (além de aviso `[AVISO MATRIZ]` não-bloqueante em commits de Nível 2).

#### Scenario: Bloqueio de entrega mentirosa, fonte quebrada e archive com requisito em andamento
- GIVEN um repositório com `openspec/matriz-requisitos.md` contendo `[x] Entregue` sem prova real em disco, `Fonte` inexistente, ID duplicado/inválido, status inválido, placeholder ou `[~] Em andamento` vinculado à fatia staged em `openspec/changes/archive/2026-11-26-fatia-04-teste/`
- WHEN `verificar-governanca.mjs --staged` é executado
- THEN o auditor retorna código de saída `1` detalhando a violação exata e a solução esperada.

#### Scenario: Retrocompatibilidade e aprovação com matriz íntegra
- GIVEN um repositório legado sem `openspec/matriz-requisitos.md` ou um repositório com matriz válida cujos `[x] Entregue` apontam para arquivos existentes no disco
- WHEN `verificar-governanca.mjs --staged` é executado
- THEN o verificador aprova com código de saída `0`.

### Requirement: Telemetria de Matriz no SessionStart e Alinhamento Normativo v4.3.0
O script `template/scripts/hook-agente.mjs` MUST injetar `[MATRIZ REQUISITOS] Total: X | Entregues: Y | Em andamento: Z | Pendentes: W | Descartados: K` no `session-start` e `session-start-claude` quando `openspec/matriz-requisitos.md` existir, e a Constituição (`Artigo 12.6`), `template/AGENTS.md` e as 6 skills do ciclo MUST exigir o rastreamento ponta-a-ponta dos requisitos sincronizados à versão `4.3.0`.

#### Scenario: Telemetria de 1 linha no SessionStart sem estouro do teto de contexto
- GIVEN um repositório com `openspec/matriz-requisitos.md` populada por requisitos em diferentes status
- WHEN `node scripts/hook-agente.mjs session-start` é executado
- THEN a saída JSON contém a linha `[MATRIZ REQUISITOS] Total: ... | Entregues: ... | Em andamento: ... | Pendentes: ... | Descartados: ...` preservada dentro do teto de 600 caracteres.
