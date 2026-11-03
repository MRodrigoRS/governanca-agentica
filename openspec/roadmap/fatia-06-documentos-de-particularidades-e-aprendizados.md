# Fatia 06: Documentos de Particularidades e Aprendizados Protegidos no Copier

> **Status:** `[x] Concluída`  
> **Identificador OpenSpec:** `fatia-06-documentos-de-particularidades-e-aprendizados`  
> **Depende diretamente de:** `fatia-05-catalogo-jogos-e-simulacoes.md` (Governança v3.5.0)  
> **Vínculo com Issue Linear:** `RR-8` (Projeto P-RR-2 / GOV-AGENTS-V2)

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. Criação de dois novos documentos de primeira classe no template da governança:
     - `template/docs/particularidades.md`: repositório estruturado para restrições operacionais vigentes, especificidades de hospedagem (VPS, portas, limites), banco de dados (RLS, connection pooler), provedores externos (webhooks, gateways) e regras não-óbvias de domínio.
     - `template/docs/aprendizados.md`: diário empírico de cicatrizes, armadilhas técnicas superadas e bugs bizarros com causa raiz e regras inegociáveis decorrentes.
  2. Blindagem determinística contra sobrescrita no Copier: inclusão de `"docs/particularidades.md"` e `"docs/aprendizados.md"` na lista `_skip_if_exists` de `copier.yml`, garantindo que projetos que executem `uvx copier update` nunca percam suas memórias locais de produção.
  3. Amarração de leitura sob demanda no rodapé de `template/AGENTS.md`, orientando agentes a consultarem `particularidades.md` antes de alterações em infraestrutura/ambiente e `aprendizados.md` no Gate 1 para não reincidirem em falhas já catalogadas.
  4. Suíte de testes automatizados unitários garantindo a integridade dos modelos e das regras de preservação do Copier.

- **Por que esta fatia existe neste ponto da sequência:**
  Ao longo do ciclo de vida dos projetos governados por IA, agentes tendiam a concentrar regras operacionais no `AGENTS.md` (causando saturação de contexto) ou a registrar aprendizados em locais arbitrários que acabavam destruídos ou sobrescritos em atualizações do template. Esta fatia desacopla a governança das especificidades de infraestrutura, conferindo persistência e higiene de contexto definitivas.

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-05-catalogo-jogos-e-simulacoes.md` (reaproveita os validadores determinísticos, hooks de edição e suíte de testes unitários).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Desbloqueia a **Fatia 07 (`RR-9`)** — protocolo de handshake e tríade de âncora Linear —, fornecendo o local canônico (`docs/particularidades.md`) para documentar slugs de workspace, credenciais e portas de MCPs sem inchar a Constituição.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** implementar o handshake `whoami` ou validações ativas de Linear nesta fatia (escopo exclusivo da Fatia 07 / RR-9).
  - **Proibido** preencher os modelos com dados concretos de um projeto específico; os arquivos em `template/docs/` devem ser modelos canônicos e limpos com instruções de preenchimento.
  - **Proibido** quebrar a estrutura existente de `_skip_if_exists` ou remover itens preexistentes em `copier.yml`.

---

## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)

### 3.1. Estrutura do Arquivo `template/docs/particularidades.md`
O arquivo deve conter cabeçalho formal da governança e 4 seções temáticas padronizadas:
1. `## 1. Infraestrutura, Hospedagem e Planos` (provedores como Vercel/VPS, portas locais, restrições de concorrência, limites de timeout).
2. `## 2. Banco de Dados e Persistência` (estratégia multi-tenancy, RLS, pooler de conexão, limites de tamanho, extensões necessárias).
3. `## 3. Provedores Externos e Webhooks` (gateways de pagamento, WhatsApp/APIs de mensageria, serviços de e-mail transacional, comportamento de retries).
4. `## 4. Regras de Domínio Não-Óbvias` (invariantes de negócio que não são dedutíveis pelo código ou schema isolados).

### 3.2. Estrutura do Arquivo `template/docs/aprendizados.md`
O arquivo deve conter cabeçalho formal da governança e modelo de preenchimento de cicatrizes:
- Seção introdutória explicando a finalidade (memória de incidentes e prevenção de reincidência).
- Bloco padronizado para novas entradas:
  ```markdown
  ### [AAAA-MM-DD / COD-XXX] Título Conciso da Armadilha
  - **O que aconteceu:** Descrição factual do sintoma ou falha observada.
  - **Causa raiz:** Razão técnica real após investigação forense.
  - **A armadilha mental:** Premissa incorreta ou dedução equivocada que causou a falha.
  - **Regra inegociável decorrente:** Diretriz direta e acionável para nunca mais repetir.
  ```

### 3.3. Contrato de Configuração no `copier.yml`
Em `copier.yml`, a lista `_skip_if_exists` deve incluir obrigatoriamente:
```yaml
_skip_if_exists:
  - CHANGELOG.md
  - README.md
  - package.json
  - "openspec/config.yaml"
  - "openspec/project.md"
  - "openspec/radar-oportunidades.md"
  - "openspec/roadmap/fatia-*.md"
  - "openspec/specs/**"
  - "openspec/changes/**"
  - "docs/adr/**"
  - ".claude/settings.local.json"
  - "docs/particularidades.md"
  - "docs/aprendizados.md"
```

---

## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)

Esta fatia lida exclusivamente com documentação de governança, templates Copier e referências de instrução de agentes:
- Não há interface gráfica web, componentes visuais ou rotas de front-end nesta fatia.
- A experiência de leitura é orientada ao agente de IA e ao desenvolvedor humano através de Markdown semântico, com blocos de alerta legíveis no padrão GitHub Flavored Markdown (`> [!NOTE]`, `> [!IMPORTANT]`).

---

## 5. Regras de Negócio, Segurança e Backend (Artigo 7)

1. **Imutabilidade e Proteção no Copier:**
   - Durante o comando `uvx copier update`, os arquivos `docs/particularidades.md` e `docs/aprendizados.md` nunca devem ser sobrescritos quando já existirem no repositório de destino.
2. **Higiene de Contexto em `template/AGENTS.md`:**
   - O arquivo `template/AGENTS.md` deve manter-se conciso e enxuto.
   - Na Seção 6 ("Recursos, Ferramentas e MCPs"), devem ser adicionados ponteiros explícitos:
     * `docs/particularidades.md`: consulta sob demanda antes de alterações estruturais em infraestrutura, variáveis de ambiente ou integrações externas.
     * `docs/aprendizados.md`: consulta sob demanda no Gate 1 para verificação de histórico de armadilhas conhecidas antes da codificação.
3. **Zero Segredos:**
   - As instruções de `particularidades.md` devem reiterar explicitamente que chaves de API, senhas ou tokens reais **não** devem ser armazenados no arquivo, utilizando apenas nomes de variáveis de ambiente de referência.

---

## 6. Roteiro Test-First para o Agente Executor (Artigo 2)

O agente deve implementar testes automatizados em `tests/template-docs.test.mjs` cobrindo os seguintes cenários antes da finalização:

1. **Teste 1 (`deve_conter_arquivos_docs_no_template`):**
   - *Cenário:* Verificar existência física de `template/docs/particularidades.md` e `template/docs/aprendizados.md`.
   - *Resultado Esperado:* Ambos os arquivos devem existir e conter suas seções canônicas obrigatórias.
2. **Teste 2 (`deve_proteger_arquivos_no_skip_if_exists_do_copier`):**
   - *Cenário:* Ler o arquivo `copier.yml` na raiz do repositório e inspecionar a lista `_skip_if_exists`.
   - *Resultado Esperado:* A lista deve conter `"docs/particularidades.md"` e `"docs/aprendizados.md"`.
3. **Teste 3 (`deve_possuir_ponteiros_em_template_agents_md`):**
   - *Cenário:* Ler `template/AGENTS.md`.
   - *Resultado Esperado:* O conteúdo deve citar explicitamente os caminhos `docs/particularidades.md` e `docs/aprendizados.md`.

---

## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)

### 7.1. Critérios Determinísticos
- [ ] O arquivo `template/docs/particularidades.md` existe e contém as 4 seções estruturadas.
- [ ] O arquivo `template/docs/aprendizados.md` existe e contém o formato padronizado de armadilhas.
- [ ] `copier.yml` inclui `"docs/particularidades.md"` e `"docs/aprendizados.md"` em `_skip_if_exists`.
- [ ] `template/AGENTS.md` referencia ambos os documentos na Seção 6.
- [ ] Nova suíte de testes unitários criada e passando com 100% de sucesso (`npm test`).
- [ ] `node template/scripts/verificar-governanca.mjs` executa sem erros (`exit 0`).

### 7.2. Roteiro de Teste Prático (Validação Humana)
1. **Inspeção dos Modelos:**
   - Abra [template/docs/particularidades.md](file:///c:/Users/rodri/source/repos/governança-de-agentes/template/docs/particularidades.md) e confira se as 4 seções cobrem infraestrutura, banco, webhooks e domínio.
   - Abra [template/docs/aprendizados.md](file:///c:/Users/rodri/source/repos/governança-de-agentes/template/docs/aprendizados.md) e valide o formato de registro de incidentes empíricos.
2. **Verificação do Copier:**
   - Abra [copier.yml](file:///c:/Users/rodri/source/repos/governança-de-agentes/copier.yml) e confirme que as duas entradas constam sob `_skip_if_exists`.
3. **Execução de Testes:**
   - Execute `npm test` no terminal e certifique-se de que a nova suíte é executada e aprovada.
