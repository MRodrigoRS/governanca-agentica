# Fatia <NUMERO>: <TITULO_DA_FATIA>

> **Status:** `[ ] Pendente` | `[~] Em Andamento` | `[x] Concluída`
> **Identificador OpenSpec:** `fatia-<NUMERO>-<SLUG>` (Ex.: `fatia-02-produtos` ou `fatia-02.1-variacoes`)
> **Regra de Ouro (Teste do Agente Executor):** Este documento nunca deve ser escrito de forma resumida, comprimida ou genérica. Ele deve conter especificações tão claras e completas que qualquer agente de IA — mesmo em uma sessão limpa ou usando um modelo mais leve — consiga implementar esta fatia do início ao fim sem precisar adivinhar regras de negócio, nomes de tabelas ou estados de tela.

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:** [Descreva claramente o que o usuário final conseguirá fazer ou ver funcionando ao término desta fatia].
- **Por que esta fatia existe neste ponto da sequência:** [Explique por que esta fatia vem agora na ordem de construção do sistema].

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** [Ex.: `Nenhuma (Fatia Fundacional)` ou `fatia-01-fundacao-e-autenticacao.md (tabela usuarios e sessão ativa)`].
- **O que esta fatia prepara/desbloqueia para a próxima:** [Ex.: `Deixa pronta a tabela contatos e estagios_funil para ser consumida pela fatia-03-kanban-atendimento.md`].
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - [Liste explicitamente o que pertence a fatias futuras para impedir que o agente tente implementar o sistema inteiro de uma vez].

---

## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)

### 3.1. Tabelas e Colunas do Banco de Dados
*(Detalhe cada tabela criada ou alterada nesta fatia, com tipos, chaves, índices e restrições em Português do Brasil).*

| Tabela | Coluna | Tipo | Obrigatório | Descrição / Regra |
|---|---|---|---|---|
| `exemplo_tabela` | `id` | `UUID / CUID` | Sim | Chave primária |
| `exemplo_tabela` | `criado_em` | `Timestamp` | Sim | Data de criação do registro |

### 3.2. Schemas de Validação na Fronteira (Zod / Pydantic / Serde)
*(Especifique os contratos exatos de entrada e saída que serão validados na fronteira da aplicação).*

- **Entrada (`SchemaCriar...` / `SchemaAtualizar...`):** [Campos, tipos, limites de caracteres, formatos válidos e mensagens de erro em PT-BR].
- **Saída (`SchemaResposta...`):** [Campos retornados para a interface ou consumidor da API].

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

- **Rotas / Telas criadas ou alteradas:** [Ex.: `/painel/funis`, modal `ModalCriarPreset`].
- **Responsividade e Portabilidade PWA Inatas (Artigo 6, item 6):**
  - Layouts mobile-first testados e funcionais desde telas estreitas de smartphones (mínimo 320px) até desktops/widescreen sem overflow horizontal.
  - Suporte e conformidade com manifesto web (`manifest.json` / `manifest.webmanifest`), meta tags viewport e cores temáticas se houver elementos de UI web.
- **Componentes Reutilizáveis:** [Lista de componentes visuais e como eles se conectam aos dados sem recarregar a página (`location.reload` proibido)].
- **Acessibilidade e Teclado:**
  - HTML semântico utilizado (`<main>`, `<nav>`, `<section>`, `<button>`).
  - Áreas clicáveis mínimas de 44x44px.
  - Comportamento da tecla `Escape` (fechar modais/drawers/menus).
- **Os 4 Estados Assíncronos Obrigatórios:**
  1. **Carregando (`loading`):** [Qual skeleton ou indicador visual será exibido].
  2. **Vazio (`empty`):** [Qual mensagem e botão de ação aparecerão quando não houver registros].
  3. **Erro (`error`):** [Como falhas de rede/validação serão apresentadas com botão de tentar novamente].
  4. **Sucesso (`success`):** [Como os dados reais serão exibidos e atualizados reativamente].

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

- **Regras de Domínio Passo a Passo:**
  1. [Regra 1 explícita, com condições SE / ENTÃO / SENÃO].
  2. [Regra 2 explícita].
- **Segurança Zero-Trust (Anti-F12):** [Quais permissões, papéis de usuário e validações de propriedade o backend deve checar antes de aceitar a operação].
- **Transações Atômicas (ACID):** [Se a operação grava em mais de uma tabela ou dispara fila/evento, descreva o bloco transacional].
- **Rate Limiting e Integrações Externas:** [Limites de requisição, filas assíncronas, webhooks ou serviços externos acionados].

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

*(Lista mastigada dos testes automatizados que o agente deve escrever ANTES do código de produção, rodando no terminal para provar o estado VERMELHO e depois o VERDE).*

1. **Teste 1 (`deve_...`):**
   - *Cenário:* [Dado X, quando executar Y].
   - *Resultado Esperado:* [Deve retornar/gravar Z].
2. **Teste 2 (`nao_deve_permitir_...` — Caso de Borda / Segurança):**
   - *Cenário:* [Dado payload inválido ou usuário sem permissão].
   - *Resultado Esperado:* [Deve rejeitar com erro de validação/autorização sem alterar o banco].
3. **Teste 3 (`deve_exibir_estados_...` — Integração / UI):**
   - *Cenário:* [Fluxo completo da funcionalidade].
   - *Resultado Esperado:* [Transição correta de estados e persistência].

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] Todos os schemas e tabelas descritos na Seção 3 foram criados com nomes em PT-BR.
- [ ] Responsividade e portabilidade PWA garantidas na interface web (mobile-first 320px+ e sem quebras visuais).
- [ ] Os 4 estados assíncronos (`loading`, `empty`, `error`, `success`) estão implementados e funcionais.
- [ ] Todos os testes da Seção 6 falharam antes da implementação (evidência Vermelha) e passaram após o código (evidência Verde).
- [ ] `npx @fission-ai/openspec validate` e `node scripts/verificar-governanca.mjs` executados com sucesso (`exit 0`).
- [ ] `CHANGELOG.md` atualizado com as entregas desta fatia.

### 7.2. Roteiro de Validação Prática do Usuário (Obrigatório no Gate 2)
*(Roteiro mastigado que o agente apresentará ao humano para validação manual com os próprios olhos)*

- **Onde testar:** [Rota, tela, modal ou comando exato onde a funcionalidade se encontra].
- **Passo a passo com dados prontos:**
  1. [Ação 1 com valores de exemplo prontos para copiar e colar].
  2. [Ação 2].
- **Comportamento visual esperado:** [O que o humano deve observar na interface ou na saída do sistema].
- **Teste de borda prático:** [Como simular um erro ou entrada inválida e o alerta amigável que deve aparecer].
