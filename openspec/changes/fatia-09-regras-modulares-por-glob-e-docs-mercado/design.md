# Design Técnico — Regras Modulares por Glob e Documentação de Mercado

## Contratos, Dados e Schemas

### 1. Configuração do Copier (`copier.yml`)
- Pergunta `perfis_projeto`:
  ```yaml
  perfis_projeto:
    type: str
    help: "Quais perfis compõem este projeto? (separe por vírgula se mais de um)"
    default: "web-ui, api-backend"
    choices:
      - "web-ui"
      - "api-backend"
      - "desktop"
      - "mobile"
      - "jogo"
      - "cli-biblioteca"
  ```
- Proteções adicionadas em `_skip_if_exists`:
  - `"README.md"`
  - `".env.example"`
  - `"docs/arquitetura.md"`
  - `".gitignore"`

### 2. Estrutura dos Módulos em `.agents/rules/`
- `web-ui-pwa.md.jinja`:
  ```markdown
  ---
  trigger: glob
  globs:
    - "**/*.tsx"
    - "**/*.jsx"
    - "**/*.vue"
    - "**/*.svelte"
    - "**/*.css"
    - "**/manifest*.json"
  ---
  ```
- `backend-seguranca-dados.md.jinja`:
  ```markdown
  ---
  trigger: glob
  globs:
    - "**/api/**"
    - "**/server/**"
    - "**/routes/**"
    - "**/controllers/**"
    - "**/*.prisma"
    - "**/schema*.ts"
    - "**/migrations/**"
    - "**/*.py"
    - "**/*.go"
  ---
  ```
- `jogos-engines.md.jinja`:
  ```markdown
  ---
  trigger: glob
  globs:
    - "**/*.gd"
    - "**/*.tscn"
    - "**/project.godot"
    - "**/scenes/**"
    - "**/prefabs/**"
    - "**/*.wgsl"
    - "**/*.glsl"
  ---
  ```
- `linear-mcp.md.jinja` (renderizado apenas se `integrar_linear: true`):
  ```markdown
  ---
  trigger: model_decision
  description: "Ativar antes de consultar ou manipular tarefas, issues e status no servidor MCP do Linear"
  ---
  ```

### 3. Modelo do Documento `template/docs/arquitetura.md`
- Seção 1: Visão Geral e Contexto de Negócio (C4 Nível 1 - Contexto em Mermaid `flowchart TD`).
- Seção 2: Contêineres e Aplicações (C4 Nível 2 - Contêineres em Mermaid `flowchart TD`).
- Seção 3: Modelo Físico de Entidades (`erDiagram` em Mermaid com nomes de tabelas em PT-BR).
- Seção 4: Glossário de Domínio (Tabela com colunas: `Termo de Negócio`, `Identificador no Código`, `Tabela/Coleção`, `Observação`).

---

## Interface e Estados Assíncronos
Não se aplica diretamente como telas de frontend neste repositório de governança. O protocolo opera sobre configurações, regras de linters, hooks de agente e templates Copier. Entretanto, a especificação das regras para projetos consumidores com interface web (`web-ui-pwa.md`) exige rigorosamente a implementação dos 4 estados (`loading`, `empty`, `error`, `success`), Toasts reativos para mutações de dados e Modais de Confirmação para ações destrutivas.

---

## Regras de Negócio e Segurança

### 1. Sensor Determinístico `.env.example`
- Executado em `verificar-governanca.mjs` apenas para arquivos de código de produção staged (`ehArquivoDeProducao`).
- Extração de nomes de variáveis via regex para:
  - `process.env.VAR`
  - `import.meta.env.VAR`
  - `os.getenv("VAR")` / `os.environ["VAR"]` / `os.environ.get("VAR")`
  - `std::env::var("VAR")`
  - `os.Getenv("VAR")`
  - `Environment.GetEnvironmentVariable("VAR")`
- Lista de variáveis globais do sistema ignoradas: `NODE_ENV`, `CI`, `PATH`, `HOME`, `USERPROFILE`, `TZ`, `LANG`, `PWD`, `PORT`, `HOST`, `TMP`, `TEMP`, `PROD`, `DEV`, `SSR`, `MODE`, `BASE_URL`.
- Checagem de existência da variável em `.env.example` (ou `.env.template`) através de declaração `VAR=`.
- Detecção de segredos reais inseridos por engano no `.env.example`:
  - Prefixos proibidos: `sk_live_`, `sk_test_`, `ghp_`, `github_pat_`, `xox`, `AKIA`, `-----BEGIN`.
  - Strings com mais de 32 caracteres alfanuméricos sem separadores e sem conter palavras padrão de placeholder (`placeholder`, `exemplo`, `sample`, `chave`, `token`, `secret`, `sua-chave`).

### 2. Gatilho Determinístico de Arquitetura
- Se `git diff --cached` contiver arquivos classificados como `ehSchemaOuMigracaoDeBanco` fora de fundação, o verificador exige que `docs/arquitetura.md` esteja presente na lista staged, sob pena de bloqueio determinístico (`exit 1`).

### 3. Blindagem Ativa contra Leitura de `.env` por Agentes
- No `hook-agente.mjs`:
  - Intercepta chamadas de leitura de arquivos (`read_file`, `view`, etc.) verificando se o caminho aponta para `.env*` (salvo `.env.example` e `.env.template`). Em caso positivo, retorna resposta de bloqueio (`deny`) orientando o uso do `.env.example`.
  - Intercepta comandos de terminal (`cat`, `type`, `Get-Content`, `more`, `head`, `tail`) que tentem inspecionar `.env*`.
- Em `.claude/settings.json`:
  - Adiciona regra em `permissions.deny` para `Read(path:**/.env*)` com exceção de `**/.env.example*`.

### 4. Gestão de Releases e SemVer
- Ritual formalizado em `CONTRIBUTING.md`.
- Sincronização entre `package.json` (`version`) e os cabeçalhos de comentários delimitados nos templates e documentos canônicos.
- Reparo das tags históricas `v3.4.0` a `v3.7.0` e introdução da linha de pré-release `v4.0.0-alpha.1`.
- Migração dos 8 documentos históricos da transição v1→v2 para `docs/historico/` via `git mv`.
