# Proposta: Matriz de Rastreabilidade End-to-End (`v4.3.0`)

## Por que
Na versão `v4.2.0`, a governança audita com rigor cada fatia isolada (`openspec/roadmap.md`, `openspec/changes/`, `docs/catalogo-reuso.md`, `docs/arquitetura.md` e testes reais), mas não possui um índice tabular determinístico ligando cada requisito do Livro de Conhecimento (`docs/conhecimento/`) até sua prova real de implementação e teste. Após múltiplas sessões e `/compact`, detalhes finos distribuídos nos capítulos correm o risco de cair no esquecimento entre fatias.

## O que muda
- Criação de `template/openspec/matriz-requisitos.md.jinja` protegido por `_skip_if_exists` no `copier.yml`.
- Criação do módulo ESM zero-dependências `template/scripts/lib/auditar-matriz-requisitos.mjs` (≤ 350 linhas úteis), integrado de forma 100% *opt-in* em `template/scripts/verificar-governanca.mjs` respeitando a catraca anti-monólito.
- Emissão de telemetria de 1 linha (`[MATRIZ REQUISITOS] Total: ...`) no `session-start` de `template/scripts/hook-agente.mjs`.
- Atualização da Constituição (`Artigo 12.6`), `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, das 6 skills (`sintetizar-conhecimento`, `planejar-proxima-fatia`, `ciclo-especificacao`, `refinar-ideia`, `mesa-de-descoberta`, `revisar-fatia`), índices da matriz (`docs/arquitetura.md`, `00_INDICE_E_DECISOES.md` `D45`, `CHANGELOG.md`, `package.json` `4.3.0`, CI e `lefthook.yml`) e suíte Test-First com 10 cenários em `tests/auditar-matriz-requisitos.test.mjs`.

## Fica de Fora
- Adição de dependências externas de `npm` nos scripts da governança.
- Duplicação de prosa longa do livro dentro de `openspec/matriz-requisitos.md`.
- Quebra de retrocompatibilidade em repositórios consumidores v4.0–v4.2 que ainda não utilizam `openspec/matriz-requisitos.md`.
- Execução de `copier update` ou migração em repositórios consumidores externos (ex.: Orvix).
