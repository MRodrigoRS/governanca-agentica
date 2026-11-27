<!-- governanca:inicio v4.5.0 — não edite este bloco; alterações no repositório da governança -->
# Constituição do Projeto — Governança

> **Papel:** Lei Suprema do repositório. Cláusulas pétreas obrigatórias para agentes de IA e desenvolvedores humanos.
> **Enforcement:** Estas cláusulas não são sugestões textuais. São auditadas determinísticamente por Lifecycle Hooks dos Agentes (`.agents/hooks.json`), Git hooks locais (`Lefthook + Gitleaks + verificar-governanca.mjs`) e pelo GitHub Actions CI. Qualquer violação bloqueia commits e builds (`exit 1` / `deny`).

---

## Artigo 1 — Cláusula Anti-Brinquedo (Bases Robustas)

1. É expressamente proibido iniciar qualquer aplicação interativa (Web, Programa de Computador Desktop ou Mobile) com arquivos avulsos (como HTML/CSS/JS soltos na web ou scripts amadores num único arquivo no desktop), sem tipagem estrita, sem empacotamento profissional e sem componentes reutilizáveis.
2. Toda aplicação interativa parte obrigatoriamente de uma stack do catálogo oficial (ou aprovada no Gate 0) e deve garantir desde o primeiro commit:
   - **Tipagem Estrita:** TypeScript com `"strict": true` em `tsconfig.json`, Rust, C#/.NET ou Python com type hints completos validados por `mypy` ou `pyright`.
   - **Validação de Entradas na Fronteira:** Esquemas declarativos (ex.: Zod no ecossistema JS/TS, Pydantic em Python, Serde em Rust) validando dados externos em rotas de API, pontes IPC (Desktop), formulários, parâmetros de URL, cookies e webhooks.
   - **Design System Modular:** Interface construída com base em componentes consistentes e reutilizáveis (ex.: Tailwind CSS + shadcn/ui ou equivalente nativo), em estrita observância ao princípio *Reuse-Before-Create* e às regras de componentização do Artigo 14.
   - **Testes Automatizados Ativos:** Executor de testes configurado e ao menos um teste de sanidade passando desde a inicialização.
3. **Exceção Única:** Protótipos descartáveis ou documentos HTML puramente estáticos, desde que formalmente aprovados como exceção no Gate 0.

---

## Artigo 2 — Test-First Mandatório (Vermelho → Verde → Refatorar)

1. Nenhum código de produção deve ser implementado sem que antes exista um teste automatizado falhando que especifique o comportamento desejado.
2. O ciclo obrigatório de desenvolvimento é:
   - **Vermelho (Especificar):** Escrever o teste automatizado unitário ou de integração com asserções reais e executá-lo no terminal, comprovando que ele falha pelo motivo esperado. É proibido criar testes ocos (sem asserções) ou com marcadores de foco exclusivo (`.only(`).
   - **Verde (Faça Funcionar):** Escrever o código mínimo e mais direto de produção necessário para fazer o teste passar, sem abstrações prematuras.
   - **Refatorar (Faça Direito):** Com os testes verdes, elevar obrigatoriamente a saúde estrutural antes de avançar para a próxima tarefa ou Gate 2: aplicar *early returns* para reduzir complexidade condicional aninhada, eliminar duplicações estruturais (DRY), garantir nomes de domínio em PT-BR (Artigo 10) e assegurar que mutações óbvias de regras quebrem a suíte.
3. **Comprovação Automatizada no Gate 2:** A apresentação da entrega deve conter obrigatoriamente as duas saídas de terminal: a execução com falha (vermelho) e a execução com sucesso (verde). Sem essa comprovação, a entrega é inválida.
4. **Comprovação Prática e Visual no Gate 2 (Roteiro de Validação Humana):** Testes automatizados provam a integridade lógica para o algoritmo, mas não dispensam a validação humana. É obrigatório que toda apresentação no Gate 2 (seja em `/fix` ou Nível 2) contenha um **Roteiro de Teste Prático Passo a Passo**, detalhando:
   - **O que foi entregue:** Resumo claro do valor funcional construído ou corrigido.
   - **Onde encontrar:** Rota exata (`http://localhost:3000/...`), comando CLI ou tela/modal onde o recurso se encontra.
   - **Passo a passo com dados prontos:** Instruções numeradas com valores e dados fictícios prontos para copiar e colar.
   - **Comportamento visual esperado:** O que o humano deve observar visualmente na tela ou na resposta do terminal.
5. **Proibição de Testes Mentirosos:** É terminantemente proibido comentar testes que falham, alterar asserções para mascarar defeitos de código de produção ou simular sucesso artificial.
6. **Testing Trophy e Anti-Mock de Banco Próprio:** A pirâmide moderna de testes equilibra três camadas essenciais: (a) *Unitários Puros* (< 50ms, regras matemáticas, lógica de domínio pura, desacoplados de IO), (b) *Integração Real* (rotas, repositórios, schemas e transações executados contra persistência real: SQLite in-memory, PGlite ou banco de dados local de teste), e (c) *Smoke E2E Crítico + Acessibilidade* (fluxos vitais no navegador com `@axe-core/playwright`, ausência de overflow horizontal em 320px e zero exceções não tratadas). É expressamente proibido mockar ou criar spies sobre o cliente de banco de dados ou ORM do próprio projeto (`prisma`, `drizzle`, `db`, `session`, `repository`), impedindo a fabricação de falsos positivos que não testam integridade referencial ou queries. Mocks são restritos exclusivamente a APIs externas de terceiros (gateways de pagamento, e-mail, LLMs). Para testes de resiliência com simulação de queda de driver físico, exige-se a válvula formal `governanca:mock-banco-justificado: <motivo >= 15 chars>`.

---

## Artigo 3 — Zero Testes Quebrados e Zero Avisos Críticos

1. A suíte de testes deve estar 100% verde antes de qualquer solicitação de commit ou encerramento de tarefa.
2. Commits com testes falhando ou avisos críticos de linter/tipagem serão rejeitados imediatamente pelos hooks determinísticos.

---

## Artigo 4 — Zero Segredos em Código

1. Nenhuma chave de API, senha, token de autenticação, certificado ou credencial sensível deve ser comitada no repositório.
2. Todo segredo deve residir em variáveis de ambiente (`.env`), devidamente declaradas e documentadas em `.env.example` e ignoradas em `.gitignore`.
3. Commits contendo segredos em texto plano serão bloqueados pelo Gitleaks no hook de pré-commit e pelo CI.
4. **Dupla Proteção Local e CI:** O Artigo 3 e o Artigo 4 são fiscalizados localmente antes do commit (testes unitários rápidos no `pre-commit` do Lefthook) e antes do push (suíte poliglota completa no `pre-push`), bem como no pipeline de CI com validação obrigatória de lockfile versionado e validação de mensagem de commit.

---

## Artigo 5 — Dependências Justificadas e Mínimas

1. É proibido instalar bibliotecas externas para resolver problemas triviais solucionáveis com a biblioteca padrão da linguagem ou recursos nativos da plataforma.
2. Toda nova dependência adicionada aos arquivos de manifesto (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.) deve ser explicitamente listada e justificada tecnicamente no plano de implementação (Gate 1).

---

## Artigo 6 — Padrões Práticos de Engenharia Frontend

1. **Reatividade Limpa:** É expressamente proibido forçar atualização de estado com recarregamento completo da página (`location.reload`, `window.location.reload`, `window.location.href`). O estado deve ser puramente reativo e gerenciado pela biblioteca de UI. A violação desta regra bloqueia commits determinísticamente.
2. **Semântica e Acessibilidade:** Uso obrigatório de elementos HTML semânticos (`<main>`, `<nav>`, `<button>`, `<header>`, `<article>`), atributos `aria-*` onde necessário e labels associados a todos os campos de formulário.
3. **Alvos de Toque e Clique:** Botões e elementos interativos devem possuir área clicável mínima de 44x44 pixels para garantir usabilidade em dispositivos móveis.
4. **Comportamento do Teclado:** A tecla `Escape` (`Esc`) deve obrigatoriamente fechar modais, gavetas laterais (drawers), menus suspensos e diálogos abertos.
5. **Tratamento Integral de Estados Assíncronos:** Toda interface que consome dados assíncronos deve implementar explicitamente os 4 estados fundamentais:
   - **Carregando (loading):** Indicador visual claro (skeleton ou spinner).
   - **Vazio (empty):** Mensagem contextual orientando a ação do usuário quando não houver dados.
   - **Erro (error):** Notificação legível com opção de tentar novamente.
   - **Sucesso (success):** Exibição correta do conteúdo recebido.
6. **Responsividade e Portabilidade PWA Inatas:** Todo desenvolvimento que diga respeito à web deve nascer responsivo por padrão e preparado nativamente para portabilidade como **PWA (Progressive Web App)**:
   - **Responsividade Inata:** Design fluido e mobile-first, com layouts baseados em Flexbox ou CSS Grid testados e funcionais desde telas estreitas de smartphones (mínimo 320px) até monitores widescreen, sem barras de rolagem horizontais espúrias, elementos sobrepostos ou quebras de alinhamento.
   - **Portabilidade PWA Inata:** Suporte a manifesto de aplicação web (`manifest.json` ou `manifest.webmanifest`), ícones adaptativos para diferentes densidades de tela, meta tags de viewport (`width=device-width, initial-scale=1`) e cor temática (`theme-color`), além de estrutura amigável para funcionamento offline e cache de assets essenciais via Service Worker quando suportado pelo framework da stack. A adaptabilidade móvel e a capacidade de ser instalado como app são requisitos inatos de arquitetura de interface web.
7. **Feedback Reativo (Toasts) e Confirmação de Segurança (Modais de Ação):**
   - **Toasts de Persistência:** Toda operação que realize mutação física de estado no banco ou na persistência (criação, edição, exclusão, envio de formulário, ativação/desativação) deve obrigatoriamente disparar uma notificação Toast temporária e reativa informando o resultado concreto ao usuário (toast de sucesso verde com mensagem amigável ou toast de erro vermelho legível).
   - **Modais de Confirmação para Ações Destrutivas/Críticas:** É terminantemente proibido executar deleções, arquivamentos, desativações ou mudanças de estado críticas e irreversíveis com clique direto sem confirmação prévia. Tais operações devem obrigatoriamente exibir um Modal/Dialog de confirmação detalhando o impacto da ação, com foco inicial seguro, botão de cancelamento claro e suporte a fechamento pela tecla `Escape` ou clique fora.
8. **Linguagem Humana e Zero Jargão Técnico na Interface (UX Writing Limpo):** Textos exibidos ao usuário final (toasts, mensagens de erro, estados vazios, modais, formulários, alertas e badges) devem usar linguagem natural, clara e orientada à tarefa humana. É terminantemente proibido expor termos de programação (`payload`, `null`, `undefined`, `timeout`, `endpoint`, `webhook`, `JSON`), conceitos ou nomes de banco de dados (`registro`, `tabela`, `entidade`, `constraint`, `foreign key`, `UUID`, `usuario_id`), enums crus (`AGUARDANDO_PAGAMENTO`) ou mensagens de exceção/códigos HTTP brutos (`err.message`, `Erro 500`, `422`).

---

## Artigo 7 — Padrões Práticos de Engenharia Backend e Zero-Trust

1. **Zero-Trust no Cliente (Anti-F12), Anti-IDOR e Anti-Mass Assignment:** Nunca confie em validações, identidades, preços ou regras de negócio enviadas pelo cliente. Toda consulta ou mutação deve filtrar pelo `usuarioId`/`tenantId` autenticado no servidor (prevenção contra IDOR/BOLA), exigir RBAC explícito no servidor em rotas administrativas, aplicar *allowlist* via schema contra *Mass Assignment* (proibido passar `req.body` cru ao ORM) e recalcular preços/descontos no servidor validando webhooks por assinatura criptográfica (HMAC) com idempotência.
2. **Integridade Transacional (ACID):** Operações que envolvem alterações em múltiplos registros ou tabelas devem ser encapsuladas em transações atômicas de banco de dados.
3. **Segurança de Tráfego e Cabeçalhos:** Ambientes de produção devem aplicar cabeçalhos de segurança essenciais: Content Security Policy (CSP), HTTP Strict Transport Security (HSTS) e CORS estritamente configurado.
4. **Prevenção de Abuso:** Endpoints públicos e operações sensíveis (login, recuperação de senha, pagamentos, geração de IA) devem implementar Rate Limiting determinístico.
5. **OWASP Top 10 e OWASP Agentic Top 10:** Proteção ativa contra injeção SQL/NoSQL, XSS, CSRF, SSRF, vazamento de segredos em variáveis públicas de frontend (`NEXT_PUBLIC_`, `VITE_`, `EXPO_PUBLIC_`), injeção de prompt indireta e execução inadvertida de ferramentas por agentes autônomos; uso obrigatório de cookies `HttpOnly`/`Secure`/`SameSite`, hash de senhas com `Argon2id`/`bcrypt`, upload validado por *magic bytes* fora da raiz executável e ocultação total de stack traces/erros internos de banco nas respostas ao cliente.

---

## Artigo 8 — Honestidade Radical, Arquiteto Crítico, Pesquisa Viva e Gates Humanos

1. **Honestidade Radical e Pesquisa Viva (Anti-Memória de Treinamento):** O agente nunca deve fingir que testou, esconder bugs conhecidos ou adular decisões equivocadas. É expressamente proibido recomendar ou decidir stacks, versões de bibliotecas, APIs externas ou configurações de segurança baseando-se apenas em dados de treinamento quando houver ferramentas de consulta viva disponíveis (`context7`, endpoints `/llms.txt`, busca web ou documentação oficial); caso o ambiente esteja offline/sem acesso externo, essa limitação deve ser declarada explicitamente.
2. **Entrevista Exaustiva, Protocolo grill-me e Mapa Macro de Capacidades:** O humano não tem obrigação de saber dividir um sistema complexo na ordem técnica de implementação. É expressamente proibido ao agente aceitar ideias cruas, assumir requisitos tácitos ou deduzir unilateralmente o que deve ser feito. É dever exclusivo do agente conduzir uma entrevista exaustiva de produto e arquitetura através do protocolo investigativo **`grill-me`** (árvore de decisões percorrida em rodadas sucessivas pela fronteira lógica, com cada pergunta acompanhada da resposta recomendada pelo agente `➡️` com justificativa técnica para deliberação humana), polindo o que entra e o que fica de fora e consolidando no Gate 0 os **Invariantes Globais**, o **Mapa Macro de Capacidades** (para evitar miopia estrutural) e apenas a **`fatia-01-fundacao`** — sem pré-fabricar blocos `fatia-02`..`fatia-N` no escuro antes de existir código real.
3. **Fatiamento Cirúrgico Just-in-Time (`planejar-proxima-fatia`), Cláusula Anti-Preguiça e Fronteira Divergente vs. Convergente:** Após a fundação, cada nova fatia é descoberta **uma por vez** pelo subagente *read-only* convergente de `.agents/skills/planejar-proxima-fatia/SKILL.md` (`/fatiar`), analisando simultaneamente o livro/documentação, a `openspec/matriz-requisitos.md` e o código real existente (prontidão de dependências, coesão cirúrgica, desbloqueio estrutural e anti-miopia) — sem disparar expansão divergente automaticamente. A exploração divergente e repensamento estratégico ocorrem estritamente sob demanda humana via `/explorar` ou `/evoluir` (`explorar-produto`, Conselho de 3 Subagentes *read-only* com código congelado e sem pré-fabricação de ondas no roadmap). É proibido comprimir o planejamento em listas superficiais: toda fatia aprovada deve ser registrada em `openspec/roadmap.md` (ou bloco de subfatia alfanumérica `fatia-XXa-<slug>` em encaixes) e especificada em seus 4 pilares auditados pelo OpenSpec (`proposal.md`, `specs/`, `design.md` e `tasks.md` em `openspec/changes/<fatia>/`), detalhada o suficiente para que até um agente mais simples consiga implementá-la sem adivinhar regras.
4. **Refinamento de Meio de Caminho, Congelamento de Código e Subfatias Alfanuméricas:** Quando novas ideias ou mudanças surgirem durante o projeto (no chat ou via inbox móvel do Linear), o agente é terminantemente proibido de iniciar a implementação imediata. É obrigatório congelar todo código de produção e intervir via skill `refinar-ideia`, executando rodadas exaustivas do protocolo **`grill-me`** (esgotando todas as ambiguidades, pontos cegos, atores e casos de falha antes de qualquer código) e aplicando a poda construtiva (entra vs. sai). Se a novidade for um complemento natural de uma fatia pendente, ela deve ser encaixada imediatamente após a fatia-mãe como subfatia alfanumérica (ex.: `fatia-02a-<slug>`), aproveitando o contexto de código fresco sem reordenar as fatias subsequentes e mantendo 100% de compatibilidade com o OpenSpec.
5. **Papel Ativo de Arquiteto Crítico e Discussão Pré-Plano (Exceto Ajustes Triviais):** O agente não pode operar como mero executor passivo. Ao iniciar uma fatia ou receber um pedido de mudança/correção que altere comportamento, UX, contrato de dados ou mascare dívida técnica:
   - **Check-up Ativo de Saúde Arquitetural:** Inspecione o trecho relacionado do projeto em busca de caminho vicioso, acoplamento excessivo ou tecnologia/padrão atrasado e levante o alerta antes de construir em cima.
   - **Discussão Pré-Plano Obrigatória:** Antes de fechar o `design.md` ou submeter o plano no Gate 1 (ou executar mudança não trivial), conduza uma rodada prévia de alinhamento (`grill-me` com `➡️` e alternativas). Ajustes puramente triviais ou cosméticos (ex.: texto/copy, cor, espaçamento, typo, `Via 1b` `style` sem mudança de lógica) ficam isentos dessa cerimônia.
6. São marcos obrigatórios com intervenção humana:
   - **Gate 0:** Aprovação do escopo polido, da stack tecnológica/VPS/MCPs (validada por pesquisa viva) e do Mapa de Fatias Incrementais com Invariantes Globais (`openspec/roadmap.md`).
   - **Gate 1:** Aprovação do plano, desenho técnico (registrando fontes consultadas quando aplicável) e tarefas antes da implementação de Nível 2. Em ambientes com suporte a artefatos nativos (Antigravity), é expressamente proibido despejar planos extensos em texto corrido no chat; o agente deve emitir o plano como artefato dedicado (`plano-fatia-XX.md`) com `RequestFeedback: true` (habilitando o botão nativo `Proceed`), limitando a mensagem do chat ao link direto e à pergunta objetiva de decisão (≤ 20 linhas). Em terminais CLI sem artefatos, fornecer resumo conciso (≤ 20 linhas) apontando para os arquivos do disco.
   - **Gate 2:** Aprovação da entrega mediante relatório de entrega estruturado emitido como artefato dedicado (`entrega-fatia-XX.md`) em ambientes compatíveis ou resumo conciso no chat (≤ 20 linhas), contendo o valor entregue, Roteiro de Teste Prático Passo a Passo (onde está, como testar com dados de exemplo e comportamento visual esperado), evidências reais de testes automatizados (vermelho/verde), destaque explícito de todas as válvulas de escape ativas no diff (`governanca:mock-banco-justificado`, `governanca:arquivo-extenso-justificado` reportadas pelo auditor), diff limpo e `CHANGELOG.md` atualizado, seguida pelo fechamento atômico (`openspec archive` → atualização de roadmap/matriz → `git commit`) e acionamento proativo da próxima fatia da fila. A auditoria cega por subagente (`inspetor-forense`) é opcional e sob demanda através do comando `/revisar`.

---

## Artigo 9 — Circuit Breaker de 3 Tentativas

Se durante a execução de uma tarefa o agente falhar 3 vezes consecutivas no mesmo teste, comando ou problema arquitetural:
1. O agente deve parar imediatamente a execução automatizada.
2. É proibido tentar uma 4ª vez às cegas ou alterar o teste para fazê-lo passar artificialmente.
3. O agente deve reportar ao humano a hipótese testada, o log da falha e solicitar orientação antes de prosseguir.

---

## Artigo 10 — Idioma (Português no Domínio), Rastreabilidade e CHANGELOG

1. **Português Brasileiro no Domínio e no Código:** Nomes de entidades, regras de negócio, tabelas de banco, variáveis, funções, classes, especificações e mensagens de commit devem ser escritos em **Português do Brasil (PT-BR)** (ex.: `obterUsuario`, `salvarPedido`, `calcularDesconto`, `cliente`).
2. **Termos Técnicos Universais em Inglês:** Termos técnicos universais e convenções de bibliotecas/frameworks (`id`, `payload`, `props`, `handler`, `middleware`, `token`, `status`, `req`, `res`) permanecem em **Inglês (EN)** sem tradução forçada.
3. Todo commit que alterar lógica de produção (`feat`, `fix`, `perf`, `refactor`) deve conter a atualização correspondente do delta consolidado em `CHANGELOG.md` no padrão *Keep a Changelog*.

---

## Artigo 11 — Rotina de Commits Cadenciada e Autorizada pelo Humano

1. **Proibição de Commits Avulsos ou Prematuros:** É estritamente proibido ao agente realizar commits arbitrários, automáticos ou incompletos no meio do desenvolvimento ("work in progress" soltos, testes quebrados ou sem autorização). O motor da IDE intercepta comandos de commit via Lifecycle Hooks (`.agents/hooks.json`) forçando confirmação humana (`force_ask`).
2. **Os Dois Marcos Mandatórios de Commit:**
   - **Marco 1 — Fundação e Sedimentação Inicial (Gate 0):** Ocorre após a conclusão da entrevista de produto, aprovação da stack, scaffolding oficial, prova de saúde da base e gravação do Mapa de Fatias Incrementais e Invariantes Globais (`openspec/project.md` e `openspec/roadmap.md`). O agente solicita e aguarda a **aprovação humana explícita** para realizar o commit fundacional (ex.: `feat(fundacao): inicializa projeto com stack e roadmap de fatias`).
   - **Marco 2 — Fechamento de Fatia ou Correção (Gate 2):** Ocorre ao término da implementação da fatia ou `/fix`, após a comprovação de testes (Vermelho → Verde), diff limpo, `CHANGELOG.md` atualizado e validações determinísticas passando (`verificar-governanca.mjs`, `openspec validate`). O agente só realiza o commit após a **aprovação final humana explícita** no Gate 2 (ex.: `feat(escopo): implementa fatia XX - descricao`).
3. **Padrão Obrigatório de Mensagem:** Todo commit deve respeitar rigorosamente o Conventional Commits em Português do Brasil (auditado por `validar-commit-msg.mjs`), vinculando o escopo à fatia ou componente trabalhado.

---

## Artigo 12 — Cláusula Pétrea "Proibido Deduzir de Cabeça" (Leitura Física Mandatória e Prevenção de Context Rot)

1. **Proibição Estrita de Dedução Mental:** É expressamente proibido ao agente deduzir de cabeça, presumir de memória ou alucinar requisitos, contratos de dados, regras de negócio ou estados de tela de qualquer fatia com base em lembranças de mensagens anteriores da sessão de chat.
2. **Os 4 Marcos de Leitura Física Obrigatória:** O agente deve obrigatoriamente executar a ferramenta de leitura direta no disco do bloco da fatia em `openspec/roadmap.md` e dos 4 artefatos de delta do OpenSpec (`proposal.md`, `specs/`, `design.md`, `tasks.md`) antes de:
   - Resumir ou apresentar a próxima fatia ao usuário.
   - Abrir o delta de especificação no OpenSpec (`npx @fission-ai/openspec new change <nome>`).
   - Submeter o plano e desenho técnico para aprovação no Gate 1.
   - **Escrever a primeira linha de teste automatizado ou código de produção.**
3. **Evidência Explícita de Alinhamento:** Ao abrir o Gate 1 ou convidar o humano para a próxima fatia, o agente deve citar textualmente os objetivos e contratos definidos no bloco de roadmap físico e nos artefatos da fatia, provando que não inventou o escopo. Qualquer divergência entre a proposta do agente e o roadmap físico anula o Gate 1.
4. **Auditoria Cega por Subagente Opcional Sob Demanda (`/revisar`):** Para garantir eficiência de tempo e consumo de tokens, o fluxo regular do Gate 2 apoia-se diretamente na prova determinística dos testes reais automatizados (`npm test`, `node --test`), na auditoria estrita dos hooks locais (`verificar-governanca.mjs`) e na validação pelo Roteiro de Teste Prático do Usuário. A convocação do **Subagente Inspetor Forense** (`inspetor-forense`) é um recurso sob demanda, podendo ser acionada a qualquer momento através do comando `/revisar` para inspecionar cegamente o `git diff` e confrontá-lo com as especificações em fatias críticas de alto risco.
5. **Higiene de Contexto Preventiva e Isolamento de Artefatos:** Para prevenir a degradação de contexto (*Context Rot*), relatórios técnicos extensos, planos detalhados e pareceres forenses devem ser isolados em artefatos dedicados sempre que o harness suportar, mantendo as mensagens de chat enxutas e focadas em decisões (≤ 20 linhas). Além disso, ao concluir o Gate 2 de uma entrega, o agente deve orientar formalmente o humano a renovar a sessão (`/compact` ou abertura de nova conversa limpa) antes de puxar a próxima fatia da fila.
6. **Rastreabilidade Ponta-a-Ponta do Produto (`openspec/matriz-requisitos.md`):** Quando o projeto mantiver `openspec/matriz-requisitos.md`, cada requisito de negócio ou técnico consolidado ocupa 1 linha tabular com ID imutável (`REQ-01`..`REQ-NN`), fonte em `docs/conhecimento/` ou decisão, fatia vinculada e prova real em disco. É obrigatório referenciar os `REQ-XX` atendidos no plano da fatia (Gate 1) e atualizar cada `REQ-XX` para `[x] Entregue` com ao menos 1 caminho real de teste ou spec existente em disco na coluna `Prova Real` (ou `[-] Descartado`) no Gate 2 antes de arquivar o delta.

---

## Artigo 13 — Isolamento Multi-Squad, Tríade de Âncora e Handshake de Integrações

1. **Tríade de Âncora Obrigatória:** Todo projeto integrado a ferramentas compartilhadas de gestão de tarefas (ex.: Linear via MCP) deve possuir sua âncora imutável registrada em `openspec/project.md`, composta obrigatoriamente por:
   - **Workspace:** slug e URL da organização/conta.
   - **Equipe:** chave (`KEY`), nome e UUID da equipe proprietária.
   - **Projeto:** nome, identificador (`P-XXX`) e UUID do projeto.
2. **Handshake Pré-Operação com `whoami`:** É expressamente proibido ao agente emitir qualquer instrução de leitura ou escrita no Linear sem antes disparar a ferramenta `whoami` para verificar a identidade e o workspace ativo na sessão.
3. **Bloqueio Determinístico por Divergência de Workspace:** Se o workspace ativo retornado pelo `whoami` divergir do registrado na Tríade de Âncora, o agente deve interromper imediatamente a operação, emitir um alerta de contenção ao humano e recusar-se a prosseguir.
4. **Proibição Absoluta de Fallback Silencioso:** Se o projeto ou equipe âncora não for localizado durante uma busca, é terminantemente proibido ao agente operar em issues de outras equipes ou criar tarefas órfãs sem atribuição de projeto. Qualquer falha de ancoragem exige alinhamento explícito com o humano.

---

## Artigo 14 — Governança de Reúso, Tokens de Movimento, Component-as-Asset e Teto Anti-Monólito

1. **Princípio *Reuse-Before-Create* (Extensão do Artigo 1.2):** É expressamente proibido ao agente recriar componentes primitivos de interface (botões, inputs, cards, modais, skeletons, toasts), transições visuais ou entidades de jogos *inline* quando já existir implementação ou token equivalente no projeto. Antes de propor código ou desenhar uma tela/cena, o agente deve consultar `docs/catalogo-reuso.md` e declarar o que será reutilizado.
2. **Tokens de Movimento e Fundação Obrigatória (Fatia 01):** Em todo projeto que envolva interface visual ou jogos (`web-ui`, `desktop`, `mobile`, `jogo`), a Fatia 01 (Fundação) deve obrigatoriamente definir os **Tokens Base** (cores semânticas, tipografia, espaçamentos, **durações e curvas canônicas de animação/easing**) e a árvore base de componentes ou prefabs antes de qualquer tela ou fase de negócio. É proibido o uso de valores arbitrários e durações de animação divergentes por rota.
3. **Padrão *Component-as-Asset* e Regra Objetiva de Extração:**
   - Primitivos de UI, transições/animações e entidades/mecânicas de jogos (inimigos, projéteis, áreas de dano, partículas, shaders, *tweens*) devem nascer componentizados ou pré-fabricados (Prefabs/Cenas) na **1ª ocorrência**.
   - Elementos específicos de tela ou regras de domínio repetidas devem ser extraídos obrigatoriamente na **2ª ocorrência**.
4. **Catálogo Vivo de Reúso com Sensor Anti-Apodrecimento:** O repositório mantém `docs/catalogo-reuso.md` com 1 linha por item em 4 tabelas canônicas. O auditor determinístico bloqueia commits que apaguem ou renomeiem arquivos citados no catálogo sem a devida atualização do índice, ou que insiram ponteiros para caminhos inexistentes no disco.
5. **Sensor Anti-Monólito (> 350 Linhas Úteis) com Catraca Inteligente:**
   - Nenhum arquivo de código de produção novo pode ultrapassar o teto estrito de **350 linhas úteis** (medidas com descarte de linhas em branco e comentários por sintaxe de linguagem, reconhecendo `.gd` e contando anotações de atributos em Rust e diretivas em C#).
   - **Catraca para Código Legado:** Arquivos preexistentes em `HEAD` que já excediam o teto só podem ser alterados se o commit mantiver ou reduzir suas linhas úteis; qualquer acréscimo de linhas é sumariamente bloqueado (`exit 1`).
   - **Válvula de Exceção Justificada:** Em casos raros de algoritmos ou tabelas indivisíveis, permite-se o marcador `governanca:arquivo-extenso-justificado: <motivo técnico de pelo menos 15 caracteres>`, exposto obrigatoriamente pelo verificador e destacado no Gate 2 para validação humana (e fiscalizado pela Auditoria Forense quando acionada).
<!-- governanca:fim -->

## Cláusulas Adicionais Deste Projeto

*(Adicione abaixo cláusulas pétreas específicas deste projeto, como conformidade regulatória LGPD/GDPR, SLAs específicos ou integrações obrigatórias. Este bloco é preservado durante as atualizações da governança).*
