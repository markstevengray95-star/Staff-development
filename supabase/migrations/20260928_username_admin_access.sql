-- Username sign-in and platform-admin authorization for the unified Staff Development app.
-- The live one-time admin setup token is intentionally NOT committed to source control.

alter table public.staff_development_profiles add column if not exists username text;
alter table public.staff_development_profiles add column if not exists platform_role text not null default 'user';

create unique index if not exists staff_development_profiles_username_unique
  on public.staff_development_profiles (lower(username))
  where username is not null;
create index if not exists staff_development_profiles_platform_role_idx
  on public.staff_development_profiles (platform_role);

create table if not exists public.staff_development_reserved_usernames (
  username text primary key,
  created_at timestamptz not null default now(),
  check (username = lower(username))
);
alter table public.staff_development_reserved_usernames enable row level security;
revoke all on public.staff_development_reserved_usernames from anon, authenticated;
insert into public.staff_development_reserved_usernames (username)
values ('zonesadmin'), ('admin'), ('owner')
on conflict (username) do nothing;

create table if not exists public.staff_development_admin_setup_tokens (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.staff_development_admin_setup_tokens enable row level security;
revoke all on public.staff_development_admin_setup_tokens from anon, authenticated;

create schema if not exists private;

create or replace function private.sync_staff_development_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  requested_username text;
  is_platform_admin boolean;
begin
  requested_username := lower(nullif(trim(new.raw_user_meta_data ->> 'username'), ''));
  is_platform_admin := coalesce((new.raw_app_meta_data ->> 'platform_admin')::boolean, false);

  if requested_username is not null
     and not is_platform_admin
     and exists (select 1 from public.staff_development_reserved_usernames r where r.username = requested_username)
  then
    raise exception 'Username is reserved';
  end if;

  insert into public.staff_development_profiles (user_id, display_name, username, updated_at)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), ''),
    requested_username,
    now()
  )
  on conflict (user_id) do update
  set display_name = coalesce(excluded.display_name, public.staff_development_profiles.display_name),
      username = coalesce(public.staff_development_profiles.username, excluded.username),
      updated_at = now();
  return new;
end;
$$;
revoke all on function private.sync_staff_development_profile_from_auth() from public, anon, authenticated;
drop trigger if exists staff_development_sync_profile on auth.users;
create trigger staff_development_sync_profile
after insert or update of raw_user_meta_data on auth.users
for each row execute function private.sync_staff_development_profile_from_auth();

create or replace function private.current_user_is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.staff_development_profiles p
    where p.user_id = (select auth.uid()) and p.platform_role = 'admin'
  );
$$;
grant usage on schema private to authenticated;
revoke all on function private.current_user_is_platform_admin() from public, anon;
grant execute on function private.current_user_is_platform_admin() to authenticated;

drop policy if exists "profiles_admin_read_all" on public.staff_development_profiles;
create policy "profiles_admin_read_all" on public.staff_development_profiles
for select to authenticated using (private.current_user_is_platform_admin());

revoke insert, update on public.staff_development_profiles from authenticated;
grant insert (user_id, display_name, department, preferred_organization_id, username, created_at, updated_at)
  on public.staff_development_profiles to authenticated;
grant update (display_name, department, preferred_organization_id, updated_at)
  on public.staff_development_profiles to authenticated;
