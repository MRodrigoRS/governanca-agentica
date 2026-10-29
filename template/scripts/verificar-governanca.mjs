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
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
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
    minusculo.startsWith('template/') ||
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

// 3. Checagem de Deltas Ativos em openspec/changes/ e Marcos de Commit (D21)
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

function ehCommitDeFundacao(listaArquivos) {
  const incluiFundacao = listaArquivos.some((f) => {
    const min = f.toLowerCase();
    return min === 'openspec/project.md' || min.startsWith('openspec/roadmap/');
  });

  if (!incluiFundacao) return false;

  const pastaArchive = join(process.cwd(), 'openspec', 'changes', 'archive');
  const possuiArchive =
    existsSync(pastaArchive) &&
    readdirSync(pastaArchive).filter((f) => !f.startsWith('.')).length > 0;

  return !possuiArchive;
}

// 4. Auditoria Determinística Anti-Preguiça para Fatias em openspec/roadmap/fatia-*.md (D18)
function auditarFatiasDetalhadas() {
  const pastaRoadmap = join(process.cwd(), 'openspec', 'roadmap');
  if (!existsSync(pastaRoadmap)) return;

  const secoesObrigatorias = [
    '## 1.',
    '## 2.',
    '## 3.',
    '## 4.',
    '## 5.',
    '## 6.',
    '## 7.',
  ];

  const marcadoresPreguica = [
    '<NUMERO>',
    '<TITULO_DA_FATIA>',
    '<SLUG>',
    '{{ NUMERO }}',
    '{{ TITULO_DA_FATIA }}',
    '[Descreva claramente',
    '[preencher]',
    'TODO:',
    'TBD:',
  ];

  const arquivos = readdirSync(pastaRoadmap).filter(
    (nome) => nome.startsWith('fatia-') && nome.endsWith('.md')
  );

  for (const nomeArquivo of arquivos) {
    const caminhoCompleto = join(pastaRoadmap, nomeArquivo);
    const conteudo = readFileSync(caminhoCompleto, 'utf8');
    const linhasUteis = conteudo
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const secoesFaltantes = secoesObrigatorias.filter((secao) => !conteudo.includes(secao));
    if (secoesFaltantes.length > 0) {
      registrarErro(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' não contém todas as 7 seções obrigatórias de '_template-fatia.md'.\n` +
        `Seções ausentes: ${secoesFaltantes.join(', ')}\n\n` +
        `-> Solução: Detalhe completamente a fatia seguindo 'openspec/roadmap/_template-fatia.md' para que qualquer agente consiga implementá-la sem adivinhar regras.`
      );
      process.exit(1);
    }

    if (linhasUteis.length < 35) {
      registrarErro(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' está comprimido ou superficial demais (${linhasUteis.length} linhas úteis; mínimo exigido: 35).\n\n` +
        `-> Solução: Especifique tabelas, colunas em PT-BR, schemas Zod/Pydantic, estados assíncronos de UI, regras de negócio e roteiro Test-First.`
      );
      process.exit(1);
    }

    const marcadorEncontrado = marcadoresPreguica.find((m) => conteudo.includes(m));
    if (marcadorEncontrado) {
      registrarErro(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' ainda contém marcadores não preenchidos ('${marcadorEncontrado}').\n\n` +
        `-> Solução: Substitua todos os placeholders pelo planejamento real e detalhado da fatia.`
      );
      process.exit(1);
    }
  }
}

// 5. Auditoria de Integridade do Delta Ativo no Nível 2 (impede burlar Nível 1 com pasta vazia e dedução de cabeça — D23)
function auditarDeltasAtivosOpenSpec(mudancasAtivas) {
  const arquivosObrigatoriosDelta = ['proposal.md', 'design.md', 'tasks.md'];

  for (const nomeMudanca of mudancasAtivas) {
    // Validação da Cláusula Proibido Deduzir de Cabeça (D23 e D25): fatia (inteira ou decimal) deve ter origem no roadmap
    if (nomeMudanca.startsWith('fatia-')) {
      const pastaRoadmap = join(process.cwd(), 'openspec', 'roadmap');
      if (existsSync(pastaRoadmap)) {
        const fatiasRoadmap = readdirSync(pastaRoadmap);
        // Suporta tanto fatia-02-auth quanto fatia-02.1-fotos
        const partes = nomeMudanca.split('-');
        const prefixoFatia = `${partes[0]}-${partes[1]}`;
        const fatiaExiste = fatiasRoadmap.some((f) => f.startsWith(`${prefixoFatia}-`) && f.endsWith('.md'));
        if (!fatiaExiste) {
          registrarErro(
            `Cláusula Pétrea "Proibido Deduzir de Cabeça" (Artigo 12 / D23 + D25):\n` +
            `A mudança ativa 'openspec/changes/${nomeMudanca}' não possui um arquivo correspondente no roadmap em 'openspec/roadmap/'.\n\n` +
            `-> Solução: Toda fatia (inclusive subfatias decimais como 'fatia-02.1') deve estar formalizada em 'openspec/roadmap/${prefixoFatia}-<slug>.md' antes de abrir o delta.`
          );
          process.exit(1);
        }
      }
    }

    const pastaMudanca = join(process.cwd(), 'openspec', 'changes', nomeMudanca);
    for (const nomeArquivo of arquivosObrigatoriosDelta) {
      const caminhoArquivo = join(pastaMudanca, nomeArquivo);
      if (!existsSync(caminhoArquivo)) {
        registrarErro(
          `Delta de Nível 2 Incompleto (D14 + D18):\n` +
          `A mudança ativa 'openspec/changes/${nomeMudanca}' não possui o arquivo obrigatório '${nomeArquivo}'.\n\n` +
          `-> Solução: Preencha 'proposal.md', 'design.md' e 'tasks.md' com o plano da fatia e valide no Gate 1 antes de comitar código de produção.`
        );
        process.exit(1);
      }

      const conteudo = readFileSync(caminhoArquivo, 'utf8').trim();
      if (conteudo.length < 50) {
        registrarErro(
          `Cláusula Anti-Preguiça no Delta Ativo (D18):\n` +
          `O arquivo 'openspec/changes/${nomeMudanca}/${nomeArquivo}' está vazio ou superficial demais.\n\n` +
          `-> Solução: Documente adequadamente a proposta, o desenho técnico e as tarefas da fatia.`
        );
        process.exit(1);
      }
    }
  }
}

// 6. Execução das Verificações Determinísticas
function executarAuditoria() {
  auditarFatiasDetalhadas();

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

  // REGRA 2: Verificação de Nível de Cerimônia (D14) e Marcos de Commit (D21)
  const possuiMudancaArquivadaStaged = listaArquivos.some((f) =>
    f.startsWith('openspec/changes/archive/')
  );
  const ehFundacao = ehCommitDeFundacao(listaArquivos);

  if (ehFundacao) {
    registrarInfo(
      'Marco 1 — Fundação e Sedimentação Inicial (Gate 0 / D21) detectado e aprovado com sucesso.'
    );
  } else if (arquivosProducao.length > 0 && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
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
  } else if (arquivosProducao.length > 0 && (possuiMudancaAtiva || possuiMudancaArquivadaStaged)) {
    if (possuiMudancaAtiva) {
      auditarDeltasAtivosOpenSpec(mudancasAtivas);
    }
    registrarInfo(
      `Nível 2 (Feature) validado com sucesso. ${
        possuiMudancaAtiva
          ? `Delta ativo íntegro detectado: '${mudancasAtivas.join(', ')}'.`
          : 'Fatia recém-arquivada no OpenSpec detectada para entrega.'
      }`
    );
  }

  registrarSucesso('Todas as verificações determinísticas da Governança v2 foram satisfeitas.');
  process.exit(0);
}

executarAuditoria();
