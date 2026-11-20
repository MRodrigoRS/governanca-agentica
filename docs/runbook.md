# Runbook Operacional — Repositório Matriz (`governança-de-agentes`)

> **Papel:** Procedimentos reais de verificação local, simulação de geração Copier, ritual de release SemVer/tags e rollback seguro da matriz.
> **Referência Complementar:** Veja também os passos de release em [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## 1. Publicação e Release (Git Tags SemVer + Copier)

A distribuição oficial ocorre diretamente via repositório Git consumido por `uvx copier copy gh:MRodrigoRS/governan-a-de-agentes-v2 .` e `uvx copier update` usando tags SemVer anotadas (`vX.Y.Z`):

1. Garantir sincronia exata de versão entre `package.json`, `template/AGENTS.md` (`governanca:inicio vX.Y.Z`), `template/constitution.md` (`governanca:inicio vX.Y.Z`), `template/openspec/project.md.jinja` e seção aberta no `CHANGELOG.md`.
2. Após aprovação humana explícita no Gate 2, criar o commit e a tag anotada:
   ```bash
   git tag -a vX.Y.Z -m "release: Governanca vX.Y.Z"
   git push origin main
   git push --tags
   ```
   *(Nota: `hook-agente.mjs` exige `force_ask` humano em `git commit`, `git tag` e `git push`).*

---

## 2. Verificação Local e Pós-Release (*Smoke Check*)

Execute toda a bateria abaixo antes de publicar uma tag ou abrir PR:

1. **Checagem de sintaxe dos scripts e libs ESM:**
   ```bash
   node --check template/scripts/verificar-governanca.mjs
   node --check template/scripts/validar-commit-msg.mjs
   node --check template/scripts/hook-agente.mjs
   node --check template/scripts/lib/classificar-arquivos.mjs
   node --check template/scripts/lib/classificar-cerimonia.mjs
   ```
2. **Suíte unitária e de integridade completa:**
   ```bash
   npm test
   ```
3. **Validação OpenSpec e auditoria determinística:**
   ```bash
   npx --yes @fission-ai/openspec validate --all --no-interactive
   node template/scripts/verificar-governanca.mjs --ci
   ```
4. **Smoke Check físico do scaffolding Copier em pasta temporária:**
   ```bash
   uvx copier copy --defaults . /tmp/teste-governanca
   ```
   Confirmar existência de `AGENTS.md`, `constitution.md`, `docs/arquitetura.md`, `docs/runbook.md`, `.agents/hooks.json`, `.agents/skills/` e ausência de wrappers proprietários.

---

## 3. Migrações de Formato Copier e Rollback Seguro

- **Evolução de Templates sem Quebra:** Sempre proteja arquivos personalizados pelos consumidores na lista `_skip_if_exists` do `copier.yml` e preserve blocos delimitados `governanca:inicio` / `governanca:fim` em `template/AGENTS.md` e `template/constitution.md`.
- **Rollback de Release Defeituosa:** Caso uma tag publicada quebre `uvx copier update` em consumidores, faça `git revert <commit>` na `main`, corrija o teste e publique imediatamente um bump `PATCH` (`vX.Y.(Z+1)`), evitando deletar ou sobrescrever tags já consumidas remotamente.

---

## 4. Diagnóstico de Hooks, CI e Logs

- **Hook de Agente (`.agents/hooks.json`):** Para depurar localmente no terminal a partir da raiz, teste diretamente a entrada JSON por stdin com `cwd` em `.agents/` (`node ../template/scripts/hook-agente.mjs session-start`).
- **Lefthook Local (`lefthook.yml`):** Se o commit for recusado localmente, verifique se há deltas pendentes em `openspec/changes/`, se `CHANGELOG.md` foi staged junto de código de produção e se a catraca em `verificar-governanca.mjs` não foi violada.
- **GitHub Actions (`.github/workflows/ci.yml`):** Acompanhamento via `gh run list` / `gh run watch`; requer `fetch-depth: 2` para que `verificar-governanca.mjs --ci` compare `HEAD~1..HEAD`.

---

## 5. Checklist de Pré-Release (Go-Live)

- [ ] `npm test` verde com 100% dos testes passando (zero `.only(`, zero pulados)
- [ ] `npx --yes @fission-ai/openspec validate --all --no-interactive` aprovado com código `0`
- [ ] `node template/scripts/verificar-governanca.mjs` (staged) e `--ci` aprovados com código `0`
- [ ] `uvx copier copy --defaults . <temp>` validado sem erros de renderização Jinja2
- [ ] `CHANGELOG.md`, `package.json`, `00_INDICE_E_DECISOES.md` e cabeçalhos `vX.Y.Z` sincronizados
