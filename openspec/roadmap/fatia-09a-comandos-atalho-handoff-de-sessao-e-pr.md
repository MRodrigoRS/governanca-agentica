# Fatia 09a: Comandos de Atalho Multi-Harness, Handoff de Sessão e Template de PR (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-09a-comandos-atalho-handoff-de-sessao-e-pr`  
> **Depende diretamente de:** `fatia-09-regras-modulares-por-glob-e-docs-mercado.md`  
> **Origem:** Subfatia alfanumérica criada na revisão de 2026-11-05. A governança cita `/fix`, `/refinar`, `/podar` e `/linear-inbox` em `AGENTS.md` e nas skills, mas **nenhum desses comandos existe fisicamente** em nenhum harness. Além disso, a retomada após `/compact` ou sessão nova depende da memória do chat — exatamente o que o Artigo 12 proíbe. Encaixada logo após a 09 porque reaproveita o mecanismo de wrappers finos que ela cria.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Comandos de Atalho Reais (wrappers finos que apontam para skills, sem duplicar texto):**
     - Gerados em `template/.claude/commands/`, `template/.github/prompts/*.prompt.md` e `template/.cursor/commands/` (o Antigravity já descobre `.agents/skills/` nativamente):

       | Comando | Aciona | Uso típico |
       |---|---|---|
       | `/fix` | `ciclo-especificacao` §1 (Nível 1) | Bug pontual com teste que reproduz a falha |
       | `/proxima-fatia` | `ciclo-especificacao` §2 | Ler `roadmap.md`, abrir delta e preparar Gate 1 |
       | `/retomar` | Handoff de sessão (item 2) | Primeira mensagem após `/compact` ou sessão nova |
       | `/revisar` | `revisar-fatia` | Inspetor Forense cego + Duelo de Conformidade antes do Gate 2 |
       | `/grill-me` | `grill-me` / `grilling` (upstream) | Interrogatório exaustivo de plano/design/ideia |
       | `/refinar` | `refinar-ideia` (orquestra `grill-me`) | Ideia nova no meio do caminho com poda e subfatia |
       | `/explorar` | `explorar-produto` | Reunião de produto sem código |
       | `/aprendizado` | Registro em `docs/aprendizados.md` | Após Circuit Breaker, bug recorrente ou armadilha de ambiente |
       | `/atualizar-governanca` | `atualizar-governanca` | `copier update` seguro |
       | `/linear-inbox` | `refinar-ideia` Passo 0 | Só renderizado com `integrar_linear: true` |

     - `AGENTS.md` ganha uma tabela de 1 linha por comando (substituindo as menções soltas a `/fix`, `/refinar` e `/podar`).
  2. **Handoff de Sessão Determinístico (fim da dependência de memória do chat):**
     - `tasks.md` é o **estado oficial** da fatia: cada tarefa é marcada `- [x]` imediatamente ao concluir, não em lote no final.
     - Seção obrigatória `## Notas de Sessão` ao fim de `tasks.md`: decisões tomadas fora do plano, bloqueios abertos e **Próximo passo** (1 linha). Atualizada antes de `/compact`, de encerrar a sessão ou de acionar o Circuit Breaker.
     - `hook-agente.mjs` (`SessionStart`, Antigravity e Claude) passa a injetar, para cada mudança ativa: `X/Y tarefas concluídas`, a primeira tarefa `- [ ]` pendente e a linha `Próximo passo` — a sessão nova começa sabendo onde parou sem ler o chat antigo.
     - **Trava anti-arquivamento mentiroso:** commit que adiciona arquivos em `openspec/changes/archive/<mudanca>/` com `tasks.md` contendo `- [ ]` → `exit 1`, salvo linha com `(adiada: <motivo>)` ou `(cancelada: <motivo>)`. Evidência de que acontece: o delta arquivado da Fatia 07 deste repositório foi arquivado com a tarefa 4.3 (Inspetor Forense) desmarcada.
  3. **Template de PR Espelhando o Gate 2 + Fluxo Git Configurável:**
     - `template/.github/pull_request_template.md` com as mesmas seções do Gate 2: O que foi entregue, Parecer Factual de Conformidade, Roteiro de Teste Prático, Evidências Vermelho/Verde, Checklist (`CHANGELOG.md`, `openspec validate`, `verificar-governanca`).
     - Nova pergunta `fluxo_git` no Copier: `trunk` (padrão, comportamento atual) ou `branch-por-fatia` (branch `fatia/XX-<slug>`, PR obrigatório, merge após CI verde). No modo `branch-por-fatia`, `ciclo-especificacao` instrui criar a branch no Gate 1 e abrir o PR no Gate 2 via `gh pr create` (CLI preferida a MCP, conforme a regra de higiene de contexto já existente).

- **Por que esta fatia existe neste ponto da sequência:**
  Depende do mecanismo de wrappers da Fatia 09 e precisa vir antes da Fatia 10, que adiciona `/auditar-reuso` usando este mesmo padrão.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-09-regras-modulares-por-glob-e-docs-mercado.md` (wrappers multi-harness e pergunta condicional no Copier).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Padrão de comando que a **Fatia 10** usa para `/auditar-reuso`; handoff que torna seguras as fatias longas 10 e 11.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** colocar lógica ou regras dentro dos wrappers de comando (máximo 20 linhas; o conteúdo vive nas skills).
  - **Proibido** criar arquivo de progresso paralelo (`progress.md`, `HANDOFF.md`): o estado vive em `tasks.md`, que já é auditado e arquivado pelo OpenSpec.
  - **Proibido** tornar `branch-por-fatia` o padrão ou bloquear commits em `main` no modo `trunk`.

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Contrato dos Wrappers de Comando
- Frontmatter mínimo por harness: Claude (`description:`), Copilot (`mode: agent`, `description:`), Cursor (texto simples).
- Corpo: 1 frase de propósito + caminho exato da skill/seção + 1 frase de saída esperada. Sem regras copiadas.

### 3.2. Contrato de `## Notas de Sessão` em `tasks.md`
```markdown
## Notas de Sessão
- **Decisões fora do plano:** <lista curta ou "nenhuma">
- **Bloqueios abertos:** <lista curta ou "nenhum">
- **Próximo passo:** <1 linha acionável>
```
`config.yaml.jinja` (`rules.tasks`) passa a exigir a seção; `auditarPastaMudancaOpenSpec` exige o cabeçalho em mudanças v4.

### 3.3. Contrato do `SessionStart`
Para cada mudança ativa, gerar no máximo 3 linhas: `fatia-XX: 7/12 tarefas`, `Próxima: <texto da 1ª tarefa pendente>`, `Próximo passo: <nota>`. Teto de 600 caracteres no total para não inflar o contexto inicial.

### 3.4. Copier
Nova pergunta `fluxo_git` (`choices: [trunk, branch-por-fatia]`, padrão `trunk`). `pull_request_template.md` é sempre distribuído (inofensivo em `trunk`).

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Saída do `/retomar`:** resumo em 3 blocos — onde parou (fatia + tarefa), o que já está verde (testes citados em `tasks.md`) e próxima ação — seguido de leitura física de `proposal.md`/`design.md` antes de codificar (Artigo 12 continua valendo).
- **Mensagem da trava de arquivamento:** lista as tarefas abertas com número de linha e mostra a sintaxe `(adiada: motivo)`.

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Artigo 12 reforçado:** `/retomar` nunca substitui a leitura física; ele só aponta o que ler primeiro.
2. **Gate 2 em modo branch:** o PR não substitui a aprovação humana no chat; o merge continua sob `force_ask` (`git push`).
3. **Consistência com o Inspetor:** o Inspetor Forense continua proibido de ler `tasks.md` (auditoria cega); só o Agente Principal usa as Notas de Sessão.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/comandos-e-handoff.test.mjs` antes das edições de produção e comprovar falha (**Vermelho**):

1. **Teste 1 (`deve_ter_paridade_de_comandos_nos_3_harnesses_apontando_para_skills_existentes`):** cada comando da tabela existe em `.claude/commands/`, `.github/prompts/` e `.cursor/commands/`, tem ≤ 20 linhas e o caminho de skill citado existe; `/linear-inbox` só existe com `integrar_linear=true`.
2. **Teste 2 (`deve_injetar_progresso_e_proximo_passo_no_session_start`):** mudança ativa com `tasks.md` de 3 tarefas (1 marcada) e nota `Próximo passo: escrever teste de frete` → saída contém `1/3`, a 2ª tarefa e a nota; total ≤ 600 caracteres.
3. **Teste 3 (`deve_bloquear_arquivamento_com_tarefas_abertas`):** archive staged com `- [ ] 4.3 acionar inspetor` → `1`; com `(adiada: aguardando credencial do gateway)` → `0`.
4. **Teste 4 (`deve_distribuir_template_de_pr_e_fluxo_git_condicional`):** `pull_request_template.md` contém as seções do Gate 2; `ciclo-especificacao` cita `gh pr create` só no modo `branch-por-fatia`.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] 9 comandos com paridade nos 3 harnesses e tabela em `AGENTS.md`.
- [ ] `## Notas de Sessão` exigida em `tasks.md`; `SessionStart` injeta progresso (≤ 600 caracteres).
- [ ] Trava de arquivamento com tarefas abertas ativa.
- [ ] `pull_request_template.md` e pergunta `fluxo_git` funcionando.
- [ ] `npm test`, `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` com `exit 0`.
- [ ] `CHANGELOG.md` e `00_INDICE_E_DECISOES.md` atualizados; versão `v4.0.0-alpha.N`.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** projeto gerado em `$env:TEMP\gov-v4-cmd` aberto no Claude Code ou Copilot.
- **Passo a passo com dados prontos:**
  1. Digite `/` no chat e confirme que `/fix`, `/proxima-fatia` e `/retomar` aparecem.
  2. Crie `openspec/changes/fatia-01-teste/tasks.md` com 3 tarefas (1 marcada) e `Próximo passo: escrever teste de frete`; abra uma sessão nova e confira a mensagem inicial.
  3. Tente arquivar essa mudança com tarefas abertas e confirme o bloqueio.
- **Comportamento visual esperado:** sessão nova já cita `1/3 tarefas` e o próximo passo sem nenhuma pergunta ao humano.
- **Teste de borda prático:** apagar a seção `## Notas de Sessão` de um delta v4 e rodar `node scripts/verificar-governanca.mjs` → bloqueio citando o cabeçalho ausente.
