import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { contarLinhasUteisCodigo } from '../template/scripts/verificar-governanca.mjs';

const raiz = process.cwd();
const dirTemplate = join(raiz, 'template');
const dirTemplateScripts = join(dirTemplate, 'scripts');

function copiarScriptsGovernanca(dirDestino) {
  const dirDestinoScripts = join(dirDestino, 'scripts');
  mkdirSync(join(dirDestinoScripts, 'lib'), { recursive: true });
  copyFileSync(
    join(dirTemplateScripts, 'verificar-governanca.mjs'),
    join(dirDestinoScripts, 'verificar-governanca.mjs')
  );
  for (const arquivo of readdirSync(join(dirTemplateScripts, 'lib'))) {
    if (arquivo.endsWith('.mjs')) {
      copyFileSync(
        join(dirTemplateScripts, 'lib', arquivo),
        join(dirDestinoScripts, 'lib', arquivo)
      );
    }
  }
}

function criarRepoTemporario(prefixo = 'test-maturidade') {
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
    executarVerificador(args = '--staged') {
      try {
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, {
          cwd: dir,
          env: { ...process.env, CI: 'false' },
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

describe('Fatia 21: Hierarquia Constitucional Anti-Diluição e Sensores de Maturidade (v4.7.0)', () => {
  test('1_constituicao_define_hierarquia_3_faixas_preservando_artigos_1_a_14', () => {
    const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
    assert.ok(constituicao.includes('governanca:inicio v4.7.0'), 'constitution.md deve ter cabeçalho v4.7.0');

    const idxHierarquia = constituicao.indexOf('## Hierarquia Constitucional (3 Faixas de Severidade — Anti-Diluição)');
    const idxArtigo1 = constituicao.indexOf('## Artigo 1');
    assert.ok(idxHierarquia !== -1 && idxArtigo1 !== -1 && idxHierarquia < idxArtigo1,
      'Tabela de Hierarquia Constitucional deve aparecer antes do Artigo 1');

    const faixasEsperadas = new Map([
      [1, '[Faixa 2 — Engenharia]'],
      [2, '[Faixa 1 — Crítico]'],
      [3, '[Faixa 1 — Crítico]'],
      [4, '[Faixa 1 — Crítico]'],
      [5, '[Faixa 2 — Engenharia]'],
      [6, '[Faixa 2 — Engenharia]'],
      [7, '[Faixa 1 — Crítico]'],
      [8, '[Faixa 3 — Processo]'],
      [9, '[Faixa 3 — Processo]'],
      [10, '[Faixa 2 — Engenharia]'],
      [11, '[Faixa 1 — Crítico]'],
      [12, '[Faixa 3 — Processo]'],
      [13, '[Faixa 1 — Crítico]'],
      [14, '[Faixa 2 — Engenharia]'],
    ]);

    let posicaoAnterior = -1;
    for (const [numero, selo] of faixasEsperadas.entries()) {
      const regex = new RegExp(`^## Artigo ${numero} — ${selo.replace(/[[\]]/g, '\\$&')}`, 'm');
      const match = constituicao.match(regex);
      assert.ok(match, `Artigo ${numero} deve conter o selo exato '${selo}'`);
      assert.ok(match.index > posicaoAnterior, `Artigo ${numero} deve preservar a ordem crescente 1..14`);
      posicaoAnterior = match.index;
    }
  });

  test('2_agents_md_espelha_faixas_no_cartao_e_documenta_aviso_maturidade', () => {
    const templateAgents = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
    assert.ok(templateAgents.includes('governanca:inicio v4.7.0'), 'template/AGENTS.md deve ter cabeçalho v4.7.0');

    const cartao = templateAgents.split('### Matriz Universal')[0] || '';
    assert.ok(cartao.includes('[Faixa 1 — Crítico]'), 'Cartão de Invariantes deve rotular itens de [Faixa 1 — Crítico]');
    assert.ok(cartao.includes('[Faixa 2 — Engenharia]'), 'Cartão de Invariantes deve rotular itens de [Faixa 2 — Engenharia]');
    assert.ok(cartao.includes('[Faixa 3 — Processo]'), 'Cartão de Invariantes deve rotular itens de [Faixa 3 — Processo]');
    assert.ok(templateAgents.includes('[AVISO MATURIDADE]'), 'template/AGENTS.md deve documentar [AVISO MATURIDADE]');
  });

  test('3_sensores_maturidade_emitem_avisos_nao_bloqueantes_nos_3_gatilhos', () => {
    const repo = criarRepoTemporario('test-maturidade-3');
    try {
      for (let i = 1; i <= 4; i++) {
        mkdirSync(join(repo.dir, 'openspec', 'changes', 'archive', `2026-11-0${i}-fatia-0${i}`), { recursive: true });
        writeFileSync(
          join(repo.dir, 'openspec', 'changes', 'archive', `2026-11-0${i}-fatia-0${i}`, 'tasks.md'),
          '- [x] OK\n',
          'utf8'
        );
      }
      mkdirSync(join(repo.dir, 'src'), { recursive: true });
      for (let i = 1; i <= 5; i++) {
        writeFileSync(join(repo.dir, 'src', `Comp${i}.tsx`), `export function Comp${i}() { return null; }\n`, 'utf8');
      }
      mkdirSync(join(repo.dir, 'docs'), { recursive: true });
      writeFileSync(join(repo.dir, 'Dockerfile'), 'FROM node:20\n', 'utf8');
      writeFileSync(
        join(repo.dir, 'docs', 'catalogo-reuso.md'),
        '# Catálogo de Reúso\n| Item | Caminho |\n|---|---|\n| *(Exemplo)* | *(preencha aqui)* |\n',
        'utf8'
      );
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        '# Matriz\n## 1. Requisitos Rastreados\n| ID | Requisito | Fonte | Fatia | Status | Prova Real |\n|---|---|---|---|---|---|\n| *(REQ-01)* | *(ex)* | *(fonte)* | *(fatia)* | *([ ] Pendente)* | *(prova)* |\n',
        'utf8'
      );
      writeFileSync(
        join(repo.dir, 'docs', 'runbook.md'),
        '# Runbook\n## 1. Deploy\n- *(Ex.: Fly.io)*\n## 2. Verificação\n- *(Ex.: curl)*\n',
        'utf8'
      );
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): inicializa repo com escala sem docs preenchidos"', { cwd: repo.dir, stdio: 'ignore' });

      writeFileSync(join(repo.dir, 'src', 'Comp1.tsx'), 'export function Comp1() { return "v2"; }\n', 'utf8');
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [0.1.1]\n### Corrigido\n- Ajuste UI\n', 'utf8');
      execSync('git add src/Comp1.tsx CHANGELOG.md', { cwd: repo.dir, stdio: 'ignore' });

      const resComAvisos = repo.executarVerificador('--staged');
      assert.equal(resComAvisos.exitCode, 0, 'Sensores de maturidade nunca devem bloquear o commit');
      const matchesAviso = resComAvisos.stdout.match(/\[AVISO MATURIDADE\]/g) || [];
      assert.equal(matchesAviso.length, 3, `Esperados 3 avisos [AVISO MATURIDADE], recebido: ${resComAvisos.stdout}`);
      assert.match(resComAvisos.stdout, /docs\/catalogo-reuso\.md/);
      assert.match(resComAvisos.stdout, /openspec\/matriz-requisitos\.md/);
      assert.match(resComAvisos.stdout, /docs\/runbook\.md/);

      // Agora preenche os 3 artefatos e verifica zero avisos
      writeFileSync(
        join(repo.dir, 'docs', 'catalogo-reuso.md'),
        '# Catálogo de Reúso\n| Item | Caminho |\n|---|---|\n| Comp1 | `src/Comp1.tsx` |\n',
        'utf8'
      );
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        '# Matriz\n## 1. Requisitos Rastreados\n| ID | Requisito | Fonte | Fatia | Status | Prova Real |\n|---|---|---|---|---|---|\n| `REQ-01` | Componente base | `src/Comp1.tsx` | `fatia-01` | `[ ] Pendente` | — |\n',
        'utf8'
      );
      writeFileSync(
        join(repo.dir, 'docs', 'runbook.md'),
        '# Runbook\n## 1. Deploy\n- Fly.io via `fly deploy`\n## 2. Verificação\n- `curl https://app.exemplo.com/health`\n',
        'utf8'
      );
      execSync('git add docs/catalogo-reuso.md openspec/matriz-requisitos.md docs/runbook.md', { cwd: repo.dir, stdio: 'ignore' });

      const resSemAvisos = repo.executarVerificador('--staged');
      assert.equal(resSemAvisos.exitCode, 0);
      assert.doesNotMatch(resSemAvisos.stdout, /\[AVISO MATURIDADE\]/);
    } finally {
      repo.limpar();
    }
  });

  test('4_sensores_maturidade_suprimidos_na_fundacao_e_teto_350_linhas', () => {
    const camSensor = join(dirTemplateScripts, 'lib', 'sensores-maturidade.mjs');
    assert.ok(existsSync(camSensor), 'template/scripts/lib/sensores-maturidade.mjs deve existir');

    const linhasSensor = contarLinhasUteisCodigo(readFileSync(camSensor, 'utf8'), '.mjs');
    assert.ok(linhasSensor <= 350, `sensores-maturidade.mjs tem ${linhasSensor} linhas úteis (máx: 350)`);

    const linhasVerificador = contarLinhasUteisCodigo(
      readFileSync(join(dirTemplateScripts, 'verificar-governanca.mjs'), 'utf8'),
      '.mjs'
    );
    assert.ok(linhasVerificador <= 350, `verificar-governanca.mjs tem ${linhasVerificador} linhas úteis (máx: 350)`);

    const repo = criarRepoTemporario('test-maturidade-fundacao');
    try {
      mkdirSync(join(repo.dir, 'openspec'), { recursive: true });
      mkdirSync(join(repo.dir, 'src'), { recursive: true });
      mkdirSync(join(repo.dir, 'docs'), { recursive: true });
      writeFileSync(join(repo.dir, 'openspec', 'project.md'), '# Projeto\n', 'utf8');
      writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), '# Roadmap\n', 'utf8');
      for (let i = 1; i <= 5; i++) {
        writeFileSync(join(repo.dir, 'src', `C${i}.tsx`), `export const C${i} = () => null;\n`, 'utf8');
      }
      writeFileSync(join(repo.dir, 'Dockerfile'), 'FROM node:20\n', 'utf8');
      writeFileSync(join(repo.dir, 'docs', 'catalogo-reuso.md'), '# Catálogo\n', 'utf8');
      writeFileSync(join(repo.dir, 'docs', 'runbook.md'), '# Runbook\n*(Ex.: a)*\n*(Ex.: b)*\n', 'utf8');
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 0);
      assert.doesNotMatch(res.stdout, /\[AVISO MATURIDADE\]/, 'Commit de fundação não deve emitir [AVISO MATURIDADE]');
    } finally {
      repo.limpar();
    }
  });

  test('5_sincronia_pipeline_mapa_fisico_d49_e_semver_4_7_0', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.equal(pkg.version, '4.7.0', 'package.json deve estar em 4.7.0');

    const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
    assert.ok(projectJinja.includes('Governança v4.7.0'), 'project.md.jinja deve estar em v4.7.0');

    const catalogoStacks = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'),
      'utf8'
    );
    assert.ok(catalogoStacks.includes('Governança v4.7.0'), 'catalogo-stacks.md deve estar em v4.7.0');

    const lefthook = readFileSync(join(raiz, 'lefthook.yml'), 'utf8');
    assert.ok(lefthook.includes('sensores-maturidade.mjs'), 'lefthook.yml deve checar sensores-maturidade.mjs');

    const ci = readFileSync(join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.ok(ci.includes('sensores-maturidade.mjs'), '.github/workflows/ci.yml deve checar sensores-maturidade.mjs');

    const arquitetura = readFileSync(join(raiz, 'docs', 'arquitetura.md'), 'utf8');
    assert.ok(arquitetura.includes('template/scripts/lib/sensores-maturidade.mjs'), 'docs/arquitetura.md §5 deve mapear sensores-maturidade.mjs');

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D49\s*\|/, '00_INDICE_E_DECISOES.md deve registrar D49');
    assert.ok(decisoes.includes('v4.7.0'), '00_INDICE_E_DECISOES.md deve citar v4.7.0');

    const readme = readFileSync(join(raiz, 'README.md'), 'utf8');
    assert.ok(readme.includes('4.7.0'), 'README.md deve refletir versão 4.7.0');
    assert.ok(readme.includes('D49'), 'README.md deve referenciar D49');

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.match(changelog, /## \[4\.7\.0\]/, 'CHANGELOG.md deve conter seção [4.7.0]');
  });
});
