# triade-linear Specification

## Purpose
Instituir a Tríade de Âncora obrigatória e o protocolo de handshake pré-operação com o Linear MCP para impedir vazamento e contaminação cruzada entre múltiplos squads e workspaces.

## Requirements

### Requirement: Tríade de Âncora Linear Imutável
Todo projeto integrado ao Linear MUST registrar a Tríade de Âncora em `openspec/project.md`, compreendendo Workspace, Equipe e Projeto com identificadores, chaves e slugs.

#### Scenario: Projeto configurado com integração Linear
- **GIVEN** um projeto com `integrar_linear: true`
- **WHEN** o arquivo `openspec/project.md` é gerado ou atualizado
- **THEN** o documento MUST conter a seção com a Tríade de Âncora declarando explicitamente Workspace, Equipe e Projeto.

### Requirement: Cláusula Constitucional de Handshake Pré-Operação
A Constituição da governança MUST estabelecer a obrigatoriedade de handshake via `whoami` antes de qualquer operação com MCPs de gestão de tarefas (Linear), proibindo fallback silencioso e impondo bloqueio imediato com alerta se o workspace ativo divergir da âncora.

#### Scenario: Agente opera com servidor MCP do Linear
- **GIVEN** um agente de IA operando sob a governança
- **WHEN** o agente precisa consultar ou alterar dados no Linear
- **THEN** o agente MUST executar previamente `whoami` e validar a correspondência do workspace antes de ler ou escrever issues, interrompendo a execução se houver incompatibilidade.

### Requirement: Suporte no Questionário Copier
O arquivo de configuração `copier.yml` MUST apresentar perguntas condicionais para `linear_workspace_slug`, `linear_team_key` e `linear_project` quando `integrar_linear` for `true`.

#### Scenario: Inicialização de projeto via Copier copy
- **GIVEN** o comando `uvx copier copy` em execução
- **WHEN** o usuário seleciona `integrar_linear: true`
- **THEN** o Copier MUST solicitar o slug do workspace, a chave da equipe e o identificador do projeto.
