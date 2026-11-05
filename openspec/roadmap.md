# Mapa Macro Rolling Wave — Governança v4.0.0

> **Papel:** Fonte única do planejamento macro incremental do projeto (*Rolling Wave Planning*).
> **Regra de Ouro (Zero Escrita Duplicada):** Este arquivo registra a visão macro, dependências e fronteiras (`Entra` vs. `Fica de Fora`) de cada fatia. A especificação técnica profunda (contratos, schemas, cenários `Given/When/Then` e tarefas Test-First) nasce **Just-in-Time exclusivamente dentro de `openspec/changes/fatia-XX-<slug>/`** no momento de executar aquela fatia, consolidando-se em `openspec/specs/` após o `archive`.
> **Proteção Copier:** Listado em `_skip_if_exists` no `copier.yml` nos projetos consumidores.

---

## Histórico Consolidado (Ciclo v3 — Concluído)

- `[x]` `fatia-01-fundacao-v3` — OpenSpec nativo, Lifecycle Hooks e suíte inicial de testes unitários.
- `[x]` `fatia-02-linear-mcp-e-inbox` — Integração Linear MCP, Diário de Bordo e Inbox Móvel.
- `[x]` `fatia-03-rigor-tdd-e-mutacao-mental` — Ciclo Faça Funcionar → Faça Direito, mutação mental e trava anti-teatro de testes.
- `[x]` `fatia-04-engenharia-de-harness-e-higiene-de-contexto` — Sensores pós-edição, paridade de hooks, vínculo Roadmap ↔ OpenSpec e higiene MCP.
- `[x]` `fatia-05-catalogo-jogos-e-simulacoes` — Catálogo de Jogos (Phaser 3, Three.js, Godot 4, Bevy) e manifesto `project.godot`.
- `[x]` `fatia-06-documentos-de-particularidades-e-aprendizados` — `docs/particularidades.md` e `docs/aprendizados.md` protegidos no Copier.
- `[x]` `fatia-07-protocolo-handshake-e-triade-linear` — Artigo 13 (`whoami` obrigatório e Tríade de Âncora anti-vazamento de squads).

---

## Fila Evolutiva Ativa — Ciclo Governança v4.0.0

### `[ ] Pendente` — `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md](roadmap/fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia.md)
- **Depende de:** `fatia-07-protocolo-handshake-e-triade-linear`
- **Objetivo de Valor:** Eliminar a dupla burocracia documental (`roadmap/fatia-XX.md` + 4 arquivos repetidos no OpenSpec) **sem regredir 1 milímetro no rigor**: transfere a auditoria determinística dos 7 pilares Anti-Preguiça para dentro do OpenSpec, exige Visão Sistêmica de Entidades Core no Gate 0, destrava manutenções técnicas legítimas sob trava dupla e desduplica `AGENTS.md` preservando 100% das cláusulas e exemplos de `constitution.md`.
- **O que ENTRA:**
  1. **Rolling Wave Sem Perda de Rigor (`template/openspec/roadmap.md.jinja` + 7 Pilares Auditados no OpenSpec):** `roadmap.md` inclui seção obrigatória de *Entidades Core e Invariantes Globais* no Gate 0; `verificar-governanca.mjs` passa a exigir e auditar `proposal.md`, `specs/` (com `Scenario:`), `design.md` completo e `tasks.md` (com Roteiro Prático Gate 2), e `hook-agente.mjs` bloqueia placeholders tanto em `roadmap.md` quanto em `openspec/changes/**/*.md`.
  2. **Via Nível 1.5 — Manutenção Estrutural Blindada (`refactor` / `chore` / `perf` / `style`):** Permite commits > 3 arquivos ou bumps/patches de versões já existentes sem spec artificial, bloqueando (`exit 1`) banco/migrations, pacote inédito em `dependencies`, `### Adicionado` no diff do `CHANGELOG.md` e prefixos `feat`/`fix`, além de exigir testes verdes + Inspetor Forense.
  3. **Calibragem Estrita do `/fix` Estético/Copy:** Dispensa teste unitário artificial de classes CSS **somente** quando o diff tocar exclusivamente `.css`/`.scss`, `className` ou copy estático; qualquer alteração em `if`/ternários, hooks, handlers ou dados exige TDD completo (auditado pelo Inspetor Forense).
  4. **Desduplicação com Invariância Semântica (`constitution.md` ↔ `AGENTS.md`):** Proibido resumir ou apagar qualquer regra ou exemplo concreto da Constituição; remove-se apenas o texto repetido em `AGENTS.md`, mantendo `force_ask` no `git commit` intacto.
- **O que FICA DE FORA:** Extração das regras modulares por glob em `.agents/rules/`, C4/`.env.example`/SemVer (Fatia 09), Catálogo de Reúso e teto anti-monólito (Fatia 10) e CI poliglota/Testing Trophy (Fatia 11).

---

### `[ ] Pendente` — `fatia-09-regras-modulares-por-glob-e-docs-mercado`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-09-regras-modulares-por-glob-e-docs-mercado.md](roadmap/fatia-09-regras-modulares-por-glob-e-docs-mercado.md)
- **Depende de:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`
- **Objetivo de Valor:** Carregar regras detalhadas de Web, Backend, Jogos e Linear sob demanda por glob **sem criar pontos cegos em agentes CLI** (mantendo princípios pétreos na Constituição + Matriz Universal em `AGENTS.md`), adotar os padrões de mercado de documentação viva (Diátaxis, C4 + `erDiagram` Core, `.env.example`, `README.md`, SemVer `v4.0.0`) e higienizar a raiz deste repositório.
- **O que ENTRA:**
  1. **Fonte Única em `template/.agents/rules/` + Wrappers de 5 Linhas + Matriz Universal Anti-Ponto-Cego:** Módulos `web-ui-pwa.md`, `backend-seguranca-dados.md`, `jogos-engines.md` e `linear-mcp.md` injetados por globs nativos em `.claude/rules/`, `.cursor/rules/` e `.github/instructions/` e exigidos via Matriz Pré-Edição em `AGENTS.md` para qualquer harness.
  2. **Kit de Documentação Padrão de Mercado:** `template/docs/arquitetura.md` (C4 Nível 1/2 + `erDiagram` das Entidades Core em Mermaid), `template/README.md.jinja` e trava determinística em `verificar-governanca.mjs` exigindo sincronia entre variáveis de ambiente lidas no código e `.env.example`.
  3. **Unificação SemVer `v4.0.0` e Ritual de Release:** Sincronia de versão (`v4.0.0`) em cabeçalhos, `package.json` e docs + ritual de fechamento no `CHANGELOG.md`.
  4. **Faxina Histórica sem Perda (`git mv`):** Arquivamento íntegro dos 8 documentos históricos da transição v1→v2 em `docs/historico/` com atualização e teste de todos os links.
- **O que FICA DE FORA:** Catálogo de reúso/tokens de movimento/anti-monólito (Fatia 10) e Testing Trophy/Lefthook/CI poliglota (Fatia 11).

---

### `[ ] Pendente` — `fatia-10-reuso-tokens-movimento-e-component-as-asset`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-10-reuso-tokens-movimento-e-component-as-asset.md](roadmap/fatia-10-reuso-tokens-movimento-e-component-as-asset.md)
- **Depende de:** `fatia-09-regras-modulares-por-glob-e-docs-mercado`
- **Objetivo de Valor:** Impedir deriva estética/cinética (botões, estilos e animações levemente diferentes a cada fatia) e impedir páginas ou cenas de jogos monolíticas, instituindo memória leve de reúso, Tokens de Movimento na Fatia 01 e *Component-as-Asset* encaixados nos trilhos modulares da Fatia 09.
- **O que ENTRA:**
  1. **Cláusula Constitucional *Reuse-Before-Create* & *Component-as-Asset*:** Primitivos de UI, transições/animações e entidades/mecânicas de jogos (inimigos, projéteis, itens, hitboxes, HUD, partículas, *tweens* e *shaders*) nascem **sempre** tokenizados/componetizados na 1ª ocorrência; blocos específicos de tela extraem-se na 2ª ocorrência. Fatia 01 (Fundação) obrigatoriamente institui Tokens Base (cores, tipografia, durações e curvas de animação) e estrutura base de componentes/prefabs.
  2. **Catálogo Vivo Enxuto (`template/docs/catalogo-reuso.md`) Protegido no Copier:** Ponteiros estritos de 1 linha (zero código colado) em 4 tabelas (Tokens Visuais/Movimento, Primitivos UI, Prefabs/Assets de Jogos e Módulos/Hooks), protegido em `_skip_if_exists`.
  3. **Skill `reuso-e-modularizacao/SKILL.md` + Paridade Tripla no Inspetor Forense:** Atuação preventiva no Gate 0/Gate 1/`/fix` (matriz `Reutilizar vs. Extrair Novo`) e corretiva sob demanda (`/auditar-reuso` para higienizar projetos com deriva, cobrindo Web/Mobile/Desktop e Jogos em Godot 4, Phaser 3, Three.js/R3F e Bevy ECS).
  4. **Sensor Anti-Monólito e `.gd` em `verificar-governanca.mjs`:** Suporte a `.gd` (GDScript, ignorando `addons/` e testes GUT) e bloqueio (`exit 1`) acima de **350 linhas úteis** em código de produção (isentando `components/ui/`, `*.generated.*`, `*.d.ts`, `addons/`, `migrations/`), com válvula explícita `governanca:arquivo-extenso-justificado: <motivo >= 15 chars>` auditada pelo Inspetor Forense.
- **O que FICA DE FORA:** Parsers pesados de AST externos ou bloqueio regex cego de cores hexadecimais em SVGs/mocks.

---

### `[ ] Pendente` — `fatia-11-piramide-testes-anti-mock-e-ci-poliglota`
- **Especificação Completa de Transição:** [openspec/roadmap/fatia-11-piramide-testes-anti-mock-e-ci-poliglota.md](roadmap/fatia-11-piramide-testes-anti-mock-e-ci-poliglota.md)
- **Depende de:** `fatia-10-reuso-tokens-movimento-e-component-as-asset`
- **Objetivo de Valor:** Erradicar falsos positivos de testes mockados, fechar o furo local de commits/pushes sem rodar testes e tornar o CI verdadeiramente poliglota e seguro para todas as stacks do catálogo oficial.
- **O que ENTRA:**
  1. **Política *Testing Trophy* & Anti-Mocking de Banco Próprio:** Proibição constitucional + sensor/auditoria forense contra mockar o próprio ORM/banco (`vi.mock`/`jest.mock`/`patch` do próprio banco) em testes de serviço/repositório/API, exigindo SQLite in-memory, PGlite ou banco real de teste (mockando apenas APIs externas de terceiros).
  2. **Fechamento do Furo no `template/lefthook.yml`:** Execução automática de testes relacionados/rápidos antes do commit/push (`pre-push` poliglota + testes rápidos) para garantir Artigo 4 (*Zero Testes Quebrados*) antes de chegar ao remoto.
  3. **CI Poliglota Íntegro (`template/.github/workflows/ci.yml`):** Remoção do fallback silencioso `npm ci || npm install`, cobertura nativa para **Godot 4 (GUT headless)** e **.NET / Avalonia (`dotnet test`)**, validação de migrações subindo do zero e auditoria de vulnerabilidades críticas em dependências (`npm audit`, `pip-audit`, `cargo audit`).
  4. **Qualidade Web Real (Smoke E2E + Acessibilidade):** Padrão oficial de Smoke Test Playwright com `@axe-core/playwright` e falha automática em `pageerror`/`console.error` para os fluxos críticos de aplicações Web.
- **O que FICA DE FORA:** Frameworks lentos de mutação física (Stryker/Mutmut) no pre-commit ou cobertura 100% E2E para cada botão secundário.
