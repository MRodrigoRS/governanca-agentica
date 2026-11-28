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

function criarRepoTemporario(prefixo = 'test-calibracao') {
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

describe('Fatia 23: Calibração Empírica e Anti-Diluição (v4.9.0 / D51)', () => {
  test('1_sensores_catalogo_reuso_suportam_listas_sem_falso_positivo_e_bloqueiam_apodrecimento', async () => {
    const indices = await import('../template/scripts/lib/sensores-indices.mjs');
    assert.equal(
      typeof indices.extrairPonteirosMarkdown,
      'function',
      'sensores-indices.mjs deve exportar extrairPonteirosMarkdown'
    );

    const linhasLista = [
      '# Catálogo de Reúso',
      '## 2. Primitivos de UI',
      '- **Botao** (`src/components/Botao.tsx`) — botão primário',
      '```md',
      '- **Exemplo** (`src/ignorado/Exemplo.tsx`)',
      '```',
    ];
    const ponteirosExtraidos = indices.extrairPonteirosMarkdown(linhasLista, {
      permitirDiretorios: false,
      aceitarListas: true,
    });
    assert.deepEqual(
      ponteirosExtraidos.map((p) => p.caminho),
      ['src/components/Botao.tsx'],
      'Deve extrair caminho em item de lista ignorando blocos de código cercados'
    );

    const repo = criarRepoTemporario('test-calibracao-lista');
    try {
      mkdirSync(join(repo.dir, 'src', 'components'), { recursive: true });
      mkdirSync(join(repo.dir, 'docs'), { recursive: true });
      for (let i = 1; i <= 5; i++) {
        writeFileSync(
          join(repo.dir, 'src', 'components', `Comp${i}.tsx`),
          `export const Comp${i} = () => null;\n`,
          'utf8'
        );
      }
      const camBotao = join(repo.dir, 'src', 'components', 'Botao.tsx');
      writeFileSync(camBotao, 'export const Botao = () => null;\n', 'utf8');
      writeFileSync(
        join(repo.dir, 'docs', 'catalogo-reuso.md'),
        `# Catálogo de Reúso\n\n## 2. Primitivos\n- **Botao** (\`src/components/Botao.tsx\`)\n`,
        'utf8'
      );
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Base UI\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): inicializa componentes e catalogo em lista"', { cwd: repo.dir, stdio: 'ignore' });

      // Edição comum: não pode disparar falso positivo [AVISO MATURIDADE] para docs/catalogo-reuso.md
      writeFileSync(join(repo.dir, 'src', 'components', 'Comp1.tsx'), 'export const Comp1 = () => "v2";\n', 'utf8');
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Corrigido\n- Ajuste UI\n', 'utf8');
      execSync('git add src/components/Comp1.tsx CHANGELOG.md', { cwd: repo.dir, stdio: 'ignore' });
      const resListaValida = repo.executarVerificador('--staged');
      assert.equal(resListaValida.exitCode, 0, `Deveria aprovar sem erro: ${resListaValida.stderr}`);
      assert.doesNotMatch(
        resListaValida.stdout,
        /docs\/catalogo-reuso\.md/,
        'Catálogo preenchido em formato de lista não pode disparar [AVISO MATURIDADE]'
      );

      // Remoção do arquivo citado em lista sem atualizar catálogo -> deve bloquear
      rmSync(camBotao);
      execSync('git rm src/components/Botao.tsx', { cwd: repo.dir, stdio: 'ignore' });
      const resRemocaoLista = repo.executarVerificador('--staged');
      assert.equal(resRemocaoLista.exitCode, 1, 'Remoção de arquivo citado em lista no catálogo deve bloquear');
      assert.match(resRemocaoLista.stderr + resRemocaoLista.stdout, /Botao\.tsx/);

      // Restaura Botao.tsx e adiciona ponteiro inexistente na lista -> deve bloquear
      writeFileSync(camBotao, 'export const Botao = () => null;\n', 'utf8');
      writeFileSync(
        join(repo.dir, 'docs', 'catalogo-reuso.md'),
        `# Catálogo\n- **Fantasma** (\`src/components/Fantasma.tsx\`)\n`,
        'utf8'
      );
      execSync('git add src/components/Botao.tsx docs/catalogo-reuso.md', { cwd: repo.dir, stdio: 'ignore' });
      const resFantasmaLista = repo.executarVerificador('--staged');
      assert.equal(resFantasmaLista.exitCode, 1, 'Lista apontando para arquivo inexistente deve bloquear');
      assert.match(resFantasmaLista.stderr + resFantasmaLista.stdout, /Fantasma\.tsx/);
    } finally {
      repo.limpar();
    }
  });

  test('2_sensor_mapa_fisico_ignora_semver_expressoes_e_basenames_mas_bloqueia_caminho_inexistente', () => {
    const repo = criarRepoTemporario('test-calibracao-mapa');
    try {
      mkdirSync(join(repo.dir, 'src', 'app'), { recursive: true });
      mkdirSync(join(repo.dir, 'public'), { recursive: true });
      mkdirSync(join(repo.dir, 'docs'), { recursive: true });

      writeFileSync(join(repo.dir, 'package.json'), JSON.stringify({ name: 'orvix' }), 'utf8');
      writeFileSync(join(repo.dir, 'src', 'app', 'page.tsx'), 'export default function Page() { return null; }\n', 'utf8');
      writeFileSync(join(repo.dir, 'public', 'sw.js'), '// sw\n', 'utf8');
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): base inicial"', { cwd: repo.dir, stdio: 'ignore' });

      const docValido = [
        '# Arquitetura',
        '',
        '## 5. Mapa Físico de Módulos (Onde Cada Coisa Mora)',
        '',
        '| Domínio | Pasta / Entrada | Responsabilidade | Observação |',
        '|---|---|---|---|',
        '| **App** | `src/app/` | Rotas web com `v4.8.0` | Evitar `req.body` cru; ver `respostas-rapidas.ts` |',
        '| **PWA** | `public/sw.js` | Service Worker | Manifesto em `package.json` |',
      ].join('\n');
      writeFileSync(join(repo.dir, 'docs', 'arquitetura.md'), docValido, 'utf8');
      execSync('git add docs/arquitetura.md', { cwd: repo.dir, stdio: 'ignore' });

      const resSemFalsoPositivo = repo.executarVerificador('--staged');
      assert.equal(
        resSemFalsoPositivo.exitCode,
        0,
        `Tokens v4.8.0, req.body e basename curto sem barra não devem gerar falso positivo: ${resSemFalsoPositivo.stderr}`
      );

      // Agora adiciona caminho real com barra que não existe no disco -> deve bloquear
      writeFileSync(
        join(repo.dir, 'docs', 'arquitetura.md'),
        `${docValido}\n| **Quebrado** | \`arquivo-inexistente/foo.ts\` | Inexistente | Teste |\n`,
        'utf8'
      );
      execSync('git add docs/arquitetura.md', { cwd: repo.dir, stdio: 'ignore' });
      const resCaminhoQuebrado = repo.executarVerificador('--staged');
      assert.equal(resCaminhoQuebrado.exitCode, 1, 'Caminho inexistente com barra deve bloquear');
      assert.match(resCaminhoQuebrado.stderr + resCaminhoQuebrado.stdout, /arquivo-inexistente\/foo\.ts/);
    } finally {
      repo.limpar();
    }
  });

  test('3_regras_fullstack_mvp_e2e_runtime_contratos_e_observabilidade_calibradas', () => {
    const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
    assert.match(constituicao, /governanca:inicio v4\.9\.0/, 'constitution.md deve ter cabeçalho v4.9.0');

    const blocoArtigo1 = constituicao.split('## Artigo 2')[0] || '';
    assert.match(blocoArtigo1, /mon[óo]litos fullstack tipados/i, 'Artigo 1.2 deve permitir consumo interno tipado em monólitos fullstack');
    assert.match(blocoArtigo1, /APIs externas|payloads p[úu]blicos|muta[çc][õo]es cr[íi]ticas/i);

    const blocoArtigo2 = (constituicao.split('## Artigo 2')[1] || '').split('## Artigo 3')[0] || '';
    assert.match(blocoArtigo2, /su[íi]te E2E real/i, 'Artigo 2.7 deve reconhecer suíte E2E real como Prova de Runtime web-ui');

    const blocoArtigo7 = (constituicao.split('## Artigo 7')[1] || '').split('## Artigo 8')[0] || '';
    assert.match(blocoArtigo7, /\/api\/saude|\/health/i);
    assert.match(blocoArtigo7, /recomendados/i, 'Artigo 7.6 deve tornar requestId distribuído e /ready proporcionais');

    const ciclo = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'ciclo-especificacao', 'SKILL.md'),
      'utf8'
    );
    assert.match(ciclo, /E2E real/i, 'ciclo-especificacao deve reconhecer suíte E2E real na Prova de Runtime');

    const web = readFileSync(join(dirTemplate, '.agents', 'rules', 'web-ui-pwa.md.jinja'), 'utf8');
    assert.match(web, /mon[óo]litos fullstack tipados/i);
    assert.match(web, /safeParse/i);

    const backend = readFileSync(
      join(dirTemplate, '.agents', 'rules', 'backend-seguranca-dados.md.jinja'),
      'utf8'
    );
    assert.match(backend, /\/api\/saude/);
    assert.match(backend, /recomendad/i);
  });

  test('4_agents_md_enxuto_ate_130_linhas_bloco_gerenciado_foco_p0_sem_perder_comandos', () => {
    const templateAgents = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
    assert.ok(
      templateAgents.includes('governanca:inicio v4.9.0'),
      'template/AGENTS.md deve ter cabeçalho v4.9.0'
    );

    const matchBloco = templateAgents.match(/<!-- governanca:inicio[\s\S]*?<!-- governanca:fim -->/);
    assert.ok(matchBloco, 'Bloco gerenciado governanca:inicio..fim deve existir em template/AGENTS.md');
    const linhasBloco = matchBloco[0].split(/\r?\n/).length;
    assert.ok(
      linhasBloco <= 130,
      `Bloco gerenciado de template/AGENTS.md deve ter <= 130 linhas (atual: ${linhasBloco})`
    );

    const cartao = templateAgents.split('### Matriz Universal')[0] || '';
    assert.ok(cartao.includes('[Faixa 1 — Crítico]'), 'Cartão deve focar nos itens P0 de [Faixa 1 — Crítico]');
    assert.match(cartao, /constitution\.md/i, 'Cartão deve apontar explicitamente para constitution.md');
  });

  test('5_auditar_openspec_aceita_sinonimos_naturais_mantendo_bloqueio_estrutural', () => {
    const repo = criarRepoTemporario('test-calibracao-openspec');
    try {
      mkdirSync(join(repo.dir, 'openspec', 'changes', 'archive', '2026-11-01-fatia-01'), { recursive: true });
      writeFileSync(join(repo.dir, 'openspec', 'changes', 'archive', '2026-11-01-fatia-01', 'proposal.md'), '# Base\n', 'utf8');
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
      writeFileSync(
        join(repo.dir, 'openspec', 'roadmap.md'),
        `# Roadmap\n### [~] fatia-02-sinonimos\n- **Depende de:** fatia-01\n- **Objetivo de Valor:** Sinonimos\n- **O que ENTRA:**\n  - Fluxo\n- **O que FICA DE FORA:**\n  - Nada\n`,
        'utf8'
      );
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
      execSync('git commit -m "chore(base): base com fatia-01 arquivada"', { cwd: repo.dir, stdio: 'ignore' });

      mkdirSync(join(repo.dir, 'openspec', 'changes', 'fatia-02-sinonimos', 'specs', 'dominio'), { recursive: true });
      writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Fluxo sinonimos\n', 'utf8');

      const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-02-sinonimos');
      writeFileSync(
        join(pastaDelta, 'proposal.md'),
        Array.from({ length: 12 }, (_, i) =>
          i === 0 ? '## Motivação' : i === 4 ? '## Entrega' : i === 8 ? '## Não Entra' : `Detalhe ${i + 1}`
        ).join('\n'),
        'utf8'
      );
      writeFileSync(
        join(pastaDelta, 'specs', 'dominio', 'spec.md'),
        '## ADDED Requirements\n### Requirement: Fluxo Natural\n#### Scenario: Execução\nWHEN acionar\nTHEN aprova\n',
        'utf8'
      );
      writeFileSync(
        join(pastaDelta, 'design.md'),
        Array.from({ length: 20 }, (_, i) =>
          i === 0
            ? '## Arquitetura e Modelos'
            : i === 6
            ? '## Telas e Fluxos'
            : i === 13
            ? '## Validações e Riscos'
            : `Especificação técnica ${i + 1}`
        ).join('\n'),
        'utf8'
      );
      writeFileSync(
        join(pastaDelta, 'tasks.md'),
        [
          '- [ ] 1. Test-First: criar teste falhando',
          '- [ ] 2. Implementar domínio',
          '- [ ] 3. Refatorar',
          '- [ ] 4. Cobrir bordas',
          '- [ ] 5. Conferir tipos',
          '- [ ] 6. Atualizar changelog',
          '## Checklist de Validação',
          '1. Rodar npm test',
          '2. Conferir logs limpos',
          '3. Validar fluxo no navegador',
          '4. Confirmar banco real',
          '5. Solicitar Gate 2',
        ].join('\n'),
        'utf8'
      );
      writeFileSync(join(repo.dir, 'modulo.ts'), 'export const ok = true;\n', 'utf8');
      writeFileSync(join(repo.dir, 'modulo.test.ts'), 'import assert from "node:assert"; assert.equal(1, 1);\n', 'utf8');
      execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

      const resSinonimos = repo.executarVerificador('--staged');
      assert.equal(resSinonimos.exitCode, 0, `Sinônimos naturais devem ser aceitos: ${resSinonimos.stderr}`);

      // Bloqueio estrutural permanece: placeholder TODO: continua falhando
      writeFileSync(
        join(pastaDelta, 'tasks.md'),
        `${readFileSync(join(pastaDelta, 'tasks.md'), 'utf8')}\n- [ ] TODO: preencher depois\n`,
        'utf8'
      );
      execSync('git add openspec/changes/fatia-02-sinonimos/tasks.md', { cwd: repo.dir, stdio: 'ignore' });
      const resPlaceholder = repo.executarVerificador('--staged');
      assert.equal(resPlaceholder.exitCode, 1, 'Placeholder TODO: deve continuar bloqueando');
    } finally {
      repo.limpar();
    }
  });

  test('6_gitattributes_lf_crlf_fora_skip_if_exists_e_sincronia_v4_9_0_d51', async () => {
    for (const cam of [join(raiz, '.gitattributes'), join(dirTemplate, '.gitattributes')]) {
      assert.ok(existsSync(cam), `${cam} deve existir`);
      const conteudo = readFileSync(cam, 'utf8');
      assert.match(conteudo, /\*\.mjs\s+text\s+eol=lf/);
      assert.match(conteudo, /\*\.md\s+text\s+eol=lf/);
      assert.match(conteudo, /\*\.yml\s+text\s+eol=lf/);
      assert.match(conteudo, /\*\.yaml\s+text\s+eol=lf/);
      assert.match(conteudo, /\*\.json\s+text\s+eol=lf/);
      assert.match(conteudo, /\*\.ps1\s+text\s+eol=crlf/);
      assert.match(conteudo, /\*\.bat\s+text\s+eol=crlf/);
    }

    const copier = readFileSync(join(raiz, 'copier.yml'), 'utf8');
    const blocoSkip = (copier.split('_skip_if_exists:')[1] || '').split('# ---')[0] || '';
    assert.doesNotMatch(blocoSkip, /\.gitattributes/, '.gitattributes deve ficar fora de _skip_if_exists');

    const ciRaiz = readFileSync(join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.ok(ciRaiz.includes('.gitattributes'), '.github/workflows/ci.yml deve verificar .gitattributes no job Copier');

    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.equal(pkg.version, '4.9.0', 'package.json deve estar em 4.9.0');

    const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
    assert.ok(projectJinja.includes('Governança v4.9.0'));

    const catalogoStacks = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'),
      'utf8'
    );
    assert.ok(catalogoStacks.includes('Governança v4.9.0'));

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D51\s*\|/);
    assert.ok(decisoes.includes('v4.9.0'));

    const readme = readFileSync(join(raiz, 'README.md'), 'utf8');
    assert.ok(readme.includes('4.9.0'));
    assert.ok(readme.includes('D51'));

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.ok(changelog.includes('(v4.9.0)'));
    assert.match(changelog, /## \[4\.9\.0\]/);

    for (const mod of ['sensores-indices.mjs', 'sensores-maturidade.mjs', 'auditar-openspec.mjs']) {
      const linhas = contarLinhasUteisCodigo(
        readFileSync(join(dirTemplateScripts, 'lib', mod), 'utf8'),
        '.mjs'
      );
      assert.ok(linhas <= 350, `${mod} tem ${linhas} linhas úteis (máx: 350)`);
    }
  });
});
