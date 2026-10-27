#!/usr/bin/env node

/**
 * ==============================================================================
 * Algoritmo Determinístico da Governança v2 — verificar-governanca.mjs
 * ==============================================================================
 * Executado pelo Lefthook (pre-commit) e pelo CI para auditar as regras da
 * Constituição e Níveis de Cerimônia (D14 + D15) com Zero-Trust no Agente.
 *
 * Zero dependências externas: roda nativamente em qualquer ambiente Node.js.
 * Segue estritamente a Cláusula Pétrea D5 (nomes de domínio, variáveis e
 * funções em Português do Brasil).
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const VERMELHO = '\x1b[31m';
const VERDE = '\x1b[32m';
const NEGRITO = '\x1b[1m';
const RESET = '\x1b[0m';

function registrarInfo(mensagem) {
  console.log(`${NEGRITO}[GOVERNANÇA v2]${RESET} ${mensagem}`);
}

function registrarErro(mensagem) {
  console.error(`${VERMELHO}${NEGRITO}[GOVERNANÇA v2] VIOLAÇÃO DETERMINÍSTICA:${RESET}\n${mensagem}`);
}

function registrarSucesso(mensagem) {
  console.log(`${VERDE}${NEGRITO}[GOVERNANÇA v2] SUCESSO:${RESET} ${mensagem}`);
}

// 1. Obter arquivos modificados (staged no pre-commit local ou HEAD~1..HEAD no CI)
function obterArquivosModificados() {
  const modoCi = process.env.CI === 'true' || process.argv.includes('--ci');

  try {
    let comandoGit = 'git diff --cached --name-status';
    if (modoCi) {
      // Verifica se existe commit anterior no histórico para comparar no CI
      try {
        execSync('git rev-parse --verify HEAD~1', { stdio: 'ignore' });
        comandoGit = 'git diff --name-status HEAD~1 HEAD';
      } catch {
        comandoGit = 'git show --name-status --format="" HEAD';
      }
    }

    const saida = execSync(comandoGit, { encoding: 'utf8' }).trim();
    if (!saida) return [];

    return saida
      .split('\n')
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0)
      .map((linha) => {
        const colunas = linha.split('\t');
        const status = colunas[0].trim();
        const caminhoBruto = colunas[colunas.length - 1].trim();
        const arquivo = caminhoBruto.replace(/\\/g, '/');
        return { status, arquivo };
      });
  } catch {
    return [];
  }
}

// 2. Classificação de arquivos
const PADROES_MANIFESTO = [
  'package.json',
  'pyproject.toml',
  'Cargo.toml',
  'tauri.conf.json',
  'go.mod',
  'pom.xml',
  'build.gradle',
  'requirements.txt',
];

const PADROES_SCHEMA_BANCO = [
  'schema.prisma',
  'drizzle',
  'migrations',
  'alembic',
  'migration',
  'db/schema',
];

function ehArquivoDeTeste(arquivo) {
  const minusculo = arquivo.toLowerCase();
  return (
    minusculo.includes('.test.') ||
    minusculo.includes('.spec.') ||
    minusculo.includes('/__tests__/') ||
    minusculo.includes('/tests/') ||
    minusculo.startsWith('test_') ||
    minusculo.endsWith('_test.go') ||
    minusculo.endsWith('_test.rs') ||
    minusculo.endsWith('tests.cs') ||
    minusculo.endsWith('test.cs')
  );
}

function ehArquivoDeDocumentacaoOuGovernanca(arquivo) {
  const minusculo = arquivo.toLowerCase();
  return (
    minusculo === 'changelog.md' ||
    minusculo === 'agents.md' ||
    minusculo === 'claude.md' ||
    minusculo === 'gemini.md' ||
    minusculo === 'constitution.md' ||
    minusculo === 'readme.md' ||
    minusculo === 'license' ||
    minusculo.startsWith('.github/') ||
    minusculo.startsWith('.cursor/') ||
    minusculo.startsWith('docs/') ||
    minusculo.startsWith('openspec/') ||
    minusculo.startsWith('.agents/') ||
    minusculo.startsWith('scripts/') ||
    minusculo === 'lefthook.yml' ||
    minusculo === 'copier.yml' ||
    minusculo === '.gitignore' ||
    minusculo === '.copier-answers.yml'
  );
}

function ehManifestoDeDependencia(arquivo) {
  const nomeBase = arquivo.split('/').pop().toLowerCase();
  return PADROES_MANIFESTO.some((p) => nomeBase === p.toLowerCase()) || nomeBase.endsWith('.csproj');
}

function ehSchemaOuMigracaoDeBanco(arquivo) {
  const minusculo = arquivo.toLowerCase();
  return PADROES_SCHEMA_BANCO.some((p) => minusculo.includes(p.toLowerCase()));
}

function ehArquivoDeProducao(arquivo) {
  if (ehArquivoDeDocumentacaoOuGovernanca(arquivo)) return false;
  if (ehArquivoDeTeste(arquivo)) return false;

  const extensoesCodigo = [
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.py', '.go', '.rs', '.java', '.c', '.cpp',
    '.cs', '.vue', '.svelte',
  ];
  return extensoesCodigo.some((ext) => arquivo.toLowerCase().endsWith(ext));
}

// 3. Checagem de Deltas Ativos em openspec/changes/
function obterMudancasAtivasOpenSpec() {
  const pastaMudancas = join(process.cwd(), 'openspec', 'changes');
  if (!existsSync(pastaMudancas)) return [];

  try {
    const entradas = readdirSync(pastaMudancas);
    return entradas.filter((entrada) => {
      if (entrada === 'archive' || entrada.startsWith('.')) return false;
      const caminhoCompleto = join(pastaMudancas, entrada);
      return statSync(caminhoCompleto).isDirectory();
    });
  } catch {
    return [];
  }
}

// 4. Execução das Verificações Determinísticas
function executarAuditoria() {
  const modificados = obterArquivosModificados();

  if (modificados.length === 0) {
    registrarInfo('Nenhum arquivo modificado para auditar.');
    process.exit(0);
  }

  const listaArquivos = modificados.map((m) => m.arquivo);
  const arquivosProducao = listaArquivos.filter(ehArquivoDeProducao);
  const arquivosManifesto = listaArquivos.filter(ehManifestoDeDependencia);
  const arquivosBanco = listaArquivos.filter(ehSchemaOuMigracaoDeBanco);
  const mudancasAtivas = obterMudancasAtivasOpenSpec();
  const possuiMudancaAtiva = mudancasAtivas.length > 0;
  const changelogIncluido = listaArquivos.some((f) => f.toLowerCase() === 'changelog.md');

  // REGRA 1: Se há alteração de código de produção, CHANGELOG.md DEVE estar no commit (Artigo 10)
  if (arquivosProducao.length > 0 && !changelogIncluido) {
    registrarErro(
      `O arquivo CHANGELOG.md NÃO foi incluído neste commit.\n` +
      `Arquivos de produção modificados:\n${arquivosProducao.map((f) => `  - ${f}`).join('\n')}\n\n` +
      `-> Solução: Atualize o arquivo CHANGELOG.md com o delta consolidado da entrega e execute 'git add CHANGELOG.md'.`
    );
    process.exit(1);
  }

  // REGRA 2: Verificação de Nível de Cerimônia (D14)
  if (arquivosProducao.length > 0 && !possuiMudancaAtiva) {
    // Nível 1 — Via Rápida (/fix)
    if (arquivosProducao.length > 3) {
      registrarErro(
        `Escalonamento Automático Obrigatório (D14):\n` +
        `Este commit altera ${arquivosProducao.length} arquivos de produção sem um delta ativo em 'openspec/changes/'.\n` +
        `No Nível 1 (/fix), o teto estrito é de até 3 arquivos de produção.\n\n` +
        `Arquivos alterados (${arquivosProducao.length}):\n${arquivosProducao.map((f) => `  - ${f}`).join('\n')}\n\n` +
        `-> Solução: Abra um delta de especificação para o Nível 2 executando:\n` +
        `   npx @fission-ai/openspec new <nome-da-mudanca>\n` +
        `   Em seguida, documente a proposta e submeta ao Gate 1 antes de codificar.`
      );
      process.exit(1);
    }

    if (arquivosManifesto.length > 0) {
      registrarErro(
        `Escalonamento Automático Obrigatório (D14):\n` +
        `Manifestos de dependência foram alterados (${arquivosManifesto.join(', ')}) sem um delta ativo em 'openspec/changes/'.\n` +
        `Adicionar ou modificar dependências exige planejamento e justificativa formal no Gate 1.\n\n` +
        `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new <nome>'.`
      );
      process.exit(1);
    }

    if (arquivosBanco.length > 0) {
      registrarErro(
        `Escalonamento Automático Obrigatório (D14):\n` +
        `Arquivos de banco de dados/migrações foram alterados (${arquivosBanco.join(', ')}) sem um delta ativo em 'openspec/changes/'.\n` +
        `Alterações de modelo de dados exigem especificação prévia de contratos no Nível 2.\n\n` +
        `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new <nome>'.`
      );
      process.exit(1);
    }

    registrarInfo(
      `Nível 1 (/fix) validado com sucesso: ${arquivosProducao.length} arquivo(s) de produção alterado(s).`
    );
  } else if (arquivosProducao.length > 0 && possuiMudancaAtiva) {
    registrarInfo(
      `Nível 2 (Feature) validado com sucesso. Delta ativo detectado: '${mudancasAtivas.join(', ')}'.`
    );
  }

  registrarSucesso('Todas as verificações determinísticas da Governança v2 foram satisfeitas.');
  process.exit(0);
}

executarAuditoria();
