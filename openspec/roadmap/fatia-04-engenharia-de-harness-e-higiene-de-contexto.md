# Fatia 04: Engenharia de Harness Determinística, Guardrails Pós-Edição e Higiene de Contexto (Absorção Cirúrgica da Issue RR-6)

> **Status:** `[~] Em Andamento`
> **Identificador OpenSpec:** `fatia-04-engenharia-de-harness-e-higiene-de-contexto`
> **Origem Linear:** Issue [`RR-6`](https://linear.app/rr-diario-agents/issue/RR-6/texto-profissional-da-mais-avancada-programacao-com-agentes) no projeto `P-RR-2` (`GOV-AGENTS-V2`)

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:** Evolui o motor determinístico da Governança (`v3.4.0`) absorvendo as práticas de mais alto retorno da Engenharia de Harness e Gestão de Contexto identificadas na auditoria forense da issue `RR-6`, sem adicionar dependências externas e sem inflar o consumo de tokens em sessões limpas:
  1. **Sensores Instantâneos de Edição (`PostToolUse` no Claude Code e `PreToolUse` de Escrita no Antigravity em < 30ms):** Em vez de descobrir violações somente no Gate 2, o agente recebe feedback corretivo imediato no mesmo turno caso tente gravar `location.reload`, `.only(`, teste oco, fatia de roadmap preguiçosa/incompleta ou erro de sintaxe `.mjs`/`.cjs`.
  2. **Fechamento de Brechas no `PreToolUse` e Paridade Real Antigravity + Claude Code:** Bloqueia bypasses via flag curta `-n` em `git commit`, intercepta comandos destrutivos de árvore/banco (`git clean -f`, `git checkout -- .`, `git restore .`, resets de ORM) exigindo confirmação humana, corrige o caminho relativo `../scripts/hook-agente.mjs` em `.agents/hooks.json` e ativa confirmação de commits (Artigo 11) e injeção de `SessionStart` também no Claude Code.
  3. **Vínculo Físico Determinístico Roadmap ↔ OpenSpec (`verificar-governanca.mjs`):** Impede que qualquer delta `fatia-XX-*` em `openspec/changes/` (ativo ou recém-arquivado) passe no pre-commit/CI sem possuir seu respectivo arquivo detalhado em `openspec/roadmap/fatia-XX-*.md`, além de auditar com precisão os diretórios exatos arquivados no staging.
  4. **Diretrizes Cirúrgicas de Higiene de Contexto e Antifragilidade:** Teto explícito de servidores MCP ativos (3 a 5) com preferência *read-only* para bancos compartilhados, fallback `/llms.txt` para SDKs externos fora do Context7, delegação de varreduras amplas em bases Brownfield a subagentes exploratórios *read-only* e conversão de falhas recorrentes em regras determinísticas durante o `/fix`.
- **Por que esta fatia existe neste ponto da sequência:** Com a fundação OpenSpec + Hooks (Fatia 01), a sincronização Linear MCP (Fatia 02) e o rigor TDD anti-teatro de testes (Fatia 03) consolidados, esta fatia fecha as lacunas remanescentes do runtime determinístico (*Harness*) para que as cláusulas constitucionais atuem em tempo real durante a codificação, e não apenas no momento tardio do commit.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-03-rigor-tdd-e-mutacao-mental.md` (reaproveita os critérios anti-teatro de testes, anti-preguiça de fatias e a suíte automatizada em `tests/`).
- **O que esta fatia prepara/desbloqueia para a próxima:** Deixa o harness multi-IDE (Antigravity e Claude Code) 100% simétrico, auto-corretivo em tempo de edição e blindado contra perda acidental de trabalho ou criação de deltas órfãos no OpenSpec.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** criar arquivos `SPEC.md` ou `TODO.md` paralelos ao ecossistema `openspec/`.
  - **Proibido** fragmentar `template/constitution.md` em múltiplos arquivos menores (preservar integridade dos blocos `<!-- governanca:inicio -->` para `uvx copier update`).
  - **Proibido** impor `git worktree` paralelo como fluxo padrão de fatias sequenciais.
  - **Proibido** adicionar qualquer dependência npm externa em `template/` (manter 100% Node.js nativo ESM).

---

## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)

### 3.1. Tabelas e Colunas do Banco de Dados
Não há banco de dados relacional neste repositório (protocolo distribuído via arquivos e scripts Node.js ESM puros). Os contratos de dados operam sobre payloads JSON padronizados via `stdin` e `stdout` entre as IDEs agênticas e os scripts determinísticos.

### 3.2. Contratos de Entrada e Saída dos Scripts Determinísticos

| Script / Arquivo | Evento / Subcomando | Contrato de Entrada (`stdin` / `argv`) | Contrato de Saída (`stdout` / `stderr` / `exitCode`) |
|---|---|---|---|
| `template/scripts/hook-agente.mjs` | `pre-tool` (Antigravity `run_command\|write_file\|edit_file`) | JSON `{ toolCall: { name, args: { CommandLine, Path, Content, Target, Replacement } }, workspacePaths }` | JSON `{ decision: "allow" \| "deny" \| "force_ask", reason?: string }` (`exit 0`) |
| `template/scripts/hook-agente.mjs` | `pre-tool-claude` (Claude Code `Bash`) | JSON `{ hook_event_name: "PreToolUse", tool_name: "Bash", tool_input: { command }, cwd }` | Bypass `--no-verify`/`-n`: `stderr` + `exit 2`. Comandos sensíveis/commits: JSON `{ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason } }` (`exit 0`). Demais: `{}` (`exit 0`). |
| `template/scripts/hook-agente.mjs` | `post-tool-claude` (Claude Code `Write\|Edit\|MultiEdit`) | JSON `{ hook_event_name: "PostToolUse", tool_name, tool_input: { file_path }, cwd }` | Se violação detectada no arquivo salvo: JSON `{ decision: "block", reason: "[GOVERNANÇA] ..." }` (`exit 0`). Se íntegro: `{}` (`exit 0`). |
| `template/scripts/hook-agente.mjs` | `session-start` / `session-start-claude` | JSON de metadados da sessão (`workspacePaths` / `cwd`) | Antigravity: `{ injectSteps: [{ systemMessage: { systemMessage } }] }`. Claude Code: `{ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext } }`. |
| `template/scripts/verificar-governanca.mjs` | Execução local (staged) ou `--ci` | Estado do Git + árvore `openspec/roadmap/` e `openspec/changes/` | `exit 0` com log verde se íntegro; `exit 1` em `stderr` se `fatia-XX-*` em `changes/` ou `archive/` não possuir `openspec/roadmap/fatia-XX-*.md` correspondente. |

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Rotas / Telas criadas ou alteradas:** Não aplicável (ferramenta de protocolo CLI e configuração de IDE sem interface web).
- **Responsividade e Portabilidade PWA Inatas:** Mantidas intactas nas diretrizes constitucionais distribuídas pelo template para projetos web satélites.
- **Feedback Reativo Determinístico ao Agente e ao Humano:**
  1. **Silencioso quando íntegro (`success`):** Hooks retornam `allow` / `{}` em menos de 30ms sem injetar ruído de texto na janela do modelo (zero custo extra de tokens).
  2. **Bloqueio Imediato (`error` / `deny` / `block`):** Mensagens em Português do Brasil com causa exata da violação constitucional e instrução direta de correção no mesmo turno.
  3. **Confirmação Humana de Segurança (`force_ask` / `ask`):** Acionada antes de qualquer `git commit`, `git push`, `git reset --hard`, `git clean -f`, `git checkout -- .`, `git restore .` ou reset destrutivo de banco/ORM (`prisma migrate reset`, `drizzle-kit drop`, `supabase db reset`).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Regra 1 — Fechamento Anti-Bypass de Hooks Git (`--no-verify` e `-n`):**
   - SE o comando shell contiver `--no-verify` OU for um comando `git commit` contendo a flag curta `-n` (isolada como `-n` ou combinada em grupo curto como `-am "..." -n`, `-nm`, `-an`), ENTÃO o hook DEVE bloquear imediatamente (`deny` no Antigravity; `exit 2` no Claude Code).
   - Cuidado anti-falso-positivo: Argumentos dentro da string da mensagem (ex.: `git commit -m "corrige item -n na lista"`) NÃO devem ser confundidos com a flag `-n` do `git commit`.
2. **Regra 2 — Interceptação de Comandos Destrutivos e de Mutação Externa:**
   - SE o comando shell executar `git commit`, `git push`, `git reset --hard`, `git clean` com `-f`, `git checkout -- .` / `git checkout .`, `git restore .` (descartando árvore inteira), ou resets destrutivos de banco (`prisma migrate reset`, `drizzle-kit drop`, `supabase db reset`), ENTÃO o hook DEVE exigir confirmação humana explícita (`force_ask` no Antigravity; `permissionDecision: "ask"` no Claude Code).
3. **Regra 3 — Inspeção Instantânea de Escrita/Edição de Arquivo (< 30ms):**
   - Ao interceptar escrita/edição de arquivo (`PreToolUse` `write_file`/`edit_file` no Antigravity; `PostToolUse` `Write`/`Edit`/`MultiEdit` no Claude Code):
     - **Frontend (`.tsx`, `.jsx`, `.vue`, `.svelte`, `.html`):** Rejeitar se o conteúdo gravado/substituído introduzir `location.reload(`, `window.location.reload(` ou `window.location.href =`.
     - **Testes (`.test.*`, `.spec.*`, etc.):** Rejeitar se introduzir `.only(` ou `@unittest.skip`, ou (em criação completa de arquivo / pós-escrita em disco) não contiver nenhum marcador de asserção real.
     - **Roadmap (`openspec/roadmap/fatia-*.md`):** Rejeitar se contiver os marcadores não preenchidos definidos no verificador da governança (tags angulares de modelo, colchetes de instrução ou indicadores de pendência) ou (em escrita completa / pós-edição em disco) faltar qualquer uma das 7 seções obrigatórias (`## 1.` a `## 7.`).
     - **Sintaxe de Scripts Node (`.mjs`, `.cjs`) em `post-tool-claude`:** Executar `node --check <arquivo>` sobre o arquivo salvo e reportar `block` imediato se houver erro sintático.
4. **Regra 4 — Resolução Resiliente de Diretório em `.agents/hooks.json`:**
   - Como o Antigravity define o diretório de trabalho do hook como a pasta onde reside `hooks.json` (`.agents/`), os comandos em `template/.agents/hooks.json` devem invocar `node ../scripts/hook-agente.mjs ...`, e `hook-agente.mjs` deve resolver a raiz do workspace priorizando `workspacePaths[0]` / `cwd` do payload antes de recorrer ao `process.cwd()`.
5. **Regra 5 — Vínculo Obrigatório Roadmap ↔ Delta OpenSpec (`verificar-governanca.mjs`):**
   - SE houver mudança ativa `openspec/changes/<nome>` ou mudança arquivada no staging `openspec/changes/archive/<YYYY-MM-DD-nome>/` cujo identificador canônico comece com `fatia-` (ex.: `fatia-02-produtos` ou `2026-11-01-fatia-02a-variacoes` -> `fatia-02a-variacoes`), ENTÃO o arquivo físico `openspec/roadmap/<fatia-canonica>.md` DEVE existir no disco; caso contrário, `verificar-governanca.mjs` aborta com `exit 1`.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Todos os testes abaixo devem ser adicionados ANTES da alteração dos scripts de produção, comprovando a falha legítima (**Vermelho**) no terminal e depois a aprovação integral (**Verde**):

1. **Teste 1 (`hook-agente: bloqueia bypass curto git commit -n sem falso positivo em mensagens`):**
   - *Cenário:* Executar `pre-tool` e `pre-tool-claude` com `git commit -n -m "feat: teste"` e `git commit -am "feat: teste" -n`, além de testar `git commit -m "corrige flag -n no parser"`.
   - *Resultado Esperado:* Os dois primeiros são negados (`deny` / `exit 2`); o terceiro (onde `-n` faz parte apenas da mensagem entre aspas) pede confirmação normal (`force_ask` / `ask`) sem ser bloqueado por bypass.
2. **Teste 2 (`hook-agente: exige confirmacao humana em comandos destrutivos e garante paridade no Claude Code`):**
   - *Cenário:* Executar `pre-tool` e `pre-tool-claude` com `git commit -m "feat: ok"`, `git clean -fd`, `git restore .` e `npx prisma migrate reset --force`.
   - *Resultado Esperado:* Antigravity retorna `decision: "force_ask"`; Claude Code retorna JSON com `hookSpecificOutput.permissionDecision === "ask"`.
3. **Teste 3 (`hook-agente: bloqueia gravacao imediata de location.reload, .only e fatia preguicosa`):**
   - *Cenário:* Testar `pre-tool` (Antigravity `write_file`/`edit_file`) e `post-tool-claude` (Claude Code `Write`/`Edit` em diretório temporário) tentando gravar `window.location.reload()` em `painel.tsx`, `.only(` em `painel.test.ts`, marcador não preenchido de template em `openspec/roadmap/fatia-05-teste.md` e erro de sintaxe em `script.mjs`.
   - *Resultado Esperado:* Todos retornam bloqueio determinístico imediato com razão em PT-BR; arquivos válidos retornam `allow` / `{}`.
4. **Teste 4 (`hook-agente: session-start-claude injeta contexto da governanca e mudancas ativas`):**
   - *Cenário:* Executar `session-start-claude` em workspace contendo mudança ativa em `openspec/changes/fatia-04-teste`.
   - *Resultado Esperado:* Retorna JSON válido com `hookSpecificOutput.hookEventName === "SessionStart"` e `additionalContext` mencionando `fatia-04-teste` e o Artigo 12.
5. **Teste 5 (`verificar-governanca: bloqueia delta fatia-XX em openspec/changes sem arquivo correspondente em openspec/roadmap`):**
   - *Cenário:* Criar mudança completa (`proposal.md`, `design.md`, `tasks.md`) em `openspec/changes/fatia-09-fantasma` num repo temporário com arquivo de produção e `CHANGELOG.md` staged, mas **sem** criar `openspec/roadmap/fatia-09-fantasma.md`.
   - *Resultado Esperado:* `verificar-governanca.mjs` falha com `exit 1` exigindo a criação física do arquivo no roadmap; ao criar o arquivo válido com 7 seções em `openspec/roadmap/fatia-09-fantasma.md`, passa com `exit 0`.
6. **Teste 6 (`template: hooks.json aponta para ../scripts/hook-agente.mjs relativo a .agents/`):**
   - *Cenário:* Inspecionar `template/.agents/hooks.json` e executar o comando configurado a partir do diretório `template/.agents` com payload JSON simulado.
   - *Resultado Esperado:* Executa sem erro `MODULE_NOT_FOUND` e retorna decisão JSON válida.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Todos os 6 novos grupos de testes da Seção 6 falharam antes da implementação (evidência Vermelha) e passaram após o código (evidência Verde), sem nenhum `.only(` ou teste oco.
- [ ] `template/.agents/hooks.json` e `template/.claude/settings.json` atualizados e validados como JSON estrito.
- [ ] Diretrizes cirúrgicas de Orçamento MCP (3–5 ativos + banco *read-only*), `/llms.txt`, subagente explorador *read-only* e antifragilidade no `/fix` incorporadas de forma enxuta em `template/AGENTS.md`, `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` e `template/.agents/skills/ciclo-especificacao/SKILL.md`.
- [ ] Versão atualizada para `3.4.0` em `package.json` e `CHANGELOG.md` documentado no padrão Keep a Changelog.
- [ ] `npx --yes @fission-ai/openspec validate --all --no-interactive`, `npm test` e `node template/scripts/verificar-governanca.mjs` aprovados com `exit 0`.
- [ ] Auditoria Factual Cega executada pelo Subagente Inspetor Forense e confrontada no Duelo de Conformidade antes do Gate 2.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** Terminal na raiz do repositório `c:\Users\Rodrigo\source\repos\governan-a-de-agentes-v2`.
- **Passo a passo com dados prontos:**
  1. Rodar a suíte completa de testes da governança:
     ```powershell
     npm test
     ```
  2. Simular tentativa de bypass curto `-n` no hook do agente:
     ```powershell
     '{"toolCall":{"name":"run_command","args":{"CommandLine":"git commit -n -m \"feat: atalho\""}}}' | node template/scripts/hook-agente.mjs pre-tool
     ```
  3. Simular tentativa de escrita de `location.reload()` em um componente React antes mesmo de tocar no disco:
     ```powershell
     '{"toolCall":{"name":"write_file","args":{"Path":"src/App.tsx","Content":"export function App(){ window.location.reload(); }"}}}' | node template/scripts/hook-agente.mjs pre-tool
     ```
- **Comportamento visual esperado:** `npm test` exibe 100% dos testes passando verdes; os dois comandos simulados retornam imediatamente `{"decision":"deny","reason":"..."}` em Português do Brasil explicando a cláusula constitucional violada.
- **Teste de borda prático:** Simular um commit legítimo cuja mensagem menciona `-n` no texto (`'{"toolCall":{"name":"run_command","args":{"CommandLine":"git commit -m \"fix(cli): trata parametro -n no parser\""}}}' | node template/scripts/hook-agente.mjs pre-tool`) e verificar que retorna `"decision":"force_ask"` (confirmação humana normal do Artigo 11) em vez de falso bloqueio de bypass.
