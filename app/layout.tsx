import type { Metadata } from "next";
import CloudSyncGate from "./components/CloudSyncGate";
import CpdNavigationBridge from "./components/CpdNavigationBridge";
import "./globals.css";

export const metadata: Metadata = {
  title: "Staff Development | Whole-School Learning & Regulation",
  description: "A unified school platform for staff CPD, regulation, interventions, student support and implementation tracking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CpdNavigationBridge />
        <CloudSyncGate>{children}</CloudSyncGate>
      </body>
    </html>
  );
}
