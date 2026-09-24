# Calculadora de Metas

Aplicação web para acompanhamento de metas pessoais com base na escala de trabalho e nas vendas realizadas no mês.

[Abrir a Calculadora de Metas](https://camila-ubt.github.io/calculo-metas/)

## Recursos principais

- cálculo automático de Meta, Super e Mega;
- escala por loja, período e trabalho sozinha ou em dupla;
- cálculo proporcional para **dias com horário diferente**;
- atualização imediata do **Total na escala** ao adicionar ou remover dias especiais;
- metas carregadas automaticamente do Líder Metas;
- valor restante, percentual alcançado e média necessária por dia restante.

### Dias com horário diferente

Quando um dia não segue o turno normal, a opção **Meu horário foi diferente do turno normal** permite informar a loja, entrada, saída e se o trabalho foi realizado sozinha ou em dupla.

Cada bloco **Dia com horário diferente** representa **1 dia na escala**. Se a vendedora passar por mais de uma loja ou horário no mesmo dia, os horários são adicionados dentro do mesmo bloco e o dia continua contando apenas uma vez. O valor da meta desse dia é calculado proporcionalmente ao tempo trabalhado em cada período configurado no Líder Metas.

## Capturas de tela

### Tela principal

![Tela principal da Calculadora de Metas com agosto de 2026 selecionado](./docs/images/tela-principal.png)

### Resultado do cálculo

![Resultado da Calculadora de Metas com os níveis Meta, Super e Mega](./docs/images/resultado-calculo.png)

## Segurança

- os valores digitados permanecem apenas no navegador;
- respostas públicas do Supabase são validadas antes de entrar nos cálculos;
- a página aplica uma Content Security Policy compatível com a hospedagem estática;
- CodeQL e verificações automáticas analisam alterações antes da publicação;
- apenas a chave publishable do Supabase é utilizada no cliente.

## Documentação

A documentação completa, incluindo guia de uso, regras de cálculo, integração, arquitetura, segurança e histórico de versões, está disponível na [Wiki do projeto](https://github.com/camila-ubt/calculo-metas/wiki).

## Versão atual

**v1.3.0 — Segurança e validação de dados públicos.**
