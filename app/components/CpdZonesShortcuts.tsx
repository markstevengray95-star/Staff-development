"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const links = [
  { id: "regulation", label: "Regulation Room", icon: "◇" },
  { id: "students", label: "Student Check-in", icon: "◉" },
  { id: "practice", label: "Scenario Practice", icon: "◆" },
  { id: "interventions", label: "Intervention Plans", icon: "✓" },
] as const;

export default function CpdZonesShortcuts() {
  const pathname = usePathname();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/cpd") {
      setTarget(null);
      return;
    }

    const findTarget = () => {
      const sidebar = document.querySelector<HTMLElement>("#main-content .sidebar");
      if (sidebar) setTarget(sidebar);
      return Boolean(sidebar);
    };

    if (findTarget()) return;
    const observer = new MutationObserver(() => {
      if (findTarget()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  if (!target || pathname !== "/cpd") return null;

  function openZone(id: string) {
    window.sessionStorage.setItem("staff-development-open-zone", id);
    window.location.href = "/";
  }

  return createPortal(
    <section className="cpdZonesShortcuts" aria-label="Zones and regulation shortcuts">
      <div className="cpdZonesHeading">
        <span className="cpdZonesDots" aria-hidden="true"><i /><i /><i /><i /></span>
        <div><strong>Zones & Regulation</strong><small>Apply learning straight away</small></div>
      </div>
      <div className="cpdZonesLinks">
        {links.map((link) => (
          <button key={link.id} type="button" onClick={() => openZone(link.id)}>
            <span>{link.icon}</span>{link.label}
          </button>
        ))}
      </div>
    </section>,
    target,
  );
}
