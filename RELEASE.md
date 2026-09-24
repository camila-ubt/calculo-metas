## v1.3.0 — Segurança e validação de dados públicos

Publicada em **24 de setembro de 2026**.

Esta versão reforça a validação dos dados públicos usados pela Calculadora de Metas e adiciona verificações automáticas de segurança, sem alterar as fórmulas de Meta, Super e Mega.

### Validação dos dados

- respostas da função pública de metas passam a aceitar somente os campos esperados;
- meses duplicados, formatos inválidos e valores negativos ou não numéricos são recusados;
- horários recebidos do Líder Metas também são validados antes do cálculo;
- a configuração pública do Supabase é verificada antes das consultas.

### Navegador

- Content Security Policy adicionada à página principal;
- carregamento de scripts restrito à própria aplicação;
- conexões de dados restritas ao projeto Supabase utilizado pela calculadora;
- política de referência adicionada às páginas públicas.

### Repositório

- novo workflow de segurança e qualidade;
- testes automatizados para o contrato dos dados públicos;
- CodeQL padrão do GitHub mantido para análise do JavaScript;
- verificação automática contra padrões de chaves secretas em arquivos publicados.

### Regras preservadas

- fórmula de Meta, Super e Mega permanece inalterada;
- cálculo proporcional de dias com horário diferente permanece inalterado;
- valores informados pela usuária continuam sem ser enviados ou salvos no banco.
