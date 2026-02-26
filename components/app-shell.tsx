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
    <div className="min-h-screen pb-20">
      <header className="px-4 pt-6 pb-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? <p className="text-zinc-400 mt-1">{subtitle}</p> : null}
      </header>

      <main className="px-4 max-w-4xl mx-auto space-y-5">{children}</main>

      <BottomNav />
    </div>
  );
}
