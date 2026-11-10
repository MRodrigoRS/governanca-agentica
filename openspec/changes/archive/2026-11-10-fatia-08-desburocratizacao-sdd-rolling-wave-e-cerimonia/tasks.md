# Tarefas de Implementação — `fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia`

- [x] **1. Test-First Mandatório (`tests/desburocratizacao-sdd-v4.test.mjs` — Ciclo Vermelho):**
  - [x] 1.1. Escrever Teste 1 falhando (Vermelho): validação de vínculo via `roadmap.md` e exigência de pilares do OpenSpec por cabeçalho (PT-BR/EN).
  - [x] 1.2. Escrever Teste 2 falhando (Vermelho): preservação da regra legada v3 para fatias em voo com arquivo `fatia-*.md`.
  - [x] 1.3. Escrever Teste 3 falhando (Vermelho): auditoria estrutural de blocos em `openspec/roadmap.md` e proibição de placeholders.
  - [x] 1.4. Escrever Teste 4 falhando (Vermelho): aprovação da Via 1.5 no estágio `commit-msg` com tipos convencionais permitidos e bloqueio de `feat`/`fix`.
  - [x] 1.5. Escrever Teste 5 falhando (Vermelho): bloqueio de contrabando de dependências inéditas em `package.json`, migrações de banco e linhas sob `### Adicionado`.
  - [x] 1.6. Escrever Teste 6 falhando (Vermelho): bloqueio de `fix` tocando produção sem arquivo de teste staged e bloqueio de `style` com lógica acoplada.
  - [x] 1.7. Escrever Teste 7 falhando (Vermelho): correta classificação de testes em `tests/` na raiz, extensões `test_*.py`/`*_test.py` e auditoria de arquivos em `scripts/`.
  - [x] 1.8. Escrever Teste 8 falhando (Vermelho): integridade dos 13 artigos na Constituição com re-mapeamento, Cartão de Invariantes em `AGENTS.md` (≤ 15 linhas) e preservação do hook `force_ask`.
- [x] **2. Implementação dos Módulos de Classificação e Cerimônia:**
  - [x] 2.1. Criar `template/scripts/lib/classificar-arquivos.mjs` com funções puras e correções de bugs de teste e scripts.
  - [x] 2.2. Criar `template/scripts/lib/classificar-cerimonia.mjs` com as regras das Vias 1a, 1b, 1.5 e 2.
  - [x] 2.3. Atualizar `template/scripts/verificar-governanca.mjs` integrando `classificar-arquivos.mjs`, auditoria de `roadmap.md` e cabeçalhos de delta OpenSpec.
  - [x] 2.4. Atualizar `template/scripts/validar-commit-msg.mjs` integrando `classificar-cerimonia.mjs`, validação de `fix` sem testes e inspeção de `style`.
  - [x] 2.5. Atualizar `template/scripts/hook-agente.mjs` importando `classificar-arquivos.mjs` e expandindo trava de placeholders para `openspec/roadmap.md` e `openspec/changes/`.
- [x] **3. Implementação dos Templates, Constituição e Documentação:**
  - [x] 3.1. Criar `template/openspec/roadmap.md.jinja` com Invariantes Globais do Gate 0 e blocos Rolling Wave.
  - [x] 3.2. Atualizar `copier.yml` incluindo `"openspec/roadmap.md"` em `_skip_if_exists`.
  - [x] 3.3. Atualizar `template/openspec/project.md.jinja` (§3 vira ponteiro) e remover `template/openspec/roadmap/_template-fatia.md`.
  - [x] 3.4. Atualizar `template/openspec/config.yaml.jinja` e `openspec/config.yaml` espelhando as regras de cabeçalhos por artefato.
  - [x] 3.5. Atualizar `template/constitution.md` com a Emenda por Re-mapeamento (Artigos 8.3, 8.5, 11.2, 12.2–12.4).
  - [x] 3.6. Atualizar `template/AGENTS.md` com Cartão de Invariantes (≤ 15 linhas) e desduplicação concisa.
  - [x] 3.7. Atualizar as skills core (`inicializar-stack`, `ciclo-especificacao`, `refinar-ideia`, `explorar-produto`, `revisar-fatia`, `atualizar-governanca`) e perfis de agente do inspetor forense.
- [x] **4. Execução dos Testes e Comprovação (Ciclo Verde):**
  - [x] 4.1. Executar `node --test tests/desburocratizacao-sdd-v4.test.mjs` e comprovar aprovação verde.
  - [x] 4.2. Executar suíte completa `npm test` garantindo 100% de sucesso em todos os testes.
- [x] **5. Versionamento, Registro de Decisões e Gate 2:**
  - [x] 5.1. Registrar decisão D32 em `00_INDICE_E_DECISOES.md` e atualizar `CHANGELOG.md` com as quebras e melhorias v4.
  - [x] 5.2. Executar validações formais `npx --yes @fission-ai/openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs`.

## Roteiro de Validação Prática

### O que validar:
1. **Auditoria de Cabeçalhos no OpenSpec:**
   - Comprovar que o verificador rejeita arquivos do delta rasos ou sem os cabeçalhos obrigatórios em PT-BR/EN.
2. **Via 1.5 e Enforcement de Commits:**
   - Testar tentativa de commit com tipo `fix` em código de produção sem arquivos de teste staged (deve bloquear com mensagem explicativa em PT-BR).
   - Testar commit do tipo `refactor` ou `chore` com mais de 3 arquivos de produção ou bump de versão existente em `package.json` (deve ser aprovado pela Via 1.5).
   - Testar commit com nova dependência em `package.json` sem delta ativo (deve bloquear determinísticamente exigindo Nível 2).
3. **Cartão de Invariantes e Constituição:**
   - Verificar se `template/AGENTS.md` possui o Cartão de Invariantes conciso (≤ 15 linhas) e se `template/constitution.md` preserva integralmente os exemplos de domínio.
