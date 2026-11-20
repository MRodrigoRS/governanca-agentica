---
name: auditoria-seguranca
description: Executa auditoria completa ou sob medida de segurança de aplicações (AppSec) e linguagem humana na UI, orquestrando 3 subagentes read-only em paralelo por frente (ou 1 focado) e encaminhando correções proporcionalmente via /fix, Via 1.5 ou subfatia.
---

# Skill: Auditoria de Segurança de Aplicações (`auditoria-seguranca`)

Esta skill conduz auditorias **completas** (projetos maduros, legados/Brownfield ou pré-deploy) ou **sob medida** (módulo ou rota específica) acionáveis via `/auditar-seguranca`, somando os 27+ controles de AppSec e a regra de **Linguagem Humana na UI** ao fluxo oficial da Governança v4.

> **CONGELAMENTO DURANTE A VARREDURA:** Nunca edite código de produção durante a auditoria. Primeiro produza o parecer estruturado com evidências e depois roteie as correções pela via de cerimônia proporcional.

---

## 1. Modos de Orquestração (Prevenção de Context Rot)

### Modo A — Auditoria Completa de Repositório ou Projeto Legado (3 Subagentes Paralelos)
Quando o alvo for o projeto inteiro ou mais de 5 arquivos, o Agente Principal atua como **Orquestrador** e dispara **3 subagentes `research` (somente leitura) em paralelo**, cada um retornando exclusivamente achados concretos com `arquivo:linha` e evidência do trecho:

1. **Subagente 1 — Frente Backend, Autorização e Fluxos Sensíveis:**
   - Autenticação sólida (OAuth2, JWT, sessões sem bypass) (#01) e proteção de banco/RLS (#03).
   - Hash de senhas com `Argon2id`/`bcrypt` + salt (#05) e validação estrita na borda com schemas declarativos Zod/Pydantic/Serde (#06).
   - **RBAC no servidor** em rotas administrativas (#09) e consultas parametrizadas contra SQL/NoSQL Injection (#10).
   - **IDOR / BOLA:** verificar se todas as leituras e mutações filtram pelo `usuarioId`/`tenantId` da sessão autenticada no servidor (nunca confiar apenas no `id` vindo da URL/body) (#26).
   - **Anti-Mass Assignment:** verificar se `req.body` ou `payload` é repassado cru para `.create()`/`.update()` do ORM sem *allowlist*.
   - **CSRF** em mutações via cookie (#16), expiração curta/uso único de tokens de recuperação de senha (15–60 min) (#17) e **Upload Seguro** (MIME real via *magic bytes*, tamanho máximo, fora da raiz executável) (#18).
   - **Pagamentos e Webhooks:** confirmar que preços/descontos são sempre recalculados no servidor e webhooks validam assinatura criptográfica (HMAC) + chave de idempotência (#19).
   - **Anti-SSRF:** confirmar bloqueio de IPs privados/loopback/metadata (`127.0.0.1`, `169.254.169.254`) em `fetch` para URLs externas.

2. **Subagente 2 — Frente Frontend, Sessão, Tráfego e Linguagem Humana:**
   - Ocultação de chaves no frontend e proibição estrita de credenciais privadas em prefixos públicos (`NEXT_PUBLIC_`, `VITE_`, `EXPO_PUBLIC_`, `REACT_APP_`, `PUBLIC_`) (#02, #11).
   - HTTPS obrigatório / HSTS (#04), **Rate Limiting** em login/recuperação/endpoints caros (#12), **CORS** restritivo (#13) e cabeçalhos HTTP (`CSP`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) (#14).
   - **Defesa contra XSS** (`dangerouslySetInnerHTML`, `v-html`, `innerHTML` sem sanitização) (#07) e **Cookies de Sessão** com flags `HttpOnly`, `Secure` e `SameSite` (#15).
   - Desativação de `DEBUG` e stack traces em produção (#20).
   - **Zero Jargão Técnico na UI (Artigo 6.8):** verificar se textos visíveis ao usuário final (toasts, erros, estados vazios, modais, badges) expõem `payload`, `null`, `undefined`, `timeout`, `endpoint`, termos de banco (`registro`, `tabela`, `constraint`, `foreign key`), enums crus em `SNAKE_CASE` (`AGUARDANDO_PAGAMENTO`) ou `{error.message}` técnico cru.

3. **Subagente 3 — Frente Infraestrutura, Segredos, Git e Dependências:**
   - Logs e monitoramento de eventos suspeitos sem vazar tokens/senhas/PII (#08).
   - Revisão de `.env*` vs `.gitignore` e consistência com `.env.example` (#11).
   - Auditoria de CVEs em dependências (`npm audit` / `pip-audit` / `cargo audit`) (#21) e identificação de pacotes órfãos/não utilizados (#22).
   - Verificação de exposição pública (`.git`, `.bak`, `.sql`, logs) (#23), varredura de credenciais no histórico Git (#24) e indicação imediata de rotação/revogação para qualquer segredo comprometido (#25).

### Modo B — Auditoria Sob Medida / Escopo Focado (≤ 5 arquivos ou 1 módulo/rota)
Quando o humano pedir auditoria de um fluxo pontual (ex.: *"audite só o checkout"* ou um único módulo ≤ 5 arquivos), execute **1 único subagente *read-only*** aplicando os checklists aplicáveis acima com profundidade máxima naquele recorte.

---

## 2. Emissão do Relatório de Auditoria (`auditoria-seguranca.md`)

Consolide os achados dos subagentes (#27) sem alterar código de produção ainda:
- **Em harnesses com artefatos nativos (ex.: Antigravity):** emita o relatório completo no artefato `auditoria-seguranca.md` e limite a resposta no chat a ≤ 20 linhas com o link do artefato e a proposta de roteamento.
- **Em harnesses CLI:** apresente resumo conciso com os achados críticos e o roteamento sugerido.

Estrutura do Relatório:
1. **Resumo Executivo:** Nível de risco (`Crítico` / `Alto` / `Médio` / `Baixo`), controles verificados (`27+/27+`) e contagem de vulnerabilidades por severidade.
2. **Vulnerabilidades Encontradas:** `[Controle #XX - Nome] | Severidade | Arquivo:Linha | Risco | Mitigação Recomendada`.
3. **Controles Conformes (Já Seguros).**
4. **Ações Manuais de Infraestrutura e Chaves:** rotação/revogação de segredos, limpeza de histórico Git, regras no provedor/DNS.
5. **Plano de Correção Proporcional (Via 1a / Via 1.5 / Via 2).**

---

## 3. Roteamento Proporcional das Correções (Sem Burocracia Desnecessária)

Após aprovação humana do diagnóstico, encaminhe cada correção pela via mínima exigida pelos hooks determinísticos:

| Cenário da Correção | Via Aplicada | Burocracia / Requisitos |
| :--- | :--- | :--- |
| Correção pontual em **até 3 arquivos de produção** por commit (sem pacote inédito e sem alterar schema/migração de banco) | **Via 1a (`/fix`)** | **Zero OpenSpec.** Teste reproduzindo a falha (Vermelho) → Correção (Verde) → `CHANGELOG.md` (`### Corrigido`). |
| Bump de versão de pacote **já existente** para corrigir CVE ou refatoração estrutural em > 3 arquivos sem mudar contrato/banco | **Via 1.5 (`chore` / `refactor`)** | **Zero OpenSpec.** Sem pacotes inéditos, sem migração de banco e sem `### Adicionado` no `CHANGELOG.md`. |
| Correção estrutural com **> 3 arquivos no mesmo `fix`/`feat`**, **pacote inédito** (ex.: `argon2`, `helmet`, `dompurify`) ou **alteração de schema/migração** | **Via 2 (Subfatia)** | Subfatia `fatia-XXa-blindagem-seguranca` em `openspec/roadmap.md` + delta no OpenSpec (`Gate 1` → Test-First → `Gate 2`). |
