# Diário Empírico de Aprendizados e Cicatrizes — Repositório Matriz

> **Papel:** Registro factual de armadilhas reais descobertas durante a construção e auto-aplicação (*dogfooding*) da Governança Agêntica, impedindo reincidência.

---

## Modelo Padronizado de Registro

```markdown
### [AAAA-MM-DD / GOV-XXX] Título Conciso e Descritivo da Armadilha
- **O que aconteceu:** Sintoma observado em teste, hook ou CI.
- **Causa raiz:** Razão técnica confirmada na investigação.
- **A armadilha mental:** Premissa incorreta que levou ao erro.
- **Regra inegociável decorrente:** Travamento ou prática adotada.
```

---

## Histórico de Cicatrizes e Armadilhas Superadas

### [2026-11-19 / GOV-003] Ponteiros legados em skills sobrevivem até haver verificação referencial no CI
- **O que aconteceu:** Mesmo após a migração v3 → v4 (`openspec/roadmap/` → `openspec/roadmap.md`), uma skill em `template/.agents/skills/explorar-produto/SKILL.md` mantinha referência para `openspec/roadmap/`, detectada apenas ao criar o teste de integridade referencial bidirecional em `tests/template-docs.test.mjs`.
- **Causa raiz:** Alterações de layout e renomeação de arquivos de documentação não possuíam asserção automática cruzando citações dentro de `SKILL.md` e `README.md.jinja` contra arquivos reais no disco.
- **A armadilha mental:** Confiar em busca manual ocasional ao consolidar versões grandes em vez de travar referências cruzadas em teste permanente.
- **Regra inegociável decorrente:** Integridade referencial bidirecional validada automaticamente no `npm test` para o template e para a matriz (`AGENTS.md` + `docs/arquitetura.md §5`).

### [2026-11-19 / GOV-002] Isenção cega de `template/` e bloqueio de `### Adicionado` sem delta expuseram brechas do dogfooding
- **O que aconteceu:** (1) Ao preparar commit de novas skills sem delta ativo em `openspec/changes/`, `validar-commit-msg.mjs` recusou adições sob `### Adicionado` no `CHANGELOG.md`; (2) `classificar-arquivos.mjs` isentava qualquer caminho `template/**`, deixando `template/scripts/*.mjs` fora da auditoria de código de produção e permitindo que qualquer pasta `template/` em projetos consumidores escapasse da fiscalização.
- **Causa raiz:** Regras de classificação trataram a pasta `template/` inteira como documentação estática, enquanto o commit-msg aplica corretamente a trava de delta OpenSpec para novas adições registradas no changelog.
- **A armadilha mental:** Assumir que um diretório chamado `template/` nunca contém lógica executável de produção e que a matriz estaria imune ao fluxo formal OpenSpec.
- **Regra inegociável decorrente:** `ehArquivoDeDocumentacaoOuGovernanca()` isenta em `template/` apenas arquivos não-código (`.md`, `.jinja`, `.yml`, `.json`, etc.), submetendo `template/scripts/*.mjs` à auditoria completa, e novas capacidades na matriz passam sempre por fatia/delta formal em `openspec/`.

### [2026-11-01 / GOV-001] Testes com `.only(` esquecidos geravam falsa segurança de CI verde
- **O que aconteceu:** Foco exclusivo acidental em um caso de teste fazia a suíte reportar verde ignorando regressões silenciosas.
- **Causa raiz:** Test runners executam apenas os blocos marcados quando `.only(` permanece no arquivo.
- **A armadilha mental:** Olhar apenas para o código de saída verde sem checar o contador total ou proibir marcadores de foco.
- **Regra inegociável decorrente:** `verificar-governanca.mjs` e `hook-agente.mjs` bloqueiam `.only(` em arquivos de teste.
