---
name: revisar-fatia
description: Executa a auditoria factual cega (Inspeção Forense) do código staged/não-commitado pelo Subagente e o Duelo de Conformidade contra o roadmap físico pelo Agente Principal antes do Gate 2.
---

# Skill: Revisar Fatia (Auditoria Factual Cega e Duelo de Conformidade)

Esta skill define o protocolo de auditoria de qualidade pré-Gate 2. Para eliminar o viés de confirmação e a preguiça de LLM ("carimbador de aprovações"), a auditoria é dividida em dois papéis estritamente separados:

```mermaid
flowchart TD
    A["Código Staged Não-Commitado (git diff)"] --> B["1. Subagente Inspetor Forense (Auditoria Cega)"]
    B -->|Traduz código em linguagem literal fria| C["Relatório Factual do Código"]
    C --> D["2. Agente Principal (Duelo de Conformidade)"]
    E["openspec/changes/<fatia>/ + openspec/roadmap.md"] --> D
    D -->|Cruza Fato Real vs. Requisito Escrito| F{"100% das regras e contratos atendidos?"}
    F -->|Não: Omissão / Divergência| G["Executor Corrige Código e Testes"]
    G --> A
    F -->|Sim: Conformidade Comprovada| H["Gate 2 com Evidência Factual Inegável"]
```

---

## 1. Papel 1: O Subagente Inspetor Forense (Auditoria Cega)

O Subagente Inspetor é convocado utilizando a definição oficial de subagente isolado (`.claude/agents/inspetor-forense.md` no Claude Code, `.github/agents/inspetor-forense.agent.md` no Copilot, ou `invoke_subagent` com perfil isolado no Antigravity).

A convocação é feita com instrução deliberadamente cega: **ele NÃO deve ler os artefatos de planejamento (`openspec/changes/`, `openspec/roadmap.md` nem arquivos legados de roadmap)**. Ele não sabe o que *deveria* ter sido feito, garantindo auditoria 100% imparcial.

### Missão do Inspetor:
Inspecionar o código modificado (`git diff` dos arquivos staged) e traduzir em **linguagem literal e factual** exatamente o que o código está fazendo na prática.

### Estrutura do Relatório Factual do Inspetor:
```markdown
### 🕵️ Relatório Factual do Código (Inspeção Forense Cega)

1. **Arquivos Tocados:**
   - Lista exata dos arquivos criados e modificados.
2. **Entidades, Banco e Schemas:**
   - Quais tabelas, colunas e enums foram criados? (Nomes literais exatos).
   - Quais schemas de validação de entrada/saída existem e quais campos exigem?
3. **Regras de Negócio e Validações Implementadas:**
   - O que o código realmente valida na prática? (Ex.: checa se e-mail tem `@`, se valor é maior que zero, etc.).
   - Quais checagens de autorização/permissão são feitas antes de persistir dados?
   - **Auditoria de `style` vs. `refactor`:**
     - Se o commit for categorizado como `style`: houve alteração em handlers, branches condicionais ou lógica funcional? (Proibido: `style` deve ser puramente cosmético/formatação).
     - Se o commit for categorizado como `refactor`: houve alteração em contratos públicos, schemas externos ou comportamento observável de negócio? (Refatoração deve preservar contratos existentes).
4. **Tratamento de Erros e Exceções:**
   - Quais exceções são tratadas e quais códigos HTTP/mensagens são retornados?
   - Existem blocos `catch` vazios ou erros engolidos silenciosamente?
5. **Interface e Estados Visuais (se aplicável):**
   - Quais rotas e componentes visuais foram adicionados?
   - Os 4 estados assíncronos (`loading`, `empty`, `error`, `success`) existem explicitamente no código?
   - As mutações de dados disparam notificações Toast temporárias de feedback (sucesso/erro)?
   - Há Modais de Confirmação protegendo ações destrutivas (exclusões, cancelamentos, desativações)?
   - Há indícios de `location.reload` ou atualizações forçadas de tela?
   - O layout é mobile-first e há manifesto PWA se for app web?
6. **Qualidade dos Testes, Mutação Mental e Saúde Estrutural:**
   - **Asserções Reais vs. Teatro de Testes:** Os testes validam resultados concretos de negócio e persistência, ou limitam-se a asserções fracas (`toBeDefined()`, mocks testando o próprio mock)?
   - **Prova de Mutação Mental:** Se um operador condicional crítico (`>=`, `&&`, `!==`) for invertido ou uma validação de guarda for comentada no código de produção, qual teste exato do diff falharia imediatamente? *(Se nenhum teste quebrar, aponte como fragilidade crítica).*
   - **Saúde Estrutural (CRAP & DRY):** Existem funções no diff com excesso de ramificações aninhadas (> 5 `if/else/switch`) sem testes proporcionais para cada ramo, ou blocos de lógica duplicados?
7. **Lacunas, Mocks e Pendências Factualmente Observadas:**
   - Há dados fictícios fixos no código (hardcoded mocks)?
   - Há funções vazias, retornos simulados ou comentários `TODO`/`FIXME` deixados?
```

---

## 2. Papel 2: O Agente Principal (Duelo de Conformidade)

O Agente Principal recebe o **Relatório Factual do Inspetor**, abre os artefatos da fatia ativa em `openspec/changes/<fatia>/` (`proposal.md`, `specs/`, `design.md`, `tasks.md`) e o bloco correspondente em `openspec/roadmap.md` (ou `openspec/roadmap/fatia-XX-*.md` se legado) e realiza o **Duelo Fato vs. Requisito**:

### Tabela do Duelo de Conformidade:
| Artefato de Planejamento | O que a Fatia Exigia | O que o Relatório Factual Provou | Status |
|---|---|---|---|
| **Design / Schema** | *Tabela `contatos` com colunas em PT-BR* | *Tabela `contatos` criada com `nome`, `email`, `telefone`* | ✅ Atendido |
| **Spec / Requisitos de UI** | *4 estados (`loading`, `empty`, `error`, `success`)* | *Componente possui skeletons, mensagem de lista vazia e toast de erro* | ✅ Atendido |
| **Spec / Regras de Negócio** | *Impedir e-mail duplicado por tenant* | *Validação no banco e na rota rejeitando duplicata com status 409* | ✅ Atendido |
| **Tasks / Test-First & Mutação** | *Testes automatizados cobrindo caso de borda* | *Testes cobrem mutação mental de cálculo e erro sem asserções ocas* | ✅ Atendido |

---

## 3. Decisão do Agente Principal

### Se Houver Divergência ou Omissão:
O Agente Principal **NÃO apresenta o Gate 2 ao humano**. Ele:
1. Implementa a regra ou estado que o relatório factual comprovou estar faltando.
2. Executa os testes automatizados garantindo que continuem passando verde.
3. Repete a inspeção factual se a alteração tiver sido substancial.

### Se 100% Conforme:
O Agente Principal anexa o resumo factual da auditoria e a comprovação de conformidade diretamente no chat do **Gate 2**, dando ao humano certeza matemática de que o código entrega exatamente o que a especificação pedia.
