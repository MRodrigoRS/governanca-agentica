# Fatia 11: Pirâmide Moderna de Testes (Testing Trophy), Anti-Mock de Banco e CI Poliglota (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-11-piramide-testes-anti-mock-e-ci-poliglota`  
> **Depende diretamente de:** `fatia-10-reuso-tokens-movimento-e-component-as-asset.md`
> **Revisão 2026-11-05:** Adicionados (a) detecção de `vi.spyOn`/`jest.spyOn` e atribuição direta `.mockResolvedValue` sobre clientes ORM/banco (evitando bypass trivial de `vi.mock`), (b) refinamento do regex Python para não bloquear falsamente `@patch('requests.Session')` ou `stripe.checkout.Session`, (c) execução de testes rápidos já no `pre-commit` (além da suíte completa no `pre-push`) para cumprir o Artigo 4 no momento real do Marco 2 (`git commit`), (d) fallback seguro quando o binário `godot` não estiver no `PATH` local da máquina do dev, (e) falha explícita no CI quando nenhum lockfile for comitado (em vez de pular silenciosamente), (f) execução de `validar-commit-msg.mjs` no CI e atualização do job de dogfooding Copier em `.github/workflows/ci.yml`, e (g) graduação da pré-release `v4.0.0-alpha.N` para a release estável **`v4.0.0`**.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Política *Testing Trophy* e Cláusula Anti-Mocking de Banco Próprio (`constitution.md`, `.agents/rules/backend-seguranca-dados.md` e `verificar-governanca.mjs`):**
     - Institui a distinção clara das 3 camadas da pirâmide moderna: (a) **Unitário Puro** (< 50ms, regras matemáticas/domínio/colisões desacopladas), (b) **Integração Real** (rotas, repositórios, schemas e migrações rodando contra SQLite in-memory, PGlite ou banco local real de teste), e (c) **Smoke E2E Crítico + Acessibilidade** (fluxos vitais no navegador real).
     - Proíbe mockar o próprio ORM/cliente de banco de dados do projeto em testes de integração/serviço — cobrindo tanto mocks de módulo (`vi.mock`/`jest.mock`/`unittest.mock.patch`) quanto *spies* e stubs diretos em instâncias do ORM (`vi.spyOn(prisma...)`, `jest.spyOn(db...)`, `.mockResolvedValue` em models do banco) —, reservando mocks exclusivamente para APIs externas de terceiros (gateways de pagamento, provedores de e-mail/WhatsApp, LLMs externos).
     - Refina o detector Python para ancorar em termos reais de persistência (`db.session`, `SessionLocal`, `AsyncSession`, `sqlalchemy`, `repositorio`, `repository`), impedindo falsos positivos em sessões HTTP ou SDKs externos (`requests.Session`, `aiohttp.ClientSession`, `stripe.checkout.Session`).
     - Inclui válvula explícita auditável pelo Inspetor Forense (`governanca:mock-banco-justificado: <motivo técnico >= 15 caracteres>`) para testes unitários de adaptadores de falha de driver/rede.
  2. **Fechamento do Furo Local em `template/lefthook.yml` (`pre-commit` Rápido + `pre-push` Poliglota Completo):**
     - **Por que no `pre-commit` E no `pre-push`:** O Artigo 4 proíbe realizar commits com testes quebrados, e o Marco 2 humano ocorre no `git commit`. Se os testes rodassem apenas no `pre-push`, o agente passaria pelo Gate 2 e comitaria código quebrado localmente.
     - No `pre-commit`: executa testes unitários rápidos da stack ativa (`npm run --if-present test:unit` ou `npm test` rápido, `pytest -m "not slow"`, `cargo test --lib`).
     - No `pre-push`: executa a suíte automatizada completa da stack ativa (Node/TS, Python `pytest`, Rust `cargo test`, .NET `dotnet test` ou Godot 4 GUT headless com detecção de binário no `PATH`).
  3. **CI Poliglota Íntegro, Lockfile Obrigatório e Validação de Mensagem (`template/.github/workflows/ci.yml` e `.github/workflows/ci.yml`):**
     - **Fim do fallback `npm ci || npm install` e exigência de Lockfile:** Detecta o lockfile exato (`package-lock.json` → `npm ci`; `pnpm-lock.yaml` → `corepack enable && pnpm install --frozen-lockfile`; `yarn.lock` → `corepack enable && yarn install --immutable`; `bun.lockb`/`bun.lock` → `bun install --frozen-lockfile`). Se `package.json` existir sem nenhum lockfile comitado, **falha com `exit 1`** exigindo lockfile versionado.
     - **Validação de Mensagem de Commit também no CI:** O job `governanca-e-specs` passa a validar também o título do commit/PR via `node scripts/validar-commit-msg.mjs`, fechando a brecha de commits feitos com bypass fora do ambiente local.
     - **Cobertura Poliglota Completa:** Adiciona suporte nativo para **Godot Engine 4 (`project.godot` + `addons/gut/gut_cmdln.gd` via binário Godot headless)** e **.NET / Avalonia (`*.csproj` / `*.sln` via `dotnet test`)**, validação de migrações limpas (Prisma/Drizzle/Alembic) e auditoria de vulnerabilidades (`npm audit --omit=dev --audit-level=high`, `pip-audit` ou `cargo audit`).
     - **Dogfooding no CI da própria Governança (`.github/workflows/ci.yml`):** Atualiza o teste de geração do Copier para validar todos os artefatos da v4 (`openspec/roadmap.md`, `docs/arquitetura.md`, `docs/catalogo-reuso.md`, `.agents/rules/`, `.gitignore`, `.env.example`, `.github/pull_request_template.md`).
  4. **Padrão Oficial de Qualidade Web Real (`@axe-core/playwright` + Zero Console Errors):**
     - Atualiza `.agents/rules/web-ui-pwa.md` e `catalogo-stacks.md` com o contrato padrão de *Smoke Test E2E*: validação automática de acessibilidade WCAG (`@axe-core/playwright`), zero exceções não tratadas (`page.on('pageerror')` e `console.error` críticos) e checagem de ausência de overflow horizontal (`scrollWidth <= innerWidth`) nos viewports `320x640` e `1280x800`.
  5. **Fechamento e Publicação da Release Estável `v4.0.0`:**
     - Gradua a versão de `4.0.0-alpha.N` para **`4.0.0`** estável em `package.json` e em todos os cabeçalhos `governanca:inicio v4.0.0`, fechando a seção `## [4.0.0]` no `CHANGELOG.md` e gerando a tag `v4.0.0` para consumo imediato via `uvx copier copy` / `uvx copier update`.

- **Por que esta fatia existe neste ponto da sequência:**
  Fecha o ciclo da **Governança v4.0.0** blindando a execução real: depois de desburocratizar o fluxo (Fatia 08), modularizar regras/documentação (Fatia 09), criar comandos/handoff (Fatia 09a) e padronizar reúso + GDScript (Fatia 10), esta fatia garante que testes e pipelines validem comportamento real em todas as linguagens e engines prometidas pela governança e publica a versão `v4.0.0` estável.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-10-reuso-tokens-movimento-e-component-as-asset.md` (que introduziu `.gd` e testes GUT na classificação do verificador e consolidou os módulos `.agents/rules/`).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Consolida e publica a release estável **Governança v4.0.0** pronta para uso em produção em SaaS, APIs, Desktop, Mobile, CLIs e Jogos 2D/3D.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** introduzir frameworks lentos de mutação física de código (Stryker, Mutmut) no `lefthook.yml` ou no CI padrão (mantendo a Decisão D31 de velocidade e zero desperdício).
  - **Proibido** exigir cobertura E2E Playwright em 100% das telas secundárias (o E2E deve focar em *Smoke Tests* dos fluxos críticos de negócio + acessibilidade, mantendo a base pesada em testes de integração rápidos).
  - **Proibido** quebrar o `pre-push` local caso o desenvolvedor de jogos não tenha o binário `godot` adicionado ao `PATH` global do sistema operacional (deve exibir aviso claro local e exigir execução estrita no CI).

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Sensor Anti-Mocking de Banco Próprio em `verificar-governanca.mjs`
Nos arquivos modificados classificados em `ehArquivoDeTeste(arquivo)`:
- Detecta padrões explícitos de mock ou spy do banco/ORM interno do próprio projeto:
  - **JS/TS (Mock de módulo):** `(?:vi|jest)\.mock\(\s*['"][^'"]*(?:prisma|drizzle|\/db\b|database|repositorio|repository)['"]`
  - **JS/TS (Spy/Stub direto em cliente de banco):** `(?:vi|jest)\.spyOn\(\s*(?:prisma|db|database|repositorio|repository)\b` ou `\b(?:prisma|db)\.[a-zA-Z0-9_$]+\.(?:find|create|update|delete|upsert|execute|query)[a-zA-Z0-9_$]*\s*=\s*(?:vi|jest)\.fn\(`
  - **Python (Mock de sessão/repositório de banco, sem falso positivo em HTTP/Stripe):** `(?:@patch|mock\.patch(?:\.object)?)\(\s*['"][^'"]*(?:\bdb\b|database|db_session|SessionLocal|AsyncSession|sqlalchemy|prisma|repositorio|repository)`
- **Válvula Auditável:** `governanca:mock-banco-justificado: <motivo técnico >= 15 caracteres>` (para testes puramente unitários de adaptadores de erro de conexão onde simular queda de rede do driver é o objeto do teste). Sem essa justificativa, bloqueia com `exit 1` orientando usar banco de teste em memória/local (SQLite, PGlite ou container de teste).

### 3.2. Contrato Poliglota em `template/lefthook.yml` e `template/.github/workflows/ci.yml`
Suporte determinístico detectado por manifesto presente na raiz:
- **Node/TS (`package.json`):**
  - Verificação obrigatória de lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock` ou `bun.lockb`; falha com `exit 1` no CI se nenhum existir).
  - `typecheck` + `lint` + `test` + `build` + auditoria de segurança (`npm audit --omit=dev --audit-level=high` / equivalente).
- **Python (`pyproject.toml`):** `uv sync --frozen` (ou `uv sync`) + `uv run ruff check .` + `uv run pytest` + `uv run pip-audit` (se configurado).
- **Rust / Bevy / Tauri (`Cargo.toml` / `src-tauri/Cargo.toml`):** `cargo test --locked`.
- **.NET / Avalonia (`*.sln` ou `*.csproj`):** `dotnet restore` + `dotnet build --no-restore` + `dotnet test --no-build`.
- **Godot Engine 4 (`project.godot`):** Execução headless de GUT quando `addons/gut/gut_cmdln.gd` estiver presente (`godot --headless --path . -s addons/gut/gut_cmdln.gd -gexit`), verificando código de saída e ausência de falhas no resumo do GUT.

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Contrato de Smoke Test Web + Acessibilidade (`.agents/rules/web-ui-pwa.md`):**
  - Todo projeto Web com Playwright deve incluir ao menos 1 teste de fumaça cobrindo a rota principal nos viewports `320x640` (ausência de overflow horizontal `document.documentElement.scrollWidth <= window.innerWidth`) e `1280x800`, anexando listener `page.on('pageerror', ...)` e varredura `@axe-core/playwright` sem violações críticas/sérias (`critical` / `serious`).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Integridade de Lockfile em CI:** Ao substituir `npm ci || npm install` por verificação determinística do gerenciador e bloquear ausência de lockfile, impede que dependências flutuantes diferentes das testadas localmente entrem em produção (proteção contra ataques de *Supply Chain*).
2. **Paridade Local ↔ CI na Mensagem de Commit:** O job `governanca-e-specs` grava a mensagem do último commit em arquivo temporário e executa `node scripts/validar-commit-msg.mjs`, garantindo que a Matriz das 4 Vias de Cerimônia (Fatia 08) seja fiscalizada tanto localmente quanto no servidor remoto.
3. **Auditoria Forense de Fidelidade de Integração:** Os 3 arquivos do `inspetor-forense` passam a relatar explicitamente se os testes de backend/repositório exercitam persistência real (SQLite/PGlite/Postgres de teste) ou se mockaram camadas internas para fabricar um falso verde.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/piramide-testes-e-ci-poliglota.test.mjs` antes de alterar código/templates e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_bloquear_mock_e_spy_do_proprio_banco_ou_orm_sem_falso_positivo_em_http`):**
   - *Cenário:* Testar em repositório temporário: (a) `src/pedidos.test.ts` com `vi.mock('@/lib/prisma')` ou `vi.spyOn(prisma.pedido, 'create')` sem justificativa → bloqueia (`exitCode === 1`); (b) `tests/test_usuarios.py` com `@patch('app.db.session')` sem justificativa → bloqueia (`1`); (c) `tests/test_integracao.py` com `@patch('requests.Session.post')` e `src/pagamentos.test.ts` com `vi.mock('@/lib/stripe')` → aprovam (`0`); (d) com `// governanca:mock-banco-justificado: simulação de queda abrupta de socket TCP do driver` → aprova (`0`).
2. **Teste 2 (`deve_configurar_testes_no_pre_commit_e_pre_push_do_lefthook`):**
   - *Cenário:* Ler `template/lefthook.yml` e `lefthook.yml` da raiz.
   - *Resultado Esperado:* `template/lefthook.yml` contém execução rápida de testes no `pre-commit` e suíte poliglota completa no `pre-push` (com checagem segura de binário para Godot); `lefthook.yml` da raiz também possui `pre-push`.
3. **Teste 3 (`deve_garantir_ci_poliglota_lockfile_estrito_e_validacao_commit_msg`):**
   - *Cenário:* Inspecionar `template/.github/workflows/ci.yml` e `.github/workflows/ci.yml`.
   - *Resultado Esperado:* `template/.github/workflows/ci.yml` não contém `npm ci || npm install`, exige lockfile, executa `validar-commit-msg.mjs`, cobre Node, Python, Rust, `.NET` (`dotnet test`) e Godot 4 (`project.godot` / `gut_cmdln.gd`) + auditoria de segurança; `.github/workflows/ci.yml` testa a geração Copier de todos os novos arquivos da v4.
4. **Teste 4 (`deve_documentar_smoke_e2e_axe_testing_trophy_e_fechar_release_v4_estavel`):**
   - *Cenário:* Inspecionar `template/constitution.md`, `template/.agents/rules/web-ui-pwa.md`, `template/.agents/rules/backend-seguranca-dados.md`, os 3 arquivos do Inspetor Forense e a versão `4.0.0` estável em `package.json` e nos cabeçalhos `governanca:inicio`.
   - *Resultado Esperado:* Contratos de `@axe-core/playwright`, viewport `320px` sem overflow, auditoria anti-mock e versão `v4.0.0` estável 100% sincronizados.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Sensor anti-mocking/anti-spy de banco próprio implementado em `template/scripts/verificar-governanca.mjs` (sem falsos positivos em `requests.Session`/`stripe`) e com válvula auditável.
- [ ] `template/lefthook.yml` e `lefthook.yml` da raiz atualizados com testes rápidos no `pre-commit` e suíte poliglota no `pre-push`.
- [ ] `template/.github/workflows/ci.yml` atualizado sem `npm ci || npm install`, com lockfile obrigatório, `validar-commit-msg.mjs`, suporte a Node, Python, Rust, `.NET` e Godot 4 GUT headless + auditoria de CVEs, e `.github/workflows/ci.yml` validando artefatos v4 no Copier.
- [ ] Regras de *Testing Trophy* e Smoke E2E + `@axe-core/playwright` consolidadas nos módulos `.agents/rules/` e no Inspetor Forense.
- [ ] Release `v4.0.0` estável sincronizada em `package.json`, cabeçalhos `governanca:inicio`, `CHANGELOG.md` e `00_INDICE_E_DECISOES.md`.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` executados com `exit 0`.

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
  3. Confira em `template/.github/workflows/ci.yml` os blocos poliglotas (Node, Python, Rust, .NET e Godot 4), a validação de lockfile estrito e a execução do `validar-commit-msg.mjs`.
- **Comportamento visual esperado:** Suíte completa da Governança v4.0.0 passando 100% verde e todos os 5 marcos do ciclo v4 (Fatias 08, 09, 09a, 10 e 11) concluídos.
- **Teste de borda prático:** Criar um teste temporário contendo `vi.spyOn(prisma.usuario, 'create')` vs. `@patch('requests.Session.post')` e comprovar que o primeiro é bloqueado determinísticamente enquanto o segundo passa limpo.
