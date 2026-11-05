# Fatia 10: Governança de Reúso, Tokens de Movimento, Component-as-Asset e Anti-Monólito (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-10-reuso-tokens-movimento-e-component-as-asset`  
> **Depende diretamente de:** `fatia-09-regras-modulares-por-glob-e-docs-mercado.md`

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Artigo 14 na Constituição (`template/constitution.md`) e Expansão dos Trilhos Modulares (`.agents/rules/`):**
     - Institui a cláusula pétrea *Reuse-Before-Create* (proibição de recriar botões, inputs, cards, modais, estilos ou animações inline quando já houver primitivo equivalente).
     - Exige na **Fatia 01 (Fundação)** de qualquer projeto interativo (Web/SaaS, Mobile, Desktop ou Jogos) a definição explícita dos **Tokens Base** (cores semânticas, tipografia, espaçamentos e **durações/curvas canônicas de animação e transição**) e da árvore base de componentes/prefabs antes de telas ou fases.
     - Define a regra objetiva de extração e **Component-as-Asset** (plugada diretamente em `.agents/rules/web-ui-pwa.md` e `.agents/rules/jogos-engines.md` criados na Fatia 09): primitivos visuais, animações/transições e entidades/mecânicas de jogos (inimigos, projéteis, itens coletáveis, hitboxes/hurtboxes, HUD, partículas, *tweens* e *shaders*) nascem **sempre** componetizados/tokenizados na 1ª ocorrência; blocos específicos de tela/domínio são extraídos ao se repetirem em 2 ou mais lugares.
  2. **Catálogo Vivo de Ponteiros (`template/docs/catalogo-reuso.md`) Protegido no Copier (`copier.yml`):**
     - Índice enxuto de **1 linha por item** (proibido colar código-fonte para proteger o orçamento de contexto), organizado em 4 tabelas canônicas e blindado em `_skip_if_exists`.
  3. **Nova Skill Oficial (`template/.agents/skills/reuso-e-modularizacao/SKILL.md`):**
     - Atua em **Modo Preventivo (Em Fluxo)** integrado a Gate 0, Gate 1 (`design.md` com matriz `Reutilizar vs. Extrair Novo`), `/fix` e etapa Refatorar, e em **Modo Corretivo (`/auditar-reuso` / Brownfield)** para higienizar repositórios existentes com deriva estética ou cenas monolíticas (cobrindo SaaS/Apps e Jogos em Godot 4, Phaser 3, Three.js/R3F e Bevy ECS).
  4. **Paridade Tripla na Auditoria Cega Pré-Gate 2 (`revisar-fatia`, Claude e Copilot):**
     - Atualiza `revisar-fatia/SKILL.md`, `.claude/agents/inspetor-forense.md` e `.github/agents/inspetor-forense.agent.md` para denunciar estilos/animações avulsas fora dos tokens, primitivos reinventados, cenas de jogo monolíticas e justificativas abusivas da válvula de arquivo extenso.
  5. **Sensor Anti-Monólito (> 350 Linhas Úteis) e Suporte `.gd` em `verificar-governanca.mjs`:**
     - Inclui `.gd` (GDScript do Godot 4) em `ehArquivoDeProducao` (excluindo `addons/` e arquivos de teste GUT `test_*.gd` / `*_test.gd` / `*.test.gd`).
     - Bloqueia (`exit 1`) arquivos de produção acima de **350 linhas úteis** (isentando `components/ui/`, `*.generated.*`, `*.d.ts`, `addons/`, `vendor/`, `migrations/` e `drizzle/`), exigindo decomposição modular ou diretiva explícita `governanca:arquivo-extenso-justificado: <motivo técnico >= 15 caracteres>`.

- **Por que esta fatia existe neste ponto da sequência:**
  Encaixa-se exatamente após a Fatia 09 para aproveitar os módulos `.agents/rules/web-ui-pwa.md` e `.agents/rules/jogos-engines.md` (carregados sob demanda por glob), garantindo que projetos de API pura ou CLI não paguem custo de tokens de UI/Jogos, enquanto projetos interativos e jogos ficam 100% blindados contra deriva estética e monólitos.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-09-regras-modulares-por-glob-e-docs-mercado.md` (trilhos `.agents/rules/` e estrutura v4).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Com `.gd` devidamente reconhecido no verificador e componentes/prefabs desacoplados, prepara o terreno para a **Fatia 11** plugar execução headless de GUT (Godot 4), Smoke E2E Web e *Testing Trophy* no Lefthook e no CI.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** adicionar parsers externos pesados de AST no `verificar-governanca.mjs` (manter 100% Node.js nativo e < 50ms).
  - **Proibido** bloquear cores hexadecimais por regex cega no verificador (evitando falsos positivos em SVGs, temas e testes; a auditoria semântica cabe ao Inspetor Forense).
  - **Proibido** colar implementações de código dentro de `docs/catalogo-reuso.md`.

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Estrutura Canônica de `template/docs/catalogo-reuso.md`
Quatro tabelas obrigatórias de ponteiros de 1 linha:
1. `## 1. Tokens Visuais e de Movimento` (`Token / Categoria` | `Arquivo Fonte` | `Valores / Curvas Canônicas` | `Regra de Uso`).
2. `## 2. Primitivos de UI e Layouts Compartilhados` (`Componente` | `Caminho` | `Variantes / Props-Chave` | `Quando Reutilizar`).
3. `## 3. Prefabs, Cenas Componíveis e Assets Modulares (Jogos / Interativos)` (`Asset / Prefab / Sistema` | `Caminho` | `Componentes / Sinais / Contratos` | `Onde Instanciar`).
4. `## 4. Hooks, Utilitários e Módulos Puros de Domínio` (`Módulo / Hook` | `Caminho` | `Responsabilidade Única` | `Consumidores`).

Em `copier.yml`, adicionar `"docs/catalogo-reuso.md"` sob `_skip_if_exists`.

### 3.2. Contrato Determinístico Anti-Monólito em `verificar-governanca.mjs`
- **Cálculo de Linhas Úteis (`contarLinhasUteisCodigo`):** Ignora linhas em branco e linhas iniciadas após `trim()` por `//`, `#`, `/*`, `*`, `*/` ou `<!--`.
- **Teto Estrito:** `350` linhas úteis por arquivo classificado em `ehArquivoDeProducao`.
- **Isenções Automáticas (`ehArquivoIsentoDeTetoMonolito`):** `components/ui/`, `addons/`, `vendor/`, `generated/`, `migrations/`, `drizzle/`, `.d.ts`, `.generated.`, `.min.`, `routeTree.gen.`.
- **Válvula Auditável:** Regex `/governanca:arquivo-extenso-justificado\s*[:—-]\s*(\S.{14,})/i` (rejeita marcadores vazios sem explicação real com `exit 1`).

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Diagnósticos de Terminal (`verificar-governanca.mjs`):** Quando um arquivo estourar 350 linhas úteis, exibe o caminho exato, a contagem medida de linhas úteis e orienta a extração de subcomponentes, módulos ou *Prefabs/Cenas* catalogados em `docs/catalogo-reuso.md`.
- **Padronização de Estados e Feedbacks em Web/Jogos:** Em `.agents/rules/web-ui-pwa.md`, reforça que Skeletons (`loading`), Empty States (`empty`), alertas de `error`, Toasts de mutação e Modais destrutivos devem sempre consumir os primitivos e tokens de movimento do `docs/catalogo-reuso.md`, proibindo criar animações divergentes em cada rota.

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Obrigatoriedade no Gate 1 Just-in-Time e no `/fix`:** Em `ciclo-especificacao/SKILL.md`, antes de propor `design.md` (Nível 2) ou editar UI/cenas no `/fix` (Nível 1), o agente deve consultar `docs/catalogo-reuso.md` e declarar explicitamente o que será reutilizado vs. o que será extraído e catalogado.
2. **Padrões *Component-as-Asset* por Engine na Skill `reuso-e-modularizacao`:**
   - **Godot 4:** Cenas `.tscn` atômicas (`CenaInimigoBase`, `ComponenteVida`, `ComponenteHitbox`), `Resource` customizados para dados e `addons/` isolado.
   - **Phaser 3:** Classes de Prefab/GameObjects reutilizáveis + módulo central de constantes de física/easing/tweens fora das `Scene` principais.
   - **Three.js / R3F:** Componentes declarativos reutilizáveis com geometrias/materiais compartilhados (`useMemo`/instancing) e shaders isolados.
   - **Bevy ECS:** Separação estrita em `Component` (dados puros), `Bundle`/Prefabs e `System` focados em responsabilidade única.
3. **Auditoria Forense Anti-Muleta:** O Inspetor Forense verifica se toda ocorrência de `governanca:arquivo-extenso-justificado` tem razão algorítmica genuína, reprovando no Duelo de Conformidade qualquer uso preguiçoso para fugir da componetização.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/reuso-e-modularizacao.test.mjs` antes do código de produção e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_bloquear_arquivo_monolitico_acima_de_350_linhas_uteis_em_tsx_e_gd`):**
   - *Cenário:* Testar `src/painel/TelaGigante.tsx` e `scenes/FasePrincipal.gd` com 360 linhas úteis sem justificativa.
   - *Resultado Esperado:* Bloqueia com `exitCode === 1` citando a contagem (> 350) e o Artigo 14.
2. **Teste 2 (`deve_isentar_comentarios_espacos_components_ui_e_addons`):**
   - *Cenário:* Testar `src/components/ui/sidebar.tsx` (500 linhas), `addons/gut/gut.gd` (500 linhas) e `src/dominio/frete.ts` (310 linhas úteis + 100 linhas de comentários).
   - *Resultado Esperado:* Aprova todos com `exitCode === 0`.
3. **Teste 3 (`deve_rejeitar_valvula_vazia_e_aprovar_valvula_com_motivo_tecnico`):**
   - *Cenário:* Testar arquivo de 370 linhas com `// governanca:arquivo-extenso-justificado` sem motivo vs. com `: parser binário indivisível com tabela contígua de estados`.
   - *Resultado Esperado:* Sem motivo retorna `exitCode === 1`; com motivo real retorna `exitCode === 0`.
4. **Teste 4 (`deve_classificar_gdscript_como_producao_e_testes_gut_como_teste`):**
   - *Cenário:* Validar `tests/test_jogador.gd` como arquivo de teste (bloqueando `.only` / teste oco) e scripts `.gd` comuns como produção.
   - *Resultado Esperado:* Classificação exata sem falsos positivos.
5. **Teste 5 (`deve_conter_catalogo_protegido_skill_artigo_14_e_paridade_forense`):**
   - *Cenário:* Auditar `template/docs/catalogo-reuso.md`, `copier.yml`, `reuso-e-modularizacao/SKILL.md`, `constitution.md` e os 3 arquivos do Inspetor Forense.
   - *Resultado Esperado:* Todos presentes e 100% íntegros.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Artigo 14 adicionado em `template/constitution.md` e detalhado em `.agents/rules/web-ui-pwa.md` e `.agents/rules/jogos-engines.md`.
- [ ] `template/docs/catalogo-reuso.md` criado com ponteiros de 1 linha e listado em `_skip_if_exists` no `copier.yml`.
- [ ] Skill `template/.agents/skills/reuso-e-modularizacao/SKILL.md` criada e amarrada em `AGENTS.md`, `inicializar-stack`, `ciclo-especificacao` e nos 3 perfis do Inspetor Forense.
- [ ] Suporte `.gd` e sensor de 350 linhas úteis implementados em `template/scripts/verificar-governanca.mjs`.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` executados com `exit 0`.
- [ ] `CHANGELOG.md` e `00_INDICE_E_DECISOES.md` atualizados.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** Terminal na raiz do repositório e leitura de `template/.agents/skills/reuso-e-modularizacao/SKILL.md` e `template/docs/catalogo-reuso.md`.
- **Passo a passo com dados prontos:**
  1. Execute `npm test` e confirme que `tests/reuso-e-modularizacao.test.mjs` e todas as demais suítes passam verdes.
  2. Inspecione `template/docs/catalogo-reuso.md` e confirme a estrutura de 4 tabelas de 1 linha por item.
  3. Confira em `template/.agents/skills/reuso-e-modularizacao/SKILL.md` os guias práticos para Web/SaaS e para Godot 4, Phaser 3, Three.js/R3F e Bevy ECS.
- **Comportamento visual esperado:** Execução instantânea (< 50ms) da auditoria determinística e documentação enxuta pronta para distribuição via Copier.
- **Teste de borda prático:** Simular um arquivo `.gd` de 365 linhas úteis com válvula vazia e observar a rejeição imediata em PT-BR exigindo justificativa técnica real ou extração em cenas/componentes.
