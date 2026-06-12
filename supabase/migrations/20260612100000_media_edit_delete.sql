drop policy if exists "Administrators can update media assets" on public.media_assets;
drop policy if exists "Allowed users can update media assets" on public.media_assets;
create policy "Allowed users can update media assets"
on public.media_assets
for update
to authenticated
using (
  public.current_user_profile_role() in ('administrator', 'validator')
  or (
    public.current_user_profile_role() = 'contributor'
    and uploaded_by_profile_id = public.current_user_profile_id()
  )
)
with check (
  public.current_user_profile_role() in ('administrator', 'validator')
  or (
    public.current_user_profile_role() = 'contributor'
    and uploaded_by_profile_id = public.current_user_profile_id()
  )
);

drop policy if exists "Allowed users can delete media assets" on public.media_assets;
create policy "Allowed users can delete media assets"
on public.media_assets
for delete
to authenticated
using (
  public.current_user_profile_role() in ('administrator', 'validator')
  or (
    public.current_user_profile_role() = 'contributor'
    and uploaded_by_profile_id = public.current_user_profile_id()
  )
);

drop policy if exists "Allowed users can delete source sheet media" on public.source_sheet_media;
create policy "Allowed users can delete source sheet media"
on public.source_sheet_media
for delete
to authenticated
using (
  public.current_user_profile_role() in ('administrator', 'validator')
  or exists (
    select 1
    from public.media_assets media_asset
    where media_asset.id = source_sheet_media.media_asset_id
      and public.current_user_profile_role() = 'contributor'
      and media_asset.uploaded_by_profile_id = public.current_user_profile_id()
  )
);

drop policy if exists "Allowed users can delete media storage" on storage.objects;
create policy "Allowed users can delete media storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media-assets'
  and (
    public.current_user_profile_role() in ('administrator', 'validator')
    or exists (
      select 1
      from public.media_assets media_asset
      where media_asset.storage_bucket = storage.objects.bucket_id
        and media_asset.storage_path = storage.objects.name
        and public.current_user_profile_role() = 'contributor'
        and media_asset.uploaded_by_profile_id = public.current_user_profile_id()
    )
  )
);
