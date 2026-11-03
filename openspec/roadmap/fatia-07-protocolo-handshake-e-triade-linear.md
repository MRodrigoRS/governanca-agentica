# Fatia 07: Protocolo de Handshake e Tríade de Âncora Linear (Anti-Vazamento de Squads)

> **Status:** `[x] Concluída`  
> **Identificador OpenSpec:** `fatia-07-protocolo-handshake-e-triade-linear`  
> **Depende diretamente de:** `fatia-06-documentos-de-particularidades-e-aprendizados.md` (Governança v3.6.0)  
> **Vínculo com Issue Linear:** `RR-9` (Projeto P-RR-2 / GOV-AGENTS-V2)

---

## 1. Objetivo e Valor Entregue ao Usuário

- **O que esta fatia entrega de concreto:**
  1. **Tríade de Âncora Imutável em `openspec/project.md`:** Institucionalização do registro mandatório dos três nós de ancoragem no Linear para qualquer projeto governado:
     - **Workspace:** slug e URL da organização no Linear (ex.: `rr-diario-agents`, `https://linear.app/rr-diario-agents`).
     - **Equipe:** nome legível, chave de prefixo de issues (`KEY`) e UUID da equipe.
     - **Projeto:** nome do projeto, identificador curto (`P-XXX`) e UUID do projeto.
  2. **Cláusula de Handshake Pré-Operação (`constitution.md` e `AGENTS.md`):**
     - Criação do **Artigo 13** na Constituição: proibição absoluta de qualquer leitura ou escrita no Linear sem antes disparar `whoami`.
     - Verificação mandatória do workspace retornado contra a Tríade de Âncora do projeto. Em caso de divergência, o agente trava a execução imediatamente e emite alerta de contenção ao humano.
     - Proibição absoluta de fallback silencioso (nunca operar em issues órfãs ou de outros times caso o projeto ancorado não seja localizado).
  3. **Protocolo de Inicialização Segura (Novos e Existentes):**
     - Roteiro no Gate 0 para descoberta guiada (`whoami` + `list_teams`), alinhamento humano explícito e sedimentação na Tríade de Âncora.
  4. **Atualização no Questionário Copier (`copier.yml`) e Template Jinja:**
     - Adição das variáveis condicionais `linear_workspace_slug`, `linear_team_key` e `linear_project` ativadas quando `integrar_linear: true`.
     - Atualização de `template/openspec/project.md.jinja` com a seção canônica da Tríade de Âncora.
  5. **Ancoragem Factual do Repositório Atual:**
     - Atualização da Seção 3 de `openspec/project.md` com a Tríade de Âncora real do projeto `P-RR-2`.
  6. **Suíte Automatizada de Testes Unitários:**
     - Criação de `tests/template-linear.test.mjs` com asserções estritas validando o questionário do Copier, a renderização Jinja com e sem Linear e a presença das cláusulas pétreas.

- **Por que esta fatia existe neste ponto da sequência:**
  Com o crescimento de equipes usando múltiplos workspaces e projetos simultâneos no Linear, o agente de IA autenticado via MCP opera com credenciais globais da conta. Sem essa amarração tríplice e o handshake de entrada, existe risco crítico de contaminação cruzada (alterar issues de squads alheios ou de clientes distintos).

---

## 2. Grafo de Dependências Incrementais

- **Depende diretamente de:** `fatia-06-documentos-de-particularidades-e-aprendizados.md` (reaproveita toda a fundação de testes, validações determinísticas e os arquivos de particularidades/aprendizados).
- **O que esta fatia prepara/desbloqueia para a próxima:**
  - Desbloqueia operações multi-squad seguras e previne qualquer vazamento de dados em automações agênticas avançadas.
- **Fronteira de Isolamento (O que NÃO fazer nesta fatia):**
  - **Proibido** alterar outros servidores MCP além do Linear (ex.: manter `context7` inalterado).
  - **Proibido** remover retrocompatibilidade de projetos que usem apenas a variável `linear_project` antiga (o template deve suportar valores padrões amigáveis caso as novas variáveis sejam omitidas).
  - **Proibido** criar scripts que dependam de conexão viva com a internet para rodar nos testes unitários locais (os testes devem auditar os arquivos estáticos e templates Jinja localmente).

---

## 3. Contratos de Dados, Configuração e Schemas (PT-BR — Artigo 10)

### 3.1. Variáveis no `copier.yml`
Quando `integrar_linear: true`, as seguintes perguntas devem ser apresentadas de forma condicional:
```yaml
linear_workspace_slug:
  type: str
  help: "Slug ou domínio da organização no Linear (ex: rr-diario-agents ou https://linear.app/rr-diario-agents)"
  default: ""
  when: "{{ integrar_linear }}"

linear_team_key:
  type: str
  help: "Chave ou nome da equipe proprietária no Linear (ex: RR ou RR_DIARIO_AGENTS)"
  default: ""
  when: "{{ integrar_linear }}"

linear_project:
  type: str
  help: "Identificador ou URL do Projeto no Linear (ex: P-RR-2 ou GOV-AGENTS-V2)"
  default: ""
  when: "{{ integrar_linear }}"
```

### 3.2. Estrutura Renderizada da Tríade de Âncora em `template/openspec/project.md.jinja`
```markdown
{% if integrar_linear %}
---

## 5. Integração com Linear (Diário de Bordo & Gestão)

- **Servidor MCP:** Linear Hosted Remote Server (`mcp-remote https://mcp.linear.app/mcp`)

### Tríade de Âncora Linear (Anti-Vazamento de Squads)
- **Workspace:** `{{ linear_workspace_slug if linear_workspace_slug else '[A definir no Gate 0]' }}`
- **Equipe:** `{{ linear_team_key if linear_team_key else '[A definir no Gate 0]' }}`
- **Projeto:** `{{ linear_project if linear_project else '[A definir no Gate 0]' }}`

- **Protocolo de Handshake Pré-Operação (Obrigatório):**
  1. Antes de qualquer leitura ou escrita no Linear, o agente executa `whoami`.
  2. Compara o workspace ativo retornado com a âncora acima. Se divergente, bloqueia a operação imediatamente e emite alerta de contenção ao humano.
  3. Toda busca ou criação de issues DEVE ser restrita ao projeto e equipe ancorados. Proibido fallback silencioso.
{% endif %}
```

### 3.3. Cláusula Constitucional no `template/constitution.md`
Criação do **Artigo 13 — Isolamento Multi-Squad, Tríade de Âncora e Handshake de Integrações**:
1. Proibição de qualquer operação de leitura ou escrita em ferramentas de gestão compartilhadas (Linear) sem verificação prévia de identidade (`whoami`).
2. Validação obrigatória da Tríade de Âncora antes de interagir com o backlog.
3. Bloqueio imediato com aviso explícito em caso de divergência de workspace ou falha na resolução do projeto. Proibição categórica de fallback silencioso.

---

## 4. Roteiro Test-First (Vermelho → Verde → Refatorar)

### 4.1. Passo 1: Especificação do Teste Falhando (Vermelho)
- Criar `tests/template-linear.test.mjs` testando:
  1. `copier.yml` contém `linear_workspace_slug` e `linear_team_key` condicionados a `integrar_linear`.
  2. `template/openspec/project.md.jinja` renderiza corretamente a Tríade de Âncora quando `integrar_linear = true`.
  3. `template/openspec/project.md.jinja` omite a Tríade quando `integrar_linear = false`.
  4. `template/constitution.md` contém o Artigo 13 com as regras de handshake e anti-vazamento.
  5. `template/AGENTS.md` contém as instruções operacionais de handshake e Tríade de Âncora.
  6. `openspec/project.md` do repositório possui a Tríade de Âncora real preenchida.
- Executar `node --test tests/template-linear.test.mjs` comprovando que o teste falha (Vermelho).

### 4.2. Passo 2: Implementação Mínima (Verde)
- Atualizar `copier.yml`.
- Atualizar `template/openspec/project.md.jinja`.
- Adicionar Artigo 13 em `template/constitution.md`.
- Adicionar instruções de handshake na Seção 6 de `template/AGENTS.md`.
- Atualizar Seção 3 de `openspec/project.md`.
- Executar novamente o teste e constatar sucesso verde.

### 4.3. Passo 3: Refatoração e Verificação Integral
- Executar a suíte completa de testes (`npm test`) garantindo 100% de aprovação.
- Auditar via `verificar-governanca.mjs`.

---

## 5. Roteiro de Validação Prática Passo a Passo (Gate 2)

- **O que foi entregue:** Protocolo de Handshake Pré-Operação, Tríade de Âncora Linear e perguntas do Copier para impedir vazamento entre squads.
- **Onde encontrar:**
  - `copier.yml` (linhas com `linear_workspace_slug` e `linear_team_key`)
  - `template/constitution.md` (Artigo 13)
  - `template/AGENTS.md` (Seção 6, item sobre Handshake e Tríade de Âncora)
  - `template/openspec/project.md.jinja` (Seção 5, bloco da Tríade de Âncora)
  - `openspec/project.md` (Seção 3)
  - `tests/template-linear.test.mjs` (suíte automatizada)
- **Passo a passo de validação:**
  1. Execute `npm test` no terminal e confirme que a suíte `template-linear.test.mjs` e todas as demais passam verdes com asserções reais.
  2. Inspecione `template/constitution.md` e confirme o Artigo 13.
  3. Inspecione `copier.yml` e valide que as perguntas de workspace e equipe estão atreladas a `when: "{{ integrar_linear }}"`.
- **Comportamento esperado:** Suíte de testes 100% verde sem marcadores de teste exclusivo (`.only(`) e conformidade estrutural completa.

---

## 6. Critérios de Aceite Inegociáveis

1. **Zero Degradação de Suíte:** Todos os 42 testes existentes mais os novos testes devem passar limpos (`exit 0`).
2. **Tríade Completa:** Todos os 3 nós (Workspace, Equipe e Projeto) devem constar no template e na Constituição.
3. **Bloqueio Determinístico:** O Artigo 13 deve proibir expressamente o fallback silencioso e qualquer escrita sem `whoami`.
4. **Isolamento de Copier:** `copier.yml` deve aceitar defaults seguros para não quebrar fluxos não interativos.

---

## 7. Riscos Mapeados e Plano de Mitigação

| Risco Mapeado | Impacto | Mitigação Arquitetural |
|---|---|---|
| Projetos existentes serem atualizados via Copier e perderem suas âncoras | Alto | `openspec/project.md` já está protegido em `_skip_if_exists` no `copier.yml`, garantindo que atualizações de governança não sobrescrevam a âncora local. |
| Usuário omitir slug ou chave de equipe no questionário | Médio | Defaults amigáveis (`[A definir no Gate 0]`) no template Jinja permitem preenchimento posterior no Gate 0 guiado. |
| Agente tentar fazer requests em rede no teste unitário | Alto | A suíte de testes analisa arquivos e renderizações localmente, sem acoplamento a APIs remotas do Linear. |
