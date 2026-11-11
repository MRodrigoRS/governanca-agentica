/**
 * ==============================================================================
 * Classificador de Cerimônia e Vias de Manutenção — classificar-cerimonia.mjs
 * ==============================================================================
 * Define a matriz de cerimônia da governança v4:
 * - Via 1a: /fix funcional (até 3 arquivos de produção, exige teste staged)
 * - Via 1b: style visual (até 3 arquivos, sem lógica/handlers/hooks)
 * - Via 1.5: Manutenção Estrutural (> 3 arquivos ou bump de versão existente em
 *   package.json; tipos permitidos: refactor/perf/style/chore/build; bloqueia
 *   pacote inédito, banco, manifestos não-npm e linhas em ### Adicionado)
 * - Via 2: Feature / Mudança de Domínio com delta ativo no OpenSpec
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  ehArquivoDeProducao,
  ehArquivoDeTeste,
  ehSchemaOuMigracaoDeBanco,
} from './classificar-arquivos.mjs';

export function obterArquivosStaged(cwd = process.cwd()) {
  try {
    const saida = execSync('git diff --cached --name-status', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!saida) return [];

    return saida
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((linha) => {
        const colunas = linha.split('\t');
        const caminhoBruto = colunas[colunas.length - 1].trim();
        return caminhoBruto.replace(/\\/g, '/');
      });
  } catch {
    return [];
  }
}

export function verificarChavesNovasPackageJson(cwd = process.cwd()) {
  try {
    let headPkg = {};
    try {
      const conteudoHead = execSync('git show HEAD:package.json', {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      headPkg = JSON.parse(conteudoHead);
    } catch {
      return { temChaveNova: true, detalhes: 'package.json inédito no repositório' };
    }

    let stagedPkg = {};
    try {
      const conteudoStaged = execSync('git show :package.json', {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      stagedPkg = JSON.parse(conteudoStaged);
    } catch {
      const arq = join(cwd, 'package.json');
      if (existsSync(arq)) {
        stagedPkg = JSON.parse(readFileSync(arq, 'utf8'));
      }
    }

    const secoes = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
    for (const secao of secoes) {
      const chavesHead = new Set(Object.keys(headPkg[secao] || {}));
      const chavesStaged = Object.keys(stagedPkg[secao] || {});
      const novas = chavesStaged.filter((k) => !chavesHead.has(k));
      if (novas.length > 0) {
        return {
          temChaveNova: true,
          detalhes: `chave nova '${novas.join(', ')}' em ${secao}`,
        };
      }
    }

    return { temChaveNova: false };
  } catch (err) {
    return { temChaveNova: false };
  }
}

export function verificarLinhasSobAdicionadoChangelog(cwd = process.cwd()) {
  try {
    const diff = execSync('git diff --cached -U0 CHANGELOG.md', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (!diff) return { temLinhaSobAdicionado: false };

    let conteudo = '';
    try {
      conteudo = execSync('git show :CHANGELOG.md', {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
    } catch {
      const arq = join(cwd, 'CHANGELOG.md');
      if (existsSync(arq)) conteudo = readFileSync(arq, 'utf8');
    }

    const matchAdicionado = conteudo.match(/###\s+Adicionado\s*\n([\s\S]*?)(?=\n###|\n##|$)/i);
    if (matchAdicionado && matchAdicionado[1]) {
      const linhasAdicionado = matchAdicionado[1]
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('-'));

      const diffLinhas = diff
        .split('\n')
        .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
        .map((l) => l.slice(1).trim());

      for (const item of diffLinhas) {
        if (item.startsWith('-') && linhasAdicionado.includes(item)) {
          return { temLinhaSobAdicionado: true };
        }
      }
    }

    return { temLinhaSobAdicionado: false };
  } catch {
    return { temLinhaSobAdicionado: false };
  }
}

export function verificarContrabandoStyle(cwd = process.cwd(), arquivosStaged = []) {
  const extensoesCodigo = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];
  const arquivosCodigo = arquivosStaged.filter((a) =>
    extensoesCodigo.some((ext) => a.toLowerCase().endsWith(ext))
  );

  const regexContrabando = /\b(if\s*\(|switch\s*\(|use[A-Z]\w*\s*\(|on[A-Z]\w*\s*=|fetch\s*\(|await\s+)/;

  for (const arq of arquivosCodigo) {
    try {
      const diff = execSync(`git diff --cached -U0 -- "${arq}"`, {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const linhas = diff.split('\n');
      for (const linha of linhas) {
        if (linha.startsWith('+') && !linha.startsWith('+++')) {
          const conteudoLinha = linha.slice(1).trim();
          if (
            conteudoLinha.startsWith('//') ||
            conteudoLinha.startsWith('/*') ||
            conteudoLinha.startsWith('*')
          ) {
            continue;
          }
          if (regexContrabando.test(conteudoLinha)) {
            return {
              temContrabando: true,
              arquivo: arq,
              trecho: conteudoLinha,
            };
          }
        }
      }
    } catch {}
  }

  return { temContrabando: false };
}

export function ehManifestoNaoNpm(arquivo) {
  const min = arquivo.toLowerCase();
  const nomeBase = min.split('/').pop() || '';
  return (
    nomeBase === 'pyproject.toml' ||
    nomeBase === 'cargo.toml' ||
    nomeBase.endsWith('.csproj') ||
    nomeBase === 'go.mod' ||
    nomeBase === 'pom.xml' ||
    nomeBase === 'build.gradle' ||
    nomeBase === 'requirements.txt' ||
    nomeBase === 'project.godot'
  );
}

export function validarCerimoniaNoCommit(cwd, tipo, escopo, descricao) {
  const staged = obterArquivosStaged(cwd);
  const arquivosProducao = staged.filter(ehArquivoDeProducao);
  const arquivosTeste = staged.filter(ehArquivoDeTeste);
  const arquivosBanco = staged.filter(ehSchemaOuMigracaoDeBanco);
  const manifestosNaoNpm = staged.filter(ehManifestoNaoNpm);
  const temPackageJson = staged.some((f) => f.toLowerCase() === 'package.json');

  // Checa se há delta ativo ou arquivamento de delta neste commit (Via 2 — Feature Just-in-Time)
  const pastaChanges = join(cwd, 'openspec', 'changes');
  let temDeltaAtivo = false;
  if (existsSync(pastaChanges)) {
    try {
      const entradas = readdirSync(pastaChanges);
      temDeltaAtivo = entradas.some((e) => {
        if (e === 'archive' || e.startsWith('.')) return false;
        return statSync(join(pastaChanges, e)).isDirectory();
      });
    } catch {}
  }

  const arquivandoDelta = staged.some((f) => f.startsWith('openspec/changes/archive/'));

  // Se já há delta ativo ou estamos concluindo/arquivando um delta, estamos na Via 2 (Feature Just-in-Time)
  if (temDeltaAtivo || arquivandoDelta) {
    return { valida: true, via: '2' };
  }

  // BLOQUEIOS INCONDICIONAIS SEM DELTA ATIVO
  if (arquivosBanco.length > 0) {
    return {
      valida: false,
      motivo: `Alterações em esquemas de banco de dados ou migrações (${arquivosBanco.join(', ')}) exigem delta formal de Nível 2 em 'openspec/changes/'.`,
    };
  }

  if (manifestosNaoNpm.length > 0) {
    return {
      valida: false,
      motivo: `Alterações em manifestos não-npm (${manifestosNaoNpm.join(', ')}) exigem delta formal de Nível 2 em 'openspec/changes/'.`,
    };
  }

  if (temPackageJson) {
    const checagemPkg = verificarChavesNovasPackageJson(cwd);
    if (checagemPkg.temChaveNova) {
      return {
        valida: false,
        motivo: `Via 1.5 recusada: detectada dependência inédita (${checagemPkg.detalhes}). Adicionar novos pacotes exige planejamento formal no Nível 2 do OpenSpec.`,
      };
    }
  }

  const checagemChangelog = verificarLinhasSobAdicionadoChangelog(cwd);
  if (checagemChangelog.temLinhaSobAdicionado) {
    return {
      valida: false,
      motivo: `Via 1.5 recusada: detectadas adições sob '### Adicionado' no CHANGELOG.md. Novas funcionalidades exigem delta formal no Nível 2 do OpenSpec.`,
    };
  }

  // 1. Validação de /fix (Via 1a)
  if (tipo === 'fix') {
    if (arquivosProducao.length > 3) {
      return {
        valida: false,
        motivo: `Via 1a (/fix) excedeu o teto estrito de 3 arquivos de produção (${arquivosProducao.length} arquivos alterados). Abra um delta de Nível 2 via 'npx @fission-ai/openspec new change <nome>'.`,
      };
    }
    if (arquivosProducao.length > 0 && arquivosTeste.length === 0) {
      return {
        valida: false,
        motivo: `Via 1a (/fix) exige obrigatoriamente ao menos um arquivo de teste staged quando tocar código de produção. Nenhum arquivo de teste foi incluído no commit.`,
      };
    }
    return { valida: true, via: '1a' };
  }

  // 2. Validação de style (Via 1b)
  if (tipo === 'style') {
    const analiseStyle = verificarContrabandoStyle(cwd, staged);
    if (analiseStyle.temContrabando) {
      return {
        valida: false,
        motivo: `Heurística Anti-Contrabando da Via 1b (style): detectada introdução de lógica, hooks ou handlers no arquivo '${analiseStyle.arquivo}' ('${analiseStyle.trecho}'). Commits do tipo 'style' devem conter apenas alterações puramente visuais, classes de estilo ou layout.`,
      };
    }
    if (arquivosProducao.length <= 3 && !temPackageJson && arquivosBanco.length === 0) {
      return { valida: true, via: '1b' };
    }
  }

  // 3. Validação de Manutenção Estrutural (Via 1.5)
  const tiposPermitidosVia1_5 = ['refactor', 'perf', 'style', 'chore', 'build'];
  const elegivelVia1_5 = arquivosProducao.length > 3 || temPackageJson;

  if (elegivelVia1_5) {
    if (!tiposPermitidosVia1_5.includes(tipo)) {
      return {
        valida: false,
        motivo: `Via 1.5 (Manutenção Estrutural) permite apenas os tipos: ${tiposPermitidosVia1_5.join(', ')}. O tipo '${tipo}' não é permitido sem um delta ativo de Nível 2 no OpenSpec.`,
      };
    }

    return { valida: true, via: '1.5' };
  }

  // Se tiver tipo feat tocando código de produção sem delta -> bloqueia
  if (tipo === 'feat' && arquivosProducao.length > 0) {
    return {
      valida: false,
      motivo: `Commits do tipo 'feat' introduzem novas capacidades de produto e exigem delta formal no Nível 2 ('openspec/changes/').`,
    };
  }

  return { valida: true, via: '1' };
}
