# Proposta — Fatia 14: Mesa de Descoberta Contínua e Livro de Conhecimento

## Por que
A Governança v4 já dispõe de `explorar-produto` (`/explorar`, voltado a reuniões pontuais que convergem rapidamente em 3 gavetas) e `refinar-ideia` (`/refinar` / `/grill-me`, focado em podar e encaixar uma ideia isolada no roadmap), além de `openspec/radar-oportunidades.md` e `docs/adr/`. Contudo, falta uma camada *upstream* de descoberta profunda e contínua para sistemas complexos onde o usuário e o agente queiram debater livremente em sessões longas (ou multi-sessão) sob diferentes lentes especialistas, cristalizando conclusões, regras de negócio, reflexões e conexões em um livro vivo de capítulos `.md` separado de `openspec/specs/` — útil tanto para construir mega-planos quanto para alimentar ferramentas externas de síntese (NotebookLM, grafos no Obsidian e diagramas Mermaid).

## O que muda
1. **Nova Skill Universal `template/.agents/skills/mesa-de-descoberta/SKILL.md` (`/descobrir` e `/mesa`):**
   - Dois gatilhos oficiais: **Gatilho Automático** em repositórios Greenfield (ausência de produto/stack) integrado a `inicializar-stack`, e **Gatilho Manual** (`/descobrir` ou `/mesa`) a qualquer momento.
   - Modo de descoberta contínua com **congelamento estrito de código** (proibido alterar código de produção, schemas ou abrir `openspec/changes/`).
   - Separação explícita de Fonte Única: `docs/conhecimento/` é base estratégica e analítica *upstream*, não concorrendo com `openspec/specs/` nem `openspec/roadmap.md`.
   - Continuidade multi-sessão anti-Context Rot guiada por `docs/conhecimento/INDICE.md` (sumário + seção de *Fios em Aberto / Próximas Perguntas*).
   - Modelo híbrido de especialistas: alternância explícita de lentes (`[Produto]`, `[Arquitetura]`, `[Dados & Escala]`, `[Segurança]`, `[UX]`, `[Negócio]`) no turno regular e painel sob demanda com subagentes *read-only* em paralelo para temas densos ou impasses.
   - Cristalização incremental **somente mediante permissão explícita humana**, gravando capítulos em `docs/conhecimento/<NN>-<slug>.md` com frontmatter YAML (`id`, `tema`, `especialidade`, `status`, `relacionados`) e links relativos Markdown.
   - Ponte opcional de promoção para `openspec/roadmap.md` utilizando as 4 âncoras obrigatórias v4 (`Depende de:`, `Objetivo de Valor:`, `O que ENTRA:`, `O que FICA DE FORA:`).
2. **Entrevista Profunda e Trava Anti-Amnésia no Greenfield (`template/AGENTS.md` + `inicializar-stack/SKILL.md`):**
   - `Repositório Greenfield` aciona automaticamente `mesa-de-descoberta` + `inicializar-stack` quando há ausência de produto/stack, substituindo o teto implícito de 3 rodadas por **eixos progressivos** contínuos.
   - Durante a entrevista, temas consolidados são extraídos (com permissão humana) para `docs/conhecimento/<NN>-<slug>.md`, e antes de elaborar `openspec/project.md` e `openspec/roadmap.md` no Passo 2, o agente é obrigado a fazer **leitura física** de `docs/conhecimento/INDICE.md` e de todos os capítulos gravados — proibindo lembrar de cabeça para eliminar esquecimento e alucinação.
3. **Estrutura Inicial `template/docs/conhecimento/INDICE.md` & Proteção Copier:**
   - Índice mestre versionado no template e protegido em `copier.yml` (`_skip_if_exists` com `"docs/conhecimento/**"`), contendo Sumário de Capítulos, Grafo de Relações Mermaid, Fios em Aberto e Guia de Síntese Externa (NotebookLM / Obsidian).
4. **Integridade Referencial, CI e Memória da Matriz:**
   - Registro dos comandos `/descobrir` e `/mesa`, da skill `mesa-de-descoberta` e de `docs/conhecimento/INDICE.md` em `template/AGENTS.md`, `template/README.md.jinja` e `AGENTS.md` (raiz).
   - Validação dos novos arquivos no job Copier de `.github/workflows/ci.yml`.
   - Registro da Decisão `D42` em `00_INDICE_E_DECISOES.md`, entrada em `CHANGELOG.md` e suíte `tests/mesa-de-descoberta.test.mjs`.

## Fica de Fora
- Fusão destrutiva ou alteração do comportamento existente de `explorar-produto` (`/explorar`) e `refinar-ideia` (`/refinar`).
- Criação de servidor MCP externo de grafos, geradores de PDF ou novos sensores em `template/scripts/verificar-governanca.mjs`.
- Alterações na lógica de `template/scripts/lib/classificar-arquivos.mjs` (já classifica `docs/` como documentação/governança).
