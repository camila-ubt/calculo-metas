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

## Proteção no banco

A função pública deve continuar retornando somente os campos estritamente necessários para o cálculo. Alterações nessa função precisam ser revisadas para evitar a exposição de vendas, perfis ou outras tabelas internas.

## Proteção do repositório

O repositório público utiliza proteção da branch principal, revisão por Pull Request e recursos de análise de segurança disponíveis no GitHub. Segredos não devem ser enviados ao histórico, mesmo quando a proteção de push estiver ativa.

## Dependências externas

A disponibilidade da calculadora depende do GitHub Pages, do serviço de metas e das fontes externas. Uma falha externa deve resultar em mensagem de indisponibilidade, sem exibir detalhes internos para a usuária.
