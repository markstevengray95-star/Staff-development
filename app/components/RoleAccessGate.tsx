"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  STAFF_ROLE_LABELS,
  hasStaffPermission,
  permissionForPath,
  resolveStaffAccess,
} from "@/lib/rolePermissions";

const PUBLIC_PATHS = ["/auth", "/reset-password", "/admin-login", "/owner-login", "/access-denied", "/verify", "/join"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function RoleAccessGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const publicPath = isPublicPath(pathname);
  const requiredPermission = permissionForPath(pathname);
  const [allowed, setAllowed] = useState(publicPath);

  useEffect(() => {
    let active = true;

    if (publicPath) {
      setAllowed(true);
      return () => { active = false; };
    }

    setAllowed(false);
    const client = getSupabaseBrowserClient();

    (async () => {
      const { data: auth, error: authError } = await client.auth.getUser();
      if (authError || !auth.user) {
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/auth?next=${encodeURIComponent(next)}`);
        return;
      }

      try {
        const access = await resolveStaffAccess(client, auth.user);
        if (!active) return;

        const roleLabel = STAFF_ROLE_LABELS[access.role];
        window.localStorage.setItem("staff-development-authorized-role", access.role);
        window.localStorage.setItem("staff-development-authorized-role-label", roleLabel);
        window.localStorage.setItem("staff-development-role", access.role);
        window.localStorage.setItem("staff-development-role-label", roleLabel);

        if (!requiredPermission || hasStaffPermission(access.role, requiredPermission)) {
          setAllowed(true);
          return;
        }

        window.location.replace(
          `/access-denied?from=${encodeURIComponent(pathname)}&required=${encodeURIComponent(requiredPermission)}&role=${encodeURIComponent(access.role)}`,
        );
      } catch (error) {
        console.error("Staff Development role check failed", error);
        if (!active) return;
        window.location.replace(`/access-denied?from=${encodeURIComponent(pathname)}&reason=role-check`);
      }
    })();

    return () => { active = false; };
  }, [pathname, publicPath, requiredPermission]);

  if (publicPath) return <>{children}</>;
  if (!allowed) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f7fb", color: "#172033", fontFamily: "system-ui" }}>
        <div style={{ maxWidth: 520, padding: 32, textAlign: "center" }}>
          <strong style={{ display: "block", fontSize: 22 }}>Checking your school permissions…</strong>
          <p style={{ margin: "8px 0 0", color: "#687286" }}>This area uses your signed-in account role, not the navigation preview.</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
