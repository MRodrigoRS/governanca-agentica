---
trigger: model_decision
description: "Regras e protocolo de consulta e atualização do Linear MCP neste repositório matriz"
---

# Regras de Operação com o Linear MCP (Handshake e Tríade de Âncora)

> **Aplicabilidade:** Toda leitura ou escrita através do servidor Linear MCP (`linear_linear`).
> **Fonte Canônica:** Artigo 13 de `template/constitution.md` e Seção 3 de `openspec/project.md`.

---

## 1. Handshake Pré-Operação Obrigatório com `whoami`
- Antes de qualquer leitura ou mutação no Linear MCP, o agente DEVE executar `whoami`.
- O workspace retornado DEVE corresponder exatamente ao slug `rr-diario-agents`.
- Se o workspace divergir ou `whoami` falhar, interrompa imediatamente com alerta ao usuário. É proibido operar em fallback silencioso.

---

## 2. Tríade de Âncora Imutável da Matriz
- **Workspace:** `rr-diario-agents` (`https://linear.app/rr-diario-agents`)
- **Equipe:** `RR_DIARIO_AGENTS` (Chave: `RR` / UUID: `0eea2743-4241-41cb-832a-96cc625a085a`)
- **Projeto:** `Governança Agêntica` (Identificador: `P-RR-2` / UUID: `ef07f846-1cd0-400a-a6bb-94fd723621ed`)
- É terminantemente proibido listar, criar ou editar issues em outros workspaces, equipes ou projetos.

---

## 3. Consentimento Explícito nas Sincronizações
- **Confirmação Humana Prévia Obrigatória:** Sempre peça confirmação ao usuário antes de criar/atualizar issues, mudar status ou publicar *Project Updates*.
- **Gate 1:** Propõe vincular/criar a issue (`[RR-XXX]`) e movê-la para *In Progress*.
- **Gate 2:** Propõe publicar o resumo no mural do projeto (*Project Update*), marcar como *Done* e pergunta se há novas tarefas a registrar.
