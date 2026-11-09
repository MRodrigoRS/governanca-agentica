# Fatia 10: Governança de Reúso, Tokens de Movimento, Component-as-Asset e Anti-Monólito (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-10-reuso-tokens-movimento-e-component-as-asset`  
> **Depende diretamente de:** `fatia-09a-comandos-atalho-handoff-de-sessao-e-pr.md`
> **Revisão 2026-11-05:** Adicionados (a) **catraca** no sensor anti-monólito: a versão anterior bloquearia qualquer `/fix` de 2 linhas num arquivo legado de 800 linhas, empurrando o agente para a válvula ou para uma refatoração fora de escopo; (b) contagem de comentários por linguagem (`#` não é comentário em Rust/C#); (c) sensor anti-apodrecimento do catálogo (ponteiros para arquivos removidos/renomeados); (d) Artigo 14 como extensão explícita do Artigo 1.2, sem segunda definição de "Design System"; (e) `/auditar-reuso` usando o padrão de comandos da 09a.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Artigo 14 na Constituição (`template/constitution.md`) e Expansão dos Trilhos Modulares (`.agents/rules/`):**
     - Institui *Reuse-Before-Create* como **detalhamento do Artigo 1.2 (Design System Modular)** — o Artigo 1.2 ganha uma linha apontando para o 14, sem duplicar definição: proibido recriar botões, inputs, cards, modais, estilos ou animações inline quando já houver primitivo equivalente.
     - Exige na **Fatia 01 (Fundação)** de projetos com perfil `web-ui`, `desktop`, `mobile` ou `jogo` a definição dos **Tokens Base** (cores semânticas, tipografia, espaçamentos, **durações e curvas canônicas de animação**) e da árvore base de componentes/prefabs antes de telas ou fases. `inicializar-stack` inclui isso no bloco da Fatia 01 do `roadmap.md`.
     - Regra objetiva de extração e **Component-as-Asset** (em `web-ui-pwa.md` e `jogos-engines.md`): primitivos visuais, animações/transições e entidades/mecânicas de jogos (inimigos, projéteis, itens, hitboxes/hurtboxes, HUD, partículas, *tweens*, *shaders*) nascem componentizados/tokenizados na 1ª ocorrência; blocos específicos de tela/domínio são extraídos na 2ª ocorrência.
  2. **Catálogo Vivo de Ponteiros (`template/docs/catalogo-reuso.md`) Protegido no Copier:**
     - Índice de **1 linha por item** (proibido colar código), 4 tabelas canônicas, em `_skip_if_exists`.
     - **Sensor anti-apodrecimento:** commit que remove ou renomeia (status `D`/`R`) um caminho citado no catálogo sem atualizar o catálogo → `exit 1`; commit que altera o catálogo com ponteiro para caminho inexistente → `exit 1`.
  3. **Nova Skill `template/.agents/skills/reuso-e-modularizacao/SKILL.md` + Comando `/auditar-reuso`:**
     - **Modo Preventivo:** Gate 0, Gate 1 (`design.md` com matriz `Reutilizar vs. Extrair Novo`), `/fix` e etapa Refatorar.
     - **Modo Corretivo (`/auditar-reuso`, wrapper nos 3 harnesses no padrão da Fatia 09a):** higieniza repositórios com deriva estética ou cenas monolíticas (SaaS/Apps e Jogos em Godot 4, Phaser 3, Three.js/R3F e Bevy ECS), gerando proposta de fatias de refatoração Via 1.5 — nunca refatoração direta sem Gate.
  4. **Paridade Tripla na Auditoria Cega Pré-Gate 2:** `revisar-fatia/SKILL.md`, `.claude/agents/inspetor-forense.md` e `.github/agents/inspetor-forense.agent.md` denunciam estilos/animações avulsas fora dos tokens, primitivos reinventados, cenas monolíticas e justificativas abusivas da válvula de arquivo extenso.
  5. **Sensor Anti-Monólito com Catraca e Suporte `.gd` em `verificar-governanca.mjs`:**
     - `.gd` passa a ser produção (excluindo `addons/` e testes GUT `test_*.gd`/`*_test.gd`, já reconhecidos pela função de teste corrigida na Fatia 08).
     - Teto de **350 linhas úteis** com **catraca**: arquivo novo ou que **cruza** o teto neste commit → `exit 1`; arquivo que **já estava** acima do teto em `HEAD` só bloqueia se o commit **aumentar** suas linhas úteis. Brownfield nunca piora, e o `/fix` legítimo em arquivo legado continua possível.
     - Válvula `governanca:arquivo-extenso-justificado: <motivo técnico de 15+ caracteres>` auditada pelo Inspetor.

- **Por que esta fatia existe neste ponto da sequência:**
  Usa os módulos `web-ui-pwa.md`/`jogos-engines.md` e `perfis_projeto` (Fatia 09) para que projetos de API pura ou CLI não paguem tokens de UI/Jogos, e o padrão de comandos (Fatia 09a) para `/auditar-reuso`.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-09a-comandos-atalho-handoff-de-sessao-e-pr.md` (padrão de comandos) e, transitivamente, da Fatia 09 (trilhos `.agents/rules/` e perfis).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Com `.gd` reconhecido e componentes/prefabs desacoplados, prepara a **Fatia 11** para GUT headless, Smoke E2E Web e *Testing Trophy* no Lefthook e no CI.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** parsers externos de AST no verificador (Node.js nativo, < 50ms).
  - **Proibido** bloquear cores hexadecimais por regex cega (falsos positivos em SVGs, temas e testes; auditoria semântica é do Inspetor).
  - **Proibido** colar implementações em `docs/catalogo-reuso.md`.
  - **Proibido** tornar obrigatório catalogar todo arquivo novo (vira ruído e destrói o valor de índice enxuto; a exigência é para primitivos, tokens, prefabs e hooks compartilhados).

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Estrutura Canônica de `template/docs/catalogo-reuso.md`
1. `## 1. Tokens Visuais e de Movimento` (`Token / Categoria` | `Arquivo Fonte` | `Valores / Curvas Canônicas` | `Regra de Uso`).
2. `## 2. Primitivos de UI e Layouts Compartilhados` (`Componente` | `Caminho` | `Variantes / Props-Chave` | `Quando Reutilizar`).
3. `## 3. Prefabs, Cenas Componíveis e Assets Modulares (Jogos / Interativos)` (`Asset / Prefab / Sistema` | `Caminho` | `Componentes / Sinais / Contratos` | `Onde Instanciar`).
4. `## 4. Hooks, Utilitários e Módulos Puros de Domínio` (`Módulo / Hook` | `Caminho` | `Responsabilidade Única` | `Consumidores`).

Ponteiros na coluna de caminho são escritos entre crases (`` `src/components/Botao.tsx` ``) para que o sensor os extraia por regex. `copier.yml`: `"docs/catalogo-reuso.md"` em `_skip_if_exists`.

### 3.2. Contrato Anti-Monólito em `verificar-governanca.mjs`
- **`contarLinhasUteisCodigo(conteudo, extensao)`:** ignora linhas em branco; comentários por linguagem — `//`, `/*`, `*`, `*/` para JS/TS/Rust/C#/Go/Dart/Kotlin/Swift; `#` **somente** para `.py`/`.gd`/`.sh`/`.rb`; `<!--` para `.vue`/`.svelte`/`.html`. Em `.rs`, `#[...]` e em `.cs`, `#region`/`#if` contam como código.
- **Teto:** 350 linhas úteis em `ehArquivoDeProducao`.
- **Catraca:** `linhasHead = contar(git show HEAD:<arquivo>)` (0 se novo). Bloqueia se `linhasStaged > 350 && (linhasHead <= 350 || linhasStaged > linhasHead)`.
- **Isenções (`ehArquivoIsentoDeTetoMonolito`):** `components/ui/`, `addons/`, `vendor/`, `generated/`, `migrations/`, `drizzle/`, `.d.ts`, `.generated.`, `.min.`, `routeTree.gen.`.
- **Válvula:** regex `/governanca:arquivo-extenso-justificado\s*[:—-]\s*(\S.{14,})/i`; marcador sem motivo → `exit 1`.

### 3.3. Contrato do Sensor do Catálogo
- Extrai caminhos entre crases das 4 tabelas.
- Se algum arquivo staged com status `D` ou `R` (caminho antigo) está no catálogo e o catálogo não está staged → `exit 1`.
- Se o catálogo está staged e algum ponteiro não existe no disco → `exit 1` citando a linha.

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Diagnósticos de Terminal:** caminho, linhas úteis medidas (`HEAD` → staged) e orientação de extração para subcomponentes, módulos ou *Prefabs/Cenas* do catálogo.
- **Padronização de Estados e Feedbacks:** em `web-ui-pwa.md`, Skeletons (`loading`), Empty States (`empty`), `error`, Toasts e Modais destrutivos consomem os primitivos e tokens de movimento do catálogo, proibindo animações divergentes por rota.

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Gate 1 e `/fix`:** em `ciclo-especificacao/SKILL.md`, antes de propor `design.md` ou editar UI/cenas, o agente consulta `docs/catalogo-reuso.md` e declara o que será reutilizado vs. extraído e catalogado.
2. **Padrões *Component-as-Asset* por Engine na skill `reuso-e-modularizacao`:**
   - **Godot 4:** cenas `.tscn` atômicas (`CenaInimigoBase`, `ComponenteVida`, `ComponenteHitbox`), `Resource` customizados para dados e `addons/` isolado.
   - **Phaser 3:** classes de Prefab/GameObject reutilizáveis + módulo central de constantes de física/easing/tweens fora das `Scene`.
   - **Three.js / R3F:** componentes declarativos com geometrias/materiais compartilhados (`useMemo`/instancing) e shaders isolados.
   - **Bevy ECS:** `Component` (dados puros), `Bundle`/Prefabs e `System` de responsabilidade única.
3. **Auditoria Forense Anti-Muleta:** toda ocorrência de `governanca:arquivo-extenso-justificado` precisa de razão algorítmica genuína; uso para fugir da componentização reprova o Duelo de Conformidade.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/reuso-e-modularizacao.test.mjs` antes do código de produção e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_bloquear_arquivo_novo_ou_que_cruza_350_linhas_uteis_em_tsx_e_gd`):** `src/painel/TelaGigante.tsx` novo e `scenes/FasePrincipal.gd` indo de 340 para 360 linhas úteis → `1`, citando contagem e Artigo 14.
2. **Teste 2 (`deve_aplicar_catraca_em_arquivo_legado`):** arquivo com 800 linhas úteis em `HEAD`: commit que reduz para 790 ou mantém 800 → `0`; commit que sobe para 805 → `1`.
3. **Teste 3 (`deve_isentar_comentarios_por_linguagem_components_ui_e_addons`):** `src/components/ui/sidebar.tsx` (500), `addons/gut/gut.gd` (500) e `src/dominio/frete.ts` (310 úteis + 100 de comentários) → `0`; `src/motor.rs` com 360 linhas incluindo 40 `#[derive]` → conta os atributos e bloqueia.
4. **Teste 4 (`deve_rejeitar_valvula_vazia_e_aprovar_valvula_com_motivo_tecnico`):** 370 linhas com marcador sem motivo → `1`; com `: parser binário indivisível com tabela contígua de estados` → `0`.
5. **Teste 5 (`deve_classificar_gdscript_como_producao_e_testes_gut_como_teste`):** `tests/test_jogador.gd` é teste (sujeito a `.only`/teste oco) e `scripts/jogador.gd` é produção.
6. **Teste 6 (`deve_bloquear_catalogo_apodrecido`):** remover `src/components/Botao.tsx` citado no catálogo sem atualizar o catálogo → `1`; catálogo staged com ponteiro inexistente → `1`; remoção acompanhada da atualização → `0`.
7. **Teste 7 (`deve_conter_catalogo_skill_comando_artigo_14_e_paridade_forense`):** catálogo protegido, skill, wrappers `/auditar-reuso` nos 3 harnesses, Artigo 14 referenciado pelo 1.2 e os 3 perfis do Inspetor atualizados.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Artigo 14 adicionado (estendendo o 1.2) e detalhado em `web-ui-pwa.md` e `jogos-engines.md`.
- [ ] `docs/catalogo-reuso.md` com ponteiros de 1 linha, protegido, com sensor anti-apodrecimento.
- [ ] Skill `reuso-e-modularizacao` + `/auditar-reuso` amarrados em `AGENTS.md`, `inicializar-stack`, `ciclo-especificacao` e nos 3 perfis do Inspetor.
- [ ] Suporte `.gd`, contagem por linguagem e teto de 350 com catraca em `verificar-governanca.mjs`.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` com `exit 0`.
- [ ] `CHANGELOG.md` e `00_INDICE_E_DECISOES.md` atualizados; versão `v4.0.0-alpha.N`.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** terminal na raiz e leitura de `template/.agents/skills/reuso-e-modularizacao/SKILL.md` e `template/docs/catalogo-reuso.md`.
- **Passo a passo com dados prontos:**
  1. Execute `npm test` e confirme `tests/reuso-e-modularizacao.test.mjs` verde.
  2. Inspecione o catálogo e confirme 4 tabelas de 1 linha por item com caminhos entre crases.
  3. Num projeto gerado, comite um `src/legado.ts` de 600 linhas; depois altere 1 linha dentro dele com `fix` + teste e confirme que passa (catraca), e em seguida adicione 10 linhas e confirme o bloqueio.
- **Comportamento visual esperado:** auditoria instantânea (< 50ms) e mensagem mostrando `HEAD 600 → staged 610`.
- **Teste de borda prático:** `.gd` de 365 linhas úteis com válvula vazia → rejeição em PT-BR exigindo motivo real ou extração em cenas/componentes.
