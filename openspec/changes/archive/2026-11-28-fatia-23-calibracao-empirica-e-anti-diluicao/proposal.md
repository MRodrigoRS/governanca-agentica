# Proposta: Fatia 23 — Calibração Empírica e Anti-Diluição (v4.9.0)

## Por que
- O uso contínuo da Governança `v4.8.0` em desenvolvimento e produção reais no projeto consumidor Orvix (fatias 01 a 05c) revelou falsos positivos objetivos nos sensores determinísticos de Markdown (`docs/catalogo-reuso.md` escrito em formato de lista e tokens curtos como `v4.8.0` ou `req.body` na tabela `docs/arquitetura.md §5`), além de rigidez excessiva de redação literal em `auditar-openspec.mjs`.
- As novas diretrizes da `v4.6.0`–`v4.8.0` (Prova de Runtime, contratos ponta-a-ponta, observabilidade mínima e selos de 3 faixas) geraram boilerplate desnecessário em monólitos fullstack/MVP e duplicaram texto normativo entre `template/AGENTS.md` e `template/constitution.md`, agravando a diluição de contexto por turno.
- No Windows, `uvx copier update` emitia dezenas de avisos `CRLF will be replaced by LF` por ausência de `.gitattributes` normalizado no template e na matriz.

## O que muda
- **`sensores-indices.mjs` e `sensores-maturidade.mjs`:** Introduz `extrairPonteirosMarkdown` com suporte opcional a listas em `docs/catalogo-reuso.md` e filtro estrito `ehPonteiroDeDisco` na seção `docs/arquitetura.md §5`, eliminando falsos positivos com SemVer, expressões `obj.prop` e basenames descritivos sem `/`.
- **Calibração Fullstack / MVP (`constitution.md`, `ciclo-especificacao/SKILL.md`, `web-ui-pwa.md.jinja`, `backend-seguranca-dados.md.jinja`):** Reconhece suíte E2E real no navegador contra app + banco reais como Prova de Runtime `web-ui` suficiente, libera consumo de rotas internas com fonte única de tipos em monólitos fullstack tipados (mantendo validação runtime para terceiros, entradas públicas e mutações críticas) e torna `requestId` distribuído + `/ready` recomendados inicialmente e obrigatórios em escala/deploy.
- **Anti-Diluição e Ergonomia (`template/AGENTS.md`, `auditar-openspec.mjs`, `.gitattributes`, `v4.9.0`):** Enxuga o bloco gerenciado de `template/AGENTS.md` para `<= 130` linhas focadas na Faixa 1 (`P0`) + índices/comandos `/` essenciais, amplia sinônimos PT-BR/EN em `auditar-openspec.mjs`, adiciona `.gitattributes` (LF/CRLF) na matriz e em `template/.gitattributes` fora de `_skip_if_exists`, e publica `v4.9.0` (`D51`).

## Fica de Fora
- Transformar a validação de cabeçalhos OpenSpec em avisos não-bloqueantes (permanece o bloqueio estrutural D18/D32 com vocabulário ampliado).
- Proteger `.gitattributes` em `_skip_if_exists` (deve ser entregue/mesclado automaticamente via `copier update`).
- Itens estacionados em `openspec/radar-oportunidades.md` (`git worktree` paralelo e evals comportamentais com LLM).
