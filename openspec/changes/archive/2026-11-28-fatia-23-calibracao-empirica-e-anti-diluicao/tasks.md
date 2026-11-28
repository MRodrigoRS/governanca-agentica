# Tarefas: Fatia 23 — Calibração Empírica e Anti-Diluição (v4.9.0)

- [x] 1. (Vermelho) Criar `tests/calibracao-empirica.test.mjs` cobrindo os novos cenários (listas em `catalogo-reuso.md`, filtro `ehPonteiroDeDisco` em `arquitetura.md §5`, calibração de `constitution.md`/regras/skills, `template/AGENTS.md` <= 130 linhas no bloco gerenciado, sinônimos em `auditar-openspec.mjs`, `.gitattributes` LF/CRLF e sincronia `v4.9.0`/`D51`) e ajustar asserções que mudam por decisão em `tests/hierarquia-e-maturidade.test.mjs` e `tests/hardening-producao.test.mjs`, comprovando falha antes da implementação.
- [x] 2. (Verde) Atualizar `template/scripts/lib/sensores-indices.mjs` e `template/scripts/lib/sensores-maturidade.mjs` com `extrairPonteirosMarkdown` (suporte a listas em `catalogo-reuso.md`) e `ehPonteiroDeDisco` em `docs/arquitetura.md §5`.
- [x] 3. (Verde) Atualizar `template/scripts/lib/auditar-openspec.mjs` ampliando os sinônimos PT-BR/EN de cabeçalhos em `proposal.md`, `design.md` e `tasks.md` preservando o bloqueio estrutural D18/D32.
- [x] 4. (Verde) Calibrar `template/constitution.md` (`Artigo 1.2`, `Artigo 2.7`, `Artigo 7.6`), `template/.agents/skills/ciclo-especificacao/SKILL.md`, `template/.agents/rules/web-ui-pwa.md.jinja` (§10) e `template/.agents/rules/backend-seguranca-dados.md.jinja` (§8) para projetos Fullstack/MVP e E2E real como Prova de Runtime.
- [x] 5. (Verde) Enxugar o bloco gerenciado de `template/AGENTS.md` para `<= 130` linhas mantendo todos os comandos `/` e âncoras de integridade referencial.
- [x] 6. (Verde) Criar `.gitattributes` na raiz da matriz e `template/.gitattributes` (fora de `_skip_if_exists`), atualizar `.github/workflows/ci.yml` e sincronizar `v4.9.0` + `D51` em `package.json`, `template/openspec/project.md.jinja`, `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md`, `00_INDICE_E_DECISOES.md`, `README.md`, `docs/arquitetura.md` (§5) e `CHANGELOG.md`.
- [x] 7. (Refatorar & Verificar) Executar `npm test`, `node --check`, `npx --yes @fission-ai/openspec validate --all --no-interactive`, `node template/scripts/verificar-governanca.mjs` e prova em runtime via `uvx copier copy` / `uvx copier update` em repositório temporário no Windows verificando 0 falsos positivos e 0 avisos CRLF.

## Roteiro de Validação Prática
1. Executar `npm test` e confirmar 100% dos testes aprovados, incluindo todos os casos de `tests/calibracao-empirica.test.mjs`.
2. Conferir que o bloco gerenciado em `template/AGENTS.md` (entre `<!-- governanca:inicio` e `<!-- governanca:fim -->`) possui `<= 130` linhas preservando todos os comandos `/`.
3. Em um projeto consumidor temporário no Windows com Git inicializado em uma versão anterior do template, aplicar `uvx copier update --defaults` apontando para o commit/workspace e rodar `node scripts/verificar-governanca.mjs --staged` em cenários com `catalogo-reuso.md` em lista e `arquitetura.md §5` com `v4.8.0`/`req.body`, observando zero falsos positivos e zero avisos `CRLF will be replaced by LF`.

## Notas de Sessão
- **Status:** Implementação e verificação completa concluídas; aguardando aprovação humana no Gate 2.
- **Evidências:** `npm test` 160/160 (14 suítes), `openspec validate` 22/22, bloco gerenciado de `template/AGENTS.md` com 66 linhas (`<= 130`), módulos ESM `<= 350` linhas úteis e prova real de `uvx copier update` de `v4.8.0` → `v4.9.0` no Windows com `0` avisos CRLF e `0` falsos positivos em `verificar-governanca.mjs --staged`.
- **Próximo passo:** Após autorização humana no Gate 2, executar fechamento atômico (`openspec archive fatia-23-calibracao-empirica-e-anti-diluicao -y`, marcar `[x]` em `openspec/roadmap.md`, `git add .` e `git commit`), e eventual `git push` + tag `v4.9.0` caso autorizado.
