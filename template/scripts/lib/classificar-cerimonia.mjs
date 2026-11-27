/**
 * ==============================================================================
 * Classificação Determinística de Cerimônia — classificar-cerimonia.mjs
 * ==============================================================================
 * Define a matriz de cerimônia da governança v4.5:
 * - Via 1a: /fix funcional (até 3 arquivos de produção, exige teste)
 * - Via 1b: style visual (até 3 arquivos, sem lógica/handlers/hooks)
 * - Via 1.5: Manutenção Estrutural (> 3 arquivos ou bump de versão existente em
 *   package.json; tipos permitidos: refactor/perf/style/chore/build)
 * - Via 2: Feature / Mudança de Domínio com delta ativo no OpenSpec
 * Suporta modo local (--staged) e modo CI (--ci / HEAD~1..HEAD).
 * ==============================================================================
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  ehArquivoDeProducao,
  ehArquivoDeTeste,
  ehSchemaOuMigracaoDeBanco,
} from './classificar-arquivos.mjs';
import {
  lerConteudoAlvo,
  lerConteudoAnterior,
  obterDiffUnificadoArquivo,
  obterListaArquivosModificados,
} from './git-diff-helper.mjs';

export function obterArquivosStaged(cwd = process.cwd(), modoCi = false) {
  return obterListaArquivosModificados(cwd, modoCi);
}

export function verificarChavesNovasPackageJson(cwd = process.cwd(), modoCi = false) {
  try {
    const conteudoAnterior = lerConteudoAnterior(cwd, 'package.json', modoCi);
    if (conteudoAnterior === null) {
      return { temChaveNova: true, detalhes: 'package.json inédito no repositório' };
    }
    const headPkg = JSON.parse(conteudoAnterior);
    const conteudoAlvo = lerConteudoAlvo(cwd, 'package.json', modoCi);
    if (!conteudoAlvo) return { temChaveNova: false };
    const stagedPkg = JSON.parse(conteudoAlvo);

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
  } catch {
    return { temChaveNova: false };
  }
}

export function verificarLinhasSobAdicionadoChangelog(cwd = process.cwd(), modoCi = false) {
  try {
    const diff = obterDiffUnificadoArquivo(cwd, 'CHANGELOG.md', modoCi);
    if (!diff) return { temLinhaSobAdicionado: false };

    const conteudo = lerConteudoAlvo(cwd, 'CHANGELOG.md', modoCi);
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

export function verificarContrabandoStyle(cwd = process.cwd(), arquivosAlvo = [], modoCi = false) {
  const extensoesCodigo = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];
  const arquivosCodigo = arquivosAlvo.filter((a) =>
    extensoesCodigo.some((ext) => a.toLowerCase().endsWith(ext))
  );
  const regexContrabando = /\b(if\s*\(|switch\s*\(|use[A-Z]\w*\s*\(|on[A-Z]\w*\s*=|fetch\s*\(|await\s+)/;

  for (const arq of arquivosCodigo) {
    const diff = obterDiffUnificadoArquivo(cwd, arq, modoCi);
    if (!diff) continue;
    for (const linha of diff.split('\n')) {
      if (!linha.startsWith('+') || linha.startsWith('+++')) continue;
      const conteudoLinha = linha.slice(1).trim();
      if (conteudoLinha.startsWith('//') || conteudoLinha.startsWith('/*') || conteudoLinha.startsWith('*')) {
        continue;
      }
      if (regexContrabando.test(conteudoLinha)) {
        return { temContrabando: true, arquivo: arq, trecho: conteudoLinha };
      }
    }
  }
  return { temContrabando: false };
}

export function ehManifestoNaoNpm(arquivo) {
  const nomeBase = arquivo.toLowerCase().split('/').pop() || '';
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

export function ehCommitDeFundacao(listaArquivos, cwd = process.cwd()) {
  const incluiFundacao = listaArquivos.some((f) => {
    const min = f.toLowerCase();
    return (
      min === 'openspec/project.md' ||
      min === 'openspec/roadmap.md' ||
      min.startsWith('openspec/roadmap/') ||
      min === 'openspec/config.yaml'
    );
  });
  if (!incluiFundacao) return false;

  const pastaArchive = join(cwd, 'openspec', 'changes', 'archive');
  const possuiArchive =
    existsSync(pastaArchive) &&
    readdirSync(pastaArchive).filter((f) => !f.startsWith('.')).length > 0;
  return !possuiArchive;
}

export function validarCerimoniaNoCommit(cwd, tipo, escopo, descricao, { modoCi = false } = {}) {
  const arquivosAlvo = obterArquivosStaged(cwd, modoCi);
  const arquivosProducao = arquivosAlvo.filter(ehArquivoDeProducao);
  const arquivosTeste = arquivosAlvo.filter(ehArquivoDeTeste);
  const arquivosBanco = arquivosAlvo.filter(ehSchemaOuMigracaoDeBanco);
  const manifestosNaoNpm = arquivosAlvo.filter(ehManifestoNaoNpm);
  const temPackageJson = arquivosAlvo.some((f) => f.toLowerCase() === 'package.json');

  const pastaChanges = join(cwd, 'openspec', 'changes');
  let temDeltaAtivo = false;
  if (existsSync(pastaChanges)) {
    try {
      temDeltaAtivo = readdirSync(pastaChanges).some((e) => {
        if (e === 'archive' || e.startsWith('.')) return false;
        return statSync(join(pastaChanges, e)).isDirectory();
      });
    } catch {}
  }

  const arquivandoDelta = arquivosAlvo.some((f) => f.startsWith('openspec/changes/archive/'));
  if (temDeltaAtivo || arquivandoDelta) {
    return { valida: true, via: '2' };
  }

  if (ehCommitDeFundacao(arquivosAlvo, cwd)) {
    const tiposPermitidosFundacao = ['feat', 'chore', 'docs', 'build', 'ci'];
    if (!tiposPermitidosFundacao.includes(tipo)) {
      return {
        valida: false,
        motivo: `Commit de Fundação (Marco 1 / Gate 0) exige tipo 'feat' (ex.: 'feat(fundacao): ...') ou 'chore'/'docs'/'build'/'ci'. O tipo '${tipo}' não é permitido no Marco 1.`,
      };
    }
    return { valida: true, via: 'fundacao' };
  }

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
    const checagemPkg = verificarChavesNovasPackageJson(cwd, modoCi);
    if (checagemPkg.temChaveNova) {
      return {
        valida: false,
        motivo: `Via 1.5 recusada: detectada dependência inédita (${checagemPkg.detalhes}). Adicionar novos pacotes exige planejamento formal no Nível 2 do OpenSpec.`,
      };
    }
  }

  const checagemChangelog = verificarLinhasSobAdicionadoChangelog(cwd, modoCi);
  if (checagemChangelog.temLinhaSobAdicionado) {
    return {
      valida: false,
      motivo: `Via 1.5 recusada: detectadas adições sob '### Adicionado' no CHANGELOG.md. Novas funcionalidades exigem delta formal no Nível 2 do OpenSpec.`,
    };
  }

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

  if (tipo === 'style') {
    const analiseStyle = verificarContrabandoStyle(cwd, arquivosAlvo, modoCi);
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

  const tiposPermitidosVia1_5 = ['refactor', 'perf', 'style', 'chore', 'build'];
  if (arquivosProducao.length > 3 || temPackageJson) {
    if (!tiposPermitidosVia1_5.includes(tipo)) {
      return {
        valida: false,
        motivo: `Via 1.5 (Manutenção Estrutural) permite apenas os tipos: ${tiposPermitidosVia1_5.join(', ')}. O tipo '${tipo}' não é permitido sem um delta ativo de Nível 2 no OpenSpec.`,
      };
    }
    return { valida: true, via: '1.5' };
  }

  if (tipo === 'feat' && arquivosProducao.length > 0) {
    return {
      valida: false,
      motivo: `Commits do tipo 'feat' introduzem novas capacidades de produto e exigem delta formal no Nível 2 ('openspec/changes/').`,
    };
  }

  return { valida: true, via: '1' };
}
