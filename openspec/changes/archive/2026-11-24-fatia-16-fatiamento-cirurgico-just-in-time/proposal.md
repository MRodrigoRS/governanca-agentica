# Proposta — Fatia 16: Fatiamento Cirúrgico Just-in-Time (Subagente Arquiteto-Fatiador)

## Por que
Atualmente, `inicializar-stack` (Passo 2), `sintetizar-conhecimento` (Passo 4) e `constitution.md` (Artigo 8.2) induzem o agente a decompor o sistema inteiro em múltiplas fatias (`fatia-01` até `fatia-N`) já no **Gate 0**, antes de existir qualquer linha de código. Na prática, fatiar antecipadamente gera planejamento no escuro (a partir da `fatia-03`, decisões reais de código e schema ainda não existem), compressão artificial (domínios densos espremidos numa mesma fatia) e retrabalho de texto especulativo que envelhece antes de ser aberto. Por outro lado, escolher a próxima fatia olhando apenas o código atual causaria miopia local (esquecer chave multi-tenant, IDs ou ganchos estruturais). O modelo híbrido resolve os dois polos mantendo **Invariantes Globais + Mapa Macro de Capacidades** desde o Gate 0 e gerando cada fatia seguinte Just-in-Time sobre o código real + documentação.

## O que muda
1. **Nova Skill Universal `template/.agents/skills/planejar-proxima-fatia/SKILL.md` (`/fatiar` / `/planejar-fatia`):**
   - Gatilhos: manual (`/fatiar` ou `/planejar-fatia`), automático via `/proxima-fatia` quando não houver fatia `[ ] Pendente` em `openspec/roadmap.md`, e pós-Gate 2 após marcar `[x]` na fatia entregue (recomendando `/compact` ou nova sessão).
   - **Congelamento estrito de código:** proibido editar código de produção ou abrir delta em `openspec/changes/` antes da aprovação do bloco no roadmap.
   - **Subagente *read-only* (`Fatiador Cirúrgico`)** (com fallback explícito em CLIs sem subagentes): lê fisicamente `docs/conhecimento/INDICE.md` + capítulos relevantes, `openspec/project.md`, `openspec/roadmap.md`, `openspec/specs/`, `docs/arquitetura.md`, `docs/particularidades.md`, `docs/aprendizados.md` e o código real (pastas, schema/ORM, migrações, rotas, testes).
   - **Critérios decisórios:** prontidão de dependências, coesão/tamanho cirúrgico, desbloqueio estrutural e anti-miopia contra os Invariantes Globais e capacidades futuras.
   - **Saída estruturada e alinhamento curto (`grill-me` `➡️`):** grava o novo bloco `### [ ] fatia-XX-<slug>` na Seção 3 de `openspec/roadmap.md`, atualiza status no Mapa Macro de Capacidades e encaminha para `ciclo-especificacao`.
2. **Novo Layout em 3 Camadas em `template/openspec/roadmap.md.jinja`:**
   - `## 1. Invariantes Globais do Gate 0`
   - `## 2. Mapa Macro de Capacidades` (tabela `Capacidade / Domínio`, `Fonte (Livro / Projeto)`, `Depende de`, `Status`)
   - `## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)` contendo apenas `### [ ] fatia-01-fundacao` como ponto de partida, mantendo 100% de retrocompatibilidade em `verificar-governanca.mjs` para projetos legados em `copier update`.
3. **Atualização Coordenada de Skills, Constituição, Índices, CI e SemVer `4.2.0`:**
   - Atualização de `inicializar-stack`, `sintetizar-conhecimento`, `mesa-de-descoberta`, `ciclo-especificacao`, `template/constitution.md` (Artigos 8.2 e 8.3), `template/AGENTS.md`, `template/README.md.jinja`, `template/openspec/project.md.jinja`, `AGENTS.md` (raiz), `.github/workflows/ci.yml`, `00_INDICE_E_DECISOES.md` (`D44`), `package.json`, `CHANGELOG.md`, `README.md` e nova suíte `tests/planejar-proxima-fatia.test.mjs`.

## Fica de Fora
- Alterações em `template/scripts/verificar-governanca.mjs` (respeitando a Catraca Anti-Monólito / Artigo 14; retrocompatibilidade validada via testes).
- Quebra de compatibilidade para roadmaps legados multi-fatias em `copier update`.
