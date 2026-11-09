# Fatia 08: Desburocratização SDD Sem Perda de Rigor, Rolling Wave e Níveis de Cerimônia (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`  
> **Depende diretamente de:** `fatia-07-protocolo-handshake-e-triade-linear.md`  
> **Princípio Pétreo de Transição:** Zero regressão de governança. Cortamos **apenas retrabalho mecânico e duplicação textual**, transferindo 100% das travas determinísticas da v3 para a nova fonte única — e cada obrigação removida de um lugar precisa reaparecer, auditada, em outro (**Emenda por Re-mapeamento**).
> **Revisão 2026-11-05:** Adicionados (a) Emenda por Re-mapeamento da Constituição (a cláusula de invariância original contradizia o próprio objetivo da fatia), (b) eliminação da 3ª duplicação (tabela de fatias em `project.md`), (c) vínculo determinístico Roadmap ↔ OpenSpec sem arquivo por fatia, (d) pilares auditados por cabeçalho (não só por contagem de linhas), (e) mecânica real da Via 1.5 no estágio `commit-msg`, (f) trava `fix` sem teste, (g) correção do bug de classificação de testes em `tests/` na raiz, (h) Cartão de Invariantes no `AGENTS.md` e (i) caminho de migração v3 → v4 para projetos consumidores.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Modelo Rolling Wave + Transferência Integral dos 7 Pilares Anti-Preguiça (`template/openspec/roadmap.md.jinja` + `verificar-governanca.mjs` + `hook-agente.mjs`):**
     - Substitui a escrita **tripla** (tabela em `openspec/project.md` §3 + `roadmap/fatia-XX.md` + 4 arquivos repetidos em `openspec/changes/`) por **uma fonte macro** (`openspec/roadmap.md`, protegido em `_skip_if_exists`) e **uma fonte técnica** (`openspec/changes/fatia-XX-<slug>/`). O status `[ ]`/`[~]`/`[x]` passa a existir em **um único lugar** (`roadmap.md`); `project.md` §3 vira ponteiro.
     - `roadmap.md` contém: (a) **Invariantes Globais do Gate 0** (chave de isolamento/multi-tenancy, modelo de autenticação, filas/eventos transversais e entidades estruturantes) e (b) blocos macro por fatia, auditados estruturalmente (cada bloco precisa de `Depende de`, `Objetivo de Valor`, `O que ENTRA` e `O que FICA DE FORA`).
     - **Zero Perda do Molde Anti-Preguiça:** `auditarPastaMudancaOpenSpec` deixa de aceitar arquivos rasos de 30 caracteres e passa a exigir **cabeçalhos obrigatórios** (PT-BR ou cabeçalhos nativos EN do OpenSpec) + linhas úteis mínimas + zero placeholders em `proposal.md`, `specs/**/spec.md`, `design.md` e `tasks.md`. `hook-agente.mjs` bloqueia placeholders em `openspec/roadmap.md` e `openspec/changes/**/*.md`.
     - **Retrocompatibilidade explícita:** mudanças cujo arquivo legado `openspec/roadmap/<fatia>.md` exista continuam auditadas pela regra v3 (fatias em voo não quebram após `copier update`).
  2. **Via Nível 1.5 — Manutenção Estrutural Blindada (`refactor` / `perf` / `style` / `chore` / `build`):** Permite mais de 3 arquivos de produção ou bump de pacotes já existentes sem spec artificial. Como o `pre-commit` **não conhece** a mensagem do commit, a decisão final migra para o estágio `commit-msg` (e para `--ci`, lendo `git log -1 --format=%s`), que enxerga simultaneamente o tipo do commit e o diff staged.
  3. **Calibragem Estrita do `/fix` com Enforcement Determinístico:**
     - `fix(...)` tocando código de produção **sem nenhum arquivo de teste staged** → bloqueio (`exit 1`). Hoje nada no algoritmo garante o teste do `/fix`; a regra existia só no texto.
     - Ajuste puramente visual/copy usa `style(...)`: dispensa teste novo, mas passa por heurística anti-contrabando (linhas adicionadas em arquivos de código não podem conter fluxo de controle, hooks, handlers ou I/O) + auditoria do Inspetor Forense.
  4. **Desduplicação Sem Amputação (`template/constitution.md` ↔ `template/AGENTS.md`):**
     - Exemplos concretos e garantias da Constituição (`obterUsuario`/`salvarPedido` vs. `payload`/`props`, 44x44px, `Escape`, ACID, Circuit Breaker, Tríade `whoami`) permanecem intactos.
     - Artigos cuja **mecânica** muda (8.3, 8.5, 11.2, 12.2–12.4) são reescritos por **Emenda por Re-mapeamento**: cada obrigação antiga aponta para o novo artefato que a cumpre, com tabela de rastreabilidade verificada por teste.
     - `AGENTS.md` substitui parágrafos copiados por ponteiros, **mas mantém um Cartão de Invariantes de no máximo 15 linhas**, porque Copilot, Codex e Cursor (via link simples) não importam `constitution.md` automaticamente — remover tudo criaria ponto cego nesses harnesses.
  5. **Correção de Dois Bugs de Classificação de Arquivos:**
     - `ehArquivoDeTeste` (verificador) e o detector equivalente em `hook-agente.mjs` não reconhecem `tests/test_x.py` na raiz nem `test_*.py`/`*_test.py` em subpastas — hoje eles contam como **produção**, inflando o teto do `/fix` e exigindo `CHANGELOG.md` indevidamente em projetos Python.
     - `ehArquivoDeDocumentacaoOuGovernanca` isenta a pasta `scripts/` **inteira**. Em projetos consumidores, `scripts/` costuma ter código real (scripts Node de build/seed e, no Godot 4, a pasta convencional de GDScript), que hoje escapa de toda auditoria (`CHANGELOG.md`, teto do `/fix`, testes ocos). A isenção passa a cobrir somente os arquivos da própria governança (`scripts/verificar-governanca.mjs`, `scripts/validar-commit-msg.mjs`, `scripts/hook-agente.mjs` e `scripts/lib/`).
  6. **Atualização das Skills Core, Inspetor e Migração v3 → v4:** Alinhamento de `inicializar-stack`, `ciclo-especificacao`, `refinar-ideia`, `explorar-produto`, `revisar-fatia` (+ 3 perfis do Inspetor Forense) e `atualizar-governanca` (novo roteiro de migração para consumidores), validado por `tests/desburocratizacao-sdd-v4.test.mjs`.

- **Por que esta fatia existe neste ponto da sequência:**
  É a fundação do ciclo **Governança v4**: elimina a burocracia duplicada elevando (em vez de afrouxar) a fiscalização determinística sobre os artefatos oficiais do OpenSpec. Como muda a estrutura de planejamento dos consumidores, é a mudança **quebradora** do ciclo e precisa vir primeiro.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-07-protocolo-handshake-e-triade-linear.md` (base estável da governança v3).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Entrega `AGENTS.md` enxuto com Cartão de Invariantes, o motor OpenSpec auditado por cabeçalhos e o vínculo via `roadmap.md`, prontos para receber na **Fatia 09** os trilhos modulares por glob (`.agents/rules/`) e o kit de documentação de mercado.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** remover o `force_ask` de `git commit`/`git push` em `template/scripts/hook-agente.mjs`.
  - **Proibido** suprimir exemplos práticos, critérios técnicos ou garantias de `template/constitution.md`; só é permitido reescrever a **mecânica** dos artigos listados no item 4, sempre com tabela de re-mapeamento.
  - **Proibido** extrair regras por glob em `.agents/rules/`, criar `docs/arquitetura.md` ou implementar trava de `.env.example` (escopo da **Fatia 09**).
  - **Proibido** apagar os arquivos legados `openspec/roadmap/fatia-*.md` deste repositório ou de consumidores (permanecem como histórico auditado pela regra v3).
  - **Proibido** quebrar qualquer um dos 48 testes existentes.

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Estrutura de `template/openspec/roadmap.md.jinja`
1. **`## 1. Invariantes Globais do Gate 0`:** tabela com `Invariante` | `Decisão` | `Impacto nas Fatias` cobrindo no mínimo: chave de isolamento (ex.: `organizacao_id`), modelo de autenticação/papéis, filas/eventos transversais, entidades estruturantes e convenção de IDs. *(Na Fatia 09 o diagrama `erDiagram` vivo passa a morar em `docs/arquitetura.md`; aqui ficam só as decisões planejadas.)*
2. **`## 2. Fila de Fatias Incrementais (Rolling Wave)`:** um bloco `### [ ] fatia-XX-<slug>` por fatia com `Depende de`, `Objetivo de Valor`, `Entidades/Contratos Tocados`, `O que ENTRA` e `O que FICA DE FORA`. Subfatias alfanuméricas (`fatia-02a-<slug>`) entram como bloco logo após a fatia-mãe.
3. **Horizonte Rolling Wave:** as 2 próximas fatias devem ter blocos com ao menos 3 itens em `O que ENTRA`; fatias distantes podem ser mais grossas, mas nunca sem `FICA DE FORA`.

`copier.yml`: adicionar `"openspec/roadmap.md"` a `_skip_if_exists` (preservando `"openspec/roadmap/fatia-*.md"`). `template/openspec/project.md.jinja` §3 passa a conter apenas o ponteiro para `roadmap.md` (sem tabela de status). `template/openspec/roadmap/_template-fatia.md` é removido do template; a orientação dos pilares passa a viver em `openspec/config.yaml` (regras por artefato) e em `ciclo-especificacao`.

### 3.2. Auditoria Estrutural de `openspec/roadmap.md` (substitui `auditarFatiasDetalhadas` no modo v4)
- Cada bloco `### ... fatia-` precisa conter as 4 âncoras textuais `Depende de`, `Objetivo`, `ENTRA` e `FICA DE FORA`; caso contrário, `exit 1` citando o bloco.
- Zero marcadores de preguiça (mesma lista atual).
- `auditarFatiasDetalhadas` continua rodando sobre `openspec/roadmap/fatia-*.md` legados que existirem.

### 3.3. Vínculo Determinístico Roadmap ↔ OpenSpec
Para uma mudança `fatia-XX-<slug>` (ativa ou arquivada no commit):
1. **Modo legado:** se `openspec/roadmap/fatia-XX-<slug>.md` existir, aplica-se a regra v3 atual (arquivo de 30+ caracteres).
2. **Modo v4:** `openspec/roadmap.md` deve conter o identificador literal `` `fatia-XX-<slug>` ``; senão, `exit 1` com orientação para registrar o bloco.

### 3.4. Pilares Auditados em `auditarPastaMudancaOpenSpec` (modo v4)
Cabeçalhos aceitam PT-BR **ou** os nativos gerados pelo OpenSpec CLI (EN), evitando conflito com `openspec instructions`:

| Artefato | Cabeçalhos obrigatórios (regex, case-insensitive) | Mínimo de linhas úteis |
|---|---|---|
| `proposal.md` | `## (Por que\|Por Quê\|Why)` **e** `## (O que muda\|Escopo\|What Changes)` **e** menção a `Fica de Fora\|Fora de Escopo\|Out of Scope` | 10 |
| `specs/<dominio>/spec.md` | Ao menos 1 arquivo. Deltas `ADDED`/`MODIFIED` exigem `### Requirement:` + `#### Scenario:` com `WHEN` e `THEN` (`GIVEN` recomendado). Delta somente `REMOVED` é aceito com `Reason`/`Motivo`. | — |
| `design.md` | `## ...Contratos\|Dados\|Schemas` **e** `## ...Interface\|Estados` (aceita `Não se aplica: <motivo de 10+ caracteres>`) **e** `## ...Regras\|Segurança` | 18 |
| `tasks.md` | Checklist `- [ ]`/`- [x]` com marcação Test-First (`Vermelho`/`Red` ou `teste falhando`) **e** seção `Roteiro de Validação Prática` | 12 |

`template/openspec/config.yaml.jinja` (`rules:`) espelha **exatamente** esses cabeçalhos, para que os artefatos gerados via `openspec instructions` já nasçam aprovados.

### 3.5. Matriz das Vias de Cerimônia e Mecânica Anti-Contrabando

| Via | Escopo Estrito | OpenSpec? | Onde a trava roda | Travas |
|---|---|---|---|---|
| **1a — `/fix` Funcional** (`fix`) | Bug de lógica em até **3 arquivos** de produção | Não | `pre-commit` (teto) + `commit-msg` (teste) | ≥ 1 arquivo de teste staged + `CHANGELOG.md` em `### Corrigido` + Roteiro Prático |
| **1b — Estético/Copy** (`style`) | `.css`/`.scss`, `className` ou copy estático, até **3 arquivos** | Não | `commit-msg` | Heurística: linhas adicionadas em código não podem conter `if (`, `switch`, `? :` fora de string de classe, `use[A-Z]\w*(`, `on[A-Z]\w*=`, `fetch(`, `await `; suíte existente verde; Inspetor audita |
| **1.5 — Manutenção Estrutural** (`refactor`/`perf`/`style`/`chore`/`build`) | `> 3` arquivos de produção **ou** bump de pacote já presente em `HEAD` | Não | `pre-commit` adia; `commit-msg` decide; `--ci` relê a mensagem | Bloqueia: schema/migração; chave nova em `dependencies`/`devDependencies`/`optionalDependencies`/`peerDependencies` (comparando `git show HEAD:package.json` × `git show :package.json`); linha adicionada sob `### Adicionado` no `CHANGELOG.md` (mapeando hunks `-U0` ao `###` precedente); tipos `feat`/`fix`. Manifestos não-npm (`pyproject.toml`, `Cargo.toml`, `*.csproj`, `go.mod`) **continuam exigindo Nível 2** nesta versão (sem parser confiável zero-dependência = sem afrouxamento) |
| **2 — Feature Just-in-Time** | Nova feature, regra de negócio, pacote novo ou schema | **Sim** | `pre-commit` + `--ci` | Bloco em `roadmap.md` + delta com pilares auditados → Gate 1 → Test-First → Inspetor → Gate 2 |

**Contrato técnico:** a lógica de classificação vive em `template/scripts/lib/classificar-cerimonia.mjs` (zero dependências), importada por `verificar-governanca.mjs` e `validar-commit-msg.mjs`. O `pre-commit` deixa de bloquear `> 3` arquivos sozinho e grava o veredito provisório; o `commit-msg` lê a mensagem e aplica a matriz. `ehCommitDeFundacao` passa a reconhecer `openspec/roadmap.md`.

### 3.6. Correção de Classificação de Arquivos (verificador + hook)
- `ehArquivoDeTeste` passa a reconhecer: prefixo `tests/`, `test/`, `__tests__/` na raiz; nome-base `test_*.py`/`*_test.py` em qualquer pasta; mantendo os padrões atuais. O hook usa a mesma função (extraída para `scripts/lib/classificar-arquivos.mjs`), encerrando a divergência entre os dois detectores.
- `ehArquivoDeDocumentacaoOuGovernanca` troca `startsWith('scripts/')` por lista explícita dos scripts da governança + `scripts/lib/`. No repositório da governança, `template/` continua isento.

### 3.7. Emenda por Re-mapeamento (tabela verificada por teste)

| Obrigação v3 | Local v3 | Local v4 que a cumpre |
|---|---|---|
| Fatia detalhada com 7 seções | Constituição 8.3 + `roadmap/fatia-XX.md` | Constituição 8.3 → pilares auditados em `openspec/changes/<fatia>/` + bloco em `roadmap.md` |
| Gate 0 aprova Mapa de Fatias | Constituição 8.5 | `roadmap.md` (Invariantes + Fila) |
| Marco 1 grava fatias detalhadas | Constituição 11.2 | Marco 1 grava `project.md` + `roadmap.md` |
| Leitura física do arquivo da fatia | Constituição 12.2–12.4 | Leitura física do bloco em `roadmap.md` **e** dos 4 artefatos do delta |
| Duelo de Conformidade contra o roadmap | `revisar-fatia` | Duelo contra `proposal.md` + `specs/` + `design.md` + `tasks.md` (Inspetor continua cego para eles) |

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Mensagens Determinísticas no Terminal:** saídas em PT-BR indicando exatamente qual pilar, cabeçalho ou bloco do roadmap faltou e qual via de cerimônia foi detectada (ex.: `Via 1.5 recusada: chave nova 'zod' em dependencies`).
- **Integridade Total do Artigo 6 na Constituição:** responsividade 320px+, PWA, proibição de `location.reload`, HTML semântico, 44x44px, `Escape`, 4 estados assíncronos, Toasts e Modais destrutivos permanecem 100% preservados.
- **Cartão de Invariantes em `AGENTS.md`:** bloco de até 15 linhas com as regras que mais causam bloqueio (Test-First, teto do `/fix`, commit só com aprovação humana, PT-BR, proibição de `location.reload`, Toast/Modal, `whoami`), cada uma com ponteiro para o artigo.

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Invariante Zero-Trust em Banco e Pacotes Novos:** alterações em schemas/migrações ou chave nova em qualquer seção de dependências bloqueiam sempre sem delta Nível 2.
2. **Auditoria Forense de `style` e `refactor`:** os 3 arquivos do Inspetor Forense passam a relatar (a) se um commit `style` tocou ramificação lógica, hook ou handler, e (b) se um `refactor` alterou assinatura pública, contrato de API ou regra de negócio.
3. **Preservação do Hook `force_ask`:** mantida a confirmação humana em `git commit`, `git push` e comandos destrutivos.
4. **Migração v3 → v4 sem big-bang (`atualizar-governanca`):** nova seção com passo a passo: gerar `openspec/roadmap.md` a partir da tabela de `project.md` §3; manter `roadmap/fatia-*.md` existentes como legado; registrar fatias pendentes como blocos; nenhuma reescrita forçada de fatias já concluídas.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/desburocratizacao-sdd-v4.test.mjs` antes das edições de produção e comprovar falha legítima (**Vermelho**):

1. **Teste 1 (`deve_validar_vinculo_via_roadmap_md_e_exigir_pilares_por_cabecalho`):**
   - *Cenário:* repositório temporário com `fatia-02-pagamentos` registrada em `openspec/roadmap.md` e delta completo (cabeçalhos PT-BR) → `exitCode === 0`; mesmo delta com cabeçalhos nativos EN (`## Why` / `## What Changes`) → `0`; `design.md` raso, sem `specs/`, sem `Scenario:` ou `tasks.md` sem Roteiro Prático → `1`; fatia ausente do `roadmap.md` → `1`.
2. **Teste 2 (`deve_manter_regra_v3_para_fatia_legada_em_voo`):**
   - *Cenário:* existe `openspec/roadmap/fatia-03-legado.md` e delta antigo raso porém com 30+ caracteres → `0` (retrocompatibilidade).
3. **Teste 3 (`deve_auditar_blocos_do_roadmap_md`):**
   - *Cenário:* bloco de fatia sem `FICA DE FORA` ou com `TBD` → `1`; bloco completo → `0`.
4. **Teste 4 (`deve_aprovar_via_1_5_somente_no_commit_msg_com_tipo_permitido`):**
   - *Cenário:* 5 arquivos `.ts` + bump de versão de pacote já existente + `CHANGELOG.md` em `### Modificado`: `pre-commit` → `0`; `commit-msg` com `refactor(core): extrai funcoes auxiliares` → `0`; com `feat(core): ...` ou `fix(core): ...` → `1`.
5. **Teste 5 (`nao_deve_permitir_contrabando_de_pacote_novo_banco_ou_adicionado`):**
   - *Cenário:* chave nova em `devDependencies` com `chore(deps): adiciona pacote`; alteração em `schema.prisma`; linha nova sob `### Adicionado`; bump em `Cargo.toml` sem delta → todos `1`.
6. **Teste 6 (`deve_bloquear_fix_sem_teste_e_style_com_logica`):**
   - *Cenário:* `fix(api): corrige calculo de frete` com 1 arquivo `.ts` e zero testes → `1`; mesmo commit com `frete.test.ts` → `0`; `style(ui): ajusta espacamento do card` adicionando apenas `className` → `0`; `style` adicionando `useState(` ou `onClick=` → `1`.
7. **Teste 7 (`deve_classificar_tests_na_raiz_e_scripts_do_projeto_corretamente`):**
   - *Cenário:* `tests/test_usuarios.py`, `app/test_util.py` e `pkg/frete_test.py` não contam como produção nem exigem `CHANGELOG.md`; `scripts/seed.ts` e `scripts/jogador.gd` contam como produção; `scripts/verificar-governanca.mjs` continua isento.
8. **Teste 8 (`deve_preservar_constituicao_com_tabela_de_re_mapeamento_e_cartao_de_invariantes`):**
   - *Cenário:* `constitution.md` mantém os 13 artigos e os exemplos (`obterUsuario`, `salvarPedido`, `44x44`, `Escape`, `whoami`, `location.reload`, `ACID`); nenhum artigo referencia `_template-fatia.md`; `AGENTS.md` contém o Cartão de Invariantes (≤ 15 linhas) e não contém os parágrafos duplicados; `project.md.jinja` não contém tabela de status; `hook-agente.mjs` preserva `force_ask`.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] `template/openspec/roadmap.md.jinja` criado, auditado estruturalmente e protegido em `_skip_if_exists`; `project.md.jinja` §3 virou ponteiro.
- [ ] Vínculo v4 via `roadmap.md` + modo legado v3 funcionando; pilares auditados por cabeçalho (PT-BR/EN) com `config.yaml.jinja` espelhado.
- [ ] `scripts/lib/classificar-cerimonia.mjs` criado; Via 1.5 decidida no `commit-msg` e no `--ci`; trava `fix` sem teste e heurística `style` ativas.
- [ ] Bugs de classificação corrigidos (testes em `tests/` na raiz e isenção ampla de `scripts/`), com função única para verificador e hook.
- [ ] Constituição emendada por re-mapeamento sem perda de exemplos; `AGENTS.md` com Cartão de Invariantes; `force_ask` preservado.
- [ ] `atualizar-governanca` com roteiro de migração v3 → v4.
- [ ] 48 testes anteriores + novos testes 100% verdes (`npm test`); `openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` com `exit 0`.
- [ ] `CHANGELOG.md` (seção `### Modificado` marcando quebra de compatibilidade) e `00_INDICE_E_DECISOES.md` (nova decisão D32) atualizados.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** terminal na raiz e inspeção de `template/constitution.md`, `template/AGENTS.md`, `template/openspec/roadmap.md.jinja` e `template/scripts/lib/classificar-cerimonia.mjs`.
- **Passo a passo com dados prontos:**
  1. Execute `npm test` e confirme todos os testes verdes.
  2. Gere um projeto de teste com `uvx copier copy --defaults . $env:TEMP\gov-v4` e confirme que existe `openspec/roadmap.md` e **não** existe tabela de status em `openspec/project.md`.
  3. Nesse projeto, crie `src/frete.ts`, faça `git add` e tente `git commit -m "fix(frete): corrige arredondamento do valor"` sem teste: deve bloquear citando a Via 1a.
- **Comportamento visual esperado:** mensagens em PT-BR dizendo qual via foi detectada e qual trava falhou.
- **Teste de borda prático:** adicionar `"zod": "^3.23.0"` em `dependencies` e commitar com `chore(deps): adiciona validacao de schema` → bloqueio imediato exigindo Nível 2.
