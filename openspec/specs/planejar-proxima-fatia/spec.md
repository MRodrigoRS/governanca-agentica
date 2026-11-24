# planejar-proxima-fatia Specification

## Purpose

TBD - created by archiving change fatia-16-fatiamento-cirurgico-just-in-time. Update Purpose after archive.

## Requirements

### Requirement: Skill Universal de Fatiamento Cirurgico Just-in-Time
O template da governança DEVE prover a skill `template/.agents/skills/planejar-proxima-fatia/SKILL.md` (acionável por `/fatiar` e `/planejar-fatia`, além de acionamento automático via `/proxima-fatia` com fila vazia e após o Gate 2), com congelamento estrito de código, delegação a subagente *read-only* (`Fatiador Cirúrgico`) ou leitura física equivalente em CLIs sem subagentes, leitura conjunta da documentação (`docs/conhecimento/`, `openspec/`, `docs/arquitetura.md`, `docs/particularidades.md`, `docs/aprendizados.md`) e do código real existente, critérios decisórios anti-miopia, saída estruturada e alinhamento curto `grill-me` (`➡️`) antes de gravar a próxima fatia em `openspec/roadmap.md`.

#### Scenario: Descoberta e gravacao da proxima fatia cirurgica com leitura conjunta de livro e codigo real
- **GIVEN** um projeto com `openspec/roadmap.md` estruturado com Invariantes Globais, Mapa Macro de Capacidades e nenhuma fatia `[ ] Pendente` na Fila Executável
- **WHEN** o usuário aciona `/fatiar` ou `/proxima-fatia` (ou conclui uma fatia no Gate 2)
- **THEN** o agente mantém congelamento estrito de código sem editar produção nem abrir delta em `openspec/changes/`
- **AND** delega ao subagente *read-only* `Fatiador Cirúrgico` (ou executa leitura física direta em CLIs sem subagentes) para inspecionar livro/specs e código/schema/rotas/testes reais
- **AND** apresenta o parecer factual, justificativa, ambiguidades e rascunho com as 4 âncoras obrigatórias mais `Entidades/Contratos Tocados` via `grill-me` (`➡️`) antes de gravar apenas o próximo bloco `### [ ] fatia-XX-<slug>` e atualizar o status no Mapa Macro de Capacidades

### Requirement: Roadmap Hibrido em 3 Camadas e Integracao nas Skills e Constituicao
O template `template/openspec/roadmap.md.jinja` DEVE estruturar o planejamento em 3 camadas (`## 1. Invariantes Globais do Gate 0`, `## 2. Mapa Macro de Capacidades` e `## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)`) trazendo apenas `### [ ] fatia-01-fundacao`, e as skills `inicializar-stack`, `sintetizar-conhecimento`, `mesa-de-descoberta` e `ciclo-especificacao`, bem como `template/constitution.md` (Artigo 8.2 e 8.3), DEVEM operar nesse modelo híbrido sem pré-fabricar blocos `fatia-02`..`fatia-N`.

#### Scenario: Inicializacao Gate 0 e fluxo de skills sem fatiamento antecipado e com retrocompatibilidade
- **GIVEN** os arquivos `template/openspec/roadmap.md.jinja`, `template/constitution.md` e as skills `inicializar-stack`, `sintetizar-conhecimento`, `mesa-de-descoberta` e `ciclo-especificacao`
- **WHEN** um novo projeto passa pelo Gate 0 ou um projeto legado executa `template/scripts/verificar-governanca.mjs --staged`
- **THEN** `template/openspec/roadmap.md.jinja` apresenta as 3 camadas com apenas `### [ ] fatia-01-fundacao`
- **AND** `verificar-governanca.mjs` aprova tanto roadmaps no novo formato em 3 camadas quanto roadmaps legados multi-fatias sem regressão

### Requirement: Sincronia de Indices, SemVer 4.2.0, CI e Registro de Decisao D44
Os arquivos `AGENTS.md`, `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, `.github/workflows/ci.yml`, `package.json`, `CHANGELOG.md`, `README.md` e `00_INDICE_E_DECISOES.md` DEVEM registrar `planejar-proxima-fatia`, `/fatiar`, a versão `4.2.0` e a Decisão `D44` com 100% de integridade referencial.

#### Scenario: Validacao referencial, SemVer e empacotamento Copier na v4.2.0
- **GIVEN** os índices da raiz e do template, os cabeçalhos `governanca:inicio`, `package.json`, `CHANGELOG.md`, `.github/workflows/ci.yml` e `00_INDICE_E_DECISOES.md`
- **WHEN** a suíte de testes completa (`npm test`) é executada
- **THEN** todos os cabeçalhos versionados, `package.json` e `CHANGELOG.md` estão sincronizados em `4.2.0`
- **AND** a checagem Copier no CI valida `.agents/skills/planejar-proxima-fatia/SKILL.md` e a integridade referencial bidirecional passa sem ponteiros quebrados
