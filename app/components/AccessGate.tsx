"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CloudSyncGate from "./CloudSyncGate";

export default function AccessGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const adminLogin = pathname === "/admin-login";
  const adminAuthRedirect = pathname === "/auth" && searchParams.get("next") === "/admin";

  useEffect(() => {
    if (adminAuthRedirect) window.location.replace("/admin-login");
  }, [adminAuthRedirect]);

  if (adminLogin) return <>{children}</>;
  if (adminAuthRedirect) {
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui", color: "#173f57" }}>Opening administrator sign-in…</main>;
  }
  return <CloudSyncGate>{children}</CloudSyncGate>;
}
