import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('template: documentos de particularidades e aprendizados', () => {
  const raiz = process.cwd();
  const caminhoParticularidades = path.join(raiz, 'template', 'docs', 'particularidades.md');
  const caminhoAprendizados = path.join(raiz, 'template', 'docs', 'aprendizados.md');
  const caminhoCopier = path.join(raiz, 'copier.yml');
  const caminhoAgents = path.join(raiz, 'template', 'AGENTS.md');

  test('template/docs/particularidades.md deve existir e conter as 4 seções temáticas', () => {
    assert.ok(fs.existsSync(caminhoParticularidades), 'Arquivo template/docs/particularidades.md deve existir');
    const conteudo = fs.readFileSync(caminhoParticularidades, 'utf8');

    assert.ok(conteudo.includes('## 1. Infraestrutura, Hospedagem e Planos'), 'Deve conter seção 1 de infraestrutura');
    assert.ok(conteudo.includes('## 2. Banco de Dados e Persistência'), 'Deve conter seção 2 de banco');
    assert.ok(conteudo.includes('## 3. Provedores Externos e Webhooks'), 'Deve conter seção 3 de provedores');
    assert.ok(conteudo.includes('## 4. Regras de Domínio Não-Óbvias'), 'Deve conter seção 4 de regras de domínio');
  });

  test('template/docs/aprendizados.md deve existir e conter a estrutura padrão de cicatrizes', () => {
    assert.ok(fs.existsSync(caminhoAprendizados), 'Arquivo template/docs/aprendizados.md deve existir');
    const conteudo = fs.readFileSync(caminhoAprendizados, 'utf8');

    assert.ok(conteudo.includes('### [AAAA-MM-DD / COD-XXX]'), 'Deve conter modelo de título de entrada com data/código');
    assert.ok(conteudo.includes('- **O que aconteceu:**'), 'Deve conter campo "O que aconteceu"');
    assert.ok(conteudo.includes('- **Causa raiz:**'), 'Deve conter campo "Causa raiz"');
    assert.ok(conteudo.includes('- **A armadilha mental:**'), 'Deve conter campo "A armadilha mental"');
    assert.ok(conteudo.includes('- **Regra inegociável decorrente:**'), 'Deve conter campo "Regra inegociável decorrente"');
  });

  test('copier.yml deve blindar docs/particularidades.md e docs/aprendizados.md em _skip_if_exists', () => {
    assert.ok(fs.existsSync(caminhoCopier), 'copier.yml deve existir');
    const conteudo = fs.readFileSync(caminhoCopier, 'utf8');

    assert.ok(
      conteudo.includes('"docs/particularidades.md"') || conteudo.includes('- docs/particularidades.md'),
      'copier.yml deve incluir docs/particularidades.md em _skip_if_exists'
    );
    assert.ok(
      conteudo.includes('"docs/aprendizados.md"') || conteudo.includes('- docs/aprendizados.md'),
      'copier.yml deve incluir docs/aprendizados.md em _skip_if_exists'
    );
  });

  test('template/AGENTS.md deve referenciar docs/particularidades.md e docs/aprendizados.md na Seção 6', () => {
    assert.ok(fs.existsSync(caminhoAgents), 'template/AGENTS.md deve existir');
    const conteudo = fs.readFileSync(caminhoAgents, 'utf8');

    assert.ok(conteudo.includes('docs/particularidades.md'), 'template/AGENTS.md deve citar docs/particularidades.md');
    assert.ok(conteudo.includes('docs/aprendizados.md'), 'template/AGENTS.md deve citar docs/aprendizados.md');
  });
});
