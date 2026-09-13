# Funcionalidades

## Metas mensais automáticas

A aplicação consulta os meses disponíveis no Líder Metas e seleciona inicialmente o mês atual quando ele existe. Caso contrário, utiliza o primeiro período disponível.

## Escala por loja e período

A escala normal pode ser informada para três lojas, nos períodos da manhã e da noite. Em cada combinação, os dias são separados entre trabalho individual e trabalho em dupla.

## Dias com horário diferente

A opção **Meu horário foi diferente do turno normal** permite registrar jornadas que não correspondem exatamente ao turno padrão.

Cada bloco de dia especial representa **1 dia na escala**, independentemente da quantidade de horários informados dentro dele. É possível registrar mais de uma loja ou faixa de horário no mesmo dia sem duplicar sua contagem.

O sistema mantém o estado sincronizado em tempo real:

- adicionar um dia especial aumenta imediatamente o **Total na escala**;
- remover um dia especial diminui imediatamente o total;
- adicionar ou remover horários dentro do mesmo dia não altera a quantidade de dias;
- o resumo dos dias especiais é atualizado sem depender do botão de cálculo.

## Cálculo proporcional por horário

Para jornadas especiais, a meta do dia é calculada proporcionalmente ao tempo trabalhado em cada período configurado no Líder Metas. Caso o horário atravesse mais de um período, cada parte é considerada na respectiva meta mensal.

O trabalho em dupla continua utilizando fator de 50% também nos horários especiais.

## Peso diferente para dias em dupla

Um dia trabalhado sozinha conta como um dia completo na composição da meta pessoal. Um dia em dupla conta como metade de um dia equivalente.

## Três níveis de objetivo

O sistema calcula automaticamente:

- Meta;
- Super;
- Mega.

## Acompanhamento do resultado

Para cada nível, a aplicação apresenta:

- valor do objetivo pessoal;
- percentual já alcançado;
- valor restante;
- valor médio necessário por dia futuro;
- barra visual de progresso.

## Mensagem de situação

Depois do cálculo, uma mensagem resume o estágio atual: objetivo alcançado, ritmo compatível com a Meta ou necessidade de acelerar o desempenho.

## Limites conforme o calendário

Os campos de dias respeitam a quantidade real de dias do mês selecionado, inclusive fevereiro e anos bissextos. A soma da escala normal com os dias de horário diferente também respeita esse limite.

## Formatação e responsividade

Os valores monetários são exibidos em reais. A interface se adapta a computadores e dispositivos móveis e permite fechar o resultado com o botão próprio ou com a tecla **Esc**.

## O que a calculadora não faz

- Não cadastra nem altera metas.
- Não salva a escala ou as vendas digitadas.
- Não consulta usuários, perfis ou vendas do Líder Metas.
- Não substitui o fechamento oficial das vendas.
