# Tarefas de Implementação — `fatia-05-catalogo-jogos-e-simulacoes`

- [x] **1. Testes Automatizados de Manifestos de Jogos (`tests/verificar-governanca.test.mjs` — Ciclo Vermelho → Verde):**
  - [x] 1.1. Escrever teste falhando comprovando que a alteração de `project.godot` isolada sem delta ativo é bloqueada pelo algoritmo (`exit 1` com mensagem de escalonamento obrigatório).
  - [x] 1.2. Escrever teste comprovando que a alteração de `project.godot` com delta ativo no OpenSpec é aprovada (`exit 0`).
  - [x] 1.3. Implementar a adição de `project.godot` em `PADROES_MANIFESTO` no arquivo `template/scripts/verificar-governanca.mjs` e comprovar testes verdes.
- [x] **2. Catálogo Oficial de Jogos e Gráficos Interativos:**
  - [x] 2.1. Adicionar Seção 10 em `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` detalhando Phaser 3, Three.js, Godot 4 e Bevy/Raylib com a regra de desacoplamento lógica vs. renderização.
- [ ] **3. Versionamento, Validação e Gate 2:**
  - [x] 3.1. Atualizar versão para `3.5.0` em `package.json` e documentar em `CHANGELOG.md`.
  - [x] 3.2. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive`, `npm test` e `node template/scripts/verificar-governanca.mjs`.
  - [x] 3.3. Acionar Subagente Inspetor Forense para auditoria factual cega do diff, realizar Duelo de Conformidade contra `openspec/roadmap/fatia-05-catalogo-jogos-e-simulacoes.md` e submeter ao Gate 2.
