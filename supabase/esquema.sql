-- =====================================================================
-- CÓDIGOS CELESTIAIS REVELADOS — banco do painel de administração
--
-- Rode este arquivo UMA VEZ, inteiro, no SQL Editor do Supabase.
-- Ele cria:
--   1. a tabela de administradores (quem pode editar)
--   2. a tabela do conteúdo (os 36 áudios, 36 vídeos e 36 textos)
--   3. as regras de acesso: visitante só lê, administrador escreve
--   4. o espaço para os arquivos enviados (imagens e PDFs)
--   5. as 108 linhas vazias, já numeradas
--
-- Pode rodar de novo sem medo: nada é apagado nem duplicado.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. QUEM PODE ADMINISTRAR
--
-- Troque os três e-mails abaixo pelos e-mails do Google de verdade.
-- Só quem estiver nesta tabela consegue salvar alguma coisa.
-- ---------------------------------------------------------------------

create table if not exists public.admins (
    email     text primary key,
    nome      text,
    criado_em timestamptz not null default now()
);

insert into public.admins (email, nome) values
    ('troque-pelo-email-do-adrian@gmail.com', 'Adrian'),
    ('troque-pelo-email-do-juan@gmail.com',   'Juan'),
    ('troque-pelo-email-do-allan@gmail.com',  'Allan')
on conflict (email) do nothing;


-- ---------------------------------------------------------------------
-- 2. O CONTEÚDO
--
-- Uma linha por espaço do site. A chave é o par (tipo, posição):
-- ('audio', 7) é o sétimo cartão da seção de áudios.
--
--   titulo     o nome que aparece em cima do cartão
--   resumo     a descrição pequena, de 2 ou 3 frases
--   descricao  a descrição maior, que o botão abre
--   midia      o link do YouTube (vídeos) ou o endereço do arquivo
--   imagem     o desenho da capa (só os textos usam)
-- ---------------------------------------------------------------------

create table if not exists public.conteudos (
    tipo            text        not null check (tipo in ('audio', 'video', 'tema')),
    posicao         integer     not null check (posicao between 1 and 200),
    titulo          text        not null default '',
    resumo          text        not null default '',
    descricao       text        not null default '',
    midia           text        not null default '',
    imagem          text        not null default '',
    atualizado_em   timestamptz not null default now(),
    atualizado_por  text,
    primary key (tipo, posicao)
);

-- carimba sozinho quem salvou e quando
create or replace function public.marcar_atualizacao()
returns trigger
language plpgsql
as $$
begin
    new.atualizado_em  := now();
    new.atualizado_por := auth.jwt() ->> 'email';
    return new;
end;
$$;

drop trigger if exists conteudos_marcar_atualizacao on public.conteudos;
create trigger conteudos_marcar_atualizacao
    before update on public.conteudos
    for each row execute function public.marcar_atualizacao();


-- ---------------------------------------------------------------------
-- 3. REGRAS DE ACESSO
--
-- A função abaixo é "security definer" de propósito: ela consulta a
-- tabela de admins passando por cima das regras de acesso. Sem isso, a
-- regra que consulta a tabela cairia nela mesma e nada funcionaria.
-- ---------------------------------------------------------------------

create or replace function public.e_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.admins
        where email = auth.jwt() ->> 'email'
    );
$$;

alter table public.conteudos enable row level security;
alter table public.admins    enable row level security;

-- qualquer visitante do site lê o conteúdo, sem precisar entrar
drop policy if exists "todos leem o conteudo" on public.conteudos;
create policy "todos leem o conteudo"
    on public.conteudos for select
    to anon, authenticated
    using (true);

-- só os administradores salvam
drop policy if exists "admin escreve o conteudo" on public.conteudos;
create policy "admin escreve o conteudo"
    on public.conteudos for all
    to authenticated
    using (public.e_admin())
    with check (public.e_admin());

-- a lista de administradores só se altera aqui no SQL Editor,
-- nunca pelo site: assim ninguém se promove sozinho
drop policy if exists "admin le a lista de admins" on public.admins;
create policy "admin le a lista de admins"
    on public.admins for select
    to authenticated
    using (public.e_admin());


-- ---------------------------------------------------------------------
-- 4. OS ARQUIVOS ENVIADOS (imagens e PDFs)
--
-- O espaço é público para leitura, senão o site não conseguiria mostrar
-- as imagens. Enviar, trocar e apagar, só administrador.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('arquivos', 'arquivos', true)
on conflict (id) do nothing;

drop policy if exists "todos leem os arquivos" on storage.objects;
create policy "todos leem os arquivos"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'arquivos');

drop policy if exists "admin envia arquivos" on storage.objects;
create policy "admin envia arquivos"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'arquivos' and public.e_admin());

drop policy if exists "admin troca arquivos" on storage.objects;
create policy "admin troca arquivos"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'arquivos' and public.e_admin());

drop policy if exists "admin apaga arquivos" on storage.objects;
create policy "admin apaga arquivos"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'arquivos' and public.e_admin());


-- ---------------------------------------------------------------------
-- 5. AS 108 LINHAS VAZIAS
--
-- 36 áudios + 36 vídeos + 36 textos, já numerados, com o título
-- provisório que o site mostra hoje.
-- ---------------------------------------------------------------------

insert into public.conteudos (tipo, posicao, titulo)
select t.tipo, g.posicao, t.rotulo || ' ' || g.posicao
from (values ('audio', 'Áudio'),
             ('video', 'Vídeo'),
             ('tema',  'Texto')) as t(tipo, rotulo),
     generate_series(1, 36) as g(posicao)
on conflict (tipo, posicao) do nothing;


-- ---------------------------------------------------------------------
-- CONFERÊNCIA — rode isto depois para ver se deu tudo certo
-- ---------------------------------------------------------------------

select tipo, count(*) as espacos from public.conteudos group by tipo order by tipo;
select email, nome from public.admins order by nome;
