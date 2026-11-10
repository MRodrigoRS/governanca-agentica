# regras-modulares-e-docs Specification

## Purpose
Especificar e auditar o sistema de regras modulares por perfil com disparo contextual (glob/model_decision), o kit de documentação viva de mercado, os sensores determinísticos de ambiente (.env.example) e os bloqueios anti-leitura de segredos.

## Requirements

### Requirement: Renderização Condicional de Regras Modulares por Perfil
O sistema MUST solicitar os perfis técnicos do projeto durante o questionário do Copier e renderizar exclusivamente os módulos e regras compatíveis com a stack selecionada, sem sobrecarregar projetos simples com regras irrelevantes.

#### Scenario: Projeto de CLI ou Biblioteca sem Regras de Frontend
GIVEN um projeto inicializado com a pergunta Copier `perfis_projeto` contendo apenas `["cli-biblioteca"]`
WHEN o gerador processar os templates
THEN o arquivo `.agents/rules/web-ui-pwa.md` não deve ser criado no projeto
AND o arquivo `openspec/config.yaml` gerado não deve exigir requisitos de Toasts, Modais ou PWA no design.

#### Scenario: Projeto Web Interativo com Regras de UI e Backend
GIVEN um projeto inicializado com `perfis_projeto` contendo `["web-ui", "api-backend"]`
WHEN o gerador processar os templates
THEN os módulos `.agents/rules/web-ui-pwa.md` e `.agents/rules/backend-seguranca-dados.md` devem ser renderizados com frontmatter `trigger: glob`
AND wrappers finos correspondentes (< 15 linhas) devem ser criados em `.claude/rules/`, `.cursor/rules/` e `.github/instructions/`.

---

### Requirement: Documentação de Arquitetura Viva e Gatilho Determinístico de Atualização
O repositório MUST fornecer um documento vivo de arquitetura contendo diagramas C4, modelo físico de entidades e Glossário de Domínio, com trava algorítmica para impedir o esquecimento de atualização do documento quando esquemas de dados forem alterados.

#### Scenario: Bloqueio de Alteração de Banco sem Atualização da Arquitetura
GIVEN um repositório com delta ativo e alterações staged em arquivos de banco (`schema.prisma` ou migrações) fora do Marco 1 de fundação
WHEN o verificador de governança `verificar-governanca.mjs` for executado
AND o arquivo `docs/arquitetura.md` não estiver presente na lista de arquivos staged
THEN a execução deve abortar com código de saída 1
AND exibir mensagem orientando a atualização do `erDiagram` e do Glossário de Domínio.

#### Scenario: Aprovação de Alteração de Banco com Arquitetura Atualizada
GIVEN um repositório com delta ativo e alterações staged em migrações ou esquemas de banco
WHEN o arquivo `docs/arquitetura.md` também estiver staged com as atualizações correspondentes
THEN a validação de arquitetura deve passar com sucesso.

---

### Requirement: Sensor de Paridade de Variáveis de Ambiente e Bloqueio de Leitura de .env
O verificador MUST auditar variáveis de ambiente utilizadas no código de produção staged garantindo sua presença em `.env.example`, rejeitar segredos reais no arquivo de exemplo e os hooks de agente MUST bloquear a leitura de arquivos de segredos locais.

#### Scenario: Bloqueio de Variável de Ambiente Omitida no .env.example
GIVEN um arquivo de produção staged referenciando `process.env.SERVICO_API_KEY`
WHEN o verificador de governança inspecionar o commit
AND a variável `SERVICO_API_KEY` não estiver declarada em `.env.example` nem `.env.template`
THEN a execução deve abortar com código de saída 1 detalhando a variável ausente.

#### Scenario: Bloqueio de Segredo Real no Arquivo .env.example
GIVEN uma edição staged no arquivo `.env.example`
WHEN o conteúdo atribuir um valor com prefixo de segredo real (`sk_live_`, `ghp_`, `AKIA`) ou chave longa contínua sem formatação de placeholder
THEN o verificador deve rejeitar o commit com código de saída 1.

#### Scenario: Interceptação Determinística de Leitura de .env por Agentes
GIVEN um agente de IA tentando ler `.env` ou `.env.local` via ferramenta de leitura ou comando de terminal (`cat`, `type`, `Get-Content`)
WHEN o hook de agente interceptar a chamada
THEN a ação deve ser negada imediatamente com mensagem orientando consultar `.env.example`.

---

### Requirement: Sincronização de SemVer, Tags de Release e Histórico do Repositório
O versionamento do protocolo MUST manter sincronia estrita entre o `package.json` e todos os cabeçalhos de bloco de governança, documentar o ritual de tags e arquivar documentos históricos da transição v1→v2.

#### Scenario: Auditoria de Cabeçalhos de Versão
GIVEN a versão declarada no `package.json`
WHEN a suíte de testes auditar os arquivos de template e instruções
THEN os cabeçalhos `governanca:inicio` em `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `copilot-instructions.md` e `project.md.jinja` devem exibir exatamente a versão correspondente.

#### Scenario: Preservação de Links no Arquivamento Histórico
GIVEN a migração dos 8 documentos da transição v1→v2 para a pasta `docs/historico/`
WHEN os links em `00_INDICE_E_DECISOES.md` forem avaliados
THEN todos os caminhos devem apontar para os novos destinos em `docs/historico/` com zero links quebrados.
