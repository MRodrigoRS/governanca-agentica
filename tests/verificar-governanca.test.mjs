import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const scriptOriginal = join(process.cwd(), 'template', 'scripts', 'verificar-governanca.mjs');

function criarRepoTemporario() {
  const dir = join(tmpdir(), `test-gov-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  // Copia o script
  mkdirSync(join(dir, 'scripts'), { recursive: true });
  writeFileSync(join(dir, 'scripts', 'verificar-governanca.mjs'), execSync(`node -e "process.stdout.write(require('fs').readFileSync('${scriptOriginal.replace(/\\/g, '/')}'))"`), 'utf8');

  return {
    dir,
    limpar() {
      try { rmSync(dir, { recursive: true, force: true }); } catch {}
    },
    executar(args = '') {
      try {
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, { cwd: dir, encoding: 'utf8' });
        return { exitCode: 0, stdout };
      } catch (err) {
        return { exitCode: err.status ?? 1, stderr: err.stderr?.toString() ?? '', stdout: err.stdout?.toString() ?? '' };
      }
    }
  };
}

test('verificar-governanca: aprova quando não há arquivos modificados', () => {
  const repo = criarRepoTemporario();
  try {
    const res = repo.executar();
    assert.equal(res.exitCode, 0);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: detecta e bloqueia location.reload em arquivos de frontend', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Corrigido\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'app.tsx'), 'export function App() { window.location.reload(); return <div>Erro</div>; }', 'utf8');
    execSync('git add CHANGELOG.md app.tsx', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 1);
    assert.match(res.stderr, /Artigo 6/);
    assert.match(res.stderr, /location\.reload/);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: bloqueia alteração de manifesto (package.json) isolada sem spec', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'package.json'), '{"name":"app","dependencies":{"zod":"^3"}}', 'utf8');
    execSync('git add package.json', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 1);
    assert.match(res.stderr, /Escalonamento Automático Obrigatório/);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: aceita subfatia alfanumérica no roadmap com 7 seções completas', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'openspec', 'roadmap'), { recursive: true });
    const linhas = [
      '# Fatia 02a: Catálogo de Produtos e Variações',
      '',
      '## 1. Objetivo e Valor Entregue ao Usuário',
      'Entrega catálogo com variações completas.',
      'Permite ao lojista cadastrar tamanhos e cores.',
      '',
      '## 2. Grafo de Dependências Incrementais',
      'Depende da Fatia 01 de autenticação.',
      'Desbloqueia a Fatia 03 de carrinho.',
      '',
      '## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)',
      'Tabelas de produtos e variacoes em PT-BR.',
      'Schema Zod estrito validando entradas de criação.',
      'Tipos seguros em TypeScript strict.',
      '',
      '## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)',
      'Interface responsiva a partir de 320px sem recarregar tela.',
      'Toasts reativos para criação e edição.',
      'Modais de confirmação para exclusão.',
      'Estados: loading, empty, error e success.',
      '',
      '## 5. Regras de Negócio, Segurança e Backend (Artigo 7)',
      'Validação de integridade e permissão de usuário no backend.',
      'Transações atômicas ao salvar variações.',
      '',
      '## 6. Roteiro Test-First para o Agente Executor (Artigo 2)',
      'Testes automatizados cobrindo listagem, criação e erro de validação.',
      'Evidência vermelha comprovada antes do código.',
      '',
      '## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)',
      'Checklist determinístico e roteiro passo a passo com dados prontos.',
      'Validação visual no navegador.'
    ];

    writeFileSync(join(repo.dir, 'openspec', 'roadmap', 'fatia-02a-produtos.md'), linhas.join('\n'), 'utf8');
    execSync('git add openspec/roadmap/fatia-02a-produtos.md', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 0);
  } finally {
    repo.limpar();
  }
});
