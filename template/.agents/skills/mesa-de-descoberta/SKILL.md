---
name: mesa-de-descoberta
description: Ativa a Mesa de Descoberta Contínua (/descobrir ou /mesa) para sessões longas ou infinitas de perguntas, reflexão multi-especialista e cristalização incremental de regras de negócio e arquitetura em capítulos .md sob docs/conhecimento/, com permissão humana explícita a cada gravação.
---

# Skill: Mesa de Descoberta Contínua e Livro de Conhecimento (`mesa-de-descoberta`)

Esta skill coloca o agente em **Modo de Descoberta Contínua e Cristalização Incremental**. Diferente de uma entrevista curta para fechar escopo agora (`refinar-ideia`) ou de uma reunião única de mercado (`explorar-produto`), ela sustenta um **diálogo infinito de amadurecimento** onde humano e agente refletem, questionam premissas e constroem um **livro vivo de conhecimento** em `docs/conhecimento/` — pronto para alimentar mega-planos de desenvolvimento, **NotebookLM**, grafos no **Obsidian** e diagramas **Mermaid**.

> **CONGELAMENTO ESTRITO DE CÓDIGO (REGRA DE OURO):**
> Enquanto esta skill estiver ativa, é **terminantemente proibido** criar ou editar código de produção, alterar schemas de banco ou abrir pastas em `openspec/changes/`. Toda a energia da sessão é dedicada exclusivamente a pensar o sistema, testar hipóteses e registrar conhecimento aprovado.

> **SEPARAÇÃO DE FONTE ÚNICA (Livro *Upstream* vs. OpenSpec):**
> O diretório `docs/conhecimento/` é uma **camada *upstream* de descoberta, reflexão e memória estratégica**. Ele **não concorre** com `openspec/specs/` nem com `openspec/roadmap.md`: capítulos salvos ali não obrigam implementação nem disparam contrato de execução até serem explicitamente promovidos ao roadmap pelo usuário.

---

## Quando Acionar (Gatilho Automático vs. Manual)

1. **Gatilho Automático (Greenfield / Ausência de Produto):** Quando a governança detectar que o repositório não possui produto nem stack definidos, esta skill é **ativada automaticamente** em conjunto com `.agents/skills/inicializar-stack/SKILL.md` logo no início da entrevista. Cada tema consolidado durante as rodadas de descoberta é extraído (com permissão humana) para arquivos separados em `docs/conhecimento/<NN>-<slug>.md`, permitindo que o agente faça **leitura física** desses arquivos ao gerar o Gate 0 — sem depender da memória do chat e evitando esquecimento ou alucinação ao elaborar o plano.
2. **Gatilho Manual (`/descobrir` ou `/mesa`):** Acionada sob demanda a qualquer momento em projetos em andamento para escalar o produto, explorar novos domínios ou simular mesas multi-especialista sem alterar código.

---

## Passo 0 — Abertura e Continuidade Multi-Sessão (Anti-*Context Rot*)

Sessões infinitas atravessam múltiplas conversas e comandos `/compact`. Nunca dependa da memória do chat ao iniciar ou retomar a mesa:
1. Leia obrigatoriamente `docs/conhecimento/INDICE.md` para carregar o mapa completo dos capítulos já cristalizados e a seção **Fios em Aberto e Próximas Perguntas**.
2. Se o repositório já tiver `openspec/project.md` e `openspec/roadmap.md`, leia-os rapidamente para conhecer o que já está definido ou descartado.
3. **Leitura Seletiva Sob Demanda:** Abra apenas os capítulos `docs/conhecimento/<NN>-<slug>.md` ligados ao tema que será debatido agora, preservando a janela de contexto limpa.
4. Apresente em poucas linhas onde o livro está hoje e proponha retomar um dos **Fios em Aberto** ou abrir um novo eixo sugerido pelo usuário.

---

## Passo 1 — Loop Infinito de Reflexão Multi-Especialista (Modelo Híbrido)

Conduza a sessão como um **loop contínuo de perguntas e aprofundamento** que só termina quando o humano pedir expressamente para encerrar ou promover descobertas para execução. Nunca "apresse" o fechamento nem proponha começar a codar por conta própria.

### 1.1 Participação Ativa do Agente e Alternância de Lentes Especialistas (Fluxo Padrão)
Na mesa, o agente **não é um simples anotador passivo**: ele deve participar intensamente do debate aplicando o **Dever de Crítica** (sem bajulação), realizando:
- **Perguntas investigativas profundas:** puxar premissas ocultas, casos de borda, dependências e impactos colaterais.
- **Triagens ativas:** organizar o caos das ideias separando o que é tese central, o que é regra obrigatória, o que é hipótese futura e o que merece corte.
- **Apontamento de contradições:** confrontar a ideia atual com regras já consolidadas em capítulos anteriores de `docs/conhecimento/` ou com restrições reais de arquitetura, custo e segurança.
- **Pesquisa de mercado e Pesquisa Viva em tempo real:** usar busca web, `context7` ou `/llms.txt` sempre que enriquecer o debate com referências de concorrentes, benchmarks, tendências, custos ou viabilidade técnica real.

Em cada turno, assuma explicitamente uma ou mais lentes especialistas relevantes para o assunto:

- `[Produto]`: proposta de valor, dor real do usuário, jornada, retenção e corte de complexidade inútil.
- `[Arquitetura]`: fronteiras de módulos, acoplamento, assincronismo, contratos de API e evoluções futuras.
- `[Dados & Escala]`: modelagem de entidades, consistência, índices, volume, concorrência e custos de consulta.
- `[Segurança]`: superfície de ataque, Zero-Trust, controle de acesso, privacidade/LGPD e falhas de autorização.
- `[UX]`: clareza de fluxos, linguagem humana, estados de borda, fricção cognitiva e acessibilidade.
- `[Negócio]`: regras financeiras/fiscais, precificação, unit economics, exceções operacionais e compliance.

### 1.2 Painel de Subagentes Especialistas (Sob Demanda)
Quando um tópico atingir alta densidade técnica, envolver conflito entre especialidades ou apresentar um impasse difícil:
- Proponha ao usuário (ou execute quando solicitado) uma **rodada de painel com subagentes *read-only* em paralelo**, atribuindo a cada subagente uma lente específica (ex.: um avalia `[Dados & Escala]`, outro `[Segurança]`, outro `[Produto]`) sobre os arquivos do repositório e os capítulos relevantes de `docs/conhecimento/`.
- Traga as divergências e sínteses desses pareceres de volta para a mesa debater com o usuário antes de concluir qualquer ponto.

### 1.3 Ritmo Contínuo do Turno
Termine **todo turno** de diálogo com:
1. As tensões ou implicações descobertas sob as lentes utilizadas.
2. **2 a 4 perguntas abertas ou provocativas** (ou opções com recomendação `➡️` quando houver decisão técnica clara) para puxar a próxima camada de profundidade sem perder o fio da conversa.

---

## Passo 2 — Cristalização Incremental com Permissão Explícita (Sem Teto de Arquivos)

Nenhuma conclusão madura pode se perder no histórico longo do chat — tentar lembrar tudo de cabeça ao montar um plano gera esquecimento e alucinação. Por isso, **não existe teto de quantidade de arquivos ou capítulos**: o livro cresce em quantos arquivos `.md` separados em `docs/conhecimento/` forem necessários até o usuário se considerar satisfeito (mantendo cada tema isolado e legível em disco), mas **é proibido gravar ou sobrescrever capítulos silenciosamente**:

1. **Proposta Curta de Extração:** Sempre que você e o usuário convergirem em uma regra de negócio, modelo conceitual, política ou decisão reflexiva importante, proponha ao final do turno em 1–2 linhas:
   > *"Chegamos a uma síntese sólida sobre **<tema>**. Posso extrair este bloco para `docs/conhecimento/<NN>-<slug>.md` e atualizar `docs/conhecimento/INDICE.md`?"*
2. **Gravação Autorizada:** Somente após a **permissão explícita** do usuário, crie (ou atualize) o arquivo `docs/conhecimento/<NN>-<slug>.md`.

### 2.1 Molde Padronizado do Capítulo (Compatível com NotebookLM, Obsidian e Mermaid)
Cada capítulo extraído deve seguir esta estrutura enxuta e interconectada com links relativos Markdown:

```markdown
---
id: "<NN>-<slug>"
tema: "<Título claro do tema>"
especialidade: ["Produto", "Arquitetura"]
status: rascunho # rascunho | consolidado | promovido
relacionados: ["<XX>-<outro-slug>"]
---

# <NN> — <Título do Capítulo>

## Contexto e Pergunta Central
Qual problema, dúvida ou cenário motivou esta reflexão e quais premissas foram assumidas.

## Conclusões e Regras de Negócio
Lista objetiva das decisões, invariantes, exceções e exemplos concretos acordados na mesa.

## Trade-offs e Alternativas Descartadas
O que foi considerado e rejeitado, com o porquê (evita rediscutir o mesmo caminho no futuro).

## Conexões e Fios em Aberto
- Relacionado a: [Título do Capítulo Relacionado](./<NN>-<slug>.md)
- Perguntas pendentes para sessões futuras:
  - [ ] <Fio em aberto 1>
```

### 2.2 Sincronia Obrigatória do Índice Mestre (`docs/conhecimento/INDICE.md`)
Sempre que um capítulo for gravado ou atualizado com permissão do usuário, atualize na mesma ação `docs/conhecimento/INDICE.md`:
1. Adicione ou atualize a linha correspondente na tabela **Sumário de Capítulos**.
2. Atualize o bloco **Grafo de Relações** em **Mermaid** ligando os capítulos por dependência ou afinidade conceitual.
3. Atualize a seção **Fios em Aberto e Próximas Perguntas** (marcando perguntas resolvidas e registrando novas lacunas surgidas na conversa).

---

## Passo 3 — Ponte Opcional para Execução (Promoção para o Roadmap)

Quando o usuário decidir encerrar uma etapa de descoberta ou pedir *"vamos transformar os capítulos X e Y em plano de execução"* / *"promover para o roadmap"*:

1. Confirme com o usuário **quais capítulos ou subconjuntos** devem ser promovidos para construção (mantendo ideias ainda especulativas no livro sem poluir a fila de entrega).
2. Decomponha o escopo promovido em blocos no arquivo único `openspec/roadmap.md`, respeitando estritamente as 4 âncoras auditadas pela governança:
   ```markdown
   ### [ ] Pendente — `fatia-XX-<slug>`
   - **Depende de:** `fatia-YY-<slug>`
   - **Objetivo de Valor:** [Valor funcional extraído do capítulo correspondente]
   - **Fontes de Conhecimento:** [Capítulo NN](../docs/conhecimento/<NN>-<slug>.md)
   - **O que ENTRA:**
     1. [Regra / comportamento 1]
     2. [Regra / comportamento 2]
   - **O que FICA DE FORA:** [Cortes acordados e hipóteses deixadas no livro]
   ```
3. Atualize o campo `status: promovido` no frontmatter dos capítulos promovidos (e na tabela de `docs/conhecimento/INDICE.md`), preservando todo o histórico reflexivo intacto como referência rica para quando as fatias forem especificadas no OpenSpec.
