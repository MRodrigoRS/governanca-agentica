---
name: planejar-proxima-fatia
description: Aciona o Subagente Fatiador Cirúrgico (read-only) para analisar simultaneamente a documentação do livro/specs e o código real existente, propondo Just-in-Time apenas a próxima fatia cirúrgica em openspec/roadmap.md (/fatiar ou /planejar-fatia).
---

# Skill: Planejar Próxima Fatia Cirúrgica Just-in-Time (`planejar-proxima-fatia`)

Esta skill substitui o fatiamento antecipado no escuro pelo modelo híbrido **Mapa Macro de Capacidades + Fatiamento Cirúrgico Just-in-Time**. Enquanto o **Gate 0** define apenas os **Invariantes Globais**, o **Mapa Macro de Capacidades** e a `fatia-01-fundacao`, cada fatia subsequente (`fatia-02`, `fatia-03`, ...) é descoberta **uma por vez** sobre a realidade do código já construído e da base de conhecimento acumulada.

> **CONGELAMENTO ESTRITO DE CÓDIGO (REGRA DE OURO):**
> Enquanto esta skill estiver ativa planejando a próxima fatia, é **terminantemente proibido** criar ou editar código de produção, alterar schemas de banco ou abrir pasta em `openspec/changes/` antes da aprovação do novo bloco em `openspec/roadmap.md`.

---

## Gatilhos Oficiais

1. **Manual (`/fatiar` ou `/planejar-fatia`):** Acionado explicitamente pelo humano para analisar o estado atual do repositório e propor a próxima fatia cirúrgica.
2. **Automático na Fila Vazia (`/proxima-fatia`):** Acionado automaticamente pelo §2 de `.agents/skills/ciclo-especificacao/SKILL.md` sempre que não existir nenhuma fatia `[ ] Pendente` na Seção 3 de `openspec/roadmap.md`.
3. **Encerramento do Gate 2:** Ao finalizar uma fatia no Gate 2 (após marcar `[x] Concluído`, arquivar no OpenSpec e recomendar `/compact` ou nova sessão limpa), acionar esta skill para inspecionar o código recém-entregue e propor a próxima fatia.

---

## Passo 1 — Delegação a Subagente *Read-Only* (`Fatiador Cirúrgico`)

Quando o harness suportar subagentes, delegue **obrigatoriamente** a investigação a um subagente *read-only* especializado (**`Fatiador Cirúrgico`**) para isolar o contexto principal. Em terminais/CLIs sem suporte a subagentes, execute exatamente a mesma leitura física explícita antes de propor qualquer corte.

O subagente (ou leitura equivalente) **DEVE ler fisicamente**:
1. **Livro e Visão de Produto:** `docs/conhecimento/INDICE.md` e os capítulos `docs/conhecimento/<NN>-<slug>.md` ligados às capacidades ainda não entregues no Mapa Macro.
2. **Escopo e Cortes:** `openspec/project.md` (visão aprovada, stack e seção *Fora de Escopo*).
3. **Roadmap Atual:** `openspec/roadmap.md` (§1 *Invariantes Globais do Gate 0*, §2 *Mapa Macro de Capacidades* e §3 fatias `[x]` já concluídas na Fila Executável).
4. **Contratos e Mapa Físico:** `openspec/specs/` (contratos vivos já consolidados) e `docs/arquitetura.md` (diagramas C4, `erDiagram`, Glossário e **§5 Mapa Físico de Módulos**).
5. **Restrições e Cicatrizes:** `docs/particularidades.md` e `docs/aprendizados.md`.
6. **Inspeção Real do Repositório:** estrutura real de pastas, schema atual do banco/ORM, migrações existentes, rotas/endpoints, componentes e testes reais já implementados.

---

## Passo 2 — Critérios Decisórios do Subagente (Parecer Factual)

Confrontando o **código real existente** com o **Mapa Macro de Capacidades**, o `Fatiador Cirúrgico` avalia as capacidades elegíveis e seleciona **exatamente o próximo bloco cirúrgico mais propício** segundo 4 critérios:

1. **Prontidão de Dependências:** Quais pré-requisitos reais já estão implementados, migrados e testados no código atual (sem depender de abstrações ainda inexistentes).
2. **Coesão e Tamanho Cirúrgico:** Menor unidade de valor testável ponta-a-ponta, sem misturar 2 ou 3 módulos grandes na mesma fatia.
3. **Desbloqueio Estrutural:** Qual peça encaixa melhor agora para destravar as capacidades seguintes sem gerar retrabalho nem migrações destrutivas contra os **Invariantes Globais**.
4. **Anti-Miopia:** Verifica nos capítulos do livro e no **Mapa Macro de Capacidades** se alguma tabela, chave (`organizacao_id`, IDs canônicos) ou contrato criado nesta fatia já precisa prever campo ou gancho estrutural para capacidades futuras.

---

## Passo 3 — Saída Estruturada para o Agente Principal

O subagente devolve um parecer factual estruturado contendo:

1. **Diagnóstico Resumido do Código Atual:** estado real das tabelas, rotas, módulos e testes observados (`[fonte: <arquivo-real>]`).
2. **Candidatas Avaliadas e Justificativa Técnica:** quais capacidades do Mapa Macro foram comparadas e por que a fatia escolhida deve vir agora antes das demais.
3. **Rascunho do Bloco da Próxima Fatia:** pronto para entrar na Seção 3 de `openspec/roadmap.md`, contendo as 4 âncoras auditadas pela governança mais entidades/contratos e fontes:
   ```markdown
   ### [ ] fatia-XX-<slug>
   - **Depende de:** `fatia-YY-<slug>`
   - **Objetivo de Valor:** [Valor funcional mensurável entregue ponta-a-ponta]
   - **Entidades/Contratos Tocados:** [Tabelas, schemas, rotas, componentes ou ganchos anti-miopia]
   - **Fontes de Conhecimento e Código:** [docs/conhecimento/<NN>-<slug>.md] + [<arquivos reais inspecionados>]
   - **O que ENTRA:**
     - [Comportamento / fluxo 1 rastreável]
     - [Comportamento / fluxo 2 rastreável]
     - [Validação, testes reais e estados assíncronos aplicáveis]
   - **O que FICA DE FORA:**
     - [Recorte explícito mantido para fatias seguintes no Mapa Macro]
   ```
4. **Ambiguidades Detectadas (Livro vs. Código Atual):** eventuais divergências, lacunas ou escolhas de contrato que precisem de deliberação humana antes de abrir o OpenSpec.

---

## Passo 4 — Alinhamento Curto (`grill-me`) e Registro no Roadmap

1. **Apresentação ao Humano:** Apresente o diagnóstico, a justificativa da escolha, o que entra e o que fica de fora. Se houver bifurcação de decisão ou ambiguidade entre livro e código, conduza rodadas curtas no formato `grill-me` acompanhadas de recomendação técnica fundamentada (`➡️`) antes de gravar.
2. **Gravação na Seção 3 de `openspec/roadmap.md`:** Após a confirmação humana (ou ausência de pendências após a apresentação), grave **apenas este novo bloco** `### [ ] fatia-XX-<slug>` na Seção 3 (`## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)`) de `openspec/roadmap.md` — sem pré-fabricar blocos futuros `fatia-XX+1`.
3. **Sincronia do Mapa Macro de Capacidades:** Atualize a coluna `Status` da(s) capacidade(s) correspondente(s) na Seção 2 (`## 2. Mapa Macro de Capacidades`) de `openspec/roadmap.md` (`Em fila` → `Em andamento` ao puxar a fatia; `Entregue` quando concluída no Gate 2).
4. **Transição para Especificação (Via 2):** Somente depois de o bloco estar gravado e aprovado em `openspec/roadmap.md`, siga para `.agents/skills/ciclo-especificacao/SKILL.md` (`npx --yes @fission-ai/openspec new change fatia-XX-<slug>` → Gate 1).
