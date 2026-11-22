# Design Técnico — Fatia 15: Síntese de Conhecimento em Escala (Map-Reduce Anti-Alucinação)

## Contratos, Dados e Schemas
1. **Estrutura de Insumos em `template/docs/conhecimento/`:**
   - Raiz `docs/conhecimento/`: mantém `INDICE.md` e capítulos numerados `docs/conhecimento/<NN>-<slug>.md`.
   - Subpasta `docs/conhecimento/materiais/`: versionada no template via `template/docs/conhecimento/materiais/.gitkeep` e destinada a arquivos de apoio externos (`docs/conhecimento/materiais/<arquivo>.md`, exportações do NotebookLM, atas, diagramas textuais). Já protegida por `"docs/conhecimento/**"` em `_skip_if_exists` no `copier.yml` e classificada como documentação por `ehArquivoDeDocumentacaoOuGovernanca()`.
   - `template/docs/conhecimento/INDICE.md`: atualizado na Seção 4 documentando `docs/conhecimento/materiais/` e o comando `/sintetizar`.
2. **Contrato da Skill `template/.agents/skills/sintetizar-conhecimento/SKILL.md`:**
   - Frontmatter YAML com `name: sintetizar-conhecimento` e `description`.
   - **Gatilhos Oficiais:** Manual (`/sintetizar`) e Automático (disparado pelo Passo 3 de `.agents/skills/mesa-de-descoberta/SKILL.md` e pelo Passo 2 de `.agents/skills/inicializar-stack/SKILL.md` quando houver `> 8` arquivos ou materiais em `docs/conhecimento/materiais/`).
   - **Passo 1 — Inventário e Triagem de Volume:** Lê `docs/conhecimento/INDICE.md` e inventaria capítulos + `docs/conhecimento/materiais/`. Até `≤ 8` capítulos curtos sem materiais extensos executa leitura física direta; acima de `8` arquivos ou com materiais longos ativa **Map-Reduce**.
   - **Passo 2 — Extração *Map-Reduce* (Subagentes *Read-Only* em Paralelo):** Agrupa arquivos por domínio em lotes de 4–5 itens e delega a **subagentes *read-only* em paralelo**, exigindo ficha factual estruturada com citação de origem (`Regras`, `Entidades`, `Dependências`, `Contradições`, `Cortes`, `Lacunas`).
   - **Passo 3 — Auditoria de Contradições Cross-Arquivos & Rastreabilidade Anti-Alucinação:** Confronta as fichas dos lotes; qualquer contradição entre arquivos obriga **parada e consulta explícita ao usuário**. Proíbe extrapolar ou inventar regras: toda omissão descoberta é isolada em **Lacunas / Decisões Pendentes**.
   - **Passo 4 — Destilação em 2 Camadas:**
     - *Camada 1:* Consolida **Invariantes Globais + Mapa de Domínios** com rastreabilidade das fontes para aprovação humana antes de fatiar.
     - *Camada 2:* Emite blocos *Rolling Wave* em `openspec/roadmap.md` com as 4 âncoras (`Depende de:`, `Objetivo de Valor:`, `O que ENTRA:`, `O que FICA DE FORA:`) e `Fontes de Conhecimento`, atualizando `status: promovido` nos capítulos e em `docs/conhecimento/INDICE.md`.
3. **Integração, Integridade Referencial e CI:**
   - `template/.agents/skills/mesa-de-descoberta/SKILL.md` (Passo 3) e `template/.agents/skills/inicializar-stack/SKILL.md` (Passo 2) referenciam `.agents/skills/sintetizar-conhecimento/SKILL.md` quando o volume ultrapassar `8` arquivos ou houver `docs/conhecimento/materiais/`.
   - `AGENTS.md` (raiz), `template/AGENTS.md` e `template/README.md.jinja` registram `sintetizar-conhecimento` e `/sintetizar`.
   - `.github/workflows/ci.yml` valida `.agents/skills/sintetizar-conhecimento/SKILL.md` e `docs/conhecimento/materiais` no job Copier.

## Interface e Estados Assíncronos
Não se aplica: projeto sem interface gráfica de usuário. Trata-se de protocolo agêntico, skills Markdown, estrutura de diretórios e testes automatizados Node.js ESM.

## Regras de Negócio e Segurança
1. **Congelamento Estrito de Código:** Enquanto `sintetizar-conhecimento` estiver ativa, é terminantemente proibido editar código de produção, alterar schemas de banco ou abrir pastas em `openspec/changes/`.
2. **Proibição de Alucinação e Extrapolação:** Nenhuma regra de negócio ou invariante pode entrar em `openspec/roadmap.md` ou `openspec/project.md` sem citar explicitamente o arquivo-fonte em `docs/conhecimento/`; pontos omissos devem ir para **Lacunas / Decisões Pendentes**.
3. **Parada em Contradições:** Divergências entre capítulos ou materiais externos bloqueiam a geração automática de fatias até deliberação humana explícita.
4. **Higiene de Referências do Template:** Em `template/.agents/skills/` e `template/AGENTS.md`, exemplos genéricos de arquivos em `docs/conhecimento/` usam placeholders com `<...>` para preservar a integridade referencial auditada por `tests/template-docs.test.mjs`.
