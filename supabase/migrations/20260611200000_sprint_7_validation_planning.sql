alter table public.channel_variants
drop constraint if exists channel_variants_status_check;

alter table public.channel_variants
add constraint channel_variants_status_check
check (status in ('draft', 'review', 'ready', 'scheduled', 'published', 'archived'));

create table if not exists public.validation_reviews (
  id uuid primary key default gen_random_uuid(),
  channel_variant_id uuid not null references public.channel_variants(id) on delete cascade,
  requested_by_profile_id uuid references public.user_profiles(id) on delete set null,
  reviewed_by_profile_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'changes_requested', 'cancelled')
  ),
  request_note text,
  review_note text,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists validation_reviews_one_pending_per_variant
on public.validation_reviews(channel_variant_id)
where status = 'pending';

drop trigger if exists set_validation_reviews_updated_at on public.validation_reviews;
create trigger set_validation_reviews_updated_at
before update on public.validation_reviews
for each row
execute function public.set_updated_at();

alter table public.validation_reviews enable row level security;

drop policy if exists "Active users can read validation reviews" on public.validation_reviews;
create policy "Active users can read validation reviews"
on public.validation_reviews
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Allowed users can create validation reviews" on public.validation_reviews;
create policy "Allowed users can create validation reviews"
on public.validation_reviews
for insert
to authenticated
with check (
  public.current_user_profile_role() in (
    'administrator',
    'validator',
    'contributor'
  )
  and requested_by_profile_id = public.current_user_profile_id()
  and status = 'pending'
);

drop policy if exists "Validators can update validation reviews" on public.validation_reviews;
create policy "Validators can update validation reviews"
on public.validation_reviews
for update
to authenticated
using (public.current_user_profile_role() in ('administrator', 'validator'))
with check (public.current_user_profile_role() in ('administrator', 'validator'));

create table if not exists public.scheduled_publications (
  id uuid primary key default gen_random_uuid(),
  channel_variant_id uuid not null references public.channel_variants(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete restrict,
  scheduled_for timestamptz not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'cancelled', 'published', 'archived')
  ),
  publication_notes text,
  created_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_scheduled_publications_updated_at on public.scheduled_publications;
create trigger set_scheduled_publications_updated_at
before update on public.scheduled_publications
for each row
execute function public.set_updated_at();

alter table public.scheduled_publications enable row level security;

drop policy if exists "Active users can read scheduled publications" on public.scheduled_publications;
create policy "Active users can read scheduled publications"
on public.scheduled_publications
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Validators can create scheduled publications" on public.scheduled_publications;
create policy "Validators can create scheduled publications"
on public.scheduled_publications
for insert
to authenticated
with check (
  public.current_user_profile_role() in ('administrator', 'validator')
  and created_by_profile_id = public.current_user_profile_id()
  and status = 'scheduled'
  and exists (
    select 1
    from public.channel_variants
    where channel_variants.id = scheduled_publications.channel_variant_id
      and channel_variants.status = 'ready'
      and channel_variants.channel_id = scheduled_publications.channel_id
  )
);

drop policy if exists "Validators can update scheduled publications" on public.scheduled_publications;
create policy "Validators can update scheduled publications"
on public.scheduled_publications
for update
to authenticated
using (public.current_user_profile_role() in ('administrator', 'validator'))
with check (public.current_user_profile_role() in ('administrator', 'validator'));

create table if not exists public.content_workflow_events (
  id uuid primary key default gen_random_uuid(),
  channel_variant_id uuid references public.channel_variants(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'validation_requested',
      'changes_requested',
      'approved',
      'scheduled',
      'cancelled',
      'archived'
    )
  ),
  from_status text,
  to_status text,
  actor_profile_id uuid references public.user_profiles(id) on delete set null,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.content_workflow_events enable row level security;

drop policy if exists "Active users can read workflow events" on public.content_workflow_events;
create policy "Active users can read workflow events"
on public.content_workflow_events
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Allowed users can create workflow events" on public.content_workflow_events;
create policy "Allowed users can create workflow events"
on public.content_workflow_events
for insert
to authenticated
with check (
  public.current_user_profile_role() in (
    'administrator',
    'validator',
    'contributor'
  )
  and actor_profile_id = public.current_user_profile_id()
);
