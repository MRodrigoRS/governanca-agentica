# Tarefas de Implementação — `fatia-06-documentos-de-particularidades-e-aprendizados`

- [x] **1. Test-First Mandatório (`tests/template-docs.test.mjs` — Ciclo Vermelho → Verde):**
  - [x] 1.1. Escrever teste falhando (Vermelho) verificando a existência de `template/docs/particularidades.md` e suas 4 seções.
  - [x] 1.2. Escrever teste falhando (Vermelho) verificando a existência de `template/docs/aprendizados.md` e seu modelo de armadilhas.
  - [x] 1.3. Escrever teste falhando (Vermelho) verificando que ambos constam em `_skip_if_exists` de `copier.yml`.
  - [x] 1.4. Escrever teste falhando (Vermelho) verificando a citação dos documentos em `template/AGENTS.md`.
- [x] **2. Criação dos Documentos Canônicos no Template:**
  - [x] 2.1. Criar `template/docs/particularidades.md` com cabeçalho formal e seções de infraestrutura, banco, webhooks e domínio.
  - [x] 2.2. Criar `template/docs/aprendizados.md` com cabeçalho formal e estrutura de cicatrizes empíricas.
- [x] **3. Blindagem no Copier e Amarração no `AGENTS.md`:**
  - [x] 3.1. Adicionar `"docs/particularidades.md"` e `"docs/aprendizados.md"` em `_skip_if_exists` no `copier.yml`.
  - [x] 3.2. Adicionar os ponteiros de leitura sob demanda na Seção 6 de `template/AGENTS.md`.
  - [x] 3.3. Executar `npm test` comprovando todos os testes verdes.
- [x] **4. Versionamento, Validação e Gate 2:**
  - [x] 4.1. Atualizar versão para `3.6.0` em `package.json` e documentar alterações em `CHANGELOG.md`.
  - [x] 4.2. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive`, `npm test` e `node template/scripts/verificar-governanca.mjs`.
  - [x] 4.3. Acionar o Subagente Inspetor Forense para auditoria factual cega do diff, realizar o Duelo de Conformidade e submeter ao Gate 2.
