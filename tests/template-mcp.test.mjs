import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('template: mcp configs jinja', () => {
  const mcpFiles = [
    'template/.mcp.json.jinja',
    'template/.cursor/mcp.json.jinja',
    'template/.vscode/mcp.json.jinja'
  ];

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
