# Catálogo de Reúso, Tokens de Movimento e Component-as-Asset

> Este catálogo é o inventário vivo de primitivos compartilhados, tokens visuais/cinéticos e prefabs do projeto (Artigo 14).
> **Regra de Manutenção:** Registre 1 linha por item com caminhos entre crases (\`caminho/arquivo\`). É proibido colar código de implementação aqui. O auditor determinístico bloqueia remoções sem sincronização e ponteiros quebrados.

---

## 1. Tokens Visuais e de Movimento

| Token / Categoria | Arquivo Fonte | Valores / Curvas Canônicas | Regra de Uso |
|---|---|---|---|
| Cores Semânticas | `src/styles/tokens.css` | Primária, Neutros, Sucesso, Alerta, Erro | Proibido usar hexadecimais avulsos fora da paleta |
| Tipografia & Escala | `src/styles/tokens.css` | xs (12px), sm (14px), base (16px), lg (20px), xl (24px) | Proibido tamanhos arbitrários |
| Durações de Transição | `src/styles/tokens.css` | Rápida (150ms), Média (250ms), Lenta (400ms) | Microinterações usam 150ms; painéis e modais usam 250ms |
| Curvas de Easing | `src/styles/tokens.css` | cubic-bezier(0.4, 0, 0.2, 1) | Proibido ease linear em transições de layout |

---

## 2. Primitivos de UI e Layouts Compartilhados

| Componente | Caminho | Variantes / Props-Chave | Quando Reutilizar |
|---|---|---|---|
| Botao | `src/components/ui/Botao.tsx` | primario, secundario, destrutivo, loading | Botões de ação, submissão e gatilhos |
| ModalConfirmacao | `src/components/ui/ModalConfirmacao.tsx` | titulo, descricao, acaoDestrutiva, onConfirmar | Ações irreversíveis (exclusão, desativação) |
| ToastNotificacao | `src/components/ui/ToastNotificacao.tsx` | sucesso, erro, info (temporário) | Feedback reativo pós-mutação de dados |
| SkeletonLoader | `src/components/ui/SkeletonLoader.tsx` | retangulo, circulo, texto | Estados assíncronos loading antes do dado real |
| EstadoVazio | `src/components/ui/EstadoVazio.tsx` | icone, titulo, mensagem, botaoAcao | Listas e telas sem registros (empty) |

---

## 3. Prefabs, Cenas Componíveis e Assets Modulares (Jogos / Interativos)

| Asset / Prefab / Sistema | Caminho | Componentes / Sinais / Contratos | Onde Instanciar |
|---|---|---|---|
| InimigoBase | `scenes/inimigos/InimigoBase.tscn` | Vida, Hitbox, hurtbox, sinal morreu | Cenas de fase e spawners dinâmicos |
| HitboxArea | `scenes/combate/HitboxArea.tscn` | dano: int, direcao_impulso: Vector2 | Armas, projéteis e ataques de inimigos |
| HudPadrao | `scenes/ui/HudPadrao.tscn` | barra_vida, contador_pontos, pausado | Viewport principal do jogador |

---

## 4. Hooks, Utilitários e Módulos Puros de Domínio

| Módulo / Hook | Caminho | Responsabilidade Única | Consumidores |
|---|---|---|---|
| useDebounce | `src/hooks/useDebounce.ts` | Atrasa mutações frequentes (busca/digitação) | Inputs de filtro e autocomplete |
| formatarMoeda | `src/utils/formatadores.ts` | Formatação BRL (R$ 0,00) via Intl | Telas de checkout e relatórios |
