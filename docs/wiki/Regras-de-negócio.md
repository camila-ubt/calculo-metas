# Regras de negócio e cálculos

## Fonte das metas e horários

O Líder Metas é a fonte única dos valores mensais e dos horários configurados para os períodos da manhã e da noite. Para cada mês, a calculadora recebe uma meta para cada combinação de loja e período.

## Dias equivalentes da escala normal

Para cada loja e período:

```text
dias equivalentes = dias sozinha + (dias em dupla ÷ 2)
```

Assim, um dia em dupla representa metade da responsabilidade de um dia trabalhado sozinha.

## Meta pessoal da escala normal

Se `D` é a quantidade de dias do mês selecionado, a parcela de cada loja e período é:

```text
parcela = (meta mensal do período ÷ D) × dias equivalentes
```

A parte regular da **Meta pessoal** é a soma das seis parcelas correspondentes às três lojas e aos dois períodos.

## Dias com horário diferente

Cada bloco **Dia com horário diferente** representa exatamente **1 dia na escala**. A quantidade de horários dentro do bloco não altera a contagem do dia.

Quando há dois ou mais horários no mesmo dia, cada horário é calculado separadamente e depois somado. Isso permite representar mudanças de loja ou de período no decorrer de uma única jornada sem contar o mesmo dia mais de uma vez.

### Cálculo proporcional por horário

Para cada trecho especial, o sistema identifica quantos minutos pertencem ao período da manhã e quantos pertencem ao período da noite.

Se:

- `D` = quantidade de dias do mês;
- `M` = meta mensal da loja no período da manhã;
- `N` = meta mensal da loja no período da noite;
- `m` = minutos trabalhados dentro da manhã;
- `n` = minutos trabalhados dentro da noite;
- `DM` = duração total configurada para o período da manhã, em minutos;
- `DN` = duração total configurada para o período da noite, em minutos;
- `F` = fator de trabalho (`1` para sozinha e `0,5` para dupla);

então a parcela do horário especial é:

```text
parcela especial = F × [ (M ÷ D) × (m ÷ DM) + (N ÷ D) × (n ÷ DN) ]
```

A meta de um dia especial é a soma de todos os horários informados dentro daquele dia.

```text
meta do dia especial = soma das parcelas especiais do dia
```

A **Meta pessoal total** corresponde à soma da meta da escala normal com as metas dos dias especiais.

## Contagem do Total na escala

```text
Total na escala = dias da escala normal + quantidade de blocos de dias especiais
```

Adicionar ou remover um bloco de dia especial atualiza esse total imediatamente. Adicionar ou remover horários dentro do mesmo bloco não altera a quantidade de dias.

## Super e Mega

```text
Super = Meta pessoal × 1,10
Mega  = Meta pessoal × 1,20
```

Portanto:

- Meta corresponde a 100%;
- Super corresponde a 110%;
- Mega corresponde a 120%.

## Valor restante

```text
valor restante = maior valor entre (objetivo - total vendido) e zero
```

Quando o total vendido alcança o objetivo, o sistema exibe **Alcançada!** e não apresenta valor negativo.

## Percentual e barra de progresso

```text
percentual = (total vendido ÷ objetivo) × 100
```

O texto pode mostrar percentuais superiores a 100%, limitado visualmente a 999%. A barra de progresso é preenchida no máximo até 100%.

## Média por dia restante

```text
média necessária = valor restante ÷ dias que ainda faltam trabalhar
```

Se não houver dias restantes e o objetivo ainda não tiver sido alcançado, o sistema mostra o valor total pendente.

## Validações

- A escala total deve ter pelo menos um dia.
- A soma da escala normal com os dias especiais não pode ultrapassar o número de dias do mês.
- Os dias restantes não podem ultrapassar a escala total nem os dias do mês.
- Cada horário especial deve possuir uma loja selecionada.
- A saída deve ser posterior à entrada.
- Horários especiais do mesmo dia não podem se sobrepor.
- Os horários precisam permanecer dentro dos períodos configurados no Líder Metas.
- Entradas inválidas ou negativas impedem o cálculo.
