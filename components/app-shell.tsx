"use client";

import Link from "next/link";
import BottomNav from "@/components/bottom-nav";

type HeroVariant = "blue" | "violet" | "emerald" | "amber";

export function AppShell({
  kicker,
  title,
  subtitle,
  variant,
  actions,
  right,
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  variant?: HeroVariant;
  actions?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const variantClass =
    variant === "blue"
      ? "dashboard-summary-card-blue"
      : variant === "violet"
      ? "dashboard-summary-card-violet"
      : variant === "emerald"
      ? "dashboard-summary-card-emerald"
      : variant === "amber"
      ? "dashboard-summary-card-amber"
      : "";

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

          {/* Premium Hero */}
          <section className={`card-surface card-padding dashboard-hero ${variantClass}`}>
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="dashboard-hero-stack">
                {kicker ? <p className="auth-brand-kicker">{kicker}</p> : null}
                <h1 className="dashboard-hero-title">{title}</h1>
                {subtitle ? <p className="dashboard-hero-copy">{subtitle}</p> : null}

                {actions ? <div className="btn-row">{actions}</div> : null}
              </div>

              {right ? <div className="w-full md:w-[320px]">{right}</div> : null}
            </div>
          </section>

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
