# Tarefas de Implementação — `fatia-10-reuso-tokens-movimento-e-component-as-asset`

- [x] **1. Test-First Mandatório (`tests/reuso-e-modularizacao.test.mjs` — Ciclo Vermelho):**
  - [x] 1.1. Escrever Teste 1 falhando (Vermelho): bloqueio de arquivo novo ou que cruza 350 linhas úteis em `.tsx` e `.gd`.
  - [x] 1.2. Escrever Teste 2 falhando (Vermelho): mecanismo de catraca em arquivo legado extenso (> 350 linhas em HEAD).
  - [x] 1.3. Escrever Teste 3 falhando (Vermelho): isenção de comentários sensível à linguagem (`#` vs. `//`, atributos `#[derive]` e `#region`).
  - [x] 1.4. Escrever Teste 4 falhando (Vermelho): válvula de exceção justificada (rejeita vazia, aceita com motivo técnico >= 15 chars).
  - [x] 1.5. Escrever Teste 5 falhando (Vermelho): classificação de GDScript (`.gd` de produção vs. testes GUT `test_*.gd`).
  - [x] 1.6. Escrever Teste 6 falhando (Vermelho): sensor anti-apodrecimento do catálogo (bloqueia remoção sem sync e ponteiro quebrado).
  - [x] 1.7. Escrever Teste 7 falhando (Vermelho): presença de `catalogo-reuso.md`, skill, wrappers `/auditar-reuso`, Artigo 14 e paridade no Inspetor.
- [x] **2. Emenda Constitucional, Regras e Instruções:**
  - [x] 2.1. Atualizar `template/constitution.md` com Artigo 14 (*Reuse-Before-Create* e *Component-as-Asset*) como extensão do Artigo 1.2.
  - [x] 2.2. Atualizar `template/.agents/rules/web-ui-pwa.md` e `jogos-engines.md` com as diretrizes de Component-as-Asset e tokens de movimento.
  - [x] 2.3. Atualizar `template/AGENTS.md` e `copier.yml` adicionando `docs/catalogo-reuso.md` em `_skip_if_exists`.
- [x] **3. Catálogo Vivo, Skill e Comandos:**
  - [x] 3.1. Criar `template/docs/catalogo-reuso.md` com as 4 tabelas canônicas e ponteiros de 1 linha.
  - [x] 3.2. Criar `template/.agents/skills/reuso-e-modularizacao/SKILL.md` detalhando modos preventivo e corretivo (Web e Engines).
  - [x] 3.3. Criar wrappers do comando `/auditar-reuso` nos 3 harnesses (`.claude/commands/`, `.github/prompts/`, `.cursor/commands/`).
  - [x] 3.4. Atualizar skills `inicializar-stack`, `ciclo-especificacao`, `revisar-fatia` e os 3 perfis do Inspetor Forense.
- [x] **4. Sensores Determinísticos em `verificar-governanca.mjs`:**
  - [x] 4.1. Atualizar `classificar-arquivos.mjs` para incluir `.gd` em arquivos de produção (exceto testes GUT).
  - [x] 4.2. Implementar `contarLinhasUteisCodigo` sensível à linguagem e `ehArquivoIsentoDeTetoMonolito`.
  - [x] 4.3. Implementar a catraca de 350 linhas úteis com suporte à válvula justificada em `verificar-governanca.mjs`.
  - [x] 4.4. Implementar o sensor anti-apodrecimento do catálogo de reúso.
- [x] **5. Ciclo Verde e Validação Final:**
  - [x] 5.1. Executar `node --test tests/reuso-e-modularizacao.test.mjs` garantindo aprovação dos 7 testes.
  - [x] 5.2. Executar suíte completa `npm test` e `npx @fission-ai/openspec validate --all --no-interactive`.
  - [x] 5.3. Atualizar `00_INDICE_E_DECISOES.md` (D36) e `CHANGELOG.md`.

## Notas de Sessão
- **Decisões fora do plano:** nenhuma; implementação 100% aderente à especificação da Fatia 10.
- **Bloqueios abertos:** nenhum.
- **Próximo passo:** Realizar a auditoria factual cega com o Subagente Inspetor Forense e apresentar o Gate 2 para commit.

## Roteiro de Validação Prática

### O que validar no Gate 2:
1. **Catraca Anti-Monólito:**
   - Criar arquivo com mais de 350 linhas e verificar bloqueio.
   - Modificar arquivo legado mantendo tamanho e verificar aprovação.
2. **Sensor do Catálogo:**
   - Remover arquivo referenciado no catálogo sem atualizar o catálogo e verificar bloqueio.
3. **Paridade nos Harnesses:**
   - Verificar wrappers de `/auditar-reuso` em Claude Code, GitHub Copilot e Cursor.
