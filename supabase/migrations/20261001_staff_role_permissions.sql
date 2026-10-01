-- Phase 30: canonical whole-school staff roles and secure role assignment.
-- UI preview roles must never grant access. This table is an authorization source
-- controlled by organisation administrators and the trusted platform admin.

create table if not exists public.staff_development_role_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.school_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'teacher' check (role = any (array[
    'teacher'::text,
    'tutor'::text,
    'hod'::text,
    'pastoral'::text,
    'send-eal'::text,
    'slt'::text,
    'administrator'::text,
    'support'::text,
    'super-admin'::text
  ])),
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists staff_development_role_assignments_user_idx
  on public.staff_development_role_assignments(user_id, organization_id);
create index if not exists staff_development_role_assignments_role_idx
  on public.staff_development_role_assignments(organization_id, role);

alter table public.staff_development_role_assignments enable row level security;

revoke all on public.staff_development_role_assignments from anon, authenticated;
grant select on public.staff_development_role_assignments to authenticated;
grant insert (organization_id, user_id, role, assigned_by, created_at, updated_at)
  on public.staff_development_role_assignments to authenticated;
grant update (role, assigned_by, updated_at)
  on public.staff_development_role_assignments to authenticated;
grant delete on public.staff_development_role_assignments to authenticated;

create or replace function private.staff_development_can_manage_roles(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select private.current_user_is_platform_admin()
    or public.staff_development_has_org_role(target_org, array['owner','admin']);
$$;

revoke all on function private.staff_development_can_manage_roles(uuid) from public, anon;
grant execute on function private.staff_development_can_manage_roles(uuid) to authenticated;

drop policy if exists role_assignments_read on public.staff_development_role_assignments;
create policy role_assignments_read
on public.staff_development_role_assignments
for select to authenticated
using (
  user_id = (select auth.uid())
  or private.staff_development_can_manage_roles(organization_id)
);

drop policy if exists role_assignments_insert on public.staff_development_role_assignments;
create policy role_assignments_insert
on public.staff_development_role_assignments
for insert to authenticated
with check (
  private.staff_development_can_manage_roles(organization_id)
  and role <> 'super-admin'
);

drop policy if exists role_assignments_update on public.staff_development_role_assignments;
create policy role_assignments_update
on public.staff_development_role_assignments
for update to authenticated
using (private.staff_development_can_manage_roles(organization_id))
with check (
  private.staff_development_can_manage_roles(organization_id)
  and role <> 'super-admin'
);

drop policy if exists role_assignments_delete on public.staff_development_role_assignments;
create policy role_assignments_delete
on public.staff_development_role_assignments
for delete to authenticated
using (private.staff_development_can_manage_roles(organization_id));

-- Existing school membership roles remain valid. Seed a canonical assignment for
-- current accounts so Phase 30 can be introduced without changing existing access.
insert into public.staff_development_role_assignments (
  organization_id,
  user_id,
  role,
  assigned_by
)
select
  o.id,
  o.owner_user_id,
  'administrator',
  o.owner_user_id
from public.school_organizations o
on conflict (organization_id, user_id) do nothing;

insert into public.staff_development_role_assignments (
  organization_id,
  user_id,
  role,
  assigned_by
)
select
  m.organization_id,
  m.user_id,
  case m.role
    when 'owner' then 'administrator'
    when 'admin' then 'administrator'
    when 'leader' then 'slt'
    when 'pastoral' then 'pastoral'
    when 'cpd_lead' then 'hod'
    else 'teacher'
  end,
  null
from public.school_organization_members m
on conflict (organization_id, user_id) do nothing;

-- Platform administration remains separate from school role assignment. It is
-- derived from trusted app_metadata / platform_role by current_user_is_platform_admin().
-- Organisation admins are deliberately prevented from granting super-admin.
