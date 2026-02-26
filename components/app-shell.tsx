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
          <header className="page-header">
            <h1 className="page-title">{title}</h1>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </header>

          {children}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
