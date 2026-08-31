# Calculadora de Metas

Página criada para as vendedoras acompanharem suas metas pessoais de forma simples, considerando a escala de trabalho e as vendas realizadas no mês.

## Versão atual

**v1.0.0 — Primeira versão oficial**

Esta versão marca a primeira versão estável da Calculadora de Metas, com as principais funcionalidades necessárias para o acompanhamento das metas pessoais das vendedoras.

Principais recursos desta versão:

- cálculo automático de Meta, Super e Mega;
- divisão da escala por loja e período;
- cálculo para dias trabalhados sozinha ou em dupla;
- valor restante para atingir cada objetivo;
- média necessária por dia restante;
- metas carregadas automaticamente do Líder Metas;
- acompanhamento visual do desempenho.

## Integração com o Líder Metas

O **Líder Metas é a única fonte de cadastro das metas**.

A Calculadora consulta automaticamente, no Supabase do Líder Metas, os valores cadastrados por:

- mês;
- loja;
- período da manhã;
- período da noite.

Não existe mais uma área independente de cadastro dentro da Calculadora. Para alterar qualquer valor, é necessário entrar no Líder Metas e usar a aba **Metas**.

A leitura pública da Calculadora recebe somente os seis valores mensais necessários para o cálculo. Vendas, usuários, perfis e demais informações do sistema não são disponibilizados.

## Funcionalidades

- Seleção do mês das metas
- Metas carregadas automaticamente do Líder Metas
- Escala dividida por loja, período e dias trabalhados sozinha ou em dupla
- Cálculo automático da Meta, Super e Mega
- Valor que ainda falta alcançar
- Média necessária por dia restante
- Acompanhamento visual do desempenho
- Limite de dias conforme o mês selecionado

## Regras do cálculo

- A meta mensal de cada loja e período é dividida pela quantidade de dias do mês
- Cada dia trabalhado sozinha recebe a meta diária completa
- Cada dia trabalhado em dupla recebe metade da meta diária
- Meta corresponde a 100% da meta pessoal
- Super corresponde a 110% da meta pessoal
- Mega corresponde a 120% da meta pessoal

## Lojas

- Clube Bijoux — CB
- Arte Acessórios — AA
- Adoro Bijoux — AB

## Acesso

[Abra a Calculadora de Metas](https://camila-ubt.github.io/calculo-metas/)

[Abra o Líder Metas](https://metas-lider.vercel.app/)
