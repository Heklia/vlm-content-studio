insert into storage.buckets (id, name, public)
values ('media-assets', 'media-assets', false)
on conflict (id) do update
set public = excluded.public;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null default 'media-assets',
  storage_path text not null unique,
  file_name text not null,
  file_type text not null check (file_type in ('image', 'video', 'document', 'other')),
  mime_type text not null,
  file_size bigint not null check (file_size > 0),
  title text,
  description text,
  alt_text text,
  credit text,
  is_ai_generated boolean not null default false,
  ai_visual_notice text,
  status text not null default 'active' check (status in ('active', 'archived')),
  uploaded_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_assets_ai_notice_required check (
    is_ai_generated = false
    or nullif(trim(ai_visual_notice), '') is not null
  )
);

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row
execute function public.set_updated_at();

alter table public.media_assets enable row level security;

drop policy if exists "Active users can read media assets" on public.media_assets;
create policy "Active users can read media assets"
on public.media_assets
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Contributors can create media assets" on public.media_assets;
create policy "Contributors can create media assets"
on public.media_assets
for insert
to authenticated
with check (
  public.current_user_profile_role() in (
    'administrator',
    'validator',
    'contributor'
  )
  and uploaded_by_profile_id = public.current_user_profile_id()
);

drop policy if exists "Administrators can update media assets" on public.media_assets;
create policy "Administrators can update media assets"
on public.media_assets
for update
to authenticated
using (public.current_user_profile_role() = 'administrator')
with check (public.current_user_profile_role() = 'administrator');

drop policy if exists "Active users can read media storage" on storage.objects;
create policy "Active users can read media storage"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'media-assets'
  and public.current_user_profile_is_active()
);

drop policy if exists "Contributors can upload media storage" on storage.objects;
create policy "Contributors can upload media storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media-assets'
  and public.current_user_profile_role() in (
    'administrator',
    'validator',
    'contributor'
  )
);

drop policy if exists "Administrators can update media storage" on storage.objects;
create policy "Administrators can update media storage"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media-assets'
  and public.current_user_profile_role() = 'administrator'
)
with check (
  bucket_id = 'media-assets'
  and public.current_user_profile_role() = 'administrator'
);

