#!/usr/bin/env node

/**
 * ==============================================================================
 * Executor Auxiliar de Hooks do Lefthook — lefthook-runner.mjs
 * ==============================================================================
 * Centraliza comandos e checagens de `skip` do `lefthook.yml` em Node.js ESM
 * puro, eliminando one-liners `node -e "..."` com aspas aninhadas que quebram
 * no `sh.exe -c` no Windows e evitando erros de parse YAML.
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function comandoDisponivel(comando, cwd) {
  try {
    execSync(comando, { cwd, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function executarComando(comando, cwd) {
  execSync(comando, { cwd, stdio: 'inherit' });
}

function lerScriptsPackageJson(cwd) {
  const caminhoPkg = join(cwd, 'package.json');
  if (!existsSync(caminhoPkg)) return null;
  try {
    const conteudo = JSON.parse(readFileSync(caminhoPkg, 'utf8'));
    return conteudo?.scripts || {};
  } catch {
    return {};
  }
}

function verificarItensOpenSpec(cwd) {
  const pastaChanges = join(cwd, 'openspec', 'changes');
  const temChanges =
    existsSync(pastaChanges) &&
    readdirSync(pastaChanges).some((f) => f !== 'archive' && !f.startsWith('.'));

  const pastaSpecs = join(cwd, 'openspec', 'specs');
  const temSpecs =
    existsSync(pastaSpecs) &&
    readdirSync(pastaSpecs).some((f) => !f.startsWith('.'));

  return temChanges || temSpecs;
}

function executarTestesUnitarios(cwd) {
  const scriptsPkg = lerScriptsPackageJson(cwd);
  if (scriptsPkg !== null) {
    if (scriptsPkg['test:unit']) {
      executarComando('npm run test:unit', cwd);
    } else if (scriptsPkg.test) {
      executarComando('npm test', cwd);
    }
  }

  if (existsSync(join(cwd, 'pyproject.toml'))) {
    const cmdPytest = comandoDisponivel('uv --version', cwd)
      ? 'uv run pytest -m "not slow"'
      : 'pytest -m "not slow"';
    executarComando(cmdPytest, cwd);
  }

  if (existsSync(join(cwd, 'Cargo.toml'))) {
    executarComando('cargo test --lib', cwd);
  }
}

function executarPrePush(cwd) {
  const scriptsPkg = lerScriptsPackageJson(cwd);
  if (scriptsPkg !== null && scriptsPkg.test) {
    console.log('[LEFTHOOK] Executando testes Node.js...');
    executarComando('npm test', cwd);
  }

  if (existsSync(join(cwd, 'pyproject.toml'))) {
    console.log('[LEFTHOOK] Executando testes Python (pytest)...');
    const cmdPytest = comandoDisponivel('uv --version', cwd)
      ? 'uv run pytest'
      : 'pytest';
    executarComando(cmdPytest, cwd);
  }

  if (existsSync(join(cwd, 'Cargo.toml'))) {
    console.log('[LEFTHOOK] Executando testes Rust (cargo test)...');
    executarComando('cargo test', cwd);
  }

  const temDotnet = readdirSync(cwd).some(
    (f) => f.endsWith('.sln') || f.endsWith('.csproj')
  );
  if (temDotnet) {
    console.log('[LEFTHOOK] Executando testes .NET (dotnet test)...');
    executarComando('dotnet test', cwd);
  }

  if (
    existsSync(join(cwd, 'project.godot')) &&
    existsSync(join(cwd, 'addons', 'gut', 'gut_cmdln.gd'))
  ) {
    if (comandoDisponivel('godot --version', cwd)) {
      console.log('[LEFTHOOK] Executando testes Godot 4 (GUT headless)...');
      executarComando('godot --headless --path . -s addons/gut/gut_cmdln.gd -gexit', cwd);
    } else {
      console.log(
        '[LEFTHOOK] Aviso: binário "godot" não encontrado no PATH local. Testes GUT serão executados no CI do GitHub Actions.'
      );
    }
  }
}

export function executarAcaoLefthook(acao, cwd = process.cwd()) {
  switch (acao) {
    case 'skip-gitleaks':
      return comandoDisponivel('gitleaks version', cwd) ? 1 : 0;

    case 'skip-openspec':
      return verificarItensOpenSpec(cwd) ? 1 : 0;

    case 'skip-typecheck':
      return existsSync(join(cwd, 'package.json')) ? 1 : 0;

    case 'skip-unit-tests': {
      const temStack =
        existsSync(join(cwd, 'package.json')) ||
        existsSync(join(cwd, 'pyproject.toml')) ||
        existsSync(join(cwd, 'Cargo.toml'));
      return temStack ? 1 : 0;
    }

    case 'unit-tests':
      executarTestesUnitarios(cwd);
      return 0;

    case 'pre-push':
      executarPrePush(cwd);
      return 0;

    default:
      console.error(`[LEFTHOOK] Ação desconhecida: '${acao || ''}'.`);
      return 1;
  }
}

const ehExecucaoDireta =
  Boolean(process.argv[1]) &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (ehExecucaoDireta) {
  const acao = process.argv[2];
  try {
    const codigo = executarAcaoLefthook(acao, process.cwd());
    process.exit(codigo);
  } catch (erro) {
    process.exit(erro?.status ?? 1);
  }
}
