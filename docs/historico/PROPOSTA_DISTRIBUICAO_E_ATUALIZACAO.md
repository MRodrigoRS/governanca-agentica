# Distribuição e Atualização da Governança (D12 + D13)

> **Papel:** Decisão de distribuição e ciclo de atualização. **Status:** Vigente (aprovado em **D12** e **D13**). **Índice:** [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md)
> **Atualizado:** 27/10/2026

---

## 1. Princípio

**Instalar e atualizar são o mesmo mecanismo.** Um comando de uma linha instala a governança em qualquer pasta (nova ou existente); um segundo comando a atualiza sem destruir o que o projeto personalizou.

## 2. Propriedade dos Arquivos (a regra que faltou na v1)

| Tipo | Exemplos | Comportamento na atualização |
|---|---|---|
| **Da governança** | Modelos, skills padrão, ponteiros (`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.cursor/rules/`), CI base | Substituído pela versão nova |
| **Misto** | `AGENTS.md`, `constitution.md` | Bloco delimitado da governança é atualizado; bloco do projeto preservado |
| **Do projeto** | `openspec/specs/`, `openspec/changes/`, `docs/adr/`, `CHANGELOG.md`, código | Nunca tocado |

Formato do bloco misto:

```markdown
<!-- governanca:inicio v2.0.0 — não edite este bloco; mudanças vão no repositório da governança -->
...cláusulas oficiais...
<!-- governanca:fim -->

## Regras específicas deste projeto
...livre...
```

## 3. Ferramenta Oficial: Copier (D12 + D13)

| Opção | Avaliação |
|---|---|
| **Copier (Escolhido)** | Padrão da indústria para template **com atualização**. Registra a versão em `.copier-answers.yml`; `copier update` faz mesclagem em 3 vias via Git, preservando edições locais e mostrando conflitos. Usado pelo template oficial do FastAPI. Requer `uv`. |
| Script próprio | Descartado — convenção caseira (erro da v1) |
| Submódulo Git | Descartado — complexo e frágil |

## 4. Comandos Oficiais

| Ação | Comando |
|---|---|
| Instalar em qualquer pasta | `uvx copier copy gh:MRodrigoRS/<repo-v2> .` |
| Atualizar | `uvx copier update` (+ `openspec update`) |

Pré-requisitos: `uv`, Node.js (para o OpenSpec e para as stacks JS), Git. A pasta precisa ser um repositório Git com a árvore limpa para atualizar.

## 5. Ciclo de Versões

1. O repositório da governança usa tags semânticas (`v2.0.0`, `v2.1.0`…) e um `CHANGELOG.md` próprio.
2. O projeto registra a versão instalada em `.copier-answers.yml`.
3. A skill `atualizar-governanca` faz o agente: rodar a atualização → resumir o que mudou (pelo changelog) → resolver conflitos com o humano → rodar os testes → commit `chore(governanca): atualiza para vX.Y.Z`.

## 6. Decisões Confirmadas

- [x] Copier como mecanismo oficial de instalação e atualização (**D12 / D13**).
- [x] Comando de uma linha como forma de distribuição (**D12**).
- [x] Formato de bloco delimitado para arquivos mistos (**D13**).
