# Regras de negócio e cálculos

## Fonte das metas

O Líder Metas é a fonte única dos valores mensais. Para cada mês, a calculadora recebe uma meta para cada combinação de loja e período.

## Dias equivalentes

Para cada loja e período:

```text
dias equivalentes = dias sozinha + (dias em dupla ÷ 2)
```

Assim, um dia em dupla representa metade da responsabilidade de um dia trabalhado sozinha.

## Meta pessoal

Se `D` é a quantidade de dias do mês selecionado, a parcela de cada loja e período é:

```text
parcela = (meta mensal do período ÷ D) × dias equivalentes
```

A **Meta pessoal** é a soma das seis parcelas correspondentes às três lojas e aos dois períodos.

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
- A soma dos dias não pode ultrapassar o número de dias do mês.
- Os dias restantes não podem ultrapassar a escala total nem os dias do mês.
- Entradas inválidas ou negativas impedem o cálculo.
