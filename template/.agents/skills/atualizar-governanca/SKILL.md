---
name: atualizar-governanca
description: Guia o procedimento seguro de atualização da Governança v2 via Copier, preservando customizações locais e resolvendo eventuais conflitos.
---

# Skill: Atualizar Governança v2

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

## 3. Verificação de Propriedade de Arquivos

Inspecione as alterações usando `git status` e `git diff`:

* **Arquivos da Governança (Substituídos):** `scripts/`, `lefthook.yml`, `.github/workflows/ci.yml`, ponteiros (`CLAUDE.md`, `GEMINI.md`, etc.). Devem receber as novidades oficiais.
* **Arquivos Mistos (Mesclados):** `AGENTS.md` e `constitution.md`. Verifique se o bloco `<!-- governanca:inicio ... -->` foi atualizado e se a seção `## Regras Específicas Deste Projeto` foi mantida intacta.
* **Arquivos do Projeto (Intocados):** `openspec/`, `docs/adr/`, `CHANGELOG.md` e código-fonte. Não devem sofrer alterações involuntárias do template.

---

## 4. Resolução de Conflitos (se houver)

Se o Git reportar marcadores de conflito (`<<<<<<<`, `=======`, `>>>>>>>`):
1. Analise o conflito em conjunto com o desenvolvedor humano.
2. Preserve as customizações locais do projeto.
3. Marque os arquivos como resolvidos via `git add`.

---

## 5. Prova de Saúde Pós-Atualização

Execute os testes automatizados e o validador da governança:

```bash
node scripts/verificar-governanca.mjs
npm test # ou pytest
```

---

## 6. Commit de Atualização

Após validar que tudo está verde e funcionando perfeitamente:

```bash
git add .
git commit -m "chore(governanca): atualiza regras da governanca v2"
```
