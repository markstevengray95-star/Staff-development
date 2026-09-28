"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CpdNavigationBridge() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") return;

    function capture(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const control = target?.closest("button,a") as HTMLElement | null;
      if (!control) return;
      const label = (control.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (!label.includes("cpd academy") && !label.includes("browse cpd") && !label.includes("explore cpd") && !label.includes("open cpd")) return;
      event.preventDefault();
      event.stopPropagation();
      router.push("/cpd");
    }

    document.addEventListener("click", capture, true);
    return () => document.removeEventListener("click", capture, true);
  }, [pathname, router]);

  return null;
}
