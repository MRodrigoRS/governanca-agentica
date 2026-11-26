/**
 * ==============================================================================
 * Auditor Determinístico da Matriz de Rastreabilidade — auditar-matriz-requisitos.mjs
 * ==============================================================================
 * Valida ponta-a-ponta `openspec/matriz-requisitos.md` (100% opt-in: projetos
 * sem o arquivo seguem aprovados sem quebra de retrocompatibilidade).
 * Zero dependências externas: Node.js ESM puro.
 * ==============================================================================
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MARCADORES_PREGUICA_MATRIZ = [
  '<REQ>',
  '<SLUG>',
  '<NUMERO>',
  '[preencher]',
  'TODO:',
  'TBD:',
];

export const STATUS_CANONICOS_MATRIZ = [
  '[ ] Pendente',
  '[~] Em andamento',
  '[x] Entregue',
  '[-] Descartado',
];

function limparCrases(texto) {
  return (texto || '').trim().replace(/^`+|`+$/g, '').trim();
}

function extrairCaminhosEmCrases(texto) {
  const caminhos = [];
  for (const m of (texto || '').matchAll(/`([^`]+)`/g)) {
    const val = m[1].trim();
    if (val) caminhos.push(val);
  }
  return caminhos;
}

function ehCaminhoArquivoLocal(valor) {
  if (!valor) return false;
  if (/^@[a-z0-9_.-]+\/[a-z0-9_.-]+/i.test(valor)) return false;
  if (/^https?:\/\//i.test(valor)) return false;
  return valor.includes('/') || valor.includes('.');
}

function ehLinhaGuiaTemplate(colunas) {
  const idBruto = (colunas[0] || '').trim();
  const temCrasesNaLinha = colunas.some((c) => c.includes('`'));
  return idBruto.startsWith('*(') && idBruto.endsWith(')*') && !temCrasesNaLinha;
}

export function parsearTabelaMatriz(conteudo) {
  const linhas = (conteudo || '').split(/\r?\n/);
  const registros = [];
  const errosEstrutura = [];
  let dentroSecao1 = false;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (/^##\s+1\.\s+Requisitos/i.test(linha)) {
      dentroSecao1 = true;
      continue;
    }
    if (dentroSecao1 && /^##\s+/.test(linha)) {
      break;
    }
    if (!dentroSecao1 || !linha.startsWith('|')) continue;
    if (/^\|[\s:-]+(?:\|[\s:-]+)*\|?$/.test(linha)) continue;

    const semBordas = linha.replace(/^\|/, '').replace(/\|$/, '');
    const colunas = semBordas.split('|').map((c) => c.trim());
    if (colunas.length < 6) {
      errosEstrutura.push(
        `Linha ${i + 1} da tabela em 'openspec/matriz-requisitos.md' possui ${colunas.length} coluna(s) (mínimo esperado: 6).`
      );
      continue;
    }

    const idLimpo = limparCrases(colunas[0]);
    if (idLimpo.toUpperCase() === 'ID') continue;
    if (ehLinhaGuiaTemplate(colunas)) continue;

    registros.push({
      linha: i + 1,
      idBruto: colunas[0],
      idLimpo,
      requisito: colunas[1],
      fonte: colunas[2],
      fatia: colunas[3],
      fatiaLimpa: limparCrases(colunas[3]),
      statusBruto: colunas[4],
      statusLimpo: limparCrases(colunas[4]),
      provaReal: colunas[5],
    });
  }

  return { registros, errosEstrutura };
}

export function resumirMatrizRequisitos(raiz = process.cwd()) {
  const caminhoMatriz = join(raiz, 'openspec', 'matriz-requisitos.md');
  if (!existsSync(caminhoMatriz)) return null;

  try {
    const conteudo = readFileSync(caminhoMatriz, 'utf8');
    const { registros } = parsearTabelaMatriz(conteudo);
    const resumo = {
      total: registros.length,
      entregues: 0,
      emAndamento: 0,
      pendentes: 0,
      descartados: 0,
    };

    for (const reg of registros) {
      if (reg.statusLimpo === '[x] Entregue') resumo.entregues++;
      else if (reg.statusLimpo === '[~] Em andamento') resumo.emAndamento++;
      else if (reg.statusLimpo === '[ ] Pendente') resumo.pendentes++;
      else if (reg.statusLimpo === '[-] Descartado') resumo.descartados++;
    }
    return resumo;
  } catch {
    return null;
  }
}

export function formatarTelemetriaMatriz(raiz = process.cwd()) {
  const r = resumirMatrizRequisitos(raiz);
  if (!r || r.total <= 0) return '';
  return `[MATRIZ REQUISITOS] Total: ${r.total} | Entregues: ${r.entregues} | Em andamento: ${r.emAndamento} | Pendentes: ${r.pendentes} | Descartados: ${r.descartados}.`;
}

function obterCaminhosRemovidosOuRenomeados(cwd, modificados) {
  const removidos = new Set();

  for (const item of modificados || []) {
    const status = item.status || '';
    if (status === 'D') {
      removidos.add((item.arquivo || '').replace(/\\/g, '/'));
    }
  }

  try {
    const saida = execSync('git diff --cached --name-status', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (saida) {
      for (const linha of saida.split('\n')) {
        const colunas = linha.trim().split('\t');
        const status = (colunas[0] || '').trim();
        if (status === 'D' || status.startsWith('R')) {
          if (colunas[1]) removidos.add(colunas[1].trim().replace(/\\/g, '/'));
        }
      }
    }
  } catch {}

  return removidos;
}

function falharMatriz(registrarErro, mensagem) {
  registrarErro(`Auditoria da Matriz de Rastreabilidade (Artigo 12.6):\n${mensagem}`);
  process.exit(1);
}

export function auditarMatrizRequisitos({
  cwd = process.cwd(),
  modificados = [],
  arquivosProducao = [],
  mudancasAtivas = [],
  subpastasArchiveStaged = [],
  ehFundacao = false,
  registrarErro,
  registrarInfo,
}) {
  const caminhoMatriz = join(cwd, 'openspec', 'matriz-requisitos.md');
  if (!existsSync(caminhoMatriz)) return;

  const conteudo = readFileSync(caminhoMatriz, 'utf8');

  // Regra 1: Anti-Preguiça
  const marcador = MARCADORES_PREGUICA_MATRIZ.find((m) => conteudo.includes(m));
  if (marcador) {
    falharMatriz(
      registrarErro,
      `O arquivo 'openspec/matriz-requisitos.md' contém marcador não preenchido ('${marcador}').\n\n` +
      `-> Solução: Substitua todos os placeholders por requisitos reais rastreados.`
    );
  }

  const { registros, errosEstrutura } = parsearTabelaMatriz(conteudo);
  if (errosEstrutura.length > 0) {
    falharMatriz(registrarErro, errosEstrutura[0]);
  }

  const idsVistos = new Set();
  const caminhosProvaEntregues = new Set();
  const caminhosFonteRastreados = new Set();

  for (const reg of registros) {
    // Regra 2: Formato e Unicidade de IDs
    if (!/^REQ-\d{2,4}$/.test(reg.idLimpo)) {
      falharMatriz(
        registrarErro,
        `Linha ${reg.linha}: ID inválido '${reg.idLimpo}'. Todo ID deve seguir o padrão 'REQ-01'..'REQ-9999'.`
      );
    }
    if (idsVistos.has(reg.idLimpo)) {
      falharMatriz(
        registrarErro,
        `Linha ${reg.linha}: ID duplicado '${reg.idLimpo}' em 'openspec/matriz-requisitos.md'. IDs são imutáveis e únicos.`
      );
    }
    idsVistos.add(reg.idLimpo);

    // Regra 3: Status Canônico
    if (!STATUS_CANONICOS_MATRIZ.includes(reg.statusLimpo)) {
      falharMatriz(
        registrarErro,
        `Linha ${reg.linha} (${reg.idLimpo}): Status inválido '${reg.statusLimpo}'.\n` +
        `Valores permitidos: ${STATUS_CANONICOS_MATRIZ.join(' | ')}.`
      );
    }

    // Regra 4: Sensor Anti-Apodrecimento em Fonte (docs/, openspec/, src/)
    for (const caminhoFonte of extrairCaminhosEmCrases(reg.fonte)) {
      if (/^(docs|openspec|src)\//i.test(caminhoFonte)) {
        const norm = caminhoFonte.replace(/\\/g, '/');
        caminhosFonteRastreados.add(norm);
        if (!existsSync(join(cwd, norm))) {
          falharMatriz(
            registrarErro,
            `Linha ${reg.linha} (${reg.idLimpo}): A coluna Fonte referencia '${norm}', mas o arquivo não foi encontrado no disco.`
          );
        }
      }
    }

    // Regra 5: Anti-Teatro de Entrega ([x] Entregue exige >= 1 prova real no disco)
    if (reg.statusLimpo === '[x] Entregue') {
      const provas = extrairCaminhosEmCrases(reg.provaReal).filter(ehCaminhoArquivoLocal);
      if (provas.length === 0) {
        falharMatriz(
          registrarErro,
          `Linha ${reg.linha} (${reg.idLimpo}): Status '[x] Entregue' exige pelo menos 1 caminho real entre crases na coluna 'Prova Real' (ex.: \`tests/...\`).`
        );
      }
      for (const prova of provas) {
        const norm = prova.replace(/\\/g, '/');
        if (!existsSync(join(cwd, norm))) {
          falharMatriz(
            registrarErro,
            `Linha ${reg.linha} (${reg.idLimpo}): Prova Real '${norm}' não encontrada no disco (ponteiro inexistente).`
          );
        }
        caminhosProvaEntregues.add(norm);
      }
    }
  }

  // Regra 5b: Sensor Anti-Apodrecimento Reverso (remoção/renomeação de Prova Real ou Fonte sem atualizar matriz)
  const matrizEstaStaged = modificados.some(
    (item) => (item.arquivo || '').toLowerCase() === 'openspec/matriz-requisitos.md'
  );
  const removidos = obterCaminhosRemovidosOuRenomeados(cwd, modificados);
  if (!matrizEstaStaged) {
    for (const arqRemovido of removidos) {
      if (caminhosProvaEntregues.has(arqRemovido) || caminhosFonteRastreados.has(arqRemovido)) {
        falharMatriz(
          registrarErro,
          `Sensor Anti-Apodrecimento Reverso: O arquivo '${arqRemovido}' referenciado em 'openspec/matriz-requisitos.md' foi removido ou renomeado sem atualização da matriz.\n\n` +
          `-> Solução: Atualize 'openspec/matriz-requisitos.md' e inclua o arquivo no commit.`
        );
      }
    }
  }

  // Regra 6a: Trava de Archive no Gate 2
  for (const sub of subpastasArchiveStaged) {
    const fatiaCanon = sub.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    for (const reg of registros) {
      if (
        reg.statusLimpo === '[~] Em andamento' &&
        (reg.fatiaLimpa === sub || reg.fatiaLimpa === fatiaCanon)
      ) {
        falharMatriz(
          registrarErro,
          `Trava de Archive no Gate 2: A fatia '${sub}' está sendo arquivada, mas '${reg.idLimpo}' ainda consta como '[~] Em andamento' na matriz.\n\n` +
          `-> Solução: Atualize '${reg.idLimpo}' para '[x] Entregue' (com Prova Real) ou '[-] Descartado'.`
        );
      }
    }
  }

  // Regra 6b: Avisos não-bloqueantes [AVISO MATRIZ] em commits de Nível 2
  if (!ehFundacao && arquivosProducao.length > 0 && mudancasAtivas.length > 0 && registrarInfo) {
    if (!matrizEstaStaged) {
      registrarInfo(
        `[AVISO MATRIZ] Alteração de produção em Nível 2 sem atualização staged de 'openspec/matriz-requisitos.md'. Lembre-se de marcar os REQ entregues com Prova Real antes do Gate 2.`
      );
    }
    for (const mudanca of mudancasAtivas) {
      const camProposal = join(cwd, 'openspec', 'changes', mudanca, 'proposal.md');
      if (existsSync(camProposal)) {
        try {
          const textoProposal = readFileSync(camProposal, 'utf8');
          if (!/\bREQ-\d{2,4}\b/.test(textoProposal)) {
            registrarInfo(
              `[AVISO MATRIZ] O arquivo 'openspec/changes/${mudanca}/proposal.md' não cita nenhum ID 'REQ-XX' de 'openspec/matriz-requisitos.md'.`
            );
          }
        } catch {}
      }
    }
  }
}
