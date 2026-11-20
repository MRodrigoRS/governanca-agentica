# Runbook Operacional (Deploy, Rollback, Logs e Go-Live)

> **Papel:** Procedimentos reais e acionáveis para publicar, verificar, diagnosticar e reverter este sistema fora do `localhost`, evitando tentativa e erro entre sessões.
> **Orientação para Agentes:** Consulte este documento antes de mexer em infraestrutura, pipelines de deploy, variáveis de ambiente de produção ou migrações críticas. **Regra de Zero Segredos (Artigo 3):** nunca registre senhas, tokens ou chaves reais aqui — cite apenas nomes de variáveis (ex.: `$DATABASE_URL`).
> **Proteção Copier:** Este arquivo está listado em `_skip_if_exists` no `copier.yml` e é preservado integralmente em atualizações (`uvx copier update`).

---

## 1. Deploy e Publicação

- **Provedor / Ambiente de Produção:** *(Ex.: Coolify / Dokploy via SSH na VPS, Vercel, Fly.io, Railway)*
- **Branch e Gatilho de Release:** *(Ex.: push automático na `main` via GitHub Actions ou deploy manual CLI)*
- **Comando / Procedimento Manual de Deploy:**
  ```bash
  # Preencha o comando real do projeto (ex.: fly deploy / docker compose up -d --build)
  ```
- **Ambiente de Homologação (Staging):** *(URL e forma de publicação prévia, se aplicável)*

---

## 2. Verificação Pós-Deploy (*Smoke Check*)

Execute imediatamente após toda publicação em staging ou produção:
1. **Healthcheck da API / Aplicação:**
   ```bash
   # Ex.: curl -fsS https://api.seudominio.com/health
   ```
2. **Fluxo Crítico Ponta a Ponta:** *(Ex.: login, consulta principal e geração de toast/resposta HTTP `200 OK`)*
3. **Sinais Vitais Iniciais:** *(Sem erros `5xx` nos primeiros 2 minutos de log; filas/workers conectados)*

---

## 3. Migrations e Rollback Seguro

- **Pré-Requisito Antes de Migração Estrutural:** *(Ex.: snapshot/backup obrigatório no provedor ou `pg_dump` antes de alterações destrutivas)*
- **Comando Oficial de Migration em Produção:**
  ```bash
  # Ex.: npx prisma migrate deploy / uv run alembic upgrade head
  ```
- **Estratégia de Rollback de Código:** *(Ex.: reverter para a tag/release anterior no painel ou `git revert` + redeploy)*
- **Estratégia de Rollback / Recuperação de Banco:** *(Ex.: restaurar snapshot pré-deploy; não usar `migrate reset` em produção)*

---

## 4. Logs, Filas e Observabilidade

- **Consulta de Logs da Aplicação:**
  ```bash
  # Ex.: docker logs -f --tail 200 app-api / fly logs / vercel logs
  ```
- **Filas, Jobs e Webhooks:** *(Onde inspecionar jobs presos, dead-letter queues e falhas de entrega de webhook)*
- **Monitoramento de Erros / Métricas:** *(Painel de telemetria, Sentry/PostHog, alertas configurados)*

---

## 5. Checklist de Pré-Release (Go-Live)

- [ ] Novas variáveis de ambiente cadastradas no painel do provedor (sem segredos em `NEXT_PUBLIC_` / `VITE_` / `EXPO_PUBLIC_` — Artigos 3 e 7)
- [ ] Backup/snapshot validado caso haja migração de banco de dados
- [ ] `CHANGELOG.md` atualizado, suíte de testes completa e `node scripts/verificar-governanca.mjs` aprovados
- [ ] *Smoke check* pós-deploy planejado para validar a versão publicada
