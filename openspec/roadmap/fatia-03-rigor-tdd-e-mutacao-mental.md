# Fatia 03: Rigor TDD e Prova de Mutação Mental (Absorção Cirúrgica da Issue RR-5)

> **Status:** `[x] Concluída`
> **Origem Linear:** Issue [`RR-5`](https://linear.app/rr-diario-agents/issue/RR-5/skill-ub-mode-impoe-tdd-refatoracao-e-analise-rigorosa-de-qualidade) no projeto `P-RR-2` (`GOV-AGENTS-V2`)
> **Data de Conclusão:** 2026-10-30

---

## 1. Objetivo e Valor Entregue ao Usuário

Elimina o ponto cego da complacência em testes automatizados ("teatro de testes") absorvendo as melhores heurísticas da issue `RR-5` sem incorrer em overengineering, sem scripts caseiros (`Crapper`/`Dryer`/`Mutator`), sem pastas de relatórios pesados (`matrix/`) e com zero custo adicional de tokens de IA.

A entrega garante:
1. **Disciplina Faça Funcionar → Faça Direito:** O TDD avança explicitamente em duas etapas antes do Gate 2: primeiro fazer passar da forma mais simples, depois refatorar aplicando *early returns* para podar aninhamentos e eliminar duplicações.
2. **Prova de Mutação Mental no Inspetor Forense:** O auditor cego avalia a robustez das asserções, perguntando quais testes falhariam se operadores lógicos fossem invertidos no código de produção.
3. **Bloqueio Determinístico Local (< 2ms):** Trava automática no `verificar-governanca.mjs` rejeitando arquivos de teste com foco exclusivo esquecido (`.only(`) ou testes ocos sem asserções reais.

---

## 2. Grafo de Dependências Incrementais

- **Depende de:** Fatia 02 (`fatia-02-linear-mcp-e-inbox.md`), aproveitando o ecossistema MCP conectado ao Linear para fechar a issue e postar o Diário de Bordo.
- **Desbloqueia:** Próximas expansões de testes de integração e automações avançadas da governança.

---

## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)

- Nenhuma alteração em tabelas de banco ou schemas de dados externos.
- Integração da verificação `verificarIntegridadeDeTestesEmStaged(listaArquivos)` em Node.js nativo (ESM) inspecionando marcadores declarativos de asserção: `expect(`, `assert`, `should`, `throws`, `rejects`, `resolves`, `pytest.raises`, `t.Error`, `t.Fatal`, `t.Run`.

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- Sem componentes de UI web nesta fatia.
- Mensagens de erro determinísticas no terminal padronizadas em Português do Brasil (PT-BR) com prefixos `[GOVERNANÇA] VIOLAÇÃO DETERMINÍSTICA:` e sugestões objetivas de resolução.

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

- **Zero Overengineering:** Proibição formal do uso de mutadores físicos pesados e arquivos massivos de relatório no fluxo padrão.
- **Zero Regressão de Commits:** Preservação estrita do Artigo 11 (commits continuam autorizados exclusivamente pelo humano nos Marcos 1 e 2).

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

- **Vermelho (Comprovado):** 2 testes falhando em `tests/verificar-governanca.test.mjs` ao detectar `.only` esquecido e teste oco sem asserções.
- **Verde (Comprovado):** Implementação de `verificarIntegridadeDeTestesEmStaged` em `template/scripts/verificar-governanca.mjs`, elevando a suíte para **25/25 testes passando**.
- **Refatorar:** Código limpo com manipulação nativa de strings e verificação em memória sem dependências externas.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

- **Critério 1:** `npm test` executa 25 testes com 100% de sucesso.
- **Critério 2:** Teste com `.only` bloqueia o pre-commit local com código 1 e mensagem explicativa.
- **Critério 3:** Teste oco (sem `expect` ou `assert`) bloqueia o pre-commit local com código 1.
- **Critério 4:** A issue `RR-5` é atualizada e encerrada no Linear com o resumo de Diário de Bordo.
