# Calculadora de Metas

Página para calcular metas pessoais de acordo com os dias trabalhados em cada
loja e período. As metas ficam salvas por mês e os cálculos reproduzem a
planilha `Cálculo Meta.xlsx`.

## Regra do cálculo

- Meta pessoal: meta mensal da loja e do período, dividida pela quantidade de
  dias do mês e multiplicada pelos dias da escala.
- Super: 120% da meta pessoal.
- Mega: 130% da meta pessoal.
- Falta por dia: valor que ainda falta dividido pelos dias restantes de
  trabalho.
- Os dias trabalhados sozinha e em dupla são preenchidos separadamente
- Nos dias em dupla, cada vendedora recebe metade da meta diária
  daquele período.
- O total da escala respeita automaticamente a quantidade de dias do mês
  selecionado.
- A administradora pode cadastrar meses novos e corrigir meses já cadastrados.
- As vendedoras escolhem o mês antes de calcular.

## Configurar o Supabase

1. Crie um projeto no Supabase.
2. Abra o **SQL Editor** e execute o arquivo `supabase.sql`.
3. Em **Authentication > Users**, crie o usuário administrativo.
4. Volte ao SQL Editor e execute a última instrução comentada de
   `supabase.sql`, substituindo `SEU_EMAIL` pelo e-mail criado.
5. Em **Project Settings > API**, copie:
   - Project URL;
   - chave `anon` / `publishable`.
6. Preencha `config.js`:

```js
window.APP_CONFIG = {
  supabaseUrl: "SUA_PROJECT_URL",
  supabaseAnonKey: "SUA_CHAVE_ANON",
};
```

A chave pública do Supabase pode ficar no site. A proteção das alterações é
feita pelas políticas RLS do banco; a senha nunca fica no código.

## Publicar no GitHub Pages

1. O repositório precisa estar público no GitHub Free.
2. Abra **Settings > Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione `main`, pasta `/ (root)`, e salve.

O endereço será:

`https://camila-ubt.github.io/calculo-metas/`
