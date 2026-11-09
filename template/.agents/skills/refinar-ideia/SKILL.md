---
name: refinar-ideia
description: Intervém quando surge uma nova ideia (no chat ou capturada no Linear pelo celular). Conduz interrogatório rigoroso via protocolo grill-me (árvore de decisão com respostas recomendadas), poda excessos (entra vs. sai), analisa afinidade no roadmap e encaixa a entrega como subfatia alfanumérica (ex.: fatia-02a) ou nova fatia inteira.
---

# Skill: Refinar Ideia e Podar Escopo (`refinar-ideia`)

Esta skill orienta o agente na intervenção preventiva quando o usuário propõe uma ideia nova, alteração de regras ou adição de funcionalidade durante o desenvolvimento do projeto — seja falada diretamente no chat ou capturada pelo celular no aplicativo móvel do Linear.

> **Postura do Agente:** Gerente de Produto Sênior e Arquiteto Crítico. É expressamente proibido aceitar ideias cruas ou presumir unilateralmente o que deve ser feito sem perguntar. O agente deve conduzir o interrogatório estruturado através do protocolo upstream **`grill-me`** (árvore de decisões em rodadas com respostas recomendadas), confrontar trade-offs e só então formalizar a poda e o encaixe no roadmap.

---

## 1. Quando Acionar Esta Skill

Esta skill deve ser acionada sempre que:
- O usuário disser *"tive uma ideia"*, *"vamos adicionar X"*, *"precisamos mudar Y"*, *"e se a gente fizesse Z?"*.
- O usuário pedir para sincronizar ou verificar ideias anotadas no celular via Linear: *"veja o que tem no Linear"*, *"puxe as ideias do celular"*, *"quais tarefas novas tem no Linear?"*, `/linear-inbox`.
- O usuário enviar os comandos `/refinar`, `/podar` ou `/grill-me`.
- O agente perceber que o usuário está solicitando uma funcionalidade não contemplada no planejamento original da fatia ativa.

> **REGRA DE OURO:** Enquanto esta skill estiver ativa, **nenhum arquivo de código de produção é criado ou alterado**. O objetivo é 100% de refinamento arquitetural e gestão de escopo.

---

## 2. Protocolo de Execução

### Passo 0 — Captura do Inbox Móvel do Linear (Mobile-to-Agent)
Se o acionamento for motivado por notas/ideias registradas no Linear (via celular ou web):
1. O agente consulta o servidor Linear MCP dentro do projeto ancorado em `openspec/project.md` (buscando issues em status `Backlog`, `Triage` ou `Todo`).
2. O agente apresenta as ideias encontradas em uma lista numerada para escolha do usuário:
   > *"📱 **Notas encontradas no Linear:**\n" +
   > "1. `[LIN-101]` Notificações por WhatsApp no agendamento\n" +
   > "2. `[LIN-102]` Exportar relatório em PDF com resumo mensal\n" +
   > "Qual delas gostaria de refinar e transformar em fatia agora?"*
3. O usuário seleciona a ideia desejada (ou o agente recomenda prioridade técnica). O título e a descrição da issue são carregados automaticamente como matéria-prima para o **Passo 1**.

---

### Passo 1 — Interrogatório de Domínio e Decisão via Protocolo `grill-me`

> **PROIBIÇÃO DE SUPOSIÇÃO UNILATERAL:** Ideias novas carregam nós ocultos de engenharia. Em vez de despejar monólogos ou tabelas prematuras, execute o protocolo **`grill-me` / `grilling`**:
> 1. Formule perguntas agrupadas em **rodadas** cobrindo a fronteira atual de decisões.
> 2. Cada pergunta deve trazer a **resposta recomendada pelo agente (`➡️`) com justificativa técnica**, formulada para que um "sim" ou "concordo" baste para aprovar.
> 3. Busque fatos do repositório por conta própria (lendo arquivos e schemas); **não pergunte ao humano o que o código já responde**.

*Estrutura mandatória do interrogatório:*
- **Rodada 1 (Ator, Gatilho e Efeito Colateral):**
  - Quem dispara essa ação e em qual tela/evento?
  - Isso invalida, altera ou depende de regras já entregues em fatias anteriores?
- **Rodada 2 (Casos de Borda e Falhas Críticas):**
  - O que acontece quando a conexão falha, a chave externa expira, o payload é inválido ou há concorrência simultânea?
  - Quais estados de UI (`loading`, `empty`, `error`, `success`), Toasts de mutação ou Modais destrutivos são exigidos (Artigo 6)?

*Exemplo prático de rodada:*
```markdown
❓ **Q1 — Momento do Disparo e Automação:** O envio da notificação no WhatsApp deve ocorrer imediatamente após a confirmação do agendamento ou em lote 1 hora antes?
➡️ Recomendo disparar imediatamente após a transação no banco através de uma fila em segundo plano (BullMQ/Redis), para não travar a resposta da requisição web caso a API do WhatsApp demore.

---

❓ **Q2 — Comportamento em Falha de Entrega:** Se o número do cliente for inválido ou a API externa falhar, como o sistema deve reagir?
➡️ Recomendo marcar o status do envio como `FALHA_ENTREGA` com log do erro e exibir um aviso discreto no painel do atendente, sem cancelar o agendamento em si.
```

---

### Passo 2 — Poda Construtiva e Desafio de Escopo ("O que ENTRA" vs. "O que FICA DE FORA")
Somente após assentar as respostas da árvore de decisões do `grill-me`, o agente aplica o princípio de Pareto (80% do valor essencial com 20% do esforço), dividindo a entrega:

| O Que ENTRA Agora (MVP Cirúrgico) | O Que FICA DE FORA (Podado / Adiado) | Justificativa do Corte |
|---|---|---|
| *Fluxo feliz direto e persistência do evento* | *Templates customizáveis, retentativas infinitas, relatórios analíticos* | *Traz 80% da complexidade com pouco valor imediato* |

O agente pergunta ao humano:
> *"Com base nas decisões alinhadas acima, você concorda com esta divisão de escopo para mantermos o projeto rápido e protegido?"*

---

### Passo 3 — Leitura Física e Análise de Afinidade no Roadmap
Após o alinhamento da poda com o humano:
1. O agente executa a leitura física (`read_file`) em `openspec/project.md` e em todas as fatias com status `[ ] Pendente` no diretório `openspec/roadmap/`.
2. O agente analisa a **afinidade de domínio**:
   - Essa novidade mexe nas mesmas tabelas, telas ou componentes de alguma fatia que ainda está na fila para ser construída?
   - Ou é um assunto totalmente novo e desconectado das fatias pendentes?

---

### Passo 4 — Decisão de Encaixe e Subfatia Alfanumérica Hierárquica

Com base na análise de afinidade, o agente propõe uma das 3 destinações formais:

#### Caso A: Extensão Natural de uma Fatia Pendente (Subfatia Alfanumérica `XXa`, `XXb`)
Se a novidade complementar o trabalho de uma fatia existente (ex.: a ideia envolve produtos e a `fatia-02-produtos-e-catalogo.md` ainda está pendente):
* **Não mande para o fim do roadmap!**
* Crie uma **subfatia alfanumérica hierárquica**: `openspec/roadmap/fatia-02a-<slug>.md` baseada em `_template-fatia.md`.
* **Vantagem:** A subfatia `02a` será executada imediatamente após a `02`, aproveitando o contexto fresco de código sem exigir renomear as fatias posteriores (03, 04, etc.) e mantendo 100% de compatibilidade com o OpenSpec CLI e Conventional Commits.
* Atualize a tabela em `openspec/project.md` inserindo a linha `fatia-02a` logo após a `02`.

#### Caso B: Domínio Independente (Nova Fatia Inteira ao Fim da Fila)
Se a novidade for um módulo novo e autônomo (ex.: um novo painel financeiro desconectado das fatias atuais):
* Crie o arquivo como a próxima fatia inteira no fim da fila: `openspec/roadmap/fatia-YY-<slug>.md`.
* Adicione-a ao final da tabela do Mapa de Fatias em `openspec/project.md`.

#### Caso C: Ideia Descartada ou Estacionada
Se no polimento o humano concordar que a ideia não deve entrar no roadmap agora:
* Registre a inteligência da discussão no arquivo `openspec/radar-oportunidades.md` na seção apropriada.
* *(Linear MCP):* Caso o MCP `linear` esteja configurado, crie a issue no Backlog/Triage do Linear para acompanhamento futuro da equipe.
* Nenhum arquivo de fatia é criado.

---

## 3. Formato da Proposta ao Humano

Ao concluir o protocolo, apresente a recomendação pronta:

```markdown
### 🎯 Refinamento da Ideia Concluído

- **Escopo Podado:** [Resumo em 2 frases do que entra].
- **Fatia-Mãe Identificada:** `openspec/roadmap/fatia-02-produtos.md` (Pendente).
- **Encaixe Recomendado:** Subfatia Alfanumérica `fatia-02a-variacoes-e-fotos.md`.
- **Por que agora?** Aproveita as tabelas e rotas de produtos que acabaram de ser especificadas na Fatia 02, sem mexer na numeração da Fatia 03.

Posso criar o arquivo `openspec/roadmap/fatia-02a-variacoes-e-fotos.md` com as 7 seções completas e registrar no roadmap?
```
