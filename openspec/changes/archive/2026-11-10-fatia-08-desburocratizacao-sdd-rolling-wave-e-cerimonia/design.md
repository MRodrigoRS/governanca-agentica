# Design Técnico — Fatia 08: Desburocratização SDD, Rolling Wave e Níveis de Cerimônia

## Contratos, Dados e Schemas

### 1. Estrutura do Arquivo `openspec/roadmap.md` (`roadmap.md.jinja`)
O documento adota formato Markdown com duas seções mestras:
1. `## 1. Invariantes Globais do Gate 0`:
   Tabela Markdown contendo colunas: `Invariante`, `Decisão` e `Impacto nas Fatias`.
   Cobre: Chave de Isolamento / Multi-tenancy, Modelo de Autenticação e Papéis, Filas e Eventos Assíncronos, Entidades Estruturantes do Domínio e Convenção de IDs.
2. `## 2. Fila de Fatias Incrementais (Rolling Wave)`:
   Blocos no nível de cabeçalho `### [ ] fatia-XX-<slug>`.
   Cada bloco contém obrigatoriamente as 4 âncoras textuais:
   - `Depende de:`
   - `Objetivo de Valor:`
   - `O que ENTRA:`
   - `O que FICA DE FORA:`

### 2. Módulo `template/scripts/lib/classificar-arquivos.mjs`
Exporta as funções puras de classificação consumidas por `verificar-governanca.mjs`, `validar-commit-msg.mjs` e `hook-agente.mjs`:
- `ehArquivoDeTeste(caminho)`: suporta raiz `tests/`, `test/`, `__tests__/`, subpastas `/tests/`, sufixos `.test.`, `.spec.`, `_test.go`, `_test.rs`, `tests.cs`, `test.cs` e padrões Python `test_*.py` e `*_test.py` em qualquer profundidade.
- `ehArquivoDeDocumentacaoOuGovernanca(caminho)`: lista exata de arquivos raiz, pastas `.github/`, `.cursor/`, `.claude/`, `.agents/`, `docs/`, `openspec/`, `template/` (no repositório pai) e restringe `scripts/` a `scripts/verificar-governanca.mjs`, `scripts/validar-commit-msg.mjs`, `scripts/hook-agente.mjs` e qualquer script sob `scripts/lib/`.
- `ehManifestoDeDependencia(caminho)`
- `ehSchemaOuMigracaoDeBanco(caminho)`
- `ehArquivoDeFrontend(caminho)`
- `ehArquivoDeProducao(caminho)`

### 3. Módulo `template/scripts/lib/classificar-cerimonia.mjs`
Contrato para identificação e validação de vias:
- `identificarViaCerimonia(arquivosStaged, mensagemCommit)`
- Validação de Via 1.5:
  - Permite > 3 arquivos de produção ou bump de versão existente em `package.json`.
  - Compara `HEAD:package.json` com `package.json` staged para detectar se foram introduzidos pacotes inéditos em `dependencies`, `devDependencies`, `peerDependencies` ou `optionalDependencies`.
  - Verifica se o diff de `CHANGELOG.md` contém linhas adicionadas sob a seção `### Adicionado`.
  - Bloqueia schemas ou migrações de banco (`schema.prisma`, `drizzle`, `migrations`, etc.).
  - Tipos permitidos para Via 1.5: `refactor`, `perf`, `style`, `chore`, `build`. Rejeita `feat` e `fix`.
- Validação de Via 1a (`fix`):
  - Exige ao menos um arquivo de teste staged quando houver arquivos de produção modificados.
- Validação de Via 1b (`style`):
  - Verifica linhas adicionadas em arquivos de código com regex anti-contrabando:
    `/\b(if\s*\(|switch\s*\(|\?\s*[^:]+:|use[A-Z]\w*\s*\(|on[A-Z]\w*\s*=|fetch\s*\(|await\s+)/` (com tolerância a condicionais ternárias estritas em strings de atributos de classes).

## Interface e Estados Assíncronos
Não se aplica: Esta fatia não introduz componentes de interface gráfica web ou mobile, tratando-se de infraestrutura de governança, scripts CLI e templates. As interfaces afetadas são as mensagens de erro determinístico e diagnóstico em terminal formatadas em Português do Brasil com cores ANSI e códigos de saída adequados.

## Regras de Negócio e Segurança

### 1. Zero Regressão e Emenda por Re-mapeamento Constitucional
A Constituição da Governança (`template/constitution.md`) é alterada sem perda de critérios técnicos, garantias ou exemplos (`obterUsuario`, `salvarPedido`, `44x44`, `Escape`, `whoami`, `ACID`, `Circuit Breaker`).
Os artigos com mecânica alterada (8.3, 8.5, 11.2, 12.2–12.4) são mapeados diretamente para os artefatos v4:
- 8.3: Pilares auditados em `openspec/changes/<fatia>/` e bloco em `openspec/roadmap.md`.
- 8.5: Aprovação do `roadmap.md` no Gate 0 com Invariantes Globais.
- 11.2: Marco 1 grava `project.md` e `roadmap.md`.
- 12.2–12.4: Leitura física do bloco em `roadmap.md` e dos 4 artefatos de delta do OpenSpec.

### 2. Cartão de Invariantes em `template/AGENTS.md`
Bloco conciso de até 15 linhas inserido no início de `AGENTS.md` contendo as regras inegociáveis que mais causam interrupções:
Test-First mandatório, teto do `/fix`, aprovação humana obrigatória em commits e comandos destrutivos, PT-BR no domínio, proibição de `location.reload`, notificações Toast e Modais de confirmação, e handshake de segurança `whoami`.
