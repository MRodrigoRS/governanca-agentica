# 0000. Registrar Decisões de Arquitetura Usando MADR

* **Status:** aceito
* **Decisores:** Desenvolvedor Humano e Governança v2
* **Data:** 2026-10-27

## Contexto e Declaração do Problema

Projetos de software com agentes de IA evoluem rapidamente. Sem um registro explícito das decisões técnicas tomadas, o agente (e os desenvolvedores humanos) esquecem o raciocínio por trás de escolhas estruturais, levando a refatorações desnecessárias ou quebras de convenções.

## Forças Impulsionadoras da Decisão (Drivers)

* Necessidade de formato padronizado, legível por humanos e por modelos de IA.
* Zero dependência de ferramentas ou servidores proprietários para manter o histórico (D4, D8).
* Simplicidade de versionamento junto ao código-fonte via Git.

## Opções Consideradas

1. **MADR (Markdown Architectural Decision Records) em `docs/adr/`**
2. Ferramentas CLI proprietárias (`adr-tools`, `adr-log`)
3. Documentação informal em Wiki ou README

## Decisão Tomada

Escolhemos a **Opção 1 (MADR em `docs/adr/`)**, porque é o padrão aberto da indústria, não requer nenhuma ferramenta instalada, utiliza arquivos Markdown puros e versionados, e pode ser facilmente inspecionado e atualizado por agentes e humanos.

### Consequências Positivas

* Memória arquitetural perene no repositório.
* Agentes consultam `docs/adr/` antes de propor alterações de grande impacto (Gate 1).
* Zero atrito de ferramentas: basta copiar `template.md` e preencher.

### Consequências Negativas ou Trade-offs

* Exige disciplina para abrir um ADR sempre que uma decisão estrutural for tomada.
