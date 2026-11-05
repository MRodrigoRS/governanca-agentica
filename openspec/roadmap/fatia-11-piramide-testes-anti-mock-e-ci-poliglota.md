# Fatia 11: Pirâmide Moderna de Testes (Testing Trophy), Anti-Mock de Banco e CI Poliglota (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-11-piramide-testes-anti-mock-e-ci-poliglota`  
> **Depende diretamente de:** `fatia-10-reuso-tokens-movimento-e-component-as-asset.md`

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Política *Testing Trophy* e Cláusula Anti-Mocking de Banco Próprio (`constitution.md`, `.agents/rules/backend-seguranca-dados.md` e `verificar-governanca.mjs`):**
     - Institui a distinção clara das 3 camadas da pirâmide moderna: (a) **Unitário Puro** (< 50ms, regras matemáticas/domínio/colisões desacopladas), (b) **Integração Real** (rotas, repositórios, schemas e migrações rodando contra SQLite in-memory, PGlite ou banco local real de teste), e (c) **Smoke E2E Crítico + Acessibilidade** (fluxos vitais no navegador real).
     - Proíbe mockar o próprio ORM/cliente de banco de dados do projeto (`vi.mock`/`jest.mock`/`unittest.mock.patch` apontando para prisma, drizzle, db ou repositórios internos) em testes de integração/serviço, reservando mocks exclusivamente para APIs externas de terceiros (gateways de pagamento, provedores de e-mail/WhatsApp, LLMs externos). Inclui sensor determinístico em `verificar-governanca.mjs` (com válvula justificada para casos legados extremos) + auditoria cega no Inspetor Forense.
  2. **Fechamento do Furo Local em `template/lefthook.yml` (`pre-push` Poliglota + Testes Rápidos):**
     - Adiciona estágio determinístico no `lefthook.yml` garantindo que nenhum `git push` suba ao repositório remoto sem antes executar a suíte automatizada da stack ativa (Node/TS, Python `pytest`, Rust `cargo test`, .NET `dotnet test` ou Godot 4 GUT headless), cumprindo fisicamente o Artigo 4 (*Zero Testes Quebrados*).
  3. **CI Poliglota Íntegro e Seguro (`template/.github/workflows/ci.yml`):**
     - Remove o fallback silencioso `npm ci || npm install` (usando `npm ci` estrito quando `package-lock.json` existir, ou `pnpm install --frozen-lockfile` / `bun install --frozen-lockfile`), impedindo lockfiles corrompidos.
     - Adiciona jobs/etapas nativas para **Godot Engine 4 (`project.godot` via GUT headless CLI)** e **.NET / Avalonia (`*.csproj` / `*.sln` via `dotnet test`)**, cobrindo 100% do catálogo oficial de stacks.
     - Inclui validação de migrações limpas quando houver Prisma/Drizzle/Alembic e auditoria determinística de vulnerabilidades severas em dependências (`npm audit --audit-level=high`, `pip-audit` ou `cargo audit` / GitHub Dependency Review em PRs).
  4. **Padrão Oficial de Qualidade Web Real (`@axe-core/playwright` + Zero Console Errors):**
     - Atualiza `.agents/rules/web-ui-pwa.md` e `catalogo-stacks.md` com o contrato padrão de *Smoke Test E2E*: validação automática de acessibilidade WCAG (`@axe-core/playwright`), zero exceções não tratadas (`page.on('pageerror')`) e checagem nos viewports `320px` (mobile) e desktop para os fluxos críticos.

- **Por que esta fatia existe neste ponto da sequência:**
  Fecha o ciclo da **Governança v4.0.0** blindando a execução real: depois de desburocratizar o fluxo (Fatia 08), modularizar regras/documentação (Fatia 09) e padronizar reúso + GDScript (Fatia 10), esta fatia garante que testes e pipelines validem comportamento real em todas as linguagens e engines prometidas pela governança.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-10-reuso-tokens-movimento-e-component-as-asset.md` (que já introduziu `.gd` e testes GUT na classificação do verificador e consolidou os módulos `.agents/rules/`).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Consolida a release estável **Governança v4.0.0** pronta para uso em produção em SaaS, APIs, Desktop, Mobile, CLIs e Jogos 2D/3D.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** introduzir frameworks lentos de mutação física de código (Stryker, Mutmut) no `lefthook.yml` ou no CI padrão (mantendo a Decisão D31 de velocidade e zero desperdício).
  - **Proibido** exigir cobertura E2E Playwright em 100% das telas secundárias (o E2E deve focar em *Smoke Tests* dos fluxos críticos de negócio + acessibilidade, mantendo a base pesada em testes de integração rápidos).

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Sensor Anti-Mocking de Banco Próprio em `verificar-governanca.mjs`
Nos arquivos classificados em `ehArquivoDeTeste(arquivo)`:
- Detecta padrões explícitos de mock do banco/ORM interno do próprio projeto:
  - JS/TS: `(?:vi|jest)\.mock\(\s*['"][^'"]*(?:prisma|drizzle|\/db\b|database|repositorio|repository)['"]`
  - Python: `(?:@patch|mock\.patch)\(\s*['"][^'"]*(?:\.db\b|database|session|repositorio|repository)`
- Permite válvula explícita auditável pelo Inspetor Forense: `governanca:mock-banco-justificado: <motivo técnico >= 15 caracteres>` (para testes puramente unitários de adaptadores de erro de conexão onde simular queda de rede do driver é o objeto do teste). Sem essa justificativa, bloqueia com `exit 1` orientando usar banco de teste em memória/local (SQLite, PGlite ou container de teste).

### 3.2. Contrato Poliglota em `template/lefthook.yml` e `template/.github/workflows/ci.yml`
Suporte determinístico detectado por manifesto presente na raiz:
- **Node/TS (`package.json`):** Lockfile estrito (`npm ci` / `pnpm i --frozen-lockfile` / `yarn --immutable`) + `typecheck` + `lint` + `test` + `build` + `npm audit --omit=dev --audit-level=high`.
- **Python (`pyproject.toml`):** `uv sync --frozen` (ou `uv sync`) + `uv run ruff check .` + `uv run pytest`.
- **Rust / Bevy / Tauri (`Cargo.toml` / `src-tauri/Cargo.toml`):** `cargo test --locked`.
- **.NET / Avalonia (`*.sln` ou `*.csproj`):** `dotnet restore` + `dotnet build --no-restore` + `dotnet test --no-build`.
- **Godot Engine 4 (`project.godot`):** Execução headless de GUT quando `addons/gut/gut_cmdln.gd` estiver presente (`godot --headless --path . -s addons/gut/gut_cmdln.gd -gexit`).

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Contrato de Smoke Test Web + Acessibilidade (`.agents/rules/web-ui-pwa.md`):**
  - Todo projeto Web com Playwright deve incluir ao menos 1 teste de fumaça cobrindo a rota principal nos viewports `320x640` (ausência de overflow horizontal `document.documentElement.scrollWidth <= window.innerWidth`) e `1280x800`, anexando listener `page.on('pageerror', ...)` e varredura `@axe-core/playwright` sem violações críticas/sérias (`critical` / `serious`).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Integridade de Lockfile em CI:** Ao substituir `npm ci || npm install` por verificação determinística do gerenciador (`package-lock.json` $\rightarrow$ `npm ci`; `pnpm-lock.yaml` $\rightarrow$ `pnpm install --frozen-lockfile`; `bun.lockb`/`bun.lock` $\rightarrow$ `bun install --frozen-lockfile`), impede que dependências flutuantes diferentes das testadas localmente entrem em produção (proteção contra ataques de *Supply Chain*).
2. **Auditoria Forense de Fidelidade de Integração:** Os 3 arquivos do `inspetor-forense` passam a relatar explicitamente se os testes de backend/repositório exercitam persistência real (SQLite/PGlite/Postgres de teste) ou se mockaram camadas internas para fabricar um falso verde.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/piramide-testes-e-ci-poliglota.test.mjs` antes de alterar código/templates e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_bloquear_mock_do_proprio_banco_ou_orm_em_arquivos_de_teste`):**
   - *Cenário:* Testar em repositório temporário um arquivo `src/pedidos.test.ts` contendo `vi.mock('@/lib/prisma')` (e um `tests/test_usuarios.py` com `@patch('app.db.session')`) sem justificativa, e depois com `// governanca:mock-banco-justificado: simulação de queda abrupta de socket TCP do driver`.
   - *Resultado Esperado:* Sem justificativa bloqueia (`exitCode === 1` citando *Testing Trophy* / Anti-Mocking de Banco); com justificativa real aprova (`exitCode === 0`); mocks de terceiros como `vi.mock('@/lib/stripe')` aprovam normalmente (`exitCode === 0`).
2. **Teste 2 (`deve_configurar_pre_push_no_lefthook_para_impedir_push_quebrado`):**
   - *Cenário:* Ler `template/lefthook.yml` e `lefthook.yml` da raiz.
   - *Resultado Esperado:* Ambos contêm o hook `pre-push` executando os testes automatizados antes do envio remoto.
3. **Teste 3 (`deve_garantir_ci_poliglota_sem_fallback_silencioso_cobrindo_godot_e_dotnet`):**
   - *Cenário:* Inspecionar `template/.github/workflows/ci.yml`.
   - *Resultado Esperado:* Não contém `npm ci || npm install`, inclui checagens para Node, Python, Rust, `.NET` (`dotnet test`) e Godot 4 (`project.godot` / `gut_cmdln.gd`), além de etapa de auditoria de segurança.
4. **Teste 4 (`deve_documentar_smoke_e2e_axe_e_testing_trophy_nas_regras_e_inspetor`):**
   - *Cenário:* Inspecionar `template/constitution.md`, `template/.agents/rules/web-ui-pwa.md`, `template/.agents/rules/backend-seguranca-dados.md` e os 3 arquivos do Inspetor Forense.
   - *Resultado Esperado:* Contratos de `@axe-core/playwright`, viewport `320px` sem overflow e auditoria anti-mock presentes em paridade.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Sensor anti-mocking de banco próprio implementado em `template/scripts/verificar-governanca.mjs` com suporte a mocks legítimos de APIs externas e válvula auditável.
- [ ] `template/lefthook.yml` e `lefthook.yml` da raiz atualizados com `pre-push` executando testes automatizados.
- [ ] `template/.github/workflows/ci.yml` atualizado sem `npm ci || npm install`, cobrindo Node, Python, Rust, `.NET` e Godot 4 GUT headless + auditoria de CVEs.
- [ ] Regras de *Testing Trophy* e Smoke E2E + `@axe-core/playwright` consolidadas nos módulos `.agents/rules/` e no Inspetor Forense.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` executados com `exit 0`.
- [ ] `CHANGELOG.md` (fechando o ciclo `v4.0.0`) e `00_INDICE_E_DECISOES.md` atualizados.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** Terminal na raiz do repositório e inspeção de `template/lefthook.yml`, `template/.github/workflows/ci.yml` e `template/scripts/verificar-governanca.mjs`.
- **Passo a passo com dados prontos:**
  1. Execute a suíte integral do repositório:
     ```powershell
     npm test
     ```
  2. Verifique os validadores oficiais:
     ```powershell
     npx --yes @fission-ai/openspec validate --all --no-interactive
     node template/scripts/verificar-governanca.mjs
     ```
  3. Confira em `template/.github/workflows/ci.yml` os blocos poliglotas (Node, Python, Rust, .NET e Godot 4) e o lockfile estrito.
- **Comportamento visual esperado:** Suíte completa da Governança v4 passando 100% verde em milissegundos e todos os 4 pilares do ciclo v4.0.0 concluídos.
- **Teste de borda prático:** Criar um teste temporário contendo `vi.mock('../db/prisma')` vs. `vi.mock('../integracoes/stripe')` e comprovar que o primeiro é bloqueado determinísticamente enquanto o segundo passa limpo.
