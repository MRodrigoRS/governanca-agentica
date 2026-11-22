# Proposta — Fatia 15: Síntese de Conhecimento em Escala (Map-Reduce Anti-Alucinação)

## Por que
Com a criação do livro vivo em `docs/conhecimento/` (`fatia-14`), projetos grandes podem acumular dezenas de capítulos (20, 40, 60+) somados a materiais externos (exportações do NotebookLM, atas de reunião, specs brutas). Quando o agente tenta sintetizar um corpus volumoso de uma única vez na conversa principal, sofre saturação de contexto (*lost in the middle*), omite regras consolidadas ou inventa detalhes para preencher lacunas. Além disso, concentrar protocolos pesados de *Map-Reduce* dentro de `mesa-de-descoberta/SKILL.md` inflaria o contexto de toda sessão exploratória comum.

## O que muda
1. **Nova Skill Universal `template/.agents/skills/sintetizar-conhecimento/SKILL.md` (`/sintetizar`):**
   - Mantém **congelamento estrito de código** (não altera código de produção nem abre deltas em `openspec/changes/`).
   - **Triagem de Volume:** leitura física direta quando o livro tem `≤ 8` capítulos curtos sem materiais extensos; ativação de extração **Map-Reduce** com **subagentes *read-only* em paralelo** (lotes de 4–5 arquivos agrupados por domínio) quando houver `> 8` arquivos ou materiais em `docs/conhecimento/materiais/`.
   - **Detector de Contradições Cross-Arquivos:** confronta as fichas factuais retornadas pelos lotes e **para obrigatoriamente para consultar o humano** diante de divergências entre capítulos/materiais.
   - **Rastreabilidade Anti-Alucinação:** exige citação literal das fontes em toda regra/invariante/fatia e isola ausências na seção **Lacunas / Decisões Pendentes**, proibindo inventar regras não documentadas.
   - **Destilação em 2 Camadas:** Camada 1 (Invariantes Globais + Mapa de Domínios com aprovação humana) seguida pela Camada 2 (blocos *Rolling Wave* em `openspec/roadmap.md` com as 4 âncoras obrigatórias).
2. **Pasta de Materiais Externos (`template/docs/conhecimento/materiais/.gitkeep`) & Gatilho Automático:**
   - Suporte oficial à subpasta `docs/conhecimento/materiais/` (coberta por `"docs/conhecimento/**"` no `copier.yml` e classificada como documentação pelo motor).
   - Acionamento automático em `mesa-de-descoberta/SKILL.md` (Passo 3) e `inicializar-stack/SKILL.md` (Passo 2) sempre que houver `> 8` arquivos ou materiais externos em `docs/conhecimento/`.
3. **Índices, CI e Memória da Matriz:**
   - Registro de `sintetizar-conhecimento` e `/sintetizar` em `AGENTS.md`, `template/AGENTS.md`, `template/README.md.jinja` e `template/docs/conhecimento/INDICE.md`.
   - Validação dos novos arquivos no job Copier de `.github/workflows/ci.yml`, registro da Decisão `D43` em `00_INDICE_E_DECISOES.md`, entrada no `CHANGELOG.md` e suíte `tests/sintetizar-conhecimento.test.mjs`.

## Fica de Fora
- Implementação de pipelines RAG/embeddings em banco vetorial, servidores MCP novos ou novos sensores em `template/scripts/verificar-governanca.mjs`.
- Alteração de `template/scripts/lib/classificar-arquivos.mjs` (já classifica `docs/**` como documentação/governança).
