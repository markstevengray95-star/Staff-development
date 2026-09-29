-- Treat the trusted legacy Zones admin app-metadata claim as equivalent to
-- the unified Staff Development platform-admin role.
-- This keeps authorization server-controlled; raw_app_meta_data cannot be
-- edited by an authenticated user.

create or replace function private.current_user_is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select
    coalesce((auth.jwt() -> 'app_metadata' ->> 'platform_admin')::boolean, false)
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'zones_role', '') = 'admin'
    or exists (
      select 1
      from public.staff_development_profiles p
      where p.user_id = (select auth.uid())
        and p.platform_role = 'admin'
    );
$$;

revoke all on function private.current_user_is_platform_admin() from public, anon;
grant execute on function private.current_user_is_platform_admin() to authenticated;
