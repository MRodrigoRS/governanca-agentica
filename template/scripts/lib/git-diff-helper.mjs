/**
 * ==============================================================================
 * Helper Portátil de Git Diff e Conteúdo — git-diff-helper.mjs
 * ==============================================================================
 * Abstrai a leitura de arquivos modificados e conteúdos entre o modo local
 * (--staged / index) e o modo CI (--ci / HEAD~1..HEAD), eliminando falsos verdes.
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function parsearNameStatus(saida) {
  if (!saida) return [];
  return saida
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0)
    .map((linha) => {
      const colunas = linha.split('\t');
      const status = (colunas[0] || '').trim();
      const caminhoBruto = (colunas[colunas.length - 1] || '').trim();
      return { status, arquivo: caminhoBruto.replace(/\\/g, '/') };
    });
}

export function obterArquivosModificados(cwd = process.cwd(), modoCi = false) {
  try {
    let comandoGit = 'git diff --cached --name-status';
    if (modoCi) {
      try {
        execSync('git rev-parse --verify HEAD~1', { cwd, stdio: 'ignore' });
        comandoGit = 'git diff --name-status HEAD~1 HEAD';
      } catch {
        comandoGit = 'git show --name-status --format="" HEAD';
      }
    }

    const saida = execSync(comandoGit, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return parsearNameStatus(saida);
  } catch {
    return [];
  }
}

export function obterListaArquivosModificados(cwd = process.cwd(), modoCi = false) {
  return obterArquivosModificados(cwd, modoCi).map((item) => item.arquivo);
}

export function lerConteudoAlvo(cwd, arquivo, modoCi = false) {
  const ref = modoCi ? `HEAD:${arquivo}` : `:${arquivo}`;
  try {
    return execSync(`git show "${ref}"`, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    const caminhoFisico = join(cwd, arquivo);
    if (existsSync(caminhoFisico)) {
      try {
        return readFileSync(caminhoFisico, 'utf8');
      } catch {
        return '';
      }
    }
    return '';
  }
}

export function lerConteudoAnterior(cwd, arquivo, modoCi = false) {
  const ref = modoCi ? `HEAD~1:${arquivo}` : `HEAD:${arquivo}`;
  try {
    return execSync(`git show "${ref}"`, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

export function obterDiffUnificadoArquivo(cwd, arquivo, modoCi = false) {
  try {
    let comando = `git diff --cached -U0 -- "${arquivo}"`;
    if (modoCi) {
      try {
        execSync('git rev-parse --verify HEAD~1', { cwd, stdio: 'ignore' });
        comando = `git diff -U0 HEAD~1 HEAD -- "${arquivo}"`;
      } catch {
        comando = `git show --format="" -U0 HEAD -- "${arquivo}"`;
      }
    }
    return execSync(comando, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

export function obterCaminhosRemovidosOuRenomeadosGit(cwd = process.cwd(), modoCi = false) {
  const removidos = new Set();
  try {
    let comando = 'git diff --cached --name-status';
    if (modoCi) {
      try {
        execSync('git rev-parse --verify HEAD~1', { cwd, stdio: 'ignore' });
        comando = 'git diff --name-status HEAD~1 HEAD';
      } catch {
        return removidos;
      }
    }
    const saida = execSync(comando, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!saida) return removidos;
    for (const linha of saida.split('\n')) {
      const colunas = linha.trim().split('\t');
      const status = (colunas[0] || '').trim();
      if ((status === 'D' || status.startsWith('R')) && colunas[1]) {
        removidos.add(colunas[1].trim().replace(/\\/g, '/'));
      }
    }
  } catch {}
  return removidos;
}
