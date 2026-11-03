# Diário Empírico de Aprendizados e Cicatrizes de Produção

> **Papel:** Registro histórico e factual de incidentes, bugs bizarros, premissas furadas e armadilhas técnicas superadas neste repositório.
> **Orientação para Agentes:** Consulte este documento no **Gate 1** de cada fatia ou antes de refatorar código sensível. O objetivo deste arquivo é impedir que a equipe e os agentes repitam o mesmo erro duas vezes.
> **Proteção Copier:** Este arquivo está listado em `_skip_if_exists` no `copier.yml` e é preservado integralmente em atualizações (`uvx copier update`).
> **Formato de Registro:** Toda nova armadilha superada deve ser documentada adicionando uma nova entrada no topo da lista abaixo, seguindo o modelo canônico.

---

## Modelo Padronizado de Registro

Para registrar um novo aprendizado ou cicatriz, copie o bloco abaixo e preencha todas as 5 seções factuais:

```markdown
### [AAAA-MM-DD / COD-XXX] Título Conciso e Descritivo da Armadilha
- **O que aconteceu:** Descrição factual do sintoma ou falha observada (comportamento inesperado, queda de serviço, falso positivo).
- **Causa raiz:** Razão técnica real identificada após investigação forense minuciosa.
- **A armadilha mental:** Premissa incorreta, suposição precipitada ou atalho mental que causou o problema.
- **Regra inegociável decorrente:** Diretriz direta, acionável e determinística adotada para garantir que o erro nunca mais aconteça.
```

---

## Histórico de Cicatrizes e Armadilhas Superadas

### [2026-11-01 / GOV-001] Testes com .only esquecidos geravam falsa segurança de CI verde
- **O que aconteceu:** Desenvolvedor ou agente utilizou `.only(` para focar em um único caso de teste durante o desenvolvimento local. O restante da suíte foi ignorado silenciosamente e o commit subiu verde, mascarando regressões em outros módulos.
- **Causa raiz:** Executores de teste padrão (Jest, Vitest, Mocha, Node Test Runner) interpretam `.only` como instrução deliberada de foco exclusivo e reportam sucesso se o único teste selecionado passar.
- **A armadilha mental:** Achar que olhar o "verde" no terminal é suficiente sem conferir o contador total de testes executados da suíte.
- **Regra inegociável decorrente:** Criação de sensor determinístico no `verificar-governanca.mjs` e no hook de pre-tool que bloqueia commits e edições contendo `.only(` em arquivos de teste.
