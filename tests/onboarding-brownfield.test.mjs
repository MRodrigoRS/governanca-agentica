import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dirRaiz = process.cwd();
const dirTemplate = join(dirRaiz, 'template');

test('deve_ter_pergunta_repositorio_existente_no_copier_e_marcador_no_project_md', () => {
  const copier = readFileSync(join(dirRaiz, 'copier.yml'), 'utf8');
  assert.match(copier, /repositorio_existente:/);
  assert.match(copier, /default:\s*false/);

  const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
  assert.match(projectJinja, /\{%\s*if repositorio_existente\s*%\}/);
  assert.match(projectJinja, /Aguardando Onboarding Brownfield/i);
  assert.match(projectJinja, /\/mapear-projeto|mapear-brownfield/i);
});

test('deve_existir_skill_mapear_brownfield_completa_com_gate_de_onboarding', () => {
  const caminhoSkill = join(dirTemplate, '.agents', 'skills', 'mapear-brownfield', 'SKILL.md');
  assert.ok(existsSync(caminhoSkill), 'template/.agents/skills/mapear-brownfield/SKILL.md deve existir');

  const conteudo = readFileSync(caminhoSkill, 'utf8');
  assert.match(conteudo, /name:\s*mapear-brownfield/);
  assert.match(conteudo, /research/i);
  assert.match(conteudo, /350 linhas/i);
  assert.match(conteudo, /Comandos do Projeto/i);
  assert.match(conteudo, /docs\/arquitetura\.md/);
  assert.match(conteudo, /docs\/catalogo-reuso\.md/);
  assert.match(conteudo, /docs\/particularidades\.md/);
  assert.match(conteudo, /\.env\.example/);
  assert.match(conteudo, /openspec\/specs\//);
  assert.match(conteudo, /openspec\/roadmap\.md/);
  assert.match(conteudo, /Gate de Onboarding/i);
  assert.match(conteudo, /mattpocock\/skills --skill grill-me grilling/i);
});

test('deve_travar_brownfield_no_AGENTS_md_e_mapear_comando_mapear_projeto', () => {
  const agentsMd = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');

  assert.match(agentsMd, /mapear-brownfield\/SKILL\.md/);
  assert.match(agentsMd, /congele|proibido alterar/i);
  assert.match(agentsMd, /\/mapear-projeto/);
  assert.match(agentsMd, /`mapear-brownfield`/);
});
