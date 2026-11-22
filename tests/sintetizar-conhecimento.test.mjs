import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ehArquivoDeDocumentacaoOuGovernanca,
  ehArquivoDeProducao,
} from '../template/scripts/lib/classificar-arquivos.mjs';

const raiz = process.cwd();

describe('Fatia 15: Síntese de Conhecimento em Escala (Map-Reduce Anti-Alucinação)', () => {
  test('skill_sintetizar_conhecimento_deve_existir_com_contrato_map_reduce_completo', () => {
    const caminhoSkill = path.join(
      raiz,
      'template',
      '.agents',
      'skills',
      'sintetizar-conhecimento',
      'SKILL.md'
    );
    assert.ok(fs.existsSync(caminhoSkill), 'SKILL.md de sintetizar-conhecimento deve existir');

    const conteudo = fs.readFileSync(caminhoSkill, 'utf8');

    // Frontmatter YAML
    assert.match(conteudo, /^---\r?\n[\s\S]*name:\s*sintetizar-conhecimento\b[\s\S]*description:/);

    // Congelamento estrito de código e proibição de openspec/changes/
    assert.match(conteudo, /congelamento estrito/i);
    assert.match(conteudo, /código de produção/i);
    assert.match(conteudo, /openspec\/changes\//);

    // Triagem de volume: <= 8 leitura direta vs > 8 Map-Reduce paralelo read-only
    assert.match(conteudo, /8/);
    assert.match(conteudo, /Map-Reduce/i);
    assert.match(conteudo, /subagentes/i);
    assert.match(conteudo, /read-only/i);
    assert.match(conteudo, /paralelo/i);

    // Ingestão de INDICE.md, capítulos e materiais/
    assert.match(conteudo, /docs\/conhecimento\/INDICE\.md/);
    assert.match(conteudo, /docs\/conhecimento\/<NN>-<slug>\.md/);
    assert.match(conteudo, /docs\/conhecimento\/materiais\//);

    // Detector de contradições + parada humana
    assert.match(conteudo, /contradi[cç][õo]es/i);
    assert.match(conteudo, /parar|interromp/i);

    // Rastreabilidade anti-alucinação + Lacunas / Decisões Pendentes
    assert.match(conteudo, /alucina[cç][aã]o|inventar/i);
    assert.match(conteudo, /Lacunas \/ Decisões Pendentes/i);
    assert.match(conteudo, /Fontes de Conhecimento/i);

    // Destilação em 2 camadas (Camada 1: Invariantes Globais + Mapa de Domínios; Camada 2: openspec/roadmap.md)
    assert.match(conteudo, /Camada 1/i);
    assert.match(conteudo, /Invariantes Globais/i);
    assert.match(conteudo, /Mapa de Domínios/i);
    assert.match(conteudo, /Camada 2/i);
    assert.match(conteudo, /openspec\/roadmap\.md/);
    for (const ancora of ['Depende de:', 'Objetivo de Valor:', 'O que ENTRA:', 'O que FICA DE FORA:']) {
      assert.ok(conteudo.includes(ancora), `Destilação para roadmap deve incluir âncora '${ancora}'`);
    }
  });

  test('subpasta_materiais_e_indice_devem_suportar_insumos_externos_e_sintetizar', () => {
    const caminhoGitkeep = path.join(raiz, 'template', 'docs', 'conhecimento', 'materiais', '.gitkeep');
    assert.ok(fs.existsSync(caminhoGitkeep), 'template/docs/conhecimento/materiais/.gitkeep deve existir');

    const indice = fs.readFileSync(
      path.join(raiz, 'template', 'docs', 'conhecimento', 'INDICE.md'),
      'utf8'
    );
    assert.match(indice, /docs\/conhecimento\/materiais\//);
    assert.match(indice, /\/sintetizar/);
  });

  test('mesa_de_descoberta_e_inicializar_stack_devem_acionar_sintetizar_automaticamente', () => {
    const mesa = fs.readFileSync(
      path.join(raiz, 'template', '.agents', 'skills', 'mesa-de-descoberta', 'SKILL.md'),
      'utf8'
    );
    const init = fs.readFileSync(
      path.join(raiz, 'template', '.agents', 'skills', 'inicializar-stack', 'SKILL.md'),
      'utf8'
    );

    for (const [nome, texto] of [
      ['mesa-de-descoberta', mesa],
      ['inicializar-stack', init],
    ]) {
      assert.match(
        texto,
        /\.agents\/skills\/sintetizar-conhecimento\/SKILL\.md/,
        `${nome} deve acionar .agents/skills/sintetizar-conhecimento/SKILL.md automaticamente`
      );
      assert.match(texto, /8/, `${nome} deve mencionar o limiar de 8 arquivos para acionar síntese`);
      assert.match(
        texto,
        /docs\/conhecimento\/materiais\//,
        `${nome} deve mencionar materiais externos como gatilho automático de síntese`
      );
    }
  });

  test('indices_classificacao_documental_e_ci_devem_estar_sincronizados', () => {
    const templateAgents = fs.readFileSync(path.join(raiz, 'template', 'AGENTS.md'), 'utf8');
    const templateReadme = fs.readFileSync(path.join(raiz, 'template', 'README.md.jinja'), 'utf8');
    const rootAgents = fs.readFileSync(path.join(raiz, 'AGENTS.md'), 'utf8');

    for (const [nome, texto] of [
      ['template/AGENTS.md', templateAgents],
      ['AGENTS.md', rootAgents],
    ]) {
      assert.ok(texto.includes('sintetizar-conhecimento'), `${nome} deve referenciar sintetizar-conhecimento`);
      assert.ok(texto.includes('/sintetizar'), `${nome} deve listar o comando /sintetizar`);
    }

    assert.ok(
      templateReadme.includes('/sintetizar'),
      'template/README.md.jinja deve mencionar /sintetizar'
    );
    assert.ok(
      templateReadme.includes('docs/conhecimento/materiais/'),
      'template/README.md.jinja deve mencionar docs/conhecimento/materiais/'
    );

    assert.equal(
      ehArquivoDeDocumentacaoOuGovernanca('docs/conhecimento/materiais/resumo-notebooklm.md'),
      true
    );
    assert.equal(ehArquivoDeProducao('docs/conhecimento/materiais/resumo-notebooklm.md'), false);

    const ci = fs.readFileSync(path.join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.ok(
      ci.includes('.agents/skills/sintetizar-conhecimento/SKILL.md'),
      '.github/workflows/ci.yml deve validar .agents/skills/sintetizar-conhecimento/SKILL.md no job Copier'
    );
    assert.ok(
      ci.includes('docs/conhecimento/materiais'),
      '.github/workflows/ci.yml deve validar docs/conhecimento/materiais no job Copier'
    );
  });
});
