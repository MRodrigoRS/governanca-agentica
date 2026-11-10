# Proposta de Mudança — `fatia-10-reuso-tokens-movimento-e-component-as-asset`

## Why
Projetos de software desenvolvidos com assistência de agentes de IA sofrem frequentemente de deriva estética/cinética e da criação de arquivos monolíticos (telas e cenas de jogos com centenas de linhas contendo regras, animações e layouts duplicados). Sem um mecanismo preventivo e determinístico de reúso (*Reuse-Before-Create* e *Component-as-Asset*), o agente tende a reinventar botões, inputs, modais e transições inline a cada nova tela, além de inchar arquivos legados. Esta fatia institui a disciplina de tokens de movimento, um catálogo vivo e enxuto de ponteiros protegidos contra apodrecimento, e um sensor anti-monólito com catraca de linhas úteis para blindar o repositório sem engessar correções pontuais em código legado.

## What Changes
1. **Artigo 14 na Constituição (`template/constitution.md`):** Institui o princípio *Reuse-Before-Create* como extensão do Artigo 1.2 (Design System Modular) e detalha o conceito *Component-as-Asset* em `template/.agents/rules/` (`web-ui-pwa.md` e `jogos-engines.md`), tornando obrigatória a definição de Tokens Base (cores, tipografia, durações e curvas de animação) na Fatia 01.
2. **Catálogo Vivo de Ponteiros (`template/docs/catalogo-reuso.md`):** Criação de documento enxuto (1 linha por ponteiro em 4 tabelas canônicas) protegido no `copier.yml` (`_skip_if_exists`), integrado a um sensor determinístico anti-apodrecimento (bloqueia remoções de caminhos catalogados sem atualização do catálogo e rejeita ponteiros quebrados).
3. **Skill e Comandos de Reúso:** Criação de `template/.agents/skills/reuso-e-modularizacao/SKILL.md` e wrappers de comando `/auditar-reuso` nos 3 harnesses (Claude Code, Copilot, Cursor), com paridade tripla de auditoria nos perfis do Inspetor Forense.
4. **Sensor Anti-Monólito com Catraca em `verificar-governanca.mjs`:** Teto de 350 linhas úteis de código com contagem sensível à linguagem (reconhece `.gd` como produção, ignora comentários específicos de cada linguagem e preserva atributos em Rust e diretivas em C#), operando com catraca inteligente (permite correções em arquivos legados > 350 linhas desde que não aumentem de tamanho) e válvula formal de exceção justificada.

## Out of Scope
- Parsers pesados de AST externos no verificador local (manter verificação determinística pura em Node.js com tempo de execução inferior a 50ms).
- Bloqueio regex cego de cores hexadecimais em arquivos de estilos ou mocks (evitar falsos positivos em SVGs e paletas).
- Exigência burocrática de catalogar 100% dos componentes de telas específicas (o catálogo destina-se apenas a primitivos, tokens, prefabs e utilitários compartilhados).
