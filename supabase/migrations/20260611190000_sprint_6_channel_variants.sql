create table if not exists public.channel_variants (
  id uuid primary key default gen_random_uuid(),
  master_content_id uuid not null references public.master_contents(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete restrict,
  title text not null,
  body text,
  excerpt text,
  hashtags text[] not null default '{}'::text[],
  call_to_action text,
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  generation_mode text not null default 'manual' check (
    generation_mode in ('manual', 'ai_assisted', 'ai_generated')
  ),
  ai_provider_key text,
  ai_model_key text,
  generated_prompt text,
  wordpress_category_id uuid references public.wordpress_categories(id) on delete set null,
  seo_title text,
  seo_description text,
  pinterest_board text,
  google_business_post_type text,
  created_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_channel_variants_updated_at on public.channel_variants;
create trigger set_channel_variants_updated_at
before update on public.channel_variants
for each row
execute function public.set_updated_at();

alter table public.channel_variants enable row level security;

drop policy if exists "Active users can read channel variants" on public.channel_variants;
create policy "Active users can read channel variants"
on public.channel_variants
for select
to authenticated
using (public.current_user_profile_is_active());

drop policy if exists "Contributors can create channel variants" on public.channel_variants;
create policy "Contributors can create channel variants"
on public.channel_variants
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

drop policy if exists "Allowed users can update channel variants" on public.channel_variants;
create policy "Allowed users can update channel variants"
on public.channel_variants
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
