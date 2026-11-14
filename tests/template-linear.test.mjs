import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('fatia-07: protocolo de handshake e tríade de âncora linear', () => {
  const copierPath = path.resolve(process.cwd(), 'copier.yml');
  const projectJinjaPath = path.resolve(process.cwd(), 'template/openspec/project.md.jinja');
  const constitutionPath = path.resolve(process.cwd(), 'template/constitution.md');
  const agentsPath = path.resolve(process.cwd(), 'template/AGENTS.md');
  const projectCurrentPath = path.resolve(process.cwd(), 'openspec/project.md');

  test('copier.yml contém as variáveis da Tríade de Âncora condicionadas a integrar_linear', () => {
    assert.ok(fs.existsSync(copierPath), 'copier.yml deve existir');
    const conteudo = fs.readFileSync(copierPath, 'utf8');

    assert.ok(conteudo.includes('linear_workspace_slug:'), 'Deve conter pergunta linear_workspace_slug');
    assert.ok(conteudo.includes('linear_team_key:'), 'Deve conter pergunta linear_team_key');
    assert.ok(conteudo.includes('linear_project:'), 'Deve conter pergunta linear_project');

    // Valida que as perguntas estão vinculadas condicionalmente a integrar_linear
    const blocoLinear = conteudo.slice(conteudo.indexOf('integrar_linear:'));
    assert.match(blocoLinear, /linear_workspace_slug:[\s\S]*?when:\s*"\{\{\s*integrar_linear\s*\}\}"/);
    assert.match(blocoLinear, /linear_team_key:[\s\S]*?when:\s*"\{\{\s*integrar_linear\s*\}\}"/);
    assert.match(blocoLinear, /linear_project:[\s\S]*?when:\s*"\{\{\s*integrar_linear\s*\}\}"/);
  });

  test('template/openspec/project.md.jinja renderiza a Tríade de Âncora quando integrar_linear = true', () => {
    assert.ok(fs.existsSync(projectJinjaPath), 'project.md.jinja deve existir');
    const conteudo = fs.readFileSync(projectJinjaPath, 'utf8');

    assert.ok(conteudo.includes('Tríade de Âncora Linear'), 'Template Jinja deve conter o cabeçalho da Tríade de Âncora');
    assert.ok(conteudo.includes('linear_workspace_slug'), 'Template deve referenciar linear_workspace_slug');
    assert.ok(conteudo.includes('linear_team_key'), 'Template deve referenciar linear_team_key');
    assert.ok(conteudo.includes('linear_project'), 'Template deve referenciar linear_project');
    assert.ok(conteudo.includes('whoami'), 'Template deve instruir a execução de whoami no handshake');
    assert.ok(conteudo.includes('fallback silencioso'), 'Template deve proibir fallback silencioso');
  });

  test('template/openspec/project.md.jinja omite a Tríade quando integrar_linear = false', () => {
    const conteudo = fs.readFileSync(projectJinjaPath, 'utf8');
    // Remove blocos condicionais {% if integrar_linear %}...{% endif %}
    const renderizadoSemLinear = conteudo.replace(/{%\s*if integrar_linear\s*%}[\s\S]*?{%\s*endif\s*%}/g, '');
    assert.strictEqual(renderizadoSemLinear.includes('Tríade de Âncora Linear'), false);
    assert.strictEqual(renderizadoSemLinear.includes('whoami'), false);
  });

  test('template/constitution.md institui o Artigo 13 de Isolamento Multi-Squad e Handshake Mandatório', () => {
    assert.ok(fs.existsSync(constitutionPath), 'constitution.md deve existir');
    const conteudo = fs.readFileSync(constitutionPath, 'utf8');

    assert.ok(conteudo.includes('Artigo 13'), 'Constituição deve conter o Artigo 13');
    assert.ok(conteudo.includes('Tríade de Âncora'), 'Artigo 13 deve citar a Tríade de Âncora');
    assert.ok(conteudo.includes('whoami'), 'Artigo 13 deve exigir o handshake via whoami');
    assert.ok(conteudo.toLowerCase().includes('fallback silencioso'), 'Artigo 13 deve proibir fallback silencioso');
  });

  test('template/AGENTS.md documenta o protocolo de handshake e Tríade de Âncora na Seção 6', () => {
    assert.ok(fs.existsSync(agentsPath), 'AGENTS.md deve existir');
    const conteudo = fs.readFileSync(agentsPath, 'utf8');

    assert.ok(conteudo.includes('Tríade de Âncora'), 'AGENTS.md deve conter a Tríade de Âncora');
    assert.ok(conteudo.includes('whoami'), 'AGENTS.md deve instruir o uso de whoami antes de operações no Linear');
    assert.ok(conteudo.includes('fallback silencioso'), 'AGENTS.md deve proibir expressamente o fallback silencioso');
  });

  test('openspec/project.md do repositório atual possui a Tríade de Âncora oficial do projeto P-RR-2', () => {
    assert.ok(fs.existsSync(projectCurrentPath), 'openspec/project.md deve existir');
    const conteudo = fs.readFileSync(projectCurrentPath, 'utf8');

    assert.ok(conteudo.includes('Tríade de Âncora Linear'), 'Deve possuir a seção da Tríade de Âncora');
    assert.ok(conteudo.includes('rr-diario-agents'), 'Deve conter o workspace rr-diario-agents');
    assert.ok(conteudo.includes('RR_DIARIO_AGENTS') || conteudo.includes('`RR`'), 'Deve conter a equipe');
    assert.ok(conteudo.includes('P-RR-2'), 'Deve conter a âncora do projeto P-RR-2');
  });

  test('exige confirmação humana antes de criar/editar tarefas ou publicar updates no Linear', () => {
    const regraLinear = fs.readFileSync(path.join(process.cwd(), 'template/.agents/rules/linear-mcp.md.jinja'), 'utf8');
    const agentsMd = fs.readFileSync(path.join(process.cwd(), 'template/AGENTS.md'), 'utf8');

    assert.match(regraLinear, /confirmação explícita|Consentimento Prévio/i);
    assert.match(regraLinear, /novas tarefas ou edições/i);
    assert.match(agentsMd, /Mediante confirmação humana/i);
    assert.match(agentsMd, /novas tarefas ou edições/i);
  });
});
