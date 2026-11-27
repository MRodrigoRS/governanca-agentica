# Proposta: Fatia 20 — Depuração Sistemática (`/debug`) e Prova de Runtime Pré-Gate 2 (v4.6.0)

## Por que
Mesmo com o motor determinístico blindado na Fatia 19 (`v4.5.0`), duas lacunas práticas no ciclo cotidiano de engenharia com agentes continuam gerando retrabalho e frustração:
1. **Depuração por "chute-e-tenta" antes do Circuit Breaker:** O protocolo atual possui `/fix` (que assume diagnóstico pronto) e o Circuit Breaker de 3 tentativas (Artigo 9, que manda parar após 3 falhas). Falta o protocolo intermediário de investigação científica: quando um erro não óbvio aparece, agentes tendem a queimar tentativas editando código às cegas em vez de isolar a causa raiz com evidência real.
2. **Aprovação sem verificação de runtime real antes do Gate 2:** Testes unitários verdes não garantem que a aplicação realmente sobe ou funciona no ambiente de execução (ex.: erro de hidratação, rota 404, migração falhando em banco limpo, CORS, overflow ou comando CLI quebrado). Sem uma etapa explícita de **Prova de Runtime Pré-Gate 2** adaptada por perfil (e com cláusula de Honestidade Radical caso o ambiente impeça execução), o humano acaba descobrindo erros básicos na hora de executar o Roteiro Prático.

## O que muda
1. **Nova Skill Universal `template/.agents/skills/depuracao-sistematica/SKILL.md` (`/debug`):**
   - Protocolo científico em 4 fases com **congelamento estrito de código** durante a investigação: (1) Reprodução Determinística, (2) Coleta de Evidência Real, (3) Hipótese Única & Prova de Causa Raiz e (4) Roteamento Proporcional (`Via 1a /fix`, `Via 1.5` ou `Via 2`).
   - **Gatilho duplo:** manual sob demanda via `/debug` e automático obrigatório na **2ª falha consecutiva** antes de consumir a 3ª tentativa do Circuit Breaker (Artigo 9).
   - Integração com `.agents/handoff.md` para investigações longas e sugestão de registro de cicatriz em `docs/aprendizados.md` (`/aprendizado`).
2. **Prova de Runtime Pré-Gate 2 por Perfil (Artigos 2.7 e 8.6):**
   - Matriz explícita por perfil (`web-ui`, `api-backend`, `cli-biblioteca`, `desktop`/`mobile`/`jogo`) exigindo comprovação real de execução antes de chamar o humano no Gate 2.
   - Cláusula de **Honestidade Radical** quando o ambiente (sandbox offline, falta de display/emulator) impedir a subida completa, exigindo declaração explícita do motivo e do que foi verificado — proibido fingir execução.
3. **Sincronia de Skills, PR Template, Índices e SemVer `v4.6.0`:**
   - Atualização de `template/constitution.md`, `template/AGENTS.md`, `AGENTS.md` (raiz), `template/README.md.jinja`, `ciclo-especificacao/SKILL.md`, `revisar-fatia/SKILL.md`, `template/.github/pull_request_template.md`, `.github/workflows/ci.yml` (Copier check), `package.json`, `00_INDICE_E_DECISOES.md` (`D48`), `README.md` e `CHANGELOG.md`.
   - Nova suíte Test-First `tests/depuracao-e-prova-runtime.test.mjs` preservando 100% de retrocompatibilidade em `verificar-governanca.mjs`.

## Fica de Fora
- Alterações em `template/scripts/lib/auditar-openspec.mjs` que bloqueiem `tasks.md` ou deltas legados de versões anteriores.
- Reestruturação da `constitution.md` em 3 faixas anti-diluição e sensores determinísticos `[AVISO MATURIDADE]` (capacidade `C3`).
- Hardening de migrações em produção, observabilidade mínima, bloqueio de CVEs `critical` no CI e contratos tipados ponta-a-ponta (capacidade `C4`).
