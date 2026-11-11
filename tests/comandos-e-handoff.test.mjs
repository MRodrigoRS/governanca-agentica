import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dirTemplateScripts = join(process.cwd(), 'template', 'scripts');

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
  const dir = join(tmpdir(), `test-gov-handoff-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  const dirDestinoScripts = join(dir, 'scripts');
  copiarRecursivo(dirTemplateScripts, dirDestinoScripts);

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

test('deve_ter_comandos_universais_em_agents_md_apontando_para_skills_sem_wrappers_proprietarios', () => {
  const dirClaude = join(process.cwd(), 'template', '.claude', 'commands');
  const dirCopilot = join(process.cwd(), 'template', '.github', 'prompts');
  const dirCursor = join(process.cwd(), 'template', '.cursor', 'commands');

  // No Padrão Universal Puro, diretórios proprietários de comandos não devem existir
  assert.strictEqual(existsSync(dirClaude), false, 'template/.claude/commands não deve existir');
  assert.strictEqual(existsSync(dirCopilot), false, 'template/.github/prompts não deve existir');
  assert.strictEqual(existsSync(dirCursor), false, 'template/.cursor/commands não deve existir');

  // Tabela canônica de comandos em AGENTS.md apontando para skills reais em .agents/skills/
  const agentsPath = join(process.cwd(), 'template', 'AGENTS.md');
  const agentsContent = readFileSync(agentsPath, 'utf8');
  const comandosEsperados = [
    '/fix',
    '/proxima-fatia',
    '/retomar',
    '/revisar',
    '/auditar-reuso',
    '/grill-me',
    '/refinar',
    '/explorar',
    '/aprendizado',
    '/atualizar-governanca',
    '/linear-inbox'
  ];
  for (const cmd of comandosEsperados) {
    assert.ok(agentsContent.includes(cmd), `AGENTS.md deve listar o comando universal ${cmd}`);
  }

  const skillsEsperadas = [
    'ciclo-especificacao',
    'revisar-fatia',
    'reuso-e-modularizacao',
    'refinar-ideia',
    'explorar-produto',
    'atualizar-governanca',
    'inicializar-stack'
  ];
  for (const skill of skillsEsperadas) {
    const camSkill = join(process.cwd(), 'template', '.agents', 'skills', skill, 'SKILL.md');
    assert.ok(existsSync(camSkill), `Skill universal ${skill}/SKILL.md deve existir`);
  }
});

test('deve_injetar_progresso_e_proximo_passo_no_session_start', () => {
  const repo = criarRepoTemporario();
  try {
    const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-02-pagamentos');
    mkdirSync(pastaDelta, { recursive: true });

    const tasksContent = `# Tarefas
- [x] 1. Configurar gateway de teste
- [ ] 2. Implementar webhook de cobranca
- [ ] 3. Salvar pedido no banco

## Notas de Sessão
- **Decisões fora do plano:** nenhuma
- **Bloqueios abertos:** nenhum
- **Próximo passo:** Escrever teste de integracao para o webhook
`;
    writeFileSync(join(pastaDelta, 'tasks.md'), tasksContent, 'utf8');

    // Executa o hook-agente em modo session-start
    const cmdHook = `node scripts/hook-agente.mjs session-start`;
    const stdout = execSync(cmdHook, { cwd: repo.dir, encoding: 'utf8' });

    // Injeção de progresso e próximo passo
    assert.match(stdout, /1\/3/);
    assert.match(stdout, /webhook de cobranca/i);
    assert.match(stdout, /Escrever teste de integracao para o webhook/i);

    // Teto de 600 caracteres para não poluir contexto
    assert.ok(stdout.length <= 600, `Mensagem de contexto deve ter <= 600 caracteres (atual: ${stdout.length})`);
  } finally {
    repo.limpar();
  }
});

test('deve_bloquear_arquivamento_com_tarefas_abertas_sem_justificativa', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'openspec'), { recursive: true });
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Teste\n', 'utf8');
    writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), `# Roadmap
## 1. Invariantes Globais do Gate 0
| Invariante | Decisão | Impacto |
|---|---|---|
| id | uuid | chaves |

## 2. Fila de Fatias Incrementais (Rolling Wave)
### [ ] fatia-01-teste
- **Depende de:** nenhuma
- **Objetivo de Valor:** Teste
- **Entidades/Contratos Tocados:** teste
- **O que ENTRA:**
  - item 1
  - item 2
  - item 3
- **O que FICA DE FORA:**
  - nada
`, 'utf8');

    const pastaArchiveIncompleta = join(repo.dir, 'openspec', 'changes', 'archive', '2026-11-10-fatia-01-teste');
    mkdirSync(pastaArchiveIncompleta, { recursive: true });

    const tasksIncompletas = `# Tarefas
- [x] 1. Tarefa concluida
- [ ] 2. Tarefa pendente esquecida
`;
    writeFileSync(join(pastaArchiveIncompleta, 'tasks.md'), tasksIncompletas, 'utf8');
    writeFileSync(join(pastaArchiveIncompleta, 'proposal.md'), '# Proposta\n', 'utf8');

    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    // Deve falhar com exitCode 1 por causa da tarefa 2 esquecida
    const resultadoIncompleto = repo.executarVerificador('--staged');
    assert.equal(resultadoIncompleto.exitCode, 1, 'Deve recusar arquivamento com tarefas desmarcadas');
    assert.match(resultadoIncompleto.stdout + resultadoIncompleto.stderr, /tarefas pendentes/i);

    // Agora justifica a tarefa pendente com (adiada: ...)
    const tasksJustificadas = `# Tarefas
- [x] 1. Tarefa concluida
- [ ] 2. Tarefa pendente esquecida (adiada: sera implementada na fatia 03)
`;
    writeFileSync(join(pastaArchiveIncompleta, 'tasks.md'), tasksJustificadas, 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    const resultadoJustificado = repo.executarVerificador('--staged');
    assert.equal(resultadoJustificado.exitCode, 0, 'Deve aprovar arquivamento quando tarefas abertas sao justificadas');
  } finally {
    repo.limpar();
  }
});

test('deve_distribuir_template_de_pr_e_fluxo_git_condicional', () => {
  const prTemplatePath = join(process.cwd(), 'template', '.github', 'pull_request_template.md');
  const copierPath = join(process.cwd(), 'copier.yml');

  assert.ok(existsSync(prTemplatePath), 'template/.github/pull_request_template.md deve existir');
  const prContent = readFileSync(prTemplatePath, 'utf8');

  // Seções mandatórias do Gate 2 no PR template
  assert.match(prContent, /O que foi entregue/i);
  assert.match(prContent, /Parecer Factual de Conformidade|Duelo de Conformidade/i);
  assert.match(prContent, /Roteiro de Teste Prático/i);
  assert.match(prContent, /Evidências de Testes/i);
  assert.match(prContent, /Checklist de Integridade/i);

  // Pergunta fluxo_git no copier.yml
  const copierContent = readFileSync(copierPath, 'utf8');
  assert.match(copierContent, /fluxo_git:/);
  assert.match(copierContent, /trunk/);
  assert.match(copierContent, /branch-por-fatia/);
});
