import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const scriptOriginal = join(process.cwd(), 'template', 'scripts', 'verificar-governanca.mjs');
const dirTemplateScripts = join(process.cwd(), 'template', 'scripts');

function criarRepoTemporario() {
  const dir = join(tmpdir(), `test-gov-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  // Copia o script e bibliotecas auxiliares
  const dirDestinoScripts = join(dir, 'scripts');
  mkdirSync(join(dirDestinoScripts, 'lib'), { recursive: true });
  copyFileSync(scriptOriginal, join(dirDestinoScripts, 'verificar-governanca.mjs'));
  copyFileSync(join(dirTemplateScripts, 'lib', 'classificar-arquivos.mjs'), join(dirDestinoScripts, 'lib', 'classificar-arquivos.mjs'));
  copyFileSync(join(dirTemplateScripts, 'lib', 'classificar-cerimonia.mjs'), join(dirDestinoScripts, 'lib', 'classificar-cerimonia.mjs'));

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

test('verificar-governanca: detecta e bloqueia .only esquecido em arquivos de teste', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Test\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'calculo.ts'), 'export function soma(a: number, b: number) { return a + b; }', 'utf8');
    writeFileSync(join(repo.dir, 'calculo.test.ts'), 'import { test } from "vitest";\ntest.' + 'only("soma basica", () => { expect(soma(1, 2)).toBe(3); });', 'utf8');
    execSync('git add CHANGELOG.md calculo.ts calculo.test.ts', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 1);
    assert.match(res.stderr, /Foco Exclusivo Esquecido/);
    assert.match(res.stderr, /\.only/);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: detecta e bloqueia arquivo de teste oco sem assercoes', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Test\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'operacao.ts'), 'export function rodar() { console.log("ok"); }', 'utf8');
    writeFileSync(join(repo.dir, 'operacao.test.ts'), 'import { test } from "vitest";\ntest("apenas executa sem assercoes", () => { rodar(); });', 'utf8');
    execSync('git add CHANGELOG.md operacao.ts operacao.test.ts', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 1);
    assert.match(res.stderr, /Teste Oco Detectado/);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: aprova arquivo de teste valido com assercoes reais', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Test\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'operacao.ts'), 'export function dobrar(n: number) { return n * 2; }', 'utf8');
    writeFileSync(join(repo.dir, 'operacao.test.ts'), 'import { test, expect } from "vitest";\ntest("dobra valor", () => { expect(dobrar(2)).toBe(4); });', 'utf8');
    execSync('git add CHANGELOG.md operacao.ts operacao.test.ts', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 0);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: bloqueia delta fatia-XX em openspec/changes sem arquivo correspondente em openspec/roadmap', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Test\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'operacao.ts'), 'export function calcular() { return 10; }', 'utf8');

    // Cria delta completo no OpenSpec para fatia-09-fantasma
    const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-09-fantasma');
    mkdirSync(pastaDelta, { recursive: true });
    writeFileSync(join(pastaDelta, 'proposal.md'), '# Proposta da Fatia 09 Fantasma\nJustificativa e escopo fechado.', 'utf8');
    writeFileSync(join(pastaDelta, 'design.md'), '# Design da Fatia 09 Fantasma\nDetalhes de arquitetura e contratos.', 'utf8');
    writeFileSync(join(pastaDelta, 'tasks.md'), '# Tasks da Fatia 09 Fantasma\n- [ ] Tarefa 1 com teste.', 'utf8');

    execSync('git add CHANGELOG.md operacao.ts openspec/changes/fatia-09-fantasma', { cwd: repo.dir, stdio: 'ignore' });

    // Sem openspec/roadmap/fatia-09-fantasma.md, deve falhar
    const resFalha = repo.executar();
    assert.equal(resFalha.exitCode, 1);
    assert.match(resFalha.stderr, /Roadmap.*fatia-09-fantasma|Vínculo Obrigatório/i);

    // Agora adiciona o arquivo no roadmap com as 7 seções completas
    mkdirSync(join(repo.dir, 'openspec', 'roadmap'), { recursive: true });
    const linhasRoadmap = [
      '# Fatia 09: Fantasma',
      '',
      '## 1. Objetivo e Valor Entregue ao Usuário',
      'Entrega funcionalidade de teste.',
      'Valor concreto para o usuário e governança.',
      '',
      '## 2. Grafo de Dependências Incrementais',
      'Depende da anterior.',
      'Desbloqueia a próxima.',
      '',
      '## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)',
      'Tabelas em PT-BR.',
      'Schema Zod estrito validando entradas de criação.',
      'Tipos seguros em TypeScript strict.',
      '',
      '## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)',
      'Layout responsivo sem reload.',
      'Toasts reativos para criação e edição.',
      'Modais de confirmação para exclusão.',
      'loading, empty, error, success.',
      '',
      '## 5. Regras de Negócio, Segurança e Backend (Artigo 7)',
      'Regras ACID e Zero-Trust.',
      'Transações atômicas ao salvar variações.',
      '',
      '## 6. Roteiro Test-First para o Agente Executor (Artigo 2)',
      'Testes automatizados com asserções reais.',
      'Evidência vermelha comprovada antes do código.',
      '',
      '## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)',
      'Critérios de aceite determinísticos.',
      'Roteiro de teste prático passo a passo.'
    ];
    writeFileSync(join(repo.dir, 'openspec', 'roadmap', 'fatia-09-fantasma.md'), linhasRoadmap.join('\n'), 'utf8');
    execSync('git add openspec/roadmap/fatia-09-fantasma.md', { cwd: repo.dir, stdio: 'ignore' });

    // Com o arquivo físico no roadmap, deve passar
    const resSucesso = repo.executar();
    assert.equal(resSucesso.exitCode, 0);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: bloqueia alteração de manifesto de jogo (project.godot) isolada sem spec', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'project.godot'), 'config_version=5\n[application]\nconfig/name="Meu Jogo"\n', 'utf8');
    execSync('git add project.godot', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 1);
    assert.match(res.stderr, /Escalonamento Automático Obrigatório/);
    assert.match(res.stderr, /project\.godot/);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: aprova alteração de project.godot quando há spec ativa e delta íntegro', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Test\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'project.godot'), 'config_version=5\n[application]\nconfig/name="Meu Jogo"\n', 'utf8');

    // Cria delta completo no OpenSpec para fatia-01-godot
    const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-01-godot');
    mkdirSync(pastaDelta, { recursive: true });
    writeFileSync(join(pastaDelta, 'proposal.md'), '# Proposta do Jogo Godot\nCriação de jogo 2D com Godot Engine 4.', 'utf8');
    writeFileSync(join(pastaDelta, 'design.md'), '# Design do Jogo Godot\nArquitetura com GUT e nós desacoplados.', 'utf8');
    writeFileSync(join(pastaDelta, 'tasks.md'), '# Tasks do Jogo Godot\n- [ ] Tarefa 1 com testes de regras.', 'utf8');

    // Cria arquivo correspondente no roadmap
    mkdirSync(join(repo.dir, 'openspec', 'roadmap'), { recursive: true });
    const linhasRoadmap = [
      '# Fatia 01: Jogo Godot',
      '',
      '## 1. Objetivo e Valor Entregue ao Usuário',
      'Entrega jogo completo com Godot Engine.',
      'Valor concreto para o jogador.',
      '',
      '## 2. Grafo de Dependências Incrementais',
      'Fatia inicial de jogo.',
      'Desbloqueia próximas fases.',
      '',
      '## 3. Contratos de Dados, Banco e Schemas (PT-BR — Artigo 10)',
      'Contratos de savegame em JSON.',
      'Schema Zod estrito validando savegame.',
      'Tipos seguros em GDScript e C#.',
      '',
      '## 4. Interface, Componentes e Estados Assíncronos (Artigo 6)',
      'Viewport responsivo 320px com aspect ratio adaptativo.',
      'Telas de menu, gameplay e pause sem reload.',
      'HUD reativo de pontuação e vida.',
      'loading, empty, error, success.',
      '',
      '## 5. Regras de Negócio, Segurança e Backend (Artigo 7)',
      'Regras puras de colisão AABB e pontuação.',
      'Lógica desacoplada de renderização.',
      '',
      '## 6. Roteiro Test-First para o Agente Executor (Artigo 2)',
      'Testes automatizados com asserções reais.',
      'Evidência vermelha comprovada antes do código.',
      '',
      '## 7. Critérios de Aceite e Roteiro de Teste Prático (Gate 2)',
      'Critérios de aceite determinísticos.',
      'Roteiro de teste prático passo a passo.'
    ];
    writeFileSync(join(repo.dir, 'openspec', 'roadmap', 'fatia-01-godot.md'), linhasRoadmap.join('\n'), 'utf8');

    execSync('git add CHANGELOG.md project.godot openspec/changes/fatia-01-godot openspec/roadmap/fatia-01-godot.md', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executar();
    assert.equal(res.exitCode, 0);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: bloqueia segredo privado com prefixo público de frontend e aprova variável pública legítima', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Config\n', 'utf8');
    writeFileSync(join(repo.dir, '.env.example'), 'NEXT_PUBLIC_STRIPE_SECRET_KEY=placeholder\n', 'utf8');
    mkdirSync(join(repo.dir, 'src'), { recursive: true });
    writeFileSync(
      join(repo.dir, 'src', 'cliente.ts'),
      'export const chave = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;\n',
      'utf8'
    );
    execSync('git add CHANGELOG.md .env.example src/cliente.ts', { cwd: repo.dir, stdio: 'ignore' });

    const resBloqueio = repo.executar();
    assert.equal(resBloqueio.exitCode, 1);
    assert.match(resBloqueio.stderr, /Vazamento de Segredo em Variável Pública de Frontend/);

    // Agora testa com variável privada no código via import.meta.env (sem constar como pública no .env.example)
    writeFileSync(join(repo.dir, '.env.example'), 'NEXT_PUBLIC_APP_URL=http://localhost:3000\n', 'utf8');
    writeFileSync(
      join(repo.dir, 'src', 'cliente.ts'),
      'export const segredo = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;\n',
      'utf8'
    );
    execSync('git add .env.example src/cliente.ts', { cwd: repo.dir, stdio: 'ignore' });

    const resVite = repo.executar();
    assert.equal(resVite.exitCode, 1);
    assert.match(resVite.stderr, /Vazamento de Segredo em Variável Pública de Frontend/);

    // Agora testa variável pública legítima
    writeFileSync(
      join(repo.dir, 'src', 'cliente.ts'),
      'export const appUrl = process.env.NEXT_PUBLIC_APP_URL;\n',
      'utf8'
    );
    execSync('git add src/cliente.ts', { cwd: repo.dir, stdio: 'ignore' });

    const resSucesso = repo.executar();
    assert.equal(resSucesso.exitCode, 0);
  } finally {
    repo.limpar();
  }
});

test('verificar-governanca: sensor anti-apodrecimento do Mapa Físico (§5 arquitetura.md) e avisos de Runbook e Handoff', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'docs'), { recursive: true });
    mkdirSync(join(repo.dir, 'src', 'pagamentos'), { recursive: true });
    mkdirSync(join(repo.dir, '.agents'), { recursive: true });

    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Estrutura inicial\n', 'utf8');
    writeFileSync(join(repo.dir, 'src', 'pagamentos', 'servico.ts'), 'export function pagar() { return 1; }\n', 'utf8');
    writeFileSync(
      join(repo.dir, 'docs', 'arquitetura.md'),
      `# Arquitetura\n\n## 5. Mapa Físico de Módulos (Onde Cada Coisa Mora)\n\n| Domínio | Pasta | Responsabilidade | Testes |\n|---|---|---|---|\n| **Pagamentos** | \`src/pagamentos/\` | Checkout | \`tests/\` |\n`,
      'utf8'
    );
    mkdirSync(join(repo.dir, 'tests'), { recursive: true });
    writeFileSync(join(repo.dir, 'tests', 'pagamentos.test.ts'), 'export const ok = true;\n', 'utf8');

    // 1. Mapa válido (src/pagamentos/ e tests/ existem)
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
    execSync('git commit -m "chore: base com mapa fisico valido"', { cwd: repo.dir, stdio: 'ignore' });

    // 2. Aponta para pasta inexistente em docs/arquitetura.md -> deve bloquear
    writeFileSync(
      join(repo.dir, 'docs', 'arquitetura.md'),
      `# Arquitetura\n\n## 5. Mapa Físico de Módulos (Onde Cada Coisa Mora)\n\n| Domínio | Pasta | Responsabilidade | Testes |\n|---|---|---|---|\n| **Fantasma** | \`src/fantasma/\` | Quebrado | \`tests/\` |\n`,
      'utf8'
    );
    execSync('git add docs/arquitetura.md', { cwd: repo.dir, stdio: 'ignore' });
    const resFantasma = repo.executar();
    assert.equal(resFantasma.exitCode, 1);
    assert.match(resFantasma.stderr, /Sensor Anti-Apodrecimento do Mapa Físico/);

    // Restaura mapa válido
    writeFileSync(
      join(repo.dir, 'docs', 'arquitetura.md'),
      `# Arquitetura\n\n## 5. Mapa Físico de Módulos (Onde Cada Coisa Mora)\n\n| Domínio | Pasta | Responsabilidade | Testes |\n|---|---|---|---|\n| **Pagamentos** | \`src/pagamentos/\` | Checkout | \`tests/\` |\n`,
      'utf8'
    );
    execSync('git reset', { cwd: repo.dir, stdio: 'ignore' });

    // 3. Remove toda a pasta src/pagamentos sem atualizar docs/arquitetura.md -> deve bloquear
    execSync('git rm -r src/pagamentos', { cwd: repo.dir, stdio: 'ignore' });
    const resPastaRemovida = repo.executar();
    assert.equal(resPastaRemovida.exitCode, 1);
    assert.match(resPastaRemovida.stderr, /Sensor Anti-Apodrecimento do Mapa Físico/);

    // 4. Restaura e testa avisos não-bloqueantes: Dockerfile sem docs/runbook.md + .agents/handoff.md ativo
    execSync('git reset --hard HEAD', { cwd: repo.dir, stdio: 'ignore' });
    writeFileSync(join(repo.dir, 'Dockerfile'), 'FROM node:20-alpine\n', 'utf8');
    writeFileSync(join(repo.dir, 'src', 'pagamentos', 'servico.ts'), 'export function pagar() { return 2; }\n', 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Corrigido\n- Ajuste deploy e servico\n', 'utf8');
    writeFileSync(
      join(repo.dir, '.agents', 'handoff.md'),
      '- **Status:** Em andamento\n- **Contexto:** Ajuste parcial\n- **Próximo passo:** Finalizar\n',
      'utf8'
    );
    execSync('git add Dockerfile src/pagamentos/servico.ts CHANGELOG.md', { cwd: repo.dir, stdio: 'ignore' });

    const resAvisos = repo.executar();
    assert.equal(resAvisos.exitCode, 0);
    assert.match(resAvisos.stdout, /\[AVISO RUNBOOK\]/);
    assert.match(resAvisos.stdout, /\[AVISO HANDOFF\]/);

    // 5. Quando docs/runbook.md é incluído e handoff marcado Concluído, os avisos somem
    writeFileSync(join(repo.dir, 'docs', 'runbook.md'), '# Runbook\n', 'utf8');
    writeFileSync(
      join(repo.dir, '.agents', 'handoff.md'),
      '- **Status:** Concluído\n- **Contexto:** Ajuste parcial\n- **Próximo passo:** Finalizar\n',
      'utf8'
    );
    execSync('git add docs/runbook.md', { cwd: repo.dir, stdio: 'ignore' });

    const resLimpo = repo.executar();
    assert.equal(resLimpo.exitCode, 0);
    assert.doesNotMatch(resLimpo.stdout, /\[AVISO RUNBOOK\]/);
    assert.doesNotMatch(resLimpo.stdout, /\[AVISO HANDOFF\]/);
  } finally {
    repo.limpar();
  }
});
