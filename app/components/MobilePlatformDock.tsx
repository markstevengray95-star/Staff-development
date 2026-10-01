"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./MobilePlatformDock.css";

const hiddenPrefixes = ["/auth", "/reset-password", "/admin-login", "/owner-login", "/verify", "/join", "/access-denied"];
const items = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/school", label: "School", icon: "▦" },
  { href: "/search", label: "Search", icon: "⌕" },
  { href: "/notifications", label: "Alerts", icon: "◉" },
  { href: "/resources", label: "More", icon: "▤" },
];

export default function MobilePlatformDock() {
  const pathname = usePathname();
  if (hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;
  return <nav className="mobilePlatformDock" aria-label="Mobile whole-school navigation">
    {items.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return <Link key={item.href} href={item.href} className={active ? "active" : ""}><span>{item.icon}</span><small>{item.label}</small></Link>;
    })}
  </nav>;
}
