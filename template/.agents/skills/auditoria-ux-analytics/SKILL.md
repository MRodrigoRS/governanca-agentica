---
name: auditoria-ux-analytics
description: Configura sob demanda ferramentas gratuitas de heatmap e behavioral analytics (PostHog ou Microsoft Clarity) com proteção LGPD/CSP e conduz auditoria de UX cruzando dados reais de interação com o código-fonte.
---

# Skill: Auditoria de UX e Behavioral Analytics (Sob Demanda)

Esta skill orienta a integração opcional e leve de **heatmaps, gravações de sessão e auditoria de UX/CRO** em projetos Web/SaaS, sem adicionar peso, scripts ou servidores MCP por padrão quando o projeto não precisa.

---

## 1. Quando Acionar (e Quando Evitar)

- **Acione apenas quando:** o projeto possui interface Web/SaaS e o humano solicita medir uso real, investigar gargalos de conversão/usabilidade ou integrar PostHog/Microsoft Clarity (`/auditar-ux`).
- **Não adicione por padrão:** nunca injete scripts de analytics ou entradas no `.mcp.json` durante o scaffolding inicial (`Gate 0`) sem pedido explícito do humano.
- **Evite "predictive heatmaps" por visão computacional:** não simule mapas de calor via screenshots + LLM em pré-deploy (alto custo de tokens e baixa precisão). Prefira revisão heurística direta (contraste, CTA visível, estados vazios/erro) combinada com a regra `web-ui-pwa.md`.

---

## 2. Escolha da Ferramenta Gratuita

| Ferramenta | Melhor uso | Automação por Agente | Custo |
| :--- | :--- | :--- | :--- |
| **PostHog** *(Recomendado para agentes)* | Funis, eventos, feature flags, heatmaps e session replay | **Alta:** API REST madura e MCP Server configurável sob demanda | Free tier generoso (open-source / cloud) |
| **Microsoft Clarity** *(Recomendado para análise visual humana)* | Heatmaps de clique/rolagem e gravações de sessão com script leve | **Limitada:** foco em painel visual; cruzar via exportação/resumo | 100% gratuito, sem limite de tráfego |
| **Hotjar** | — | — | **Evitar por padrão** (free tier restrito frente aos dois acima) |

---

## 3. Checklist Obrigatório de Segurança, Privacidade e Performance

Antes de ativar qualquer script em `<head>` ou SDK no front-end:

1. **Mascaramento de PII (LGPD):** habilite `maskAllInputs` (e classes de ocultação em campos sensíveis, tokens, CPFs, e-mails e dados financeiros) antes de ligar gravações de sessão.
2. **Consentimento:** respeite o banner/preferência de cookies e só inicialize a captura após consentimento quando exigido pela política do produto.
3. **CSP (`Content-Security-Policy`):** libere estritamente os domínios da ferramenta escolhida; nunca afrouxe a política global com `unsafe-inline` ou wildcards amplos.
4. **Performance:** carregue de forma assíncrona (`async`/`defer` ou inicialização pós-hidratação) sem bloquear o First Contentful Paint.
5. **Orçamento de MCPs (Teto de 3 a 5):** só adicione o MCP do PostHog ao `.mcp.json` se o projeto permanecer dentro do teto de MCPs ativos. Caso contrário, consulte a API REST pontualmente via script/CLI com chave de leitura em `.env` (nunca commitada).

---

## 4. Fluxo de Auditoria de UX (Dados Reais × Código-Fonte)

1. **Coletar sinais de fricção:** consulte via MCP/API do PostHog ou peça ao humano os dados/exportações do Clarity focando em:
   - *Rage clicks* (cliques repetidos sem resposta);
   - *Dead clicks* (cliques em elementos não interativos que parecem clicáveis);
   - Queda acentuada (*drop-off*) em etapas de formulário ou checkout;
   - CTAs principais ignorados ou abaixo da dobra (*below the fold*).
2. **Mapear para o código-fonte:** localize os componentes exatos (`src/`, `app/`, `components/`) ligados às rotas/seletores com maior fricção.
3. **Propor melhorias via Gate 1:** liste ajustes objetivos (hierarquia visual, feedback de loading/erro, redução de campos, reutilização de primitivos de `docs/catalogo-reuso.md`) e aguarde aprovação humana (`/fix` ou nova fatia) antes de editar código.
