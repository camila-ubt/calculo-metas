## v1.2.0 — Cálculo para dias com horário diferente

Publicada em **13 de setembro de 2026**.

Esta versão adiciona suporte a jornadas que não seguem exatamente os turnos normais da escala.

### Novidades

- opção **Meu horário foi diferente do turno normal**;
- cálculo proporcional da meta conforme loja, horário trabalhado e períodos configurados no Líder Metas;
- suporte a dois ou mais horários/lojas dentro do mesmo dia sem duplicar sua contagem;
- trabalho em dupla continua com fator de 50%;
- validação de loja, horários e sobreposição de trechos.

### Correções e melhorias

- cada bloco **Dia com horário diferente** passa a contar como exatamente **1 dia na escala**;
- o **Total na escala** é atualizado imediatamente ao adicionar ou remover um dia especial;
- adicionar ou remover horários dentro do mesmo dia não altera a quantidade de dias;
- o botão **×** remove somente um horário e fica oculto quando existe apenas um;
- **Remover este dia** funciona inclusive quando é o último bloco especial;
- resumo e total permanecem sincronizados sem depender de **Calcular minhas metas**;
- fórmula principal de Meta, Super e Mega permanece inalterada.

### Documentação

README e Wiki atualizados com instruções de uso, funcionalidades, regras de negócio e fórmula do cálculo proporcional.
