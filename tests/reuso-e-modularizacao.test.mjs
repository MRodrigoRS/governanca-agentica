import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  ehArquivoDeTeste,
  ehArquivoDeProducao,
} from '../template/scripts/lib/classificar-arquivos.mjs';

const dirTemplate = join(process.cwd(), 'template');
const dirTemplateScripts = join(dirTemplate, 'scripts');

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
  const dir = join(tmpdir(), `test-gov-reuso-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@exemplo.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Tester"', { cwd: dir, stdio: 'ignore' });

  const dirDestinoScripts = join(dir, 'scripts');
  copiarRecursivo(dirTemplateScripts, dirDestinoScripts);

  // Cria estrutura mínima de governança para que os testes foquem exclusivamente em reuso e anti-monólito
  writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n## [Não publicado]\n### Adicionado\n- Teste\n', 'utf8');
  mkdirSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'specs', 'teste'), { recursive: true });
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'proposal.md'), '## Por que\nTexto de teste para proposal com mais de dez linhas úteis.\nLinha 3\nLinha 4\nLinha 5\n## O que muda\nMudancas de teste.\nLinha 8\n## Fica de Fora\nFora do escopo de teste.\n', 'utf8');
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'design.md'), '## Contratos, Dados e Schemas\nContratos de teste.\nLinha 3\nLinha 4\nLinha 5\nLinha 6\n## Interface e Estados Assíncronos\nEstados de teste.\nLinha 9\nLinha 10\nLinha 11\nLinha 12\n## Regras de Negócio e Segurança\nRegras de teste.\nLinha 15\nLinha 16\nLinha 17\nLinha 18\nLinha 19\n', 'utf8');
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'tasks.md'), '- [ ] 1. Tarefa de teste (Vermelho)\n- [ ] 2. Tarefa de teste (Verde)\n- [ ] 3. Tarefa de teste (Refactor)\nLinha 4\nLinha 5\nLinha 6\nLinha 7\nLinha 8\nLinha 9\nLinha 10\n## Notas de Sessão\nNotas de teste.\n## Roteiro de Validação Prática\nRoteiro de teste.\n', 'utf8');
  writeFileSync(join(dir, 'openspec', 'changes', 'fatia-99-teste', 'specs', 'teste', 'spec.md'), '## ADDED Requirements\n### Requirement: Teste\n#### Scenario: Cenário de Teste\nWHEN teste for executado\nTHEN deve aprovar\n', 'utf8');

  mkdirSync(join(dir, 'openspec'), { recursive: true });
  writeFileSync(join(dir, 'openspec', 'roadmap.md'), `## 1. Invariantes Globais do Gate 0
| Invariante | Decisão | Impacto nas Fatias |
|---|---|---|
| auth | jwt | seguranca |
| db | postgres | dados |
| filas | redis | background |
| storage | s3 | assets |
| ids | uuid | chaves |

## 2. Fila de Fatias Incrementais (Rolling Wave)
### [~] fatia-99-teste
- **Depende de:** nenhuma
- **Objetivo de Valor:** Teste de reuso e monólito
- **O que ENTRA:**
  - Testes unitarios
- **O que FICA DE FORA:**
  - Outros modulos
`, 'utf8');

  execSync('git add .', { cwd: dir });
  execSync('git commit -m "chore: setup inicial da governanca"', { cwd: dir });

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
    }
  };
}

// Helper para gerar linhas de código válidas
function gerarLinhasCodigo(qtd, prefixo = 'const x = 1;') {
  return Array.from({ length: qtd }, (_, i) => `${prefixo} // linha ${i + 1}`).join('\n');
}

function tocarChangelog(dir) {
  const caminho = join(dir, 'CHANGELOG.md');
  const conteudoAtual = existsSync(caminho) ? readFileSync(caminho, 'utf8') : '# Changelog\n';
  writeFileSync(caminho, `${conteudoAtual}\n<!-- update ${Date.now()}-${Math.random()} -->\n`, 'utf8');
}

test('deve_bloquear_arquivo_novo_ou_que_cruza_350_linhas_uteis_em_tsx_e_gd', () => {
  const repo = criarRepoTemporario();
  try {
    // Caso A: Arquivo .tsx novo com 360 linhas úteis
    mkdirSync(join(repo.dir, 'src', 'painel'), { recursive: true });
    writeFileSync(join(repo.dir, 'src', 'painel', 'TelaGigante.tsx'), gerarLinhasCodigo(360), 'utf8');
    tocarChangelog(repo.dir);

    execSync('git add src/painel/TelaGigante.tsx CHANGELOG.md', { cwd: repo.dir });
    const resA = repo.executarVerificador('--staged');
    assert.strictEqual(resA.exitCode, 1, 'Arquivo novo com 360 linhas deve ser bloqueado');
    assert.match(resA.stderr + resA.stdout, /350/i);
    assert.match(resA.stderr + resA.stdout, /Artigo 14|monólito|linhas úteis/i);

    // Caso B: Arquivo .gd que cruza de 340 para 360 linhas úteis
    mkdirSync(join(repo.dir, 'scenes'), { recursive: true });
    const camGd = join(repo.dir, 'scenes', 'FasePrincipal.gd');
    writeFileSync(camGd, gerarLinhasCodigo(340, 'var velocidade = 10'), 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add scenes/FasePrincipal.gd CHANGELOG.md', { cwd: repo.dir });
    execSync('git commit -m "feat(fase): fase com 340 linhas"', { cwd: repo.dir });

    // Agora adiciona mais 20 linhas (indo para 360)
    writeFileSync(camGd, gerarLinhasCodigo(360, 'var velocidade = 10'), 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add scenes/FasePrincipal.gd CHANGELOG.md', { cwd: repo.dir });
    const resB = repo.executarVerificador('--staged');
    assert.strictEqual(resB.exitCode, 1, 'Arquivo .gd cruzando 350 linhas deve ser bloqueado');
  } finally {
    repo.limpar();
  }
});

test('deve_aplicar_catraca_em_arquivo_legado', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'src', 'legado'), { recursive: true });
    const camLegado = join(repo.dir, 'src', 'legado', 'ModuloGigante.ts');

    // Inicializa com 800 linhas no commit inicial
    writeFileSync(camLegado, gerarLinhasCodigo(800), 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/legado/ModuloGigante.ts CHANGELOG.md', { cwd: repo.dir });
    execSync('git commit -m "feat(legado): arquivo gigante legado"', { cwd: repo.dir });

    // Modificação que reduz para 790 linhas úteis -> deve passar
    writeFileSync(camLegado, gerarLinhasCodigo(790), 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/legado/ModuloGigante.ts CHANGELOG.md', { cwd: repo.dir });
    const resReducao = repo.executarVerificador('--staged');
    assert.strictEqual(resReducao.exitCode, 0, 'Redução de linhas em arquivo legado deve ser aprovada');

    // Modificação que mantém 800 linhas (altera apenas uma linha interna) -> deve passar
    writeFileSync(camLegado, gerarLinhasCodigo(800, 'const y = 2;'), 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/legado/ModuloGigante.ts CHANGELOG.md', { cwd: repo.dir });
    const resManutencao = repo.executarVerificador('--staged');
    assert.strictEqual(resManutencao.exitCode, 0, 'Manutenção exata do total de linhas deve ser aprovada');

    // Modificação que aumenta para 805 linhas -> deve bloquear (catraca)
    writeFileSync(camLegado, gerarLinhasCodigo(805), 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/legado/ModuloGigante.ts CHANGELOG.md', { cwd: repo.dir });
    const resAumento = repo.executarVerificador('--staged');
    assert.strictEqual(resAumento.exitCode, 1, 'Aumento de linhas em arquivo legado deve ser bloqueado pela catraca');
    assert.match(resAumento.stderr + resAumento.stdout, /catraca|800|805/i);
  } finally {
    repo.limpar();
  }
});

test('deve_isentar_comentarios_por_linguagem_components_ui_e_addons', () => {
  const repo = criarRepoTemporario();
  try {
    // 1. components/ui/ é isento (ex: shadcn)
    mkdirSync(join(repo.dir, 'src', 'components', 'ui'), { recursive: true });
    writeFileSync(join(repo.dir, 'src', 'components', 'ui', 'sidebar.tsx'), gerarLinhasCodigo(500), 'utf8');

    // 2. addons/ é isento (ex: Godot addons)
    mkdirSync(join(repo.dir, 'addons', 'gut'), { recursive: true });
    writeFileSync(join(repo.dir, 'addons', 'gut', 'gut.gd'), gerarLinhasCodigo(500, 'var x = 1'), 'utf8');

    // 3. Arquivo TS com 310 linhas de código e 100 linhas de comentários (total 410 linhas, mas 310 úteis)
    mkdirSync(join(repo.dir, 'src', 'dominio'), { recursive: true });
    const linhasComentarios = Array.from({ length: 100 }, () => '// Comentario informativo').join('\n');
    const codigoTs = `${gerarLinhasCodigo(310)}\n${linhasComentarios}`;
    writeFileSync(join(repo.dir, 'src', 'dominio', 'frete.ts'), codigoTs, 'utf8');
    tocarChangelog(repo.dir);

    execSync('git add src/components/ui/sidebar.tsx addons/gut/gut.gd src/dominio/frete.ts CHANGELOG.md', { cwd: repo.dir });
    const resIsentos = repo.executarVerificador('--staged');
    assert.strictEqual(resIsentos.exitCode, 0, 'Pastas isentas e comentários não devem estourar o teto');

    // 4. Arquivo Rust com 360 linhas incluindo 40 atributos #[derive] -> #[...] conta como código!
    mkdirSync(join(repo.dir, 'src', 'rust'), { recursive: true });
    const linhasRust = Array.from({ length: 40 }, () => '#[derive(Debug, Clone)]').join('\n');
    const codigoRust = `${gerarLinhasCodigo(320, 'fn calcular() {}')}\n${linhasRust}`;
    writeFileSync(join(repo.dir, 'src', 'rust', 'motor.rs'), codigoRust, 'utf8');
    tocarChangelog(repo.dir);

    execSync('git add src/rust/motor.rs CHANGELOG.md', { cwd: repo.dir });
    const resRust = repo.executarVerificador('--staged');
    assert.strictEqual(resRust.exitCode, 1, 'Atributos #[derive] em Rust devem contar como linhas úteis');
  } finally {
    repo.limpar();
  }
});

test('deve_rejeitar_valvula_vazia_e_aprovar_valvula_com_motivo_tecnico', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'src'), { recursive: true });
    const cam = join(repo.dir, 'src', 'parser.ts');

    // 370 linhas com marcador sem motivo ou muito curto (< 15 chars)
    const valvulaCurta = '// governanca:arquivo-extenso-justificado: curto\n';
    writeFileSync(cam, `${valvulaCurta}${gerarLinhasCodigo(370)}`, 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/parser.ts CHANGELOG.md', { cwd: repo.dir });
    const resCurta = repo.executarVerificador('--staged');
    assert.strictEqual(resCurta.exitCode, 1, 'Válvula com motivo < 15 caracteres deve ser rejeitada');

    // 370 linhas com motivo técnico de 15+ caracteres
    const valvulaValida = '// governanca:arquivo-extenso-justificado: parser binário indivisível com tabela contígua de estados\n';
    writeFileSync(cam, `${valvulaValida}${gerarLinhasCodigo(370)}`, 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/parser.ts CHANGELOG.md', { cwd: repo.dir });
    const resValida = repo.executarVerificador('--staged');
    assert.strictEqual(resValida.exitCode, 0, 'Válvula com justificativa técnica real deve ser aprovada');
  } finally {
    repo.limpar();
  }
});

test('deve_classificar_gdscript_como_producao_e_testes_gut_como_teste', () => {
  // scripts/jogador.gd é produção
  assert.strictEqual(ehArquivoDeProducao('scripts/jogador.gd'), true);
  assert.strictEqual(ehArquivoDeTeste('scripts/jogador.gd'), false);

  // tests/test_jogador.gd é teste
  assert.strictEqual(ehArquivoDeTeste('tests/test_jogador.gd'), true);
  assert.strictEqual(ehArquivoDeProducao('tests/test_jogador.gd'), false);

  // scenes/test_menu.gd é teste (GUT naming fora da pasta tests)
  assert.strictEqual(ehArquivoDeTeste('scenes/test_menu.gd'), true);
  assert.strictEqual(ehArquivoDeProducao('scenes/test_menu.gd'), false);

  // scenes/inimigo_test.gd é teste
  assert.strictEqual(ehArquivoDeTeste('scenes/inimigo_test.gd'), true);
  assert.strictEqual(ehArquivoDeProducao('scenes/inimigo_test.gd'), false);
});

test('deve_bloquear_catalogo_apodrecido', () => {
  const repo = criarRepoTemporario();
  try {
    mkdirSync(join(repo.dir, 'docs'), { recursive: true });
    mkdirSync(join(repo.dir, 'src', 'components'), { recursive: true });

    const camBotao = join(repo.dir, 'src', 'components', 'Botao.tsx');
    writeFileSync(camBotao, 'export const Botao = () => null;', 'utf8');

    const conteudoCatalogo = `# Catálogo de Reúso
## 1. Tokens Visuais e de Movimento
| Token | Arquivo Fonte | Valores | Regra |
|---|---|---|---|

## 2. Primitivos de UI e Layouts Compartilhados
| Componente | Caminho | Variantes | Quando Reutilizar |
|---|---|---|---|
| Botao | \`src/components/Botao.tsx\` | primario | Ações principais |

## 3. Prefabs, Cenas Componíveis e Assets Modulares (Jogos / Interativos)
| Asset | Caminho | Contratos | Onde Instanciar |
|---|---|---|---|

## 4. Hooks, Utilitários e Módulos Puros de Domínio
| Módulo | Caminho | Responsabilidade | Consumidores |
|---|---|---|---|
`;
    writeFileSync(join(repo.dir, 'docs', 'catalogo-reuso.md'), conteudoCatalogo, 'utf8');
    execSync('git add docs/catalogo-reuso.md src/components/Botao.tsx', { cwd: repo.dir });
    execSync('git commit -m "feat: cria catalogo com botao"', { cwd: repo.dir });

    // Cenário 1: Remove o arquivo citado no catálogo sem atualizar o catálogo
    rmSync(camBotao);
    execSync('git rm src/components/Botao.tsx', { cwd: repo.dir });
    tocarChangelog(repo.dir);
    execSync('git add CHANGELOG.md', { cwd: repo.dir });
    const resRemocaoSemSync = repo.executarVerificador('--staged');
    assert.strictEqual(resRemocaoSemSync.exitCode, 1, 'Remover arquivo catalogado sem atualizar catálogo deve falhar');
    assert.match(resRemocaoSemSync.stderr + resRemocaoSemSync.stdout, /catalogo-reuso|apodrec|Botao\.tsx/i);

    // Cenário 2: Catálogo staged apontando para arquivo que não existe no disco
    const catalogoComFantasma = conteudoCatalogo.replace('src/components/Botao.tsx', 'src/components/Fantasma.tsx');
    writeFileSync(join(repo.dir, 'docs', 'catalogo-reuso.md'), catalogoComFantasma, 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add docs/catalogo-reuso.md CHANGELOG.md', { cwd: repo.dir });
    const resPonteiroQuebrado = repo.executarVerificador('--staged');
    assert.strictEqual(resPonteiroQuebrado.exitCode, 1, 'Ponteiro inexistente no catálogo deve ser bloqueado');
    assert.match(resPonteiroQuebrado.stderr + resPonteiroQuebrado.stdout, /Fantasma\.tsx|inexistente|não encontrado/i);

    // Cenário 3: Pacotes npm escopados (@escopo/pacote) entre crases no catálogo não devem gerar falso positivo
    mkdirSync(join(repo.dir, 'src', 'components'), { recursive: true });
    writeFileSync(camBotao, 'export const Botao = () => null;', 'utf8');
    const catalogoComPacoteEscopado = `# Catálogo de Reúso
## 1. Tokens Visuais e de Movimento
| Token | Arquivo Fonte | Valores | Regra |
|---|---|---|---|

## 2. Primitivos de UI e Layouts Compartilhados
| Componente | Caminho | Variantes | Quando Reutilizar |
|---|---|---|---|
| Botao | \`src/components/Botao.tsx\` | Baseado em \`@base-ui/react\` e \`@radix-ui/react-dialog\` | Ações principais |

## 3. Prefabs, Cenas Componíveis e Assets Modulares (Jogos / Interativos)
| Asset | Caminho | Contratos | Onde Instanciar |
|---|---|---|---|

## 4. Hooks, Utilitários e Módulos Puros de Domínio
| Módulo | Caminho | Responsabilidade | Consumidores |
|---|---|---|---|
| Tabela | \`src/components/Botao.tsx\` | Wrapper sobre \`@tanstack/react-table\` | Listagens |
`;
    writeFileSync(join(repo.dir, 'docs', 'catalogo-reuso.md'), catalogoComPacoteEscopado, 'utf8');
    tocarChangelog(repo.dir);
    execSync('git add src/components/Botao.tsx docs/catalogo-reuso.md CHANGELOG.md', { cwd: repo.dir });
    const resPacoteEscopado = repo.executarVerificador('--staged');
    assert.strictEqual(
      resPacoteEscopado.exitCode,
      0,
      `Pacotes npm escopados (@base-ui/react) não devem falhar no sensor anti-apodrecimento: ${resPacoteEscopado.stderr}`
    );
  } finally {
    repo.limpar();
  }
});

test('deve_conter_catalogo_skill_comando_artigo_14_e_paridade_forense', () => {
  // 1. Catálogo de reúso no template e no copier.yml em _skip_if_exists
  const camCatalogo = join(dirTemplate, 'docs', 'catalogo-reuso.md');
  assert.ok(existsSync(camCatalogo), 'docs/catalogo-reuso.md deve existir no template');
  const conteudoCatalogo = readFileSync(camCatalogo, 'utf8');
  assert.match(conteudoCatalogo, /## 1\. Tokens Visuais e de Movimento/i);
  assert.match(conteudoCatalogo, /## 2\. Primitivos de UI e Layouts Compartilhados/i);
  assert.match(conteudoCatalogo, /## 3\. Prefabs, Cenas Componíveis e Assets Modulares/i);
  assert.match(conteudoCatalogo, /## 4\. Hooks, Utilitários e Módulos Puros de Domínio/i);

  const conteudoCopier = readFileSync(join(process.cwd(), 'copier.yml'), 'utf8');
  assert.match(conteudoCopier, /docs\/catalogo-reuso\.md/);

  // 2. Skill reuso-e-modularizacao
  const camSkill = join(dirTemplate, '.agents', 'skills', 'reuso-e-modularizacao', 'SKILL.md');
  assert.ok(existsSync(camSkill), 'reuso-e-modularizacao/SKILL.md deve existir');
  const conteudoSkill = readFileSync(camSkill, 'utf8');
  assert.match(conteudoSkill, /auditar-reuso/i);
  assert.match(conteudoSkill, /Godot/i);

  // 3. Comando /auditar-reuso em AGENTS.md (sem wrappers proprietários)
  const agentsContent = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
  assert.ok(agentsContent.includes('/auditar-reuso'), 'AGENTS.md deve conter /auditar-reuso');
  assert.strictEqual(existsSync(join(dirTemplate, '.claude')), false, 'template/.claude não deve existir');
  assert.strictEqual(existsSync(join(dirTemplate, '.cursor')), false, 'template/.cursor não deve existir');
  assert.strictEqual(existsSync(join(dirTemplate, '.github', 'agents')), false, 'template/.github/agents não deve existir');

  // 4. Artigo 14 na Constituição e referência no Artigo 1.2
  const camConst = join(dirTemplate, 'constitution.md');
  const conteudoConst = readFileSync(camConst, 'utf8');
  assert.match(conteudoConst, /Artigo 14/i);
  assert.match(conteudoConst, /Reuse-Before-Create/i);
  assert.match(conteudoConst, /Component-as-Asset/i);
  assert.match(conteudoConst, /Tokens de Movimento/i);

  // 5. Auditoria Forense consolidada na skill universal revisar-fatia/SKILL.md
  const camInspSkill = join(dirTemplate, '.agents', 'skills', 'revisar-fatia', 'SKILL.md');
  assert.match(readFileSync(camInspSkill, 'utf8'), /reúso|monólito|catraca/i);
});
