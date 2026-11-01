#!/usr/bin/env node

/**
 * ==============================================================================
 * Hook Nativo de Ciclo de Vida do Agente — hook-agente.mjs
 * ==============================================================================
 * Executado pelos hooks nativos de IDE/Agentes (Antigravity e Claude Code):
 * - Intercepta ferramentas antes da execução (PreToolUse) para impedir --no-verify,
 *   -n, mutações de arquivos proibidas e forçar aprovação humana em commits/pushes
 *   e comandos destrutivos (Artigo 11 / Artigo 7 / Artigo 6).
 * - Inspeciona mutações pós-edição (PostToolUse no Claude Code).
 * - Injeta diagnóstico e lembretes de contexto no início da sessão (SessionStart).
 * ==============================================================================
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

function lerStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

const subcomando = process.argv[2] || 'pre-tool';
const entradaBruta = lerStdin();
let payload = {};
try {
  if (entradaBruta.trim()) {
    payload = JSON.parse(entradaBruta);
  }
} catch {
  payload = {};
}

function obterRaizProjeto(p) {
  if (p?.workspacePaths?.[0]) return p.workspacePaths[0];
  if (p?.cwd) return p.cwd;
  if (process.env.CLAUDE_PROJECT_DIR) return process.env.CLAUDE_PROJECT_DIR;
  if (existsSync(join(process.cwd(), 'openspec')) || existsSync(join(process.cwd(), 'scripts'))) {
    return process.cwd();
  }
  const pai = join(process.cwd(), '..');
  if (existsSync(join(pai, 'openspec')) || existsSync(join(pai, 'scripts'))) {
    return pai;
  }
  return process.cwd();
}

function extrairLinhaComando(p) {
  if (p?.toolCall?.args?.CommandLine) {
    return p.toolCall.args.CommandLine;
  }
  if (p?.tool_input?.command) {
    return p.tool_input.command;
  }
  return '';
}

function detectarBypassGit(comando) {
  if (!comando) return false;
  if (comando.includes('--no-verify')) return true;

  // Higieniza literais entre aspas para evitar falso positivo quando -n faz parte da mensagem
  const semStrings = comando.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');

  const ehGitCommit = /(^|\s)git\s+commit(\s|$)/i.test(semStrings);
  if (!ehGitCommit) return false;

  // Flag curta -n isolada ou combinada (ex: -am "..." -n, -nm, -an)
  return /(^|\s)-[a-zA-Z]*n[a-zA-Z]*(\s|$)/.test(semStrings);
}

function detectarComandoSensivelOuDestrutivo(comando) {
  if (!comando) return false;
  const semStrings = comando.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');

  const ehCommitPushReset = /(^|\s)git\s+(commit|push|reset\s+--hard)(\s|$)/i.test(semStrings);
  if (ehCommitPushReset) return true;

  const ehGitDestrutivo =
    /(^|\s)git\s+clean\s+(-[a-zA-Z]*f|--force)/i.test(semStrings) ||
    /(^|\s)git\s+restore\s+(\.|--staged\s+\.)/i.test(semStrings) ||
    /(^|\s)git\s+checkout\s+(--\s+)?\./i.test(semStrings);
  if (ehGitDestrutivo) return true;

  const ehResetBanco =
    /(^|\s)(npx\s+)?prisma\s+migrate\s+reset/i.test(semStrings) ||
    /(^|\s)(npx\s+)?drizzle-kit\s+drop/i.test(semStrings) ||
    /(^|\s)supabase\s+db\s+reset/i.test(semStrings);
  return ehResetBanco;
}

function validarMutacaoConteudoArquivo(caminhoArquivo, conteudo) {
  if (!caminhoArquivo || typeof conteudo !== 'string') return null;

  const minusculo = caminhoArquivo.toLowerCase().replace(/\\/g, '/');

  // 1. Frontend: proibido location.reload (Artigo 6)
  const ehFrontend = ['.tsx', '.jsx', '.vue', '.svelte', '.html'].some(ext => minusculo.endsWith(ext));
  if (ehFrontend) {
    if (
      conteudo.includes('location.reload(') ||
      conteudo.includes('window.location.reload(') ||
      conteudo.includes('window.location.href =')
    ) {
      return 'Violação de Padrões Frontend (Artigo 6 — Reatividade Limpa): proibido location.reload ou atualizações forçadas de tela.';
    }
  }

  // 2. Testes: proibido .only (Artigo 2)
  const ehTeste =
    minusculo.includes('.test.') ||
    minusculo.includes('.spec.') ||
    minusculo.includes('/__tests__/') ||
    minusculo.includes('/tests/');
  if (ehTeste) {
    if (conteudo.includes('.only(') || conteudo.includes('.only`') || conteudo.includes('@unittest.skip')) {
      return 'Foco Exclusivo Esquecido (Artigo 2 — Test-First): proibido usar .only em arquivos de teste.';
    }
  }

  // 3. Roadmap: proibido placeholders preguiçosos
  const ehRoadmap = minusculo.includes('openspec/roadmap/') && minusculo.endsWith('.md');
  if (ehRoadmap) {
    const marcadoresPreguica = [
      '<NUMERO>',
      '<TITULO_DA_FATIA>',
      '<SLUG>',
      '{{ NUMERO }}',
      '{{ TITULO_DA_FATIA }}',
      '[Descreva claramente',
      '[preencher]',
      'TODO:',
      'TBD:',
    ];
    const marcador = marcadoresPreguica.find(m => conteudo.includes(m));
    if (marcador) {
      return `Cláusula Anti-Preguiça no Roadmap (D18): proibido gravar placeholders ou marcadores não preenchidos ('${marcador}') em openspec/roadmap/.`;
    }
  }

  return null;
}

function processarPreToolAntigravity() {
  const nomeFerramenta = payload?.toolCall?.name;

  if (nomeFerramenta === 'write_file' || nomeFerramenta === 'edit_file') {
    const args = payload.toolCall.args || {};
    const caminho = args.Path || '';
    const conteudo = args.Content || args.Replacement || '';
    const erroMutacao = validarMutacaoConteudoArquivo(caminho, conteudo);
    if (erroMutacao) {
      console.log(JSON.stringify({ decision: 'deny', reason: erroMutacao }));
      process.exit(0);
    }
  }

  const comando = extrairLinhaComando(payload);
  if (comando) {
    if (detectarBypassGit(comando)) {
      console.log(JSON.stringify({
        decision: 'deny',
        reason: 'A governança proíbe terminantemente o uso de --no-verify ou -n para burlar os hooks determinísticos locais (Artigo 11 / D15).'
      }));
      process.exit(0);
    }

    if (detectarComandoSensivelOuDestrutivo(comando)) {
      console.log(JSON.stringify({
        decision: 'force_ask',
        reason: 'A Governança (Artigo 11 / Artigo 7) exige autorização humana explícita antes de realizar commits, pushes, limpezas de árvore ou resets de banco no repositório.'
      }));
      process.exit(0);
    }
  }

  console.log(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

function processarPreToolClaude() {
  const comando = extrairLinhaComando(payload);

  if (detectarBypassGit(comando)) {
    console.error(
      'A governança proíbe terminantemente o uso de --no-verify ou -n para burlar os hooks determinísticos locais (Artigo 11 / D15).'
    );
    process.exit(2);
  }

  if (detectarComandoSensivelOuDestrutivo(comando)) {
    const resposta = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason:
          'A Governança (Artigo 11 / Artigo 7) exige autorização humana explícita antes de realizar commits, pushes, limpezas de árvore ou resets de banco no repositório.',
      },
    };
    console.log(JSON.stringify(resposta));
    process.exit(0);
  }

  console.log(JSON.stringify({}));
  process.exit(0);
}

function processarPostToolClaude() {
  const filePath = payload?.tool_input?.file_path || payload?.tool_input?.path;
  const raiz = obterRaizProjeto(payload);
  if (filePath) {
    const caminhoCompleto = resolve(raiz, filePath);
    if (existsSync(caminhoCompleto)) {
      try {
        const conteudo = readFileSync(caminhoCompleto, 'utf8');
        const erroMutacao = validarMutacaoConteudoArquivo(filePath, conteudo);
        if (erroMutacao) {
          console.log(JSON.stringify({ decision: 'block', reason: `[GOVERNANÇA] ${erroMutacao}` }));
          process.exit(0);
        }

        if (filePath.endsWith('.mjs') || filePath.endsWith('.cjs')) {
          try {
            execFileSync(process.execPath, ['--check', caminhoCompleto], { stdio: 'pipe' });
          } catch (erroSintaxe) {
            console.log(JSON.stringify({
              decision: 'block',
              reason: `[GOVERNANÇA] Erro de sintaxe detectado em '${filePath}': ${erroSintaxe.stderr?.toString()?.trim() || erroSintaxe.message}`
            }));
            process.exit(0);
          }
        }
      } catch {}
    }
  }

  console.log(JSON.stringify({}));
  process.exit(0);
}

function processarSessionStart() {
  const raiz = obterRaizProjeto(payload);
  let mensagemStatus = 'Governança Agêntica Ativa.';

  const pastaMudancas = join(raiz, 'openspec', 'changes');
  if (existsSync(pastaMudancas)) {
    try {
      const ativas = readdirSync(pastaMudancas).filter(
        (f) => f !== 'archive' && !f.startsWith('.')
      );
      if (ativas.length > 0) {
        mensagemStatus += ` Mudança ativa detectada em openspec/changes/: ${ativas.join(', ')}.`;
      }
    } catch {}
  }

  mensagemStatus +=
    ' Lembre-se: obedeça rigorosamente a constitution.md e AGENTS.md. É proibido deduzir escopo de cabeça (Artigo 12).';

  const resposta = {
    injectSteps: [
      {
        systemMessage: {
          systemMessage: mensagemStatus,
        },
      },
    ],
  };

  console.log(JSON.stringify(resposta));
  process.exit(0);
}

function processarSessionStartClaude() {
  const raiz = obterRaizProjeto(payload);
  let mensagemStatus = 'Governança Agêntica Ativa.';

  const pastaMudancas = join(raiz, 'openspec', 'changes');
  if (existsSync(pastaMudancas)) {
    try {
      const ativas = readdirSync(pastaMudancas).filter(
        (f) => f !== 'archive' && !f.startsWith('.')
      );
      if (ativas.length > 0) {
        mensagemStatus += ` Mudança ativa detectada em openspec/changes/: ${ativas.join(', ')}.`;
      }
    } catch {}
  }

  mensagemStatus +=
    ' Lembre-se: obedeça rigorosamente a constitution.md e AGENTS.md. É proibido deduzir escopo de cabeça (Artigo 12).';

  const resposta = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: mensagemStatus,
    },
  };

  console.log(JSON.stringify(resposta));
  process.exit(0);
}

switch (subcomando) {
  case 'pre-tool':
    processarPreToolAntigravity();
    break;
  case 'pre-tool-claude':
    processarPreToolClaude();
    break;
  case 'post-tool-claude':
    processarPostToolClaude();
    break;
  case 'session-start':
    processarSessionStart();
    break;
  case 'session-start-claude':
    processarSessionStartClaude();
    break;
  default:
    console.log(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
}
