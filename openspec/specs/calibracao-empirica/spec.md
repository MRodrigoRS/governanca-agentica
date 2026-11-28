# calibracao-empirica Specification

## Purpose

TBD - created by archiving change fatia-23-calibracao-empirica-e-anti-diluicao. Update Purpose after archive.

## Requirements

### Requirement: Extração de ponteiros em listas no Catálogo de Reúso
O motor determinístico deve extrair ponteiros de arquivos entre crases tanto em linhas de tabela (`| ... |`) quanto em itens de lista (`- ` ou `* `) dentro de `docs/catalogo-reuso.md`, ignorando blocos de código cercados.

#### Scenario: Catálogo de Reúso escrito com listas de componentes
- GIVEN um repositório com `>= 5` componentes `.tsx` e `docs/catalogo-reuso.md` preenchido com lista `- **Botao** (\`src/components/Botao.tsx\`)`
- WHEN `verificarSensorCatalogoReuso` e `verificarSensorAntiApodrecimentoCatalogo` executam
- THEN nenhum `[AVISO MATURIDADE]` de catálogo vazio deve ser emitido
- AND se `src/components/Botao.tsx` inexistir no disco ou for removido sem atualizar `docs/catalogo-reuso.md`, o sensor anti-apodrecimento deve bloquear com `exit 1`.

### Requirement: Classificação estrita de ponteiros de disco em `docs/arquitetura.md §5`
O extrator da Seção 5 de `docs/arquitetura.md` deve auditar exclusivamente tokens entre crases que representem caminhos reais de diretório/arquivo ou nomes conhecidos de arquivo raiz, evitando falsos positivos em textos descritivos.

#### Scenario: Tabela §5 contendo versões, expressões de código e caminhos reais
- GIVEN `docs/arquitetura.md` com `## 5. Mapa Físico de Módulos` citando `src/app/`, `public/sw.js`, `v4.8.0`, `req.body` e `respostas-rapidas.ts` na descrição
- WHEN `verificarSensorAntiApodrecimentoMapaArquitetura` audita o commit
- THEN `v4.8.0`, `req.body` e `respostas-rapidas.ts` não devem ser tratados como arquivos inexistentes na raiz
- AND se a tabela citar um caminho inexistente com barra (ex.: `arquivo-inexistente/foo.ts`), o sensor deve bloquear o commit.

### Requirement: Calibração de Prova de Runtime, Contratos Fullstack e Observabilidade Proporcional
As regras constitucionais, modulares e de skill devem evitar duplicação de esforço em monólitos Fullstack/MVP mantendo integridade `P0`.

#### Scenario: Suíte E2E real e regras Fullstack calibradas
- GIVEN `template/constitution.md`, `template/.agents/skills/ciclo-especificacao/SKILL.md`, `template/.agents/rules/web-ui-pwa.md.jinja` e `template/.agents/rules/backend-seguranca-dados.md.jinja`
- WHEN auditados pelos testes estruturais
- THEN `Artigo 2.7` (`web-ui`) e `ciclo-especificacao` devem reconhecer suíte E2E real no navegador contra app e banco reais (`pageerror === 0`, HTTP e fluxos da fatia) como Prova de Runtime suficiente
- AND `Artigo 1.2` e `web-ui-pwa.md.jinja` §10 devem exigir fonte única de tipos e validação runtime em APIs externas/payloads não confiáveis/mutações críticas, permitindo consumo de rotas internas tipadas em monólito fullstack sem `safeParse` obrigatório em todo `GET` simples
- AND `Artigo 7.6` e `backend-seguranca-dados.md.jinja` §8 devem manter `/health` (ou `/api/saude`) e zero PII/segredos obrigatórios desde o início, marcando `requestId` distribuído e `/ready` como recomendados para produção/alta escala ou obrigatórios a partir da fatia de deploy/observabilidade.

### Requirement: Enxugamento de `template/AGENTS.md` com foco P0
O bloco gerenciado entre `<!-- governanca:inicio -->` e `<!-- governanca:fim -->` em `template/AGENTS.md` deve conter `<= 130` linhas úteis/totais, concentrando o texto normativo completo em `template/constitution.md`.

#### Scenario: Redução de duplicação preservando comandos e ponteiros
- GIVEN `template/AGENTS.md` atualizado para `v4.9.0`
- WHEN os testes de integridade e calibração verificam o arquivo
- THEN o bloco gerenciado possui `<= 130` linhas, o Cartão de Invariantes prioriza a **Faixa 1 (`P0`)** com ponteiro explícito para `constitution.md` (Faixas 2 e 3)
- AND todos os 18 comandos `/`, todas as skills, regras em `.agents/rules/`, documentos em `docs/` e contratos de fluxo (Gate 1/2, Linear, Greenfield/Brownfield) permanecem preservados.

### Requirement: Flexibilidade de sinônimos em `auditar-openspec.mjs` e `.gitattributes` LF/CRLF
O auditor de deltas OpenSpec deve aceitar sinônimos naturais em PT-BR e EN mantendo o bloqueio estrutural D18/D32, e o repositório e template Copier devem versionar `.gitattributes`.

#### Scenario: Sinônimos naturais em delta OpenSpec e propagação de `.gitattributes`
- GIVEN um delta em `openspec/changes/fatia-XX/` usando variações como `## Motivação`, `## Arquitetura e Modelos`, `## Cenários de Uso` ou `## Checklist de Validação`
- WHEN `auditarPastaMudancaOpenSpec` executa
- THEN os sinônimos naturais devem ser aceitos sem erro
- AND `template/.gitattributes` deve existir fora de `_skip_if_exists` no `copier.yml`, definindo `eol=lf` para `.mjs`, `.md`, `.yml`, `.yaml` e `.json` e `eol=crlf` para `.ps1` e `.bat`.
