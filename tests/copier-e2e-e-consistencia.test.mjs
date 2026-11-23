import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const raiz = process.cwd();

function criarTempDir(prefixo) {
  const dir = join(tmpdir(), `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function executarCopier(args, destino) {
  const cmd = `uvx copier copy --quiet ${args} "${raiz}" "${destino}"`;
  return execSync(cmd, { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

test('copier E2E defaults: gera projeto valido, sem rules 0-bytes e passa verificar-governanca no 1o commit', () => {
  const destino = criarTempDir('test-copier-defaults');
  try {
    executarCopier('--defaults --vcs-ref=HEAD', destino);

    // 1. Rules compatíveis com defaults (web-ui, api-backend) existem e são não-vazias
    const webRule = join(destino, '.agents', 'rules', 'web-ui-pwa.md');
    const backendRule = join(destino, '.agents', 'rules', 'backend-seguranca-dados.md');
    assert.ok(existsSync(webRule) && statSync(webRule).size > 0, 'web-ui-pwa.md deve existir e não ser vazio');
    assert.ok(existsSync(backendRule) && statSync(backendRule).size > 0, 'backend-seguranca-dados.md deve existir e não ser vazio');

    // 2. Rules condicionais falsas (jogo=false, integrar_linear=false) NÃO devem ser geradas com 0 bytes
    assert.strictEqual(
      existsSync(join(destino, '.agents', 'rules', 'jogos-engines.md')),
      false,
      'jogos-engines.md não deve ser gerado quando jogo não está em perfis_projeto'
    );
    assert.strictEqual(
      existsSync(join(destino, '.agents', 'rules', 'linear-mcp.md')),
      false,
      'linear-mcp.md não deve ser gerado quando integrar_linear=false'
    );

    // 3. Numeração sequencial em openspec/project.md sem salto de ## 4 para ## 6
    const projectMd = readFileSync(join(destino, 'openspec', 'project.md'), 'utf8');
    assert.ok(projectMd.includes('## 5. Comandos Essenciais'), 'Com integrar_linear=false, Comandos Essenciais deve ser ## 5');
    assert.strictEqual(projectMd.includes('## 6. Comandos Essenciais'), false, 'Não deve pular para ## 6');

    // 4. Primeiro commit limpo (git add . + verificar-governanca.mjs) deve aprovar com exitCode 0
    execSync('git init', { cwd: destino, stdio: 'ignore' });
    execSync('git config user.email "test@exemplo.com"', { cwd: destino, stdio: 'ignore' });
    execSync('git config user.name "Tester"', { cwd: destino, stdio: 'ignore' });
    execSync('git add .', { cwd: destino, stdio: 'ignore' });

    const saidaVerificador = execSync('node scripts/verificar-governanca.mjs --staged', {
      cwd: destino,
      encoding: 'utf8',
    });
    assert.match(saidaVerificador, /SUCESSO/i);

    // 5. hooks.json gerado deve funcionar tanto a partir da raiz quanto de .agents/
    const hooksConfig = JSON.parse(readFileSync(join(destino, '.agents', 'hooks.json'), 'utf8'));
    const cmdPreTool = hooksConfig['governanca-gate'].PreToolUse[0].hooks[0].command;
    const cmdSessionStart = hooksConfig['governanca-gate'].SessionStart[0].command;

    for (const cwdTeste of [destino, join(destino, '.agents')]) {
      const outPre = execSync(cmdPreTool, {
        cwd: cwdTeste,
        input: JSON.stringify({ toolCall: { name: 'run_command', args: { CommandLine: 'npm test' } } }),
        encoding: 'utf8',
      });
      assert.equal(JSON.parse(outPre).decision, 'allow', `pre-tool deve funcionar com cwd=${cwdTeste}`);

      const outStart = execSync(cmdSessionStart, {
        cwd: cwdTeste,
        input: JSON.stringify({ conversationId: 'teste-e2e' }),
        encoding: 'utf8',
      });
      assert.ok(Array.isArray(JSON.parse(outStart).injectSteps), `session-start deve funcionar com cwd=${cwdTeste}`);
    }
  } finally {
    try { rmSync(destino, { recursive: true, force: true }); } catch {}
  }
});

test('copier E2E cli-biblioteca + Linear: exclui rules de UI/backend/jogos e inclui linear-mcp.md e ## 5/## 6', () => {
  const destino = criarTempDir('test-copier-cli-linear');
  const dataFile = join(tmpdir(), `copier-answers-${Date.now()}-${Math.random().toString(36).slice(2)}.yml`);
  try {
    writeFileSync(
      dataFile,
      [
        'perfis_projeto:',
        '  - cli-biblioteca',
        'integrar_linear: true',
        'linear_workspace_slug: acme-ws',
        'linear_team_key: ENG',
        'linear_project: P-ENG-1',
      ].join('\n'),
      'utf8'
    );

    executarCopier(`--defaults --vcs-ref=HEAD --data-file "${dataFile}"`, destino);

    assert.strictEqual(existsSync(join(destino, '.agents', 'rules', 'web-ui-pwa.md')), false);
    assert.strictEqual(existsSync(join(destino, '.agents', 'rules', 'backend-seguranca-dados.md')), false);
    assert.strictEqual(existsSync(join(destino, '.agents', 'rules', 'jogos-engines.md')), false);

    const linearRule = join(destino, '.agents', 'rules', 'linear-mcp.md');
    assert.ok(existsSync(linearRule) && statSync(linearRule).size > 0, 'linear-mcp.md deve existir quando integrar_linear=true');

    const projectMd = readFileSync(join(destino, 'openspec', 'project.md'), 'utf8');
    assert.ok(projectMd.includes('## 5. Integração com Linear'));
    assert.ok(projectMd.includes('## 6. Comandos Essenciais'));
  } finally {
    try { rmSync(destino, { recursive: true, force: true }); } catch {}
    try { rmSync(dataFile, { force: true }); } catch {}
  }
});

test('template sem referencias legadas v2/v3/.claude e adaptado a stacks nao-tradicionais e SemVer v4.1.0', () => {
  const changelogTemplate = readFileSync(join(raiz, 'template', 'CHANGELOG.md.jinja'), 'utf8');
  assert.doesNotMatch(changelogTemplate, /Governança v2/i);

  const radarTemplate = readFileSync(join(raiz, 'template', 'openspec', 'radar-oportunidades.md.jinja'), 'utf8');
  assert.doesNotMatch(radarTemplate, /Governança v2/i);
  assert.doesNotMatch(radarTemplate, /openspec\/roadmap\//);

  const adrModelo = readFileSync(join(raiz, 'template', 'docs', 'adr', '0000-usar-madr.md'), 'utf8');
  assert.doesNotMatch(adrModelo, /Governança v2/i);

  const constitution = readFileSync(join(raiz, 'template', 'constitution.md'), 'utf8');
  assert.doesNotMatch(constitution, /\.claude\/settings\.json/);

  const envExample = readFileSync(join(raiz, 'template', '.env.example'), 'utf8');
  assert.doesNotMatch(envExample, /^PORT=3000/m, 'PORT=3000 deve estar comentado em .env.example');
  assert.doesNotMatch(envExample, /^DATABASE_URL=/m, 'DATABASE_URL deve estar comentado em .env.example');
  assert.doesNotMatch(envExample, /^AUTH_SECRET=/m, 'AUTH_SECRET deve estar comentado em .env.example');

  const webRule = readFileSync(join(raiz, 'template', '.agents', 'rules', 'web-ui-pwa.md.jinja'), 'utf8');
  assert.ok(webRule.includes('**/*.html'), 'web-ui-pwa.md.jinja deve incluir **/*.html nos globs');

  const backendRule = readFileSync(join(raiz, 'template', '.agents', 'rules', 'backend-seguranca-dados.md.jinja'), 'utf8');
  assert.ok(backendRule.includes('**/*.gs'), 'backend-seguranca-dados.md.jinja deve incluir **/*.gs nos globs');

  const brownfieldSkill = readFileSync(join(raiz, 'template', '.agents', 'skills', 'mapear-brownfield', 'SKILL.md'), 'utf8');
  assert.match(brownfieldSkill, /\.gitignore/, 'mapear-brownfield deve auditar o .gitignore existente');
  assert.match(brownfieldSkill, /Cláusulas Adicionais Deste Projeto|exceções/i, 'mapear-brownfield deve orientar registro de exceções de stack');

  const templateAgents = readFileSync(join(raiz, 'template', 'AGENTS.md'), 'utf8');
  assert.match(templateAgents, /scripts\//i, 'template/AGENTS.md deve esclarecer classificação de scripts/ próprios do projeto');

  const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
  assert.match(pkg.version, /^4\.\d+\.\d+$/, 'package.json deve estar em versão estável SemVer v4');

  const changelogRaiz = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
  assert.match(changelogRaiz, new RegExp(`## \\[${pkg.version.replace(/\./g, '\\.')}\\]`), `CHANGELOG.md deve conter seção [${pkg.version}]`);
});
