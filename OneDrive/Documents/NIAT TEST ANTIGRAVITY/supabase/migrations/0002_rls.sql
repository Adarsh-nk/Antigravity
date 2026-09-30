-- =====================================================================
-- 0002_rls.sql : Row Level Security policies
-- =====================================================================
alter table public.profiles          enable row level security;
alter table public.farms             enable row level security;
alter table public.advisories        enable row level security;
alter table public.advisory_messages enable row level security;
alter table public.advisory_feedback enable row level security;
alter table public.api_usage_logs    enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles
  for delete using ((select auth.uid()) = id);

-- farms
create policy "farms_select_own" on public.farms
  for select using ((select auth.uid()) = user_id);
create policy "farms_insert_own" on public.farms
  for insert with check ((select auth.uid()) = user_id);
create policy "farms_update_own" on public.farms
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "farms_delete_own" on public.farms
  for delete using ((select auth.uid()) = user_id);

-- advisories
create policy "advisories_select_own" on public.advisories
  for select using ((select auth.uid()) = user_id);
create policy "advisories_insert_own" on public.advisories
  for insert with check (
    (select auth.uid()) = user_id
    and (farm_id is null or exists (
      select 1 from public.farms f where f.id = farm_id and f.user_id = (select auth.uid())))
  );
create policy "advisories_update_own" on public.advisories
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "advisories_delete_own" on public.advisories
  for delete using ((select auth.uid()) = user_id);

-- advisory_messages
create policy "messages_select_own" on public.advisory_messages
  for select using ((select auth.uid()) = user_id);
create policy "messages_insert_own" on public.advisory_messages
  for insert with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.advisories a where a.id = advisory_id and a.user_id = (select auth.uid()))
  );
create policy "messages_delete_own" on public.advisory_messages
  for delete using ((select auth.uid()) = user_id);

-- advisory_feedback
create policy "feedback_select_own" on public.advisory_feedback
  for select using ((select auth.uid()) = user_id);
create policy "feedback_insert_own" on public.advisory_feedback
  for insert with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.advisories a where a.id = advisory_id and a.user_id = (select auth.uid()))
  );
create policy "feedback_update_own" on public.advisory_feedback
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "feedback_delete_own" on public.advisory_feedback
  for delete using ((select auth.uid()) = user_id);

-- api_usage_logs: users may insert and read only their own logs
create policy "usage_select_own" on public.api_usage_logs
  for select using ((select auth.uid()) = user_id);
create policy "usage_insert_own" on public.api_usage_logs
  for insert with check ((select auth.uid()) = user_id);

-- Storage: objects live under "<user_id>/<filename>"
create policy "crop_images_select_own" on storage.objects
  for select using (
    bucket_id = 'crop-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "crop_images_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'crop-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "crop_images_delete_own" on storage.objects
  for delete using (
    bucket_id = 'crop-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
