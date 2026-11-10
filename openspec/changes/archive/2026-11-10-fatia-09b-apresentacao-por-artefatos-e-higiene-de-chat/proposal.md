# Proposta — Apresentação por Artefatos e Higiene de Contexto no Chat

## Por que

Embora a Constituição (Artigos 8 e 12) determine a prevenção de degradação de contexto (*Context Rot*) e proíba suposições mentais, os agentes que operam no ecossistema da Governança vinham apresentando planos completos de Gate 1 e relatórios volumosos de entrega de Gate 2 em formato de texto corrido diretamente no chat.

Essa prática causa sérios inconvenientes:
1. **Poluição da Linha do Tempo e Efeito Rolagem:** Planos técnicos de 80 a 120 linhas sobrecarregam a conversa, forçando o usuário a rolar longas distâncias para ler instruções e dialogar com o agente.
2. **Subutilização de Recursos Nativos da IDE:** Ambientes modernos como o Google Antigravity possuem infraestrutura nativa de **Artefatos Interativos**, que exibem documentos em painéis laterais dedicados, suportam diagramas visuais (Mermaid) e oferecem botões interativos de ação (**Proceed**) com o parâmetro `RequestFeedback: true`.
3. **Desperdício de Tokens e Degradação de Contexto:** Textos massivos repetidos no chat aumentam desnecessariamente o histórico consumido a cada novo turno de conversação.

## O que muda

1. **Emenda Constitucional de Adaptação Sensível ao Harness (Artigos 8.5 e 12.5):**
   - Institui a regra de apresentação por artefatos: em harnesses que suportem artefatos nativos (Antigravity / Generative UI), planos de Gate 1 e relatórios de Gate 2 **devem** ser emitidos como artefatos dedicados (`plano-fatia-XX.md` e `entrega-fatia-XX.md`), configurados com `RequestFeedback: true` no Gate 1 para habilitar o botão interativo `Proceed`.
   - A resposta no chat deve ser estritamente concisa (≤ 20 linhas), contendo apenas o link markdown direto do artefato e a pergunta objetiva de decisão.
   - Em harnesses de terminal CLI sem pasta de artefatos (Claude Code, Cursor em terminal puro), o agente deve apresentar resumo enxuto no chat apontando para os arquivos físicos do disco em `openspec/changes/<fatia>/`.

2. **Diretrizes Atualizadas em `template/AGENTS.md` e Skills:**
   - Inclusão do princípio de apresentação limpa no Cartão de Invariantes e na Seção 5 de `template/AGENTS.md`.
   - Atualização da skill `ciclo-especificacao/SKILL.md` (Gate 1 e Gate 2) detalhando a criação de artefatos com `RequestFeedback: true`.
   - Atualização da skill `revisar-fatia/SKILL.md` e do Subagente Inspetor Forense instruindo a gravação do relatório cego em `parecer-forense.md` no diretório de artefatos.

3. **Suíte de Testes Automatizados (`tests/artefatos-e-higiene-chat.test.mjs`):**
   - Bateria de testes verificando a presença das cláusulas de artefatos na Constituição, em `AGENTS.md`, em `ciclo-especificacao` e em `revisar-fatia`.

## Fica de Fora

- Modificações no catálogo de reúso de componentes ou regras de anti-monólito com catraca (escopo mantido na Fatia 10).
- Criação de novos comandos de atalho (já implementados na Fatia 09a).
