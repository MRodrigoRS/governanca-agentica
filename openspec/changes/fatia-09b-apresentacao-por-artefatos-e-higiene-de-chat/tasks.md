# Tarefas de Implementação — `fatia-09b-apresentacao-por-artefatos-e-higiene-de-chat`

- [x] **1. Test-First Mandatório (`tests/artefatos-e-higiene-chat.test.mjs` — Ciclo Vermelho):**
  - [x] 1.1. Escrever Teste 1 falhando (Vermelho): presença da regra de apresentação por artefatos e higiene de chat na Constituição (`template/constitution.md` Artigos 8.5 e 12.5).
  - [x] 1.2. Escrever Teste 2 falhando (Vermelho): diretrizes de artefatos com `RequestFeedback: true` e teto de linhas de chat em `template/AGENTS.md`.
  - [x] 1.3. Escrever Teste 3 falhando (Vermelho): atualização das skills `ciclo-especificacao/SKILL.md` (Gate 1 e 2) e `revisar-fatia/SKILL.md` (parecer forense em artefato).
- [x] **2. Emenda Constitucional e Atualização das Instruções Principais:**
  - [x] 2.1. Atualizar Artigo 8.5 e Artigo 12.5 em `template/constitution.md` cravando a obrigação de artefatos para Gate 1 e Gate 2 em harnesses compatíveis.
  - [x] 2.2. Atualizar o Cartão de Invariantes e a Seção 5 de `template/AGENTS.md`.
- [x] **3. Atualização das Skills e Subagentes:**
  - [x] 3.1. Atualizar `template/.agents/skills/ciclo-especificacao/SKILL.md` instruindo a criação de `plano-fatia-XX.md` e `entrega-fatia-XX.md` com `RequestFeedback: true`.
  - [x] 3.2. Atualizar `template/.agents/skills/revisar-fatia/SKILL.md` e perfis de agente do Inspetor Forense para gerar `parecer-forense.md`.
- [x] **4. Execução dos Testes e Comprovação (Ciclo Verde):**
  - [x] 4.1. Executar `node --test tests/artefatos-e-higiene-chat.test.mjs` garantindo aprovação total.
  - [x] 4.2. Executar suíte completa `npm test`, `npx @fission-ai/openspec validate --all --no-interactive` e `verificar-governanca.mjs`.

## Notas de Sessão
- **Decisões fora do plano:** Subfatia 09b implementada com sucesso com aprovação do Gate 1 via artefato interativo com `RequestFeedback: true`.
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Conduzir a auditoria cega com o Subagente Inspetor Forense, gerar parecer em artefato e apresentar o Gate 2 para commit.

## Roteiro de Validação Prática

### O que validar no Gate 2:
1. **Cláusulas Pétreas de Artefatos:**
   - Comprovar que a Constituição veda o despejo de planos longos em texto corrido quando o harness suportar artefatos.
2. **Presença em AGENTS.md e Skills:**
   - Confirmar que as skills orientam o uso de `RequestFeedback: true` no Gate 1 para acionar o botão `Proceed`.
3. **Parecer Forense em Artefato:**
   - Confirmar instrução para salvar o relatório do Inspetor em `parecer-forense.md`.
