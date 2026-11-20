# Arquitetura do Sistema e Modelo de Dados

> **Papel:** Documentação viva de arquitetura de software no padrão de mercado (C4 Model + Entity-Relationship + Glossário de Domínio).
> **Gatilho de Atualização:** Toda alteração em esquemas de banco de dados (`schema.prisma`, migrações SQL) exige a atualização deste arquivo no mesmo commit (Fatia 09 / Artigo 7).
> **Proteção Copier:** Listado em `_skip_if_exists` no `copier.yml`.

---

## 1. Visão Geral e Contexto de Negócio (C4 Nível 1 — Contexto)

O diagrama abaixo ilustra os atores humanos, o sistema de software e suas integrações com serviços externos.

```mermaid
flowchart TD
    subgraph Atores["Atores e Clientes"]
        Usuario["Usuário Final (Navegador / PWA)"]
        Admin["Administrador do Sistema"]
    end

    subgraph Fronteira["Fronteira da Aplicação"]
        Sistema["Sistema Principal (Aplicação Web / API)"]
    end

    subgraph Externos["Serviços e APIs Externas"]
        GatewayPagamento["Gateway de Pagamento"]
        ServicoEmail["Serviço Transacional de E-mail"]
    end

    Usuario -->|Utiliza via HTTPS| Sistema
    Admin -->|Opera painel administrativo| Sistema
    Sistema -->|Processa pagamentos| GatewayPagamento
    Sistema -->|Dispara notificações| ServicoEmail
```

---

## 2. Contêineres e Aplicações (C4 Nível 2 — Contêineres)

Detalhamento dos componentes de infraestrutura, bancos e servidores executáveis.

```mermaid
flowchart TD
    ClienteWeb["SPA / PWA Frontend\n(TypeScript / Tailwind / Framework Reativo)"]
    API["Servidor Backend / API REST\n(TypeScript / Node.js)"]
    BancoRelacional[("Banco de Dados Relacional\n(PostgreSQL / SQLite)")]
    FilaTarefas[("Fila de Segundo Plano\n(Redis / BullMQ)")]

    ClienteWeb -->|Requisições HTTPS JSON / Reatividade| API
    API -->|Consultas e Transações ACID| BancoRelacional
    API -->|Enfileira jobs assíncronos| FilaTarefas
```

---

## 3. Modelo Físico de Entidades (`erDiagram` — Como Construído)

Diagrama de relacionamentos das entidades de domínio persistidas no banco. Tabelas e colunas com nomes canônicos em Português do Brasil (Artigo 10).

```mermaid
erDiagram
    USUARIO {
        int id PK
        string nome
        string email
        string senha_hash
        datetime criado_em
    }

    CONTA {
        int id PK
        int usuario_id FK
        string plano
        string status
    }

    USUARIO ||--o{ CONTA : "possui"
```

---

## 4. Glossário de Domínio

Tabela canônica mapeando os conceitos de negócio, seus identificadores oficiais no código em PT-BR e as tabelas físicas correspondentes, eliminando ambiguidades entre squads e agentes de IA.

| Termo de Negócio | Identificador no Código (PT-BR) | Tabela / Coleção Física | Descrição e Regras |
|---|---|---|---|
| **Usuário** | `usuario`, `Usuario` | `usuarios` | Ator autenticado com e-mail corporativo único por tenant. |
| **Conta / Tenant** | `conta`, `Conta` | `contas` | Unidade de cobrança e isolamento lógico de dados da organização. |
| **Assinatura** | `assinatura`, `Assinatura` | `assinaturas` | Vínculo financeiro entre uma conta e um plano recorrente de uso. |

---

## 5. Mapa Físico de Módulos (Onde Cada Coisa Mora)

> **Objetivo:** Evitar varreduras exploratórias repetidas em sessões limpas. Mantenha 1 linha por módulo ou fronteira de domínio com caminhos reais entre crases (`src/modulo/`) — o sensor anti-apodrecimento bloqueia remoções sem sincronização desta tabela.

| Domínio / Camada | Pasta ou Ponto de Entrada | Responsabilidade Principal | Suíte de Testes Correspondente |
|---|---|---|---|
| *(A preencher no Gate 0 / Onboarding)* | *(Preencher com caminho real entre crases na inicialização)* | *(Responsabilidade do módulo no sistema)* | *(Diretório ou arquivo de testes)* |
