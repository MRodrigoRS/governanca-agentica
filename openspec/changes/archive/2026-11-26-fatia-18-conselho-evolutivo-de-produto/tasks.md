# Tarefas: Conselho Evolutivo de Produto (`fatia-18-conselho-evolutivo-de-produto`)

- [x] 1. Test-First (Vermelho): criar `tests/explorar-produto-skill.test.mjs` validando ausência de `Onda 1`/`Onda 2`/blocos pré-fabricados, presença dos 3 especialistas (`Produto & Mercado`, `Arquiteto Evolutivo`, `UX & Jornada`), contrato conciso, 4 Quadrantes, 4 Saídas Oficiais, alias `/evoluir`, seção de refatorações em `radar-oportunidades.md.jinja`, separação no Artigo 8 da Constituição e sincronia `v4.4.0` — e comprovar falha inicial.
- [x] 2. Reescrever `template/.agents/skills/explorar-produto/SKILL.md` (≤ 150 linhas) com o protocolo completo do Conselho Evolutivo alinhado a `v4.3.0` e `tests/template-docs.test.mjs`.
- [x] 3. Atualizar `template/openspec/radar-oportunidades.md.jinja` adicionando seção dedicada a **Evoluções e Refatorações Estruturais Estacionadas**.
- [x] 4. Atualizar `template/constitution.md` (`v4.4.0` + Artigo 8 diferenciando `/explorar`/`/evoluir` divergente do `/fatiar` convergente), `template/AGENTS.md` (`v4.4.0` + `/evoluir` + Conselho), `AGENTS.md` (raiz), `template/openspec/project.md.jinja` (`v4.4.0`) e `catalogo-stacks.md` (`v4.4.0`).
- [x] 5. Atualizar `package.json` (`4.4.0`), `00_INDICE_E_DECISOES.md` (`D46`), `CHANGELOG.md` e ajustar `tests/comandos-e-handoff.test.mjs` / `tests/auditar-matriz-requisitos.test.mjs` para compatibilidade SemVer e remoção de âncoras pré-fabricadas em `explorar-produto`.
- [x] 6. Executar `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs --staged` comprovando 100% de aprovação.

## Notas de Sessão
- **Decisões fora do plano:** `copier.yml` não armazena string de versão SemVer diretamente (versão reside em `package.json`, cabeçalhos `governanca:inicio` e `project.md.jinja`); atualização das asserções legadas em `tests/comandos-e-handoff.test.mjs` (que ainda cobravam as 4 âncoras de bloco pré-fabricado dentro de `explorar-produto`) e `tests/auditar-matriz-requisitos.test.mjs` (`4.3.0` fixo).
- **Bloqueios abertos:** nenhum; pronto para Gate 2.
- **Próximo passo:** aguardar aprovação humana no Gate 2 para arquivar, commitar e criar tag `v4.4.0`.

## Roteiro de Validação Prática
1. Executar `npm test` na raiz da matriz e confirmar aprovação verde de `tests/explorar-produto-skill.test.mjs` e de todas as suítes existentes (incluindo `template-docs.test.mjs` e `copier-e2e`).
2. Abrir `template/.agents/skills/explorar-produto/SKILL.md` e `template/AGENTS.md` verificando a presença de `/explorar`, `/evoluir`, dos 3 especialistas *read-only*, dos 4 Quadrantes e das 4 Saídas Oficiais sem blocos pré-fabricados no roadmap.
3. Abrir `template/openspec/radar-oportunidades.md.jinja` confirmando a nova seção de evoluções e refatorações estruturais estacionadas.
