# Design Técnico: Matriz de Rastreabilidade End-to-End (`v4.3.0`)

## Contratos, Dados e Schemas
- **Artefato Distribuído (`template/openspec/matriz-requisitos.md.jinja`):**
  - Tabela sob `## 1. Requisitos Rastreados` com 6 colunas: `ID | Requisito (1 frase objetiva) | Fonte (Livro / Decisão) | Capacidade / Fatia | Status | Prova Real (Spec / Teste)`.
  - Linha-guia inicial no template usa texto em itálico sem crases (`*(Preencher via /sintetizar ou Gate 0)*`) para impedir falso positivo no primeiro commit após `uvx copier copy --defaults`.
  - Protegido em `copier.yml` sob `_skip_if_exists` (`- "openspec/matriz-requisitos.md"`).
- **Módulo Auditor (`template/scripts/lib/auditar-matriz-requisitos.mjs`):**
  - Exporta `resumirMatrizRequisitos(raiz)` (retorna `{ existe, total, entregues, emAndamento, pendentes, descartados }` ou `null`) para uso compartilhado com `hook-agente.mjs`.
  - Exporta `parsearMatrizRequisitos(conteudo)` e `auditarMatrizRequisitos(opcoes)` recebendo `{ cwd, modificados, arquivosProducao, mudancasAtivas, subpastasArchiveStaged, ehFundacao, registrarErro, registrarInfo }` para isolamento puro e testabilidade.
  - Normaliza status removendo crases envolventes (`` `[x] Entregue` `` → `[x] Entregue`) e normaliza nomes de pastas em `archive/` removendo o prefixo de data `^\d{4}-\d{2}-\d{2}-` ao cruzar com a coluna `Capacidade / Fatia`.
  - Coleta caminhos removidos (`status === 'D'`) e antigos de renomeação (`status.startsWith('R')` via `git diff --cached --name-status` ou `modificados`) para o Sensor Anti-Apodrecimento Reverso.
- **Integração em `template/scripts/verificar-governanca.mjs` (Catraca Anti-Monólito):**
  - Consolida a coleta duplicada de `subpastasArchiveStaged` em um único ponto e invoca `auditarMatrizRequisitos(...)`, garantindo linhas úteis finais `<= HEAD`.

## Interface e Estados Assíncronos
Não se aplica: trata-se de módulo CLI determinístico em Node.js ESM e documentação/skills em Markdown no perfil `cli-biblioteca`, sem interface web ou estados assíncronos de UI.

## Regras de Negócio e Segurança
- **Zero Dependências Externas:** Apenas `node:fs`, `node:path` e `node:child_process`.
- **Telemetria Enxuta no `SessionStart` (`template/scripts/hook-agente.mjs`):** Insere `[MATRIZ REQUISITOS] Total: X | Entregues: Y | Em andamento: Z | Pendentes: W | Descartados: K.` antes da descrição da mudança ativa no `obterMensagemSessao(raiz)` para que nunca seja truncada pelo corte de 600 caracteres.
- **Alinhamento Normativo (`v4.3.0`):** Atualização de `template/constitution.md` (`Artigo 12.6`), `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, `template/.agents/skills/` (`sintetizar-conhecimento`, `planejar-proxima-fatia`, `ciclo-especificacao`, `refinar-ideia`, `mesa-de-descoberta`, `revisar-fatia`), `package.json`, `00_INDICE_E_DECISOES.md` (`D45`), `docs/arquitetura.md` (§5), `.github/workflows/ci.yml`, `lefthook.yml`, `CHANGELOG.md` e `tests/planejar-proxima-fatia.test.mjs`.
- **Fontes Consultadas:** Análise física direta dos scripts e testes reais deste repositório matriz (`copier.yml`, `verificar-governanca.mjs`, `hook-agente.mjs`, `tests/*.test.mjs`).
