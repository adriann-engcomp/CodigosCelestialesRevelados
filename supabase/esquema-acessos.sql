-- =====================================================================
-- CÓDIGOS CELESTIAIS REVELADOS — registro de quem entrou no painel
--
-- Rode este arquivo UMA VEZ no SQL Editor do Supabase, DEPOIS do
-- esquema.sql. Ele cria a lista de acessos que aparece na aba
-- "Quem entrou" do painel: o e-mail de quem entrou e a hora.
--
-- Pode rodar de novo sem medo: nada é apagado nem duplicado.
-- =====================================================================


create table if not exists public.acessos (
    id        bigserial   primary key,
    email     text        not null,
    entrou_em timestamptz not null default now()
);

-- a consulta da aba é sempre "os últimos primeiro"
create index if not exists acessos_por_data on public.acessos (entrou_em desc);

alter table public.acessos enable row level security;


-- Só administrador enxerga a lista. Visitante do site não vê nada:
-- isto é registro interno, não conteúdo da página.
drop policy if exists "admin le os acessos" on public.acessos;
create policy "admin le os acessos"
    on public.acessos for select
    to authenticated
    using (public.e_admin());


-- Cada administrador só consegue registrar o PRÓPRIO acesso: a linha
-- precisa ter o e-mail de quem está entrando. Assim ninguém escreve uma
-- entrada em nome de outra pessoa.
drop policy if exists "admin registra o proprio acesso" on public.acessos;
create policy "admin registra o proprio acesso"
    on public.acessos for insert
    to authenticated
    with check (
        public.e_admin()
        and email = auth.jwt() ->> 'email'
    );


-- REPARE que não existe regra de UPDATE nem de DELETE. Isso é de
-- propósito: pelo site, ninguém consegue alterar nem apagar o registro,
-- nem o próprio. Para limpar a lista (um dia ela cresce), use o SQL
-- Editor, que passa por cima das regras:
--
--     delete from public.acessos where entrou_em < now() - interval '1 year';


-- CONFERÊNCIA
select count(*) as acessos_registrados from public.acessos;
