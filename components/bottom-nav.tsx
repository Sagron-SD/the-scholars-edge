"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/progress", label: "Progress" },
  { href: "/study", label: "Study" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-link ${active ? "bottom-nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
