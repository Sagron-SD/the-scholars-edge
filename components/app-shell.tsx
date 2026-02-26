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
          <header className="space-y-2">
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </header>

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
