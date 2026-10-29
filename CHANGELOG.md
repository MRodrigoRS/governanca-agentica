# Changelog — Governança v2

Todas as alterações notáveis neste protocolo de governança são documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [2.4.0] - 2026-10-29

### Adicionado
- **Nova Skill `refinar-ideia` (D25):** Intervenção ativa quando surgem ideias no meio do desenvolvimento. Realiza raio-X de complexidade oculta, poda construtiva ("entra vs. sai"), análise de afinidade no roadmap e decisão de encaixe.
- **Subfatias Decimais Hierárquicas (ex.: `fatia-02.1`):** Suporte nativo para desdobramentos de fatias pendentes, aproveitando o contexto de código fresco sem reordenar as fatias posteriores.
- **Auditoria de Fatias Decimais:** `verificar-governanca.mjs` atualizado para validar a correspondência e as 7 seções completas de fatias decimais.

---

## [2.3.0] - 2026-10-29

### Adicionado
- **Artigo 12 na Constituição — Cláusula Pétrea "Proibido Deduzir de Cabeça" (D23):** É expressamente proibido presumir ou deduzir de memória o escopo de fatias. Leitura física em `openspec/roadmap/fatia-XX-*.md` mandatória nos 4 marcos: (1) resumir ao humano, (2) abrir delta, (3) plano no Gate 1 e (4) antes de escrever qualquer linha de teste ou código.
- **Agente Revisor Independente Pré-Gate 2 (D24):** Nova skill `.agents/skills/revisar-fatia/SKILL.md` instituindo auditoria independente e imparcial em 5 pilares (fidelidade ao roadmap, testes substanciais, conformidade constitucional, escopo fechado e roteiro prático) antes de solicitar aprovação de commit ao humano.
- **Prevenção Ativa de Context Rot:** Orientação formal no Gate 2 para renovação de sessão (`/compact` ou nova conversa limpa) antes de puxar a próxima fatia do roadmap.
- **Auditoria Determinística de Vínculo de Roadmap:** `verificar-governanca.mjs` atualizado para checar se todo delta `fatia-XX-*` possui correspondência física no diretório `openspec/roadmap/`.

---

## [2.2.0] - 2026-10-28

### Adicionado
- **Roteiro Mandatório de Teste Prático e Apresentação no Gate 2 (D22):** Inclusão formal nos Artigos 2 e 8 da Constituição, em `AGENTS.md` e em `ciclo-especificacao`. É proibido ao agente encerrar o Gate 2 apenas despejando logs de terminal. A apresentação da entrega passa a exigir obrigatoriamente: (1) o que foi entregue, (2) rota ou tela de acesso, (3) passo a passo de teste com dados de exemplo prontos para copiar e colar, (4) comportamento visual esperado na interface e (5) teste de borda prático simulando erro.
- **Roteiro de Validação Humana no Roadmap:** Subseção 7.2 adicionada a `_template-fatia.md`, estruturando previamente o roteiro que o agente deve apresentar ao final de cada fatia.

---

## [2.1.0] - 2026-10-28

### Adicionado
- **Artigo 11 na Constituição:** Rotina de commits cadenciada por autorização humana em dois marcos exclusivos — Marco 1 (Fundação e Sedimentação Inicial, Gate 0) e Marco 2 (Fechamento de Fatia ou Fix, Gate 2).
- **Artigo 6 (Item 6):** Padrão inato de responsividade móvel (mobile-first 320px+) e portabilidade como PWA instalável (`manifest.json`, viewport, cores de tema, ícones adaptativos e service worker) para todo desenvolvimento web.
- **Campos de PWA e Responsividade em Fatias:** Seções 4 e 7 do `_template-fatia.md` atualizadas com requisitos e checklist de aceitação determinístico para web responsiva e PWA.
- **Decisões D20 e D21:** Registradas formalmente no índice de decisões e no README.

### Modificado
- `verificar-governanca.mjs` atualizado para reconhecer determinísticamente o Marco 1 (Commit de Fundação) e Marco 2 (Fatia recém-arquivada no OpenSpec), eliminando falsos positivos na auditoria de commits.
- Instruções de `AGENTS.md`, `ciclo-especificacao` e `inicializar-stack` atualizadas com a rotina de autorização humana antes de qualquer commit.

---

## [2.0.0] - 2026-10-27

### Adicionado
- Lançamento inicial da Governança v2 como protocolo agêntico aberto via Copier.
- 10 artigos pétreos na Constituição e integração com OpenSpec (`openspec/specs/`, `openspec/changes/`, `openspec/roadmap/`).
- Hooks determinísticos com Lefthook, Gitleaks, `verificar-governanca.mjs` e `validar-commit-msg.mjs`.
- Modo estratégico `explorar-produto` e Radar de Oportunidades.
- Catálogo oficial de stacks robustas, infraestrutura VPS e MCPs assistidos.
