import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const dirTemplate = join(raiz, 'template');

describe('Fatia 20: Depuração Sistemática (/debug) e Prova de Runtime Pré-Gate 2 (v4.6.0)', () => {
  test('1_skill_depuracao_sistematica_existe_com_contrato_completo', () => {
    const camSkill = join(dirTemplate, '.agents', 'skills', 'depuracao-sistematica', 'SKILL.md');
    assert.ok(existsSync(camSkill), 'template/.agents/skills/depuracao-sistematica/SKILL.md deve existir');

    const conteudo = readFileSync(camSkill, 'utf8');
    const linhas = conteudo.split(/\r?\n/).length;
    assert.ok(linhas <= 140, `depuracao-sistematica/SKILL.md deve ter <= 140 linhas (atual: ${linhas})`);

    assert.match(conteudo, /^---\s*[\r\n]+name:\s*depuracao-sistematica\b/m);
    assert.match(conteudo, /\/debug/);
    assert.match(conteudo, /congelamento/i);
    assert.match(conteudo, /2[ªa]\s+falha/i);
    assert.match(conteudo, /Circuit Breaker|Artigo 9/i);
    assert.match(conteudo, /Reprodu[çc][ãa]o/i);
    assert.match(conteudo, /Evid[êe]ncia/i);
    assert.match(conteudo, /Hip[óo]tese/i);
    assert.match(conteudo, /Causa Raiz/i);
    assert.match(conteudo, /Via 1a[\s\S]*Via 1\.5[\s\S]*Via 2/i);
    assert.match(conteudo, /\.env/);
    assert.match(conteudo, /\.agents\/handoff\.md/);
    assert.match(conteudo, /docs\/aprendizados\.md/);
  });

  test('2_constituicao_acopla_debug_no_circuit_breaker_e_exige_prova_runtime_por_perfil', () => {
    const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
    assert.match(constituicao, /governanca:inicio v4\.[6-9]\.\d+/, 'constitution.md deve ter cabeçalho v4.6.0+');

    const secaoArtigo2 = constituicao.split('## Artigo 3')[0] || '';
    assert.match(secaoArtigo2, /Prova de Runtime/i, 'Artigo 2 deve instituir Prova de Runtime Pré-Gate 2');
    for (const perfil of ['web-ui', 'api-backend', 'cli-biblioteca', 'desktop', 'mobile', 'jogo']) {
      assert.ok(secaoArtigo2.includes(perfil), `Artigo 2.7 deve cobrir perfil '${perfil}'`);
    }
    assert.match(secaoArtigo2, /Honestidade Radical|declara[çc][ãa]o expl[íi]cita|proibido.*simular|proibido fingir/i);

    const secaoArtigo8 = (constituicao.split('## Artigo 8')[1] || '').split('## Artigo 9')[0] || '';
    assert.match(secaoArtigo8, /Prova de Runtime/i, 'Artigo 8.6 (Gate 2) deve incluir Prova de Runtime');

    const secaoArtigo9 = (constituicao.split('## Artigo 9')[1] || '').split('## Artigo 10')[0] || '';
    assert.match(secaoArtigo9, /2[ªa]\s+falha/i, 'Artigo 9 deve acoplar acionamento após 2ª falha consecutiva');
    assert.match(secaoArtigo9, /depuracao-sistematica|\/debug/i, 'Artigo 9 deve acionar depuracao-sistematica (/debug) antes da 3ª tentativa');
  });

  test('3_sincronia_skills_agents_readme_e_pr_template', () => {
    const templateAgents = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
    assert.match(templateAgents, /governanca:inicio v4\.[6-9]\.\d+/, 'template/AGENTS.md deve ter cabeçalho v4.6.0+');
    assert.ok(templateAgents.includes('depuracao-sistematica'), 'template/AGENTS.md deve listar depuracao-sistematica');
    assert.ok(templateAgents.includes('/debug'), 'template/AGENTS.md deve listar comando /debug');
    assert.match(templateAgents, /Prova de Runtime/i, 'template/AGENTS.md deve citar Prova de Runtime');

    const raizAgents = readFileSync(join(raiz, 'AGENTS.md'), 'utf8');
    assert.ok(raizAgents.includes('/debug'), 'AGENTS.md da raiz deve listar comando /debug');
    assert.ok(
      raizAgents.includes('template/.agents/skills/depuracao-sistematica/SKILL.md'),
      'AGENTS.md da raiz deve apontar /debug para template/.agents/skills/depuracao-sistematica/SKILL.md'
    );

    const templateReadme = readFileSync(join(dirTemplate, 'README.md.jinja'), 'utf8');
    assert.ok(templateReadme.includes('/debug'), 'template/README.md.jinja deve listar /debug');

    const ciclo = readFileSync(join(dirTemplate, '.agents', 'skills', 'ciclo-especificacao', 'SKILL.md'), 'utf8');
    assert.match(ciclo, /2[ªa]\s+falha[\s\S]*\/debug|depuracao-sistematica/i, 'ciclo-especificacao deve acoplar /debug na 2ª falha');
    assert.match(ciclo, /Prova de Runtime/i, 'ciclo-especificacao deve exigir Prova de Runtime antes do Gate 2');

    const revisar = readFileSync(join(dirTemplate, '.agents', 'skills', 'revisar-fatia', 'SKILL.md'), 'utf8');
    assert.match(revisar, /Prova de Runtime/i, 'revisar-fatia deve auditar Prova de Runtime');

    const prTemplate = readFileSync(join(dirTemplate, '.github', 'pull_request_template.md'), 'utf8');
    assert.match(prTemplate, /Prova de Runtime/i, 'pull_request_template.md deve incluir Prova de Runtime');
  });

  test('4_sincronia_semver_4_6_0_ci_copier_e_decisao_d48', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.match(pkg.version, /^4\.[6-9]\.\d+$/, 'package.json deve estar em 4.6.0+');

    const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
    assert.match(projectJinja, /Governança v4\.[6-9]\.\d+/, 'project.md.jinja deve estar em v4.6.0+');

    const catalogoStacks = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'),
      'utf8'
    );
    assert.match(catalogoStacks, /Governança v4\.[6-9]\.\d+/, 'catalogo-stacks.md deve estar em v4.6.0+');

    const ci = readFileSync(join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.ok(
      ci.includes('depuracao-sistematica/SKILL.md'),
      '.github/workflows/ci.yml deve verificar depuracao-sistematica/SKILL.md no job Copier'
    );

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D48\s*\|/, '00_INDICE_E_DECISOES.md deve registrar D48');
    assert.match(decisoes, /v4\.[6-9]\.\d+/, '00_INDICE_E_DECISOES.md deve citar v4.6.0+');

    const readme = readFileSync(join(raiz, 'README.md'), 'utf8');
    assert.match(readme, /4\.[6-9]\.\d+/, 'README.md deve refletir versão 4.6.0+');
    assert.match(readme, /D4[89]|D5\d/, 'README.md deve referenciar D48+');

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.match(changelog, /## \[4\.6\.0\]/, 'CHANGELOG.md deve conter seção [4.6.0]');
  });
});
