# Proposta — Fatia 06: Documentos de Particularidades e Aprendizados Protegidos no Copier

## Why
Ao longo da evolução de repositórios sob a governança v2, identificou-se um problema recorrente: agentes de IA tendem a concentrar restrições de infraestrutura, portas locais, regras de hospedagem e incidentes superados diretamente no `template/AGENTS.md`, gerando inchaço e saturação desnecessária de contexto (*context rot*).

Além disso, quando equipes registravam particularidades ou aprendizados em arquivos locais avulsos, a execução de `uvx copier update` corria o risco de sobrescrever ou apagar essas memórias vitais do projeto.

Para solucionar isso definitivamente:
1. Instituem-se dois documentos canônicos de primeira classe: `docs/particularidades.md` e `docs/aprendizados.md`.
2. Ambos são blindados determinísticamente contra sobrescrita no Copier através da inclusão em `_skip_if_exists` no `copier.yml`.
3. O `template/AGENTS.md` recebe ponteiros limpos de leitura sob demanda (leitura antes de alterar infra/ambiente e leitura no Gate 1 para prevenir repetição de erros).

## What Changes
1. **Modelos Canônicos no Template:**
   - Criação de `template/docs/particularidades.md` com 4 seções temáticas padronizadas (Infraestrutura/Hospedagem, Banco/Persistência, Provedores/Webhooks, Regras de Domínio Não-Óbvias).
   - Criação de `template/docs/aprendizados.md` com cabeçalho de governança e modelo de preenchimento de cicatrizes empíricas.
2. **Blindagem no Copier (`copier.yml`):**
   - Inclusção de `"docs/particularidades.md"` e `"docs/aprendizados.md"` na lista `_skip_if_exists`.
3. **Amarração em `template/AGENTS.md`:**
   - Inclusão dos ponteiros na Seção 6 de recursos e ferramentas.
4. **Testes Automatizados Unitários:**
   - Criação de `tests/template-docs.test.mjs` testando a existência física, a integridade do template e a presença no `copier.yml`.
