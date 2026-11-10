#!/usr/bin/env node

/**
 * ==============================================================================
 * Algoritmo Determinístico da Governança — verificar-governanca.mjs (v4.0.0)
 * ==============================================================================
 * Executado pelo Lefthook (pre-commit) e pelo CI para auditar as regras da
 * Constituição, Rolling Wave e Níveis de Cerimônia (D14 + D15 + D32) com Zero-Trust.
 *
 * Zero dependências externas: roda nativamente em qualquer ambiente Node.js.
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  ehArquivoDeTeste,
  ehArquivoDeDocumentacaoOuGovernanca,
  ehManifestoDeDependencia,
  ehSchemaOuMigracaoDeBanco,
  ehArquivoDeConfiguracao,
  ehArquivoDeFrontend,
  ehArquivoDeProducao,
} from './lib/classificar-arquivos.mjs';
import {
  ehManifestoNaoNpm,
  verificarChavesNovasPackageJson,
  validarCerimoniaNoCommit,
} from './lib/classificar-cerimonia.mjs';

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

// 2. Checagem de Deltas Ativos em openspec/changes/ e Marcos de Commit
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
    return (
      min === 'openspec/project.md' ||
      min === 'openspec/roadmap.md' ||
      min.startsWith('openspec/roadmap/') ||
      min === 'openspec/config.yaml'
    );
  });

  if (!incluiFundacao) return false;

  const pastaArchive = join(process.cwd(), 'openspec', 'changes', 'archive');
  const possuiArchive =
    existsSync(pastaArchive) &&
    readdirSync(pastaArchive).filter((f) => !f.startsWith('.')).length > 0;

  return !possuiArchive;
}

// 3. Auditoria Determinística do Roadmap (v3 legado e v4 Rolling Wave)
const MARCADORES_PREGUICA = [
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

function auditarFatiasDetalhadasV3() {
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

    const marcadorEncontrado = MARCADORES_PREGUICA.find((m) => conteudo.includes(m));
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

function auditarRoadmapV4() {
  const caminhoRoadmap = join(process.cwd(), 'openspec', 'roadmap.md');
  if (!existsSync(caminhoRoadmap)) return;

  const conteudo = readFileSync(caminhoRoadmap, 'utf8');

  const marcador = MARCADORES_PREGUICA.find((m) => conteudo.includes(m));
  if (marcador) {
    registrarErro(
      `Cláusula Anti-Preguiça no Roadmap (D18 + D32):\n` +
      `O arquivo 'openspec/roadmap.md' contém marcadores não preenchidos ('${marcador}').\n\n` +
      `-> Solução: Preencha o planejamento com o escopo real e detalhado da fatia.`
    );
    process.exit(1);
  }

  // Audita blocos de fatias no formato Rolling Wave: ### [ ] fatia-XX ou ### fatia-XX
  const blocos = conteudo.split(/(?=\n###\s+(?:\[[ x~]\]\s+)?fatia-)/i);
  for (const bloco of blocos) {
    if (!/^\n?###\s+(?:\[[ x~]\]\s+)?fatia-/i.test(bloco)) continue;

    const primeiraLinha = bloco.trim().split('\n')[0];
    const nomeBloco = primeiraLinha.replace(/^###\s+/, '');

    const temDepende = /Depende de/i.test(bloco);
    const temObjetivo = /Objetivo/i.test(bloco);
    const temEntra = /ENTRA/i.test(bloco);
    const temFicaDeFora = /FICA DE FORA/i.test(bloco);

    const ausentes = [];
    if (!temDepende) ausentes.push('Depende de');
    if (!temObjetivo) ausentes.push('Objetivo');
    if (!temEntra) ausentes.push('ENTRA');
    if (!temFicaDeFora) ausentes.push('FICA DE FORA');

    if (ausentes.length > 0) {
      registrarErro(
        `Auditoria Estrutural do Roadmap Rolling Wave (D32):\n` +
        `O bloco '${nomeBloco}' em 'openspec/roadmap.md' não contém as âncoras obrigatórias.\n` +
        `Âncoras ausentes: ${ausentes.join(', ')}\n\n` +
        `-> Solução: Estruture cada fatia com 'Depende de', 'Objetivo de Valor', 'O que ENTRA' e 'O que FICA DE FORA'.`
      );
      process.exit(1);
    }
  }
}

// 4. Auditoria de Integridade de Pasta de Mudança OpenSpec
function extrairNomeFatiaCanonica(nomeMudanca) {
  const semData = nomeMudanca.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (semData.startsWith('fatia-')) {
    return semData;
  }
  return null;
}

function auditarDeltaModoV3(caminhoPasta, nomeMudanca) {
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

function auditarDeltaModoV4(caminhoPasta, nomeMudanca) {
  const arquivosObrigatorios = ['proposal.md', 'design.md', 'tasks.md'];
  for (const arq of arquivosObrigatorios) {
    const caminho = join(caminhoPasta, arq);
    if (!existsSync(caminho)) {
      registrarErro(
        `Delta OpenSpec Incompleto (D14 + D32):\n` +
        `A mudança '${nomeMudanca}' não possui o arquivo obrigatório '${arq}'.\n\n` +
        `-> Solução: Crie '${arq}' com os pilares obrigatórios da governança v4.`
      );
      process.exit(1);
    }
  }

  // 1. proposal.md: mínimo 10 linhas úteis + cabeçalhos obrigatórios
  const conteudoProposal = readFileSync(join(caminhoPasta, 'proposal.md'), 'utf8');
  const linhasProposal = conteudoProposal.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (linhasProposal.length < 10) {
    registrarErro(
      `Pilar Proposal Superficial (D32):\n` +
      `O arquivo '${nomeMudanca}/proposal.md' tem apenas ${linhasProposal.length} linhas úteis (mínimo exigido: 10).`
    );
    process.exit(1);
  }
  const temPorQue = /##\s+(Por que|Por Quê|Why)/i.test(conteudoProposal);
  const temOQueMuda = /##\s+(O que muda|Escopo|What Changes)/i.test(conteudoProposal);
  const temFicaDeFora = /(Fica de Fora|Fora de Escopo|Out of Scope)/i.test(conteudoProposal);
  if (!temPorQue || !temOQueMuda || !temFicaDeFora) {
    registrarErro(
      `Cabeçalhos Obrigatórios em Proposal (D32):\n` +
      `O arquivo '${nomeMudanca}/proposal.md' deve conter seções 'Por que'/'Why', 'O que muda'/'What Changes' e menção a 'Fica de Fora'/'Out of Scope'.`
    );
    process.exit(1);
  }

  // 2. specs/: ao menos um spec.md com Requirement e Scenario com WHEN e THEN
  const pastaSpecs = join(caminhoPasta, 'specs');
  if (!existsSync(pastaSpecs)) {
    registrarErro(
      `Specs Ausentes no Delta (D32):\n` +
      `A mudança '${nomeMudanca}' não possui o diretório 'specs/'. Todo delta de Nível 2 exige ao menos uma especificação com cenários Given/When/Then.`
    );
    process.exit(1);
  }
  const arquivosSpec = [];
  function coletarSpecs(dir) {
    const entradas = readdirSync(dir, { withFileTypes: true });
    for (const ent of entradas) {
      const sub = join(dir, ent.name);
      if (ent.isDirectory()) coletarSpecs(sub);
      else if (ent.name.endsWith('.md')) arquivosSpec.push(sub);
    }
  }
  coletarSpecs(pastaSpecs);
  if (arquivosSpec.length === 0) {
    registrarErro(
      `Nenhum arquivo spec.md em '${nomeMudanca}/specs/' (D32).\n` +
      `Todo delta de Nível 2 exige ao menos um arquivo de especificação com cenários de teste.`
    );
    process.exit(1);
  }
  for (const arqSpec of arquivosSpec) {
    const conteudoSpec = readFileSync(arqSpec, 'utf8');
    const temAddedOrMod = /##\s+(ADDED|MODIFIED)\s+Requirements/i.test(conteudoSpec);
    if (temAddedOrMod) {
      const temReq = /###\s+Requirement:/i.test(conteudoSpec);
      const temCenario = /####\s+Scenario:/i.test(conteudoSpec);
      const temWhen = /\bWHEN\b/i.test(conteudoSpec);
      const temThen = /\bTHEN\b/i.test(conteudoSpec);
      if (!temReq || !temCenario || !temWhen || !temThen) {
        registrarErro(
          `Formato Inválido de Spec (D32):\n` +
          `O arquivo '${arqSpec.replace(process.cwd(), '')}' contém deltas ADDED/MODIFIED mas não implementa '### Requirement:', '#### Scenario:' com 'WHEN' e 'THEN'.`
        );
        process.exit(1);
      }
    }
  }

  // 3. design.md: mínimo 18 linhas úteis + Schemas + Interface/Estados + Regras
  const conteudoDesign = readFileSync(join(caminhoPasta, 'design.md'), 'utf8');
  const linhasDesign = conteudoDesign.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (linhasDesign.length < 18) {
    registrarErro(
      `Pilar Design Técnico Superficial (D32):\n` +
      `O arquivo '${nomeMudanca}/design.md' tem apenas ${linhasDesign.length} linhas úteis (mínimo exigido: 18).`
    );
    process.exit(1);
  }
  const temContratos = /##\s+.*(Contratos|Dados|Schemas)/i.test(conteudoDesign);
  const temInterface = /##\s+.*(Interface|Estados)/i.test(conteudoDesign) || /Não se aplica:\s*.{10,}/i.test(conteudoDesign);
  const temRegras = /##\s+.*(Regras|Segurança|Seguranca)/i.test(conteudoDesign);
  if (!temContratos || !temInterface || !temRegras) {
    registrarErro(
      `Cabeçalhos Obrigatórios em Design (D32):\n` +
      `O arquivo '${nomeMudanca}/design.md' deve conter seções de 'Contratos/Dados/Schemas', 'Interface/Estados' (ou 'Não se aplica: ...') e 'Regras de Negócio/Segurança'.`
    );
    process.exit(1);
  }

  // 4. tasks.md: mínimo 12 linhas úteis + Test-First + Roteiro Prático
  const conteudoTasks = readFileSync(join(caminhoPasta, 'tasks.md'), 'utf8');
  const linhasTasks = conteudoTasks.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (linhasTasks.length < 12) {
    registrarErro(
      `Pilar Tarefas Superficial (D32):\n` +
      `O arquivo '${nomeMudanca}/tasks.md' tem apenas ${linhasTasks.length} linhas úteis (mínimo exigido: 12).`
    );
    process.exit(1);
  }
  const temTestFirst = /(Vermelho|Red|teste falhando)/i.test(conteudoTasks);
  const temRoteiro = /##\s+.*(Roteiro de Validação Prática|Roteiro Prático|Roteiro de Validacao)/i.test(conteudoTasks);
  if (!temTestFirst || !temRoteiro) {
    registrarErro(
      `Marcações Obrigatórias em Tasks (D32):\n` +
      `O arquivo '${nomeMudanca}/tasks.md' deve conter tarefas marcadas com Test-First ('Vermelho'/'Red'/'teste falhando') e seção '## Roteiro de Validação Prática'.`
    );
    process.exit(1);
  }

  // Marcadores de preguiça
  for (const arq of [...arquivosObrigatorios, ...arquivosSpec]) {
    const caminho = arq.startsWith(caminhoPasta) ? arq : join(caminhoPasta, arq);
    const conteudo = readFileSync(caminho, 'utf8');
    const marcador = MARCADORES_PREGUICA.find((m) => conteudo.includes(m));
    if (marcador) {
      registrarErro(
        `Cláusula Anti-Preguiça no Delta (D18 + D32):\n` +
        `O arquivo '${arq}' ainda contém marcadores não preenchidos ('${marcador}').`
      );
      process.exit(1);
    }
  }
}

function auditarPastaMudancaOpenSpec(caminhoPasta, nomeMudanca) {
  const fatiaCanonica = extrairNomeFatiaCanonica(nomeMudanca);
  if (fatiaCanonica) {
    const caminhoRoadmapV3 = join(process.cwd(), 'openspec', 'roadmap', `${fatiaCanonica}.md`);
    const caminhoRoadmapV4 = join(process.cwd(), 'openspec', 'roadmap.md');

    if (existsSync(caminhoRoadmapV3)) {
      auditarDeltaModoV3(caminhoPasta, nomeMudanca);
      return;
    }

    if (!existsSync(caminhoRoadmapV4)) {
      registrarErro(
        `Vínculo Obrigatório Roadmap ↔ OpenSpec (D18 + D21):\n` +
        `A mudança '${nomeMudanca}' refere-se à fatia incremental '${fatiaCanonica}', mas nem 'openspec/roadmap.md' nem 'openspec/roadmap/${fatiaCanonica}.md' existem.\n\n` +
        `-> Solução: Crie 'openspec/roadmap.md' contendo o bloco da fatia ou 'openspec/roadmap/${fatiaCanonica}.md'.`
      );
      process.exit(1);
    }

    const conteudoRoadmap = readFileSync(caminhoRoadmapV4, 'utf8');
    if (!conteudoRoadmap.includes(fatiaCanonica)) {
      registrarErro(
        `Vínculo Obrigatório Roadmap ↔ OpenSpec (D18 + D21):\n` +
        `A mudança '${nomeMudanca}' refere-se à fatia incremental '${fatiaCanonica}', mas o identificador não foi encontrado em 'openspec/roadmap.md':\n` +
        `Ausente: '${fatiaCanonica}'\n\n` +
        `-> Solução: Registre o bloco da fatia em 'openspec/roadmap.md' antes de abrir ou comitar a fatia.`
      );
      process.exit(1);
    }
  }

  auditarDeltaModoV4(caminhoPasta, nomeMudanca);
}

// 5. Proibição de location.reload (Artigo 6 — Reatividade Limpa)
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

// 6. Auditoria de Integridade de Testes (Artigo 2 — Anti-Teatro de Testes)
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

// 6.1. Sensor Determinístico de Variáveis de Ambiente (.env.example)
function verificarVariaveisAmbienteEmStaged(listaArquivos) {
  const arquivosProducao = listaArquivos.filter(ehArquivoDeProducao);
  const camEnvExample = existsSync(join(process.cwd(), '.env.example'))
    ? join(process.cwd(), '.env.example')
    : existsSync(join(process.cwd(), '.env.template'))
    ? join(process.cwd(), '.env.template')
    : null;

  let conteudoEnvExample = '';
  if (camEnvExample) {
    try {
      conteudoEnvExample = readFileSync(camEnvExample, 'utf8');
    } catch {}
  }

  // 1. Audita se o próprio .env.example contém segredos reais
  if (conteudoEnvExample) {
    const prefixosSegredoReal = ['sk_live_', 'sk_test_', 'ghp_', 'github_pat_', 'xox', 'AKIA', '-----BEGIN'];
    const regexSegredoLongo = /=\s*([A-Za-z0-9_\-]{32,})/;
    const palavrasPlaceholder = ['placeholder', 'exemplo', 'sample', 'chave', 'token', 'secret', 'sua-chave', 'changeme', 'sua_chave'];

    for (const linha of conteudoEnvExample.split('\n')) {
      const limpa = linha.trim();
      if (!limpa || limpa.startsWith('#')) continue;
      const temPrefixo = prefixosSegredoReal.some((p) => limpa.includes(p));
      let ehSegredoLongo = false;
      const matchLongo = limpa.match(regexSegredoLongo);
      if (matchLongo) {
        const val = matchLongo[1].toLowerCase();
        const contemPlaceholder = palavrasPlaceholder.some((p) => val.includes(p));
        if (!contemPlaceholder) {
          ehSegredoLongo = true;
        }
      }

      if (temPrefixo || ehSegredoLongo) {
        registrarErro(
          `Sensor de Variáveis de Ambiente (.env.example):\n` +
          `Detectado valor que parece ser um segredo real no arquivo .env.example: '${limpa}'.\n` +
          `Arquivos de exemplo nunca devem conter credenciais ou segredos de verdade.\n\n` +
          `-> Solução: Substitua o valor por um placeholder seguro (ex: SUA_CHAVE_AQUI, changeme, ou deixe em branco após o '=').`
        );
        process.exit(1);
      }
    }
  }

  if (arquivosProducao.length === 0) return;

  const variaveisDeclaradas = new Set();
  if (conteudoEnvExample) {
    for (const linha of conteudoEnvExample.split('\n')) {
      const match = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      if (match) {
        variaveisDeclaradas.add(match[1]);
      }
    }
  }

  const variaveisIgnoradas = new Set([
    'NODE_ENV', 'CI', 'PATH', 'HOME', 'USERPROFILE', 'TZ', 'LANG', 'PWD',
    'PORT', 'HOST', 'TMP', 'TEMP', 'PROD', 'DEV', 'SSR', 'MODE', 'BASE_URL'
  ]);

  const regexesVariaveis = [
    /process\.env\.([A-Z0-9_]+)/g,
    /import\.meta\.env\.([A-Z0-9_]+)/g,
    /os\.getenv\(["']([A-Z0-9_]+)["']\)/g,
    /os\.environ\[["']([A-Z0-9_]+)["']\]/g,
    /os\.environ\.get\(["']([A-Z0-9_]+)["']\)/g,
    /std::env::var\(["']([A-Z0-9_]+)["']\)/g,
    /os\.Getenv\(["']([A-Z0-9_]+)["']\)/g,
    /Environment\.GetEnvironmentVariable\(["']([A-Z0-9_]+)["']\)/g,
  ];

  for (const arq of arquivosProducao) {
    const caminhoCompleto = join(process.cwd(), arq);
    if (!existsSync(caminhoCompleto)) continue;

    let conteudo = '';
    try {
      conteudo = readFileSync(caminhoCompleto, 'utf8');
    } catch {
      continue;
    }

    for (const regex of regexesVariaveis) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(conteudo)) !== null) {
        const nomeVar = match[1];
        if (variaveisIgnoradas.has(nomeVar)) continue;

        if (!variaveisDeclaradas.has(nomeVar)) {
          registrarErro(
            `Sensor de Variáveis de Ambiente (.env.example):\n` +
            `A variável '${nomeVar}' é referenciada no código de produção ('${arq}'), mas não está declarada no arquivo .env.example (ou .env.template).\n\n` +
            `-> Solução: Declare '${nomeVar}=' no arquivo .env.example para documentar a dependência sem expor segredos.`
          );
          process.exit(1);
        }
      }
    }
  }
}

// 7. Execução das Verificações Determinísticas
function executarAuditoria() {
  auditarFatiasDetalhadasV3();
  auditarRoadmapV4();

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

  // REGRA 2.1: Sensor de Variáveis de Ambiente (.env.example)
  verificarVariaveisAmbienteEmStaged(listaArquivos);

  // REGRA 3: Se há alteração de código de produção, CHANGELOG.md DEVE estar no commit (Artigo 10)
  if (arquivosProducao.length > 0 && !changelogIncluido) {
    registrarErro(
      `O arquivo CHANGELOG.md NÃO foi incluído neste commit.\n` +
      `Arquivos de produção modificados:\n${arquivosProducao.map((f) => `  - ${f}`).join('\n')}\n\n` +
      `-> Solução: Atualize o arquivo CHANGELOG.md com o delta consolidado da entrega e execute 'git add CHANGELOG.md'.`
    );
    process.exit(1);
  }

  // REGRA 4: Identificação do Marco de Commit
  const arquivosArchiveStaged = listaArquivos.filter((f) =>
    f.startsWith('openspec/changes/archive/')
  );
  const possuiMudancaArquivadaStaged = arquivosArchiveStaged.length > 0;
  const ehFundacao = ehCommitDeFundacao(listaArquivos);

  // REGRA 4.1: Atualização de docs/arquitetura.md em alterações de banco fora de fundação
  if (arquivosBanco.length > 0 && !ehFundacao) {
    if (!listaArquivos.includes('docs/arquitetura.md')) {
      registrarErro(
        `Documentação de Arquitetura Obrigatória (Fatia 09):\n` +
        `Foram detectadas alterações em esquemas de banco de dados ou migrações (${arquivosBanco.join(', ')}), mas o arquivo 'docs/arquitetura.md' não foi incluído no commit.\n\n` +
        `-> Solução: Atualize o 'erDiagram' e o Glossário de Domínio em 'docs/arquitetura.md' e execute 'git add docs/arquitetura.md'.`
      );
      process.exit(1);
    }
  }

  if (ehFundacao) {
    registrarInfo(
      'Marco 1 — Fundação e Sedimentação Inicial (Gate 0 / D21) detectado e aprovado com sucesso.'
    );
  } else {
    const modoCi = process.env.CI === 'true' || process.argv.includes('--ci');
    if (modoCi) {
      try {
        const msgCommit = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim();
        const match = msgCommit.match(/^([a-z0-9_.-]+)(\([a-z0-9_.-]+\))?!?: (.+)$/i);
        if (match) {
          const tipo = match[1].toLowerCase();
          const escopo = match[2] ? match[2].slice(1, -1) : '';
          const descricao = match[3];
          const veredito = validarCerimoniaNoCommit(process.cwd(), tipo, escopo, descricao);
          if (!veredito.valida) {
            registrarErro(`Validação de Cerimônia no CI:\n${veredito.motivo}`);
            process.exit(1);
          }
        }
      } catch {}
    }

    // Trava de Escalonamento Automático: Dependências ou Banco isolados exigem Nível 2
    if ((arquivosManifesto.length > 0 || arquivosBanco.length > 0) && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
      const manifestosNaoNpm = arquivosManifesto.filter(ehManifestoNaoNpm);
      if (arquivosBanco.length > 0 || manifestosNaoNpm.length > 0) {
        const itensAlterados = [...manifestosNaoNpm, ...arquivosBanco];
        registrarErro(
          `Escalonamento Automático Obrigatório (D14):\n` +
          `Arquivos de manifesto não-npm ou banco de dados foram alterados (${itensAlterados.join(', ')}) sem um delta ativo em 'openspec/changes/'.\n` +
          `Adicionar dependências ou modificar esquemas de dados exige planejamento formal no Nível 2.\n\n` +
          `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new change <nome-da-mudanca>'.`
        );
        process.exit(1);
      }

      // Para package.json: se houver dependência inédita, bloqueia imediatamente
      const checagemPkg = verificarChavesNovasPackageJson(process.cwd());
      if (checagemPkg.temChaveNova) {
        registrarErro(
          `Escalonamento Automático Obrigatório (D14):\n` +
          `Dependência inédita detectada no package.json (${checagemPkg.detalhes}) sem um delta ativo em 'openspec/changes/'.\n` +
          `Adicionar novas dependências exige planejamento formal no Nível 2.\n\n` +
          `-> Solução: Abra um delta de Nível 2 via 'npx @fission-ai/openspec new change <nome-da-mudanca>'.`
        );
        process.exit(1);
      }

      registrarInfo(
        'Alteração em package.json com dependências existentes: deferido para validação de tipo no commit-msg (Via 1.5).'
      );
    }

    if (arquivosProducao.length > 0 && !possuiMudancaAtiva && !possuiMudancaArquivadaStaged) {
      if (arquivosProducao.length > 3) {
        // Deferido para o commit-msg (Via 1.5)
        registrarInfo(
          `Detectados ${arquivosProducao.length} arquivos de produção sem delta ativo. Deferido para validação de cerimônia no commit-msg (Via 1.5).`
        );
      } else {
        registrarInfo(
          `Nível 1 (/fix) validado preliminarmente no pre-commit: ${arquivosProducao.length} arquivo(s) de produção alterado(s).`
        );
      }
    } else if (arquivosProducao.length > 0 && (possuiMudancaAtiva || possuiMudancaArquivadaStaged)) {
      if (possuiMudancaAtiva) {
        for (const mudanca of mudancasAtivas) {
          auditarPastaMudancaOpenSpec(join(process.cwd(), 'openspec', 'changes', mudanca), mudanca);
        }
      } else if (possuiMudancaArquivadaStaged) {
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
