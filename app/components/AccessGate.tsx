"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CloudSyncGate from "./CloudSyncGate";
import RoleAccessGate from "./RoleAccessGate";
import GlobalMainTabs from "./GlobalMainTabs";
import MobilePlatformDock from "./MobilePlatformDock";

export default function AccessGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const adminLogin = pathname === "/admin-login";

  useEffect(() => {
    if (pathname !== "/auth") return;
    const next = new URLSearchParams(window.location.search).get("next");
    if (next === "/admin") window.location.replace("/admin-login");
  }, [pathname]);

  if (adminLogin) return <>{children}</>;
  return (
    <CloudSyncGate>
      <RoleAccessGate>
        <GlobalMainTabs />
        {children}
        <MobilePlatformDock />
      </RoleAccessGate>
    </CloudSyncGate>
  );
}
