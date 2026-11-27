# Design Técnico: Fatia 20 — Depuração Sistemática (`/debug`) e Prova de Runtime Pré-Gate 2 (`v4.6.0`)

## Contratos, Dados e Schemas

Esta fatia evolui o protocolo normativo, skills e suíte de testes sem introduzir dependências externas nem breaking changes no motor `template/scripts/verificar-governanca.mjs`:

1. **Nova Skill `template/.agents/skills/depuracao-sistematica/SKILL.md` (`<= 140` linhas):**
   - **Frontmatter YAML:** `name: depuracao-sistematica`, `description` objetiva citando `/debug`, investigação científica de causa raiz e integração na 2ª falha do Circuit Breaker.
   - **Regra de Congelamento:** Proibido editar código de produção durante as Fases 1 a 3 (permite-se apenas inspeção, leitura de logs, execução de testes/comandos diagnósticos e testes mínimos temporários de reprodução).
   - **Gatilho Duplo:**
     - *Manual:* `/debug` a qualquer momento pelo humano.
     - *Automático (Pré-Circuit Breaker):* após **2 falhas consecutivas** no mesmo teste/erro, antes de gastar a 3ª tentativa do Artigo 9.
   - **Protocolo em 4 Fases:**
     1. *Fase 1 — Reprodução Determinística:* comando exato, entrada mínima, código de saída/erro literal observado e escopo isolado.
     2. *Fase 2 — Coleta de Evidência Real:* leitura de logs, stack trace, estado de persistência/rede/env (respeitando proibição de ler `.env*` direto — checar apenas chaves via `.env.example` / presença de variável), comparando o que o runtime fez vs. o esperado.
     3. *Fase 3 — Hipótese Única & Prova de Causa Raiz:* enunciar exatamente 1 hipótese falsificável (`arquivo:linha`), testar o menor experimento que a confirma ou refuta e registrar prova factual da causa raiz (se o erro continuar na 3ª tentativa pós-diagnóstico, aciona o Circuit Breaker do Artigo 9 com o dossiê completo).
     4. *Fase 4 — Roteamento Proporcional e Memória:* encaminhar a correção pela via mínima (`Via 1a /fix`, `Via 1.5` ou `Via 2`), persistir estado em `.agents/handoff.md` se houver troca de sessão e propor `/aprendizado` em `docs/aprendizados.md` para armadilhas recorrentes.

2. **Matriz da Prova de Runtime Pré-Gate 2 (Artigos 2.7 e 8.6):**
   - `web-ui`: subir servidor/build ou preview real, exercitar a rota alterada (ex.: Playwright/browser ou smoke real), validar zero `pageerror`/console crítico, zero falha HTTP inesperada e renderização dos estados assíncronos antes de chamar o humano.
   - `api-backend`: exercitar endpoint(s)/worker(s) alterado(s) contra persistência real (ou suíte de integração real), validando status HTTP, payload de resposta e ausência de exceções não tratadas nos logs.
   - `cli-biblioteca`: executar os binários/scripts/CLIs alterados em terminal real (ex.: `node scripts/...`, `uvx copier copy`, flags principais) conferindo código de saída e stdout/stderr.
   - `desktop` / `mobile` / `jogo`: executar o binário/harness headless ou build/preview aplicável ao runtime da stack (ex.: `godot --headless`, build Tauri/.NET, emulador).
   - **Cláusula de Honestidade Radical:** se o sandbox/ambiente bloquear execução real (ex.: ausência de GUI/emulador, rede bloqueada ou binário externo ausente), o agente DEVE declarar explicitamente a restrição e apresentar o comando exato rodado localmente + o que falta ao humano validar, sendo terminantemente proibido simular ou afirmar que testou o que não rodou.

3. **Arquivos Atualizados em Sincronia (`v4.6.0`):**
   - `template/constitution.md`: cabeçalho `v4.6.0`, Artigo 2.7 (Prova de Runtime Pré-Gate 2), Artigo 8.6 (evidência de runtime no Gate 2), Artigo 9 (acoplamento explícito de `/debug` após a 2ª falha seguida).
   - `template/AGENTS.md` e `AGENTS.md` (raiz): inclusão de `/debug` (`depuracao-sistematica`) no Cartão/Seção 4/Seção 6/Tabela de Comandos, menção à Prova de Runtime no Marco 2 e atualização de cabeçalho para `v4.6.0`.
   - `template/.agents/skills/ciclo-especificacao/SKILL.md`: Passo 5 (Circuit Breaker → `/debug` na 2ª falha) e Passo 6 (Prova de Runtime obrigatória antes do Gate 2).
   - `template/.agents/skills/revisar-fatia/SKILL.md`: item explícito de verificação da Prova de Runtime (e honestidade caso declarada limitação) no relatório cego/duelo.
   - `template/.github/pull_request_template.md`: item de evidência de Prova de Runtime na Seção 4/5.
   - `template/README.md.jinja`, `template/openspec/project.md.jinja`, `template/.agents/skills/inicializar-stack/references/catalogo-stacks.md`, `.github/workflows/ci.yml` (verificação de `depuracao-sistematica/SKILL.md` no job Copier), `package.json`, `README.md`, `00_INDICE_E_DECISOES.md` (`D48`), `CHANGELOG.md`.
   - `tests/blindagem-motor-e-agregador.test.mjs` (aceitar SemVer `4.5.0+` no teste de contrato da Fatia 19 para não quebrar bumps futuros) e `tests/depuracao-e-prova-runtime.test.mjs` (nova suíte).

## Interface e Estados Assíncronos
Não se aplica: projeto CLI/biblioteca em Node.js ESM e templates Markdown/Jinja2 sem interface gráfica de usuário.

## Regras de Negócio e Segurança
- **Proibição de Edição às Cegas:** Nenhuma correção de produção pode ser escrita dentro de `/debug` antes da prova factual da causa raiz.
- **Zero Vazamento em Coleta de Evidências:** Logs e diagnósticos de `/debug` jamais podem incluir valores reais de `.env*` ou tokens/PII (Artigo 4).
- **Zero Teatro de Runtime:** É estritamente proibido afirmar execução de runtime sem saída real observada; restrições ambientais exigem declaração explícita (Artigo 8.1).
- **Retrocompatibilidade Copier:** Nenhuma regra bloqueante é adicionada em `auditar-openspec.mjs` sobre `tasks.md` ou deltas legados em projetos consumidores.
