# Design Técnico — Fatia 16: Fatiamento Cirúrgico Just-in-Time (Subagente Arquiteto-Fatiador)

## Contratos, Dados e Schemas
1. **Estrutura Híbrida em 3 Camadas (`template/openspec/roadmap.md.jinja`):**
   - `## 1. Invariantes Globais do Gate 0`: tabela transversal inegociável (multi-tenancy, autenticação/papéis, filas/eventos, entidades estruturantes, convenção de IDs).
   - `## 2. Mapa Macro de Capacidades`: tabela leve (`Capacidade / Domínio | Fonte (Livro / Projeto) | Depende de | Status`) registrando todo o horizonte aprovado com estados (`Em fila` | `Em andamento` | `Entregue`) sem pré-fabricar blocos `fatia-02`..`fatia-N`.
   - `## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)`: contém inicialmente apenas `### [ ] fatia-01-fundacao` com as 4 âncoras auditadas (`Depende de:`, `Objetivo de Valor:`, `Entidades/Contratos Tocados:`, `O que ENTRA:`, `O que FICA DE FORA:`). Fatias seguintes nascem uma por vez via `/fatiar` (`planejar-proxima-fatia`).
2. **Contrato da Skill `template/.agents/skills/planejar-proxima-fatia/SKILL.md`:**
   - Frontmatter YAML (`name: planejar-proxima-fatia`, `description`).
   - Gatilhos oficiais: `/fatiar` (ou `/planejar-fatia`), automático via `/proxima-fatia` (`ciclo-especificacao` §2) quando não houver `[ ] Pendente` em `openspec/roadmap.md`, e ao encerrar fatia no Gate 2 (após marcar `[x]`, arquivar no OpenSpec e recomendar `/compact` ou nova sessão).
   - Fluxo em 4 passos:
     1. Delegação a subagente *read-only* (`Fatiador Cirúrgico`) — com fallback explícito em CLIs sem subagentes — realizando leitura física de `docs/conhecimento/INDICE.md`, capítulos não entregues, `openspec/project.md`, `openspec/roadmap.md`, `openspec/specs/`, `docs/arquitetura.md` (§5), `docs/particularidades.md`, `docs/aprendizados.md` e inspeção real do repositório (pastas, schema/ORM, migrações, rotas, testes).
     2. Avaliação por 4 critérios decisórios: Prontidão de dependências, Coesão e tamanho cirúrgico, Desbloqueio estrutural e Anti-miopia.
     3. Saída estruturada para o agente principal: diagnóstico do código real (`[fonte: ...]`), candidatas avaliadas com justificativa técnica, rascunho `### [ ] fatia-XX-<slug>` com `Depende de:`, `Objetivo de Valor:`, `Entidades/Contratos Tocados:`, `O que ENTRA:`, `O que FICA DE FORA:` + fontes, e eventuais ambiguidades livro vs. código.
     4. Alinhamento curto (`grill-me` `➡️`), gravação na §3 de `openspec/roadmap.md`, atualização do status no Mapa Macro de Capacidades e transição para `.agents/skills/ciclo-especificacao/SKILL.md`.
3. **Motor Determinístico (`template/scripts/verificar-governanca.mjs`):**
   - Mantido intacto (respeitando a Catraca Anti-Monólito / Artigo 14). `auditarRoadmapV4()` já audita qualquer bloco `### [ ] fatia-XX-...` independentemente da numeração de seção (`## 2` ou `## 3`) e aceita 1 ou N fatias, garantindo 100% de retrocompatibilidade em `copier update`.
4. **Atualização Coordenada e SemVer `4.2.0`:**
   - Skills integradas: `inicializar-stack`, `sintetizar-conhecimento`, `mesa-de-descoberta` e `ciclo-especificacao` (preservando âncoras já auditadas por `tests/sintetizar-conhecimento.test.mjs` e `tests/mesa-de-descoberta.test.mjs`).
   - Constituição e Índices: `template/constitution.md` (Artigos 8.2 e 8.3), `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, `AGENTS.md` (raiz), `.github/workflows/ci.yml`, `00_INDICE_E_DECISOES.md` (`D44`), `package.json`, `CHANGELOG.md` e `README.md`.

## Interface e Estados Assíncronos
Não se aplica: repositório matriz `cli-biblioteca` sem interface gráfica de usuário; trata-se de protocolo agêntico em Markdown, templates Jinja2, OpenSpec e suíte Node.js ESM (`node:test`).

## Regras de Negócio e Segurança
1. **Congelamento Estrito de Código:** Durante `planejar-proxima-fatia`, é terminantemente proibido editar código de produção ou abrir pastas em `openspec/changes/` antes da aprovação do bloco proposto no roadmap.
2. **Integridade Referencial do Template:** Exemplos de caminhos dentro de `template/.agents/skills/` usam placeholders com `<...>` ou apontam estritamente para arquivos reais presentes em `template/`, garantindo aprovação em `tests/template-docs.test.mjs`.
3. **Retrocompatibilidade Copier:** Roadmaps existentes em projetos consumidores permanecem protegidos por `_skip_if_exists` e válidos em `verificar-governanca.mjs --staged`.
