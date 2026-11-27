/**
 * ==============================================================================
 * Sensores Estáticos de Código, Testes, Segredos e Anti-Monólito — sensores-codigo.mjs
 * ==============================================================================
 * Retorna listas estruturadas ({ erros, infos, valvulas }) sem process.exit(1),
 * suportando modo local (--staged) e modo CI (--ci / HEAD~1..HEAD).
 * ==============================================================================
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ehArquivoDeFrontend,
  ehArquivoDeProducao,
  ehArquivoDeTeste,
} from './classificar-arquivos.mjs';
import { lerConteudoAlvo, lerConteudoAnterior } from './git-diff-helper.mjs';

export function contarLinhasUteisCodigo(conteudo, extensao) {
  if (!conteudo) return 0;
  const ext = (extensao || '').toLowerCase();
  const linhas = conteudo.split('\n');
  let total = 0;
  let emBlocoComentario = false;
  let emBlocoHtml = false;

  for (const linha of linhas) {
    const limpa = linha.trim();
    if (!limpa) continue;

    if (ext === '.vue' || ext === '.svelte' || ext === '.html') {
      if (emBlocoHtml) {
        if (limpa.includes('-->')) emBlocoHtml = false;
        continue;
      }
      if (limpa.startsWith('<!--') && !limpa.includes('-->')) {
        emBlocoHtml = true;
        continue;
      }
      if (limpa.startsWith('<!--') && limpa.endsWith('-->')) continue;
    }

    if (emBlocoComentario) {
      if (limpa.includes('*/')) emBlocoComentario = false;
      continue;
    }
    if (limpa.startsWith('/*') && !limpa.includes('*/')) {
      emBlocoComentario = true;
      continue;
    }
    if (limpa.startsWith('/*') && limpa.endsWith('*/')) continue;

    if (ext === '.py' || ext === '.gd' || ext === '.sh' || ext === '.rb') {
      if (limpa.startsWith('#')) continue;
    } else if (limpa.startsWith('//') || limpa.startsWith('*')) {
      continue;
    }

    total++;
  }
  return total;
}

export function ehArquivoIsentoDeTetoMonolito(arquivo) {
  const minusculo = (arquivo || '').toLowerCase().replace(/\\/g, '/');
  const padroesIsencao = [
    'components/ui/',
    'addons/',
    'vendor/',
    'generated/',
    'migrations/',
    'drizzle/',
    '.d.ts',
    '.generated.',
    '.min.',
    'routetree.gen.',
  ];
  return padroesIsencao.some((p) => minusculo.includes(p));
}

export function verificarLocationReload(cwd, listaArquivos, modoCi = false) {
  const erros = [];
  for (const arq of listaArquivos.filter(ehArquivoDeFrontend)) {
    const conteudo = lerConteudoAlvo(cwd, arq, modoCi);
    if (!conteudo) continue;
    if (
      conteudo.includes('location.reload(') ||
      conteudo.includes('window.location.reload(') ||
      conteudo.includes('window.location.href =')
    ) {
      erros.push(
        `Violação de Padrões Frontend (Artigo 6 — Reatividade Limpa):\n` +
        `O arquivo '${arq}' contém recarregamento forçado de página ('location.reload' ou 'window.location.href').\n` +
        `A interface deve ser reativa, gerenciada pelo estado da biblioteca/framework de UI.\n\n` +
        `-> Solução: Atualize o estado reativo ou cache de dados sem forçar refresh da página inteira.`
      );
    }
  }
  return { erros };
}

export function verificarIntegridadeDeTestes(cwd, listaArquivos, modoCi = false) {
  const erros = [];
  const valvulas = [];
  const marcadoresAssercoes = [
    'expect(', 'assert', 'should', 'throws', 'rejects', 'resolves',
    'pytest.raises', 't.Error', 't.Fatal', 't.Run',
  ];
  const padroesMockBanco = [
    /(?:vi|jest)\.mock\(\s*['"][^'"]*(?:prisma|drizzle|\/db\b|database|repositorio|repository)['"]/i,
    /(?:vi|jest)\.spyOn\(\s*(?:prisma|db|database|repositorio|repository)\b/i,
    /\b(?:prisma|db)\.[a-zA-Z0-9_$]+\.(?:find|create|update|delete|upsert|execute|query)[a-zA-Z0-9_$]*\s*=\s*(?:vi|jest)\.fn\(/i,
    /(?:@patch|mock\.patch(?:\.object)?)\(\s*['"][^'"]*(?:\bdb\b|database|db_session|SessionLocal|AsyncSession|sqlalchemy|prisma|repositorio|repository)/i,
  ];

  for (const arq of listaArquivos.filter(ehArquivoDeTeste)) {
    const conteudo = lerConteudoAlvo(cwd, arq, modoCi);
    if (!conteudo) continue;

    if (conteudo.includes('.only(') || conteudo.includes('.only`') || conteudo.includes('@unittest.skip')) {
      erros.push(
        `Foco Exclusivo Esquecido em Arquivo de Teste (Artigo 2 — Test-First):\n` +
        `O arquivo de teste '${arq}' contém marcador de foco exclusivo ('.only(').\n` +
        `Isso faz o executor ignorar silenciosamente os demais testes da suíte, gerando falso positivo verde.\n\n` +
        `-> Solução: Remova '.only' antes de submeter o commit.`
      );
    }

    if (!marcadoresAssercoes.some((m) => conteudo.includes(m))) {
      erros.push(
        `Teste Oco Detectado (Artigo 2 — Anti-Teatro de Testes):\n` +
        `O arquivo de teste '${arq}' não contém nenhuma asserção real ('expect', 'assert', etc.).\n` +
        `Testes sem asserções apenas executam código sem validar regras de negócio, gerando falsa segurança.\n\n` +
        `-> Solução: Adicione asserções reais com 'expect(...)' ou 'assert(...)' testando o comportamento esperado.`
      );
    }

    const matchValvulaMock = conteudo.match(/governanca:mock-banco-justificado:\s*(.+)/i);
    const valvulaMockValida = matchValvulaMock && matchValvulaMock[1].trim().length >= 15;
    if (valvulaMockValida) {
      valvulas.push({
        tipo: 'mock-banco-justificado',
        arquivo: arq,
        motivo: matchValvulaMock[1].trim(),
      });
    } else if (padroesMockBanco.some((padrao) => padrao.test(conteudo))) {
      erros.push(
        `Detecção de Anti-Mock de Banco Próprio (Artigo 2 — Testing Trophy):\n` +
        `O arquivo de teste '${arq}' tenta mockar ou espionar o banco de dados ou ORM interno do projeto.\n` +
        `Testes de integração e serviço devem validar persistência real (SQLite in-memory, PGlite ou banco de teste real).\n` +
        `Mocks são reservados exclusivamente para serviços externos de terceiros (gateways de pagamento, e-mail, LLMs externos).\n\n` +
        `-> Solução: Utilize banco em memória (SQLite, PGlite) ou banco real de teste. Para testes unitários de adaptadores com simulação de queda de driver, adicione a válvula:\n` +
        `   '// governanca:mock-banco-justificado: <motivo técnico com ao menos 15 caracteres>'.`
      );
    }
  }
  return { erros, valvulas };
}

export function verificarVariaveisAmbiente(cwd, listaArquivos, modoCi = false) {
  const erros = [];
  const arquivosProducao = listaArquivos.filter(ehArquivoDeProducao);
  const camEnvExample = existsSync(join(cwd, '.env.example'))
    ? join(cwd, '.env.example')
    : existsSync(join(cwd, '.env.template'))
    ? join(cwd, '.env.template')
    : null;

  let conteudoEnvExample = '';
  if (camEnvExample) {
    try {
      conteudoEnvExample = readFileSync(camEnvExample, 'utf8');
    } catch {}
  }

  if (conteudoEnvExample) {
    const prefixosSegredoReal = ['sk_live_', 'sk_test_', 'ghp_', 'github_pat_', 'xox', 'AKIA', '-----BEGIN'];
    const regexSegredoLongo = /=\s*([A-Za-z0-9_\-]{32,})/;
    const palavrasPlaceholder = ['placeholder', 'exemplo', 'sample', 'chave', 'token', 'secret', 'sua-chave', 'changeme', 'sua_chave'];

    for (const linha of conteudoEnvExample.split('\n')) {
      const limpa = linha.trim();
      if (!limpa || limpa.startsWith('#')) continue;
      const temPrefixo = prefixosSegredoReal.some((p) => limpa.includes(p));
      const matchLongo = limpa.match(regexSegredoLongo);
      const ehSegredoLongo = matchLongo
        ? !palavrasPlaceholder.some((p) => matchLongo[1].toLowerCase().includes(p))
        : false;

      if (temPrefixo || ehSegredoLongo) {
        erros.push(
          `Sensor de Variáveis de Ambiente (.env.example):\n` +
          `Detectado valor que parece ser um segredo real no arquivo .env.example: '${limpa}'.\n` +
          `Arquivos de exemplo nunca devem conter credenciais ou segredos de verdade.\n\n` +
          `-> Solução: Substitua o valor por um placeholder seguro (ex: SUA_CHAVE_AQUI, changeme, ou deixe em branco após o '=').`
        );
      }
    }
  }

  if (arquivosProducao.length === 0) return { erros };

  const regexPrefixoPublico = /^(?:NEXT_PUBLIC_|VITE_|EXPO_PUBLIC_|REACT_APP_|PUBLIC_)/;
  const regexNomeSegredo = /(?:SECRET|PRIVATE|SERVICE_ROLE|PASSWORD|SENHA|DATABASE_URL|DB_URL|WEBHOOK_SECRET|ADMIN_KEY|MASTER_KEY)/;
  const validarSegredoEmPrefixoPublico = (nomeVar, origem) => {
    if (regexPrefixoPublico.test(nomeVar) && regexNomeSegredo.test(nomeVar)) {
      erros.push(
        `Vazamento de Segredo em Variável Pública de Frontend (Artigo 4 e Artigo 7):\n` +
        `A variável '${nomeVar}' (${origem}) usa um prefixo exposto no bundle do navegador junto a nome de credencial privada.\n` +
        `Variáveis NEXT_PUBLIC_*, VITE_*, EXPO_PUBLIC_*, REACT_APP_* e PUBLIC_* são embutidas publicamente no código do cliente.\n\n` +
        `-> Solução: Remova o prefixo público da variável sensível e mantenha seu uso exclusivamente no backend/servidor.`
      );
    }
  };

  const variaveisDeclaradas = new Set();
  for (const linha of conteudoEnvExample.split('\n')) {
    const match = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match) {
      validarSegredoEmPrefixoPublico(match[1], '.env.example');
      variaveisDeclaradas.add(match[1]);
    }
  }

  const variaveisIgnoradas = new Set([
    'NODE_ENV', 'CI', 'PATH', 'HOME', 'USERPROFILE', 'TZ', 'LANG', 'PWD',
    'PORT', 'HOST', 'TMP', 'TEMP', 'PROD', 'DEV', 'SSR', 'MODE', 'BASE_URL', 'CLAUDE_PROJECT_DIR',
  ]);
  const regexesVariaveis = [
    /process\.env\.([A-Z0-9_]+)/g,
    /import\.meta\.env\.([A-Z0-9_]+)/g,
    /os\.getenv\(["']([A-Z0-9_]+)["']\)/g,
    /os\.environ\[["']([A-Z0-9_]+)["']\]/g,
    /os\.environ\.get\(["']([A-Z0-9_]+)["']\)/g,
    /std::env::var\(["']([A-Z0-9_]+)["']\)/g,
    /os\.Getenv\(["']([A-Z0-9_]+)["']\)/g,
    /Environment\.GetEnvironmentVariable\(["']([A-Z0-9_]+)["']\)/g,
  ];

  for (const arq of arquivosProducao) {
    const conteudo = lerConteudoAlvo(cwd, arq, modoCi);
    if (!conteudo) continue;
    for (const regex of regexesVariaveis) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(conteudo)) !== null) {
        const nomeVar = match[1];
        if (variaveisIgnoradas.has(nomeVar)) continue;
        validarSegredoEmPrefixoPublico(nomeVar, arq);
        if (!variaveisDeclaradas.has(nomeVar)) {
          erros.push(
            `Sensor de Variáveis de Ambiente (.env.example):\n` +
            `A variável '${nomeVar}' é referenciada no código de produção ('${arq}'), mas não está declarada no arquivo .env.example (ou .env.template).\n\n` +
            `-> Solução: Declare '${nomeVar}=' no arquivo .env.example para documentar a dependência sem expor segredos.`
          );
        }
      }
    }
  }
  return { erros };
}

export function verificarSensorAntiMonolitoComCatraca(cwd, arquivosProducao, modoCi = false) {
  const erros = [];
  const infos = [];
  const valvulas = [];

  for (const arq of arquivosProducao) {
    if (ehArquivoIsentoDeTetoMonolito(arq)) continue;
    const conteudoAlvo = lerConteudoAlvo(cwd, arq, modoCi);
    if (!conteudoAlvo) continue;

    const pontoIndex = arq.lastIndexOf('.');
    const extensao = pontoIndex !== -1 ? arq.slice(pontoIndex) : '';
    const linhasAlvo = contarLinhasUteisCodigo(conteudoAlvo, extensao);
    if (linhasAlvo <= 350) continue;

    if (/governanca:arquivo-extenso-justificado/i.test(conteudoAlvo)) {
      const matchValvula = conteudoAlvo.match(/governanca:arquivo-extenso-justificado\s*[:—-]\s*(\S.{14,})/i);
      if (matchValvula) {
        const motivo = matchValvula[1].trim();
        infos.push(`Válvula de arquivo extenso aceita para '${arq}': "${motivo}"`);
        valvulas.push({ tipo: 'arquivo-extenso-justificado', arquivo: arq, motivo });
        continue;
      }
      erros.push(
        `Válvula de Arquivo Extenso Inválida (Artigo 14):\n` +
        `O arquivo '${arq}' possui ${linhasAlvo} linhas úteis e acionou a válvula 'governanca:arquivo-extenso-justificado', mas o motivo técnico fornecido é insuficiente (< 15 caracteres) ou ausente.\n\n` +
        `-> Solução: Forneça uma justificativa técnica real com no mínimo 15 caracteres (ex.: '// governanca:arquivo-extenso-justificado: parser binário com tabela contígua de transições').`
      );
      continue;
    }

    const conteudoAnterior = lerConteudoAnterior(cwd, arq, modoCi);
    const linhasAnterior = conteudoAnterior ? contarLinhasUteisCodigo(conteudoAnterior, extensao) : 0;

    if (linhasAnterior <= 350 || linhasAlvo > linhasAnterior) {
      const refAnterior = modoCi ? 'HEAD~1' : 'HEAD';
      const refAtual = modoCi ? 'HEAD' : 'staged';
      const motivoCatraca = linhasAnterior > 350
        ? `Arquivo legado que já excedia o teto aumentou de tamanho (catraca: ${refAnterior} tinha ${linhasAnterior} linhas úteis, ${refAtual} foi para ${linhasAlvo}). A catraca proíbe o crescimento de arquivos que já ultrapassaram o teto.`
        : `Arquivo novo ou que cruzou o teto de 350 linhas úteis (${refAnterior} tinha ${linhasAnterior} linhas úteis, ${refAtual} foi para ${linhasAlvo}).`;

      erros.push(
        `Sensor Anti-Monólito e Catraca de Linhas Úteis (Artigo 14):\n` +
        `O arquivo '${arq}' possui ${linhasAlvo} linhas úteis de código, excedendo o teto estrito de 350 linhas úteis.\n` +
        `${motivoCatraca}\n\n` +
        `-> Solução: Decomponha o arquivo em subcomponentes, módulos puros ou Prefabs/Cenas do catálogo de reúso, ou utilize a válvula 'governanca:arquivo-extenso-justificado: <motivo técnico de 15+ caracteres>'.`
      );
    }
  }
  return { erros, infos, valvulas };
}
