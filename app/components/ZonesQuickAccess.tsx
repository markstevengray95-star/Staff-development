"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const tools = [
  { id: "regulation", label: "Regulation Room", icon: "◇", targets: ["Regulation Hub", "Regulation Room"] },
  { id: "students", label: "Student Check-in", icon: "◉", targets: ["Student Support", "Student Check-in"] },
  { id: "practice", label: "Scenario Practice", icon: "◆", targets: ["Zones Practice", "Scenario Practice"] },
  { id: "interventions", label: "Intervention Plans", icon: "✓", targets: ["Interventions", "Intervention Plans"] },
  { id: "staff", label: "Staff & Impact", icon: "▦", targets: ["Staff Dashboard", "Impact Hub"] },
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
    const requested = window.sessionStorage.getItem("staff-development-open-zone");
    if (!requested) return;
    window.sessionStorage.removeItem("staff-development-open-zone");
    const tool = tools.find((item) => item.id === requested);
    if (!tool) return;

    let attempts = 0;
    const openRequested = () => {
      attempts += 1;
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".navButton"));
      const target = buttons.find((button) => tool.targets.some((name) => (button.textContent || "").toLowerCase().includes(name.toLowerCase())));
      if (target) {
        target.click();
        return;
      }
      if (attempts < 8) window.setTimeout(openRequested, 120);
    };
    window.setTimeout(openRequested, 80);
  }, [visible]);

  if (!visible) return null;

  function openTool(targets: string[]) {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".navButton"));
    const target = buttons.find((button) => targets.some((name) => (button.textContent || "").toLowerCase().includes(name.toLowerCase())));
    target?.click();
  }

  return (
    <section className="zonesQuickAccess" aria-label="Zones and regulation tools">
      <div className="zonesQuickIntro">
        <div className="zonesMark" aria-hidden="true"><i /><i /><i /><i /></div>
        <div><strong>Zones & Regulation</strong><span>Every zone is valid · choose the support that helps</span></div>
      </div>
      <nav className="zonesQuickNav">
        {tools.map((tool) => (
          <button key={tool.label} type="button" onClick={() => openTool(tool.targets)}>
            <span>{tool.icon}</span><strong>{tool.label}</strong>
          </button>
        ))}
      </nav>
    </section>
  );
}
