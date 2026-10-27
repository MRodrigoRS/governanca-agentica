<!-- governanca:inicio v2.0.0 — não edite este bloco; alterações no repositório da governança -->
# Constituição do Projeto — Governança v2

> **Papel:** Lei Suprema do repositório. Cláusulas pétreas obrigatórias para agentes de IA e desenvolvedores humanos.
> **Enforcement:** Estas cláusulas não são sugestões textuais. São auditadas determinísticamente por Git hooks (`Lefthook + Gitleaks + verificar-governanca.mjs`) e pelo GitHub Actions CI. Qualquer violação bloqueia commits e builds (`exit 1`).

---

## Artigo 1 — Cláusula Anti-Brinquedo (Bases Robustas)

1. É expressamente proibido iniciar qualquer aplicação interativa (Web, Programa de Computador Desktop ou Mobile) com arquivos avulsos (como HTML/CSS/JS soltos na web ou scripts Tkinter/PyQt amadores num único arquivo no desktop), sem tipagem estrita, sem empacotamento profissional e sem componentes reutilizáveis.
2. Toda aplicação interativa parte obrigatoriamente de uma stack do catálogo oficial (ou aprovada no Gate 0) e deve garantir desde o primeiro commit:
   - **Tipagem Estrita:** TypeScript com `"strict": true` em `tsconfig.json`, Rust, C#/.NET ou Python com type hints completos validados por `mypy` ou `pyright`.
   - **Validação de Entradas na Fronteira:** Esquemas declarativos (ex.: Zod no ecossistema JS/TS, Pydantic em Python, Serde em Rust) validando dados externos em rotas de API, pontes IPC (Desktop), formulários, parâmetros de URL, cookies e webhooks.
   - **Design System Modular:** Interface construída com base em componentes consistentes e reutilizáveis (ex.: Tailwind CSS + shadcn/ui ou equivalente nativo).
   - **Testes Automatizados Ativos:** Executor de testes configurado e ao menos um teste de sanidade passando desde a inicialização.
3. **Exceção Única:** Protótipos descartáveis ou documentos HTML puramente estáticos, desde que formalmente aprovados como exceção no Gate 0.

---

## Artigo 2 — Test-First Mandatório (Vermelho → Verde → Refatorar)

1. Nenhum código de produção deve ser implementado sem que antes exista um teste automatizado falhando que especifique o comportamento desejado.
2. O ciclo obrigatório de desenvolvimento é:
   - **Vermelho:** Escrever o teste automatizado unitário ou de integração e executá-lo no terminal, comprovando que ele falha pelo motivo esperado.
   - **Verde:** Escrever o código mínimo de produção necessário para fazer o teste passar.
   - **Refatorar:** Limpar o código, eliminar duplicações, aplicar tipagem e garantir que todos os testes continuem verdes.
3. **Comprovação no Gate 2:** A apresentação da entrega deve conter obrigatoriamente as duas saídas de terminal: a execução com falha (vermelho) e a execução com sucesso (verde). Sem essa comprovação, a entrega é inválida.

---

## Artigo 3 — Zero Segredos e Proteção de Credenciais

1. É terminantemente proibido comitar chaves de API, senhas, tokens de autenticação, certificados privados ou arquivos de ambiente sensíveis (`.env`, `.env.local`, etc.).
2. Toda variável de configuração sensível deve ser injetada via variáveis de ambiente ou gerenciadores de segredos seguros.
3. O repositório utiliza **Gitleaks** no pre-commit e no CI. A detecção de qualquer segredo no código em staging bloqueia a operação imediatamente.

---

## Artigo 4 — Zero Testes Quebrados e Build Limpo

1. Nenhum commit pode ser realizado com testes automatizados falhando, avisos graves de linter ou erros de compilação e verificação de tipos.
2. O branch principal (`main` ou `master`) é sagrado e deve estar sempre em estado implantável em produção.

---

## Artigo 5 — Dependências Justificadas e Não-Reinvenção

1. Não reinvente soluções clássicas da engenharia de software (autenticação, ORMs, validação de schema, parsing de datas).
2. Toda nova dependência adicionada aos arquivos de manifesto (`package.json`, `pyproject.toml`, etc.) deve ser explicitamente listada e justificada tecnicamente no plano de implementação (Gate 1).

---

## Artigo 6 — Padrões Práticos de Engenharia Frontend

1. **Reatividade Limpa:** É proibido forçar atualização de estado com recarregamento completo da página (`location.reload`, `window.location.href`). O estado deve ser reativo e gerenciado pela biblioteca de UI.
2. **Semântica e Acessibilidade:** Uso obrigatório de elementos HTML semânticos (`<main>`, `<nav>`, `<button>`, `<header>`, `<article>`), atributos `aria-*` onde necessário e labels associados a todos os campos de formulário.
3. **Alvos de Toque e Clique:** Botões e elementos interativos devem possuir área clicável mínima de 44x44 pixels para garantir usabilidade em dispositivos móveis.
4. **Comportamento do Teclado:** A tecla `Escape` (`Esc`) deve obrigatoriamente fechar modais, gavetas laterais (drawers), menus suspensos e diálogos abertos.
5. **Tratamento Integral de Estados Assíncronos:** Toda interface que consome dados assíncronos deve implementar explicitamente os 4 estados fundamentais:
   - **Carregando (loading):** Indicador visual claro (skeleton ou spinner).
   - **Vazio (empty):** Mensagem contextual orientando a ação do usuário quando não houver dados.
   - **Erro (error):** Notificação legível com opção de tentar novamente.
   - **Sucesso (success):** Exibição correta do conteúdo recebido.

---

## Artigo 7 — Padrões Práticos de Engenharia Backend e Zero-Trust

1. **Zero-Trust no Cliente (Anti-F12):** Nunca confie em validações, identidades ou regras de negócio validadas apenas no cliente. O backend deve validar e autorizar rigorosamente cada requisição antes de persistir dados.
2. **Integridade Transacional (ACID):** Operações que envolvem alterações em múltiplos registros ou tabelas devem ser encapsuladas em transações atômicas de banco de dados.
3. **Segurança de Tráfego e Cabeçalhos:** Ambientes de produção devem aplicar cabeçalhos de segurança essenciais: Content Security Policy (CSP), HTTP Strict Transport Security (HSTS) e CORS estritamente configurado.
4. **Prevenção de Abuso:** Endpoints públicos e operações sensíveis (login, recuperação de senha, pagamentos, geração de IA) devem implementar Rate Limiting determinístico.
5. **OWASP Top 10 e OWASP Agentic Top 10:** Proteção ativa contra injeção SQL/NoSQL, CSRF, SSRF, injeção de prompt indireta e execução inadvertida de ferramentas por agentes autônomos.

---

## Artigo 8 — Honestidade Radical, Fatias Detalhadas (Anti-Preguiça) e Gates Humanos

1. O agente nunca deve fingir que testou, esconder bugs conhecidos ou adular decisões equivocadas.
2. **Entrevista Exaustiva e Decomposição em Fatias Incrementais:** O humano não tem obrigação de saber dividir um sistema complexo na ordem técnica de implementação. É dever exclusivo do agente conduzir uma entrevista exaustiva de produto (polindo o que entra e o que fica de fora) e decompor o sistema completo em fatias incrementais onde uma ponta puxa a outra.
3. **Cláusula Anti-Preguiça no Planejamento:** É proibido comprimir o planejamento das fatias em listas superficiais de um único arquivo. Cada fatia deve ter seu próprio documento completo em `openspec/roadmap/fatia-XX-<slug>.md` com as 7 seções obrigatórias de `_template-fatia.md` (auditado por `verificar-governanca.mjs`), detalhado o suficiente para que até um agente mais simples consiga implementá-la sem adivinhar regras.
4. São marcos obrigatórios com intervenção humana:
   - **Gate 0:** Aprovação do escopo polido, da stack tecnológica/VPS/MCPs e do Mapa de Fatias Incrementais (`openspec/roadmap/`).
   - **Gate 1:** Aprovação do plano, desenho técnico e tarefas antes da implementação de Nível 2.
   - **Gate 2:** Aprovação da entrega mediante evidências reais de teste, diff limpo e `CHANGELOG.md` atualizado, seguida pelo acionamento proativo da próxima fatia da fila.

---

## Artigo 9 — Circuit Breaker de 3 Tentativas

Se durante a execução de uma tarefa o agente falhar 3 vezes consecutivas no mesmo teste, comando ou problema arquitetural:
1. O agente deve parar imediatamente a execução automatizada.
2. É proibido tentar uma 4ª vez às cegas ou alterar o teste para fazê-lo passar artificialmente.
3. O agente deve reportar ao humano a hipótese testada, o log da falha e solicitar orientação antes de prosseguir.

---

## Artigo 10 — Idioma (Português no Domínio), Rastreabilidade e CHANGELOG

1. **Português Brasileiro no Domínio e no Código:** Nomes de entidades, regras de negócio, tabelas de banco, variáveis, funções, classes, especificações e mensagens de commit devem ser escritos em **Português do Brasil (PT-BR)** (ex.: `obterUsuario`, `salvarPedido`, `calcularDesconto`, `cliente`).
2. **Termos Técnicos Universais em Inglês:** Termos técnicos universais e convenções de bibliotecas/frameworks (`id`, `payload`, `props`, `handler`, `middleware`, `token`, `status`, `req`, `res`) permanecem em **Inglês (EN)** sem tradução forçada.
3. Todo commit que alterar lógica de produção (`feat`, `fix`, `perf`, `refactor`) deve conter a atualização correspondente do delta consolidado em `CHANGELOG.md` no padrão *Keep a Changelog*.
<!-- governanca:fim -->

## Cláusulas Adicionais Deste Projeto

*(Adicione abaixo cláusulas pétreas específicas deste projeto, como conformidade regulatória LGPD/GDPR, SLAs específicos ou integrações obrigatórias. Este bloco é preservado durante as atualizações da governança).*
