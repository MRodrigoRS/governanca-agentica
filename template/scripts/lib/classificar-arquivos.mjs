/**
 * ==============================================================================
 * Classificação Determinística de Arquivos — classificar-arquivos.mjs
 * ==============================================================================
 * Módulo zero-dependências compartilhado entre verificar-governanca.mjs,
 * validar-commit-msg.mjs e hook-agente.mjs.
 * ==============================================================================
 */

export const PADROES_MANIFESTO = [
  'package.json',
  'pyproject.toml',
  'Cargo.toml',
  'tauri.conf.json',
  'go.mod',
  'pom.xml',
  'build.gradle',
  'requirements.txt',
  'project.godot',
];

export const PADROES_SCHEMA_BANCO = [
  'schema.prisma',
  'drizzle',
  'migrations',
  'alembic',
  'migration',
  'db/schema',
];

export const ARQUIVOS_CONFIG_ROOT = [
  'vite.config.ts', 'vite.config.js', 'vite.config.mjs',
  'next.config.ts', 'next.config.js', 'next.config.mjs',
  'tailwind.config.ts', 'tailwind.config.js', 'tailwind.config.mjs',
  'postcss.config.js', 'postcss.config.mjs',
  'vitest.config.ts', 'vitest.config.js',
  'playwright.config.ts', 'playwright.config.js',
  'tsconfig.json', 'biome.json', 'eslint.config.js', 'eslint.config.mjs',
];

export function normalizarCaminho(caminho) {
  return (caminho || '').toLowerCase().replace(/\\/g, '/');
}

export function ehArquivoDeTeste(arquivo) {
  const minusculo = normalizarCaminho(arquivo);
  const nomeBase = minusculo.split('/').pop() || '';

  // Pastas canônicas de teste na raiz ou subpastas
  if (
    minusculo.startsWith('tests/') ||
    minusculo.startsWith('test/') ||
    minusculo.startsWith('__tests__/') ||
    minusculo.includes('/tests/') ||
    minusculo.includes('/test/') ||
    minusculo.includes('/__tests__/')
  ) {
    return true;
  }

  // Padrões Python em qualquer pasta
  if (
    (nomeBase.startsWith('test_') && nomeBase.endsWith('.py')) ||
    nomeBase.endsWith('_test.py')
  ) {
    return true;
  }

  // Extensões e sufixos canônicos universais
  return (
    minusculo.includes('.test.') ||
    minusculo.includes('.spec.') ||
    minusculo.endsWith('_test.go') ||
    minusculo.endsWith('_test.rs') ||
    minusculo.endsWith('tests.cs') ||
    minusculo.endsWith('test.cs')
  );
}

export function ehArquivoDeDocumentacaoOuGovernanca(arquivo) {
  const minusculo = normalizarCaminho(arquivo);

  if (
    minusculo === 'changelog.md' ||
    minusculo === 'agents.md' ||
    minusculo === 'claude.md' ||
    minusculo === 'gemini.md' ||
    minusculo === 'constitution.md' ||
    minusculo === 'readme.md' ||
    minusculo === 'license' ||
    minusculo === 'lefthook.yml' ||
    minusculo === 'copier.yml' ||
    minusculo === '.gitignore' ||
    minusculo === '.copier-answers.yml' ||
    minusculo === '.mcp.json'
  ) {
    return true;
  }

  if (
    minusculo.startsWith('.github/') ||
    minusculo.startsWith('.cursor/') ||
    minusculo.startsWith('.claude/') ||
    minusculo.startsWith('docs/') ||
    minusculo.startsWith('openspec/') ||
    minusculo.startsWith('.agents/') ||
    minusculo.startsWith('template/')
  ) {
    return true;
  }

  // Isenção restrita de scripts: cobre APENAS os scripts e bibliotecas da governança
  if (
    minusculo === 'scripts/verificar-governanca.mjs' ||
    minusculo === 'scripts/validar-commit-msg.mjs' ||
    minusculo === 'scripts/hook-agente.mjs' ||
    minusculo.startsWith('scripts/lib/')
  ) {
    return true;
  }

  return false;
}

export function ehManifestoDeDependencia(arquivo) {
  const nomeBase = normalizarCaminho(arquivo).split('/').pop() || '';
  return PADROES_MANIFESTO.some((p) => nomeBase === p.toLowerCase()) || nomeBase.endsWith('.csproj');
}

export function ehSchemaOuMigracaoDeBanco(arquivo) {
  const minusculo = normalizarCaminho(arquivo);
  return (
    PADROES_SCHEMA_BANCO.some((p) => minusculo.includes(p.toLowerCase())) ||
    minusculo.endsWith('.sql') ||
    minusculo.endsWith('.prisma')
  );
}

export function ehArquivoDeConfiguracao(arquivo) {
  const nomeBase = normalizarCaminho(arquivo).split('/').pop() || '';
  return ARQUIVOS_CONFIG_ROOT.some((cfg) => nomeBase === cfg.toLowerCase());
}

export function ehArquivoDeFrontend(arquivo) {
  const minusculo = normalizarCaminho(arquivo);
  const extensoes = ['.tsx', '.jsx', '.vue', '.svelte', '.html'];
  return extensoes.some((ext) => minusculo.endsWith(ext));
}

export function ehArquivoDeProducao(arquivo) {
  if (ehArquivoDeDocumentacaoOuGovernanca(arquivo)) return false;
  if (ehArquivoDeTeste(arquivo)) return false;
  if (ehArquivoDeConfiguracao(arquivo)) return false;

  const minusculo = normalizarCaminho(arquivo);
  const extensoesCodigo = [
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.py', '.go', '.rs', '.java', '.c', '.cpp',
    '.cs', '.vue', '.svelte', '.dart', '.kt', '.swift',
    '.gd',
  ];
  return extensoesCodigo.some((ext) => minusculo.endsWith(ext));
}
