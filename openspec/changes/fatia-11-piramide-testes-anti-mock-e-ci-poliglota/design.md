# Design Técnico: fatia-11-piramide-testes-anti-mock-e-ci-poliglota

## 1. Visão Geral da Arquitetura
Esta fatia fecha os componentes práticos de execução e garantia de qualidade da Governança de Agentes v4.
A arquitetura se apoia em 5 pilares fundamentais:
1. **Sensor Determinístico Anti-Mocking no Verificador:**
   Implementação de inspeção de código estático em `template/scripts/verificar-governanca.mjs` focada exclusivamente em arquivos de teste modificados. A inspeção bloqueia qualquer tentativa de mockar, espionar ou injetar respostas falsas no cliente ou modelos do banco de dados/ORM do próprio projeto (como Prisma, Drizzle, SQLAlchemy, etc.). Chamadas externas legítimas como `requests.Session`, `aiohttp` e clientes de pagamento (`stripe`) continuam permitidas sem falsos positivos.
2. **Dupla Proteção Local no Lefthook:**
   Garante conformidade com o Artigo 4 da Constituição no momento real do Marco 2 humano (`git commit`). O hook `pre-commit` roda testes unitários rápidos (< 10-15s), impedindo commits com regressões de domínio. O hook `pre-push` executa a suíte poliglota completa, preparando o código para o pipeline remoto.
3. **Pipeline de CI Poliglota e Zero-Bypass:**
   O arquivo `.github/workflows/ci.yml` (tanto no template quanto na governança raiz) adota regras estritas: detecção precisa de lockfile com falha explícita se ausente, execução remota do `validar-commit-msg.mjs` contra commits do PR, e jobs para Node.js, Python (`uv` + `pytest`), Rust (`cargo test`), .NET (`dotnet test`) e Godot 4 (`godot --headless` com GUT).
4. **Desburocratização da Cerimônia de Subagentes:**
   A experiência com subagentes encadeados no Gate 2 revelou alto custo de tokens e atrito de tempo sem ganho proporcional de segurança, uma vez que os hooks determinísticos e testes locais já oferecem a barreira Zero-Trust. A inspeção por subagente passa a ser estritamente opcional sob demanda, acionável pelo usuário via `/revisar`.
5. **Estabilização da Versão v4.0.0:**
   Consolidação da versão final `4.0.0` nos manifestos do projeto, documentações e templates Copier.

## 2. Decisões Técnicas e Trade-offs
- **D37 — Anti-Mocking de Banco Próprio vs. Mocks de APIs Externas:**
  - *Decisão:* Proibir mocks em ORM/banco próprio mas permitir mocks em gateways e serviços de terceiros.
  - *Motivo:* Testes que mockam o próprio ORM não testam integridade referencial, constraints, schemas ou queries reais, gerando "teatro de testes". Para chamadas HTTP de terceiros, mockar é a prática recomendada para evitar chamadas de rede no CI.
- **D38 — Subagente como Ferramenta Sob Demanda (`/revisar`):**
  - *Decisão:* Retirar a invocação compulsória de subagentes do fluxo diário do Gate 2. O Gate 2 padrão apresenta o artefato de entrega com dados de testes reais e o checklist prático de validação humana.
  - *Motivo:* Feedback direto do usuário demonstrando que subagentes obrigatórios aumentam a latência e o consumo de tokens sem agregar benefício quando os testes determinísticos e o roteiro já estão verdes.
- **D39 — Lockfile Obrigatório no CI:**
  - *Decisão:* Remover `npm ci || npm install` e falhar com erro 1 se nenhum lockfile for detectado.
  - *Motivo:* Garantir determinismo e reprodutibilidade de compilação prevenindo vulnerabilidades de supply chain.

## 3. Riscos e Mitigações
- **Risco:** Projetos legados ou testes de adaptadores de erro de rede no banco serem impedidos de testar exceções de driver.
  - *Mitigação:* Válvula formal auditável `governanca:mock-banco-justificado: <motivo >= 15 chars>`.
- **Risco:** Desenvolvedor sem o binário `godot` instalado localmente falhar no `git push`.
  - *Mitigação:* Script de verificação no Lefthook verifica se `godot` está disponível no `PATH`. Se não estiver, emite aviso explicativo e permite o push, delegando a execução estrita para o container do GitHub Actions.
