# reuso-e-modularizacao Specification

## Purpose
Especificar os requisitos de governança de reúso contínuo, tokens visuais e de movimento, catálogo de ponteiros anti-apodrecimento e sensor anti-monólito com catraca.

## Requirements

### Requirement: Artigo 14 Reuse-Before-Create e Component-as-Asset
O sistema MUST instituir na Constituição o Artigo 14 como detalhamento do Artigo 1.2, proibindo a recriação inline de componentes, estilos, animações e entidades quando houver primitivo equivalente, e exigindo Tokens Base na Fatia 01.

#### Scenario: Definição de Primitivos e Tokens na Fundação
GIVEN um projeto com perfil visual ou interativo (web-ui, desktop, mobile ou jogo)
WHEN a Fatia 01 (Fundação) for especificada e implementada
THEN ela deve declarar os Tokens Base (cores, tipografia, durações e curvas canônicas de animação) e a árvore base de componentes ou prefabs antes de telas ou fases.

#### Scenario: Extração de Componentes e Prefabs
GIVEN o desenvolvimento de uma tela, cena ou fluxo de negócio
WHEN um elemento visual, animação ou entidade de jogo for introduzido pela primeira vez
THEN deve ser modelado como componente ou prefab atômico reutilizável
AND blocos específicos de domínio devem ser extraídos obrigatoriamente na segunda ocorrência.

### Requirement: Catálogo Vivo Enxuto com Sensor Anti-Apodrecimento
O sistema MUST fornecer um catálogo de ponteiros em `docs/catalogo-reuso.md` com 4 tabelas canônicas de 1 linha por item e validar determinísticamente a integridade de seus caminhos.

#### Scenario: Exclusão de Arquivo Catalogado sem Atualizar Catálogo
GIVEN um arquivo de código registrado em `docs/catalogo-reuso.md`
WHEN o arquivo for excluído ou renomeado no commit sem a devida atualização do catálogo
THEN o verificador determinístico de governança deve falhar com erro em PT-BR.

#### Scenario: Inclusão de Ponteiro Quebrado no Catálogo
GIVEN uma alteração staged em `docs/catalogo-reuso.md`
WHEN o catálogo contiver um caminho de arquivo entre crases que não existe no disco
THEN o verificador determinístico deve bloquear o commit apontando a linha inválida.

### Requirement: Sensor Anti-Monólito com Catraca Inteligente
O sistema MUST limitar arquivos de código de produção a 350 linhas úteis com suporte a GDScript (.gd), contagem de comentários sensível à linguagem e mecanismo de catraca para arquivos legados.

#### Scenario: Arquivo Novo Cruza o Teto de 350 Linhas
GIVEN um arquivo de produção novo ou com tamanho anterior inferior ao teto
WHEN o total de linhas úteis staged ultrapassar 350 linhas
THEN o verificador deve bloquear o commit exigindo modularização ou uso de válvula justificada.

#### Scenario: Alteração em Arquivo Legado Extenso sem Aumento
GIVEN um arquivo de produção legado que já possuía mais de 350 linhas úteis em HEAD
WHEN um commit alterar o arquivo mantendo ou reduzindo o número total de linhas úteis
THEN a catraca deve permitir a operação sem forçar refatorações fora do escopo.

#### Scenario: Uso da Válvula de Exceção com Justificativa Técnica
GIVEN um arquivo de produção que excede legitimamente 350 linhas úteis
WHEN o arquivo contiver o marcador de governança com motivo técnico de no mínimo 15 caracteres
THEN o verificador deve autorizar o commit registrando a exceção para auditoria do Inspetor.
