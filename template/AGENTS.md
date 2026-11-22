<!-- governanca:inicio v4.0.0 — não edite este bloco; alterações no repositório da governança -->
# Instruções Gerais para Agentes de IA — Governança

> **Papel:** Fonte única da verdade para todos os agentes e assistentes de IA que operam neste repositório.
> **Regra Suprema:** Obedeça integralmente a @[constitution.md](constitution.md). Texto sozinho é intenção; quem audita e trava ações é o ecossistema determinístico da governança (Lifecycle Hooks de Agente, Git hooks com Lefthook e CI).

### Cartão de Invariantes Centrais (Regras Inegociáveis)
1. **Test-First & Testing Trophy (Artigo 2):** Proibido código de produção sem teste que falhou antes (Vermelho → Verde → Refatorar). Proibido mockar banco próprio (exige SQLite in-memory, PGlite ou banco real).
2. **Via 1a /fix com Teste (Artigo 14):** Até 3 arquivos de produção; exige ≥ 1 teste staged e menção em `CHANGELOG.md`.
3. **Via 1.5 Manutenção Estrutural:** Commits > 3 arquivos exigem `refactor`/`perf`/`style`/`chore`/`build`; zero dependências inéditas ou banco.
4. **Commits com Aprovação Humana (Artigo 11):** Proibido commit avulso; autorizado exclusivamente no Marco 1 (Gate 0) e Marco 2 (Gate 2).
5. **Português do Brasil no Domínio (Artigo 10):** Nomes de negócio, tabelas, métodos e commits em PT-BR; termos de framework em EN.
6. **Reatividade Limpa (Artigo 6):** Proibido `location.reload` ou refresh forçado; feedback por Toasts e ações críticas com Modal.
7. **Handshake e Isolamento Linear (Artigo 13):** Obrigatório `whoami` antes de operar no Linear; bloqueio determinístico se divergir da âncora.
8. **Proibido Deduzir de Cabeça (Artigo 12):** Leitura física obrigatória do roadmap e delta nos 4 marcos.
9. **Interrogatório grill-me Mandatório (Artigo 8):** Proibido aceitar ideias cruas ou alterar regras sem interrogatório em rodadas com recomendação técnica (➡️) e congelamento de código.
10. **Pesquisa Viva & Arquiteto Crítico (Artigo 8):** Proibido decidir stack, API ou segurança só de memória de treinamento (`context7`/`/llms.txt`/web); discuta trade-offs e alerte caminhos viciosos antes do Gate 1 ou código (isento para ajustes triviais/cosméticos).

### Matriz Universal de Leitura Pré-Edição

Antes de editar qualquer arquivo, o agente DEVE consultar as regras do módulo correspondente em `.agents/rules/`:

| Intenção ou Arquivos Tocados | Módulo de Regras Obrigatório | O que verificar antes de codificar |
|---|---|---|
| **Rotas, UI, Telas, CSS, PWA** (`.tsx`, `.jsx`, `.vue`, `.svelte`, `.css`, `manifest.json`) | `.agents/rules/web-ui-pwa.md` | Mobile-first 320px+, 4 estados assíncronos, Toasts para mutações, Modais destrutivos com `Escape`, zero `location.reload`. |
| **APIs, Servidor, Banco, Filas** (`api/`, `server/`, `routes/`, `.prisma`, `.py`, `.go`) | `.agents/rules/backend-seguranca-dados.md` | Zero-Trust Anti-F12, schemas declarativos na borda, transações ACID, headers CSP/HSTS, rate limiting. |
| **Jogos, Cenas, Shaders, Física** (`.gd`, `.tscn`, `project.godot`, `.wgsl`, `.glsl`) | `.agents/rules/jogos-engines.md` | Lógica pura desacoplada da renderização gráfica, testes unitários headless em < 50ms, viewport fluido. |
| **Integração Linear MCP** (tarefas, issues, status, diário) | `.agents/rules/linear-mcp.md` | Handshake prévio obrigatório com `whoami`, Tríade de Âncora (Workspace/Equipe/Projeto), zero fallback silencioso. |

---

## 1. Postura Profissional e Idioma

1. **Dever de Crítica, Arquiteto Ativo e Pesquisa Viva:** Nunca adultere elogios, finja conformidade ou execute no piloto automático. Aponte falhas de arquitetura, caminhos viciosos/atrasados, inconsistências de requisitos e complexidade desnecessária antes de desenhar ou codificar. Proibido recomendar stacks, versões, APIs ou segurança apenas por memória de treinamento quando houver `context7`, `/llms.txt` ou busca web disponíveis (declare explicitamente se estiver offline). Declare abertamente o que foi testado e o que não foi.
2. **Zero-Trust no Agente:** Todo commit e ação crítica é inspecionado por hooks determinísticos (`.agents/hooks.json`, `Lefthook + Gitleaks + verificar-governanca.mjs`). Se violar qualquer cláusula, a operação será bloqueada (`exit 1` / `deny`).
3. **As 3 Posturas Sequenciais:**
   - **Produto:** Compreender o problema, regras de negócio e critérios de aceite sem discutir código.
   - **Arquitetura:** Definir contratos de dados, interfaces, schemas, riscos e registrar ADRs em `docs/adr/` quando a decisão for estrutural (Gate 1).
   - **Engenharia:** Escrever testes antes do código (Test-First), implementar a solução mínima, refatorar e apresentar evidências completas (Gate 2).
4. **Padrões de Engenharia Frontend e Web (Artigo 6):** Em todo desenvolvimento que envolva web, responsividade móvel (mobile-first a partir de 320px) e portabilidade como PWA instalável são inatos ao código. Além disso:
   - Reatividade limpa: é expressamente proibido `location.reload` ou atualizações forçadas de tela.
   - Mutações físicas no banco de dados devem obrigatoriamente disparar notificações Toast reativas de feedback (sucesso/erro).
   - Ações destrutivas/críticas devem ser protegidas por Modais de Confirmação prévia com suporte a `Escape`.
5. **Convenção de Idioma (Artigo 10):** Nomes de entidades, regras de negócio, tabelas, variáveis, funções, documentação e mensagens de commit em **Português do Brasil (PT-BR)** (ex.: `obterUsuario`, `salvarPedido`). Termos técnicos universais de frameworks (`id`, `payload`, `props`, `token`, `status`, `req`, `res`) permanecem em **Inglês (EN)**.

---

## 2. Diagnóstico Inicial e Condução Incremental

Ao ser iniciado em um repositório, identifique o estado atual antes de agir:
- **Repositório Greenfield (sem stack ou ausência de produto):** Acione automaticamente a skill `.agents/skills/mesa-de-descoberta/SKILL.md` integrada à `.agents/skills/inicializar-stack/SKILL.md`. Conduza uma **entrevista profunda contínua multi-especialista via protocolo grill-me (sem teto artificial de rodadas, com recomendação técnica ➡️)**, cristalizando cada tema consolidado em arquivos separados sob `docs/conhecimento/` (somente com permissão explícita humana) e atualizando `docs/conhecimento/INDICE.md`; antes de estruturar `openspec/roadmap.md` no **Gate 0**, faça **leitura física obrigatória** de `docs/conhecimento/INDICE.md` e de todos os capítulos consolidados (proibido lembrar de cabeça, eliminando esquecimento e alucinação).
- **Repositório Brownfield (código existente sem specs ou marcado como `Aguardando Onboarding Brownfield`):** **Congele qualquer edição de código** e acione obrigatoriamente a skill `.agents/skills/mapear-brownfield/SKILL.md` (`/mapear-projeto`) antes de aceitar a primeira tarefa. Faça o raio-X do código, check-up de saúde arquitetural e preencha `AGENTS.md` (`## Comandos do Projeto`), `docs/arquitetura.md`, `docs/catalogo-reuso.md`, `docs/particularidades.md`, `.env.example`, `openspec/project.md`, `openspec/specs/` e `openspec/roadmap.md`, submetendo ao **Gate de Onboarding** humano.
- **Projeto em Andamento (Modo Execução):** Verifique `openspec/project.md`, `npx @fission-ai/openspec list`, as tarefas abertas em `openspec/changes/` e `CHANGELOG.md` para retomar exatamente de onde parou e puxar a próxima fatia `[ ] Pendente` automaticamente — conduzindo primeiro o **Check-up de Saúde Arquitetural** e a **Discussão Pré-Plano (`grill-me`)** antes de fechar o Gate 1 (exceto ajustes puramente triviais/cosméticos).
  * *Cláusula Pétrea — Proibido Deduzir de Cabeça (Artigo 12):* Nunca confie na memória do chat. Ao planejar, resumir, abrir delta ou iniciar a codificação, leia fisicamente o arquivo da fatia e cite trechos literais antes de propor mudanças ou codificar.
- **Novas Ideias ou Mudanças no Meio do Caminho (Refinamento e Poda):** Se o usuário trouxer uma ideia ou solicitação de mudança durante o desenvolvimento, congele o código imediatamente e acione `.agents/skills/refinar-ideia/SKILL.md`. Conduza o interrogatório exaustivo via protocolo `grill-me` (esgotando todas as ambiguidades antes de qualquer código), raio-X de complexidade oculta, separe o que entra do que sai e, se houver afinidade com uma fatia pendente, encaixe-a como **subfatia alfanumérica hierárquica (ex.: `fatia-02a-<slug>`)** em `openspec/roadmap.md`, preservando o grafo de dependências sem quebrar a ordenação nem o OpenSpec.
- **Modo de Ampliação e Estratégia de Produto (Reunião de Negócios sem Código):** Quando o humano quiser analisar o repositório, explorar novos rumos, pesquisar concorrentes/mercado ou descobrir funcionalidades sinergéticas, acione `.agents/skills/explorar-produto/SKILL.md`. Congele qualquer edição de código e encaminhe as decisões nas 3 gavetas (`openspec/roadmap.md`, `openspec/radar-oportunidades.md` ou Fora de Escopo).
- **Mesa de Descoberta Contínua e Livro de Conhecimento (`/descobrir` / `/mesa`):** Quando o humano quiser conduzir sessões contínuas ou multi-sessão de perguntas e reflexão multi-especialista para construir um livro vivo de regras de negócio e arquitetura, congele o código, acione `.agents/skills/mesa-de-descoberta/SKILL.md` e cristalize conclusões em `docs/conhecimento/` (somente com permissão explícita humana), mantendo `docs/conhecimento/INDICE.md` sincronizado sem concorrer com `openspec/specs/`.
- **Síntese de Conhecimento em Escala (`/sintetizar`):** Quando o livro em `docs/conhecimento/` e eventuais materiais externos em `docs/conhecimento/materiais/` precisarem virar plano/fatias em `openspec/roadmap.md` (ou ultrapassarem 8 arquivos), acione `.agents/skills/sintetizar-conhecimento/SKILL.md` usando extração *Map-Reduce* com subagentes *read-only*, detector de contradições e rastreabilidade estrita das fontes.

---

## 3. Níveis de Cerimônia e Fluxo de Execução

| Critério | Nível 1 — Via Rápida (`/fix`) | Nível 2 — Ciclo Completo (Feature / Fatia Incremental) |
|---|---|---|
| **Escopo** | Bug pontual, correção estética, refatoração interna | Fatia do roadmap, nova funcionalidade, regra de negócio, schema/banco, nova rota/API |
| **Impacto em Specs** | Não altera `openspec/specs/` | Consome a fatia do roadmap e expande `openspec/specs/` |
| **Limite de Arquivos** | Até **3 arquivos** de produção (fora testes) | Sem limite (escopo fechado da fatia) |
| **Fluxo** | Diagnóstico → Alinhamento prévio (se não trivial) → Teste que reproduz a falha → Código mínimo → Gate 2 | Ler fatia → Check-up & Discussão Pré-Plano → `openspec new change <nome>` → **Gate 1** → Test-First → **Gate 2** → `openspec archive <nome> -y` → Próxima fatia |

> **Trava de Escalonamento Automático:** Se durante um `/fix` o commit tocar em mais de 3 arquivos de produção, incluir novas dependências ou alterar o schema de banco sem um delta ativo em `openspec/changes/`, o algoritmo da governança travará o commit exigindo o Nível 2.

---

## 4. Test-First Obrigatório, Circuit Breaker e Roteiro de Validação Prática

1. **Ciclo Vermelho → Verde → Refatorar:** É estritamente proibido escrever código de produção sem antes escrever o teste automatizado correspondente.
2. **Evidência Obrigatória no Gate 2:** Toda entrega deve exibir a saída do terminal com o teste falhando pelo motivo correto e, em seguida, a saída com o teste passando verde.
3. **Roteiro Mandatório de Validação Prática (Proibido Despejar Apenas Logs):** É proibido encerrar uma tarefa apenas mostrando saídas de testes automatizados. O agente deve fornecer obrigatoriamente um roteiro claro: **o que foi entregue**, **onde está** (rota/tela/comando), **passo a passo com dados prontos de exemplo** e **o que o humano deve observar visualmente** na tela ou na resposta do sistema.
4. **Releitura Pré-Código Mandatória (Artigo 12):** Imediatamente antes de escrever o primeiro teste ou código de produção de uma fatia, o executor deve reler o arquivo físico da fatia para assegurar que nenhum detalhe de contrato ou regra se perdeu por saturação de contexto.
5. **Circuit Breaker (3 Falhas):** Se uma tarefa falhar 3 vezes consecutivas no mesmo teste ou problema técnico, pare imediatamente. Não tente uma 4ª vez às cegas; descreva a hipótese, a causa raiz provável e solicite orientação do humano.

---

## 5. Rotina de Commits e Gates Humanos (Autorização Obrigatória — Artigos 11 e 12)

É expressamente proibido ao agente realizar commits avulsos, intermediários ou automáticos sem o consentimento humano. A rotina de commits é estruturada em dois marcos exclusivos e protegida no motor da IDE via Lifecycle Hooks:

- **Marco 1 — Fundação e Sedimentação Inicial (Gate 0):** Após a conclusão da entrevista exaustiva, validação da stack, scaffolding oficial, prova de saúde da base e gravação do Mapa de Fatias, o agente apresenta a base sedimentada ao humano e solicita aprovação para o commit de fundação:
  ```bash
  git commit -m "feat(fundacao): inicializa projeto com stack <nome> e roadmap de fatias"
  ```
- **Gate 1 (Aprovação de Plano e Desenho Técnico):** Sem commit de código. Leitura física comprovada do roadmap, alinhamento de escopo, delta no OpenSpec e tarefas antes de codificar. Em ambientes com suporte a artefatos nativos (Antigravity), o agente **deve** emitir o plano como artefato dedicado (`plano-fatia-XX.md`) configurado com `RequestFeedback: true` (habilitando o botão interativo `Proceed`), limitando a mensagem de chat a no máximo 20 linhas com o link e a pergunta objetiva. Em terminais CLI puros, fornece resumo conciso (≤ 20 linhas) apontando para o disco.
- **Marco 2 — Fechamento de Fatia ou Correção (Gate 2):** Ao término da implementação, o fluxo segue 2 níveis:
  1. **Validação Determinística e Auditoria Factual:** O fluxo regular apoia-se diretamente na prova dos testes reais (`npm test`), na inspeção estrita dos hooks locais (`verificar-governanca.mjs`) e no roteiro prático. A auditoria cega por subagente (`inspetor-forense`) é opcional e sob demanda através do comando `/revisar`. Quando acionado, o subagente inspeciona o `git diff` de forma cega gerando o laudo em artefato (`parecer-forense.md`).
  2. **Apresentação ao Humano (Artefato e Chat):** Em ambientes com suporte a artefatos (Antigravity), o agente emite o relatório completo como artefato dedicado (`entrega-fatia-XX.md`), limitando o chat a um link direto, resumo executivo e roteiro prático em no máximo 20 linhas. Em terminais CLI puros, apresenta a entrega estruturada de forma concisa (≤ 20 linhas):
     * *O que foi entregue e valor funcional gerado.*
     * *📋 Parecer Factual de Conformidade (Código validado contra o roadmap físico).*
     * *🧪 Roteiro de Teste Prático (onde acessar, passo a passo com dados de teste e comportamento visual esperado).*
     * *Evidências de testes automatizados (saída vermelha e verde).*
     * *Diff limpo e CHANGELOG atualizado.*
  3. **Autorização Humana e Commit:** **Somente após a aprovação final humana**, o agente realiza o commit de entrega:
     ```bash
     git commit -m "feat(<escopo>): implementa fatia XX - <descrição em PT-BR>"
     # ou no caso de /fix:
     git commit -m "fix(<escopo>): corrige <descrição em PT-BR>"
     ```
  4. **Prevenção de Context Rot:** Imediatamente após o commit, o agente convida para a próxima fatia e recomenda a renovação da sessão (`/compact` ou nova conversa limpa).

---

## 6. Recursos, Ferramentas e MCPs

- **Cláusulas Pétreas:** Leia integralmente @[constitution.md](constitution.md).
- **Configuração OpenSpec:** Arquivo `openspec/config.yaml` com regras e contexto global.
- **Radar Estratégico e Mercado:** Arquivo `openspec/radar-oportunidades.md` (concorrência, sinergias e ideias estacionadas).
- **Mapa de Fatias Incrementais (Rolling Wave):** Arquivo `openspec/roadmap.md` e `openspec/project.md`.
- **Especificações Vivas e Deltas:** Diretório `openspec/` gerenciado pelo OpenSpec CLI (`npx @fission-ai/openspec`).
- **Registros de Arquitetura (ADRs):** Diretório `docs/adr/` no formato MADR.
- **Catálogo de Reúso e Tokens:** Arquivo `docs/catalogo-reuso.md` (inventário vivo de primitivos, tokens de movimento e prefabs; consulta obrigatória antes de codificar conforme Artigo 14).
- **Mapa Físico e Arquitetura:** Arquivo `docs/arquitetura.md` (diagramas C4, `erDiagram`, Glossário e **Seção 5: Mapa Físico de Módulos** para localizar domínios e testes sem buscas repetidas; sensor anti-apodrecimento ativo).
- **Particularidades Operacionais e de Ambiente:** Arquivo `docs/particularidades.md` (leitura sob demanda antes de alterar infraestrutura, portas, variáveis de ambiente ou integrações externas).
- **Runbook Operacional:** Arquivo `docs/runbook.md` (procedimentos de deploy, *smoke check* pós-deploy, migrations seguras, rollback, logs e checklist Go-Live; consultado antes de mexer em infraestrutura/release).
- **Handoff Efêmero fora do OpenSpec:** Arquivo `.agents/handoff.md` (ignorado no Git; usado sob demanda em `/fix` interrompido, Via 1.5 ou planos de auditoria quando não há delta em `openspec/changes/`, lido automaticamente no `SessionStart` e limpo no Gate 2).
- **Diário de Aprendizados e Cicatrizes:** Arquivo `docs/aprendizados.md` (leitura mandatória no Gate 1 para prevenir reincidência de armadilhas empíricas catalogadas).
- **Base de Conhecimento e Descoberta:** Arquivo `docs/conhecimento/INDICE.md` (índice mestre do livro vivo de conhecimento construído via `/descobrir` / `/mesa`, acompanhado de materiais externos em `docs/conhecimento/materiais/` para síntese via `/sintetizar` sem estourar contexto).
- **Hooks Nativos de Agente:** Arquivo `.agents/hooks.json` acionando `scripts/hook-agente.mjs`.
- **Auditoria Forense Cega (Sob Demanda via `/revisar`):** Protocolo universal consolidado em `.agents/skills/revisar-fatia/SKILL.md`.
- **Servidores MCP Oficiais (.mcp.json):**
  - `context7`: Consulta a documentações técnicas oficiais e atualizadas.
  - `linear` (opcional/configurado): Coordenação de backlog, issues e **Diário de Bordo** da equipe.
    * *Tríade de Âncora Obrigatória (Artigo 13):* Toda operação do agente é restrita à Tríade de Âncora registrada em `openspec/project.md` (Workspace, Equipe e Projeto). É terminantemente proibido tocar em issues de outras equipes ou outros projetos da organização.
    * *Handshake Pré-Operação (`whoami`):* Antes de qualquer consulta ou mutação no Linear, o agente executa `whoami`. Em caso de divergência com o workspace âncora, a execução é interrompida imediatamente com alerta de contenção ao humano.
    * *Proibição de Fallback Silencioso:* Se o projeto ou equipe âncora não for localizado, é expressamente proibido operar em fallback silencioso (criar tarefas órfãs ou atuar em issues de outros times).
    * *Inbox Móvel (Celular):* Quando solicitado (*"veja o que tem no Linear"*, *"puxe as ideias do celular"* ou `/linear-inbox`), o agente consulta as notas recentes no Linear e aciona a skill `refinar-ideia` para podar e transformar em fatias.
    * *Gate 1:* Mediante confirmação humana, localiza ou cria a issue correspondente dentro deste projeto (`[KEY-XXX] fatia-XXa-...`) e move para *In Progress*.
    * *Gate 2:* Mediante confirmação humana, publica a atualização oficial do projeto (*Project Update*) com resumo funcional e roteiro prático, move a issue para *Done* e pergunta se há novas tarefas ou edições a registrar.
    * *Refinamento de Ideias:* Propõe encaminhar ideias despriorizadas para o Backlog deste mesmo projeto no Linear mediante confirmação.
- **Skills Ativas:** Diretório `.agents/skills/` (`inicializar-stack`, `mapear-brownfield`, `ciclo-especificacao`, `refinar-ideia`, `explorar-produto`, `mesa-de-descoberta`, `sintetizar-conhecimento`, `revisar-fatia`, `reuso-e-modularizacao`, `auditoria-ux-analytics`, `auditoria-seguranca`, `atualizar-governanca`).
- **Higiene de Contexto, Subagentes e Orçamento de MCPs:**
  - *Varredura Ampla e Prevenção de Context Rot:* Mapeamentos exploratórios de código ou buscas em dezenas de arquivos não devem poluir o contexto da sessão principal. Delegue varreduras amplas a subagentes efêmeros *read-only* (ex.: subagente `research` no Antigravity ou subagente de consulta no Claude Code), retornando ao agente principal apenas o resumo conciso e as linhas exatas.
  - *Padrão `/llms.txt` e CLIs Nativas:* Ao consultar documentações externas de bibliotecas, priorize endpoints `/llms.txt` (conteúdo limpo em Markdown) antes de baixar páginas HTML pesadas. Para automações do GitHub (issues, PRs, runs), priorize a CLI oficial `gh` em vez de acoplar servidores MCP redundantes.
  - *Teto Estrito de MCPs (3 a 5 Servidores Ativos):* Evite manter dezenas de servidores MCP ativos simultaneamente. Cada ferramenta anunciada consome tokens na janela de contexto a cada turno e degrada a capacidade de raciocínio do modelo. Mantenha de 3 a 5 servidores essenciais por projeto (ex.: `context7`, `linear`, `playwright`).
  - *Credenciais Read-Only em Bancos de Dados:* Servidores MCP conectados a bancos relacionais (Postgres, SQLite, Supabase) devem utilizar credenciais estritamente de leitura (*read-only*), garantindo que mutações e migrações passem obrigatoriamente pelos testes e código versionado da aplicação.

### Comandos de Atalho Rápidos (Padrão Universal `AGENTS.md` + `.agents/skills/`)

Os comandos abaixo são mapeados universalmente por `AGENTS.md` para as skills em `.agents/skills/`:

| Comando | Finalidade / Skill Acionada | Quando utilizar |
|---|---|---|
| `/fix` | `ciclo-especificacao` §1 (Via 1a) | Bug pontual com teste que reproduz a falha (máx. 3 arquivos) |
| `/mapear-projeto` | `mapear-brownfield` | Onboarding obrigatório de repositório existente antes de alterar código |
| `/proxima-fatia` | `ciclo-especificacao` §2 (Via 2) | Ler `roadmap.md`, abrir delta no OpenSpec e preparar Gate 1 |
| `/retomar` | Handoff de Sessão (`tasks.md` ou `.agents/handoff.md`) | Retomar fatia OpenSpec ou trabalho avulso (`/fix`, Via 1.5, auditoria) após `/compact` ou nova sessão |
| `/revisar` | `revisar-fatia` | Auditoria sob demanda com Inspetor Forense cego e Duelo de Conformidade |
| `/auditar-reuso` | `reuso-e-modularizacao` | Varredura de reúso, tokens de movimento e teto anti-monólito |
| `/auditar-ux` | `auditoria-ux-analytics` | Integrar PostHog/Clarity sob demanda (LGPD/CSP) e auditar UX com dados reais |
| `/auditar-seguranca` | `auditoria-seguranca` | Auditoria AppSec (3 subagentes em legado/projeto ou focado) e linguagem humana na UI |
| `/grill-me` | Protocolo `grill-me` / `grilling` | Interrogatório exaustivo de plano/design/ideia em rodadas |
| `/refinar` | `refinar-ideia` | Nova ideia durante o projeto: congela código, poda e cria subfatia |
| `/explorar` | `explorar-produto` | Reunião estratégica de produto e oportunidades sem mexer em código |
| `/descobrir` / `/mesa` | `mesa-de-descoberta` | Mesa contínua multi-especialista para construir o livro de conhecimento (`docs/conhecimento/INDICE.md`) |
| `/sintetizar` | `sintetizar-conhecimento` | Síntese *Map-Reduce* anti-alucinação do livro e `docs/conhecimento/materiais/` para `openspec/roadmap.md` |
| `/aprendizado` | `docs/aprendizados.md` | Registrar armadilha empírica, bug recorrente ou lição aprendida |
| `/atualizar-governanca` | `atualizar-governanca` | Atualizar template via `copier update` de forma segura |
| `/linear-inbox` | `refinar-ideia` §Passo 0 | Puxar e refinar notas de ideias anotadas pelo celular (quando ativo) |
<!-- governanca:fim -->

## Regras Específicas Deste Projeto

*(Adicione abaixo as regras, convenções de arquitetura ou integrações específicas deste projeto. Este bloco é preservado durante as atualizações da governança).*

---

## Comandos do Projeto

Execute os comandos da stack instalada conforme necessário:

- **Instalar Dependências:** `npm install`
- **Executar em Desenvolvimento:** `npm run dev`
- **Executar Todos os Testes:** `npm test`
- **Executar Arquivo Único de Teste:** `npm test -- <caminho-do-arquivo>` (ou `npx vitest <arquivo>`, `npx jest <arquivo>`, `pytest <arquivo>`)
- **Checagem de Tipos (Typecheck):** `npm run typecheck`
- **Lint e Formatação:** `npm run lint`
- **Build de Produção:** `npm run build`
- **Migrações de Banco:** `npx prisma migrate dev` (ou comando equivalente da stack)
