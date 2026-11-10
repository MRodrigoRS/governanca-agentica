import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dirTemplate = join(process.cwd(), 'template');

test('deve_instituir_apresentacao_por_artefatos_na_constituicao_artigos_8_e_12', () => {
  const caminhoConst = join(dirTemplate, 'constitution.md');
  assert.ok(existsSync(caminhoConst), 'constitution.md deve existir');

  const conteudo = readFileSync(caminhoConst, 'utf8');

  // Artigo 8.5 ou Artigo 8 deve exigir artefatos dedicados no Gate 1 e Gate 2 quando o harness suportar
  assert.match(conteudo, /Artigo 8/);
  assert.match(conteudo, /artefato/i);
  assert.match(conteudo, /RequestFeedback/i);

  // Artigo 12.5 deve reforçar higiene de contexto proibindo despejo de textos longos no chat
  assert.match(conteudo, /Artigo 12/);
  assert.match(conteudo, /higiene de contexto/i);
  assert.match(conteudo, /20 linhas/i);
});

test('deve_documentar_artefatos_e_teto_de_chat_em_template_AGENTS_md', () => {
  const caminhoAgents = join(dirTemplate, 'AGENTS.md');
  assert.ok(existsSync(caminhoAgents), 'AGENTS.md deve existir');

  const conteudo = readFileSync(caminhoAgents, 'utf8');

  // Menção a artefatos no Gate 1 e Gate 2
  assert.match(conteudo, /plano-fatia/i);
  assert.match(conteudo, /entrega-fatia/i);
  assert.match(conteudo, /RequestFeedback/i);
  assert.match(conteudo, /20 linhas/i);
});

test('deve_instruir_emissao_de_artefatos_nas_skills_ciclo_especificacao_e_revisar_fatia', () => {
  const caminhoCiclo = join(dirTemplate, '.agents', 'skills', 'ciclo-especificacao', 'SKILL.md');
  const caminhoRevisar = join(dirTemplate, '.agents', 'skills', 'revisar-fatia', 'SKILL.md');

  assert.ok(existsSync(caminhoCiclo), 'ciclo-especificacao/SKILL.md deve existir');
  assert.ok(existsSync(caminhoRevisar), 'revisar-fatia/SKILL.md deve existir');

  const conteudoCiclo = readFileSync(caminhoCiclo, 'utf8');
  const conteudoRevisar = readFileSync(caminhoRevisar, 'utf8');

  // ciclo-especificacao instrui plano e entrega como artefato com RequestFeedback
  assert.match(conteudoCiclo, /RequestFeedback/i);
  assert.match(conteudoCiclo, /plano-fatia/i);
  assert.match(conteudoCiclo, /entrega-fatia/i);

  // revisar-fatia instrui parecer-forense.md como artefato
  assert.match(conteudoRevisar, /parecer-forense/i);
});
