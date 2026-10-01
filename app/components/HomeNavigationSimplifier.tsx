"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const legacyTools = [
  ["Interventions", "✓"],
  ["Live Activities", "◫"],
  ["Staff Dashboard", "▦"],
  ["Plans & Access", "✦"],
] as const;

const wholeSchoolAreas = [
  ["/dashboard", "Home", "⌂", "Your staff dashboard"],
  ["/teach", "Teach", "✦", "Teaching & learning"],
  ["/students", "Students", "◉", "Pastoral & inclusion"],
  ["/develop", "Develop", "↗", "CPD & professional growth"],
  ["/school", "School", "▦", "Whole-school systems"],
  ["/resources", "Resources", "▤", "Knowledge & documents"],
] as const;

const roles = [
  "Teacher",
  "Tutor",
  "Head of Department",
  "Pastoral Lead",
  "SEND / EAL",
  "SLT",
  "Administrator",
  "Support Staff",
  "Super Admin",
] as const;

function clean(value: string | null | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

export default function HomeNavigationSimplifier() {
  const pathname = usePathname();
  const [sidebar, setSidebar] = useState<HTMLElement | null>(null);
  const [role, setRole] = useState("Teacher");

  useEffect(() => {
    if (pathname !== "/") {
      setSidebar(null);
      return;
    }
    setSidebar(document.querySelector<HTMLElement>(".sidebar"));
    setRole(window.localStorage.getItem("staff-development-role-label") || "Teacher");
  }, [pathname]);

  useEffect(() => {
    if (!sidebar) return;
    const apply = () => {
      sidebar.querySelectorAll<HTMLElement>(".sidebarSection").forEach((section) => section.classList.add("navSectionHidden"));
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(sidebar, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, [sidebar]);

  if (!sidebar) return null;

  const openLegacyView = (label: string) => {
    const button = [...sidebar.querySelectorAll<HTMLButtonElement>(".navButton")].find((item) => clean(item.textContent) === label);
    button?.click();
  };

  const updateRole = (nextRole: string) => {
    setRole(nextRole);
    window.localStorage.setItem("staff-development-role-label", nextRole);
    const roleIdMap: Record<string, string> = {
      Teacher: "teacher",
      Tutor: "tutor",
      "Head of Department": "hod",
      "Pastoral Lead": "pastoral",
      "SEND / EAL": "send-eal",
      SLT: "slt",
      Administrator: "administrator",
      "Support Staff": "support",
      "Super Admin": "super-admin",
    };
    window.localStorage.setItem("staff-development-role", roleIdMap[nextRole] || "teacher");
  };

  return <>
    {createPortal(
      <nav className="wholeSchoolSidebar" aria-label="Whole-school navigation">
        <span className="wholeSchoolSidebarLabel">WHOLE-SCHOOL HUB</span>
        {wholeSchoolAreas.map(([href, label, icon, description]) => (
          <a key={href} href={href}>
            <span className="wholeSchoolSidebarIcon">{icon}</span>
            <span><strong>{label}</strong><small>{description}</small></span>
          </a>
        ))}
      </nav>,
      sidebar,
    )}

    {createPortal(
      <label className="sidebarRolePreview">
        <span>VIEW AS</span>
        <select value={role} onChange={(event) => updateRole(event.target.value)}>
          {roles.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>,
      sidebar,
    )}

    {createPortal(
      <details className="sidebarMoreTools">
        <summary><span>•••</span><div><strong>Existing tools</strong><small>Specialist views kept available</small></div></summary>
        <div className="sidebarMorePanel">
          {legacyTools.map(([label, icon]) => <button key={label} type="button" onClick={() => openLegacyView(label)}><span>{icon}</span>{label}</button>)}
          <a className="sidebarExistingLink" href="/ai-coach"><span>✧</span>AI CPD Tutor</a>
          <a className="sidebarExistingLink" href="/regulation-room"><span>◇</span>Regulation Room</a>
        </div>
      </details>,
      sidebar,
    )}
  </>;
}
