-- ===================================================================
-- Pizzaria do Gordo — tabela de pedidos
-- Como usar: no painel do Supabase, vá em "SQL Editor" > "New query",
-- cole este arquivo inteiro e clique em "Run". Só precisa fazer isso
-- uma vez.
-- ===================================================================

create table if not exists pedidos (
    id          bigint generated always as identity primary key,
    criado_em   timestamptz not null default now(),
    itens       jsonb not null,
    total       numeric,
    status      text not null default 'pendente' check (status in ('pendente', 'atendido'))
);

-- caso a tabela já exista de uma configuração anterior (sem a coluna
-- "total"), esse comando adiciona ela sem apagar nada — pode rodar
-- esse arquivo de novo com segurança
alter table pedidos add column if not exists total numeric;

-- liga a segurança por linha (RLS) — sem isso, ninguém consegue
-- ler nem escrever nada por padrão
alter table pedidos enable row level security;

-- qualquer visitante do site pode CRIAR um pedido (é o que acontece
-- quando o cliente clica em "Fazer pedido" no cardápio)
drop policy if exists "qualquer um pode criar pedido" on pedidos;
create policy "qualquer um pode criar pedido"
    on pedidos for insert
    to anon
    with check (true);

-- só quem estiver logado (o dono, via admin.html) pode VER os pedidos
drop policy if exists "só admin logado pode ver pedidos" on pedidos;
create policy "só admin logado pode ver pedidos"
    on pedidos for select
    to authenticated
    using (true);

-- só quem estiver logado pode ATUALIZAR o status (marcar como atendido)
drop policy if exists "só admin logado pode atualizar pedidos" on pedidos;
create policy "só admin logado pode atualizar pedidos"
    on pedidos for update
    to authenticated
    using (true);

-- ===================================================================
-- AVALIAÇÕES — clientes enviam; o dono aprova antes de publicar
-- ===================================================================
create table if not exists avaliacoes (
    id          bigint generated always as identity primary key,
    criado_em   timestamptz not null default now(),
    nome        text not null check (char_length(nome) between 2 and 60),
    nota        smallint not null check (nota between 1 and 5),
    comentario  text not null check (char_length(comentario) between 10 and 800),
    status      text not null default 'pendente' check (status in ('pendente', 'aprovada'))
);

alter table avaliacoes enable row level security;

drop policy if exists "qualquer um pode enviar avaliação" on avaliacoes;
create policy "qualquer um pode enviar avaliação" on avaliacoes for insert to anon with check (status = 'pendente');
drop policy if exists "visitantes veem avaliações aprovadas" on avaliacoes;
create policy "visitantes veem avaliações aprovadas" on avaliacoes for select to anon using (status = 'aprovada');
drop policy if exists "admin vê avaliações" on avaliacoes;
create policy "admin vê avaliações" on avaliacoes for select to authenticated using (true);
drop policy if exists "admin aprova avaliações" on avaliacoes;
create policy "admin aprova avaliações" on avaliacoes for update to authenticated using (true) with check (true);

-- ===================================================================
-- Depois de rodar isso, crie o usuário do dono da pizzaria em:
-- Authentication > Users > Add user (defina um e-mail e senha).
-- É esse e-mail/senha que ele vai usar pra entrar em admin.html
-- ===================================================================
