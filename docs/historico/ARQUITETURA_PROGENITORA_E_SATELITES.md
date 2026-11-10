# Análise da v1 — Progenitora e Satélites (`rr-controle-de-agentes`)

> **Papel:** Registro histórico do legado e do que foi herdado. **Status:** Histórico (a arquitetura foi substituída pelo [PIVOT](PIVOT_ARQUITETURAL_GOVERNANCA_V2.md)). **Índice:** [00_INDICE_E_DECISOES.md](00_INDICE_E_DECISOES.md)
> **Origem analisada:** `C:\Users\rodri\Downloads\rr-controle-de-agentes-master\rr-controle-de-agentes-master`
> **Atualizado:** 27/10/2026

---

## 1. O que a v1 era

Uma plataforma em dois níveis:

- **Progenitora (matriz):** app Next.js + SQLite com catálogo de tecnologias, presets (frontend, backend, fullstack em `src/presets/` + `presets.json`), cláusulas e critérios de qualidade gerados por código, e template engine (`src/templates/`) que criava os satélites.
- **Satélites (projetos):** recebiam `governanca/` (AGENTS, SESSAO, INICIO, VINCULAR, livro de arquitetura em 5 volumes, padrões, 28 skills, 10 workflows, sprints, relatórios) e 3 scripts Node sem dependências:
  - `sincronizar.mjs`: atualiza com a matriz no GitHub (essencial ou total, com backup).
  - `harness.mjs`: gera `AGENTS.md`, `CLAUDE.md` e `.agents/` (rules, workflows, skills) para os agentes.
  - `ui.mjs`: painel local na porta 3333 (métricas, estimativa de tokens, leitor de Markdown).

## 2. O que deu errado

| Problema | Causa |
|---|---|
| Inchaço | O agente lia e mantinha dezenas de Markdown (sessão, livro, relatórios, sprints) e virava secretário de documentação |
| Skills estáticas | 28 skills eram textos de instrução, sem scripts nem ferramentas |
| Convenções caseiras | INICIO/VINCULAR/livro/PRD/sprints em vez de padrões da indústria |
| Infraestrutura pesada | Servidor + banco + painel só para gerar e manter projetos |
| Regras sem aplicação | Cláusulas existiam como texto; pouca coisa era cobrada por hook ou CI |

## 3. O que herdamos (o ouro)

| Herança | Destino na v2 |
|---|---|
| Cláusulas pétreas (escopo estrito, zero testes quebrados, zero segredos, PT-BR no domínio, Zero-Trust, dependências justificadas, changelog) | `constitution.md` |
| Dever de Crítica e Honestidade Radical | `constitution.md` + evidência obrigatória no Gate 2 |
| Gate 1 (plano) e Gate 2 (entrega) | Ciclo da [SÍNTESE](SINTESE_FRAMEWORKS_SDD_E_GOVERNANCA_V2.md) (+ Gate 0 para a stack) |
| Níveis de execução (`/fix` vs. sprint) | Níveis de cerimônia (P4) |
| Divulgação progressiva e teto de ~150 linhas no arquivo de entrada | `AGENTS.md` enxuto + Agent Skills (carregadas sob demanda) |
| Não-reinvenção / catálogo de tecnologias | Catálogo de referência ([PRESETS](ESTRATEGIA_DE_PRESETS_E_STACKS_ROBUSTAS.md)) |
| Bootstrap sem dependências | Princípio do comando de instalação (P3) |
| Sincronização com a matriz | Necessidade mantida, solução em aberto (P2) |
| Auto-diagnóstico na 1ª sessão (greenfield / brownfield / em andamento) | Comportamento descrito no `AGENTS.md` (P9) |
| Convenções de escrita (tom imperativo, PT-BR, separador em travessão) | Guia de estilo dos documentos da v2 |
| Padrões de frontend (estados assíncronos, ESC, alvos de toque de 44px) e de backend (CSP, HSTS, rate limiting, ACID) | Candidatos a skills ou checklists de revisão (P5) |

## 4. O que aposentamos

Servidor Next.js + SQLite, painel `ui.mjs`, template engine `{{variavel}}`, livro de arquitetura em 5 volumes, `SESSAO.md` extenso, relatórios recorrentes, pasta `sprints/` acumulativa e skills puramente textuais.
