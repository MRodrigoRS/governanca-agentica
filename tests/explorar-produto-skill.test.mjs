import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const dirTemplate = join(raiz, 'template');

describe('Fatia 18: Conselho Evolutivo de Produto (v4.4.0)', () => {
  test('1_skill_explorar_produto_deve_eliminar_ondas_antigas_e_instituir_conselho_de_3_especialistas', () => {
    const camSkill = join(dirTemplate, '.agents', 'skills', 'explorar-produto', 'SKILL.md');
    assert.ok(existsSync(camSkill), 'explorar-produto/SKILL.md deve existir');
    const conteudo = readFileSync(camSkill, 'utf8');
    const linhas = conteudo.split(/\r?\n/);

    assert.ok(
      linhas.length <= 150,
      `explorar-produto/SKILL.md deve ser concisa (<= 150 linhas, atual: ${linhas.length})`
    );

    // Proibições legadas (Rolling Wave conflitante)
    assert.doesNotMatch(conteudo, /Onda 1/i, 'Não deve mais citar Onda 1');
    assert.doesNotMatch(conteudo, /Onda 2/i, 'Não deve mais citar Onda 2');
    assert.doesNotMatch(
      conteudo,
      /###\s+\[\s*\]\s+Pendente\s+[—-]\s+`?fatia-/i,
      'Não deve conter bloco pré-fabricado de fatia no roadmap'
    );
    assert.doesNotMatch(conteudo, /3 Gavetas Oficiais/i, 'Substituído pelas 4 Saídas Oficiais');

    // Gatilhos, congelamento e execução sob demanda
    assert.match(conteudo, /\/explorar/);
    assert.match(conteudo, /\/evoluir/);
    assert.match(conteudo, /congelamento estrito/i);
    assert.match(conteudo, /sob demanda|nunca.*dispar|não.*dispar/i);

    // 3 especialistas read-only em paralelo + fallback CLI + contrato conciso
    assert.match(conteudo, /Produto\s*&\s*Mercado/i);
    assert.match(conteudo, /Arquiteto Evolutivo/i);
    assert.match(conteudo, /UX\s*&\s*Jornada/i);
    assert.match(conteudo, /read-only/i);
    assert.match(conteudo, /paralelo/i);
    assert.match(conteudo, /CLI|sequencial/i);
    assert.match(conteudo, /25\s+linhas/i);
    assert.match(conteudo, /3\s+achados/i);
    assert.match(conteudo, /\[fonte/i);
    assert.match(conteudo, /openspec\/matriz-requisitos\.md/);
    assert.match(conteudo, /docs\/conhecimento\/INDICE\.md/);
  });

  test('2_skill_explorar_produto_deve_definir_4_quadrantes_artefato_e_4_saidas_oficiais', () => {
    const conteudo = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'explorar-produto', 'SKILL.md'),
      'utf8'
    );

    // 4 Quadrantes + teto de propostas + artefato
    assert.match(conteudo, /Ouro Barato/i);
    assert.match(conteudo, /Repensar\s*&\s*Refatorar/i);
    assert.match(conteudo, /Saltos de Produto/i);
    assert.match(conteudo, /Armadilhas\s*&\s*Cortes/i);
    assert.match(conteudo, /8\s*a\s*10|máx(?:imo)?\.?\s*8/i);
    assert.match(conteudo, /exploracao-produto-YYYY-MM-DD\.md/);
    assert.match(conteudo, /20\s+linhas/i);
    assert.match(conteudo, /➡️/);

    // 4 Saídas Oficiais alinhadas a v4.3.0 + Rolling Wave
    assert.match(conteudo, /docs\/conhecimento\/<NN>-<slug>\.md/);
    assert.match(conteudo, /permissão explícita/i);
    assert.match(conteudo, /Mapa Macro/i);
    assert.match(conteudo, /REQ-XX/);
    assert.match(conteudo, /refinar-ideia/);
    assert.match(conteudo, /Via 1\.5/);
    assert.match(conteudo, /openspec\/radar-oportunidades\.md/);
    assert.match(conteudo, /Fora de Escopo/i);
    assert.match(conteudo, /node scripts\/verificar-governanca\.mjs/);
  });

  test('3_radar_oportunidades_deve_conter_secao_de_evolucoes_e_refatoracoes_estacionadas', () => {
    const camRadar = join(dirTemplate, 'openspec', 'radar-oportunidades.md.jinja');
    assert.ok(existsSync(camRadar), 'template/openspec/radar-oportunidades.md.jinja deve existir');
    const conteudo = readFileSync(camRadar, 'utf8');

    assert.match(conteudo, /Evoluções e Refatorações Estruturais Estacionadas/i);
    assert.match(conteudo, /Histórico.*Conselho|Histórico de Reuniões/i);
    assert.doesNotMatch(conteudo, /Governança v2/i);
    assert.doesNotMatch(conteudo, /openspec\/roadmap\//);
  });

  test('4_sincronia_agents_md_constituicao_artigo_8_e_semver_4_4_0', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.match(pkg.version, /^4\.[4-9]\.\d+$/, 'package.json deve estar em 4.4.0+');

    const templateAgents = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
    assert.match(templateAgents, /governanca:inicio v4\.[4-9]\.\d+/, 'template/AGENTS.md deve ter cabeçalho v4.4.0+');
    assert.ok(templateAgents.includes('/explorar'), 'template/AGENTS.md deve listar /explorar');
    assert.ok(templateAgents.includes('/evoluir'), 'template/AGENTS.md deve listar /evoluir');
    assert.match(templateAgents, /Conselho.*3\s+Subagentes|3\s+Subagentes/i);

    const raizAgents = readFileSync(join(raiz, 'AGENTS.md'), 'utf8');
    assert.ok(raizAgents.includes('/explorar'), 'AGENTS.md da raiz deve listar /explorar');
    assert.ok(raizAgents.includes('/evoluir'), 'AGENTS.md da raiz deve listar /evoluir');

    const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
    assert.match(constituicao, /governanca:inicio v4\.[4-9]\.\d+/, 'constitution.md deve ter cabeçalho v4.4.0+');
    assert.match(
      constituicao,
      /\/explorar.*\/evoluir[\s\S]*\/fatiar|divergente[\s\S]*convergente/i,
      'Artigo 8 deve explicitar fronteira entre evolução divergente (/explorar|/evoluir) e fatiamento convergente (/fatiar)'
    );

    const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
    assert.match(projectJinja, /Governança v4\.[4-9]\.\d+/, 'project.md.jinja deve estar em v4.4.0+');

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D46\s*\|/);

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.match(changelog, /## \[4\.4\.0\]/);

    const copierYml = readFileSync(join(raiz, 'copier.yml'), 'utf8');
    for (const protegido of [
      'openspec/radar-oportunidades.md',
      'openspec/roadmap.md',
      'openspec/matriz-requisitos.md',
      'openspec/project.md',
      'docs/conhecimento/**',
    ]) {
      assert.ok(copierYml.includes(protegido), `copier.yml deve proteger '${protegido}'`);
    }
  });
});
