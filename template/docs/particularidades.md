# Particularidades Operacionais e de Ambiente

> **Papel:** Registro centralizado de restrições de infraestrutura, portas locais, particularidades de hospedagem, limites de planos e regras de domínio não-óbvias deste projeto.
> **Orientação para Agentes:** Consulte este documento sob demanda antes de modificar configurações de infraestrutura, portas de rede, scripts de inicialização, esquemas de banco ou integrações externas.
> **Proteção Copier:** Este arquivo está listado em `_skip_if_exists` no `copier.yml` e é preservado integralmente em atualizações (`uvx copier update`).
> **Zero Segredos (Artigo 3):** Nunca armazene senhas, chaves privadas ou tokens reais neste arquivo. Referencie apenas os nomes das variáveis de ambiente correspondentes (ex.: `$DATABASE_URL`, `$STRIPE_SECRET_KEY`).

---

## 1. Infraestrutura, Hospedagem e Planos

- **Ambiente de Produção e Hospedagem:** (Ex.: Vercel Serverless, VPS Hetzner / DigitalOcean, AWS ECS, Fly.io, Railway)
- **Portas Locais e Concorrência:** (Ex.: Frontend em `3000`, Backend API em `8000`, WebSocket em `8080`)
- **Limites de Recursos e Planos:** (Ex.: Limite de memória da função serverless em 512MB, timeout de execução em 15s)
- **Comandos de Inicialização e Processos de Background:** (Ex.: Docker Compose local, PM2 em produção)

---

## 2. Banco de Dados e Persistência

- **Engine e Versão:** (Ex.: PostgreSQL 16 com extensão `pgvector`, SQLite 3 embutido, Redis 7 para cache)
- **Estratégia de Multi-Tenancy e Isolamento:** (Ex.: Schema único com coluna `tenant_id` protegida por RLS ou bancos isolados)
- **Connection Pooler e Limite de Conexões:** (Ex.: PgBouncer no modo transação em porta 6543, máximo de 20 conexões ativas)
- **Migrações e Execução de Scripts:** (Ex.: Prisma Migrate, Drizzle Kit, Alembic — restrições de execução sem lock prolongado)

---

## 3. Provedores Externos e Webhooks

- **Gateways de Pagamento:** (Ex.: Stripe / Mercado Pago — comportamento de retries idempotentes e assinatura de webhook)
- **Mensageria e Notificações:** (Ex.: UAZAPI / Evolution API para WhatsApp, Resend para e-mails transacionais)
- **APIs de Terceiros e Rate Limits:** (Ex.: Limite de 60 requisições/minuto na API de terceiros, fila com backoff exponencial)
- **Assinatura de Webhooks e Segurança:** (Ex.: Validação de assinatura HMAC SHA-256 no payload bruto antes do parse de JSON)

---

## 4. Regras de Domínio Não-Óbvias

- **Invariantes de Negócio Não-Explícitas no Schema:** (Ex.: "Um pedido cancelado nunca pode retornar ao estado pendente; deve ser gerado um novo pedido.")
- **Casos Especiais de Cálculo:** (Ex.: "O arredondamento financeiro deve sempre utilizar a regra bancária de meio-par em centavos.")
- **Restrições Temporais e Fusos Horários:** (Ex.: "Todas as datas e timestamps são armazenados em UTC; exibições usam America/Sao_Paulo.")
