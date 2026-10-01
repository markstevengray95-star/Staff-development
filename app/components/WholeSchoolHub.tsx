"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { STAFF_ROLE_LABELS, resolveStaffAccess, type StaffRole } from "@/lib/rolePermissions";
import "./WholeSchoolHub.css";

export type WholeSchoolArea = "teach" | "students" | "develop" | "school" | "resources";
type RoleId = StaffRole;

type ToolCard = {
  title: string;
  description: string;
  href: string;
  icon: string;
  roles?: RoleId[];
  badge?: string;
};

type AreaConfig = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  tools: ToolCard[];
};

const roles: { id: RoleId; label: string }[] = (Object.keys(STAFF_ROLE_LABELS) as RoleId[]).map((id) => ({ id, label: STAFF_ROLE_LABELS[id] }));
const leadershipRoles: RoleId[] = ["hod", "pastoral", "send-eal", "slt", "administrator", "super-admin"];
const seniorRoles: RoleId[] = ["slt", "administrator", "super-admin"];
const teachingRoles: RoleId[] = ["teacher", "tutor", "hod", "pastoral", "send-eal", "slt", "super-admin"];

const areaConfig: Record<WholeSchoolArea, AreaConfig> = {
  teach: {
    eyebrow: "TEACH",
    title: "Teaching & Learning",
    description: "Plan, improve and share classroom practice from one place. Teaching guidance, department work, curriculum planning and resource creation now sit together.",
    accent: "Teaching",
    tools: [
      { title: "Teaching & Learning Hub", description: "Search practical strategies for retrieval, questioning, adaptive teaching, feedback, literacy and more.", href: "/teaching-learning", icon: "◎", roles: teachingRoles, badge: "Phase 31" },
      { title: "Teaching Resource Generator", description: "Create, edit, save and download retrieval tasks, quizzes, worksheets, exit tickets and more.", href: "/resource-generator", icon: "✎", roles: teachingRoles, badge: "Phase 32" },
      { title: "Department Hub", description: "Open notices, resources, assessments, meeting notes, key dates, staff and development work for your department.", href: "/department-hub", icon: "▦", roles: teachingRoles, badge: "Phase 33" },
      { title: "Curriculum Hub", description: "Browse and build curriculum by subject, year group, topic and lesson, with objectives, vocabulary and assessment guidance.", href: "/curriculum", icon: "▤", roles: teachingRoles, badge: "Phase 34" },
      { title: "Teaching & Learning CPD", description: "Open subject-specific and classroom-practice professional learning.", href: "/subject-cpd", icon: "✦", roles: teachingRoles, badge: "Existing" },
      { title: "Department Development", description: "Open the existing CPD plans, actions, learning-walk themes and implementation evidence dashboard.", href: "/departments", icon: "↗", roles: leadershipRoles, badge: "Existing" },
      { title: "Professional Standards", description: "Connect development activity to professional standards and expectations.", href: "/standards", icon: "✓", roles: teachingRoles, badge: "Existing" },
      { title: "Learning Walks", description: "Open the learning-walk and classroom-practice tools already in the platform.", href: "/learning-walks", icon: "◎", roles: leadershipRoles, badge: "Existing" },
      { title: "AI CPD Tutor", description: "Ask for planning, reflection and professional-learning support.", href: "/ai-coach", icon: "✧", roles: teachingRoles, badge: "Existing" },
    ],
  },
  students: {
    eyebrow: "STUDENTS",
    title: "Pastoral, Regulation & Inclusion",
    description: "Tutor-time planning, pastoral support, regulation, behaviour, SEND and EAL guidance now sit together in a clear student-support area.",
    accent: "Student support",
    tools: [
      { title: "Pastoral Hub", description: "Plan tutor time and access assemblies, mentoring, attendance, behaviour, rewards, wellbeing and key pastoral dates.", href: "/pastoral", icon: "◎", badge: "Phase 35" },
      { title: "Regulation & Behaviour", description: "Use one consistent workflow for regulation support, classroom behaviour, restorative response and return to learning.", href: "/regulation-behaviour", icon: "◉", badge: "Phase 36" },
      { title: "SEND & EAL Hub", description: "Find inclusive classroom adaptations, SEND strategies, EAL scaffolds and school-specific inclusion guidance.", href: "/send-eal", icon: "◇", badge: "Phase 37" },
      { title: "Regulation Room", description: "Use the full regulation-room experience and practical regulation activities.", href: "/regulation-room", icon: "◇", badge: "Existing" },
      { title: "Zones Practice", description: "Open the interactive Zones practice area for staff and student support.", href: "/zones", icon: "◆", badge: "Existing" },
      { title: "Zone Quest", description: "Use the existing interactive regulation game and scenario experience.", href: "/zone-quest", icon: "◈", badge: "Existing" },
      { title: "Whole-school Regulation", description: "Open school-level regulation implementation and support tools.", href: "/zones-school", icon: "◉", roles: leadershipRoles, badge: "Existing" },
      { title: "Zones CPD", description: "Open the specialist regulation CPD area from within Student support.", href: "/zones-cpd", icon: "▣", roles: teachingRoles, badge: "Existing" },
    ],
  },
  develop: {
    eyebrow: "DEVELOP",
    title: "Professional Development",
    description: "All existing CPD remains here. Development now sits as one part of the wider staff platform rather than being the whole website.",
    accent: "Professional growth",
    tools: [
      { title: "CPD Academy", description: "Browse and complete the full existing course library.", href: "/cpd", icon: "▣", badge: "Core" },
      { title: "Micro CPD", description: "Open shorter refresher learning and focused professional development.", href: "/micro-cpd", icon: "◫", badge: "Existing" },
      { title: "Personal Pathway", description: "Follow personalised development routes and recommended learning.", href: "/pathways/personal", icon: "↗", badge: "Existing" },
      { title: "Professional Portfolio", description: "Keep development evidence, achievements and professional records together.", href: "/portfolio", icon: "▤", badge: "Existing" },
      { title: "Coaching", description: "Open coaching and professional-conversation tools.", href: "/coaching", icon: "◎", badge: "Existing" },
      { title: "Appraisal", description: "Open the existing appraisal workflow and objectives area.", href: "/appraisal", icon: "✓", badge: "Existing" },
      { title: "Compliance", description: "Open mandatory and compliance training records.", href: "/compliance", icon: "◉", roles: leadershipRoles, badge: "Existing" },
      { title: "AI CPD Tutor", description: "Ask, plan and reflect with the existing professional-learning assistant.", href: "/ai-coach", icon: "✧", badge: "Existing" },
    ],
  },
  school: {
    eyebrow: "SCHOOL",
    title: "Whole-school Operations",
    description: "A single home for leadership, departments, improvement, induction and organisation-level tools.",
    accent: "School systems",
    tools: [
      { title: "School Hub", description: "Open the existing whole-school development and organisation area.", href: "/school-hub", icon: "⌂", roles: leadershipRoles, badge: "Existing" },
      { title: "Department Hubs", description: "Open operational department spaces and switch between departments where your role allows it.", href: "/department-hub", icon: "▦", roles: leadershipRoles, badge: "Phase 33" },
      { title: "Curriculum Hub", description: "Review curriculum structure across subjects and year groups.", href: "/curriculum", icon: "▤", roles: leadershipRoles, badge: "Phase 34" },
      { title: "Pastoral Hub", description: "Review tutor-time resources, pastoral priorities and school-wide student-support content.", href: "/pastoral", icon: "◎", roles: leadershipRoles, badge: "Phase 35" },
      { title: "Regulation & Behaviour", description: "Manage the shared school playbook for behaviour routines, regulation and restorative response.", href: "/regulation-behaviour", icon: "◉", roles: leadershipRoles, badge: "Phase 36" },
      { title: "SEND & EAL Hub", description: "Manage school-wide inclusion strategies, language scaffolds and practical staff guidance.", href: "/send-eal", icon: "◇", roles: leadershipRoles, badge: "Phase 37" },
      { title: "School Improvement", description: "Open improvement planning and implementation tools.", href: "/improvement", icon: "↗", roles: leadershipRoles, badge: "Existing" },
      { title: "Staff Induction", description: "Support new staff through the existing induction workflow.", href: "/induction", icon: "✦", roles: leadershipRoles, badge: "Existing" },
      { title: "Compliance Centre", description: "Review mandatory training and compliance activity.", href: "/compliance", icon: "✓", roles: leadershipRoles, badge: "Existing" },
      { title: "Organisation", description: "Open organisation-level configuration and school-wide management tools.", href: "/organisation", icon: "◫", roles: seniorRoles, badge: "Existing" },
      { title: "Platform Administration", description: "Open unrestricted platform administration for the Super Admin account.", href: "/admin", icon: "⚙", roles: ["super-admin"], badge: "Restricted" },
    ],
  },
  resources: {
    eyebrow: "RESOURCES",
    title: "Resources & Knowledge",
    description: "A clear home for searchable guidance, documents, course packs and policy-related material.",
    accent: "Find what you need",
    tools: [
      { title: "My Teaching Resources", description: "Open your private library of generated and edited classroom resources.", href: "/resource-generator", icon: "✎", roles: teachingRoles, badge: "New" },
      { title: "Curriculum Resources", description: "Open curriculum units, lesson sequences, objectives, vocabulary and assessment guidance.", href: "/curriculum", icon: "▤", roles: teachingRoles, badge: "New" },
      { title: "Pastoral Resources", description: "Open tutor-time, mentoring, wellbeing, attendance, behaviour and reward resources.", href: "/pastoral", icon: "◎", badge: "New" },
      { title: "Regulation & Behaviour Playbook", description: "Open the shared behaviour, regulation, restorative and return-to-learning guidance.", href: "/regulation-behaviour", icon: "◉", badge: "New" },
      { title: "SEND & EAL Resources", description: "Search inclusive teaching, SEND adaptations, EAL language scaffolds and school inclusion guidance.", href: "/send-eal", icon: "◇", badge: "New" },
      { title: "Knowledge Base", description: "Search the existing school knowledge and guidance area.", href: "/knowledge-base", icon: "⌕", badge: "Existing" },
      { title: "Safeguarding Documents", description: "Open safeguarding documents and supporting materials.", href: "/safeguarding/documents", icon: "▤", badge: "Existing" },
      { title: "Course Packs", description: "Open reusable CPD and facilitator packs.", href: "/course-packs", icon: "▣", roles: teachingRoles, badge: "Existing" },
      { title: "Policy Training", description: "Use policy-linked training and professional-learning content.", href: "/policy-training", icon: "✓", badge: "Existing" },
      { title: "Safeguarding", description: "Open safeguarding learning and guidance.", href: "/safeguarding", icon: "◇", badge: "Existing" },
    ],
  },
};

const topNav: { id: "home" | WholeSchoolArea; label: string; href: string; icon: string }[] = [
  { id: "home", label: "Home", href: "/dashboard", icon: "⌂" },
  { id: "teach", label: "Teach", href: "/teach", icon: "✦" },
  { id: "students", label: "Students", href: "/students", icon: "◉" },
  { id: "develop", label: "Develop", href: "/develop", icon: "↗" },
  { id: "school", label: "School", href: "/school", icon: "▦" },
  { id: "resources", label: "Resources", href: "/resources", icon: "▤" },
];

function roleCanSee(role: RoleId, card: ToolCard) {
  if (!card.roles || card.roles.length === 0) return true;
  if (role === "super-admin") return true;
  return card.roles.includes(role);
}

export default function WholeSchoolHub({ area }: { area: WholeSchoolArea }) {
  const [role, setRole] = useState<RoleId>("teacher");
  const [authorizedRole, setAuthorizedRole] = useState<RoleId | null>(null);
  const config = areaConfig[area];

  useEffect(() => {
    let mounted = true;
    (async () => {
      const client = getSupabaseBrowserClient();
      const { data } = await client.auth.getUser();
      if (!data.user) return;
      const access = await resolveStaffAccess(client, data.user);
      if (!mounted) return;
      setAuthorizedRole(access.role);
      setRole(access.role);
      window.localStorage.setItem("staff-development-authorized-role", access.role);
      window.localStorage.setItem("staff-development-authorized-role-label", STAFF_ROLE_LABELS[access.role]);
    })().catch((error) => console.error("Could not resolve whole-school role", error));
    return () => { mounted = false; };
  }, []);

  const canPreview = authorizedRole === "super-admin";
  const visibleTools = useMemo(() => config.tools.filter((tool) => roleCanSee(role, tool)), [config.tools, role]);
  const roleLabel = STAFF_ROLE_LABELS[role];

  function changeRole(nextRole: RoleId) {
    if (!canPreview) return;
    setRole(nextRole);
  }

  return (
    <main className="wholeSchoolHub">
      <header className="wholeSchoolHeader">
        <Link href="/dashboard" className="wholeSchoolBrand" aria-label="Staff Development home">
          <span className="wholeSchoolBrandMark">SD</span>
          <span><strong>Staff Development</strong><small>Whole-school staff platform</small></span>
        </Link>

        <nav className="wholeSchoolTopNav" aria-label="Whole-school areas">
          {topNav.map((item) => (
            <Link key={item.id} href={item.href} className={item.id === area ? "active" : ""}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>

        <div className="wholeSchoolRole">
          {canPreview ? (
            <>
              <span>Preview as</span>
              <select value={role} onChange={(event) => changeRole(event.target.value as RoleId)}>
                {roles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </>
          ) : (
            <><span>Your role</span><strong>{authorizedRole ? STAFF_ROLE_LABELS[authorizedRole] : "Checking…"}</strong></>
          )}
        </div>
      </header>

      <section className="wholeSchoolHero">
        <div>
          <span className="wholeSchoolEyebrow">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
          <div className="wholeSchoolHeroMeta">
            <span>{config.accent}</span>
            <span>{visibleTools.length} tools for {roleLabel}</span>
          </div>
        </div>
        <div className="wholeSchoolHeroCard">
          <span>PHASES 35–37</span>
          <strong>Pastoral, regulation & inclusion</strong>
          <p>Pastoral planning, regulation and behaviour guidance now connect directly to a practical SEND and EAL inclusion workspace.</p>
        </div>
      </section>

      <section className="wholeSchoolSectionHeading">
        <div>
          <span>{canPreview ? "ADMIN PREVIEW" : "YOUR ACCESS"}</span>
          <h2>{roleLabel} tools</h2>
        </div>
        <p>{canPreview ? "Previewing changes what the super admin sees here; it never changes the account’s real permissions." : "Your signed-in school role controls this view. Direct access to restricted pages is checked separately."}</p>
      </section>

      <section className="wholeSchoolToolGrid">
        {visibleTools.map((tool) => (
          <Link key={`${tool.title}-${tool.href}`} href={tool.href} className="wholeSchoolToolCard">
            <div className="wholeSchoolToolIcon">{tool.icon}</div>
            <div className="wholeSchoolToolCopy">
              <div className="wholeSchoolToolTitleRow">
                <h3>{tool.title}</h3>
                {tool.badge && <span>{tool.badge}</span>}
              </div>
              <p>{tool.description}</p>
              <strong>Open tool →</strong>
            </div>
          </Link>
        ))}
      </section>

      {visibleTools.length === 0 && (
        <section className="wholeSchoolEmpty">
          <strong>No tools are assigned to this role in this area yet.</strong>
          <p>Choose another whole-school area above.</p>
        </section>
      )}
    </main>
  );
}
