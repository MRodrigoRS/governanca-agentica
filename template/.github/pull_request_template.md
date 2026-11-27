## 1. O que foi entregue
<!-- Descreva sucintamente a funcionalidade entregue e o valor funcional gerado para o usuário final -->

## 2. Parecer Factual de Conformidade
<!-- Registre o Duelo de Conformidade: cruze o parecer do Subagente Inspetor Forense (inspeção cega do diff) contra os requisitos e contratos físicos da fatia -->
- [ ] Relatório cego do Inspetor Forense anexado
- [ ] Duelo de Conformidade realizado contra o roadmap e delta

## 3. Roteiro de Teste Prático
<!-- Forneça o passo a passo objetivo com dados prontos de teste e o comportamento visual esperado -->
1. **Onde acessar:** 
2. **Passo a passo com dados:** 
3. **Comportamento visual/funcional esperado:** 

## 4. Evidências de Testes e Prova de Runtime
<!-- Cole os logs reais comprovando o ciclo Test-First (Vermelho -> Verde) e a Prova de Runtime Pré-Gate 2 (ou limitação ambiental declarada) -->
```text
# Saída do teste falhando (Vermelho):

# Saída do teste passando (Verde):

# Prova de Runtime (comando/rota exercitada + saída observada ou restrição declarada):
```

## 5. Checklist de Integridade
- [ ] `CHANGELOG.md` atualizado na seção correspondente (Keep a Changelog)
- [ ] `npx @fission-ai/openspec validate --all --no-interactive` executado e sem erros
- [ ] `node scripts/verificar-governanca.mjs` executado e aprovado com sucesso
