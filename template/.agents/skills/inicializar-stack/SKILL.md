---
name: inicializar-stack
description: Conduz a entrevista de escopo, recomenda stacks robustas do catálogo oficial e instala a stack pelo CLI oficial após aprovação no Gate 0.
---

# Skill: Inicializar Stack Tecnológica (Gate 0)

Esta skill orienta o agente na configuração inicial de um repositório novo (greenfield), aplicando a Cláusula Anti-Brinquedo e garantindo que o projeto nasça com base robusta de produção.

---

## Passo 1 — Entrevista de Escopo

Antes de propor qualquer código ou tecnologia, faça ao desenvolvedor as 4 perguntas essenciais:
1. **Problema e Usuário:** Qual problema o software resolve e quem são os usuários finais?
2. **Canal Principal:** Qual o canal prioritário? (**Programa de Computador Desktop**, SaaS Web Fullstack, Painel Interno/Dashboard, API REST/GraphQL, Mobile iOS/Android, **Utilitário de Terminal/CLI** ou Site de Conteúdo/Landing).
3. **Restrições Fixas:** Existem preferências ou exigências mandatórias (funcionamento offline, instalador nativo `.exe`/`.msi`, banco de dados local SQLite ou em nuvem, autenticação, pagamentos)?
4. **Escala e Maturidade:** O objetivo é um MVP para validação ou uma base corporativa de longo prazo?

---

## Passo 2 — Recomendação de Stack

Consulte o catálogo em [references/catalogo-stacks.md](references/catalogo-stacks.md).
Apresente uma recomendação estruturada contendo:
- **Opção Recomendada:** A stack oficial que melhor equilibra os requisitos levantados.
- **Opção Alternativa:** Uma segunda opção viável destacando os trade-offs.
- **Justificativa Anti-Brinquedo:** Demonstre como a stack atende aos requisitos do Artigo 1 da Constituição (tipagem estrita, validação de schema na fronteira com Zod/Pydantic, design system e testes automatizados).

---

## Passo 3 — Gate 0 (Aprovação Humana Obrigatória)

> **PARADA OBRIGATÓRIA:** É expressamente proibido rodar qualquer comando de instalação sem a confirmação explícita do desenvolvedor humano.
> Apresente a proposta e pergunte: *"Você aprova a inicialização do projeto com esta stack?"*

---

## Passo 4 — Execução do Scaffolding Oficial

Após a aprovação no Gate 0:
1. Verifique a documentação oficial recente da ferramenta para garantir o comando correto.
2. Execute o CLI oficial da stack selecionada.
3. Se o CLI criar uma subpasta, mova os arquivos necessários para a raiz do repositório, garantindo que os arquivos da governança (`AGENTS.md`, `constitution.md`, `openspec/`, `scripts/`, `docs/adr/`, `lefthook.yml`) sejam preservados intactos.

---

## Passo 5 — Prova de Saúde da Base e Ativação dos Hooks

Imediatamente após a instalação:
1. Instale as dependências com o gerenciador de pacotes da stack.
2. Ative os Git hooks determinísticos da governança executando `npx lefthook install`.
3. Execute a suíte de testes padrão da stack para comprovar que a base nasceu 100% verde.
4. Execute o comando de compilação/build para assegurar que não há falhas estruturais.

---

## Passo 6 — Registro e Próximos Passos

1. Atualize a seção 2 do arquivo `openspec/project.md` com a stack e ferramentas instaladas.
2. Informe o humano que a stack está pronta e prepare a abertura da primeira funcionalidade via OpenSpec (Nível 2).
