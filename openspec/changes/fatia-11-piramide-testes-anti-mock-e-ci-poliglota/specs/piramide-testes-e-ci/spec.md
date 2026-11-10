# Especificação: piramide-testes-e-ci

## ADDED Requirements

### Requirement: Sensor Anti-Mocking e Anti-Spy de Banco Próprio
O verificador determinístico de governança (`verificar-governanca.mjs`) SHALL detectar e bloquear tentativas de mockar ou espionar o cliente de banco de dados ou ORM interno do projeto em arquivos de teste, permitindo mocks apenas para chamadas a serviços/APIs de terceiros, salvo se acompanhado de válvula formal justificada.

#### Scenario: Bloqueio de mock ou spy de prisma ou db em TS/JS
- **GIVEN** um arquivo de teste JavaScript/TypeScript modificado
- **WHEN** contiver chamadas como `vi.mock('...prisma...')`, `jest.mock('...db...')`, `vi.spyOn(prisma...)`, ou atribuições diretas `.mockResolvedValue` sobre models de banco sem a tag de escape
- **THEN** o verificador SHALL falhar com código de saída 1 e orientar o uso de SQLite in-memory, PGlite ou banco real de teste.

#### Scenario: Bloqueio de patch de sessão de banco em Python ancorado
- **GIVEN** um arquivo de teste Python modificado
- **WHEN** contiver `@patch('...db.session...')`, `@patch('...SessionLocal...')`, ou similar ancorado em persistência
- **THEN** o verificador SHALL falhar com código de saída 1.

#### Scenario: Permissão para clientes HTTP externos e SDKs de terceiros
- **GIVEN** um arquivo de teste Python ou TypeScript
- **WHEN** contiver `@patch('requests.Session.post')`, `@patch('aiohttp.ClientSession')` ou `vi.mock('@/lib/stripe')`
- **THEN** o verificador SHALL aprovar o teste sem falso positivo.

#### Scenario: Uso de válvula auditável
- **GIVEN** um arquivo de teste que simula falha física de conexão de driver
- **WHEN** incluir o comentário `governanca:mock-banco-justificado: <motivo técnico com ao menos 15 caracteres>`
- **THEN** o verificador SHALL aprovar o arquivo.

### Requirement: Testes no Pre-Commit e Pre-Push do Lefthook
A configuração do Lefthook (`template/lefthook.yml`) SHALL executar testes unitários rápidos no gancho `pre-commit` e suíte automatizada poliglota no gancho `pre-push`.

#### Scenario: Execução rápida no pre-commit
- **GIVEN** um repositório configurado com a governança
- **WHEN** o desenvolvedor ou agente executar `git commit`
- **THEN** o Lefthook SHALL rodar a suíte de testes rápidos da stack ativa para garantir o Artigo 4 antes do commit.

#### Scenario: Execução poliglota no pre-push
- **GIVEN** um repositório poliglota contendo Node, Python, Rust, .NET ou Godot 4
- **WHEN** for executado `git push`
- **THEN** o Lefthook SHALL disparar os comandos de teste completos para cada tecnologia detectada, ignorando de forma segura e com aviso amigável caso o binário `godot` não esteja no `PATH` local.

### Requirement: CI Poliglota Íntegro e Validação de Lockfile
O workflow de integração contínua (`template/.github/workflows/ci.yml`) SHALL exigir a presença estrita de um lockfile versionado quando existir `package.json`, executar a validação de mensagem de commit e fornecer cobertura nativa poliglota.

#### Scenario: Falha estrita na ausência de lockfile
- **GIVEN** um repositório contendo `package.json`
- **WHEN** nenhum lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb` ou `bun.lock`) estiver versionado
- **THEN** o CI SHALL falhar imediatamente com erro claro sem executar fallback inseguro `npm install`.

#### Scenario: Validação de mensagem de commit no CI
- **GIVEN** um commit ou PR enviado para o repositório
- **WHEN** o job de governança rodar no GitHub Actions
- **THEN** ele SHALL executar `node scripts/validar-commit-msg.mjs` contra a mensagem do commit.

#### Scenario: Cobertura nativa para Godot e .NET
- **GIVEN** um projeto de jogo Godot 4 com GUT ou projeto .NET/Avalonia
- **WHEN** o pipeline de CI for executado
- **THEN** o CI SHALL executar `godot --headless -s addons/gut/gut_cmdln.gd -gexit` ou `dotnet test`.

### Requirement: Desburocratização de Subagentes e Fluxo Regular Ágil
A governança SHALL definir que a convocação de subagentes para auditoria/inspeção é opcional e sob demanda através do comando `/revisar`, permitindo que o Gate 2 regular seja direto, baseado na execução de testes reais determinísticos e no checklist prático do usuário.

#### Scenario: Conclusão de fatia sem subagente compulsório
- **GIVEN** uma fatia concluída com testes automatizados 100% verdes
- **WHEN** o agente apresentar o Gate 2
- **THEN** a validação SHALL apoiar-se em laudo de testes reais executados e no roteiro prático do usuário, sem necessidade de subagente compulsório, economizando tempo e tokens.

### Requirement: Graduação para Release Estável v4.0.0
A governança SHALL atualizar os manifestos e documentações para a versão estável `4.0.0`.

#### Scenario: Sincronização de versão v4.0.0
- **GIVEN** a conclusão da Fatia 11
- **WHEN** inspecionado o `package.json`, `CHANGELOG.md` e cabeçalhos `governanca:inicio`
- **THEN** a versão SHALL ser exatamente `4.0.0` estável (sem sufixos alpha/pre-release).
