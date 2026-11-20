# Design Técnico — Fatia 13: Auto-Governança da Matriz (Dogfooding em Fonte Única)

## Contratos, Dados e Schemas
1. **Arquitetura em Fonte Única na Raiz:**
   - Entrada de harness na raiz: `AGENTS.md` enxuto referenciando `template/constitution.md` e `template/.agents/skills/<skill>/SKILL.md`, evitando cópias espelhadas de `constitution.md` ou de skills e evitando symlinks no Git por compatibilidade com Windows (`core.symlinks=false`).
   - Lifecycle hooks na raiz: `.agents/hooks.json` invocando `node ../template/scripts/hook-agente.mjs pre-tool` e `node ../template/scripts/hook-agente.mjs session-start`; validado que `obterRaizProjeto()` em `hook-agente.mjs` resolve a raiz via `workspacePaths[0]`, `cwd`, `CLAUDE_PROJECT_DIR` ou diretório pai contendo `openspec/`.
   - Regras modulares na raiz: `.agents/rules/linear-mcp.md` (`trigger: model_decision` ancorada na Tríade `rr-diario-agents` / `RR_DIARIO_AGENTS` / `P-RR-2`) e `.agents/rules/matriz-governanca.md` (`trigger: glob` sobre `template/**`, `tests/**`, `copier.yml`, `lefthook.yml`, `.github/**`).
   - Documentos vivos selecionados na raiz: `docs/arquitetura.md` (C4 + `## 5. Mapa Físico de Módulos` com ponteiros literais entre crases validados por `existsSync()`), `docs/particularidades.md`, `docs/runbook.md` e `docs/aprendizados.md`. Omitidos propositalmente `docs/catalogo-reuso.md` (sem UI/jogos) e `docs/adr/` (substituído por `00_INDICE_E_DECISOES.md`).
2. **Refinamento Determinístico de Classificação (`template/scripts/lib/classificar-arquivos.mjs`):**
   - Remoção de `minusculo.startsWith('template/')` incondicional em `ehArquivoDeDocumentacaoOuGovernanca()`.
   - Substituição por predicado explícito que considera sob `template/` como documentação/template apenas extensões não-executáveis (`.md`, `.jinja`, `.yml`, `.yaml`, `.json`, `.gitkeep`, `.gitignore`, `.env.example`), mantendo `template/scripts/*.mjs` e eventuais arquivos de código sob `template/` como `ehArquivoDeProducao() === true`.
   - Em `template/scripts/verificar-governanca.mjs`, adição de `'CLAUDE_PROJECT_DIR'` à linha existente de `variaveisIgnoradas` no sensor `.env.example`, respeitando a catraca anti-monólito sem ampliar linhas úteis acima de `HEAD`.
3. **Configuração OpenSpec e Enforcement Git/CI:**
   - `openspec/config.yaml`: contexto atualizado para `cli-biblioteca` (Node.js ESM + Copier/Jinja2), removendo regras de frontend web (`location.reload()`, `mobile-first`, Toasts/Modais) e marcando `design` com `Não se aplica: projeto sem interface gráfica de usuário`.
   - `lefthook.yml` e `.github/workflows/ci.yml`: checagem de sintaxe para `template/scripts/*.mjs` e `template/scripts/lib/*.mjs`, execução de `verificar-governanca.mjs` no `pre-commit` e `verificar-governanca.mjs --ci` com `fetch-depth: 2` no Actions, além de verificação de `docs/runbook.md`, `.agents/skills/auditoria-seguranca/SKILL.md` e `.agents/skills/auditoria-ux-analytics/SKILL.md` no job Copier.

## Interface e Estados Assíncronos
Não se aplica: repositório de protocolo CLI/biblioteca sem interface gráfica de usuário.

## Regras de Negócio e Segurança
1. **Proteção da Catraca Anti-Monólito (`verificar-governanca.mjs`):** Com a reclassificação de `template/scripts/*.mjs` como código de produção, o arquivo `template/scripts/verificar-governanca.mjs` (> 350 linhas úteis) fica protegido pela catraca e não pode aumentar sua contagem de linhas úteis nesta edição; edições futuras de novos sensores devem ser extraídas em módulos em `template/scripts/lib/`.
2. **Isolamento do Template Copier (`_subdirectory: template`):** Nenhum arquivo novo na raiz (`AGENTS.md`, `.agents/`, `docs/`) vaza para projetos consumidores porque `copier.yml` isola a cópia estritamente em `template/`.
3. **Zero Dependências Externas nos Scripts e Integridade Referencial:** Todos os scripts e testes continuam zero-dependências externas (Node ESM nativo + `node:test` / `node:assert/strict`), sem wrappers proprietários (`.claude/`, `.cursor/`, `CLAUDE.md`, `GEMINI.md`) e mantendo todas as asserções das 14 suítes de teste existentes.
