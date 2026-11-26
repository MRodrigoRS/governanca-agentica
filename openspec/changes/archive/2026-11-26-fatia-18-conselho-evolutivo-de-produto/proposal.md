# Proposta: Conselho Evolutivo de Produto (`v4.4.0`)

## Por que
A skill `explorar-produto` (`/explorar`) ainda referencia o modelo antigo de ondas pré-fabricadas (*Onda 1 / Onda 2*) em `openspec/roadmap.md`, ignora `docs/conhecimento/` e `openspec/matriz-requisitos.md` (`v4.3.0`), e opera em uma única passada superficial sem analisar o código já entregue para propor refatorações estruturais ou melhorias de jornada.

## O que muda
- Reescrita de `template/.agents/skills/explorar-produto/SKILL.md` (≤ 150 linhas) como **Conselho Evolutivo de 3 Subagentes Especialistas (*read-only* em paralelo)** (`Produto & Mercado`, `Arquiteto Evolutivo`, `UX & Jornada`, com fallback sequencial em CLIs), Síntese em 4 Quadrantes (teto de 8–10 propostas com `[fonte]`) e 4 Saídas Oficiais alinhadas ao *Rolling Wave*, Livro e `openspec/matriz-requisitos.md`.
- Inclusão da seção de **Evoluções e Refatorações Estruturais Estacionadas** em `template/openspec/radar-oportunidades.md.jinja`.
- Atualização de `template/AGENTS.md` (alias `/evoluir`), `AGENTS.md` (raiz), `template/constitution.md` (fronteira no Artigo 8 entre modo divergente sob demanda e `/fatiar` convergente), `template/openspec/project.md.jinja`, `catalogo-stacks.md`, `package.json` (`4.4.0`), `00_INDICE_E_DECISOES.md` (`D46`), `CHANGELOG.md` e suíte `tests/explorar-produto-skill.test.mjs`.

## Fica de Fora
- Disparo automático de `/explorar` ou `/evoluir` durante `/fatiar`, `ciclo-especificacao` ou `Gate 2`.
- Criação de uma 14ª skill paralela à `explorar-produto`.
- Pré-fabricação de blocos `fatia-XX` diretamente em `openspec/roadmap.md` §3 pelo Conselho.
- Alterações em scripts determinísticos de `template/scripts/`.
