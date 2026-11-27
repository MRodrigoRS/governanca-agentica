# Tarefas — Fatia 20: Depuração Sistemática (`/debug`) e Prova de Runtime Pré-Gate 2 (v4.6.0)

## Fase 1 — Testes Primeiro (Vermelho)
- [x] **1.1 [Vermelho]** Criar `tests/depuracao-e-prova-runtime.test.mjs` validando a nova skill `depuracao-sistematica`, Artigos 2.7/8.6/9 em `constitution.md`, sincronia em `AGENTS.md`/`README.md.jinja`/`ciclo-especificacao`/`revisar-fatia`/`pull_request_template.md`, check no CI Copier e SemVer `4.6.0`.
- [x] **1.2 [Vermelho]** Executar `node --test tests/depuracao-e-prova-runtime.test.mjs` e capturar a falha legítima (Vermelho).

## Fase 2 — Implementação e Sincronia (Verde)
- [x] **2.1 [Verde]** Criar `template/.agents/skills/depuracao-sistematica/SKILL.md` (`<= 140` linhas).
- [x] **2.2 [Verde]** Atualizar `template/constitution.md` (cabeçalho `v4.6.0`, Artigo 2.7, Artigo 8.6 e Artigo 9).
- [x] **2.3 [Verde]** Atualizar `template/AGENTS.md`, `AGENTS.md` (raiz), `template/README.md.jinja`, `template/.agents/skills/ciclo-especificacao/SKILL.md`, `template/.agents/skills/revisar-fatia/SKILL.md` e `template/.github/pull_request_template.md`.
- [x] **2.4 [Verde]** Atualizar `package.json`, `template/openspec/project.md.jinja`, `catalogo-stacks.md`, `.github/workflows/ci.yml`, `README.md`, `00_INDICE_E_DECISOES.md` (`D48`), `CHANGELOG.md` e flexibilizar asserções SemVer (`4.[5-9].\d+`) em `tests/blindagem-motor-e-agregador.test.mjs`.

## Fase 3 — Refatoração e Validação Completa
- [x] **3.1 [Refatorar]** Conferir concisão de `depuracao-sistematica/SKILL.md`, integridade referencial bidirecional (`template-docs.test.mjs` + `autogovernanca-dogfooding.test.mjs`) e ausência de referências legadas.
- [x] **3.2 [Validar]** Executar `npm test` (144/144 verdes), `npx --yes @fission-ai/openspec validate --all --no-interactive` e Prova de Runtime CLI (`uvx copier copy --defaults`).

## Roteiro de Validação Prática
1. **Conferir integridade da suíte completa (incluindo Copier E2E e integridade referencial):**
   ```powershell
   npm test; if ($?) { npx --yes @fission-ai/openspec validate --all --no-interactive }
   ```
   - **Esperado:** `144` testes passando (`0` falhas) e `19 passed, 0 failed` no OpenSpec.
2. **Conferir geração real no Copier (Prova de Runtime CLI):** confirmar que o projeto copiado contém `.agents/skills/depuracao-sistematica/SKILL.md` e `AGENTS.md` atualizado com `/debug`.

## Notas de Sessão
- **Decisões fora do plano:** Aprovado gatilho duplo de `/debug` (manual + automático na 2ª falha seguida), matriz por perfil na Prova de Runtime com Honestidade Radical, contrato normativo sem quebra retroativa e criação/conclusão no Linear apenas no fechamento do Gate 2.
- **Bloqueios atuais:** Nenhum.
- **Próximo passo:** Apresentar `entrega-fatia-20.md` no Gate 2 e aguardar aprovação humana explícita para fechamento atômico (`openspec archive` → `[x]` em `roadmap.md` → `git add` → `git commit` + registro/conclusão no Linear).
