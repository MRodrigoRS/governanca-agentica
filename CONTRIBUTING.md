# Guia de Contribuição e Ritual de Release — Governança

Este documento estabelece as diretrizes de desenvolvimento, governança e o ritual determinístico de publicação de novas versões (releases) do protocolo de Governança Agêntica.

---

## 1. Princípios de Contribuição
- **Test-First Mandatório (Artigo 2):** Todo código de produção deve ser precedido por teste automatizado comprovando falha prévia (Vermelho → Verde → Refatorar).
- **SemVer Estrito:** O projeto adere rigorosamente ao [Versionamento Semântico](https://semver.org/lang/pt-BR/):
  - `MAJOR`: Quebras de contrato ou mudanças estruturais de governança (ex: v4.0.0).
  - `MINOR`: Novas funcionalidades e módulos retrocompatíveis.
  - `PATCH`: Correções de bugs determinísticos.
  - Pré-releases (ex: `v4.0.0-alpha.N`) para ciclos de fatias evolutivas até a consolidação da suíte estável.
- **Português do Brasil no Domínio (Artigo 10):** Mensagens de commit, tabelas, identificadores de negócio e documentação devem ser escritos em PT-BR.

---

## 2. Ritual Oficial de Release

Para publicar uma nova versão oficial ou pré-release do protocolo:

### Passo 1 — Atualização do `package.json`
Atualize a propriedade `version` no arquivo `package.json` da raiz:
```json
{
  "version": "4.0.0-alpha.1"
}
```

### Passo 2 — Atualização do `CHANGELOG.md`
Abra uma nova seção correspondente à versão no `CHANGELOG.md` (no topo, logo abaixo da introdução), detalhando:
- `### Adicionado`
- `### Modificado`
- `### Removido`

### Passo 3 — Execução e Validação das Baterias de Testes
Antes de commitar, execute todas as validações determinísticas locais:
```bash
npm test
npx @fission-ai/openspec validate --all --no-interactive
node template/scripts/verificar-governanca.mjs
```
Todos os comandos devem retornar código de saída 0 com 100% de sucesso.

### Passo 4 — Commit de Release
Realize o commit convencional de release após autorização humana:
```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): publica versao vX.Y.Z"
```

### Passo 5 — Criação da Tag Git
Crie a tag anotada correspondente à versão do `package.json`:
```bash
git tag vX.Y.Z
```
*(Nota: O hook de agente intercepta `git tag` e `git push --tags` com `force_ask` exigindo autorização humana explícita antes do disparo).*

### Passo 6 — Publicação Remota
Envie os commits e as tags para o repositório remoto:
```bash
git push origin feat/planejamento-governanca-v4
git push --tags
```
