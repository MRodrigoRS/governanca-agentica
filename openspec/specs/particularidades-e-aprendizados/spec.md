# particularidades-e-aprendizados Specification

## Purpose
Padronizar a persistência de memórias de projeto, isolando restrições de infraestrutura e cicatrizes empíricas em documentos canônicos protegidos contra sobrescrita durante atualizações do Copier.

## Requirements

### Requirement: Documentos de Primeira Classe para Memória de Projeto
O template oficial da governança MUST disponibilizar os arquivos canônicos `template/docs/particularidades.md` e `template/docs/aprendizados.md` estruturados para registro de restrições de ambiente e cicatrizes empíricas.

#### Scenario: Estrutura de particularidades operacionais
- **GIVEN** o repositório distribuído pelo Copier
- **WHEN** o desenvolvedor ou agente inspeciona `template/docs/particularidades.md`
- **THEN** o arquivo MUST conter as seções temáticas de Infraestrutura/Hospedagem, Banco de Dados/Persistência, Provedores Externos/Webhooks e Regras de Domínio Não-Óbvias.

#### Scenario: Estrutura de cicatrizes empíricas de desenvolvimento
- **GIVEN** o repositório distribuído pelo Copier
- **WHEN** o desenvolvedor ou agente inspeciona `template/docs/aprendizados.md`
- **THEN** o arquivo MUST conter o modelo padronizado de armadilhas contendo data/código, o que aconteceu, causa raiz, armadilha mental e regra inegociável decorrente.

### Requirement: Proteção Determinística no Copier (_skip_if_exists)
O arquivo de configuração `copier.yml` MUST incluir os caminhos `"docs/particularidades.md"` e `"docs/aprendizados.md"` na lista `_skip_if_exists` para blindar projetos contra sobrescrita durante atualizações de template.

#### Scenario: Atualização de template via Copier update
- **GIVEN** um projeto consumidor com `docs/particularidades.md` e `docs/aprendizados.md` já preenchidos
- **WHEN** o comando `uvx copier update` for executado no projeto
- **THEN** o Copier MUST ignorar esses arquivos, preservando integralmente o conteúdo gerado pela equipe.

### Requirement: Higiene de Contexto no AGENTS.md
O arquivo `template/AGENTS.md` MUST incluir ponteiros explícitos na Seção 6 indicando a leitura sob demanda de `docs/particularidades.md` e `docs/aprendizados.md`.

#### Scenario: Agente consulta recursos disponíveis
- **GIVEN** um agente iniciando operação em repositório governado
- **WHEN** o agente lê a Seção 6 de `AGENTS.md`
- **THEN** o arquivo MUST orientar a leitura de `particularidades.md` antes de alterações de infraestrutura e de `aprendizados.md` durante o Gate 1.
