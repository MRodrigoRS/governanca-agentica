# Fatia 08: Desburocratização SDD Sem Perda de Rigor, Rolling Wave e Níveis de Cerimônia (Governança v4)

> **Status:** `[ ] Pendente`  
> **Identificador OpenSpec:** `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`  
> **Depende diretamente de:** `fatia-07-protocolo-handshake-e-triade-linear.md`  
> **Princípio Pétreo de Transição:** Zero regressão de governança. Cortamos **apenas retrabalho mecânico e duplicação textual**, transferindo 100% das travas determinísticas da v3 para a nova fonte única.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Modelo Rolling Wave + Transferência Integral dos 7 Pilares Anti-Preguiça (`template/openspec/roadmap.md.jinja` + `verificar-governanca.mjs` + `hook-agente.mjs`):**
     - Substitui a escrita duplicada (`roadmap/fatia-XX.md` + 4 arquivos repetidos em `openspec/changes/`) por um único arquivo `openspec/roadmap.md` (protegido em `_skip_if_exists` no `copier.yml`) contendo: (a) **Visão Sistêmica de Entidades Core e Invariantes Globais** no topo (para o agente prever chaves como `organizacao_id`/multi-tenancy, autenticação e filas já no Gate 0 sem sofrer migrações destrutivas no futuro) e (b) blocos macro por fatia.
     - **Zero Perda do Molde Anti-Preguiça:** Ao remover `_template-fatia.md`, `auditarPastaMudancaOpenSpec` em `verificar-governanca.mjs` deixa de aceitar arquivos rasos de `30 caracteres` e passa a exigir e auditar determinísticamente os **7 Pilares Obrigatórios** dentro de `openspec/changes/fatia-XX-<slug>/` (`proposal.md`, `specs/<dominio>/spec.md`, `design.md` e `tasks.md`), além de expandir `hook-agente.mjs` para bloquear placeholders preguiçosos tanto em `openspec/roadmap.md` quanto em `openspec/changes/**/*.md` (mantendo retrocompatibilidade passiva para projetos legados com `openspec/roadmap/fatia-*.md`).
  2. **Via Nível 1.5 — Manutenção Estrutural Blindada (`refactor` / `chore` / `perf` / `style`):**
     - Permite alterar mais de 3 arquivos de produção ou bumps/patches de versões já existentes sem abrir spec artificial, sob **trava dupla determinística** (`pre-commit` + `commit-msg` + `--ci`): bloqueia `exit 1` se tocar em banco/migrations, se adicionar pacote inédito em `dependencies`, se incluir `### Adicionado` no diff do `CHANGELOG.md` ou se o commit usar `feat`/`fix`, exigindo 100% dos testes verdes e auditoria do Inspetor Forense comprovando preservação de contratos externos.
  3. **Calibragem Estrita do `/fix` Estético/Copy (Zero Brecha para Contrabando de Lógica):**
     - Dispensa teste unitário artificial de classes CSS **exclusivamente** quando o `git diff` tocar apenas folhas de estilo (`.css`/`.scss`), strings literais de texto estático ou classes utilitárias visuais (`className`). Se o diff tocar em **qualquer lógica, estado ou fluxo** (`if`, ternários/booleanos de renderização condicional, `onClick`/`onSubmit`/handlers, hooks `useState`/`useEffect`, schemas, queries ou cálculos), é classificado obrigatoriamente como `/fix` funcional e exige Test-First (Vermelho → Verde), auditado pelo Inspetor Forense.
  4. **Desduplicação Sem Amputação (`template/constitution.md` ↔ `template/AGENTS.md`):**
     - **Cláusula de Invariância Semântica:** É terminantemente proibido resumir, diluir ou apagar qualquer regra normativa, lista de verificação ou exemplo concreto de `constitution.md` (como `obterUsuario`/`salvarPedido` vs. `payload`/`props`, 44x44px, `Escape`, ACID, Circuit Breaker e Tríade `whoami`). A economia de contexto ocorre **unicamente** removendo os parágrafos copiados em `AGENTS.md` (substituídos por ponteiros diretos aos artigos da Constituição) e **mantendo intacto o `force_ask` para `git commit` em `hook-agente.mjs`**.
  5. **Atualização das Skills Core e Suíte Automatizada:**
     - Alinhamento de `inicializar-stack`, `ciclo-especificacao`, `refinar-ideia`, `explorar-produto` e `revisar-fatia` (+ 3 perfis do Inspetor Forense), validado por `tests/desburocratizacao-sdd-v4.test.mjs`.

- **Por que esta fatia existe neste ponto da sequência:**
  É a fundação do ciclo **Governança v4.0.0**: elimina a burocracia duplicada elevando (em vez de afrouxar) a fiscalização determinística sobre os artefatos oficiais do OpenSpec e protegendo a integridade integral da Constituição.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-07-protocolo-handshake-e-triade-linear.md` (base estável da governança v3).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Entrega `AGENTS.md` sem duplicações e o motor OpenSpec auditado nos 7 pilares, prontos para receber na **Fatia 09** os trilhos modulares por glob (`.agents/rules/`) e os padrões de documentação de mercado.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** remover o `force_ask` de `git commit` em `template/scripts/hook-agente.mjs`.
  - **Proibido** suprimir exemplos práticos, critérios técnicos ou garantias existentes em `template/constitution.md` sob pretexto de economizar linhas.
  - **Proibido** extrair regras por glob em `.agents/rules/`, criar `docs/arquitetura.md` ou implementar trava de `.env.example` nesta fatia (escopo exclusivo da **Fatia 09**).
  - **Proibido** quebrar qualquer um dos 48 testes existentes na suíte atual.

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Estrutura de `template/openspec/roadmap.md.jinja` (Visão Sistêmica + Blocos Rolling Wave)
O template deve conter duas seções obrigatórias:
1. **`## 1. Visão Sistêmica de Entidades Core e Invariantes Globais (Gate 0)`:** Tabela/lista mapeando entidades estruturantes do domínio, chave de isolamento (ex.: `organizacao_id` / multi-tenant), modelo de autenticação e filas/eventos transversais previstos para que a Fatia 01 já nasça preparada para as fatias futuras.
2. **`## 2. Fila de Fatias Incrementais (Rolling Wave)`:** Blocos enxutos contendo `Depende de`, `Objetivo de Valor`, `Entidades/Contratos Tocados`, `O que ENTRA` e `O que FICA DE FORA`.

Em `copier.yml`, incluir `"openspec/roadmap.md"` em `_skip_if_exists` (preservando `"openspec/roadmap/fatia-*.md"` para projetos v3).

### 3.2. Transferência Determinística dos 7 Pilares para `auditarPastaMudancaOpenSpec` (`verificar-governanca.mjs`)
Para cada mudança em `openspec/changes/<mudanca>/` (ativa ou arquivada no commit):
1. **`proposal.md` (`>= 10` linhas úteis, zero placeholders):** Deve conter motivação/valor, vínculo com fatia (se aplicável) e fronteira explícita do que entra e do que fica de fora.
2. **`specs/` (obrigatório ao menos 1 arquivo `spec.md`):** Deve conter cabeçalho de requisito (`### Requirement:`) e ao menos um cenário estruturado (`#### Scenario:` com `GIVEN` / `WHEN` / `THEN`). *(Eleva o rigor em relação à v3, que não auditava `specs/` no script)*.
3. **`design.md` (`>= 18` linhas úteis, zero placeholders):** Deve cobrir Contratos/Dados/Schemas em PT-BR, Arquitetura/Interface e Regras de Negócio/Segurança Zero-Trust.
4. **`tasks.md` (`>= 12` linhas úteis, zero placeholders):** Deve conter checklist Test-First (`Vermelho` / `Verde` / `Refatorar`) **e** seção explícita de **Roteiro de Validação Prática (Gate 2)** para o humano testar com dados prontos.
5. **Paridade em `hook-agente.mjs`:** `validarMutacaoConteudoArquivo` passa a bloquear marcadores preguiçosos em `openspec/roadmap.md`, `openspec/roadmap/*.md` e `openspec/changes/**/*.md`.

### 3.3. Matriz das 4 Vias de Cerimônia e Blindagem Anti-Contrabando

| Via | Escopo Estrito | OpenSpec? | Travas Determinísticas e Forenses |
|---|---|---|---|
| **Nível 1a — `/fix` Funcional** | Bug de lógica, condição, handler, hook, query ou validação em até **3 arquivos** | Não | Teste automatizado reproduzindo a falha (Vermelho → Verde) + `CHANGELOG.md` + Roteiro Prático no Gate 2 |
| **Nível 1b — `/fix` Estético/Copy Puro** | Ajuste **exclusivo** de `.css`/`.scss`, classes utilitárias visuais (`className`) ou copy estático em até **3 arquivos** (**zero** alteração em `if`/ternários/hooks/handlers/schemas) | Não | `typecheck` + `build` + suíte existente verde + validação visual/roteiro prático + auditoria contra contrabando lógico + `CHANGELOG.md` |
| **Nível 1.5 — Manutenção Estrutural** | Refatoração `> 3` arquivos ou bump/patch de pacotes já existentes em `HEAD` sem mudar contrato externo | Não | Bloqueia (`exit 1`) banco/migrations, pacote inédito em `dependencies`, `### Adicionado` no diff do `CHANGELOG.md` e prefixos `feat`/`fix` em `validar-commit-msg.mjs` e `--ci`; exige testes verdes + Inspetor Forense |
| **Nível 2 — Feature Just-in-Time** | Nova feature, regra de negócio, novo pacote em `dependencies` ou schema de banco | **Sim** | Vínculo em `openspec/roadmap.md` + delta com os **7 Pilares auditados** em `openspec/changes/fatia-XX-<slug>/` → Gate 1 → Test-First → Inspetor Forense → Gate 2 |

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Mensagens Determinísticas no Terminal CLI:** Saídas em PT-BR detalhando exatamente qual pilar faltou em `proposal.md`, `specs/`, `design.md` ou `tasks.md` caso um agente tente criar um delta superficial no OpenSpec.
- **Integridade Total do Artigo 6 na Constituição:** Todos os itens normativos e exemplos de interface (responsividade 320px+, PWA, proibição de `location.reload`, HTML semântico, 44x44px, `Escape`, 4 estados assíncronos `loading`/`empty`/`error`/`success`, Toasts de mutação e Modais destrutivos) permanecem 100% preservados em `template/constitution.md`.

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Invariante Zero-Trust em Banco e Pacotes Novos:** Alterações em schemas/migrações ou adição de chave nova em `dependencies` / `optionalDependencies` / `peerDependencies` fora da fundação bloqueiam sempre (`exit 1`) sem delta Nível 2 completo.
2. **Auditoria Forense de `/fix` Estético e de `refactor`:** Os 3 arquivos do `inspetor-forense` (`revisar-fatia/SKILL.md`, `.claude/agents/inspetor-forense.md` e `.github/agents/inspetor-forense.agent.md`) passam a auditar explicitamente: (a) se um `/fix` rotulado como estético tocou em qualquer ramificação lógica, hook ou handler sem teste correspondente, e (b) se um `refactor` alterou silenciosamente contratos ou regras de negócio.
3. **Preservação do Hook `force_ask`:** `template/scripts/hook-agente.mjs` mantém a exigência de confirmação humana em `git commit`, `git push` e comandos destrutivos.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

Criar `tests/desburocratizacao-sdd-v4.test.mjs` antes das edições de produção e comprovar falha legítima (**Vermelho**):

1. **Teste 1 (`deve_validar_vinculo_via_roadmap_md_e_exigir_os_7_pilares_no_delta_openspec`):**
   - *Cenário:* Testar em repositório temporário: (a) delta `fatia-02-pagamentos` vinculado em `openspec/roadmap.md` com `proposal.md`, `specs/pagamentos/spec.md` (`### Requirement:` + `#### Scenario:`), `design.md` completo e `tasks.md` com Test-First + Roteiro Prático $\rightarrow$ aprova (`exitCode === 0`); (b) mesmo delta com `design.md` raso de 2 linhas ou sem `specs/` ou sem Roteiro Prático em `tasks.md` $\rightarrow$ bloqueia (`exitCode === 1`); (c) `hook-agente.mjs` bloqueando placeholders preguiçosos em `openspec/roadmap.md` e `openspec/changes/fatia-02/design.md`.
   - *Resultado Esperado:* Zero regressão da Cláusula Anti-Preguiça na migração para fonte única.
2. **Teste 2 (`deve_aprovar_via_manutencao_legitima_e_bump_de_versao_existente`):**
   - *Cenário:* Modificar 5 arquivos `.ts` e atualizar versão de pacote já existente em `HEAD:package.json` + `CHANGELOG.md` em `### Modificado`, com commit `refactor(core): extrai funcoes auxiliares`.
   - *Resultado Esperado:* `verificar-governanca.mjs` e `validar-commit-msg.mjs` aprovam (`exitCode === 0`).
3. **Teste 3 (`nao_deve_permitir_contrabando_de_feature_pacote_novo_ou_banco_sem_openspec`):**
   - *Cenário:* Testar sem OpenSpec: adição de pacote inédito em `dependencies`, alteração em `schema.prisma`, `> 3` arquivos com `### Adicionado` no `CHANGELOG.md` e `> 3` arquivos com commit `feat(...)` ou `fix(...)`.
   - *Resultado Esperado:* Todos bloqueados determinísticamente com `exitCode === 1`.
4. **Teste 4 (`deve_desduplicar_agents_md_preservando_100_por_cento_dos_artigos_e_exemplos_da_constituicao`):**
   - *Cenário:* Verificar que `template/constitution.md` preserva todos os 13 artigos e exemplos concretos (`obterUsuario`, `salvarPedido`, `44x44`, `Escape`, `whoami`, `location.reload`, `ACID`), que `template/AGENTS.md` eliminou os blocos duplicados referenciando a Constituição, que `roadmap.md.jinja` possui a seção de Entidades Core e que `hook-agente.mjs` preserva `force_ask` em `git commit`.
   - *Resultado Esperado:* Asserções 100% satisfeitas sem empobrecer nenhuma cláusula pétrea.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] `template/openspec/roadmap.md.jinja` criado (com seção de Entidades Core + blocos Rolling Wave) e protegido em `_skip_if_exists` no `copier.yml`.
- [ ] `auditarPastaMudancaOpenSpec` em `verificar-governanca.mjs` audita rigorosamente `proposal.md`, `specs/`, `design.md` e `tasks.md` (incluindo Roteiro Prático), e `hook-agente.mjs` bloqueia placeholders em `roadmap.md` e `changes/**/*.md`.
- [ ] Via de Manutenção Estrutural e distinção estrita `/fix` funcional vs. `/fix` estético puro implementadas e cobertas no Inspetor Forense.
- [ ] `template/AGENTS.md` desduplicado com zero amputação de regras ou exemplos em `template/constitution.md` e `force_ask` preservado.
- [ ] Todos os 48 testes anteriores + novos testes em `tests/desburocratizacao-sdd-v4.test.mjs` passando 100% verdes (`npm test`).
- [ ] `npx --yes @fission-ai/openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs` com `exit 0`.
- [ ] `CHANGELOG.md` e `00_INDICE_E_DECISOES.md` atualizados.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
- **Onde testar:** Terminal na raiz do repositório e inspeção de `template/constitution.md`, `template/AGENTS.md`, `template/openspec/roadmap.md.jinja` e `template/scripts/verificar-governanca.mjs`.
- **Passo a passo com dados prontos:**
  1. Execute `npm test` e confirme que todos os testes (legados v3 + novos v4) passam verdes.
  2. Verifique em `template/constitution.md` que todos os exemplos e invariantes continuam intactos, enquanto `template/AGENTS.md` ficou direto e sem textos colados repetidos.
  3. Teste um delta OpenSpec superficial de 2 linhas em um repo temporário e confirme que `verificar-governanca.mjs` barra imediatamente exigindo os 7 pilares completos.
- **Comportamento visual esperado:** Eliminação total da escrita em dobro sem perder nenhum milímetro da trava Anti-Preguiça nem da segurança Zero-Trust.
- **Teste de borda prático:** Simular adição de um pacote novo em `package.json` com mensagem `chore(deps): adiciona pacote` sem OpenSpec e verificar o bloqueio imediato no pre-commit.
