# Proposta de Mudança — `fatia-09-regras-modulares-por-glob-e-docs-mercado`

## Por que
A governança v3 consolidava regras detalhadas de frontend, backend, jogos e Linear em manuais extensos e estáticos, gerando alto consumo desnecessário de tokens em projetos menores (ex.: projeto CLI carregando regras de PWA e Toasts) e criando pontos cegos em agentes de terminal sem suporte nativo a globs de regras. Além disso, a documentação de arquitetura e modelo de dados vivia fragmentada entre o roadmap e o código, sem um modelo vivo como construído (C4 + erDiagram + Glossário), variáveis de ambiente não possuíam sensor determinístico de paridade com `.env.example`, arquivos `.env` não eram ativamente blindados contra leitura por agentes, e o repositório continha documentos históricos na raiz e lacunas no versionamento SemVer de tags.

## O que muda
1. **Regras Modulares em Fonte Única com Perfil Determinístico:**
   - Adiciona a pergunta `perfis_projeto` (`web-ui`, `api-backend`, `desktop`, `mobile`, `jogo`, `cli-biblioteca`) no `copier.yml` para renderização condicional dos módulos em `template/.agents/rules/`.
   - Cria módulos com frontmatter nativo Antigravity (`trigger: glob` e `trigger: model_decision`): `web-ui-pwa.md`, `backend-seguranca-dados.md`, `jogos-engines.md` e `linear-mcp.md` (condicionado a `integrar_linear`).
   - Cria wrappers finos (< 15 linhas) para Claude Code (`.claude/rules/`), Cursor (`.cursor/rules/`) e Copilot (`.github/instructions/`).
   - Adiciona Matriz Universal de Leitura Pré-Edição em `template/AGENTS.md` e injeção contextual no `SessionStart` do `hook-agente.mjs`.
2. **Kit de Documentação Viva e Segurança de `.env`:**
   - Cria `template/docs/arquitetura.md` (protegido) com C4 Nível 1/2 em Mermaid, `erDiagram` e Glossário de Domínio, com gatilho determinístico que bloqueia commits de banco sem atualização da arquitetura.
   - Adiciona a seção preservada `## Comandos do Projeto` em `template/AGENTS.md`.
   - Cria `template/README.md.jinja`, `template/.env.example` e `template/.gitignore`.
   - Implementa sensor determinístico `.env.example` em `verificar-governanca.mjs` que bloqueia variáveis não declaradas ou segredos reais no example.
   - Bloqueia determinísticamente a leitura de `.env*` pelos agentes no `hook-agente.mjs` e em `template/.claude/settings.json`.
3. **SemVer, Reparo de Tags e Arquivamento Histórico:**
   - Sincroniza versões nos cabeçalhos `governanca:inicio` e documenta o ritual de release em `CONTRIBUTING.md`.
   - Cria tags faltantes `v3.4.0` a `v3.7.0` e tag `v4.0.0-alpha.1`.
   - Move os 8 arquivos históricos da raiz para `docs/historico/` via `git mv`, preservando links em `00_INDICE_E_DECISOES.md`.

## Fica de Fora
- Comandos de atalho `/fix`, `/retomar`, etc., handoff de sessão e template de PR (Fatia 09a).
- Catálogo de reúso `catalogo-reuso.md`, Tokens de Movimento e sensor anti-monólito >350 linhas (Fatia 10).
- Testing Trophy, CI poliglota e tag final estável `v4.0.0` (Fatia 11).
