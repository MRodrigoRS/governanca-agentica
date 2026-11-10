# Design Técnico — Comandos de Atalho Multi-Harness, Handoff de Sessão e Template de PR

## Contratos, Dados e Schemas

### 1. Estrutura dos Wrappers de Comandos de Atalho
Os comandos são implementados como arquivos leves (≤ 20 linhas) distribuídos nos 3 harnesses:
- **Claude Code (`template/.claude/commands/<comando>.md`):**
  ```markdown
  ---
  description: <descrição em uma frase>
  ---
  Atue como o agente de governança executando a skill `.agents/skills/<nome>/SKILL.md`.
  Siga rigorosamente as instruções da skill e apresente o resultado conforme o protocolo.
  ```
- **GitHub Copilot (`template/.github/prompts/<comando>.prompt.md`):**
  ```markdown
  ---
  mode: agent
  description: <descrição em uma frase>
  ---
  Atue como o agente de governança executando a skill `.agents/skills/<nome>/SKILL.md`.
  Siga rigorosamente as instruções da skill e apresente o resultado conforme o protocolo.
  ```
- **Cursor (`template/.cursor/commands/<comando>.md`):**
  ```markdown
  Atue como o agente de governança executando a skill `.agents/skills/<nome>/SKILL.md`.
  Siga rigorosamente as instruções da skill e apresente o resultado conforme o protocolo.
  ```

### 2. Contrato de `## Notas de Sessão` em `tasks.md`
Todo arquivo `tasks.md` de uma fatia ativa deve conter obrigatoriamente ao final a seção:
```markdown
## Notas de Sessão
- **Decisões fora do plano:** nenhuma
- **Bloqueios abertos:** nenhum
- **Próximo passo:** <ação imediata acionável>
```

### 3. Contrato da Injeção no `SessionStart`
O hook `SessionStart` em `hook-agente.mjs` itera sobre as pastas em `openspec/changes/` (exceto `archive`). Se houver um `tasks.md`, calcula `concluidas / total`, extrai a primeira linha `- [ ]` e a linha `**Próximo passo:**`.
Gera no máximo 600 caracteres no total:
```text
[STATUS ATIVO] fatia-XX: 3/5 tarefas concluídas.
Próxima tarefa: - [ ] 2. Implementar sensor X
Próximo passo: Escrever teste vermelho para o sensor
```

### 4. Configuração do Copier (`copier.yml`)
- Pergunta `fluxo_git`:
  - `type: str`
  - `help: "Estratégia de branches e versionamento Git do projeto"`
  - `choices: [trunk, branch-por-fatia]`
  - `default: trunk`

## Interface e Estados Assíncronos

Não se aplica diretamente a componentes visuais de tela web; esta fatia lida com prompts de harnesses, CLI de governança, templates de Pull Request e mensagens de injeção em hooks.
- **Feedback do `/retomar`:** O agente responde imediatamente reportando onde a sessão parou, tarefas já concluídas e realiza a leitura física direta do delta no disco antes de codificar.
- **Feedback da Trava Anti-Arquivamento:** Se o commit incluir `openspec/changes/archive/` com tarefas `- [ ]` não justificadas, o console exibe a lista das pendências e orienta o uso da sintaxe `(adiada: <motivo>)` ou `(cancelada: <motivo>)`.

## Regras de Negócio e Segurança

1. **Anti-Duplicação de Regras:** Wrappers de comando não contêm lógica de negócio nem regras de validação. Toda a inteligência reside nas skills em `.agents/skills/`.
2. **Proibição de Bypass de Leitura Física (Artigo 12):** O comando `/retomar` orienta o fluxo, mas não dispensa a releitura física obrigatória dos arquivos de roadmap e delta antes de iniciar código.
3. **Isolamento de Branches e PRs:** No modo `branch-por-fatia`, a criação de branch e submissão de PR via CLI oficial `gh pr create` obedece à regra de higiene de contexto (evitando sobrecarga de MCPs redundantes do GitHub).
