# Design Técnico: Fatia 21 — Hierarquia Constitucional Anti-Diluição e Sensores de Maturidade (`v4.7.0`)

## Contratos, Dados e Schemas

1. **Mapeamento das 3 Faixas em `template/constitution.md` (Preservando Artigos 1–14):**
   - **Faixa 1 — Crítico (`P0` — Segurança, Dados, Anti-Teatro e Zero-Bypass):**
     - `Artigo 2` (Test-First, Testing Trophy, Anti-Mock de Banco Próprio e Prova de Runtime)
     - `Artigo 3` (Zero Testes Quebrados e Zero Avisos Críticos)
     - `Artigo 4` (Zero Segredos em Código)
     - `Artigo 7` (Engenharia Backend e Zero-Trust)
     - `Artigo 11` (Rotina de Commits Cadenciada e Autorizada pelo Humano)
     - `Artigo 13` (Isolamento Multi-Squad, Tríade de Âncora e Handshake)
   - **Faixa 2 — Engenharia (`P1` — Qualidade Estrutural, UI/UX e Reúso):**
     - `Artigo 1` (Cláusula Anti-Brinquedo — Bases Robustas)
     - `Artigo 5` (Dependências Justificadas e Mínimas)
     - `Artigo 6` (Padrões Práticos de Engenharia Frontend)
     - `Artigo 10` (Idioma PT-BR no Domínio, Rastreabilidade e CHANGELOG)
     - `Artigo 14` (Governança de Reúso, Tokens de Movimento, Component-as-Asset e Teto Anti-Monólito)
   - **Faixa 3 — Processo (`P2` — Cadência, Arquiteto Crítico, Depuração e Higiene):**
     - `Artigo 8` (Honestidade Radical, Arquiteto Crítico, Pesquisa Viva e Gates Humanos)
     - `Artigo 9` (Circuit Breaker de 3 Tentativas e Depuração Sistemática `/debug`)
     - `Artigo 12` (Proibido Deduzir de Cabeça, Leitura Física, Rastreabilidade e Prevenção de Context Rot)
   - **Formato dos Cabeçalhos:** `## Artigo N — [Faixa X — <Rótulo>] <Título Original>` (preserva regexes e buscas por `## Artigo N` e mantém merge 3-way do Copier limpo).

2. **Módulo Puro `template/scripts/lib/sensores-maturidade.mjs` (`<= 350` linhas úteis):**
   - Assinatura principal: `export function coletarAvisosMaturidade(cwd = process.cwd(), ehFundacao = false)` retornando `string[]`.
   - Quando `ehFundacao === true`, retorna `[]` (evita ruído no commit inicial do Gate 0).
   - Varredura segura de arquivos (`contarArquivosUiOuJogo(cwd)`): ignora `node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`, `.output`, `.venv`, `target`, `vendor`, `addons`, `coverage`, `openspec`, `docs`, `tests`; conta extensões `.tsx`, `.jsx`, `.vue`, `.svelte`, `.gd` parando assim que atingir o limiar (`>= 5`) para custo O(1) prático.
   - Checagem de `docs/catalogo-reuso.md`: usa regex tabular (`extrairPonteirosTabelaMarkdown` ou equivalente local leve) verificando se há `>= 1` ponteiro entre crases com `/` ou `.` fora do cabeçalho/guia em itálico.
   - Checagem de `openspec/matriz-requisitos.md`: conta subpastas de `openspec/changes/archive/` (excluindo dotfiles) e arquivos `.md` em `docs/conhecimento/` (excluindo `INDICE.md` e `materiais/`); se `(archives >= 4 || capitulos >= 5)` e `openspec/matriz-requisitos.md` existir sem nenhum `REQ-\d{2,4}` (via `parsearTabelaMatriz` de `auditar-matriz-requisitos.mjs`), emite `[AVISO MATURIDADE]`.
   - Checagem de `docs/runbook.md`: verifica existência de arquivos de infra/deploy (`Dockerfile`, `Dockerfile.*`, `docker-compose*.yml|yaml`, `vercel.json`, `fly.toml`, `render.yaml`, `render.yml`, `railway.json`, `railway.toml`, `Procfile` na raiz ou `.github/workflows/*deploy*.yml|yaml`) e se `docs/runbook.md` existe contendo `*(Ex.:` em ao menos 2 seções; se sim, emite `[AVISO MATURIDADE]`.

3. **Integração e Sincronia (`v4.7.0`):**
   - `template/scripts/verificar-governanca.mjs`: importa `coletarAvisosMaturidade` e inclui seu retorno em `infos` (preservando teto `<= 350` linhas úteis — atualmente em 276).
   - `template/AGENTS.md`: Cartão de Invariantes rotulado por `[Faixa 1]`, `[Faixa 2]`, `[Faixa 3]` e nota sobre `[AVISO MATURIDADE]`; cabeçalho `v4.7.0`.
   - `lefthook.yml`, `.github/workflows/ci.yml`, `docs/arquitetura.md` (§5), `package.json`, `template/openspec/project.md.jinja`, `catalogo-stacks.md`, `README.md`, `00_INDICE_E_DECISOES.md` (`D49`), `CHANGELOG.md`.

## Interface e Estados Assíncronos
Não se aplica: projeto CLI/biblioteca em Node.js ESM e templates Markdown/Jinja2 sem interface gráfica de usuário.

## Regras de Negócio e Segurança
- **Zero Afrouxamento de Rigor:** Nenhum artigo constitucional é tornado opcional em projetos pequenos; as faixas combatem diluição de atenção mantendo 100% do rigor desde o commit 1.
- **Sensores Estritamente Informativos:** `coletarAvisosMaturidade` nunca chama `process.exit(1)` nem bloqueia commits (`exit 0` garantido), evitando falsos bloqueios em projetos legados ou durante `uvx copier update`.
- **Zero Dependências Externas & Teto Anti-Monólito:** `sensores-maturidade.mjs` usa apenas `node:fs` e `node:path` e permanece `<= 350` linhas úteis (assim como `verificar-governanca.mjs`).
