-- Execute este arquivo no SQL Editor de um projeto novo do Supabase.

create table if not exists public.metas_mensais (
  mes date primary key,
  cb_manha numeric(12,2) not null check (cb_manha >= 0),
  cb_noite numeric(12,2) not null check (cb_noite >= 0),
  aa_manha numeric(12,2) not null check (aa_manha >= 0),
  aa_noite numeric(12,2) not null check (aa_noite >= 0),
  ab_manha numeric(12,2) not null check (ab_manha >= 0),
  ab_noite numeric(12,2) not null check (ab_noite >= 0),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.metas_mensais enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Metas visíveis para todos" on public.metas_mensais;
create policy "Metas visíveis para todos"
on public.metas_mensais
for select
to anon, authenticated
using (true);

drop policy if exists "Administrador cadastra metas" on public.metas_mensais;
create policy "Administrador cadastra metas"
on public.metas_mensais
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Administrador atualiza metas" on public.metas_mensais;
create policy "Administrador atualiza metas"
on public.metas_mensais
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

insert into public.metas_mensais (
  mes,
  cb_manha,
  cb_noite,
  aa_manha,
  aa_noite,
  ab_manha,
  ab_noite
)
values (
  '2026-07-01',
  12000,
  18000,
  18000,
  27000,
  16800,
  25200
)
on conflict (mes) do update set
  cb_manha = excluded.cb_manha,
  cb_noite = excluded.cb_noite,
  aa_manha = excluded.aa_manha,
  aa_noite = excluded.aa_noite,
  ab_manha = excluded.ab_manha,
  ab_noite = excluded.ab_noite,
  atualizado_em = now();

-- Depois de criar seu usuário em Authentication > Users, execute:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'SEU_EMAIL';
