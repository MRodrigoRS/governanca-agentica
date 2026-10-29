#!/usr/bin/env node

/**
 * ==============================================================================
 * Hook Nativo de Ciclo de Vida do Agente — hook-agente.mjs
 * ==============================================================================
 * Executado pelos hooks nativos de IDE/Agentes (Antigravity e Claude Code):
 * - Intercepta ferramentas antes da execução (PreToolUse) para impedir --no-verify
 *   e forçar aprovação humana em commits/pushes (Artigo 11).
 * - Injeta diagnóstico e lembretes de contexto no início da sessão (SessionStart).
 * ==============================================================================
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

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

function extrairLinhaComando(p) {
  // Antigravity payload: toolCall.args.CommandLine
  if (p?.toolCall?.args?.CommandLine) {
    return p.toolCall.args.CommandLine;
  }
  // Claude Code payload: tool_input.command
  if (p?.tool_input?.command) {
    return p.tool_input.command;
  }
  return '';
}

function processarPreToolAntigravity() {
  const comando = extrairLinhaComando(payload);

  if (comando.includes('--no-verify')) {
    const resposta = {
      decision: 'deny',
      reason: 'A governança proíbe terminantemente o uso de --no-verify para burlar os hooks determinísticos locais (Artigo 11 / D15).',
    };
    console.log(JSON.stringify(resposta));
    process.exit(0);
  }

  // Intercepta commits, pushes e resets destrutivos
  const ehComandoCommitOuPush =
    /(^|\s)git\s+(commit|push|reset\s+--hard)($|\s)/i.test(comando);

  if (ehComandoCommitOuPush) {
    const resposta = {
      decision: 'force_ask',
      reason: 'A Governança (Artigo 11) exige autorização humana explícita antes de realizar commits, pushes ou resets no repositório.',
    };
    console.log(JSON.stringify(resposta));
    process.exit(0);
  }

  console.log(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

function processarPreToolClaude() {
  const comando = extrairLinhaComando(payload);

  if (comando.includes('--no-verify')) {
    console.error(
      'A governança proíbe terminantemente o uso de --no-verify para burlar os hooks determinísticos locais (Artigo 11 / D15).'
    );
    // Exit code 2 em Claude Code bloqueia a ação e devolve o stderr ao agente
    process.exit(2);
  }

  process.exit(0);
}

function processarSessionStart() {
  let mensagemStatus = 'Governança Agêntica Ativa.';

  const pastaMudancas = join(process.cwd(), 'openspec', 'changes');
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
  process.exit(0);
}

switch (subcomando) {
  case 'pre-tool':
    processarPreToolAntigravity();
    break;
  case 'pre-tool-claude':
    processarPreToolClaude();
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
