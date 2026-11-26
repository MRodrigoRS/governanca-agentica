---
name: sintetizar-conhecimento
description: Sintetiza o livro vivo em docs/conhecimento/ e materiais externos de docs/conhecimento/materiais/ em Invariantes Globais e fatias incrementais em openspec/roadmap.md usando estratégia Map-Reduce anti-estouro de contexto, detector de contradições e rastreabilidade anti-alucinação.
---

# Skill: Síntese de Conhecimento em Escala (`sintetizar-conhecimento`)

Esta skill atua na fase **Convergente em Escala**. Seu objetivo é digerir todo o conhecimento acumulado em `docs/conhecimento/` (capítulos cristalizados via `mesa-de-descoberta` e materiais externos adicionados em `docs/conhecimento/materiais/`, como exportações do NotebookLM, atas, diagramas textuais e especificações brutas) e transformá-lo em **Invariantes Globais** e blocos estruturados em `openspec/roadmap.md` — **sem estourar a janela de contexto e sem alucinar regras inexistentes**.

> **CONGELAMENTO ESTRITO DE CÓDIGO (REGRA DE OURO):**
> Enquanto esta skill estiver ativa, é **terminantemente proibido** criar ou editar código de produção, alterar schemas de banco ou abrir pastas em `openspec/changes/`. O trabalho é 100% leitura auditável, triagem, detecção de conflitos e planejamento em `openspec/roadmap.md` / `openspec/project.md`.

---

## Quando Acionar (Gatilho Manual vs. Automático)

1. **Gatilho Manual (`/sintetizar`):** Acionada diretamente pelo usuário quando quiser consolidar todo o livro e materiais em um plano executável ou atualizar fatias a partir de novos documentos.
2. **Gatilho Automático (Escala de Contexto):** Acionada automaticamente pelo Passo 3 de `.agents/skills/mesa-de-descoberta/SKILL.md` ou pelo Passo 2 de `.agents/skills/inicializar-stack/SKILL.md` sempre que o corpus somar **`> 8` arquivos** ou contiver documentos externos em `docs/conhecimento/materiais/`.

---

## Passo 1 — Inventário e Triagem de Volume

1. Leia obrigatoriamente `docs/conhecimento/INDICE.md` para conhecer o mapa de capítulos e relações.
2. Liste todos os arquivos existentes em `docs/conhecimento/` (`docs/conhecimento/<NN>-<slug>.md`) e em `docs/conhecimento/materiais/` (`docs/conhecimento/materiais/<arquivo>.md`).
3. Aplique a régua de estratégia:
   - **Corpus enxuto (`≤ 8` capítulos curtos e sem materiais extensos):** execute leitura física direta em passada única, mantendo todas as garantias dos Passos 3 e 4 abaixo.
   - **Corpus grande (`> 8` arquivos ou presença de materiais extensos em `docs/conhecimento/materiais/`):** **proibido carregar tudo no contexto principal**. Execute o protocolo **Map-Reduce** do Passo 2.

---

## Passo 2 — Extração *Map-Reduce* Anti-Estouro de Contexto

1. **Agrupamento por Domínio (*Map*):** Particione os arquivos do corpus em lotes enxutos de 4 a 5 arquivos por afinidade temática (guiado pelo `INDICE.md` e pelo grafo de relações).
2. **Delegação em Paralelo:** Lance **subagentes *read-only* em paralelo**, um para cada lote de arquivos, para que o contexto principal nunca seja poluído por dezenas de páginas de prosa.
3. **Contrato da Ficha Factual (*Reduce*):** Cada subagente deve ler fisicamente apenas o seu lote e devolver uma ficha enxuta com **citação literal do arquivo de origem** em cada item:
   - **Regras e Invariantes:** comportamentos obrigatórios, limites, fórmulas e permissões (`[fonte: <arquivo>.md]`).
   - **Entidades e Fluxos:** atores, objetos de domínio e eventos citados (`[fonte: <arquivo>.md]`).
   - **Dependências:** pré-requisitos e integrações entre temas (`[fonte: <arquivo>.md]`).
   - **Cortes Explícitos:** o que foi descartado ou adiado naquele material (`[fonte: <arquivo>.md]`).
   - **Contradições Internas / Lacunas:** pontos ambíguos ou não respondidos no lote.

---

## Passo 3 — Auditoria de Contradições Cross-Arquivos & Rastreabilidade Anti-Alucinação

Antes de propor qualquer plano, consolide as fichas devolvidas pelos lotes aplicando duas travas rígidas:

1. **Detector de Contradições (Parada Obrigatória):**
   - Compare regras, papéis, modelos de cobrança e fluxos entre todos os lotes.
   - Se um capítulo ou material externo contradizer outro (ex.: Capítulo 03 define regra X e um material em `docs/conhecimento/materiais/` define Y), o agente **deve parar imediatamente** o fatiamento e apresentar o conflito literal com as duas fontes para que o humano decida qual prevalece — **nunca resolva contradições no chute**.
2. **Rastreabilidade Anti-Alucinação & Seção de Lacunas:**
   - **É expressamente proibido inventar regras, campos, fluxos ou prioridades** que não constem nas fontes lidas.
   - Toda definição que entrar no plano deve preservar sua origem explícita (**`Fontes de Conhecimento`**).
   - Pontos necessários para implementar mas ausentes do corpus devem ser isolados em uma lista clara de **`Lacunas / Decisões Pendentes`** para deliberação humana (ou nova rodada de `/descobrir`).

---

## Passo 4 — Destilação em 2 Camadas para `openspec/roadmap.md`

### Camada 1 — Invariantes Globais + Mapa Macro de Capacidades (Mapa de Domínios)
Apresente primeiro ao humano a síntese estrutural consolidada (sem pré-fabricar blocos `fatia-02`..`fatia-N` às cegas):
1. **Invariantes Globais:** decisões transversais (tenancy, autenticação, moeda/precificação, compliance, eventos assíncronos) com suas respectivas fontes.
2. **Mapa Macro de Capacidades (Mapa de Domínios) e Ordem de Dependência:** macroblocos aprovados do sistema, suas fontes em `docs/conhecimento/`, o grafo de dependência entre eles ("qual ponta puxa qual") e os cortes explícitos.
3. **Contradições Resolvidas e Lacunas / Decisões Pendentes.**
4. Aguarde confirmação do humano antes de materializar a Camada 2.

### Camada 2 — Emissão Híbrida em `openspec/roadmap.md` (Apenas a Próxima Fatia Cirúrgica)
Após a aprovação da Camada 1:
1. Registre os **Invariantes Globais** na Seção 1 (`## 1. Invariantes Globais do Gate 0`), preencha o **Mapa Macro de Capacidades** na Seção 2 (`## 2. Mapa Macro de Capacidades`) de `openspec/roadmap.md` e grave os cortes explícitos na seção *"Fora de Escopo"* de `openspec/project.md`.
2. **Proibido pré-fabricar blocos `fatia-02`..`fatia-N` antecipadamente:** na Seção 3 (`## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)`), emita **apenas a próxima fatia cirúrgica imediata** (`fatia-01-fundacao` em projetos novos, ou acione `.agents/skills/planejar-proxima-fatia/SKILL.md` quando já houver código existente no repositório), garantindo as 4 âncoras auditadas pela governança mais a rastreabilidade de fontes:
   ```markdown
   ### [ ] fatia-XX-<slug>
   - **Depende de:** `fatia-YY-<slug>`
   - **Objetivo de Valor:** [Valor entregue extraído exclusivamente das fontes]
   - **Entidades/Contratos Tocados:** [Tabelas, schemas e ganchos anti-miopia]
   - **Fontes de Conhecimento:** [docs/conhecimento/<NN>-<slug>.md]
   - **O que ENTRA:**
     1. [Regra / comportamento 1 — com origem rastreável]
     2. [Regra / comportamento 2 — com origem rastreável]
   - **O que FICA DE FORA:** [Cortes e adiamentos registrados nas fontes / Mapa Macro]
   ```
3. Atualize o `status: promovido` nos capítulos promovidos ao Mapa Macro de Capacidades e sincronize `docs/conhecimento/INDICE.md`.
4. **Emissão/Atualização de `openspec/matriz-requisitos.md`:** Registre ou atualize na tabela `## 1. Requisitos Rastreados` de `openspec/matriz-requisitos.md` 1 linha enxuta (`REQ-01..REQ-NN`) por regra concreta extraída dos capítulos `01..NN`, com sua fonte (`docs/conhecimento/...`), fatia/capacidade e status inicial `[ ] Pendente` (ou `[~] Em andamento` para a `fatia-01-fundacao`). As fatias seguintes nascerão uma por vez via `/fatiar` (`planejar-proxima-fatia`) sobre o código real construído.
