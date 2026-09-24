# Histórico de versões

## v1.3.0 — Segurança e validação de dados públicos

Publicada em **24 de setembro de 2026**.

- validação do formato das metas e horários recebidos do Supabase;
- recusa de campos inesperados e valores inconsistentes antes dos cálculos;
- Content Security Policy na aplicação estática;
- CodeQL e workflow de segurança adicionados ao repositório;
- testes automatizados para o contrato de dados públicos;
- fórmulas e regras da calculadora preservadas.

## v1.2.0 — Cálculo para dias com horário diferente

Publicada em **13 de setembro de 2026**.

### Novidades

- inclusão da opção **Meu horário foi diferente do turno normal**;
- cálculo proporcional da meta conforme loja, horário trabalhado e períodos configurados no Líder Metas;
- suporte a mais de uma loja ou horário dentro do mesmo dia;
- manutenção do fator de 50% para horários trabalhados em dupla;
- validação de loja obrigatória, limites de horário e sobreposição de trechos.

### Ajustes de interface e estado

- cada bloco **Dia com horário diferente** conta como exatamente 1 dia na escala;
- o **Total na escala** é atualizado imediatamente ao adicionar ou remover dias especiais;
- múltiplos horários dentro do mesmo dia continuam contando como apenas 1 dia;
- o botão **×** remove somente um horário e fica oculto quando existe apenas um;
- **Remover este dia** permite excluir qualquer bloco, inclusive o último;
- resumo dos horários especiais sincronizado em tempo real;
- fórmula principal de Meta, Super e Mega preservada.

### Documentação

- README atualizado;
- guia de uso, funcionalidades e regras de negócio atualizados na Wiki;
- versão exibida no projeto atualizada para v1.2.0.

## v1.1.0 — Acesso ao Cálculo PA e política de segurança

Publicada em **7 de setembro de 2026**.

- Link de acesso ao Cálculo PA na calculadora.
- Política de segurança com orientações para relatar vulnerabilidades.
- Versão e autoria no rodapé, README e Wiki atualizados.

Proteção da `main` verificada: PR obrigatório, sem bypass de administradores, bloqueio de exclusão e de sobrescrita forçada do histórico. Essa configuração pertence ao repositório, não ao pacote da aplicação.

## v1.0.0 — Primeira versão oficial

Primeira versão estável da Calculadora de Metas, publicada em 31 de agosto de 2026.

### Recursos principais

- cálculo automático de Meta, Super e Mega;
- escala dividida por loja, período e trabalho sozinha ou em dupla;
- cálculo do valor restante e da média necessária por dia;
- metas carregadas automaticamente do Líder Metas;
- acompanhamento visual do desempenho;
- interface responsiva;
- publicação pelo GitHub Pages.

### Regras oficiais

- Meta: 100% da meta pessoal;
- Super: 110% da meta pessoal;
- Mega: 120% da meta pessoal.

## Histórico anterior à versão oficial

Antes da v1.0.0, o projeto passou pela centralização do cadastro de metas no Líder Metas, remoção da administração local e substituição de valores fixos pela leitura controlada das metas públicas.

## Releases

Consulte a área de [Releases do repositório](https://github.com/camila-ubt/calculo-metas/releases) para ver as versões oficiais e suas notas.
