# Desenho Técnico: Engenharia de Harness Determinística e Higiene de Contexto (`fatia-04`)

## 1. Arquitetura e Decisões Técnicas

### 1.1. Resolução de Caminho e Raiz do Projeto em `hook-agente.mjs`
- Conforme documentação oficial do Antigravity (`hooks.json`), o CWD de execução do hook é o diretório onde `hooks.json` reside (`.agents/`). Portanto, `template/.agents/hooks.json` invocará `node ../scripts/hook-agente.mjs <subcomando>`.
- Dentro de `hook-agente.mjs`, a função `obterRaizProjeto(payload)` resolverá o diretório raiz na seguinte ordem:
  1. `payload?.workspacePaths?.[0]` (padrão Antigravity);
  2. `payload?.cwd` ou `process.env.CLAUDE_PROJECT_DIR` (padrão Claude Code);
  3. `process.cwd()` se contiver `openspec` ou `scripts`; caso contrário, `resolve(dirname(fileURLToPath(import.meta.url)), '..')`.

### 1.2. Parser Seguro Anti-Bypass (`--no-verify` e `-n`) e Guardrails Destrutivos
- Para evitar falsos positivos em mensagens entre aspas (ex.: `git commit -m "trata flag -n"`), a função `detectarBypassGit(comando)` higienizará primeiramente literais entre aspas simples e duplas (`"..."` e `'...'`) antes de inspecionar as flags reais do comando `git commit`:
  - Bloqueia `--no-verify` em qualquer comando `git`;
  - Bloqueia flag curta `-n` em `git commit` tanto isolada (`-n`) quanto combinada em flags curtas agrupadas (`-am`, `-nm`, `-an`, ex.: `/(^|\s)-[a-z]*n[a-z]*(?=\s|$)/i`), sem confundir flags longas como `--no-edit` ou `--gpg-sign`.
- A função `detectarComandoSensivelOuDestrutivo(comando)` identificará:
  - Mutações Git reguladas pelo Artigo 11: `git commit`, `git push`, `git reset --hard`;
  - Destruição de árvore não-commitada: `git clean` com `-f`, `git checkout -- .` / `git checkout .`, `git restore .` / `git restore --staged --worktree .`;
  - Resets destrutivos de banco/ORM: `prisma migrate reset`, `drizzle-kit drop`, `supabase db reset`.

### 1.3. Sensores Instantâneos de Escrita/Edição (< 30ms)
- **No Antigravity (`PreToolUse` com `matcher: "run_command|write_file|edit_file"`):**
  - Se `toolCall.name === 'write_file'`, inspeciona `Path` e `Content` em memória (~1ms): valida ausência de `location.reload` / `window.location.href =` em UI, ausência de `.only(` e presença de asserção real em arquivos de teste completos, e integridade das 7 seções + ausência de placeholders preguiçosos em `openspec/roadmap/fatia-*.md`.
  - Se `toolCall.name === 'edit_file'`, inspeciona `Path` e `Replacement` em memória (~1ms): barra introdução de `location.reload`, `.only(` ou placeholders preguiçosos em `openspec/roadmap/fatia-*.md`.
- **No Claude Code (`PostToolUse` com `matcher: "Write|Edit|MultiEdit"` → subcomando `post-tool-claude`):**
  - Lê o arquivo recém-salvo em `tool_input.file_path` (~5ms): aplica todas as validações de conteúdo completo acima (UI, testes `.only` + asserções, fatia com 7 seções + sem placeholders) e, se o arquivo terminar em `.mjs` ou `.cjs`, executa `execFileSync(process.execPath, ['--check', caminhoArquivo])` (~15ms). Havendo falha, imprime `{ decision: "block", reason: "[GOVERNANÇA] ..." }`.

### 1.4. Vínculo Físico Roadmap ↔ OpenSpec em `verificar-governanca.mjs`
- Nova função `verificarVinculoRoadmapMudanca(nomeMudanca)`:
  - Extrai o nome canônico removendo eventual prefixo de data do `openspec archive` (`/^(\d{4}-\d{2}-\d{2}-)?(fatia-[a-z0-9-]+)$/i`).
  - Se corresponder a `fatia-*`, verifica `existsSync(join(process.cwd(), 'openspec', 'roadmap', `${fatiaCanonica}.md`))`. Se não existir, registra erro determinístico e encerra com `process.exit(1)`.
- Na auditoria de mudanças arquivadas (`possuiMudancaArquivadaStaged`), extrai o conjunto exato de subpastas `openspec/changes/archive/<subpasta>/` presentes em `arquivosArchiveStaged` (em vez de ler apenas o último item alfabético do diretório `archive/`) e audita cada uma delas.

## 2. Estados Assíncronos, Feedback Visual e Segurança

- Sem componentes de interface gráfica web nesta fatia; aplicam-se os 3 estados determinísticos de CLI/Hook:
  - **Sucesso silencioso (`allow` / `{}`):** Zero consumo extra de tokens quando a operação é legítima.
  - **Bloqueio imediato (`deny` / `block` / `exit 1` / `exit 2`):** Mensagem em PT-BR com diagnóstico literal e ação corretiva.
  - **Confirmação explícita (`force_ask` / `ask`):** Proteção humana obrigatória antes de commits, pushes, limpezas de árvore ou resets de banco (Toasts/Modais equivalentes na UI nativa da IDE agêntica).

## 3. Arquivos Criados ou Modificados

1. `template/.agents/hooks.json` (caminho `../scripts/hook-agente.mjs` e matcher `run_command|write_file|edit_file`).
2. `template/.claude/settings.json` (inclusão do bloco `PostToolUse` com matcher `Write|Edit|MultiEdit`).
3. `template/scripts/hook-agente.mjs` (anti-bypass `-n`, guardrails destrutivos, sensores de arquivo, paridade Claude Code).
4. `template/scripts/verificar-governanca.mjs` (vínculo físico `fatia-*` ↔ `openspec/roadmap/` e precisão no staging de `archive/`).
5. `template/AGENTS.md`, `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` e `template/.agents/skills/ciclo-especificacao/SKILL.md` (higiene MCP 3–5 + banco *read-only*, `/llms.txt`, subagente explorador *read-only*, regras locais por *glob* e antifragilidade no `/fix`).
6. `tests/hook-agente.test.mjs` e `tests/verificar-governanca.test.mjs` (novos testes cobrindo todos os cenários).
7. `package.json` (`3.4.0`) e `CHANGELOG.md`.
