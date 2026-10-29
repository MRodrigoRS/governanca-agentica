---
name: inicializar-stack
description: Conduz entrevista exaustiva de produto (multi-rodadas), refina o que entra e o que sai do escopo, recomenda stacks/VPS/MCPs do catálogo oficial, instala a base no Gate 0 e decompõe o sistema inteiro em fatias incrementais detalhadas em openspec/roadmap/.
---

# Skill: Inicializar Stack e Decompor Sistema em Fatias (Gate 0)

Esta skill orienta o agente na configuração inicial de um repositório novo (greenfield). O papel do agente aqui é atuar como **Arquiteto de Produto e Engenheiro Principal**: extrair toda a visão da cabeça do usuário (mesmo que ele seja leigo tecnicamente), polir o escopo até eliminar pontos cegos, escolher a stack + infraestrutura e **fatiar o sistema inteiro em entregas incrementais altamente detalhadas**.

---

## Passo 1 — Entrevista Exaustiva de Descoberta e Polimento (Multi-Rodadas)

> **PROIBIÇÃO DE ENTREVISTA RASA:** Nunca se limite a um formulário superficial de 1 mensagem quando o usuário descrever um sistema amplo. Conduza quantas rodadas de conversa forem necessárias até que todas as pontas do sistema estejam claras e polidas.

### Rodada 1: Visão Completa e Fluxo de Ponta a Ponta
Peça ao usuário para contar livremente tudo o que ele imagina funcionando no sistema final, sem se preocupar com termos técnicos:
1. **Problema, Usuários e Telas Imaginadas:** O que o usuário vê quando entra no sistema? Quais áreas existem (ex.: chat estilo WhatsApp, Kanban de funil, painel de gráficos, cadastro de agentes/presets)?
2. **Canal Principal:** SaaS Web Fullstack, Programa de Computador Desktop, Painel Interno/Dashboard, API, Mobile iOS/Android ou CLI.
3. **Automações e Comportamentos Inteligentes:** O que deve acontecer sozinho por trás dos panos (ex.: IA respondendo, selos identificando quem respondeu, mensagens agendadas, cards mudando de coluna sozinhos)?

### Rodada 2: Desafio Construtivo, Casos de Borda e Poda de Escopo ("O que entra vs. O que sai")
Analise criticamente o que o usuário pediu e faça perguntas investigativas para polir o produto:
1. **Pontos Cegos e Conflitos:** Aponte situações que o usuário ainda não pensou (ex.: *"Se um atendente humano assumir a conversa no meio, a IA deve pausar automaticamente?"*, *"O que acontece se a conexão cair no meio de um envio agendado?"*).
2. **Sugestões de Alto Valor:** Sugira melhorias práticas que combinam naturalmente com a ideia dele.
3. **Corte e Poda de Exageros:** Ajude o usuário a descartar ou adiar ideias que trariam complexidade desproporcional sem valor imediato. Tudo o que for descartado deve ser anotado para ir à seção **"Fora de Escopo / Descartado no Polimento"** do `openspec/project.md`.

### Rodada 3: Tradução Invisível para Arquitetura, Stack, VPS e MCPs
O usuário não precisa saber configurar servidores ou escolher bancos de dados. Traduza o produto polido em arquitetura real consultando [references/catalogo-stacks.md](references/catalogo-stacks.md) e apresente em português claro:
- **Opção Recomendada e Alternativa:** Framework principal, banco de dados, filas (ex.: Redis/BullMQ para agendamentos), tempo real (WebSockets/SSE) e design system (`shadcn/ui`).
- **Web Responsiva e Portabilidade PWA Inatas (Artigo 6, item 6):** Se o canal principal for Web, garanta que a stack inclua suporte nativo a layouts responsivos (mobile-first 320px+) e manifesto/metadados para PWA instalável.
- **Estratégia de Hospedagem e Operação Assistida (MCPs / CLIs / SSH):** Explique como o próprio agente configurará o banco e o servidor (ex.: via **Supabase MCP**, **Coolify/Dokploy via SSH/CLI** ou **Railway/Vercel CLI**) sem exigir que o humano saiba operar painéis complexos de VPS.
- **Justificativa Anti-Brinquedo:** Demonstre conformidade com o Artigo 1 da `constitution.md`.

---

## Passo 2 — Decomposição em Fatias Incrementais Detalhadas (`openspec/roadmap/`)

Antes de fechar o Gate 0, o agente **DEVE** dividir o sistema completo em fatias lógicas e naturalmente incrementais, na ordem exata de engenharia em que **uma ponta puxa a outra** (ex.: *Fatia 01: Fundação e Banco Base* $\rightarrow$ *Fatia 02: Funis e Kanban* $\rightarrow$ *Fatia 03: Inbox Tempo Real e Selos* $\rightarrow$ *Fatia 04: Webhooks Externos* $\rightarrow$ *Fatia 05: Agentes de IA e Presets* $\rightarrow$ *Fatia 06: Agendamentos em Fila* $\rightarrow$ *Fatia 07: Gráficos e Métricas*).

> **CLÁUSULA ANTI-PREGUIÇA (OBRIGATÓRIA):**
> 1. É **terminantemente proibido** resumir o planejamento em uma lista comprimida de 1 linha por fatia ou jogar tudo dentro de um único `.md` superficial.
> 2. Para **cada fatia** do mapa, o agente deve criar um arquivo individual `openspec/roadmap/fatia-XX-<slug>.md` seguindo rigorosamente todas as 7 seções de `openspec/roadmap/_template-fatia.md`.
> 3. **Teste do Agente Executor:** Cada arquivo `fatia-XX-<slug>.md` deve detalhar tabelas, colunas em PT-BR, schemas Zod/Pydantic, estados de tela (`loading`, `empty`, `error`, `success`), regras de negócio e lista de testes automatizados com tanta clareza que **até um modelo de IA mais fraco ou uma sessão nova consiga implementá-la sem adivinhar nada**.

---

## Passo 3 — Gate 0 (Aprovação Humana da Stack e do Mapa de Fatias)

> **PARADA OBRIGATÓRIA:** É expressamente proibido rodar comandos de instalação da stack sem a confirmação explícita do humano.
> Apresente ao humano:
> 1. O resumo do escopo polido (o que entra e o que foi descartado).
> 2. A stack e estratégia de hospedagem/MCPs recomendadas.
> 3. A sequência de fatias criadas em `openspec/roadmap/fatia-XX-*.md`.
> Pergunte: *"Você aprova esta stack e o nosso Mapa de Fatias Incrementais para inicializarmos o projeto?"*

---

## Passo 4 — Execução do Scaffolding Oficial

Após a aprovação no Gate 0:
1. Verifique a documentação oficial recente da ferramenta para garantir o comando correto.
2. Execute o CLI oficial da stack selecionada.
3. Se o CLI criar uma subpasta, mova os arquivos necessários para a raiz do repositório, garantindo que os arquivos da governança (`AGENTS.md`, `constitution.md`, `openspec/`, `scripts/`, `docs/adr/`, `lefthook.yml`) sejam preservados intactos.

---

## Passo 5 — Prova de Saúde da Base, OpenSpec e Ativação dos Hooks

Imediatamente após a instalação:
1. Instale as dependências com o gerenciador de pacotes da stack.
2. Inicialize as integrações nativas de ferramentas do OpenSpec para gerar as skills e comandos `/opsx-*`:
   ```bash
   npx --yes @fission-ai/openspec init --tools antigravity,claude,cursor,gemini,github-copilot,agents --no-animation --no-copilot-cloud
   ```
3. Instale as Agent Skills oficiais da stack escolhida via padrão aberto da indústria:
   ```bash
   # Exemplo para React/Next.js/Node:
   npx --yes skills add vercel-labs/agent-skills
   # Ou para stacks com skills dedicadas (Supabase, Playwright, etc.)
   ```
4. Ative os Git hooks determinísticos da governança executando `npx lefthook install`.
5. Execute a suíte de testes padrão da stack para comprovar que a base nasceu 100% verde.
6. Execute `node scripts/verificar-governanca.mjs` e o comando de build para assegurar que não há falhas estruturais nem violações.

---

## Passo 6 — Sedimentação da Documentação e Commit de Fundação (Marco 1)

1. Preencha completamente as seções 1, 2 e 3 do arquivo `openspec/project.md` (Visão Polida, Stack/MCPs e Tabela do Mapa de Fatias Incrementais apontando para `openspec/roadmap/fatia-XX-*.md`).
2. Atualize `CHANGELOG.md` na seção `### Adicionado` registrando a inicialização da stack e a sedimentação da documentação e fatiação inicial.
3. **Marco 1 da Rotina de Commits (Sedimentação e Fundação com Aprovação Humana — Artigo 11):**
   - Apresente ao humano a base instalada e o conjunto de fatias sedimentadas.
   - Pergunte: *"A documentação inicial, stack e o Mapa de Fatias em `openspec/roadmap/` estão totalmente sedimentados e testados verdes. Você aprova a realização do nosso commit de fundação inicial?"*
   - **Somente após a aprovação humana explícita**, realize o commit de fundação:
     ```bash
     git add .
     git commit -m "feat(fundacao): inicializa projeto com stack <nome> e roadmap de fatias"
     ```
4. Informe o humano que a fundação está commitada e protegida, e **já apresente imediatamente a abertura da Fatia 01** (`npx --yes @fission-ai/openspec new change fatia-01-...`) usando o plano detalhado em `openspec/roadmap/fatia-01-*.md`.
