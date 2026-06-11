alter table public.media_assets
add column if not exists is_primary boolean not null default false;

