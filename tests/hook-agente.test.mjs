import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const scriptPath = join(process.cwd(), 'template', 'scripts', 'hook-agente.mjs');

function executarHook(subcomando, inputObj) {
  try {
    const inputJson = JSON.stringify(inputObj || {});
    const stdout = execSync(`node "${scriptPath}" ${subcomando}`, {
      input: inputJson,
      encoding: 'utf8',
    });
    return { exitCode: 0, stdout: stdout.trim(), json: JSON.parse(stdout) };
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
