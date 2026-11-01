# catalogo-jogos-e-simulacoes Specification

## Purpose
Padroniza receitas de Game Dev no catálogo da governança (Phaser 3, Three.js, Godot Engine 4 e Rust Bevy/Raylib) com a regra de ouro de desacoplamento lógica vs. renderização e auditoria determinística de manifestos de jogos.

## Requirements

### Requirement: Catálogo Oficial de Game Development
O protocolo de governança MUST disponibilizar no catálogo de stacks (`catalogo-stacks.md`) receitas oficiais para jogos 2D/3D no navegador e jogos desktop nativos com tipagem estrita, testes automatizados e scaffolding oficial.

#### Scenario: Agente consulta stack para jogo 2D no navegador
- **GIVEN** o usuário solicita a criação de um jogo 2D no navegador
- **WHEN** o agente consulta `catalogo-stacks.md` durante a skill `inicializar-stack`
- **THEN** o agente MUST recomendar Phaser 3 + TypeScript (`strict`) + Vite + Vitest, com desacoplamento entre regras lógicas e renderização.

#### Scenario: Agente consulta stack para jogo nativo instalado no computador
- **GIVEN** o usuário solicita um jogo completo para computador ou mobile
- **WHEN** o agente consulta `catalogo-stacks.md`
- **THEN** o agente MUST recomendar Godot Engine 4 (C# ou GDScript) com testes headless via GUT ou Rust + Bevy ECS para ultra-performance.

### Requirement: Auditoria Determinística de Manifestos de Jogos
O algoritmo determinístico `verificar-governanca.mjs` MUST reconhecer manifestos de projetos de jogos e SHALL bloquear alterações isoladas de dependências sem delta ativo no OpenSpec.

#### Scenario: Alteração isolada em project.godot sem spec
- **GIVEN** um repositório com projeto Godot governado
- **WHEN** o arquivo `project.godot` é alterado sem uma mudança ativa em `openspec/changes/`
- **THEN** `verificar-governanca.mjs` MUST abortar com `exit 1` exigindo escalonamento automático de Nível 2.
