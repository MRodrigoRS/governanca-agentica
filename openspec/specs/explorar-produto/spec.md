# explorar-produto Specification

## Purpose

TBD - created by archiving change fatia-18-conselho-evolutivo-de-produto. Update Purpose after archive.

## Requirements

### Requirement: Conselho Evolutivo de 3 Especialistas Read-Only em `explorar-produto`
A skill `template/.agents/skills/explorar-produto/SKILL.md` MUST operar em modo divergente estritamente sob demanda (`/explorar` ou `/evoluir`) com congelamento de código, convocando 3 especialistas *read-only* em paralelo (`Produto & Mercado` com pesquisa web viva, `Arquiteto Evolutivo` analisando código real/specs/matriz e `UX & Jornada`), limitados a ≤ 25 linhas e ≤ 3 achados com `[fonte]` cada, além de fallback sequencial para CLIs sem subagentes.

#### Scenario: Painel paralelo com contrato conciso e síntese em 4 quadrantes
- GIVEN a skill `explorar-produto` acionada por `/explorar` ou `/evoluir`
- WHEN os 3 especialistas retornam seus achados factuais
- THEN o agente principal consolida no máximo 8 a 10 propostas nos 4 Quadrantes (`Ouro Barato`, `Repensar & Refatorar o Existente`, `Saltos de Produto`, `Armadilhas & Cortes Recomendados`) emitindo `exploracao-produto-YYYY-MM-DD.md` em harnesses com artefatos.

### Requirement: 4 Saídas Oficiais Compatíveis com Rolling Wave e Matriz `v4.3.0`
A skill `explorar-produto` MUST eliminar referências a `Onda 1` / `Onda 2` e blocos pré-fabricados em `openspec/roadmap.md`, encaminhando decisões exclusivamente para: novo capítulo em `docs/conhecimento/` (com permissão humana), `Mapa Macro de Capacidades` + `openspec/matriz-requisitos.md` (ou `refinar-ideia` / `Via 1.5`), `openspec/radar-oportunidades.md` (incluindo refatorações estacionadas) ou *Fora de Escopo* em `openspec/project.md`.

#### Scenario: Sincronia com AGENTS.md, Constituição e Radar de Oportunidades
- GIVEN a entrega da versão `4.4.0` no template Copier
- WHEN os testes automatizados e o verificador de integridade referencial executam
- THEN `template/AGENTS.md` registra `/explorar` e `/evoluir`, `template/constitution.md` separa modo divergente do `/fatiar`, `template/openspec/radar-oportunidades.md.jinja` contempla refatorações estruturais e `copier copy` preserva todos os artefatos intactos.
