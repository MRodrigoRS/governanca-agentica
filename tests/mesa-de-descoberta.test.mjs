import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ehArquivoDeDocumentacaoOuGovernanca,
  ehArquivoDeProducao,
} from '../template/scripts/lib/classificar-arquivos.mjs';

const raiz = process.cwd();

describe('Fatia 14: Mesa de Descoberta Contínua e Livro de Conhecimento', () => {
  test('skill_mesa_de_descoberta_deve_existir_com_contrato_completo', () => {
    const caminhoSkill = path.join(
      raiz,
      'template',
      '.agents',
      'skills',
      'mesa-de-descoberta',
      'SKILL.md'
    );
    assert.ok(fs.existsSync(caminhoSkill), 'SKILL.md de mesa-de-descoberta deve existir');

    const conteudo = fs.readFileSync(caminhoSkill, 'utf8');

    // Frontmatter YAML
    assert.match(conteudo, /^---\r?\n[\s\S]*name:\s*mesa-de-descoberta\b[\s\S]*description:/);

    // Congelamento estrito de código e proibição de openspec/changes/
    assert.match(conteudo, /congelamento estrito/i);
    assert.match(conteudo, /código de produção/i);
    assert.match(conteudo, /openspec\/changes\//);

    // Separação explícita de Fonte Única (livro upstream vs. openspec/specs/)
    assert.match(conteudo, /upstream/i);
    assert.match(conteudo, /openspec\/specs\//);

    // Loop contínuo/infinito multi-sessão guiado por INDICE.md
    assert.match(conteudo, /loop/i);
    assert.match(conteudo, /docs\/conhecimento\/INDICE\.md/);
    assert.match(conteudo, /Fios em Aberto/i);

    // Modelo híbrido de especialistas (6 lentes + painel paralelo read-only)
    for (const lente of [
      '[Produto]',
      '[Arquitetura]',
      '[Dados & Escala]',
      '[Segurança]',
      '[UX]',
      '[Negócio]',
    ]) {
      assert.ok(conteudo.includes(lente), `SKILL.md deve incluir a lente especialista ${lente}`);
    }
    assert.match(conteudo, /subagentes/i);
    assert.match(conteudo, /read-only/i);
    assert.match(conteudo, /paralelo/i);

    // Cristalização incremental somente com permissão explícita + molde YAML + links relativos
    assert.match(conteudo, /permiss[aã]o expl[ií]cita|autoriza[cç][aã]o expl[ií]cita/i);
    assert.match(conteudo, /docs\/conhecimento\/<NN>-<slug>\.md/);
    for (const campo of ['id:', 'tema:', 'especialidade:', 'status:', 'relacionados:']) {
      assert.ok(conteudo.includes(campo), `Molde de capítulo deve exigir campo YAML '${campo}'`);
    }
    assert.match(conteudo, /NotebookLM/i);
    assert.match(conteudo, /Obsidian/i);
    assert.match(conteudo, /Mermaid/i);

    // Ponte opcional de promoção para openspec/roadmap.md com as 4 âncoras v4
    assert.match(conteudo, /openspec\/roadmap\.md/);
    for (const ancora of ['Depende de:', 'Objetivo de Valor:', 'O que ENTRA:', 'O que FICA DE FORA:']) {
      assert.ok(conteudo.includes(ancora), `Ponte para roadmap deve incluir âncora '${ancora}'`);
    }
  });

  test('indice_do_livro_em_template_docs_conhecimento_deve_conter_secoes_padrao', () => {
    const caminhoIndice = path.join(raiz, 'template', 'docs', 'conhecimento', 'INDICE.md');
    assert.ok(fs.existsSync(caminhoIndice), 'template/docs/conhecimento/INDICE.md deve existir');

    const conteudo = fs.readFileSync(caminhoIndice, 'utf8');
    assert.match(conteudo, /## 1\.\s*Sum[aá]rio de Cap[ií]tulos/i);
    assert.match(conteudo, /## 2\.\s*Grafo de Rela[cç][õo]es/i);
    assert.match(conteudo, /```mermaid/);
    assert.match(conteudo, /## 3\.\s*Fios em Aberto e Pr[oó]ximas Perguntas/i);
    assert.match(conteudo, /## 4\.\s*Uso para S[ií]ntese Externa/i);
    assert.match(conteudo, /NotebookLM/i);
    assert.match(conteudo, /Obsidian/i);
  });

  test('copier_yml_deve_proteger_docs_conhecimento_em_skip_if_exists', () => {
    const copier = fs.readFileSync(path.join(raiz, 'copier.yml'), 'utf8');
    assert.ok(
      copier.includes('"docs/conhecimento/**"') || copier.includes('- docs/conhecimento/**'),
      'copier.yml deve proteger "docs/conhecimento/**" em _skip_if_exists'
    );
  });

  test('agents_readme_e_raiz_devem_registrar_mesa_de_descoberta_comandos_e_indice', () => {
    const templateAgents = fs.readFileSync(path.join(raiz, 'template', 'AGENTS.md'), 'utf8');
    const templateReadme = fs.readFileSync(path.join(raiz, 'template', 'README.md.jinja'), 'utf8');
    const rootAgents = fs.readFileSync(path.join(raiz, 'AGENTS.md'), 'utf8');

    for (const [nome, texto] of [
      ['template/AGENTS.md', templateAgents],
      ['AGENTS.md', rootAgents],
    ]) {
      assert.ok(texto.includes('mesa-de-descoberta'), `${nome} deve referenciar mesa-de-descoberta`);
      assert.ok(texto.includes('/descobrir'), `${nome} deve listar o comando /descobrir`);
      assert.ok(texto.includes('/mesa'), `${nome} deve listar o comando /mesa`);
    }

    assert.ok(
      templateAgents.includes('docs/conhecimento/INDICE.md'),
      'template/AGENTS.md deve referenciar docs/conhecimento/INDICE.md'
    );
    assert.ok(
      templateReadme.includes('docs/conhecimento/INDICE.md'),
      'template/README.md.jinja deve indexar docs/conhecimento/INDICE.md'
    );
  });

  test('classificacao_documental_e_validacao_copier_no_ci', () => {
    assert.equal(ehArquivoDeDocumentacaoOuGovernanca('docs/conhecimento/01-visao.md'), true);
    assert.equal(ehArquivoDeProducao('docs/conhecimento/01-visao.md'), false);

    const ci = fs.readFileSync(path.join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.ok(
      ci.includes('docs/conhecimento/INDICE.md'),
      '.github/workflows/ci.yml deve validar docs/conhecimento/INDICE.md no job Copier'
    );
    assert.ok(
      ci.includes('.agents/skills/mesa-de-descoberta/SKILL.md'),
      '.github/workflows/ci.yml deve validar .agents/skills/mesa-de-descoberta/SKILL.md no job Copier'
    );
  });

  test('deve_ativar_mesa_de_descoberta_automaticamente_no_greenfield_e_exigir_leitura_fisica_anti_alucinacao', () => {
    const templateAgents = fs.readFileSync(path.join(raiz, 'template', 'AGENTS.md'), 'utf8');
    const initSkill = fs.readFileSync(
      path.join(raiz, 'template', '.agents', 'skills', 'inicializar-stack', 'SKILL.md'),
      'utf8'
    );
    const mesaSkill = fs.readFileSync(
      path.join(raiz, 'template', '.agents', 'skills', 'mesa-de-descoberta', 'SKILL.md'),
      'utf8'
    );

    // 1. template/AGENTS.md (Seção 2 - Greenfield): ativa mesa-de-descoberta automaticamente na ausência de produto/stack
    const matchGreenfield = templateAgents.match(/-\s*\*\*Repositório Greenfield[\s\S]*?(?=\n-\s*\*\*Repositório Brownfield)/);
    assert.ok(matchGreenfield, 'template/AGENTS.md deve conter o bloco Repositório Greenfield');
    const blocoGreenfield = matchGreenfield[0];
    assert.match(blocoGreenfield, /\.agents\/skills\/mesa-de-descoberta\/SKILL\.md/);
    assert.match(blocoGreenfield, /\.agents\/skills\/inicializar-stack\/SKILL\.md/);
    assert.match(blocoGreenfield, /docs\/conhecimento\//);
    assert.match(blocoGreenfield, /leitura f[ií]sica/i);

    // 2. inicializar-stack/SKILL.md: entrevista profunda contínua sem teto de 3 rodadas + extração autorizada + leitura física anti-alucinação
    assert.match(initSkill, /\.agents\/skills\/mesa-de-descoberta\/SKILL\.md/);
    assert.match(initSkill, /aus[êe]ncia de produto/i);
    assert.match(initSkill, /eixos progressivos|sem teto/i);
    assert.match(initSkill, /docs\/conhecimento\/<NN>-<slug>\.md/);
    assert.match(initSkill, /docs\/conhecimento\/INDICE\.md/);
    assert.match(initSkill, /permiss[aã]o expl[ií]cita/i);
    assert.match(initSkill, /ler fisicamente|leitura f[ií]sica/i);
    assert.match(initSkill, /alucina[cç][aã]o|esquecimento|lembrar de cabe[cç]a/i);

    // 3. mesa-de-descoberta/SKILL.md: documenta os 2 gatilhos (Automático em Greenfield e Manual via /descobrir ou /mesa)
    assert.match(mesaSkill, /Gatilho Autom[aá]tico/i);
    assert.match(mesaSkill, /Greenfield/i);
    assert.match(mesaSkill, /\.agents\/skills\/inicializar-stack\/SKILL\.md/);
    assert.match(mesaSkill, /Gatilho Manual/i);
  });
});
