<!-- governanca:inicio v3.0.0 — não edite este bloco; alterações no repositório da governança -->
# Constituição do Projeto — Governança

> **Papel:** Lei Suprema do repositório. Cláusulas pétreas obrigatórias para agentes de IA e desenvolvedores humanos.
> **Enforcement:** Estas cláusulas não são sugestões textuais. São auditadas determinísticamente por Lifecycle Hooks dos Agentes (`.agents/hooks.json` e `.claude/settings.json`), Git hooks locais (`Lefthook + Gitleaks + verificar-governanca.mjs`) e pelo GitHub Actions CI. Qualquer violação bloqueia commits e builds (`exit 1` / `deny`).

---

## Artigo 1 — Cláusula Anti-Brinquedo (Bases Robustas)

1. É expressamente proibido iniciar qualquer aplicação interativa (Web, Programa de Computador Desktop ou Mobile) com arquivos avulsos (como HTML/CSS/JS soltos na web ou scripts amadores num único arquivo no desktop), sem tipagem estrita, sem empacotamento profissional e sem componentes reutilizáveis.
2. Toda aplicação interativa parte obrigatoriamente de uma stack do catálogo oficial (ou aprovada no Gate 0) e deve garantir desde o primeiro commit:
   - **Tipagem Estrita:** TypeScript com `"strict": true` em `tsconfig.json`, Rust, C#/.NET ou Python com type hints completos validados por `mypy` ou `pyright`.
   - **Validação de Entradas na Fronteira:** Esquemas declarativos (ex.: Zod no ecossistema JS/TS, Pydantic em Python, Serde em Rust) validando dados externos em rotas de API, pontes IPC (Desktop), formulários, parâmetros de URL, cookies e webhooks.
   - **Design System Modular:** Interface construída com base em componentes consistentes e reutilizáveis (ex.: Tailwind CSS + shadcn/ui ou equivalente nativo).
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

---

## Artigo 3 — Zero Testes Quebrados e Zero Avisos Críticos

1. A suíte de testes deve estar 100% verde antes de qualquer solicitação de commit ou encerramento de tarefa.
2. Commits com testes falhando ou avisos críticos de linter/tipagem serão rejeitados imediatamente pelos hooks determinísticos.

---

## Artigo 4 — Zero Segredos em Código

1. Nenhuma chave de API, senha, token de autenticação, certificado ou credencial sensível deve ser comitada no repositório.
2. Todo segredo deve residir em variáveis de ambiente (`.env`), devidamente declaradas e documentadas em `.env.example` e ignoradas em `.gitignore`.
3. Commits contendo segredos em texto plano serão bloqueados pelo Gitleaks no hook de pré-commit e pelo CI.

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

---

## Artigo 7 — Padrões Práticos de Engenharia Backend e Zero-Trust

1. **Zero-Trust no Cliente (Anti-F12):** Nunca confie em validações, identidades ou regras de negócio validadas apenas no cliente. O backend deve validar e autorizar rigorosamente cada requisição antes de persistir dados.
2. **Integridade Transacional (ACID):** Operações que envolvem alterações em múltiplos registros ou tabelas devem ser encapsuladas em transações atômicas de banco de dados.
3. **Segurança de Tráfego e Cabeçalhos:** Ambientes de produção devem aplicar cabeçalhos de segurança essenciais: Content Security Policy (CSP), HTTP Strict Transport Security (HSTS) e CORS estritamente configurado.
4. **Prevenção de Abuso:** Endpoints públicos e operações sensíveis (login, recuperação de senha, pagamentos, geração de IA) devem implementar Rate Limiting determinístico.
5. **OWASP Top 10 e OWASP Agentic Top 10:** Proteção ativa contra injeção SQL/NoSQL, CSRF, SSRF, injeção de prompt indireta e execução inadvertida de ferramentas por agentes autônomos.

---

## Artigo 8 — Honestidade Radical, Fatias Detalhadas (Anti-Preguiça) e Gates Humanos

1. O agente nunca deve fingir que testou, esconder bugs conhecidos ou adular decisões equivocadas.
2. **Entrevista Exaustiva e Decomposição em Fatias Incrementais:** O humano não tem obrigação de saber dividir um sistema complexo na ordem técnica de implementação. É dever exclusivo do agente conduzir uma entrevista exaustiva de produto (polindo o que entra e o que fica de fora) e decompor o sistema completo em fatias incrementais onde uma ponta puxa a outra.
3. **Cláusula Anti-Preguiça no Planejamento e Subfatias Alfanuméricas:** É proibido comprimir o planejamento das fatias em listas superficiais. Toda fatia deve ser especificada em seus 4 pilares auditados pelo OpenSpec (`proposal.md`, `specs/`, `design.md` e `tasks.md` em `openspec/changes/<fatia>/`), detalhada o suficiente para que até um agente mais simples consiga implementá-la sem adivinhar regras, e registrada no bloco correspondente em `openspec/roadmap.md` (ou bloco de subfatia alfanumérica `fatia-XXa-<slug>` no caso de encaixes).
4. **Refinamento de Meio de Caminho e Subfatias Alfanuméricas:** Quando novas ideias ou mudanças surgirem durante o projeto, o agente é obrigado a intervir via skill `refinar-ideia` (raio-X de complexidade oculta e poda construtiva). Se a novidade for um complemento natural de uma fatia pendente, ela deve ser encaixada imediatamente após a fatia-mãe como subfatia alfanumérica (ex.: `fatia-02a-<slug>`), aproveitando o contexto de código fresco sem reordenar as fatias subsequentes e mantendo 100% de compatibilidade com o OpenSpec.
5. São marcos obrigatórios com intervenção humana:
   - **Gate 0:** Aprovação do escopo polido, da stack tecnológica/VPS/MCPs e do Mapa de Fatias Incrementais com Invariantes Globais (`openspec/roadmap.md`).
   - **Gate 1:** Aprovação do plano, desenho técnico e tarefas antes da implementação de Nível 2.
   - **Gate 2:** Aprovação da entrega mediante: (1) auditoria factual prévia (Subagente Inspetor Forense em inspeção cega + Duelo de Conformidade pelo Agente Principal contra o roadmap físico), (2) resumo do que foi entregue, (3) Roteiro de Teste Prático Passo a Passo (onde está, como testar com dados de exemplo e comportamento visual esperado), (4) evidências reais de testes automatizados (vermelho/verde), (5) diff limpo e `CHANGELOG.md` atualizado, seguida pelo acionamento proativo da próxima fatia da fila.

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

1. **Proibição de Commits Avulsos ou Prematuros:** É estritamente proibido ao agente realizar commits arbitrários, automáticos ou incompletos no meio do desenvolvimento ("work in progress" soltos, testes quebrados ou sem autorização). O motor da IDE intercepta comandos de commit via Lifecycle Hooks (`.agents/hooks.json` e `.claude/settings.json`) forçando confirmação humana (`force_ask`).
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
4. **Auditoria Factual Cega Pré-Gate 2:** Concluída a implementação de qualquer fatia, é mandatório acionar o **Subagente Inspetor Forense** (`inspetor-forense`) para inspecionar cegamente o código modificado (`git diff`) sem ler a proposta ou especificações, traduzindo em linguagem literal e factual tudo o que o código implementou, validou ou omitiu. Em seguida, o **Agente Principal** cruza o relatório factual ponto a ponto contra os artefatos físicos da fatia em `openspec/changes/<fatia>/` e o bloco de roadmap (Duelo de Conformidade). Havendo omissões ou divergências, o executor deve corrigir o código antes de qualquer apresentação ao humano; o commit só pode ser solicitado após a conformidade comprovada.
5. **Higiene de Contexto Preventiva:** Para prevenir a degradação de contexto (*Context Rot*), ao concluir o Gate 2 de uma entrega, o agente deve orientar formalmente o humano a renovar a sessão (`/compact` ou abertura de nova conversa limpa) antes de puxar a próxima fatia da fila.

---

## Artigo 13 — Isolamento Multi-Squad, Tríade de Âncora e Handshake de Integrações

1. **Tríade de Âncora Obrigatória:** Todo projeto integrado a ferramentas compartilhadas de gestão de tarefas (ex.: Linear via MCP) deve possuir sua âncora imutável registrada em `openspec/project.md`, composta obrigatoriamente por:
   - **Workspace:** slug e URL da organização/conta.
   - **Equipe:** chave (`KEY`), nome e UUID da equipe proprietária.
   - **Projeto:** nome, identificador (`P-XXX`) e UUID do projeto.
2. **Handshake Pré-Operação com `whoami`:** É expressamente proibido ao agente emitir qualquer instrução de leitura ou escrita no Linear sem antes disparar a ferramenta `whoami` para verificar a identidade e o workspace ativo na sessão.
3. **Bloqueio Determinístico por Divergência de Workspace:** Se o workspace ativo retornado pelo `whoami` divergir do registrado na Tríade de Âncora, o agente deve interromper imediatamente a operação, emitir um alerta de contenção ao humano e recusar-se a prosseguir.
4. **Proibição Absoluta de Fallback Silencioso:** Se o projeto ou equipe âncora não for localizado durante uma busca, é terminantemente proibido ao agente operar em issues de outras equipes ou criar tarefas órfãs sem atribuição de projeto. Qualquer falha de ancoragem exige alinhamento explícito com o humano.
<!-- governanca:fim -->

## Cláusulas Adicionais Deste Projeto

*(Adicione abaixo cláusulas pétreas específicas deste projeto, como conformidade regulatória LGPD/GDPR, SLAs específicos ou integrações obrigatórias. Este bloco é preservado durante as atualizações da governança).*
