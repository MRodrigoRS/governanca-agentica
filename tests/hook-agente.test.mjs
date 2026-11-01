import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';

const scriptPath = join(process.cwd(), 'template', 'scripts', 'hook-agente.mjs');

function executarHook(subcomando, inputObj, cwd = process.cwd()) {
  try {
    const inputJson = JSON.stringify(inputObj || {});
    const stdout = execSync(`node "${scriptPath}" ${subcomando}`, {
      cwd,
      input: inputJson,
      encoding: 'utf8',
    });
    return { exitCode: 0, stdout: stdout.trim(), json: stdout.trim() ? JSON.parse(stdout) : {} };
  } catch (error) {
    return {
      exitCode: error.status ?? 1,
      stderr: error.stderr?.toString() ?? '',
      stdout: error.stdout?.toString() ?? '',
    };
  }
}

test('hook-agente: bloqueia comando com --no-verify (deny)', () => {
  const payload = {
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'git commit -m "feat: bypass" --no-verify' },
    },
  };
  const res = executarHook('pre-tool', payload);
  assert.equal(res.exitCode, 0);
  assert.equal(res.json.decision, 'deny');
  assert.match(res.json.reason, /--no-verify/);
});

test('hook-agente: exige confirmação humana em git commit (force_ask)', () => {
  const payload = {
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'git commit -m "feat(auth): adiciona login"' },
    },
  };
  const res = executarHook('pre-tool', payload);
  assert.equal(res.exitCode, 0);
  assert.equal(res.json.decision, 'force_ask');
  assert.match(res.json.reason, /Artigo 11/);
});

test('hook-agente: permite comandos normais (allow)', () => {
  const payload = {
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'npm test' },
    },
  };
  const res = executarHook('pre-tool', payload);
  assert.equal(res.exitCode, 0);
  assert.equal(res.json.decision, 'allow');
});

test('hook-agente: session-start injeta mensagem do sistema com integridade', () => {
  const payload = { conversationId: 'test-conv' };
  const res = executarHook('session-start', payload);
  assert.equal(res.exitCode, 0);
  assert.ok(Array.isArray(res.json.injectSteps));
  assert.ok(res.json.injectSteps.length > 0);
});

test('hook-agente: pre-tool-claude bloqueia --no-verify com exit code 2', () => {
  const payload = {
    tool_name: 'Bash',
    tool_input: { command: 'git commit -m "bypass" --no-verify' },
  };
  const res = executarHook('pre-tool-claude', payload);
  assert.equal(res.exitCode, 2);
  assert.match(res.stderr, /--no-verify/);
});

test('hook-agente: bloqueia bypass curto git commit -n e flags combinadas (deny)', () => {
  const payload1 = {
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'git commit -n -m "feat: bypass curto"' },
    },
  };
  const res1 = executarHook('pre-tool', payload1);
  assert.equal(res1.exitCode, 0);
  assert.equal(res1.json.decision, 'deny');
  assert.match(res1.json.reason, /--no-verify|-n/);

  const payload2 = {
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'git commit -am "feat: atalho" -n' },
    },
  };
  const res2 = executarHook('pre-tool', payload2);
  assert.equal(res2.exitCode, 0);
  assert.equal(res2.json.decision, 'deny');
});

test('hook-agente: nao gera falso positivo de bypass quando -n faz parte da mensagem entre aspas', () => {
  const payload = {
    toolCall: {
      name: 'run_command',
      args: { CommandLine: 'git commit -m "fix(cli): trata parametro -n no parser"' },
    },
  };
  const res = executarHook('pre-tool', payload);
  assert.equal(res.exitCode, 0);
  assert.equal(res.json.decision, 'force_ask');
  assert.match(res.json.reason, /Artigo 11/);
});

test('hook-agente: pre-tool-claude bloqueia bypass curto -n com exit code 2', () => {
  const payload = {
    tool_name: 'Bash',
    tool_input: { command: 'git commit -n -m "bypass"' },
  };
  const res = executarHook('pre-tool-claude', payload);
  assert.equal(res.exitCode, 2);
  assert.match(res.stderr, /-n|--no-verify/);
});

test('hook-agente: exige confirmacao humana em comandos destrutivos (clean, restore, orm reset)', () => {
  const comandos = [
    'git clean -fd',
    'git restore .',
    'git checkout -- .',
    'npx prisma migrate reset --force',
    'npx drizzle-kit drop',
    'supabase db reset',
  ];

  for (const cmd of comandos) {
    const payload = {
      toolCall: {
        name: 'run_command',
        args: { CommandLine: cmd },
      },
    };
    const res = executarHook('pre-tool', payload);
    assert.equal(res.exitCode, 0, `Comando ${cmd} deve responder exit 0`);
    assert.equal(res.json.decision, 'force_ask', `Comando ${cmd} deve exigir force_ask`);
    assert.match(res.json.reason, /destrutivo|segurança|Artigo 11/i);
  }
});

test('hook-agente: pre-tool-claude exige confirmacao humana em commits e comandos destrutivos', () => {
  const payload = {
    tool_name: 'Bash',
    tool_input: { command: 'git commit -m "feat: normal"' },
  };
  const res = executarHook('pre-tool-claude', payload);
  assert.equal(res.exitCode, 0);
  const out = JSON.parse(res.stdout);
  assert.equal(out?.hookSpecificOutput?.permissionDecision, 'ask');

  const payloadDestrutivo = {
    tool_name: 'Bash',
    tool_input: { command: 'git clean -fd' },
  };
  const resDestrutivo = executarHook('pre-tool-claude', payloadDestrutivo);
  assert.equal(resDestrutivo.exitCode, 0);
  const outDestrutivo = JSON.parse(resDestrutivo.stdout);
  assert.equal(outDestrutivo?.hookSpecificOutput?.permissionDecision, 'ask');
});

test('hook-agente: pre-tool intercepta write_file e edit_file com location.reload ou foco exclusivo', () => {
  const payloadReload = {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/components/Painel.tsx',
        Content: 'export function Painel() { window.location.reload(); return <div />; }',
      },
    },
  };
  const resReload = executarHook('pre-tool', payloadReload);
  assert.equal(resReload.exitCode, 0);
  assert.equal(resReload.json.decision, 'deny');
  assert.match(resReload.json.reason, /location\.reload|Artigo 6/i);

  const payloadOnly = {
    toolCall: {
      name: 'edit_file',
      args: {
        Path: 'tests/login.test.ts',
        Target: 'test("login", () => {})',
        Replacement: 'test.' + 'only("login", () => {})',
      },
    },
  };
  const resOnly = executarHook('pre-tool', payloadOnly);
  assert.equal(resOnly.exitCode, 0);
  assert.equal(resOnly.json.decision, 'deny');
  assert.match(resOnly.json.reason, /\.only|Artigo 2/i);
});

test('hook-agente: pre-tool intercepta placeholders preguicosos em roadmap', () => {
  const payload = {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'openspec/roadmap/fatia-99-teste.md',
        Content: '# Fatia 99\n\n## 1. TODO: implementar depois',
      },
    },
  };
  const res = executarHook('pre-tool', payload);
  assert.equal(res.exitCode, 0);
  assert.equal(res.json.decision, 'deny');
  assert.match(res.json.reason, /placeholder|anti-preguiça|TODO/i);
});

test('hook-agente: session-start-claude injeta additionalContext com mudancas ativas', () => {
  const payload = { cwd: process.cwd() };
  const res = executarHook('session-start-claude', payload);
  assert.equal(res.exitCode, 0);
  const out = JSON.parse(res.stdout);
  assert.equal(out?.hookSpecificOutput?.hookEventName, 'SessionStart');
  assert.match(out?.hookSpecificOutput?.additionalContext, /Governança Agêntica|Artigo 12/i);
});

test('hook-agente: post-tool-claude bloqueia edicao invalida ou erro de sintaxe .mjs', () => {
  const tempDir = join(tmpdir(), `test-claude-post-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    // 1. Arquivo de UI com location.reload
    const uiPath = join(tempDir, 'App.tsx');
    writeFileSync(uiPath, 'export function App() { location.reload(); return null; }', 'utf8');
    const resUI = executarHook('post-tool-claude', { tool_name: 'Write', tool_input: { file_path: 'App.tsx' }, cwd: tempDir });
    assert.equal(resUI.exitCode, 0);
    assert.equal(resUI.json.decision, 'block');
    assert.match(resUI.json.reason, /location\.reload/);

    // 2. Arquivo .mjs com erro de sintaxe
    const mjsPath = join(tempDir, 'invalido.mjs');
    writeFileSync(mjsPath, 'const a = {;', 'utf8');
    const resSintaxe = executarHook('post-tool-claude', { tool_name: 'Write', tool_input: { file_path: 'invalido.mjs' }, cwd: tempDir });
    assert.equal(resSintaxe.exitCode, 0);
    assert.equal(resSintaxe.json.decision, 'block');
    assert.match(resSintaxe.json.reason, /sintaxe/i);

    // 3. Arquivo válido
    const validoPath = join(tempDir, 'valido.mjs');
    writeFileSync(validoPath, 'export const valor = 42;\n', 'utf8');
    const resValido = executarHook('post-tool-claude', { tool_name: 'Write', tool_input: { file_path: 'valido.mjs' }, cwd: tempDir });
    assert.equal(resValido.exitCode, 0);
    assert.deepEqual(resValido.json, {});
  } finally {
    try { rmSync(tempDir, { recursive: true, force: true }); } catch {}
  }
});

test('template: hooks.json aponta para ../scripts/hook-agente.mjs executavel a partir de template/.agents/', () => {
  const hooksConfigPath = join(process.cwd(), 'template', '.agents', 'hooks.json');
  assert.ok(existsSync(hooksConfigPath), 'template/.agents/hooks.json deve existir');
  const hooksConfig = JSON.parse(readFileSync(hooksConfigPath, 'utf8'));
  const cmdPreTool = hooksConfig['governanca-gate'].PreToolUse[0].hooks[0].command;
  assert.match(cmdPreTool, /\.\.\/scripts\/hook-agente\.mjs/);

  // Executa o comando a partir de template/.agents
  const dirAgents = join(process.cwd(), 'template', '.agents');
  const stdout = execSync(cmdPreTool, {
    cwd: dirAgents,
    input: JSON.stringify({ toolCall: { name: 'run_command', args: { CommandLine: 'npm test' } } }),
    encoding: 'utf8',
  });
  const res = JSON.parse(stdout);
  assert.equal(res.decision, 'allow');
});
