create table if not exists public.source_sheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  context text,
  technical_details text,
  materials text,
  know_how text,
  client_or_sector text,
  location text,
  content_pillar_id uuid references public.content_pillars(id) on delete set null,
  wordpress_category_id uuid references public.wordpress_categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  created_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.source_sheet_media (
  id uuid primary key default gen_random_uuid(),
  source_sheet_id uuid not null references public.source_sheets(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (source_sheet_id, media_asset_id)
);

create table if not exists public.source_sheet_channels (
  id uuid primary key default gen_random_uuid(),
  source_sheet_id uuid not null references public.source_sheets(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (source_sheet_id, channel_id)
);

drop trigger if exists set_source_sheets_updated_at on public.source_sheets;
create trigger set_source_sheets_updated_at
before update on public.source_sheets
for each row
execute function public.set_updated_at();

alter table public.source_sheets enable row level security;
alter table public.source_sheet_media enable row level security;
alter table public.source_sheet_channels enable row level security;

drop policy if exists "Active users can read source sheets" on public.source_sheets;
create policy "Active users can read source sheets"
on public.source_sheets
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Contributors can create source sheets" on public.source_sheets;
create policy "Contributors can create source sheets"
on public.source_sheets
for insert
to authenticated
with check (
  public.current_user_profile_role() in (
    'administrator',
    'validator',
    'contributor'
  )
  and created_by_profile_id = public.current_user_profile_id()
);

drop policy if exists "Allowed users can update source sheets" on public.source_sheets;
create policy "Allowed users can update source sheets"
on public.source_sheets
for update
to authenticated
using (
  public.current_user_profile_role() in ('administrator', 'validator')
  or (
    public.current_user_profile_role() = 'contributor'
    and created_by_profile_id = public.current_user_profile_id()
    and status <> 'archived'
  )
)
with check (
  public.current_user_profile_role() in ('administrator', 'validator')
  or (
    public.current_user_profile_role() = 'contributor'
    and created_by_profile_id = public.current_user_profile_id()
    and status <> 'archived'
  )
);

drop policy if exists "Active users can read source sheet media" on public.source_sheet_media;
create policy "Active users can read source sheet media"
on public.source_sheet_media
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Contributors can create source sheet media" on public.source_sheet_media;
create policy "Contributors can create source sheet media"
on public.source_sheet_media
for insert
to authenticated
with check (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
);

drop policy if exists "Allowed users can update source sheet media" on public.source_sheet_media;
create policy "Allowed users can update source sheet media"
on public.source_sheet_media
for update
to authenticated
using (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
);

drop policy if exists "Active users can read source sheet channels" on public.source_sheet_channels;
create policy "Active users can read source sheet channels"
on public.source_sheet_channels
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Contributors can create source sheet channels" on public.source_sheet_channels;
create policy "Contributors can create source sheet channels"
on public.source_sheet_channels
for insert
to authenticated
with check (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
);

drop policy if exists "Allowed users can update source sheet channels" on public.source_sheet_channels;
create policy "Allowed users can update source sheet channels"
on public.source_sheet_channels
for update
to authenticated
using (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
);

