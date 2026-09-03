-- Run this in the Supabase SQL Editor.

create table if not exists payment_plans (
  id uuid primary key default gen_random_uuid(),
  flw_plan_id text unique not null,
  amount numeric not null,
  currency text not null,
  interval text not null check (interval in ('weekly', 'monthly')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  tx_ref text unique not null,
  flw_transaction_id text,
  flw_plan_id text,
  amount numeric not null,
  currency text not null,
  country text,
  frequency text not null default 'one_time' check (frequency in ('one_time', 'recurring')),
  payment_method text not null default 'card' check (payment_method in ('card', 'crypto')),
  crypto_asset text,
  donor_name text,
  donor_email text,
  donor_phone text,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists donations_status_idx on donations (status);
create index if not exists donations_created_at_idx on donations (created_at desc);

-- Server (service role key) only — the app never talks to these tables from the browser.
alter table payment_plans enable row level security;
alter table donations enable row level security;
