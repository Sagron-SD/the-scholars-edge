"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import BottomNav from "@/components/bottom-nav";
import { HeroSection } from "@/components/hero-section";

export function AppShell({
  title,
  subtitle,
  kicker,
  right,
  actions,
  variant = "default",
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  kicker?: string;
  right?: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "blue" | "violet" | "emerald" | "amber";
  children: ReactNode;
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

          <HeroSection
            kicker={kicker}
            title={title}
            subtitle={subtitle}
            right={right}
            actions={actions}
            variant={variant}
          />

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
