---
name: depuracao-sistematica
description: Conduz depuração científica de causa raiz (/debug) com congelamento de código, acionada manualmente ou automaticamente na 2ª falha seguida antes da 3ª tentativa do Circuit Breaker.
---

# Skill: Depuração Sistemática Orientada a Evidência (`depuracao-sistematica`)

Esta skill substitui edições especulativas ("chute-e-tenta") por investigação científica antes de alterar código de produção.

> **CONGELAMENTO ESTRITO DE CÓDIGO (REGRA DE OURO):**
> Durante as **Fases 1, 2 e 3**, é **terminantemente proibido** editar código de produção ou mascarar testes. Permitem-se apenas leitura de código/logs, execução de comandos diagnósticos e um teste mínimo isolado que reproduza a falha.
> **SIGILO DE AMBIENTE:** Nunca leia `.env` ou `.env.*` diretamente; valide nomes de variáveis exclusivamente contra `.env.example` e nunca registre tokens/PII nos logs.

---

## Gatilhos Oficiais (Gatilho Duplo)

1. **Manual (`/debug`):** Acionado pelo humano diante de erro complexo, regressão intermitente, falha de runtime, banco, rede ou comportamento inesperado.
2. **Automático Pré-Circuit Breaker (Artigo 9):** Acionado obrigatoriamente ao atingir a **2ª falha consecutiva** tentando corrigir o mesmo teste, build ou erro — **antes** de gastar a 3ª tentativa.

---

## Protocolo Científico em 4 Fases

### Fase 1 — Reprodução Determinística
1. Execute o comando mínimo que dispara o erro (ex.: arquivo único de teste, rota ou comando CLI).
2. Registre exatamente: comando executado, entrada/estado inicial, código de saída e mensagem/stack literal.
3. Se o erro não for reproduzível de forma consistente, isole variáveis externas (concorrência, ordem de testes, cache, dados residuais) antes de avançar.

### Fase 2 — Coleta de Evidência Real (Sem Deduções)
1. Inspecione os dados reais do runtime no ponto de falha: logs do servidor, stack trace completo, status HTTP, query/constraint do banco ou configuração esperada em `.env.example`.
2. Compare **o que o código realmente executou** com **o contrato esperado** (`openspec/specs/`, schema ou teste).
3. Consulte `docs/particularidades.md` e `docs/aprendizados.md` para descartar armadilhas já catalogadas no ambiente.

### Fase 3 — Hipótese Única & Prova de Causa Raiz
1. Formule **exatamente 1 hipótese falsificável** apontando `arquivo:linha` e o mecanismo exato da falha.
2. Execute o menor experimento ou teste de reprodução (**Vermelho**) que confirme ou refute essa hipótese.
   - Se refutada, retorne à Fase 2 com a nova evidência (nunca empilhe correções de tentativas anteriores).
3. Somente com a **Causa Raiz comprovada**, libere a edição cirúrgica da correção.
4. **Acoplamento ao Circuit Breaker (Artigo 9):** Se após o diagnóstico a 3ª tentativa consecutiva ainda falhar, **pare imediatamente**, registre o dossiê (hipótese testada, evidência e log da falha) em `tasks.md` (`## Notas de Sessão`) ou `.agents/handoff.md` e solicite orientação humana.

### Fase 4 — Roteamento Proporcional e Memória
1. Encaminhe a correção comprovada pela via mínima da governança:
   - **Via 1a (`/fix`):** correção em até 3 arquivos de produção + teste reproduzindo o bug (Vermelho → Verde) + `CHANGELOG.md` (`### Corrigido`).
   - **Via 1.5 (`refactor`/`chore`/`perf`):** se exigir ajuste estrutural em > 3 arquivos sem mudar contrato de negócio/banco/pacotes inéditos.
   - **Via 2 (Subfatia):** se exigir mudança de contrato, novo pacote ou schema/migração de banco (`openspec/roadmap.md` + OpenSpec).
2. Se a investigação precisar ser pausada ou trocada de sessão, grave o estado em `.agents/handoff.md`.
3. Se a causa raiz revelar uma armadilha técnica não-óbvia ou recorrente, proponha registrar a cicatriz em `docs/aprendizados.md` via `/aprendizado`.
