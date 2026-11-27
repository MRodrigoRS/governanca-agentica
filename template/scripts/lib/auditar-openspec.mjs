/**
 * ==============================================================================
 * Auditoria Estrutural de OpenSpec e Roadmap — auditar-openspec.mjs
 * ==============================================================================
 * Valida roadmap v3/v4, deltas OpenSpec (proposal, specs, design, tasks) e
 * trava anti-arquivamento retornando arrays puros de erros para agregação.
 * ==============================================================================
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const MARCADORES_PREGUICA = [
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

export function obterMudancasAtivasOpenSpec(cwd = process.cwd()) {
  const pastaMudancas = join(cwd, 'openspec', 'changes');
  if (!existsSync(pastaMudancas)) return [];
  try {
    return readdirSync(pastaMudancas).filter((entrada) => {
      if (entrada === 'archive' || entrada.startsWith('.')) return false;
      return statSync(join(pastaMudancas, entrada)).isDirectory();
    });
  } catch {
    return [];
  }
}

export function extrairNomeFatiaCanonica(nomeMudanca) {
  const semData = nomeMudanca.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return semData.startsWith('fatia-') ? semData : null;
}

export function auditarFatiasDetalhadasV3(cwd = process.cwd()) {
  const erros = [];
  const pastaRoadmap = join(cwd, 'openspec', 'roadmap');
  if (!existsSync(pastaRoadmap)) return erros;

  const secoesObrigatorias = ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.', '## 6.', '## 7.'];
  const arquivos = readdirSync(pastaRoadmap).filter(
    (nome) => nome.startsWith('fatia-') && nome.endsWith('.md')
  );

  for (const nomeArquivo of arquivos) {
    const conteudo = readFileSync(join(pastaRoadmap, nomeArquivo), 'utf8');
    const linhasUteis = conteudo.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const secoesFaltantes = secoesObrigatorias.filter((secao) => !conteudo.includes(secao));
    if (secoesFaltantes.length > 0) {
      erros.push(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' não contém todas as 7 seções obrigatórias de '_template-fatia.md'.\n` +
        `Seções ausentes: ${secoesFaltantes.join(', ')}\n\n` +
        `-> Solução: Detalhe completamente a fatia seguindo 'openspec/roadmap/_template-fatia.md'.`
      );
      continue;
    }

    if (linhasUteis.length < 25) {
      erros.push(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' está comprimido ou superficial demais (${linhasUteis.length} linhas úteis; mínimo exigido: 25).\n\n` +
        `-> Solução: Especifique tabelas, colunas em PT-BR, schemas Zod/Pydantic, estados assíncronos de UI, regras de negócio e roteiro Test-First.`
      );
    }

    const marcadorEncontrado = MARCADORES_PREGUICA.find((m) => conteudo.includes(m));
    if (marcadorEncontrado) {
      erros.push(
        `Cláusula Anti-Preguiça nas Fatias Incrementais (D18):\n` +
        `O arquivo 'openspec/roadmap/${nomeArquivo}' ainda contém marcadores não preenchidos ('${marcadorEncontrado}').\n\n` +
        `-> Solução: Substitua todos os placeholders pelo planejamento real e detalhado da fatia.`
      );
    }
  }
  return erros;
}

export function auditarRoadmapV4(cwd = process.cwd()) {
  const erros = [];
  const caminhoRoadmap = join(cwd, 'openspec', 'roadmap.md');
  if (!existsSync(caminhoRoadmap)) return erros;

  const conteudo = readFileSync(caminhoRoadmap, 'utf8');
  const marcador = MARCADORES_PREGUICA.find((m) => conteudo.includes(m));
  if (marcador) {
    erros.push(
      `Cláusula Anti-Preguiça no Roadmap (D18 + D32):\n` +
      `O arquivo 'openspec/roadmap.md' contém marcadores não preenchidos ('${marcador}').\n\n` +
      `-> Solução: Preencha o planejamento com o escopo real e detalhado da fatia.`
    );
  }

  const blocos = conteudo.split(/(?=\n###\s+(?:\[[ x~]\]\s+)?fatia-)/i);
  for (const bloco of blocos) {
    if (!/^\n?###\s+(?:\[[ x~]\]\s+)?fatia-/i.test(bloco)) continue;
    const nomeBloco = bloco.trim().split('\n')[0].replace(/^###\s+/, '');
    const ausentes = [];
    if (!/Depende de/i.test(bloco)) ausentes.push('Depende de');
    if (!/Objetivo/i.test(bloco)) ausentes.push('Objetivo');
    if (!/ENTRA/i.test(bloco)) ausentes.push('ENTRA');
    if (!/FICA DE FORA/i.test(bloco)) ausentes.push('FICA DE FORA');

    if (ausentes.length > 0) {
      erros.push(
        `Auditoria Estrutural do Roadmap Rolling Wave (D32):\n` +
        `O bloco '${nomeBloco}' em 'openspec/roadmap.md' não contém as âncoras obrigatórias.\n` +
        `Âncoras ausentes: ${ausentes.join(', ')}\n\n` +
        `-> Solução: Estruture cada fatia com 'Depende de', 'Objetivo de Valor', 'O que ENTRA' e 'O que FICA DE FORA'.`
      );
    }
  }
  return erros;
}

function auditarDeltaModoV3(caminhoPasta, nomeMudanca) {
  const erros = [];
  for (const nomeArquivo of ['proposal.md', 'design.md', 'tasks.md']) {
    const caminhoArquivo = join(caminhoPasta, nomeArquivo);
    if (!existsSync(caminhoArquivo)) {
      erros.push(
        `Delta de Nível 2 Incompleto (D14 + D18):\n` +
        `A mudança '${nomeMudanca}' não possui o arquivo obrigatório '${nomeArquivo}'.\n\n` +
        `-> Solução: Preencha 'proposal.md', 'design.md' e 'tasks.md' com o plano da fatia antes de comitar código de produção.`
      );
      continue;
    }
    if (readFileSync(caminhoArquivo, 'utf8').trim().length < 30) {
      erros.push(
        `Cláusula Anti-Preguiça no Delta (D18):\n` +
        `O arquivo '${nomeMudanca}/${nomeArquivo}' está vazio ou superficial demais.\n\n` +
        `-> Solução: Documente adequadamente a proposta, o desenho técnico e as tarefas da fatia.`
      );
    }
  }
  return erros;
}

function coletarArquivosSpec(dir, saida = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const sub = join(dir, ent.name);
    if (ent.isDirectory()) coletarArquivosSpec(sub, saida);
    else if (ent.name.endsWith('.md')) saida.push(sub);
  }
  return saida;
}

function auditarDeltaModoV4(cwd, caminhoPasta, nomeMudanca) {
  const erros = [];
  const obrigatorios = ['proposal.md', 'design.md', 'tasks.md'];
  const faltando = obrigatorios.filter((arq) => !existsSync(join(caminhoPasta, arq)));
  for (const arq of faltando) {
    erros.push(
      `Delta OpenSpec Incompleto (D14 + D32):\n` +
      `A mudança '${nomeMudanca}' não possui o arquivo obrigatório '${arq}'.\n\n` +
      `-> Solução: Crie '${arq}' com os pilares obrigatórios da governança v4.`
    );
  }

  if (existsSync(join(caminhoPasta, 'proposal.md'))) {
    const conteudoProposal = readFileSync(join(caminhoPasta, 'proposal.md'), 'utf8');
    const linhas = conteudoProposal.split('\n').map((l) => l.trim()).filter(Boolean);
    if (linhas.length < 10) {
      erros.push(`Pilar Proposal Superficial (D32):\nO arquivo '${nomeMudanca}/proposal.md' tem apenas ${linhas.length} linhas úteis (mínimo exigido: 10).`);
    }
    const okPorQue = /##\s+(Por que|Por Quê|Why)/i.test(conteudoProposal);
    const okMuda = /##\s+(O que muda|Escopo|What Changes)/i.test(conteudoProposal);
    const okFora = /(Fica de Fora|Fora de Escopo|Out of Scope)/i.test(conteudoProposal);
    if (!okPorQue || !okMuda || !okFora) {
      erros.push(`Cabeçalhos Obrigatórios em Proposal (D32):\nO arquivo '${nomeMudanca}/proposal.md' deve conter seções 'Por que'/'Why', 'O que muda'/'What Changes' e menção a 'Fica de Fora'/'Out of Scope'.`);
    }
  }

  const pastaSpecs = join(caminhoPasta, 'specs');
  let arquivosSpec = [];
  if (!existsSync(pastaSpecs)) {
    erros.push(`Specs Ausentes no Delta (D32):\nA mudança '${nomeMudanca}' não possui o diretório 'specs/'. Todo delta de Nível 2 exige ao menos uma especificação com cenários Given/When/Then.`);
  } else {
    arquivosSpec = coletarArquivosSpec(pastaSpecs);
    if (arquivosSpec.length === 0) {
      erros.push(`Nenhum arquivo spec.md em '${nomeMudanca}/specs/' (D32).\nTodo delta de Nível 2 exige ao menos um arquivo de especificação com cenários de teste.`);
    }
    for (const arqSpec of arquivosSpec) {
      const cSpec = readFileSync(arqSpec, 'utf8');
      if (/##\s+(ADDED|MODIFIED)\s+Requirements/i.test(cSpec)) {
        const valido = /###\s+Requirement:/i.test(cSpec) && /####\s+Scenario:/i.test(cSpec) && /\bWHEN\b/i.test(cSpec) && /\bTHEN\b/i.test(cSpec);
        if (!valido) {
          erros.push(`Formato Inválido de Spec (D32):\nO arquivo '${arqSpec.replace(cwd, '')}' contém deltas ADDED/MODIFIED mas não implementa '### Requirement:', '#### Scenario:' com 'WHEN' e 'THEN'.`);
        }
      }
    }
  }

  if (existsSync(join(caminhoPasta, 'design.md'))) {
    const cDesign = readFileSync(join(caminhoPasta, 'design.md'), 'utf8');
    const linhas = cDesign.split('\n').map((l) => l.trim()).filter(Boolean);
    if (linhas.length < 18) {
      erros.push(`Pilar Design Técnico Superficial (D32):\nO arquivo '${nomeMudanca}/design.md' tem apenas ${linhas.length} linhas úteis (mínimo exigido: 18).`);
    }
    const okContratos = /##\s+.*(Contratos|Dados|Schemas)/i.test(cDesign);
    const okInterface = /##\s+.*(Interface|Estados)/i.test(cDesign) || /Não se aplica:\s*.{10,}/i.test(cDesign);
    const okRegras = /##\s+.*(Regras|Segurança|Seguranca)/i.test(cDesign);
    if (!okContratos || !okInterface || !okRegras) {
      erros.push(`Cabeçalhos Obrigatórios em Design (D32):\nO arquivo '${nomeMudanca}/design.md' deve conter seções de 'Contratos/Dados/Schemas', 'Interface/Estados' (ou 'Não se aplica: ...') e 'Regras de Negócio/Segurança'.`);
    }
  }

  if (existsSync(join(caminhoPasta, 'tasks.md'))) {
    const cTasks = readFileSync(join(caminhoPasta, 'tasks.md'), 'utf8');
    const linhas = cTasks.split('\n').map((l) => l.trim()).filter(Boolean);
    if (linhas.length < 12) {
      erros.push(`Pilar Tarefas Superficial (D32):\nO arquivo '${nomeMudanca}/tasks.md' tem apenas ${linhas.length} linhas úteis (mínimo exigido: 12).`);
    }
    const okTestFirst = /(Vermelho|Red|teste falhando)/i.test(cTasks);
    const okRoteiro = /##\s+.*(Roteiro de Validação Prática|Roteiro Prático|Roteiro de Validacao)/i.test(cTasks);
    if (!okTestFirst || !okRoteiro) {
      erros.push(`Marcações Obrigatórias em Tasks (D32):\nO arquivo '${nomeMudanca}/tasks.md' deve conter tarefas marcadas com Test-First ('Vermelho'/'Red'/'teste falhando') e seção '## Roteiro de Validação Prática'.`);
    }
  }

  for (const arq of [...obrigatorios, ...arquivosSpec]) {
    const caminho = arq.startsWith(caminhoPasta) ? arq : join(caminhoPasta, arq);
    if (!existsSync(caminho)) continue;
    const marcador = MARCADORES_PREGUICA.find((m) => readFileSync(caminho, 'utf8').includes(m));
    if (marcador) {
      erros.push(`Cláusula Anti-Preguiça no Delta (D18 + D32):\nO arquivo '${arq}' ainda contém marcadores não preenchidos ('${marcador}').`);
    }
  }
  return erros;
}

export function auditarPastaMudancaOpenSpec(cwd, caminhoPasta, nomeMudanca) {
  const erros = [];
  const fatiaCanonica = extrairNomeFatiaCanonica(nomeMudanca);
  if (fatiaCanonica) {
    const caminhoRoadmapV3 = join(cwd, 'openspec', 'roadmap', `${fatiaCanonica}.md`);
    const caminhoRoadmapV4 = join(cwd, 'openspec', 'roadmap.md');

    if (existsSync(caminhoRoadmapV3)) {
      return auditarDeltaModoV3(caminhoPasta, nomeMudanca);
    }

    if (!existsSync(caminhoRoadmapV4)) {
      erros.push(
        `Vínculo Obrigatório Roadmap ↔ OpenSpec (D18 + D21):\n` +
        `A mudança '${nomeMudanca}' refere-se à fatia incremental '${fatiaCanonica}', mas nem 'openspec/roadmap.md' nem 'openspec/roadmap/${fatiaCanonica}.md' existem.\n\n` +
        `-> Solução: Crie 'openspec/roadmap.md' contendo o bloco da fatia ou 'openspec/roadmap/${fatiaCanonica}.md'.`
      );
      return erros;
    }

    if (!readFileSync(caminhoRoadmapV4, 'utf8').includes(fatiaCanonica)) {
      erros.push(
        `Vínculo Obrigatório Roadmap ↔ OpenSpec (D18 + D21):\n` +
        `A mudança '${nomeMudanca}' refere-se à fatia incremental '${fatiaCanonica}', mas o identificador não foi encontrado em 'openspec/roadmap.md':\n` +
        `Ausente: '${fatiaCanonica}'\n\n` +
        `-> Solução: Registre o bloco da fatia em 'openspec/roadmap.md' antes de abrir ou comitar a fatia.`
      );
    }
  }
  erros.push(...auditarDeltaModoV4(cwd, caminhoPasta, nomeMudanca));
  return erros;
}

export function verificarTarefasAbertasEmDeltaArquivado(caminhoPasta, nomeMudanca) {
  const arqTasks = join(caminhoPasta, 'tasks.md');
  if (!existsSync(arqTasks)) return [];

  const linhas = readFileSync(arqTasks, 'utf8').split('\n');
  const tarefasAbertas = [];
  for (let i = 0; i < linhas.length; i++) {
    const match = linhas[i].match(/^\s*-\s*\[ \]\s*(.+)/);
    if (match && !/\(adiada:|\(cancelada:/i.test(match[1])) {
      tarefasAbertas.push(`Linha ${i + 1}: ${match[1].trim()}`);
    }
  }

  if (tarefasAbertas.length === 0) return [];
  return [
    `Trava Anti-Arquivamento com Tarefas Abertas (Artigo 8 / Fatia 09a):\n` +
    `A mudança arquivada '${nomeMudanca}' possui tarefas pendentes (- [ ]) sem justificativa formal:\n` +
    tarefasAbertas.map((t) => `  * ${t}`).join('\n') +
    `\n\n-> Solução: Conclua as tarefas e marque '- [x]', ou justifique formalmente no tasks.md adicionando '(adiada: <motivo>)' ou '(cancelada: <motivo>)'.`
  ];
}
