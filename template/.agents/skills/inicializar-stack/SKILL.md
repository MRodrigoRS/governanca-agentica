---
name: inicializar-stack
description: Conduz entrevista estruturada de produto via protocolo oficial grill-me (árvore de decisão em rodadas com recomendação técnica), refina o que entra e sai do escopo, recomenda stacks/VPS/MCPs do catálogo oficial, instala a base no Gate 0 com skills oficiais upstream e decompõe o sistema inteiro em fatias incrementais detalhadas em openspec/roadmap/.
---

# Skill: Inicializar Stack e Decompor Sistema em Fatias (Gate 0)

Esta skill orienta o agente na configuração inicial de um repositório novo (greenfield). O papel do agente aqui é atuar como **Arquiteto de Produto e Engenheiro Principal**: interrogar ativamente a visão do usuário através do protocolo upstream **`grill-me`** (árvore de decisão em rodadas sucessivas), polir o escopo eliminando ambiguidades e pontos cegos, escolher a stack + infraestrutura e **fatiar o sistema inteiro em entregas incrementais altamente detalhadas**.

---

## Passo 1 — Entrevista Investigativa de Produto e Arquitetura via Protocolo `grill-me`

> **PROIBIÇÃO DE ENTREVISTA PASSIVA OU SUPERFICIAL:** Nunca se limite a um questionário de 1 mensagem nem a um monólogo que presume regras sem perguntar. A entrevista opera sob o protocolo rigoroso do **`grill-me` / `grilling`**:
> 1. Mapeie o sistema como uma **árvore de decisões** (*design tree*).
> 2. Conduza o interrogatório em **rodadas**. A **fronteira** (*frontier*) reúne apenas as decisões cujos pré-requisitos já foram respondidos.
> 3. Em cada rodada, numere as perguntas da fronteira e forneça **sempre** sua **resposta recomendada pré-mastigada com justificativa técnica** (`➡️`), formulada para que um "concordo" ou "sim" aceite a recomendação.
> 4. Aguarde as respostas do humano antes de abrir o próximo ramo.

### Rodada 1: Visão Central, Ator e Fronteiras de Domínio
O agente escuta a intenção inicial do usuário e abre as primeiras perguntas da fronteira:
- **Q1 — Problema & Ator Central:** Quem opera a aplicação e qual a dor primária resolvida de ponta a ponta?
- **Q2 — Canal & Portabilidade:** SaaS Web Fullstack, Programa Desktop, App Mobile, API pura ou CLI? (Se Web, exigir mobile-first 320px+ e PWA inato — Artigo 6).
- **Q3 — Automações e Comportamentos Assíncronos:** O que deve rodar sozinho por trás dos panos (IA, filas, cron jobs, webhooks, eventos)?

*Formato mandatório da rodada:*
```markdown
❓ **Q1 — Canal e Experiência Principal:** Vamos estruturar a aplicação como Web SaaS responsivo com suporte a PWA ou como aplicação Desktop nativa?
➡️ Recomendo Web SaaS (Next.js / Vite + Tailwind + shadcn/ui) com design mobile-first desde 320px e PWA inato para máxima acessibilidade e velocidade de distribuição.

---

❓ **Q2 — Modelo de Autenticação e Multi-Tenancy:** O sistema será multi-tenant (com contas/empresas isoladas por `organizacao_id`) ou mono-usuário?
➡️ Recomendo já instituir a chave `organizacao_id` nas entidades centrais desde o Gate 0 para evitar migrações destrutivas no futuro.
```

### Rodada 2: Desafio Crítico, Casos de Borda e Poda de Exageros
Com as respostas da Rodada 1 assentadas, o agente avança a fronteira para os pontos cegos que o humano normalmente não antecipa:
- **Falhas de Conexão e Serviços Externos:** O que acontece se o gateway falhar, a IA alucinar ou o webhook chegar duplicado?
- **Permissões e Colisões:** Papéis de acesso e comportamentos quando dois usuários alteram o mesmo dado simultaneamente.
- **Poda Construtiva (MVP Cirúrgico):** O agente recomenda o corte imediato de features acessórias (relatórios avançados, conciliações raras, customizações excessivas) que adicionariam 80% de esforço para < 20% de valor inicial. Registra os cortes na seção *"Fora de Escopo / Descartado no Polimento"* de `openspec/project.md`.

### Rodada 3: Tradução Invisível para Arquitetura, Stack, VPS e MCPs
Com as decisões de produto fechadas, o agente traduz o consenso para a arquitetura técnica consultando [references/catalogo-stacks.md](references/catalogo-stacks.md):
- **Stack Recomendada e Alternativa:** Framework, banco de dados relacional (Postgres/SQLite), filas/tempo real e design system.
- **Operação Assistida e MCPs:** Hospedagem (Docker + Coolify/Dokploy via SSH ou Supabase/Railway) e ferramentas determinísticas de operação.
- **Justificativa Anti-Brinquedo:** Demonstra conformidade estrita com o Artigo 1 da `constitution.md`.

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
3. Instale as Agent Skills oficiais via padrão aberto da indústria (`skills.sh`), incluindo o interrogador canônico `grill-me`:
   ```bash
   # Instalação canônica do interrogador e de skills de ecossistema
   npx --yes skills add mattpocock/skills --skill grill-me grilling -y
   npx --yes skills add vercel-labs/agent-skills -y
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
