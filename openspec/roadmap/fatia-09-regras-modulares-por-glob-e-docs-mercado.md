# Fatia 09: Regras Modulares por Perfil/Glob Sem Pontos Cegos e Documentação de Mercado (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-09-regras-modulares-por-glob-e-docs-mercado`  
> **Depende diretamente de:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md`  
> **Princípio Pétreo de Transição:** Zero ponto cego entre IDEs/CLIs. Ao modularizar regras por domínio, nenhuma ferramenta (mesmo sem suporte nativo a globs) pode ficar sem ler a regra aplicável antes de editar código.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Regras Modulares em Fonte Única (`template/.agents/rules/`) + Globs Nativos + Matriz Universal Anti-Ponto-Cego:**
     - Organiza as regras detalhadas de engenharia por domínio em `template/.agents/rules/` (mantendo os princípios supremos intactos na Constituição):
       - `web-ui-pwa.md` (responsividade 320px+, PWA, semântica, `Escape`, 44x44px, proibição de `location.reload`, 4 estados assíncronos, Toasts e Modais).
       - `backend-seguranca-dados.md` (Zero-Trust Anti-F12, ACID, CSP/HSTS/CORS, Rate Limiting, Zod/Pydantic/Serde e OWASP Agentic Top 10).
       - `jogos-engines.md` (desacoplamento lógica matemática pura vs. renderização WebGL/Canvas/Nodes, viewport adaptativo e testes headless).
       - `linear-mcp.md` (handshake `whoami`, Tríade de Âncora anti-vazamento de squads e sincronia nos Gates).
     - Gera wrappers finos (~5 linhas com `@` sem duplicar texto) com `paths`/`globs`/`applyTo` nativos em `template/.claude/rules/`, `template/.cursor/rules/` e `template/.github/instructions/`.
     - **Blindagem Universal Anti-Ponto-Cego:** Inclui em `template/AGENTS.md` uma **Matriz Obrigatória de Leitura Pré-Edição por Domínio** (para agentes CLI ou IDEs que não acionem globs automaticamente) e em `hook-agente.mjs` (`SessionStart` / lembrete contextual) a sinalização dos módulos ativos, além de tornar `template/openspec/config.yaml.jinja` inteligente por perfil para não cobrar PWA/Toasts em CLIs, APIs puras e Jogos.
  2. **Kit de Documentação Viva no Padrão de Mercado (Diátaxis + C4 + Entidades Core + 12-Factor App):**
     - `template/docs/arquitetura.md` (protegido em `_skip_if_exists` no `copier.yml`): modelo contendo **C4 Nível 1 (Contexto)**, **C4 Nível 2 (Containers)** e **Diagrama `erDiagram` das Entidades Core e Isolamento de Dados** em Mermaid (garantindo visão arquitetural sistêmica desde o Gate 0).
     - `template/README.md.jinja` + `template/.env.example`: guia de setup rápido (Pré-requisitos, Instalação em 3 passos, Testes/Build e índice Diátaxis), protegidos em `_skip_if_exists`.
     - **Sensor Determinístico de `.env.example` em `verificar-governanca.mjs`:** bloqueia (`exit 1`) commits em que código de produção leia variáveis de ambiente (`process.env.X`, `import.meta.env.X`, `os.getenv("X")`, `os.environ["X"]`, `std::env::var("X")`, `os.Getenv("X")`, `Environment.GetEnvironmentVariable("X")`) ausentes de `.env.example` (isentando variáveis padrão de SO/runtime).
  3. **Unificação SemVer `v4.0.0`, Ritual de Release e Faxina Histórica na Raiz:**
     - Unifica a versão em **`v4.0.0`** nos cabeçalhos `governanca:inicio`, `package.json`, `README.md` e `00_INDICE_E_DECISOES.md`, instituindo o ritual de fechamento SemVer no `CHANGELOG.md`.
     - Arquiva os 8 documentos históricos da transição v1→v2 da raiz em `docs/historico/` preservando 100% do conteúdo e atualizando todos os links em `00_INDICE_E_DECISOES.md`.

- **Por que esta fatia existe neste ponto da sequência:**
  Cria os trilhos modulares por domínio sem pontos cegos e o mapa de arquitetura C4 + ER Core, preparando a base exata para a **Fatia 10** plugar Reúso, Tokens de Movimento e *Component-as-Asset*.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md`.
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Disponibiliza `template/.agents/rules/web-ui-pwa.md` e `template/.agents/rules/jogos-engines.md` (com ativação automática por glob e matriz universal em `AGENTS.md`) para a **Fatia 10** expandir com *Reuse-Before-Create*, Tokens de Movimento e *Component-as-Asset*.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** apagar da Constituição os princípios pétreos de cada artigo ao detalhar os módulos em `.agents/rules/` (a Constituição guarda a lei inegociável; o módulo guarda o protocolo detalhado por glob/domínio, garantindo dupla rede de proteção).
  - **Proibido** duplicar texto longo nos wrappers de `.claude/rules/`, `.cursor/rules/` e `.github/instructions/`.
  - **Proibido** implementar `catalogo-reuso.md` ou teto de 350 linhas úteis nesta fatia (escopo exclusivo da **Fatia 10**).

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Mapeamento de Globs, Fonte Única e Matriz Universal (`template/.agents/rules/` + `AGENTS.md`)

| Fonte Única Canônica | Globs Nativos (`.claude`, `.cursor`, `.github`) | Gatilho Universal em `AGENTS.md` |
|---|---|---|
| `.agents/rules/web-ui-pwa.md` | `**/*.tsx`, `**/*.jsx`, `**/*.vue`, `**/*.svelte`, `**/*.css`, `**/manifest*.json` | Leitura obrigatória antes de planejar ou editar qualquer rota/componente de UI Web |
| `.agents/rules/backend-seguranca-dados.md` | `**/api/**`, `**/server/**`, `**/routes/**`, `**/controllers/**`, `**/*.prisma`, `**/schema*.ts`, `**/*.py`, `**/*.rs`, `**/*.go`, `**/*.cs` | Leitura obrigatória antes de tocar em APIs, persistência, filas ou autenticação |
| `.agents/rules/jogos-engines.md` | `**/*.gd`, `**/*.tscn`, `**/project.godot`, `**/scenes/**`, `**/prefabs/**`, `**/*.wgsl`, `**/*.glsl` | Leitura obrigatória antes de estruturar cenas, física, shaders ou loops de jogo |
| `.agents/rules/linear-mcp.md` | `openspec/**` | Leitura obrigatória antes de qualquer chamada ao servidor MCP `linear` |

### 3.2. Contrato do Sensor Determinístico `.env.example` (`verificar-governanca.mjs`)
- Escaneia arquivos de produção modificados capturando leituras de ambiente em JS/TS, Python, Rust, Go e C#.
- Ignora variáveis nativas de SO/runtime: `NODE_ENV`, `CI`, `PATH`, `HOME`, `USERPROFILE`, `TZ`, `LANG`, `PWD`, `PORT`, `HOST`, `TMP`, `TEMP`, `PROD`, `DEV`, `SSR`, `MODE`, `BASE_URL`.
- Exige declaração da chave `VARIAVEL=` em `.env.example` (ou `.env.template`) e rejeita (`exit 1`) tanto variáveis omitidas quanto chaves reais sensíveis coladas acidentalmente no `.env.example`.

### 3.3. Proteções em `copier.yml`
Garantir em `_skip_if_exists`: `"README.md"`, `".env.example"` e `"docs/arquitetura.md"`.

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Adequação de `template/openspec/config.yaml.jinja`:** Cobra 4 estados assíncronos, Toasts e Modais sempre que a mudança envolver interface interativa/mutações visuais, deixando CLIs, workers e bibliotecas livres de preenchimento artificial, mas **mantendo 100% de obrigatoriedade para aplicações Web/Desktop/Mobile**.
- **Diagramas em `template/docs/arquitetura.md`:** Contém templates Mermaid prontos para `flowchart TD` (C4 Contexto e Containers) e `erDiagram` (Entidades Core e relacionamentos estruturantes definidos no Gate 0).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Dupla Rede de Proteção (Constituição + Regra Modular):** Os princípios constitucionais dos Artigos 6, 7 e 13 permanecem resumidos como cláusulas pétreas na `constitution.md` enquanto os checklists operacionais completos vivem em `.agents/rules/`, garantindo que nenhum agente desconheça a lei mesmo antes de abrir um arquivo específico.
2. **Integridade Histórica Sem Perda de Dados:** Os 8 documentos históricos movidos para `docs/historico/` permanecem 100% íntegros no Git (`git mv` sem alterar uma vírgula do conteúdo histórico) e com todos os links de `00_INDICE_E_DECISOES.md` validados por teste.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/regras-modulares-e-docs-mercado.test.mjs` antes das edições de produção e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_possuir_fonte_unica_wrappers_nativos_e_matriz_universal_sem_ponto_cego`):**
   - *Cenário:* Auditar `template/.agents/rules/*.md`, wrappers em `.claude/rules/`, `.cursor/rules/`, `.github/instructions/` e a Matriz Obrigatória em `template/AGENTS.md`.
   - *Resultado Esperado:* Quatro módulos existem, wrappers têm < 15 linhas apontando para `.agents/rules/` e `AGENTS.md` exige leitura pré-edição por domínio.
2. **Teste 2 (`deve_bloquear_variavel_ambiente_omitida_ou_segredo_real_no_env_example`):**
   - *Cenário:* Testar código lendo `process.env.ASAAS_API_KEY` sem `.env.example` $\rightarrow$ bloqueia (`exitCode === 1`); com `ASAAS_API_KEY=` vazia/placeholder em `.env.example` $\rightarrow$ aprova (`exitCode === 0`); `process.env.NODE_ENV` isolada $\rightarrow$ aprova (`exitCode === 0`).
   - *Resultado Esperado:* Sensor determinístico preciso e sem falsos positivos.
3. **Teste 3 (`deve_fornecer_arquitetura_c4_com_er_core_readme_e_protecao_copier`):**
   - *Cenário:* Auditar `template/docs/arquitetura.md` (presença de C4 Contexto, Containers e `erDiagram`), `template/README.md.jinja`, `template/.env.example` e `_skip_if_exists` em `copier.yml`.
   - *Resultado Esperado:* Todos presentes e protegidos contra sobrescrita.
4. **Teste 4 (`deve_unificar_semver_v4_e_preservar_documentos_em_docs_historico_com_links_validos`):**
   - *Cenário:* Conferir `v4.0.0` sincronizado, existência dos 8 documentos em `docs/historico/` e resolução física de todos os links Markdown em `00_INDICE_E_DECISOES.md`.
   - *Resultado Esperado:* 100% íntegro e zero links quebrados.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Módulos em `template/.agents/rules/`, wrappers nativos nas 3 IDEs e Matriz Universal em `template/AGENTS.md` criados.
- [ ] `template/docs/arquitetura.md` (C4 + `erDiagram` Core), `template/README.md.jinja` e `template/.env.example` criados e protegidos em `copier.yml`.
- [ ] Sensor determinístico de `.env.example` ativo em `template/scripts/verificar-governanca.mjs`.
- [ ] Versão SemVer `v4.0.0` unificada e documentos v1→v2 arquivados em `docs/historico/` com links íntegros.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` passando com `exit 0`.
- [ ] `CHANGELOG.md` e `00_INDICE_E_DECISOES.md` atualizados.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** Raiz do repositório, `docs/historico/`, `template/.agents/rules/` e `template/docs/arquitetura.md`.
- **Passo a passo com dados prontos:**
  1. Execute `npm test` e confirme 100% de aprovação.
  2. Abra `template/docs/arquitetura.md` no preview Markdown para validar os diagramas C4 e `erDiagram` das Entidades Core.
  3. Clique nos links de `00_INDICE_E_DECISOES.md` apontando para `docs/historico/` e confirme navegação limpa.
- **Comportamento visual esperado:** Raiz enxuta, regras carregadas por glob sem perder cobertura em CLIs e documentação de mercado completa desde o Gate 0.
- **Teste de borda prático:** Referenciar uma variável `STRIPE_SECRET_KEY` num arquivo `.ts` de teste temporário sem declará-la no `.env.example` e comprovar o bloqueio determinístico imediato.
