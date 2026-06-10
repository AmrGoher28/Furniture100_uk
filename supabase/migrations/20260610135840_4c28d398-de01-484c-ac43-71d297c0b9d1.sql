
create table if not exists public.chat_conversations (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users (id) on delete cascade,
  visitor_name    text,
  visitor_email   text,
  status          text not null default 'open' check (status in ('open', 'closed')),
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  last_sender     text not null default 'customer' check (last_sender in ('customer', 'admin'))
);
alter table public.chat_conversations add column if not exists visitor_email text;

grant select, insert, update, delete on public.chat_conversations to authenticated;
grant all on public.chat_conversations to service_role;

create table if not exists public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  sender          text not null check (sender in ('customer', 'admin')),
  body            text not null check (char_length(body) between 1 and 2000),
  created_at      timestamptz not null default now()
);

grant select, insert, update, delete on public.chat_messages to authenticated;
grant all on public.chat_messages to service_role;

create index if not exists chat_messages_conversation_idx
  on public.chat_messages (conversation_id, created_at);
create index if not exists chat_conversations_recent_idx
  on public.chat_conversations (last_message_at desc);

create or replace function public.chat_touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_conversations
     set last_message_at = new.created_at,
         last_sender     = new.sender
   where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists chat_messages_touch on public.chat_messages;
create trigger chat_messages_touch
  after insert on public.chat_messages
  for each row execute function public.chat_touch_conversation();

alter table public.chat_conversations enable row level security;
alter table public.chat_messages      enable row level security;

drop policy if exists "conversations: owner manages own" on public.chat_conversations;
create policy "conversations: owner manages own"
  on public.chat_conversations for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "conversations: admin reads all" on public.chat_conversations;
create policy "conversations: admin reads all"
  on public.chat_conversations for select to authenticated
  using (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role));

drop policy if exists "conversations: admin updates all" on public.chat_conversations;
create policy "conversations: admin updates all"
  on public.chat_conversations for update to authenticated
  using (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role))
  with check (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role));

drop policy if exists "messages: owner reads own" on public.chat_messages;
create policy "messages: owner reads own"
  on public.chat_messages for select to authenticated
  using (exists (
    select 1 from public.chat_conversations c
    where c.id = conversation_id and c.owner_id = auth.uid()
  ));

drop policy if exists "messages: owner sends own" on public.chat_messages;
create policy "messages: owner sends own"
  on public.chat_messages for insert to authenticated
  with check (
    sender = 'customer'
    and exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "messages: admin reads all" on public.chat_messages;
create policy "messages: admin reads all"
  on public.chat_messages for select to authenticated
  using (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role));

drop policy if exists "messages: admin replies" on public.chat_messages;
create policy "messages: admin replies"
  on public.chat_messages for insert to authenticated
  with check (
    sender = 'admin'
    and public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role)
  );

alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_conversations;
