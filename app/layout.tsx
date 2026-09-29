import type { Metadata } from "next";
import AccessGate from "./components/AccessGate";
import CpdNavigationBridge from "./components/CpdNavigationBridge";
import ZonesQuickAccess from "./components/ZonesQuickAccess";
import ZonesSidebarBridge from "./components/ZonesSidebarBridge";
import "./globals.css";
import "./zones-experience.css";

export const metadata: Metadata = {
  title: "Staff Development | Whole-School Learning & Regulation",
  description: "A unified school platform for staff CPD, regulation, interventions, student support and implementation tracking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CpdNavigationBridge />
        <ZonesQuickAccess />
        <ZonesSidebarBridge />
        <AccessGate>{children}</AccessGate>
      </body>
    </html>
  );
}
