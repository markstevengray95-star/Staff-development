"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * The historical root page contains several legacy navigation systems.
 * The personalised dashboard is now the canonical home, so root visits are
 * sent there instead of exposing duplicate sidebars and role-preview controls.
 */
export default function HomeNavigationSimplifier() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") router.replace("/dashboard");
  }, [pathname, router]);

  return null;
}
