"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const zoneLinks = [
  { label: "Regulation Room", helper: "Calm, reset and regulation tools", icon: "◇", targets: ["Regulation Hub", "Regulation Room"] },
  { label: "Student Check-in", helper: "Record how a pupil is feeling", icon: "◉", targets: ["Student Support", "Student Check-in"] },
  { label: "Scenario Practice", helper: "Practise recognising and responding", icon: "◆", targets: ["Zones Practice", "Scenario Practice"] },
  { label: "Intervention Plans", helper: "Structured regulation support", icon: "✓", targets: ["Interventions", "Intervention Plans"] },
] as const;

export default function ZonesSidebarBridge() {
  const pathname = usePathname();
  const [sidebar, setSidebar] = useState<HTMLElement | null>(null);
  const [activeLabel, setActiveLabel] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setSidebar(null);
      return;
    }

    let observer: MutationObserver | null = null;

    const attach = () => {
      const element = document.querySelector<HTMLElement>(".sidebar");
      if (!element) return false;
      setSidebar(element);

      const syncActive = () => {
        const active = element.querySelector<HTMLButtonElement>(".navButton.active");
        setActiveLabel((active?.textContent || "").replace(/\s+/g, " ").trim().toLowerCase());
      };

      syncActive();
      observer = new MutationObserver(syncActive);
      observer.observe(element, { subtree: true, attributes: true, attributeFilter: ["class"] });
      return true;
    };

    if (!attach()) {
      const bodyObserver = new MutationObserver(() => {
        if (attach()) bodyObserver.disconnect();
      });
      bodyObserver.observe(document.body, { childList: true, subtree: true });
      return () => {
        bodyObserver.disconnect();
        observer?.disconnect();
      };
    }

    return () => observer?.disconnect();
  }, [pathname]);

  if (!sidebar || pathname !== "/") return null;

  const openTool = (targets: readonly string[]) => {
    const buttons = Array.from(sidebar.querySelectorAll<HTMLButtonElement>(".navButton"));
    const target = buttons.find((button) => targets.some((name) => (button.textContent || "").toLowerCase().includes(name.toLowerCase())));
    target?.click();
  };

  return createPortal(
    <section className="zonesSidebarGroup" aria-label="Zones and regulation navigation">
      <div className="zonesSidebarHeading">
        <div className="zonesSidebarDots" aria-hidden="true"><i /><i /><i /><i /></div>
        <div><strong>Zones & Regulation</strong><span>Quick access</span></div>
      </div>
      <div className="zonesSidebarLinks">
        {zoneLinks.map((item) => {
          const active = item.targets.some((target) => activeLabel.includes(target.toLowerCase()));
          return (
            <button key={item.label} type="button" className={active ? "active" : ""} onClick={() => openTool(item.targets)}>
              <span className="zonesSidebarIcon">{item.icon}</span>
              <span className="zonesSidebarCopy"><strong>{item.label}</strong><small>{item.helper}</small></span>
            </button>
          );
        })}
      </div>
    </section>,
    sidebar,
  );
}
