drop policy if exists "Validators can delete channel variants" on public.channel_variants;
create policy "Validators can delete channel variants"
on public.channel_variants
for delete
to authenticated
using (public.current_user_profile_role() in ('administrator', 'validator'));

drop policy if exists "Validators can delete validation reviews" on public.validation_reviews;
create policy "Validators can delete validation reviews"
on public.validation_reviews
for delete
to authenticated
using (public.current_user_profile_role() in ('administrator', 'validator'));

drop policy if exists "Validators can delete scheduled publications" on public.scheduled_publications;
create policy "Validators can delete scheduled publications"
on public.scheduled_publications
for delete
to authenticated
using (public.current_user_profile_role() in ('administrator', 'validator'));

drop policy if exists "Validators can delete workflow events" on public.content_workflow_events;
create policy "Validators can delete workflow events"
on public.content_workflow_events
for delete
to authenticated
using (public.current_user_profile_role() in ('administrator', 'validator'));
