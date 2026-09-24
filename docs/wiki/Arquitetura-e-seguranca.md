# Arquitetura e segurança

## Arquitetura

A Calculadora de Metas é uma aplicação estática executada no navegador. Não há servidor próprio nem armazenamento dos dados digitados.

```text
GitHub Pages
  └─ HTML + CSS + JavaScript
       ├─ consulta metas públicas no Supabase
       ├─ recebe somente os valores mensais necessários
       └─ calcula e exibe o resultado no navegador
```

## Fronteiras de dados

- A aplicação faz uma leitura para obter as metas mensais.
- Escala, total vendido e dias restantes não são enviados ao banco na implementação atual.
- Não há login na calculadora.
- Não há gravação em banco ou armazenamento local dos dados do formulário.

## Configuração pública

Como todo o código do navegador é visível, apenas configurações publicáveis podem existir no repositório. A chave de cliente usada pela aplicação não substitui as regras de acesso do banco.

Nunca devem ser incluídos no código ou na Wiki:

- senhas;
- chaves administrativas;
- chave `service_role`;
- tokens pessoais;
- dados reais de clientes ou funcionários.

## Proteção dos dados públicos

A função `metas_publicas()` retorna somente o mês e as seis metas necessárias ao cálculo. O navegador valida esse contrato antes de aceitar a resposta: campos extras, meses inválidos ou duplicados e valores inconsistentes são recusados.

Os horários compartilhados também são validados antes de serem usados nos cálculos especiais.

## Proteção no navegador

A página principal utiliza Content Security Policy para limitar scripts, conexões, fontes e outros recursos. Os scripts executáveis ficam restritos à própria aplicação, e as conexões de dados são limitadas ao projeto Supabase utilizado pela calculadora.

## Proteção do repositório

O repositório público utiliza proteção da branch principal, revisão por Pull Request, CodeQL padrão do GitHub e um workflow de segurança que valida a sintaxe do JavaScript, executa testes e procura padrões de chaves secretas nos arquivos publicados. Segredos não devem ser enviados ao histórico, mesmo quando a proteção de push estiver ativa.

## Dependências externas

A disponibilidade da calculadora depende do GitHub Pages, do serviço de metas e das fontes externas. Uma falha externa deve resultar em mensagem de indisponibilidade, sem exibir detalhes internos para a usuária.
