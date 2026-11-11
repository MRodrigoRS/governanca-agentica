import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dirTemplate = join(process.cwd(), 'template');
const dirTemplateScripts = join(dirTemplate, 'scripts');

function copiarRecursivo(origem, destino) {
  mkdirSync(destino, { recursive: true });
  const entradas = readdirSync(origem, { withFileTypes: true });
  for (const entrada of entradas) {
    const camOrigem = join(origem, entrada.name);
    const camDestino = join(destino, entrada.name);
    if (entrada.isDirectory()) {
      copiarRecursivo(camOrigem, camDestino);
    } else {
      copyFileSync(camOrigem, camDestino);
    }
  }
}

function criarRepoTemporario() {
  const dir = join(tmpdir(), `test-gov-ci-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  const dirDestinoScripts = join(dir, 'scripts');
  copiarRecursivo(dirTemplateScripts, dirDestinoScripts);

  writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Teste\n', 'utf8');
  mkdirSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'specs', 'teste'), { recursive: true });
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'proposal.md'), '## Por que\nTexto de teste para proposal com mais de dez linhas úteis.\nLinha 3\nLinha 4\nLinha 5\n## O que muda\nMudancas de teste.\nLinha 8\n## Fica de Fora\nFora do escopo de teste.\n', 'utf8');
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'design.md'), '## Contratos, Dados e Schemas\nContratos de teste.\nLinha 3\nLinha 4\nLinha 5\nLinha 6\n## Interface e Estados Assíncronos\nEstados de teste.\nLinha 9\nLinha 10\nLinha 11\nLinha 12\n## Regras de Negócio e Segurança\nRegras de teste.\nLinha 15\nLinha 16\nLinha 17\nLinha 18\nLinha 19\n', 'utf8');
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'tasks.md'), '- [ ] 1. Tarefa de teste (Vermelho)\n- [ ] 2. Tarefa de teste (Verde)\n- [ ] 3. Tarefa de teste (Refactor)\nLinha 4\nLinha 5\nLinha 6\nLinha 7\nLinha 8\nLinha 9\nLinha 10\n## Notas de Sessão\nNotas de teste.\n## Roteiro de Validação Prática\nRoteiro de teste.\n', 'utf8');
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'specs', 'teste', 'spec.md'), '## ADDED Requirements\n### Requirement: Teste\n#### Scenario: Cenário de Teste\nWHEN teste for executado\nTHEN deve aprovar\n', 'utf8');

  mkdirSync(join(dir, 'openspec'), { recursive: true });
  writeFileSync(join(dir, 'openspec', 'roadmap.md'), `## 1. Invariantes Globais do Gate 0
| Invariante | Decisão | Impacto nas Fatias |
|---|---|---|
| auth | jwt | seguranca |
| db | postgres | dados |
| filas | redis | background |
| storage | s3 | assets |
| ids | uuid | chaves |

## 2. Fila de Fatias Incrementais (Rolling Wave)
### [~] fatia-99-teste
- **Depende de:** nenhuma
- **Objetivo de Valor:** Teste de CI e anti-mock
- **O que ENTRA:**
  - Testes unitarios
- **O que FICA DE FORA:**
  - Outros modulos
`, 'utf8');

  execSync('git add .', { cwd: dir });
  execSync('git commit -m "chore: setup inicial da governanca"', { cwd: dir });

  return {
    dir,
    limpar() {
      try { rmSync(dir, { recursive: true, force: true }); } catch {}
    },
    executarVerificador(args = '') {
      try {
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, { cwd: dir, encoding: 'utf8' });
        return { exitCode: 0, stdout };
      } catch (err) {
        return { exitCode: err.status ?? 1, stderr: err.stderr?.toString() ?? '', stdout: err.stdout?.toString() ?? '' };
      }
    }
  };
}

function tocarChangelog(dir) {
  const caminho = join(dir, 'CHANGELOG.md');
  const conteudoAtual = existsSync(caminho) ? readFileSync(caminho, 'utf8') : '# Changelog\n';
  writeFileSync(caminho, `${conteudoAtual}\n<!-- update ${Date.now()}-${Math.random()} -->\n`, 'utf8');
}

test('deve_bloquear_mock_e_spy_do_proprio_banco_ou_orm_sem_falso_positivo_em_http', () => {
  const repo = criarRepoTemporario();
  try {
    // Caso A1: vi.mock em prisma
    mkdirSync(join(repo.dir, 'src'), { recursive: true });
    writeFileSync(join(repo.dir, 'src', 'pedidos.test.ts'), `
      import { describe, it, expect, vi } from 'vitest';
      vi.mock('@/lib/prisma', () => ({ prisma: { pedido: { create: vi.fn() } } }));
      describe('pedidos', () => { it('cria pedido', () => { expect(1).toBe(1); }); });
    `, 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/pedidos.test.ts CHANGELOG.md', { cwd: repo.dir });
    let res = repo.executarVerificador('--staged');
    assert.equal(res.exitCode, 1, 'vi.mock de prisma deve ser bloqueado');
    assert.match(res.stdout + res.stderr, /Anti-Mock.*Banco|banco.*mock/i);

    // Caso A2: vi.spyOn em prisma
    writeFileSync(join(repo.dir, 'src', 'pedidos.test.ts'), `
      import { describe, it, expect, vi } from 'vitest';
      import { prisma } from '@/lib/prisma';
      describe('pedidos', () => {
        it('cria pedido', () => {
          vi.spyOn(prisma.pedido, 'create').mockResolvedValue({ id: 1 });
          expect(1).toBe(1);
        });
      });
    `, 'utf8');
    execSync('git add src/pedidos.test.ts', { cwd: repo.dir });
    res = repo.executarVerificador('--staged');
    assert.equal(res.exitCode, 1, 'vi.spyOn de prisma deve ser bloqueado');

    // Caso A3: Atribuição direta .mockResolvedValue / vi.fn() em cliente de banco
    writeFileSync(join(repo.dir, 'src', 'pedidos.test.ts'), `
      import { describe, it, expect, vi } from 'vitest';
      import { db } from '@/lib/db';
      describe('pedidos', () => {
        it('cria pedido', () => {
          db.pedido.findMany = vi.fn();
          expect(1).toBe(1);
        });
      });
    `, 'utf8');
    execSync('git add src/pedidos.test.ts', { cwd: repo.dir });
    res = repo.executarVerificador('--staged');
    assert.equal(res.exitCode, 1, 'atribuicao vi.fn em db deve ser bloqueada');

    // Caso B: Python @patch em app.db.session
    mkdirSync(join(repo.dir, 'tests'), { recursive: true });
    writeFileSync(join(repo.dir, 'tests', 'test_usuarios.py'), `
      from unittest.mock import patch
      @patch('app.db.session')
      def test_cria_usuario(mock_session):
          assert mock_session is not None
    `, 'utf8');
    // Remove o TS para testar o Python isolado
    rmSync(join(repo.dir, 'src', 'pedidos.test.ts'), { force: true });
    execSync('git add -A', { cwd: repo.dir });
    res = repo.executarVerificador('--staged');
    assert.equal(res.exitCode, 1, '@patch em app.db.session deve ser bloqueado');

    // Caso C: Falsos positivos evitados - requests.Session e stripe mockados
    writeFileSync(join(repo.dir, 'tests', 'test_usuarios.py'), `
      from unittest.mock import patch
      @patch('requests.Session.post')
      def test_requisicao_externa(mock_post):
          assert mock_post is not None
    `, 'utf8');
    writeFileSync(join(repo.dir, 'src', 'pagamento.test.ts'), `
      import { describe, it, expect, vi } from 'vitest';
      vi.mock('@/lib/stripe', () => ({ stripe: { charges: { create: vi.fn() } } }));
      describe('pagamento', () => { it('cobra stripe', () => { expect(1).toBe(1); }); });
    `, 'utf8');
    execSync('git add -A', { cwd: repo.dir });
    res = repo.executarVerificador('--staged');
    assert.equal(res.exitCode, 0, 'requests.Session e stripe externo NAO devem ser bloqueados');

    // Caso D: Válvula de escape com justificativa >= 15 chars
    writeFileSync(join(repo.dir, 'src', 'pedidos.test.ts'), `
      // governanca:mock-banco-justificado: teste de desconexao abrupta de socket TCP no driver
      import { describe, it, expect, vi } from 'vitest';
      vi.mock('@/lib/prisma', () => ({ prisma: { $connect: vi.fn() } }));
      describe('conexao', () => { it('trata timeout', () => { expect(1).toBe(1); }); });
    `, 'utf8');
    execSync('git add src/pedidos.test.ts', { cwd: repo.dir });
    res = repo.executarVerificador('--staged');
    assert.equal(res.exitCode, 0, 'valvula governanca:mock-banco-justificado deve ser aprovada');
  } finally {
    repo.limpar();
  }
});

test('deve_configurar_testes_no_pre_commit_e_pre_push_do_lefthook', () => {
  const caminhoLefthookTemplate = join(dirTemplate, 'lefthook.yml');
  const caminhoLefthookRaiz = join(process.cwd(), 'lefthook.yml');

  assert.ok(existsSync(caminhoLefthookTemplate), 'template/lefthook.yml deve existir');
  assert.ok(existsSync(caminhoLefthookRaiz), 'lefthook.yml da raiz deve existir');

  const conteudoTemplate = readFileSync(caminhoLefthookTemplate, 'utf8');
  const conteudoRaiz = readFileSync(caminhoLefthookRaiz, 'utf8');

  // pre-commit deve ter testes unitários rápidos poliglotas (Node, Python pytest e Rust cargo test)
  const blocoPreCommit = conteudoTemplate.split('commit-msg:')[0];
  assert.match(blocoPreCommit, /unit-tests:/, 'template pre-commit deve ter comando unit-tests');
  assert.match(blocoPreCommit, /pytest/, 'template pre-commit deve suportar pytest rápido');
  assert.match(blocoPreCommit, /cargo test/, 'template pre-commit deve suportar cargo test rápido');
  assert.match(conteudoRaiz, /pre-commit:[\s\S]*?(?:unit-tests|test)/, 'raiz pre-commit deve rodar testes');

  // pre-push deve existir em ambos
  assert.match(conteudoTemplate, /pre-push:/, 'template deve ter pre-push configurado');
  assert.match(conteudoRaiz, /pre-push:/, 'raiz deve ter pre-push configurado');

  // template pre-push deve cobrir testes completos com checagem segura de godot
  assert.match(conteudoTemplate, /pre-push:[\s\S]*?commands:/, 'template pre-push deve ter comandos definidos');
  assert.match(conteudoTemplate, /godot/i, 'template pre-push deve referenciar godot com fallback seguro');
});

test('deve_garantir_ci_poliglota_lockfile_estrito_e_validacao_commit_msg', () => {
  const caminhoCiTemplate = join(dirTemplate, '.github', 'workflows', 'ci.yml');
  const caminhoCiRaiz = join(process.cwd(), '.github', 'workflows', 'ci.yml');

  assert.ok(existsSync(caminhoCiTemplate), 'template/.github/workflows/ci.yml deve existir');
  assert.ok(existsSync(caminhoCiRaiz), '.github/workflows/ci.yml da raiz deve existir');

  const conteudoCiTemplate = readFileSync(caminhoCiTemplate, 'utf8');
  const conteudoCiRaiz = readFileSync(caminhoCiRaiz, 'utf8');

  // Não pode conter o fallback inseguro "npm ci || npm install"
  assert.doesNotMatch(conteudoCiTemplate, /npm ci \|\| npm install/, 'CI do template nao pode usar npm ci || npm install');

  // Deve exigir verificação estrita de lockfile
  assert.match(conteudoCiTemplate, /package-lock\.json|frozen-lockfile|immutable/i, 'CI do template deve validar lockfile');

  // Deve executar validar-commit-msg.mjs
  assert.match(conteudoCiTemplate, /validar-commit-msg\.mjs/, 'CI do template deve rodar validar-commit-msg.mjs');

  // Cobertura poliglota + migrações + auditoria de CVEs
  assert.match(conteudoCiTemplate, /gut_cmdln\.gd|godot/i, 'CI do template deve ter suporte a Godot GUT headless');
  assert.match(conteudoCiTemplate, /dotnet test/i, 'CI do template deve ter suporte a .NET');
  assert.match(conteudoCiTemplate, /pytest|uv run/i, 'CI do template deve ter suporte a Python');
  assert.match(conteudoCiTemplate, /cargo test/i, 'CI do template deve ter suporte a Rust');
  assert.match(conteudoCiTemplate, /pip-audit/i, 'CI do template deve incluir pip-audit para Python');
  assert.match(conteudoCiTemplate, /cargo audit/i, 'CI do template deve incluir cargo audit para Rust');
  assert.match(conteudoCiTemplate, /migrate status|alembic/i, 'CI do template deve validar migrações limpas');

  // CI da raiz deve testar artefatos da v4 no Copier sem exigir .claude legado
  assert.match(conteudoCiRaiz, /catalogo-reuso\.md/, 'CI da raiz deve verificar catalogo-reuso.md no teste do Copier');
  assert.match(conteudoCiRaiz, /roadmap\.md/, 'CI da raiz deve verificar roadmap.md no teste do Copier');
  assert.doesNotMatch(conteudoCiRaiz, /\.claude\//, 'CI da raiz não deve exigir .claude/ removido no Padrão Universal');
});

test('deve_formalizar_subagente_opcional_sob_demanda_e_graduar_versao_v4_estavel', () => {
  // Constituição (Artigo 8 e 12)
  const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
  assert.match(constituicao, /Testing Trophy|anti-mock/i, 'Constituição deve conter Testing Trophy e anti-mock');
  assert.match(constituicao, /subagente.*opcional|sob demanda|\/revisar/i, 'Constituição deve definir subagente como opcional sob demanda via /revisar');

  // AGENTS.md
  const agentsMd = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
  assert.match(agentsMd, /\/revisar/i, 'AGENTS.md deve documentar /revisar para auditoria sob demanda');

  // revisar-fatia/SKILL.md deve auditar persistência real vs mocks de banco e válvula mock-banco-justificado
  const revisarSkill = readFileSync(join(dirTemplate, '.agents', 'skills', 'revisar-fatia', 'SKILL.md'), 'utf8');
  assert.match(revisarSkill, /governanca:mock-banco-justificado/i, 'revisar-fatia/SKILL.md deve auditar a válvula governanca:mock-banco-justificado');
  assert.match(revisarSkill, /SQLite|PGlite/i, 'revisar-fatia/SKILL.md deve mencionar persistência real (SQLite/PGlite)');

  // catalogo-stacks.md deve conter contrato @axe-core/playwright
  const catalogoStacks = readFileSync(join(dirTemplate, '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'), 'utf8');
  assert.match(catalogoStacks, /@axe-core\/playwright/i, 'catalogo-stacks.md deve documentar @axe-core/playwright nos Smoke Tests Web');

  // package.json na raiz deve estar na versão estável 4.0.0
  const pkgRaiz = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
  assert.equal(pkgRaiz.version, '4.0.0', 'package.json deve ser 4.0.0 estável');

  // CHANGELOG.md deve ter a seção [4.0.0]
  const changelog = readFileSync(join(process.cwd(), 'CHANGELOG.md'), 'utf8');
  assert.match(changelog, /## \[4\.0\.0\]/, 'CHANGELOG.md deve ter seção da versão 4.0.0 estável');
});
