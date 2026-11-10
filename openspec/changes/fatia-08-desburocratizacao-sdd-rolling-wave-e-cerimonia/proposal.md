# Proposta — Fatia 08: Desburocratização SDD Sem Perda de Rigor, Rolling Wave e Níveis de Cerimônia

## Why
No ciclo Governança v3, a evolução do sistema impôs uma tripla burocracia documental mecânica:
1. Uma tabela resumida de status em `openspec/project.md` §3.
2. Um arquivo individual detalhado com 7 seções rígidas em `openspec/roadmap/fatia-XX-<slug>.md`.
3. Quatro arquivos repetidos com as mesmas informações ao abrir o delta em `openspec/changes/fatia-XX-<slug>/`.

Além do retrabalho mecânico de sincronizar 3 arquivos para cada avanço, o modelo anterior apresentava lacunas determinísticas:
- O verificador aceitava arquivos rasos com apenas 30 caracteres nos deltas do OpenSpec.
- Manutenções estruturais legítimas (`refactor`, `perf`, bumps de dependências existentes) eram travadas no pre-commit se tocassem mais de 3 arquivos, forçando a criação de deltas artificiais.
- O tipo `fix(...)` podia ser comitado tocando código de produção sem exigir nenhum arquivo de teste staged no pre-commit.
- Bugs de classificação tratavam arquivos de teste Python em `tests/` como código de produção e isentavam a pasta `scripts/` inteira, permitindo escape de scripts de build ou código de jogos (Godot GDScript).
- `AGENTS.md` e `constitution.md` duplicavam textos e regras, aumentando o ruído de contexto.

## What Changes
1. **Rolling Wave com Fonte Única e Fiscalização por Cabeçalhos:**
   - Institui `openspec/roadmap.md` (`template/openspec/roadmap.md.jinja`) como a fonte única de planejamento macro (Invariantes Globais do Gate 0 + blocos por fatia com `Depende de`, `Objetivo`, `ENTRA` e `FICA DE FORA`).
   - `openspec/project.md` §3 passa a ser apenas um ponteiro para `roadmap.md`.
   - Remoção de `template/openspec/roadmap/_template-fatia.md`.
   - `verificar-governanca.mjs` passa a auditar cabeçalhos obrigatórios (PT-BR ou EN) em `proposal.md`, `specs/`, `design.md` e `tasks.md`, além de manter compatibilidade com fatias legadas `fatia-*.md` que existirem.
2. **Via Nível 1.5 — Manutenção Estrutural Blindada:**
   - Módulo `template/scripts/lib/classificar-cerimonia.mjs` para classificar vias de cerimônia.
   - Permite commits > 3 arquivos ou bumps de dependências já presentes em `HEAD:package.json` sem spec artificial para `refactor`, `perf`, `style`, `chore` e `build`.
   - Decisão realizada no estágio `commit-msg` e `--ci`, bloqueando schema/migrações, chaves novas em dependências e linhas sob `### Adicionado` no `CHANGELOG.md`.
3. **Calibragem Estrita de `/fix` e Heurística Anti-Contrabando em `style`:**
   - Bloqueio determinístico de `fix(...)` tocando produção sem arquivo de teste staged.
   - `style(...)` dispensa teste novo, mas bloqueia caso adicione fluxo de controle, hooks, handlers ou I/O em código.
4. **Correção de Classificação de Arquivos (`classificar-arquivos.mjs`):**
   - Suporte unificado a prefixos `tests/`, `test/`, `__tests__/` na raiz e padrões `test_*.py`/`*_test.py` em subpastas.
   - Isenção restrita de `scripts/` apenas para scripts oficiais da governança.
5. **Emenda por Re-mapeamento Constitucional e Cartão de Invariantes:**
   - Atualização da mecânica dos Artigos 8.3, 8.5, 11.2 e 12.2–12.4 em `template/constitution.md` mantendo 100% dos exemplos concretos.
   - Inserção de Cartão de Invariantes (≤ 15 linhas) em `template/AGENTS.md`.
   - Roteiro de migração v3 → v4 em `template/.agents/skills/atualizar-governanca/SKILL.md`.

## Fica de Fora
Ficam explicitamente fora desta fatia:
- Extração de regras modulares por glob em `.agents/rules/` e kit de documentação de mercado (Fatia 09).
- Comandos de atalho multi-harness, handoff de sessão e template de PR (Fatia 09a).
- Catálogo de reúso de componentes, tokens de movimento e sensor anti-monólito (Fatia 10).
- Testing Trophy anti-mocking e pipelines CI poliglotas com Playwright Smoke (Fatia 11).
