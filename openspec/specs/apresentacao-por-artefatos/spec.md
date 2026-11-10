# apresentacao-por-artefatos Specification

## Purpose
Especificar os requisitos e diretrizes operacionais para apresentação de planos de Gate 1 e relatórios de Gate 2 por meio de artefatos interativos dedicados em harnesses compatíveis (ex.: Antigravity) e manutenção de estrita higiene de contexto no chat (≤ 20 linhas).

## Requirements

### Requirement: Apresentação de Gates via Artefatos Dedicados em Ambientes Suportados
O sistema MUST instruir os agentes a emitirem planos de Gate 1 e relatórios de Gate 2 como artefatos dedicados (com `RequestFeedback: true` no Gate 1) sempre que o harness de execução fornecer ferramentas de artefatos (ex.: Google Antigravity), proibindo o despejo de textos longos no chat.

#### Scenario: Apresentação do Gate 1 no Antigravity
GIVEN um agente operando no ambiente Antigravity com ferramenta de artefatos
WHEN o plano da fatia for submetido para aprovação no Gate 1
THEN o agente deve criar o artefato `plano-fatia-XX.md` com `RequestFeedback: true` e `UserFacing: true`
AND a mensagem no chat deve conter apenas o link direto para o arquivo e a pergunta de aprovação em no máximo 20 linhas.

#### Scenario: Apresentação em Terminal CLI Puro sem Suporte a Artefatos
GIVEN um agente operando no Claude Code ou terminal CLI puro
WHEN o plano da fatia for apresentado no Gate 1
THEN o agente deve fornecer um resumo objetivo de até 20 linhas no chat apontando para os arquivos físicos em `openspec/changes/`.

### Requirement: Relatório Forense Cego como Artefato Anexo
O sistema MUST instruir o Subagente Inspetor Forense e o Agente Principal a salvarem o relatório factual da auditoria cega em artefato dedicado (`parecer-forense.md`) em ambientes com suporte a artefatos, anexando o link ao Gate 2.

#### Scenario: Auditoria Cega Concluída Pré-Gate 2
GIVEN a inspeção cega finalizada pelo Subagente Inspetor Forense
WHEN o relatório factual for emitido
THEN o conteúdo completo deve ser gravado no arquivo de artefatos `parecer-forense.md`
AND o Gate 2 deve conter o link do parecer sem duplicar seu conteúdo integral no chat.
