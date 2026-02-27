"use client";

import Link from "next/link";
import BottomNav from "@/components/bottom-nav";

type HeroVariant = "blue" | "violet" | "emerald" | "amber" | "neutral";

export function AppShell({
  title,
  subtitle,
  kicker,
  variant = "blue",
  actions,
  right,
  hideHero = false,
  children,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  variant?: HeroVariant;
  actions?: React.ReactNode;
  right?: React.ReactNode;
  hideHero?: boolean;
  children: React.ReactNode;
}) {
  const heroClass =
    variant === "violet"
      ? "dashboard-summary-card-violet"
      : variant === "emerald"
        ? "dashboard-summary-card-emerald"
        : variant === "amber"
          ? "dashboard-summary-card-amber"
          : variant === "neutral"
            ? ""
            : "dashboard-summary-card-blue";

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

          {/* HERO (premium) */}
          {!hideHero ? (
            <section className={`card-surface card-padding dashboard-hero ${heroClass}`}>
              <div className="dashboard-hero-stack">
                {kicker ? <p className="premium-kicker">{kicker}</p> : null}

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <h1 className="dashboard-hero-title">{title}</h1>
                    {subtitle ? <p className="dashboard-hero-copy">{subtitle}</p> : null}
                  </div>

                  {right ? <div className="shrink-0">{right}</div> : null}
                </div>

                {actions ? <div className="btn-row">{actions}</div> : null}
              </div>
            </section>
          ) : (
            // fallback classic header (keeps old spacing if you ever want no hero)
            <section className="page-header">
              <h1 className="page-title">{title}</h1>
              {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
            </section>
          )}

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
