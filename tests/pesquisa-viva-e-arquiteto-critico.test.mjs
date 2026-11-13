import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dirTemplate = join(process.cwd(), 'template');
const dirSkills = join(dirTemplate, '.agents', 'skills');

test('deve_instruir_instalacao_de_grill_me_upstream_no_atualizar_governanca', () => {
  const caminhoAtualizar = join(dirSkills, 'atualizar-governanca', 'SKILL.md');
  assert.ok(existsSync(caminhoAtualizar), 'atualizar-governanca/SKILL.md deve existir');

  const conteudo = readFileSync(caminhoAtualizar, 'utf8');
  assert.match(conteudo, /mattpocock\/skills --skill grill-me grilling/i);
  assert.match(conteudo, /\.agents\/skills\/grill-me/i);
  assert.match(conteudo, /skills\.sh|preservad/i);
});

test('deve_exigir_pesquisa_viva_e_arquiteto_critico_com_excecao_trivial_na_constituicao_e_agents', () => {
  const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
  const agentsMd = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');

  // Constituição: pesquisa viva além de treinamento + arquiteto crítico + exceção trivial
  assert.match(constituicao, /treinamento/i);
  assert.match(constituicao, /context7|llms\.txt/i);
  assert.match(constituicao, /Saúde Arquitetural|caminho vicioso/i);
  assert.match(constituicao, /Discussão Pré-Plano/i);
  assert.match(constituicao, /triviais|cosmétic/i);

  // AGENTS.md: Cartão de Invariantes e fluxo com pesquisa viva, discussão ativa e exceção trivial
  assert.match(agentsMd, /Pesquisa Viva/i);
  assert.match(agentsMd, /Arquiteto Crítico/i);
  assert.match(agentsMd, /triviais|cosmétic/i);
});

test('deve_instituir_gate_1_em_2_tempos_e_checkup_arquitetural_em_ciclo_especificacao', () => {
  const cicloSkill = readFileSync(join(dirSkills, 'ciclo-especificacao', 'SKILL.md'), 'utf8');

  assert.match(cicloSkill, /Discussão Pré-Plano Obrigatória|Gate 1 em 2 tempos/i);
  assert.match(cicloSkill, /Check-up Ativo de Saúde Arquitetural/i);
  assert.match(cicloSkill, /Pesquisa Viva Obrigatória/i);
  assert.match(cicloSkill, /fontes consultadas/i);
  assert.match(cicloSkill, /triviais|cosmétic/i);
});

test('deve_ampliar_catalogo_de_stacks_e_alinhar_inicializar_stack_ao_padrao_universal', () => {
  const initSkill = readFileSync(join(dirSkills, 'inicializar-stack', 'SKILL.md'), 'utf8');
  const catalogo = readFileSync(join(dirSkills, 'inicializar-stack', 'references', 'catalogo-stacks.md'), 'utf8');

  // inicializar-stack: catálogo como ponto de partida vivo + pesquisa viva + descoberta dinâmica de skills
  assert.match(initSkill, /ponto de partida/i);
  assert.match(initSkill, /Pesquisa Viva/i);
  assert.match(initSkill, /skills find/i);

  // catalogo-stacks.md: sem referências legadas a .cursor/mcp.json ou .vscode/mcp.json
  assert.doesNotMatch(catalogo, /\.cursor\/mcp\.json/);
  assert.doesNotMatch(catalogo, /\.vscode\/mcp\.json/);

  // Cobertura ampliada e pré-requisitos
  assert.match(catalogo, /TanStack Router/i);
  assert.match(catalogo, /Turborepo/i);
  assert.match(catalogo, /\bGo\b/);
  assert.match(catalogo, /Axum/i);
  assert.match(catalogo, /WebView2|webkit2gtk/i);
  assert.match(catalogo, /Flutter/i);
  assert.match(catalogo, /WXT/i);
  assert.match(catalogo, /AI-Native|Vercel AI SDK/i);
  assert.match(catalogo, /skills find/i);
});
