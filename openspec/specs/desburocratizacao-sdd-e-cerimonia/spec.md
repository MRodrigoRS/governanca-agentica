# desburocratizacao-sdd-e-cerimonia Specification

## Purpose
TBD - created by archiving change fatia-08-desburocratizacao-sdd-rolling-wave-e-cerimonia. Update Purpose after archive.

## Requirements

### Requirement: Fonte Única Rolling Wave e Invariantes Globais do Gate 0
O sistema de governança MUST utilizar `openspec/roadmap.md` como fonte única macro de fatias e status, contendo os Invariantes Globais do Gate 0 e blocos estruturados por fatia com âncoras obrigatórias.

#### Scenario: Projeto inicializado ou atualizado na governança v4
- **GIVEN** um projeto sob governança v4
- **WHEN** o arquivo `openspec/roadmap.md` é avaliado
- **THEN** o documento MUST conter a seção de Invariantes Globais do Gate 0 e cada fatia MUST conter as âncoras `Depende de`, `Objetivo`, `ENTRA` e `FICA DE FORA`.

### Requirement: Fiscalização Determinística de Cabeçalhos no OpenSpec
O script determinístico `verificar-governanca.mjs` MUST auditar os deltas ativos e arquivados no OpenSpec exigindo cabeçalhos canônicos em PT-BR ou EN nativo, linhas úteis mínimas e ausência de marcadores de preguiça.

#### Scenario: Submissão de delta no OpenSpec
- **GIVEN** uma mudança ativa em `openspec/changes/<nome>`
- **WHEN** o script de governança audita os artefatos `proposal.md`, `specs/`, `design.md` e `tasks.md`
- **THEN** a auditoria MUST verificar que `proposal.md` possui Why/O que muda/Fica de Fora, `design.md` possui Schemas/Interface/Regras, e `tasks.md` possui marcação Test-First e Roteiro de Validação Prática.

### Requirement: Via Nível 1.5 — Manutenção Estrutural no Estágio commit-msg
O validador de commits MUST permitir manutenções estruturais com mais de 3 arquivos de produção ou bumps de dependências já presentes em `HEAD:package.json` para os tipos convencionais `refactor`, `perf`, `style`, `chore` e `build`.

#### Scenario: Commit de refatoração abrangente
- **GIVEN** alterações em múltiplos arquivos de código sem novos schemas de banco nem pacotes inéditos
- **WHEN** a mensagem de commit inicia com `refactor:`, `perf:`, `style:`, `chore:` ou `build:`
- **THEN** o verificador MUST aprovar a Via 1.5 no estágio `commit-msg` e `--ci`, bloqueando caso sejam detectados schemas de banco, migrações, novas dependências ou adições no CHANGELOG.

### Requirement: Trava Obrigatória de Teste no /fix e Heurística Anti-Contrabando em style
O validador MUST exigir ao menos um arquivo de teste staged quando o commit for do tipo `fix(...)` e tocar arquivos de produção, e MUST inspecionar commits do tipo `style(...)` para impedir adição indevida de lógica ou handlers.

#### Scenario: Tentativa de commit de correção sem testes
- **GIVEN** arquivos de código de produção alterados sem nenhum arquivo de teste staged
- **WHEN** a mensagem de commit utiliza o tipo `fix(...)`
- **THEN** a validação MUST bloquear o commit com código de saída 1 e orientação clara em PT-BR.

### Requirement: Correção de Classificação de Arquivos e Isenção Restrita de Scripts
A governança MUST identificar corretamente arquivos de testes com prefixos de raiz (`tests/`, `test/`) e extensões Python (`test_*.py`, `*_test.py`), e MUST restringir a isenção de governança em `scripts/` apenas aos scripts oficiais mantidos pelo protocolo.

#### Scenario: Auditoria de arquivos de teste Python e scripts de produção
- **GIVEN** arquivos como `tests/test_mod.py` e `scripts/seed.ts`
- **WHEN** o algoritmo de classificação avalia os arquivos staged
- **THEN** `tests/test_mod.py` MUST ser classificado como teste e `scripts/seed.ts` MUST ser classificado como código de produção.
