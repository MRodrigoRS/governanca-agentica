# Tarefas de Implementação — `fatia-09-regras-modulares-por-glob-e-docs-mercado`

- [x] **1. Test-First Mandatório (`tests/regras-modulares-e-docs-mercado.test.mjs` — Ciclo Vermelho):**
  - [x] 1.1. Escrever Teste 1 falhando (Vermelho): renderização de regras modulares em `.agents/rules/` e wrappers conforme `perfis_projeto` e `integrar_linear`.
  - [x] 1.2. Escrever Teste 2 falhando (Vermelho): sensor `.env.example` bloqueando variáveis de ambiente omitidas e segredos reais em código staged.
  - [x] 1.3. Escrever Teste 3 falhando (Vermelho): gatilho determinístico exigindo `docs/arquitetura.md` staged quando schemas/migrações de banco forem alterados.
  - [x] 1.4. Escrever Teste 4 falhando (Vermelho): interceptação determinística nos hooks de agente bloqueando leitura direta de arquivos `.env*`.
  - [x] 1.5. Escrever Teste 5 falhando (Vermelho): validação da existência do kit de docs (`docs/arquitetura.md`, `README.md.jinja`, `.env.example`, `.gitignore` e `## Comandos do Projeto` em `AGENTS.md`).
  - [x] 1.6. Escrever Teste 6 falhando (Vermelho): sincronia de versões nos cabeçalhos `governanca:inicio`, integridade das tags de release e validação dos links históricos em `docs/historico/`.
- [x] **2. Implementação das Regras Modulares, Wrappers e Matriz Universal:**
  - [x] 2.1. Adicionar a pergunta `perfis_projeto` no `copier.yml` e configurar os templates condicionais em `template/.agents/rules/`.
  - [x] 2.2. Criar os módulos em `template/.agents/rules/`: `web-ui-pwa.md.jinja`, `backend-seguranca-dados.md.jinja`, `jogos-engines.md.jinja` e `linear-mcp.md.jinja`.
  - [x] 2.3. Criar os wrappers finos (< 15 linhas) em `template/.claude/rules/`, `template/.cursor/rules/` e `template/.github/instructions/`.
  - [x] 2.4. Atualizar `template/AGENTS.md` com a Matriz Universal de Leitura Pré-Edição e a seção `## Comandos do Projeto`.
  - [x] 2.5. Atualizar `template/openspec/config.yaml.jinja` para renderizar regras de design conforme o perfil selecionado.
- [x] **3. Implementação dos Sensores de Governança e Blindagem de Segredos:**
  - [x] 3.1. Implementar o sensor `.env.example` e a checagem anti-segredo em `template/scripts/verificar-governanca.mjs`.
  - [x] 3.2. Implementar a exigência determinística de `docs/arquitetura.md` para alterações de banco em `template/scripts/verificar-governanca.mjs`.
  - [x] 3.3. Implementar a blindagem contra leitura de `.env*` em `template/scripts/hook-agente.mjs` e `template/.claude/settings.json`.
  - [x] 3.4. Criar `template/docs/arquitetura.md`, `template/README.md.jinja`, `template/.env.example` e `template/.gitignore`, adicionando proteções no `copier.yml`.
- [x] **4. Gestão de Release, Tags SemVer e Faxina Histórica:**
  - [x] 4.1. Criar `CONTRIBUTING.md` documentando o ritual de release e tags SemVer.
  - [x] 4.2. Mover os 8 arquivos históricos de transição v1→v2 para `docs/historico/` via `git mv` e atualizar links em `00_INDICE_E_DECISOES.md`.
  - [x] 4.3. Reparar as tags históricas `v3.4.0` a `v3.7.0` e preparar a versão `v4.0.0-alpha.1`.
- [x] **5. Execução dos Testes e Comprovação (Ciclo Verde):**
  - [x] 5.1. Executar `node --test tests/regras-modulares-e-docs-mercado.test.mjs` garantindo aprovação total.
  - [x] 5.2. Executar suíte completa `npm test` garantindo 100% de sucesso em todos os testes.
  - [x] 5.3. Executar `npx @fission-ai/openspec validate --all --no-interactive` e `node template/scripts/verificar-governanca.mjs`.

## Roteiro de Validação Prática

### O que validar no Gate 2:
1. **Renderização Condicional de Módulos:**
   - Gerar um projeto temporário com `perfis_projeto=["cli-biblioteca"]` e comprovar ausência de regras de UI.
   - Gerar um projeto temporário com `perfis_projeto=["web-ui"]` e comprovar presença de `web-ui-pwa.md` e wrappers.
2. **Sensor de Variáveis de Ambiente:**
   - Adicionar uma referência a `process.env.TESTE_VAR` sem declarar em `.env.example` e verificar se o commit é rejeitado determinísticamente.
3. **Trava de Arquitetura em Mudança de Schema:**
   - Modificar um arquivo de schema de banco sem `docs/arquitetura.md` staged e verificar o bloqueio.
4. **Blindagem de Segredos:**
   - Tentar comando de leitura sobre `.env` e verificar resposta de bloqueio (`deny`) pelo hook do agente.
