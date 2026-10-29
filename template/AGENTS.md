<!-- governanca:inicio v2.4.0 — não edite este bloco; alterações no repositório da governança -->
# Instruções Gerais para Agentes de IA — Governança v2

> **Papel:** Fonte única da verdade para todos os agentes e assistentes de IA que operam neste repositório.
> **Regra Suprema:** Obedeça integralmente a [constitution.md](constitution.md). Texto sozinho é intenção; quem audita e trava commits é o algoritmo determinístico da governança via Git hooks e CI.

---

## 1. Postura Profissional e Idioma

1. **Dever de Crítica e Honestidade Radical:** Nunca adulte elogios ou finja conformidade. Aponte falhas de arquitetura, inconsistências de requisitos e complexidade desnecessária antes de escrever código. Declare abertamente o que foi testado e o que não foi.
2. **Zero-Trust no Agente:** Todo commit é inspecionado por hooks determinísticos (`Lefthook + Gitleaks + verificar-governanca.mjs`). Se violar qualquer cláusula, o commit será recusado (`exit 1`).
3. **As 3 Posturas Sequenciais:**
   - **Produto:** Compreender o problema, regras de negócio e critérios de aceite sem discutir código.
   - **Arquitetura:** Definir contratos de dados, interfaces, schemas, riscos e registrar ADRs em `docs/adr/` quando a decisão for estrutural (Gate 1).
   - **Engenharia:** Escrever testes antes do código (Test-First), implementar a solução mínima, refatorar e apresentar evidências completas (Gate 2).
4. **Padrões de Engenharia Frontend e Web (Artigo 6):** Em todo desenvolvimento que envolva web, responsividade móvel (mobile-first a partir de 320px) e portabilidade como PWA instalável são inatos ao código e aos componentes, jamais tratados como retrabalho futuro.
5. **Convenção de Idioma (Artigo 10):** Nomes de entidades, regras de negócio, tabelas, variáveis, funções, documentação e mensagens de commit em **Português do Brasil (PT-BR)** (ex.: `obterUsuario`, `salvarPedido`). Termos técnicos universais de frameworks (`id`, `payload`, `props`, `token`, `status`, `req`, `res`) permanecem em **Inglês (EN)**.

---

## 2. Diagnóstico Inicial e Condução Incremental

Ao ser iniciado em um repositório, identifique o estado atual antes de agir:
- **Repositório Greenfield (sem stack):** Acione imediatamente a skill `.agents/skills/inicializar-stack/SKILL.md`. Conduza uma **entrevista exaustiva (multi-rodadas)** para extrair a visão completa do sistema, polir o que entra e o que fica de fora, definir a stack/VPS/MCPs e **decompor o sistema inteiro em fatias incrementais detalhadas** (`openspec/roadmap/fatia-XX-*.md`) antes de executar o scaffolding no **Gate 0**.
- **Repositório Brownfield (código existente sem specs):** Mapeie a arquitetura atual em `openspec/project.md`, crie as especificações vivas iniciais em `openspec/specs/` e planeje as próximas fatias em `openspec/roadmap/` antes de alterar o código.
- **Projeto em Andamento (Modo Execução):** Verifique `openspec/project.md` (Mapa de Fatias Incrementais), `openspec list`, as tarefas abertas em `openspec/changes/` e `CHANGELOG.md` para retomar exatamente de onde parou e puxar a próxima fatia `[ ] Pendente` automaticamente.
  * *Cláusula Pétrea — Proibido Deduzir de Cabeça (Artigo 12):* Nunca confie na memória do chat. Ao planejar, resumir, abrir delta ou iniciar a codificação, leia fisicamente `openspec/roadmap/fatia-XX-*.md` e cite trechos literais antes de propor mudanças ou codificar.
- **Novas Ideias ou Mudanças no Meio do Caminho (Refinamento e Poda — D25):** Se o usuário trouxer uma ideia ou solicitação de mudança durante o desenvolvimento, congele o código imediatamente e acione `.agents/skills/refinar-ideia/SKILL.md`. Conduza o raio-X de complexidade oculta, separe o que entra do que sai e, se houver afinidade com uma fatia pendente, encaixe-a como **subfatia decimal hierárquica (ex.: `fatia-02.1-<slug>.md`)**, preservando o grafo de dependências sem reordenar as fatias posteriores.
- **Modo de Ampliação e Estratégia de Produto (Reunião de Negócios sem Código):** Quando o humano quiser analisar o repositório, explorar novos rumos, pesquisar concorrentes/mercado ou descobrir funcionalidades sinergéticas, acione `.agents/skills/explorar-produto/SKILL.md`. Congele qualquer edição de código e encaminhe as decisões ao final nas 3 gavetas (`openspec/roadmap/`, `openspec/radar-oportunidades.md` ou Fora de Escopo).

---

## 3. Níveis de Cerimônia e Fluxo de Execução

| Critério | Nível 1 — Via Rápida (`/fix`) | Nível 2 — Ciclo Completo (Feature / Fatia Incremental) |
|---|---|---|
| **Escopo** | Bug pontual, correção estética, refatoração interna | Fatia do roadmap, nova funcionalidade, regra de negócio, schema/banco, nova rota/API |
| **Impacto em Specs** | Não altera `openspec/specs/` | Consome `openspec/roadmap/fatia-XX-*.md` e expande `openspec/specs/` |
| **Limite de Arquivos** | Até **3 arquivos** de produção (fora testes) | Sem limite (escopo fechado da fatia) |
| **Fluxo** | Diagnóstico → Teste que reproduz a falha → Código mínimo → Gate 2 | Ler `fatia-XX-*.md` → `openspec new` → **Gate 1** → Test-First → **Gate 2** → `openspec archive` → Puxar próxima fatia |

> **Trava de Escalonamento Automático:** Se durante um `/fix` o commit tocar em mais de 3 arquivos de produção, incluir novas dependências ou alterar o schema de banco sem um delta ativo em `openspec/changes/`, o algoritmo da governança travará o commit exigindo o Nível 2.

---

## 4. Test-First Obrigatório, Circuit Breaker e Roteiro de Validação Prática

1. **Ciclo Vermelho → Verde → Refatorar:** É estritamente proibido escrever código de produção sem antes escrever o teste automatizado correspondente.
2. **Evidência Obrigatória no Gate 2:** Toda entrega deve exibir a saída do terminal com o teste falhando pelo motivo correto e, em seguida, a saída com o teste passando verde.
3. **Roteiro Mandatório de Validação Prática (Proibido Despejar Apenas Logs):** É proibido encerrar uma tarefa apenas mostrando saídas de testes automatizados. O agente deve fornecer obrigatoriamente um roteiro claro: **o que foi entregue**, **onde está** (rota/tela/comando), **passo a passo com dados prontos de exemplo** e **o que o humano deve observar visualmente** na tela ou na resposta do sistema.
4. **Releitura Pré-Código Mandatória (Artigo 12):** Imediatamente antes de escrever o primeiro teste ou código de produção de uma fatia, o executor deve reler o arquivo físico `openspec/roadmap/fatia-XX-*.md` para assegurar que nenhum detalhe de contrato ou regra se perdeu por saturação de contexto.
5. **Circuit Breaker (3 Falhas):** Se uma tarefa falhar 3 vezes consecutivas no mesmo teste ou problema técnico, pare imediatamente. Não tente uma 4ª vez às cegas; descreva a hipótese, a causa raiz provável e solicite orientação do humano.

---

## 5. Rotina de Commits e Gates Humanos (Autorização Obrigatória — Artigo 11 e 12)

É expressamente proibido ao agente realizar commits avulsos, intermediários ou automáticos sem o consentimento humano. A rotina de commits é estruturada em dois marcos exclusivos:

- **Marco 1 — Fundação e Sedimentação Inicial (Gate 0):** Após a conclusão da entrevista exaustiva, validação da stack, scaffolding oficial e gravação das fatias detalhadas em `openspec/roadmap/fatia-XX-*.md` e `openspec/project.md`, o agente apresenta a base sedimentada ao humano e solicita aprovação para o commit de fundação:
  ```bash
  git commit -m "feat(fundacao): inicializa projeto com stack <nome> e mapa de fatias"
  ```
- **Gate 1 (Aprovação de Plano e Desenho Técnico):** Sem commit de código. Leitura física comprovada do roadmap, alinhamento de escopo, delta no OpenSpec e tarefas antes de codificar.
- **Marco 2 — Fechamento de Fatia ou Correção (Gate 2):** Ao término da implementação, o fluxo segue 2 níveis obrigatórios:
  1. **Auditoria pelo Agente Revisor Independente:** Antes de chamar o humano, o executor aciona o Revisor Independente (`.agents/skills/revisar-fatia/SKILL.md`) para auditar código vs. roadmap físico. Havendo ressalvas, o executor deve corrigir antes de incomodar o humano.
  2. **Apresentação ao Humano no Chat:** Com o parecer favorável do Revisor, o agente apresenta a entrega estruturada:
     * *O que foi entregue e valor funcional gerado.*
     * *📋 Parecer do Agente Revisor Independente (Aprovado sem ressalvas).*
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

## 6. Recursos e Ferramentas

- **Cláusulas Pétreas:** Leia integralmente [constitution.md](constitution.md).
- **Radar Estratégico e Mercado:** Arquivo `openspec/radar-oportunidades.md` (concorrência, sinergias e ideias estacionadas).
- **Mapa de Fatias Incrementais:** Diretório `openspec/roadmap/` (cada fatia em seu próprio arquivo detalhado seguindo `_template-fatia.md`).
- **Especificações Vivas e Deltas:** Diretório `openspec/` gerenciado pelo OpenSpec CLI (`npx @fission-ai/openspec`).
- **Registros de Arquitetura (ADRs):** Diretório `docs/adr/` no formato MADR.
- **Skills Ativas:** Diretório `.agents/skills/` (`inicializar-stack`, `ciclo-especificacao`, `refinar-ideia`, `explorar-produto`, `revisar-fatia`, `atualizar-governanca`).
<!-- governanca:fim -->

## Regras Específicas Deste Projeto

*(Adicione abaixo as regras, convenções de arquitetura ou integrações específicas deste projeto. Este bloco é preservado durante as atualizações da governança).*
