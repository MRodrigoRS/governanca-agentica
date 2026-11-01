#!/usr/bin/env node

/**
 * ==============================================================================
 * Algoritmo Determinístico da Governança — verificar-governanca.mjs
 * ==============================================================================
 * Executado pelo Lefthook (pre-commit) e pelo CI para auditar as regras da
 * Constituição e Níveis de Cerimônia (D14 + D15) com Zero-Trust no Agente.
 *
 * Zero dependências externas: roda nativamente em qualquer ambiente Node.js.
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
  console.log(`${NEGRITO}[GOVERNANÇA]${RESET} ${mensagem}`);
}

function registrarErro(mensagem) {
  console.error(`${VERMELHO}${NEGRITO}[GOVERNANÇA] VIOLAÇÃO DETERMINÍSTICA:${RESET}\n${mensagem}`);
}

function registrarSucesso(mensagem) {
  console.log(`${VERDE}${NEGRITO}[GOVERNANÇA] SUCESSO:${RESET} ${mensagem}`);
}

// 1. Obter arquivos modificados (staged no pre-commit local ou HEAD~1..HEAD no CI)
function obterArquivosModificados() {
  const modoCi = process.env.CI === 'true' || process.argv.includes('--ci');

  try {
    let comandoGit = 'git diff --cached --name-status';
    if (modoCi) {
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
  'project.godot',
];

const PADROES_SCHEMA_BANCO = [
  'schema.prisma',
  'drizzle',
  'migrations',
  'alembic',
  'migration',
  'db/schema',
];

const ARQUIVOS_CONFIG_ROOT = [
  'vite.config.ts', 'vite.config.js', 'vite.config.mjs',
  'next.config.ts', 'next.config.js', 'next.config.mjs',
  'tailwind.config.ts', 'tailwind.config.js', 'tailwind.config.mjs',
  'postcss.config.js', 'postcss.config.mjs',
  'vitest.config.ts', 'vitest.config.js',
  'playwright.config.ts', 'playwright.config.js',
  'tsconfig.json', 'biome.json', 'eslint.config.js', 'eslint.config.mjs',
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
    minusculo.startsWith('.claude/') ||
    minusculo.startsWith('docs/') ||
    minusculo.startsWith('openspec/') ||
    minusculo.startsWith('.agents/') ||
    minusculo.startsWith('scripts/') ||
    minusculo.startsWith('template/') ||
    minusculo === 'lefthook.yml' ||
    minusculo === 'copier.yml' ||
    minusculo === '.gitignore' ||
    minusculo === '.copier-answers.yml' ||
    minusculo === '.mcp.json'
  );
}

function ehManifestoDeDependencia(arquivo) {
  const nomeBase = arquivo.split('/').pop().toLowerCase();
  return PADROES_MANIFESTO.some((p) => nomeBase === p.toLowerCase()) || nomeBase.endsWith('.csproj');
}

function ehSchemaOuMigracaoDeBanco(arquivo) {
  const minusculo = arquivo.toLowerCase();
  return (
    PADROES_SCHEMA_BANCO.some((p) => minusculo.includes(p.toLowerCase())) ||
    minusculo.endsWith('.sql') ||
    minusculo.endsWith('.prisma')
  );
}

function ehArquivoDeConfiguracao(arquivo) {
  const nomeBase = arquivo.split('/').pop().toLowerCase();
  return ARQUIVOS_CONFIG_ROOT.some((cfg) => nomeBase === cfg.toLowerCase());
}

function ehArquivoDeFrontend(arquivo) {
  const extensoes = ['.tsx', '.jsx', '.vue', '.svelte', '.html'];
  return extensoes.some((ext) => arquivo.toLowerCase().endsWith(ext));
}

function ehArquivoDeProducao(arquivo) {
  if (ehArquivoDeDocumentacaoOuGovernanca(arquivo)) return false;
  if (ehArquivoDeTeste(arquivo)) return false;
  if (ehArquivoDeConfiguracao(arquivo)) return false;

  const extensoesCodigo = [
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.py', '.go', '.rs', '.java', '.c', '.cpp',
    '.cs', '.vue', '.svelte', '.dart', '.kt', '.swift',
  ];
  return extensoesCodigo.some((ext) => arquivo.toLowerCase().endsWith(ext));
}

// 3. Checagem de Deltas Ativos em openspec/changes/ e Marcos de Commit
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
    return min === 'openspec/project.md' || min.startsWith('openspec/roadmap/') || min === 'openspec/config.yaml';
  });

  if (!incluiFundacao) return false;

  const pastaArchive = join(process.cwd(), 'openspec', 'changes', 'archive');
  const possuiArchive =
    existsSync(pastaArchive) &&
    readdirSync(pastaArchive).filter((f) => !f.startsWith('.')).length > 0;

  return !possuiArchive;
}

// 4. Auditoria Determinística Anti-Preguiça para Fatias em openspec/roadmap/fatia-*.md
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
        `-> Solução: Detalhe completamente a fatia seguindo 'openspec/roadmap/_template-fatia.md'.`
      );
      process.exit(1);
    }

    if (linhasUteis.length < 25) {
      registrarErro(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' está comprimido ou superficial demais (${linhasUteis.length} linhas úteis; mínimo exigido: 25).\n\n` +
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

// 5. Auditoria de Integridade de Pasta de Mudança OpenSpec (ativa ou arquivada)
function extrairNomeFatiaCanonica(nomeMudanca) {
  const semData = nomeMudanca.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (semData.startsWith('fatia-')) {
    return semData;
  }
  return null;
}

function auditarPastaMudancaOpenSpec(caminhoPasta, nomeMudanca) {
  const fatiaCanonica = extrairNomeFatiaCanonica(nomeMudanca);
  if (fatiaCanonica) {
    const caminhoRoadmap = join(process.cwd(), 'openspec', 'roadmap', `${fatiaCanonica}.md`);
    if (!existsSync(caminhoRoadmap)) {
      registrarErro(
        `Vínculo Obrigatório Roadmap ↔ OpenSpec (D18 + D21):\n` +
        `A mudança '${nomeMudanca}' refere-se à fatia incremental '${fatiaCanonica}', mas o arquivo correspondente no roadmap não existe:\n` +
        `Ausente: 'openspec/roadmap/${fatiaCanonica}.md'\n\n` +
        `-> Solução: Crie o arquivo 'openspec/roadmap/${fatiaCanonica}.md' com as 7 seções obrigatórias antes de abrir ou comitar a fatia.`
      );
      process.exit(1);
    }
  }

  const arquivosObrigatoriosDelta = ['proposal.md', 'design.md', 'tasks.md'];

  for (const nomeArquivo of arquivosObrigatoriosDelta) {
    const caminhoArquivo = join(caminhoPasta, nomeArquivo);
    if (!existsSync(caminhoArquivo)) {
      registrarErro(
        `Delta de Nível 2 Incompleto (D14 + D18):\n` +
        `A mudança '${nomeMudanca}' não possui o arquivo obrigatório '${nomeArquivo}'.\n\n` +
        `-> Solução: Preencha 'proposal.md', 'design.md' e 'tasks.md' com o plano da fatia antes de comitar código de produção.`
      );
      process.exit(1);
    }

    const conteudo = readFileSync(caminhoArquivo, 'utf8').trim();
    if (conteudo.length < 30) {
      registrarErro(
        `Cláusula Anti-Preguiça no Delta (D18):\n` +
        `O arquivo '${nomeMudanca}/${nomeArquivo}' está vazio ou superficial demais.\n\n` +
        `-> Solução: Documente adequadamente a proposta, o desenho técnico e as tarefas da fatia.`
      );
      process.exit(1);
    }
  }
}

// 6. Proibição de location.reload (Artigo 6 — Reatividade Limpa)
function verificarLocationReloadEmStaged(listaArquivos) {
  const arquivosUI = listaArquivos.filter(ehArquivoDeFrontend);
  if (arquivosUI.length === 0) return;

  for (const arq of arquivosUI) {
    const caminhoCompleto = join(process.cwd(), arq);
    if (!existsSync(caminhoCompleto)) continue;

    try {
      const conteudo = readFileSync(caminhoCompleto, 'utf8');
      if (
        conteudo.includes('location.reload(') ||
        conteudo.includes('window.location.reload(') ||
        conteudo.includes('window.location.href =')
      ) {
        registrarErro(
          `Violação de Padrões Frontend (Artigo 6 — Reatividade Limpa):\n` +
          `O arquivo '${arq}' contém recarregamento forçado de página ('location.reload' ou 'window.location.href').\n` +
          `A interface deve ser reativa, gerenciada pelo estado da biblioteca/framework de UI.\n\n` +
          `-> Solução: Atualize o estado reativo ou cache de dados sem forçar refresh da página inteira.`
        );
        process.exit(1);
      }
    } catch {}
  }
}

// 7. Auditoria de Integridade de Testes (Artigo 2 — Anti-Teatro de Testes)
function verificarIntegridadeDeTestesEmStaged(listaArquivos) {
  const arquivosTeste = listaArquivos.filter(ehArquivoDeTeste);
  if (arquivosTeste.length === 0) return;

  const marcadoresAssercoes = [
    'expect(', 'assert', 'should', 'throws', 'rejects', 'resolves',
    'pytest.raises', 't.Error', 't.Fatal', 't.Run'
  ];

  for (const arq of arquivosTeste) {
    const caminhoCompleto = join(process.cwd(), arq);
    if (!existsSync(caminhoCompleto)) continue;

    try {
      const conteudo = readFileSync(caminhoCompleto, 'utf8');

      // 1. Bloqueia foco exclusivo esquecido (.only)
      if (
        conteudo.includes('.only(') ||
        conteudo.includes('.only`') ||
        conteudo.includes('@unittest.skip')
      ) {
        registrarErro(
          `Foco Exclusivo Esquecido em Arquivo de Teste (Artigo 2 — Test-First):\n` +
          `O arquivo de teste '${arq}' contém marcador de foco exclusivo ('.only(').\n` +
          `Isso faz o executor ignorar silenciosamente os demais testes da suíte, gerando falso positivo verde.\n\n` +
          `-> Solução: Remova '.only' antes de submeter o commit.`
        );
        process.exit(1);
      }

      // 2. Bloqueia arquivo de teste oco (zero asserções)
      const possuiAssercao = marcadoresAssercoes.some((m) => conteudo.includes(m));
      if (!possuiAssercao) {
        registrarErro(
          `Teste Oco Detectado (Artigo 2 — Anti-Teatro de Testes):\n` +
          `O arquivo de teste '${arq}' não contém nenhuma asserção real ('expect', 'assert', etc.).\n` +
          `Testes sem asserções apenas executam código sem validar regras de negócio, gerando falsa segurança.\n\n` +
          `-> Solução: Adicione asserções reais com 'expect(...)' ou 'assert(...)' testando o comportamento esperado.`
        );
        process.exit(1);
      }
    } catch {}
  }
}

// 8. Execução das Verificações Determinísticas
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

  // REGRA 1: Reatividade Limpa (Artigo 6)
  verificarLocationReloadEmStaged(listaArquivos);

  // REGRA 2: Integridade de Testes (Artigo 2 — Anti-Teatro de Testes)
  verificarIntegridadeDeTestesEmStaged(listaArquivos);

  // REGRA 3: Se há alteração de código de produção, CHANGELOG.md DEVE estar no commit (Artigo 10)
  if (arquivosProducao.length > 0 && !changelogIncluido) {
    registrarErro(
      `O arquivo CHANGELOG.md NÃO foi incluído neste commit.\n` +
      `Arquivos de produção modificados:\n${arquivosProducao.map((f) => `  - ${f}`).join('\n')}\n\n` +
      `-> Solução: Atualize o arquivo CHANGELOG.md com o delta consolidado da entrega e execute 'git add CHANGELOG.md'.`
    );
    process.exit(1);
  }

  // REGRA 3: Identificação do Marco de Commit
  const arquivosArchiveStaged = listaArquivos.filter((f) =>
    f.startsWith('openspec/changes/archive/')
  );
  const possuiMudancaArquivadaStaged = arquivosArchiveStaged.length > 0;
  const ehFundacao = ehCommitDeFundacao(listaArquivos);

  if (ehFundacao) {
    registrarInfo(
      'Marco 1 — Fundação e Sedimentação Inicial (Gate 0 / D21) detectado e aprovado com sucesso.'
    );
  } else {
    // Trava de Escalonamento Automático: Dependências ou Banco isolados exigem Nível 2
    if ((arquivosManifesto.length > 0 || arquivosBanco.length > 0) && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
      const itensAlterados = [...arquivosManifesto, ...arquivosBanco];
      registrarErro(
        `Escalonamento Automático Obrigatório (D14):\n` +
        `Arquivos de manifesto de dependências ou banco de dados foram alterados (${itensAlterados.join(', ')}) sem um delta ativo em 'openspec/changes/'.\n` +
        `Adicionar dependências ou modificar esquemas de dados exige planejamento formal no Nível 2.\n\n` +
        `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new change <nome-da-mudanca>'.`
      );
      process.exit(1);
    }

    if (arquivosProducao.length > 0 && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
      // Nível 1 — Via Rápida (/fix)
      if (arquivosProducao.length > 3) {
        registrarErro(
          `Escalonamento Automático Obrigatório (D14):\n` +
          `Este commit altera ${arquivosProducao.length} arquivos de produção sem um delta ativo em 'openspec/changes/'.\n` +
          `No Nível 1 (/fix), o teto estrito é de até 3 arquivos de produção.\n\n` +
          `Arquivos alterados (${arquivosProducao.length}):\n${arquivosProducao.map((f) => `  - ${f}`).join('\n')}\n\n` +
          `-> Solução: Abra um delta de especificação para o Nível 2 executando:\n` +
          `   npx @fission-ai/openspec new change <nome-da-mudanca>\n` +
          `   Em seguida, documente a proposta e submeta ao Gate 1 antes de codificar.`
        );
        process.exit(1);
      }

      registrarInfo(
        `Nível 1 (/fix) validado com sucesso: ${arquivosProducao.length} arquivo(s) de produção alterado(s).`
      );
    } else if (arquivosProducao.length > 0 && (possuiMudancaAtiva || possuiMudancaArquivadaStaged)) {
      if (possuiMudancaAtiva) {
        for (const mudanca of mudancasAtivas) {
          auditarPastaMudancaOpenSpec(join(process.cwd(), 'openspec', 'changes', mudanca), mudanca);
        }
      } else if (possuiMudancaArquivadaStaged) {
        // Localiza pastas arquivadas correspondentes e audita integridade
        const pastaBase = join(process.cwd(), 'openspec', 'changes', 'archive');
        if (existsSync(pastaBase)) {
          const subpastasStaged = new Set();
          for (const arq of arquivosArchiveStaged) {
            const partes = arq.split('/');
            if (partes.length >= 4) {
              subpastasStaged.add(partes[3]);
            }
          }
          if (subpastasStaged.size > 0) {
            for (const sub of subpastasStaged) {
              auditarPastaMudancaOpenSpec(join(pastaBase, sub), sub);
            }
          } else {
            const entradas = readdirSync(pastaBase).filter((e) => !e.startsWith('.'));
            if (entradas.length > 0) {
              const maisRecente = entradas[entradas.length - 1];
              auditarPastaMudancaOpenSpec(join(pastaBase, maisRecente), maisRecente);
            }
          }
        }
      }

      registrarInfo(
        `Nível 2 (Feature) validado com sucesso. ${
          possuiMudancaAtiva
            ? `Delta ativo íntegro detectado: '${mudancasAtivas.join(', ')}'.`
            : 'Fatia recém-arquivada no OpenSpec auditada e aprovada para entrega.'
        }`
      );
    }
  }

  registrarSucesso('Todas as verificações determinísticas da Governança foram satisfeitas.');
  process.exit(0);
}

executarAuditoria();
