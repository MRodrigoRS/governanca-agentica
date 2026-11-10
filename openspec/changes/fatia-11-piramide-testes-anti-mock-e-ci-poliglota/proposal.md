# Proposta de Mudança: fatia-11-piramide-testes-anti-mock-e-ci-poliglota

## 1. Contexto e Motivação
A Governança de Agentes v4 já consolidou a desburocratização SDD (Fatia 08), regras modulares por glob (Fatia 09), comandos de atalho e handoff (Fatia 09a), apresentação limpa por artefatos (Fatia 09b) e governança de reúso, tokens de movimento e sensor anti-monólito (Fatia 10).

Para fechar o ciclo da release estável **`v4.0.0`**, é imperativo blindar a qualidade de execução real:
1. **Falsos positivos por mock/spy do banco próprio:** Agentes frequentemente usam `vi.mock('@/lib/prisma')`, `vi.spyOn(prisma...)` ou `@patch('app.db.session')` para forjar testes verdes rápidos sem validar integridade de dados, transações ou schemas reais. Mocks devem ser restritos a APIs externas (gateways, e-mail, LLMs).
2. **Furo local de testes antes do commit:** O Marco 2 (commit humano) precisa ter garantia de testes rápidos unitários já no `pre-commit` do Lefthook, enquanto o `pre-push` roda a suíte poliglota completa.
3. **CI Poliglota com Lockfile Estrito:** O CI precisa validar a presença obrigatória de lockfile versionado (sem fallback perigoso `npm ci || npm install`), validar a mensagem de commit (`validar-commit-msg.mjs`), dar suporte nativo para Godot 4 GUT headless, .NET Avalonia `dotnet test`, Python uv/pytest, Rust cargo, e dogfooding dos artefatos v4.
4. **Desburocratização de Subagentes:** Formalizar na governança que a inspeção cega por subagente é uma ferramenta opcional sob demanda (acionável via comando `/revisar`), retirando-a da obrigatoriedade do Gate 2 para eliminar consumo desnecessário de tokens e espera do usuário, mantendo a garantia Zero-Trust nos testes determinísticos e no checklist prático.
5. **Graduação para v4.0.0 Estável:** Finalizar o versionamento de `4.0.0-alpha.1` para `4.0.0` estável em todos os componentes, documentação e templates.

## 2. Escopo da Mudança
- **O que ENTRA:**
  1. Sensor anti-mocking e anti-spy de banco/ORM próprio em `verificar-governanca.mjs` (com suporte a TS/JS, Python ancorado sem afetar `requests.Session` ou `stripe`, e válvula auditável `governanca:mock-banco-justificado:`).
  2. Ajustes no `template/lefthook.yml` e na raiz: `pre-commit` rápido + `pre-push` completo poliglota (com fallback seguro caso `godot` não esteja no `PATH`).
  3. CI Poliglota íntegro em `template/.github/workflows/ci.yml` e `.github/workflows/ci.yml` com lockfile obrigatório, validação de commit-msg, cobertura Node, Python, Rust, .NET, Godot 4 e dogfooding Copier.
  4. Contrato de Smoke Test Web Real + `@axe-core/playwright` e ausência de overflow em `web-ui-pwa.md`.
  5. Desburocratização de subagentes: formalização da inspeção como recurso sob demanda (`/revisar`), sem bloqueio compulsório no Gate 2.
  6. Fechamento da release estável `v4.0.0` no `package.json`, cabeçalhos `governanca:inicio` e `CHANGELOG.md`.

- **O que FICA DE FORA:**
  - Testes lentos de mutação (Stryker/Mutmut) no pre-commit/CI padrão.
  - Cobertura 100% E2E de telas secundárias.
