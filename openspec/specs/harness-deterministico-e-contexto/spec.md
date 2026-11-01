# harness-deterministico-e-contexto Specification

## Purpose
Estabelece o harness determinístico de ciclo de vida de agentes, validação prévia e pós-edição de arquivos (< 30ms), bloqueio de bypasses, confirmação de comandos destrutivos e vínculo físico obrigatório entre deltas OpenSpec e arquivos do roadmap.

## Requirements

### Requirement: Bloqueio Anti-Bypass de Hooks Git e Confirmacao em Comandos Destrutivos
O script determinístico `hook-agente.mjs` MUST bloquear tentativas de burlar hooks via `--no-verify` ou flag curta `-n` em `git commit` (ignorando texto entre aspas) e SHALL exigir confirmação humana explícita (`force_ask` no Antigravity e `permissionDecision: "ask"` no Claude Code) antes de commits, pushes, limpezas de árvore ou resets destrutivos de banco.

#### Scenario: Tentativa de bypass com flag curta git commit -n
- **GIVEN** um agente executando um comando shell `git commit -am "feat: atalho" -n`
- **WHEN** o hook `PreToolUse` (`pre-tool` ou `pre-tool-claude`) inspeciona o payload
- **THEN** a operação é negada imediatamente (`decision: "deny"` no Antigravity ou `exit 2` no Claude Code) com mensagem explicativa em PT-BR

#### Scenario: Mensagem de commit legítima contendo texto -n entre aspas
- **GIVEN** um comando `git commit -m "fix(cli): corrige flag -n no parser"` sem flag real de bypass fora das aspas
- **WHEN** o hook `PreToolUse` inspeciona o comando
- **THEN** o comando NÃO é bloqueado por bypass e solicita confirmação humana normal do Artigo 11 (`force_ask` / `ask`)

#### Scenario: Paridade de confirmacao em comandos destrutivos no Antigravity e Claude Code
- **GIVEN** um comando destrutivo como `git clean -fd`, `git restore .` ou `npx prisma migrate reset --force`
- **WHEN** o hook `PreToolUse` é acionado em qualquer uma das duas IDEs
- **THEN** retorna `decision: "force_ask"` no Antigravity e `hookSpecificOutput.permissionDecision: "ask"` no Claude Code

### Requirement: Sensor Instantaneo de Escrita e Edicao de Arquivos
O harness determinístico MUST inspecionar escritas e edições de arquivos em menos de 30ms (`PreToolUse` em `write_file|edit_file` no Antigravity e `PostToolUse` em `Write|Edit|MultiEdit` no Claude Code), barrando imediatamente a introdução de `location.reload`, `.only(`, testes ocos, placeholders preguiçosos em `openspec/roadmap/fatia-*.md` ou erros de sintaxe em scripts `.mjs`/`.cjs`, mantendo saída silenciosa (zero tokens extras) quando o arquivo estiver íntegro.

#### Scenario: Tentativa de gravar location.reload em componente frontend
- **GIVEN** uma operação de escrita ou edição em arquivo `.tsx` contendo `window.location.reload()`
- **WHEN** o sensor do `hook-agente.mjs` avalia a mutação
- **THEN** retorna bloqueio determinístico imediato citando o Artigo 6 da Constituição

#### Scenario: Pos-edicao de script Node com erro de sintaxe no Claude Code
- **GIVEN** um arquivo `.mjs` recém-gravado com sintaxe JavaScript inválida
- **WHEN** o subcomando `post-tool-claude` executa a verificação instantânea
- **THEN** retorna `decision: "block"` com o diagnóstico sintático exato para autocorreção imediata no mesmo turno

### Requirement: Simetria de SessionStart Multi-IDE e Caminho Relativo Resiliente
O arquivo `template/.agents/hooks.json` MUST referenciar `../scripts/hook-agente.mjs` de forma compatível com o diretório de trabalho `.agents/` do Antigravity, e o subcomando `session-start-claude` SHALL injetar o status de mudanças ativas do OpenSpec via `hookSpecificOutput.additionalContext`.

#### Scenario: Inicializacao de sessao no Claude Code com mudanca ativa
- **GIVEN** um repositório contendo a pasta `openspec/changes/fatia-04-exemplo`
- **WHEN** o hook `session-start-claude` é executado
- **THEN** emite JSON válido contendo `hookEventName: "SessionStart"` e `additionalContext` listando `fatia-04-exemplo` e o lembrete do Artigo 12

### Requirement: Vinculo Fisico Obrigatorio entre Delta OpenSpec e Roadmap
O verificador determinístico `verificar-governanca.mjs` MUST validar que todo delta ativo em `openspec/changes/fatia-*` ou recém-arquivado em staging em `openspec/changes/archive/*fatia-*` possua seu respectivo arquivo físico detalhado em `openspec/roadmap/<fatia>.md`.

#### Scenario: Delta fatia-XX aberto no OpenSpec sem arquivo fisico no roadmap
- **GIVEN** código de produção staged acompanhado de `openspec/changes/fatia-09-fantasma/` completo, mas sem `openspec/roadmap/fatia-09-fantasma.md`
- **WHEN** `verificar-governanca.mjs` é executado
- **THEN** o processo falha com `exit 1` exigindo a criação física da fatia detalhada no roadmap
