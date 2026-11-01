# Proposta — Fatia 05: Catálogo Oficial de Jogos, Simulações e Gráficos Interativos

## Why
O catálogo de stacks da Governança (`catalogo-stacks.md`) cobria com excelência SaaS Web, Painéis Administrativos, APIs de Backend, Aplicativos Mobile, Desktop Tauri e Utilitários CLI. No entanto, havia um ponto cego evidente no desenvolvimento de **Jogos (Browser e Desktop Nativo), Gráficos Interativos e Simulações**.

Sem diretrizes e receitas oficiais no catálogo:
1. O agente poderia tentar improvisar arquivos HTML soltos com `<canvas>` e JavaScript inline sem testes ou tipagem, violando a Cláusula Anti-Brinquedo do Artigo 1 da Constituição.
2. Não havia uma regra clara sobre como arquitetar jogos com testes rápidos no terminal (< 50ms), o que é essencial para o fluxo de pre-commit e CI da governança.
3. Arquivos de manifesto de engines profissionais (como `project.godot`) não eram reconhecidos na lista de manifestos protegidos de `verificar-governanca.mjs`.

## What Changes
1. **Inclusão da Seção 10 no Catálogo Oficial (`catalogo-stacks.md`):**
   - **Opção A (Web 2D):** Phaser 3 + TypeScript (`strict`) + Vite + Vitest.
   - **Opção B (Web 3D / WebGL):** Three.js / React Three Fiber + TypeScript + Vite.
   - **Opção C (Desktop Nativo Indie):** Godot Engine 4 (C# ou GDScript) com testes headless via GUT.
   - **Opção D (Desktop Baixo Nível / Ultra-Performance):** Rust + Bevy (ECS) ou Raylib com `cargo test`.
2. **Regra de Desacoplamento Lógica vs. Renderização:**
   - Exigência de que regras de jogo (física matemática, colisões, inventário, máquinas de estado) residam em módulos puros e testáveis sem janela gráfica.
3. **Auditoria Determinística de Manifestos de Jogos:**
   - Atualização de `template/scripts/verificar-governanca.mjs` para incluir `project.godot` na lista `PADROES_MANIFESTO`.
4. **Testes Automatizados:**
   - Adição de testes em `tests/verificar-governanca.test.mjs` garantindo que alterações em manifestos de jogos sem delta aberto sejam bloqueadas no pre-commit.
