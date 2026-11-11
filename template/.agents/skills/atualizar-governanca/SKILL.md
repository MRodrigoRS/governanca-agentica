---
name: atualizar-governanca
description: Guia o procedimento seguro de atualização da Governança via Copier, preservando customizações locais e fornecendo roteiro de migração v3 para v4.
---

# Skill: Atualizar Governança

Esta skill orienta o agente na atualização contínua dos arquivos de governança do projeto quando novas versões forem lançadas no repositório matriz.

---

## 1. Pré-Requisitos

1. O repositório Git local deve estar com a árvore de trabalho limpa (`git status` sem alterações pendentes não-comitadas).
2. Ter o `uv` instalado no ambiente de desenvolvimento.

---

## 2. Execução da Atualização

Execute o comando oficial de atualização do Copier na raiz do projeto:

```bash
uvx copier update
```

O Copier verificará a versão registrada em `.copier-answers.yml`, baixará as atualizações da governança e aplicará uma mesclagem de 3 vias (3-way merge) via Git.

---

## 3. Roteiro de Migração Governança v3 → v4 (Rolling Wave)

Se o projeto estiver migrando da Governança v3 para a v4, siga estes passos para adequar a estrutura sem quebrar fatias em andamento:

1. **Criação de `openspec/roadmap.md`:**
   - Crie o arquivo `openspec/roadmap.md` com a seção `## 1. Invariantes Globais do Gate 0` (tabela de isolamento, auth, filas, entidades e convenção de IDs).
   - Adicione `## 2. Fila de Fatias Incrementais (Rolling Wave)`.
2. **Preservação de Fatias Legadas:**
   - Arquivos legados `openspec/roadmap/fatia-*.md` já existentes continuam protegidos e são auditados pela regra de retrocompatibilidade v3. Não é necessário apagá-los nem reescrevê-los.
3. **Registro de Fatias Pendentes em Blocos:**
   - Para cada fatia pendente futura, crie um bloco `### [ ] fatia-XX-<slug>` em `openspec/roadmap.md` com as 4 âncoras obrigatórias: `Depende de`, `Objetivo de Valor`, `O que ENTRA` e `O que FICA DE FORA`.
4. **Simplificação de `openspec/project.md`:**
   - Na Seção 3 de `openspec/project.md`, remova a tabela estática redundante e aponte para `openspec/roadmap.md`.
5. **Aproveitamento da Via 1.5:**
   - Refatorações e bumps de versões já presentes em `package.json` agora podem ser comitados sem delta artificial usando os tipos convencionais `refactor`, `perf`, `style`, `chore` e `build`.

---

## 4. Verificação de Propriedade de Arquivos

Inspecione as alterações usando `git status` e `git diff`:

* **Arquivos da Governança (Substituídos):** `scripts/` (incluindo `scripts/lib/`), `lefthook.yml`, `.github/workflows/ci.yml`, `.agents/rules/`, `.agents/skills/` e `.agents/hooks.json`. Devem receber as novidades oficiais no Padrão Universal (`AGENTS.md` + `.agents/`).
* **Arquivos Mistos (Mesclados):** `AGENTS.md` e `constitution.md`. Verifique se o bloco `<!-- governanca:inicio ... -->` foi atualizado (com o novo Cartão de Invariantes e Emenda por Re-mapeamento) e se a seção `## Cláusulas Adicionais Deste Projeto` foi mantida intacta.
* **Arquivos do Projeto (Intocados):** `openspec/`, `docs/adr/`, `CHANGELOG.md` e código-fonte. Não devem sofrer alterações involuntárias do template.

---

## 5. Prova de Saúde Pós-Atualização

Execute os testes automatizados e o validador da governança:

```bash
node scripts/verificar-governanca.mjs
npm test # ou pytest / cargo test
```

---

## 6. Commit de Atualização

Após validar que tudo está verde e funcionando perfeitamente:

```bash
git add .
git commit -m "chore(governanca): atualiza protocolo para governanca v4"
```
