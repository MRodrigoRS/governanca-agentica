# Particularidades Operacionais e de Ambiente — Repositório Matriz

> **Papel:** Restrições concretas do ambiente de desenvolvimento, regras meta-repositório e armadilhas operacionais específicas da matriz `governanca-agentica`.
> **Zero Segredos (Artigo 3):** Não armazene chaves, tokens ou senhas reais neste documento.

---

## 1. Infraestrutura, Shell e Ambiente de Execução

- **Sistema Principal Local (Windows PowerShell 5.1):** O encadeamento `&&` falha no PowerShell 5.1. Sempre utilize comandos separados ou `; if ($?) { ... }`.
- **Busca Local em CLI no Windows:** O binário `rg` (ripgrep) não está instalado por padrão neste ambiente; prefira `Get-ChildItem` + `Select-String` no PowerShell.
- **Compatibilidade POSIX no CI (`ubuntu-latest` + Node 20):** Em `package.json`, mantenha `node --test tests/*.test.mjs` (sem aspas duplas em volta do glob nem `**` dependente de bash globstar), garantindo expansão correta sob `/bin/sh`.
- **Symlinks no Git em Windows:** Evitados deliberadamente (`core.symlinks=false` por padrão no Windows). A matriz aponta da raiz para `template/constitution.md` e `template/.agents/skills/` por caminho explícito em vez de links simbólicos.

---

## 2. Persistência de Estado e Versionamento Copier

- **Sem Banco de Dados:** Este repositório não usa ORM, SQLite nem migrations; todos os testes de hooks/verificador operam criando diretórios Git temporários isolados (`tmpdir()`) via `node:test`.
- **Isolamento Copier (`_subdirectory: template`):** Apenas o conteúdo sob `template/` (renderizado com sufixo `.jinja` via `copier.yml`) é distribuído aos consumidores; arquivos na raiz (`AGENTS.md`, `.agents/`, `docs/`, `tests/`, `openspec/`) pertencem exclusivamente à matriz.
- **Proteção `_skip_if_exists`:** Todo arquivo editável pelos projetos consumidores (`README.md`, `CHANGELOG.md`, `docs/*`, `openspec/roadmap.md`, `openspec/project.md`, `.gitignore`, `.env.example`) deve permanecer listado em `_skip_if_exists` no `copier.yml`.

---

## 3. Integrações Externas e Linear MCP

- **Linear Hosted Remote MCP Server (`.mcp.json`):** Conectado via `npx -y mcp-remote https://mcp.linear.app/mcp`.
- **Tríade de Âncora Imutável:** Operações Linear neste repositório são restritas ao Workspace `rr-diario-agents`, Equipe `RR_DIARIO_AGENTS` (`RR`) e Projeto `Governança Agêntica` (`P-RR-2`), sempre precedidas por `whoami` e confirmação humana antes de escrita.
- **Variável de Harness Excluída de `.env.example`:** `CLAUDE_PROJECT_DIR` é fornecida pelo runtime do agente e listada em `variaveisIgnoradas` no `verificar-governanca.mjs` para não gerar falso positivo de variável ausente em `.env.example`.

---

## 4. Regras de Domínio Não-Óbvias da Meta-Governança

- **Padrão Universal Puro (D40):** É proibido adicionar wrappers proprietários (`.claude/`, `.cursor/`, `.vscode/`, `CLAUDE.md`, `GEMINI.md`, `.github/prompts|instructions|agents`). Testes automatizados (`tests/piramide-testes-e-ci-poliglota.test.mjs`, `tests/regras-modulares-e-docs-mercado.test.mjs`, `tests/comandos-e-handoff.test.mjs`) falham se esses caminhos ou referências a `.claude/` voltarem no `ci.yml` ou no template.
- **Classificação Dual de `template/` e `scripts/`:** `template/scripts/*.mjs` são arquivos de produção nesta matriz (sujeitos a Test-First, `CHANGELOG.md` e catraca anti-monólito), enquanto em projetos consumidores os scripts copiados para `scripts/` permanecem classificados como governança.
- **Catraca Ativa em `verificar-governanca.mjs`:** Como `template/scripts/verificar-governanca.mjs` já excede 350 linhas úteis, ele não pode crescer acima da contagem de `HEAD`; novos sensores pertencem a módulos em `template/scripts/lib/`.
