---
name: revisar-fatia
description: Atua como Agente Revisor Independente Pré-Gate 2, auditando código, testes e documentação diretamente contra o arquivo openspec/roadmap/fatia-XX-*.md e as cláusulas pétreas da Constituição antes da aprovação de commit pelo humano.
---

# Skill: Revisar Fatia (Agente Revisor Independente Pré-Gate 2)

Esta skill orienta o **Agente Revisor Independente** na auditoria imparcial e rigorosa de uma fatia recém-implementada, antes que ela seja submetida à aprovação do humano no Gate 2.

> **Princípio Fundamental:** Zero-Trust no Agente Executor. O revisor não assume que o código está certo porque o executor disse que está; ele audita diretamente os arquivos do repositório comparando-os com as especificações físicas.

---

## 1. Como Iniciar a Revisão

O Revisor Independente deve ser acionado assim que o executor concluir o ciclo de testes e implementação da fatia.
1. Identifique a fatia em auditoria (ex.: `fatia-02-autenticacao`).
2. Abra e leia integralmente o arquivo de especificação original:
   - `openspec/roadmap/fatia-XX-<slug>.md`
   - Delta em `openspec/changes/fatia-XX-<slug>/` (se ainda não arquivado) ou `openspec/changes/archive/fatia-XX-<slug>/`
3. Inspecione o `git diff` dos arquivos implementados em relação ao branch base (`main`).

---

## 2. Checklist de 5 Pontos de Auditoria

O Revisor deve inspecionar rigorosamente estes 5 pilares:

### Pilar 1: Fidelidade ao Roadmap Físico (Cláusula Pétrea — Artigo 12)
- [ ] O código implementado atende fielmente ao **Objetivo** e **Contratos de Dados** (Seção 3 da fatia)?
- [ ] Todas as tabelas, colunas e schemas Zod/Pydantic foram criados com nomes em **PT-BR** (Artigo 10)?
- [ ] Alguma regra de negócio detalhada na Seção 5 da fatia foi esquecida ou alterada arbitrariamente?
- [ ] As fronteiras de isolamento (Seção 2: o que NÃO fazer nesta fatia) foram respeitadas?

### Pilar 2: Qualidade Real dos Testes Automatizados (Artigo 2)
- [ ] Os testes automatizados cobrem cenários reais de negócio e casos de borda (Seção 6 da fatia)?
- [ ] Os testes são substanciais e não apenas "testes de fumaça" vazios ou asserções triviais (`expect(true).toBe(true)`)?
- [ ] O executor apresentou as evidências legítimas de falha prévia (**Vermelho**) e sucesso posterior (**Verde**)?

### Pilar 3: Conformidade com Cláusulas Constitucionais
- [ ] **Anti-Brinquedo (Artigo 1):** Tipagem estrita completa, sem uso de `any` ou type-casting inseguro.
- [ ] **Zero Segredos (Artigo 3):** Nenhuma chave de API, token ou credencial exposta no código.
- [ ] **Engenharia Frontend (Artigo 6):** 
  - Ausência de `location.reload` ou atualizações forçadas de página.
  - Implementação explícita dos 4 estados assíncronos (`loading`, `empty`, `error`, `success`).
  - **Responsividade e PWA Inatas (Artigo 6, item 6):** Layout mobile-first testado sem overflow horizontal (320px+) e manifesto web configurado se houver interface.
- [ ] **Engenharia Backend (Artigo 7):** Validação estrita na borda (Zero-Trust Anti-F12) e transações atômicas onde aplicável.

### Pilar 4: Fronteira Estrita de Escopo (Anti-Trabalho Invisível)
- [ ] O executor tocou apenas nos arquivos necessários para a entrega desta fatia?
- [ ] Não houve refatorações não-autorizadas em arquivos legados ou módulos fora do escopo?

### Pilar 5: Exatidão do Roteiro de Teste Prático do Usuário (Artigo 2 e 8)
- [ ] O roteiro de teste passo a passo para o humano está completo?
- [ ] A rota / comando de acesso está correta?
- [ ] Os dados de exemplo fornecidos para teste manual são válidos e fáceis de copiar e colar?
- [ ] O comportamento visual esperado descrito corresponde ao que o código realmente renderiza?

---

## 3. Emissão do Parecer Formal

Ao concluir a auditoria, o Revisor Independente emite um relatório padronizado:

### Cenário A: Aprovação Sem Ressalvas
```markdown
### 📋 Parecer do Agente Revisor Independente: APROVADO SEM RESSALVAS
- **Fatia Auditada:** `openspec/roadmap/fatia-XX-<slug>.md`
- **Fidelidade ao Roadmap:** 100% aderente aos contratos e regras especificadas.
- **Testes Automatizados:** Testes substanciais e comprovados (Vermelho → Verde).
- **Conformidade Constitucional:** Aprovada (tipagem estrita, PT-BR, responsividade PWA e 4 estados de UI).
- **Roteiro de Validação Prática:** Claro e pronto para execução pelo usuário humano.

-> Veredito: A fatia está pronta para apresentação no Gate 2 e solicitação de commit ao humano.
```

### Cenário B: Ajustes Necessários (Bloqueio do Gate 2)
```markdown
### ⚠️ Parecer do Agente Revisor Independente: AJUSTES NECESSÁRIOS
O Gate 2 está suspenso até que o Agente Executor corrija as seguintes pendências:
1. **[Divergência de Roadmap]:** A coluna `status_pedido` foi criada como string livre em vez do enum especificado na Seção 3.
2. **[Padrão Frontend]:** O componente `ListaFunis` não implementou o estado `empty` (mensagem quando não houver registros).
3. **[Teste Incompleto]:** Falta o teste automatizado do caso de borda para payload sem e-mail.

-> Ação exigida do Executor: Corrija os itens acima, revalide a suíte de testes e submeta novamente para revisão antes de chamar o humano.
```
