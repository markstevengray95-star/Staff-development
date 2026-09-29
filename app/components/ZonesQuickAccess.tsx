"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const tools = [
  { id: "room", label: "Regulation Room", icon: "◇", href: "/regulation-room" },
  { id: "zones-cpd", label: "Zones CPD", icon: "▣", href: "/zones-cpd" },
  { id: "escape", label: "Escape Room", icon: "⌁", href: "/zones-cpd/escape-room" },
  { id: "quest", label: "Zone Quest", icon: "◆", href: "/zone-quest" },
  { id: "students", label: "Student Check-in", icon: "◉", targets: ["Student Support", "Student Check-in"] },
  { id: "interventions", label: "Interventions", icon: "✓", targets: ["Interventions", "Intervention Plans"] },
];

export default function ZonesQuickAccess() {
  const pathname = usePathname();
  const visible = pathname === "/";

  useEffect(() => {
    document.body.classList.toggle("zones-home", visible);
    return () => document.body.classList.remove("zones-home");
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("zone") || window.sessionStorage.getItem("staff-development-open-zone");
    if (!requested) return;
    window.sessionStorage.removeItem("staff-development-open-zone");
    const tool = tools.find((item) => item.id === requested);
    if (!tool || !("targets" in tool) || !tool.targets) return;
    let attempts = 0;
    const openRequested = () => {
      attempts += 1;
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".navButton"));
      const target = buttons.find((button) => tool.targets?.some((name) => (button.textContent || "").toLowerCase().includes(name.toLowerCase())));
      if (target) { target.click(); return; }
      if (attempts < 8) window.setTimeout(openRequested, 120);
    };
    window.setTimeout(openRequested, 80);
  }, [visible]);

  if (!visible) return null;

  function openTool(tool: (typeof tools)[number]) {
    if ("href" in tool && tool.href) { window.location.assign(tool.href); return; }
    if (!("targets" in tool) || !tool.targets) return;
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".navButton"));
    const target = buttons.find((button) => tool.targets?.some((name) => (button.textContent || "").toLowerCase().includes(name.toLowerCase())));
    target?.click();
  }

  return <section className="zonesQuickAccess" aria-label="Zones and regulation tools"><div className="zonesQuickIntro"><a href="/zones" className="zonesQuickIntroLink"><div className="zonesMark" aria-hidden="true"><i/><i/><i/><i/></div><div><strong>Zones & Regulation</strong><span>Full toolkit · every zone is valid</span></div></a></div><nav className="zonesQuickNav">{tools.map(tool=><button key={tool.label} type="button" onClick={()=>openTool(tool)}><span>{tool.icon}</span><strong>{tool.label}</strong></button>)}</nav></section>;
}
