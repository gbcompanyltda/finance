-- Finance app schema: months + income/expenses/savings/accounts, scoped per user via RLS.

create table if not exists public.months (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  label text not null,
  spending_limits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  month_id text not null,
  name text not null,
  balance numeric not null default 0,
  created_at timestamptz not null default now(),
  foreign key (user_id, month_id) references public.months (user_id, id) on delete cascade
);

create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  month_id text not null,
  description text not null,
  value numeric not null,
  date date not null,
  note text,
  created_at timestamptz not null default now(),
  foreign key (user_id, month_id) references public.months (user_id, id) on delete cascade
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  month_id text not null,
  description text not null,
  value numeric not null,
  date date not null,
  note text,
  kind text not null check (kind in ('fixo', 'variavel')),
  tag text,
  created_at timestamptz not null default now(),
  foreign key (user_id, month_id) references public.months (user_id, id) on delete cascade
);

create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  month_id text not null,
  description text not null,
  value numeric not null,
  date date not null,
  note text,
  account text not null,
  created_at timestamptz not null default now(),
  foreign key (user_id, month_id) references public.months (user_id, id) on delete cascade
);

alter table public.months enable row level security;
alter table public.accounts enable row level security;
alter table public.income enable row level security;
alter table public.expenses enable row level security;
alter table public.savings enable row level security;

create policy "months_owner" on public.months
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "accounts_owner" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "income_owner" on public.income
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "expenses_owner" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "savings_owner" on public.savings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter publication supabase_realtime add table
  public.months, public.accounts, public.income, public.expenses, public.savings;
