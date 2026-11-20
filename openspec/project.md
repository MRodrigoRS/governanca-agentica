# Contexto do Projeto: governanca-agentica

> **Descrição:** Protocolo agêntico aberto para desenvolvimento de software com agentes de inteligência artificial.
> **Responsável:** Rodrigo Rafael de Sousa <rodrigorafaeldesousa@gmail.com>
> **Governança:** Governança v4.0.0 (Protocolo Agêntico Universal)

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
  - Arquivos `SPEC.md` ou `TODO.md` avulsos na raiz paralelos ao ecossistema OpenSpec (`openspec/`).
  - Fragmentação de `template/constitution.md` em múltiplos micro-arquivos (preservação do merge de 3 vias no `uvx copier update`).
  - Uso de `git worktree` paralelo como fluxo padrão de fatias sequenciais (restrito apenas a spikes/experimentos isolados).

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

### Tríade de Âncora Linear (Anti-Vazamento de Squads)
- **Workspace:** `rr-diario-agents` (URL: `https://linear.app/rr-diario-agents`)
- **Equipe:** `RR_DIARIO_AGENTS` (Chave: `RR` / UUID: `0eea2743-4241-41cb-832a-96cc625a085a`)
- **Projeto:** `Governança Agêntica` (Identificador: `P-RR-2` / UUID: `ef07f846-1cd0-400a-a6bb-94fd723621ed`)

- **Protocolo de Handshake Pré-Operação (Obrigatório — Artigo 13):**
  1. **Handshake com `whoami`:** Antes de qualquer leitura ou escrita no Linear, o agente executa `whoami` para verificar a organização/workspace ativa.
  2. **Bloqueio Determinístico por Divergência:** Compara o workspace retornado com a âncora acima (`rr-diario-agents`). Em caso de divergência, interrompe a execução com alerta de contenção ao humano.
  3. **Isolamento de Escopo e Proibição de Fallback Silencioso:** O agente opera estritamente dentro deste workspace, equipe e projeto no Linear. É terminantemente proibido o fallback silencioso (criar tarefas órfãs ou tocar em issues de outras equipes caso o projeto não seja localizado).
  4. **Inbox Móvel (Celular):** Quando o usuário solicitar (*"veja o que tem no Linear"*, *"puxe as ideias do celular"* ou `/linear-inbox`), o agente consulta as notas e tarefas recentes neste projeto e aciona a skill `refinar-ideia` para podar e transformar em fatias.
  5. **Gate 1:** Localiza ou cria a issue associada à fatia (`[RR-XXX] fatia-XXa-...`) dentro do projeto `P-RR-2` e move para *In Progress*.
  6. **Gate 2 (Diário de Bordo):** Publica a atualização oficial do projeto (*Project Update*) com o resumo de valor funcional entregue e o roteiro de teste, marcando a issue como *Done*.
  7. **Poda de Ideias (`refinar-ideia`):** Registra ideias despriorizadas ou podadas diretamente no Backlog deste projeto no Linear.

---

## 4. Mapa de Fatias Incrementais (`openspec/roadmap.md`)

> **Modelo Rolling Wave (Governança v4.0.0):** O planejamento macro de todas as fatias vive exclusivamente em [openspec/roadmap.md](roadmap.md) (com Fatias 01 a 12 concluídas). A especificação técnica profunda nasce Just-in-Time diretamente em `openspec/changes/fatia-XX-<slug>/` na hora de implementar cada fatia (arquivos históricos da era v3 permanecem preservados em `openspec/roadmap/`).
> Consulte a fonte única da verdade em: **[openspec/roadmap.md](roadmap.md)**.

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
