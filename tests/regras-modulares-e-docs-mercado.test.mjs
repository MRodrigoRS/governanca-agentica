import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dirTemplateScripts = join(process.cwd(), 'template', 'scripts');

function copiarRecursivo(origem, destino) {
  mkdirSync(destino, { recursive: true });
  const entradas = readdirSync(origem, { withFileTypes: true });
  for (const entrada of entradas) {
    const camOrigem = join(origem, entrada.name);
    const camDestino = join(destino, entrada.name);
    if (entrada.isDirectory()) {
      copiarRecursivo(camOrigem, camDestino);
    } else {
      copyFileSync(camOrigem, camDestino);
    }
  }
}

function criarRepoTemporario() {
  const dir = join(tmpdir(), `test-gov-v4-f09-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  // Copia a pasta template/scripts inteira para scripts/
  const dirDestinoScripts = join(dir, 'scripts');
  copiarRecursivo(dirTemplateScripts, dirDestinoScripts);

  return {
    dir,
    limpar() {
      try { rmSync(dir, { recursive: true, force: true }); } catch {}
    },
    executarVerificador(args = '') {
      try {
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, { cwd: dir, encoding: 'utf8' });
        return { exitCode: 0, stdout };
      } catch (err) {
        return { exitCode: err.status ?? 1, stderr: err.stderr?.toString() ?? '', stdout: err.stdout?.toString() ?? '' };
      }
    },
    executarHook(payload, hookType = 'pre-tool') {
      try {
        const stdout = execSync(`node scripts/hook-agente.mjs ${hookType}`, {
          cwd: dir,
          input: typeof payload === 'string' ? payload : JSON.stringify(payload),
          encoding: 'utf8'
        });
        return { exitCode: 0, stdout };
      } catch (err) {
        return { exitCode: err.status ?? 1, stderr: err.stderr?.toString() ?? '', stdout: err.stdout?.toString() ?? '' };
      }
    }
  };
}

test('deve_renderizar_modulos_conforme_perfil_e_wrappers_sem_duplicacao', () => {
  // 1. Checa copier.yml
  const conteudoCopier = readFileSync(join(process.cwd(), 'copier.yml'), 'utf8');
  assert.ok(conteudoCopier.includes('perfis_projeto:'), 'copier.yml deve conter pergunta perfis_projeto');
  assert.ok(conteudoCopier.includes('cli-biblioteca'), 'copier.yml deve listar opção cli-biblioteca');
  assert.ok(conteudoCopier.includes('web-ui'), 'copier.yml deve listar opção web-ui');
  assert.ok(conteudoCopier.includes('api-backend'), 'copier.yml deve listar opção api-backend');
  assert.ok(conteudoCopier.includes('jogo'), 'copier.yml deve listar opção jogo');

  // 2. Checa módulos em template/.agents/rules/
  const dirRules = join(process.cwd(), 'template', '.agents', 'rules');
  assert.ok(existsSync(join(dirRules, 'web-ui-pwa.md.jinja')), 'web-ui-pwa.md.jinja deve existir');
  assert.ok(existsSync(join(dirRules, 'backend-seguranca-dados.md.jinja')), 'backend-seguranca-dados.md.jinja deve existir');
  assert.ok(existsSync(join(dirRules, 'jogos-engines.md.jinja')), 'jogos-engines.md.jinja deve existir');
  assert.ok(existsSync(join(dirRules, 'linear-mcp.md.jinja')), 'linear-mcp.md.jinja deve existir');

  const webUi = readFileSync(join(dirRules, 'web-ui-pwa.md.jinja'), 'utf8');
  assert.ok(webUi.includes('trigger: glob'), 'web-ui-pwa deve ter trigger glob');
  assert.match(webUi, /^globs:\s*"[^"]+"/m, 'web-ui-pwa deve declarar globs como string');
  assert.ok(webUi.includes('**/*.tsx'), 'web-ui-pwa deve conter glob tsx');

  const backend = readFileSync(join(dirRules, 'backend-seguranca-dados.md.jinja'), 'utf8');
  assert.ok(backend.includes('trigger: glob'), 'backend deve ter trigger glob');
  assert.match(backend, /^globs:\s*"[^"]+"/m, 'backend deve declarar globs como string');
  assert.ok(backend.includes('**/api/**'), 'backend deve conter glob api');

  const jogos = readFileSync(join(dirRules, 'jogos-engines.md.jinja'), 'utf8');
  assert.ok(jogos.includes('trigger: glob'), 'jogos deve ter trigger glob');
  assert.match(jogos, /^globs:\s*"[^"]+"/m, 'jogos deve declarar globs como string');
  assert.ok(jogos.includes('**/*.gd'), 'jogos deve conter glob gd');

  const linear = readFileSync(join(dirRules, 'linear-mcp.md.jinja'), 'utf8');
  assert.ok(linear.includes('trigger: model_decision'), 'linear deve ter trigger model_decision');

  // 3. Padrão Universal Puro: garante ausência de wrappers proprietários de regras
  const dirClaude = join(process.cwd(), 'template', '.claude', 'rules');
  const dirCursor = join(process.cwd(), 'template', '.cursor', 'rules');
  const dirGithub = join(process.cwd(), 'template', '.github', 'instructions');

  assert.strictEqual(existsSync(dirClaude), false, 'template/.claude/rules nao deve existir no Padrao Universal');
  assert.strictEqual(existsSync(dirCursor), false, 'template/.cursor/rules nao deve existir no Padrao Universal');
  assert.strictEqual(existsSync(dirGithub), false, 'template/.github/instructions nao deve existir no Padrao Universal');
});

test('deve_bloquear_variavel_ambiente_omitida_ou_segredo_real_no_env_example', () => {
  const repo = criarRepoTemporario();
  try {
    // Configura delta ativo para passar pelo vínculo do OpenSpec
    const dirDelta = join(repo.dir, 'openspec', 'changes', 'fatia-01-teste');
    mkdirSync(dirDelta, { recursive: true });
    writeFileSync(join(dirDelta, '.openspec.yaml'), 'schema: spec-driven\n');
    writeFileSync(join(dirDelta, 'proposal.md'), '## Por que\nTeste\n## O que muda\nTeste\n## Fica de Fora\nNada\n'.repeat(3));
    const dirSpecs = join(dirDelta, 'specs');
    mkdirSync(dirSpecs, { recursive: true });
    writeFileSync(join(dirSpecs, 'spec.md'), '### Requirement: R1\n#### Scenario: S1\nWHEN x\nTHEN y\n');
    writeFileSync(join(dirDelta, 'design.md'), '## Contratos, Dados e Schemas\nx\n## Interface e Estados Assíncronos\nNão se aplica: backend\n## Regras de Negócio e Segurança\ny\n'.repeat(5));
    writeFileSync(join(dirDelta, 'tasks.md'), '## Tarefas\n- [ ] 1. Test-First Vermelho teste falhando\n## Roteiro de Validação Prática\nPasso a passo\n'.repeat(4));

    // Roadmap com fatia-01-teste
    const dirRoadmap = join(repo.dir, 'openspec');
    mkdirSync(dirRoadmap, { recursive: true });
    writeFileSync(join(dirRoadmap, 'roadmap.md'), `### [ ] Pendente — fatia-01-teste\n- **Depende de:** nenhuma\n- **Objetivo de Valor:** Teste\n- **O que ENTRA:** Tudo\n- **O que FICA DE FORA:** Nada\n`);

    // Criar pasta de arquivo para não cair no modo fundação
    mkdirSync(join(repo.dir, 'openspec', 'changes', 'archive', 'fatia-00'), { recursive: true });

    // Código de produção que usa process.env.SERVICO_API_KEY
    mkdirSync(join(repo.dir, 'src'), { recursive: true });
    writeFileSync(join(repo.dir, 'src', 'pagamento.ts'), 'export const pagar = () => process.env.SERVICO_API_KEY;');
    writeFileSync(join(repo.dir, '.env.example'), 'OUTRA_VAR=123\n');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n\n## [1.0.0]\n\n### Modificado\n- ajuste em pagamento\n');

    execSync('git add openspec/ src/pagamento.ts .env.example CHANGELOG.md', { cwd: repo.dir });

    // Caso A: variável omitida do .env.example -> deve falhar
    const resA = repo.executarVerificador();
    assert.strictEqual(resA.exitCode, 1, 'Deve rejeitar commit com variável de ambiente ausente no .env.example');
    assert.ok(resA.stdout.includes('SERVICO_API_KEY') || resA.stderr.includes('SERVICO_API_KEY'), 'Deve citar o nome da variável ausente');

    // Caso B: variável declarada no .env.example -> deve passar
    writeFileSync(join(repo.dir, '.env.example'), 'OUTRA_VAR=123\nSERVICO_API_KEY=\n');
    execSync('git add .env.example', { cwd: repo.dir });
    const resB = repo.executarVerificador();
    assert.strictEqual(resB.exitCode, 0, `Deve aprovar quando variável está presente: ${resB.stderr || resB.stdout}`);

    // Caso C: segredo real inserido no .env.example -> deve bloquear
    writeFileSync(join(repo.dir, '.env.example'), 'SERVICO_API_KEY=sk_live_51Hxyz1234567890abcdef1234567890\n');
    execSync('git add .env.example', { cwd: repo.dir });
    const resC = repo.executarVerificador();
    assert.strictEqual(resC.exitCode, 1, 'Deve rejeitar segredo real no .env.example');
    assert.ok(resC.stdout.includes('segredo') || resC.stdout.includes('secret') || resC.stderr.includes('segredo'), 'Deve alertar sobre segredo real');
  } finally {
    repo.limpar();
  }
});

test('deve_exigir_arquitetura_md_quando_schema_mudar', () => {
  const repo = criarRepoTemporario();
  try {
    // Configura delta ativo
    const dirDelta = join(repo.dir, 'openspec', 'changes', 'fatia-01-teste');
    mkdirSync(dirDelta, { recursive: true });
    writeFileSync(join(dirDelta, '.openspec.yaml'), 'schema: spec-driven\n');
    writeFileSync(join(dirDelta, 'proposal.md'), '## Por que\nTeste\n## O que muda\nTeste\n## Fica de Fora\nNada\n'.repeat(3));
    const dirSpecs = join(dirDelta, 'specs');
    mkdirSync(dirSpecs, { recursive: true });
    writeFileSync(join(dirSpecs, 'spec.md'), '### Requirement: R1\n#### Scenario: S1\nWHEN x\nTHEN y\n');
    writeFileSync(join(dirDelta, 'design.md'), '## Contratos, Dados e Schemas\nx\n## Interface e Estados Assíncronos\nNão se aplica: backend\n## Regras de Negócio e Segurança\ny\n'.repeat(5));
    writeFileSync(join(dirDelta, 'tasks.md'), '## Tarefas\n- [ ] 1. Test-First Vermelho teste falhando\n## Roteiro de Validação Prática\nPasso a passo\n'.repeat(4));

    const dirRoadmap = join(repo.dir, 'openspec');
    mkdirSync(dirRoadmap, { recursive: true });
    writeFileSync(join(dirRoadmap, 'roadmap.md'), `### [ ] Pendente — fatia-01-teste\n- **Depende de:** nenhuma\n- **Objetivo de Valor:** Teste\n- **O que ENTRA:** Tudo\n- **O que FICA DE FORA:** Nada\n`);
    mkdirSync(join(repo.dir, 'openspec', 'changes', 'archive', 'fatia-00'), { recursive: true });

    // Cria schema de banco alterado
    mkdirSync(join(repo.dir, 'prisma'), { recursive: true });
    writeFileSync(join(repo.dir, 'prisma', 'schema.prisma'), 'model Usuario { id Int @id }');
    execSync('git add openspec/ prisma/schema.prisma', { cwd: repo.dir });

    // Caso A: alterou schema sem docs/arquitetura.md staged -> bloqueia
    const resA = repo.executarVerificador();
    assert.strictEqual(resA.exitCode, 1, 'Deve bloquear alteração de schema sem docs/arquitetura.md staged');
    assert.ok(resA.stdout.includes('arquitetura.md') || resA.stderr.includes('arquitetura.md'), 'Deve citar docs/arquitetura.md');

    // Caso B: incluiu docs/arquitetura.md staged -> aprova
    mkdirSync(join(repo.dir, 'docs'), { recursive: true });
    writeFileSync(join(repo.dir, 'docs', 'arquitetura.md'), '# Arquitetura do Sistema\nC4 e Diagramas');
    execSync('git add docs/arquitetura.md', { cwd: repo.dir });
    const resB = repo.executarVerificador();
    assert.strictEqual(resB.exitCode, 0, `Deve aprovar quando docs/arquitetura.md está staged: ${resB.stderr || resB.stdout}`);
  } finally {
    repo.limpar();
  }
});

test('deve_bloquear_leitura_de_env_pelo_agente', () => {
  const repo = criarRepoTemporario();
  try {
    // Caso A: tentativa de read_file em .env
    const payloadReadFile = {
      tool_name: 'read_file',
      tool_input: { Path: join(repo.dir, '.env') }
    };
    const resA = repo.executarHook(payloadReadFile);
    assert.ok(resA.stdout.includes('deny') || resA.stdout.includes('bloqueada'), 'Deve retornar deny para leitura de .env');

    // Caso B: tentativa de comando de terminal inspecionando .env
    const payloadCat = {
      tool_name: 'run_command',
      tool_input: { CommandLine: 'cat .env' }
    };
    const resB = repo.executarHook(payloadCat);
    assert.ok(resB.stdout.includes('deny') || resB.stdout.includes('bloqueada'), 'Deve retornar deny para comando lendo .env');

    // Caso C: leitura permitida de .env.example
    const payloadExemplo = {
      tool_name: 'read_file',
      tool_input: { Path: join(repo.dir, '.env.example') }
    };
    const resC = repo.executarHook(payloadExemplo);
    assert.ok(!resC.stdout.includes('deny'), 'Deve permitir leitura de .env.example');
  } finally {
    repo.limpar();
  }
});

test('deve_fornecer_kit_de_docs_comandos_do_projeto_e_gitignore', () => {
  // 1. docs/arquitetura.md com C4, erDiagram e Glossário
  const arqMd = join(process.cwd(), 'template', 'docs', 'arquitetura.md');
  assert.ok(existsSync(arqMd), 'template/docs/arquitetura.md deve existir');
  const conteudoArq = readFileSync(arqMd, 'utf8');
  assert.ok(conteudoArq.includes('C4') || conteudoArq.includes('Contexto'), 'Deve conter seção C4');
  assert.ok(conteudoArq.includes('erDiagram'), 'Deve conter seção erDiagram');
  assert.ok(conteudoArq.includes('Glossário de Domínio') || conteudoArq.includes('Glossário'), 'Deve conter Glossário');

  // 2. README.md.jinja e .env.example
  assert.ok(existsSync(join(process.cwd(), 'template', 'README.md.jinja')), 'README.md.jinja deve existir');
  assert.ok(existsSync(join(process.cwd(), 'template', '.env.example')), '.env.example deve existir');

  // 3. .gitignore contendo .env e ignorando .env.example
  const gitignore = join(process.cwd(), 'template', '.gitignore');
  assert.ok(existsSync(gitignore), 'template/.gitignore deve existir');
  const conteudoGitignore = readFileSync(gitignore, 'utf8');
  assert.ok(conteudoGitignore.includes('.env'), '.gitignore deve ignorar .env');
  assert.ok(conteudoGitignore.includes('!.env.example'), '.gitignore deve manter .env.example');

  // 4. Seção ## Comandos do Projeto em template/AGENTS.md
  const agentsMd = readFileSync(join(process.cwd(), 'template', 'AGENTS.md'), 'utf8');
  assert.ok(agentsMd.includes('## Comandos do Projeto'), 'template/AGENTS.md deve conter ## Comandos do Projeto');

  // 5. copier.yml protege arquivos em _skip_if_exists
  const copierYml = readFileSync(join(process.cwd(), 'copier.yml'), 'utf8');
  assert.ok(copierYml.includes('"README.md"'), 'copier.yml deve proteger README.md');
  assert.ok(copierYml.includes('".env.example"'), 'copier.yml deve proteger .env.example');
  assert.ok(copierYml.includes('"docs/arquitetura.md"'), 'copier.yml deve proteger docs/arquitetura.md');
  assert.ok(copierYml.includes('".gitignore"'), 'copier.yml deve proteger .gitignore');
});

test('deve_sincronizar_versao_em_cabecalhos_e_preservar_historico', () => {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
  const versao = pkg.version;

  // 0. Validação real de sincronia de versão nos cabeçalhos universais e templates
  const agentsMd = readFileSync(join(process.cwd(), 'template', 'AGENTS.md'), 'utf8');
  const constitutionMd = readFileSync(join(process.cwd(), 'template', 'constitution.md'), 'utf8');
  const projectJinja = readFileSync(join(process.cwd(), 'template', 'openspec', 'project.md.jinja'), 'utf8');
  const catalogoStacks = readFileSync(join(process.cwd(), 'template', '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'), 'utf8');

  assert.ok(agentsMd.includes(`governanca:inicio v${versao}`), `template/AGENTS.md deve ter cabeçalho v${versao}`);
  assert.ok(constitutionMd.includes(`governanca:inicio v${versao}`), `template/constitution.md deve ter cabeçalho v${versao}`);
  assert.ok(projectJinja.includes(`Governança v${versao}`), `project.md.jinja deve referenciar Governança v${versao}`);
  assert.ok(catalogoStacks.includes(`Governança v${versao}`), `catalogo-stacks.md deve referenciar Governança v${versao}`);

  // Garante remoção de CLAUDE.md, GEMINI.md e copilot-instructions.md redundantes
  assert.strictEqual(existsSync(join(process.cwd(), 'template', 'CLAUDE.md')), false, 'template/CLAUDE.md deve ser removido');
  assert.strictEqual(existsSync(join(process.cwd(), 'template', 'GEMINI.md')), false, 'template/GEMINI.md deve ser removido');
  assert.strictEqual(existsSync(join(process.cwd(), 'template', '.github', 'copilot-instructions.md')), false, 'copilot-instructions.md deve ser removido');

  // 1. Arquivamento dos 8 arquivos históricos
  const dirHistorico = join(process.cwd(), 'docs', 'historico');
  const arquivosHistoricosEsperados = [
    'PROPOSTA_KIT_GOVERNANCA_AGENTICA.md',
    'PIVOT_ARQUITETURAL_GOVERNANCA_V2.md',
    'ESTRATEGIA_DE_PRESETS_E_STACKS_ROBUSTAS.md',
    'SINTESE_FRAMEWORKS_SDD_E_GOVERNANCA_V2.md',
    'PROPOSTA_DISTRIBUICAO_E_ATUALIZACAO.md',
    'PROPOSTA_CERIMONIA_E_ENFORCEMENT.md',
    'ARQUITETURA_PROGENITORA_E_SATELITES.md',
    'REVISAO_2026-10-27.md'
  ];

  for (const arq of arquivosHistoricosEsperados) {
    assert.ok(existsSync(join(dirHistorico, arq)), `Arquivo histórico ${arq} deve existir em docs/historico/`);
    assert.ok(!existsSync(join(process.cwd(), arq)), `Arquivo ${arq} não deve mais existir na raiz`);
  }

  // 2. Links em 00_INDICE_E_DECISOES.md
  const indice = readFileSync(join(process.cwd(), '00_INDICE_E_DECISOES.md'), 'utf8');
  for (const arq of arquivosHistoricosEsperados) {
    assert.ok(indice.includes(`docs/historico/${arq}`), `00_INDICE_E_DECISOES.md deve apontar para docs/historico/${arq}`);
  }

  // 3. CONTRIBUTING.md deve existir
  assert.ok(existsSync(join(process.cwd(), 'CONTRIBUTING.md')), 'CONTRIBUTING.md deve existir com ritual de release');
});

test('deve_ter_skill_auditoria_ux_analytics_sob_demanda_e_registrada_em_agents_md', () => {
  const skillPath = join(process.cwd(), 'template', '.agents', 'skills', 'auditoria-ux-analytics', 'SKILL.md');
  assert.ok(existsSync(skillPath), 'Skill auditoria-ux-analytics/SKILL.md deve existir');

  const skill = readFileSync(skillPath, 'utf8');
  assert.match(skill, /PostHog/i);
  assert.match(skill, /Microsoft Clarity/i);
  assert.match(skill, /LGPD|maskAllInputs/i);
  assert.match(skill, /CSP|Content-Security-Policy/i);

  const agentsMd = readFileSync(join(process.cwd(), 'template', 'AGENTS.md'), 'utf8');
  assert.match(agentsMd, /auditoria-ux-analytics/);
  assert.match(agentsMd, /\/auditar-ux/);
});

test('deve_blindar_seguranca_em_3_camadas_e_linguagem_humana_sem_jargao_na_ui', () => {
  const backendRule = readFileSync(join(process.cwd(), 'template', '.agents', 'rules', 'backend-seguranca-dados.md.jinja'), 'utf8');
  assert.match(backendRule, /IDOR/i);
  assert.match(backendRule, /Mass Assignment/i);
  assert.match(backendRule, /HMAC/i);
  assert.match(backendRule, /HttpOnly/i);
  assert.match(backendRule, /magic bytes/i);
  assert.match(backendRule, /SSRF/i);

  const webRule = readFileSync(join(process.cwd(), 'template', '.agents', 'rules', 'web-ui-pwa.md.jinja'), 'utf8');
  assert.match(webRule, /Zero Jargão Técnico/i);
  assert.match(webRule, /payload/i);
  assert.match(webRule, /tabela|registro/i);
  assert.match(webRule, /SNAKE_CASE/i);
  assert.match(webRule, /dangerouslySetInnerHTML/i);

  const constitution = readFileSync(join(process.cwd(), 'template', 'constitution.md'), 'utf8');
  assert.match(constitution, /Linguagem Humana e Zero Jargão Técnico na Interface/i);
  assert.match(constitution, /IDOR\/BOLA/i);
  assert.match(constitution, /Mass Assignment/i);

  const revisarSkill = readFileSync(join(process.cwd(), 'template', '.agents', 'skills', 'revisar-fatia', 'SKILL.md'), 'utf8');
  assert.match(revisarSkill, /IDOR \/ BOLA/i);
  assert.match(revisarSkill, /Anti-Mass Assignment/i);
  assert.match(revisarSkill, /Zero Jargão Técnico na UI/i);

  const secSkillPath = join(process.cwd(), 'template', '.agents', 'skills', 'auditoria-seguranca', 'SKILL.md');
  assert.ok(existsSync(secSkillPath), 'Skill auditoria-seguranca/SKILL.md deve existir');
  const secSkill = readFileSync(secSkillPath, 'utf8');
  assert.match(secSkill, /3 subagentes/i);
  assert.match(secSkill, /Via 1a \(`?\/fix`?\)/i);
  assert.match(secSkill, /Via 1\.5/i);
  assert.match(secSkill, /Via 2/i);

  const agentsMd = readFileSync(join(process.cwd(), 'template', 'AGENTS.md'), 'utf8');
  assert.match(agentsMd, /auditoria-seguranca/);
  assert.match(agentsMd, /\/auditar-seguranca/);
});
