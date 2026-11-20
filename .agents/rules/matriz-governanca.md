---
trigger: glob
globs: ["template/**", "tests/**", "copier.yml", "lefthook.yml", ".github/**"]
description: "Regras específicas do repositório matriz governanca-agentica (Copier, scripts ESM, testes e Padrão Universal)"
---

# Regras da Matriz — `governanca-agentica`

> **Escopo:** Evolução do template Copier (`template/`), scripts determinísticos (`template/scripts/`) e suíte de testes (`tests/`).

---

## 1. Isolamento Copier e Padrão Universal Puro (D40)
- Tudo o que é distribuído aos projetos consumidores vive estritamente dentro de `template/` (configurado em `copier.yml` via `_subdirectory: template`).
- Arquivos editáveis pelo projeto consumidor devem estar protegidos em `_skip_if_exists` no `copier.yml` ou isolados com marcadores `governanca:inicio` / `governanca:fim`.
- **Proibido wrappers proprietários:** Nunca crie `.claude/`, `.cursor/`, `.vscode/`, `CLAUDE.md`, `GEMINI.md` ou `.github/prompts|instructions|agents` nem na raiz nem em `template/`.

---

## 2. Scripts Determinísticos e Catraca Anti-Monólito
- Todos os arquivos em `template/scripts/` e `tests/` devem usar JavaScript ESM puro sem dependências externas de `npm`.
- `template/scripts/*.mjs` são classificados como código de produção nesta matriz (`classificar-arquivos.mjs`).
- Como `template/scripts/verificar-governanca.mjs` excede 350 linhas úteis, novas regras/sensores devem ser extraídos em módulos dedicados sob `template/scripts/lib/` sem aumentar o monólito principal.
- Variáveis exclusivas de ambiente/harness (como `CLAUDE_PROJECT_DIR`, `CI`, `PATH`) que não pertencem a `.env.example` devem estar em `variaveisIgnoradas` no verificador.

---

## 3. Sincronia SemVer, Integridade Referencial e Paridade com `template/README.md.jinja`
- Alterações em cabeçalhos `governanca:inicio` ou templates versionados devem manter sincronia exata com a versão em `package.json`.
- Sempre que adicionar novo documento em `template/docs/`, skill em `template/.agents/skills/` ou regra em `template/.agents/rules/`, atualize `template/AGENTS.md` e `template/README.md.jinja` para manter verde o teste de integridade referencial bidirecional em `tests/template-docs.test.mjs`.
- Da mesma forma, toda alteração estrutural de pastas/arquivos principais desta matriz deve atualizar `docs/arquitetura.md` (§5 Mapa Físico de Módulos).
