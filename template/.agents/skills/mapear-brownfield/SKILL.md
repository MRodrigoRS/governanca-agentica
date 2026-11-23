---
name: mapear-brownfield
description: Conduz o onboarding estruturado de repositórios já existentes (Brownfield), congelando alterações até mapear stack, arquitetura real, saúde técnica, specs vivas e roadmap no mundo real.
---

# Skill: Onboarding Brownfield e Mapeamento de Projeto Existente

Esta skill orienta o agente quando a governança é instalada em um repositório que **já possui código-fonte**. O objetivo é impedir que o agente saia alterando código às cegas em cima de documentos genéricos.

> **CONGELAMENTO ESTRITO:** É terminantemente proibido editar código de produção, criar features ou fazer refatorações antes de concluir este mapeamento e obter aprovação humana no **Gate de Onboarding**.

---

## Passo 1 — Varredura Read-Only e Diagnóstico Real (Sem Context Rot)

1. Delegue a varredura ampla de diretórios a um subagente *read-only* (ex.: `research`) quando o projeto for médio/grande, retornando apenas o resumo estruturado.
2. Inspecione diretamente:
   - Manifestos e dependências (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `*.csproj`, `project.godot`).
   - Scripts de execução, build, lint e testes existentes.
   - Estrutura de rotas/telas, APIs, modelos/schemas de banco (`.prisma`, SQL, migrations) e variáveis de ambiente (`.env*` sem expor segredos).
   - Hooks e workflows de CI já existentes.

---

## Passo 2 — Check-up de Saúde Arquitetural do Legado

Antes de documentar ou planejar, levante de forma honesta os riscos encontrados no estado atual:
- Arquivos monolíticos acima de **350 linhas úteis** (candidatos a catraca ou refatoração via `Via 1.5`).
- Ausência de testes automatizados, testes ocos ou mocks abusivos de banco.
- Padrões atrasados, acoplamentos fortes, falhas de segurança/Zero-Trust ou variáveis ausentes de `.env.example` (para auditoria AppSec profunda dos 27+ controles em projetos legados, acione a skill `auditoria-seguranca` / `/auditar-seguranca`).

---

## Passo 3 — Preenchimento dos Documentos Vivos com a Realidade do Código

Atualize todos os documentos abaixo substituindo os placeholders genéricos pelos fatos reais do repositório:

1. **`AGENTS.md` (Seção `## Comandos do Projeto`):** Preencha os comandos reais de instalação, dev, testes, typecheck, lint, build e migrações.
2. **`docs/arquitetura.md`:** Atualize os diagramas C4 Nível 1 e 2, o `erDiagram` com as tabelas/entidades reais, o Glossário de Domínio e a **Seção 5 (`Mapa Físico de Módulos`)** com as pastas/arquivos de entrada reais e suas suítes de testes.
3. **`docs/catalogo-reuso.md`:** Inventarie tokens, primitivos de UI, prefabs e módulos de domínio já existentes para evitar duplicação futura (Artigo 14).
4. **`docs/particularidades.md`, `docs/runbook.md`, `.env.example` e `.gitignore`:** Registre portas, restrições de infra/banco/webhooks em `particularidades.md`, documente os fluxos reais de deploy, *smoke check*, migrations/rollback e logs em `docs/runbook.md`, e garanta que todas as variáveis de ambiente usadas no código estejam em `.env.example` sem segredos reais. **Revise também o `.gitignore` existente:** remova `.agents/` caso esteja ignorado (as rules, skills e hooks devem ser versionados) e assegure que `.env`, `.env.*` (`!.env.example`) e `.agents/handoff.md` estejam ignorados.
5. **Exceções Legítimas de Stack (`constitution.md` + `docs/particularidades.md`):** Para plataformas ou projetos legados não-tradicionais (ex.: Google Apps Script, HTML estático, apps sem `npm test`, sem TS `strict` ou sem SQLite in-memory), registre formalmente as exceções e adaptações aplicáveis em `constitution.md` (`## Cláusulas Adicionais Deste Projeto`) e em `docs/particularidades.md` durante o onboarding, evitando falsos bloqueios com o agente.
6. **`openspec/project.md`:** Preencha Visão do Produto, Fluxo, Perfis e Stack Tecnológica real (e atualize o status removendo o aviso de onboarding pendente).
7. **`openspec/specs/`:** Crie as especificações vivas iniciais descrevendo os domínios e comportamentos já implementados.
8. **`openspec/roadmap.md`:** Registre os **Invariantes Globais** observados e estruture a fila *Rolling Wave* (incluindo eventuais dívidas críticas identificadas no Passo 2).

---

## Passo 4 — Ativação do Ecossistema da Governança

1. Inicialize/valide o OpenSpec e ative os hooks locais:
   ```bash
   npx --yes @fission-ai/openspec init --tools antigravity,agents --no-animation --no-copilot-cloud
   npx lefthook install
   ```
2. Instale a skill upstream `grill-me` e descubra skills da stack existente:
   ```bash
   npx --yes skills add mattpocock/skills --skill grill-me grilling -y
   npx --yes skills find <tecnologia-da-stack>
   ```
3. Execute `node scripts/verificar-governanca.mjs` e a suíte de testes atual para registrar a linha de base.

---

## Passo 5 — Gate de Onboarding Brownfield (Aprovação Humana)

Apresente ao humano um resumo conciso (≤ 20 linhas no chat, ou artefato dedicado se suportado) contendo:
1. Mapa da arquitetura e stack detectadas.
2. Alertas críticos do **Check-up de Saúde Arquitetural**.
3. Lista dos documentos atualizados e próximos passos propostos em `openspec/roadmap.md`.

Pergunte: *"Você valida este mapeamento e diagnóstico inicial para destravarmos o desenvolvimento e realizarmos o commit de onboarding da governança?"*
