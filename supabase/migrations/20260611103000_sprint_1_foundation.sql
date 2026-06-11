create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null check (role in ('administrator', 'validator', 'contributor', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.connector_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique check (
    provider in (
      'wordpress',
      'linkedin',
      'pinterest',
      'google_business',
      'instagram',
      'facebook',
      'newsletter'
    )
  ),
  label text not null,
  status text not null default 'disabled' check (
    status in ('disabled', 'configured', 'active', 'error')
  ),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.user_profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_app_settings_updated_at on public.app_settings;
create trigger set_app_settings_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_connector_settings_updated_at on public.connector_settings;
create trigger set_connector_settings_updated_at
before update on public.connector_settings
for each row
execute function public.set_updated_at();

create or replace function public.current_user_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_profiles
  where auth_user_id = auth.uid()
    and is_active = true
  limit 1
$$;

create or replace function public.current_user_profile_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where auth_user_id = auth.uid()
      and is_active = true
  )
$$;

create or replace function public.current_user_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.user_profiles
  where auth_user_id = auth.uid()
    and is_active = true
  limit 1
$$;

alter table public.user_profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.connector_settings enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Users can read their own profile" on public.user_profiles;
create policy "Users can read their own profile"
on public.user_profiles
for select
to authenticated
using (
  auth_user_id = auth.uid()
  or public.current_user_profile_role() = 'administrator'
);

drop policy if exists "Administrators can insert profiles" on public.user_profiles;
create policy "Administrators can insert profiles"
on public.user_profiles
for insert
to authenticated
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Administrators can update profiles" on public.user_profiles;
create policy "Administrators can update profiles"
on public.user_profiles
for update
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Administrators can delete profiles" on public.user_profiles;
create policy "Administrators can delete profiles"
on public.user_profiles
for delete
to authenticated
using (public.current_user_profile_role() = 'administrator');

drop policy if exists "Active users can read app settings" on public.app_settings;
create policy "Active users can read app settings"
on public.app_settings
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Administrators can manage app settings" on public.app_settings;
create policy "Administrators can manage app settings"
on public.app_settings
for all
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Administrators can read connector settings" on public.connector_settings;
create policy "Administrators can read connector settings"
on public.connector_settings
for select
to authenticated
using (public.current_user_profile_role() = 'administrator');

drop policy if exists "Administrators can manage connector settings" on public.connector_settings;
create policy "Administrators can manage connector settings"
on public.connector_settings
for all
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Active users can insert audit logs" on public.audit_logs;
create policy "Active users can insert audit logs"
on public.audit_logs
for insert
to authenticated
with check (
  public.current_user_profile_is_active()
  and (
    actor_profile_id is null
    or actor_profile_id = public.current_user_profile_id()
  )
);

drop policy if exists "Administrators can read audit logs" on public.audit_logs;
create policy "Administrators can read audit logs"
on public.audit_logs
for select
to authenticated
using (public.current_user_profile_role() = 'administrator');
