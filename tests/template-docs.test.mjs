import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('template: documentos de particularidades e aprendizados', () => {
  const raiz = process.cwd();
  const caminhoParticularidades = path.join(raiz, 'template', 'docs', 'particularidades.md');
  const caminhoAprendizados = path.join(raiz, 'template', 'docs', 'aprendizados.md');
  const caminhoCopier = path.join(raiz, 'copier.yml');
  const caminhoAgents = path.join(raiz, 'template', 'AGENTS.md');

  test('template/docs/particularidades.md deve existir e conter as 4 seções temáticas', () => {
    assert.ok(fs.existsSync(caminhoParticularidades), 'Arquivo template/docs/particularidades.md deve existir');
    const conteudo = fs.readFileSync(caminhoParticularidades, 'utf8');

    assert.ok(conteudo.includes('## 1. Infraestrutura, Hospedagem e Planos'), 'Deve conter seção 1 de infraestrutura');
    assert.ok(conteudo.includes('## 2. Banco de Dados e Persistência'), 'Deve conter seção 2 de banco');
    assert.ok(conteudo.includes('## 3. Provedores Externos e Webhooks'), 'Deve conter seção 3 de provedores');
    assert.ok(conteudo.includes('## 4. Regras de Domínio Não-Óbvias'), 'Deve conter seção 4 de regras de domínio');
  });

  test('template/docs/aprendizados.md deve existir e conter a estrutura padrão de cicatrizes', () => {
    assert.ok(fs.existsSync(caminhoAprendizados), 'Arquivo template/docs/aprendizados.md deve existir');
    const conteudo = fs.readFileSync(caminhoAprendizados, 'utf8');

    assert.ok(conteudo.includes('### [AAAA-MM-DD / COD-XXX]'), 'Deve conter modelo de título de entrada com data/código');
    assert.ok(conteudo.includes('- **O que aconteceu:**'), 'Deve conter campo "O que aconteceu"');
    assert.ok(conteudo.includes('- **Causa raiz:**'), 'Deve conter campo "Causa raiz"');
    assert.ok(conteudo.includes('- **A armadilha mental:**'), 'Deve conter campo "A armadilha mental"');
    assert.ok(conteudo.includes('- **Regra inegociável decorrente:**'), 'Deve conter campo "Regra inegociável decorrente"');
  });

  test('copier.yml deve blindar docs/particularidades.md e docs/aprendizados.md em _skip_if_exists', () => {
    assert.ok(fs.existsSync(caminhoCopier), 'copier.yml deve existir');
    const conteudo = fs.readFileSync(caminhoCopier, 'utf8');

    assert.ok(
      conteudo.includes('"docs/particularidades.md"') || conteudo.includes('- docs/particularidades.md'),
      'copier.yml deve incluir docs/particularidades.md em _skip_if_exists'
    );
    assert.ok(
      conteudo.includes('"docs/aprendizados.md"') || conteudo.includes('- docs/aprendizados.md'),
      'copier.yml deve incluir docs/aprendizados.md em _skip_if_exists'
    );
  });

  test('template/AGENTS.md deve referenciar docs/particularidades.md e docs/aprendizados.md na Seção 6', () => {
    assert.ok(fs.existsSync(caminhoAgents), 'template/AGENTS.md deve existir');
    const conteudo = fs.readFileSync(caminhoAgents, 'utf8');

    assert.ok(conteudo.includes('docs/particularidades.md'), 'template/AGENTS.md deve citar docs/particularidades.md');
    assert.ok(conteudo.includes('docs/aprendizados.md'), 'template/AGENTS.md deve citar docs/aprendizados.md');
    assert.ok(conteudo.includes('docs/runbook.md'), 'template/AGENTS.md deve citar docs/runbook.md');
    assert.ok(conteudo.includes('.agents/handoff.md'), 'template/AGENTS.md deve citar .agents/handoff.md');
  });

  test('template/docs/runbook.md deve existir, conter as 5 seções operacionais e estar protegido no copier.yml', () => {
    const caminhoRunbook = path.join(raiz, 'template', 'docs', 'runbook.md');
    const caminhoReadme = path.join(raiz, 'template', 'README.md.jinja');
    assert.ok(fs.existsSync(caminhoRunbook), 'template/docs/runbook.md deve existir');

    const conteudo = fs.readFileSync(caminhoRunbook, 'utf8');
    assert.ok(conteudo.includes('## 1. Deploy e Publicação'), 'Deve conter seção 1 de deploy');
    assert.ok(conteudo.includes('## 2. Verificação Pós-Deploy'), 'Deve conter seção 2 de smoke check');
    assert.ok(conteudo.includes('## 3. Migrations e Rollback Seguro'), 'Deve conter seção 3 de migrations e rollback');
    assert.ok(conteudo.includes('## 4. Logs, Filas e Observabilidade'), 'Deve conter seção 4 de logs');
    assert.ok(conteudo.includes('## 5. Checklist de Pré-Release (Go-Live)'), 'Deve conter seção 5 de pré-release');

    const copier = fs.readFileSync(caminhoCopier, 'utf8');
    assert.ok(
      copier.includes('"docs/runbook.md"') || copier.includes('- docs/runbook.md'),
      'copier.yml deve incluir docs/runbook.md em _skip_if_exists'
    );

    const readme = fs.readFileSync(caminhoReadme, 'utf8');
    assert.ok(readme.includes('docs/runbook.md'), 'README.md.jinja deve indexar docs/runbook.md');
    assert.ok(readme.includes('constitution.md'), 'README.md.jinja deve indexar constitution.md');
    assert.ok(readme.includes('docs/catalogo-reuso.md'), 'README.md.jinja deve indexar docs/catalogo-reuso.md');
    assert.ok(readme.includes('openspec/radar-oportunidades.md'), 'README.md.jinja deve indexar radar-oportunidades.md');
  });

  test('integridade referencial bidirecional: zero docs/skills/rules órfãos e zero ponteiros mortos no template', () => {
    const dirTemplate = path.join(raiz, 'template');
    const agents = fs.readFileSync(caminhoAgents, 'utf8');
    const readme = fs.readFileSync(path.join(dirTemplate, 'README.md.jinja'), 'utf8');

    const existeNoTemplate = (relativo) => {
      const limpo = relativo.replace(/\/+$/, '');
      return (
        fs.existsSync(path.join(dirTemplate, limpo)) ||
        fs.existsSync(path.join(dirTemplate, `${limpo}.jinja`))
      );
    };

    // 1. Todo arquivo .md em template/docs/ deve estar referenciado em AGENTS.md e README.md.jinja
    const docsRaiz = fs
      .readdirSync(path.join(dirTemplate, 'docs'), { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => `docs/${e.name}`);

    for (const doc of docsRaiz) {
      assert.ok(agents.includes(doc), `Documento '${doc}' está órfão: precisa ser citado em template/AGENTS.md`);
      assert.ok(readme.includes(doc), `Documento '${doc}' está órfão no índice humano: precisa ser citado em template/README.md.jinja`);
    }

    // 2. Toda skill em template/.agents/skills/* deve ter SKILL.md e estar registrada em template/AGENTS.md
    const dirSkills = path.join(dirTemplate, '.agents', 'skills');
    const skills = fs
      .readdirSync(dirSkills, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    for (const skill of skills) {
      assert.ok(
        fs.existsSync(path.join(dirSkills, skill, 'SKILL.md')),
        `Skill '${skill}' não possui SKILL.md`
      );
      assert.ok(
        agents.includes(skill),
        `Skill '${skill}' está órfã: precisa ser listada em template/AGENTS.md`
      );
    }

    // 3. Toda rule em template/.agents/rules/* deve estar referenciada na Matriz de template/AGENTS.md
    const dirRules = path.join(dirTemplate, '.agents', 'rules');
    const rules = fs
      .readdirSync(dirRules, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => `.agents/rules/${e.name.replace(/\.jinja$/, '')}`);

    for (const rule of rules) {
      assert.ok(
        agents.includes(rule),
        `Regra '${rule}' está órfã: precisa ser listada na Matriz de template/AGENTS.md`
      );
    }

    // 4. Nenhum caminho estático de governança citado em AGENTS.md, README.md.jinja ou SKILL.md pode apontar para arquivo inexistente
    const arquivosFonte = [
      caminhoAgents,
      path.join(dirTemplate, 'README.md.jinja'),
      ...skills.map((s) => path.join(dirSkills, s, 'SKILL.md')),
    ];

    const caminhosDinamicosOuEfemeros = new Set([
      '.agents/handoff.md',
      '.agents/skills/grill-me',
    ]);

    const regexRefGovernanca = /(?<![a-zA-Z0-9_./-])((?:docs|openspec|\.agents\/(?:skills|rules|hooks\.json)|scripts)\/[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*)/g;

    for (const arq of arquivosFonte) {
      const conteudo = fs.readFileSync(arq, 'utf8');
      for (const m of conteudo.matchAll(regexRefGovernanca)) {
        const ref = m[1].replace(/[.,;:)]+$/, '');
        if (
          caminhosDinamicosOuEfemeros.has(ref) ||
          ref.includes('<') ||
          ref.includes('*') ||
          ref.startsWith('openspec/changes/') ||
          ref.startsWith('openspec/roadmap/')
        ) {
          continue;
        }
        assert.ok(
          existeNoTemplate(ref),
          `Referência quebrada em '${path.relative(raiz, arq)}': '${ref}' não existe em template/`
        );
      }
    }
  });

  test('docs/arquitetura.md deve conter Mapa Físico de Módulos (§5) e skills/gitignore devem estar sincronizados', () => {
    const caminhoArq = path.join(raiz, 'template', 'docs', 'arquitetura.md');
    const caminhoGitignore = path.join(raiz, 'template', '.gitignore');
    const caminhoBrownfield = path.join(raiz, 'template', '.agents', 'skills', 'mapear-brownfield', 'SKILL.md');
    const caminhoInit = path.join(raiz, 'template', '.agents', 'skills', 'inicializar-stack', 'SKILL.md');

    const arq = fs.readFileSync(caminhoArq, 'utf8');
    assert.ok(arq.includes('## 5. Mapa Físico de Módulos'), 'docs/arquitetura.md deve conter Seção 5 de Mapa Físico');

    const gitignore = fs.readFileSync(caminhoGitignore, 'utf8');
    assert.ok(gitignore.includes('.agents/handoff.md'), 'template/.gitignore deve ignorar .agents/handoff.md');

    const brownfield = fs.readFileSync(caminhoBrownfield, 'utf8');
    assert.ok(brownfield.includes('Mapa Físico de Módulos'), 'mapear-brownfield deve cobrir Mapa Físico de Módulos');
    assert.ok(brownfield.includes('docs/runbook.md'), 'mapear-brownfield deve cobrir docs/runbook.md');

    const init = fs.readFileSync(caminhoInit, 'utf8');
    assert.ok(init.includes('Mapa Físico de Módulos'), 'inicializar-stack deve cobrir Mapa Físico de Módulos');
    assert.ok(init.includes('docs/runbook.md'), 'inicializar-stack deve cobrir docs/runbook.md');
  });
});
