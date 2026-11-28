# Design Técnico: Fatia 23 — Calibração Empírica e Anti-Diluição (v4.9.0 / D51)

## Contratos, Dados e Schemas

### 1. Extrator Markdown e Filtro de Ponteiros (`template/scripts/lib/sensores-indices.mjs`)
- Nova função pura exportada:
  ```js
  export function extrairPonteirosMarkdown(
    linhas,
    { permitirDiretorios = false, aceitarListas = false, cwd = null } = {}
  )
  ```
- `extrairPonteirosTabelaMarkdown(linhas, permitirDiretorios = false)` permanece exportada como wrapper retrocompatível delegando para `extrairPonteirosMarkdown(linhas, { permitirDiretorios, aceitarListas: false })`.
- Regras de varredura de `extrairPonteirosMarkdown`:
  1. Ignora blocos de código cercados (linhas que iniciam com `` ``` `` ou `~~~`).
  2. Aceita linha de tabela (`linha.startsWith('|')` ignorando separadores `^\|[\s:-]+\|$`) **ou**, quando `aceitarListas === true`, item de lista (`/^[-*]\s+/.test(linha)`).
  3. Rejeita tokens com espaço ou caracteres inválidos de caminho (`[\s*<>{}()]`), URLs (`https?://`), pacotes npm escopados (`@escopo/pacote`), exemplos (`Ex.: ...`), prefixos/sufixos inválidos.
- Filtro `ehPonteiroDeDisco(caminho, { permitirDiretorios, aceitarListas, cwd })`:
  1. Para `catalogo-reuso.md` (`aceitarListas: true` e `permitirDiretorios: false`), considera caminho válido quando contiver `/` (ex.: `src/components/Botao.tsx`) ou for arquivo raiz conhecido.
  2. Para `docs/arquitetura.md §5` (`permitirDiretorios: true`), considera ponteiro de disco **apenas** quando:
     - Contiver `/` (exceto prefixo de esquema ou URL já descartado) — ex.: `src/app/`, `public/sw.js`, `tests/`; **OU**
     - Estiver em `ARQUIVOS_RAIZ_CONHECIDOS` (Set case-insensitive: `package.json`, `tsconfig.json`, `dockerfile`, `lefthook.yml`, `.env.example`, `.gitattributes`, `copier.yml`, `readme.md`, `changelog.md`, `agents.md`, `constitution.md`, `biome.json`, `vercel.json`, `fly.toml`, `procfile`, `pyproject.toml`, `cargo.toml`, `go.mod`, `project.godot`, além de `*.config.ts|js|mjs|cjs`); **OU**
     - Quando `cwd` for informado e o caminho existir fisicamente em `join(cwd, caminho)` (protegendo arquivos reais na raiz sem gerar falso positivo para tokens descritivos).
  3. Tokens descartados explicitamente antes da checagem de disco:
     - Versões SemVer (`/^v?\d+\.\d+(?:\.\d+)?(?:-[a-z0-9.-]+)?$/i`, ex.: `v4.8.0`);
     - Expressões comuns JS/TS sem `/` (ex.: `req.body`, `res.json`, `process.env`, identificadores em `camelCase.prop` / `snake_case.prop` cujo sufixo após o último ponto não seja extensão real conhecida **e** que não existam no disco em `cwd`);
     - Basenames soltos sem `/` dentro de prosa/descrição que não sejam arquivos raiz conhecidos nem existam na raiz.
- Em `verificarSensorAntiApodrecimentoCatalogo(cwd, arquivosModificados)`: aciona `auditarPonteirosMarkdown` com `{ permitirDiretorios: false, aceitarListas: true, cwd }`.
- Em `verificarSensorAntiApodrecimentoMapaArquitetura(cwd, arquivosModificados)`: aciona `auditarPonteirosMarkdown` com `{ permitirDiretorios: true, aceitarListas: false, cwd }`.
- Em `template/scripts/lib/sensores-maturidade.mjs`: `verificarSensorCatalogoReuso(cwd)` chama `extrairPonteirosMarkdown(conteudo.split('\n'), { permitirDiretorios: false, aceitarListas: true, cwd })` e retorna `null` quando encontrar `>= 1` ponteiro real (preservando ignorar a linha de placeholder do template que não tem caminho válido com `/` nem arquivo raiz).

### 2. Flexibilização de Cabeçalhos OpenSpec (`template/scripts/lib/auditar-openspec.mjs`)
- Mantém 100% do bloqueio estrutural D18/D32 (arquivos obrigatórios, mínimo de linhas úteis, `WHEN`/`THEN`, marcadores de preguiça, vínculo com roadmap), ampliando os conjuntos de sinônimos PT-BR/EN:
  - `proposal.md`:
    - Por que: `/^##\s+.*(Por que|Por Qu[êe]|Motiva[çc][ãa]o|Contexto|Problema|Justificativa|Why|Goal)/im`
    - O que muda: `/^##\s+.*(O que muda|Escopo|Mudan[çc]as|Entrega|Solu[çc][ãa]o|What Changes|Scope)/im`
    - Fora de escopo: `/(Fica de Fora|Fora de Escopo|N[ãa]o Entra|Out of Scope)/i`
  - `design.md`:
    - Contratos/Dados: `/^##\s+.*(Contratos|Dados|Schemas?|Modelos?|Arquitetura|Entidades|APIs?|Contracts?|Data)/im`
    - Interface/Estados: `/^##\s+.*(Interface|Estados?|UI|UX|Telas?|Componentes?|Frontend|Views?)/im` ou `/N[ãa]o se aplica:\s*.{10,}/i`
    - Regras/Segurança: `/^##\s+.*(Regras|Seguran[çc]a|Valida[çc][õo]es|Autoriza[çc][ãa]o|Riscos?|Rules|Security)/im`
  - `tasks.md`:
    - Test-First: `/(Vermelho|Red|teste falhando|TDD|Test-First)/i`
    - Roteiro prático: `/^##\s+.*(Roteiro de Valida[çc][ãa]o Pr[áa]tica|Roteiro Pr[áa]tico|Roteiro de Valida[çc][ãa]o|Checklist de Valida[çc][ãa]o|Valida[çc][ãa]o Manual|Como Testar|Verification)/im`

### 3. `.gitattributes` na Matriz e no Template Copier
- Criar `.gitattributes` na raiz e `template/.gitattributes` **fora** de `_skip_if_exists` em `copier.yml`:
  - `* text=auto eol=lf`
  - `*.mjs`, `*.js`, `*.cjs`, `*.ts`, `*.tsx`, `*.jsx`, `*.md`, `*.jinja`, `*.yml`, `*.yaml`, `*.json`, `*.css`, `*.html`, `*.py`, `*.rs`, `*.sql`, `*.sh` → `text eol=lf`
  - `*.ps1`, `*.bat`, `*.cmd` → `text eol=crlf`
- Verificar `test -f /tmp/teste-governanca/.gitattributes` no job Copier de `.github/workflows/ci.yml`.

### 4. Redução do Bloco Gerenciado de `template/AGENTS.md` (`<= 130` linhas)
- Preservar integralmente `<!-- governanca:inicio v4.9.0 ... -->` até `<!-- governanca:fim -->` com no máximo **130 linhas** dentro do bloco gerenciado (mantendo fora dele `## Regras Específicas Deste Projeto` e `## Comandos do Projeto`).
- Estrutura compacta mantendo todas as âncoras exigidas por `tests/template-docs.test.mjs`, `artefatos-e-higiene-chat.test.mjs`, `blindagem-motor-e-agregador.test.mjs`, `template-linear.test.mjs`, `mesa-de-descoberta.test.mjs`, `onboarding-brownfield.test.mjs`, `pesquisa-viva-e-arquiteto-critico.test.mjs`, `explorar-produto-skill.test.mjs`, `depuracao-e-prova-runtime.test.mjs` e `hardening-producao.test.mjs`:
  - Cabeçalho `v4.9.0` + ponteiro para `@[constitution.md](constitution.md)` (detalhe completo das Faixas 1, 2 e 3).
  - Cartão enxuto focado na **Faixa 1 (`P0`)** (`[Faixa 1 — Crítico]`) + ponteiro único para Faixas 2 (`P1`) e 3 (`P2`) em `constitution.md` (atualizando `tests/hierarquia-e-maturidade.test.mjs` conforme decisão alinhada).
  - Matriz Universal de Leitura Pré-Edição (citando todas as 4 rules `.agents/rules/*.md`, `.sql`, `expand-and-contract`, `requestId`, `/health`).
  - Seção compacta de Ciclo, Gates e Descoberta (citando Greenfield -> `mesa-de-descoberta` + `inicializar-stack`, Brownfield -> `mapear-brownfield` `/mapear-projeto` congelamento, Pesquisa Viva, Arquiteto Crítico, isenção trivial/cosmética, Via 1a/1b/1.5/2, Circuit Breaker `/debug`, Prova de Runtime, `plano-fatia`/`entrega-fatia`/`RequestFeedback`/20 linhas, válvulas de escape, fechamento atômico `openspec archive` antes de `git commit`, `/explorar`/`/evoluir` Conselho de 3 Subagentes, e Tríade de Âncora Linear + `whoami` + fallback silencioso + confirmação humana / novas tarefas ou edições).
  - Seção compacta de Documentos Vivos, `scripts/` e Skills (listando todos os arquivos de `template/docs/*.md`, `.agents/handoff.md` e todas as 14 skills).
  - Tabela canônica com os 18 comandos `/`.

## Interface e Estados Assíncronos
Não se aplica: repositório cli-biblioteca sem interface gráfica de usuário.

## Regras de Negócio e Segurança
- **Preservação de Integridade `P0`:** Nenhum ajuste reduz proteção contra segredos, IDOR, mock de banco próprio, testes ocos, commits sem aprovação humana ou isolamento Linear.
- **Retrocompatibilidade:** `extrairPonteirosTabelaMarkdown` continua exportada para não quebrar eventuais importações existentes; `auditar-openspec.mjs` continua aceitando 100% dos cabeçalhos v3 e v4 atuais enquanto amplia sinônimos.
- **Teto Anti-Monólito (Artigo 14):** Todos os módulos editados em `template/scripts/lib/` devem permanecer bem abaixo de 350 linhas úteis em ESM Node.js puro zero-dependências.
- **Contrato SemVer e `_skip_if_exists`:** Bump sincronizado para `4.9.0` e registro de `D51` em `00_INDICE_E_DECISOES.md`.
