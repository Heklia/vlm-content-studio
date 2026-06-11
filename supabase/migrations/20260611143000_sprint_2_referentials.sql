create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  status text not null default 'enabled' check (
    status in ('enabled', 'coming_soon', 'disabled')
  ),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_pillars (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  target_percentage numeric(5, 2) not null check (
    target_percentage >= 0
    and target_percentage <= 100
  ),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wordpress_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  wordpress_id integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_providers (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  status text not null default 'available' check (
    status in ('available', 'coming_soon', 'disabled')
  ),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_channels_updated_at on public.channels;
create trigger set_channels_updated_at
before update on public.channels
for each row
execute function public.set_updated_at();

drop trigger if exists set_content_pillars_updated_at on public.content_pillars;
create trigger set_content_pillars_updated_at
before update on public.content_pillars
for each row
execute function public.set_updated_at();

drop trigger if exists set_wordpress_categories_updated_at on public.wordpress_categories;
create trigger set_wordpress_categories_updated_at
before update on public.wordpress_categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_ai_providers_updated_at on public.ai_providers;
create trigger set_ai_providers_updated_at
before update on public.ai_providers
for each row
execute function public.set_updated_at();

alter table public.channels enable row level security;
alter table public.content_pillars enable row level security;
alter table public.wordpress_categories enable row level security;
alter table public.ai_providers enable row level security;

drop policy if exists "Active users can read channels" on public.channels;
create policy "Active users can read channels"
on public.channels
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Administrators can manage channels" on public.channels;
create policy "Administrators can manage channels"
on public.channels
for all
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Active users can read content pillars" on public.content_pillars;
create policy "Active users can read content pillars"
on public.content_pillars
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Administrators can manage content pillars" on public.content_pillars;
create policy "Administrators can manage content pillars"
on public.content_pillars
for all
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Active users can read wordpress categories" on public.wordpress_categories;
create policy "Active users can read wordpress categories"
on public.wordpress_categories
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Administrators can manage wordpress categories" on public.wordpress_categories;
create policy "Administrators can manage wordpress categories"
on public.wordpress_categories
for all
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Active users can read ai providers" on public.ai_providers;
create policy "Active users can read ai providers"
on public.ai_providers
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Administrators can manage ai providers" on public.ai_providers;
create policy "Administrators can manage ai providers"
on public.ai_providers
for all
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

