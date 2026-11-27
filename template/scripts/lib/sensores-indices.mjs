/**
 * ==============================================================================
 * Sensores Anti-Apodrecimento de Índices e Avisos Operacionais — sensores-indices.mjs
 * ==============================================================================
 * Audita ponteiros em `docs/catalogo-reuso.md` e `docs/arquitetura.md §5`,
 * além de emitir avisos não-bloqueantes de Runbook e `.agents/handoff.md`.
 * ==============================================================================
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function extrairPonteirosTabelaMarkdown(linhas, permitirDiretorios = false) {
  const ponteiros = [];
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (!linha.startsWith('|') || !linha.includes('`')) continue;
    if (/^\|[\s:-]+\|$/.test(linha)) continue;

    for (const m of linha.matchAll(/`([^`]+)`/g)) {
      const caminho = m[1].trim();
      const pareceCaminho = caminho.includes('.') || caminho.includes('/');
      if (!pareceCaminho) continue;
      if (/^@[a-z0-9_.-]+\/[a-z0-9_.-]+(?:\/[a-z0-9_.-]+)*(?:@[^\s]+)?$/i.test(caminho)) continue;
      if (/^https?:\/\//i.test(caminho)) continue;
      if (permitirDiretorios && (/[\s*<>{}()]/.test(caminho) || caminho.startsWith('Ex.:'))) continue;
      ponteiros.push({ linha: i + 1, caminho });
    }
  }
  return ponteiros;
}

function auditarPonteirosTabela({
  cwd,
  caminhoRelativo,
  linhas,
  arquivosModificados,
  tituloErro,
  solucaoRemocao,
  solucaoInexistente,
  permitirDiretorios = false,
}) {
  const erros = [];
  const ponteiros = extrairPonteirosTabelaMarkdown(linhas, permitirDiretorios);
  if (ponteiros.length === 0) return erros;

  const docEstaStaged = arquivosModificados.some(
    (item) => (item.arquivo || '').toLowerCase() === caminhoRelativo.toLowerCase()
  );

  for (const item of arquivosModificados) {
    const status = item.status || '';
    if (status !== 'D' && !status.startsWith('R')) continue;

    const arqRemovidoNorm = item.arquivo.replace(/\\/g, '/');
    for (const p of ponteiros) {
      const pNorm = p.caminho.replace(/\\/g, '/');
      const pPrefixo = pNorm.endsWith('/') ? pNorm : `${pNorm}/`;
      const correspondenciaExata = pNorm === arqRemovidoNorm;
      const pastaEsvaziada =
        permitirDiretorios &&
        arqRemovidoNorm.startsWith(pPrefixo) &&
        !existsSync(join(cwd, p.caminho));

      if ((correspondenciaExata || pastaEsvaziada) && !docEstaStaged) {
        erros.push(
          `${tituloErro}:\n` +
          `O caminho catalogado '${p.caminho}' em '${caminhoRelativo}' foi removido ou renomeado, mas o documento não foi atualizado neste commit para evitar apodrecimento.\n\n` +
          `-> Solução: ${solucaoRemocao(p.caminho)}`
        );
      }
    }
  }

  if (docEstaStaged) {
    for (const p of ponteiros) {
      if (!existsSync(join(cwd, p.caminho))) {
        erros.push(
          `${tituloErro}:\n` +
          `O arquivo '${caminhoRelativo}' (linha ${p.linha}) referencia o caminho '${p.caminho}', mas ele não foi encontrado no disco (ponteiro inexistente).\n\n` +
          `-> Solução: ${solucaoInexistente}`
        );
      }
    }
  }
  return erros;
}

export function verificarSensorAntiApodrecimentoCatalogo(cwd, arquivosModificados) {
  const caminhoCatalogo = join(cwd, 'docs', 'catalogo-reuso.md');
  if (!existsSync(caminhoCatalogo)) return [];

  let conteudo = '';
  try {
    conteudo = readFileSync(caminhoCatalogo, 'utf8');
  } catch {
    return [];
  }
  if (!conteudo) return [];

  return auditarPonteirosTabela({
    cwd,
    caminhoRelativo: 'docs/catalogo-reuso.md',
    linhas: conteudo.split('\n'),
    arquivosModificados,
    tituloErro: 'Sensor Anti-Apodrecimento do Catálogo (Artigo 14)',
    solucaoRemocao: (caminho) =>
      `Atualize 'docs/catalogo-reuso.md' removendo ou atualizando o ponteiro para '${caminho}'.`,
    solucaoInexistente:
      'Certifique-se de que o arquivo existe antes de catalogá-lo ou corrija o caminho apontado no catálogo.',
    permitirDiretorios: false,
  });
}

function extrairLinhasSecaoMapaFisico(conteudo) {
  const linhas = conteudo.split('\n');
  const resultado = [];
  let dentroSecao = false;

  for (const linha of linhas) {
    if (/^##\s+5\.\s+Mapa F[ií]sico/i.test(linha.trim())) {
      dentroSecao = true;
      resultado.push(linha);
      continue;
    }
    if (dentroSecao && /^##\s+/.test(linha.trim())) break;
    resultado.push(dentroSecao ? linha : '');
  }
  return resultado;
}

export function verificarSensorAntiApodrecimentoMapaArquitetura(cwd, arquivosModificados) {
  const caminhoArq = join(cwd, 'docs', 'arquitetura.md');
  if (!existsSync(caminhoArq)) return [];

  let conteudo = '';
  try {
    conteudo = readFileSync(caminhoArq, 'utf8');
  } catch {
    return [];
  }
  if (!conteudo) return [];

  return auditarPonteirosTabela({
    cwd,
    caminhoRelativo: 'docs/arquitetura.md',
    linhas: extrairLinhasSecaoMapaFisico(conteudo),
    arquivosModificados,
    tituloErro: 'Sensor Anti-Apodrecimento do Mapa Físico (docs/arquitetura.md §5)',
    solucaoRemocao: (caminho) =>
      `Atualize a tabela '## 5. Mapa Físico de Módulos' em 'docs/arquitetura.md' removendo ou atualizando '${caminho}'.`,
    solucaoInexistente:
      'Certifique-se de que a pasta ou arquivo mapeado existe no disco ou corrija a tabela na Seção 5 de docs/arquitetura.md.',
    permitirDiretorios: true,
  });
}

function ehArquivoDeployOuEnv(arquivo) {
  const minusculo = arquivo.toLowerCase().replace(/\\/g, '/');
  const nomeBase = minusculo.split('/').pop() || '';
  if (minusculo === '.env.example') return true;
  if (nomeBase === 'dockerfile' || nomeBase.startsWith('dockerfile.')) return true;
  if (/^docker-compose(\.[a-z0-9_-]+)?\.ya?ml$/i.test(nomeBase)) return true;
  if (['fly.toml', 'vercel.json', 'render.yaml', 'render.yml', 'railway.json', 'railway.toml', 'procfile'].includes(nomeBase)) {
    return true;
  }
  return minusculo.startsWith('.github/workflows/') && nomeBase.includes('deploy');
}

export function coletarAvisosOperacionaisEHandoff(cwd, listaArquivos, ehFundacao, arquivosProducao, modoCi) {
  const avisos = [];
  const runbookIncluido = listaArquivos.some((f) => f.toLowerCase() === 'docs/runbook.md');

  if (!ehFundacao && !runbookIncluido) {
    const arquivosDeployOuEnv = listaArquivos.filter(ehArquivoDeployOuEnv);
    if (arquivosDeployOuEnv.length > 0) {
      avisos.push(
        `[AVISO RUNBOOK] Alterações de deploy/infra ou .env.example detectadas (${arquivosDeployOuEnv.join(', ')}) sem atualização de 'docs/runbook.md'. Se o fluxo de publicação, rollback ou variáveis de produção mudou, atualize 'docs/runbook.md'.`
      );
    }
  }

  if (!modoCi && arquivosProducao.length > 0) {
    const caminhoHandoff = join(cwd, '.agents', 'handoff.md');
    if (existsSync(caminhoHandoff)) {
      try {
        const conteudo = readFileSync(caminhoHandoff, 'utf8');
        const mStatus = conteudo.match(/\*\*Status:\*\*\s*(.+)/i);
        const jaConcluido = mStatus && /conclu[ií]do|nenhum|limpo|inativo/i.test(mStatus[1]);
        if (conteudo.trim() && !jaConcluido) {
          avisos.push(
            `[AVISO HANDOFF] O arquivo efêmero '.agents/handoff.md' ainda está ativo. Remova-o ou marque '**Status:** Concluído' ao encerrar a entrega (Gate 2) para evitar contexto obsoleto na próxima sessão.`
          );
        }
      } catch {}
    }
  }
  return avisos;
}
