---
name: ciclo-especificacao
description: Conduz o desenvolvimento guiado por especificação (SDD) via OpenSpec, níveis de cerimônia (Nível 1 /fix e Nível 2 Feature), Test-First mandatório e Gates 1 e 2.
---

# Skill: Ciclo de Especificação e Desenvolvimento (SDD)

Esta skill orienta o agente em qualquer alteração de código no projeto, garantindo conformidade com a Constituição, níveis de cerimônia e Test-First com evidências.

---

## 1. Escolha do Nível de Cerimônia

Antes de iniciar, determine o nível adequado:

### Nível 1 — Via Rápida (`/fix`)
* **Quando usar:** Correção de bug pontual, ajuste de estilo/CSS, refatoração interna de código ou correção de texto.
* **Regra estrita:** Toca em **no máximo 3 arquivos de produção** (fora testes) e **não altera** requisitos da base viva (`openspec/specs/`), novos pacotes em `package.json` ou schemas de banco.
* **Fluxo:**
  1. Identificar o defeito e a causa raiz.
  2. Escrever o teste automatizado que reproduz a falha.
  3. Executar o teste no terminal e registrar a saída com erro (**Vermelho**).
  4. Implementar o código mínimo necessário para corrigir.
  5. Executar o teste novamente e comprovar o sucesso (**Verde**).
  6. Atualizar `CHANGELOG.md` na seção `### Corrigido`.
  7. **Gate 2 (Apresentação Estruturada):** Apresentar ao humano o resumo do defeito corrigido, o **🧪 Roteiro de Teste Prático** (onde ver a correção, dados para testar e comportamento esperado), as evidências dos testes (vermelho/verde) e o diff limpo.
  8. **Marco 2 da Rotina de Commits (Artigo 11):** Somente após a aprovação humana explícita no Gate 2, realizar o commit: `fix(<escopo>): <descrição em PT-BR>`.

### Nível 2 — Ciclo Completo (Feature / Requisito)
* **Quando usar:** Qualquer funcionalidade nova, alteração de regras de negócio, nova dependência de biblioteca, alteração de banco de dados ou refatoração ampla.
* **Fluxo:** Detalhado nas seções seguintes.

---

## 2. Nível 2 — Seleção da Fatia e Criação do Delta de Mudança

1. **Consulte o Mapa de Fatias Incrementais:** Leia a seção 3 de `openspec/project.md` e localize a próxima fatia com status `[ ] Pendente` (ou a fatia solicitada pelo humano).
2. **Leia o Documento Detalhado da Fatia:** Abra `openspec/roadmap/fatia-XX-<slug>.md` e revise integralmente as 7 seções (Objetivo, Dependências, Contratos de Dados/Banco, Estados de UI, Regras Backend, Roteiro Test-First e Critérios de Aceite).
   - Se a fatia ainda não possuir seu arquivo detalhado em `openspec/roadmap/`, crie-o imediatamente seguindo `openspec/roadmap/_template-fatia.md` antes de prosseguir.
3. **Abra o Delta no OpenSpec:**
   ```bash
   npx @fission-ai/openspec new fatia-XX-<slug>
   ```
4. Preencha os arquivos da pasta criada em `openspec/changes/fatia-XX-<slug>/` sem resumos preguiçosos, desdobrando o conteúdo de `openspec/roadmap/fatia-XX-<slug>.md`:
   - `proposal.md`: O *porquê* da mudança, motivação, escopo fechado e o que fica de fora.
   - `specs/`: Deltas de especificação com cenários e requisitos de comportamento.
   - `design.md`: O *como* técnico, tabelas, schemas Zod/Pydantic, rotas e decisões técnicas.
   - `tasks.md`: Checklist sequencial e atômico de implementação (cada tarefa vinculada ao seu teste).
5. Marque o status da fatia como `[~] Em Andamento` em `openspec/project.md` e em `openspec/roadmap/fatia-XX-<slug>.md`.

---

## 3. Etapa Clarify e Registro de ADR

1. **Clarify (Esclarecer ambiguidades):** Revise a proposta e faça perguntas ao humano caso reste qualquer dúvida ou decisão de negócio em aberto antes de codificar.
2. **ADR (Decisão de Arquitetura):** Se a mudança introduzir um novo padrão estrutural, biblioteca fundamental ou modelo de persistência, crie um novo ADR em `docs/adr/` baseado em `template.md`.

---

## 4. Gate 1 — Aprovação do Plano da Fatia

> **PARADA OBRIGATÓRIA:** Apresente ao humano a proposta, o desenho técnico e as tarefas da fatia atual.
> Pergunte: *"Você aprova este plano e desenho técnico da Fatia XX para iniciarmos a implementação?"*
> **Nenhum código de produção deve ser escrito antes da aprovação do Gate 1.**

---

## 5. Implementação com Test-First Mandatório

Para cada item listado em `tasks.md` (seguindo a Seção 6 da fatia):
1. **Vermelho:** Escreva o teste correspondente. Execute e capture o log da falha legítima.
2. **Verde:** Implemente o código estritamente necessário para fazer o teste passar.
3. **Refatorar:** Ajuste nomes (em PT-BR conforme Artigo 10), tipos e garanta a limpeza do código.
4. **Circuit Breaker:** Se falhar 3 vezes seguidas no mesmo teste ou problema técnico, pare imediatamente e consulte o humano com os detalhes.

---

## 6. Gate 2 — Entrega com Evidências e Puxada Automática da Próxima Fatia

Antes de finalizar a tarefa ou commit:
1. Valide a integridade do OpenSpec:
   ```bash
   npx @fission-ai/openspec validate
   ```
2. Execute o auditor determinístico local:
   ```bash
   node scripts/verificar-governanca.mjs
   ```
3. Atualize o arquivo `CHANGELOG.md` na seção correspondente (`### Adicionado` ou `### Modificado`).
4. **Apresentação Obrigatória da Entrega no Chat (Gate 2):**
   É expressamente proibido apenas despejar logs ou perguntar aprovação sem roteiro prático. A mensagem DEVE conter:
   - **O que foi entregue:** Resumo claro do valor funcional construído nesta fatia.
   - **🧪 Roteiro de Teste Prático (Validação Humana):**
     * **Onde acessar:** URL exata (ex.: `http://localhost:3000/painel/contatos`), comando CLI ou tela/modal onde o recurso se encontra.
     * **Passo a passo mastigado:** Ações numeradas para reproduzir o fluxo.
     * **Dados prontos de exemplo:** Valores para preenchimento de campos ou payloads (prontos para copiar e colar).
     * **Comportamento visual esperado:** O que o humano deve observar acontecer (transição de estado, toast, listagem atualizada sem recarregar a tela).
     * **Teste de borda prático:** Como testar uma entrada inválida para confirmar a mensagem de validação amigável.
   - **Comprovação dos Testes Automatizados:** Saída do terminal com a falha legítima (vermelho) e o sucesso (verde).
   - **Resumo das Tarefas e Diff:** Tarefas de `tasks.md` concluídas e diff limpo dos arquivos alterados.
5. **Aprovação Final Humana (Marco 2 da Rotina de Commits — Artigo 11):**
   - Pergunte: *"A fatia XX está testada no terminal e validada pelo roteiro prático acima. Você aprova a entrega final para realizarmos o commit?"*
   - **Somente após a aprovação humana explícita**:
     - Arquive a mudança no OpenSpec para mesclá-la na base viva (`openspec/specs/`):
       ```bash
       npx @fission-ai/openspec archive fatia-XX-<slug>
       ```
     - Atualize o status da fatia para `[x] Concluída` em `openspec/project.md` e em `openspec/roadmap/fatia-XX-<slug>.md`.
     - Realize o commit da entrega respeitando o padrão em PT-BR:
       ```bash
       git commit -m "feat(<escopo>): <descrição clara em português>"
       ```
6. **Condução Proativa (Uma Ponta Puxa a Outra):** Imediatamente após o commit da fatia atual, consulte o Mapa de Fatias em `openspec/project.md`, identifique a próxima fatia `[ ] Pendente` e convide o humano:
   > *"Fatia XX concluída e blindada! Pelo nosso Mapa de Fatias, o próximo passo natural é a **Fatia YY (`openspec/roadmap/fatia-YY-...`)**, que aproveita o que acabamos de criar para entregar [resumo]. Posso abrir o Gate 1 dela agora?"*
