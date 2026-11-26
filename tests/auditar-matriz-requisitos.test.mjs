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

const raiz = process.cwd();
const dirTemplateScripts = join(raiz, 'template', 'scripts');

function copiarRecursivo(origem, destino) {
  mkdirSync(destino, { recursive: true });
  for (const entrada of readdirSync(origem, { withFileTypes: true })) {
    const camOrigem = join(origem, entrada.name);
    const camDestino = join(destino, entrada.name);
    if (entrada.isDirectory()) {
      copiarRecursivo(camOrigem, camDestino);
    } else {
      copyFileSync(camOrigem, camDestino);
    }
  }
}

function criarRepoTemporario(comMatrizBase = true) {
  const dir = join(
    tmpdir(),
    `test-matriz-req-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  copiarRecursivo(dirTemplateScripts, join(dir, 'scripts'));
  mkdirSync(join(dir, 'docs', 'conhecimento'), { recursive: true });
  mkdirSync(join(dir, 'openspec', 'specs', 'auth'), { recursive: true });
  mkdirSync(join(dir, 'tests'), { recursive: true });

  writeFileSync(
    join(dir, 'docs', 'conhecimento', '01-visao.md'),
    '# 01 — Visão\nRegras de autenticação e agenda.\n',
    'utf8'
  );
  writeFileSync(
    join(dir, 'openspec', 'specs', 'auth', 'spec.md'),
    '# Spec Auth\n## ADDED Requirements\n### Requirement: Login\n#### Scenario: Sucesso\nWHEN login\nTHEN ok\n',
    'utf8'
  );
  writeFileSync(
    join(dir, 'tests', 'auth.test.ts'),
    'import { expect } from "vitest";\nexpect(true).toBe(true);\n',
    'utf8'
  );
  writeFileSync(
    join(dir, 'CHANGELOG.md'),
    '# Changelog\n## [Não publicado]\n### Adicionado\n- Base\n',
    'utf8'
  );
  writeFileSync(
    join(dir, 'openspec', 'roadmap.md'),
    `# Roadmap
## 1. Invariantes Globais do Gate 0
| Invariante | Decisão | Impacto |
|---|---|---|
| auth | jwt | seguranca |

## 2. Mapa Macro de Capacidades
| Capacidade | Fonte | Depende de | Status |
|---|---|---|---|
| Auth | docs/conhecimento/01-visao.md | Nenhuma | Em andamento |

## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)
### [ ] fatia-04-teste
- **Depende de:** Nenhuma
- **Objetivo de Valor:** Testar entregas
- **O que ENTRA:**
  - Fluxo de login
- **O que FICA DE FORA:**
  - Relatórios
`,
    'utf8'
  );

  if (comMatrizBase) {
    writeFileSync(
      join(dir, 'openspec', 'matriz-requisitos.md'),
      `# Matriz de Rastreabilidade End-to-End

## 1. Requisitos Rastreados

| ID | Requisito (1 frase objetiva) | Fonte (Livro / Decisão) | Capacidade / Fatia | Status | Prova Real (Spec / Teste) |
|---|---|---|---|---|---|
| \`REQ-01\` | Login com e-mail e senha | \`docs/conhecimento/01-visao.md\` | \`fatia-01-auth\` | \`[x] Entregue\` | \`tests/auth.test.ts\` |
| \`REQ-02\` | Recuperação de senha por token | \`docs/conhecimento/01-visao.md\` | \`fatia-04-teste\` | \`[~] Em andamento\` | — |
| \`REQ-03\` | Exportação CSV mensal | \`docs/conhecimento/01-visao.md\` | \`fatia-05-relatorios\` | \`[ ] Pendente\` | — |
| \`REQ-04\` | Login legado via XML | \`docs/conhecimento/01-visao.md\` | \`fatia-01-auth\` | \`[-] Descartado\` | Descartado pelo humano no Gate 0 |
`,
      'utf8'
    );
  }

  execSync('git add . && git commit -m "chore: base inicial"', { cwd: dir, stdio: 'ignore' });

  return {
    dir,
    limpar() {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {}
    },
    executarVerificador(args = '--staged') {
      try {
        const env = args.includes('--ci') ? process.env : { ...process.env, CI: 'false' };
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, {
          cwd: dir,
          env,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
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
    executarSessionStart(subcomando = 'session-start') {
      const stdout = execSync(`node scripts/hook-agente.mjs ${subcomando}`, {
        cwd: dir,
        input: JSON.stringify({ cwd: dir, conversationId: 'teste-matriz' }),
        encoding: 'utf8',
      });
      return JSON.parse(stdout);
    },
  };
}

describe('Fatia 17: Matriz de Rastreabilidade End-to-End (v4.3.0)', () => {
  test('1_retrocompatibilidade_sem_matriz_aprova_verificador_e_hook', () => {
    const repo = criarRepoTemporario(false);
    try {
      writeFileSync(join(repo.dir, 'docs', 'conhecimento', '01-visao.md'), '# 01 — Visão Atualizada\n', 'utf8');
      execSync('git add docs/conhecimento/01-visao.md', { cwd: repo.dir, stdio: 'ignore' });

      const resVerificador = repo.executarVerificador('--staged');
      assert.equal(resVerificador.exitCode, 0, `Sem matriz deve aprovar: ${resVerificador.stderr}`);

      const resHook = repo.executarSessionStart('session-start');
      const msg = resHook?.injectSteps?.[0]?.systemMessage?.systemMessage ?? '';
      assert.doesNotMatch(msg, /\[MATRIZ REQUISITOS\]/);
    } finally {
      repo.limpar();
    }
  });

  test('2_matriz_integra_passa_verde_sem_erros', () => {
    const repo = criarRepoTemporario(true);
    try {
      const atual = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        atual + '| `REQ-05` | Auditoria de acesso em spec | `openspec/specs/auth/spec.md` | `fatia-01-auth` | `[x] Entregue` | `openspec/specs/auth/spec.md` |\n',
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });

      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 0, `Matriz íntegra deveria aprovar: ${res.stderr}`);
      assert.match(res.stdout, /SUCESSO/i);
    } finally {
      repo.limpar();
    }
  });

  test('3_bloqueia_placeholder_anti_preguica_na_matriz', () => {
    const repo = criarRepoTemporario(true);
    try {
      for (const marcador of ['TODO:', 'TBD:', '[preencher]']) {
        const atual = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');
        const comMarcador = atual.replace('Exportação CSV mensal', `Exportação CSV ${marcador}`);
        writeFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), comMarcador, 'utf8');
        execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });

        const res = repo.executarVerificador('--staged');
        assert.equal(res.exitCode, 1, `Placeholder '${marcador}' deve bloquear`);
        assert.match(res.stderr + res.stdout, /preguiça|placeholder|REQ|matriz/i);
        execSync('git checkout -- openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });
      }
    } finally {
      repo.limpar();
    }
  });

  test('4_bloqueia_id_invalido_ou_duplicado_na_matriz', () => {
    const repo = criarRepoTemporario(true);
    try {
      const base = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');

      // ID duplicado
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        base + '| `REQ-01` | Requisito duplicado | `docs/conhecimento/01-visao.md` | `fatia-05` | `[ ] Pendente` | — |\n',
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });
      const resDup = repo.executarVerificador('--staged');
      assert.equal(resDup.exitCode, 1, 'ID duplicado REQ-01 deve bloquear');
      assert.match(resDup.stderr + resDup.stdout, /duplicad|REQ-01/i);

      // ID fora do padrão
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        base + '| `REQ-A` | Requisito com ID inválido | `docs/conhecimento/01-visao.md` | `fatia-05` | `[ ] Pendente` | — |\n',
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });
      const resInvalido = repo.executarVerificador('--staged');
      assert.equal(resInvalido.exitCode, 1, 'ID inválido REQ-A deve bloquear');
      assert.match(resInvalido.stderr + resInvalido.stdout, /REQ-A|padrão|ID/i);
    } finally {
      repo.limpar();
    }
  });

  test('5_bloqueia_status_fora_dos_4_marcadores_canonicos', () => {
    const repo = criarRepoTemporario(true);
    try {
      const base = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        base.replace('`[ ] Pendente`', '`[?] Em dúvida`'),
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });

      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 1, 'Status fora dos 4 canônicos deve bloquear');
      assert.match(res.stderr + res.stdout, /Status|canônico/i);
    } finally {
      repo.limpar();
    }
  });

  test('6_sensor_anti_apodrecimento_na_coluna_fonte', () => {
    const repo = criarRepoTemporario(true);
    try {
      const base = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        base.replace('`docs/conhecimento/01-visao.md`', '`docs/conhecimento/99-inexistente.md`'),
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });

      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 1, 'Fonte inexistente em docs/ deve bloquear');
      assert.match(res.stderr + res.stdout, /99-inexistente\.md|Fonte|inexistente/i);
    } finally {
      repo.limpar();
    }
  });

  test('7_regra_anti_teatro_bloqueia_entregue_sem_prova_ou_prova_inexistente', () => {
    const repo = criarRepoTemporario(true);
    try {
      const base = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');

      // 7a: [x] Entregue sem caminho entre crases
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        base.replace('`tests/auth.test.ts`', 'Testado manualmente'),
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });
      const resSemProva = repo.executarVerificador('--staged');
      assert.equal(resSemProva.exitCode, 1, '[x] Entregue sem caminho entre crases deve bloquear');
      assert.match(resSemProva.stderr + resSemProva.stdout, /Prova Real|Entregue/i);

      // 7b: [x] Entregue apontando para arquivo inexistente no disco
      writeFileSync(
        join(repo.dir, 'openspec', 'matriz-requisitos.md'),
        base.replace('`tests/auth.test.ts`', '`tests/fantasma.test.ts`'),
        'utf8'
      );
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });
      const resProvaInexistente = repo.executarVerificador('--staged');
      assert.equal(resProvaInexistente.exitCode, 1, '[x] Entregue com arquivo inexistente deve bloquear');
      assert.match(resProvaInexistente.stderr + resProvaInexistente.stdout, /fantasma\.test\.ts|inexistente|não encontrado/i);
    } finally {
      repo.limpar();
    }
  });

  test('8_sensor_anti_apodrecimento_reverso_ao_remover_prova_real_sem_atualizar_matriz', () => {
    const repo = criarRepoTemporario(true);
    try {
      execSync('git rm tests/auth.test.ts', { cwd: repo.dir, stdio: 'ignore' });
      const res = repo.executarVerificador('--staged');
      assert.equal(res.exitCode, 1, 'Remover prova real citada na matriz sem atualizá-la deve bloquear');
      assert.match(res.stderr + res.stdout, /auth\.test\.ts|matriz-requisitos|removido|apodrec/i);
    } finally {
      repo.limpar();
    }
  });

  test('9_trava_archive_gate_2_bloqueia_requisito_em_andamento_da_fatia_arquivada', () => {
    const repo = criarRepoTemporario(true);
    try {
      const dirArchive = join(repo.dir, 'openspec', 'changes', 'archive', '2026-11-26-fatia-04-teste');
      mkdirSync(join(dirArchive, 'specs', 'auth'), { recursive: true });
      writeFileSync(
        join(dirArchive, 'proposal.md'),
        '## Por que\nTexto de proposta.\nL3\nL4\nL5\n## O que muda\nREQ-02.\nL8\nL9\n## Fica de Fora\nNada.\n',
        'utf8'
      );
      writeFileSync(
        join(dirArchive, 'design.md'),
        '## Contratos, Dados e Schemas\nOk\nL3\nL4\nL5\nL6\n## Interface e Estados Assíncronos\nNão se aplica: teste de cli.\nL9\nL10\nL11\nL12\n## Regras de Negócio e Segurança\nOk\nL15\nL16\nL17\nL18\n',
        'utf8'
      );
      writeFileSync(
        join(dirArchive, 'tasks.md'),
        '- [x] 1. Teste Vermelho\n- [x] 2. Implementacao\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10\n## Roteiro de Validação Prática\nRodar.\n## Notas de Sessão\nOk.\n',
        'utf8'
      );
      writeFileSync(
        join(dirArchive, 'specs', 'auth', 'spec.md'),
        '## ADDED Requirements\n### Requirement: Token\n#### Scenario: Recuperacao\nWHEN solicita\nTHEN envia\n',
        'utf8'
      );

      execSync('git add openspec/changes/archive', { cwd: repo.dir, stdio: 'ignore' });

      // REQ-02 ainda está [~] Em andamento para fatia-04-teste -> deve bloquear archive!
      const resBloqueado = repo.executarVerificador('--staged');
      assert.equal(resBloqueado.exitCode, 1, 'Archive com REQ-02 ainda [~] Em andamento deve bloquear');
      assert.match(resBloqueado.stderr + resBloqueado.stdout, /REQ-02|Em andamento|fatia-04-teste/i);

      // Atualiza REQ-02 para [x] Entregue com prova real -> deve aprovar!
      const base = readFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), 'utf8');
      const atualizada = base.replace(
        '| `REQ-02` | Recuperação de senha por token | `docs/conhecimento/01-visao.md` | `fatia-04-teste` | `[~] Em andamento` | — |',
        '| `REQ-02` | Recuperação de senha por token | `docs/conhecimento/01-visao.md` | `fatia-04-teste` | `[x] Entregue` | `tests/auth.test.ts` |'
      );
      writeFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), atualizada, 'utf8');
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });

      const resAprovado = repo.executarVerificador('--staged');
      assert.equal(resAprovado.exitCode, 0, `Archive após concluir REQ-02 deve aprovar: ${resAprovado.stderr}`);
    } finally {
      repo.limpar();
    }
  });

  test('10_telemetria_session_start_e_protecao_copier_update', () => {
    const repo = criarRepoTemporario(true);
    try {
      // Adiciona mudança ativa extensa para garantir que telemetria não é truncada
      const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-04-teste');
      mkdirSync(pastaDelta, { recursive: true });
      writeFileSync(
        join(pastaDelta, 'tasks.md'),
        '- [x] 1. Tarefa inicial concluida\n- [ ] 2. Implementar recuperacao de senha com envio de token temporario por email\n\n## Notas de Sessão\n- **Próximo passo:** Rodar testes de integracao completos\n',
        'utf8'
      );

      const resHook = repo.executarSessionStart('session-start');
      const msg = resHook?.injectSteps?.[0]?.systemMessage?.systemMessage ?? '';
      assert.match(
        msg,
        /\[MATRIZ REQUISITOS\] Total: 4 \| Entregues: 1 \| Em andamento: 1 \| Pendentes: 1 \| Descartados: 1/,
        `SessionStart deve exibir telemetria exata da matriz, recebido: ${msg}`
      );
      assert.ok(msg.length <= 600, `Mensagem de sessão deve respeitar teto de 600 chars (atual: ${msg.length})`);

      // Verifica também session-start-claude
      const resClaude = repo.executarSessionStart('session-start-claude');
      const ctxClaude = resClaude?.hookSpecificOutput?.additionalContext ?? '';
      assert.match(
        ctxClaude,
        /\[MATRIZ REQUISITOS\] Total: 4 \| Entregues: 1 \| Em andamento: 1 \| Pendentes: 1 \| Descartados: 1/
      );

      // Proteção Copier: template/openspec/matriz-requisitos.md.jinja e _skip_if_exists em copier.yml
      const copierYml = readFileSync(join(raiz, 'copier.yml'), 'utf8');
      assert.match(copierYml, /openspec\/matriz-requisitos\.md/, 'copier.yml deve proteger openspec/matriz-requisitos.md em _skip_if_exists');
      const caminhoTemplateMatriz = join(raiz, 'template', 'openspec', 'matriz-requisitos.md.jinja');
      assert.ok(existsSync(caminhoTemplateMatriz), 'template/openspec/matriz-requisitos.md.jinja deve existir');

      // Template renderizado em projeto recém-copiado deve passar verificar-governanca --staged sem falso positivo
      const matrizRenderizada = readFileSync(caminhoTemplateMatriz, 'utf8').replaceAll('{{ nome_do_projeto }}', 'projeto-copier');
      writeFileSync(join(repo.dir, 'openspec', 'matriz-requisitos.md'), matrizRenderizada, 'utf8');
      execSync('git add openspec/matriz-requisitos.md', { cwd: repo.dir, stdio: 'ignore' });
      const resTemplateLimpo = repo.executarVerificador('--staged');
      assert.equal(resTemplateLimpo.exitCode, 0, `Template matriz-requisitos.md recém-gerado deve passar sem erros: ${resTemplateLimpo.stderr}`);

      // Alinhamento normativo v4.3.0 (Constituição Artigo 12.6, AGENTS.md, 6 skills, D45, SemVer)
      const constituicao = readFileSync(join(raiz, 'template', 'constitution.md'), 'utf8');
      assert.match(constituicao, /governanca:inicio v4\.3\.0/);
      assert.match(constituicao, /Rastreabilidade Ponta-a-Ponta.*matriz-requisitos\.md/i);

      for (const skill of [
        'sintetizar-conhecimento',
        'planejar-proxima-fatia',
        'ciclo-especificacao',
        'refinar-ideia',
        'mesa-de-descoberta',
        'revisar-fatia',
      ]) {
        const conteudoSkill = readFileSync(join(raiz, 'template', '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
        assert.match(conteudoSkill, /matriz-requisitos\.md/, `Skill '${skill}' deve referenciar openspec/matriz-requisitos.md`);
      }

      const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
      assert.equal(pkg.version, '4.3.0', 'package.json deve estar em 4.3.0');
      const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
      assert.match(decisoes, /\|\s*D45\s*\|/);
    } finally {
      repo.limpar();
    }
  });
});
