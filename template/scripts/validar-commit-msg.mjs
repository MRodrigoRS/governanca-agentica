#!/usr/bin/env node

/**
 * ==============================================================================
 * Validador de Mensagens de Commit — validar-commit-msg.mjs
 * ==============================================================================
 * Executado pelo Lefthook (commit-msg) para garantir Conventional Commits e
 * idioma em Português do Brasil (PT-BR) conforme a Constituição (D5 + D15).
 * ==============================================================================
 */

import { readFileSync } from 'node:fs';

const VERMELHO = '\x1b[31m';
const VERDE = '\x1b[32m';
const NEGRITO = '\x1b[1m';
const RESET = '\x1b[0m';

const caminhoArquivoMensagem = process.argv[2];

if (!caminhoArquivoMensagem) {
  console.error(`${VERMELHO}[ERRO] Caminho do arquivo de mensagem de commit não fornecido.${RESET}`);
  process.exit(1);
}

let conteudoMensagem;
try {
  conteudoMensagem = readFileSync(caminhoArquivoMensagem, 'utf8');
} catch (erro) {
  console.error(`${VERMELHO}[ERRO] Não foi possível ler a mensagem de commit: ${erro.message}${RESET}`);
  process.exit(1);
}

// Extrai a primeira linha (ignora comentários iniciados por #)
const linhas = conteudoMensagem
  .split('\n')
  .map((linha) => linha.trim())
  .filter((linha) => linha.length > 0 && !linha.startsWith('#'));

const primeiraLinha = linhas[0] || '';

// Permite commits nativos automáticos do Git (Merge, Revert automático, etc.)
if (
  primeiraLinha.startsWith('Merge ') ||
  primeiraLinha.startsWith('Revert "') ||
  primeiraLinha.startsWith("Merge branch ") ||
  primeiraLinha.startsWith("Merge pull request ")
) {
  console.log(`${VERDE}[GOVERNANÇA] Mensagem de commit especial do Git aceita automaticamente.${RESET}`);
  process.exit(0);
}

// Regex para Conventional Commits: tipo(escopo)?: descrição
// Suporta escopos alfanuméricos com hífens e pontos (ex.: fatia-02a, v2.1, api.v1)
const REGEX_COMMIT = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9_.-]+\))?!?: (.+)$/;

const resultado = primeiraLinha.match(REGEX_COMMIT);

if (!resultado) {
  console.error(
    `\n${VERMELHO}${NEGRITO}[GOVERNANÇA] MENSAGEM DE COMMIT INVÁLIDA:${RESET}\n` +
    `Sua mensagem: "${primeiraLinha}"\n\n` +
    `Formato esperado: <tipo>(<escopo>): <descrição em PT-BR>\n` +
    `Tipos permitidos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert\n\n` +
    `Exemplos válidos:\n` +
    `  feat(auth): adiciona autenticação social com Google\n` +
    `  feat(fatia-02a): implementa catálogo de produtos e variações\n` +
    `  fix(api): corrige validação de e-mail duplicado\n` +
    `  docs: atualiza guia de instalação no README\n` +
    `  chore(governanca): atualiza template via copier\n`
  );
  process.exit(1);
}

const descricao = resultado[3].trim();

if (descricao.length < 10) {
  console.error(
    `\n${VERMELHO}${NEGRITO}[GOVERNANÇA] DESCRIÇÃO MUITO CURTA:${RESET}\n` +
    `A descrição do commit deve ter no mínimo 10 caracteres explicativos.\n` +
    `Recebido (${descricao.length} caracteres): "${descricao}"\n`
  );
  process.exit(1);
}

const INICIOS_EM_INGLES = [
  'add ',
  'added ',
  'fix ',
  'fixed ',
  'update ',
  'updated ',
  'remove ',
  'removed ',
  'delete ',
  'deleted ',
  'change ',
  'changed ',
  'implement ',
  'implemented ',
  'create ',
  'created ',
];

const descricaoMinuscula = descricao.toLowerCase();
if (INICIOS_EM_INGLES.some((prefixo) => descricaoMinuscula.startsWith(prefixo))) {
  console.error(
    `\n${VERMELHO}${NEGRITO}[GOVERNANÇA] IDIOMA INCORRETO (Artigo 10):${RESET}\n` +
    `A mensagem de commit deve ser escrita em Português do Brasil (PT-BR).\n` +
    `Detectado início em inglês: "${descricao}"\n\n` +
    `Sugestões:\n` +
    `  "adiciona..." em vez de "add..."\n` +
    `  "corrige..." em vez de "fix..."\n` +
    `  "atualiza..." em vez de "update..."\n` +
    `  "remove..." em vez de "remove..." ou "delete..."\n`
  );
  process.exit(1);
}

console.log(`${VERDE}[GOVERNANÇA] Mensagem de commit válida em PT-BR.${RESET}`);
process.exit(0);
