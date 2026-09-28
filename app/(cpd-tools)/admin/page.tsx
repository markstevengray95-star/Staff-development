"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type UserRow = { user_id: string; display_name: string | null; username: string | null; department: string | null; platform_role: string };
type AdminTool = { href: string; title: string; description: string; group: string };

const tools: AdminTool[] = [
  { href: "/", title: "Main platform", description: "Zones, regulation, interventions and whole-school tools.", group: "Platform" },
  { href: "/cpd", title: "Complete CPD library", description: "Full catalogue, presentations, Course Lab and certificates.", group: "Platform" },
  { href: "/school-hub", title: "School CPD Hub", description: "Policies, appraisal, INSET, onboarding, budget and resources.", group: "Leadership" },
  { href: "/builder", title: "Course Creator", description: "Build, version and publish school CPD courses.", group: "Leadership" },
  { href: "/course-studio", title: "Course Studio", description: "Create richer learning and presentation experiences.", group: "Leadership" },
  { href: "/live", title: "Live CPD", description: "Run interactive staff sessions with join codes and responses.", group: "Delivery" },
  { href: "/pathways", title: "Pathways", description: "Structured professional-development pathways.", group: "Development" },
  { href: "/adaptive", title: "Adaptive learning", description: "Personalised CPD sequencing and next steps.", group: "Development" },
  { href: "/coach", title: "Personal CPD Coach", description: "Guided development recommendations and planning.", group: "Development" },
  { href: "/coaching", title: "Coaching cycles", description: "Track coaching focuses, check-ins and next steps.", group: "Development" },
  { href: "/needs-audit", title: "Needs audit", description: "Identify priorities and recommended learning.", group: "Development" },
  { href: "/recommendations", title: "Recommendations", description: "Role- and need-informed CPD recommendations.", group: "Development" },
  { href: "/actions", title: "Action plans", description: "Turn CPD into classroom implementation actions.", group: "Evidence" },
  { href: "/portfolio", title: "Evidence portfolio", description: "Collect professional learning and implementation evidence.", group: "Evidence" },
  { href: "/impact", title: "Impact reviews", description: "Review implementation at 4, 8 and 12 weeks.", group: "Evidence" },
  { href: "/external-cpd", title: "External CPD", description: "Record learning completed outside the platform.", group: "Evidence" },
  { href: "/certificates", title: "Certificates", description: "Issue and review verifiable CPD certificates.", group: "Evidence" },
  { href: "/micro-cpd", title: "Micro CPD", description: "Short professional-learning units and reflections.", group: "Library" },
  { href: "/department-cpd", title: "Department CPD", description: "Department plans, priorities and training gaps.", group: "Library" },
  { href: "/subject-cpd", title: "Subject CPD", description: "Subject-specific professional development.", group: "Library" },
  { href: "/policy-training", title: "Policy training", description: "Turn school policies into guided staff learning.", group: "Compliance" },
  { href: "/safeguarding", title: "Safeguarding centre", description: "Requirements, roles, evidence and current guidance.", group: "Compliance" },
  { href: "/standards", title: "Professional standards", description: "Teachers' Standards and CPD framework links.", group: "Compliance" },
  { href: "/quality", title: "Quality assurance", description: "Review accuracy, accessibility and course quality.", group: "Leadership" },
  { href: "/improvement", title: "Improvement planning", description: "Connect school priorities with CPD actions.", group: "Leadership" },
  { href: "/simulator", title: "Practice simulator", description: "Scenario-based rehearsal before classroom application.", group: "Delivery" },
  { href: "/reading", title: "Professional reading", description: "Reading and evidence resources linked to development.", group: "Library" },
  { href: "/course-packs", title: "Course packs", description: "Facilitation and implementation resources.", group: "Library" },
  { href: "/accessibility", title: "Accessibility", description: "Accessibility and inclusive-use tools.", group: "Platform" },
  { href: "/staff-sync", title: "Staff sync", description: "Staff directory and CPD administration utilities.", group: "Platform" },
  { href: "/launch-readiness", title: "Launch readiness", description: "Check platform and school setup before launch.", group: "Platform" },
];

export default function UnifiedAdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [name, setName] = useState("Platform Admin");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const client = getSupabaseBrowserClient();
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) { window.location.replace("/auth?next=/admin"); return; }
      const { data: me, error } = await client.from("staff_development_profiles").select("display_name,platform_role").eq("user_id", auth.user.id).single();
      if (!active) return;
      if (error || me?.platform_role !== "admin") { setLoading(false); setAllowed(false); return; }
      setAllowed(true); setName(me.display_name || "Platform Admin");
      const { data, error: usersError } = await client.from("staff_development_profiles").select("user_id,display_name,username,department,platform_role").order("display_name");
      if (usersError) setMessage(usersError.message); else setUsers((data || []) as UserRow[]);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const groups = useMemo(() => Array.from(new Set(tools.map(tool => tool.group))), []);
  const visibleUsers = users.filter(user => `${user.display_name || ""} ${user.username || ""} ${user.department || ""}`.toLowerCase().includes(query.toLowerCase()));

  if (loading) return <main className="stagePage"><section className="stageCard">Opening admin centre…</section></main>;
  if (!allowed) return <main className="stagePage"><section className="stageCard"><span className="eyebrow">ADMIN CENTRE</span><h1>Platform admin access required</h1><p>This area is reserved for the unrestricted platform administrator.</p><a className="primary phaseLinkButton" href="/">Return to Staff Development</a></section></main>;

  return <main className="stagePage">
    <section className="stageHero"><span className="eyebrow">UNRESTRICTED PLATFORM ADMIN</span><h1>{name}'s control centre</h1><p>One place to access the complete Staff Development platform, all CPD tools and school administration features. Subscription and course locks do not restrict this account.</p><div className="stageHeroActions"><a className="primary phaseLinkButton" href="/cpd">Open complete CPD library</a><a className="secondary phaseLinkButton" href="/">Main platform</a></div></section>
    {message && <div className="phaseNotice">{message}</div>}
    <section className="stageGrid" style={{ marginTop: 18 }}><article className="stageCard stageSpan4"><span className="eyebrow">ACCESS</span><h2>Unrestricted</h2><p>All CPD, Zones, intervention, live, school and administration tools.</p></article><article className="stageCard stageSpan4"><span className="eyebrow">USERS</span><h2>{users.length}</h2><p>Profiles currently registered on the unified platform.</p></article><article className="stageCard stageSpan4"><span className="eyebrow">CPD SOURCE</span><h2>Full library</h2><p>Latest Teaching CPD catalogue and specialist tools are integrated.</p></article></section>
    {groups.map(group => <section className="stageCard" style={{ marginTop: 18 }} key={group}><span className="eyebrow">{group.toUpperCase()}</span><div className="stageGrid" style={{ marginTop: 12 }}>{tools.filter(tool => tool.group === group).map(tool => <a key={tool.href} href={tool.href} className="stageSpan4" style={{ textDecoration: "none", color: "inherit", border: "1px solid var(--border, #dce5e7)", borderRadius: 16, padding: 16, background: "var(--surface, white)" }}><strong style={{ display: "block", marginBottom: 5 }}>{tool.title}</strong><span className="muted">{tool.description}</span></a>)}</div></section>)}
    <section className="stageCard" style={{ marginTop: 18 }}><span className="eyebrow">USER DIRECTORY</span><h2>Unified accounts</h2><p>Username accounts and school/OAuth accounts all resolve to the same Staff Development identity.</p><input className="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, username or department…" style={{ width: "100%", margin: "10px 0" }} /><div style={{ display: "grid", gap: 8 }}>{visibleUsers.slice(0, 50).map(user => <div key={user.user_id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 12, border: "1px solid #e3eaec", borderRadius: 12 }}><div><strong>{user.display_name || "Unnamed user"}</strong><div className="muted">{user.username ? `@${user.username}` : "No username yet"}{user.department ? ` · ${user.department}` : ""}</div></div><span className="stageBadge">{user.platform_role === "admin" ? "platform admin" : "user"}</span></div>)}</div></section>
  </main>;
}
