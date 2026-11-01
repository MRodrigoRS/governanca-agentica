# Design Técnico — Fatia 05: Catálogo de Jogos e Simulações

## 1. Arquitetura e Decisões Técnicas

### 1.1. Inclusão da Seção 10 em `catalogo-stacks.md`
A Seção 10 padroniza quatro vertentes de Game Dev:
- **Web 2D:** `@phaserjs/template-vite-ts` com TypeScript strict.
- **Web 3D / WebGL:** Vite + React Three Fiber / Three.js.
- **Desktop Nativo Indie:** Godot 4 com GUT (*Godot Unit Testing*) headless.
- **Desktop Baixo Nível:** Rust + Bevy ECS ou Raylib.

### 1.2. Regra de Desacoplamento Lógica vs. Renderização
Para viabilizar o pre-commit ultrarrápido (< 50ms):
- Toda mecânica central (cálculo de pontuação, inventário, dano, máquinas de estado, colisões AABB puras) deve ser implementada em classes/funções puras desacopladas de classes de nós gráficos ou WebGL.
- Testes unitários padrão da stack (Vitest, GUT headless, `cargo test`) executam em milissegundos sem abrir janela de GPU.

### 1.3. Atualização em `verificar-governanca.mjs`
- Adicionar `'project.godot'` ao array `PADROES_MANIFESTO`.
- `ehManifestoDeDependencia(arquivo)` passará a reconhecer `project.godot` como manifesto de dependência protegido.
