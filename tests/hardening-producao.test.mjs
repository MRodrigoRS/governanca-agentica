import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const dirTemplate = join(raiz, 'template');

describe('Fatia 22: Hardening de Produção — Banco, Observabilidade, CI CVEs e Contratos (v4.8.0)', () => {
  test('1_constituicao_artigo_7_observabilidade_migracoes_e_contratos_preservando_3_faixas', () => {
    const constituicao = readFileSync(join(dirTemplate, 'constitution.md'), 'utf8');
    assert.match(constituicao, /governanca:inicio v4\.[89]\.\d+/, 'constitution.md deve ter cabeçalho v4.8.0+');

    const blocoArtigo1 = constituicao.split('## Artigo 2')[0] || '';
    assert.match(blocoArtigo1, /Contratos Tipados Ponta-a-Ponta/i, 'Artigo 1.2 deve exigir contratos tipados ponta-a-ponta');
    assert.match(blocoArtigo1, /duplica[çc][ãa]o manual de DTOs/i, 'Artigo 1.2 deve vedar duplicação manual de DTOs');

    const blocoArtigo7 = (constituicao.split('## Artigo 7')[1] || '').split('## Artigo 8')[0] || '';
    assert.match(blocoArtigo7, /expand-and-contract/i, 'Artigo 7.2 deve exigir padrão expand-and-contract');
    assert.match(blocoArtigo7, /seeds.*idempotentes|idempotentes.*seeds/i, 'Artigo 7.2 deve exigir seeds idempotentes');
    assert.match(blocoArtigo7, /\n6\.\s+\*\*Observabilidade Mínima/i, 'Artigo 7 deve conter item 6 de Observabilidade Mínima');
    assert.match(blocoArtigo7, /requestId/i, 'Artigo 7.6 deve exigir requestId');
    assert.match(blocoArtigo7, /\/health/, 'Artigo 7.6 deve exigir endpoint /health');
    assert.match(blocoArtigo7, /PII/i, 'Artigo 7.6 deve proibir PII em logs');

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
      assert.ok(match, `Artigo ${numero} deve preservar selo '${selo}'`);
      assert.ok(match.index > posicaoAnterior, `Artigo ${numero} deve preservar ordem 1..14`);
      posicaoAnterior = match.index;
    }
  });

  test('2_regras_modulares_backend_e_web_detalham_hardening_e_globs_ampliados', () => {
    const backend = readFileSync(
      join(dirTemplate, '.agents', 'rules', 'backend-seguranca-dados.md.jinja'),
      'utf8'
    );
    for (const glob of ['**/api/**', '**/*.prisma', '**/migrations/**', '**/*.sql', '**/seed*', '**/seeds/**', '**/schemas/**']) {
      assert.ok(backend.includes(glob), `backend-seguranca-dados.md.jinja deve incluir glob '${glob}'`);
    }
    assert.match(backend, /## 7\. Migrações Seguras/i, 'Backend deve detalhar seção 7 de migrações seguras');
    assert.match(backend, /expand-and-contract/i, 'Backend deve detalhar expand-and-contract');
    assert.match(backend, /upsert|ON CONFLICT/i, 'Backend deve detalhar seeds idempotentes com upsert/ON CONFLICT');
    assert.match(backend, /## 8\. Observabilidade Mínima/i, 'Backend deve detalhar seção 8 de observabilidade');
    assert.match(backend, /requestId/i, 'Backend deve exigir requestId');
    assert.match(backend, /\/health/, 'Backend deve exigir /health');
    assert.match(backend, /\/ready/, 'Backend deve documentar /ready');
    assert.match(backend, /## 9\. Contratos Tipados Ponta-a-Ponta/i, 'Backend deve detalhar seção 9 de contratos tipados');

    const web = readFileSync(
      join(dirTemplate, '.agents', 'rules', 'web-ui-pwa.md.jinja'),
      'utf8'
    );
    assert.ok(web.includes('**/*.tsx'), 'web-ui-pwa.md.jinja deve manter **/*.tsx');
    assert.match(web, /## 10\. Consumo de Contratos Tipados/i, 'Web UI deve detalhar seção 10 de contratos tipados');
    assert.match(web, /duplicar.*DTOs|DTOs.*duplicad/i, 'Web UI deve proibir duplicação manual de DTOs');
    assert.match(web, /res\.json\(\)\s*as/i, 'Web UI deve proibir type assertion cega (res.json() as ...)');
  });

  test('3_ci_poliglota_remove_or_true_cego_e_bloqueia_cves_criticas', () => {
    const ci = readFileSync(join(dirTemplate, '.github', 'workflows', 'ci.yml'), 'utf8');

    assert.doesNotMatch(ci, /audit[^\n]*\|\|\s*true/, 'CI não pode mascarar auditores de CVE com || true');
    assert.doesNotMatch(ci, /alembic check[^\n]*\|\|\s*true/, 'CI não pode mascarar alembic check com || true');

    assert.match(ci, /package-lock\.json[\s\S]*npm audit --omit=dev --audit-level=critical/, 'Node npm deve bloquear CVEs critical');
    assert.match(ci, /pnpm-lock\.yaml[\s\S]*pnpm audit --prod --audit-level=critical/, 'Node pnpm deve bloquear CVEs critical');
    assert.match(ci, /yarn\.lock[\s\S]*yarn npm audit --environment production --severity critical/, 'Node yarn deve bloquear CVEs critical');
    assert.match(ci, /::warning::[^\n]*HIGH/i, 'Node deve emitir ::warning:: para CVEs HIGH');

    assert.match(ci, /\[ -f "alembic\.ini" \]\s*&&\s*\[ -n "\$DATABASE_URL" \]/, 'alembic check deve ser condicionado a $DATABASE_URL');
    assert.match(ci, /uv run pip-audit;\s*fi/, 'pip-audit deve rodar sem || true');
    assert.match(ci, /cargo audit;\s*fi/, 'cargo audit deve rodar sem || true');
  });

  test('4_runbook_skills_catalogo_e_agents_sincronizados_sem_quebrar_cabecalhos', () => {
    const runbook = readFileSync(join(dirTemplate, 'docs', 'runbook.md'), 'utf8');
    for (const cabecalho of [
      '## 1. Deploy e Publicação',
      '## 2. Verificação Pós-Deploy (*Smoke Check*)',
      '## 3. Migrations e Rollback Seguro',
      '## 4. Logs, Filas e Observabilidade',
      '## 5. Checklist de Pré-Release (Go-Live)',
    ]) {
      assert.ok(runbook.includes(cabecalho), `runbook.md deve preservar cabeçalho '${cabecalho}'`);
    }
    assert.match(runbook, /expand-and-contract/i, 'runbook.md deve orientar expand-and-contract');
    assert.match(runbook, /\/health[\s\S]*\/ready/, 'runbook.md deve documentar /health e /ready');
    assert.match(runbook, /requestId/i, 'runbook.md deve mencionar correlação por requestId');

    const revisar = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'revisar-fatia', 'SKILL.md'),
      'utf8'
    );
    assert.match(revisar, /expand-and-contract/i, 'revisar-fatia deve auditar expand-and-contract');
    assert.match(revisar, /seeds idempotentes/i, 'revisar-fatia deve auditar seeds idempotentes');
    assert.match(revisar, /requestId/i, 'revisar-fatia deve auditar requestId e logs sem PII');
    assert.match(revisar, /contratos tipados|DTOs duplicados/i, 'revisar-fatia deve auditar deriva de contratos');

    const seguranca = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'auditoria-seguranca', 'SKILL.md'),
      'utf8'
    );
    assert.match(seguranca, /requestId/i, 'auditoria-seguranca deve cobrir logs JSON com requestId');
    assert.match(seguranca, /critical/i, 'auditoria-seguranca deve refletir política estrita de CVEs críticas sem || true');

    const catalogo = readFileSync(
      join(dirTemplate, '.agents', 'skills', 'inicializar-stack', 'references', 'catalogo-stacks.md'),
      'utf8'
    );
    assert.match(catalogo, /Governança v4\.[89]\.\d+/, 'catalogo-stacks.md deve estar em v4.8.0+');
    assert.match(catalogo, /openapi-typescript/i, 'catalogo-stacks.md deve citar geração tipada ponta-a-ponta');

    const agents = readFileSync(join(dirTemplate, 'AGENTS.md'), 'utf8');
    assert.match(agents, /governanca:inicio v4\.[89]\.\d+/, 'template/AGENTS.md deve ter cabeçalho v4.8.0+');
    assert.ok(agents.includes('.sql'), 'Matriz Universal deve citar arquivos .sql');
    assert.match(agents, /expand-and-contract/i, 'Matriz Universal deve citar expand-and-contract');
  });

  test('5_sincronia_semver_4_8_0_d50_readme_e_changelog', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    assert.match(pkg.version, /^4\.[89]\.\d+$/, 'package.json deve estar em 4.8.0+');

    const projectJinja = readFileSync(join(dirTemplate, 'openspec', 'project.md.jinja'), 'utf8');
    assert.match(projectJinja, /Governança v4\.[89]\.\d+/, 'project.md.jinja deve estar em v4.8.0+');

    const decisoes = readFileSync(join(raiz, '00_INDICE_E_DECISOES.md'), 'utf8');
    assert.match(decisoes, /\|\s*D50\s*\|/, '00_INDICE_E_DECISOES.md deve registrar D50');
    assert.ok(decisoes.includes('v4.8.0'), '00_INDICE_E_DECISOES.md deve citar v4.8.0');

    const readme = readFileSync(join(raiz, 'README.md'), 'utf8');
    assert.match(readme, /4\.[89]\.\d+/, 'README.md deve refletir versão 4.8.0+');
    assert.match(readme, /D5\d/, 'README.md deve referenciar D50+');

    const changelog = readFileSync(join(raiz, 'CHANGELOG.md'), 'utf8');
    assert.match(changelog, /\(v4\.[89]\.\d+\)/, 'CHANGELOG.md deve ter cabeçalho v4.8.0+');
    assert.match(changelog, /## \[4\.8\.0\]/, 'CHANGELOG.md deve conter seção [4.8.0]');
  });
});
