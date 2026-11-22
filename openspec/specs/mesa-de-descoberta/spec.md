# mesa-de-descoberta Specification

## Purpose

TBD - created by archiving change fatia-14-mesa-de-descoberta-e-livro-de-conhecimento. Update Purpose after archive.

## Requirements

### Requirement: Skill Universal de Mesa de Descoberta Continua e Multi-Especialista
O template da governança DEVE incluir a skill `template/.agents/skills/mesa-de-descoberta/SKILL.md` (acionável por `/descobrir` e `/mesa`) para conduzir sessões contínuas de perguntas e reflexão estratégica com congelamento estrito de código, alternância explícita de lentes especialistas (`[Produto]`, `[Arquitetura]`, `[Dados & Escala]`, `[Segurança]`, `[UX]`, `[Negócio]`) e painel sob demanda de subagentes *read-only* em paralelo.

#### Scenario: Ativacao e ciclo continuo multi-especialista sem edicao de codigo
- **GIVEN** a skill `template/.agents/skills/mesa-de-descoberta/SKILL.md`
- **WHEN** o usuário aciona `/descobrir` ou `/mesa` para aprofundar regras de negócio e arquitetura de um produto
- **THEN** a skill impõe congelamento estrito de código e proíbe abrir deltas em `openspec/changes/`
- **AND** conduz um loop contínuo de perguntas e aprofundamento sob lentes especialistas explícitas, com opção de painel paralelo *read-only* para temas densos
- **AND** utiliza `docs/conhecimento/INDICE.md` para retomar fios em aberto entre sessões sem depender da memória do chat

### Requirement: Cristalizacao Autorizada em Capitulos e Ponte Opcional para o Roadmap
A skill `mesa-de-descoberta` DEVE exigir permissão explícita humana antes de extrair cada conclusão em capítulo `.md` separado sob `docs/conhecimento/` com frontmatter YAML estruturado (`id`, `tema`, `especialidade`, `status`, `relacionados`) e links relativos Markdown compatíveis com NotebookLM, Obsidian e Mermaid, mantendo separação de Fonte Única em relação a `openspec/specs/` e oferecendo ponte opcional para `openspec/roadmap.md`.

#### Scenario: Gravacao de capitulo com autorizacao e promocao estruturada para roadmap
- **GIVEN** uma conclusão consolidada durante a mesa de descoberta
- **WHEN** o agente propõe registrar um capítulo em `docs/conhecimento/` ou promover descobertas para execução
- **THEN** a gravação em `docs/conhecimento/<NN>-<slug>.md` e a atualização de `docs/conhecimento/INDICE.md` dependem de permissão explícita do usuário
- **AND** o capítulo segue o molde com frontmatter YAML (`id`, `tema`, `especialidade`, `status`, `relacionados`) e links relativos Markdown
- **AND** eventual promoção ao roadmap gera blocos em `openspec/roadmap.md` com as 4 âncoras obrigatórias (`Depende de:`, `Objetivo de Valor:`, `O que ENTRA:`, `O que FICA DE FORA:`) mantendo `docs/conhecimento/` como camada *upstream* distinta de `openspec/specs/`

### Requirement: Ativacao Automatica em Greenfield e Trava Anti-Alucinacao no Gate 0
Ao detectar repositório Greenfield (ausência de produto ou stack definidos), `template/AGENTS.md` e `template/.agents/skills/inicializar-stack/SKILL.md` DEVEM ativar automaticamente `.agents/skills/mesa-de-descoberta/SKILL.md` para conduzir entrevista contínua sem teto artificial de 3 rodadas, propor cristalização autorizada de temas em `docs/conhecimento/<NN>-<slug>.md` e exigir leitura física obrigatória de `docs/conhecimento/INDICE.md` e capítulos consolidados antes de gerar `openspec/roadmap.md` e `openspec/project.md`.

#### Scenario: Entrevista Greenfield profunda com leitura fisica obrigatoria antes do roadmap
- **GIVEN** um repositório Greenfield sem produto nem stack definidos e os arquivos `template/AGENTS.md`, `template/.agents/skills/inicializar-stack/SKILL.md` e `template/.agents/skills/mesa-de-descoberta/SKILL.md`
- **WHEN** o agente inicia a entrevista de fundação do sistema
- **THEN** `mesa-de-descoberta` é ativada automaticamente em conjunto com `inicializar-stack` por meio de eixos progressivos sem limite artificial de rodadas
- **AND** temas consolidados durante a entrevista são gravados (somente com permissão explícita) em `docs/conhecimento/<NN>-<slug>.md` com atualização de `docs/conhecimento/INDICE.md`
- **AND** antes de gerar `openspec/roadmap.md` e `openspec/project.md` no Passo 2, o agente realiza leitura física obrigatória dos capítulos consolidados para evitar esquecimento e alucinação

### Requirement: Indice do Livro, Protecao Copier, Integridade Referencial e CI
O repositório matriz DEVE fornecer `template/docs/conhecimento/INDICE.md`, protegê-lo contra sobrescrita via `_skip_if_exists` (`docs/conhecimento/**`) no `copier.yml`, registrar skill/comandos/índice em `template/AGENTS.md`, `template/README.md.jinja` e `AGENTS.md`, e verificar sua distribuição no job Copier do `.github/workflows/ci.yml`.

#### Scenario: Distribuicao segura via Copier e consistencia bidirecional do template
- **GIVEN** `copier.yml`, `template/docs/conhecimento/INDICE.md`, `template/AGENTS.md`, `template/README.md.jinja`, `AGENTS.md` e `.github/workflows/ci.yml`
- **WHEN** o template é copiado/atualizado pelo Copier e validado pela suíte de testes e pelo verificador da matriz
- **THEN** `copier.yml` preserva `docs/conhecimento/**` em `_skip_if_exists`
- **AND** `ehArquivoDeDocumentacaoOuGovernanca('docs/conhecimento/01-visao.md')` retorna `true` e `ehArquivoDeProducao('docs/conhecimento/01-visao.md')` retorna `false`
- **AND** todas as referências em `template/AGENTS.md`, `template/README.md.jinja` e `template/.agents/skills/` mantêm integridade bidirecional sem ponteiros quebrados
