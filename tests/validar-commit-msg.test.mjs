import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const scriptPath = join(process.cwd(), 'template', 'scripts', 'validar-commit-msg.mjs');

function testarMensagem(msg, cwd = tmpdir()) {
  const tmpFile = join(tmpdir(), `test-commit-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
  writeFileSync(tmpFile, msg, 'utf8');
  try {
    const stdout = execSync(`node "${scriptPath}" "${tmpFile}"`, { cwd, encoding: 'utf8' });
    return { exitCode: 0, stdout };
  } catch (error) {
    return { exitCode: error.status ?? 1, stderr: error.stderr?.toString() ?? '', stdout: error.stdout?.toString() ?? '' };
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

test('validar-commit-msg: aceita mensagem convencional válida em PT-BR', () => {
  const res = testarMensagem('feat(auth): adiciona autenticacao com google');
  assert.equal(res.exitCode, 0);
});

test('validar-commit-msg: aceita escopo alfanumérico com hífen e subfatia', () => {
  const res = testarMensagem('feat(fatia-02a): implementa subfatia de variacoes de produtos');
  assert.equal(res.exitCode, 0);
});

test('validar-commit-msg: aceita commits automáticos do Git (Merge)', () => {
  const res = testarMensagem("Merge branch 'main' into feature");
  assert.equal(res.exitCode, 0);
});

test('validar-commit-msg: aceita commits automáticos do Git (Revert)', () => {
  const res = testarMensagem('Revert "feat(auth): adiciona login social"');
  assert.equal(res.exitCode, 0);
});

test('validar-commit-msg: rejeita mensagem sem formato convencional', () => {
  const res = testarMensagem('fiz ajustes na tela inicial');
  assert.equal(res.exitCode, 1);
});

test('validar-commit-msg: rejeita descrição muito curta (< 10 caracteres)', () => {
  const res = testarMensagem('fix(api): corrige');
  assert.equal(res.exitCode, 1);
});

test('validar-commit-msg: rejeita descrição iniciada em inglês', () => {
  const res = testarMensagem('feat(ui): add new dark mode theme');
  assert.equal(res.exitCode, 1);
});
