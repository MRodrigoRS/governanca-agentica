## ADDED Requirements

### Requirement: Skill Universal de Sintese em Escala Map-Reduce Anti-Alucinacao
O template da governança DEVE incluir a skill `template/.agents/skills/sintetizar-conhecimento/SKILL.md` (acionável por `/sintetizar`) com congelamento estrito de código, triagem de volume (`≤ 8` capítulos por leitura direta vs. `> 8` arquivos ou materiais externos por extração **Map-Reduce** com subagentes *read-only* em paralelo), detector de contradições *cross-arquivos* com parada humana, rastreabilidade obrigatória de fontes com seção de **Lacunas / Decisões Pendentes** e destilação em 2 camadas para `openspec/roadmap.md`.

#### Scenario: Sintese Map-Reduce de corpus volumoso com deteccao de contradicoes e rastreabilidade
- **GIVEN** a skill `template/.agents/skills/sintetizar-conhecimento/SKILL.md` e um corpus em `docs/conhecimento/` com mais de 8 arquivos ou materiais em `docs/conhecimento/materiais/`
- **WHEN** o usuário ou outra skill aciona `/sintetizar`
- **THEN** o agente mantém congelamento estrito de código e proíbe abrir deltas em `openspec/changes/`
- **AND** agrupa os arquivos por domínio e executa extração Map-Reduce via subagentes *read-only* em paralelo devolvendo fichas factuais com citação das fontes
- **AND** interrompe o fatiamento para consultar o usuário se detectar contradições entre arquivos, isolando omissões em **Lacunas / Decisões Pendentes**
- **AND** após aprovação da Camada 1 (Invariantes Globais e Mapa de Domínios), gera blocos *Rolling Wave* em `openspec/roadmap.md` com as 4 âncoras obrigatórias

### Requirement: Pasta de Materiais Externos e Gatilho Automatico no Fluxo da Governanca
O template DEVE prover `template/docs/conhecimento/materiais/.gitkeep` documentada em `template/docs/conhecimento/INDICE.md` e configurar gatilho automático nas skills `mesa-de-descoberta` (Passo 3) e `inicializar-stack` (Passo 2) para acionar `.agents/skills/sintetizar-conhecimento/SKILL.md` quando houver mais de 8 arquivos ou materiais externos em `docs/conhecimento/`.

#### Scenario: Acionamento automatico de sintese quando o livro ultrapassa o limiar de contexto
- **GIVEN** os arquivos `template/docs/conhecimento/INDICE.md`, `template/docs/conhecimento/materiais/.gitkeep`, `template/.agents/skills/mesa-de-descoberta/SKILL.md` e `template/.agents/skills/inicializar-stack/SKILL.md`
- **WHEN** o projeto avança para promoção de capítulos ou geração do plano Gate 0 com `> 8` arquivos ou materiais em `docs/conhecimento/materiais/`
- **THEN** ambas as skills acionam automaticamente `.agents/skills/sintetizar-conhecimento/SKILL.md` em vez de tentar ler dezenas de arquivos de uma só vez no contexto principal

### Requirement: Registro de Indices, Classificacao Documental e Validacao Copier no CI
Os arquivos `AGENTS.md`, `template/AGENTS.md`, `template/README.md.jinja` e `.github/workflows/ci.yml` DEVEM registrar `sintetizar-conhecimento`, `/sintetizar` e `docs/conhecimento/materiais/`, mantendo classificação documental para `docs/conhecimento/materiais/*.md` e integridade referencial bidirecional sem ponteiros quebrados.

#### Scenario: Integridade referencial e distribuicao de sintetizar-conhecimento via Copier
- **GIVEN** `AGENTS.md`, `template/AGENTS.md`, `template/README.md.jinja`, `.github/workflows/ci.yml` e `template/scripts/lib/classificar-arquivos.mjs`
- **WHEN** a suíte de testes e a geração do template Copier são executadas
- **THEN** `ehArquivoDeDocumentacaoOuGovernanca('docs/conhecimento/materiais/resumo-notebooklm.md')` retorna `true` e `ehArquivoDeProducao(...)` retorna `false`
- **AND** `.github/workflows/ci.yml` verifica `.agents/skills/sintetizar-conhecimento/SKILL.md` e `docs/conhecimento/materiais` no resultado gerado pelo Copier
- **AND** os índices do template e da raiz mantêm 100% de integridade referencial
