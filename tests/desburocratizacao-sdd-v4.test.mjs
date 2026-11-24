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
  const dir = join(tmpdir(), `test-gov-v4-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  // Copia a pasta template/scripts inteira para scripts/
  const dirDestinoScripts = join(dir, 'scripts');
  copiarRecursivo(dirTemplateScripts, dirDestinoScripts);

  return {
    dir,
    limpar() {
      try { rmSync(dir, { recursive: true, force: true }); } catch {}
    },
    executarVerificador(args = '') {
      try {
        const env = args.includes('--ci') ? process.env : { ...process.env, CI: 'false' };
        const stdout = execSync(`node scripts/verificar-governanca.mjs ${args}`, { cwd: dir, env, encoding: 'utf8' });
        return { exitCode: 0, stdout };
      } catch (err) {
        return { exitCode: err.status ?? 1, stderr: err.stderr?.toString() ?? '', stdout: err.stdout?.toString() ?? '' };
      }
    },
    executarValidadorCommit(msg) {
      const msgFile = join(dir, '.git', 'COMMIT_EDITMSG');
      writeFileSync(msgFile, msg, 'utf8');
      try {
        const stdout = execSync(`node scripts/validar-commit-msg.mjs "${msgFile}"`, { cwd: dir, encoding: 'utf8' });
        return { exitCode: 0, stdout };
      } catch (err) {
        return { exitCode: err.status ?? 1, stderr: err.stderr?.toString() ?? '', stdout: err.stdout?.toString() ?? '' };
      }
    }
  };
}

test('deve_validar_vinculo_via_roadmap_md_e_exigir_pilares_por_cabecalho', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'openspec', 'changes', 'archive', '2026-10-01-fatia-01'), { recursive: true });
    writeFileSync(join(repo.dir, 'openspec', 'changes', 'archive', '2026-10-01-fatia-01', 'proposal.md'), '# Base\n', 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Pagamentos\n', 'utf8');
    writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), `# Roadmap
## 1. Invariantes Globais do Gate 0
| Invariante | Decisão | Impacto nas Fatias |
|---|---|---|
| multi-tenancy | organizacao_id em tabelas | isolamento |
| autenticacao | jwt com roles | seguranca |
| filas | redis com bullmq | background |
| entidades | pagamentos | core |
| ids | uuid v4 | chaves |

## 2. Fila de Fatias Incrementais (Rolling Wave)
### [ ] fatia-02-pagamentos
- **Depende de:** fatia-01-fundacao
- **Objetivo de Valor:** Integrar pagamentos com gateway
- **Entidades/Contratos Tocados:** pagamentos
- **O que ENTRA:**
  - Checkout transparente
  - Webhooks de cobranca
  - Conciliacao automatica
- **O que FICA DE FORA:**
  - Pix parcelado
`, 'utf8');

    const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-02-pagamentos');
    mkdirSync(join(pastaDelta, 'specs', 'pagamentos'), { recursive: true });

    // Proposal em PT-BR com >= 10 linhas úteis
    writeFileSync(join(pastaDelta, 'proposal.md'), `# Proposta Pagamentos
## Por que
Precisamos cobrar usuarios de forma automatizada.
Isso viabiliza monetizacao e receita recorrente.
Evita faturas manuais e inadimplencia.

## O que muda
Adiciona integracao com gateway.
Cria rota de webhook segura.
Persiste status de cobranca.

## Fica de Fora
Pix parcelado e boletos fisicos.
`, 'utf8');

    // Spec com Requirement e Scenario com WHEN e THEN
    writeFileSync(join(pastaDelta, 'specs', 'pagamentos', 'spec.md'), `# Spec Pagamentos
## ADDED Requirements
### Requirement: Processamento de Checkout
O sistema deve processar checkout com cartao.
#### Scenario: Cobranca com sucesso
- GIVEN cliente autenticado
- WHEN envia dados do cartao
- THEN debita valor e confirma
`, 'utf8');

    // Design com >= 18 linhas úteis e cabeçalhos obrigatórios
    writeFileSync(join(pastaDelta, 'design.md'), `# Design Pagamentos
## Contratos, Dados e Schemas
Tabela pagamentos com campos:
- id uuid
- valor integer
- status text
- criado_em timestamp

Schema Zod:
z.object({
  valor: z.number().int().positive(),
  tokenCartao: z.string().min(10)
})

## Interface e Estados Assíncronos
Estados:
- Loading: spinner discreto no botao
- Error: toast vermelho com mensagem amigavel
- Success: toast verde e redirecionamento
- Empty: listagem vazia amigavel

## Regras de Negócio e Segurança
- Validacao idempotente com chave de idempotencia
- Rejeita cartao expirado
- Protegido por rate limiting
`, 'utf8');

    // Tasks com Test-First e Roteiro de Validacao Pratica >= 12 linhas úteis
    writeFileSync(join(pastaDelta, 'tasks.md'), `# Tarefas Pagamentos
- [ ] 1. Test-First (Vermelho): teste de criacao de cobranca
- [ ] 2. Implementar rota de pagamento
- [ ] 3. Refatorar e validar verde
- [ ] 4. Validar tratamento de erros e timeouts
- [ ] 5. Conectar webhook com gateway
- [ ] 6. Testar idempotencia de requisicoes

## Roteiro de Validação Prática
1. Acessar tela de checkout em /pagamento
2. Preencher dados ficticios do cartao de teste
3. Observar spinner de loading e toast de sucesso
4. Verificar registro criado na tabela pagamentos
`, 'utf8');

    writeFileSync(join(repo.dir, 'pagamento.ts'), 'export const pagar = () => true;', 'utf8');
    writeFileSync(join(repo.dir, 'pagamento.test.ts'), 'import { expect } from "vitest"; expect(true).toBe(true);', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    // Cenário 1A: Deve aprovar com delta completo PT-BR
    const resAprovado = repo.executarVerificador();
    assert.equal(resAprovado.exitCode, 0, `Esperado exitCode 0, obteve: ${resAprovado.stderr}`);

    // Cenário 1B: Deve aprovar também com cabeçalhos nativos EN (Why / What Changes / Out of Scope)
    writeFileSync(join(pastaDelta, 'proposal.md'), `# Proposal
## Why
Automated billing integration is required.
Ensures revenue and subscription tracking.
Prevents manual invoice handling.

## What Changes
Adds gateway webhooks.
Stores payment status.
Validates credit card tokens.

## Out of Scope
Installments via Pix.
`, 'utf8');
    execSync('git add openspec/changes/fatia-02-pagamentos/proposal.md', { cwd: repo.dir, stdio: 'ignore' });
    const resEn = repo.executarVerificador();
    assert.equal(resEn.exitCode, 0, `Esperado exitCode 0 para EN, obteve: ${resEn.stderr}`);

    // Cenário 1C: design.md raso deve bloquear
    writeFileSync(join(pastaDelta, 'design.md'), '## Contratos\nRaso\n## Interface\nN/A\n## Regras\nN/A\n', 'utf8');
    execSync('git add openspec/changes/fatia-02-pagamentos/design.md', { cwd: repo.dir, stdio: 'ignore' });
    const resRaso = repo.executarVerificador();
    assert.equal(resRaso.exitCode, 1, 'Design raso deveria bloquear com exitCode 1');

    // Cenário 1D: fatia ausente de roadmap.md deve bloquear
    writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), '# Roadmap\n## 2. Fila\n### [ ] fatia-99-outra\n', 'utf8');
    execSync('git add openspec/roadmap.md', { cwd: repo.dir, stdio: 'ignore' });
    const resAusente = repo.executarVerificador();
    assert.equal(resAusente.exitCode, 1, 'Fatia ausente de roadmap.md deveria bloquear com exitCode 1');
  } finally {
    repo.limpar();
  }
});

test('deve_manter_regra_v3_para_fatia_legada_em_voo', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'openspec', 'roadmap'), { recursive: true });
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Legado\n', 'utf8');
    
    // Fatia legada v3 com as 7 seções e >= 25 linhas
    const linhasV3 = [
      '# Fatia 03: Legado',
      '## 1. Objetivo', 'Entrega base legada',
      '## 2. Grafo', 'Depende de nada',
      '## 3. Contratos', 'Dados legados',
      '## 4. Interface', 'Tela legada',
      '## 5. Regras', 'Regra legada',
      '## 6. Test-First', 'Teste legado',
      '## 7. Roteiro', 'Roteiro legado',
      ...Array(20).fill('Linha de detalhamento complementar da fatia legada.')
    ].join('\n');
    writeFileSync(join(repo.dir, 'openspec', 'roadmap', 'fatia-03-legado.md'), linhasV3, 'utf8');

    const pastaDelta = join(repo.dir, 'openspec', 'changes', 'fatia-03-legado');
    mkdirSync(pastaDelta, { recursive: true });
    writeFileSync(join(pastaDelta, 'proposal.md'), 'Proposta antiga com mais de 30 caracteres para teste de retrocompatibilidade v3.', 'utf8');
    writeFileSync(join(pastaDelta, 'design.md'), 'Design antigo com mais de 30 caracteres para teste de retrocompatibilidade v3.', 'utf8');
    writeFileSync(join(pastaDelta, 'tasks.md'), 'Tarefas antigas com mais de 30 caracteres para teste de retrocompatibilidade v3.', 'utf8');

    writeFileSync(join(repo.dir, 'legado.ts'), 'export const legado = 1;', 'utf8');
    writeFileSync(join(repo.dir, 'legado.test.ts'), 'import { expect } from "vitest"; expect(1).toBe(1);', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    const res = repo.executarVerificador();
    assert.equal(res.exitCode, 0, `Esperado aprovação v3, obteve: ${res.stderr}`);
  } finally {
    repo.limpar();
  }
});

test('deve_auditar_blocos_do_roadmap_md', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'openspec'), { recursive: true });
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');

    // Bloco incompleto sem FICA DE FORA
    writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), `# Roadmap
## 2. Fila
### [ ] fatia-01-incompleta
- **Depende de:** nada
- **Objetivo de Valor:** teste
- **O que ENTRA:** tudo
`, 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
    const resIncompleto = repo.executarVerificador();
    assert.equal(resIncompleto.exitCode, 1, 'Roadmap sem FICA DE FORA deve falhar');

    // Bloco com TBD ou TODO
    writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), `# Roadmap
## 2. Fila
### [ ] fatia-01-placeholder
- **Depende de:** nada
- **Objetivo de Valor:** teste
- **O que ENTRA:** TBD: definir depois
- **O que FICA DE FORA:** nada
`, 'utf8');
    execSync('git add openspec/roadmap.md', { cwd: repo.dir, stdio: 'ignore' });
    const resPlaceholder = repo.executarVerificador();
    assert.equal(resPlaceholder.exitCode, 1, 'Roadmap com TBD deve falhar');
  } finally {
    repo.limpar();
  }
});

test('deve_aprovar_via_1_5_somente_no_commit_msg_com_tipo_permitido', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'package.json'), JSON.stringify({ name: 'app', dependencies: { zod: '^3.22.0' } }, null, 2), 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
    writeFileSync(join(repo.dir, 'a.ts'), 'export const a = 1;', 'utf8');
    writeFileSync(join(repo.dir, 'b.ts'), 'export const b = 2;', 'utf8');
    writeFileSync(join(repo.dir, 'c.ts'), 'export const c = 3;', 'utf8');
    writeFileSync(join(repo.dir, 'd.ts'), 'export const d = 4;', 'utf8');
    writeFileSync(join(repo.dir, 'e.ts'), 'export const e = 5;', 'utf8');
    execSync('git add . && git commit -m "feat: commit inicial"', { cwd: repo.dir, stdio: 'ignore' });

    // Modifica 5 arquivos + bump de versao existente no package.json + CHANGELOG sob Modificado
    writeFileSync(join(repo.dir, 'package.json'), JSON.stringify({ name: 'app', dependencies: { zod: '^3.23.0' } }, null, 2), 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Modificado\n- Refatora utilitarios centrais\n', 'utf8');
    writeFileSync(join(repo.dir, 'a.ts'), 'export const a = 10;', 'utf8');
    writeFileSync(join(repo.dir, 'b.ts'), 'export const b = 20;', 'utf8');
    writeFileSync(join(repo.dir, 'c.ts'), 'export const c = 30;', 'utf8');
    writeFileSync(join(repo.dir, 'd.ts'), 'export const d = 40;', 'utf8');
    writeFileSync(join(repo.dir, 'e.ts'), 'export const e = 50;', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    // No pre-commit (verificar-governanca): não deve barrar Via 1.5 válida
    const resPreCommit = repo.executarVerificador();
    assert.equal(resPreCommit.exitCode, 0, `Pre-commit deveria adiar e aprovar Via 1.5, mas falhou: ${resPreCommit.stderr}`);

    // No commit-msg (validar-commit-msg): refactor é aprovado
    const resRefactor = repo.executarValidadorCommit('refactor(core): reorganiza modulos internos de utilitarios');
    assert.equal(resRefactor.exitCode, 0, `refactor na Via 1.5 deveria aprovar: ${resRefactor.stderr}`);

    // No commit-msg: chore é aprovado
    const resChore = repo.executarValidadorCommit('chore(deps): atualiza versao de dependencias existentes');
    assert.equal(resChore.exitCode, 0, `chore na Via 1.5 deveria aprovar: ${resChore.stderr}`);

    // No commit-msg: feat e fix são BLOQUEADOS na Via 1.5
    const resFeat = repo.executarValidadorCommit('feat(core): adiciona funcionalidade em 5 arquivos sem delta');
    assert.equal(resFeat.exitCode, 1, 'feat com >3 arquivos sem delta deve ser bloqueado');

    const resFix = repo.executarValidadorCommit('fix(core): corrige bug em multiplos modulos sem delta');
    assert.equal(resFix.exitCode, 1, 'fix com >3 arquivos sem delta deve ser bloqueado');
  } finally {
    repo.limpar();
  }
});

test('nao_deve_permitir_contrabando_de_pacote_novo_banco_ou_adicionado', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'package.json'), JSON.stringify({ name: 'app', dependencies: { zod: '^3.22.0' } }, null, 2), 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n', 'utf8');
    execSync('git add . && git commit -m "feat: commit inicial"', { cwd: repo.dir, stdio: 'ignore' });

    // 1. Pacote novo inédito (ex: axios)
    writeFileSync(join(repo.dir, 'package.json'), JSON.stringify({ name: 'app', dependencies: { zod: '^3.22.0', axios: '^1.0.0' } }, null, 2), 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Modificado\n- Teste\n', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
    const resPacoteNovo = repo.executarValidadorCommit('chore(deps): adiciona cliente http axios');
    assert.equal(resPacoteNovo.exitCode, 1, 'Pacote inedito deve bloquear Via 1.5');

    // 2. Schema de banco
    execSync('git reset --hard HEAD', { cwd: repo.dir, stdio: 'ignore' });
    writeFileSync(join(repo.dir, 'schema.prisma'), 'model Usuario { id Int @id }', 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Modificado\n- Teste\n', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
    const resBanco = repo.executarValidadorCommit('refactor(db): ajusta schema de usuarios');
    assert.equal(resBanco.exitCode, 1, 'Alteracao de banco deve bloquear Via 1.5');

    // 3. Linha adicionada sob ### Adicionado
    execSync('git reset --hard HEAD', { cwd: repo.dir, stdio: 'ignore' });
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Nova feature sem delta\n', 'utf8');
    writeFileSync(join(repo.dir, 'mod.ts'), 'export const x = 1;', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });
    const resChangelogAdicionado = repo.executarValidadorCommit('refactor(mod): refatora modulo adicionado');
    assert.equal(resChangelogAdicionado.exitCode, 1, 'Linha em ### Adicionado deve bloquear Via 1.5');
  } finally {
    repo.limpar();
  }
});

test('deve_bloquear_fix_sem_teste_e_style_com_logica', () => {
  const repo = criarRepoTemporario();
  try {
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Corrigido\n- Corrige frete\n', 'utf8');
    writeFileSync(join(repo.dir, 'frete.ts'), 'export const calcularFrete = () => 15;', 'utf8');
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    // fix com código de produção sem nenhum teste staged -> deve bloquear
    const resFixSemTeste = repo.executarValidadorCommit('fix(api): corrige arredondamento do valor de frete');
    assert.equal(resFixSemTeste.exitCode, 1, 'fix tocando producao sem arquivo de teste deve bloquear');

    // Adiciona arquivo de teste -> deve aprovar
    writeFileSync(join(repo.dir, 'frete.test.ts'), 'import { expect } from "vitest"; expect(15).toBe(15);', 'utf8');
    execSync('git add frete.test.ts', { cwd: repo.dir, stdio: 'ignore' });
    const resFixComTeste = repo.executarValidadorCommit('fix(api): corrige arredondamento do valor de frete');
    assert.equal(resFixComTeste.exitCode, 0, `fix com teste deve aprovar: ${resFixComTeste.stderr}`);

    // style estritamente visual -> deve aprovar
    writeFileSync(join(repo.dir, 'card.tsx'), 'export const Card = () => <div className="p-4 m-2 text-red-500">Card</div>;', 'utf8');
    writeFileSync(join(repo.dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Modificado\n- Ajusta layout do card\n', 'utf8');
    execSync('git add card.tsx CHANGELOG.md', { cwd: repo.dir, stdio: 'ignore' });
    const resStylePuro = repo.executarValidadorCommit('style(ui): ajusta espacamento e cor do card');
    assert.equal(resStylePuro.exitCode, 0, `style visual deve aprovar: ${resStylePuro.stderr}`);

    // style introduzindo lógica (if ou useState ou onClick) -> deve bloquear
    writeFileSync(join(repo.dir, 'card.tsx'), 'export const Card = () => { const [aberto, setAberto] = useState(false); return <button onClick={() => setAberto(!aberto)}>Card</button>; };', 'utf8');
    execSync('git add card.tsx', { cwd: repo.dir, stdio: 'ignore' });
    const resStyleContrabando = repo.executarValidadorCommit('style(ui): ajusta espacamento e cor do card');
    assert.equal(resStyleContrabando.exitCode, 1, 'style com useState e onClick deve bloquear');
  } finally {
    repo.limpar();
  }
});

test('deve_classificar_tests_na_raiz_e_scripts_do_projeto_corretamente', async () => {
  const { ehArquivoDeTeste, ehArquivoDeProducao, ehArquivoDeDocumentacaoOuGovernanca } = await import('../template/scripts/lib/classificar-arquivos.mjs');

  // Testes na raiz e subpastas
  assert.equal(ehArquivoDeTeste('tests/test_usuarios.py'), true);
  assert.equal(ehArquivoDeTeste('test/test_usuarios.py'), true);
  assert.equal(ehArquivoDeTeste('__tests__/usuario.test.ts'), true);
  assert.equal(ehArquivoDeTeste('app/test_util.py'), true);
  assert.equal(ehArquivoDeTeste('pkg/frete_test.py'), true);
  assert.equal(ehArquivoDeProducao('tests/test_usuarios.py'), false);
  assert.equal(ehArquivoDeProducao('app/test_util.py'), false);
  assert.equal(ehArquivoDeProducao('pkg/frete_test.py'), false);

  // Scripts de projeto são produção, não documentação
  assert.equal(ehArquivoDeProducao('scripts/seed.ts'), true);
  assert.equal(ehArquivoDeProducao('scripts/jogador.gd'), true);
  assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/seed.ts'), false);
  assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/jogador.gd'), false);

  // Apenas scripts da governança são documentação/governança
  assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/verificar-governanca.mjs'), true);
  assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/validar-commit-msg.mjs'), true);
  assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/hook-agente.mjs'), true);
  assert.equal(ehArquivoDeDocumentacaoOuGovernanca('scripts/lib/classificar-arquivos.mjs'), true);
  assert.equal(ehArquivoDeProducao('scripts/verificar-governanca.mjs'), false);
});

test('deve_preservar_constituicao_com_tabela_de_re_mapeamento_e_cartao_de_invariantes', () => {
  const constPath = join(process.cwd(), 'template', 'constitution.md');
  const agentsPath = join(process.cwd(), 'template', 'AGENTS.md');
  const projectPath = join(process.cwd(), 'template', 'openspec', 'project.md.jinja');
  const hookPath = join(process.cwd(), 'template', 'scripts', 'hook-agente.mjs');

  const constContent = readFileSync(constPath, 'utf8');
  const agentsContent = readFileSync(agentsPath, 'utf8');
  const projectContent = readFileSync(projectPath, 'utf8');
  const hookContent = readFileSync(hookPath, 'utf8');

  // 13 Artigos preservados
  for (let i = 1; i <= 13; i++) {
    assert.match(constContent, new RegExp(`## Artigo ${i} —`));
  }

  // Exemplos preservados
  assert.match(constContent, /obterUsuario/);
  assert.match(constContent, /salvarPedido/);
  assert.match(constContent, /44x44/);
  assert.match(constContent, /Escape/);
  assert.match(constContent, /whoami/);
  assert.match(constContent, /location\.reload/);
  assert.match(constContent, /ACID/);

  // Sem menção ao _template-fatia.md
  assert.doesNotMatch(constContent, /_template-fatia\.md/);

  // Cartão de invariantes em AGENTS.md de no máximo 15 linhas
  assert.match(agentsContent, /Cartão de Invariantes|Invariantes Centrais/i);

  // project.md.jinja sem tabela de fatias
  assert.doesNotMatch(projectContent, /\| Ordem \| Status \| Fatia \|/);

    // hook-agente.mjs preserva force_ask
    assert.match(hookContent, /force_ask/);
  });

test('deve_aprovar_commit_de_fundacao_marco_1_mesmo_com_historico_previo_e_package_inedito', () => {
  const repo = criarRepoTemporario();
  try {
    // 1. Simula commit inicial prévio (ex.: instalação do template Copier antes do scaffolding)
    mkdirSync(join(repo.dir, 'openspec'), { recursive: true });
    writeFileSync(join(repo.dir, 'AGENTS.md'), '# Instrucoes\n', 'utf8');
    writeFileSync(join(repo.dir, 'openspec', 'config.yaml'), 'schema: spec-driven\n', 'utf8');
    writeFileSync(join(repo.dir, 'openspec', 'project.md'), '# Projeto\n', 'utf8');
    writeFileSync(join(repo.dir, 'openspec', 'roadmap.md'), '# Roadmap\n', 'utf8');
    execSync('git add . && git commit -m "chore(governanca): aplica template inicial"', {
      cwd: repo.dir,
      stdio: 'ignore',
    });

    // 2. Simula scaffolding do Marco 1 (Next.js + package.json inédito + CHANGELOG ### Adicionado + roadmap)
    mkdirSync(join(repo.dir, 'src', 'app'), { recursive: true });
    writeFileSync(
      join(repo.dir, 'package.json'),
      JSON.stringify({ name: 'meu-app', dependencies: { next: '16.0.0', react: '19.0.0' } }, null, 2),
      'utf8'
    );
    writeFileSync(
      join(repo.dir, 'src', 'app', 'page.tsx'),
      'export default function PaginaInicial() { return <main>Inicio</main>; }\n',
      'utf8'
    );
    writeFileSync(
      join(repo.dir, 'CHANGELOG.md'),
      '# Changelog\n## [Não publicado]\n### Adicionado\n- Inicializacao do projeto Next.js e mapa de capacidades\n',
      'utf8'
    );
    writeFileSync(join(repo.dir, 'openspec', 'project.md'), '# Projeto\n## 1. Visão\nApp real.\n', 'utf8');
    writeFileSync(
      join(repo.dir, 'openspec', 'roadmap.md'),
      `# Roadmap
## 1. Invariantes Globais do Gate 0
| Invariante | Decisão | Impacto nas Fatias |
|---|---|---|
| auth | jwt | seguranca |

## 2. Mapa Macro de Capacidades
| Capacidade | Fonte | Depende de | Status |
|---|---|---|---|
| Fundacao | project.md | Nenhuma | Em fila |

## 3. Fila Executável de Fatias (Rolling Wave Cirúrgico)
### [ ] fatia-01-fundacao
- **Depende de:** Nenhuma
- **Objetivo de Valor:** Base tipada
- **O que ENTRA:**
  - Configuracao inicial
- **O que FICA DE FORA:**
  - Regras de negocio futuras
`,
      'utf8'
    );
    execSync('git add .', { cwd: repo.dir, stdio: 'ignore' });

    // 3. pre-commit e commit-msg devem aprovar o Marco 1
    const resPreCommit = repo.executarVerificador('--staged');
    assert.equal(resPreCommit.exitCode, 0, `verificar-governanca deveria aprovar Marco 1: ${resPreCommit.stderr}`);

    const resCommitMsg = repo.executarValidadorCommit(
      'feat(fundacao): inicializa projeto com stack nextjs e mapa de capacidades'
    );
    assert.equal(resCommitMsg.exitCode, 0, `validar-commit-msg deveria aprovar Marco 1: ${resCommitMsg.stderr}`);

    // 4. Após existir archive/, não é mais Marco 1: package.json inédito com feat sem delta deve bloquear
    mkdirSync(join(repo.dir, 'openspec', 'changes', 'archive', '2026-11-24-fatia-01-fundacao'), { recursive: true });
    writeFileSync(
      join(repo.dir, 'openspec', 'changes', 'archive', '2026-11-24-fatia-01-fundacao', 'proposal.md'),
      '# Base\n',
      'utf8'
    );
    const resPosArchive = repo.executarValidadorCommit(
      'feat(fundacao): tenta adicionar dependencia sem delta apos archive'
    );
    assert.equal(resPosArchive.exitCode, 1, 'Após archive/, Marco 1 não se aplica e feat sem delta deve bloquear');
  } finally {
    repo.limpar();
  }
});
