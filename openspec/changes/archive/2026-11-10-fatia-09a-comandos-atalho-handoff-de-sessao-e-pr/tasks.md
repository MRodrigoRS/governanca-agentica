# Tarefas de Implementação — `fatia-09a-comandos-atalho-handoff-de-sessao-e-pr`

- [x] **1. Test-First Mandatório (`tests/comandos-e-handoff.test.mjs` — Ciclo Vermelho):**
  - [x] 1.1. Escrever Teste 1 falhando (Vermelho): paridade dos 9 comandos de atalho nos 3 harnesses (Claude, Copilot, Cursor) com ≤ 20 linhas e renderização condicional de `linear-inbox`.
  - [x] 1.2. Escrever Teste 2 falhando (Vermelho): injeção de progresso da mudança ativa no `SessionStart` com `X/Y tarefas`, próxima tarefa e próximo passo (teto de 600 caracteres).
  - [x] 1.3. Escrever Teste 3 falhando (Vermelho): trava determinística bloqueando arquivamento de deltas com tarefas `- [ ]` abertas sem justificativa `(adiada: ...)` ou `(cancelada: ...)`.
  - [x] 1.4. Escrever Teste 4 falhando (Vermelho): distribuição de `pull_request_template.md` espelhando Gate 2 e pergunta `fluxo_git` no `copier.yml`.
- [x] **2. Implementação dos Comandos de Atalho e Tabela em AGENTS.md:**
  - [x] 2.1. Criar os comandos em `template/.claude/commands/`: `fix.md`, `proxima-fatia.md`, `retomar.md`, `revisar.md`, `grill-me.md`, `refinar.md`, `explorar.md`, `aprendizado.md`, `atualizar-governanca.md` e `linear-inbox.md.jinja`.
  - [x] 2.2. Criar os prompts em `template/.github/prompts/`: `fix.prompt.md`, `proxima-fatia.prompt.md`, `retomar.prompt.md`, `revisar.prompt.md`, `grill-me.prompt.md`, `refinar.prompt.md`, `explorar.prompt.md`, `aprendizado.prompt.md`, `atualizar-governanca.prompt.md` e `linear-inbox.prompt.md.jinja`.
  - [x] 2.3. Criar os comandos em `template/.cursor/commands/`: `fix.md`, `proxima-fatia.md`, `retomar.md`, `revisar.md`, `grill-me.md`, `refinar.md`, `explorar.md`, `aprendizado.md`, `atualizar-governanca.md` e `linear-inbox.md.jinja`.
  - [x] 2.4. Atualizar `template/AGENTS.md` com a tabela canônica de comandos de atalho.
- [x] **3. Implementação do Handoff de Sessão e Trava Anti-Arquivamento:**
  - [x] 3.1. Atualizar `template/openspec/config.yaml.jinja` e `openspec/config.yaml` para exigir a seção `## Notas de Sessão` em `tasks.md`.
  - [x] 3.2. Atualizar o gerador de mensagem inicial no `template/scripts/hook-agente.mjs` para injetar o progresso e próximo passo das mudanças ativas.
  - [x] 3.3. Adicionar verificação determinística em `template/scripts/verificar-governanca.mjs` inspecionando deltas em `openspec/changes/archive/` para barrar tarefas abertas sem justificativa.
- [x] **4. Template de Pull Request e Pergunta no Copier:**
  - [x] 4.1. Criar `template/.github/pull_request_template.md` estruturado com as 5 seções do Gate 2.
  - [x] 4.2. Adicionar a pergunta `fluxo_git` no `copier.yml` e ajustar instruções de branch na skill `ciclo-especificacao`.
- [x] **5. Execução dos Testes e Comprovação (Ciclo Verde):**
  - [x] 5.1. Executar `node --test tests/comandos-e-handoff.test.mjs` garantindo aprovação total.
  - [x] 5.2. Executar suíte completa `npm test`, `npx @fission-ai/openspec validate --all --no-interactive` e `verificar-governanca.mjs`.

## Notas de Sessão
- **Decisões fora do plano:** nenhuma
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Conduzir auditoria cega com o Subagente Inspetor Forense e apresentar o Gate 2 para aprovação de commit e arquivamento

## Roteiro de Validação Prática

### O que validar no Gate 2:
1. **Comandos de Atalho nos 3 Harnesses:**
   - Comprovar que os arquivos em `.claude/commands/`, `.github/prompts/` e `.cursor/commands/` existem, têm ≤ 20 linhas e apontam para as skills corretas.
   - Testar o comportamento condicional de `linear-inbox` com `integrar_linear: false` vs `true`.
2. **Injeção de Handoff no Início de Sessão:**
   - Disparar o hook `SessionStart` com uma mudança contendo `tasks.md` preenchido e verificar que a mensagem injeta o progresso (ex.: `1/3 tarefas`) e o próximo passo em até 600 caracteres.
3. **Trava Anti-Arquivamento:**
   - Simular um commit que adiciona um delta arquivado com `- [ ]` não marcado e verificar que `verificar-governanca.mjs` bloqueia com `exit 1`.
   - Adicionar `(adiada: motivo)` e confirmar liberação.
