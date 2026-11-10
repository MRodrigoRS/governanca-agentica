# comandos-atalho-e-handoff Specification

## ADDED Requirements

### Requirement: Paridade Multi-Harness de Comandos de Atalho
O sistema MUST disponibilizar comandos de atalho canônicos com implementação em wrappers finos (≤ 20 linhas) para Claude Code (`.claude/commands/`), GitHub Copilot (`.github/prompts/*.prompt.md`) e Cursor (`.cursor/commands/`), apontando para as skills correspondentes em `.agents/skills/` sem duplicar regras de negócio.

#### Scenario: Comando de Atalho Invocado no Claude Code
GIVEN um projeto gerenciado pela governança
WHEN o usuário digitar `/fix` no Claude Code
THEN o comando correspondente em `.claude/commands/fix.md` deve instruir o agente a acionar a skill `ciclo-especificacao` na Via 1a.

#### Scenario: Comando Linear Inbox Omitido Quando Integração Não Estiver Ativa
GIVEN um projeto configurado no Copier com `integrar_linear: false`
WHEN o gerador processar os templates
THEN o arquivo de comando `linear-inbox` não deve ser criado em nenhum dos harnesses.

### Requirement: Handoff Determinístico de Sessão via tasks.md e SessionStart
O sistema MUST manter o estado oficial de progresso de cada fatia em `tasks.md`, exigir a seção `## Notas de Sessão` com o próximo passo acionável e injetar automaticamente o resumo de tarefas pendentes no evento `SessionStart` com limite máximo de 600 caracteres.

#### Scenario: Injeção de Progresso ao Iniciar Nova Sessão
GIVEN uma mudança ativa em `openspec/changes/` com 3 tarefas (1 marcada como concluída) e a nota `Próximo passo: implementar testes de validação`
WHEN o evento de `SessionStart` do hook for executado
THEN a mensagem injetada no contexto deve informar `1/3 tarefas concluídas`, citar o texto da 2ª tarefa pendente e indicar o próximo passo.

### Requirement: Trava Anti-Arquivamento com Tarefas Abertas
O verificador determinístico de governança MUST bloquear qualquer commit que mova ou adicione pastas de mudança em `openspec/changes/archive/` cujo arquivo `tasks.md` contenha tarefas pendentes (`- [ ]`), exceto quando explicitamente justificadas com `(adiada: <motivo>)` ou `(cancelada: <motivo>)`.

#### Scenario: Tentativa de Arquivar Mudança com Tarefa Aberta sem Justificativa
GIVEN uma pasta de mudança em `openspec/changes/archive/` contendo um `tasks.md` com o item `- [ ] 4.3 acionar inspetor forense`
WHEN o comando de verificação de governança for executado
THEN o processo deve falhar com código de erro diferente de zero e alertar sobre a tarefa não concluída.

#### Scenario: Arquivamento de Mudança com Tarefa Adiada Justificada
GIVEN uma pasta de mudança em `openspec/changes/archive/` contendo o item `- [ ] 4.3 acionar inspetor forense (adiada: ambiente sem subagente)`
WHEN o comando de verificação for executado
THEN a verificação deve aprovar o arquivamento.

### Requirement: Template de Pull Request e Pergunta de Fluxo Git
O sistema MUST disponibilizar um template oficial de Pull Request em `.github/pull_request_template.md` estruturado conforme o Gate 2 e suportar a escolha do fluxo de branches no Copier (`trunk` ou `branch-por-fatia`).

#### Scenario: Projeto com Fluxo Git Branch por Fatia
GIVEN um projeto configurado com `fluxo_git: branch-por-fatia`
WHEN a skill `ciclo-especificacao` for consultada
THEN ela deve instruir a criação de branch específica para a fatia e a abertura de PR via `gh pr create` antes do fechamento.
