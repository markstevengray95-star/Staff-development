-- Staff Development RLS hardening
-- Keeps organisation checks correlated to the row's organisation and expands
-- the organisation membership roles used by the unified platform.

alter table public.school_organization_members
  drop constraint if exists school_organization_members_role_check;

alter table public.school_organization_members
  add constraint school_organization_members_role_check
  check (role = any (array[
    'owner'::text,
    'admin'::text,
    'leader'::text,
    'pastoral'::text,
    'cpd_lead'::text,
    'member'::text
  ]));

create or replace function public.staff_development_is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.school_organizations o
    where o.id = target_org
      and o.owner_user_id = auth.uid()
  ) or exists (
    select 1
    from public.school_organization_members m
    where m.organization_id = target_org
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.staff_development_has_org_role(target_org uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.school_organizations o
    where o.id = target_org
      and o.owner_user_id = auth.uid()
  ) or exists (
    select 1
    from public.school_organization_members m
    where m.organization_id = target_org
      and m.user_id = auth.uid()
      and m.role = any (allowed_roles)
  );
$$;

revoke all on function public.staff_development_is_org_member(uuid) from public;
revoke all on function public.staff_development_has_org_role(uuid,text[]) from public;
grant execute on function public.staff_development_is_org_member(uuid) to authenticated;
grant execute on function public.staff_development_has_org_role(uuid,text[]) to authenticated;

-- CPD progress

drop policy if exists course_progress_read on public.staff_development_course_progress;
drop policy if exists course_progress_insert_own on public.staff_development_course_progress;
drop policy if exists course_progress_update_own on public.staff_development_course_progress;
drop policy if exists course_progress_delete_own on public.staff_development_course_progress;

create policy course_progress_read
on public.staff_development_course_progress
for select to authenticated
using (
  user_id = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','cpd_lead']
    )
  )
);

create policy course_progress_insert_own
on public.staff_development_course_progress
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (
    organization_id is null
    or public.staff_development_is_org_member(organization_id)
  )
);

create policy course_progress_update_own
on public.staff_development_course_progress
for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and (
    organization_id is null
    or public.staff_development_is_org_member(organization_id)
  )
);

create policy course_progress_delete_own
on public.staff_development_course_progress
for delete to authenticated
using (user_id = (select auth.uid()));

-- Regulation check-ins

drop policy if exists checkins_read_scoped on public.staff_development_checkins;
drop policy if exists checkins_insert_member on public.staff_development_checkins;
drop policy if exists checkins_update_scoped on public.staff_development_checkins;
drop policy if exists checkins_delete_scoped on public.staff_development_checkins;

create policy checkins_read_scoped
on public.staff_development_checkins
for select to authenticated
using (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
  or exists (
    select 1
    from public.staff_development_students s
    where s.organization_id = staff_development_checkins.organization_id
      and s.auth_user_id = (select auth.uid())
      and s.display_name = staff_development_checkins.subject_ref
  )
);

create policy checkins_insert_member
on public.staff_development_checkins
for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (
    organization_id is null
    or public.staff_development_is_org_member(organization_id)
  )
);

create policy checkins_update_scoped
on public.staff_development_checkins
for update to authenticated
using (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
)
with check (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
);

create policy checkins_delete_scoped
on public.staff_development_checkins
for delete to authenticated
using (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
);

-- Interventions

drop policy if exists interventions_read_scoped on public.staff_development_interventions;
drop policy if exists interventions_insert_member on public.staff_development_interventions;
drop policy if exists interventions_update_scoped on public.staff_development_interventions;
drop policy if exists interventions_delete_scoped on public.staff_development_interventions;

create policy interventions_read_scoped
on public.staff_development_interventions
for select to authenticated
using (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
);

create policy interventions_insert_member
on public.staff_development_interventions
for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (
    organization_id is null
    or public.staff_development_is_org_member(organization_id)
  )
);

create policy interventions_update_scoped
on public.staff_development_interventions
for update to authenticated
using (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
)
with check (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
);

create policy interventions_delete_scoped
on public.staff_development_interventions
for delete to authenticated
using (
  created_by = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','pastoral']
    )
  )
);

-- Live CPD

drop policy if exists live_sessions_read_members on public.staff_development_live_sessions;
drop policy if exists live_sessions_insert_leaders on public.staff_development_live_sessions;
drop policy if exists live_sessions_update_host on public.staff_development_live_sessions;
drop policy if exists live_sessions_delete_host on public.staff_development_live_sessions;

create policy live_sessions_read_members
on public.staff_development_live_sessions
for select to authenticated
using (
  host_user_id = (select auth.uid())
  or (
    organization_id is not null
    and public.staff_development_is_org_member(organization_id)
  )
);

create policy live_sessions_insert_leaders
on public.staff_development_live_sessions
for insert to authenticated
with check (
  host_user_id = (select auth.uid())
  and (
    organization_id is null
    or public.staff_development_has_org_role(
      organization_id,
      array['owner','admin','leader','cpd_lead']
    )
  )
);

create policy live_sessions_update_host
on public.staff_development_live_sessions
for update to authenticated
using (host_user_id = (select auth.uid()))
with check (host_user_id = (select auth.uid()));

create policy live_sessions_delete_host
on public.staff_development_live_sessions
for delete to authenticated
using (host_user_id = (select auth.uid()));

-- Organisation entitlements and domains

drop policy if exists org_entitlements_members_read on public.staff_development_org_entitlements;
create policy org_entitlements_members_read
on public.staff_development_org_entitlements
for select to authenticated
using (public.staff_development_is_org_member(organization_id));

drop policy if exists school_domains_read_members on public.staff_development_school_domains;
create policy school_domains_read_members
on public.staff_development_school_domains
for select to authenticated
using (public.staff_development_is_org_member(organization_id));

-- Students

drop policy if exists students_read_scoped on public.staff_development_students;
drop policy if exists students_insert_leaders on public.staff_development_students;
drop policy if exists students_update_leaders on public.staff_development_students;
drop policy if exists students_delete_leaders on public.staff_development_students;

create policy students_read_scoped
on public.staff_development_students
for select to authenticated
using (
  auth_user_id = (select auth.uid())
  or public.staff_development_has_org_role(
    organization_id,
    array['owner','admin','leader','pastoral']
  )
);

create policy students_insert_leaders
on public.staff_development_students
for insert to authenticated
with check (
  created_by = (select auth.uid())
  and public.staff_development_has_org_role(
    organization_id,
    array['owner','admin','leader','pastoral']
  )
);

create policy students_update_leaders
on public.staff_development_students
for update to authenticated
using (
  public.staff_development_has_org_role(
    organization_id,
    array['owner','admin','leader','pastoral']
  )
)
with check (
  public.staff_development_has_org_role(
    organization_id,
    array['owner','admin','leader','pastoral']
  )
);

create policy students_delete_leaders
on public.staff_development_students
for delete to authenticated
using (
  public.staff_development_has_org_role(
    organization_id,
    array['owner','admin','leader','pastoral']
  )
);
