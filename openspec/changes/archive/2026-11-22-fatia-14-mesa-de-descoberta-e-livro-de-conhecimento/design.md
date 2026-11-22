# Design Técnico — Fatia 14: Mesa de Descoberta Contínua e Livro de Conhecimento

## Contratos, Dados e Schemas
1. **Estrutura do Livro de Conhecimento (`template/docs/conhecimento/`):**
   - `template/docs/conhecimento/INDICE.md`: arquivo mestre de entrada do corpus *upstream*, contendo:
     - `## 1. Sumário de Capítulos`: tabela Markdown com colunas `Capítulo`, `Tema`, `Especialidade(s)`, `Status` (`rascunho | consolidado | promovido`) e `Resumo (1 linha)`.
     - `## 2. Grafo de Relações`: bloco `mermaid` (`flowchart LR`) conectando capítulos e domínios.
     - `## 3. Fios em Aberto e Próximas Perguntas`: fila viva de perguntas, tensões arquiteturais e hipóteses pendentes para retomar em futuras sessões após `/compact` ou nova conversa.
     - `## 4. Uso para Síntese Externa (NotebookLM, Obsidian e Mega-Planos)`: instruções práticas de importação do diretório `docs/conhecimento/` em fontes externas sem conflito com `openspec/`.
   - **Molde Canônico de Capítulo (`docs/conhecimento/<NN>-<slug>.md`):**
     - Frontmatter YAML obrigatório: `id`, `tema`, `especialidade`, `status` (`rascunho | consolidado | promovido`) e `relacionados` (lista de links/IDs).
     - Seções padronizadas: `## Contexto e Pergunta Central`, `## Conclusões e Regras de Negócio`, `## Trade-offs e Alternativas Descartadas` e `## Conexões e Fios em Aberto` utilizando links relativos Markdown padrão (`[Título](./<NN>-<slug>.md)`).
2. **Contrato da Skill Universal (`template/.agents/skills/mesa-de-descoberta/SKILL.md`):**
   - Frontmatter YAML com `name: mesa-de-descoberta` e `description`.
   - **Gatilho Automático vs. Manual:** Acionamento automático em repositórios Greenfield (ausência de produto/stack) em conjunto com `.agents/skills/inicializar-stack/SKILL.md`, e acionamento manual via `/descobrir` ou `/mesa`.
   - **Passo 0 (Abertura Anti-Context Rot):** leitura de `docs/conhecimento/INDICE.md`, `openspec/project.md` e `openspec/roadmap.md` (se existirem), retomando *Fios em Aberto* e abrindo capítulos sob demanda.
   - **Passo 1 (Loop Infinito Multi-Especialista Híbrido):** cada turno adota explicitamente lentes especialistas (`[Produto]`, `[Arquitetura]`, `[Dados & Escala]`, `[Segurança]`, `[UX]`, `[Negócio]`) com Dever de Crítica, aprofunda o domínio e sempre propõe novas perguntas/ângulos até o humano solicitar encerramento ou promoção; para impasses ou temas densos, prevê painel sob demanda com subagentes *read-only* em paralelo.
   - **Passo 2 (Cristalização Incremental Autorizada):** ao detectar convergência sobre um ponto, propõe em 1–2 linhas o capítulo-alvo (`docs/conhecimento/<NN>-<slug>.md`) e grava somente após permissão explícita do humano, atualizando `docs/conhecimento/INDICE.md` no mesmo passo.
   - **Passo 3 (Ponte Opcional para Execução):** quando o humano pedir para promover descobertas, cria/atualiza blocos em `openspec/roadmap.md` com as 4 âncoras obrigatórias (`Depende de:`, `Objetivo de Valor:`, `O que ENTRA:`, `O que FICA DE FORA:`) apontando para os capítulos-fonte e atualizando `status: promovido`.
3. **Integração Greenfield & Trava Anti-Amnésia (`template/AGENTS.md` + `inicializar-stack/SKILL.md`):**
   - `template/AGENTS.md` (Seção 2 `Repositório Greenfield`): aciona automaticamente `.agents/skills/mesa-de-descoberta/SKILL.md` integrada a `.agents/skills/inicializar-stack/SKILL.md` quando há ausência de produto/stack.
   - `inicializar-stack/SKILL.md`: transforma as 3 rodadas em **Eixos Progressivos (Eixo 1, Eixo 2, Eixo 3)** sem teto artificial de perguntas, instrui extração incremental autorizada por tema para `docs/conhecimento/<NN>-<slug>.md` e exige **leitura física obrigatória** de `docs/conhecimento/INDICE.md` + capítulos antes do Passo 2 (`openspec/roadmap.md` e `openspec/project.md`), eliminando lembrança de cabeça e alucinação no plano do Gate 0.
4. **Blindagem Copier, Integridade Referencial e CI:**
   - `copier.yml`: inclusão de `- "docs/conhecimento/**"` em `_skip_if_exists` para impedir sobrescrita do livro dos projetos consumidores em `uvx copier update`.
   - `template/AGENTS.md`, `template/README.md.jinja` e `AGENTS.md`: registro dos comandos `/descobrir` e `/mesa`, da skill `mesa-de-descoberta` e de `docs/conhecimento/INDICE.md`. Em `template/.agents/skills/mesa-de-descoberta/SKILL.md`, referências genéricas a capítulos usam placeholders com `<...>` (`docs/conhecimento/<NN>-<slug>.md`) para preservar a regra anti-ponteiros-mortos de `tests/template-docs.test.mjs`.
   - `.github/workflows/ci.yml`: verificação explícita de `docs/conhecimento/INDICE.md` e `.agents/skills/mesa-de-descoberta/SKILL.md` no diretório gerado por `uvx copier copy`.

## Interface e Estados Assíncronos
Não se aplica: projeto sem interface gráfica de usuário. Trata-se de protocolo agêntico, skill Markdown, templates e suíte de testes Node.js ESM.

## Regras de Negócio e Segurança
1. **Congelamento Estrito de Código:** Enquanto `mesa-de-descoberta` estiver ativa, o agente é terminantemente proibido de criar ou editar código de produção, alterar schemas de banco ou abrir deltas em `openspec/changes/`.
2. **Consentimento Humano por Capítulo:** Nenhum arquivo em `docs/conhecimento/` pode ser criado ou sobrescrito silenciosamente sem confirmação explícita do humano na conversa.
3. **Separação de Fonte Única (Livro vs. OpenSpec):** `docs/conhecimento/` armazena raciocínio, regras de negócio exploradas e trade-offs *upstream*; não substitui `openspec/specs/` nem `openspec/roadmap.md`, os quais continuam sendo os únicos contratos auditados para codificação.
4. **Classificação Segura no Motor:** Arquivos em `docs/conhecimento/*.md` são classificados como documentação/governança por `ehArquivoDeDocumentacaoOuGovernanca()` em `template/scripts/lib/classificar-arquivos.mjs`, não exigindo testes nem delta OpenSpec ao registrar capítulos de reflexão.
