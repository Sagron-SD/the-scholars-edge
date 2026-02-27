"use client";

import Link from "next/link";
import BottomNav from "@/components/bottom-nav";

export function AppShell({
  title,
  subtitle,
  kicker = "Momentum System",
  hideHero = false,
  heroActions,
  children,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  hideHero?: boolean;
  heroActions?: React.ReactNode;
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

          {!hideHero ? (
            <section className="premium-panel premium-panel-padding premium-stack">
              <p className="premium-kicker">{kicker}</p>

              <div className="premium-stack" style={{ gap: 10 }}>
                <h1 className="premium-title">{title}</h1>
                {subtitle ? <p className="premium-copy">{subtitle}</p> : null}
              </div>

              {heroActions ? <div className="btn-row">{heroActions}</div> : null}
            </section>
          ) : null}

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
