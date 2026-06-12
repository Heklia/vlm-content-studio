drop policy if exists "Allowed users can delete source sheets" on public.source_sheets;
create policy "Allowed users can delete source sheets"
on public.source_sheets
for delete
to authenticated
using (
  public.current_user_profile_role() in ('administrator', 'validator')
  or (
    public.current_user_profile_role() = 'contributor'
    and created_by_profile_id = public.current_user_profile_id()
    and status <> 'archived'
  )
);

drop policy if exists "Allowed users can delete source sheet channels" on public.source_sheet_channels;
create policy "Allowed users can delete source sheet channels"
on public.source_sheet_channels
for delete
to authenticated
using (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_channels.source_sheet_id
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

drop policy if exists "Allowed users can delete source sheet media" on public.source_sheet_media;
create policy "Allowed users can delete source sheet media"
on public.source_sheet_media
for delete
to authenticated
using (
  exists (
    select 1
    from public.source_sheets source_sheet
    where source_sheet.id = source_sheet_media.source_sheet_id
      and (
        public.current_user_profile_role() in ('administrator', 'validator')
        or (
          public.current_user_profile_role() = 'contributor'
          and source_sheet.created_by_profile_id = public.current_user_profile_id()
          and source_sheet.status <> 'archived'
        )
      )
  )
  or exists (
    select 1
    from public.media_assets media_asset
    where media_asset.id = source_sheet_media.media_asset_id
      and public.current_user_profile_role() = 'contributor'
      and media_asset.uploaded_by_profile_id = public.current_user_profile_id()
  )
);
