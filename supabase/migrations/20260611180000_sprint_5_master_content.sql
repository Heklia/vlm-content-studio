create table if not exists public.master_contents (
  id uuid primary key default gen_random_uuid(),
  source_sheet_id uuid references public.source_sheets(id) on delete set null,
  title text not null,
  angle text,
  hook text,
  body text,
  key_points jsonb not null default '[]'::jsonb,
  call_to_action text,
  editorial_notes text,
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  generation_mode text not null default 'manual' check (
    generation_mode in ('manual', 'ai_assisted', 'ai_generated')
  ),
  ai_provider_key text,
  ai_model_key text,
  generated_prompt text,
  created_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_master_contents_updated_at on public.master_contents;
create trigger set_master_contents_updated_at
before update on public.master_contents
for each row
execute function public.set_updated_at();

alter table public.master_contents enable row level security;

drop policy if exists "Active users can read master contents" on public.master_contents;
create policy "Active users can read master contents"
on public.master_contents
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Contributors can create master contents" on public.master_contents;
create policy "Contributors can create master contents"
on public.master_contents
for insert
to authenticated
with check (
  public.current_user_profile_role() in (
    'administrator',
    'validator',
    'contributor'
  )
  and created_by_profile_id = public.current_user_profile_id()
  and generation_mode = 'manual'
);

drop policy if exists "Allowed users can update master contents" on public.master_contents;
create policy "Allowed users can update master contents"
on public.master_contents
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

