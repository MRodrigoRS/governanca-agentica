---
name: ciclo-especificacao
description: Conduz o desenvolvimento guiado por especificação (SDD) via OpenSpec, níveis de cerimônia (Via 1a /fix, Via 1b style, Via 1.5 Estrutural e Via 2 Feature), Test-First mandatório e Gates 1 e 2.
---

# Skill: Ciclo de Especificação e Desenvolvimento (SDD)

Esta skill orienta o agente em qualquer alteração de código no projeto, garantindo conformidade com a Constituição, níveis de cerimônia e Test-First com evidências.

---

## 1. Escolha do Nível de Cerimônia

Antes de iniciar, determine a via adequada conforme a Matriz de Cerimônia (D14 + D32):

### Via 1a — Correção Funcional Pontual (`fix`)
* **Quando usar:** Correção de bug de lógica ou cálculo.
* **Regra estrita:** Toca em **no máximo 3 arquivos de produção** (fora testes), **exige ao menos um arquivo de teste staged**, consulta `docs/catalogo-reuso.md` antes de tocar UI/cenas (Artigo 14) e **não altera** schemas de banco nem adiciona novos pacotes em `package.json`.
* **Fluxo:** Diagnóstico → Consulta a `docs/catalogo-reuso.md` (se UI/jogo) → Teste que reproduz a falha (**Vermelho**) → Código mínimo (**Verde**) → `CHANGELOG.md` em `### Corrigido` → Gate 2.

### Via 1b — Ajuste Estético / Copy (`style`)
* **Quando usar:** Ajuste de cores, fontes, classes CSS/Tailwind ou copy textual.
* **Regra estrita:** Toca em **no máximo 3 arquivos**, dispensa teste novo, mas é inspecionada pela heurística anti-contrabando (linhas adicionadas em código não podem conter condicionais, hooks, handlers ou I/O).

### Via 1.5 — Manutenção Estrutural Blindada (`refactor` / `perf` / `style` / `chore` / `build`)
* **Quando usar:** Refatoração interna que toque em **mais de 3 arquivos de produção** ou atualização/bump de versão de dependências já presentes em `package.json`.
* **Regra estrita:** Bloqueia terminantemente schemas ou migrações de banco, dependências inéditas, manifestos não-npm e linhas novas sob `### Adicionado` no `CHANGELOG.md`.

### Via 2 — Ciclo Completo (Feature / Nova Capacidade de Domínio)
* **Quando usar:** Nova funcionalidade de produto, regras de negócio inéditas, pacotes novos, rotas de API ou alterações no banco de dados.
* **Fluxo:** Exige delta formal no OpenSpec (`openspec/changes/fatia-XX-<slug>/`), Gate 1, Test-First e Gate 2.

---

## 2. Via 2 — Seleção da Fatia e Criação do Delta de Mudança

1. **Consulte a Fila de Fatias:** Leia `openspec/roadmap.md` e localize a próxima fatia com status `[ ] Pendente` (ou a fatia solicitada pelo humano).
2. **Leitura Física Obrigatória do Bloco da Fatia (Artigo 12 — Proibido Deduzir de Cabeça):**
   - É expressamente proibido resumir ou abrir delta com base apenas na memória da sessão. Execute a ferramenta de leitura física no bloco correspondente em `openspec/roadmap.md`.
   - Revise as 4 âncoras obrigatórias: `Depende de`, `Objetivo de Valor`, `O que ENTRA` e `O que FICA DE FORA`.
3. **Abra o Delta no OpenSpec:**
   ```bash
   npx --yes @fission-ai/openspec new change fatia-XX-<slug>
   ```
4. Preencha os arquivos da pasta criada em `openspec/changes/fatia-XX-<slug>/` atendendo aos cabeçalhos canônicos e linhas úteis mínimas auditados pela governança:
   - `proposal.md` (mín. 10 linhas): `## Por que` (ou `## Why`), `## O que muda` (ou `## What Changes`) e `## Fica de Fora` (ou `## Out of Scope`).
   - `specs/<dominio>/spec.md`: Deltas com cabeçalhos oficiais (`## ADDED Requirements`), `### Requirement:` e cenários `#### Scenario:` contendo `WHEN` e `THEN` (`GIVEN` recomendado).
   - `design.md` (mín. 18 linhas): `## Contratos, Dados e Schemas`, `## Interface e Estados Assíncronos` (loading, empty, error, success, Toasts e Modais, mais matriz `Reutilizar vs. Extrair Novo` consultando `docs/catalogo-reuso.md` conforme Artigo 14, ou `Não se aplica: <motivo>`) e `## Regras de Negócio e Segurança`.
   - `tasks.md` (mín. 12 linhas): Checklist `- [ ]` com marcação Test-First (`Vermelho` / `Red`), seção obrigatória `## Roteiro de Validação Prática` e seção `## Notas de Sessão` (decisões fora do plano, bloqueios e próximo passo acionável).
5. Marque o status da fatia como `[~] Em Andamento` em `openspec/roadmap.md`.

---

## 3. Etapa Clarify, Interrogatório grill-me e Registro de ADR

1. **Clarify e Protocolo grill-me (Esclarecer ambiguidades antes de desenhar):** Se a fatia ativa contiver contratos em aberto, múltiplos caminhos técnicos ou regras de negócio ambíguas, é proibido presumir a decisão. O agente deve conduzir uma rodada rápida de interrogatório **`grill-me`** (perguntas objetivas com recomendação técnica `➡️` e justificativa) para consolidar as respostas antes de submeter o plano no Gate 1.
2. **ADR (Decisão de Arquitetura):** Se a mudança introduzir um novo padrão estrutural, biblioteca fundamental ou modelo de persistência, crie um novo ADR em `docs/adr/` baseado em `template.md`.

---

## 4. Gate 1 — Aprovação do Plano da Fatia

> **PARADA OBRIGATÓRIA (Artigo 8 e Artigo 12.5):**
> Apresente a proposta, o desenho técnico e as tarefas da fatia atual (assegurando que todas as dúvidas e ambiguidades foram esgotadas no clarify/grill-me).
>
> **Apresentação por Artefato Interativo vs. Higiene de Chat:**
> - **Em harnesses com suporte a artefatos nativos (ex.: Antigravity):** É expressamente proibido despejar o plano longo em texto corrido no chat. Crie um artefato dedicado no diretório de artefatos denominado `plano-fatia-XX.md` com `RequestFeedback: true` (fornecendo o botão de ação e renderização rica de tabelas e diagramas). No chat, limite-se a uma mensagem concisa de no máximo 20 linhas apontando o link do artefato e fazendo a pergunta de parada.
> - **Em harnesses baseados em terminal/CLI puro (ex.: Claude Code, Cursor CLI):** Mantenha o chat estritamente conciso (≤ 20 linhas), destacando objetivo, escopo e apontando os caminhos físicos dos arquivos em `openspec/changes/fatia-XX-<slug>/`.
>
> Pergunte: *"Você aprova este plano e desenho técnico da Fatia XX para iniciarmos a implementação?"*
> **Nenhum código de produção deve ser escrito antes da aprovação do Gate 1.**
> 
> *(Sincronização Linear MCP):* Caso o MCP `linear` esteja configurado, execute o handshake mandatório `whoami` (Artigo 13), localize ou associe a issue correspondente no Linear (`[LIN-XXX] fatia-XXa-...`) e atualize seu estado para *In Progress*.
> 
> *(Fluxo Git Branch por Fatia):* Caso o projeto utilize o modo `fluxo_git: branch-por-fatia`, crie e migre para a branch da fatia antes de codificar (`git checkout -b feat/fatia-XX-<slug>`). No modo padrão `trunk`, permaneça na branch principal de desenvolvimento.

---

## 5. Implementação com Test-First Mandatório

> **RELEITURA PRÉ-CÓDIGO (Artigo 12):** Imediatamente antes de escrever o primeiro teste ou linha de código, o executor deve reler o bloco físico em `openspec/roadmap.md` e os arquivos do delta ativo para garantir fidelidade total aos contratos de dados, schemas e regras sem desvios de contexto.

Para cada item listado em `tasks.md`:
1. **Vermelho (Especificar):** Escreva o teste correspondente com asserções reais (sem `.only` ou testes ocos). Execute e capture o log da falha legítima.
2. **Verde (Faça Funcionar):** Implemente o código mínimo e direto de produção necessário para fazer o teste passar.
3. **Refatorar (Faça Direito):** Eleve a qualidade antes de ir para a próxima tarefa:
   - Reduza aninhamentos de `if/else` usando *early returns*;
   - Elimine trechos de código duplicados estruturalmente (DRY);
   - Garanta nomes de domínio em PT-BR (Artigo 10);
   - Teste mentalmente se a inversão de operadores quebraria o teste (prova de mutação).
4. **Circuit Breaker:** Se falhar 3 vezes seguidas no mesmo teste ou problema técnico, pare imediatamente e consulte o humano com os detalhes.

---

## 6. Gate 2 — Entrega com Evidências, Revisão Independente e Puxada da Próxima Fatia

Antes de finalizar a tarefa ou commit:
1. Valide a integridade do OpenSpec:
   ```bash
   npx --yes @fission-ai/openspec validate --all --no-interactive
   ```
2. Execute o auditor determinístico local:
   ```bash
   node scripts/verificar-governanca.mjs
   ```
3. Atualize o arquivo `CHANGELOG.md` na seção correspondente (`### Adicionado` ou `### Modificado`).
4. **Validação Determinística e Auditoria Sob Demanda (Artigos 8 e 12):** Execute a suíte completa de testes (`npm test`) comprovando aprovação verde. Para fatias críticas de alto risco, o usuário ou o agente podem acionar sob demanda a auditoria cega do Subagente Inspetor Forense através do comando `/revisar`.
5. **Apresentação do Gate 2 e Higiene de Contexto (Artigo 8 e Artigo 12.5):**
   - **Em harnesses com suporte a artefatos (ex.: Antigravity):** Crie um artefato dedicado `entrega-fatia-XX.md` contendo o relatório completo de entrega, comprovação dos testes executados e o Roteiro de Teste Prático Passo a Passo. No chat, publique apenas uma mensagem concisa (teto de ≤ 20 linhas) com o link do artefato, resumo executivo e a pergunta formal de autorização para commit.
   - **Em harnesses CLI:** Mantenha a resposta no chat em no máximo 20 linhas com o roteiro sintético e solicitação de autorização.
6. **Autorização Humana e Commit (Artigo 11):** Somente após a aprovação explícita humana, execute o commit e arquive a mudança:
   ```bash
   git add .
   git commit -m "feat(<escopo>): implementa fatia XX - <descrição em PT-BR>"
   npx --yes @fission-ai/openspec archive fatia-XX-<slug> -y
   ```
   *(Abertura de PR no modo branch-por-fatia):* Em projetos com `fluxo_git: branch-por-fatia`, envie a branch e abra o PR utilizando a CLI oficial `gh` (evitando MCPs de GitHub):
   ```bash
   git push origin feat/fatia-XX-<slug>
   gh pr create --fill --template .github/pull_request_template.md
   ```
7. Marque `[x] Concluído` no bloco de `openspec/roadmap.md` e puxe proativamente a próxima fatia da fila.
