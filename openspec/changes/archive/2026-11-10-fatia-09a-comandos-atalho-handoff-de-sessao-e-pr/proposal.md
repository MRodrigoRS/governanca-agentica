# Proposta — Comandos de Atalho Multi-Harness, Handoff de Sessão e Template de PR

## Por que

A governança v3 e v4 cita amplamente comandos de atalho como `/fix`, `/proxima-fatia`, `/retomar`, `/revisar`, `/refinar`, `/explorar`, `/aprendizado`, `/atualizar-governanca` e `/linear-inbox` nas instruções de `AGENTS.md` e em várias skills, mas nenhum desses comandos existia fisicamente como arquivo executável ou prompt nos harnesses suportados (Claude Code, GitHub Copilot, Cursor).

Além disso, após o acionamento de `/compact` ou a abertura de uma nova sessão de chat, a retomada do trabalho depende da memória volátil ou de deduções mentais do agente — uma violação direta do Artigo 12 ("Proibido Deduzir de Cabeça"). Também foi detectado o arquivamento indevido de deltas no OpenSpec contendo tarefas ainda abertas ou não implementadas sem justificativa formal.

Por fim, equipes que operam em fluxos baseados em branches e Pull Requests necessitam de um template oficial que espelhe os rigores do Gate 2 e de uma configuração explícita no gerador Copier para alternar entre `trunk` e `branch-por-fatia`.

## O que muda

1. **Comandos de Atalho Multi-Harness com Paridade Total:**
   - Criação de wrappers finos (≤ 20 linhas) em `template/.claude/commands/`, `template/.github/prompts/*.prompt.md` e `template/.cursor/commands/` para os comandos canônicos: `/fix`, `/proxima-fatia`, `/retomar`, `/revisar`, `/grill-me`, `/refinar`, `/explorar`, `/aprendizado`, `/atualizar-governanca` e `/linear-inbox` (renderizado sob condição `integrar_linear: true`).
   - Tabela canônica de comandos atualizada em `template/AGENTS.md`.

2. **Handoff Determinístico de Sessão e Trava Anti-Arquivamento:**
   - Seção obrigatória `## Notas de Sessão` ao final de `tasks.md` contendo decisões fora do plano, bloqueios em aberto e o próximo passo acionável.
   - Atualização do hook `SessionStart` em `template/scripts/hook-agente.mjs` para injetar automaticamente nas sessões novas o resumo de progresso (`X/Y tarefas`, próxima tarefa pendente e próximo passo, com teto de 600 caracteres).
   - Trava determinística em `template/scripts/verificar-governanca.mjs` bloqueando commits que arquivam mudanças no OpenSpec contendo tarefas abertas `- [ ]` que não estejam marcadas com `(adiada: ...)` ou `(cancelada: ...)`.

3. **Template Oficial de Pull Request e Pergunta `fluxo_git` no Copier:**
   - Criação de `template/.github/pull_request_template.md` espelhando estruturalmente o Gate 2 (resumo de valor, parecer factual cego, roteiro prático e evidências vermelho/verde).
   - Inclusão da pergunta `fluxo_git` no `copier.yml` com opções `trunk` (padrão) e `branch-por-fatia`, adaptando `ciclo-especificacao` para o uso de `gh pr create`.

## Fica de Fora

- Catálogo de reúso de componentes, tokens de movimento e teto anti-monólito com catraca (escopo da Fatia 10).
- CI poliglota, teste unitário de Godot/Avalonia e fechamento v4.0.0 estável (escopo da Fatia 11).
- Parsers pesados de AST ou arquivos de handoff paralelos fora de `tasks.md`.
