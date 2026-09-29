import type { ReactNode } from "react";
import "../zones-suite.css";

export default function ZonesSuiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="zsShell">
      <header className="zsTopbar">
        <a className="zsBrand" href="/zones"><span className="zsDots"><i/><i/><i/><i/></span><span><strong>Zones & Regulation</strong><small>Staff Development</small></span></a>
        <nav className="zsNav" aria-label="Zones suite navigation">
          <a href="/zones">Overview</a>
          <a href="/regulation-room">Regulation Room</a>
          <a href="/zones-cpd">Zones CPD</a>
          <a href="/zones-cpd/escape-room">Escape Room</a>
          <a href="/zone-quest">Zone Quest</a>
          <a href="/">Main platform</a>
        </nav>
      </header>
      {children}
    </div>
  );
}
