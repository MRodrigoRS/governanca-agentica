# Fatia 05: Catálogo Oficial de Jogos, Simulações e Gráficos Interativos (Browser e Desktop Nativo)

> **Status:** `[x] Concluída`  
> **Identificador OpenSpec:** `fatia-05-catalogo-jogos-e-simulacoes`  
> **Depende diretamente de:** `fatia-04-engenharia-de-harness-e-higiene-de-contexto.md` (harness determinístico e governança v3.4.0)

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:** Incorpora formalmente ao protocolo de governança o catálogo oficial e as regras de arquitetura limpa para **Jogos e Simulações (Browser e Desktop Nativo)**, eliminando o ponto cego identificado no catálogo de stacks (`catalogo-stacks.md`):
  1. **Jogos 2D no Navegador:** Phaser 3 + TypeScript (`strict`) + Vite + Vitest, estabelecendo a regra de ouro de desacoplamento entre regras lógicas (física, estados, colisões, inventário, pontuação) e renderização WebGL/Canvas.
  2. **Jogos 3D e Experiências WebGL no Navegador:** Three.js / React Three Fiber + TypeScript + Vite.
  3. **Jogos Nativos e Indie (Desktop):** Godot Engine 4 (C# ou GDScript) com suite GUT (*Godot Unit Testing*) executada em modo headless via CLI para pre-commit/CI.
  4. **Motores de Baixo Nível / Ultra-Performance:** Rust + Bevy (arquitetura ECS - Entity Component System) ou Raylib com `cargo test`.
  5. **Auditoria Determinística de Manifestos de Jogos:** `template/scripts/verificar-governanca.mjs` atualizado para monitorar manifestos de engines de jogos (como `project.godot`), exigindo planejamento de Nível 2 antes de qualquer alteração de dependências em projetos de jogos.
- **Por que esta fatia existe neste ponto da sequência:** Com o harness determinístico (Fatia 04), a auto-governança do repositório e os testes unitários consolidados, esta fatia expande a amplitude da Governança para cobrir game development profissional, garantindo que qualquer usuário que solicite um jogo receba uma arquitetura robusta, tipada e testável, sem cair no amadorismo de scripts HTML soltos com `<canvas>` (Artigo 1 — Anti-Brinquedo).

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-04-engenharia-de-harness-e-higiene-de-contexto.md` (reaproveita os validadores determinísticos, hooks de edição e suíte de testes unitários).
- **O que esta fatia prepara/desbloqueia para a próxima:** Deixa a governança preparada para inicializar projetos de entretenimento digital, gamificação corporativa e simuladores industriais/3D sob o mesmo rigor de engenharia de software tradicional.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** adicionar assets pesados binários (.png, .wav, .blend, .glb) dentro do template da governança.
  - **Proibido** adicionar dependências npm pesadas de game engines no pacote raiz da governança (o template apenas referencia os scaffolding CLIs e valida manifestos).
  - **Proibido** flexibilizar a exigência de testes rápidos no terminal (< 50ms): jogos devem ser arquitetados para testar lógica de estado sem depender de janela gráfica.

---

## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)

### 3.1. Tabelas e Persistência
Não há banco de dados relacional nesta fatia de protocolo. Para projetos de jogos sob a governança:
- **Jogos de Browser:** Persistência de progresso local via `localStorage` / `IndexedDB` com schemas Zod estritos validando o payload de save antes da escrita.
- **Jogos Desktop (Tauri/Godot):** Persistência via SQLite local embutido ou arquivos criptografados de savegame serializados via Zod/Pydantic/Serde.

### 3.2. Contratos e Schemas de Fronteira no Game Dev
Toda mecânica de jogo sob a governança deve declarar contratos formais em TypeScript/Rust/C# para:
- `EstadoJogo`: enumerador tipado de estados (`MENU`, `JOGANDO`, `PAUSADO`, `FIM_DE_JOGO`).
- `InventarioItem`: schema contendo `id`, `nome`, `quantidade`, `peso` e validação de capacidade máxima.
- `CalculoDano`: contrato puro que recebe `poderAtaque`, `defesaAlvo`, `multiplicadorCritico` e retorna `danoFinal`.

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Responsividade e Viewport de Jogos de Navegador:**
  - Jogos web devem declarar viewport responsivo com escala adaptativa (aspect ratio fixo com letterbox ou escala fluida responsiva a partir de 320px).
  - Portabilidade PWA obrigatória: suporte a modo tela cheia (`display: "standalone"` ou `"fullscreen"`), orientação travada e `manifest.json`.
- **Estados Visuais de Jogo:**
  1. `Carregamento` (Preloader / Loading bar de assets com barra de progresso real);
  2. `Tela Inicial / Menu` (Botão Iniciar, Configurações de Áudio e Controles);
  3. `Gameplay Ativa` (Canvas WebGL com HUD reativo);
  4. `Pausa / Game Over` (Modal de confirmação, pontuação final e opção de reinício sem recarregar a página com `location.reload`).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Regra de Desacoplamento Lógica vs. Renderização (Padrão Ouro):**
   - A física, regras de pontuação, cálculo de colisões matemáticas AABB e máquinas de estado do jogo **devem residir em classes e módulos puros**, completamente isolados dos objetos de renderização gráfica do Phaser, Three.js ou Godot.
   - Isso permite que 100% da lógica do jogo seja testada por testes unitários headless instantâneos (< 50ms).
2. **Proibição de Canvas Solto sem Tipos (Artigo 1 — Anti-Brinquedo):**
   - É terminantemente proibido criar arquivos HTML avulsos com scripts inline desenhando em canvas. Todo jogo web deve ser inicializado via bundler oficial (Vite) com TypeScript em modo `strict`.
3. **Reconhecimento de Manifestos de Jogos em `verificar-governanca.mjs`:**
   - O arquivo `project.godot` e arquivos de configuração de engines passam a ser tratados como manifestos de dependência protegidos pelo algoritmo da governança.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

1. **Teste 1 (`verificar-governanca: bloqueia alteracao de manifesto de jogo project.godot sem spec`):**
   - *Cenário:* Criar um repo temporário e simular modificação de `project.godot` isolada sem delta ativo em `openspec/changes/`.
   - *Resultado Esperado:* O validador rejeita com `exit 1` identificando escalonamento automático obrigatório por alteração de manifesto de dependência.
2. **Teste 2 (`verificar-governanca: aprova alteracao em project.godot quando existe spec ativa de jogo`):**
   - *Cenário:* O mesmo repo temporário, agora contendo delta completo de Nível 2 em `openspec/changes/fatia-01-jogo-godot`.
   - *Resultado Esperado:* O validador aprova com `exit 0`.
3. **Teste 3 (`catalogo-stacks: contem a Seção 10 de Jogos e Simulações com Phaser, Three.js, Godot e Bevy`):**
   - *Cenário:* Ler fisicamente `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` e testar a presença dos blocos de Phaser, Three.js, Godot 4 e Bevy.
   - *Resultado Esperado:* Todos os comandos oficiais e regras de desacoplamento estão presentes no catálogo.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Catálogo oficial `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md` atualizado com a Seção 10 detalhando Phaser 3, Three.js, Godot 4 e Bevy/Raylib.
- [ ] `template/scripts/verificar-governanca.mjs` atualizado incluindo `project.godot` na lista de manifestos monitorados.
- [ ] Novos testes automatizados adicionados a `tests/verificar-governanca.test.mjs`, comprovando o ciclo Vermelho $\rightarrow$ Verde.
- [ ] Versão atualizada para `3.5.0` em `package.json` e documentada em `CHANGELOG.md`.
- [ ] `npm test`, `npx @fission-ai/openspec validate --all` e `node template/scripts/verificar-governanca.mjs` 100% aprovados.
- [ ] Auditoria Factual Cega realizada pelo Subagente Inspetor Forense com Duelo de Conformidade.

### 7.2. Roteiro de Validação Prática do Usuário (Gate 2)
- **Onde testar:** Terminal na raiz do repositório.
- **Passo a passo com dados prontos:**
  1. Rodar os testes automatizados da governança:
     ```powershell
     npm test
     ```
  2. Verificar que o validador reconhece manifestos de jogos inspecionando o teste de `project.godot`.
  3. Consultar a nova Seção 10 em `catalogo-stacks.md` e constatar as receitas oficiais e regras de desacoplamento de Game Dev.
