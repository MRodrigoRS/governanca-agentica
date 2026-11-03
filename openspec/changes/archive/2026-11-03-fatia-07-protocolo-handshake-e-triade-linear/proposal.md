# Proposta — Fatia 07: Protocolo de Handshake e Tríade de Âncora Linear (Anti-Vazamento de Squads)

## Why
Em ambientes onde desenvolvedores e agentes de IA operam com credenciais de MCP com acesso a múltiplos workspaces ou múltiplos times/projetos no Linear, a ausência de uma âncora imutável e de uma verificação prévia de identidade cria risco severo de:
1. Contaminação cruzada: um agente alterar, concluir ou mover issues de outros clientes, squads ou produtos.
2. Criação de tarefas órfãs sem atribuição correta de projeto ou equipe.
3. Fallback silencioso: ao não encontrar um projeto, operar na primeira issue retornada ou no vácuo.

Para mitigar definitivamente esses riscos:
- Institui-se a **Tríade de Âncora Linear** no `openspec/project.md` (`Workspace`, `Equipe`, `Projeto`).
- Adiciona-se o **Artigo 13 na Constituição** impondo o handshake obrigatório via `whoami` antes de qualquer leitura ou escrita no Linear, além de bloquear imediatamente a operação em caso de divergência de workspace e proibir fallback silencioso.
- Atualiza-se `copier.yml` e o template Jinja para automatizar a configuração da Tríade de Âncora de ponta a ponta.

## What Changes
1. **Constituição (`template/constitution.md`):**
   - Criação do **Artigo 13 — Isolamento Multi-Squad, Tríade de Âncora e Handshake de Integrações**.
2. **Instruções Gerais de Agentes (`template/AGENTS.md`):**
   - Inclusão das regras operacionais de handshake pré-operação e ancoragem tríplice na Seção 6.
3. **Template Jinja (`template/openspec/project.md.jinja`):**
   - Renderização da Tríade de Âncora com `linear_workspace_slug`, `linear_team_key` e `linear_project`.
4. **Questionário Copier (`copier.yml`):**
   - Inclusão das perguntas condicionais para workspace e equipe quando `integrar_linear: true`.
5. **Âncora do Repositório Atual (`openspec/project.md`):**
   - Atualização da Seção 3 com os dados reais imutáveis do projeto (`rr-diario-agents`, `RR_DIARIO_AGENTS`, `GOV-AGENTS-V2 / P-RR-2`).
6. **Suíte Automatizada de Testes Unitários:**
   - Criação de `tests/template-linear.test.mjs` com asserções reais cobrindo o questionário Copier, a renderização Jinja e as cláusulas constitucionais.
