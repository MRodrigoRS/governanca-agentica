# Design Técnico — Fatia 07: Protocolo de Handshake e Tríade de Âncora Linear (Anti-Vazamento de Squads)

## Arquitetura e Decisões Técnicas

### 1. Tríade de Âncora Imutável
A amarração do projeto no Linear não pode depender apenas de uma URL solta ou de um ID isolado. Ela exige uma tríade com redundância e precisão inequívoca:
- **Workspace:** slug organizacional e URL (ex.: `rr-diario-agents` / `https://linear.app/rr-diario-agents`). Previne contaminação entre diferentes clientes/organizações do usuário.
- **Equipe:** chave (`KEY`, ex.: `RR`) e UUID. Previne invasão de backlog de outros squads da mesma empresa.
- **Projeto:** identificador curto (`P-RR-2`), nome e UUID. Delimita exatamente a raia de trabalho da IA.

### 2. Handshake Pré-Operação com `whoami`
- Antes de emitir qualquer chamada de leitura ou escrita ao servidor MCP do Linear (`linear_linear`), o agente deve obrigatoriamente chamar a ferramenta `whoami`.
- O payload de retorno de `whoami` fornece as informações da organização/workspace conectada.
- O agente compara o workspace retornado com a âncora declarada em `openspec/project.md`.
- Se o workspace divergir, o agente deve travar a execução imediatamente, emitir um alerta claro de segurança ao humano e se recusar a executar qualquer alteração.
- **Proibição Absoluta de Fallback Silencioso:** Se a issue ou o projeto não for localizado na equipe/projeto ancorados, é expressamente proibido ao agente deduzir que deve criar uma issue sem projeto ou operar em issues de outra equipe.

### 3. Integração no Questionário Copier
- Em `copier.yml`, quando `integrar_linear: true`, solicitam-se as 3 dimensões de ancoragem de forma sequencial com defaults limpos:
  - `linear_workspace_slug`
  - `linear_team_key`
  - `linear_project`
- No template Jinja (`template/openspec/project.md.jinja`), a Seção 5 é preenchida com a Tríade de Âncora renderizada condicionalmente, incluindo o protocolo de handshake pré-operação.

### 4. Cláusula Pétrea Constitucional (Artigo 13)
- Adição formal do Artigo 13 no `template/constitution.md` consolidando a regra de isolamento multi-squad e handshake pré-operação como cláusula inegociável da governança.

### 5. Estratégia de Testes Unitários
- Um novo arquivo de teste `tests/template-linear.test.mjs` usando o test runner nativo do Node.js (`node:test` e `node:assert/strict`) validará:
  1. Que `copier.yml` contém as variáveis `linear_workspace_slug`, `linear_team_key` e `linear_project` condicionadas a `integrar_linear`.
  2. Que `template/openspec/project.md.jinja` renderiza a Tríade de Âncora completa quando `integrar_linear = true`.
  3. Que `template/openspec/project.md.jinja` omite a seção quando `integrar_linear = false`.
  4. Que `template/constitution.md` possui o Artigo 13 com as travas de handshake e anti-vazamento.
  5. Que `template/AGENTS.md` contém a Seção 6 com o protocolo operacional de handshake.
  6. Que `openspec/project.md` deste repositório possui a Tríade de Âncora real ancorada.
