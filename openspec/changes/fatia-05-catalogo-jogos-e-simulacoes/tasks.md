# Tarefas de Implementação — `fatia-05-catalogo-jogos-e-simulacoes`

- [ ] **1. Testes Automatizados de Manifestos de Jogos (`tests/verificar-governanca.test.mjs` — Ciclo Vermelho → Verde):**
  - [ ] 1.1. Escrever teste falhando comprovando que a alteração de `project.godot` isolada sem delta ativo é bloqueada pelo algoritmo (`exit 1` com mensagem de escalonamento obrigatório).
  - [ ] 1.2. Escrever teste comprovando que a alteração de `project.godot` com delta ativo no OpenSpec é aprovada (`exit 0`).
  - [ ] 1.3. Implementar a adição de `project.godot` em `PADROES_MANIFESTO` no arquivo `template/scripts/verificar-governanca.mjs` e comprovar testes verdes.
- [ ] **2. Catálogo Oficial de Jogos e Gráficos Interativos:**
  - [ ] 2.1. Adicionar Seção 10 em `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` detalhando Phaser 3, Three.js, Godot 4 e Bevy/Raylib com a regra de desacoplamento lógica vs. renderização.
- [ ] **3. Versionamento, Validação e Gate 2:**
  - [ ] 3.1. Atualizar versão para `3.5.0` em `package.json` e documentar em `CHANGELOG.md`.
  - [ ] 3.2. Executar `npx --yes @fission-ai/openspec validate --all --no-interactive`, `npm test` e `node template/scripts/verificar-governanca.mjs`.
  - [ ] 3.3. Acionar Subagente Inspetor Forense para auditoria factual cega do diff, realizar Duelo de Conformidade contra `openspec/roadmap/fatia-05-catalogo-jogos-e-simulacoes.md` e submeter ao Gate 2.
