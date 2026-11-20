# Instruções Gerais para Agentes de IA — Repositório Matriz (`governanca-agentica`)

> **Papel:** Fonte única da verdade para agentes de IA operando na evolução e manutenção do próprio protocolo da **Governança v4.0.0** (perfil `cli-biblioteca` + `Linear MCP`).
> **Fonte Única Constitucional:** Obedeça integralmente a [template/constitution.md](template/constitution.md) — **não duplicada na raiz** para evitar deriva entre matriz e template. O enforcement determinístico é executado por [.agents/hooks.json](.agents/hooks.json) (`node ../template/scripts/hook-agente.mjs`), `Lefthook`, `verificar-governanca.mjs` e GitHub Actions.

---

### Cartão de Invariantes da Matriz (Regras Inegociáveis)
1. **Test-First Mandatório (Artigo 2):** Proibido implementar ou alterar scripts em `template/scripts/` sem teste automatizado em `tests/*.test.mjs` que tenha falhado antes (Vermelho → Verde → Refatorar).
2. **Padrão Universal Puro (D40):** Proibido recriar wrappers proprietários na raiz ou em `template/` (`.claude/`, `.cursor/`, `.vscode/`, `CLAUDE.md`, `GEMINI.md`, `.github/prompts|instructions|agents`).
3. **Vias de Cerimônia na Matriz (D32 / Fatia 13):** `template/scripts/*.mjs` contam como arquivos de produção. Via 1a (`/fix`) exige teste staged (até 3 arquivos); Via 1.5 cobre manutenção estrutural; Via 2 (nova capacidade / `### Adicionado` no `CHANGELOG.md`) exige delta ativo em `openspec/changes/` e bloco em `openspec/roadmap.md`.
4. **Catraca Anti-Monólito (Artigo 14):** Novos sensores e helpers devem nascer em módulos separados sob `template/scripts/lib/` em vez de inflar `template/scripts/verificar-governanca.mjs`.
5. **Zero Dependências Externas nos Scripts:** `template/scripts/*.mjs` e `tests/*.test.mjs` usam exclusivamente Node.js ESM nativo (`node:fs`, `node:path`, `node:child_process`, `node:test`, `node:assert/strict`).
6. **Commits com Aprovação Humana (Artigo 11):** Proibido `git commit`, `git push` ou `git tag` sem autorização explícita humana no Gate 2 (ou Gate 0), e proibido `--no-verify`.
7. **Português do Brasil no Domínio (Artigo 10):** Identificadores de governança, tabelas, documentação, specs e mensagens de commit em PT-BR; termos técnicos universais em EN.
8. **Handshake e Isolamento Linear (Artigo 13):** Obrigatório `whoami` antes de consultar/escrever no Linear; validar workspace `rr-diario-agents`, equipe `RR_DIARIO_AGENTS` (`RR`) e projeto `Governança Agêntica` (`P-RR-2`), sempre com confirmação humana antes de mutações.
9. **Proibido Deduzir de Cabeça (Artigo 12):** Leia fisicamente `openspec/roadmap.md`, `openspec/changes/<mudanca>/`, `docs/arquitetura.md §5` e os arquivos-alvo antes de planejar ou editar.
10. **Interrogatório `grill-me` & Pesquisa Viva (Artigo 8):** Mudanças não triviais de regras/contratos exigem alinhamento com recomendações (`➡️`) antes de editar; nunca inventar APIs de memória.

---

### Matriz de Leitura Pré-Edição

Antes de editar arquivos na matriz, consulte a regra correspondente em `.agents/rules/`:

| Intenção ou Arquivos Tocados | Regra Obrigatória | O que verificar antes de agir |
|---|---|---|
| **Template Copier, Scripts, Testes, CI ou Lefthook** (`template/`, `tests/`, `copier.yml`, `lefthook.yml`, `.github/`) | `.agents/rules/matriz-governanca.md` | Isolamento `_subdirectory: template`, `_skip_if_exists`, Padrão Universal Puro (D40), zero dependências externas, integridade referencial, SemVer. |
| **Integração Linear MCP** (issues, status, Project Updates, inbox móvel) | `.agents/rules/linear-mcp.md` | Handshake prévio obrigatório com `whoami`, Tríade `rr-diario-agents` / `RR` / `P-RR-2`, zero fallback silencioso, consentimento humano. |

---

## Comandos do Projeto

Comandos validados no ambiente da matriz (Node.js ESM + Copier + OpenSpec CLI):

- **Executar Toda a Suíte de Testes:** `npm test`
- **Executar Arquivo Único de Teste:** `node --test tests/<arquivo>.test.mjs`
- **Auditar Governança (Staged Local):** `node template/scripts/verificar-governanca.mjs`
- **Auditar Governança (Modo CI / Último Commit):** `node template/scripts/verificar-governanca.mjs --ci`
- **Checar Sintaxe dos Scripts:** `node --check template/scripts/verificar-governanca.mjs && node --check template/scripts/validar-commit-msg.mjs && node --check template/scripts/hook-agente.mjs`
- **Validar Especificações OpenSpec:** `npx --yes @fission-ai/openspec validate --all --no-interactive`
- **Testar Scaffolding Copier Local:** `uvx copier copy --defaults . <diretorio-temporario>`

> *Particularidade Windows PowerShell 5.1:* `&&` não é suportado no PowerShell 5.1; use `; if ($?) { ... }` ou comandos separados. Consulte `docs/particularidades.md`.

---

## Skills em Fonte Única e Comandos de Atalho

As skills oficiais residem exclusivamente em `template/.agents/skills/` (sem duplicação na raiz). Ao receber um dos comandos ou fluxos abaixo, leia fisicamente a `SKILL.md` correspondente:

| Comando / Fluxo | Fonte Única Acionada | Finalidade na Matriz |
|---|---|---|
| `/proxima-fatia` | `template/.agents/skills/ciclo-especificacao/SKILL.md` | Ler `openspec/roadmap.md`, abrir delta em `openspec/changes/`, aprovar Gate 1, executar Test-First e entregar no Gate 2 |
| `/fix` | `template/.agents/skills/ciclo-especificacao/SKILL.md` | Correção pontual em até 3 arquivos (inclui `template/scripts/*.mjs`) com teste staged antes da correção |
| `/retomar` | `tasks.md` ou `.agents/handoff.md` | Retomar trabalho exatamente de onde parou após `/compact` ou nova sessão |
| `/revisar` | `template/.agents/skills/revisar-fatia/SKILL.md` | Auditoria factual cega sob demanda comparando `git diff` ao roadmap/delta |
| `/refinar` / `/linear-inbox` | `template/.agents/skills/refinar-ideia/SKILL.md` | Capturar notas do Linear ou ideias avulsas, podar escopo e encaixar no roadmap |
| `/explorar` | `template/.agents/skills/explorar-produto/SKILL.md` | Reunião estratégica de evolução do protocolo (congelando código) |
| `/aprendizado` | `docs/aprendizados.md` | Registrar cicatriz empírica ou bug recorrente superado na matriz |
| **Skills distribuídas mantidas aqui** | `template/.agents/skills/inicializar-stack/SKILL.md`, `template/.agents/skills/mapear-brownfield/SKILL.md`, `template/.agents/skills/atualizar-governanca/SKILL.md`, `template/.agents/skills/reuso-e-modularizacao/SKILL.md`, `template/.agents/skills/auditoria-seguranca/SKILL.md`, `template/.agents/skills/auditoria-ux-analytics/SKILL.md` | Skills evoluídas dentro de `template/` e cobertas pelos testes em `tests/` |

---

## Documentação Viva e Estado do Repositório

- **Constituição Canônica:** `template/constitution.md`
- **Arquitetura e Mapa Físico da Matriz:** `docs/arquitetura.md` (C4, fluxo de arquivos e **Seção 5: Mapa Físico de Módulos** com sensor anti-apodrecimento ativo)
- **Particularidades de Ambiente e Regras:** `docs/particularidades.md`
- **Runbook de Testes, Copier e Releases:** `docs/runbook.md` (ritual SemVer complementando `CONTRIBUTING.md`)
- **Diário de Aprendizados e Cicatrizes:** `docs/aprendizados.md`
- **Registro Oficial de Decisões (ADRs):** `00_INDICE_E_DECISOES.md` (registro consolidado de decisões na raiz; sem diretório paralelo de ADRs)
- **OpenSpec da Matriz:** `openspec/project.md`, `openspec/roadmap.md`, `openspec/radar-oportunidades.md`, `openspec/config.yaml`, `openspec/specs/` e `openspec/changes/`
- **Changelog:** `CHANGELOG.md`
- **Handoff Efêmero Local:** `.agents/handoff.md` (gitignored; usado apenas quando não há delta ativo em `openspec/changes/`)
- **Hooks e MCPs:** `.agents/hooks.json` e `.mcp.json`
