---
name: explorar-produto
description: Ativa o Conselho Evolutivo de Produto (/explorar ou /evoluir) com 3 Subagentes Especialistas read-only em paralelo para propor inovações, ouro barato, refatorações do código entregue e novos capítulos no Livro (docs/conhecimento/), com congelamento estrito de código.
---

# Skill: Conselho Evolutivo de Produto (`explorar-produto`)

Esta skill coloca o agente em **Modo Divergente Sob Demanda** (`/explorar` ou `/evoluir`). Diferente do `Fatiador Cirúrgico` (`/fatiar`, estritamente convergente), ela convoca um **Conselho Evolutivo de 3 Subagentes Especialistas (*read-only* em paralelo)** para ir além da imaginação inicial do fundador sem causar *scope creep* na fila ativa.

> **CONGELAMENTO ESTRITO & EXECUÇÃO SOB DEMANDA:**
> 1. Durante `/explorar` ou `/evoluir`, é **terminantemente proibido** editar código em `src/`, testes, schemas ou abrir delta em `openspec/changes/`.
> 2. Esta skill roda **exclusivamente sob demanda** do humano — `/fatiar` (`planejar-proxima-fatia`), `ciclo-especificacao` e `Gate 2` **nunca** disparam `/explorar` automaticamente.

---

## Passo 1 — Orientação Mínima e Painel de 3 Especialistas (*Read-Only* em Paralelo)

Leia brevemente `openspec/project.md`, `openspec/roadmap.md`, `openspec/matriz-requisitos.md`, `docs/conhecimento/INDICE.md` e `openspec/radar-oportunidades.md`. Em seguida, convoque **3 subagentes *read-only* em paralelo** (ou execute as 3 lentes sequencialmente em passagens separadas em CLIs sem subagentes):

1. **Especialista 1 — Produto & Mercado (`[Produto & Mercado]`):**
   - Lê `openspec/project.md`, `docs/conhecimento/INDICE.md` e `openspec/radar-oportunidades.md`, realizando **pesquisa web viva obrigatória** sobre concorrentes diretos, tendências do nicho e dores recorrentes.
   - Propõe diferenciais "efeito uau", monetização e automações além do escopo inicial.
2. **Especialista 2 — Arquiteto Evolutivo & Refatoração (`[Arquitetura & Código Real]`):**
   - Lê código real em `src/` e `tests/`, `docs/arquitetura.md`, `docs/catalogo-reuso.md`, `docs/aprendizados.md`, `openspec/specs/` e `openspec/matriz-requisitos.md`.
   - Busca **Ouro Barato** (valor alto reaproveitando tabelas, filas ou serviços prontos em ~10%–20% de esforço) e oportunidades de **Repensar & Refatorar o Existente** antes das próximas fatias.
3. **Especialista 3 — Jornada, UX & Conversão (`[UX & Jornada]`):**
   - Lê rotas/componentes reais de interface (`src/`), textos de UX, estados vazios/erro e fluxos entre módulos já entregues.
   - Identifica atritos de funil, cliques redundantes e **atalhos de valor** / simplificações radicais.

### Contrato Conciso de Retorno por Especialista
Cada subagente devolve **no máximo 25 linhas úteis** e **no máximo 3 achados concretos**, contendo em cada achado:
- Título curto + **Impacto / Esforço** (`Alto/Baixo`, `Alto/Médio`, etc.);
- **Evidência factual obrigatória** (`[fonte: caminho/real]` ou `[fonte: URL/pesquisa]`, proibidas opiniões genéricas sem fonte);
- **O que muda / Por que vale agora (ou na V2)**.

---

## Passo 2 — Síntese Crítica em 4 Quadrantes e Mesa-Redonda

Consolide os pareceres aplicando o **Dever de Crítica** em **4 Quadrantes** (2 a 3 propostas por quadrante; **teto de 8 a 10 propostas no total**):

| Quadrante | Foco | Critério Obrigatório |
|---|---|---|
| **1. Ouro Barato (*Quick Wins*)** | Alto impacto com base pronta | Citar literalmente tabela/serviço/fila real reaproveitada |
| **2. Repensar & Refatorar o Existente** | Simplificar código já entregue | Custo de **não** repensar agora vs. impacto futuro |
| **3. Saltos de Produto (*Além do Imaginado*)** | Diferenciais competitivos | Referência real de mercado e risco de escopo no MVP |
| **4. Armadilhas & Cortes Recomendados** | Complexidade falsa | Justificar claramente por que cortar ou adiar para V2 |

Inclua em cada item a recomendação explícita (`➡️ Aprovar agora` | `➡️ Gerar capítulo no Livro` | `➡️ Estacionar na V2` | `➡️ Cortar`).
- **Em harnesses com artefatos (ex.: Antigravity):** gere `exploracao-produto-YYYY-MM-DD.md` (`UserFacing: true`, `RequestFeedback: false`) e mantenha o chat em **≤ 20 linhas** convidando à decisão.
- **Em CLIs:** apresente diretamente os 4 Quadrantes enxutos.

---

## Passo 3 — As 4 Saídas Oficiais (Pós-Decisão Humana)

Nenhuma decisão fica solta no chat; encaminhe cada item decidido pelo humano para seu destino oficial:

1. **Saída 1 — Novo Capítulo Agregante (`docs/conhecimento/<NN>-<slug>.md` + `docs/conhecimento/INDICE.md`):**
   - **Exige permissão explícita humana antes de gravar.** Segue o molde de `mesa-de-descoberta`, atualizando Sumário, Grafo Mermaid e Fios em Aberto em `docs/conhecimento/INDICE.md`.
2. **Saída 2 — Aprovada para o Produto Atual (`openspec/roadmap.md` §2 Mapa Macro + `openspec/matriz-requisitos.md`):**
   - **Proibido pré-fabricar blocos `fatia-XX` antecipadamente.** Capacidades novas entram na Seção 2 (**Mapa Macro de Capacidades**) + novos `REQ-XX` (`[ ] Pendente`) em `openspec/matriz-requisitos.md` (quando existir), ficando disponíveis para `planejar-proxima-fatia` (`/fatiar`). Evoluções ou refatorações imediatas sobre fatia recém-entregue seguem para `refinar-ideia` (subfatia alfanumérica) ou `Via 1.5`.
3. **Saída 3 — Radar Estratégico V2 (`openspec/radar-oportunidades.md`):**
   - Registra ideias de V2, inteligência de mercado, **evoluções/refatorações estruturais estacionadas** e o histórico datado da sessão do Conselho.
4. **Saída 4 — Ideia Descartada (`openspec/project.md` — *Fora de Escopo*):**
   - Documenta o motivo do corte na Seção 1 para evitar revisitar a mesma discussão.

---

## Passo 4 — Validação Pós-Sessão

Se qualquer saída alterar `openspec/roadmap.md` ou `openspec/matriz-requisitos.md`, execute obrigatoriamente ao final:
```bash
node scripts/verificar-governanca.mjs
```
