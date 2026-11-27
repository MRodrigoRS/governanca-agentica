#!/usr/bin/env node

/**
 * ==============================================================================
 * Algoritmo Determinístico da Governança — verificar-governanca.mjs (v4.5.0)
 * ==============================================================================
 * Orquestrador modular e agregador de violações para Lefthook (pre-commit) e CI.
 * Zero dependências externas: roda nativamente em qualquer ambiente Node.js.
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ehManifestoDeDependencia,
  ehSchemaOuMigracaoDeBanco,
  ehArquivoDeProducao,
} from './lib/classificar-arquivos.mjs';
import {
  ehCommitDeFundacao,
  ehManifestoNaoNpm,
  verificarChavesNovasPackageJson,
  validarCerimoniaNoCommit,
} from './lib/classificar-cerimonia.mjs';
import { auditarMatrizRequisitos } from './lib/auditar-matriz-requisitos.mjs';
import { obterArquivosModificados } from './lib/git-diff-helper.mjs';
import {
  obterMudancasAtivasOpenSpec,
  auditarFatiasDetalhadasV3,
  auditarRoadmapV4,
  auditarPastaMudancaOpenSpec,
  verificarTarefasAbertasEmDeltaArquivado,
} from './lib/auditar-openspec.mjs';
import {
  contarLinhasUteisCodigo,
  ehArquivoIsentoDeTetoMonolito,
  verificarLocationReload,
  verificarIntegridadeDeTestes,
  verificarVariaveisAmbiente,
  verificarSensorAntiMonolitoComCatraca,
} from './lib/sensores-codigo.mjs';
import {
  verificarSensorAntiApodrecimentoCatalogo,
  verificarSensorAntiApodrecimentoMapaArquitetura,
  coletarAvisosOperacionaisEHandoff,
} from './lib/sensores-indices.mjs';

export { contarLinhasUteisCodigo, ehArquivoIsentoDeTetoMonolito };

const VERMELHO = '\x1b[31m';
const VERDE = '\x1b[32m';
const AMARELO = '\x1b[33m';
const NEGRITO = '\x1b[1m';
const RESET = '\x1b[0m';

function registrarInfo(mensagem) {
  console.log(`${NEGRITO}[GOVERNANÇA]${RESET} ${mensagem}`);
}

function registrarValvulas(valvulas) {
  if (valvulas.length === 0) return;
  console.log(`\n${AMARELO}${NEGRITO}[GOVERNANÇA] VÁLVULAS DE ESCAPE ATIVAS NO DIFF (REVISÃO HUMANA OBRIGATÓRIA NO GATE 2):${RESET}`);
  for (const v of valvulas) {
    console.log(`  - [${v.tipo}] ${v.arquivo}: "${v.motivo}"`);
  }
}

function registrarErrosAgregados(erros) {
  const sufixo = erros.length > 1 ? ` (${erros.length} ocorrências detectadas)` : '';
  console.error(`${VERMELHO}${NEGRITO}[GOVERNANÇA] VIOLAÇÃO DETERMINÍSTICA${sufixo}:${RESET}`);
  for (let i = 0; i < erros.length; i++) {
    if (erros.length > 1) {
      console.error(`\n--- Violação ${i + 1}/${erros.length} ---`);
    }
    console.error(erros[i]);
  }
}

function registrarSucesso(mensagem) {
  console.log(`${VERDE}${NEGRITO}[GOVERNANÇA] SUCESSO:${RESET} ${mensagem}`);
}

function auditarCerimoniaModoCi(cwd, erros) {
  try {
    const msgCommit = execSync('git log -1 --format=%s', { cwd, encoding: 'utf8' }).trim();
    if (
      msgCommit.startsWith('Merge ') ||
      msgCommit.startsWith('Revert "') ||
      msgCommit.startsWith('Merge branch ') ||
      msgCommit.startsWith('Merge pull request ')
    ) {
      return;
    }
    const match = msgCommit.match(/^([a-z0-9_.-]+)(\([a-z0-9_.-]+\))?!?: (.+)$/i);
    if (!match) return;
    const veredito = validarCerimoniaNoCommit(
      cwd,
      match[1].toLowerCase(),
      match[2] ? match[2].slice(1, -1) : '',
      match[3],
      { modoCi: true }
    );
    if (!veredito.valida) {
      erros.push(`Validação de Cerimônia no CI:\n${veredito.motivo}`);
    }
  } catch {}
}

function auditarEscalonamentoEDeltas({
  cwd,
  arquivosProducao,
  arquivosManifesto,
  arquivosBanco,
  mudancasAtivas,
  possuiMudancaArquivadaStaged,
  subpastasArchiveStaged,
  modoCi,
  erros,
  infos,
}) {
  const possuiMudancaAtiva = mudancasAtivas.length > 0;

  if ((arquivosManifesto.length > 0 || arquivosBanco.length > 0) && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
    const manifestosNaoNpm = arquivosManifesto.filter(ehManifestoNaoNpm);
    if (arquivosBanco.length > 0 || manifestosNaoNpm.length > 0) {
      const itensAlterados = [...manifestosNaoNpm, ...arquivosBanco];
      erros.push(
        `Escalonamento Automático Obrigatório (D14):\n` +
        `Arquivos de manifesto não-npm ou banco de dados foram alterados (${itensAlterados.join(', ')}) sem um delta ativo em 'openspec/changes/'.\n` +
        `Adicionar dependências ou modificar esquemas de dados exige planejamento formal no Nível 2.\n\n` +
        `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new change <nome-da-mudanca>'.`
      );
    } else {
      const checagemPkg = verificarChavesNovasPackageJson(cwd, modoCi);
      if (checagemPkg.temChaveNova) {
        erros.push(
          `Escalonamento Automático Obrigatório (D14):\n` +
          `Dependência inédita detectada no package.json (${checagemPkg.detalhes}) sem um delta ativo em 'openspec/changes/'.\n` +
          `Adicionar novas dependências exige planejamento formal no Nível 2.\n\n` +
          `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new change <nome-da-mudanca>'.`
        );
      } else {
        infos.push('Alteração em package.json com dependências existentes: deferido para validação de tipo no commit-msg (Via 1.5).');
      }
    }
  }

  if (arquivosProducao.length > 0 && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
    if (arquivosProducao.length > 3) {
      infos.push(`Detectados ${arquivosProducao.length} arquivos de produção sem delta ativo. Deferido para validação de cerimônia no commit-msg (Via 1.5).`);
    } else {
      infos.push(`Nível 1 (/fix) validado preliminarmente no pre-commit: ${arquivosProducao.length} arquivo(s) de produção alterado(s).`);
    }
    return;
  }

  if (arquivosProducao.length > 0 && (possuiMudancaAtiva || possuiMudancaArquivadaStaged)) {
    const errosDelta = [];
    if (possuiMudancaAtiva) {
      for (const mudanca of mudancasAtivas) {
        errosDelta.push(...auditarPastaMudancaOpenSpec(cwd, join(cwd, 'openspec', 'changes', mudanca), mudanca));
      }
    } else {
      const pastaBase = join(cwd, 'openspec', 'changes', 'archive');
      if (existsSync(pastaBase)) {
        if (subpastasArchiveStaged.size > 0) {
          for (const sub of subpastasArchiveStaged) {
            errosDelta.push(...auditarPastaMudancaOpenSpec(cwd, join(pastaBase, sub), sub));
          }
        } else {
          const entradas = readdirSync(pastaBase).filter((e) => !e.startsWith('.'));
          if (entradas.length > 0) {
            const maisRecente = entradas[entradas.length - 1];
            errosDelta.push(...auditarPastaMudancaOpenSpec(cwd, join(pastaBase, maisRecente), maisRecente));
          }
        }
      }
    }
    erros.push(...errosDelta);
    if (errosDelta.length === 0) {
      infos.push(
        `Nível 2 (Feature) validado com sucesso. ${
          possuiMudancaAtiva
            ? `Delta ativo íntegro detectado: '${mudancasAtivas.join(', ')}'.`
            : 'Fatia recém-arquivada no OpenSpec auditada e aprovada para entrega.'
        }`
      );
    }
  }
}

export function executarAuditoria(cwd = process.cwd()) {
  const modoCi = !process.argv.includes('--staged') && (process.env.CI === 'true' || process.argv.includes('--ci'));
  const erros = [];
  const infos = [];
  const valvulas = [];

  erros.push(...auditarFatiasDetalhadasV3(cwd));
  erros.push(...auditarRoadmapV4(cwd));

  const modificados = obterArquivosModificados(cwd, modoCi);
  if (modificados.length === 0) {
    if (erros.length > 0) {
      registrarErrosAgregados(erros);
      process.exit(1);
    }
    registrarInfo('Nenhum arquivo modificado para auditar.');
    process.exit(0);
  }

  const listaArquivos = modificados.map((m) => m.arquivo);
  const arquivosProducao = listaArquivos.filter(ehArquivoDeProducao);
  const arquivosManifesto = listaArquivos.filter(ehManifestoDeDependencia);
  const arquivosBanco = listaArquivos.filter(ehSchemaOuMigracaoDeBanco);
  const mudancasAtivas = obterMudancasAtivasOpenSpec(cwd);
  const changelogIncluido = listaArquivos.some((f) => f.toLowerCase() === 'changelog.md');

  erros.push(...verificarLocationReload(cwd, listaArquivos, modoCi).erros);

  const resTestes = verificarIntegridadeDeTestes(cwd, listaArquivos, modoCi);
  erros.push(...resTestes.erros);
  valvulas.push(...resTestes.valvulas);

  erros.push(...verificarVariaveisAmbiente(cwd, listaArquivos, modoCi).erros);

  if (arquivosProducao.length > 0) {
    const resMonolito = verificarSensorAntiMonolitoComCatraca(cwd, arquivosProducao, modoCi);
    erros.push(...resMonolito.erros);
    infos.push(...resMonolito.infos);
    valvulas.push(...resMonolito.valvulas);
  }

  erros.push(...verificarSensorAntiApodrecimentoCatalogo(cwd, modificados));
  erros.push(...verificarSensorAntiApodrecimentoMapaArquitetura(cwd, modificados));

  if (arquivosProducao.length > 0 && !changelogIncluido) {
    erros.push(
      `O arquivo CHANGELOG.md NÃO foi incluído neste commit.\n` +
      `Arquivos de produção modificados:\n${arquivosProducao.map((f) => `  - ${f}`).join('\n')}\n\n` +
      `-> Solução: Atualize o arquivo CHANGELOG.md com o delta consolidado da entrega e execute 'git add CHANGELOG.md'.`
    );
  }

  const arquivosArchiveStaged = listaArquivos.filter((f) => f.startsWith('openspec/changes/archive/'));
  const possuiMudancaArquivadaStaged = arquivosArchiveStaged.length > 0;
  const subpastasArchiveStaged = new Set(arquivosArchiveStaged.map((arq) => arq.split('/')[3]).filter(Boolean));
  const ehFundacao = ehCommitDeFundacao(listaArquivos, cwd);

  if (possuiMudancaArquivadaStaged) {
    const pastaBaseArchive = join(cwd, 'openspec', 'changes', 'archive');
    if (existsSync(pastaBaseArchive)) {
      for (const sub of subpastasArchiveStaged) {
        erros.push(...verificarTarefasAbertasEmDeltaArquivado(join(pastaBaseArchive, sub), sub));
      }
    }
  }

  auditarMatrizRequisitos({
    cwd,
    modificados,
    arquivosProducao,
    mudancasAtivas,
    subpastasArchiveStaged: [...subpastasArchiveStaged],
    ehFundacao,
    modoCi,
    coletarErro: (msg) => erros.push(msg),
    registrarInfo: (msg) => infos.push(msg),
  });

  if (arquivosBanco.length > 0 && !ehFundacao && !listaArquivos.includes('docs/arquitetura.md')) {
    erros.push(
      `Documentação de Arquitetura Obrigatória (Fatia 09):\n` +
      `Foram detectadas alterações em esquemas de banco de dados ou migrações (${arquivosBanco.join(', ')}), mas o arquivo 'docs/arquitetura.md' não foi incluído no commit.\n\n` +
      `-> Solução: Atualize o 'erDiagram' e o Glossário de Domínio em 'docs/arquitetura.md' e execute 'git add docs/arquitetura.md'.`
    );
  }

  if (ehFundacao) {
    infos.push('Marco 1 — Fundação e Sedimentação Inicial (Gate 0 / D21) detectado e aprovado com sucesso.');
  } else {
    if (modoCi) auditarCerimoniaModoCi(cwd, erros);
    auditarEscalonamentoEDeltas({
      cwd,
      arquivosProducao,
      arquivosManifesto,
      arquivosBanco,
      mudancasAtivas,
      possuiMudancaArquivadaStaged,
      subpastasArchiveStaged,
      modoCi,
      erros,
      infos,
    });
  }

  infos.push(...coletarAvisosOperacionaisEHandoff(cwd, listaArquivos, ehFundacao, arquivosProducao, modoCi));
  for (const info of infos) registrarInfo(info);
  registrarValvulas(valvulas);

  if (erros.length > 0) {
    registrarErrosAgregados(erros);
    process.exit(1);
  }

  registrarSucesso('Todas as verificações determinísticas da Governança foram satisfeitas.');
  process.exit(0);
}

const ehExecucaoDireta =
  Boolean(process.argv[1]) &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (ehExecucaoDireta) {
  executarAuditoria();
}
