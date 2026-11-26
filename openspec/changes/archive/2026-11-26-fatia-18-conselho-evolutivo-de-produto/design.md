# Design Técnico: Conselho Evolutivo de Produto (`v4.4.0`)

## Contratos, Dados e Schemas
- **Skill `template/.agents/skills/explorar-produto/SKILL.md` (≤ 150 linhas):**
  - Mantém estritamente `name: explorar-produto`, gatilhos `/explorar` e `/evoluir` e **Congelamento Estrito de Código**.
  - **Passo 1 — Leitura de Orientação + Painel de 3 Subagentes *Read-Only*:**
    1. `Produto & Mercado`: `openspec/project.md`, `docs/conhecimento/INDICE.md`, `openspec/radar-oportunidades.md` + pesquisa web viva obrigatória.
    2. `Arquiteto Evolutivo`: código real (`src/`, `tests/`), `docs/arquitetura.md`, `docs/catalogo-reuso.md`, `docs/aprendizados.md`, `openspec/specs/` e `openspec/matriz-requisitos.md` (buscando *Ouro Barato* e *Repensar & Refatorar o Existente*).
    3. `UX & Jornada`: rotas/componentes de interface (`src/app/`, `src/components/`), textos de UX, estados vazios/erro e atrito de funil.
  - **Contrato por Especialista:** máximo 25 linhas úteis, máximo 3 achados, exigindo Impacto/Esforço, `[fonte]` concreta e por que vale agora ou na V2. Fallback sequencial em CLIs sem subagentes.
  - **Passo 2 — Síntese Crítica em 4 Quadrantes (máx. 8–10 propostas):** `1. Ouro Barato`, `2. Repensar & Refatorar o Existente`, `3. Saltos de Produto`, `4. Armadilhas & Cortes Recomendados`, com recomendação (`➡️ Aprovar agora` | `➡️ Gerar capítulo no Livro` | `➡️ Estacionar na V2` | `➡️ Cortar`) e artefato `exploracao-produto-YYYY-MM-DD.md` (`UserFacing: true, RequestFeedback: false`) mantendo o chat ≤ 20 linhas.
  - **Passo 3 — As 4 Saídas Oficiais:**
    1. Novo capítulo `docs/conhecimento/<NN>-<slug>.md` + `docs/conhecimento/INDICE.md` (com permissão humana explícita).
    2. `openspec/roadmap.md` (§2 Mapa Macro) + `openspec/matriz-requisitos.md` (`REQ-XX`), ou encaminhamento para `refinar-ideia` / `Via 1.5` sem pré-fabricar `fatia-XX` na §3.
    3. `openspec/radar-oportunidades.md` (V2 + refatorações estacionadas + histórico datado).
    4. `openspec/project.md` (*Fora de Escopo*).
  - **Passo 4 — Validação Pós-Sessão:** executar `node scripts/verificar-governanca.mjs` se `openspec/roadmap.md` ou `openspec/matriz-requisitos.md` forem modificados.
- **Compatibilidade Referencial:** Todos os caminhos estáticos citados na skill existem em `template/` (ou usam `<...>` / `openspec/changes/`) para manter verde `tests/template-docs.test.mjs`.

## Interface e Estados Assíncronos
Não se aplica: evolução exclusiva de skills, documentação normativa e testes unitários em perfil `cli-biblioteca`.

## Regras de Negócio e Segurança
- **Zero Dependências Externas & PT-BR (Artigo 10):** Testes em `node:test` nativo (`tests/explorar-produto-skill.test.mjs`), mantendo sincronia SemVer `4.4.0` em `package.json`, `template/constitution.md`, `template/AGENTS.md`, `template/openspec/project.md.jinja`, `catalogo-stacks.md`, `00_INDICE_E_DECISOES.md` (`D46`) e `CHANGELOG.md`, além de atualizar asserções legadas em `tests/comandos-e-handoff.test.mjs` e `tests/auditar-matriz-requisitos.test.mjs`.
- **Fontes Consultadas:** Leitura física de `template/.agents/skills/explorar-produto/SKILL.md`, `template/openspec/radar-oportunidades.md.jinja`, `template/constitution.md`, `tests/comandos-e-handoff.test.mjs` e `tests/template-docs.test.mjs`.
