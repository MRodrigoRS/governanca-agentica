# Contexto do Projeto: governanca-de-agentes-v2

> **Descrição:** Protocolo agêntico aberto para desenvolvimento de software com agentes de inteligência artificial.
> **Responsável:** Rodrigo Rafael de Sousa <rodrigorafaeldesousa@gmail.com>
> **Governança:** Governança v2/v3 (Protocolo Agêntico)

---

## 1. Visão do Produto, Fluxo de Ponta a Ponta e Escopo Polido

- **Objetivo Principal e Fluxo Completo:** Fornecer um protocolo agêntico aberto, determinístico e baseado em padrões da indústria (OpenSpec, Copier, Lefthook, Agent Skills, MCPs) para que agentes de codificação construam software sem alucinações, com cadência de commits autorizada pelo humano e sincronização bidirecional com Linear.
- **Perfis de Usuário:** Desenvolvedores de software, fundadores técnicos e equipes de engenharia que desenvolvem com agentes de IA (Cursor, Antigravity, Claude Code, GitHub Copilot).
- **Escopo Central:**
  - Scaffolding e distribuição em uma linha via Copier.
  - Especificações vivas e roadmap incremental via OpenSpec CLI.
  - Enforcement determinístico local (Lefthook, Gitleaks, testes unitários, scripts de verificação).
  - Integração com Linear MCP: Diário de Bordo nos Gates e Inbox Móvel para captura de ideias pelo celular.
- **Fora de Escopo:**
  - Ferramentas proprietárias fechadas ou frameworks caseiros de orquestração multi-agente.

---

## 2. Stack Tecnológica, Infraestrutura e MCPs (Gate 0)

- **Linguagem Principal:** JavaScript / Node.js (ESM com `--test` nativo) e Python / Jinja2 (Copier).
- **Gerenciador de Template e Atualização:** Copier (`copier.yml` com `_subdirectory: template`).
- **Gestor de Especificações:** OpenSpec CLI (`@fission-ai/openspec`).
- **Automação de Git Hooks:** Lefthook + Gitleaks.
- **Servidores MCP Oficiais:**
  - `linear`: Hosted Remote MCP Server (`https://mcp.linear.app/mcp`) via `mcp-remote`.
- **Executor de Testes:** Node.js native test runner (`node --test tests/**/*.test.mjs`).

---

## 3. Integração com Linear (Diário de Bordo & Inbox Móvel)

- **Servidor MCP:** Linear Hosted Remote Server (`mcp-remote https://mcp.linear.app/mcp`)
- **Projeto Linear (Âncora Oficial):** `P-RR-2` (GOV-AGENTS-V2)
- **Identificador da Âncora:** `P-RR-2`
- **Regras Operacionais para Agentes:**
  1. **Isolamento de Escopo:** O agente opera estritamente dentro do projeto `P-RR-2` no Linear. É terminantemente proibido tocar em issues de outras equipes ou projetos.
  2. **Inbox Móvel (Celular):** Quando o usuário solicitar (*"veja o que tem no Linear"*, *"puxe as ideias do celular"* ou `/linear-inbox`), o agente consulta as notas e tarefas recentes neste projeto e aciona a skill `refinar-ideia` para podar e transformar em fatias.
  3. **Gate 1:** Localiza ou cria a issue associada à fatia (`[LIN-XXX] fatia-XXa-...`) dentro do projeto `P-RR-2` e move para *In Progress*.
  4. **Gate 2 (Diário de Bordo):** Publica a atualização oficial do projeto (*Project Update*) com o resumo de valor funcional entregue e o roteiro de teste, marcando a issue como *Done*.
  5. **Poda de Ideias (`refinar-ideia`):** Registra ideias despriorizadas ou podadas diretamente no Backlog deste projeto no Linear.

---

## 4. Mapa de Fatias Incrementais (`openspec/roadmap/`)

| Ordem | Status | Fatia | Arquivo Detalhado | Depende de | Entrega Principal |
|---|---|---|---|---|---|
| 01 | `[x] Concluída` | `fatia-01-fundacao-v3` | [openspec/roadmap/fatia-01-fundacao-v3.md](roadmap/fatia-01-fundacao-v3.md) | Nenhuma | OpenSpec nativo, Lifecycle Hooks e suíte de testes unitários |
| 02 | `[x] Concluída` | `fatia-02-linear-mcp-e-inbox` | [openspec/roadmap/fatia-02-linear-mcp-e-inbox.md](roadmap/fatia-02-linear-mcp-e-inbox.md) | Fatia 01 | Integração oficial com Linear MCP, Diário de Bordo e Inbox Móvel |

---

## 5. Diretórios e Convenções de Arquitetura

- `template/`: Código fonte e templates distribuídos aos usuários via Copier.
- `tests/`: Bateria de testes automatizados da governança.
- `openspec/`: Auto-governança e especificações do próprio repositório.
- `CHANGELOG.md`: Registro de versões semânticas da governança.

---

## 6. Comandos Essenciais

```bash
# Validação determinística de governança
npm test

# OpenSpec CLI
npx --yes @fission-ai/openspec doctor
npx --yes @fission-ai/openspec list
```
