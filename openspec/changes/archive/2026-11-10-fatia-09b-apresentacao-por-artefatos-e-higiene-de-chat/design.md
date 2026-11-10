# Design Técnico — Apresentação por Artefatos e Higiene de Contexto no Chat

## Contratos, Dados e Schemas

### 1. Padrão de Nomenclatura e Metadados de Artefatos no Antigravity
Para cada marco do ciclo SDD em ambientes com suporte a artefatos:
- **Gate 1 (Plano da Fatia):**
  - Nome do arquivo: `plano-fatia-XX.md`
  - Diretório: `<appDataDir>\brain\<conversation-id>\`
  - Metadados (`ArtifactMetadata`):
    - `UserFacing`: `true`
    - `RequestFeedback`: `true` (renderiza o botão nativo de aprovação `Proceed` na interface da IDE)
    - `Summary`: Resumo conciso de 2 a 3 linhas sobre a mudança e escopo planejado.
- **Gate 2 (Relatório de Entrega):**
  - Nome do arquivo: `entrega-fatia-XX.md`
  - Diretório: `<appDataDir>\brain\<conversation-id>\`
  - Metadados (`ArtifactMetadata`):
    - `UserFacing`: `true`
    - `RequestFeedback`: `false` (ou `true` caso solicite autorização de commit por botão)
    - `Summary`: Resumo da entrega, resultados dos testes e status de validação.
- **Auditoria Forense Cega:**
  - Nome do arquivo: `parecer-forense.md`
  - Diretório: `<appDataDir>\brain\<conversation-id>\`
  - Metadados (`ArtifactMetadata`):
    - `UserFacing`: `true`
    - `RequestFeedback`: `false`
    - `Summary`: Relatório factual cego emitido pelo Subagente Inspetor Forense.

### 2. Contrato da Resposta no Chat
Quando artefatos forem criados:
- Proibido re-resumir o documento inteiro na mensagem do chat.
- Estrutura mandatória do chat:
  1. Identificação da fatia e marco (Gate 1 ou Gate 2).
  2. Link direto do artefato no formato `[Título](file:///caminho/do/artefato.md)`.
  3. Destaque exclusivo de 1 a 2 pontos críticos ou perguntas em aberto.
  4. Pergunta objetiva de decisão (≤ 20 linhas úteis no total).

## Interface e Estados Assíncronos

Aplica-se à interação com o usuário na IDE:
- **Renderização Visual:** O plano de Gate 1 exibe diagramas Mermaid com a árvore de componentes/fluxos e tabelas de critérios de aceite sem poluir a rolagem do chat.
- **Ação por Botão (Interactive Feedback):** O usuário pode clicar no botão `Proceed` do artefato na barra lateral da IDE para aprovar a execução sem digitar mensagens manuais.

## Regras de Negócio e Segurança

1. **Prevenção de Saturação de Contexto (Artigo 12.5):** O armazenamento dos detalhes nos arquivos de artefatos preserva o histórico de chat limpo e focado em deliberações de negócio, minimizando o *Context Rot*.
2. **Fallback Gracioso para Terminais CLI:** Em harnesses sem ferramentas de artefatos (Claude Code puro ou ambientes de script headless), o agente deve sintetizar o plano em até 20 linhas e referenciar a leitura direta de `openspec/changes/<fatia>/design.md` no disco.
3. **Imutabilidade e Rastreabilidade:** O artefato reflete fielmente os dados dos 4 pilares do OpenSpec salvos em `openspec/changes/`, garantindo auditoria idêntica.
