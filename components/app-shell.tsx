"use client";

import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="page-shell">
        <div className="page-stack">
          <header className="topbar">
            <div className="topbar-brand">
              <Link href="/" className="topbar-logo">
                The Scholars Edge
              </Link>
            </div>

            <div className="topbar-actions">
              <Link href="/profile" className="btn-ghost">
                Profile
              </Link>
            </div>
          </header>

          <section className="page-header">
            <h1 className="page-title">{title}</h1>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </section>

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
