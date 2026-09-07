# Operação e manutenção

## Atualizar metas mensais

As metas devem ser cadastradas ou alteradas somente no Líder Metas. Depois da atualização, abra novamente a Calculadora de Metas e confira se o mês aparece no seletor.

## Publicação da aplicação

A aplicação é publicada pelo GitHub Pages a partir da raiz da branch `main`. Uma alteração aprovada e incorporada à branch principal é publicada pelo GitHub.

Antes de concluir uma alteração:

1. confira a calculadora em tela grande e em celular;
2. teste mês com 28, 30 e 31 dias quando a mudança envolver calendário;
3. teste escala individual e em dupla;
4. verifique Meta, Super e Mega;
5. confirme mensagens de validação e indisponibilidade;
6. confira se nenhum segredo ou dado real foi incluído.

## Fluxo recomendado de mudança

1. Criar uma branch a partir da `main` atualizada.
2. Fazer uma alteração pequena e bem descrita.
3. Abrir um Pull Request.
4. Revisar o conteúdo e as verificações automáticas.
5. Incorporar o Pull Request somente após a conferência.
6. Validar a versão publicada.

## Versionamento

Versões estáveis devem receber uma tag no formato `vX.Y.Z` e uma Release com resumo das mudanças. A documentação deve ser atualizada no mesmo ciclo quando uma funcionalidade ou regra mudar.

## Pontos que exigem atenção

- Mudanças nos percentuais de Super ou Mega exigem atualização do código e da Wiki.
- Mudanças no formato retornado por `metas_publicas` podem impedir o carregamento das metas.
- Novas lojas ou períodos exigem atualização coordenada no Líder Metas e na calculadora.
- A página `admin.html` é apenas informativa e direciona a administração para o Líder Metas.

## Diagnóstico rápido

| Sintoma | Verificação inicial |
|---|---|
| Mês não aparece | Confirmar se existe meta cadastrada para o período |
| “Metas indisponíveis” | Verificar disponibilidade do serviço e permissões da função pública |
| Meta pessoal inesperada | Conferir se a escala completa foi informada e se dias em dupla foram separados |
| Média diária inesperada | Conferir total vendido e somente os dias futuros no campo de dias restantes |
| Página antiga após publicação | Aguardar a atualização do GitHub Pages e recarregar a página |
