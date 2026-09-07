# Tecnologias

A aplicação usa uma arquitetura web estática, sem etapa de compilação.

| Tecnologia | Uso no projeto |
|---|---|
| HTML | Estrutura da calculadora e página de redirecionamento administrativo |
| CSS | Aparência, componentes visuais e responsividade |
| JavaScript | Consulta das metas, validações, cálculos e atualização da interface |
| Supabase REST | Leitura controlada das metas mensais por função pública |
| Git e GitHub | Versionamento, revisão por Pull Request, releases e Wiki |
| GitHub Pages | Publicação da aplicação a partir da branch principal |

## Estrutura principal

- `index.html`: estrutura da calculadora;
- `styles.css`: estilos da aplicação;
- `app.js`: regras, validações e apresentação dos resultados;
- `config.js`: configuração pública da integração e seleção de mês e ano;
- `admin.html`: página informativa que direciona a administração de metas para o Líder Metas;
- `favicon.svg`: ícone da aplicação.

## Dependências externas

O projeto não possui gerenciador de pacotes nem dependências instaladas no repositório. A interface utiliza fontes carregadas pelo Google Fonts e dados públicos controlados fornecidos pelo Supabase.
