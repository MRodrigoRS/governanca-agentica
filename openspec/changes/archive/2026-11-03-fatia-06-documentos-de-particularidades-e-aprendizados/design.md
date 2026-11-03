# Design Técnico — Fatia 06: Documentos de Particularidades e Aprendizados Protegidos no Copier

## Arquitetura e Decisões Técnicas

### 1. Separação de Responsabilidades e Prevenção de Context Rot
- `AGENTS.md` deve permanecer enxuto, funcionando apenas como índice de referência e regras fundamentais.
- O histórico de erros e aprendizados não deve sobrecarregar o prompt de sistema em toda interação. Ao invés disso, é consumido sob demanda (just-in-time) durante o Gate 1 ou ao diagnosticar falhas.
- As particularidades de infraestrutura (portas, planos, variáveis de ambiente) só precisam ser lidas quando o agente for modificar configurações, Docker, scripts de inicialização ou conexões externas.

### 2. Blindagem de Três Vias no Copier
- O Copier realiza merge de 3 vias por padrão. No entanto, para arquivos de documentação viva que pertencem 100% ao time do projeto gerado, qualquer tentativa de merge geraria conflitos espúrios.
- A diretiva `_skip_if_exists` no `copier.yml` garante que, uma vez gerados na inicialização do projeto (Gate 0), o Copier ignorará solenemente esses arquivos durante os comandos `uvx copier update`, preservando integralmente o conhecimento registrado pela equipe.

### 3. Estrutura Canônica das Seções
- **`template/docs/particularidades.md`**:
  - `## 1. Infraestrutura, Hospedagem e Planos`
  - `## 2. Banco de Dados e Persistência`
  - `## 3. Provedores Externos e Webhooks`
  - `## 4. Regras de Domínio Não-Óbvias`
- **`template/docs/aprendizados.md`**:
  - Instruções de uso e modelo com 5 campos: título com data/código, o que aconteceu, causa raiz, a armadilha mental, regra inegociável decorrente.

### 4. Estratégia de Testes Unitários
- Um novo arquivo de teste `tests/template-docs.test.mjs` será criado usando o test runner nativo do Node.js (`node:test` e `node:assert/strict`).
- Validará deterministicamente:
  1. Que `template/docs/particularidades.md` existe e contém as 4 seções temáticas.
  2. Que `template/docs/aprendizados.md` existe e possui o modelo de preenchimento.
  3. Que `copier.yml` contém ambos em `_skip_if_exists`.
  4. Que `template/AGENTS.md` contém os links para os documentos.
