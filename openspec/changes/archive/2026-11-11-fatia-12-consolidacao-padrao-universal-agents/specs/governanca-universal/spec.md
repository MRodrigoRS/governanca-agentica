## ADDED Requirements

### Requirement: Padrao Universal Puro de Agentes sem Wrappers Proprietarios
O template distribuído pelo Copier DEVE utilizar exclusivamente o padrão universal agnóstico (`AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/hooks.json` e `.mcp.json.jinja`), sem diretórios ou wrappers proprietários redundantes (`.claude/`, `.cursor/`, `.vscode/`, `CLAUDE.md`, `GEMINI.md`, `.github/prompts/`, `.github/instructions/`, `.github/agents/`, `.github/copilot-instructions.md`).

#### Scenario: Verificacao de arvore universal limpa no template
- **GIVEN** o diretório `template/` do repositório da governança
- **WHEN** a estrutura de arquivos de configuração de agentes é inspecionada
- **THEN** existem `template/AGENTS.md`, `template/.agents/rules/`, `template/.agents/skills/`, `template/.agents/hooks.json` e `template/.mcp.json.jinja`
- **AND** não existem `template/CLAUDE.md`, `template/GEMINI.md`, `template/.claude`, `template/.cursor`, `template/.vscode`, `template/.github/prompts`, `template/.github/instructions`, `template/.github/agents` nem `template/.github/copilot-instructions.md`

### Requirement: Sincronia Estrita de Versao e Fechamento das Pendencias v4.0.0
Todos os arquivos governados do template DEVEM refletir a versão exata de `package.json` (`4.0.0`), com cobertura poliglota no `pre-commit` do `template/lefthook.yml`, contrato `@axe-core/playwright` em `catalogo-stacks.md`, auditoria de banco real em `revisar-fatia/SKILL.md` e validação de migrações/auditoria poliglota em `template/.github/workflows/ci.yml`.

#### Scenario: Auditoria deterministica de versao e completude da Fatia 11/12
- **GIVEN** a versão `4.0.0` declarada em `package.json`
- **WHEN** a suíte de testes automatizados é executada
- **THEN** todos os cabeçalhos `governanca:inicio` e `template/openspec/project.md.jinja` contêm `v4.0.0`
- **AND** `template/lefthook.yml` executa testes rápidos poliglotas no `pre-commit`
- **AND** `revisar-fatia/SKILL.md` audita persistência real contra mocks de banco e a válvula `governanca:mock-banco-justificado`
