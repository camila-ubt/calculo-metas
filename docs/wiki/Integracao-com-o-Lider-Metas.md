# Integração com o Líder Metas

## Fonte única de cadastro

O **Líder Metas** é a única fonte de cadastro e alteração das metas. A Calculadora de Metas apenas consulta os valores necessários para realizar os cálculos.

[Abrir o Líder Metas](https://metas-lider.vercel.app/)

Para cadastrar ou corrigir uma meta, entre no Líder Metas, abra a aba **Metas** e selecione o mês desejado. A calculadora não possui uma área própria de edição.

## Fluxo dos dados

```text
Líder Metas → banco de dados → função metas_publicas → Calculadora de Metas
```

Ao abrir a calculadora:

1. a aplicação consulta a função pública `metas_publicas`;
2. recebe os meses disponíveis e os seis valores mensais usados no cálculo;
3. seleciona o mês atual, quando disponível;
4. atualiza os seletores e os limites de dias;
5. utiliza os valores somente no navegador para calcular a meta pessoal.

## Dados disponibilizados

A leitura pública fornece apenas:

- o mês de referência;
- as metas das três lojas;
- os valores separados entre manhã e noite.

Vendas, usuários, perfis e demais informações internas do Líder Metas não fazem parte dessa resposta.

## Indisponibilidade

Se a configuração estiver ausente, a função não responder ou não houver metas cadastradas, o seletor mostra **Metas indisponíveis** e o cálculo é bloqueado. Nesse caso, confirme primeiro se o mês foi cadastrado no Líder Metas e tente novamente.

## Segurança da integração

A aplicação pública utiliza somente uma credencial publicável de cliente. Ela nunca deve receber senha de banco, chave administrativa ou `service_role`. A proteção dos dados depende das permissões restritas da função pública e das políticas do banco.
