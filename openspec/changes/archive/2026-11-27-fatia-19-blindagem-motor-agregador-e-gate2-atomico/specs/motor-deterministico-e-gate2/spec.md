# Especificação Delta: Motor Determinístico, Hooks e Fechamento Atômico do Gate 2

## ADDED Requirements

### Requirement: Bloqueio Efetivo de Leitura de Arquivos `.env*` via `PreToolUse`
O manifesto de lifecycle hooks do agente (`template/.agents/hooks.json` e `.agents/hooks.json` na raiz) SHALL incluir as ferramentas de leitura de arquivo (`read_file`, `view_file`, `Read`) no `matcher` de `PreToolUse` para que `hook-agente.mjs` intercepte tentativas diretas de leitura de `.env` e `.env.*` (preservando `.env.example`, `.env.template` e `.env.sample`).

#### Scenario: Agente tenta ler arquivo `.env` com ferramenta `read_file`
- **GIVEN** um repositório com `.agents/hooks.json` configurado na governança v4.5.0
- **WHEN** o harness dispara `PreToolUse` para `read_file` com caminho `.env` ou `.env.local`
- **THEN** o `matcher` aciona `hook-agente.mjs pre-tool`
- **AND** o script responde `decision: "deny"` indicando `.env.example`.

#### Scenario: Agente lê arquivo `.env.example`
- **GIVEN** um repositório com `.agents/hooks.json` configurado
- **WHEN** `hook-agente.mjs pre-tool` recebe `read_file` para `.env.example`
- **THEN** a leitura é permitida (`decision: "allow"`).

### Requirement: Agregação Completa de Violações e Teto Modular no Verificador
O auditor determinístico `template/scripts/verificar-governanca.mjs` SHALL operar como orquestrador modular com no máximo 350 linhas úteis delegando sensores puros para `template/scripts/lib/`, e SHALL acumular todas as violações encontradas durante a execução para exibi-las de uma única vez antes de sair com código 1.

#### Scenario: Commit staged viola múltiplas regras simultaneamente
- **GIVEN** um commit staged com arquivo de UI contendo `location.reload(`, arquivo de teste contendo `.only(` e alteração de produção sem `CHANGELOG.md`
- **WHEN** `node scripts/verificar-governanca.mjs --staged` é executado
- **THEN** o processo sai com código `1`
- **AND** a saída de erro reporta todas as violações detectadas na mesma execução sem abortar na primeira.

#### Scenario: Auto-auditoria do próprio `verificar-governanca.mjs` e módulos `lib/`
- **GIVEN** os arquivos em `template/scripts/verificar-governanca.mjs` e `template/scripts/lib/*.mjs`
- **WHEN** suas linhas úteis são contadas via `contarLinhasUteisCodigo`
- **THEN** nenhum módulo excede 350 linhas úteis.

### Requirement: Transparência Obrigatória de Válvulas de Escape no Auditor e no Gate 2
O verificador determinístico SHALL detectar e imprimir em bloco dedicado qualquer ocorrência no diff de `governanca:mock-banco-justificado` ou `governanca:arquivo-extenso-justificado`, e a apresentação do Gate 2 SHALL exigir destaque explícito das válvulas ativas para validação humana.

#### Scenario: Commit utiliza válvula de arquivo extenso ou mock de banco justificado
- **GIVEN** um arquivo staged contendo `// governanca:mock-banco-justificado: falha de socket no driver sqlite`
- **WHEN** `verificar-governanca.mjs` audita o commit
- **THEN** a aprovação preserva a validade técnica da válvula
- **AND** a saída exibe o bloco `[GOVERNANÇA] VÁLVULAS DE ESCAPE ATIVAS NO DIFF` listando arquivo, tipo da válvula e justificativa.

### Requirement: Paridade Real do Modo `--ci` em Cerimônia e Sensor Anti-Monólito
O classificador de cerimônia (`template/scripts/lib/classificar-cerimonia.mjs`) e o sensor Anti-Monólito (`template/scripts/lib/sensores-codigo.mjs`) SHALL suportar avaliação explícita sobre `HEAD~1..HEAD` quando `modoCi === true`, eliminando a dependência de `git diff --cached` no ambiente de Integração Contínua.

#### Scenario: Commit enviado ao CI viola cerimônia Via 1a ou Via 1.5
- **GIVEN** um commit recém-integrado em `HEAD` que alterou 5 arquivos de produção com mensagem `fix(api): corrige quatro rotas sem delta` ou adicionou pacote novo em `package.json` sem delta ativo
- **WHEN** `node scripts/verificar-governanca.mjs --ci` é executado após o commit (com staging vazio)
- **THEN** `validarCerimoniaNoCommit` analisa `HEAD~1..HEAD`
- **AND** bloqueia o pipeline com código `1` reportando a violação de cerimônia.

#### Scenario: Commit enviado ao CI cruza o teto de 350 linhas úteis ou aumenta arquivo legado
- **GIVEN** um arquivo de produção em `HEAD` com 360 linhas úteis cuja versão em `HEAD~1` tinha 340 linhas úteis (ou arquivo legado que subiu de 380 para 390 linhas úteis)
- **WHEN** `node scripts/verificar-governanca.mjs --ci` é executado com staging vazio
- **THEN** o sensor Anti-Monólito compara `HEAD` contra `HEAD~1`
- **AND** bloqueia o pipeline com código `1` identificando a violação da catraca.

### Requirement: Ordem Atômica de Fechamento do Gate 2 (`archive` Antes de `commit`)
O protocolo do Gate 2 em `template/.agents/skills/ciclo-especificacao/SKILL.md` e `template/AGENTS.md` SHALL instruir, imediatamente após a autorização explícita humana e **antes** de `git add` e `git commit`, a atualização de `openspec/matriz-requisitos.md` (quando existir), o arquivamento formal (`npx --yes @fission-ai/openspec archive <nome> -y`) e a atualização do status `[x] Concluído` em `openspec/roadmap.md`.

#### Scenario: Fechamento completo de fatia no Gate 2
- **GIVEN** aprovação humana explícita no Gate 2 para uma fatia em `openspec/changes/fatia-XX-<slug>/`
- **WHEN** o agente executa o encerramento segundo `ciclo-especificacao/SKILL.md`
- **THEN** `openspec archive` e a atualização de `openspec/roadmap.md` ocorrem antes de `git add .` e `git commit`
- **AND** `verificar-governanca.mjs` executa as travas de `openspec/changes/archive/` sobre os arquivos staged, deixando o working tree limpo após o commit.
