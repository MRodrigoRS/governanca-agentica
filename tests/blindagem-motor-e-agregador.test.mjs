import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync, spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const raiz = process.cwd();
const dirTemplate = join(raiz, 'template');
const dirTemplateScripts = join(dirTemplate, 'scripts');

function copiarScriptsGovernanca(dirDestino) {
  const dirScriptsDestino = join(dirDestino, 'scripts');
  mkdirSync(join(dirScriptsDestino, 'lib'), { recursive: true });
  copyFileSync(
    join(dirTemplateScripts, 'verificar-governanca.mjs'),
    join(dirScriptsDestino, 'verificar-governanca.mjs')
  );
  copyFileSync(
    join(dirTemplateScripts, 'validar-commit-msg.mjs'),
    join(dirScriptsDestino, 'validar-commit-msg.mjs')
  );
  copyFileSync(
    join(dirTemplateScripts, 'hook-agente.mjs'),
    join(dirScriptsDestino, 'hook-agente.mjs')
  );
  for (const arquivo of readdirSync(join(dirTemplateScripts, 'lib'))) {
    if (arquivo.endsWith('.mjs')) {
      copyFileSync(
        join(dirTemplateScripts, 'lib', arquivo),
        join(dirScriptsDestino, 'lib', arquivo)
      );
    }
  }
}

function criarRepoTemporario(prefixo = 'test-blindagem') {
  const dir = join(
    tmpdir(),
    `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });
  copiarScriptsGovernanca(dir);

  return {
    dir,
    limpar() {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {}
    },
    executarVerificador(args = '') {
      const env = args.includes('--ci')
        ? { ...process.env, CI: 'true' }
        : { ...process.env, CI: 'false' };
      try {
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, {
          cwd: dir,
          env,
          encoding: 'utf8',
        });
        return { exitCode: 0, stdout, stderr: '' };
      } catch (err) {
        return {
          exitCode: err.status ?? 1,
          stdout: err.stdout?.toString() ?? '',
          stderr: err.stderr?.toString() ?? '',
        };
      }
    },
  };
}

function gerarLinhasCodigo(qtd, prefixo = 'export const v') {
  return Array.from({ length: qtd }, (_, i) => `${prefixo}_${i} = ${i};`).join('\n');
}

describe('Fatia 19: Blindagem do Motor, Agregador de Erros e Fechamento Atômico (v4.5.0)', () => {
  test('1_hooks_bloqueiam_read_file_e_view_file_em_env', () => {
    const hookRaiz = JSON.parse(readFileSync(join(raiz, '.agents', 'hooks.json'), 'utf8'));
    const hookTemplate = JSON.parse(readFileSync(join(dirTemplate, '.agents', 'hooks.json'), 'utf8'));

    for (const [nome, cfg] of [
      ['raiz', hookRaiz],
      ['template', hookTemplate],
    ]) {
      const matcher = cfg?.['governanca-gate']?.PreToolUse?.[0]?.matcher || '';
      assert.match(matcher, /\bread_file\b/, `.agents/hooks.json (${nome}) deve incluir read_file no matcher`);
      assert.match(matcher, /\bview_file\b/, `.agents/hooks.json (${nome}) deve incluir view_file no matcher`);
      assert.match(matcher, /\bRead\b/, `.agents/hooks.json (${nome}) deve incluir Read no matcher`);
    }

    const hookScript = join(dirTemplateScripts, 'hook-agente.mjs');

    const resEnv = spawnSync(process.execPath, [hookScript, 'pre-tool'], {
      input: JSON.stringify({ toolCall: { name: 'read_file', args: { Path: '.env' } } }),
      encoding: 'utf8',
    });
    assert.equal(resEnv.status, 0);
    assert.equal(JSON.parse(resEnv.stdout).decision, 'deny');

    const resView = spawnSync(process.execPath, [hookScript, 'pre-tool'], {
      input: JSON.stringify({ toolCall: { name: 'view_file', args: { AbsolutePath: '/tmp/app/.env.local' } } }),
      encoding: 'utf8',
    });
    assert.equal(resView.status, 0);
    assert.equal(JSON.parse(resView.stdout).decision, 'deny');

    const resExample = spawnSync(process.execPath, [hookScript, 'pre-tool'], {
      input: JSON.stringify({ toolCall: { name: 'read_file', args: { Path: '.env.example' } } }),
      encoding: 'utf8',
    });
    assert.equal(resExample.status, 0);
    assert.equal(JSON.parse(resExample.stdout).decision, 'allow');
  });

  test('2_modo_ci_bloqueia_violacao_de_cerimonia_e_anti_monolito_com_staging_vazio', () => {
    // Cenário A: violação de cerimônia (Via 1a > 3 arquivos) no modo --ci
    const repoCerimonia = criarRepoTemporario('test-ci-cerimonia');
    try {
      mkdirSync(join(repoCerimonia.dir, 'openspec', 'changes', 'archive', '2026-11-01-fatia-01'), { recursive: true });
      writeFileSync(join(repoCerimonia.dir, 'openspec', 'changes', 'archive', '2026-11-01-fatia-01', 'tasks.md'), '- [x] OK\n', 'utf8');
      writeFileSync(join(repoCerimonia.dir, 'package.json'), '{"name":"app","dependencies":{"a":"1.0.0"}}\n', 'utf8');
      writeFileSync(join(repoCerimonia.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repoCerimonia.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): inicializa repositorio de teste"', { cwd: repoCerimonia.dir, stdio: 'ignore' });

      mkdirSync(join(repoCerimonia.dir, 'src'), { recursive: true });
      mkdirSync(join(repoCerimonia.dir, 'tests'), { recursive: true });
      for (let i = 1; i <= 4; i++) {
        writeFileSync(join(repoCerimonia.dir, 'src', `a${i}.js`), `export const a${i} = ${i};\n`, 'utf8');
      }
      writeFileSync(join(repoCerimonia.dir, 'tests', 'a.test.js'), 'assert.equal(1, 1);\n', 'utf8');
      writeFileSync(join(repoCerimonia.dir, 'CHANGELOG.md'), '# Changelog\n## [0.1.1]\n### Corrigido\n- Ajuste\n', 'utf8');
      execSync('git add .', { cwd: repoCerimonia.dir, stdio: 'ignore' });
      execSync('git commit -n -m "fix(api): altera quatro arquivos sem delta"', { cwd: repoCerimonia.dir, stdio: 'ignore' });

      const res = repoCerimonia.executarVerificador('--ci');
      assert.equal(res.exitCode, 1, 'Modo --ci deve bloquear fix tocando 4 arquivos mesmo com staging vazio');
      assert.match(res.stderr, /Via 1a|teto estrito de 3 arquivos|Cerimônia/i);
    } finally {
      repoCerimonia.limpar();
    }

    // Cenário B: arquivo cruzando 350 linhas úteis no modo --ci
    const repoMonolito = criarRepoTemporario('test-ci-monolito');
    try {
      mkdirSync(join(repoMonolito.dir, 'openspec', 'changes', 'archive', '2026-11-01-fatia-01'), { recursive: true });
      writeFileSync(join(repoMonolito.dir, 'openspec', 'changes', 'archive', '2026-11-01-fatia-01', 'tasks.md'), '- [x] OK\n', 'utf8');
      mkdirSync(join(repoMonolito.dir, 'src'), { recursive: true });
      mkdirSync(join(repoMonolito.dir, 'tests'), { recursive: true });
      writeFileSync(join(repoMonolito.dir, 'src', 'modulo.js'), gerarLinhasCodigo(340), 'utf8');
      writeFileSync(join(repoMonolito.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repoMonolito.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): cria modulo com 340 linhas"', { cwd: repoMonolito.dir, stdio: 'ignore' });

      writeFileSync(join(repoMonolito.dir, 'src', 'modulo.js'), gerarLinhasCodigo(360), 'utf8');
      writeFileSync(join(repoMonolito.dir, 'tests', 'modulo.test.js'), 'assert.equal(1, 1);\n', 'utf8');
      writeFileSync(join(repoMonolito.dir, 'CHANGELOG.md'), '# Changelog\n## [0.1.1]\n### Corrigido\n- Cresce modulo\n', 'utf8');
      execSync('git add .', { cwd: repoMonolito.dir, stdio: 'ignore' });
      execSync('git commit -n -m "fix(core): cresce modulo alem do teto"', { cwd: repoMonolito.dir, stdio: 'ignore' });

      const res = repoMonolito.executarVerificador('--ci');
      assert.equal(res.exitCode, 1, 'Modo --ci deve bloquear arquivo que cruzou 350 linhas úteis');
      assert.match(res.stderr, /350 linhas úteis|Sensor Anti-Monólito/i);
    } finally {
      repoMonolito.limpar();
    }
  });

  test('3_agregador_reporta_multiplas_violacoes_numa_unica_execucao', () => {
    const repo = criarRepoTemporario('test-agregador');
    try {
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): setup inicial"', { cwd: repo.dir, stdio: 'ignore' });

      mkdirSync(join(repo.dir, 'src'), { recursive: true });
      mkdirSync(join(repo.dir, 'tests'), { recursive: true });
      writeFileSync(join(repo.dir, 'src', 'App.tsx'), 'export function App() { window.location.reload(); return null; }\n', 'utf8');
      writeFileSync(
        join(repo.dir, 'tests', 'app.test.mjs'),
        'test.' + 'only("x", () => { assert.equal(1, 1); });\n',
        'utf8'
      );
      execSync('git add src/App.tsx tests/app.test.mjs', { cwd: repo.dir, stdio: 'ignore' });

      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 1);
      assert.match(res.stderr, /Reatividade Limpa/i, 'Deve reportar location.reload');
      assert.match(res.stderr, /Foco Exclusivo/i, 'Deve reportar foco exclusivo na mesma execução');
      assert.match(res.stderr, /CHANGELOG\.md/i, 'Deve reportar falta de CHANGELOG.md na mesma execução');
    } finally {
      repo.limpar();
    }
  });

  test('4_transparencia_de_valvulas_de_escape_no_diff', () => {
    const repo = criarRepoTemporario('test-valvulas');
    try {
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): setup inicial"', { cwd: repo.dir, stdio: 'ignore' });

      mkdirSync(join(repo.dir, 'src'), { recursive: true });
      mkdirSync(join(repo.dir, 'tests'), { recursive: true });
      writeFileSync(
        join(repo.dir, 'tests', 'driver.test.mjs'),
        '// governanca:mock-banco-justificado: teste de falha de socket no driver sqlite\n' +
        "vi.mock('../db');\nexpect(true).toBe(true);\n",
        'utf8'
      );
      writeFileSync(
        join(repo.dir, 'src', 'tabela.js'),
        '// governanca:arquivo-extenso-justificado: tabela estatica de transicoes binarias\n' +
        gerarLinhasCodigo(360),
        'utf8'
      );
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [0.1.0]\n### Corrigido\n- Valvulas\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 0, `Deveria aprovar com válvulas válidas, mas falhou: ${res.stderr}`);
      assert.match(res.stdout, /VÁLVULAS DE ESCAPE ATIVAS NO DIFF/i);
      assert.match(res.stdout, /mock-banco-justificado/);
      assert.match(res.stdout, /arquivo-extenso-justificado/);
    } finally {
      repo.limpar();
    }
  });

  test('5_desmonolitizacao_teto_350_linhas_em_todos_os_modulos_e_reexports', async () => {
    const mod = await import(pathToFileURL(join(dirTemplateScripts, 'verificar-governanca.mjs')).href);
    assert.equal(typeof mod.contarLinhasUteisCodigo, 'function', 'verificar-governanca.mjs deve re-exportar contarLinhasUteisCodigo');
    assert.equal(typeof mod.ehArquivoIsentoDeTetoMonolito, 'function', 'verificar-governanca.mjs deve re-exportar ehArquivoIsentoDeTetoMonolito');

    const arquivosAuditar = [
      join(dirTemplateScripts, 'verificar-governanca.mjs'),
      ...readdirSync(join(dirTemplateScripts, 'lib'))
        .filter((f) => f.endsWith('.mjs'))
        .map((f) => join(dirTemplateScripts, 'lib', f)),
    ];

    for (const caminho of arquivosAuditar) {
      const conteudo = readFileSync(caminho, 'utf8');
      const linhasUteis = mod.contarLinhasUteisCodigo(conteudo, '.mjs');
      assert.ok(
        linhasUteis <= 350,
        `Módulo '${caminho.replace(raiz + '\\', '')}' tem ${linhasUteis} linhas úteis (máximo permitido: 350)`
      );
    }
  });

  test('6_gate2_atomico_visibilidade_valvulas_e_semver_4_5_0', () => {
    const skillCiclo = readFileSync(join(dirTemplate, '.agents', 'skills', 'ciclo-especificacao', 'SKILL.md'), 'utf8');
    const secaoGate2Skill = skillCiclo.split('## 6. Gate 2')[1] || '';
    const idxArchiveSkill = secaoGate2Skill.search(/openspec archive/);
    const idxCommitSkill = secaoGate2Skill.search(/git commit/);
    assert.ok(idxArchiveSkill !== -1 && idxCommitSkill !== -1 && idxArchiveSkill < idxCommitSkill,
      'ciclo-especificacao/SKILL.md deve instruir openspec archive ANTES de git commit no Gate 2');
    assert.match(secaoGate2Skill, /v[áa]lvula|VÁLVULAS DE ESCAPE/i,
      'Gate 2 em ciclo-especificacao/SKILL.md deve exigir destaque de válvulas de escape');

    const templateAgents = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
    const secaoMarco2 = templateAgents.split('Marco 2 — Fechamento')[1] || '';
    const idxArchiveAgents = secaoMarco2.search(/openspec archive/);
    const idxCommitAgents = secaoMarco2.search(/git commit/);
    assert.ok(idxArchiveAgents !== -1 && idxCommitAgents !== -1 && idxArchiveAgents < idxCommitAgents,
      'template/AGENTS.md deve instruir openspec archive ANTES de git commit no Gate 2');
    assert.match(secaoMarco2, /v[áa]lvula/i,
      'template/AGENTS.md deve exigir destaque de válvulas de escape no Gate 2');

    const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
    assert.ok(constituicao.includes('governanca:inicio v4.5.0'), 'constitution.md deve ter cabeçalho v4.5.0');
    assert.match(constituicao, /v[áa]lvula[\s\S]*Gate 2/i, 'constitution.md deve exigir visibilidade de válvulas no Gate 2');

    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.equal(pkg.version, '4.5.0', 'package.json deve estar em 4.5.0');
    assert.ok(templateAgents.includes('governanca:inicio v4.5.0'), 'template/AGENTS.md deve ter cabeçalho v4.5.0');

    const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
    assert.ok(projectJinja.includes('Governança v4.5.0'), 'project.md.jinja deve estar em v4.5.0');

    const catalogoStacks = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'),
      'utf8'
    );
    assert.ok(catalogoStacks.includes('Governança v4.5.0'), 'catalogo-stacks.md deve estar em v4.5.0');

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D47\s*\|/, '00_INDICE_E_DECISOES.md deve registrar D47');

    const readme = readFileSync(join(raiz, 'README.md'), 'utf8');
    assert.ok(readme.includes('4.5.0'), 'README.md deve refletir versão 4.5.0');

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.match(changelog, /## \[4\.5\.0\]/, 'CHANGELOG.md deve conter seção [4.5.0]');
  });
});
