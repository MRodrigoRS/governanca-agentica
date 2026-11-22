---
name: inicializar-stack
description: Conduz entrevista estruturada de produto via protocolo oficial grill-me (árvore de decisão em rodadas com recomendação técnica), refina o que entra e sai do escopo, recomenda stacks/VPS/MCPs do catálogo oficial, instala a base no Gate 0 com skills oficiais upstream e decompõe o sistema inteiro em fatias incrementais Rolling Wave em openspec/roadmap.md.
---

# Skill: Inicializar Stack e Decompor Sistema em Fatias (Gate 0)

Esta skill orienta o agente na configuração inicial de um repositório novo (greenfield) ou quando houver **ausência de produto/stack definidos**. O papel do agente aqui é atuar como **Arquiteto de Produto e Engenheiro Principal**: ao detectar ausência de produto, **ative automaticamente `.agents/skills/mesa-de-descoberta/SKILL.md`** em conjunto com esta skill para conduzir uma entrevista profunda e contínua via protocolo **`grill-me`** + lentes multi-especialistas, consolidando cada bloco de conhecimento em `docs/conhecimento/` (com permissão explícita humana) antes de escolher a stack + infraestrutura e **fatiar o sistema inteiro em entregas incrementais altamente detalhadas**.

---

## Passo 1 — Entrevista Investigativa Profunda e Contínua (Integrada à Mesa de Descoberta)

> **PROIBIÇÃO DE ENTREVISTA PASSIVA OU SUPERFICIAL:** Nunca se limite a um questionário de 1 mensagem nem a um monólogo que presume regras sem perguntar. Ao detectar ausência de produto/stack, opere em **modo contínuo** (integrado a `.agents/skills/mesa-de-descoberta/SKILL.md`) usando o protocolo **`grill-me` / `grilling`**:
> 1. Mapeie o sistema como uma **árvore de decisões** (*design tree*) sob lentes especialistas (`[Produto]`, `[Arquitetura]`, `[Dados & Escala]`, `[Segurança]`, `[UX]`, `[Negócio]`).
> 2. Os tópicos abaixo são **eixos progressivos (sem teto artificial de 3 rodadas)**: continue abrindo novas rodadas de perguntas e aprofundamento enquanto houver pontos abertos ou o usuário quiser escalar o produto.
> 3. Em cada rodada, numere as perguntas da fronteira e forneça **sempre** sua **resposta recomendada pré-mastigada com justificativa técnica** (`➡️`), formulada para que um "concordo" ou "sim" aceite a recomendação.
> 4. Aguarde as respostas do humano antes de abrir o próximo ramo.
> 5. **Regra Anti-Amnésia e Anti-Alucinação (Cristalização Incremental):** Sempre que você e o usuário chegarem a uma conclusão sólida sobre um tema durante a entrevista, proponha em 1–2 linhas extrair aquele consenso para um arquivo separado `docs/conhecimento/<NN>-<slug>.md` e atualizar `docs/conhecimento/INDICE.md` — gravando somente após **permissão explícita** do humano. Assim nenhum detalhe já esclarecido se perde no histórico do chat.

### Eixo 1: Visão Central, Ator e Fronteiras de Domínio
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

### Eixo 2: Desafio Crítico, Casos de Borda e Poda de Exageros
Com as respostas do Eixo 1 assentadas (aprofundadas em quantas rodadas forem necessárias), o agente avança a fronteira para os pontos cegos que o humano normalmente não antecipa:
- **Falhas de Conexão e Serviços Externos:** O que acontece se o gateway falhar, a IA alucinar ou o webhook chegar duplicado?
- **Permissões e Colisões:** Papéis de acesso e comportamentos quando dois usuários alteram o mesmo dado simultaneamente.
- **Poda Construtiva (MVP Cirúrgico):** O agente recomenda o corte imediato de features acessórias (relatórios avançados, conciliações raras, customizações excessivas) que adicionariam 80% de esforço para < 20% de valor inicial. Registra os cortes na seção *"Fora de Escopo / Descartado no Polimento"* de `openspec/project.md` (mantendo hipóteses futuras maduras preservadas em `docs/conhecimento/`).

### Eixo 3: Tradução Invisível para Arquitetura, Stack, VPS e MCPs (com Pesquisa Viva)
Com as decisões de produto fechadas, o agente conduz **Pesquisa Viva Obrigatória** (`context7`, `/llms.txt` ou busca web) usando [references/catalogo-stacks.md](references/catalogo-stacks.md) como **ponto de partida vivo** (nunca uma lista fechada ou resposta só de memória de treinamento):
- **Validação de Versões, Segurança e Mercado:** Confirme versões estáveis atuais, recomendações recentes do ecossistema, postura de segurança e eventuais pré-requisitos de toolchain nativa (ex.: MSVC/WebView2/`webkit2gtk` no Tauri v2) antes de recomendar.
- **Stack Recomendada e Alternativa:** Framework, banco de dados relacional (Postgres/SQLite), filas/tempo real e design system.
- **Operação Assistida e MCPs:** Hospedagem (Docker + Coolify/Dokploy via SSH ou Supabase/Railway) e ferramentas determinísticas de operação.
- **Justificativa Anti-Brinquedo:** Demonstra conformidade estrita com o Artigo 1 da `constitution.md` e lista as fontes consultadas (ou declara ambiente offline).

---

## Passo 2 — Invariantes Globais do Gate 0 e Fila de Fatias Rolling Wave (`openspec/roadmap.md`)

> **TRAVA ANTI-AMNÉSIA E ANTI-ALUCINAÇÃO (LEITURA FÍSICA OBRIGATÓRIA):**
> Antes de redigir `openspec/project.md` ou `openspec/roadmap.md`, é **expressamente proibido tentar lembrar de cabeça** o que foi decidido ao longo da entrevista no chat. Você **DEVE ler fisicamente** `docs/conhecimento/INDICE.md` e **todos os capítulos consolidados** em `docs/conhecimento/<NN>-<slug>.md` (se existirem), citando-os como fonte ao decompor as fatias para impedir esquecimentos e alucinações no plano.

Antes de fechar o Gate 0, o agente **DEVE** consolidar a arquitetura macro e dividir o sistema completo em fatias lógicas incrementais no arquivo único `openspec/roadmap.md`, na ordem exata de engenharia em que **uma ponta puxa a outra**:

1. **`## 1. Invariantes Globais do Gate 0`:** Tabela contendo decisões transversais inegociáveis:
   - Chave de Isolamento / Multi-tenancy (ex.: `organizacao_id` em todas as tabelas)
   - Modelo de Autenticação e Papéis (ex.: Supabase Auth / JWT com RBAC)
   - Filas, Tempo Real e Eventos Assíncronos (ex.: Redis + BullMQ)
   - Entidades Estruturantes do Domínio (nomes em PT-BR)
   - Convenção de Identificadores (ex.: UUID v4)
2. **`## 2. Fila de Fatias Incrementais (Rolling Wave)`:** Um bloco `### [ ] fatia-XX-<slug>` por fatia, contendo obrigatoriamente:
   - `Depende de:`
   - `Objetivo de Valor:`
   - `Entidades/Contratos Tocados:`
   - `O que ENTRA:` (mínimo de 3 itens nas próximas fatias; em projetos visuais/jogos, a Fatia 01 DEVE incluir a definição dos Tokens Base de cores, tipografia, durações e curvas de movimento em `docs/catalogo-reuso.md` conforme Artigo 14)
   - `O que FICA DE FORA:`
3. **Especificação Técnica Profunda Just-in-Time:** Contratos de API, schemas Zod/Pydantic, estados assíncronos de UI e tarefas Test-First nascem exclusivamente ao abrir o delta da fatia em `openspec/changes/fatia-XX-<slug>/` (eliminando a escrita duplicada).

---

## Passo 3 — Gate 0 (Aprovação Humana da Stack e do Roadmap)

> **PARADA OBRIGATÓRIA:** É expressamente proibido rodar comandos de instalação da stack sem a confirmação explícita do humano.
> Apresente ao humano:
> 1. O resumo do escopo polido (o que entra e o que foi descartado).
> 2. A stack e estratégia de hospedagem/MCPs recomendadas.
> 3. Os Invariantes Globais e a Fila de Fatias registradas em `openspec/roadmap.md`.
> Pergunte: *"Você aprova esta stack e o nosso Roadmap de Fatias Incrementais para inicializarmos o projeto?"*

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
2. Inicialize as integrações nativas de ferramentas do OpenSpec no Padrão Universal (`AGENTS.md` + `.agents/`) para gerar as skills e comandos `/opsx-*`:
   ```bash
   npx --yes @fission-ai/openspec init --tools antigravity,agents --no-animation --no-copilot-cloud
   ```
3. Instale as Agent Skills oficiais via padrão aberto da indústria (`skills.sh`), incluindo o interrogador canônico `grill-me` e skills específicas da stack escolhida (via `npx skills find <tecnologia>` para ecossistemas como Python, Rust, Tauri, Expo, Godot, etc.):
   ```bash
   # Instalação canônica do interrogador e descoberta dinâmica por stack
   npx --yes skills add mattpocock/skills --skill grill-me grilling -y
   npx --yes skills find <tecnologia-da-stack>
   # Exemplos web/TypeScript/Supabase/Playwright (quando aplicáveis):
   npx --yes skills add vercel-labs/agent-skills -y
   ```
4. Ative os Git hooks determinísticos da governança executando `npx lefthook install`.
5. Execute a suíte de testes padrão da stack para comprovar que a base nasceu 100% verde.
6. Execute `node scripts/verificar-governanca.mjs` e o comando de build para assegurar que não há falhas estruturais nem violações.

---

## Passo 6 — Sedimentação da Documentação e Commit de Fundação (Marco 1)

1. Preencha as seções 1 e 2 de `openspec/project.md` (Visão Polida e Stack/MCPs; a Seção 3 permanece como ponteiro para `openspec/roadmap.md`), atualize a seção `## Comandos do Projeto` em `AGENTS.md` com os comandos reais da stack instalada, inicialize os diagramas C4, Glossário e **Seção 5 (`Mapa Físico de Módulos`)** em `docs/arquitetura.md`, os comandos base de operação/deploy em `docs/runbook.md` e os ponteiros iniciais em `docs/catalogo-reuso.md`.
2. Atualize `CHANGELOG.md` na seção `### Adicionado` registrando a inicialização da stack e a sedimentação da documentação e fatiação inicial.
3. **Marco 1 da Rotina de Commits (Sedimentação e Fundação com Aprovação Humana — Artigo 11):**
   - Apresente ao humano a base instalada e o conjunto de fatias sedimentadas.
   - Pergunte: *"A documentação inicial, stack e o Mapa de Fatias em `openspec/roadmap.md` estão totalmente sedimentados e testados verdes. Você aprova a realização do nosso commit de fundação inicial?"*
   - **Somente após a aprovação humana explícita**, realize o commit de fundação:
     ```bash
     git add .
     git commit -m "feat(fundacao): inicializa projeto com stack <nome> e roadmap de fatias"
     ```
4. Informe o humano que a fundação está commitada e protegida, e **já apresente imediatamente a abertura da Fatia 01** (`npx --yes @fission-ai/openspec new change fatia-01-...`) lendo o bloco correspondente em `openspec/roadmap.md`.
