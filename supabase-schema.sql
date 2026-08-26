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
    status      text not null default 'pendente' check (status in ('pendente', 'atendido'))
);

-- liga a segurança por linha (RLS) — sem isso, ninguém consegue
-- ler nem escrever nada por padrão
alter table pedidos enable row level security;

-- qualquer visitante do site pode CRIAR um pedido (é o que acontece
-- quando o cliente clica em "Fazer pedido" no cardápio)
create policy "qualquer um pode criar pedido"
    on pedidos for insert
    to anon
    with check (true);

-- só quem estiver logado (o dono, via admin.html) pode VER os pedidos
create policy "só admin logado pode ver pedidos"
    on pedidos for select
    to authenticated
    using (true);

-- só quem estiver logado pode ATUALIZAR o status (marcar como atendido)
create policy "só admin logado pode atualizar pedidos"
    on pedidos for update
    to authenticated
    using (true);

-- ===================================================================
-- Depois de rodar isso, crie o usuário do dono da pizzaria em:
-- Authentication > Users > Add user (defina um e-mail e senha).
-- É esse e-mail/senha que ele vai usar pra entrar em admin.html
-- ===================================================================
