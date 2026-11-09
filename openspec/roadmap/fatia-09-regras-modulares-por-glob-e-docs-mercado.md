# Fatia 09: Regras Modulares por Perfil/Glob Sem Pontos Cegos e Documentação de Mercado (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-09-regras-modulares-por-glob-e-docs-mercado`  
> **Depende diretamente de:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md`  
> **Princípio Pétreo de Transição:** Zero ponto cego entre IDEs/CLIs. Ao modularizar regras por domínio, nenhuma ferramenta (mesmo sem suporte nativo a globs) pode ficar sem ler a regra aplicável antes de editar código.
> **Revisão 2026-11-05:** Adicionados (a) pergunta Copier `perfis_projeto` como fonte determinística do perfil (a versão anterior pedia `config.yaml` "inteligente" sem dizer de onde vinha o perfil), (b) frontmatter nativo do Antigravity em `.agents/rules/`, (c) `linear-mcp.md` sem glob e condicional a `integrar_linear`, (d) `docs/arquitetura.md` como dono único do modelo de entidades + Glossário de Domínio + gatilho de atualização, (e) seção `Comandos do Projeto` em `AGENTS.md`, (f) `.gitignore` do template (inexistente hoje) e bloqueio de leitura de `.env` por agentes, (g) SemVer com tags reais — as tags pararam em `v3.3.0` enquanto o pacote está em `3.7.0`, então consumidores via `copier update` não recebem as fatias 04–07 — e pré-releases `v4.0.0-alpha.N` até a Fatia 11.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Regras Modulares em Fonte Única (`template/.agents/rules/`) + Perfil Determinístico + Matriz Universal Anti-Ponto-Cego:**
     - Nova pergunta `perfis_projeto` (multiseleção) no `copier.yml`: `web-ui`, `api-backend`, `desktop`, `mobile`, `jogo`, `cli-biblioteca`. Ela decide **quais módulos são renderizados** e quais regras entram em `openspec/config.yaml` — projeto CLI não carrega PWA/Toasts; jogo não carrega CSP/HSTS.
     - Módulos (com frontmatter nativo do Antigravity `trigger: glob` + `globs:`, que lê `.agents/rules/` diretamente):
       - `web-ui-pwa.md` (responsividade 320px+, PWA, semântica, `Escape`, 44x44px, proibição de `location.reload`, 4 estados assíncronos, Toasts e Modais).
       - `backend-seguranca-dados.md` (Zero-Trust Anti-F12, ACID, CSP/HSTS/CORS, Rate Limiting, Zod/Pydantic/Serde, OWASP Agentic Top 10).
       - `jogos-engines.md` (lógica pura desacoplada da renderização, viewport adaptativo, testes headless).
       - `linear-mcp.md` — **renderizado só quando `integrar_linear` for verdadeiro** e ativado por descrição (`trigger: model_decision`), não por glob: chamadas MCP não editam arquivos, então um glob como `openspec/**` nunca dispararia no momento certo.
     - Wrappers finos (< 15 linhas, sem texto duplicado) em `template/.claude/rules/` (`paths:` + import `@`), `template/.cursor/rules/*.mdc` (`globs:` + referência `@`) e `template/.github/instructions/*.instructions.md` (`applyTo:` + link + ordem explícita de leitura).
     - **Matriz Obrigatória de Leitura Pré-Edição** em `AGENTS.md` e lembrete no `SessionStart` de `hook-agente.mjs` listando os módulos ativos do perfil.
  2. **Kit de Documentação Viva no Padrão de Mercado:**
     - `template/docs/arquitetura.md` (protegido): C4 Nível 1 e 2 em Mermaid + `erDiagram` **como construído** + **Glossário de Domínio** (termo de negócio ↔ identificador PT-BR no código ↔ tabela), absorvendo a parte de entidades do `roadmap.md` (que mantém só os Invariantes planejados e um link). Uma fonte para o modelo de dados, não duas.
     - **Gatilho de atualização:** commit Nível 2 que altera schema/migração sem `docs/arquitetura.md` staged → `exit 1`. Documentação sem gatilho apodrece já na segunda fatia.
     - **`## Comandos do Projeto` em `template/AGENTS.md`** (fora do bloco `governanca:inicio`, preservado em updates): instalar, rodar em dev, testar tudo, **testar um único arquivo**, typecheck, lint, build e migrações. É a informação que agentes mais consultam (padrão agents.md) e hoje não existe em lugar nenhum. `inicializar-stack` preenche no Gate 0; `README.md.jinja` aponta para ela em vez de duplicar.
     - `template/README.md.jinja` + `template/.env.example` (protegidos): visão, pré-requisitos, instalação em 3 passos e índice Diátaxis.
     - **`template/.gitignore`** (hoje inexistente): `.env`, `.env.*`, `!.env.example`, artefatos de build e `node_modules/`.
  3. **Sensor `.env.example` + Proteção de Segredos Contra Leitura por Agentes:**
     - `verificar-governanca.mjs` bloqueia variáveis lidas em arquivos de produção **staged** e ausentes de `.env.example`.
     - Bloqueio de leitura de `.env*` (exceto `.env.example`) pelos agentes: `permissions.deny` em `.claude/settings.json` e regra `deny` em `hook-agente.mjs` para `read_file`/`view` e comandos `cat`/`type`/`Get-Content`/`more` sobre `.env*`. Segredos lidos pelo agente vão para o provedor do modelo — o Gitleaks só protege no commit.
  4. **SemVer com Tags Reais, Ritual de Release e Faxina Histórica:**
     - Fonte única de versão: `package.json`. Teste exige que todos os cabeçalhos `governanca:inicio vX.Y.Z` (incluindo `copilot-instructions.md`, hoje em `v2.0.0`), `project.md.jinja` ("Governança v2") e `atualizar-governanca` ("v2") batam com ela.
     - Ritual de release documentado em `CONTRIBUTING.md` desta raiz: bump → `CHANGELOG.md` → testes → commit → `git tag vX.Y.Z` (com `force_ask`) → `git push --tags`.
     - Reparo histórico: criar as tags faltantes `v3.4.0`–`v3.7.0` nos commits de fechamento correspondentes.
     - Ciclo v4 em pré-release: Fatias 08, 09, 09a e 10 recebem `v4.0.0-alpha.N` (o `copier update` ignora pré-releases por padrão, então consumidores não recebem uma v4 incompleta); a Fatia 11 publica `v4.0.0`.
     - Arquivamento dos 8 documentos v1→v2 da raiz em `docs/historico/` via `git mv`, com links de `00_INDICE_E_DECISOES.md` validados por teste.

- **Por que esta fatia existe neste ponto da sequência:**
  Cria os trilhos modulares por perfil sem pontos cegos e o mapa de arquitetura vivo, preparando a base para a **Fatia 09a** (comandos de atalho reutilizando o mesmo mecanismo de wrappers) e para a **Fatia 10** (Reúso, Tokens de Movimento e *Component-as-Asset* dentro de `web-ui-pwa.md`/`jogos-engines.md`).

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md` (Cartão de Invariantes, `roadmap.md`, `scripts/lib/`).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Mecanismo de wrappers multi-harness reaproveitado pela **Fatia 09a** para comandos de atalho.
  - `web-ui-pwa.md` e `jogos-engines.md` prontos para a **Fatia 10**; `perfis_projeto` pronto para a Fatia 11 escolher jobs de CI.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** apagar da Constituição os princípios pétreos ao detalhar módulos (a Constituição guarda a lei; o módulo guarda o protocolo detalhado — dupla rede de proteção).
  - **Proibido** duplicar texto longo nos wrappers.
  - **Proibido** implementar `catalogo-reuso.md`, teto de linhas (Fatia 10) ou comandos de atalho (Fatia 09a).
  - **Proibido** publicar a tag `v4.0.0` estável (reservada à Fatia 11).

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Perfis, Módulos e Gatilhos

| Módulo (`.agents/rules/`) | Renderizado quando `perfis_projeto` contém | Globs nativos | Gatilho Universal em `AGENTS.md` |
|---|---|---|---|
| `web-ui-pwa.md` | `web-ui`, `desktop`, `mobile` | `**/*.tsx`, `**/*.jsx`, `**/*.vue`, `**/*.svelte`, `**/*.css`, `**/manifest*.json` | Antes de planejar ou editar rota/componente de UI |
| `backend-seguranca-dados.md` | `api-backend`, `web-ui` | `**/api/**`, `**/server/**`, `**/routes/**`, `**/controllers/**`, `**/*.prisma`, `**/schema*.ts`, `**/migrations/**`, `**/*.py`, `**/*.go` | Antes de tocar APIs, persistência, filas ou autenticação |
| `jogos-engines.md` | `jogo` | `**/*.gd`, `**/*.tscn`, `**/project.godot`, `**/scenes/**`, `**/prefabs/**`, `**/*.wgsl`, `**/*.glsl` | Antes de estruturar cenas, física, shaders ou loops |
| `linear-mcp.md` | `integrar_linear: true` (independe do perfil) | — (`trigger: model_decision`) | Antes de qualquer chamada ao MCP `linear` |

*Nota:* `**/*.rs` e `**/*.cs` não entram no glob de backend porque colidiriam com Bevy e Godot C#; a Matriz em `AGENTS.md` cobre backends Rust/.NET por intenção.

### 3.2. Contrato do Sensor `.env.example`
- Escopo: somente arquivos de produção **staged** (custo constante, sem varrer o repositório).
- Padrões: `process.env.X`, `import.meta.env.X`, `os.getenv("X")`, `os.environ["X"]`, `std::env::var("X")`, `os.Getenv("X")`, `Environment.GetEnvironmentVariable("X")`.
- Ignora variáveis de SO/runtime: `NODE_ENV`, `CI`, `PATH`, `HOME`, `USERPROFILE`, `TZ`, `LANG`, `PWD`, `PORT`, `HOST`, `TMP`, `TEMP`, `PROD`, `DEV`, `SSR`, `MODE`, `BASE_URL`.
- Exige `VARIAVEL=` em `.env.example` (ou `.env.template`).
- Rejeita valor que pareça segredo real em `.env.example`: prefixos `sk_live_`, `sk_test_`, `ghp_`, `github_pat_`, `xox`, `AKIA`, `-----BEGIN`, ou valor com 32+ caracteres alfanuméricos sem espaços. Placeholders (`""`, `changeme`, `<sua-chave>`, `sk_test_xxx`) passam.

### 3.3. Contrato do Gatilho de `docs/arquitetura.md`
Se o commit contém arquivo classificado por `ehSchemaOuMigracaoDeBanco` **e** não é Marco 1, então `docs/arquitetura.md` precisa estar staged; senão `exit 1` com orientação para atualizar o `erDiagram` e o Glossário.

### 3.4. Proteções em `copier.yml`
`_skip_if_exists`: `"README.md"`, `".env.example"`, `"docs/arquitetura.md"`, `".gitignore"`. Nova pergunta `perfis_projeto` (`multiselect: true`, padrão `["web-ui", "api-backend"]`).

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **`openspec/config.yaml.jinja` por perfil:** regras de 4 estados, Toasts e Modais aparecem em `rules.design` somente quando o perfil inclui `web-ui`/`desktop`/`mobile`; para `cli-biblioteca` e `api-backend` puro entram regras de contrato de saída/códigos de erro. A obrigatoriedade para apps interativos continua 100%.
- **`docs/arquitetura.md`:** templates Mermaid `flowchart TD` (C4 Contexto e Containers) e `erDiagram`, mais tabela do Glossário (`Termo de Negócio` | `Identificador no Código` | `Tabela/Coleção` | `Observação`).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Dupla Rede de Proteção:** princípios dos Artigos 6, 7 e 13 permanecem na Constituição; checklists operacionais vivem em `.agents/rules/`.
2. **Segredos fora do contexto do agente:** bloqueio de leitura de `.env*` nos hooks; mensagem orientando usar `.env.example` como referência de nomes.
3. **Integridade Histórica:** `git mv` sem alterar conteúdo; links validados por teste.
4. **Tags somente com aprovação humana:** `git tag` e `git push --tags` passam a ser tratados como comandos sensíveis (`force_ask`) em `hook-agente.mjs`.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/regras-modulares-e-docs-mercado.test.mjs` antes das edições de produção e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_renderizar_modulos_conforme_perfil_e_wrappers_sem_duplicacao`):** gerar via Copier com `perfis_projeto=[cli-biblioteca]` → sem `web-ui-pwa.md`; com `[web-ui]` → presente com frontmatter `trigger: glob`; wrappers < 15 linhas apontando para `.agents/rules/`; `linear-mcp.md` só existe com `integrar_linear=true`.
2. **Teste 2 (`deve_bloquear_variavel_ambiente_omitida_ou_segredo_real_no_env_example`):** `process.env.ASAAS_API_KEY` sem declaração → `1`; com `ASAAS_API_KEY=` → `0`; `NODE_ENV` isolada → `0`; `.env.example` com `STRIPE_SECRET_KEY=sk_live_51H...` → `1`.
3. **Teste 3 (`deve_exigir_arquitetura_md_quando_schema_mudar`):** `schema.prisma` + delta ativo sem `docs/arquitetura.md` staged → `1`; com ele → `0`.
4. **Teste 4 (`deve_bloquear_leitura_de_env_pelo_agente`):** payload `read_file` em `.env.local` e comando `Get-Content .env` → `deny`; `.env.example` → `allow`.
5. **Teste 5 (`deve_fornecer_kit_de_docs_comandos_do_projeto_e_gitignore`):** existem `docs/arquitetura.md` (C4 + `erDiagram` + Glossário), `README.md.jinja`, `.env.example`, `.gitignore` com `!.env.example`, seção `## Comandos do Projeto` em `AGENTS.md` fora do bloco governado e proteções no `copier.yml`.
6. **Teste 6 (`deve_sincronizar_versao_em_cabecalhos_e_preservar_historico`):** todos os cabeçalhos `governanca:inicio` iguais à versão do `package.json`; 8 documentos em `docs/historico/`; zero links quebrados em `00_INDICE_E_DECISOES.md`.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] `perfis_projeto` no Copier; módulos condicionais com frontmatter Antigravity; wrappers nas 3 IDEs; Matriz em `AGENTS.md`.
- [ ] `docs/arquitetura.md` (C4 + `erDiagram` + Glossário) com gatilho determinístico; `roadmap.md.jinja` aponta para ele.
- [ ] `## Comandos do Projeto` em `AGENTS.md` e preenchimento obrigatório em `inicializar-stack`.
- [ ] `.gitignore`, `README.md.jinja`, `.env.example` criados e protegidos; sensor `.env.example` e bloqueio de leitura de `.env` ativos.
- [ ] Versões sincronizadas, tags `v3.4.0`–`v3.7.0` reparadas, `v4.0.0-alpha.N` aplicada; ritual de release documentado; histórico arquivado.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` com `exit 0`.
- [ ] `CHANGELOG.md` e `00_INDICE_E_DECISOES.md` atualizados.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** raiz do repositório, projeto gerado em `$env:TEMP\gov-v4-web` e `$env:TEMP\gov-v4-cli`.
- **Passo a passo com dados prontos:**
  1. `uvx copier copy --defaults --data perfis_projeto='["cli-biblioteca"]' . $env:TEMP\gov-v4-cli` e confirme que não há `web-ui-pwa.md` nem regras de Toast no `openspec/config.yaml`.
  2. Abra `template/docs/arquitetura.md` no preview Markdown e confira os diagramas C4, `erDiagram` e o Glossário.
  3. Rode `git tag --list "v3.*"` e confirme `v3.4.0` até `v3.7.0`.
- **Comportamento visual esperado:** projeto CLI enxuto; projeto Web com módulos de UI; agente recebe `deny` ao tentar ler `.env`.
- **Teste de borda prático:** referenciar `process.env.STRIPE_SECRET_KEY` num `.ts` sem declarar em `.env.example` → bloqueio imediato.
