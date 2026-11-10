---
name: explorar-produto
description: Ativa o Modo de Ampliação e Estratégia de Produto (reunião de negócios sem código). Analisa o repositório atual, pesquisa concorrentes e mercado na web, descobre sinergias ("ouro barato") e encaminha decisões para openspec/roadmap/, openspec/radar-oportunidades.md ou Fora de Escopo.
---

# Skill: Modo de Ampliação e Estratégia de Produto (`explorar-produto`)

Esta skill coloca o agente no **Modo Divergente / Estratégico**. Não é uma entrevista de especificação técnica para codificar agora, mas uma **reunião de negócios e evolução de produto** onde agente e humano analisam o que já existe, olham para o mercado e decidem novos rumos.

> **CONGELAMENTO ESTRITO DE CÓDIGO (REGRA DE OURO):**
> Enquanto esta skill estiver ativa, é **terminantemente proibido** criar ou editar código de produção, alterar schemas de banco ou abrir pastas em `openspec/changes/`. O humano deve ter total liberdade para pensar alto, testar hipóteses e mudar de ideia sem que o agente tente programar no meio da conversa.

---

## Passo 1 — Radiografia Interna ("Olhar para Dentro")

Antes de opinar, leia silenciosamente o estado real do projeto:
1. `openspec/project.md` (visão atual, escopo aprovado, itens já descartados e Mapa de Fatias).
2. `openspec/radar-oportunidades.md` (pesquisas anteriores e ideias já estacionadas).
3. `openspec/specs/` e `openspec/roadmap.md` (ou arquivos legados `openspec/roadmap/fatia-*.md` se o projeto estiver em transição v3).
4. Identifique **Sinergias Arquiteturais ("Ouro Barato")**: quais tabelas, filas, integrações ou telas já existentes (ou planejadas) permitiriam criar recursos de altíssimo valor percebido com apenas ~10% a 20% de esforço adicional?

---

## Passo 2 — Inteligência de Mercado e Concorrência ("Olhar para Fora")

Quando o tema envolver evolução do produto, posicionamento ou novos módulos, utilize a ferramenta de busca na web em tempo real para investigar o nicho:
1. **Concorrentes Diretos e Referências Globais:** O que os líderes desse segmento oferecem?
2. **Dores Não Resolvidas e Reclamações:** Onde os sistemas atuais falham, são lentos, confusos ou caros demais?
3. **Diferenciais Matadores (Efeito "Uau", IA Prática e Retenção):** Que funcionalidades modernas (automações inteligentes, relatórios visuais, atalhos de produtividade, selos de transparência, templates/presets prontos) fariam o usuário escolher este sistema em vez dos concorrentes?

---

## Passo 3 — Mesa-Redonda Estratégica (Matriz Impacto vs. Esforço)

Conduza a conversa como um **Sócio Estrategista de Produto** (aplicando o Dever de Crítica da Constituição — sem bajular ideias ruins e apontando oportunidades reais). Organize as propostas na mesa em 3 categorias claras:

1. **Vitórias Rápidas (*Quick Wins* — Alto Impacto / Baixo Esforço):**
   - Funcionalidades que aproveitam o que o repositório já tem pronto ("uma ponta puxa a outra") e entregam valor imediato.
2. **Apostas Estratégicas (*Game Changers* — Alto Impacto / Médio-Alto Esforço):**
   - Módulos ou diferenciais que mudam o patamar competitivo do produto no mercado.
3. **Armadilhas de Complexidade (Baixo Impacto / Alto Esforço — Recomendação de Corte):**
   - Ideias que parecem atraentes à primeira vista, mas trazem manutenção pesada, custo oculto ou desviam do foco principal.

Debata livremente com o humano, combinando ideias, refinando fluxos de negócio e descartando excessos.

---

## Passo 4 — Fechamento da Reunião (As 3 Gavetas Oficiais)

Nenhuma conclusão estratégica pode evaporar no histórico do chat. Quando o humano decidir encerrar a sessão de ampliação (ou aprovar os rumos debatidos), classifique cada item discutido em uma das **3 Gavetas Oficiais**:

### Gaveta 1: Aprovada para o Plano Atual $\rightarrow$ Vira Bloco no Roadmap (`openspec/roadmap.md`)
* Para as funcionalidades que o humano decidiu incluir na fila de construção:
  1. Posicione a nova fatia na ordem lógica de dependência técnica no arquivo único `openspec/roadmap.md` (na seção de onda apropriada: Onda 1 Imediata ou Onda 2 Planejada).
  2. Adicione o bloco com o formato oficial:
     ```markdown
     ### fatia-XX-<slug>
     - **Objetivo**: [MVP cirúrgico do que entra]
     - **Critérios de Aceite**: [Comportamentos testáveis e verificáveis]
     - **Dependências Técnicas**: [Fatias prévias, tabelas ou integrações necessárias]
     - **Status**: [ ] Pendente
     ```

### Gaveta 2: Excelente Ideia para o Futuro $\rightarrow$ Vai para `openspec/radar-oportunidades.md`
* Para ideias promissoras que não devem furar a fila agora, além de toda a pesquisa de concorrência e sinergias descobertas na sessão:
  1. Atualize as seções 1 (Mercado/Concorrência), 2 (Sinergias) e 3 (Backlog Estratégico) em `openspec/radar-oportunidades.md`.
  2. Registre o resumo da reunião na seção 4 (`Histórico de Reuniões de Ampliação`).

### Gaveta 3: Ideia Descartada $\rightarrow$ Vai para "Fora de Escopo" em `openspec/project.md`
* Para ideias que vocês analisaram e decidiram rejeitar:
  1. Adicione na seção 1 de `openspec/project.md` (`Fora de Escopo / Descartado no Polimento`) com a justificativa de negócio/técnica, impedindo que futuras sessões percam tempo sugerindo a mesma ideia novamente.

---

## Passo 5 — Validação de Integridade Pós-Reunião

Se qualquer nova fatia tiver sido registrada em `openspec/roadmap.md`, execute:
```bash
node scripts/verificar-governanca.mjs
```
Para comprovar que o arquivo de roadmap atende à estrutura rolling wave e às regras de governança antes de retornar ao modo de execução (`ciclo-especificacao`).
