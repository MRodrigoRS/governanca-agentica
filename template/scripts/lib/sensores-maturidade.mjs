/**
 * ==============================================================================
 * Sensores Determinísticos de Maturidade — sensores-maturidade.mjs
 * ==============================================================================
 * Emite avisos não-bloqueantes ([AVISO MATURIDADE]) quando o crescimento real
 * do repositório indica momento de popular artefatos vivos de escala:
 * 1. Catálogo de Reúso (`docs/catalogo-reuso.md`)
 * 2. Matriz de Rastreabilidade (`openspec/matriz-requisitos.md`)
 * 3. Runbook Operacional (`docs/runbook.md`)
 * Zero dependências externas: Node.js ESM puro.
 * ==============================================================================
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extrairPonteirosMarkdown } from './sensores-indices.mjs';
import { parsearTabelaMatriz } from './auditar-matriz-requisitos.mjs';

const PASTAS_IGNORADAS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.output',
  '.venv', 'venv', 'target', 'vendor', 'addons', 'coverage', 'openspec', 'docs', 'tests',
]);

const EXTENSOES_UI_OU_JOGO = ['.tsx', '.jsx', '.vue', '.svelte', '.gd'];

function contarArquivosUiOuJogo(cwd, limite = 5) {
  let total = 0;
  function caminhar(dir) {
    if (total >= limite) return;
    let entradas = [];
    try {
      entradas = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entradas) {
      if (total >= limite) return;
      if (ent.isDirectory()) {
        if (PASTAS_IGNORADAS.has(ent.name) || ent.name.startsWith('.')) continue;
        caminhar(join(dir, ent.name));
      } else if (ent.isFile()) {
        const min = ent.name.toLowerCase();
        if (EXTENSOES_UI_OU_JOGO.some((ext) => min.endsWith(ext))) {
          total++;
        }
      }
    }
  }
  caminhar(cwd);
  return total;
}

function verificarSensorCatalogoReuso(cwd) {
  const camCatalogo = join(cwd, 'docs', 'catalogo-reuso.md');
  if (!existsSync(camCatalogo)) return null;

  const qtdUi = contarArquivosUiOuJogo(cwd, 5);
  if (qtdUi < 5) return null;

  try {
    const conteudo = readFileSync(camCatalogo, 'utf8');
    const ponteiros = extrairPonteirosMarkdown(conteudo.split('\n'), {
      permitirDiretorios: false,
      aceitarListas: true,
      cwd,
    });
    if (ponteiros.length === 0) {
      return `[AVISO MATURIDADE] Detectados >= 5 arquivos de UI/jogo sem itens catalogados em 'docs/catalogo-reuso.md'. Registre seus tokens e primitivos compartilhados para prevenir duplicação (Artigo 14).`;
    }
  } catch {}
  return null;
}

function contarSubpastasArchive(cwd) {
  const pasta = join(cwd, 'openspec', 'changes', 'archive');
  if (!existsSync(pasta)) return 0;
  try {
    return readdirSync(pasta, { withFileTypes: true }).filter(
      (ent) => ent.isDirectory() && !ent.name.startsWith('.')
    ).length;
  } catch {
    return 0;
  }
}

function contarCapitulosConhecimento(cwd) {
  const pasta = join(cwd, 'docs', 'conhecimento');
  if (!existsSync(pasta)) return 0;
  try {
    return readdirSync(pasta, { withFileTypes: true }).filter(
      (ent) => ent.isFile() && ent.name.endsWith('.md') && ent.name.toUpperCase() !== 'INDICE.MD'
    ).length;
  } catch {
    return 0;
  }
}

function verificarSensorMatrizRequisitos(cwd) {
  const camMatriz = join(cwd, 'openspec', 'matriz-requisitos.md');
  if (!existsSync(camMatriz)) return null;

  const archives = contarSubpastasArchive(cwd);
  const capitulos = contarCapitulosConhecimento(cwd);
  if (archives < 4 && capitulos < 5) return null;

  try {
    const conteudo = readFileSync(camMatriz, 'utf8');
    const { registros } = parsearTabelaMatriz(conteudo);
    if (registros.length === 0) {
      return `[AVISO MATURIDADE] O projeto atingiu escala (${archives} fatias arquivadas, ${capitulos} capítulos em docs/conhecimento/) sem requisitos cadastrados em 'openspec/matriz-requisitos.md'. Considere rastrear os REQ-XX ponta-a-ponta (Artigo 12.6).`;
    }
  } catch {}
  return null;
}

function possuiInfraDeploy(cwd) {
  const arquivosRaiz = new Set([
    'dockerfile', 'vercel.json', 'fly.toml', 'render.yaml',
    'render.yml', 'railway.json', 'railway.toml', 'procfile',
  ]);
  try {
    for (const ent of readdirSync(cwd, { withFileTypes: true })) {
      if (!ent.isFile()) continue;
      const min = ent.name.toLowerCase();
      if (arquivosRaiz.has(min) || min.startsWith('dockerfile.') || /^docker-compose(\.[a-z0-9_-]+)?\.ya?ml$/i.test(min)) {
        return true;
      }
    }
  } catch {}

  const dirWorkflows = join(cwd, '.github', 'workflows');
  if (existsSync(dirWorkflows)) {
    try {
      return readdirSync(dirWorkflows).some((nome) => {
        const min = nome.toLowerCase();
        return min.includes('deploy') && (min.endsWith('.yml') || min.endsWith('.yaml'));
      });
    } catch {}
  }
  return false;
}

function verificarSensorRunbook(cwd) {
  const camRunbook = join(cwd, 'docs', 'runbook.md');
  if (!existsSync(camRunbook) || !possuiInfraDeploy(cwd)) return null;

  try {
    const conteudo = readFileSync(camRunbook, 'utf8');
    const matchesPlaceholder = conteudo.match(/\*\(Ex\.:/g) || [];
    if (matchesPlaceholder.length >= 2) {
      return `[AVISO MATURIDADE] Arquivos de deploy/infraestrutura detectados no repositório, mas 'docs/runbook.md' ainda contém placeholders de exemplo. Documente os procedimentos reais de publicação, migrations e rollback.`;
    }
  } catch {}
  return null;
}

export function coletarAvisosMaturidade(cwd = process.cwd(), ehFundacao = false) {
  if (ehFundacao) return [];
  const avisos = [];
  for (const aviso of [
    verificarSensorCatalogoReuso(cwd),
    verificarSensorMatrizRequisitos(cwd),
    verificarSensorRunbook(cwd),
  ]) {
    if (aviso) avisos.push(aviso);
  }
  return avisos;
}
