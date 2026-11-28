<!-- governanca:inicio v4.9.0 — não edite este bloco; alterações no repositório da governança -->
# Instruções Gerais para Agentes de IA — Governança

> **Papel:** Ponto de entrada universal para agentes e assistentes de IA neste repositório.
> **Regra Suprema:** Obedeça integralmente a @[constitution.md](constitution.md), fonte canônica completa das Faixas 1, 2 e 3 (100% ativas desde o 1º commit). Texto sozinho é intenção; hooks determinísticos (`.agents/hooks.json`, `Lefthook + Gitleaks + verificar-governanca.mjs` e CI) validam e travam execuções.

### Cartão de Invariantes Críticos (`P0` — Precedência Máxima)
> Foco abaixo nos invariantes críticos de **[Faixa 1 — Crítico]**; consulte `constitution.md` para todas as cláusulas detalhadas de **[Faixa 1 — Crítico]**, **[Faixa 2 — Engenharia]** e **[Faixa 3 — Processo]**.
1. **[Faixa 1 — Crítico] Test-First & Testing Trophy (Artigo 2):** Proibido código de produção sem teste que falhou antes (Vermelho → Verde → Refatorar). Proibido mockar/espiar banco próprio (`prisma`, `drizzle`, `db`, `session`) — use SQLite in-memory, PGlite ou banco real; obrigatória **Prova de Runtime Pré-Gate 2** por perfil (suíte E2E real já satisfaz `web-ui` nas rotas cobertas).
2. **[Faixa 1 — Crítico] Zero Segredos & Hardening Backend (Artigos 4 e 7):** Nunca exponha segredos, chaves em `NEXT_PUBLIC_`/`VITE_` ou PII em logs; valide entradas na borda, aplique `usuarioId`/`tenantId` no servidor, transações ACID, `/health` (ou `/api/saude`) e migrações *expand-and-contract*.
3. **[Faixa 1 — Crítico] Commits Cadenciados (Artigo 11):** Proibido commit avulso; autorizado exclusivamente no Marco 1 (Gate 0) e Marco 2 (Gate 2) após validação verde e aprovação humana.
4. **[Faixa 1 — Crítico] Isolamento Linear (Artigo 13):** Obrigatório `whoami` antes de consultar/editar o Linear, restrito à Tríade de Âncora (`openspec/project.md`).

### Matriz Universal de Leitura Pré-Edição
Antes de editar código ou integrações, consulte a regra correspondente em `.agents/rules/`:

| Intenção ou Arquivos Tocados | Módulo de Regras | O que verificar antes de codificar |
|---|---|---|
| **Rotas, UI, Telas, CSS, PWA** (`.tsx`, `.jsx`, `.vue`, `.svelte`, `.html`, `.css`, `manifest.json`) | `.agents/rules/web-ui-pwa.md` | Mobile-first 320px+, 4 estados assíncronos, Toasts, Modais com `Escape`, zero `location.reload`, linguagem humana, fonte única de contratos (runtime em APIs externas/mutações críticas). |
| **APIs, Servidor, Banco, Filas** (`api/`, `server/`, `routes/`, `.prisma`, `.sql`, `seed*`, `schemas`, `.py`, `.go`, `.gs`) | `.agents/rules/backend-seguranca-dados.md` | Zero-Trust Anti-F12/IDOR, schemas na borda, ACID, *expand-and-contract*, seeds idempotentes, `/health` ou `/api/saude` sem PII, `requestId`/`/ready` em escala, CSP/HSTS, rate limit. |
| **Jogos, Cenas, Shaders, Física** (`.gd`, `.tscn`, `project.godot`, `.wgsl`, `.glsl`) | `.agents/rules/jogos-engines.md` | Lógica pura desacoplada da renderização, testes headless < 50ms, viewport fluido. |
| **Integração Linear MCP** (issues, status, diário) | `.agents/rules/linear-mcp.md` | Handshake `whoami`, Tríade de Âncora, zero fallback silencioso, consentimento humano. |

---

## 1. Diagnóstico Inicial, Postura Crítica e Condução
- **Postura Obrigatória (Artigo 8):** Atue como **Arquiteto Crítico** (aponte falhas, dívida e caminhos viciosos antes de codificar), aplique **Pesquisa Viva** (`context7`/`/llms.txt`/web; nunca decida stack/API só de memória de treinamento) e conduza rodadas `grill-me` antes de decisões não triviais (**ajustes triviais/cosméticos** de texto, cor ou `Via 1b` `style` ficam isentos). Nunca finja testes não executados.
- **Repositório Greenfield (sem stack ou ausência de produto):** Congele edições de código e acione automaticamente `.agents/skills/mesa-de-descoberta/SKILL.md` + `.agents/skills/inicializar-stack/SKILL.md` (entrevista contínua via `grill-me` sem teto de rodadas, cristalizando capítulos em `docs/conhecimento/` só com permissão humana). Antes de gerar `openspec/roadmap.md` no Gate 0, faça **leitura física obrigatória** de `docs/conhecimento/INDICE.md` e dos capítulos consolidados.
- **Repositório Brownfield (código existente sem specs ou marcado como `Aguardando Onboarding Brownfield`):** Congele qualquer edição de código e acione obrigatoriamente `.agents/skills/mapear-brownfield/SKILL.md` (`/mapear-projeto`) antes da primeira tarefa para mapear arquitetura, saúde e docs vivos até o Gate de Onboarding.
- **Projeto em Andamento (Proibido Deduzir de Cabeça — Artigo 12):** Leia fisicamente `openspec/project.md`, `openspec/roadmap.md`, `openspec/matriz-requisitos.md` (se existir) e `openspec/changes/` antes de planejar ou codar. Com fila executável vazia, acione `.agents/skills/planejar-proxima-fatia/SKILL.md` (`/fatiar`) sobre código real + livro; para novas ideias no meio do caminho, congele código e acione `.agents/skills/refinar-ideia/SKILL.md`; para revisão divergente sob demanda (nunca automática), use `/explorar` / `/evoluir` (`explorar-produto`, Conselho de 3 Subagentes *read-only*); para corpus extenso (`> 8` capítulos ou `docs/conhecimento/materiais/`), acione `/sintetizar` (`sintetizar-conhecimento`).

## 2. Cerimônia, Test-First, Circuit Breaker e Gates
- **4 Vias (D14/D32):** **Via 1a (`/fix`):** bug em até 3 arquivos de produção, exige ≥ 1 teste staged e `CHANGELOG.md`; **Via 1b (`style`):** ajuste visual/copy puro (até 3 arquivos, sem condicionais/hooks/I/O); **Via 1.5:** manutenção estrutural (`refactor`/`perf`/`style`/`chore`/`build`) em > 3 arquivos ou bump de pacote existente sem banco/dependência inédita; **Via 2:** feature/schema/dependência nova com delta em `openspec/changes/` e ciclo completo em `.agents/skills/ciclo-especificacao/SKILL.md`.
- **Circuit Breaker + `/debug` (Artigo 9):** Na **2ª falha consecutiva**, congele edições e acione `.agents/skills/depuracao-sistematica/SKILL.md` (`/debug`) antes da 3ª tentativa. Na **3ª falha**, pare e consulte o humano.
- **Gate 1 (Aprovação de Plano):** Sem commit. Após releitura física e `grill-me`, emita o artefato `plano-fatia-XX.md` com `RequestFeedback: true` (em harnesses compatíveis) mantendo o chat com no máximo 20 linhas com link e pergunta objetiva (ou resumo ≤ 20 linhas no terminal CLI).
- **Marco 1 — Gate 0:** Commit fundacional após aprovar escopo, stack, testes base e `openspec/roadmap.md`.
- **Marco 2 — Fechamento (Gate 2):** Execute testes (Vermelho/Verde), `node scripts/verificar-governanca.mjs` e **Prova de Runtime**; se necessário `/revisar` (`revisar-fatia`, opcional), emita `entrega-fatia-XX.md` (≤ 20 linhas no chat) com valor entregue, Roteiro Prático Passo a Passo, evidências e **destaque explícito de válvulas de escape ativas no diff**. **Somente após aprovação humana**, execute fechamento atômico: atualize `openspec/matriz-requisitos.md` (`REQ-XX`), rode `npx --yes @fission-ai/openspec archive <fatia> -y`, marque `[x]` em `openspec/roadmap.md` e **então** execute `git commit` (`CHANGELOG.md` em dia) + recomende `/compact`.
- **Linear MCP (Artigo 13):** Sempre `whoami` antes; bloqueie se divergir da Tríade de Âncora e proíba fallback silencioso. **Mediante confirmação humana**, mova a issue no Gate 1 (*In Progress*) e Gate 2 (*Done* + Project Update, perguntando se há novas tarefas ou edições).

## 3. Documentos Vivos, Contexto, `scripts/` e Skills
- **Artefatos do Projeto:** `openspec/config.yaml`, `openspec/radar-oportunidades.md`, `openspec/matriz-requisitos.md`, `docs/arquitetura.md` (C4 + `erDiagram` + §5 Mapa Físico), `docs/catalogo-reuso.md` (Artigo 14), `docs/particularidades.md`, `docs/runbook.md`, `docs/aprendizados.md`, `docs/adr/`, `docs/conhecimento/INDICE.md` e `.agents/handoff.md` (efêmero, limpo no Gate 2). Crescimento de UI/escala/deploy pode disparar avisos não-bloqueantes `[AVISO MATURIDADE]`. Exceções legítimas de stack vão em `constitution.md` e `docs/particularidades.md`.
- **Hooks, MCPs e `scripts/`:** `.agents/hooks.json` aciona `scripts/hook-agente.mjs`. Apenas scripts nativos da governança (`verificar-governanca.mjs`, `validar-commit-msg.mjs`, `hook-agente.mjs`, `lib/`) são isentos; scripts próprios em `scripts/` são código de produção auditado. Delegue buscas amplas a subagentes *read-only*, use `/llms.txt` / CLI `gh`, mantenha 3–5 MCPs ativos e banco via MCP estritamente *read-only*.
- **Skills (`.agents/skills/`):** `inicializar-stack`, `mapear-brownfield`, `planejar-proxima-fatia`, `ciclo-especificacao`, `depuracao-sistematica`, `refinar-ideia`, `explorar-produto`, `mesa-de-descoberta`, `sintetizar-conhecimento`, `revisar-fatia`, `reuso-e-modularizacao`, `auditoria-ux-analytics`, `auditoria-seguranca`, `atualizar-governanca`.

### Comandos de Atalho Rápidos (Padrão Universal `AGENTS.md` + `.agents/skills/`)
| Comando | Skill / Artefato | Quando utilizar |
|---|---|---|
| `/fix` | `ciclo-especificacao` §1 (Via 1a) | Bug pontual com teste staged (máx. 3 arquivos de produção) |
| `/debug` | `depuracao-sistematica` | Investigação científica de causa raiz (manual ou 2ª falha do Circuit Breaker) |
| `/mapear-projeto` | `mapear-brownfield` | Onboarding obrigatório de repositório existente antes de alterar código |
| `/fatiar` / `/planejar-fatia` | `planejar-proxima-fatia` | Inspeciona livro + código real e propõe Just-in-Time a próxima fatia |
| `/proxima-fatia` | `ciclo-especificacao` §2 (Via 2) | Lê `roadmap.md` (ou aciona `/fatiar`), abre delta OpenSpec e prepara Gate 1 |
| `/retomar` | Handoff (`tasks.md` ou `.agents/handoff.md`) | Retoma fatia OpenSpec ou trabalho avulso após `/compact` ou nova sessão |
| `/revisar` | `revisar-fatia` | Auditoria sob demanda com Inspetor Forense cego e Duelo de Conformidade |
| `/auditar-reuso` | `reuso-e-modularizacao` | Auditoria de reúso, tokens de movimento e teto anti-monólito |
| `/auditar-ux` | `auditoria-ux-analytics` | Analytics (PostHog/Clarity sob LGPD/CSP) e auditoria UX com dados reais |
| `/auditar-seguranca` | `auditoria-seguranca` | Auditoria AppSec (27+ controles) e linguagem humana na UI |
| `/grill-me` | Protocolo `grill-me` / `grilling` | Interrogatório estruturado de plano/design/ideia em rodadas |
| `/refinar` | `refinar-ideia` | Nova ideia no meio do caminho: congela código, poda e cria subfatia |
| `/explorar` / `/evoluir` | `explorar-produto` | Conselho Evolutivo de 3 Subagentes (*read-only*): inovação, ouro barato e refatoração |
| `/descobrir` / `/mesa` | `mesa-de-descoberta` | Mesa contínua multi-especialista para o livro (`docs/conhecimento/INDICE.md`) |
| `/sintetizar` | `sintetizar-conhecimento` | Síntese *Map-Reduce* do livro e `materiais/` para `openspec/roadmap.md` |
| `/aprendizado` | `docs/aprendizados.md` | Registrar armadilha empírica, cicatriz ou lição aprendida |
| `/atualizar-governanca` | `atualizar-governanca` | Atualizar template via `copier update` de forma segura |
| `/linear-inbox` | `refinar-ideia` §Passo 0 | Puxar e refinar notas de ideias do celular via Linear (quando ativo) |
<!-- governanca:fim -->

## Regras Específicas Deste Projeto

*(Adicione abaixo as regras, convenções de arquitetura ou integrações específicas deste projeto. Este bloco é preservado durante as atualizações da governança).*

---

## Comandos do Projeto

Execute os comandos da stack instalada conforme necessário:

- **Instalar Dependências:** `npm install`
- **Executar em Desenvolvimento:** `npm run dev`
- **Executar Todos os Testes:** `npm test`
- **Executar Arquivo Único de Teste:** `npm test -- <caminho-do-arquivo>` (ou `npx vitest <arquivo>`, `npx jest <arquivo>`, `pytest <arquivo>`)
- **Checagem de Tipos (Typecheck):** `npm run typecheck`
- **Lint e Formatação:** `npm run lint`
- **Build de Produção:** `npm run build`
- **Migrações de Banco:** `npx prisma migrate dev` (ou comando equivalente da stack)
