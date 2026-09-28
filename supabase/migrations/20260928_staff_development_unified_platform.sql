create table if not exists public.staff_development_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  department text,
  preferred_organization_id uuid references public.school_organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_development_org_entitlements (
  organization_id uuid primary key references public.school_organizations(id) on delete cascade,
  plan_tier text not null default 'free' check (plan_tier in ('free','plus','pro','school')),
  status text not null default 'inactive' check (status in ('inactive','trialing','active','past_due','canceled')),
  seat_limit integer not null default 1 check (seat_limit > 0),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_development_product_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_code text not null check (product_code in ('single_cpd','all_cpd')),
  course_id text,
  status text not null default 'active' check (status in ('trialing','active','expired','canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((product_code = 'single_cpd' and course_id is not null) or (product_code = 'all_cpd' and course_id is null))
);
create unique index if not exists staff_development_product_entitlement_unique on public.staff_development_product_entitlements(user_id, product_code, coalesce(course_id,''));

create table if not exists public.staff_development_course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.school_organizations(id) on delete set null,
  course_id text not null,
  completed_modules text[] not null default '{}',
  reflections jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create table if not exists public.staff_development_checkins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.school_organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  subject_ref text not null,
  zone text not null check (zone in ('blue','green','yellow','red')),
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.staff_development_interventions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.school_organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  student_ref text not null,
  focus text not null,
  zone text check (zone is null or zone in ('blue','green','yellow','red')),
  strategy text not null,
  review_date date,
  status text not null default 'Active' check (status in ('Active','Review','Complete')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_development_students (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.school_organizations(id) on delete cascade,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null,
  year_group text,
  class_group text,
  external_ref text,
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_development_live_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.school_organizations(id) on delete cascade,
  host_user_id uuid not null references auth.users(id) on delete cascade,
  session_code text not null unique,
  title text not null,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '12 hours')
);

create table if not exists public.staff_development_school_domains (
  domain text primary key,
  organization_id uuid not null references public.school_organizations(id) on delete cascade,
  verified boolean not null default false,
  verified_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (domain = lower(domain) and domain !~ '@' and position('.' in domain) > 0)
);

create index if not exists staff_development_course_progress_org_idx on public.staff_development_course_progress(organization_id, user_id);
create index if not exists staff_development_checkins_org_created_idx on public.staff_development_checkins(organization_id, created_at desc);
create index if not exists staff_development_interventions_org_status_idx on public.staff_development_interventions(organization_id, status, review_date);
create index if not exists staff_development_students_org_idx on public.staff_development_students(organization_id, active);
create index if not exists staff_development_live_sessions_org_idx on public.staff_development_live_sessions(organization_id, created_at desc);
create index if not exists staff_development_product_entitlements_user_idx on public.staff_development_product_entitlements(user_id, status);

alter table public.staff_development_profiles enable row level security;
alter table public.staff_development_org_entitlements enable row level security;
alter table public.staff_development_product_entitlements enable row level security;
alter table public.staff_development_course_progress enable row level security;
alter table public.staff_development_checkins enable row level security;
alter table public.staff_development_interventions enable row level security;
alter table public.staff_development_students enable row level security;
alter table public.staff_development_live_sessions enable row level security;
alter table public.staff_development_school_domains enable row level security;

revoke all on public.staff_development_profiles from anon;
revoke all on public.staff_development_org_entitlements from anon;
revoke all on public.staff_development_product_entitlements from anon;
revoke all on public.staff_development_course_progress from anon;
revoke all on public.staff_development_checkins from anon;
revoke all on public.staff_development_interventions from anon;
revoke all on public.staff_development_students from anon;
revoke all on public.staff_development_live_sessions from anon;
revoke all on public.staff_development_school_domains from anon;

grant select,insert,update on public.staff_development_profiles to authenticated;
grant select on public.staff_development_org_entitlements to authenticated;
grant select on public.staff_development_product_entitlements to authenticated;
grant select,insert,update,delete on public.staff_development_course_progress to authenticated;
grant select,insert,update,delete on public.staff_development_checkins to authenticated;
grant select,insert,update,delete on public.staff_development_interventions to authenticated;
grant select,insert,update,delete on public.staff_development_students to authenticated;
grant select,insert,update,delete on public.staff_development_live_sessions to authenticated;
grant select,insert,delete on public.staff_development_school_domains to authenticated;

create policy "profiles_read_own" on public.staff_development_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "profiles_insert_own" on public.staff_development_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profiles_update_own" on public.staff_development_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "org_entitlements_members_read" on public.staff_development_org_entitlements for select to authenticated using (
  exists (select 1 from public.school_organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.school_organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid()))
);

create policy "product_entitlements_read_own" on public.staff_development_product_entitlements for select to authenticated using ((select auth.uid()) = user_id);

create policy "course_progress_read" on public.staff_development_course_progress for select to authenticated using (
  user_id = (select auth.uid())
  or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid())))
  or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid()) and m.role in ('owner','admin','leader','cpd_lead')))
);
create policy "course_progress_insert_own" on public.staff_development_course_progress for insert to authenticated with check (
  user_id = (select auth.uid()) and (organization_id is null or exists (select 1 from public.school_organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid())))
);
create policy "course_progress_update_own" on public.staff_development_course_progress for update to authenticated using (user_id = (select auth.uid())) with check (
  user_id = (select auth.uid()) and (organization_id is null or exists (select 1 from public.school_organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid())))
);
create policy "course_progress_delete_own" on public.staff_development_course_progress for delete to authenticated using (user_id = (select auth.uid()));

create policy "checkins_read_scoped" on public.staff_development_checkins for select to authenticated using (
  created_by = (select auth.uid())
  or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())))
  or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
  or exists (select 1 from public.staff_development_students s where s.organization_id=organization_id and s.auth_user_id=(select auth.uid()) and s.display_name=subject_ref)
);
create policy "checkins_insert_member" on public.staff_development_checkins for insert to authenticated with check (
  created_by=(select auth.uid()) and (organization_id is null or exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid())))
);
create policy "checkins_update_scoped" on public.staff_development_checkins for update to authenticated using (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
) with check (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
);
create policy "checkins_delete_scoped" on public.staff_development_checkins for delete to authenticated using (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
);

create policy "interventions_read_scoped" on public.staff_development_interventions for select to authenticated using (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
);
create policy "interventions_insert_member" on public.staff_development_interventions for insert to authenticated with check (
  created_by=(select auth.uid()) and (organization_id is null or exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid())))
);
create policy "interventions_update_scoped" on public.staff_development_interventions for update to authenticated using (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
) with check (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
);
create policy "interventions_delete_scoped" on public.staff_development_interventions for delete to authenticated using (
  created_by=(select auth.uid()) or (organization_id is not null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))) or (organization_id is not null and exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
);

create policy "students_read_scoped" on public.staff_development_students for select to authenticated using (
  auth_user_id=(select auth.uid()) or exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral'))
);
create policy "students_insert_leaders" on public.staff_development_students for insert to authenticated with check (
  created_by=(select auth.uid()) and (exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral')))
);
create policy "students_update_leaders" on public.staff_development_students for update to authenticated using (
  exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral'))
) with check (
  exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral'))
);
create policy "students_delete_leaders" on public.staff_development_students for delete to authenticated using (
  exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','pastoral'))
);

create policy "live_sessions_read_members" on public.staff_development_live_sessions for select to authenticated using (
  host_user_id=(select auth.uid()) or (organization_id is not null and (exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()))))
);
create policy "live_sessions_insert_leaders" on public.staff_development_live_sessions for insert to authenticated with check (
  host_user_id=(select auth.uid()) and (organization_id is null or exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()) and m.role in ('owner','admin','leader','cpd_lead')))
);
create policy "live_sessions_update_host" on public.staff_development_live_sessions for update to authenticated using (host_user_id=(select auth.uid())) with check (host_user_id=(select auth.uid()));
create policy "live_sessions_delete_host" on public.staff_development_live_sessions for delete to authenticated using (host_user_id=(select auth.uid()));

create policy "school_domains_read_members" on public.staff_development_school_domains for select to authenticated using (
  exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid())) or exists (select 1 from public.school_organization_members m where m.organization_id=organization_id and m.user_id=(select auth.uid()))
);
create policy "school_domains_insert_owner_pending" on public.staff_development_school_domains for insert to authenticated with check (
  created_by=(select auth.uid()) and verified=false and verified_at is null and exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))
);
create policy "school_domains_delete_owner" on public.staff_development_school_domains for delete to authenticated using (
  exists (select 1 from public.school_organizations o where o.id=organization_id and o.owner_user_id=(select auth.uid()))
);

create policy "authenticated_create_owned_org" on public.school_organizations for insert to authenticated with check (owner_user_id=(select auth.uid()));

create policy "verified_domain_self_join" on public.school_organization_members for insert to authenticated with check (
  user_id=(select auth.uid())
  and role='member'
  and exists (
    select 1
    from public.staff_development_school_domains d
    join public.staff_development_org_entitlements e on e.organization_id=d.organization_id
    join auth.users u on u.id=(select auth.uid())
    where d.organization_id=school_organization_members.organization_id
      and d.verified=true
      and e.status in ('trialing','active')
      and e.plan_tier in ('pro','school')
      and lower(split_part(u.email,'@',2))=d.domain
      and (select count(*) from public.school_organization_members mm where mm.organization_id=d.organization_id) < e.seat_limit
  )
);
