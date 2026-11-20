import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ehArquivoDeProducao,
  ehArquivoDeDocumentacaoOuGovernanca,
} from '../template/scripts/lib/classificar-arquivos.mjs';

const raiz = process.cwd();

describe('Auto-Governança da Matriz (Dogfooding em Fonte Única — Fatia 13)', () => {
  test('classificacao_refinada_template_trata_scripts_como_producao', () => {
    assert.equal(ehArquivoDeProducao('template/scripts/verificar-governanca.mjs'), true);
    assert.equal(ehArquivoDeProducao('template/scripts/lib/classificar-arquivos.mjs'), true);
    assert.equal(ehArquivoDeProducao('template/email.ts'), true);

    assert.equal(ehArquivoDeProducao('template/AGENTS.md'), false);
    assert.equal(ehArquivoDeProducao('template/.agents/rules/web-ui-pwa.md.jinja'), false);

    assert.equal(ehArquivoDeDocumentacaoOuGovernanca('template/AGENTS.md'), true);
    assert.equal(ehArquivoDeDocumentacaoOuGovernanca('template/scripts/verificar-governanca.mjs'), false);
    assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/verificar-governanca.mjs'), true);
  });

  test('raiz_universal_em_fonte_unica_sem_duplicacao_nem_wrappers', () => {
    const obrigatorios = [
      'AGENTS.md',
      '.agents/hooks.json',
      '.agents/rules/linear-mcp.md',
      '.agents/rules/matriz-governanca.md',
      'docs/arquitetura.md',
      'docs/particularidades.md',
      'docs/runbook.md',
      'docs/aprendizados.md',
    ];
    for (const rel of obrigatorios) {
      assert.ok(existsSync(join(raiz, rel)), `Arquivo obrigatório ausente na raiz: '${rel}'`);
    }

    const proibidosOuDuplicados = [
      '.claude',
      '.cursor',
      'CLAUDE.md',
      'GEMINI.md',
      '.agents/skills',
      'docs/catalogo-reuso.md',
      'docs/adr',
    ];
    for (const rel of proibidosOuDuplicados) {
      assert.strictEqual(
        existsSync(join(raiz, rel)),
        false,
        `Diretório/arquivo proibido ou duplicado não deve existir na raiz: '${rel}'`
      );
    }

    const agents = readFileSync(join(raiz, 'AGENTS.md'), 'utf8');
    assert.ok(agents.includes('template/constitution.md'), 'AGENTS.md deve referenciar template/constitution.md');
    assert.ok(agents.includes('## Comandos do Projeto'), 'AGENTS.md deve conter seção ## Comandos do Projeto');
    assert.ok(agents.includes('template/.agents/skills/'), 'AGENTS.md deve referenciar skills em template/.agents/skills/');
    for (const doc of ['docs/arquitetura.md', 'docs/particularidades.md', 'docs/runbook.md', 'docs/aprendizados.md']) {
      assert.ok(agents.includes(doc), `AGENTS.md deve referenciar '${doc}'`);
    }

    const gitignore = readFileSync(join(raiz, '.gitignore'), 'utf8');
    assert.ok(gitignore.includes('.agents/handoff.md'), '.gitignore da raiz deve ignorar .agents/handoff.md');

    const openspecConfig = readFileSync(join(raiz, 'openspec', 'config.yaml'), 'utf8');
    assert.doesNotMatch(openspecConfig, /location\.reload/i, 'openspec/config.yaml da matriz não deve conter regras de UI web');
    assert.doesNotMatch(openspecConfig, /mobile-first/i, 'openspec/config.yaml da matriz não deve conter mobile-first');
  });

  test('hooks_raiz_executam_hook_agente_do_template', () => {
    const caminhoHooks = join(raiz, '.agents', 'hooks.json');
    assert.ok(existsSync(caminhoHooks), '.agents/hooks.json da raiz deve existir');

    const conteudoHooks = readFileSync(caminhoHooks, 'utf8');
    assert.match(
      conteudoHooks,
      /\.\.\/template\/scripts\/hook-agente\.mjs/,
      '.agents/hooks.json da raiz deve acionar ../template/scripts/hook-agente.mjs'
    );

    const dirAgents = join(raiz, '.agents');

    const stdoutSession = execSync('node ../template/scripts/hook-agente.mjs session-start', {
      cwd: dirAgents,
      input: JSON.stringify({ conversationId: 'teste-raiz-dogfooding' }),
      encoding: 'utf8',
    });
    const resSession = JSON.parse(stdoutSession.trim());
    assert.ok(Array.isArray(resSession.injectSteps), 'session-start deve retornar injectSteps');
    assert.ok(
      typeof resSession.injectSteps[0]?.systemMessage?.systemMessage === 'string' &&
        resSession.injectSteps[0].systemMessage.systemMessage.length > 0,
      'session-start deve retornar systemMessage não vazia'
    );

    const payloadNoVerify = {
      toolCall: {
        name: 'run_command',
        args: { CommandLine: 'git commit -m "chore: teste" --no-verify' },
      },
    };
    const stdoutPreTool = execSync('node ../template/scripts/hook-agente.mjs pre-tool', {
      cwd: dirAgents,
      input: JSON.stringify(payloadNoVerify),
      encoding: 'utf8',
    });
    const resPreTool = JSON.parse(stdoutPreTool.trim());
    assert.equal(resPreTool.decision, 'deny', 'pre-tool da raiz deve bloquear --no-verify com deny');
  });

  test('integridade_referencial_raiz_agents_e_mapa_fisico', () => {
    const caminhoAgents = join(raiz, 'AGENTS.md');
    const caminhoArq = join(raiz, 'docs', 'arquitetura.md');
    assert.ok(existsSync(caminhoAgents), 'AGENTS.md da raiz deve existir');
    assert.ok(existsSync(caminhoArq), 'docs/arquitetura.md da raiz deve existir');

    const agents = readFileSync(caminhoAgents, 'utf8');
    const regexRefs = /(?<![a-zA-Z0-9_./-])((?:template\/constitution\.md|template\/\.agents\/skills\/[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*|docs\/[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*|\.agents\/(?:rules\/[a-zA-Z0-9_.-]+|hooks\.json)))/g;

    for (const m of agents.matchAll(regexRefs)) {
      const ref = m[1].replace(/[.,;:)]+$/, '');
      if (ref === '.agents/handoff.md' || ref.includes('<') || ref.includes('*')) continue;
      assert.ok(existsSync(join(raiz, ref)), `Referência quebrada em AGENTS.md da raiz: '${ref}' não existe no disco`);
    }

    const arq = readFileSync(caminhoArq, 'utf8');
    assert.ok(arq.includes('## 5. Mapa Físico de Módulos'), 'docs/arquitetura.md deve conter Seção 5 Mapa Físico de Módulos');

    const linhas = arq.split('\n');
    let dentroSecao = false;
    const secaoMapa = [];
    for (const linha of linhas) {
      if (/^##\s+5\.\s+Mapa F[ií]sico/i.test(linha.trim())) {
        dentroSecao = true;
        secaoMapa.push(linha);
        continue;
      }
      if (dentroSecao && /^##\s+/.test(linha.trim())) break;
      if (dentroSecao) secaoMapa.push(linha);
    }

    let ponteirosVerificados = 0;
    for (const linha of secaoMapa) {
      const limpa = linha.trim();
      if (!limpa.startsWith('|') || !limpa.includes('`') || /^\|[\s:-]+\|$/.test(limpa)) continue;
      for (const m of limpa.matchAll(/`([^`]+)`/g)) {
        const caminho = m[1].trim();
        if (!(caminho.includes('.') || caminho.includes('/'))) continue;
        if (/[\s*<>{}()]/.test(caminho) || caminho.startsWith('Ex.:')) continue;
        assert.ok(existsSync(join(raiz, caminho)), `Ponteiro quebrado em docs/arquitetura.md §5: '${caminho}' não existe`);
        ponteirosVerificados++;
      }
    }
    assert.ok(ponteirosVerificados >= 5, 'docs/arquitetura.md §5 deve mapear pelo menos 5 módulos reais da matriz');
  });

  test('enforcement_deterministico_raiz_lefthook_ci_e_env_harness', () => {
    const lefthook = readFileSync(join(raiz, 'lefthook.yml'), 'utf8');
    const blocoPreCommit = lefthook.split('commit-msg:')[0];
    assert.match(blocoPreCommit, /verificar-governanca\.mjs/, 'lefthook.yml pre-commit deve rodar verificar-governanca.mjs');
    assert.match(blocoPreCommit, /classificar-arquivos\.mjs/, 'lefthook.yml pre-commit deve checar sintaxe de classificar-arquivos.mjs');
    assert.match(blocoPreCommit, /classificar-cerimonia\.mjs/, 'lefthook.yml pre-commit deve checar sintaxe de classificar-cerimonia.mjs');

    const ci = readFileSync(join(raiz, '.github', 'workflows', 'ci.yml'), 'utf8');
    assert.match(ci, /fetch-depth:\s*2/, '.github/workflows/ci.yml deve usar fetch-depth: 2 para diff CI');
    assert.match(ci, /verificar-governanca\.mjs\s+--ci/, '.github/workflows/ci.yml deve rodar verificar-governanca.mjs --ci');
    assert.match(ci, /classificar-arquivos\.mjs/, '.github/workflows/ci.yml deve checar sintaxe de classificar-arquivos.mjs');
    assert.match(ci, /classificar-cerimonia\.mjs/, '.github/workflows/ci.yml deve checar sintaxe de classificar-cerimonia.mjs');
    assert.match(ci, /docs\/runbook\.md/, '.github/workflows/ci.yml deve validar docs/runbook.md no job Copier');
    assert.match(ci, /auditoria-seguranca\/SKILL\.md/, '.github/workflows/ci.yml deve validar auditoria-seguranca/SKILL.md no job Copier');

    const verificador = readFileSync(join(raiz, 'template', 'scripts', 'verificar-governanca.mjs'), 'utf8');
    assert.match(verificador, /CLAUDE_PROJECT_DIR/, "verificar-governanca.mjs deve ignorar 'CLAUDE_PROJECT_DIR' em variaveisIgnoradas");
  });
});
