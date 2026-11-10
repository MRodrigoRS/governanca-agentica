# Design Técnico — `fatia-10-reuso-tokens-movimento-e-component-as-asset`

## Contratos, Dados e Schemas

### 1. Estrutura Canônica de `template/docs/catalogo-reuso.md`
O arquivo é distribuído pelo Copier protegido sob `_skip_if_exists` e possui 4 tabelas canônicas de 1 linha por item:
1. `## 1. Tokens Visuais e de Movimento` (`Token / Categoria` | `Arquivo Fonte` | `Valores / Curvas Canônicas` | `Regra de Uso`)
2. `## 2. Primitivos de UI e Layouts Compartilhados` (`Componente` | `Caminho` | `Variantes / Props-Chave` | `Quando Reutilizar`)
3. `## 3. Prefabs, Cenas Componíveis e Assets Modulares (Jogos / Interativos)` (`Asset / Prefab / Sistema` | `Caminho` | `Componentes / Sinais / Contratos` | `Onde Instanciar`)
4. `## 4. Hooks, Utilitários e Módulos Puros de Domínio` (`Módulo / Hook` | `Caminho` | `Responsabilidade Única` | `Consumidores`)

Os caminhos na coluna de endereço são formatados entre crases (ex.: `` `src/components/Botao.tsx` `` ou `` `scenes/inimigos/InimigoBase.tscn` ``) para permitir extração determinística por regex no sensor de integridade.

### 2. Algoritmo de Contagem de Linhas Úteis e Catraca
- **Função `contarLinhasUteisCodigo(conteudo, extensao)`:**
  - Descarta linhas em branco e espaços vazios.
  - Comentários em bloco e de linha: `//`, `/*`, `*`, `*/` para linguagens C-like (JS, TS, TSX, JSX, Rust, C#, Go, Dart, Kotlin, Swift).
  - Comentário `#`: aplicado exclusivamente a `.py`, `.gd`, `.sh`, `.rb`.
  - Em `.rs`, anotações de atributos `#[derive(...)]` e macros contam como código.
  - Em `.cs`, diretivas de compilação `#region`, `#endregion`, `#if` contam como código.
  - Comentários HTML/XML: `<!--` e `-->` para `.vue`, `.svelte`, `.html`.
- **Teto Estrito:** 350 linhas úteis para arquivos de produção (`ehArquivoDeProducao`).
- **Isenções de Teto (`ehArquivoIsentoDeTetoMonolito`):** `components/ui/` (shadcn/primitivos importados), `addons/`, `vendor/`, `generated/`, `migrations/`, `drizzle/`, `.d.ts`, `.generated.`, `.min.`, `routeTree.gen.`.
- **Mecanismo de Catraca (Ratchet):**
  - Obtém `linhasHead = contar(git show HEAD:<arquivo>)` (retorna 0 para arquivos novos).
  - Bloqueia com `exit 1` apenas se: `linhasStaged > 350 && (linhasHead <= 350 || linhasStaged > linhasHead)`.
- **Válvula de Exceção Justificada:**
  - Regex: `/governanca:arquivo-extenso-justificado\s*[:—-]\s*(\S.{14,})/i`.
  - Se o marcador estiver presente sem motivo técnico válido (mínimo 15 caracteres não-espaço), rejeita imediatamente.

### 3. Sensor Anti-Apodrecimento do Catálogo
- O sensor extrai os caminhos catalogados no `docs/catalogo-reuso.md`.
- Se um arquivo staged foi deletado ou renomeado (`status === 'D'` ou `status === 'R'`) e constava no catálogo, o commit só é aceito se o próprio `catalogo-reuso.md` também estiver staged e o caminho removido.
- Se `catalogo-reuso.md` for modificado, valida a existência física no disco de todos os arquivos referenciados entre crases.

---

## Interface e Estados Assíncronos

1. **Mensagens Determinísticas de Terminal (PT-BR):**
   - Violação de teto de linhas úteis exibe: arquivo violador, contagem exata no `HEAD` vs. `staged`, limite máximo (350 linhas) e guia para decomposição em subcomponentes ou prefabs.
   - Violação do catálogo de reúso exibe: arquivo apagado/renomeado esquecido no catálogo ou linha exata com ponteiro para arquivo inexistente.
2. **Padronização Visual e de Movimento (Artigo 6 e Artigo 14):**
   - Os 4 estados visuais (`loading`, `empty`, `error`, `success`), skeletons, modais e toasts temporários devem reutilizar os componentes compartilhados catalogados, consumindo durações e curvas de transição padronizadas em tokens de movimento, evitando comportamentos divergentes entre rotas.

---

## Regras de Negócio e Segurança

1. **Constituição e Emenda Artigo 14:** Adicionado como extensão direta do Artigo 1.2, sem redundâncias de conceito.
2. **Ciclo de Especificação (Gate 1 e /fix):** No `ciclo-especificacao/SKILL.md`, a etapa de design e planejamento exige consulta obrigatória ao catálogo de reúso para preencher a matriz "Reutilizar vs. Extrair Novo".
3. **Padrões Component-as-Asset por Engine na Skill `reuso-e-modularizacao`:**
   - **Godot 4:** Prefabs e Cenas `.tscn` atômicas compostas por nós de comportamento (ex.: `CenaInimigoBase`, `ComponenteVida`, `ComponenteHitbox`), `Resource` customizados para dados puros de configuração e isolamento total de `addons/`.
   - **Phaser 3:** Prefabs herdando de `Phaser.GameObjects.Container` ou `Sprite` com física isolada fora das `Scene` monolíticas.
   - **Three.js / R3F:** Componentização de malhas com `useMemo`, instanced meshes e materiais reutilizáveis.
   - **Bevy ECS:** Separação limpa entre componentes de dados puros, bundles e systems.
4. **Auditoria Forense Cega:** O Inspetor Forense audita a introdução de estilos e animações avulsas, duplicação de layouts e o uso abusivo da válvula de arquivo extenso.
