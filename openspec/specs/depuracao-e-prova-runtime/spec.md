# depuracao-e-prova-runtime Specification

## Purpose

TBD - created by archiving change fatia-20-depuracao-sistematica-e-prova-de-runtime. Update Purpose after archive.

## Requirements

### Requirement: Skill Universal de Depuração Sistemática (`/debug`) com Gatilho Duplo
O template distribuído SHALL fornecer a skill `template/.agents/skills/depuracao-sistematica/SKILL.md` (acionável por `/debug`), impondo congelamento estrito de código durante a investigação, protocolo científico em 4 fases (Reprodução Determinística, Coleta de Evidência Real, Hipótese Única & Prova de Causa Raiz, Roteamento Proporcional) e gatilho duplo integrado ao Circuit Breaker do Artigo 9.

#### Scenario: Agente atinge 2 falhas consecutivas tentando resolver o mesmo erro
- **GIVEN** um agente executando uma fatia ou `/fix` sob a Governança v4.6.0
- **WHEN** o mesmo teste, comando ou erro de runtime falha pela 2ª vez consecutiva
- **THEN** o protocolo SHALL proibir nova edição especulativa antes da 3ª tentativa
- **AND** SHALL exigir a ativação de `depuracao-sistematica` (`/debug`) para provar a causa raiz com evidência real antes da 3ª tentativa ou parada no Circuit Breaker.

#### Scenario: Usuário aciona `/debug` manualmente para erro complexo
- **GIVEN** um bug reportado sem causa raiz evidente
- **WHEN** o usuário invoca `/debug`
- **THEN** o agente SHALL congelar alterações em código de produção até concluir a Prova de Causa Raiz
- **AND** SHALL rotear a correção pela via proporcional (`Via 1a`, `Via 1.5` ou `Via 2`) sugerindo `/aprendizado` quando a armadilha for recorrente.

### Requirement: Prova de Runtime Pré-Gate 2 Adaptada por Perfil e Honestidade Radical
A Constituição (`template/constitution.md`), `template/AGENTS.md`, `ciclo-especificacao/SKILL.md`, `revisar-fatia/SKILL.md` e `template/.github/pull_request_template.md` SHALL exigir a **Prova de Runtime Pré-Gate 2** antes da entrega ao humano, adaptada aos perfis (`web-ui`, `api-backend`, `cli-biblioteca`, `desktop`/`mobile`/`jogo`), com declaração obrigatória de limitação caso o ambiente impeça execução real.

#### Scenario: Entrega de interface web ou API no Gate 2
- **GIVEN** uma fatia ou correção que altera rotas, componentes ou endpoints em projeto `web-ui` ou `api-backend`
- **WHEN** o agente prepara a apresentação do Gate 2 após aprovação dos testes automatizados
- **THEN** o relatório de entrega (`entrega-fatia-XX.md` / PR template) SHALL incluir evidência observada em runtime (servidor/app iniciado, rota ou endpoint exercitado, zero erro não tratado de console/rede/5xx)
- **AND** caso o ambiente bloqueie a execução do runtime, SHALL declarar explicitamente a limitação técnica e os comandos alternativos verificados.

#### Scenario: Entrega em projeto CLI/biblioteca
- **GIVEN** um projeto de perfil `cli-biblioteca` (como o próprio repositório matriz)
- **WHEN** o agente prepara o Gate 2
- **THEN** a Prova de Runtime SHALL comprovar a execução real dos comandos CLI/entry points afetados com código de saída e saída observada.

### Requirement: Sincronia Documental, Integridade Referencial e SemVer `v4.6.0`
A entrega da Fatia 20 SHALL registrar `depuracao-sistematica` (`/debug`) em `template/AGENTS.md`, `AGENTS.md` (raiz) e `template/README.md.jinja`, validar sua presença no job Copier de `.github/workflows/ci.yml`, atualizar a versão para `4.6.0` nos cabeçalhos e manifestos da matriz e manter 100% de retrocompatibilidade nos projetos consumidores sem alterar exigências bloqueantes sobre deltas legados.

#### Scenario: Validação completa de integridade referencial e Copier E2E na v4.6.0
- **GIVEN** o template atualizado para `v4.6.0` com a skill `depuracao-sistematica`
- **WHEN** `npm test` e `uvx copier copy --defaults` são executados
- **THEN** `tests/template-docs.test.mjs`, `tests/copier-e2e-e-consistencia.test.mjs` e `tests/depuracao-e-prova-runtime.test.mjs` SHALL aprovar integralmente sem referências quebradas.
