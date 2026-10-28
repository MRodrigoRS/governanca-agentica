<!-- governanca:inicio v2.0.0 — não edite este bloco; alterações no repositório da governança -->
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
4. **Convenção de Idioma (Artigo 10):** Nomes de entidades, regras de negócio, tabelas, variáveis, funções, documentação e mensagens de commit em **Português do Brasil (PT-BR)** (ex.: `obterUsuario`, `salvarPedido`). Termos técnicos universais de frameworks (`id`, `payload`, `props`, `token`, `status`, `req`, `res`) permanecem em **Inglês (EN)**.

---

## 2. Diagnóstico Inicial e Condução Incremental

Ao ser iniciado em um repositório, identifique o estado atual antes de agir:
- **Repositório Greenfield (sem stack):** Acione imediatamente a skill `.agents/skills/inicializar-stack/SKILL.md`. Conduza uma **entrevista exaustiva (multi-rodadas)** para extrair a visão completa do sistema, polir o que entra e o que fica de fora, definir a stack/VPS/MCPs e **decompor o sistema inteiro em fatias incrementais detalhadas** (`openspec/roadmap/fatia-XX-*.md`) antes de executar o scaffolding no **Gate 0**.
- **Repositório Brownfield (código existente sem specs):** Mapeie a arquitetura atual em `openspec/project.md`, crie as especificações vivas iniciais em `openspec/specs/` e planeje as próximas fatias em `openspec/roadmap/` antes de alterar o código.
- **Projeto em Andamento (Modo Execução):** Verifique `openspec/project.md` (Mapa de Fatias Incrementais), `openspec list`, as tarefas abertas em `openspec/changes/` e `CHANGELOG.md` para retomar exatamente de onde parou e puxar a próxima fatia `[ ] Pendente` automaticamente.
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

## 4. Test-First Obrigatório e Circuit Breaker

1. **Ciclo Vermelho → Verde → Refatorar:** É estritamente proibido escrever código de produção sem antes escrever o teste automatizado correspondente.
2. **Evidência Obrigatória no Gate 2:** Toda entrega deve exibir a saída do terminal com o teste falhando pelo motivo correto e, em seguida, a saída com o teste passando verde.
3. **Circuit Breaker (3 Falhas):** Se uma tarefa falhar 3 vezes consecutivas no mesmo teste ou problema técnico, pare imediatamente. Não tente uma 4ª vez às cegas; descreva a hipótese, a causa raiz provável e solicite orientação do humano.

---

## 5. Os 3 Gates Humanos

- **Gate 0 (Escopo Polido, Stack e Mapa de Fatias):** Aprovação da entrevista exaustiva, da stack tecnológica/VPS/MCPs e das fatias incrementais detalhadas em `openspec/roadmap/fatia-XX-*.md`.
- **Gate 1 (Plano da Fatia Atual):** Aprovação da especificação, desenho técnico e tarefas da fatia ativa antes de codificar.
- **Gate 2 (Entrega e Próxima Fatia):** Aprovação das evidências de teste (vermelho/verde), diff limpo e `CHANGELOG.md` atualizado antes do commit final, seguida pela apresentação imediata da próxima fatia do mapa.

---

## 6. Recursos e Ferramentas

- **Cláusulas Pétreas:** Leia integralmente [constitution.md](constitution.md).
- **Radar Estratégico e Mercado:** Arquivo `openspec/radar-oportunidades.md` (concorrência, sinergias e ideias estacionadas).
- **Mapa de Fatias Incrementais:** Diretório `openspec/roadmap/` (cada fatia em seu próprio arquivo detalhado seguindo `_template-fatia.md`).
- **Especificações Vivas e Deltas:** Diretório `openspec/` gerenciado pelo OpenSpec CLI (`npx @fission-ai/openspec`).
- **Registros de Arquitetura (ADRs):** Diretório `docs/adr/` no formato MADR.
- **Skills Ativas:** Diretório `.agents/skills/` (`inicializar-stack`, `ciclo-especificacao`, `explorar-produto`, `atualizar-governanca`).
<!-- governanca:fim -->

## Regras Específicas Deste Projeto

*(Adicione abaixo as regras, convenções de arquitetura ou integrações específicas deste projeto. Este bloco é preservado durante as atualizações da governança).*
