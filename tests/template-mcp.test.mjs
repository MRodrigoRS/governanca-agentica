import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('template: mcp configs jinja (Padrao Universal)', () => {
  const mcpFiles = [
    'template/.mcp.json.jinja'
  ];

  test('nao deve manter wrappers proprietarios de MCP (.cursor/mcp.json.jinja e .vscode/mcp.json.jinja)', () => {
    assert.strictEqual(fs.existsSync(path.resolve(process.cwd(), 'template/.cursor/mcp.json.jinja')), false, '.cursor/mcp.json.jinja deve ser removido');
    assert.strictEqual(fs.existsSync(path.resolve(process.cwd(), 'template/.vscode/mcp.json.jinja')), false, '.vscode/mcp.json.jinja deve ser removido');
  });

  for (const relPath of mcpFiles) {
    test(`renderiza JSON válido com integrar_linear = false em ${relPath}`, () => {
      const fullPath = path.resolve(process.cwd(), relPath);
      assert.ok(fs.existsSync(fullPath), `Arquivo deve existir: ${relPath}`);
      const raw = fs.readFileSync(fullPath, 'utf8');

      // Simula renderização Jinja com integrar_linear = false
      const renderedFalse = raw.replace(/{%\s*if integrar_linear\s*%}[\s\S]*?{%\s*endif\s*%}/g, '');
      assert.doesNotThrow(() => {
        const parsed = JSON.parse(renderedFalse);
        assert.ok(parsed.mcpServers.context7, 'Deve conter context7');
        assert.strictEqual(parsed.mcpServers.linear, undefined, 'Não deve conter linear');
      });
    });

    test(`renderiza JSON válido com integrar_linear = true em ${relPath}`, () => {
      const fullPath = path.resolve(process.cwd(), relPath);
      const raw = fs.readFileSync(fullPath, 'utf8');

      // Simula renderização Jinja com integrar_linear = true
      const renderedTrue = raw.replace(/{%\s*if integrar_linear\s*%}([\s\S]*?){%\s*endif\s*%}/g, '$1');
      assert.doesNotThrow(() => {
        const parsed = JSON.parse(renderedTrue);
        assert.ok(parsed.mcpServers.context7, 'Deve conter context7');
        assert.ok(parsed.mcpServers.linear, 'Deve conter linear');
        assert.deepStrictEqual(parsed.mcpServers.linear.args, ['-y', 'mcp-remote', 'https://mcp.linear.app/mcp']);
      });
    });
  }
});
