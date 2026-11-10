# Tarefas: fatia-11-piramide-testes-anti-mock-e-ci-poliglota

## 1. Test-First (Ciclo Vermelho)
- [x] 1.1 Criar suíte de testes `tests/piramide-testes-e-ci-poliglota.test.mjs` cobrindo sensor anti-mocking, lefthook pre-commit/pre-push, CI poliglota, e formalização de subagentes sob demanda.
- [x] 1.2 Executar a suíte e comprovar falha esperada (vermelho) antes de qualquer alteração de código.

## 2. Sensor Determinístico Anti-Mocking
- [x] 2.1 Implementar sensor de mock/spy de banco próprio em `template/scripts/verificar-governanca.mjs` com regex para TS/JS e Python ancorado.
- [x] 2.2 Suportar válvula `governanca:mock-banco-justificado:` com motivo >= 15 caracteres.
- [x] 2.3 Garantir que `requests.Session`, `aiohttp` e clientes de terceiros como `stripe` não gerem falsos positivos.

## 3. Lefthook e Proteção Local
- [x] 3.1 Atualizar `template/lefthook.yml` para executar testes rápidos no `pre-commit` e suíte completa no `pre-push`.
- [x] 3.2 Implementar verificação segura para projetos Godot com aviso caso binário não esteja no `PATH`.
- [x] 3.3 Atualizar `lefthook.yml` na raiz do projeto mantendo paridade.

## 4. CI Poliglota e Lockfile Estrito
- [x] 4.1 Atualizar `template/.github/workflows/ci.yml` eliminando `npm ci || npm install` e exigindo lockfile explícito.
- [x] 4.2 Adicionar validação de mensagem de commit (`validar-commit-msg.mjs`) no pipeline de CI.
- [x] 4.3 Adicionar suporte a Godot 4 GUT headless, .NET `dotnet test`, Python uv e Rust no template de CI.
- [x] 4.4 Atualizar `.github/workflows/ci.yml` da raiz para testar todos os artefatos gerados pelo Copier na v4.

## 5. Documentação, Regras e Desburocratização de Subagentes
- [x] 5.1 Atualizar `template/constitution.md` (Artigo 2 e 4) formalizando Testing Trophy e anti-mocking de banco próprio.
- [x] 5.2 Atualizar `template/AGENTS.md` e skills formalizando que auditoria por subagente é ferramenta opcional sob demanda via `/revisar`.
- [x] 5.3 Atualizar `.agents/rules/web-ui-pwa.md` e `backend-seguranca-dados.md` com os contratos de Smoke Test Playwright e persistência real.
- [x] 5.4 Graduar a versão do projeto para `4.0.0` estável em `package.json`, cabeçalhos de template e `CHANGELOG.md`.

## 6. Validação e Fechamento
- [x] 6.1 Executar a suíte completa com `npm test` e verificar 100% de aprovação.
- [x] 6.2 Validar conformidade determinística com `node template/scripts/verificar-governanca.mjs`.
- [x] 6.3 Validar integridade das especificações com `npx @fission-ai/openspec validate --all --no-interactive`.

## Notas de Sessão
- Decisão de alinhamento com o usuário: eliminação formal da obrigatoriedade de subagentes no Gate 2 para otimizar tempo e tokens, mantendo a inspeção cega como ferramenta sob demanda via comando `/revisar`.
- Bloqueios enfrentados: nenhum; todos os sensores determinísticos funcionaram conforme desenhado.
- Próximo passo: submeter a entrega da Fatia 11 no Gate 2 ao usuário, comitar a implementação e arquivar o delta no OpenSpec, completando o ciclo da Governança v4.0.0 estável.
