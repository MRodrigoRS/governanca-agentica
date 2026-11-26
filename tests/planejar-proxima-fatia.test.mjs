import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const raiz = process.cwd();
const dirTemplateScripts = join(raiz, 'template', 'scripts');

function criarRepoTemporarioParaRoadmap() {
  const dir = join(
    tmpdir(),
    `test-roadmap-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  mkdirSync(join(dir, 'scripts', 'lib'), { recursive: true });
  mkdirSync(join(dir, 'openspec'), { recursive: true });

  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  copyFileSync(
    join(dirTemplateScripts, 'verificar-governanca.mjs'),
    join(dir, 'scripts', 'verificar-governanca.mjs')
  );
  copyFileSync(
    join(dirTemplateScripts, 'lib', 'classificar-arquivos.mjs'),
    join(dir, 'scripts', 'lib', 'classificar-arquivos.mjs')
  );
  copyFileSync(
    join(dirTemplateScripts, 'lib', 'classificar-cerimonia.mjs'),
    join(dir, 'scripts', 'lib', 'classificar-cerimonia.mjs')
  );
  copyFileSync(
    join(dirTemplateScripts, 'lib', 'auditar-matriz-requisitos.mjs'),
    join(dir, 'scripts', 'lib', 'auditar-matriz-requisitos.mjs')
  );

  return {
    dir,
    limpar() {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {}
    },
    auditarStaged() {
      return execSync('node scripts/verificar-governanca.mjs --staged', {
        cwd: dir,
        env: { ...process.env, CI: 'false' },
        encoding: 'utf8',
      });
    },
  };
}

describe('Fatia 16: Fatiamento Cirúrgico Just-in-Time (Subagente Arquiteto-Fatiador)', () => {
  test('1_skill_planejar_proxima_fatia_deve_existir_com_contrato_completo', () => {
    const caminhoSkill = join(
      raiz,
      'template',
      '.agents',
      'skills',
      'planejar-proxima-fatia',
      'SKILL.md'
    );
    assert.ok(
      existsSync(caminhoSkill),
      'SKILL.md de planejar-proxima-fatia deve existir'
    );

    const conteudo = readFileSync(caminhoSkill, 'utf8');

    // Frontmatter YAML
    assert.match(
      conteudo,
      /^---\r?\n[\s\S]*name:\s*planejar-proxima-fatia\b[\s\S]*description:/
    );

    // Gatilhos (/fatiar, /planejar-fatia, /proxima-fatia e Gate 2)
    assert.match(conteudo, /\/fatiar/);
    assert.match(conteudo, /\/planejar-fatia/);
    assert.match(conteudo, /\/proxima-fatia/);
    assert.match(conteudo, /Gate 2/i);

    // Regra de Ouro: congelamento estrito de código antes da aprovação
    assert.match(conteudo, /congelamento estrito/i);
    assert.match(conteudo, /código de produção/i);
    assert.match(conteudo, /openspec\/changes\//);

    // Delegação a subagente read-only (Fatiador Cirúrgico) + fallback em CLIs sem subagentes
    assert.match(conteudo, /Fatiador Cirúrgico/i);
    assert.match(conteudo, /read-only/i);
    assert.match(conteudo, /CLI|sem subagentes/i);

    // Leitura física obrigatória do livro, specs, arquitetura e código real
    for (const ref of [
      'docs/conhecimento/INDICE.md',
      'openspec/project.md',
      'openspec/roadmap.md',
      'openspec/specs/',
      'docs/arquitetura.md',
      'docs/particularidades.md',
      'docs/aprendizados.md',
    ]) {
      assert.ok(
        conteudo.includes(ref),
        `SKILL.md deve exigir leitura física de '${ref}'`
      );
    }
    assert.match(conteudo, /schema/i);
    assert.match(conteudo, /rotas/i);
    assert.match(conteudo, /testes/i);

    // 4 critérios decisórios
    assert.match(conteudo, /Prontidão de dependências/i);
    assert.match(conteudo, /Coesão e tamanho cirúrgico/i);
    assert.match(conteudo, /Desbloqueio estrutural/i);
    assert.match(conteudo, /Anti-miopia/i);

    // Saída estruturada + alinhamento grill-me + 4 âncoras + Entidades/Contratos Tocados
    assert.match(conteudo, /grill-me/i);
    assert.ok(conteudo.includes('➡️'), 'SKILL.md deve instruir recomendação ➡️ no alinhamento');
    for (const ancora of [
      'Depende de:',
      'Objetivo de Valor:',
      'Entidades/Contratos Tocados:',
      'O que ENTRA:',
      'O que FICA DE FORA:',
    ]) {
      assert.ok(
        conteudo.includes(ancora),
        `SKILL.md deve incluir a âncora '${ancora}' no rascunho da fatia`
      );
    }
    assert.match(conteudo, /Mapa Macro de Capacidades/i);
  });

  test('2_template_roadmap_deve_ter_3_camadas_e_apenas_fatia_01_fundacao', () => {
    const caminhoRoadmap = join(raiz, 'template', 'openspec', 'roadmap.md.jinja');
    const conteudo = readFileSync(caminhoRoadmap, 'utf8');

    assert.ok(
      conteudo.includes('## 1. Invariantes Globais do Gate 0'),
      'roadmap.md.jinja deve conter ## 1. Invariantes Globais do Gate 0'
    );
    assert.ok(
      conteudo.includes('## 2. Mapa Macro de Capacidades'),
      'roadmap.md.jinja deve conter ## 2. Mapa Macro de Capacidades'
    );
    assert.ok(
      conteudo.includes('## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)'),
      'roadmap.md.jinja deve conter ## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)'
    );

    assert.ok(
      conteudo.includes('### [ ] fatia-01-fundacao'),
      'roadmap.md.jinja deve conter ### [ ] fatia-01-fundacao'
    );
    for (const ancora of [
      'Depende de:',
      'Objetivo de Valor:',
      'Entidades/Contratos Tocados:',
      'O que ENTRA:',
      'O que FICA DE FORA:',
    ]) {
      assert.ok(
        conteudo.includes(ancora),
        `fatia-01-fundacao em roadmap.md.jinja deve incluir '${ancora}'`
      );
    }

    assert.doesNotMatch(
      conteudo,
      /###\s+(?:\[[ x~]\]\s+)?fatia-02/,
      'roadmap.md.jinja não deve pré-fabricar bloco fatia-02 antecipadamente'
    );
  });

  test('3_integracao_nas_4_skills_constituicao_indices_e_ci', () => {
    const init = readFileSync(
      join(raiz, 'template', '.agents', 'skills', 'inicializar-stack', 'SKILL.md'),
      'utf8'
    );
    assert.match(init, /Mapa Macro de Capacidades/i);
    assert.match(init, /fatia-01-fundacao/);
    assert.ok(
      init.includes('.agents/skills/planejar-proxima-fatia/SKILL.md'),
      'inicializar-stack deve referenciar planejar-proxima-fatia/SKILL.md'
    );

    const sintetizar = readFileSync(
      join(raiz, 'template', '.agents', 'skills', 'sintetizar-conhecimento', 'SKILL.md'),
      'utf8'
    );
    assert.match(sintetizar, /Mapa Macro de Capacidades/i);
    assert.match(sintetizar, /Mapa de Domínios/i);
    assert.ok(
      sintetizar.includes('.agents/skills/planejar-proxima-fatia/SKILL.md'),
      'sintetizar-conhecimento deve referenciar planejar-proxima-fatia/SKILL.md'
    );

    const mesa = readFileSync(
      join(raiz, 'template', '.agents', 'skills', 'mesa-de-descoberta', 'SKILL.md'),
      'utf8'
    );
    assert.match(mesa, /Mapa Macro de Capacidades/i);
    assert.ok(
      mesa.includes('.agents/skills/planejar-proxima-fatia/SKILL.md'),
      'mesa-de-descoberta deve referenciar planejar-proxima-fatia/SKILL.md'
    );

    const ciclo = readFileSync(
      join(raiz, 'template', '.agents', 'skills', 'ciclo-especificacao', 'SKILL.md'),
      'utf8'
    );
    assert.ok(
      ciclo.includes('.agents/skills/planejar-proxima-fatia/SKILL.md'),
      'ciclo-especificacao deve acionar planejar-proxima-fatia/SKILL.md na fila vazia e após Gate 2'
    );
    assert.match(ciclo, /\/fatiar/);

    const constituicao = readFileSync(join(raiz, 'template', 'constitution.md'), 'utf8');
    assert.match(constituicao, /Mapa Macro de Capacidades/i);
    assert.match(constituicao, /Fatiamento Cirúrgico Just-in-Time/i);
    assert.match(constituicao, /planejar-proxima-fatia/);

    const templateAgents = readFileSync(join(raiz, 'template', 'AGENTS.md'), 'utf8');
    assert.ok(templateAgents.includes('planejar-proxima-fatia'));
    assert.ok(templateAgents.includes('/fatiar'));
    assert.ok(templateAgents.includes('/planejar-fatia'));

    const templateReadme = readFileSync(join(raiz, 'template', 'README.md.jinja'), 'utf8');
    assert.match(templateReadme, /Mapa Macro de Capacidades/i);
    assert.ok(templateReadme.includes('/fatiar'));

    const rootAgents = readFileSync(join(raiz, 'AGENTS.md'), 'utf8');
    assert.ok(rootAgents.includes('template/.agents/skills/planejar-proxima-fatia/SKILL.md'));
    assert.ok(rootAgents.includes('/fatiar'));

    const ci = readFileSync(join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.ok(
      ci.includes('.agents/skills/planejar-proxima-fatia/SKILL.md'),
      '.github/workflows/ci.yml deve validar .agents/skills/planejar-proxima-fatia/SKILL.md no job Copier'
    );
  });

  test('4_retrocompatibilidade_verificar_governanca_novo_layout_e_legado', () => {
    const repoNovo = criarRepoTemporarioParaRoadmap();
    try {
      writeFileSync(
        join(repoNovo.dir, 'openspec', 'roadmap.md'),
        [
          '# Roadmap Incremental — Projeto Novo',
          '',
          '## 1. Invariantes Globais do Gate 0',
          '| Invariante | Decisão Arquitetural | Impacto nas Fatias |',
          '|---|---|---|',
          '| **Multi-tenancy** | `organizacao_id` em todas as tabelas | Filtro obrigatório |',
          '',
          '## 2. Mapa Macro de Capacidades',
          '| Capacidade / Domínio | Fonte (Livro / Projeto) | Depende de | Status |',
          '|---|---|---|---|',
          '| Autenticação e Tenant | `docs/conhecimento/01-auth.md` | Nenhuma | Em fila |',
          '',
          '## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)',
          '',
          '### [ ] fatia-01-fundacao',
          '- **Depende de:** Nenhuma',
          '- **Objetivo de Valor:** Subir base tipada e banco relacional.',
          '- **Entidades/Contratos Tocados:** Organizacao, Usuario.',
          '- **O que ENTRA:**',
          '  - Setup inicial e migração base',
          '- **O que FICA DE FORA:**',
          '  - Faturamento e webhooks externos',
        ].join('\n'),
        'utf8'
      );
      execSync('git add openspec/roadmap.md', { cwd: repoNovo.dir, stdio: 'ignore' });
      const saida = repoNovo.auditarStaged();
      assert.match(saida, /SUCESSO/i);
    } finally {
      repoNovo.limpar();
    }

    const repoLegado = criarRepoTemporarioParaRoadmap();
    try {
      writeFileSync(
        join(repoLegado.dir, 'openspec', 'roadmap.md'),
        [
          '# Roadmap Incremental — Projeto Legado',
          '',
          '## 1. Invariantes Globais do Gate 0',
          '- Multi-tenancy por `organizacao_id`.',
          '',
          '## 2. Fila de Fatias Incrementais (Rolling Wave)',
          '',
          '### [x] fatia-01-fundacao',
          '- **Depende de:** Nenhuma',
          '- **Objetivo de Valor:** Base inicial.',
          '- **O que ENTRA:**',
          '  - Banco e layout',
          '- **O que FICA DE FORA:**',
          '  - Módulos de negócio',
          '',
          '### [ ] fatia-02-pedidos',
          '- **Depende de:** fatia-01-fundacao',
          '- **Objetivo de Valor:** Cadastro de pedidos.',
          '- **O que ENTRA:**',
          '  - Rota e formulário de pedido',
          '- **O que FICA DE FORA:**',
          '  - Emissão de nota fiscal',
        ].join('\n'),
        'utf8'
      );
      execSync('git add openspec/roadmap.md', { cwd: repoLegado.dir, stdio: 'ignore' });
      const saida = repoLegado.auditarStaged();
      assert.match(saida, /SUCESSO/i);
    } finally {
      repoLegado.limpar();
    }
  });

  test('5_sincronia_semver_4_2_0_e_decisao_d44', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.match(pkg.version, /^4\.[2-9]\.\d+$/, 'package.json deve estar em 4.2.0+');

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.match(changelog, /4\.2\.0/);
    assert.match(changelog, /## \[4\.2\.0\]/);

    const templateAgents = readFileSync(join(raiz, 'template', 'AGENTS.md'), 'utf8');
    assert.ok(templateAgents.includes(`governanca:inicio v${pkg.version}`));

    const constituicao = readFileSync(join(raiz, 'template', 'constitution.md'), 'utf8');
    assert.ok(constituicao.includes(`governanca:inicio v${pkg.version}`));

    const projectJinja = readFileSync(
      join(raiz, 'template', 'openspec', 'project.md.jinja'),
      'utf8'
    );
    assert.ok(projectJinja.includes(`Governança v${pkg.version}`));

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D44\s*\|/);
    assert.match(decisoes, /D1.*D4[4-9]/);
  });
});
